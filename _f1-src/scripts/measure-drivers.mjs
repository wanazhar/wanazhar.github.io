/**
 * Driver-model measurement: pace and repeatability per skill preset.
 *
 * A balance question cannot be answered without two numbers per driver: how fast, and how
 * repeatable. Both have to be measured the same way every time or the comparison is noise.
 *
 * Measuring a *flying lap* -- lap 2, averaged over several seeds, no traffic:
 *
 *   - lap 1 is an out-lap: cold tyres, and in qualifying a committed run, so it is excluded
 *   - laps 3+ are worn. Measured at Monza: 119.18, 120.15, 121.43, 121.36, 122.81, which is
 *     about 0.7s/lap of tyre degradation and not driver inconsistency. "Best of six worn laps"
 *     therefore mixes the driver's pace with how worn the tyres were.
 *   - one lap alone is not a pace measurement: a single lap gave the same preset anywhere from
 *     +0.96s to +13.46s behind `ace` depending only on whether it contained a lift.
 *
 * Repeatability is the spread of that same flying lap across seeds. A real F1 flying lap is
 * repeatable to roughly 0.1-0.3s; anything an order of magnitude wider is noise being mistaken
 * for pace.
 */

import { installCanvasShim } from './helpers/domShim.mjs';

installCanvasShim();

const tg = await import('../src/track/trackGeometry.js');
const circ = await import('../src/track/circuits.js');
const rs = await import('../src/race/RaceSession.js');
const cm = await import('../src/championship/ChampionshipManager.js');
const { createRandom } = await import('../src/util/math.js');

const PRESETS = ['ace', 'human', 'strong', 'mid', 'backmarker'];
const SEEDS = [5, 17, 29, 41, 53];
const CIRCUITS = ['monza', 'suzuka', 'spa', 'silverstone', 'monaco'];
const LAPS = 3;

const results = {};
for (const id of CIRCUITS) {
  const circuit = circ.getCircuit(id);
  const track = tg.buildTrack(circuit);
  const base = cm.createChampionship().entries[0];
  results[id] = {};
  for (const preset of PRESETS) {
    const times = [];
    for (const seed of SEEDS) {
      const session = new rs.RaceSession({
        track,
        // `isPlayer: false` so the AI drives it: the session attaches no AI to the player's
        // slot, because that is what the headless simulator's autopilot is for.
        entries: [{ ...base, skill: preset, isPlayer: false }],
        type: rs.SESSION_TYPE.qualifying,
        totalLaps: LAPS,
        random: createRandom(seed),
        conditions: { compound: 'medium', weather: 'clear' },
        contacts: false
      });
      const budget = Math.ceil(track.lapRecord * 6 * 120);
      for (let i = 0; i < budget && !session.finished; i += 1) {
        session.update(rs.FIXED_TIMESTEP, { throttle: 0, brake: 0, steer: 0, handbrake: false });
      }
      const lap2 = session.cars[0].timer.laps[1];
      if (Number.isFinite(lap2)) times.push(lap2);
    }
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    results[id][preset] = {
      mean,
      sd: Math.sqrt(times.reduce((a, b) => a + (b - mean) ** 2, 0) / times.length),
      n: times.length
    };
  }
}

console.log(`flying lap (lap ${LAPS - 1}), mean of ${SEEDS.length} seeds\n`);
console.log('circuit     ' + PRESETS.map((p) => p.padStart(11)).join(''));
for (const id of CIRCUITS) {
  console.log(id.padEnd(12) + PRESETS.map((p) => results[id][p].mean.toFixed(2).padStart(11)).join(''));
}

console.log('\ngap to ace (real F1: pole to P20 ~1.2s, pole to a backmarker ~4-6s)');
for (const id of CIRCUITS) {
  const ace = results[id].ace.mean;
  console.log(`  ${id.padEnd(12)} ` + PRESETS.slice(1).map((p) => `${p} +${(results[id][p].mean - ace).toFixed(2)}s`).join('   '));
}

console.log('\nseed-to-seed scatter of the same flying lap (real F1: ~0.1-0.3s)');
let worst = 0;
for (const id of CIRCUITS) {
  const row = PRESETS.map((p) => `${p} ±${results[id][p].sd.toFixed(2)}`);
  worst = Math.max(worst, ...Object.values(results[id]).map((v) => v.sd));
  console.log(`  ${id.padEnd(12)} ` + row.join('   '));
}
console.log(`\nworst scatter anywhere: ${worst.toFixed(2)}s`);