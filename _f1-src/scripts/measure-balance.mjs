/**
 * The balance question, with somebody actually in the driver's seat.
 *
 * ## Why this exists
 *
 * The headline figure reported for this project -- "the player wins 24 of 24" -- is a harness
 * artifact. `simulate-all.mjs` attaches an `ace` autopilot to the player's car, and an `ace`
 * autopilot is not a person: it reacts in 90ms, holds the line to 0.96, and never makes a
 * mistake. Beating the field with one of those says the autopilot is quick. It says nothing
 * about whether a game is winnable, or fair.
 *
 * So this runs the same season three times, changing one thing: which driver sits in the
 * player's seat.
 *
 * ## What counts as a good result
 *
 * A real F1 season: a driver wins some races and finishes every point. Pole is achievable for
 * the best in the world but not expected. The question here is narrower and answerable:
 *
 *   - is a competent human fast enough to win some races?  (otherwise the game is not winnable)
 *   - but not so fast that every race is a walkover?   (otherwise it is not a race)
 *   - and does the result come from driving rather than from the field retiring around it?
 *
 * The last point is why retirements are reported per run. A driver can "win" a season by
 * outliving a mechanical failure rate that removes rivals, which is not a performance.
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

const ROUNDS = Number(process.argv[2] ?? 12);

/** Which driver sits in the player's seat. Everything else is identical between runs. */
function runSeason(playerPreset) {
  const championship = cm.createChampionship();
  const playerShort = championship.entries.find((entry) => entry.isPlayer)?.short ?? 'YOU';
  let wins = 0;
  let podiums = 0;
  let points = 0;
  let races = 0;
  const positions = [];
  const paceMargins = [];
  let retirements = 0;

  for (let round = 0; round < ROUNDS; round += 1) {
    const circuit = circ.CIRCUITS[round % circ.CIRCUITS.length];
    const track = tg.buildTrack(circuit);
    const entries = championship.entries;
    const session = new rs.RaceSession({
      track,
      entries,
      type: rs.SESSION_TYPE.race,
      totalLaps: circuit.laps,
      gridOrder: entries.map((entry, index) => ({ entry, grid: index })),
      random: createRandom(20240218 + round),
      seed: 20240218 + round,
      conditions: { compound: 'medium', weather: 'clear' }
    });

    // The only difference between runs: who is driving the player's car.
    const player = session.player;
    player.isPlayer = false;
    player.ai = new AIDriver(
      player.physics,
      drv.SKILL_PRESETS[playerPreset],
      { track, name: player.entry.short, random: createRandom(20240218 + round) }
    );
    player.ai.reset();

    const budget = Math.ceil(track.lapRecord * circuit.laps * 4 * 120);
    for (let i = 0; i < budget && !session.finished; i += 1) {
      session.update(rs.FIXED_TIMESTEP, { throttle: 0, brake: 0, steer: 0, handbrake: false });
    }
    if (!session.finished) continue;

    races += 1;
    const result = session.results().find((entry) => entry.short === playerShort);
    const best = session.player.timer.bestLap;
    // How does the player compare with the rest of the field on the same circuit?
    const field = session.cars
      .filter((car) => car !== session.player && Number.isFinite(car.timer.bestLap))
      .map((car) => car.timer.bestLap)
      .sort((a, b) => a - b);
    if (field.length && Number.isFinite(best)) {
      const median = field[Math.floor(field.length / 2)];
      paceMargins.push(best - median);
    }
    if (!result) continue;
    positions.push(result.position);
    if (result.position === 1) wins += 1;
    if (result.position <= 3) podiums += 1;
    if (result.retired) retirements += 1;
  }
  return { wins, podiums, races, positions, retirements, paceMargins };
}

console.log(`same ${ROUNDS} rounds, three times; only the player\'s seat changes\n`);
for (const preset of ['ace', 'human', 'mid']) {
  const run = runSeason(preset);
  if (!run.races) {
    console.log(`${preset.padEnd(8)} no races completed`);
    continue;
  }
  const spread = run.positions.reduce((a, b) => a + b, 0) / run.positions.length;
  console.log(
    `${preset.padEnd(8)} ${run.wins} win(s), ${run.podiums} podium(s) of ${run.races}  ` +
    `avg P${spread.toFixed(1)}  retirements ${run.retirements}` +
    (run.paceMargins.length
      ? `  player ${(run.paceMargins.reduce((a, b) => a + b, 0) / run.paceMargins.length).toFixed(2)}s off field median`
      : '')
  );
}