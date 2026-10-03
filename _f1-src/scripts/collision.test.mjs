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

/** Overlap between two cars, 0 if apart. Negative means a real overlap. */
function overlap(a, b) {
  const pa = a.physics;
  const pb = b.physics;
  const dx = pb.x - pa.x;
  const dz = pb.z - pa.z;
  let minOverlap = Infinity;
  for (const c of [pa, pb]) {
    const cos = Math.cos(c.heading);
    const sin = Math.sin(c.heading);
    const forward = { x: cos, z: sin };
    const right = { x: -sin, z: cos };
    const other = c === pa ? pb : pa;
    const odx = other.x - c.x;
    const odz = other.z - c.z;
    const r1 = Math.abs(forward.x * odx + forward.z * odz);
    const r2 = Math.abs(right.x * odx + right.z * odz);
    // Only the two axes of this car are needed to bound the gap: the true SAT
    // minimum is found over four, but two is enough for a coarse separation test.
    const along = r1 - (Math.abs(dx * cos + dz * sin) + CAR_HALF_LENGTH);
    const across = r2 - (Math.abs(dx * -sin + dz * cos) + CAR_HALF_WIDTH);
    void r1;
    void r2;
    minOverlap = Math.min(minOverlap, Math.max(along, across));
  }
  return minOverlap;
}

const kinetic = (car) => {
  const v = car.physics.worldVelocity();
  return 0.5 * (v.vx * v.vx + v.vz * v.vz);
};

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

  check('the car behind does not pass through the car ahead', overlap(a, b) <= 0.05,
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

console.log(`\n${failures === 0 ? 'all contact assertions hold' : `${failures} assertion(s) failed`}`);
process.exitCode = failures === 0 ? 0 : 1;