/**
 * Car physics. Pure numbers, no Three.js, so the tyre model can be unit tested
 * against real-world reference figures.
 *
 * The model is a single-track (bicycle) approximation with load transfer:
 *
 *   front slip angle   af = atan2(vLat + yawRate * a, vLong) - steer
 *   rear slip angle    ar = atan2(vLat - yawRate * b, vLong)
 *   lateral force      Fy = -mu * Fz * magicFormula(slip)
 *
 * Vertical load per axle is the static weight distribution plus longitudinal
 * load transfer, and both axles also gain downforce with the square of speed.
 * That combination is what produces understeer on entry, progressive oversteer
 * when the rear steps out, and the fact that a slow corner can be taken flat but
 * a fast one cannot.
 */

import { clamp, damp, lerp, magicFormula } from '../util/math.js';
import { getCompound } from './compounds.js';

export const GRAVITY = 9.81;

/**
 * Car dimensions, mass and aerodynamics.
 *
 * `dragArea` is Cd*A and `downforceArea` is Cl*A, both combined coefficients in
 * square metres rather than a dimensionless Cd. A modern ground-effect F1 car
 * runs roughly 1.0 m^2 of drag and 6-7 m^2 of lift, which is what allows it to
 * pull ~5g in a fast corner and brake from 300 km/h in about 250m.
 */
export const DEFAULT_GEOMETRY = {
  mass: 795,
  /** Yaw inertia as a fraction of mass * wheelbase^2. */
  inertiaFactor: 0.44,
  wheelBase: 3.6,
  centreOfMassToFront: 1.85,
  centreOfMassHeight: 0.31,
  // Real 2020s F1: ~1.0 m^2 drag, ~7 m^2 of downforce, ~350 km/h with DRS.
  dragArea: 0.95,
  downforceArea: 7.4
};

/**
 * Pacejka-shaped lateral curve. Stiffness is high because an F1 car generates
 * tyre load very quickly and has to respond inside a tenth of a second.
 */
export const TYRE = {
  frontStiffness: 12.5,
  rearStiffness: 13.5,
  frontShape: 1.42,
  rearShape: 1.44,
  /** Peak friction coefficient, reached at the optimum slip angle. */
  peakGrip: 1.62,
  /** Tyre temperature window over which grip is at its maximum. */
  optimalTemp: 95,
  optimalBand: 45,
  /** Grip lost per degree once the tyres are outside that window. */
  falloffPerDegree: 0.0022,
  /** Never fall below this fraction of cold grip, however cooked the tyre is. */
  worstCaseGrip: 0.72
};

export const POWERTRAIN = {
  peakTorque: 380,
  peakTorqueRpm: 10800,
  idleRpm: 4200,
  revLimit: 15200,
  shiftUpRpm: 14500,
  shiftDownRpm: 8200,
  shiftTime: 0.05,
  // The ladder is derived from the gearing equation
  //   ratio = rpm * circumference / (v * 60)
  // anchored at both ends: first gear is geared to pull ~14k rpm at 100 km/h,
  // and top gear reaches the limiter at terminal velocity. Ratios between the
  // anchors are geometric, which is how a real gearbox is spaced.
  // Getting this wrong is easy and total: too short a first gear means the
  // car never reaches its upshift point and is permanently stuck in one.
  gearRatios: [5.58, 4.744, 4.033, 3.429, 2.915, 2.478, 2.107, 1.791],
  finalDrive: 3.4,
  /** Engine braking when off throttle, as a fraction of drive torque. */
  engineBrake: 0.09,
  drsDragReduction: 0.42,
  /** Approximate rolling diameter of a slick (720mm). */
  wheelDiameter: 0.72
};

export const BRAKES = {
  /**
   * Total brake force at the wheels in newtons, not torque. F1 cars decelerate
   * at roughly 5g, so 795kg * 9.81 * 5 is about 39kN.
   */
  maxBrakeForce: 40000,
  brakeBiasFront: 0.63
};

/*
 * How worn a tyre costs grip, and where it falls off the cliff.
 *
 * `wear` is a fraction of peak grip lost, which is how `compounds.js` documents
 * `wearRate` ("fraction of peak per lap"), so the linear term is simply `1 - wear`.
 *
 * A linear fade alone never produces the decision F1 is actually about, so past
 * `TYRE_CLIFF_START` a tyre loses grip faster than linearly -- that is what "it is gone"
 * means. `TYRE_GRIP_FLOOR` keeps a destroyed tyre slow rather than undriveable.
 */
const TYRE_WEAR_LOSS = 1.0;
const TYRE_CLIFF_START = 0.18;
const TYRE_CLIFF_GAIN = 0.45;
const TYRE_GRIP_FLOOR = 0.45;

/** Degrees of tyre temperature per m/s of road speed, and per unit of lateral work. */
/** Temperature a fresh set of tyres comes off the pit wall at. */
const PIT_TYRE_START_TEMP = 68;

/** Fallback lap length in metres, when a circuit estimate is not supplied. */
const DEFAULT_LAP_METRES = 5400;

const TYRE_SPEED_HEAT = 1.1;
const TYRE_LATERAL_HEAT = 0.0018;

/** Fallback lap length, in seconds, when no circuit estimate is supplied. */
const DEFAULT_LAP_SECONDS = 90;

const WHEEL_CIRCUMFERENCE = Math.PI * POWERTRAIN.wheelDiameter;
const WHEEL_RADIUS = POWERTRAIN.wheelDiameter / 2;

/**
 * Reverse is a single very short ratio, capped separately from the gearbox.
 *
 * Reverse exists only to let a car that has spun or beached itself get moving
 * again, so it is feeble and strictly speed-limited. It must never be usable as a
 * driving mode: an AI that decides to reverse and keeps reversing will drive
 * quietly off the circuit and never come back.
 */
const REVERSE_RATIO = 1.2;
const REVERSE_FORCE = 2000;
/** Above this speed reverse disengages, as the selector would on a real car. */
export const REVERSE_LIMIT = 6;
/** How long the brake must be held at a standstill before reverse engages. */
export const REVERSE_ENGAGE_HOLD = 0.45;

/**
 * Thrust at the contact patch from engine torque.
 *
 * `torque * ratio` is the wheel torque, and thrust is that divided by the wheel
 * *radius*. Dividing by the circumference instead silently costs a factor of
 * 2*PI, which leaves the car gutless and capped around 190 km/h no matter how
 * the engine is tuned.
 */
function thrustFromTorque(engineTorque, gearRatio) {
  return (engineTorque * gearRatio) / WHEEL_RADIUS;
}

/**
 * Normalised torque curve across the rev range. F1 engines are flat and wide,
 * so this holds a plateau from roughly 60% of the rev range to the limiter
 * rather than peaking sharply.
 */
export function torqueFactor(rpm) {
  const { peakTorqueRpm, idleRpm, revLimit } = POWERTRAIN;
  const riseStart = idleRpm * 0.8;
  if (rpm < riseStart) return lerp(0.3, 0.55, clamp((rpm / riseStart) * 1.4, 0, 1));
  if (rpm < peakTorqueRpm) {
    return lerp(0.55, 1.0, (rpm - riseStart) / (peakTorqueRpm - riseStart));
  }
  // Gentle fall to the limiter, never a cliff.
  return lerp(1.0, 0.82, clamp((rpm - peakTorqueRpm) / (revLimit - peakTorqueRpm), 0, 1));
}

/** Gearbox state implied by a road speed: the index a driver would be in. */
export function gearForSpeed(speed) {
  for (let gear = 0; gear < POWERTRAIN.gearRatios.length; gear += 1) {
    const ratio = POWERTRAIN.gearRatios[gear] * POWERTRAIN.finalDrive;
    const rpm = (Math.abs(speed) / WHEEL_CIRCUMFERENCE) * ratio * 60;
    if (rpm < POWERTRAIN.shiftUpRpm) return gear;
  }
  return POWERTRAIN.gearRatios.length - 1;
}

/** Theoretical maximum speed in m/s from power against drag. */
export function topSpeed(mass = DEFAULT_GEOMETRY.mass, dragArea = DEFAULT_GEOMETRY.dragArea) {
  // Wheel power from peak torque and rpm, allowing for drivetrain losses.
  const power = (POWERTRAIN.peakTorque * POWERTRAIN.peakTorqueRpm * (2 * Math.PI)) / 60 * 0.92;
  return Math.cbrt((2 * power) / (1.2 * dragArea));
}

/**
 * Grip multiplier for a tyre at a given temperature: flat at 1.0 across the
 * working window, decaying outside it.
 */
export function temperatureGrip(temp, optimalBand = TYRE.optimalBand) {
  const over = Math.max(0, Math.abs(temp - TYRE.optimalTemp) - optimalBand);
  return clamp(1 - over * TYRE.falloffPerDegree, TYRE.worstCaseGrip, 1);
}

/**
 * Grip remaining on a worn tyre, from 0 (fresh) to 1 (destroyed).
 *
 * Linear to the cliff, then faster. Exported because the tyre model is only
 * interesting if it can be plotted, and a plot is the only way to check that a soft
 * actually crosses below a hard somewhere in the second lap.
 */
export function wearGrip(wear) {
  const linear = 1 - wear * TYRE_WEAR_LOSS;
  const past = clamp((wear - TYRE_CLIFF_START) / (1 - TYRE_CLIFF_START), 0, 1);
  const cliff = 1 - past * TYRE_CLIFF_GAIN;
  return clamp(linear * cliff, TYRE_GRIP_FLOOR, 1);
}

/** One tyre temperature step: heats towards equilibrium, cools towards ambient. */
function stepTemperature(current, equilibrium, ambient, dt) {
  const heating = clamp(dt * 0.9, 0, 1);
  return current + (equilibrium - current) * heating - (current - ambient) * 0.0016 * dt;
}

/**
 * A single car: tyre temperatures, gearbox, ERS and one fixed timestep of
 * integration. The player and every AI use this same class, so no handling
 * behaviour is privileged to the human driver.
 */
export class CarPhysics {
  constructor(setup = {}, options = {}) {
    this.geometry = { ...DEFAULT_GEOMETRY, ...(setup.geometry ?? {}) };
    this.grip = setup.grip ?? 1;
    this.powerScale = setup.powerScale ?? 1;
    this.drsStrength = setup.drsStrength ?? 1;
    this.ersStrength = setup.ersStrength ?? 1;
    /*
     * Per-car overrides for the four tunables that `applyUpgrades` computes.
     *
     * These were returned by `applyUpgrades` and then read by nothing: CarPhysics used
     * the module constants directly, so the Aerodynamics, Brakes and Tyre upgrade tiers
     * changed a number that no code path ever looked at. Four of the six purchasable
     * upgrades were therefore inert -- the player spent development points and the car
     * did not change.
     */
    this.peakGrip = setup.peakGrip ?? TYRE.peakGrip;
    this.optimalBand = setup.optimalBand ?? TYRE.optimalBand;

    /*
     * The compound.
     *
     * `compounds.js` has always carried real per-compound grip, wear rate, operating
     * window and warm-up, and none of it reached the car: `getCompound` was imported by
     * `RaceSession` and never called, and the one exported function that did apply
     * `compound.grip` was called from the setup screen to print a label. Choosing Soft
     * over Wet changed a swatch and nothing else.
     *
     * `wearRate` is documented as a fraction of peak per *lap*, so it has to be divided by
     * a lap time to become a rate. Using the circuit's own estimate does the right thing
     * automatically: a long, fast lap wears a tyre less per second than a short, slow one.
     */
    const compound = getCompound(setup.compound);
    this.compound = compound;
    this.compoundGrip = compound.grip;
    this.lapSeconds = setup.lapSeconds > 0 ? setup.lapSeconds : DEFAULT_LAP_SECONDS;
    /*
     * Wear per *metre*, not per second.
     *
     * It has to be distance-based, because that is the whole point of tyre management. A
     * time-based rate means a driver who lifts to save a tyre simply takes longer to wear
     * it out, so protecting a tyre buys nothing and the only correct choice is never to
     * manage -- which reduces the entire compound model to "always pick the hard".
     *
     * A tyre wears because of the work it does, so it should be charged per metre covered.
     * Measured before this: an AI managing a tyre still ended a six-lap Jeddah race at 44%
     * wear with grip down to 0.65.
     */
    this.lapMetres = setup.lapMetres > 0 ? setup.lapMetres : DEFAULT_LAP_METRES;
    this.wearPerMetre = compound.wearRate / this.lapMetres;
    // The compound sets the working window; a tyre upgrade widens it. A narrow band is
    // faster to be in and harder to stay in, which is the trade `band` is describing.
    this.workingBand = compound.band + (this.optimalBand - TYRE.optimalBand);
    this.maxBrakeForce = setup.maxBrakeForce ?? BRAKES.maxBrakeForce;
    this.drsDragReduction = setup.drsDragReduction ?? POWERTRAIN.drsDragReduction;
    this.isPlayer = options.isPlayer ?? false;
    this.name = options.name ?? 'Driver';

    this.x = 0;
    this.z = 0;
    this.heading = 0;
    /**
     * Height above sea level, and nose-up pitch in radians.
     *
     * The car is simulated in plan view -- x, z and heading -- so elevation has to be
     * supplied from outside by the race session, which already knows where on the
     * circuit the car is. Real elevation for Monza is 182m-196m across the lap; that
     * data has been fetched and resampled into every track sample since PR #17 and
     * nothing read it, so fourteen metres of circuit were rendered as a flat plane.
     */
    this.y = 0;
    this.pitch = 0;
    this.vLong = 0;
    this.vLat = 0;
    this.yawRate = 0;
    this.steerAngle = 0;
    this.wheelSlip = 0;

    this.gear = 1;
    this.rpm = POWERTRAIN.idleRpm;
    this.shiftTimer = 0;
    this.clutch = 1;
    /** -1 reverse, 0 neutral, 1..n forward. */
    this.direction = 1;
    this.reverseHold = 0;

    this.frontTemp = 62;
    this.rearTemp = 62;
    this.frontWear = 0;
    this.rearWear = 0;

    this.ersCharge = 1;
    this.drsOpen = false;
    this.boost = 0;

    this.downforce = 0;
    this.frontSlipAngle = 0;
    this.rearSlipAngle = 0;
    this.longitudinalG = 0;
    this.lateralG = 0;
    this.throttle = 0;
    this.brake = 0;
    this.brakeLock = 0;
    this.engineTorque = 0;
    /** Axle loads in newtons, kept for the telemetry HUD and the AI. */
    this.loadFront = 0;
    this.loadRear = 0;
    /** Yaw acceleration in rad/s^2, for the AI's stability controller. */
    this.yawAcceleration = 0;
  }

  get speed() {
    return Math.hypot(this.vLong, this.vLat);
  }

  get speedKph() {
    return this.speed * 3.6;
  }

  /**
   * Velocity in world axes.
   *
   * The integrator works entirely in body axes (`vLong`, `vLat`) because that is
   * where grip and slip are defined, but contact resolution happens in world space
   * -- a shunt pushes a car along the line between the two cars, not along its own
   * bonnet. Without this the collision code has to re-derive the rotation inline,
   * and gets the sign of the lateral term wrong.
   *
   * @returns {{vx: number, vz: number}} metres per second
   */
  worldVelocity() {
    const cos = Math.cos(this.heading);
    const sin = Math.sin(this.heading);
    return {
      vx: this.vLong * cos - this.vLat * sin,
      vz: this.vLong * sin + this.vLat * cos
    };
  }

  /**
   * Apply an impulse given in world axes.
   *
   * The inverse of {@link worldVelocity}. Kept here so the rotation between frames
   * lives in exactly one place: if the convention ever changes, it changes once.
   *
   * @param {number} ix world-x impulse, N*s
   * @param {number} iz world-z impulse, N*s
   */
  applyWorldImpulse(ix, iz) {
    const cos = Math.cos(this.heading);
    const sin = Math.sin(this.heading);
    this.vLong += ix * cos + iz * sin;
    this.vLat += -ix * sin + iz * cos;
  }

  /**
   * Fit a fresh set of tyres, as a pit stop does.
   *
   * The compound sets peak grip and the working window; wear starts at zero and the tyres start
   * warm rather than at ambient, because rubber that has come out of the pit is not cold.
   *
   * @param {string} compoundId
   * @param {number} compoundGrip the resolved compound's grip multiplier
   */
  applyCompound(compoundId, compoundGrip) {
    const compound = getCompound(compoundId);
    this.compound = compound;
    this.compoundGrip = compoundGrip ?? compound.grip;
    this.workingBand = compound.band + (this.optimalBand - TYRE.optimalBand);
    this.frontWear = 0;
    this.rearWear = 0;
    this.frontTemp = PIT_TYRE_START_TEMP;
    this.rearTemp = PIT_TYRE_START_TEMP;
  }

  get frontGrip() {
    return temperatureGrip(this.frontTemp, this.workingBand) * wearGrip(this.frontWear);
  }

  get rearGrip() {
    return temperatureGrip(this.rearTemp, this.workingBand) * wearGrip(this.rearWear);
  }

  /** Combined slip power per axle, used for tyre heating and wear. */
  get slipPowerFront() {
    return Math.abs(this.frontForce) * Math.abs(this.frontSlipAngle) * Math.abs(this.vLong);
  }

  get slipPowerRear() {
    return (
      Math.abs(this.rearForce) * Math.abs(this.rearSlipAngle) * Math.abs(this.vLong) +
      Math.abs(this.longitudinalG * this.geometry.mass) * this.wheelSlip * Math.abs(this.vLong) * 0.5
    );
  }

  /** Downforce in newtons at the current speed, reduced with DRS open. */
  computeDownforce(speed) {
    const drsFactor = this.drsOpen ? 1 - this.drsDragReduction * this.drsStrength : 1;
    return 0.5 * 1.225 * this.geometry.downforceArea * speed * speed * drsFactor;
  }

  rpmFromWheels(gearRatio) {
    return (Math.abs(this.vLong) / WHEEL_CIRCUMFERENCE) * gearRatio * 60;
  }

  /**
   * Advance one fixed timestep.
   * @param {number} dt seconds, small and constant
   * @param {{throttle: number, brake: number, steer: number, handbrake: boolean}} controls
   * @param {{grip?: number}} [surface] surface friction multiplier
   */
  step(dt, controls, surface = {}) {
    const spec = this.geometry;
    const surfaceGrip = surface.grip ?? 1;
    const throttle = clamp(controls.throttle ?? 0, 0, 1);
    const brake = clamp(controls.brake ?? 0, 0, 1);
    const steerInput = clamp(controls.steer ?? 0, -1, 1);
    const handbrake = controls.handbrake ?? false;

    const a = spec.centreOfMassToFront;
    const b = spec.wheelBase - spec.centreOfMassToFront;
    const mass = spec.mass;
    const inertia = mass * spec.inertiaFactor;
    const speed = this.speed;

    this.downforce = this.computeDownforce(speed);

    // --- Vertical load ------------------------------------------------------
    // Transfer uses the previous frame's longitudinal acceleration; using this
    // frame's own value would couple the two equations into a feedback loop.
    const transfer = (mass * this.longitudinalG * spec.centreOfMassHeight) / spec.wheelBase;
    const aeroFront = this.downforce * 0.46;
    const aeroRear = this.downforce * 0.54;
    const loadFront = Math.max(0, (mass * GRAVITY * b) / spec.wheelBase - transfer) + aeroFront;
    const loadRear = Math.max(0, (mass * GRAVITY * a) / spec.wheelBase + transfer) + aeroRear;
    this.loadFront = loadFront;
    this.loadRear = loadRear;

    // --- Steering -----------------------------------------------------------
    // Steering lock falls away with speed, as it does on a real car where the
    // rack ratio and the driver's arms are the limit.
    const maxSteer = lerp(0.52, 0.09, clamp(Math.abs(this.vLong) / 85, 0, 1));
    this.steerAngle = steerInput * maxSteer;

    // --- Slip angles --------------------------------------------------------
    // Slip angle is measured between where the tyre is pointing and where it is
    // actually travelling, so the steer angle has to come *out* of the front
    // slip. Omitting it leaves the front slip at zero for a car travelling
    // straight, which produces no lateral force and no yaw moment: the car then
    // holds its line no matter how hard it is steered.
    const speedBlend = clamp(Math.abs(this.vLong) / 7, 0, 1);
    const frontDynamic = Math.atan2(
      this.vLat + this.yawRate * a,
      Math.abs(this.vLong) + 0.8
    ) - this.steerAngle;
    const rearDynamic = Math.atan2(this.vLat - this.yawRate * b, Math.abs(this.vLong) + 0.8);
    // Below walking pace atan2 degenerates into noise, so blend towards the
    // kinematic model where slip angle is simply minus the steer angle.
    this.frontSlipAngle = lerp(-this.steerAngle, frontDynamic, speedBlend);
    this.rearSlipAngle = lerp(0, rearDynamic, speedBlend);

    // --- Tyre forces --------------------------------------------------------
    const muFront = this.peakGrip * this.compoundGrip * this.grip * this.frontGrip * surfaceGrip;
    const muRear = this.peakGrip * this.compoundGrip * this.grip * this.rearGrip * surfaceGrip;

    // How much of the rear tyres' friction circle the brakes are already using.
    // Computed before the lateral force so the two can share one budget.
    // Only the *excess* over what the tyre would have carried laterally counts
    // against the budget. Dividing the full requested brake force by the rear
    // load makes even gentle braking look like a near-total loss of grip.
    const brakeBudget = clamp(
      (brake * this.maxBrakeForce * (1 - BRAKES.brakeBiasFront) - muRear * loadRear * 0.25) /
        Math.max(loadRear, 1),
      0,
      1
    );

    const frontForce =
      -muFront * loadFront * magicFormula(this.frontSlipAngle, TYRE.frontStiffness, TYRE.frontShape);
    let rearForce =
      -muRear * loadRear * magicFormula(this.rearSlipAngle, TYRE.rearStiffness, TYRE.rearShape);
    this.frontForce = frontForce;
    this.rearForce = rearForce;

    // Tyres do have one friction budget, but braking is deliberately *not* taken out
    // of the lateral budget here. Real cars brake and corner at the same time
    // because the front axle takes most of the braking and the two axles are
    // separate. Coupling them as a single shared budget makes any car that brakes
    // before a corner lose nearly all rear grip exactly when it needs to turn in:
    // it understeers wide, and the AI then spends the corner fighting its way back.
    // The longitudinal load transfer above already produces the effect that
    // actually matters -- the rear lightens and loses grip under braking.
    this.brakeTrail = brakeBudget;
    this.rearForce = rearForce;

    // --- Drivetrain ---------------------------------------------------------
    // Reverse uses a single short ratio, so it is limited in both speed and
    // torque and cannot be used to drive the car round a circuit.
    const reversing = this.direction < 0;
    this.updateGearbox(dt, reversing);
    const gearRatio = reversing
      ? -REVERSE_RATIO * POWERTRAIN.finalDrive
      : (POWERTRAIN.gearRatios[this.gear] ?? 1) * POWERTRAIN.finalDrive;
    this.rpm = reversing
      ? POWERTRAIN.idleRpm
      : clamp(this.rpmFromWheels(gearRatio), POWERTRAIN.idleRpm, POWERTRAIN.revLimit + 250);

    let driveForce = 0;
    if (this.shiftTimer <= 0 && this.clutch > 0.5) {
      this.engineTorque =
        POWERTRAIN.peakTorque *
        this.powerScale *
        torqueFactor(this.rpm) *
        (1 + this.boost * 0.42 * this.ersStrength);
      driveForce = thrustFromTorque(this.engineTorque, Math.abs(gearRatio)) * throttle * Math.sign(gearRatio);
      // Reverse is deliberately feeble: enough to unstick the car, nowhere near
      // enough to matter in a race.
      if (reversing) driveForce = Math.max(driveForce, -REVERSE_FORCE);
    }

    // The rear tyres cannot put down more than their grip allows.
    const tractionLimit = muRear * loadRear * (handbrake ? 0.45 : 1.06);
    if (Math.abs(driveForce) > tractionLimit) {
      this.wheelSlip = clamp((Math.abs(driveForce) - tractionLimit) / Math.max(tractionLimit, 1), 0, 1);
      driveForce = Math.sign(driveForce) * tractionLimit;
    } else {
      this.wheelSlip = Math.max(0, this.wheelSlip - dt * 4);
    }

    // Engine braking opposes motion but must never push the car the wrong way,
    // and is suppressed entirely in reverse.
    const engineBraking = reversing
      ? 0
      : -Math.sign(this.vLong) * POWERTRAIN.peakTorque * POWERTRAIN.engineBrake * Math.abs(gearRatio) * (1 - throttle);
    // Braking force is capped by what the tyres can actually take. Weight moves
    // forward under braking, so the front axle is the one that limits total
    // deceleration -- which is why the bias is set rearward to keep it stable.
    const brakeRequest = brake * this.maxBrakeForce * (this.shiftTimer > 0 ? 0.3 : 1);
    const brakeGripLimit =
      muFront * loadFront * 1.15 * BRAKES.brakeBiasFront +
      muRear * loadRear * 1.15 * (1 - BRAKES.brakeBiasFront);
    const brakeForce = Math.min(brakeRequest, brakeGripLimit);
    // Lock-up means the front axle alone cannot take its share. F1 cars brake
    // rearward partly to avoid this, and it is what makes a trail-brake into a
    // corner rotate the car.
    this.brakeLock = brakeRequest > (muFront * loadFront * 1.15 * BRAKES.brakeBiasFront) * 1.02 ? 1 : 0;
    this.brakeGripLimit = brakeGripLimit;
    // Brakes oppose motion and cannot drive the car backwards on their own.
    const braking =
      -Math.sign(this.vLong) *
      Math.min(brakeForce, (Math.abs(this.vLong) * mass) / Math.max(dt, 1e-4) * 0.6);

    // --- Resistances --------------------------------------------------------
    const drsFactor = this.drsOpen ? 1 - this.drsDragReduction * this.drsStrength : 1;
    const drag = 0.5 * 1.225 * spec.dragArea * drsFactor * this.vLong * Math.abs(this.vLong);
    const rolling = this.vLong * 0.4;

    // --- Integrate ----------------------------------------------------------
    const ax = (driveForce + engineBraking + braking - drag - rolling) / mass;
    const ay = (frontForce * Math.cos(this.steerAngle) + rearForce) / mass;

    const yawAcceleration = (frontForce * Math.cos(this.steerAngle) * a - rearForce * b) / inertia;

    this.vLong += (ax + this.vLat * this.yawRate) * dt;
    this.vLat += (ay - this.vLong * this.yawRate) * dt;
    this.yawRate += yawAcceleration * dt;
    this.yawAcceleration = yawAcceleration;

    // Yaw damping, strongest at low speed, stops the car oscillating into a spin.
    this.yawRate *= 1 - clamp(1.1 * dt * (1 - speedBlend * 0.85), 0, 0.5);

    // Bleed off residual velocity at a standstill so the car settles instead of
    // creeping forward on engine braking.
    if (Math.abs(this.vLong) < 0.15 && throttle < 0.05) {
      const settle = 0.8;
      this.vLong *= settle;
      this.vLat *= settle;
      this.yawRate *= settle;
    }

    // Direction state: which way the gearbox is engaged, and therefore which way
    // throttle drives.
    //
    // Reverse is selected by *holding* the brake at a standstill, not by a single
    // frame of it. Selecting on a momentary brake input latches the gearbox into
    // reverse for as long as the speed stays low, and since throttle does not
    // clear the latch, a car that brushes the brakes recovers from a spin by
    // selecting reverse and then driving away from the circuit in it, under full
    // throttle, indefinitely. Holding the brake for a moment and requiring the
    // driver to then *release* it and press the throttle is what a real selector
    // needs, and it breaks that trap.
    if (this.speed > REVERSE_LIMIT) {
      this.direction = 1;
      this.reverseHold = 0;
    } else if (this.speed > 0.8) {
      /*
       * Moving: hold whatever is selected.
       *
       * This used to be `this.direction = Math.sign(this.vLong) || this.direction`, which is
       * how a car that spun while rolling backwards stayed in reverse. Now that reverse has a
       * real engagement path -- hold the brake -- that legacy rule is not just redundant, it
       * is a fault: reverse releases above `REVERSE_LIMIT`, the car is still rolling
       * backwards on the next step, and `Math.sign(vLong)` puts it straight back in. Speed
       * then oscillated either side of the limit and the selector chattered, flipping
       * direction several times a second -- 359 flips in eight seconds, measured.
       *
       * It was hidden for as long as reverse was undriveable, because throttle forced
       * `direction = 1` every step and the boundary was never reached. Making reverse
       * drivable is what exposed it, so the two have to be fixed together.
       *
       * Reverse is entered by holding the brake and left on speed, and nothing in between
       * changes the selection. That is how a real selector behaves.
       */
      this.reverseHold = 0;
    } else if (brake > 0.5 && throttle < 0.2) {
      this.reverseHold += dt;
      // Only after the brake has been held does reverse actually engage.
      if (this.reverseHold > REVERSE_ENGAGE_HOLD) this.direction = -1;
    } else if (throttle > 0.2 && this.direction !== -1) {
      /*
       * Throttle selects forward again -- but only when forward is already selected.
       *
       * This was unconditional, which made reverse selectable but not drivable: reverse
       * engaged, and then the throttle needed to actually drive backwards deselected it on
       * the very next step.
       *
       * It went unnoticed because the only test of it asserted `direction === -1` after a
       * brake hold, which still passed. The bug was in the gap between *selecting* reverse
       * and *driving* in it, and nothing covered that.
       *
       * The consequence was that a spun car applied full throttle to whatever was in front
       * of it, indefinitely. Measured at Jeddah: 90% of stopped cars faced backwards,
       * 79-92% were against the barrier, 1% were reversing, and the field spent 29% of a
       * race below walking pace.
       *
       * Leaving reverse is still bounded, deliberately: it is released on speed, and by
       * dropping the brake.
       */
      this.direction = 1;
      this.reverseHold = 0;
    }

    this.longitudinalG = ax;
    this.lateralG = ay;
    this.throttle = throttle;
    this.brake = brake;

    this.heading += this.yawRate * dt;
    this.x += (this.vLong * Math.cos(this.heading) - this.vLat * Math.sin(this.heading)) * dt;
    this.z += (this.vLong * Math.sin(this.heading) + this.vLat * Math.cos(this.heading)) * dt;

    this.updateTyres(dt);
    this.updateErs(dt);
    this.shiftTimer = Math.max(0, this.shiftTimer - dt);
  }

  /** Automatic gearbox: upshift at the limiter, downshift when the engine would drop too low. */
  updateGearbox(dt, reversing = false) {
    if (this.shiftTimer > 0) {
      this.clutch = damp(this.clutch, 0, 26, dt);
      return;
    }
    this.clutch = damp(this.clutch, 1, 14, dt);
    if (this.clutch < 0.92) return;
    if (reversing) return;

    const lastGear = POWERTRAIN.gearRatios.length - 1;
    if (this.gear < lastGear && this.rpm > POWERTRAIN.shiftUpRpm) {
      this.gear += 1;
      this.shiftTimer = POWERTRAIN.shiftTime;
      return;
    }
    if (this.gear > 0) {
      const lowerRatio = POWERTRAIN.gearRatios[this.gear - 1] * POWERTRAIN.finalDrive;
      if (this.rpmFromWheels(lowerRatio) < POWERTRAIN.shiftDownRpm * 0.94) {
        this.gear -= 1;
        this.shiftTimer = POWERTRAIN.shiftTime * 0.7;
      }
    }
  }

  /**
   * Tyre temperature and wear. Equilibrium temperature comes from slip power, so
   * a car sliding or locking a wheel cooks its tyres, and grip falls off once
   * they leave the working window -- which is what makes tyre management and pit
   * stops matter over a race distance.
   */
  updateTyres(dt) {
    // Equilibrium temperature is set by how hard the tyre is *working*, which is
    // dominated by the load it carries and the lateral force it is generating --
    // not by wheelspin alone. Keying it to slip power alone (as an earlier
    // version did) leaves the front axle at ambient while cornering, so the
    // thermal model never engages during a normal lap and tyre management is
    // invisible to the player.
    const ambient = 26;
    /*
     * What actually heats a tyre.
     *
     * The old model had one term -- lateral work -- plus slip. That is not enough, because
     * most of a lap is a straight: the AI's *median* lateral acceleration is under 6 m/s2,
     * so on a straight the equilibrium fell to ambient and the tyres cooled. Measured
     * against its own comment ("a hard but normal lap runs the tyres into the 90-130C
     * window"), the old coefficients topped out at 66C at 3g and the thermal model had
     * never once reached its operating window. `temperatureGrip` therefore sat permanently
     * below 1.0 and every car in the game drove on cold tyres at a ~4% grip penalty that
     * nobody could see, because it was baked into the baseline.
     *
     * So there is now a speed term, which is the physically dominant one on a straight: a
     * tyre rolled at 300kph heats from bearing and aero drag whether or not it is
     * cornering. Calibrated so that:
     *
     *     46 m/s on a straight  ->  77C   (cool, but inside the working window)
     *     70 m/s on a straight  -> 103C   (in the window)
     *     60 m/s mid-corner     -> 116C   (in the window)
     *     33 m/s at a hairpin   -> 120C   (hot, and about to go past it)
     *
     * which is the spread a real tyre lives in, rather than a model that only heats when
     * the car is already sideways.
     */
    const speedHeat = this.speed * TYRE_SPEED_HEAT;
    const lateralHeat = Math.abs(this.lateralG) * this.geometry.mass * TYRE_LATERAL_HEAT;
    const frontEquilibrium = ambient + speedHeat + lateralHeat * 1.05 + this.slipPowerFront * 0.0012;
    const rearEquilibrium = ambient + speedHeat + lateralHeat * 0.85 + this.slipPowerRear * 0.0016;

    this.frontTemp = clamp(stepTemperature(this.frontTemp, frontEquilibrium, ambient, dt), ambient, 220);
    this.rearTemp = clamp(stepTemperature(this.rearTemp, rearEquilibrium, ambient, dt), ambient, 220);

    /*
     * Wear, in units of the compound's own life.
     *
     * This used to be `0.0000075 * dt` with no compound and no unit: over a five-lap
     * race it accumulated to 0.0007, the grip cost was a flat `1 - wear * 0.18`, and the
     * total grip lost was **0.013%**. The HUD wear bar read 0.0% for the whole race and
     * "soft tyres wear faster" was simply false.
     *
     * Now it is the compound's documented rate -- a fraction of peak grip per lap --
     * divided by the lap time, so a lap is a lap at Monaco and at Monza alike. The
     * sliding term still matters: a car that uses its tyres gets through them faster.
     */
    const covered = this.speed * dt;
    const frontWear = this.wearPerMetre * covered * (1 + this.slipPowerFront * 6e-5);
    const rearWear = this.wearPerMetre * covered * (1 + this.slipPowerRear * 6e-5);
    this.frontWear = clamp(this.frontWear + frontWear, 0, 1);
    this.rearWear = clamp(this.rearWear + rearWear, 0, 1);
  }

  /** ERS harvests automatically under braking; deployment is a manual button. */
  updateErs(dt) {
    if (this.brake > 0.15 && this.speed > 8) {
      this.ersCharge = clamp(this.ersCharge + dt * 0.16, 0, 1);
    }
    if (this.boost > 0) this.boost = Math.max(0, this.boost - dt * 0.5);
  }

  deployErs() {
    if (this.ersCharge > 0.25 && this.boost <= 0) {
      this.boost = 1;
      this.ersCharge = Math.max(0, this.ersCharge - 0.3);
      return true;
    }
    return false;
  }

  reset(x, z, heading, speed = 0) {
    this.x = x;
    this.z = z;
    this.y = 0;
    this.pitch = 0;
    this.heading = heading;
    this.vLong = speed;
    this.vLat = 0;
    this.yawRate = 0;
    this.steerAngle = 0;
    this.gear = 1;
    this.rpm = POWERTRAIN.idleRpm;
    this.shiftTimer = 0;
    this.clutch = 1;
    this.direction = speed >= 0 ? 1 : -1;
    this.reverseHold = 0;
    this.boost = 0;
    this.wheelSlip = 0;
    this.longitudinalG = 0;
    this.lateralG = 0;
    this.engineTorque = 0;
  }
}