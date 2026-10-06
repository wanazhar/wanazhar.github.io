/**
 * AI driver.
 *
 * The AI drives the same `CarPhysics` as the player. It only produces a
 * `{ throttle, brake, steer }` triple, so it cannot cheat with different physics
 * -- only with a different skill profile.
 *
 * Control is a Stanley-style path follower rather than pure pursuit:
 *
 *   steer = headingError + atan(k * crossTrackError / speed)
 *
 * The first term points the car along the line; the second pulls it back towards
 * the line in proportion to how far off it is, damped by speed so the correction
 * does not oscillate at high velocity. Pure pursuit -- steering at a point some
 * distance ahead -- looks simpler but is badly behaved here: the lookahead grows
 * with speed, which is exactly when the controller has the least authority, so
 * the car porpoises out of a fast corner and never recovers.
 */

import { clamp, damp, moveToward, wrapAngle } from '../util/math.js';
import { locateOnTrack, racingLineAt, sampleAtDistance } from '../track/trackGeometry.js';
import { PIT_SIDE, PIT_WINDOW_END, PIT_WINDOW_START } from '../race/pit.js';

/**
 * Controller gains.
 *
 * The heading term does most of the work and the cross-track term cleans up the
 * residual. Both are expressed so that the output is roughly a steering-wheel
 * angle in [-1, 1], which keeps the numbers meaningful rather than arbitrary.
 */
const HEADING_GAIN = 1.6;
/**
 * Cross-track gain for Stanley's `atan(k * error / speed)` term.
 *
 * Units matter enormously here and are easy to get wrong. `atan(k*e/v)` asks for
 * roughly 0.15 rad of steering for a two-metre error at 30 m/s, so `k` is of
 * order 3. A value of 0.05 -- which looks plausible if you think of it as
 * "radians per metre" -- produces 0.003 rad instead: fifty times too small to
 * correct anything. The AI then steers only by heading error, sails down the
 * road offset from the line, and cannot recover, because the one term that
 * pulls it back has no authority.
 */
const STANLEY_GAIN = 3.0;
/** Additive damping in the cross-track denominator, so it never divides by zero. */
/** ERS: charge worth spending, flatness required, and how much the rear will take. */
const ERS_DEPLOY_MIN = 0.3;
const ERS_CURVATURE = 0.0035;
const ERS_SLIDE_LIMIT = 0.14;
/** How readily a driver spends energy with no car in sight, as a fraction of `drsSkill`. */
const ERS_OPPORTUNISM = 0.35;

/**
 * Is the pit entry coming up?
 *
 * A driver does not cross the circuit the moment they decide to stop -- they run to the end of
 * the straight, and only then turn off. Steering for the lane from the moment a stop is
 * requested put the car off the racing line for most of a lap, which cost 185 seconds against a
 * 2.4 second box, and made stopping look catastrophically expensive.
 *
 * @param {number} distance metres along the lap from the start line
 * @param {number} length lap length
 */
function approachingPitWindow(fraction) {
  const f = (((fraction % 1) + 1) % 1);
  // The window wraps the line, so entry is the stretch just before 1.0.
  return f >= PIT_WINDOW_START - 0.06 || f <= PIT_WINDOW_END + 0.02;
}

/** Metres into the pit lane the driver aims for, between the road edge and the far wall. */
const PIT_LANE_CENTRE = 5;

/** Must match `CarPhysics`: brake hold before reverse actually engages. */
const REVERSE_ENGAGE_HOLD = 0.45;

/** Radians of improvement needed to count as progress, and the error below which a car counts as aligned. */
const SPIN_PROGRESS = 0.15;
const SPIN_ALIGNED = 1.2;
/**
 * Tyre management.
 *
 * `TYRE_MANAGE_FROM` is the wear fraction at which a tyre starts to cost real grip, and
 * `TYRE_MANAGE_GAIN` is how hard a driver backs off once past it. The result is a speed
 * multiplier, not a cliff: a driver protecting a tyre is a little slower everywhere rather
 * than suddenly slow, which is what "managing" looks like.
 *
 * `skill.tyreCare` scales the whole thing -- a driver who does not care about the tyre is
 * not managing it, and that has to be visible as a different driver rather than a different
 * car.
 */
const TYRE_MANAGE_FROM = 0.16;
const TYRE_MANAGE_GAIN = 0.55;

/** How much of the available degradation a driver is willing to give back as pace. */
function tyreManagement(physics, skill) {
  const wear = Math.max(physics.frontWear, physics.rearWear);
  if (wear <= TYRE_MANAGE_FROM) return 0;
  const care = skill.tyreCare ?? 0.5;
  return clamp((wear - TYRE_MANAGE_FROM) / (1 - TYRE_MANAGE_FROM), 0, 1) * TYRE_MANAGE_GAIN * care;
}



const DAMP_OFFSET = 8;
/**
 * How far ahead of the car the line's heading is evaluated. Expressed as a time
 * so the lead grows with speed, then bounded in both distance and angle.
 */
const AIM_LEAD_TIME = 0.45;
const AIM_LEAD_MIN = 6;
const AIM_LEAD_MAX = 30;
/** Never command more than this much turn-in angle, however tight the corner. */
const MAX_LEAD_ANGLE = 0.32;
/** Counter-steer authority against a rear slide, per radian of slip. */
const COUNTER_STEER = 1.4;
const STEER_LIMIT = 1;

/**
 * How far ahead the speed target is taken, as a function of speed. Braking must
 * begin before the corner, and at 300 km/h a 100m gap closes in barely a second.
 */
const BRAKE_LOOKAHEAD_MIN = 40;
const BRAKE_LOOKAHEAD_PER_V2 = 0.05;
/** Samples taken across the lookahead window when hunting for the slowest point. */
const BRAKE_WINDOW_SAMPLES = 16;
/**
 * Deceleration the AI plans its braking around, in m/s^2. Slightly below what
 * the car can actually achieve, so it brakes a little early rather than a little
 * late; being early costs nothing, being late ends in the barrier.
 */
const BRAKE_DECELERATION = 11;

/**
 * Distance off the racing line before the car counts as off-track.
 *
 * This must be measured against the *line*, not the centreline, and it must be
 * generous. A car three metres off the racing line while turning hard through a
 * corner is driving normally, not running off; treating that as off-track caps
 * its speed and it spends the whole lap limping along instead of racing.
 */
const OFF_TRACK_DISTANCE = 9;
/**
 * Off-track speed cap.
 *
 * Only applied once the car is genuinely in the run-off. It is a rejoining speed,
 * not a racing speed: the aim is to get back on the road pointing the right way,
 * and arriving back at double the speed is how a car rejoins into the barrier.
 */
const OFF_TRACK_SPEED = 26;
/**
 * Distance off the line at which the AI stops trying to race and starts trying to
 * get back on the road.
 *
 * This matters more than it looks. Once a car is far enough out that both its
 * heading error and its cross-track error point away from the track, the normal
 * controller's correction is actively wrong: it steers to follow the line, which
 * is *further* from the car than the road is. The AI then drives along the run-off
 * at full lock, in a straight line away from the circuit, forever. Rejoining has
 * to be a separate behaviour with a different target.
 */
const OFF_TRACK_REJOIN = 12;

/**
 * Global multiplier on the AI's target speed.
 *
 * The speed profile is computed from an idealised steady-state corner. A real car
 * arriving at a corner is also transitioning, running a line it is still finding,
 * and carrying whatever error it had on entry. Aiming at 100% of the profile leaves
 * no room for any of that, so the AI runs wide at every apex. The margin is small
 * -- a few percent of lap time -- and it is the difference between finishing a lap
 * and driving into the barrier at the slowest corner.
 */
/*
 * Pace safety factor: the fraction of the generated speed profile the AI aims for.
 *
 * A blanket discount rather than a control limit. It exists because the AI used to
 * arrive at corners too fast and spin, and spinning loses far more time than the
 * margin saves -- but that reasoning argues for the *fastest factor that does not
 * run wide*, not for whatever number was convenient when it was introduced.
 *
 * It is now settable so `scripts/ai-pace-sweep.mjs` can measure it: every candidate
 * is judged on lap time *and* time spent off track, because more pace is not
 * automatically better.
 */
let PACE_SAFETY = 0.93;

/** How far an individual driver may push beyond the base factor. */
const ADAPTIVE_RANGE = 0.07;

/**
 * Rate the adaptive factor moves, per second.
 *
 * Deliberately slow. A driver who finds the limit at a corner does not decide to
 * go 4% faster next lap; they creep at it over several corners, and back off the
 * moment they run wide. Adjusting quickly turns a marginal car into a car that
 * oscillates between too fast and too slow and never finds either.
 */

/**
 * Fraction of target speed a fully damaged car gives up, and by extension the fraction of a
 * car at any damage level. See the note at the lift: enough to break the cascade, not enough
 * to turn a damaged car into a lapper.
 */
const DAMAGE_LIFT = 0.12;

const ADAPTIVE_RATE = 0.06;

/** Override the pace safety factor. Used by the sweep bench; not called by the game. */
export function setPaceSafety(value) {
  PACE_SAFETY = value;
}

export class AIDriver {
  constructor(physics, skill, options = {}) {
    this.physics = physics;
    this.skill = skill;
    this.track = options.track;
    this.name = options.name ?? 'AI';
    this.random = options.random ?? Math.random;

    /** Smoothed lateral offset from the racing line, used for traffic and rejoining. */
    /** Adaptive pace multiplier, adjusted by how this driver is actually driving. */
    this.paceAdaptation = 1;
    this.offsetBias = 0;
    this.mistakeTimer = 0;
    this.mistakeSteer = 0;
    this.reactionDelay = 0;
    this.pendingControls = { throttle: 0, brake: 0, steer: 0 };
    /** Seconds below walking pace, and seconds spent reversing out of trouble. */
    this.stallTimer = 0;
    this.recoveryTimer = 0;
    /** Heading error when the current spin began, so progress can be judged against it. */
    this.recoveryFrom = null;
    this.overtakeIntent = 0;
    this.defendIntent = 0;
    this.trackIndex = 0;
    this.offTrackTimer = 0;
  }

  /**
   * Produce controls for one frame.
   * @param {number} dt seconds
   * @param {{opponentAhead?: object, opponentBehind?: object}} context
   */
  update(dt, context = {}) {
    const { physics, skill, track } = this;
    if (!track) return { throttle: 0, brake: 1, steer: 0, handbrake: false };

    this.stallTimer = physics.speed < 2.5 ? this.stallTimer + dt : 0;

    // --- Where am I on the track? -------------------------------------------
    // Re-locating every frame from the previous index is both cheap and robust:
    // it stays correct through a spin or a trip across the run-off, which a
    // free-running odometer does not.
    const located = locateOnTrack(track, physics.x, physics.z, this.trackIndex);
    this.trackIndex = located.index;
    const distance = located.sample.s;
    physics.progressDistance = distance;

    const sample = located.sample;
    const limit = Math.max(0, sample.width * 0.5 - 2.0);
    /*
     * A car heading for the pit needs room beyond the road edge, because that is where the lane
     * is. Clamping back to the road half-width would aim it at the kerb and it would simply
     * refuse to leave the circuit.
     */
    const pitRoom = context.pitRequested ? limit + PIT_LANE_CENTRE + 2 : limit;
    const lineOffset = clamp(sample.lineOffset + this.#offsetFor(context, distance, dt, pitRoom), -pitRoom, pitRoom);
    const offTrackDistance = Math.max(0, Math.abs(located.lateral) - Math.abs(lineOffset));
    const offTrack = offTrackDistance > OFF_TRACK_DISTANCE;
    this.offTrackTimer = offTrack ? this.offTrackTimer + dt : 0;

    // --- Steering ------------------------------------------------------------
    // Both controller terms are measured at the car's *own* position on the
    // line. Measuring the cross-track error against a point some distance ahead
    // instead makes the two terms contradict each other in a corner: the aim
    // point has already swung round to the inside of the corner, so the heading
    // term asks for one direction and the cross-track term for the other. The
    // result is a car that porpoises, oscillates and eventually leaves the road
    // for good.
    const lineX = sample.x + sample.rightX * lineOffset;
    const lineZ = sample.z + sample.rightZ * lineOffset;

    // Signed lateral error: positive when the car is right of the line.
    // Positive steering turns the car left, so this term is *added* -- get that
    // sign wrong and the controller actively steers away from the line.
    const crossTrack = (physics.x - lineX) * sample.rightX + (physics.z - lineZ) * sample.rightZ;

    // Heading error against the racing line's own tangent, led forward so the car
    // turns in before the apex instead of reacting at it.
    //
    // The tangent comes from the line points themselves, not from the centreline
    // heading. A racing line runs diagonally across the road for most of its
    // length, so aiming at the centreline's direction points the car at the
    // barriers; and predicting the line's heading as `centreline + curvature *
    // distance` compounds the error, since at 18m through a hairpin that term is
    // over 40 degrees -- the controller saturates, holds the lock, and drives
    // straight off at the next corner.
    const aimLead = clamp(physics.speed * AIM_LEAD_TIME, AIM_LEAD_MIN, AIM_LEAD_MAX);
    const ahead = racingLineAt(track, distance + aimLead);
    const leadHeading = clamp(
      wrapAngle(ahead.heading - sample.lineHeading),
      -MAX_LEAD_ANGLE,
      MAX_LEAD_ANGLE
    );
    const lineHeading = sample.lineHeading + leadHeading;
    const headingError = wrapAngle(lineHeading - physics.heading);

    // Stanley's cross-track term, `atan(k * error / speed)`. Dividing by speed is
    // what keeps it stable: the same lateral error at 300 km/h needs far less
    // steering than at 50 km/h, because the car converges before the error can
    // grow. The offset keeps the denominator away from zero at walking pace.
    const correction = Math.atan2(crossTrack * STANLEY_GAIN, Math.max(physics.speed, 4) + DAMP_OFFSET);

    // Both terms saturate the instant the car is out of shape, and a saturated
    // controller has no gradient left: it sits at full lock flapping between
    // corrections, which is worse than being slightly slow. Each term is capped
    // below full lock so there is always authority left in the other.
    const headingTerm = softLimit(headingError * HEADING_GAIN, STEER_LIMIT * 0.62);
    const crossTerm = softLimit(correction, STEER_LIMIT * 0.34);
    // Counter-steer against a slide so the AI catches its own oversteer.
    const slide = softLimit(physics.rearSlipAngle * COUNTER_STEER, STEER_LIMIT * 0.4);
    const steer = clamp(headingTerm + crossTerm - slide, -STEER_LIMIT, STEER_LIMIT);

    // --- Speed target ---------------------------------------------------------
    // Speed target.
    //
    // The track's profile already encodes what the road allows. The skill factors
    // must be applied to the *target*, not compounded with a second grip estimate:
    // multiplying by cornering *and* pace *and* a tyre factor stacks three
    // discounts, so a strong driver ends up aiming at less than half the speed
    // the corner can take, arrives crawling, and then spends the corner fighting
    // to hold a line it could have taken flat.
    const speedPlan = this.#planSpeed(track, distance, physics.speed);
    // Safety factor on the target. The profile says what the road allows in
    // isolation; a driver has to get to that speed *and* stay on the line, and
    // any small error in either compounds. Aiming slightly below the limit is
    // what leaves room for both, and the lap time lost is a fraction of a second.
    /*
     * Adaptive pace.
     *
     * A single global safety factor cannot serve every circuit, and the measurement
     * shows why: on Albert Park the AI could hold 0.98 of the profile with about 1% of
     * the lap off track, while at Spa anything above 1.0 sent it spinning for 64% of
     * the lap. The circuits need different margins, and a driver's margin is not a
     * constant -- it is where they found the limit.
     *
     * So each driver carries their own multiplier and moves it from what they are
     * actually doing: time off track pushes it down, time on it pushes it up, both
     * slowly and within a narrow band. A driver who is quick and tidy earns pace;
     * one who keeps running wide loses it and has to earn it back.
     */
    this.#adaptPace(dt, offTrack, skill);

    let targetSpeed = speedPlan.targetSpeed * skill.cornering * PACE_SAFETY * this.paceAdaptation;

    /*
     * Tyre management.
     *
     * Without this, degradation is not a decision -- it is a tax. A driver on a soft tyre
     * simply gets slower as it wears, and the only correct choice is a hard, so the whole
     * compound model reduces to "always pick the hard" and the tyre choice stops being one.
     *
     * Real drivers lift to save a tyre, and the skill of doing it is a driver characteristic:
     * a driver who protects a tyre finishes on it, a driver who does not arrives at the pit
     * stop already out of it. So this is scaled by `skill`, which means a strong driver in
     * the field can be visibly managing a stint while a weaker one destroys its tyres and
     * then gets caught.
     *
     * The margin only applies past the point where a tyre is actually going off. Early in a
     * stint `wearGrip` is flat at 1.0, and lifting there would be pure pace thrown away for
     * nothing.
     */
    const wearPenalty = tyreManagement(physics, skill);
    targetSpeed *= 1 - wearPenalty;

    /*
     * Damage management.
     *
     * Damage is self-amplifying -- a car that has lost downforce understeers, an
     * understeering car collects more contact, and the loop runs away. Measured with no
     * feedback at all, 23 of 23 cars retired from one Monza race.
     *
     * The negative feedback is the driver, and in real F1 so is it: a team with a damaged car
     * stops chasing and starts protecting what is left. Capped at 12% because a driver
     * managing a car still wants points, and a car parked at the back scores none -- so this
     * trades pace for survival without turning every damaged car into a lapper.
     */
    if (physics.aeroFactor < 1) {
      targetSpeed *= 1 - DAMAGE_LIFT * (1 - physics.aeroFactor);
    }

    // A car that has run wide has already lost time; rejoining slowly beats
    // rejoining at a speed that puts it into the barrier.
    if (offTrack) targetSpeed = Math.min(targetSpeed, OFF_TRACK_SPEED);

    /*
     * Follow the car ahead.
     *
     * The AI considered the car ahead only *laterally*: it would move out of the way,
     * but never matched its speed. So it drove at full profile pace into the back of
     * anything slow in front. With a car parked on the racing line that produced 26
     * distinct contacts from 12 different cars in a minute, and the pile-up that follows
     * is exactly what "the AI crashed and then followed me" describes.
     *
     * A car ahead is a *speed limit*, not only a line to avoid. The limit is its speed
     * plus a margin that grows with the gap, so the AI only lifts when it is genuinely
     * close -- and closing at a standstill is pointless when there is nowhere to pass.
     *
     * `overtakeIntent` is excluded deliberately: a committed pass should not be braked
     * off by the very car being overtaken.
     */
    const leader = context.opponentAhead;
    if (leader && this.overtakeIntent < 0.5) {
      const margin = 2 + clamp((leader.gap - 6) / 24, 0, 1) * 10;
      if (leader.gap < 30) {
        targetSpeed = Math.min(targetSpeed, Math.max(0, leader.car.physics.speed + margin));
      }
    }

    /*
     * Backing off when touching a car.
     *
     * Without this the AI keeps its foot in it while another car is alongside, and
     * two cars that are already in contact grind against each other for the length
     * of a corner: measured over a street circuit, cars spent around twenty seconds
     * per race in contact, which is not wheel-to-wheel racing, it is a traffic jam.
     *
     * Lifting is the correct response and not merely the safe one -- a car with
     * weight on the front of another is being pushed off line, and the only way to
     * stop that is to stop driving into it.
     */
    if (context?.contact) {
      targetSpeed = Math.min(targetSpeed, physics.speed * 0.92);
    }

    const speedError = targetSpeed - physics.speed;
    let throttle = 0;
    let brake = 0;
    if (speedError > 1.2) {
      throttle = clamp(speedError * 0.4, 0, 1);
    } else if (speedError < -1) {
      brake = clamp((-speedError / 6) * skill.brakeConfidence, 0, 1);
    } else {
      throttle = clamp(0.42 + speedError * 0.3, 0, 1);
    }

    // Traction control. Both limits below exist because the AI's problem is not
    // steering -- the steering tracks the line -- it is arriving at corners too
    // fast and spinning. What holds a real car on the road is modulating power,
    // so the AI does too, in proportion to how much the car is already sliding.

    // Don't brake and steer at full lock at once. The rear axle carries most of a
    // steady-state cornering load; piling braking on top of it is what breaks the
    // rear away. The speed profile is built with margin, so easing off here still
    // arrives at the right speed for the apex.
    const turningIn = clamp(Math.abs(steer) * 1.4, 0, 1);
    brake *= 1 - turningIn * 0.55;

    // Throttle discipline: a car already using most of its friction circle has
    // almost none left for drive, and full throttle at that point spins it.
    const steeringLoad = clamp(Math.abs(steer) / STEER_LIMIT, 0, 1);
    throttle *= clamp(1 - steeringLoad * 0.45, 0.15, 1);

    // A slide always means less power, regardless of what the steering says.
    const slideAngle = Math.abs(physics.rearSlipAngle);
    if (slideAngle > 0.12) throttle *= clamp(1 - (slideAngle - 0.12) * 2.4, 0, 1);

    physics.drsOpen = this.#shouldUseDrs(context, sample);
    if (this.#shouldDeployErs(context, sample, throttle, brake, slideAngle)) physics.deployErs();

    // --- Mistakes --------------------------------------------------------------
    let commandedSteer = steer;
    if (this.mistakeTimer > 0) {
      this.mistakeTimer -= dt;
      commandedSteer = clamp(steer + this.mistakeSteer, -STEER_LIMIT, STEER_LIMIT);
      throttle *= 0.75;
    } else if (this.random() < skill.mistakeChance * dt) {
      this.mistakeTimer = 0.3 + this.random() * 0.5;
      this.mistakeSteer = (this.random() - 0.5) * 0.5;
    }

    // --- Getting unstuck -------------------------------------------------------
    // A spin is the car facing backwards along the track *and* barely moving.
    // Both conditions are required. Testing the heading alone is badly wrong:
    // mid-corner a car is legitimately at a large angle to the centreline, and
    // treating that as a spin sends it into reverse at the worst moment. The
    // mistake compounds -- reversing from a corner points the car further out,
    // and the car ends up driving away down the escape road.
    const facingBackwards = Math.abs(headingError) > 2.4;
    const nearlyStopped = physics.speed < 6;
    const spun = facingBackwards && nearlyStopped;
    const rollingBackwards = physics.vLong < -2.5;

    if (spun || rollingBackwards) {
      /*
       * Recover by outcome, not by the clock.
       *
       * Two faults are fixed here, and the second only became visible once the first was.
       *
       * First: this used to return `throttle: 1` for a spun car, with comments about
       * reversing and about giving up after a couple of seconds -- and never reversed at
       * all, because `throttle` deselected reverse. A spun car therefore applied full
       * throttle to whatever was in front of it, forever. That was measured, not inferred:
       * 90% of stopped cars facing backwards, 79-92% against the barrier, 1% reversing.
       *
       * Second: once reverse actually worked, a *time* box was the wrong bound. Reverse is
       * gentle (2000N over 800kg, about 2.5 m/s2), so holding a car in it for a fixed number
       * of seconds loses more time than leaving it stuck and letting the session rescue it.
       * Applying that fix alone turned a clean season into four rounds out of four timing
       * out.
       *
       * So the manoeuvre stops when it stops working, not when a timer expires. It keeps
       * reversing while the car is still badly misaligned *and* the alignment is improving,
       * and gives up the moment either stops being true -- because a car that is not getting
       * any closer to facing forwards does not want a second helping.
       */
      this.recoveryTimer += dt;

      if (spun && !rollingBackwards) {
        const error = Math.abs(headingError);

        // First frame of a spin: remember how far out we were, so "improving" has a baseline.
        if (this.recoveryFrom === null) this.recoveryFrom = error;

        const improving = error < this.recoveryFrom - SPIN_PROGRESS;
        const stillMisaligned = error > SPIN_ALIGNED;

        // Hold the brake first: reverse only engages after it, and throttle would cancel it.
        if (physics.direction === 1 && this.recoveryTimer < REVERSE_ENGAGE_HOLD + 0.2) {
          return { throttle: 0, brake: 1, steer: 0, handbrake: false };
        }

        if (improving && stillMisaligned) {
          return { throttle: 1, brake: 0, steer: -commandedSteer, handbrake: false };
        }

        // Aligned, or no longer converging: stop recovering and let the normal controller
        // have the car back.
        this.recoveryTimer = 0;
        this.recoveryFrom = null;
      }

      return {
        throttle: 1,
        brake: 0,
        steer: rollingBackwards ? commandedSteer : -commandedSteer,
        handbrake: false
      };
    }

    // Recovery is time-boxed. Reversing is a manoeuvre for getting out of one
    // specific situation, not a driving mode: left to itself the AI holds reverse
    // and drives steadily away from the circuit. If it has not recovered within
    // a couple of seconds it gives up reversing and simply drives forward.
    if (this.recoveryTimer > 0) {
      this.recoveryTimer -= dt;
      if (this.recoveryTimer <= 0) this.recoveryFrom = null;
      return {
        throttle: 1,
        brake: 0,
        steer: rollingBackwards ? commandedSteer : -commandedSteer,
        handbrake: false
      };
    }

    // --- Well off the road ---------------------------------------------------
    // A car that has left the track entirely and is heading away from it cannot
    // be saved by the line-following controller: its heading error and its
    // cross-track error both point the wrong way, so it drives along the run-off
    // at full lock. Here the target is simply "get back to the road", which is a
    // direction, not a line.
    if (offTrack && offTrackDistance > OFF_TRACK_REJOIN) {
      // Aim at the nearest point of the track itself, not the racing line.
      const toTrack = Math.atan2(sample.z - physics.z, sample.x - physics.x);
      const towardsRoad = wrapAngle(toTrack - physics.heading);
      // The correction is a direction, so it is damped by speed exactly like the
      // line follower: a car doing 100 km/h needs far less lock to come back than
      // one doing 20. The lateral term has the same sign convention as the line
      // follower: positive lateral means the car is right of the road, so it
      // steers left (positive) to come back.
      const returnSteer =
        towardsRoad * 1.6 +
        Math.atan2(located.lateral * STANLEY_GAIN, Math.max(physics.speed, 4) + DAMP_OFFSET);
      return {
        throttle: clamp(0.45 - Math.abs(physics.speed - 14) * 0.02, 0.2, 0.8),
        brake: 0,
        steer: softLimit(returnSteer, STEER_LIMIT * 0.7),
        handbrake: false
      };
    }

    // Beached and pointing the right way: full throttle will drag it out.
    if (physics.speed < 2.5 && this.stallTimer > 0.5) {
      return { throttle: 1, brake: 0, steer: commandedSteer * 0.5, handbrake: false };
    }

    const controls = { throttle, brake, steer: commandedSteer, handbrake: false };

    // Reaction delay: a slower driver acts on a stale picture of the track.
    const lag = skill.reactionMs / 1000;
    if (lag > 0) {
      this.reactionDelay += dt;
      if (this.reactionDelay >= lag) {
        this.reactionDelay = 0;
        this.pendingControls = controls;
      }
      return this.pendingControls;
    }
    return controls;
  }

  /**
   * Lateral offset requested for traffic, in metres, relative to the line.
   *
   * Deliberately a fraction of the available room. Two mistakes are easy here and
   * both wreck the field: swerving the full width of the road puts the aim point
   * on or past the kerb, and reacting to mere proximity makes every car on a
   * packed starting grid swerve at the same moment.
   */
  #offsetFor(context, distance, dt, limit) {
    const skill = this.skill;
    const sample = sampleAtDistance(this.track, distance);
    const budget = Math.max(0, limit) * 0.45;
    let target = 0;

    /*
     * A requested stop overrides everything: the driver is going to the pit, not racing.
     *
     * This has to be the driver steering rather than the session moving the car. A stop whose
     * only cost is the two seconds in the box is never worth taking, so the AI would never stop
     * and the tyre model would stay decorative. The lane in, the lane out and the box are what
     * the decision is weighed against.
     */
    if (context.pitRequested && approachingPitWindow(distance / this.track.length)) {
      // Negative lateral, matching `pit.js`'s `PIT_SIDE`. Aiming at the middle of the lane puts
      // the car clear of the road edge and clear of the far wall.
      target = PIT_SIDE * (sample.width * 0.5 + PIT_LANE_CENTRE);
    }

    const ahead = context.opponentAhead;
    const closing = ahead && ahead.gapSpeed !== undefined ? ahead.gapSpeed > 0.8 : false;
    const onStraight = Math.abs(sample.curvature) < 0.0025;

    if (ahead && ahead.gap < 16 && closing && !onStraight && skill.aggression > 0.3) {
      // Take the side the car ahead is not sitting on, and commit more the
      // closer it gets.
      const side = ahead.lateral > 0 ? -1 : 1;
      const commitment = clamp(1 - ahead.gap / 16, 0, 1);
      target = side * budget * skill.aggression * commitment;
      this.overtakeIntent = 1;
    } else {
      this.overtakeIntent = damp(this.overtakeIntent, 0, 1.2, dt);
    }

    const behind = context.opponentBehind;
    if (behind && behind.gap < 8 && !onStraight) {
      const side = behind.lateral > 0 ? -1 : 1;
      target = clamp(target + side * budget * 0.3, -budget, budget);
      this.defendIntent = 1;
    } else {
      this.defendIntent = damp(this.defendIntent, 0, 1.2, dt);
    }

    this.offsetBias = damp(this.offsetBias, target, 1.8, dt);
    return this.offsetBias;
  }

  /**
 * Decide the speed to be doing right now.
 *
 * The correct question is not "how fast is the track here" but "how fast can I
 * be going here and still make the slowest point in range". So the window is
 * scanned for its most restrictive entry, and the car's current speed is capped
 * by what the brakes can shed over the distance to it:
 *
 *   v_max^2 = v_corner^2 + 2 * deceleration * distance
 *
 * Two mistakes are easy here. Sampling only the far end of the window makes the
 * car read the speed of the straight *after* a corner and arrive far too fast;
 * and applying the corner speed immediately, with no allowance for the distance
 * still available to brake, does the same thing. Either way the car runs wide,
 * and once it is off the line it cannot recover.
 */
#planSpeed(track, distance, speed) {
    const lookAhead = BRAKE_LOOKAHEAD_MIN + speed * speed * BRAKE_LOOKAHEAD_PER_V2;
    const step = lookAhead / BRAKE_WINDOW_SAMPLES;
    let targetSpeed = Infinity;

    // The track's own profile is the authority on corner speed. A live grip
    // estimate is deliberately not re-applied on top: it double-counts the same
    // limit the profile was built from, so the AI ends up aiming far below what
    // the corner allows, arrives crawling, and then has to work to hold a line
    // it could have taken flat.
    for (let i = 0; i <= BRAKE_WINDOW_SAMPLES; i += 1) {
      const point = racingLineAt(track, distance + i * step);
      // What the brakes could still shed over the distance to this point.
      const reachable = Math.sqrt(
        point.targetSpeed * point.targetSpeed + 2 * BRAKE_DECELERATION * i * step
      );
      if (reachable < targetSpeed) targetSpeed = reachable;
    }

    return { targetSpeed };
  }

  #shouldUseDrs(context, sample) {
    if (!this.skill.drsSkill) return false;
    if (Math.abs(sample.curvature) > 0.003) return false;
    const behind = context.opponentBehind;
    if (!behind || behind.gap > 140) return false;
    return this.random() < this.skill.drsSkill;
  }

  /**
   * Whether to spend stored energy now.
   *
   * `deployErs()` used to have exactly one caller -- the player's input path in `Game.js`
   * -- so the entire field had a tool the player did not. The player could lean on it
   * every straight; the AI could never.
   *
   * Where it belongs is the same place DRS belongs: a straight-line tool. Deploying
   * mid-corner just spins the rears, so it needs the same flat-curvature gate DRS has,
   * plus the two conditions a driver actually judges it on -- that the car is settled
   * enough to put 40% more torque through the rear, and that there is somewhere to use
   * the speed.
   */
  #shouldDeployErs(context, sample, throttle, brake, slideAngle) {
    if (brake > 0.15) return false;            // not while braking for a corner
    if (this.physics.ersCharge < ERS_DEPLOY_MIN) return false;
    if (this.physics.boost > 0) return false;  // already deploying

    // Straight, and settled enough that the extra torque will not just spin the car.
    const straight = Math.abs(sample.curvature) <= ERS_CURVATURE;
    const settled = slideAngle < ERS_SLIDE_LIMIT;
    if (!straight || !settled) return false;

    /*
     * Spend it when it will actually convert into time: either there is a car in front
     * being passed, or the driver is one that presses on a straight rather than
     * coasting. `ersSkill` reuses `drsSkill` -- both are "how much does this driver
     * exploit the straight-line tools it has" -- so a team that is good at DRS is also
     * good at this, which is how real driver skill is distributed.
     */
    const goingForAPass = context.opponentAhead && context.opponentAhead.gap < 60;
    const opportunistic = this.random() < this.skill.drsSkill * ERS_OPPORTUNISM;
    return Boolean(goingForAPass) || opportunistic || throttle > 0.6;
  }

/** Fastest speed the tyres can hold through a corner of this curvature. */
  /**
   * Nudge this driver's pace multiplier from whether they are keeping it on the road.
   *
   * @param {number} dt
   * @param {boolean} offTrack
   * @param {object} skill
   */
  #adaptPace(dt, offTrack, skill) {
    // Only drivers who are already tidy earn pace. A driver who is struggling
    // should not be rewarded for pushing harder.
    const target = offTrack ? 1 - ADAPTIVE_RANGE : 1 + ADAPTIVE_RANGE * skill.linePrecision;
    // Backing off is faster than speeding up: recovering a spin costs more than the
    // lap time gained by finding extra pace.
    const rate = offTrack ? ADAPTIVE_RATE * 2.5 : ADAPTIVE_RATE;
    this.paceAdaptation = clamp(
      moveToward(this.paceAdaptation, target, rate * dt),
      1 - ADAPTIVE_RANGE,
      1 + ADAPTIVE_RANGE
    );
  }

  #gripLimitedSpeed(curvature) {
    const kappa = Math.abs(curvature);
    if (kappa < 1e-4) return 99;
    const grip = Math.min(this.physics.frontGrip, this.physics.rearGrip) * this.physics.grip;
    return Math.sqrt((grip * 9.81 * 1.55) / kappa);
  }

  /**
 * Put a car that is hopelessly off the road back on the racing line.
 *
 * This is a deliberate arcade affordance, and the reason is blunt: a car that has
 * left the circuit cannot always drive itself back. Its heading error and its
 * cross-track error can both point away from the track, in which case the
 * controller steers it further out with full lock and it drives away down the
 * access road indefinitely. Reversing rarely rescues it either.
 *
 * Rather than let that happen -- which ends races with cars scattered across the
 * countryside and the timing tower showing nonsense -- the car is placed back on
 * the line facing the right way. It costs the driver the time they lost getting
 * there, which is the correct penalty, and the race always finishes.
 *
 * @param {object} physics car state to move
 * @param {object} track built track
 * @param {number} [speed] re-entry speed in m/s
 */
  rescue(physics, track, speed = 14) {
    const located = locateOnTrack(track, physics.x, physics.z, this.trackIndex);
    this.trackIndex = located.index;
    const sample = located.sample;
    const limit = Math.max(0, sample.width * 0.5 - 2.5);
    const offset = clamp(sample.lineOffset, -limit, limit);
    physics.reset(
      sample.x + sample.rightX * offset,
      sample.z + sample.rightZ * offset,
      sample.lineHeading,
      speed
    );
    /** Adaptive pace multiplier, adjusted by how this driver is actually driving. */
    this.paceAdaptation = 1;
    this.offsetBias = 0;
    this.mistakeTimer = 0;
    this.recoveryTimer = 0;
    this.stallTimer = 0;
    this.offTrackTimer = 0;
  }

  reset() {
    /** Adaptive pace multiplier, adjusted by how this driver is actually driving. */
    this.paceAdaptation = 1;
    this.offsetBias = 0;
    this.overtakeIntent = 0;
    this.defendIntent = 0;
    this.mistakeTimer = 0;
    this.reactionDelay = 0;
    this.stallTimer = 0;
    this.recoveryTimer = 0;
    this.offTrackTimer = 0;
    this.trackIndex = 0;
    this.pendingControls = { throttle: 0, brake: 0, steer: 0 };
    this.physics.drsOpen = false;
    this.physics.direction = 1;
  }
}

  /**
 * Soft saturation towards `limit`.
 *
 * Linear up to `KNEE_FRACTION` of the limit, then asymptotic. The knee matters
 * more than it looks: a plain clamp saturates instantly, and a controller that
 * spends its life saturated has no gradient left to work with, so it sits at
 * full lock flapping between corrections. The knee keeps the response
 * proportional through the range the car actually spends time in.
 */
const KNEE_FRACTION = 0.6;

function softLimit(value, limit) {
  if (limit <= 0) return 0;
  const knee = limit * KNEE_FRACTION;
  const magnitude = Math.abs(value);
  if (magnitude <= knee) return value;
  const overflow = (magnitude - knee) / (limit - knee);
  const soft = knee + (limit - knee) * (1 - Math.exp(-overflow));
  return Math.sign(value) * soft;
}
