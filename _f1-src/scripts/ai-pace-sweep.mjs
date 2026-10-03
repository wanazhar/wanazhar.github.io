/**
 * Sweep the AI's pace safety factor against lap time and time spent off track.
 *
 * The AI has driven at `PACE_SAFETY = 0.86` of the generated speed profile for a
 * long time, described as margin because it was arriving at corners too fast and
 * spinning. That is a blanket fudge on the target speed, not a control limit, and
 * it costs roughly a third of the achievable lap time.
 *
 * The question this answers is whether 0.86 is actually the optimum or a stale
 * number that has been carried forward unexamined. Because more pace is not
 * automatically better -- a car that spins loses far more time than it gains --
 * every candidate is measured on both lap time and off-track time. The number to
 * pick is the fastest one that does not run wide.
 *
 * Run: node scripts/ai-pace-sweep.mjs [circuitId]
 */

import { installCanvasShim } from './helpers/domShim.mjs';

installCanvasShim();

const { buildTrack, locateOnTrack } = await import('../src/track/trackGeometry.js');
const { CIRCUITS, getCircuit } = await import('../src/track/circuits.js');
const { AIDriver, setPaceSafety } = await import('../src/ai/AIDriver.js');
const { CarPhysics } = await import('../src/physics/CarPhysics.js');
const { SKILL_PRESETS } = await import('../src/physics/drivers.js');
const { createRandom } = await import('../src/util/math.js');

const DT = 1 / 60;
const CANDIDATES = [0.8, 0.86, 0.9, 0.93, 0.96, 0.98, 1.0, 1.03];

/**
 * Drive a car for a fixed simulated time and report what happened.
 *
 * Fixed time rather than a fixed lap count, so a candidate that crashes spends its
 * budget recovering instead of being quietly given a clean lap.
 */
function run(circuit, skill, paceSafety, seconds = 420) {
  const track = buildTrack(circuit);
  setPaceSafety(paceSafety);

  const random = createRandom(7);
  const car = new CarPhysics();
  car.reset(track.samples[0].x, track.samples[0].z, track.samples[0].heading, 45);
  const driver = new AIDriver(car, SKILL_PRESETS[skill], { track, name: 'probe', random });
  driver.reset();

  let hint = 0;
  let lastDistance = 0;
  let lapIndex = 0;
  let lapStart = null;
  let offRoad = 0;
  let steps = 0;
  const lapTimes = [];

  for (let step = 0; step < seconds / DT; step += 1) {
    const controls = driver.update(DT);
    car.step(DT, controls, { grip: circuit.grip ?? 1 });
    steps += 1;

    const located = locateOnTrack(track, car.x, car.z, hint);
    hint = located.index;
    const sample = located.sample;

    /*
     * Lap counting by crossing the start line.
     *
     * The obvious test -- "distance went backwards" -- does not work: the car
     * covers ground irregularly, so it briefly reads a smaller `s` mid-corner on
     * any tight section and registers a lap that never happened. Requiring a
     * transition from the far side of the lap to just after the line is the only
     * version that is not fooled by that.
     */
    if (lastDistance > track.length * 0.75 && sample.s < track.length * 0.25) {
      if (lapStart !== null) lapTimes.push(step * DT - lapStart);
      lapStart = step * DT;
      lapIndex += 1;
    }
    lastDistance = sample.s;
    if (Math.abs(located.lateral) > sample.width * 0.5) offRoad += 1;
  }

  // Lap time the profile implies.
  let profileTime = 0;
  for (const sample of track.samples) {
    if (sample.targetSpeed > 1) profileTime += track.step / sample.targetSpeed;
  }

  // Ignore the first lap: the car starts at 45 kph, not on the racing line.
  const usable = lapTimes.slice(1);
  return {
    best: usable.length ? Math.min(...usable) : null,
    mean: usable.length ? usable.reduce((a, b) => a + b, 0) / usable.length : null,
    laps: usable.length,
    offRoad: offRoad / steps,
    profileTime
  };
}

const circuitId = process.argv[2];
const circuits = circuitId ? [getCircuit(circuitId)] : [getCircuit('melbourne'), getCircuit('bahrain'), getCircuit('spa')];
const skill = process.env.AI_SKILL ?? 'ace';

console.log(`AI pace sweep. skill=${skill}\n`);

for (const circuit of circuits) {
  console.log(`${circuit.name}  (profile lap ${buildTrack(circuit).lapRecord.toFixed(1)}s)`);
  console.log('  safety   best lap   vs profile   mean lap   laps   off track');
  for (const candidate of CANDIDATES) {
    const result = run(circuit, skill, candidate);
    const ratio = result.best ? result.best / result.profileTime : NaN;
    console.log(
      `  ${candidate.toFixed(2)}    ` +
        `${(result.best ? result.best.toFixed(1) : '--').padStart(7)}s ` +
        `${(Number.isFinite(ratio) ? `${ratio.toFixed(2)}x` : '--').padStart(10)} ` +
        `${(result.mean ? result.mean.toFixed(1) : '--').padStart(8)}s ` +
        `${String(result.laps).padStart(6)} ` +
        `${(result.offRoad * 100).toFixed(1).padStart(9)}%`
    );
  }
  console.log('');
}

setPaceSafety(0.86);