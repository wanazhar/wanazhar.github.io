/**
 * Weather that changes during a race.
 *
 * Until now a race's weather was fixed for the whole session: `weatherState` was read once in
 * the constructor and never touched, and the flags and safety-car hooks beside it were
 * initialised and never used. So the forecast could not arrive, the track could not go off, and
 * a wet race was wet from the lights.
 *
 * Shape of a change
 * -----------------
 * Deterministic and keyed to the circuit, not random per race. Real weather is not re-rolled
 * each time a race is run, and more importantly a reproducible answer can be tested and a random
 * one cannot. A circuit either tends to bring rain or it does not, and when it does, the rain
 * arrives at a predictable point in the lap.
 *
 * The sequence is dry first. That is the whole drama of a wet race in F1: the track is dry when
 * the lights go out, and somewhere in the second half the cloud breaks and the whole field has to
 * change tyres while trying to hold the line. Starting wet instead is just a wet race.
 *
 * Transitions move one step at a time through the presets -- clear, cloudy, light rain, heavy --
 * because the sky does not jump from sun to monsoon, and because the intermediate step is where
 * the grip cliff is nastiest: `light-rain` takes 10% off the surface and `heavy-rain` takes 26%.
 */

/** The presets, in the order a deterioration walks through them. */
const SEQUENCE = ['clear', 'cloudy', 'light-rain', 'heavy-rain'];

/**
 * Which circuits bring rain, keyed by circuit id.
 *
 * Roughly a third of a real season, chosen from the circuits that actually have a wet
 * reputation rather than spread evenly, so a calendar run has weather worth reacting to instead of
 * a uniform sprinkle.
 */
const CHANGEABLE = new Set([
  'suzuka', 'interlagos', 'singapore', 'montreal', 'spa', 'silverstone',
  'barcelona', 'hungaroring', 'zandvoort'
]);

/**
 * A small deterministic hash of the circuit id.
 *
 * Used only to place the transition, so two runs of the same round always get the same weather.
 * Not a source of randomness and nothing depends on its quality.
 */
function hash(text) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0) / 4294967295;
}

/**
 * The weather plan for a circuit: a list of transitions as fractions of the race distance.
 *
 * @param {string} circuitId
 * @param {number} startWeather the weather the session begins in
 * @returns {{from: string, to: string, at: number}[]} in order, empty for a dry circuit
 */
export function weatherPlan(circuitId, startWeather = 'clear') {
  if (!CHANGEABLE.has(circuitId)) return [];

  const start = Math.max(0, SEQUENCE.indexOf(startWeather));
  const seed = hash(circuitId);

  /*
   * How far the race deteriorates.
   *
   * Weighted towards light rain, because that is what a real changeable race usually produces:
   * overcast, then a shower, and only occasionally a proper downpour. `cloudy` on its own is
   * barely a change -- it costs about 1.5% of grip -- so a plan that stops there is not worth
   * having, and the scenarios that stop there were leaving these races effectively dry.
   */
  const severity = seed < 0.3 ? 2 : seed < 0.82 ? 2 : 3;
  const steps = Math.min(severity, SEQUENCE.length - 1 - start);
  if (steps <= 0) return [];

  const plan = [];
  // The first change lands in the second half; later for the heavier scenarios.
  let at = 0.4 + seed * 0.22;
  // Spread what is left evenly, and never schedule a change past the flag: a transition at 1.07
  // is a transition that cannot happen, which is how Spa came to plan one.
  const gap = (0.94 - at) / steps;
  for (let step = 1; step <= steps; step += 1) {
    plan.push({ from: SEQUENCE[start + step - 1], to: SEQUENCE[start + step], at: at + gap * (step - 1) });
  }
  return plan;
}

/**
 * The weather at a point in the race, as a fraction of the total distance.
 *
 * @param {{from: string, to: string, at: number}[]} plan
 * @param {string} startWeather
 * @param {number} progress 0..1 through the whole race distance
 */
export function weatherAt(plan, startWeather, progress) {
  let current = startWeather;
  for (const step of plan) {
    if (progress >= step.at) current = step.to;
    else break;
  }
  return current;
}

/** How far through the plan the race is, for the HUD: 0 before the first change, 1 after the last. */
export function weatherProgress(plan, progress) {
  if (!plan.length) return 1;
  const first = plan[0].at;
  const last = plan[plan.length - 1].at;
  if (progress <= first) return 0;
  return Math.min(1, (progress - first) / Math.max(0.001, last - first));
}

/**
 * Whether this circuit can change at all. Used by the setup screen so a player picking weather
 * is not offered a dry race at a circuit that is about to produce rain.
 */
export function canChange(circuitId) {
  return CHANGEABLE.has(circuitId);
}