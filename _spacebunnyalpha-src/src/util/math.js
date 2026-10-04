export const TAU = Math.PI * 2;

export function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}

export function clamp01(value) {
  return clamp(value, 0, 1);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function inverseLerp(a, b, value) {
  return a === b ? 0 : clamp01((value - a) / (b - a));
}

export function smoothstep(edge0, edge1, value) {
  const t = inverseLerp(edge0, edge1, value);
  return t * t * (3 - 2 * t);
}

export function smootherstep(edge0, edge1, value) {
  const t = inverseLerp(edge0, edge1, value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Maps a value from one range to another without clamping.
export function remap(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export function dist2(ax, az, bx, bz) {
  const dx = ax - bx;
  const dz = az - bz;
  return dx * dx + dz * dz;
}

export function dist(ax, az, bx, bz) {
  return Math.sqrt(dist2(ax, az, bx, bz));
}

// Shortest signed angular difference, used so turn helpers never spin the long way.
export function angleDelta(from, to) {
  let d = (to - from) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}

export function damp(current, target, smoothing, deltaSeconds) {
  return lerp(current, target, 1 - Math.pow(smoothing, deltaSeconds));
}

export function moveTowards(current, target, maxDelta) {
  const d = target - current;
  if (Math.abs(d) <= maxDelta) return target;
  return current + Math.sign(d) * maxDelta;
}