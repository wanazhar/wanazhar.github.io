// Physics bench: check the car against real-world reference figures.
//   node scripts/physics-lab.mjs
import { CarPhysics, POWERTRAIN, topSpeed, torqueFactor } from '../src/physics/CarPhysics.js';

const DT = 1 / 120;

function accelTest() {
  const car = new CarPhysics({ grip: 1 });
  let time = 0;
  const reached = {};
  let maxSpeed = 0;
  let settleTime = 0;
  let previousSpeed = 0;
  // Run well past the top speed so the reported terminal velocity is a real
  // asymptote rather than the first time the car happens to cross 300.
  while (time < 90) {
    car.step(DT, { throttle: 1, brake: 0, steer: 0 });
    time += DT;
    maxSpeed = Math.max(maxSpeed, car.speedKph);
    if (!reached.hundred && car.speedKph >= 100) reached.hundred = time;
    if (!reached.twoHundred && car.speedKph >= 200) reached.twoHundred = time;
    if (!reached.threeHundred && car.speedKph >= 300) reached.threeHundred = time;
    if (car.speedKph - previousSpeed < 0.01) settleTime += DT;
    else settleTime = 0;
    previousSpeed = car.speedKph;
    if (settleTime > 8) break;
  }
  return { ...reached, maxSpeed, time };
}

function brakingTest(fromKph = 300) {
  const car = new CarPhysics({ grip: 1 });
  car.reset(0, 0, 0, fromKph / 3.6);
  car.gear = 6;
  let path = 0;
  let time = 0;
  let peakG = 0;
  let previousX = car.x;
  let previousZ = car.z;
  while (car.speedKph > 100 && time < 20) {
    car.step(DT, { throttle: 0, brake: 1, steer: 0 });
    // Path length, not x displacement: the car yaws slightly under load
    // transfer, so the axis distance understates how far it actually travelled.
    path += Math.hypot(car.x - previousX, car.z - previousZ);
    previousX = car.x;
    previousZ = car.z;
    peakG = Math.max(peakG, Math.abs(car.longitudinalG) / 9.81);
    time += DT;
  }
  return { distance: path, time, peakG };
}

/**
 * Steady-state cornering: hold a throttle and ramp the steering until the car
 * reaches its lateral limit, then report the peak.
 *
 * A proper skidpad needs a closed loop on radius, but for a physics bench the
 * informative number is simply "what is the most lateral g this car can make",
 * which a slow steering sweep finds directly.
 */
function skidpadTest() {
  const car = new CarPhysics({ grip: 1 });
  let best = { lateralG: 0, kph: 0, steer: 0 };
  for (const startSteer of [0.15, 0.3, 0.5, 0.7, 0.9]) {
    const probe = new CarPhysics({ grip: 1 });
    probe.reset(0, 0, 0, 60);
    for (let i = 0; i < 1200; i++) {
      probe.step(DT, { throttle: 0.3, brake: 0, steer: startSteer });
      const g = Math.abs(probe.lateralG) / 9.81;
      if (g > best.lateralG) best = { lateralG: g, kph: probe.speedKph, steer: startSteer };
    }
  }
  void car;
  return best;
}

const accel = accelTest();
const brake = brakingTest();
const skidpad = skidpadTest();

console.log('=== straight line ===');
console.log(' 0-100 kph  ', accel.hundred ? `${accel.hundred.toFixed(2)}s` : 'not reached');
console.log(' 0-200 kph  ', accel.twoHundred ? `${accel.twoHundred.toFixed(2)}s` : 'not reached');
console.log(' 0-300 kph  ', accel.threeHundred ? `${accel.threeHundred.toFixed(2)}s` : 'not reached');
console.log(' terminal   ', accel.maxSpeed.toFixed(0), 'kph  (analytic', (topSpeed() * 3.6).toFixed(0), 'kph)');

console.log('\n=== braking from 300 to 100 kph ===');
console.log(' distance   ', brake.distance.toFixed(0), 'm');
console.log(' time       ', brake.time.toFixed(2), 's');
console.log(' peak decel ', brake.peakG.toFixed(2), 'g');

console.log('\n=== peak lateral ===');
console.log(' lateral    ', skidpad.lateralG.toFixed(2), 'g at', skidpad.kph.toFixed(0), 'kph (steer', skidpad.steer.toFixed(2) + ')');

console.log('\n=== torque curve ===');
for (const rpm of [4000, 6000, 8000, 10000, 10800, 12000, 14000, 15200]) {
  process.stdout.write(` ${(rpm / 1000).toFixed(0)}k:${(torqueFactor(rpm) * 100).toFixed(0)}%`);
}
console.log('\n gear ratios', POWERTRAIN.gearRatios.join(' '), 'final', POWERTRAIN.finalDrive);

// Reference figures for a 2020s F1 car:
//   0-100 ~2.6s, 0-200 ~5.8s, top speed ~340-360 kph
//   braking 300->100 kph ~ 320m at ~5g
//   peak lateral ~5g in a fast corner