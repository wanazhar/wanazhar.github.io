/**
 * What does contact do to the AI field?
 *
 * Adding car-to-car contact fixed cars driving through each other and broke three
 * rounds, with cars getting stuck. "Gets stuck" is not a diagnosis: a car spun by a
 * shunt and a car wedged against a barrier need opposite fixes, and both end the
 * same way on the results screen.
 *
 * So this reports, per car, how much contact it had, how hard it was hit, how much
 * of the lap it spent spinning, and how much of the lap it spent off track -- and
 * then whether it finished. If contact causes the failures, the contact counts and
 * the spin/off-track fractions will be concentrated in the cars that fail.
 *
 * Run: node scripts/contact-impact.mjs [circuitId]
 */

import { installCanvasShim } from './helpers/domShim.mjs';

installCanvasShim();

const { buildTrack } = await import('../src/track/trackGeometry.js');
const { getCircuit } = await import('../src/track/circuits.js');
const { FIXED_TIMESTEP, RaceSession, SESSION_TYPE } = await import('../src/race/RaceSession.js');
const { AIDriver } = await import('../src/ai/AIDriver.js');
const { SKILL_PRESETS } = await import('../src/physics/drivers.js');
const { createChampionship } = await import('../src/championship/ChampionshipManager.js');
const { createRandom } = await import('../src/util/math.js');

const circuit = getCircuit(process.argv[2] ?? 'baku');
const track = buildTrack(circuit);
const random = createRandom(20240218 + Number(process.env.ROUND ?? 18));
const championship = createChampionship();

const session = new RaceSession({
  track,
  entries: championship.entries,
  type: SESSION_TYPE.race,
  totalLaps: circuit.laps,
  random
});
for (const car of session.cars) {
  car.isPlayer = false;
  car.ai = new AIDriver(car.physics, SKILL_PRESETS.ace, { track, name: car.entry.short, random });
  car.ai.reset();
  car.stats = { contacts: 0, grindFrames: 0, peakImpact: 0, spun: 0, offTrack: 0, steps: 0 };
}

const idle = { throttle: 0, brake: 0, steer: 0, handbrake: false };
let steps = 0;
const maxSteps = Math.ceil(1800 / FIXED_TIMESTEP);

while (!session.finished && steps < maxSteps) {
  session.update(FIXED_TIMESTEP, idle);
  steps += 1;

  for (const car of session.cars) {
    const s = car.stats;
    s.steps += 1;
    // An onset is the frame contact *begins*. Counting frames instead makes two
    // cars grinding for three seconds look like 180 contacts rather than one, which
    // is the difference between a race and a traffic jam.
    if (car.touching && !car.wasTouching) {
      s.contacts += 1;
      if (car.contact && car.contact.severity > s.peakImpact) s.peakImpact = car.contact.severity;
    }
    if (car.touching) s.grindFrames += 1;
    car.wasTouching = car.touching;
    // A car is spinning when it is travelling fast but pointing away from where it
    // is going. That is the state a shunt leaves a car in and cannot get out of.
    const speed = car.physics.speed;
    if (speed > 8) {
      const velocity = car.physics.worldVelocity();
      const heading = { x: Math.cos(car.physics.heading), z: Math.sin(car.physics.heading) };
      const alignment = (velocity.vx * heading.x + velocity.vz * heading.z) / speed;
      if (alignment < 0.5) s.spun += 1;
    }
    if (Math.abs(car.lateral ?? 0) > (car.trackHalfWidth ?? 1)) s.offTrack += 1;
  }
}

console.log(`${circuit.name}, ${(track.length / 1000).toFixed(3)}km, ${circuit.laps} laps`);
console.log(`finished: ${session.finished} after ${(steps * FIXED_TIMESTEP).toFixed(0)} simulated seconds\n`);

const rows = session.cars.map((car) => {
  const s = car.stats;
  const result = session.results().find((r) => r.short === car.entry.short);
  return {
    short: car.entry.short,
    contacts: s.contacts,
    grind: s.grindFrames / Math.max(s.steps, 1),
    peak: s.peakImpact,
    spun: s.spun / Math.max(s.steps, 1),
    off: s.offTrack / Math.max(s.steps, 1),
    finished: Boolean(result && result.position !== null && car.finished),
    laps: car.timer.lap,
    best: car.bestLapTime
  };
});

console.log('car   contacts   grind   peak(m/s)   spinning   off track   laps  finished');
for (const row of [...rows].sort((a, b) => b.contacts - a.contacts)) {
  console.log(
    `${row.short.padEnd(5)} ${String(row.contacts).padStart(8)} ${(row.grind * 100).toFixed(1).padStart(7)}% ` +
      `${row.peak.toFixed(2).padStart(10)} ` +
      `${(row.spun * 100).toFixed(1).padStart(9)}% ${(row.off * 100).toFixed(1).padStart(10)}% ` +
      `${String(row.laps).padStart(6)} ${String(row.finished).padStart(9)}`
  );
}

const totalContacts = rows.reduce((sum, row) => sum + row.contacts, 0);
const stuck = rows.filter((row) => !row.finished);
console.log(`\n${totalContacts} contacts across ${rows.length} cars`);
console.log(`${stuck.length} car(s) did not finish${stuck.length ? ': ' + stuck.map((r) => r.short).join(', ') : ''}`);
if (stuck.length) {
  const mean = (key) => (rows.reduce((s, r) => s + r[key], 0) / rows.length) * 100;
  const stuckMean = (key) => (stuck.reduce((s, r) => s + r[key], 0) / stuck.length) * 100;
  console.log(`\n            all cars   cars that failed`);
  for (const key of ['grind', 'spun', 'off']) {
    console.log(`  ${key.padEnd(10)} ${mean(key).toFixed(1).padStart(8)}% ${stuckMean(key).toFixed(1).padStart(15)}%`);
  }
  console.log(
    `  ${'contacts'.padEnd(10)} ${(rows.reduce((s, r) => s + r.contacts, 0) / rows.length).toFixed(1).padStart(8)} ` +
      `${(stuck.reduce((s, r) => s + r.contacts, 0) / stuck.length).toFixed(1).padStart(15)}`
  );
}