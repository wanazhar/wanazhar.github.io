/**
 * Car-to-car contact.
 *
 * The physics model has no rigid bodies: cars carry a position, a heading and a
 * body-frame velocity, and nothing else. Contact therefore has to be resolved here,
 * as a positional correction plus an impulse, or the cars pass through each other.
 *
 * ## Shape
 *
 * Each car is an oriented box, 5.2m x 2.0m -- roughly a modern F1 car, which is
 * about as long as it is wide in the model that has to be navigated by feel. A
 * circle would be wrong in the only direction that matters: two cars side by side
 * are 2m apart laterally, and a circle wide enough to represent the car's length
 * (5.2m) would push them apart when they are nowhere near touching.
 *
 * ## Method
 *
 * Separating Axis Theorem over four candidate axes (each car's forward and right).
 * For two rectangles that is exact, and at 23 cars the broadphase rejects nearly
 * every pair before it matters. An earlier two-circles-per-car approximation was
 * close enough to feel fine and visibly wrong when two cars overlapped at an
 * angle, which is exactly when anyone is looking.
 *
 * ## Feel
 *
 * Restitution is deliberately low. Two F1 cars meeting at 40m/s do not bounce, they
 * lose speed: the contact patch scrubs it and the cars deflect. A springy
 * collision reads as arcade, and it also lets a shunt *add* energy to a car that was
 * already going faster than the one it hit, which breaks the racing.
 *
 * So the energy loss comes from two places instead: the inelastic impulse, and the
 * yaw kick. A car hit on the side is rotated off its line, which is what actually
 * costs the driver time -- far more than the speed it loses.
 */

import { clamp } from '../util/math.js';

/** Half-length and half-width of a car, metres. */
export const CAR_HALF_LENGTH = 2.6;
export const CAR_HALF_WIDTH = 1.0;

/** Mass of car plus driver, kg. Used only to size impulses; equal for every car. */
export const CAR_MASS = 800;

/**
 * Fraction of closing speed returned after contact.
 *
 * Low on purpose. See the module note -- a shunt deflects cars, it does not bounce
 * them, and a restitution high enough to look springy lets the faster car leave the
 * contact faster than it arrived.
 */
const RESTITUTION = 0.12;

/**
 * How much of the overlap is corrected per frame.
 *
 * Full correction in one frame is exact but visibly pops cars apart, because one
 * frame of penetration at closing speed is a large distance. Correcting most of it
 * over a few frames is indistinguishable in motion.
 */
const CORRECTION = 0.55;

/**
 * Overlap left uncorrected, metres.
 *
 * Without this, two cars held together by the correction alone jitter forever,
 * because the correction is reapplied every frame from a penetration that is
 * recomputed from scratch. A small allowance stops the loop.
 */
const SLOP = 0.03;

/**
 * Yaw kick per newton-second of impulse, per metre of lever arm.
 *
 * Sized against grip, which is the constraint that actually matters here. A yaw
 * rate of `w` at speed `v` demands `w * v` of lateral velocity, and the tyres can
 * only hold about 1.6g. At 40 m/s that is ~15 m/s of lateral velocity, so any kick
 * above roughly 0.3 rad/s is unrecoverable: the car is sideways before the driver
 * has finished reacting, and an AI that cannot catch a spin sits in the barriers
 * for the rest of the race.
 *
 * The cap is set well under that limit on purpose. A shunt should cost a driver a
 * tenth of a second and a moment of attention, not the race.
 */
const YAW_KICK = 0.004;

/** Ceiling on the yaw kick, rad/s. Below what the tyres can hold, by design. */
const YAW_KICK_MAX = 0.18;

/**
 * Separating velocity bought per metre of overlap, m/s per m.
 *
 * The standard Baumgarte term. It matters for the wheel-to-wheel case, where two
 * cars overlap sideways at the same speed and so have no closing velocity to
 * convert into a shove -- without it, contact in that case is silent.
 */
const SEPARATION_BIAS = 2.0;

/**
 * Ceiling on that separating velocity, m/s.
 *
 * Also grip-bounded, for the same reason as the yaw cap. A shove is a velocity
 * change, so a large one is not recoverable by steering: it just puts the car
 * somewhere it cannot drive out of. Anything above a few m/s of lateral shove at
 * racing speed exceeds what grip can hold.
 */
const MAX_SEPARATION_BIAS = 1.2;

/** Cars further apart than this cannot be touching. Conservative: the diagonal of the box. */
const BROADPHASE_DISTANCE = CAR_HALF_LENGTH * 2 + 1;

/** Seconds a contact effect stays visible after the collision frame. */
const CONTACT_TTL = 0.6;

/**
 * Resolve every contact in the field.
 *
 * Called once per substep, after all cars have been integrated -- not inside the
 * per-car loop. Resolving inside the loop means the first car processed is moved
 * out of the way before the second is even tested, so which car "wins" a shunt
 * depends on grid order.
 *
 * @param {Array<{physics: object, retired?: boolean, finished?: boolean}>} cars
 */
export function resolveCarContacts(cars) {
  // Fade the previous frame's effects. Cars are appended in grid order, so this has
  // to walk the live list, not a snapshot taken before it was built.
  for (const car of cars) {
    car.touching = false;
    if (car.contact && car.contact.age >= CONTACT_TTL) car.contact = null;
    else if (car.contact) car.contact.age += 1 / 60;
  }

  for (let i = 0; i < cars.length; i += 1) {
    const a = cars[i];
    for (let j = i + 1; j < cars.length; j += 1) {
      resolvePair(a, cars[j]);
    }
  }
}

/**
 * Resolve the contact between two cars, if they are touching.
 * @param {object} a
 * @param {object} b
 */
function resolvePair(a, b) {
  const pa = a.physics;
  const pb = b.physics;

  const dx = pb.x - pa.x;
  const dz = pb.z - pa.z;
  if (dx * dx + dz * dz > BROADPHASE_DISTANCE * BROADPHASE_DISTANCE) return;

  const axes = boxAxes(pa);
  const axesB = boxAxes(pb);

  // Separating Axis Theorem: slide both boxes onto each candidate axis. If the
  // projected intervals do not overlap, the boxes are apart on that axis and
  // cannot be touching.
  let minOverlap = Infinity;
  let nx = 0;
  let nz = 0;
  let separated = false;

  for (const axis of [axes.forward, axes.right, axesB.forward, axesB.right]) {
    const radiusA = Math.abs(axis.x * axes.forward.x + axis.z * axes.forward.z) * CAR_HALF_LENGTH +
      Math.abs(axis.x * axes.right.x + axis.z * axes.right.z) * CAR_HALF_WIDTH;
    const radiusB = Math.abs(axis.x * axesB.forward.x + axis.z * axesB.forward.z) * CAR_HALF_LENGTH +
      Math.abs(axis.x * axesB.right.x + axis.z * axesB.right.z) * CAR_HALF_WIDTH;

    const distance = dx * axis.x + dz * axis.z;
    const overlap = radiusA + radiusB - Math.abs(distance);
    if (overlap <= 0) {
      separated = true;
      break;
    }
    if (overlap < minOverlap) {
      minOverlap = overlap;
      // Point the normal from a to b. The axis itself is only a line, and the
      // boxes can overlap on the far side of it.
      const sign = distance < 0 ? -1 : 1;
      nx = axis.x * sign;
      nz = axis.z * sign;
    }
  }

  if (separated) return;

  /*
   * Degenerate case: two cars at exactly the same point give a zero-length
   * separation vector, and every axis "overlaps" by the same amount. Pick a fixed
   * axis so the outcome is at least deterministic and they do end up on either
   * side of each other.
   */
  if (minOverlap === Infinity || (nx === 0 && nz === 0)) {
    nx = 1;
    nz = 0;
    minOverlap = CAR_HALF_LENGTH;
  }

  /*
   * Positional correction.
   *
   * Equal mass, so each car moves half the overlap. Moved along the contact
   * normal, not along the direction of relative velocity: pushing along the
   * velocity would resolve a nose-to-tail shunt by shoving the car ahead forwards
   * and the car behind backwards, leaving them overlapped.
   */
  const correction = Math.max(minOverlap - SLOP, 0) * CORRECTION * 0.5;
  if (correction > 0) {
    pa.x -= nx * correction;
    pa.z -= nz * correction;
    pb.x += nx * correction;
    pb.z += nz * correction;
  }

  /*
   * Impulse.
   *
   * Only the component of relative velocity *along* the normal is cancelled.
   * Cancelling the whole relative velocity would stop both cars dead, which is
   * not what contact does -- a car rear-ends another and both keep moving
   * forwards, the one behind just stops accelerating.
   */
  /*
   * Is this a new contact, or a continuation of one already being resolved?
   *
   * This gate is what stops contact from pumping energy. The separating bias below
   * exists to make the *onset* of an overlap felt, but positional correction is
   * what resolves an ongoing one -- so applying the bias on every frame while two
   * cars remain overlapped adds a fresh shove each frame, and two cars held
   * together accelerate apart without limit. A car leaning on another for a whole
   * corner would leave the corner faster than it entered.
   *
   * Restricting it to the onset frame means a shunt is felt once, and sustained
   * contact is resolved by position alone.
   */
  const shortA = a.entry?.short ?? null;
  const shortB = b.entry?.short ?? null;
  const sustained = Boolean(a.contact && b.contact && a.contact.other === shortB && b.contact.other === shortA);

  const va = pa.worldVelocity();
  const vb = pb.worldVelocity();
  const relativeX = vb.vx - va.vx;
  const relativeZ = vb.vz - va.vz;
  const closing = relativeX * nx + relativeZ * nz;

  /*
   * Separating velocity owed to the overlap itself, independent of closing speed.
   *
   * Without this, two cars travelling at the same speed and overlapping sideways
   * generate no impulse at all -- their relative velocity along the normal is
   * zero -- so they are corrected positionally and drift apart with no shove. That
   * is precisely the wheel-to-wheel case, and it is the case where a shunt has to
   * be felt.
   */
  const bias = sustained
    ? 0
    : Math.min(Math.max(minOverlap - SLOP, 0) * SEPARATION_BIAS, MAX_SEPARATION_BIAS);
  const wanted = Math.max(0, -closing) * (1 + RESTITUTION) + bias;

  let magnitude = 0;
  if (wanted > 0) {
    // Equal masses cancel to 2/M, so j = wanted * M / 2.
    magnitude = (wanted * CAR_MASS) / 2;
    const impulseX = (nx * magnitude) / CAR_MASS;
    const impulseZ = (nz * magnitude) / CAR_MASS;
    pa.applyWorldImpulse(-impulseX, -impulseZ);
    pb.applyWorldImpulse(impulseX, impulseZ);
  }

  recordContact(a, b, magnitude);
  recordContact(b, a, magnitude);

  applyYawKick(a, dx, dz, nx, nz, magnitude);
  applyYawKick(b, -dx, -dz, -nx, -nz, magnitude);
}

/**
 * Apply the rotational part of a shunt.
 *
 * A force through the centre of mass spins nothing. What actually rotates a car is
 * *where along its length* the contact happens: a shove on the front corner spins it
 * one way, the same shove on the rear corner spins it the other, and a dead-centre
 * push does not rotate it at all. That is the whole difference between a shunt that
 * costs a driver a second and one that ends their race.
 *
 * So the lever arm is taken from where the other car's centre sits relative to this
 * car's own centre, projected onto this car's heading -- not from the direction the
 * contact normal points. The normal cannot give it: for a car alongside, the normal
 * is purely lateral and has no longitudinal component at all, so deriving the lever
 * from it silently produces no rotation in exactly the wheel-to-wheel case that
 * most needs it.
 *
 * @param {object} struck the car taking the hit
 * @param {number} ox offset from struck to striker, along struck's heading, metres
 * @param {number} oz offset from struck to striker, across struck's heading, metres
 * @param {number} nx contact normal, pointing into `struck`
 * @param {number} nz
 * @param {number} magnitude impulse magnitude in N*s
 */
function applyYawKick(struck, ox, oz, nx, nz, magnitude) {
  if (magnitude <= 0) return;

  const cos = Math.cos(struck.physics.heading);
  const sin = Math.sin(struck.physics.heading);

  // Which side the push is on: positive is the struck car's right.
  const lateral = nx * -sin + nz * cos;

  // How far forward (+) or behind (-) the contact is, as a fraction of the car.
  const lever = clamp((ox * cos + oz * sin) / CAR_HALF_LENGTH, -1, 1);

  // Positive pushes the nose toward the direction of the force; negative drags the
  // rear that way and the nose swings out instead.
  const kick = clamp(lateral * lever * magnitude * YAW_KICK, -YAW_KICK_MAX, YAW_KICK_MAX);
  struck.physics.yawRate += kick;

  struck.striker = struck.striker ?? null;
}

/**
 * Note a contact on both cars, for effects and for the AI.
 *
 * `severity` is the closing speed, in m/s, which is what a shunt is judged by --
 * a 2m/s scrape and a 30m/s impact are not the same event and should not sound or
 * look alike.
 */
function recordContact(a, b, magnitude) {
  const severity = magnitude / CAR_MASS;
  for (const [car, otherShort] of [[a, b.entry?.short ?? null], [b, a.entry?.short ?? null]]) {
    // `touching` is the physical fact for this frame; `contact` is the fading
    // effect for the renderer. They are separate because two cars grinding along
    // each other for three seconds are touching every frame but are a single
    // event, and an effect that restarts every frame never stops.
    car.touching = true;
    if (car.contact && car.contact.other === otherShort) {
      car.contact.severity = Math.max(car.contact.severity, severity);
      return;
    }
    car.contact = { other: otherShort, severity, age: 0 };
  }
}

/** The car's forward and right axes in world space. */
function boxAxes(physics) {
  const cos = Math.cos(physics.heading);
  const sin = Math.sin(physics.heading);
  return {
    forward: { x: cos, z: sin },
    right: { x: -sin, z: cos }
  };
}

/**
 * Is a car currently touching another car?
 *
 * The AI asks this before committing to a line: a car alongside has its own plans,
 * and an AI that keeps driving into the side of another car looks like a bug rather
 * than a race. This is the physical fact for this frame, not the fading effect, so
 * two cars grinding along each other correctly keep reporting contact for as long
 * as they are actually touching.
 */
export function inContact(car) {
  return car.touching === true;
}