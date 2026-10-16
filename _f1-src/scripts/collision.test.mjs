/**
 * Contact resolution, tested as a physical claim rather than as code coverage.
 *
 * The assertions that matter are the invariants: two cars cannot stay overlapped,
 * contact cannot create energy, and a shunt cannot teleport a car across the track.
 * Everything else is detail.
 *
 * Run: node scripts/collision-test.mjs
 */

import { installCanvasShim } from './helpers/domShim.mjs';

installCanvasShim();

const { CarPhysics } = await import('../src/physics/CarPhysics.js');
const { CAR_HALF_LENGTH, CAR_HALF_WIDTH, resolveCarContacts } = await import('../src/race/collision.js');

let failures = 0;
function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ok    ${label}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${label}${detail ? `  -- ${detail}` : ''}`);
  }
}

/** A car at a given place, pointing somewhere. */
function carAt(x, z, heading = 0, speed = 0) {
  const physics = new CarPhysics();
  physics.reset(x, z, heading, speed);
  return { physics, entry: { short: 'T' }, contact: null };
}

/**
 * Overlap between two cars: the shallowest separation on any of their own axes, in metres.
 *
 * Positive means the bodies interpenetrate by that much, so `<= 0.05` is the claim that the
 * resolver pushed them apart. A negative value is the gap between them, which is what the
 * detail strings print when the cars are simply close.
 */
function overlap(a, b) {
  const pa = a.physics;
  const pb = b.physics;
  const dx = pb.x - pa.x;
  const dz = pb.z - pa.z;
  let overlap = Infinity;
  for (const c of [pa, pb]) {
    const cos = Math.cos(c.heading);
    const sin = Math.sin(c.heading);
    const other = c === pa ? pb : pa;
    const otherCos = Math.cos(other.heading);
    const otherSin = Math.sin(other.heading);
    /*
     * Only the two axes of this car are needed: four is the true separating-axis test for
     * two oriented boxes, and the other car's pair is the same measurement from the other
     * side.
     *
     * Each axis measures the distance between the centres projected onto it, minus both
     * cars' extents along it. The other car's extent is its own half extents projected onto
     * this axis, and that projection is the measurement. It was missing once: the version
     * this replaces subtracted `|d·axis| + a half extent` from `|d·axis|`, the same quantity
     * computed twice, so every axis came out at exactly minus a half length, every call
     * returned the same number, and `overlap(a, b) <= 0.05` -- the only check that a shunt
     * does not merge two cars into one -- was true by construction and could not fail.
     */
    for (const [ax, az, half] of [
      [cos, sin, CAR_HALF_LENGTH],
      [-sin, cos, CAR_HALF_WIDTH]
    ]) {
      const otherHalf =
        Math.abs(otherCos * ax + otherSin * az) * CAR_HALF_LENGTH +
        Math.abs(-otherSin * ax + otherCos * az) * CAR_HALF_WIDTH;
      overlap = Math.min(overlap, half + otherHalf - Math.abs(dx * ax + dz * az));
    }
  }
  return overlap;
}

const kinetic = (car) => {
  const v = car.physics.worldVelocity();
  return 0.5 * (v.vx * v.vx + v.vz * v.vz);
};

/*
 * The measurement itself, against two arrangements whose answers are known by hand.
 *
 * This is the check the file was missing. The helper used to subtract the term it was
 * measuring from itself -- `|d·axis|` twice, on the same axis -- so every call returned minus
 * a half width whatever the cars were doing, and the assertion that a shunt does not merge two
 * cars could not fail. A measurement that no arrangement can move is worse than no
 * measurement, because the check around it still reports `ok`.
 */
console.log('the overlap measurement');
{
  const a = carAt(0, 0, 0);
  const noseToTail = carAt(12, 0, 0);
  check('a known gap measures as that gap', Math.abs(overlap(a, noseToTail) + 6.8) < 1e-9,
    `12m apart, 5.2m of car: -6.80m expected, got ${overlap(a, noseToTail).toFixed(2)}m`);

  const inside = carAt(4.2, 0, 0);
  check('a known overlap measures as that overlap', Math.abs(overlap(a, inside) - 1.0) < 1e-9,
    `1m inside each other: +1.00m expected, got ${overlap(a, inside).toFixed(2)}m`);
}

console.log('nose to tail');
{
  const a = carAt(0, 0, 0, 40);
  const b = carAt(12, 0, 0, 40); // 12m apart, 5.2m long, so a 6.8m gap
  const before = kinetic(a) + kinetic(b);

  for (let i = 0; i < 40; i += 1) {
    // Drive them together at a closing speed, as if the car behind never lifted.
    a.physics.x += 20 / 60;
    resolveCarContacts([a, b]);
  }

  /*
   * The tolerance is the resolver's own resting overlap, not a token.
   *
   * `resolveCarContacts` leaves `SLOP` (3cm) of every overlap alone and takes back 55% of the
   * rest per step, which is what stops a shunt from jittering between overlapped and apart.
   * The car behind here closes at a full 20m/s in 1/60s steps, so the pair settles where the
   * 0.33m added per step is removed per step: 0.30m, which is what it measures. That is the
   * claim -- that it settles there rather than growing until the cars are inside each other.
   * The 0.05 this used to assert could never have held; it passed because the helper always
   * returned the same negative number.
   */
  check('the car behind does not pass through the car ahead', overlap(a, b) <= 0.35,
    `overlap ${overlap(a, b).toFixed(2)}m`);
  check('contact is recorded', Boolean(a.contact) && a.contact.other === 'T');
  check('contact names the other car', a.contact?.other === 'T' && b.contact?.other === 'T');
  check('the car ahead is pushed forwards', b.physics.x > a.physics.x, `${a.physics.x.toFixed(1)} vs ${b.physics.x.toFixed(1)}`);
  // Compared with a relative tolerance: these are sums of squares of velocities
  // integrated over hundreds of steps, so an absolute epsilon is meaningless.
  const after = kinetic(a) + kinetic(b);
  check('no energy is created', after <= before * 1.0001,
    `${after.toFixed(4)} vs ${before.toFixed(4)} (${(((after - before) / before) * 100).toFixed(5)}%)`);
  check('both cars keep rolling', a.physics.speed > 5 && b.physics.speed > 5,
    `${a.physics.speed.toFixed(1)} / ${b.physics.speed.toFixed(1)} m/s`);
}

console.log('\nside by side, same speed');
{
  // The case a circle-approximation gets wrong: 2m apart laterally, which is a
  // car's width apart, so these must NOT be treated as touching.
  const a = carAt(0, 0, 0, 40);
  const b = carAt(0, 2.4, 0, 40);
  resolveCarContacts([a, b]);
  check('two cars a body-width apart are not pushed apart', Math.abs(b.physics.z) <= 2.4 + 1e-6,
    `z moved to ${b.physics.z.toFixed(3)}`);
  check('no contact is reported', a.contact === null);
}

console.log('\nside by side, overlapping');
{
  const a = carAt(0, 0, 0, 40);
  const b = carAt(0, 1.2, 0, 40); // half a body width: overlapping
  for (let i = 0; i < 60; i += 1) resolveCarContacts([a, b]);
  check('overlapping cars are pushed to opposite sides', a.physics.z * b.physics.z <= 0,
    `${a.physics.z.toFixed(2)} / ${b.physics.z.toFixed(2)}`);
  check('they end up separated', Math.abs(a.physics.z - b.physics.z) >= 2.0 - 0.05,
    `gap ${Math.abs(a.physics.z - b.physics.z).toFixed(2)}m`);
}

console.log('\npunt down the side');
{
  const a = carAt(0, 0, 0, 30);
  const b = carAt(3, 0.6, 0, 30); // overlapping, offset to one side
  resolveCarContacts([a, b]);
  check('the struck car is rotated off its line', Math.abs(b.physics.yawRate) > 0.05,
    `yawRate ${b.physics.yawRate.toFixed(3)}`);
  check('the yaw kick is bounded', Math.abs(b.physics.yawRate) <= 1.2,
    `yawRate ${b.physics.yawRate.toFixed(3)}`);
  check('the striking car is also disturbed', Math.abs(a.physics.yawRate) > 0,
    `yawRate ${a.physics.yawRate.toFixed(3)}`);
}

console.log('\nthe direction of the rotation, not just its size');
{
  /*
   * A shove on a car's front-right corner must swing its nose left, away from the car that
   * shoved it. The sign of that kick is what makes contact a deflection rather than a
   * magnet, and it is the one thing an |yawRate| > 0.05 assertion cannot see: with the
   * normal passed in the a-to-b direction instead of the direction of the push, every
   * collision rotated both cars *into* each other and the bounds check above still passed.
   */
  const victim = carAt(0, 0, 0, 30);
  const striker = carAt(1.2, 1.6, 0, 30); // ahead and to the victim's right
  resolveCarContacts([victim, striker]);
  check(
    'a rub on the front-right rotates the victim away from the striker',
    victim.physics.yawRate < 0,
    `yawRate ${victim.physics.yawRate.toFixed(3)}`
  );
  check(
    'and the lateral push agrees with the rotation',
    victim.physics.vLat < 0,
    `vLat ${victim.physics.vLat.toFixed(3)}`
  );
}

console.log('\ndegenerate overlap');
{
  // Exactly the same point: no separation vector can be derived from position.
  const a = carAt(50, 50, 0, 20);
  const b = carAt(50, 50, 1.2, 20);
  resolveCarContacts([a, b]);
  check('coincident cars do not divide by zero', Number.isFinite(a.physics.x) && Number.isFinite(a.physics.vLong));
  check('coincident cars are separated', Math.hypot(b.physics.x - a.physics.x, b.physics.z - a.physics.z) > 1);
}

console.log('\nrepeated contact settles');
{
  // Cars held in contact every frame must not drift apart without limit or jitter.
  const a = carAt(0, 0, 0, 35);
  const b = carAt(4.2, 0, 0, 35);
  let maxDrift = 0;
  for (let i = 0; i < 240; i += 1) {
    resolveCarContacts([a, b]);
    maxDrift = Math.max(maxDrift, Math.abs(b.physics.x - a.physics.x));
  }
  const separation = b.physics.x - a.physics.x;
  check('separation settles near the car length', separation > 2 && separation < 8,
    `${separation.toFixed(2)}m`);
  check('contact does not teleport the cars', maxDrift < 20, `max gap ${maxDrift.toFixed(1)}m`);
  check('contact persists while they are still touching', a.contact !== null);

  // Drive one away, then confirm the effect is not left hanging forever.
  b.physics.x += 40;
  for (let i = 0; i < 60; i += 1) resolveCarContacts([a, b]);
  check('contact expires once they are apart', a.contact === null);
}

console.log('\nthe contact lifetime is measured in the caller\'s seconds');
{
  /*
   * The age was advanced by a hard-coded 1/60 while the session steps at 1/120, so a contact
   * meant to stay visible for 0.6s stayed for 1.2s of race time -- and any other caller (a
   * bench, a replay, a slower machine) stretched it by whatever the ratio happened to be.
   * `resolveCarContacts` takes the step it is being run at now.
   */
  const STEP = 1 / 120;
  const a = carAt(0, 0, 0, 35);
  const b = carAt(4.2, 0, 0, 35);
  resolveCarContacts([a, b], STEP);
  check('a contact exists to age', a.contact !== null);

  // Half a second of the caller's own seconds: still inside the effect's 0.6s life.
  b.physics.x += 40;
  for (let i = 0; i < 60; i += 1) resolveCarContacts([a, b], STEP);
  check('contact survives half a second of race time', a.contact !== null,
    `age ${a.contact ? a.contact.age.toFixed(3) : 'gone'}`);

  for (let i = 0; i < 30; i += 1) resolveCarContacts([a, b], STEP);
  check('and is gone once it is over', a.contact === null);
}

console.log(`\n${failures === 0 ? 'all contact assertions hold' : `${failures} assertion(s) failed`}`);
process.exitCode = failures === 0 ? 0 : 1;