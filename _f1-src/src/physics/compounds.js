/**
 * Tyre compounds and weather.
 *
 * Two small sets of numbers that a race is chosen around, and both feed the same
 * place in the physics: the surface friction multiplier and the tyre's own grip.
 *
 * ## Compounds
 *
 * Five compounds, from soft to hard, each trading peak grip against how long it
 * lasts. The trade is real in both directions: a soft tyre is quicker and shorter,
 * a hard tyre slower and longer, and a long race on softs is a slow race. Running
 * the wrong compound is a mistake you make once and then drive around.
 *
 * `wearRate` is a fraction of peak grip lost per lap, so it is directly comparable
 * between compounds rather than being a multiplier on an opaque temperature
 * model.
 *
 * ## Weather
 *
 * Four states. `grip` is the wet fraction applied to the whole car; `visibility`
 * and `spray` are for the renderer and do not touch the physics, so a light shower
 * that looks alarming and grips like a dry track would be a lie in both directions.
 *
 * Rain is the interesting one. It is not a constant penalty: grip falls off
 * hardest at the transition, and standing water on a circuit that drains badly is
 * worse than the same water on one that does. `drainage` is per-circuit.
 */

/** F1 tyre compounds, softest to hardest. */
export const COMPOUNDS = [
  {
    id: 'soft',
    name: 'Soft',
    /** C1-style: softest, most grip, shortest life. */
    colour: 0xe23b3b,
    /** Peak friction as a multiple of the model's baseline. */
    grip: 1.075,
    /** How fast grip is lost, as a fraction of peak per lap. */
    wearRate: 0.085,
    /** Operating window. A narrow band is faster but fussy to keep in. */
    band: 34,
    /** Warm-up: how quickly it reaches its window. Faster compounds warm quicker. */
    warmup: 1.45,
    blurb: 'Peak grip for a few laps, then it is gone.'
  },
  {
    id: 'medium',
    name: 'Medium',
    colour: 0xf0c419,
    grip: 1.04,
    wearRate: 0.05,
    band: 40,
    warmup: 1.2,
    blurb: 'The default. Works for anything, wins nothing spectacular.'
  },
  {
    id: 'hard',
    name: 'Hard',
    colour: 0xf2f2f2,
    grip: 1.0,
    wearRate: 0.028,
    band: 48,
    warmup: 0.95,
    blurb: 'Slow all race, which is exactly the point.'
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    colour: 0x43b02a,
    grip: 0.985,
    wearRate: 0.03,
    band: 46,
    warmup: 1.0,
    blurb: 'For a damp track that is not quite wet.'
  },
  {
    id: 'wet',
    name: 'Full Wet',
    colour: 0x1f7ae0,
    grip: 0.96,
    wearRate: 0.026,
    band: 50,
    warmup: 0.8,
    blurb: 'Only sensible in standing water.'
  }
];

const COMPOUND_BY_ID = new Map(COMPOUNDS.map((compound) => [compound.id, compound]));

/**
 * Look up a compound, falling back to medium.
 * @param {string} id
 */
export function getCompound(id) {
  return COMPOUND_BY_ID.get(id) ?? COMPOUND_BY_ID.get('medium');
}

/**
 * Weather states.
 *
 * `grip` multiplies the friction available to the car. Rain is not a flat penalty:
 * a road that drains keeps more grip, and visibility falls because spray hangs in
 * the air.
 */
export const WEATHER = [
  {
    id: 'clear',
    name: 'Clear',
    grip: 1.0,
    visibility: 1.0,
    /** How much spray and standing water the renderer draws. */
    spray: 0,
    sky: 0x8fc7f0,
    fog: 0xa9d3f2,
    /** Overhead light. */
    daylight: 1.0,
    blurb: 'Full grip, full visibility.'
  },
  {
    id: 'cloudy',
    name: 'Cloudy',
    grip: 0.985,
    visibility: 0.96,
    spray: 0,
    sky: 0x9aa8b4,
    fog: 0xb4c0c8,
    daylight: 0.88,
    blurb: 'Slightly darker, slightly cooler tyres.'
  },
  {
    id: 'light-rain',
    name: 'Light Rain',
    grip: 0.9,
    visibility: 0.82,
    spray: 0.35,
    sky: 0x7c8894,
    fog: 0x94a2ac,
    daylight: 0.78,
    blurb: 'Intermediates. Standings water on the exits.'
  },
  {
    id: 'heavy-rain',
    name: 'Heavy Rain',
    grip: 0.74,
    visibility: 0.6,
    spray: 1.0,
    sky: 0x5c6874,
    fog: 0x74828e,
    daylight: 0.62,
    blurb: 'Full wets, low visibility, and the race is often over.'
  }
];

const WEATHER_BY_ID = new Map(WEATHER.map((state) => [state.id, state]));

/**
 * Look up a weather state, falling back to clear.
 * @param {string} id
 */
export function getWeather(id) {
  return WEATHER_BY_ID.get(id) ?? WEATHER_BY_ID.get('clear');
}

/**
 * The combined grip a car has on a surface, given its compound and the weather.
 *
 * Multiplied rather than added: a bad compound in the wet is worse than either
 * problem alone, which is what actually happens and what makes the choice
 * interesting.
 *
 * Compounds already in the right band for the conditions are penalised less, which
 * is how running softs in the rain becomes a mistake rather than just a slow one.
 *
 * @param {string} compoundId
 * @param {string} weatherId
 * @param {number} [circuitDrainage] 0 = poor drainage, 1 = drains immediately.
 */
export function surfaceGripFor(compoundId, weatherId, circuitDrainage = 1) {
  const compound = getCompound(compoundId);
  const weather = getWeather(weatherId);

  // Drainage: a circuit that sheds water keeps more grip than the raw weather
  // figure suggests. Only applies once it is actually raining.
  const drainageFactor = 1 - (1 - weather.grip) * (1.15 - 0.15 * clamp01(circuitDrainage));

  return compound.grip * drainageFactor;
}

/** Does this compound suit this weather? Used to warn in the setup screen. */
export function suitabilityFor(compoundId, weatherId) {
  const wet = weatherId === 'light-rain' || weatherId === 'heavy-rain';
  if (!wet) {
    if (compoundId === 'wet' || compoundId === 'intermediate') return { ok: false, note: 'Grooves are for standing water' };
    return { ok: true, note: null };
  }
  if (compoundId === 'wet') return { ok: true, note: null };
  if (compoundId === 'intermediate') {
    return weatherId === 'light-rain'
      ? { ok: true, note: null }
      : { ok: false, note: 'Too little water for grooved tyres' };
  }
  if (weatherId === 'light-rain') return { ok: false, note: 'Slicks on a damp track' };
  return { ok: false, note: 'Slicks in heavy rain' };
}

function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/**
 * How long a compound lasts, in laps, at the current rate.
 *
 * Shown in the setup screen so the choice is informed rather than a guess. Grip
 * falls off gradually and is treated as spent once it has lost most of a fifth of
 * its peak.
 */
export function expectedLifeLaps(compoundId, weatherId = 'clear') {
  const compound = getCompound(compoundId);
  // Wet compounds are designed for a lower peak, so they are not penalised for
  // it here; only the weather's effect on the rate is applied.
  const weatherPenalty = 1 + (1 - getWeather(weatherId).grip) * 0.5;
  return Math.max(1, Math.round(0.2 / (compound.wearRate * weatherPenalty)));
}