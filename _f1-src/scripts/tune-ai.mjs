// Tune the path-following gains by sweeping them on every circuit.
//   node scripts/tune-ai.mjs
import { buildTrack } from '../src/track/trackGeometry.js';
import { CIRCUITS } from '../src/track/circuits.js';
import { locateOnTrack, racingLineAt, wrapDistance } from '../src/track/trackGeometry.js';
import { CarPhysics } from '../src/physics/CarPhysics.js';
import { applyUpgrades } from '../src/physics/upgrades.js';
import { clamp } from '../src/util/math.js';
import { formatLapTime } from '../src/util/math.js';

const DT = 1 / 120;

/**
 * Standalone replica of the AI controller with tunable gains, so the gains can be
 * swept without editing the real module for every candidate.
 */
function drive(car, track, gains) {
  const dt = DT;
  let index = 0;
  let offTime = 0;
  let distance = 0;
  let time = 0;
  let laps = 0;
  let lapStart = 0;
  let lastIndex = -1;
  const lapTimes = [];

  while (laps < 3 && time < 240) {
    const located = locateOnTrack(track, car.x, car.z, index);
    index = located.index;
    const sample = located.sample;
    distance = sample.s;

    const aimAhead = clamp(car.speed * 0.55, gains.aimMin, gains.aimMax);
    const aim = racingLineAt(track, distance + aimAhead, 0);
    const targetHeading = Math.atan2(aim.z - car.z, aim.x - car.x);
    const headingError = wrapAngleOf(targetHeading - car.heading);
    const crossTrack = (car.x - aim.x) * sample.rightX + (car.z - aim.z) * sample.rightZ;
    const damping = gains.stanley / (1 + car.speed * gains.dampRate);
    const correction = Math.atan2(crossTrack * damping, Math.max(car.speed, 6));
    let steer = clamp(headingError * gains.headingGain + correction, -1, 1);
    steer -= car.rearSlipAngle * gains.counterSteer;

    // speed plan
    const lookAhead = gains.brakeMin + car.speed * car.speed * gains.brakeV2;
    const steps = 16;
    let targetSpeed = Infinity;
    for (let i = 0; i <= steps; i += 1) {
      const d = (lookAhead * i) / steps;
      const point = racingLineAt(track, distance + d);
      const kappa = Math.abs(point.sample.lineCurvature);
      const gripLimit = kappa < 1e-4 ? 99 : Math.sqrt((1.55 * 9.81) / kappa);
      const allowed = Math.min(point.targetSpeed, gripLimit);
      const reachable = Math.sqrt(allowed * allowed + 2 * gains.brakeDecel * d);
      if (reachable < targetSpeed) targetSpeed = reachable;
    }
    targetSpeed *= gains.cornering;

    const half = sample.width * 0.5;
    if (Math.abs(located.lateral) > half) offTime += dt;

    const speedError = targetSpeed - car.speed;
    let throttle = 0;
    let brake = 0;
    if (speedError > 1.2) throttle = clamp(speedError * 0.4, 0, 1);
    else if (speedError < -1) brake = clamp(-speedError / 6, 0, 1);
    else throttle = clamp(0.42 + speedError * 0.3, 0, 1);
    if (car.wheelSlip > 0.25) throttle *= clamp(1 - car.wheelSlip * 0.8, 0.25, 1);

    car.step(dt, { throttle, brake, steer, handbrake: false }, { grip: 1 });
    time += dt;

    if (lastIndex >= 0 && index < lastIndex && lastIndex - index > track.count * 0.5) {
      lapTimes.push(time - lapStart);
      lapStart = time;
      laps += 1;
    }
    lastIndex = index;
  }

  return { offTime, lapTimes, laps, worstLateral: Math.max(0, 0) };
}

function wrapAngleOf(a) {
  let v = (a + Math.PI) % (Math.PI * 2);
  if (v < 0) v += Math.PI * 2;
  return v - Math.PI;
}

const BASE = {
  aimMin: 10,
  aimMax: 26,
  stanley: 2.6,
  dampRate: 0.08,
  headingGain: 1.9,
  counterSteer: 1.5,
  brakeMin: 40,
  brakeV2: 0.05,
  brakeDecel: 11,
  cornering: 0.955
};

function evaluate(gains) {
  let offTotal = 0;
  let bestSum = 0;
  let complete = 0;
  const detail = [];
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    const car = new CarPhysics(applyUpgrades({ power: 1, aero: 1, brakes: 1, tyres: 1, drs: 1 }));
    const start = track.samples[0];
    car.reset(start.lineX, start.lineZ, start.heading, 45);
    const r = drive(car, track, gains);
    offTotal += r.offTime;
    if (r.lapTimes.length) {
      complete += r.lapTimes.length;
      bestSum += Math.min(...r.lapTimes);
    }
    detail.push({ id: circuit.id, ideal: track.lapRecord, best: r.lapTimes.length ? Math.min(...r.lapTimes) : Infinity, off: r.offTime, laps: r.lapTimes.length });
  }
  return { offTotal, avgBest: complete ? bestSum / complete : Infinity, complete, detail };
}

const candidates = [
  { label: 'current', gains: { ...BASE } },
  { label: 'stanley x3', gains: { ...BASE, stanley: 7.8 } },
  { label: 'stanley x6', gains: { ...BASE, stanley: 15.6 } },
  { label: 'stanley x10', gains: { ...BASE, stanley: 26 } },
  { label: 'heading x1.2', gains: { ...BASE, headingGain: 1.2 } },
  { label: 'heading x3', gains: { ...BASE, headingGain: 3.0 } },
  { label: 'slow damp', gains: { ...BASE, dampRate: 0.02 } },
  { label: 'fast damp', gains: { ...BASE, dampRate: 0.2 } },
  { label: 'long aim', gains: { ...BASE, aimMin: 18, aimMax: 45 } },
  { label: 'short aim', gains: { ...BASE, aimMin: 6, aimMax: 14 } },
  { label: 'brakeDecel 8', gains: { ...BASE, brakeDecel: 8 } },
  { label: 'brakeDecel 14', gains: { ...BASE, brakeDecel: 14 } },
  { label: 'v2 0.08', gains: { ...BASE, brakeV2: 0.08 } },
  { label: 'cornering 1.0', gains: { ...BASE, cornering: 1.0 } }
];

console.log('gains              offTrack  avgBest   laps');
for (const candidate of candidates) {
  const r = evaluate(candidate.gains);
  console.log(
    [
      candidate.label.padEnd(18),
      `${r.offTotal.toFixed(1)}s`.padEnd(9),
      formatLapTime(r.avgBest).padEnd(9),
      String(r.complete).padEnd(5)
    ].join(' ')
  );
}

console.log('\ndetail for best candidate below; ideal vs achieved:');
const best = evaluate(BASE);
for (const d of best.detail) {
  console.log(
    `  ${d.id.padEnd(14)} ideal ${formatLapTime(d.ideal).padEnd(9)} best ${formatLapTime(d.best).padEnd(9)} off ${d.off.toFixed(1)}s laps ${d.laps}`
  );
}
void wrapDistance;