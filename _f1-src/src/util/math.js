/**
 * Small shared math helpers. Kept dependency-free so the test suite can import
 * them directly under plain node.
 */

export const clamp = (value, min, max) => (value < min ? min : value > max ? max : value);

export const lerp = (a, b, t) => a + (b - a) * t;

export const sign = (value) => (value > 0 ? 1 : value < 0 ? -1 : 0);

/** Frame-rate independent exponential smoothing. `rate` is roughly "per second". */
export const damp = (current, target, rate, dt) =>
  target + (current - target) * Math.exp(-rate * dt);

/** Move `current` toward `target` by at most `maxDelta`. */
export const moveToward = (current, target, maxDelta) => {
  const delta = target - current;
  if (Math.abs(delta) <= maxDelta) return target;
  return current + Math.sign(delta) * maxDelta;
};

/** Wrap an angle into (-PI, PI]. */
export const wrapAngle = (angle) => {
  let a = (angle + Math.PI) % (Math.PI * 2);
  if (a < 0) a += Math.PI * 2;
  return a - Math.PI;
};

/** Shortest-arc damping for angles. */
export const dampAngle = (current, target, rate, dt) =>
  current + wrapAngle(target - current) * (1 - Math.exp(-rate * dt));

/** Format seconds as m:ss.mmm — the standard lap-time presentation. */
export function formatLapTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '--:--.---';
  const minutes = Math.floor(seconds / 60);
  const rest = seconds - minutes * 60;
  return `${minutes}:${rest.toFixed(3).padStart(6, '0')}`;
}

/** Format a gap as +s.mmm (the timing-screen style used by the race HUD). */
export function formatGap(seconds) {
  if (!Number.isFinite(seconds)) return '--.---';
  if (seconds <= 0.0005) return '0.000';
  return `+${seconds.toFixed(3)}`;
}

/** Ordinal suffix used for position readouts: 1 -> 1st, 2 -> 2nd ... */
export function formatPosition(position) {
  const n = Math.max(1, Math.round(position));
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

/**
 * Simplified Pacejka ("magic formula") lateral tyre curve, normalised to a peak
 * of 1.0. `B` sets the stiffness, `C` the shape and `D` is folded in by callers so
 * the same curve can be scaled by load and surface grip.
 */
export function magicFormula(slip, stiffness, shape) {
  return Math.sin(shape * Math.atan(stiffness * slip));
}

/** Deterministic PRNG (mulberry32) so circuits and grids are reproducible. */
export function createRandom(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A tiny fixed-capacity ring buffer used for the rolling telemetry trace. */
export class RingBuffer {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = [];
  }

  push(item) {
    this.items.push(item);
    if (this.items.length > this.capacity) this.items.shift();
  }

  toArray() {
    return this.items;
  }

  clear() {
    this.items.length = 0;
  }
}