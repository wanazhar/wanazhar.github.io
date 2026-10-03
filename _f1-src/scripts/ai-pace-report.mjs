/**
 * Where does the AI actually lose time?
 *
 * The AI laps roughly 30-45% slower than the speed profile the track generator
 * produces, and that gap has been sitting there for a while. "Tune the gains" has
 * already been tried (`tune-ai.mjs`) and moved it a little, so the question now is
 * *where* the time goes.
 *
 * The profile says a target speed for every point on the lap. If the AI were
 * following it, lap time would be `sum(distance / targetSpeed)`. So compare, at
 * every sample: the speed the profile asks for against the speed the car actually
 * has. The deficit, broken down by how tight the corner is, says whether the AI is
 * slow everywhere (a systemic problem: steering lag, understeer, wrong gains) or
 * slow only at corner entries (a braking problem) or only at apexes (a grip
 * problem).
 *
 * Run: node scripts/ai-pace-report.mjs [circuitId]
 */

import { installCanvasShim } from './helpers/domShim.mjs';

installCanvasShim();

const { buildTrack } = await import('../src/track/trackGeometry.js');
const { CIRCUITS, getCircuit } = await import('../src/track/circuits.js');
const { AIDriver } = await import('../src/ai/AIDriver.js');
const { CarPhysics } = await import('../src/physics/CarPhysics.js');
const { SKILL_PRESETS } = await import('../src/physics/drivers.js');
const { createRandom } = await import('../src/util/math.js');

const DT = 1 / 60;

/** Corner bands by |curvature|, and the radius each implies at 1.6g-ish grip. */
const BANDS = [
  { name: 'straight  (R>400m)', max: 0.0025 },
  { name: 'fast kink (200-400m)', max: 0.005 },
  { name: 'fast      (80-200m)', max: 0.0125 },
  { name: 'medium    (40-80m)', max: 0.025 },
  { name: 'slow      (25-40m)', max: 0.04 },
  { name: 'hairpin   (<25m)', max: Infinity }
];

function bandOf(curvature) {
  const magnitude = Math.abs(curvature);
  for (const band of BANDS) if (magnitude < band.max) return band.name;
  return BANDS[BANDS.length - 1].name;
}

const { locateOnTrack } = await import('../src/track/trackGeometry.js');

/**
 * Drive two laps and measure lap two.
 *
 * Lap one is skipped deliberately: the car starts at 45 kph rather than on the
 * racing line, so its first circuit through is slower for reasons that have nothing
 * to do with how the AI drives.
 */
function analyse(circuit) {
  const track = buildTrack(circuit);
  const random = createRandom(7);
  const car = new CarPhysics();
  car.reset(track.samples[0].x, track.samples[0].z, track.samples[0].heading, 45);
  const driver = new AIDriver(car, SKILL_PRESETS.ace, { track, name: 'probe', random });
  driver.reset();

  let hint = 0;
  let lapIndex = 0;
  let lastDistance = 0;
  let offRoad = 0;
  let steps = 0;
  let lapTwoStart = null;
  let step = 0;

  const deficit = Object.fromEntries(BANDS.map((band) => [band.name, 0]));
  const counts = Object.fromEntries(BANDS.map((band) => [band.name, 0]));

  const limit = Math.ceil(300 / DT);
  for (step = 0; step < limit; step += 1) {
    const controls = driver.update(DT);
    car.step(DT, controls, { grip: circuit.grip ?? 1 });
    steps += 1;

    const located = locateOnTrack(track, car.x, car.z, hint);
    hint = located.index;
    const sample = located.sample;

    if (sample.s < lastDistance - track.length / 3) {
      lapIndex += 1;
      if (lapIndex === 2) lapTwoStart = step * DT;
    }
    lastDistance = sample.s;

    if (Math.abs(located.lateral) > sample.width * 0.5) offRoad += 1;

    if (lapIndex === 1) {
      const band = bandOf(sample.curvature);
      if (sample.targetSpeed > 4) {
        deficit[band] += Math.max(0, sample.targetSpeed - car.speed) / sample.targetSpeed;
        counts[band] += 1;
      }
    }
    if (lapIndex >= 2) break;
  }

  // Lap time the profile implies for the whole circuit.
  let profileTime = 0;
  for (const sample of track.samples) {
    if (sample.targetSpeed > 1) profileTime += track.step / sample.targetSpeed;
  }

  return {
    track,
    profileTime,
    achievedTime: lapTwoStart === null ? null : step * DT - lapTwoStart,
    offRoad: offRoad / steps,
    deficit,
    counts
  };
}

const circuitId = process.argv[2];
const circuits = circuitId ? [getCircuit(circuitId)] : CIRCUITS.slice(0, 6);

console.log('AI pace against the generated speed profile\n');
console.log('circuit          profile  achieved   ratio   straight  fast  medium  slow  hairpin   offTrack');

for (const circuit of circuits) {
  const result = analyse(circuit);
  const achieved = result.achievedTime;
  const ratio = achieved ? achieved / result.profileTime : NaN;

  const bandCells = BANDS.map((band) => {
    const value = result.counts[band.name] ? result.deficit[band.name] / result.counts[band.name] : 0;
    return `${(value * 100).toFixed(0)}%`.padStart(6);
  }).join('');

  console.log(
    `${circuit.id.padEnd(15)} ${result.profileTime.toFixed(1).padStart(7)}s ` +
      `${(achieved ? achieved.toFixed(1) : '--').padStart(8)}s ` +
      `${(Number.isFinite(ratio) ? ratio.toFixed(2) : '--').padStart(6)}x ${bandCells} ` +
      `${(result.offRoad * 100).toFixed(0).padStart(8)}%`
  );
}

console.log('\nratio  = achieved lap time / profile lap time. 1.00 would be perfect.');
console.log('columns = mean speed deficit against the profile, by corner tightness.');
console.log('A deficit that is uniform means a systemic problem; one concentrated in');
console.log('the slow/hairpin columns means the AI cannot get to the apex speed.');