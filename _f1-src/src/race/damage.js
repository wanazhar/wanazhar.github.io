/**
 * Damage.
 *
 * ## What was missing
 *
 * Contact cost *position* and nothing else. `collision.js` resolved every shunt
 * correctly -- impulse, yaw kick, positional correction -- and then threw the energy away.
 * Two cars could lean on each other for a season and both finish on the lead lap, because
 * nothing in the model recorded that the nose had gone in. There was no `damage` anywhere
 * in `src/`, and `TEAMS[].reliability` was inert in three places: it seeded upgrade
 * priority, it was documented as feeding mechanical failure, and it never did.
 *
 * ## Why damage and not just a time penalty
 *
 * A lap-time deduction is a number the HUD prints. Real damage changes how the car
 * *drives*, and that is the difference between a penalty and a problem: a damaged car
 * understeers into a corner it used to take flat, and the driver has to change what they
 * do. So damage is expressed as lost downforce and lost power, both of which the physics
 * already computes from, and the lap time falls out of the handling rather than being
 * subtracted from it.
 *
 * ## Calibrating the threshold
 *
 * This number took three attempts and a lot of wrong intermediate answers, which is why the
 * method is written down rather than just the result.
 *
 * The first measurement watched `car.contact.age === 0`. That is not a valid way to count
 * impacts: `collision.js` `recordContact` returns early when a car already has a contact with
 * the same opponent, and the `return` leaves the function, so the *other* car in the pair
 * never has its contact refreshed. Its age never returns to zero and an `age === 0` watcher
 * misses every repeat contact involving it. That undercount produced a distribution with a
 * `p90` of 6.77 and a max of 15, and a threshold derived from it retired nine cars in the
 * first hundred seconds of a race.
 *
 * The second attempt counted a per-car flag properly and got a plausible-looking answer --
 * 1850 impacts a race, `p90 = 6.77`, max 15, and 38 events per race above 14. It was still
 * wrong, by about a factor of twenty, for the same underlying reason: the flag was read
 * *before* `update()`, so it reported the previous frame's decision rather than this one's.
 *
 * The third attempt reads the counters the session writes from inside the step, which is the
 * only thing that cannot drift from the code that actually runs. Over a full Monza race:
 *
 *     contacts considered      27,507
 *     p50   0.07      p90   0.19      p99   4.37      p99.9  14.53
 *     >= 10      83 events    3.6 per car
 *     >= 20      14 events    0.6 per car
 *     >= 30      14 events    0.6 per car
 *
 * `p90 = 0.19` is the load-bearing number, and it is a stronger result than expected: **the
 * overwhelming majority of contact in this model is two cars rubbing, not hitting.** An
 * onset anywhere near 1 would damage cars for running two abreast, which punishes the only
 * thing racing should reward.
 *
 * The onset is therefore 20 -- the level at which roughly half a car per race collects one
 * genuinely big shunt, which is what a real race looks like. Severity above it does the work:
 * the largest contact the model produces is about 38, and at `EXCESS_TO_DAMAGE = 0.02` that
 * is `18 * 0.02 = 0.36`, a shunt that costs real lap time and has to be driven around but
 * does not end the race on its own.
 *
 * ## The cascade, and what stops it
 *
 * Damage is self-amplifying: a car that has lost downforce understeers, understeering cars
 * collect more contact, and the loop runs away. Measured with an onset of 10, **23 of 23 cars
 * retired from a single Monza race**, which is not a race, it is a demolition derby.
 *
 * The missing piece is negative feedback, and in real F1 it is the driver. A team with a
 * damaged car lifts and stops chasing, which is also how a driver protects what is left of
 * the car. `ai/AIDriver.js` scales its target speed with damage for exactly that reason; without
 * it the model has no way to express "this race is now about surviving".
 *
 * ## Not modelled
 *
 * Debris, marshal damage, and gradual aero loss from a bent floor that never gets hit
 * again. The mechanical failures below cover the non-crash retirement path.
 */

/**
 * Contact severity at which damage starts.
 *
 * Measured, not chosen: see the distribution above. Everything at or below this is
 * wheel-to-wheel racing and stays free. Above it, damage accrues as the *excess*, so a
 * 20.5 tap is barely worth recording and the largest shunt the model can produce, about 38,
 * costs roughly a third of the car.
 */
export const DAMAGE_ONSET = 20;

/**
 * How much total damage one unit of excess severity is worth.
 *
 * Sized so the largest contact the model produces, about 38, is worth `18 * 0.02 = 0.36`:
 * a shunt that costs real lap time and has to be driven around, but does not end the race on
 * its own. Several of them do.
 */
const EXCESS_TO_DAMAGE = 0.02;

/**
 * Ceiling on the damage one single contact can do.
 *
 * The severity metric is not bounded at the 38 the calibration was sized against: the worst
 * shunt seen in a Bahrain race reported 231.6, which at the uncapped rate is `(231.6 - 20) *
 * 0.02 = 4.2` and retires both cars involved instantly, from one incident. Measured, and
 * wrong, in the same race the fix was made.
 *
 * A cap is also simply true to the thing being modelled. Real terminal damage is the
 * accumulation of a ruined race -- a bent nose, a holed floor, a detached wing at some point
 * in the next twenty laps -- not a single event that ends the race on contact. At 0.45, one
 * maximal shunt costs a third of the car and has to be driven around; three end it.
 */
const MAX_PER_IMPACT = 0.45;

/** Damage above which the car cannot continue. */
export const RETIRE_AT = 1.0;

/**
 * Downforce lost at total damage 1.0.
 *
 * A car with a destroyed front wing and a holed floor keeps maybe half its downforce.
 * Real terminal damage is a 0.4-0.6 s/lap loss, and at a 7.4 m^2 downforce coefficient
 * roughly halving it produces a deficit of that order -- measured, not assumed: the
 * skidpad in `apexgp.test.mjs` measures the resulting peak lateral g.
 */
const MAX_AERO_LOSS = 0.5;

/** Engine output lost at total damage 1.0, from a breached sidepod and its cooling. */
const MAX_POWER_LOSS = 0.35;

/**
 * Steering pull at total damage 1.0, radians of offset.
 *
 * Small on purpose. A bent suspension pulls the car, which is what makes damage feel like
 * something you drive around rather than a number on a display -- but a large pull is
 * unrecoverable in a car that has also lost grip, and the AI behind the wheel has no
 * model of it at all. It is a nudge, not a fight.
 */
const MAX_STEER_PULL = 0.012;

/**
 * Mechanical failure hazard per km at zero reliability.
 *
 * Calibrated against this game's actual race distance, which is where the first attempt went
 * wrong. The number was derived for a 5.3 km race -- a plausible figure for a real Grand Prix
 * distance in kilometres -- but these circuits run 35-40 km, roughly seven times further, and
 * a hazard is a rate. The result was 4 mechanical retirements in a single Bahrain race and
 * 6%-25% per car per race, which is not reliability, it is a lottery.
 *
 * The target is about one mechanical retirement per race across a field of 23, so ~4% per car
 * over a ~38 km race, or ~0.001/km at the grid's average reliability of 0.95. That puts this
 * constant at 0.001 / 0.05 = 0.02. `failureRisk` is the honest way to check it: the tests
 * assert a single race stays well under 10% for the worst team on the grid.
 */
const FAILURE_HAZARD_PER_KM = 0.02;

/**
 * A fresh damage state.
 *
 * Attached to the car, not the entry: two cars in the same team do not share a nose.
 */
export function createDamage(random = null) {
  return {
    /**
     * The car's own random source.
     *
     * It must NOT be the session's shared stream. An earlier version took `session.random`
     * and rolled once per car per step -- 23 draws x 120 steps = 2,760 per second -- which
     * silently perturbed every other stochastic decision in the simulation until the whole
     * field stopped progressing. A subsystem that needs randomness needs its own stream,
     * seeded from the race so replays stay reproducible without touching anything else.
     */
    random,
    /** Metres covered since the last mechanical roll. See ROLL_INTERVAL. */
    sinceRoll: 0,
    /** 0 = pristine, 1 = terminal. */
    total: 0,
    /** Downforce multiplier, 1 when undamaged. */
    aero: 1,
    /** Engine torque multiplier, 1 when undamaged. */
    power: 1,
    /** Steering offset in radians, 0 when undamaged. */
    pull: 0,
    /** Whether this car's race is over because of damage. */
    terminal: false,
    /** Whether it is over because something broke. Both are `retired`, differently. */
    mechanical: false,
    /**
     * Every contact considered, damaging or not.
     *
     * Separate from `impacts` because the property that matters is the *ratio*: the whole
     * wheel-to-wheel population has to pass through `applyImpact` and leave the car
     * untouched, or the model is punishing the only thing racing rewards. Having both
     * counters makes that assertable instead of assumed.
     */
    contacts: 0,
    /** Contacts that registered damage. */
    impacts: 0,
    /** Hardest contact this car has taken. Telemetry, and what the calibration is set from. */
    worstSeverity: 0
  };
}

/**
 * Fold one contact into a damage state.
 *
 * Mutates and returns `state`. Idempotent per distinct incident: `collision.js` already
 * collapses a sustained overlap into a single contact, so calling this once per contact
 * onset is enough and calling it every frame would not compound.
 *
 * @param {object} state from `createDamage`
 * @param {number} severity closing speed in m/s, as `collision.js` measures it
 * @param {number} [distanceM] metres covered this step, used only to roll mechanical failure
 * @returns {number} the damage this particular contact added, for telemetry and tests
 */
export function applyImpact(state, severity, distanceM = 0) {
  if (!state || state.terminal) return 0;

  state.contacts += 1;
  if (severity > state.worstSeverity) state.worstSeverity = severity;

  let gained = 0;
  if (severity > DAMAGE_ONSET) {
    gained = Math.min(MAX_PER_IMPACT, (severity - DAMAGE_ONSET) * EXCESS_TO_DAMAGE);
    state.total = Math.min(RETIRE_AT, state.total + gained);
    state.impacts += 1;
    // Recomputed rather than accumulated, so the multipliers and `total` cannot drift apart.
    state.aero = 1 - state.total * MAX_AERO_LOSS;
    state.power = 1 - state.total * MAX_POWER_LOSS;
    state.pull = state.total * MAX_STEER_PULL;
    if (state.total >= RETIRE_AT) state.terminal = true;
  }

  // Mechanical failure is a per-distance hazard, evaluated on the same call so a car that is
  // running has a chance to break. A car sitting in the pit lane covers no distance and so
  // should not be unlucky.
  rollMechanical(state, distanceM);
  return gained;
}

/**
 * Set the mechanical failure hazard for this car.
 *
 * Separate from the impact path because reliability belongs to the *team* and is fixed at
 * entry, while damage accumulates per car. Without this the hazard would have to be read
 * off the car mid-race, which is how it ended up inert in the first place.
 *
 * @param {object} state
 * @param {number} reliability 0..1 from `TEAMS[].reliability`
 */
export function setReliability(state, reliability) {
  if (state) state.hazardPerKm = FAILURE_HAZARD_PER_KM * (1 - clamp01(reliability));
  return state;
}

/**
 * Per-step chance of a mechanical failure, applied in `rollMechanical`.
 *
 * Exposed for the UI, which has to tell the player a car is at risk before it goes.
 */
export function failureRisk(state, distanceKm) {
  const hazard = state?.hazardPerKm ?? 0;
  return 1 - Math.exp(-hazard * Math.max(0, distanceKm));
}

/**
 * Metres between mechanical rolls.
 *
 * Rolling every step is both wasteful and misleading: at 120 Hz the per-step probability is
 * so small it is dominated by float noise, and it costs a random draw per car per step.
 * Once per 100 m the hazard is ~0.16% for a mid-grid car, which is comfortably resolved by
 * a uniform draw, and the cost is one draw per car per 100 m -- about three per car a lap.
 */
const ROLL_INTERVAL = 100;

/**
 * Roll for a mechanical failure over the distance covered since the last roll.
 *
 * @param {object} state
 * @param {number} distanceM metres covered this step
 */
export function rollMechanical(state, distanceM) {
  if (!state || state.terminal) return state;
  const hazard = state.hazardPerKm ?? 0;
  if (hazard <= 0 || !(distanceM > 0)) return state;

  state.sinceRoll += distanceM;
  if (state.sinceRoll < ROLL_INTERVAL) return state;
  state.sinceRoll -= ROLL_INTERVAL;

  // Exponential hazard over the interval, rather than a probability per draw, so the rate
  // is independent of the timestep: 1 - exp(-h * km).
  if (state.random && state.random() < 1 - Math.exp(-hazard * ROLL_INTERVAL / 1000)) {
    state.terminal = true;
    state.mechanical = true;
  }
  return state;
}

/**
 * Whether this car should retire, and why.
 *
 * Split out from `applyImpact` so the session can ask the question without also being able
 * to answer it, and so the HUD and the standings can read the same reason.
 */
export function retirementReason(state) {
  if (!state?.terminal) return null;
  return state.mechanical ? 'MECHANICAL' : 'DAMAGE';
}

/** Damage as a 0..1 fraction for display, saturating at terminal. */
export function damageFraction(state) {
  return state ? clamp01(state.total / RETIRE_AT) : 0;
}

function clamp01(value) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}