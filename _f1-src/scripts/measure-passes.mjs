/**
 * Are positions won on pace?
 *
 * ## The question
 *
 * Whether a race result means anything depends on one property: **should being faster get you
 * past?** If track position is uncorrelated with pace, then winning does not require driving
 * better, and every headline figure derived from results -- including "the player wins 24 of 24"
 * -- is measuring the grid slot rather than the driving.
 *
 * ## Why it needs its own measurement
 *
 * Nothing else in the suite would catch it. A season completes cleanly, races are won, points
 * are scored, and every number looks plausible. The fault is only visible in the *relationship*
 * between two things that are individually fine.
 *
 * So this watches every position change at the lead and asks, of the car that gained the place:
 * was it faster than the car it took the place from?
 *
 * ## Reading the result
 *
 * A pass the model gets right has the faster car taking it, and the loser of the exchange being
 * meaningfully slower. Measured over one Monza race, with a 17.0s/lap pace spread across the
 * field:
 *
 *     gained by the FASTER car    42%
 *     gained by the SLOWER car    58%   median 4.18s/lap slower, up to 16.54s
 *
 * Cars 16 seconds a lap slower were overtaking faster cars. The two distributions had
 * near-identical shape, which is the signature of position being uncorrelated with pace rather
 * than of one driver being unlucky.
 *
 * Real F1 does not look like that: the faster car takes the place, and the exception is a
 * genuine error or a tyre situation, not a routine pass.
 *
 * ## Why nothing has fixed it yet
 *
 * The pass decision in `ai/AIDriver.js` is gated on closing rate, road shape and aggression --
 * none of which says whether this car is faster than the one in front. Gating it on pace was
 * tried and moved the split from 42% to 53%, but a driver that decides it cannot pass then has
 * nothing to do but follow, and the field queues until it wedges: Sepang failed outright.
 *
 * Separately, `overtakeIntent` conflates "committed to a pass" with "moving aside to avoid
 * contact", and that flag exempts a driver from the car-ahead speed limit -- so a car avoiding
 * another stops leaving room for it. Separating the two cost more contact than it gained in
 * passes (24s to 34s per car for 42% to 47%).
 *
 * Both are real and neither is a threshold. What is missing is traffic management: a driver who
 * cannot pass should use the slipstream, pick where to try, defend when overtaken, and manage
 * the car in front rather than parking in its gearbox. That is a subsystem, not a constant --
 * and it is the next thing to build, with this script as the number it has to move.
 */

import { installCanvasShim } from './helpers/domShim.mjs';

installCanvasShim();

const tg = await import('../src/track/trackGeometry.js');
const circ = await import('../src/track/circuits.js');
const rs = await import('../src/race/RaceSession.js');
const cm = await import('../src/championship/ChampionshipManager.js');
const drv = await import('../src/physics/drivers.js');
const { AIDriver } = await import('../src/ai/AIDriver.js');
const { createRandom } = await import('../src/util/math.js');

const CIRCUITS = process.argv.slice(2).length ? process.argv.slice(2) : ['monza', 'sepang', 'spa'];

/** How often the order at the lead is sampled. Every 5s: a pass takes longer than that. */
const SAMPLE_EVERY = 600;

/**
 * Why the player's seat is driven at `mid`.
 *
 * A pole-sitting `ace` is effectively untouchable and produces almost no passes to measure.
 * `mid` is deliberately mediocre so the leader is beatable, which is the only state where the
 * question has an answer.
 */
const PLAYER_PRESET = 'mid';

console.log('are positions won on pace? Real F1: the faster car takes the place.\n');
console.log('circuit     swaps  faster wins   slower wins   slower deficit   contact');

let totalSwaps = 0;
let totalFaster = 0;

for (const id of CIRCUITS) {
  const circuit = circ.getCircuit(id);
  const track = tg.buildTrack(circuit);
  const entries = cm.createChampionship().entries;
  const session = new rs.RaceSession({
    track,
    entries,
    type: rs.SESSION_TYPE.race,
    totalLaps: circuit.laps,
    gridOrder: entries.map((entry, index) => ({ entry, grid: index })),
    random: createRandom(20240218),
    seed: 20240218,
    conditions: { compound: 'medium', weather: 'clear' }
  });

  const player = session.player;
  player.isPlayer = false;
  player.ai = new AIDriver(player.physics, drv.SKILL_PRESETS[PLAYER_PRESET], {
    track,
    name: player.entry.short,
    random: createRandom(20240218)
  });
  player.ai.reset();

  const swaps = [];
  const contact = new Map(session.cars.map((car) => [car.entry.short, 0]));
  let previous = session.order.entries.map((entry) => entry.id);

  const budget = Math.ceil(track.lapRecord * circuit.laps * 4 * 120);
  for (let step = 0; step < budget && !session.finished; step += 1) {
    session.update(rs.FIXED_TIMESTEP, { throttle: 0, brake: 0, steer: 0, handbrake: false });
    for (const car of session.cars) {
      if (car.touching) contact.set(car.entry.short, contact.get(car.entry.short) + 1 / 120);
    }
    if (step % SAMPLE_EVERY) continue;

    const now = session.order.entries.map((entry) => entry.id);
    for (let k = 0; k < Math.min(now.length, previous.length); k += 1) {
      if (now[k] === previous[k]) continue;
      // Everything from k down to where the displaced car sat has changed order.
      const gained = session.cars.find((car) => car.entry.short === now[k]);
      const lost = session.cars.find((car) => car.entry.short === previous[k]);
      if (
        gained && lost &&
        Number.isFinite(gained.timer.bestLap) &&
        Number.isFinite(lost.timer.bestLap)
      ) {
        swaps.push({ faster: gained.timer.bestLap < lost.timer.bestLap, deficit: Math.abs(gained.timer.bestLap - lost.timer.bestLap) });
      }
      break;
    }
    previous = now;
  }

  const faster = swaps.filter((s) => s.faster);
  const slower = swaps.filter((s) => !s.faster);
  const medianDeficit = (list) => (list.length
    ? list.map((s) => s.deficit).sort((a, b) => a - b)[Math.floor(list.length / 2)]
    : NaN);
  const contactSorted = [...contact.values()].sort((a, b) => a - b);

  totalSwaps += swaps.length;
  totalFaster += faster.length;

  console.log(
    `${id.padEnd(10)} ${String(swaps.length).padStart(5)}  ` +
    `${String(faster.length).padStart(6)} (${((faster.length / Math.max(1, swaps.length)) * 100).toFixed(0)}%)  ` +
    `${String(slower.length).padStart(6)} (${((slower.length / Math.max(1, swaps.length)) * 100).toFixed(0)}%)  ` +
    `${(isFinite(medianDeficit(slower)) ? `${medianDeficit(slower).toFixed(2)}s` : '--').padStart(12)}  ` +
    `${contactSorted[Math.floor(contactSorted.length / 2)].toFixed(0)}s`
  );
}

console.log(
  `\noverall: ${((totalFaster / Math.max(1, totalSwaps)) * 100).toFixed(0)}% of positions won by the faster car`
);
console.log('a model where passing means anything should sit well above 50%, and the gap should widen with the pace spread.');