/**
 * Simulate a full championship season across every circuit, headless.
 *
 * The calendar is 23 rounds now rather than 6, so `simulate.mjs` racing one round
 * at a time is not enough to know the season holds together: a grid that
 * completes a lap is not the same as a season that completes. This runs all of it,
 * applying results through the real championship code, and reports anything that
 * goes wrong.
 *
 * Run: node scripts/simulate-all.mjs [--races N]
 */

import { CIRCUITS } from '../src/track/circuits.js';
import {
  applyRaceResult,
  createChampionship,
  currentRound,
  playerSummary,
  standings
} from '../src/championship/ChampionshipManager.js';
import { FIXED_TIMESTEP, RaceSession, SESSION_TYPE } from '../src/race/RaceSession.js';
import { AIDriver } from '../src/ai/AIDriver.js';
import { SKILL_PRESETS } from '../src/physics/drivers.js';
import { createRandom } from '../src/util/math.js';
import { buildTrack } from '../src/track/trackGeometry.js';

/**
 * Give up on a session that runs this long, in simulated seconds.
 *
 * Generous on purpose. The AI runs roughly 30% slower than the ideal lap the
 * track generator estimates, so a 4-lap race on a 5.4km circuit takes about 19
 * minutes of simulated time. A tight timeout reports every round as TIMED OUT
 * while the race is in fact progressing normally.
 */
const TIMEOUT_SECONDS = 1800;

/**
 * How long to allow one round, in simulated seconds.
 *
 * Derived from the round rather than fixed. The flat 1800 was sized for "a 4-lap race on a
 * 5.4km circuit takes about 19 minutes", and when the calendar went to 6-9 laps every
 * round in the season reported TIMED OUT while progressing perfectly normally -- which is
 * exactly the failure the constant's own comment warns about. A budget that has to be
 * remembered in step with the calendar is a budget that will silently lie again.
 *
 * Three times the ideal race distance: the AI runs 10-30% slower than the track
 * generator's estimate, and the margin has to absorb rescues as well as pace.
 */
function timeoutFor(track, laps) {
  return Math.max(TIMEOUT_SECONDS, Math.ceil(track.lapRecord * laps * 3));
}

const raceCount = (() => {
  const index = process.argv.indexOf('--races');
  return index >= 0 ? Number(process.argv[index + 1]) : CIRCUITS.length;
})();

const championship = createChampionship();

/**
 * A fresh generator per round, seeded from the round number.
 *
 * One generator shared across the whole season meant every round depended on how
 * many random numbers the previous rounds had consumed. That is not reproducible --
 * re-running with one circuit changed would shift every later round -- and it made
 * a failure impossible to pin down: Montreal completes five laps in 633s when driven
 * with a fresh generator, and timed out at 1800s with the shared one, on the same
 * circuit with the same field.
 */
const SEED_BASE = 20240218;
const randomFor = (round) => createRandom(SEED_BASE + round);
/** The same seed, passed on so per-car damage streams replay identically. */
const seedFor = (round) => SEED_BASE + round;

/**
 * Hand the player slot to an AI so the race runs unattended.
 *
 * Without this the player's car sits at the start line under idle controls -- no
 * throttle, no steering -- and never completes a lap. The session then runs until
 * it times out, which is what made the first version of this script report every
 * round as TIMED OUT while the season silently never finished.
 *
 * Marking it `isPlayer = false` also gives it the automatic recovery that stranded
 * AI cars get; the entry's `short` is still `YOU`, so results still identify it.
 */
function autopilot(session, track, random) {
  const car = session.player;
  car.isPlayer = false;
  car.ai = new AIDriver(car.physics, SKILL_PRESETS.ace, {
    track,
    name: car.entry.short,
    random
  });
  car.ai.reset();
  return car;
}

console.log(`Simulating a full season: ${raceCount} rounds, ${championship.entries.length} cars\n`);

/** Every session simulated, so the retirement tally at the end can see across the season. */
const sessions = [];
console.log('round  circuit           laps  winner  fastest  pace vs ideal  status');

let failures = 0;

for (let round = 0; round < raceCount; round += 1) {
  const circuit = currentRound(championship);
  if (!circuit) break;

  // The track must be built before the session, not patched in afterwards:
  // `RaceSession` reads `track.grid` in its constructor to place the cars, so
  // supplying it lazily is too late.
  const track = buildTrack(circuit);

  const random = randomFor(round);
  const session = new RaceSession({
    track,
    entries: championship.entries,
    type: SESSION_TYPE.race,
    totalLaps: circuit.laps,
    gridOrder: championship.entries.map((entry, index) => ({ entry, grid: index })),
    random,
    seed: seedFor(round),
    // `APEXGP_CONTACTS=0` runs the same season with car-to-car contact disabled, so
    // the effect of collisions on race completion can be measured rather than
    // argued about.
    contacts: process.env.APEXGP_CONTACTS !== '0'
  });

  autopilot(session, track, random);

  const controls = { throttle: 0, brake: 0, steer: 0, handbrake: false };
  let steps = 0;
  const maxSteps = Math.ceil(timeoutFor(track, circuit.laps) / FIXED_TIMESTEP);

  while (!session.finished && steps < maxSteps) {
    session.update(FIXED_TIMESTEP, controls);
    steps += 1;
  }

  const timedOut = steps >= maxSteps;
  sessions.push(session);

  const results = session.results();
  const fastest = session.fastestLap();
  const winner = results.find((result) => result.position === 1);
  const fastestName = championship.entries.find((entry) => entry.short === fastest.holder)?.name ?? fastest.holder;

  // Pace against the ideal lap the track generator estimates. The AI is slower
  // than the estimate by design -- the profile assumes an ideal driver -- so this
  // is a sanity band, not a target.
  const ideal = track.lapRecord;
  // `fastestLap()` reports the session's fastest lap; fall back to the results if
  // no car completed a timed lap, which is the case to report rather than hide.
  const bestActual = fastest.lapTime ?? results.find((r) => r.bestLap)?.bestLap ?? Infinity;
  const paceRatio = Number.isFinite(bestActual) ? bestActual / ideal : Infinity;

  /*
   * Report *which* cars failed to complete, not just that the round timed out.
   *
   * "TIMED OUT" on its own is not a diagnosis. On the real circuits a handful of
   * AI cars get stuck somewhere -- a spin, or wedged against a barrier -- and the
   * session then never finishes. Naming them is the difference between "this
   * circuit is broken" and "the AI stalls at the hairpin", and the second is
   * actionable.
   */
  /*
   * Which cars failed, and how they failed.
   *
   * "TIMED OUT" is a symptom, not a diagnosis. A car that never completed a lap, a
   * car that completed some and then stopped, and a car that was merely slow are
   * three different problems needing three different fixes, so report the shape of
   * the failure as well as its existence.
   */
  const neverLapped = results.filter((result) => result.bestLap === null);
  const stuck = neverLapped.map((result) => {
    const car = session.cars.find((candidate) => candidate.entry.short === result.short);
    const laps = car?.timer?.lap ?? 0;
    const retired = car?.retired === true;
    const recovered = (car?.rescues ?? 0) > 0;
    /*
     * Why it retired, not just that it did. A mechanical failure, accumulated damage and a
     * car wedged in a barrier are three different problems, and reporting only the first word
     * ("retired") is what left a regression invisible behind an otherwise clean season.
     */
    const why = car?.retirementReason ? ` ${car.retirementReason}` : '';
    return `${result.short}(laps ${laps}/${circuit.laps}${retired ? `, retired${why}` : ''}${recovered ? `, ${car.rescues} rescues` : ''})`;
  });

  let status = 'ok';
  if (timedOut) {
    status = stuck.length ? `STUCK: ${stuck.join(' ')}` : 'TIMED OUT';
    failures += 1;
  } else if (stuck.length) {
    status = `${stuck.length} never completed: ${stuck.join(' ')}`;
  } else if (!winner) {
    status = 'NO WINNER';
    failures += 1;
  } else if (paceRatio > 2.5) {
    status = 'slow AI';
  }

  console.log(
    `R${String(round + 1).padStart(2)}    ${circuit.id.padEnd(16)} ${String(circuit.laps).padStart(4)}  ` +
      `${String(winner?.short ?? '—').padEnd(7)} ${String(fastestName.split(' ').pop()).padEnd(8)} ` +
      `${(Number.isFinite(paceRatio) ? paceRatio.toFixed(2) : 'n/a').padStart(6)}x ideal  ${status}`
  );

  applyRaceResult(
    championship,
    results.map((result) => ({
      short: result.short,
      position: result.position,
      retired: result.retired,
      fastestLap: result.short === fastest.holder
    })),
    fastest.holder
  );
}

console.log(`\nchampionship round now ${championship.round}, finished: ${championship.finished}`);

const table = standings(championship);
const player = playerSummary(championship);
console.log('\nfinal standings (top 10):');
for (const [index, row] of table.slice(0, 10).entries()) {
  console.log(
    `  ${String(index + 1).padStart(2)}. ${String(row.name).padEnd(20)} ${String(row.short).padEnd(4)} ` +
      `${String(row.points).padStart(3)} pts  ${row.wins}W ${row.podiums}P`
  );
}

console.log(
  `\nplayer: P${player.position}, ${player.points} pts, ${player.wins} win(s), ` +
    `${player.developmentPoints} development point(s)`
);

/*
 * Retirements across the season, by cause.
 *
 * A season where nothing retires and a season where half the grid does not are equally wrong,
 * and neither shows up in the pass/fail line -- every round completes cleanly either way. So
 * the distribution is printed. A mechanical failure landing in lap 1 is ordinary racing; a
 * handful of them is a rate that has been miscalibrated, and only the total shows which.
 */
const retirementTally = new Map();
for (const session of sessions) {
  for (const car of session.cars) {
    if (!car.retired) continue;
    const why = car.retirementReason ?? 'UNCLASSIFIED';
    retirementTally.set(why, (retirementTally.get(why) ?? 0) + 1);
  }
}
if (retirementTally.size) {
  const total = [...retirementTally.values()].reduce((a, b) => a + b, 0);
  const breakdown = [...retirementTally.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([why, count]) => `${why} ${count}`)
    .join(', ');
  console.log(`retirements: ${total} over ${sessions.length} rounds (${(total / sessions.length).toFixed(2)} per round) -- ${breakdown}`);
} else {
  console.log('retirements: none');
}

if (failures > 0) {
  console.log(`\n${failures} round(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll rounds completed cleanly.');
}