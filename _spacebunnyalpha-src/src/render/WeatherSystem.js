import { WEATHER } from '../config.js';
import { mulberry32 } from '../util/rng.js';

export const WEATHER_TYPES = {
  clear: 'clear',
  cloudy: 'cloudy',
  overcast: 'overcast',
  rain: 'rain',
  storm: 'storm'
};

const LABELS = {
  clear: { en: 'Clear', ja: '晴れ' },
  cloudy: { en: 'Cloudy', ja: '曇り' },
  overcast: { en: 'Overcast', ja: '曇天' },
  rain: { en: 'Rain', ja: '雨' },
  storm: { en: 'Storm', ja: '嵐' }
};

export function weatherLabel(type) {
  return LABELS[type] ?? LABELS.clear;
}

// Picks the next weather from the current one, weighted towards fair weather
// because this is a chill game and constant rain would be miserable.
export function rollWeather(current, rng = Math.random) {
  const roll = rng();

  if (current === 'storm') {
    // A storm always eases off.
    return roll < 0.6 ? 'rain' : 'overcast';
  }
  if (current === 'rain') {
    if (roll < 0.45) return 'clear';
    if (roll < 0.75) return 'cloudy';
    return 'rain';
  }
  if (roll < 0.42) return 'clear';
  if (roll < 0.68) return 'cloudy';
  if (roll < 0.86) return 'overcast';
  if (roll < 0.97) return 'rain';
  return 'storm';
}

export function weatherDuration(rng = Math.random) {
  const [min, max] = WEATHER.durationMin;
  return min + rng() * (max - min);
}

export class WeatherSystem {
  constructor({ bus = null, seed = 1, startType = 'clear' } = {}) {
    this.bus = bus;
    this.rng = mulberry32(seed);
    this.current = startType;
    this.intensity = startType === 'rain' || startType === 'storm' ? 1 : 0;
    this.minutesUntilChange = weatherDuration(this.rng);
    this.wetness = startType === 'rain' ? 1 : 0;
  }

  // Advances weather on the in-game clock, so time passing actually changes
  // the sky rather than just tinting it.
  update(deltaMinutes) {
    this.minutesUntilChange -= deltaMinutes;
    if (this.wetness > 0) this.wetness = Math.max(0, this.wetness - deltaMinutes / 240);

    if (this.minutesUntilChange > 0) return null;

    const previous = this.current;
    this.current = rollWeather(previous, this.rng);
    this.minutesUntilChange = weatherDuration(this.rng);
    this.bus?.emit('weather:changed', { previous, current: this.current });

    if (previous !== this.current) return { previous, current: this.current };
    return null;
  }

  // 0 at clear, 1 in a downpour. Drives rain particles, sound and puddles.
  get rainIntensity() {
    if (this.current === 'storm') return 1;
    if (this.current === 'rain') return 0.72;
    return 0;
  }

  get isWet() {
    return this.wetness > 0.05;
  }

  get cloudiness() {
    if (this.current === 'clear') return 0.05;
    if (this.current === 'cloudy') return 0.45;
    if (this.current === 'overcast') return 0.8;
    return 1;
  }

  label() {
    return weatherLabel(this.current);
  }

  toJSON() {
    return { current: this.current, minutesUntilChange: this.minutesUntilChange, wetness: this.wetness };
  }

  fromJSON(data) {
    if (!data) return;
    this.current = data.current ?? this.current;
    this.minutesUntilChange = data.minutesUntilChange ?? this.minutesUntilChange;
    this.wetness = data.wetness ?? this.wetness;
  }
}

// Which ambience layer plays in a region: petals in the city, insects at
// dusk in the fields, sea spray on the coast.
export function ambienceFor(regionId, weather, clock) {
  const night = clock.daylight < 0.25;
  if (weather === 'rain' || weather === 'storm') return { particles: 'rain', insects: false, birds: false };

  const particles = {
    city: clock.daylight > 0.4 ? 'petals' : 'none',
    suburbs: clock.daylight > 0.4 ? 'petals' : 'fireflies',
    rural: night ? 'fireflies' : 'pollen',
    coast: 'seabirds'
  }[regionId] ?? 'none';

  return {
    particles,
    insects: !night && (regionId === 'rural' || regionId === 'coast'),
    birds: clock.daylight > 0.5
  };
}