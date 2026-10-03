/**
 * Teams, drivers and the grid.
 *
 * ## Real data, fictional results
 *
 * Teams, drivers, liveries and colours are the real ones. That is nominative use:
 * they identify the real-world subjects this game is a homage to, on a personal
 * non-commercial project, and no asset belonging to any team, manufacturer or
 * series is included or reproduced.
 *
 * What is *not* real is any part of the racing itself. No result, no championship
 * standing and no record here reflects anything that happened. The skill numbers
 * are hand-assigned estimates of relative pace and are not derived from real
 * results, and the `SKILL_PRESETS` buckets they map onto are invented.
 *
 * ## Where the numbers come from
 *
 * `TEAMS[].power` and `.grip` are relative development ratings in the range
 * 0.97-1.00. They are used to seed the championship standings and to give each AI
 * car's setup its own baseline, so the field is not identical. `.reliability` is
 * used by the AI's upgrade seeding.
 *
 * A 0.97 power rating means roughly a 3% engine deficit against the best car,
 * which is a plausible spread for a modern grid and produces lap times a few
 * tenths apart rather than a runaway.
 *
 * `.drs` is a per-team DRS effectiveness multiplier, because not every car is
 * equally strong down a straight.
 *
 * Note the team key is the team's real name and doubles as the identity key in
 * saved championships, so it must not change between releases -- `loadChampionship`
 * matches saved entries by driver `short`, which is the stable identifier.
 */

/** Pace presets: `pace` scales the AI's target speed, everything else shapes how it gets there. */
export const SKILL_PRESETS = {
  ace: {
    label: 'Ace',
    pace: 0.985,
    /** Fraction of the theoretical cornering limit actually used. */
    cornering: 0.97,
    brakeConfidence: 1.0,
    consistency: 0.03,
    aggression: 0.72,
    reactionMs: 90,
    /** How closely the racing line is followed, 0 = loose, 1 = glued. */
    linePrecision: 0.96,
    drsSkill: 0.9,
    mistakeChance: 0.004
  },
  strong: {
    label: 'Strong',
    pace: 0.962,
    cornering: 0.94,
    brakeConfidence: 0.96,
    consistency: 0.05,
    aggression: 0.6,
    reactionMs: 120,
    linePrecision: 0.9,
    drsSkill: 0.75,
    mistakeChance: 0.009
  },
  mid: {
    label: 'Mid',
    pace: 0.938,
    cornering: 0.91,
    brakeConfidence: 0.92,
    consistency: 0.075,
    aggression: 0.48,
    reactionMs: 165,
    linePrecision: 0.82,
    drsSkill: 0.6,
    mistakeChance: 0.016
  },
  backmarker: {
    label: 'Backmarker',
    pace: 0.908,
    cornering: 0.87,
    brakeConfidence: 0.87,
    consistency: 0.11,
    aggression: 0.36,
    reactionMs: 220,
    linePrecision: 0.72,
    drsSkill: 0.45,
    mistakeChance: 0.026
  }
};

/**
 * Relative development ratings per team.
 *
 * `power`/`grip`/`reliability` are 0.97-1.00. `drs` is a straight-line
 * multiplier. These are hand-assigned estimates of relative pace, deliberately
 * kept within a narrow band -- a wider spread produces a runaway rather than a
 * close field.
 */
export const TEAMS = {
  // Quoted: a team name containing a space is not a valid bare object key.
  'Red Bull Racing': { power: 1.0, grip: 1.0, reliability: 0.98, drs: 1.02, base: 0x1e41ff },
  Ferrari: { power: 0.995, grip: 0.995, reliability: 0.97, drs: 1.0, base: 0xe8002d },
  Mercedes: { power: 0.995, grip: 1.0, reliability: 0.95, drs: 1.0, base: 0x00d2be },
  /*
   * Every pair of (power, grip) must be distinct.
   *
   * They were not, and that is invisible in the table: McLaren and Aston Martin
   * both sat at 0.985/0.99, as did Alpine and Williams. Since the player's car
   * takes its baseline from these numbers, choosing McLaren gave you exactly the
   * same car as Aston Martin -- four of the ten choices in the team picker were
   * duplicates of another choice.
   *
   * The spreads are small because they are hand-assigned estimates and a wide
   * spread produces a runaway rather than a close field. Distinctness matters more
   * than the exact ordering.
   */
  McLaren: { power: 0.988, grip: 0.99, reliability: 0.95, drs: 0.99, base: 0xff8000 },
  'Aston Martin': { power: 0.982, grip: 0.992, reliability: 0.93, drs: 1.01, base: 0x006f62 },
  Alpine: { power: 0.978, grip: 0.986, reliability: 0.92, drs: 0.98, base: 0xff87bc },
  Williams: { power: 0.984, grip: 0.982, reliability: 0.91, drs: 1.0, base: 0x64c4ff },
  'Racing Bulls': { power: 0.976, grip: 0.983, reliability: 0.93, drs: 0.98, base: 0x3671c6 },
  Haas: { power: 0.972, grip: 0.976, reliability: 0.9, drs: 0.97, base: 0xb6babd },
  /*
   * Audi and Cadillac joined for 2026 in place of Alfa Romeo/Sauber, which makes
   * the grid eleven teams and twenty-two cars rather than ten and twenty.
   *
   * Both are new entrants and so sit at the bottom of the ratings, which is also
   * the honest ordering: a new team's first season is not a title fight.
   */
  Audi: { power: 0.971, grip: 0.977, reliability: 0.93, drs: 0.97, base: 0xf50537 },
  Cadillac: { power: 0.968, grip: 0.973, reliability: 0.88, drs: 0.96, base: 0x2b2b2b }
};

/**
 * The grid: real teams, real drivers, hand-assigned skill.
 *
 * `skill` buckets each driver into one of `SKILL_PRESETS` and is the only place
 * relative pace is expressed. Two teammates never share a bucket, which is what
 * stops the field reading as ten copies of one car.
 *
 * `short` is the stable identifier used in saved data and on the timing screens --
 * it is the three-letter driver code.
 *
 * `colour`/`accent` are the team's real livery colours.
 */
export const DRIVERS = [
  // Red Bull Racing
  { name: 'Max Verstappen', short: 'VER', team: 'Red Bull Racing', skill: 'ace', colour: 0x1e41ff, accent: 0xffd700 },
  { name: 'Isack Hadjar', short: 'HAD', team: 'Red Bull Racing', skill: 'strong', colour: 0x1e41ff, accent: 0xffd700 },
  // Ferrari
  { name: 'Charles Leclerc', short: 'LEC', team: 'Ferrari', skill: 'ace', colour: 0xe8002d, accent: 0xffffff },
  { name: 'Lewis Hamilton', short: 'HAM', team: 'Ferrari', skill: 'strong', colour: 0xe8002d, accent: 0xffffff },
  // Mercedes
  { name: 'George Russell', short: 'RUS', team: 'Mercedes', skill: 'strong', colour: 0x00d2be, accent: 0xffffff },
  { name: 'Kimi Antonelli', short: 'ANT', team: 'Mercedes', skill: 'mid', colour: 0x00d2be, accent: 0xffffff },
  // McLaren
  { name: 'Lando Norris', short: 'NOR', team: 'McLaren', skill: 'ace', colour: 0xff8000, accent: 0x0b1a3a },
  { name: 'Oscar Piastri', short: 'PIA', team: 'McLaren', skill: 'strong', colour: 0xff8000, accent: 0x0b1a3a },
  // Aston Martin
  { name: 'Fernando Alonso', short: 'ALO', team: 'Aston Martin', skill: 'strong', colour: 0x006f62, accent: 0xe4e4e4 },
  { name: 'Lance Stroll', short: 'STR', team: 'Aston Martin', skill: 'backmarker', colour: 0x006f62, accent: 0xe4e4e4 },
  // Williams
  { name: 'Carlos Sainz', short: 'SAI', team: 'Williams', skill: 'mid', colour: 0x64c4ff, accent: 0x0b1a3a },
  { name: 'Alexander Albon', short: 'ALB', team: 'Williams', skill: 'strong', colour: 0x64c4ff, accent: 0x0b1a3a },
  // Racing Bulls
  { name: 'Liam Lawson', short: 'LAW', team: 'Racing Bulls', skill: 'mid', colour: 0x3671c6, accent: 0xffffff },
  { name: 'Arvid Lindblad', short: 'LIN', team: 'Racing Bulls', skill: 'backmarker', colour: 0x3671c6, accent: 0xffffff },
  // Alpine
  { name: 'Pierre Gasly', short: 'GAS', team: 'Alpine', skill: 'strong', colour: 0xff87bc, accent: 0x1e3ba8 },
  { name: 'Franco Colapinto', short: 'COL', team: 'Alpine', skill: 'mid', colour: 0xff87bc, accent: 0x1e3ba8 },
  // Haas
  { name: 'Esteban Ocon', short: 'OCO', team: 'Haas', skill: 'mid', colour: 0xb6babd, accent: 0x1a1a1a },
  { name: 'Oliver Bearman', short: 'BEA', team: 'Haas', skill: 'strong', colour: 0xb6babd, accent: 0x1a1a1a },
  // Audi
  { name: 'Nico Hulkenberg', short: 'HUL', team: 'Audi', skill: 'mid', colour: 0xf50537, accent: 0xf0f0f0 },
  { name: 'Gabriel Bortoleto', short: 'BOR', team: 'Audi', skill: 'backmarker', colour: 0xf50537, accent: 0xf0f0f0 },
  // Cadillac
  { name: 'Sergio Perez', short: 'PER', team: 'Cadillac', skill: 'mid', colour: 0x2b2b2b, accent: 0xb0b0b0 },
  { name: 'Valtteri Bottas', short: 'BOT', team: 'Cadillac', skill: 'backmarker', colour: 0x2b2b2b, accent: 0xb0b0b0 }
];

/** Team names, for the team picker. */
export const TEAM_NAMES = Object.keys(TEAMS);

/** Every team's rating, looked up by name. */
export function teamFor(name) {
  return TEAMS[name] ?? { power: 0.98, grip: 0.98, reliability: 0.93, drs: 1, base: 0x888888 };
}

/** Drivers belonging to a team, in grid order. */
export function driversFor(team) {
  return DRIVERS.filter((driver) => driver.team === team);
}

/**
 * The player's entry.
 *
 * `team` is chosen at the start of a Quick Race, so the default is only a
 * placeholder until then. `colour`/`accent` come from the chosen team via
 * `playerEntryFor` in QuickRace.js.
 */
export const PLAYER_ENTRY = {
  name: 'YOU',
  short: 'YOU',
  team: 'Racing Bulls',
  colour: 0x3671c6,
  accent: 0xffffff
};

/** Build the AI skill record for a driver entry. */
export function skillFor(driver) {
  return SKILL_PRESETS[driver.skill] ?? SKILL_PRESETS.mid;
}

/** Map a skill preset onto the physics setup the car should run. */
export function setupFor(driver) {
  const team = teamFor(driver.team);
  return {
    grip: team.grip,
    powerScale: team.power,
    drsStrength: team.drs ?? 1,
    ersStrength: 1
  };
}