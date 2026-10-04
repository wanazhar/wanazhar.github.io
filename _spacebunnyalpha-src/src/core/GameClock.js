import { CLOCK } from '../config.js';
import { clamp01, smoothstep } from '../util/math.js';

export const PHASES = {
  dawn: 'dawn',
  day: 'day',
  dusk: 'dusk',
  night: 'night'
};

export function formatClock(totalMinutes) {
  const wrapped = ((totalMinutes % CLOCK.minutesPerDay) + CLOCK.minutesPerDay) % CLOCK.minutesPerDay;
  const hours = Math.floor(wrapped / 60);
  const minutes = Math.floor(wrapped % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Named hours a lot of gameplay hangs off: shops opening, fishing being good,
// lights coming on. Kept as data so it is easy to retune.
export function phaseFor(minutes) {
  const hour = (minutes / 60) % 24;
  if (hour < CLOCK.dawnHour || hour >= CLOCK.duskHour) return PHASES.night;
  if (hour < CLOCK.dawnHour + 1.5) return PHASES.dawn;
  if (hour > CLOCK.duskHour - 1.5) return PHASES.dusk;
  return PHASES.day;
}

// 0 at deep night, 1 at midday. Drives the sun's intensity and the sky blend.
export function daylightAmount(minutes) {
  const hour = (minutes / 60) % 24;
  const rise = smoothstep(CLOCK.dawnHour, CLOCK.dawnHour + 2, hour);
  const set = 1 - smoothstep(CLOCK.duskHour - 2, CLOCK.duskHour, hour);
  return clamp01(Math.min(rise, set));
}

export class GameClock {
  constructor({ startMinutes = CLOCK.startHour * 60, minutesPerSecond = CLOCK.minutesPerSecond, bus = null } = {}) {
    this.minutes = startMinutes;
    this.minutesPerSecond = minutesPerSecond;
    this.day = 1;
    this.paused = false;
    this.bus = bus;
    this.lastHour = Math.floor(startMinutes / 60);
  }

  // Advances the clock and emits hour / day-change events. Real delta is
  // clamped so a backgrounded tab does not skip a whole night on return.
  update(deltaSeconds) {
    if (this.paused) return;
    const clamped = Math.min(deltaSeconds, 0.1);
    const previous = this.minutes;
    this.minutes += clamped * this.minutesPerSecond;

    while (this.minutes >= CLOCK.minutesPerDay) {
      this.minutes -= CLOCK.minutesPerDay;
      this.day += 1;
      this.bus?.emit('clock:newDay', { day: this.day });
    }

    const hour = Math.floor(this.minutes / 60);
    if (hour !== this.lastHour) {
      this.lastHour = hour;
      this.bus?.emit('clock:hour', {
        hour,
        day: this.day,
        phase: phaseFor(this.minutes),
        daylight: daylightAmount(this.minutes)
      });
    }
    // Expose the raw delta-minutes so systems can react to time passing
    // smoothly, not just on the hour boundary.
    this.bus?.emit('clock:tick', { deltaMinutes: this.minutes - previous, minutes: this.minutes });
  }

  get hour() {
    return this.minutes / 60;
  }

  get phase() {
    return phaseFor(this.minutes);
  }

  get daylight() {
    return daylightAmount(this.minutes);
  }

  get label() {
    return formatClock(this.minutes);
  }

  // Sun elevation in [-1, 1]: up at noon, down at midnight.
  get sunElevation() {
    const t = (this.minutes / CLOCK.minutesPerDay) * Math.PI * 2;
    return Math.sin(t - Math.PI / 2) * 0.5 + 0.5;
  }

  setMinutes(minutes) {
    this.minutes = ((minutes % CLOCK.minutesPerDay) + CLOCK.minutesPerDay) % CLOCK.minutesPerDay;
    this.lastHour = Math.floor(this.minutes / 60);
  }

  toJSON() {
    return { minutes: this.minutes, day: this.day };
  }
}