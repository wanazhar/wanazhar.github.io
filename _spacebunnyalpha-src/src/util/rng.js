// Deterministic pseudo-randomness. Everything in spacebunnyalpha is generated
// from code, so a stable seed means the island is identical on every machine
// and across every reload.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Hash three integers into [0,1). Used for per-cell decisions where pulling
// from a sequential generator would make results depend on iteration order.
export function hash3(x, y, z, seed = 0) {
  let h = seed >>> 0;
  h = Math.imul(h ^ (x | 0), 0x27d4eb2d);
  h = Math.imul(h ^ (y | 0), 0x165667b1);
  h = Math.imul(h ^ (z | 0), 0x9e3779b1);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

export function hash2(x, y, seed = 0) {
  return hash3(x, y, 0, seed);
}

// Integer hash -> integer hash. Handy for chainable variation seeds.
export function hashInt(x, y, z, seed = 0) {
  let h = seed >>> 0;
  h = Math.imul(h ^ (x | 0), 0x27d4eb2d);
  h = Math.imul(h ^ (y | 0), 0x165667b1);
  h = Math.imul(h ^ (z | 0), 0x9e3779b1);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  return h >>> 0;
}

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// Smooth value noise in 2D, output roughly in [-1, 1].
export function valueNoise2(x, y, seed = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const n00 = hash2(xi, yi, seed);
  const n10 = hash2(xi + 1, yi, seed);
  const n01 = hash2(xi, yi + 1, seed);
  const n11 = hash2(xi + 1, yi + 1, seed);

  const sx = fade(xf);
  const sy = fade(yf);

  const top = n00 + (n10 - n00) * sx;
  const bottom = n01 + (n11 - n01) * sx;
  return (top + (bottom - top) * sy) * 2 - 1;
}

// Fractal brownian motion: layered value noise, the workhorse for terrain.
export function fbm2(x, y, { octaves = 4, frequency = 1, lacunarity = 2, gain = 0.5, seed = 0 } = {}) {
  let amplitude = 1;
  let total = 0;
  let norm = 0;
  let f = frequency;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise2(x * f, y * f, seed + i * 1013) * amplitude;
    norm += amplitude;
    amplitude *= gain;
    f *= lacunarity;
  }

  return norm > 0 ? total / norm : 0;
}

// Ridged multifractal. Produces sharp crests rather than rolling hills,
// which is what makes the inland mountains read as mountains.
export function ridged2(x, y, { octaves = 4, frequency = 1, lacunarity = 2, gain = 0.5, seed = 0 } = {}) {
  let amplitude = 1;
  let total = 0;
  let norm = 0;
  let f = frequency;

  for (let i = 0; i < octaves; i += 1) {
    const n = 1 - Math.abs(valueNoise2(x * f, y * f, seed + i * 7919));
    total += n * n * amplitude;
    norm += amplitude;
    amplitude *= gain;
    f *= lacunarity;
  }

  return norm > 0 ? total / norm : 0;
}