// Isolated controller test: Stanley steering + speed profile, no AI module.
//   node scripts/iso-test.mjs [circuitId]
//
// Separates "can a controller of this shape follow this line in this car" from
// "is the AI's extra logic breaking it".
import { buildTrack } from '../src/track/trackGeometry.js';
import { CIRCUITS, getCircuit } from '../src/track/circuits.js';
import { CarPhysics } from '../src/physics/CarPhysics.js';
import { applyUpgrades } from '../src/physics/upgrades.js';
import { locateOnTrack, racingLineAt } from '../src/track/trackGeometry.js';
import { formatLapTime, wrapAngle } from '../src/util/math.js';

const DT = 1 / 120;

function run(circuitId, options = {}) {
  const {
    pace = 0.8,
    headingGain = 1.6,
    stanleyGain = 0.055,
    aimLeadTime = 0.45,
    maxLeadAngle = 0.32,
    brakeDecel = 9.5
  } = options;

  const circuit = getCircuit(circuitId);
  const track = buildTrack(circuit);
  const car = new CarPhysics(applyUpgrades({ power: 1, aero: 1, brakes: 1, tyres: 1, drs: 1 }));
  const start = track.samples[0];
  car.reset(start.lineX, start.lineZ, start.lineHeading, start.targetSpeed * pace);

  let idx = 0;
  let time = 0;
  let laps = 0;
  let lastIndex = -1;
  let lapStart = 0;
  let offTime = 0;
  let worstLateral = 0;
  const lapTimes = [];
  let firstExcursion = null;

  while (laps < 3 && time < 300) {
    const located = locateOnTrack(track, car.x, car.z, idx);
    idx = located.index;
    const sample = track.samples[idx];

    const lineX = sample.x + sample.rightX * sample.lineOffset;
    const lineZ = sample.z + sample.rightZ * sample.lineOffset;
    const crossTrack = (car.x - lineX) * sample.rightX + (car.z - lineZ) * sample.rightZ;

    const lead = Math.max(6, Math.min(30, car.speed * aimLeadTime));
    const ahead = racingLineAt(track, sample.s + lead);
    const leadHeading = clamp(
      wrapAngle(ahead.heading - sample.lineHeading),
      -maxLeadAngle,
      maxLeadAngle
    );
    const headingError = wrapAngle(sample.lineHeading + leadHeading - car.heading);
    const correction = Math.atan2(crossTrack * stanleyGain, Math.max(car.speed, 4) + 8);

    const steer = clamp(headingError * headingGain + correction - car.rearSlipAngle * 1.4, -1, 1);

    // Speed: slowest allowed speed within the braking window.
    const lookAhead = 40 + car.speed * car.speed * 0.05;
    const steps = 16;
    let targetSpeed = Infinity;
    for (let i = 0; i <= steps; i += 1) {
      const d = (lookAhead * i) / steps;
      const point = racingLineAt(track, sample.s + d);
      const kappa = Math.abs(point.sample.lineCurvature);
      const gripLimit = kappa < 1e-4 ? 99 : Math.sqrt((1.55 * 9.81) / kappa);
      const allowed = Math.min(point.targetSpeed, gripLimit);
      const reachable = Math.sqrt(allowed * allowed + 2 * brakeDecel * d);
      if (reachable < targetSpeed) targetSpeed = reachable;
    }
    targetSpeed *= pace;

    const error = targetSpeed - car.speed;
    const throttle = error > 1.2 ? clamp(error * 0.4, 0, 1) : error < -1 ? 0 : clamp(0.42 + error * 0.3, 0, 1);
    const brake = error < -1 ? clamp(-error / 6, 0, 1) : 0;

    car.step(DT, { throttle, brake, steer, handbrake: false }, { grip: 1 });
    time += DT;

    const after = locateOnTrack(track, car.x, car.z, idx);
    const limit = track.samples[after.index].width * 0.5;
    if (Math.abs(after.lateral) > limit) {
      offTime += DT;
      if (!firstExcursion) {
        firstExcursion = {
          time,
          index: after.index,
          lateral: after.lateral,
          kph: car.speedKph,
          crossTrack,
          headingError
        };
      }
    }
    worstLateral = Math.max(worstLateral, Math.abs(after.lateral));

    if (lastIndex >= 0 && after.index < lastIndex && lastIndex - after.index > track.count * 0.5) {
      lapTimes.push(time - lapStart);
      lapStart = time;
      laps += 1;
    }
    lastIndex = after.index;
  }

  return { lapTimes, laps, offTime, worstLateral, firstExcursion, track };
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

const only = process.argv[2];
const circuits = only ? [getCircuit(only)] : CIRCUITS;

console.log('circuit          pace  stanley  head  laps  best      offTrack  worstLat  firstOff');
for (const circuit of circuits) {
  for (const [pace, stanleyGain, headingGain] of [
    [0.6, 0.055, 1.6],
    [0.6, 0.3, 1.6],
    [0.8, 0.055, 1.6],
    [0.8, 0.3, 1.6],
    [0.8, 0.3, 2.4],
    [0.95, 0.3, 1.6]
  ]) {
    const r = run(circuit.id, { pace, stanleyGain, headingGain });
    const best = r.lapTimes.length ? Math.min(...r.lapTimes) : Infinity;
    const fo = r.firstExcursion
      ? `t=${r.firstExcursion.time.toFixed(0)}s idx=${r.firstExcursion.index} lat=${r.firstExcursion.lateral.toFixed(1)}`
      : '-';
    console.log(
      [
        circuit.id.padEnd(14),
        `${pace}`.padEnd(5),
        `${stanleyGain}`.padEnd(8),
        `${headingGain}`.padEnd(5),
        String(r.laps).padEnd(5),
        formatLapTime(best).padEnd(9),
        `${r.offTime.toFixed(1)}s`.padEnd(9),
        `${r.worstLateral.toFixed(1)}m`.padEnd(9),
        fo
      ].join(' ')
    );
  }
  console.log('');
}