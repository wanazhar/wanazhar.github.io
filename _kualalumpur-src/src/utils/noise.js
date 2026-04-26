export function mulberry32(seed) {
  let state = seed >>> 0;
  return function random() {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash2(x, z, seed = 1337) {
  let h = seed ^ Math.imul(x, 374761393) ^ Math.imul(z, 668265263);
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function valueNoise2D(x, z, seed = 1337) {
  const x0 = Math.floor(x);
  const z0 = Math.floor(z);
  const xf = x - x0;
  const zf = z - z0;
  const a = hash2(x0, z0, seed);
  const b = hash2(x0 + 1, z0, seed);
  const c = hash2(x0, z0 + 1, seed);
  const d = hash2(x0 + 1, z0 + 1, seed);
  const u = smoothstep(xf);
  const v = smoothstep(zf);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}

export function fbm(x, z, seed = 1337, octaves = 4) {
  let amplitude = 0.5;
  let frequency = 1;
  let value = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    value += amplitude * valueNoise2D(x * frequency, z * frequency, seed + i * 97);
    norm += amplitude;
    frequency *= 2;
    amplitude *= 0.5;
  }
  return value / norm;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function remap(value, inMin, inMax, outMin, outMax) {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + (outMax - outMin) * t;
}
