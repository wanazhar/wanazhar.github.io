// Is the speed profile achievable?
//   node scripts/profile-check.mjs
//
// Drives the profile exactly -- constant target speed, full authority to hold the
// line -- and reports where the car cannot keep up. A profile that demands more
// lateral grip than the car has is the root cause of an AI that runs wide.
import { buildTrack } from '../src/track/trackGeometry.js';
import { CIRCUITS } from '../src/track/circuits.js';
import { CarPhysics, GRAVITY } from '../src/physics/CarPhysics.js';
import { applyUpgrades } from '../src/physics/upgrades.js';
import { locateOnTrack, racingLineAt } from '../src/track/trackGeometry.js';
import { wrapAngle } from '../src/util/math.js';

const DT = 1 / 120;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function check(track) {
  const car = new CarPhysics(applyUpgrades({ power: 1, aero: 1, brakes: 1, tyres: 1, drs: 1 }));
  let idx = 0;
  let t = 0;
  const failures = [];
  let maxLatG = 0;
  let maxLatGAt = -1;
  let offTime = 0;
  let worst = 0;

  while (t < 200) {
    const loc = locateOnTrack(track, car.x, car.z, idx);
    idx = loc.index;
    const smp = track.samples[idx];

    const lineX = smp.x + smp.rightX * smp.lineOffset;
    const lineZ = smp.z + smp.rightZ * smp.lineOffset;
    const cross = (car.x - lineX) * smp.rightX + (car.z - lineZ) * smp.rightZ;

    const lead = clamp(car.speed * 0.45, 6, 30);
    const ahead = racingLineAt(track, smp.s + lead);
    const lh = clamp(wrapAngle(ahead.heading - smp.lineHeading), -0.32, 0.32);
    const he = wrapAngle(smp.lineHeading + lh - car.heading);
    const corr = Math.atan2(cross * 3.0, Math.max(car.speed, 4) + 8);
    const steer = clamp(he * 1.6 + corr - car.rearSlipAngle * 1.4, -1, 1);

    // Track the profile exactly: aim for the profile speed at this point.
    const target = smp.targetSpeed;
    const err = target - car.speed;
    const throttle = err > 0 ? clamp(err * 0.5, 0, 1) : 0;
    const brake = err < 0 ? clamp(-err * 0.3, 0, 1) : 0;

    car.step(DT, { throttle, brake, steer }, { grip: 1 });
    t += DT;

    const latG = Math.abs(car.lateralG) / GRAVITY;
    if (latG > maxLatG) {
      maxLatG = latG;
      maxLatGAt = idx;
    }

    const after = locateOnTrack(track, car.x, car.z, idx);
    const limit = track.samples[after.index].width * 0.5;
    if (Math.abs(after.lateral) > limit) {
      offTime += DT;
      worst = Math.max(worst, Math.abs(after.lateral));
      if (failures.length < 5 && (!failures.length || after.index !== failures[failures.length - 1].index)) {
        failures.push({
          index: after.index,
          lateral: after.lateral,
          kph: car.speedKph,
          target: target * 3.6,
          latG
        });
      }
    }
    if (t > 60 && idx === 0 && failures.length) break;
  }

  return { offTime, worst, maxLatG, maxLatGAt, failures };
}

console.log('circuit          offTrack  worstLat  peakLatG  peakAt   first failures');
for (const circuit of CIRCUITS) {
  const track = buildTrack(circuit);
  const r = check(track);
  console.log(
    [
      circuit.id.padEnd(14),
      `${r.offTime.toFixed(1)}s`.padEnd(9),
      `${r.worst.toFixed(1)}m`.padEnd(9),
      `${r.maxLatG.toFixed(2)}g`.padEnd(9),
      String(r.maxLatGAt).padEnd(8),
      r.failures
        .slice(0, 3)
        .map((f) => `idx${f.index}@${f.kph.toFixed(0)}/${f.target.toFixed(0)}kph`)
        .join(' ')
    ].join(' ')
  );
}
console.log('');
console.log('A profile the car can hold gives near-zero offTrack and peakLatG under ~5g.');