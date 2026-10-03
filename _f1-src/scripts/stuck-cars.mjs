/**
 * Why does Montreal not finish?
 *
 * A handful of AI cars stop completing laps, the session never ends, and the round
 * times out. Suzuka had the same symptom and turned out to be a degenerate
 * centreline; Montreal needs to be distinguished from that case rather than
 * assumed to be it.
 *
 * This runs one session and reports, per car: how far round the lap it got, its
 * speed when it stopped, and whether it is against a barrier. A car stuck against
 * a wall and a car spinning in place look identical from the results screen.
 *
 * Run: node scripts/stuck-cars.mjs [circuitId]
 */

import { installCanvasShim } from './helpers/domShim.mjs';

installCanvasShim();

const { buildTrack, locateOnTrack } = await import('../src/track/trackGeometry.js');
const { getCircuit } = await import('../src/track/circuits.js');
const { FIXED_TIMESTEP, RaceSession, SESSION_TYPE } = await import('../src/race/RaceSession.js');
const { quickRaceEntries } = await import('../src/race/quickRace.js');
const { AIDriver } = await import('../src/ai/AIDriver.js');
const { SKILL_PRESETS } = await import('../src/physics/drivers.js');
const { createRandom } = await import('../src/util/math.js');

const circuitId = process.argv[2] ?? 'montreal';
const circuit = getCircuit(circuitId);
const track = buildTrack(circuit);
const random = createRandom(20240218);

console.log(`${circuit.name}  ${(track.length / 1000).toFixed(3)}km  ${track.count} samples\n`);

// Hand every car, including the player's, to the AI so the session is unattended.
const session = new RaceSession({
  track,
  entries: quickRaceEntries('Ferrari'),
  type: SESSION_TYPE.race,
  totalLaps: 2,
  random
});
for (const car of session.cars) {
  car.isPlayer = false;
  car.ai = new AIDriver(car.physics, SKILL_PRESETS.strong, { track, name: car.entry.short, random });
  car.ai.reset();
}

/** Where on the lap, and how fast, for each car. */
const snapshot = () =>
  session.cars.map((car) => {
    const located = locateOnTrack(track, car.physics.x, car.physics.z, null);
    const lateral = located.index >= 0
      ? Math.hypot(car.physics.x - track.samples[located.index].x, car.physics.z - track.samples[located.index].z)
      : Infinity;
    return {
      short: car.entry.short,
      progress: car.progress ?? 0,
      distance: located.index >= 0 ? located.sample.s : -1,
      speed: car.physics.speed,
      lateral,
      width: located.index >= 0 ? track.samples[located.index].width : 0,
      offRoad: lateral > (located.index >= 0 ? track.samples[located.index].width : 0),
      recovering: Boolean(car.ai?.recovering ?? car.recovering),
      finished: car.finished === true
    };
  });

const idle = { throttle: 0, brake: 0, steer: 0, handbrake: false };
const maxSteps = 60 * 240;
let steps = 0;
const history = [];

while (!session.finished && steps < maxSteps) {
  session.update(FIXED_TIMESTEP, idle);
  steps += 1;
  if (steps % (60 * 20) === 0) history.push([steps, snapshot()]);
}

console.log(`finished: ${session.finished}  after ${(steps * FIXED_TIMESTEP).toFixed(0)} simulated seconds\n`);

const final = snapshot();
console.log('car   progress   lapPos(m)   speed   lateral   offRoad  recovering  finished');
for (const row of final) {
  console.log(
    `${row.short.padEnd(5)} ${row.progress.toFixed(3).padStart(8)} ${String(Math.round(row.distance)).padStart(10)} ` +
      `${row.speed.toFixed(1).padStart(7)} ${row.lateral.toFixed(1).padStart(9)} ${String(row.offRoad).padStart(8)} ` +
      `${String(row.recovering).padStart(11)} ${String(row.finished).padStart(9)}`
  );
}

console.log('\nprogress over time (a stalled car stops advancing):');
const codes = final.map((row) => row.short);
console.log('        ' + codes.map((c) => c.padStart(5)).join(''));
for (const [step, rows] of history) {
  console.log(
    `${String(Math.round(step * FIXED_TIMESTEP)).padStart(6)}s ` +
      rows.map((r) => r.progress.toFixed(2).padStart(5)).join('')
  );
}