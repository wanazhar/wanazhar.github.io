/**
 * Championship state: calendar, results, standings and the player's development.
 *
 * The manager owns all of it and knows how to serialise itself, so the UI only
 * has to render what it is given and the game loop only has to ask questions.
 */

import { CIRCUITS } from '../track/circuits.js';
import { createStore } from '../util/storage.js';
import {
  UPGRADES,
  applyUpgrades,
  developmentPointsFor,
  normaliseTier,
  upgradeCost
} from '../physics/upgrades.js';
import { DRIVERS, PLAYER_ENTRY, TEAMS, setupFor, skillFor } from '../physics/drivers.js';

/** F1 points for positions 1..10. */
export const POINTS_TABLE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export const SESSION = {
  qualifying: 'qualifying',
  race: 'race'
};

export const SESSION_LENGTH = {
  [SESSION.qualifying]: 12,
  [SESSION.race]: null
};

export function pointsForPosition(position) {
  return POINTS_TABLE[position - 1] ?? 0;
}

/** A brand-new championship: every driver on zero points, player on stock car. */
export function createChampionship(store = createStore()) {
  return {
    store,
    round: 0,
    entries: [
      { ...PLAYER_ENTRY, isPlayer: true, points: 0, upgrades: stockUpgrades(), developmentPoints: 0 },
      ...DRIVERS.map((driver) => ({
        ...driver,
        isPlayer: false,
        points: 0,
        upgrades: aiUpgradesFor(driver)
      }))
    ],
    /** Per-round results, kept for the calendar screen. */
    history: CIRCUITS.map(() => []),
    raceNumber: 0,
    finished: false
  };
}

function stockUpgrades() {
  return Object.fromEntries(UPGRADES.map((upgrade) => [upgrade.id, 0]));
}

/**
 * AI development, seeded from team rating and driver skill.
 *
 * Two separate inputs, deliberately. The team sets the car's baseline pace and the
 * driver sets how well that car is driven, which is why two teammates can be
 * meaningfully different and why a backmarker in a good car can still be beaten.
 *
 * Both contributions are centred on tier 1 out of 0-3, and the whole range across
 * the field is one tier. That is much narrower than it looks, but it is
 * deliberate: an earlier version scaled the team's contribution by
 * `(team.power - 0.975) * 40`, which assumed team ratings spanned a wide band.
 * With the real ratings -- a 0.97-1.00 range, roughly a 3% spread -- that
 * multiplier produced either 0 or 2 with nothing in between, and the skill term
 * added a flat +3 to anyone above 0.95 pace. The result was six distinct setups
 * across twenty cars, with the top half of the field all running identical
 * maximum upgrades.
 *
 * Narrow tiers also keep the championship meaningful. Development points buy tiers
 * for the player, so an AI field that starts near maximum leaves nothing to earn.
 */
function aiUpgradesFor(driver) {
  const team = TEAMS[driver.team] ?? { power: 0.98, grip: 0.98, drs: 1, reliability: 0.93 };
  const skill = skillFor(driver);

  // 0 at the worst team/driver combination, 2 at the best, centred on 1.
  const teamPower = normalise01((team.power - 0.968) / 0.032);
  const teamGrip = normalise01((team.grip - 0.973) / 0.027);
  const skillTier = normalise01((skill.pace - 0.90) / 0.085);

  const tier = (value) => clampTier(Math.round(value * 2));

  // Clamped to 2, not the full 0-3 range. `POWER_TIERS.values` run 1.0 to 1.105,
  // so tier 3 is a 10.5% power advantage -- and that is on top of the team's own
  // rating, which already scales power. An AI on tier 3 in a top car therefore
  // beats the player's fully upgraded car in a top car by a wide margin, which is
  // not a race.
  //
  // Tier 2 (3.5%) leaves the player's upgrade path worth taking: development points
  // buy tier 3, and that is enough to matter.
  const capped = (value) => Math.min(2, tier(value));
  return {
    power: capped((teamPower + skillTier) / 2),
    aero: capped((teamGrip + skillTier) / 2),
    brakes: capped(skill.pace > 0.97 ? 0.9 : skill.pace > 0.93 ? 0.5 : 0.1),
    tyres: capped(skill.pace > 0.95 ? 0.9 : skill.pace > 0.92 ? 0.5 : 0.1),
    drs: capped((team.drs ?? 1) > 1.01 ? 0.9 : (team.drs ?? 1) > 0.99 ? 0.5 : 0.1),
    reliability: 0
  };
}

/** Map a value from an arbitrary range onto 0-1, clamped. */
function normalise01(value) {
  return Math.max(0, Math.min(1, value));
}

function clampTier(value) {
  return Math.max(0, Math.min(3, Math.round(value)));
}

export const playerEntry = (championship) => championship.entries.find((entry) => entry.isPlayer);

/** Physics setup for the player's current car, upgrades applied. */
export function playerSetup(championship) {
  const entry = playerEntry(championship);
  return applyUpgrades(entry.upgrades, baseSetupFor(entry));
}

/**
 * The team-derived part of a car's setup.
 *
 * The player gets this too. It used to be hardcoded to `{ powerScale: 1, grip: 1 }`
 * for the player and the team rating only for AI cars -- so picking a team in Quick
 * Race changed the car's livery and nothing else. Choosing Haas gave you a Haas.
 */
function baseSetupFor(entry) {
  const base = setupFor(entry);
  return {
    powerScale: base.powerScale,
    grip: base.grip,
    drsStrength: base.drsStrength,
    ersStrength: base.ersStrength
  };
}

/** Physics setup for any entry, upgrades applied on top of its team rating. */
export function setupForEntry(entry) {
  return applyUpgrades(entry.upgrades, baseSetupFor(entry));
}

/** The round being raced next. */
export function currentRound(championship) {
  if (championship.round >= CIRCUITS.length) return null;
  return CIRCUITS[championship.round];
}

/** Standings sorted by points, then by best finishes. */
export function standings(championship) {
  return [...championship.entries]
    .map((entry) => {
      // Matched on `short`. This used to match on `result.id`, but history rows are
  // recorded with a `short` field and nothing writes `id`, so the filter never
  // matched anything: every driver reported zero wins and zero podiums all season,
  // and the standings fell back to sorting purely on points.
  const results = championship.history.flat().filter((result) => result.short === entry.short);
      const wins = results.filter((result) => result.position === 1).length;
      const podiums = results.filter((result) => result.position <= 3).length;
      return { ...entry, wins, podiums, races: results.length };
    })
    .sort((a, b) => b.points - a.points || b.wins - a.wins || b.podiums - a.podiums || a.short.localeCompare(b.short));
}

/**
 * Apply a finishing order to the championship.
 * @param {Array<{short: string, position: number|null, fastestLap: boolean, retired: boolean}>} results
 */
export function applyRaceResult(championship, results, fastestLapHolder) {
  for (const result of results) {
    const entry = championship.entries.find((candidate) => candidate.short === result.short);
    if (!entry) continue;
    if (result.retired || result.position === null) {
      result.points = 0;
      if (entry.isPlayer) entry.developmentPoints += 0;
      continue;
    }
    result.points = pointsForPosition(result.position);
    entry.points += result.points;
    if (entry.isPlayer) {
      entry.developmentPoints += developmentPointsFor(result.position, true);
    }
  }
  if (fastestLapHolder && !results.find((r) => r.short === fastestLapHolder)?.retired) {
    // The point only counts if the holder is classified in the top ten.
    const holder = results.find((result) => result.short === fastestLapHolder);
    if (holder && holder.position !== null && holder.position <= 10) {
      holder.points += 1;
      const entry = championship.entries.find((candidate) => candidate.short === fastestLapHolder);
      if (entry) entry.points += 1;
    }
  }

  championship.history[championship.round] = results.map((result) => ({
    short: result.short,
    position: result.position,
    points: result.points ?? 0,
    retired: Boolean(result.retired),
    fastestLap: result.short === fastestLapHolder
  }));
  championship.round += 1;
  if (championship.round >= CIRCUITS.length) championship.finished = true;
  return championship;
}

/** Cost of the next tier for one upgrade, or null when it is maxed. */
export function nextUpgradeCost(championship, upgradeId) {
  const upgrade = UPGRADES.find((candidate) => candidate.id === upgradeId);
  if (!upgrade) return null;
  const entry = playerEntry(championship);
  const current = normaliseTier(upgrade, entry.upgrades[upgradeId] ?? 0);
  if (current >= upgrade.values.length - 1) return null;
  return upgradeCost(upgrade, current, current + 1);
}

/** Buy one tier. Returns false when it is unaffordable or already maxed. */
export function buyUpgrade(championship, upgradeId) {
  const upgrade = UPGRADES.find((candidate) => candidate.id === upgradeId);
  if (!upgrade) return false;
  const entry = playerEntry(championship);
  const current = normaliseTier(upgrade, entry.upgrades[upgradeId] ?? 0);
  if (current >= upgrade.values.length - 1) return false;
  const cost = upgradeCost(upgrade, current, current + 1);
  if (entry.developmentPoints < cost) return false;
  entry.developmentPoints -= cost;
  entry.upgrades[upgradeId] = current + 1;
  return true;
}

/** Reset every upgrade back to stock, refunding nothing. */
export function resetUpgrades(championship) {
  const entry = playerEntry(championship);
  entry.upgrades = stockUpgrades();
}

export function saveChampionship(championship) {
  return championship.store.save({
    version: 1,
    round: championship.round,
    finished: championship.finished,
    history: championship.history,
    entries: championship.entries.map((entry) => ({
      short: entry.short,
      points: entry.points,
      upgrades: entry.upgrades,
      developmentPoints: entry.developmentPoints ?? 0
    }))
  });
}

/** Restore a saved championship, or return null if the save is unusable. */
export function loadChampionship(championship) {
  const saved = championship.store.load();
  if (!saved || saved.version !== 1 || !Array.isArray(saved.entries)) return null;
  const byName = new Map(saved.entries.map((entry) => [entry.short, entry]));
  for (const entry of championship.entries) {
    const found = byName.get(entry.short);
    if (!found) return null;
    entry.points = found.points ?? 0;
    entry.upgrades = { ...stockUpgrades(), ...found.upgrades };
    if (entry.isPlayer) entry.developmentPoints = found.developmentPoints ?? 0;
  }
  championship.round = saved.round ?? 0;
  championship.finished = Boolean(saved.finished);
  championship.history = CIRCUITS.map((_, index) => saved.history?.[index] ?? []);
  return championship;
}

/** Standings rows enriched with the round each entry has yet to race. */
export function calendarView(championship) {
  return CIRCUITS.map((circuit, index) => ({
    circuit,
    round: index + 1,
    state: index < championship.round ? 'done' : index === championship.round ? 'next' : 'upcoming',
    results: championship.history[index] ?? []
  }));
}

export function clearSave(championship) {
  championship.store.clear();
  return createChampionship(championship.store);
}

/** Head-to-head summary of the player's season so far. */
export function playerSummary(championship) {
  const entry = playerEntry(championship);
  const table = standings(championship);
  const position = table.findIndex((row) => row.short === entry.short) + 1;
  return {
    points: entry.points,
    position: position || table.length,
    developmentPoints: entry.developmentPoints ?? 0,
    wins: table.find((row) => row.short === entry.short)?.wins ?? 0
  };
}

export { TEAMS };