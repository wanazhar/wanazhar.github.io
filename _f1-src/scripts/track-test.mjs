// Closed-loop tracking test: given a target speed, can the car hold the line?
//   node scripts/track-test.mjs [circuitId]
//
// This isolates steering from speed planning. If the car cannot hold the line at
// a speed it *can* physically manage, the problem is the steering controller,
// not the speed profile.
import { buildTrack } from '../src/track/trackGeometry.js';
import { CIRCUITS, getCircuit } from '../src/track/circuits.js';
import { CarPhysics } from '../src/physics/CarPhysics.js';
import { AIDriver } from '../src/ai/AIDriver.js';
import { SKILL_PRESETS } from '../src/physics/drivers.js';
import { applyUpgrades } from '../src/physics/upgrades.js';
import { locateOnTrack } from '../src/track/trackGeometry.js';
import { formatLapTime } from '../src/util/math.js';

const DT = 1 / 120;

function run(circuitId, speedFraction) {
  const circuit = getCircuit(circuitId);
  const track = buildTrack(circuit);
  const car = new CarPhysics(applyUpgrades({ power: 1, aero: 1, brakes: 1, tyres: 1, drs: 1 }));
  const ai = new AIDriver(car, SKILL_PRESETS.ace, { track, random: () => 0.5 });
  const start = track.samples[0];
  car.reset(start.lineX, start.lineZ, start.lineHeading, start.targetSpeed * 0.6);
  let offTime = 0;
  let worstLateral = 0;
  let time = 0;
  let laps = 0;
  let lastIndex = -1;
  let lapStart = 0;
  const lapTimes = [];

  while (laps < 3 && time < 300) {
    const controls = ai.update(DT, {});

    // Hold a *speed fraction* of the track's own profile rather than an absolute
    // speed. An absolute cap of, say, 90 km/h is faster than the slowest corners
    // allow, so the car cannot make them no matter how well it steers -- the test
    // then measures grip limits rather than tracking ability. Scaling the profile
    // keeps every corner within reach while still varying the pace.
    const locatedForCap = locateOnTrack(track, car.x, car.z, ai.trackIndex);
    const profileSpeed = track.samples[locatedForCap.index].targetSpeed;
    const allowed = profileSpeed * speedFraction;
    const over = car.speed - allowed;
    const applied =
      over > 0
        ? { throttle: 0, brake: Math.min(0.7, over * 0.4), steer: controls.steer }
        : controls;
    car.step(DT, applied, { grip: 1 });
    time += DT;

    const located = locateOnTrack(track, car.x, car.z, ai.trackIndex);
    const limit = track.samples[located.index].width * 0.5;
    if (Math.abs(located.lateral) > limit) offTime += DT;
    worstLateral = Math.max(worstLateral, Math.abs(located.lateral));

    if (lastIndex >= 0 && located.index < lastIndex && lastIndex - located.index > track.count * 0.5) {
      lapTimes.push(time - lapStart);
      lapStart = time;
      laps += 1;
    }
    lastIndex = located.index;
  }

  return { lapTimes, offTime, worstLateral, laps };
}

const only = process.argv[2];
const circuits = only ? [getCircuit(only)] : CIRCUITS;
const fractions = [0.5, 0.65, 0.8, 0.95];

console.log('circuit          pace   laps   best      offTrack  worstLat');
for (const circuit of circuits) {
  for (const fraction of fractions) {
    const r = run(circuit.id, fraction);
    const best = r.lapTimes.length ? Math.min(...r.lapTimes) : Infinity;
    console.log(
      [
        circuit.id.padEnd(14),
        `${(fraction * 100).toFixed(0)}%`.padEnd(6),
        String(r.laps).padEnd(6),
        formatLapTime(best).padEnd(9),
        `${r.offTime.toFixed(1)}s`.padEnd(9),
        `${r.worstLateral.toFixed(1)}m`
      ].join(' ')
    );
  }
  console.log('');
}