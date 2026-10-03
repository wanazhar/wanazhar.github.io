// Single-car pace bench: does one AI driver complete clean, consistent laps?
//   node scripts/ai-pace.mjs [circuitId]
import { buildTrack } from '../src/track/trackGeometry.js';
import { CIRCUITS, getCircuit } from '../src/track/circuits.js';
import { CarPhysics } from '../src/physics/CarPhysics.js';
import { AIDriver } from '../src/ai/AIDriver.js';
import { SKILL_PRESETS } from '../src/physics/drivers.js';
import { applyUpgrades } from '../src/physics/upgrades.js';
import { locateOnTrack } from '../src/track/trackGeometry.js';
import { formatLapTime } from '../src/util/math.js';

const DT = 1 / 120;

function run(circuitId, laps = 5) {
  const circuit = getCircuit(circuitId);
  const track = buildTrack(circuit);
  const setup = applyUpgrades({ power: 1, aero: 1, brakes: 1, tyres: 1, drs: 1 });
  const car = new CarPhysics(setup);
  const ai = new AIDriver(car, SKILL_PRESETS.ace, { track, random: () => 0.5 });

  // Start on the racing line at the finish line, already moving.
  const start = track.samples[0];
  car.reset(start.lineX, start.lineZ, start.heading, 45);
  ai.trackIndex = 0;

  const lapTimes = [];
  let lapStart = 0;
  let time = 0;
  let offTrackTime = 0;
  let worstLateral = 0;
  let wallHits = 0;
  let index = 0;
  let lastIndex = -1;
  let reportedOffTrack = false;

  while (lapTimes.length < laps && time < 400) {
    const controls = ai.update(DT, {});
    const before = { x: car.x, z: car.z };
    car.step(DT, controls, { grip: 1 });
    time += DT;

    const located = locateOnTrack(track, car.x, car.z, index);
    index = located.index;
    const sample = located.sample;
    const limit = sample.width * 0.5;

    // `ai-pace` drives the physics directly, so there are no barriers: only
    // distance from the centreline is meaningful here.
    if (Math.abs(located.lateral) > limit) {
      offTrackTime += DT;
      if (!reportedOffTrack) {
        reportedOffTrack = true;
        console.log(
          `  !! went off at t=${time.toFixed(1)}s index=${index} ` +
            `lateral=${located.lateral.toFixed(1)}m speed=${car.speedKph.toFixed(0)}kph`
        );
      }
    } else {
      reportedOffTrack = false;
    }
    worstLateral = Math.max(worstLateral, Math.abs(located.lateral));

    const moved = Math.hypot(car.x - before.x, car.z - before.z);
    void moved;

    // Lap crossing: detect the index wrapping past the end of the lap. Comparing
    // consecutive indices directly avoids the ambiguity of a full scan, where a
    // car on the far side of the circuit looks equally "before the line".
    if (lastIndex >= 0 && index < lastIndex && lastIndex - index > track.count * 0.5) {
      lapTimes.push(time - lapStart);
      lapStart = time;
    }
    lastIndex = index;
  }

  return {
    circuit,
    track,
    lapTimes,
    offTrackTime,
    worstLateral,
    wallHits: 0,
    timedOut: lapTimes.length < laps
  };
}

const only = process.argv[2];
const list = only ? [getCircuit(only)] : CIRCUITS;

console.log('circuit          ideal     best      avg      spread  offTrack  wall  worstLat');
for (const circuit of list) {
  const r = run(circuit.id);
  const best = r.lapTimes.length ? Math.min(...r.lapTimes) : Infinity;
  const avg = r.lapTimes.length ? r.lapTimes.reduce((a, b) => a + b, 0) / r.lapTimes.length : Infinity;
  const spread = r.lapTimes.length > 1 ? best - Math.max(...r.lapTimes) : Infinity;
  console.log(
    [
      circuit.id.padEnd(14),
      formatLapTime(r.track.lapRecord).padEnd(9),
      formatLapTime(best).padEnd(9),
      formatLapTime(avg).padEnd(9),
      `${spread === Infinity ? '--' : spread.toFixed(2)}s`.padEnd(8),
      `${r.offTrackTime.toFixed(1)}s`.padEnd(9),
      String(r.wallHits).padEnd(5),
      `${r.worstLateral.toFixed(1)}m`,
      r.timedOut ? '  TIMED OUT' : ''
    ].join(' ')
  );
}