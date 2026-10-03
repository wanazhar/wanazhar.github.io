/**
 * Quick Race: pick a circuit, pick a team, pick a driver, pick conditions, race.
 *
 * A standalone mode that shares the physics, the track generator, the AI and the
 * race session with the championship, but has its own screen flow and touches none
 * of the championship state. Nothing here reads or writes the save file, so a
 * Quick Race cannot advance the season, cannot spend development points and cannot
 * be undone by the championship screens.
 *
 * Kept as its own module rather than folded into `ChampionshipManager` because the
 * two have genuinely different lifetimes: the championship is a long-lived mutable
 * object serialised between sessions, this is a value rebuilt from scratch every
 * time the menu opens.
 */

import { CIRCUITS, getCircuit } from '../track/circuits.js';
import { DRIVERS, TEAM_NAMES, teamFor } from '../physics/drivers.js';
import { COMPOUNDS, WEATHER, expectedLifeLaps, suitabilityFor } from '../physics/compounds.js';

/** Which screen of the Quick Race flow is showing. */
export const QUICK_RACE_SCREEN = {
  circuit: 'circuit',
  setup: 'setup'
};

/** Upgrade ids, kept in one place because both grids need the same shape. */
export const AI_SEED = { upgrades: { power: 0, aero: 0, brakes: 0, tyres: 0, drs: 0, reliability: 0 } };

/** A fresh selection, defaulting to the first circuit and team. */
export function createQuickRace(state = {}) {
  const team = TEAM_NAMES.includes(state.team) ? state.team : TEAM_NAMES[0];
  const drivers = DRIVERS.filter((driver) => driver.team === team);
  return {
    screen: QUICK_RACE_SCREEN.circuit,
    circuitId: CIRCUITS.some((c) => c.id === state.circuitId) ? state.circuitId : CIRCUITS[0].id,
    team,
    /**
     * The driver the player takes a seat as. `null` means they take a third seat in
     * the chosen team's livery rather than displacing a named driver.
     */
    driverShort: drivers.some((driver) => driver.short === state.driverShort) ? state.driverShort : null,
    compound: COMPOUNDS.some((c) => c.id === state.compound) ? state.compound : 'medium',
    weather: WEATHER.some((w) => w.id === state.weather) ? state.weather : 'clear'
  };
}

/** Pick a circuit. Throws on an unknown id, which is the validation. */
export function selectCircuit(quickRace, circuitId) {
  getCircuit(circuitId);
  quickRace.circuitId = circuitId;
  return quickRace;
}

/** Choose a team, clearing any driver that does not drive for it. */
export function selectTeam(quickRace, team) {
  if (!TEAM_NAMES.includes(team)) throw new Error(`Unknown team "${team}"`);
  quickRace.team = team;
  const drivers = DRIVERS.filter((driver) => driver.team === team);
  if (!drivers.some((driver) => driver.short === quickRace.driverShort)) quickRace.driverShort = null;
  return quickRace;
}

/** Take a seat as one of the team's real drivers, or `null` for a reserve seat. */
export function selectDriver(quickRace, driverShort) {
  const drivers = DRIVERS.filter((driver) => driver.team === quickRace.team);
  if (driverShort !== null && !drivers.some((driver) => driver.short === driverShort)) {
    throw new Error(`${driverShort} does not drive for ${quickRace.team}`);
  }
  quickRace.driverShort = driverShort;
  return quickRace;
}

export function selectCompound(quickRace, compoundId) {
  if (!COMPOUNDS.some((compound) => compound.id === compoundId)) {
    throw new Error(`Unknown compound "${compoundId}"`);
  }
  quickRace.compound = compoundId;
  return quickRace;
}

export function selectWeather(quickRace, weatherId) {
  if (!WEATHER.some((state) => state.id === weatherId)) throw new Error(`Unknown weather "${weatherId}"`);
  quickRace.weather = weatherId;
  return quickRace;
}

/** The driver the player is taking over, if any. */
export function chosenDriver(quickRace) {
  if (!quickRace.driverShort) return null;
  return DRIVERS.find((driver) => driver.short === quickRace.driverShort) ?? null;
}

/**
 * The player's entry, in the team's livery.
 *
 * When a real driver is chosen the player runs their car and keeps their name on
 * the timing screen, marked as the player. The field is still full: the AI list
 * drops that one driver so there is no duplicate, rather than the player displacing
 * someone and silently making the grid 19 cars.
 *
 * With no driver chosen the player takes a reserve seat in the team colours.
 */
export function playerEntryFor(quickRace) {
  const rating = teamFor(quickRace.team);
  const driver = chosenDriver(quickRace);
  return {
    name: driver ? driver.name : 'YOU',
    short: driver ? driver.short : 'YOU',
    team: quickRace.team,
    colour: driver ? driver.colour : rating.base,
    accent: driver ? driver.accent : 0xffffff
  };
}

/** Every AI car, minus whoever the player is taking over. */
export function fieldFor(quickRace) {
  return DRIVERS.filter((driver) => driver.short !== quickRace.driverShort);
}

/**
 * Build the entry list for a Quick Race grid.
 * @param {object} quickRace
 */
export function quickRaceEntries(quickRace) {
  const player = {
    ...playerEntryFor(quickRace),
    isPlayer: true,
    points: 0,
    upgrades: stockUpgrades(),
    developmentPoints: 0
  };
  const field = fieldFor(quickRace).map((driver) => ({
    ...driver,
    isPlayer: false,
    points: 0,
    upgrades: aiUpgradesFor(driver)
  }));
  return [player, ...field];
}

/** Quick Race runs a stock car: there is no development economy here. */
function stockUpgrades() {
  return { ...AI_SEED.upgrades };
}

/** AI development seeded from team rating, mirroring the championship's AI. */
function aiUpgradesFor(driver) {
  const team = teamFor(driver.team);
  const pace = { ace: 0.985, strong: 0.962, mid: 0.938, backmarker: 0.908 }[driver.skill] ?? 0.938;
  const tier = (value) => Math.max(0, Math.min(3, Math.round(value)));
  return {
    power: tier(Math.round((team.power - 0.975) * 40)),
    aero: tier(Math.round((team.grip - 0.975) * 40)),
    brakes: tier(pace > 0.97 ? 0.9 : pace > 0.93 ? 0.5 : 0.1),
    tyres: tier(pace > 0.95 ? 0.9 : pace > 0.92 ? 0.5 : 0.1),
    drs: tier((team.drs ?? 1) > 1.01 ? 0.9 : (team.drs ?? 1) > 0.99 ? 0.5 : 0.1),
    reliability: 0
  };
}

/**
 * Everything the setup screen needs to describe the choice, including whether it
 * is a sensible one. A bad compound in the wet is allowed -- mistakes are part of
 * it -- but the screen says so.
 */
export function setupSummary(quickRace) {
  const circuit = getCircuit(quickRace.circuitId);
  const compound = COMPOUNDS.find((candidate) => candidate.id === quickRace.compound);
  const weather = WEATHER.find((state) => state.id === quickRace.weather);
  return {
    circuit,
    compound,
    weather,
    driver: chosenDriver(quickRace),
    lifeLaps: expectedLifeLaps(quickRace.compound, quickRace.weather),
    suitability: suitabilityFor(quickRace.compound, quickRace.weather)
  };
}