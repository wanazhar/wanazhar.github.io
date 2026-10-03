/**
 * Headless race simulator.
 *
 * Runs the real AI, the real physics and the real lap timing at a fixed step, so
 * a full race can be completed without a browser. This is how the AI's pace, the
 * speed profile and the race classification get checked.
 *
 *   node scripts/simulate.mjs               every circuit
 *   node scripts/simulate.mjs sakura        one circuit
 */

import { buildTrack } from '../src/track/trackGeometry.js';
import { CIRCUITS, getCircuit } from '../src/track/circuits.js';
import { RaceSession, SESSION_TYPE, FIXED_TIMESTEP } from '../src/race/RaceSession.js';
import { AIDriver } from '../src/ai/AIDriver.js';
import { DRIVERS, PLAYER_ENTRY, SKILL_PRESETS } from '../src/physics/drivers.js';
import { formatLapTime } from '../src/util/math.js';

/**
 * Hard cap per simulated session, so a stuck car cannot hang the script.
 *
 * Sized from the circuits, not guessed: the longest race is four laps of Ridgeline
 * at a 110s reference lap, and the AI needs margin over that. Too low a cap
 * reports "timed out" for a race that is merely slow, which hides real problems.
 */
const MAX_SECONDS = 1500;

/** Every entry gets the same upgrades so the AI skill is the only variable. */
function entriesForSimulation() {
  const base = { power: 1, aero: 1, brakes: 1, tyres: 1, drs: 1, reliability: 1 };
  return [
    { ...PLAYER_ENTRY, isPlayer: true, upgrades: { ...base } },
    ...DRIVERS.map((driver) => ({ ...driver, isPlayer: false, upgrades: { ...base } }))
  ];
}

/**
 * Run one session. Every car, including the player entry, is driven by the AI,
 * so the grid runs unattended.
 */
function runSession(circuitId, { type = SESSION_TYPE.race, laps = null } = {}) {
  const circuit = getCircuit(circuitId);
  const track = buildTrack(circuit);
  const entries = entriesForSimulation();
  const totalLaps = laps ?? circuit.laps;

  const session = new RaceSession({ track, entries, type, totalLaps, random: () => 0.5 });

  // The player slot is handed to an AI so the race completes without input.
  // It stops being "the player" so it also gets the automatic recovery an AI car
  // gets; `playerShort` is what identifies it in the results instead.
  const playerCar = session.player;
  const playerShort = playerCar.entry.short;
  playerCar.isPlayer = false;
  playerCar.ai = new AIDriver(playerCar.physics, SKILL_PRESETS.ace, {
    track,
    name: playerCar.entry.short,
    random: () => 0.5
  });
  playerCar.ai.reset();

  const idle = { throttle: 0, brake: 0, steer: 0, handbrake: false };
  const maxSteps = Math.ceil(MAX_SECONDS / FIXED_TIMESTEP);
  let steps = 0;
  while (!session.finished && steps < maxSteps) {
    session.update(FIXED_TIMESTEP, idle);
    steps += 1;
  }

  return { circuit, track, session, steps, completed: session.finished, playerShort };
}

function report(circuitId) {
  const { circuit, track, session, steps, completed, playerShort } = runSession(circuitId);
  const results = session.results();
  const fastest = session.fastestLap();
  const player = results.find((result) => result.short === playerShort);

  console.log(`\n=== ${circuit.name} (${circuit.id}) ===`);
  console.log(
    ` lap ${(track.length / 1000).toFixed(2)}km  ideal ${formatLapTime(track.lapRecord)}  ` +
      `simulated ${(steps * FIXED_TIMESTEP).toFixed(0)}s  ${completed ? 'finished' : 'TIMED OUT'}`
  );
  console.log(
    ` player: P${player?.position ?? '-'}  best ${player?.bestLap ? formatLapTime(player.bestLap) : 'NONE'}`
  );
  console.log(` fastest lap: ${fastest.holder ?? '-'} ${formatLapTime(fastest.time)}`);

  for (const result of results) {
    const move = result.retired || !result.position ? '' : `  (${result.gained > 0 ? '+' : ''}${result.gained})`;
    console.log(
      `  ${String(result.position ?? 'DNF').padStart(3)}  ${result.short.padEnd(4)}` +
        ` ${formatLapTime(result.bestLap).padStart(9)}  ${String(result.points ?? 0).padStart(2)} pts${move}`
    );
  }

  const noLap = results.filter((result) => result.bestLap === null);
  const problems = [];
  if (!completed) problems.push('timed out');
  if (noLap.length) problems.push(`${noLap.length} car(s) never set a lap`);

  // Pace is reported, not enforced. The track's lap estimate is an idealised
  // figure derived from a steady-state cornering model; a car that also has to
  // find the line, brake in time and recover from a mistake is legitimately
  // slower. The number is useful, but only a pathological ratio means something
  // is actually broken.
  if (player?.bestLap) {
    const ratio = player.bestLap / track.lapRecord;
    console.log(
      `  pace: ${formatLapTime(player.bestLap)} against an ideal ${formatLapTime(track.lapRecord)} (${(ratio * 100 - 100).toFixed(0)}% off)`
    );
    if (ratio > 2.5) problems.push(`pace ${(ratio * 100 - 100).toFixed(0)}% off the ideal is pathological`);
  }
  if (problems.length) console.log(`  !! ${problems.join('; ')}`);
  return problems;
}

const only = process.argv[2];
const failures = [];

if (only) {
  failures.push(...report(only));
} else {
  for (const circuit of CIRCUITS) {
    failures.push(...report(circuit.id));
  }
}

console.log('');
if (failures.length) {
  console.log(`${failures.length} problem(s) found.`);
  process.exitCode = 1;
} else {
  console.log('All circuits simulated cleanly.');
}

