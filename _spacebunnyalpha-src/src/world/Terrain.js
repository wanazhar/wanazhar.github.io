import { SEED, WORLD, REGIONS, REGION_ORDER } from '../config.js';
import { fbm2, ridged2, hash2 } from '../util/rng.js';
import { clamp, clamp01, lerp, smoothstep } from '../util/math.js';

// ---------------------------------------------------------------------------
// Landmarks used by both the terrain and the region builders. Keeping the
// anchors in one place is what stops the mountains from drifting away from the
// shrine that is supposed to sit on them.
// ---------------------------------------------------------------------------

const ISLAND = {
  cx: 160,
  cz: 140,
  rx: 148,
  rz: 145,
  // Superellipse exponent. 2 is a circle, higher values square the island off
  // so all four regions get usable land.
  roundness: 3
};

export const PLATEAU_CITY = 9;
export const PLATEAU_SUBURB = 8;

// The mountain the shrine road climbs.
export const MOUNTAIN = { x: 236, z: 96, peak: 30, radius: 62 };

// River centreline, as a function of z. Runs from the highlands down to the
// sea and cuts the island in half so the four regions read as connected.
export function riverCenterX(z) {
  return 212 + 26 * Math.sin(z * 0.021) + 9 * Math.sin(z * 0.053);
}

export const RIVER = {
  halfWidth: 2.5,
  bankWidth: 4.5,
  zStart: 74,
  zEnd: 300
};

// Bridges are placed where the two main roads meet the river.
export const BRIDGE_Z = [152, 250];

function superellipseT(x, z) {
  const dx = Math.abs((x - ISLAND.cx) / ISLAND.rx);
  const dz = Math.abs((z - ISLAND.cz) / ISLAND.rz);
  const p = ISLAND.roundness;
  return Math.pow(Math.pow(dx, p) + Math.pow(dz, p), 1 / p);
}

function rectMask(x, z, rect, feather) {
  const inner = (r, v) => smoothstep(r - feather, r, v);
  const insetX0 = inner(rect.x0, x);
  const insetX1 = 1 - inner(rect.x1, x);
  const insetZ0 = inner(rect.z0, z);
  const insetZ1 = 1 - inner(rect.z1, z);
  return clamp01(insetX0 * insetX1 * insetZ0 * insetZ1);
}

// Distance from the river centreline, or Infinity outside its z range.
export function riverDistance(x, z) {
  if (z < RIVER.zStart || z > RIVER.zEnd) return Infinity;
  return Math.abs(x - riverCenterX(z));
}

export function onBridge(x, z) {
  for (const bz of BRIDGE_Z) {
    if (Math.abs(z - bz) <= 3.5 && riverDistance(x, z) <= RIVER.bankWidth + 3) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Terrain height
// ---------------------------------------------------------------------------

function inlandHeight(x, z) {
  const rolling = fbm2(x / 58, z / 58, { octaves: 4, seed: SEED + 11 });
  const ridges = ridged2(x / 46, z / 46, { octaves: 4, seed: SEED + 29 });

  let h = WORLD.seaLevel + 2.4 + rolling * 3.6;

  // Mountains only grow in the eastern highlands, so the city side stays gentle.
  const eastMask = smoothstep(150, 232, x);
  const ridgeMask = smoothstep(0.18, 0.78, ridges);
  h += eastMask * ridgeMask * 21;

  // A single dominant peak for the shrine to sit on.
  const md = Math.hypot(x - MOUNTAIN.x, z - MOUNTAIN.z);
  h += MOUNTAIN.peak * smoothstep(MOUNTAIN.radius, 0, md);

  return h;
}

function cityPlateau(x, z) {
  // Flatten to a plateau, but only where we are inland, so the coastal edge of
  // the ward still meets the sea naturally.
  const mask = rectMask(x, z, REGIONS.city.rect, 16);
  const jitter = fbm2(x / 30, z / 30, { octaves: 2, seed: SEED + 71 }) * 0.5;
  return lerp(inlandHeight(x, z), PLATEAU_CITY + jitter, mask * 0.94);
}

function suburbTerrain(x, z) {
  const mask = rectMask(x, z, REGIONS.suburbs.rect, 18);
  const gentle = fbm2(x / 44, z / 44, { octaves: 3, seed: SEED + 41 });
  const target = PLATEAU_SUBURB + gentle * 1.8;
  return lerp(cityPlateau(x, z), target, mask * 0.9);
}

function coastTerrain(x, z) {
  const mask = rectMask(x, z, REGIONS.coast.rect, 20);
  // Low, flat dunes and a gentle shelf so the shoreline reads as walkable.
  const dunes = fbm2(x / 40, z / 40, { octaves: 3, seed: SEED + 97 });
  const target = WORLD.seaLevel + 1.1 + dunes * 1.5;
  return lerp(suburbTerrain(x, z), target, mask * 0.86);
}

// Continuous float height before quantisation and carving.
function baseHeight(x, z) {
  let h = coastTerrain(x, z);

  // Island falloff: rounded-rectangle mask, eroded with noise so the coastline
  // is irregular instead of a stamped oval. Inside the inner edge is full land,
  // past the outer edge is open ocean.
  const erosion = fbm2(x / 34, z / 34, { octaves: 3, seed: SEED + 5 }) * 0.16;
  const t = superellipseT(x, z) + erosion;
  const land = 1 - smoothstep(0.74, 1.0, t);

  const oceanFloor = 1.2;
  return lerp(oceanFloor, h, land);
}

const OCEAN_DEPTH = 4;

function carveRiver(h, x, z) {
  const d = riverDistance(x, z);
  if (d > RIVER.bankWidth) return h;

  // Flat channel floor, then a bank that eases back up to the surrounding land.
  const channel = WORLD.seaLevel - 1.4;
  const t = smoothstep(RIVER.halfWidth, RIVER.bankWidth, d);
  return lerp(channel, h, t);
}

// Public: terrain surface height as a whole number of blocks.
export function heightAt(x, z) {
  return sample(x, z).h;
}

// Public: natural ground cover at a column.
export function biomeAt(x, z) {
  return sample(x, z).biome;
}

export function isWater(x, z) {
  return heightAt(x, z) < WORLD.seaLevel;
}

// Steepness in blocks per block, used to tell beaches from cliffs.
export function slopeAt(x, z) {
  const h = heightAt(x, z);
  const dx = heightAt(x + 1, z) - heightAt(x - 1, z);
  const dz = heightAt(x, z + 1) - heightAt(x, z - 1);
  return Math.max(Math.abs(dx), Math.abs(dz)) * 0.5;
}

const cache = new Map();
const cacheKey = (x, z) => (z + 4096) * 16384 + (x + 4096);

function sample(x, z) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const key = cacheKey(ix, iz);
  const hit = cache.get(key);
  if (hit) return hit;

  const raw = carveRiver(baseHeight(ix, iz), ix, iz);
  const h = clamp(Math.round(raw), -OCEAN_DEPTH, WORLD.maxHeight);

  const slope = rawSlope(ix, iz);
  const biome = classify(ix, iz, h, slope);

  const entry = { h, biome, slope };
  cache.set(key, entry);
  return entry;
}

// Slope from the pre-rounded field, so quantisation does not hide cliffs.
function rawSlope(x, z) {
  const dx = baseHeight(x + 1, z) - baseHeight(x - 1, z);
  const dz = baseHeight(x, z + 1) - baseHeight(x, z - 1);
  return Math.max(Math.abs(dx), Math.abs(dz)) * 0.5;
}

export const BIOMES = {
  ocean: 'ocean',
  shallow: 'shallow',
  river: 'river',
  sand: 'sand',
  grass: 'grass',
  meadow: 'meadow',
  forest: 'forest',
  paddy: 'paddy',
  orchard: 'orchard',
  dirt: 'dirt',
  rock: 'rock'
};

function classify(x, z, h, slope) {
  if (h < WORLD.seaLevel - 2) return BIOMES.ocean;

  const riverD = riverDistance(x, z);
  if (riverD <= RIVER.halfWidth + 0.5 && h < WORLD.seaLevel) return BIOMES.river;
  if (h < WORLD.seaLevel) return BIOMES.shallow;

  const near = (r) => smoothstep(r, r * 0.35, Math.hypot(x - MOUNTAIN.x, z - MOUNTAIN.z));

  // Steep ground is exposed rock at altitude and gravelly dirt lower down.
  if (slope > 1.35) return h > 16 ? BIOMES.rock : BIOMES.dirt;

  if (h <= WORLD.seaLevel + 1) return BIOMES.sand;

  if (h > 19 || near(26) > 0.55) return BIOMES.rock;

  const forestNoise = fbm2(x / 26, z / 26, { octaves: 3, seed: SEED + 131 });
  if (forestNoise > 0.24) return BIOMES.forest;

  // Terraced paddies on the flat western part of the highlands.
  const ruralMask = rectMask(x, z, REGIONS.rural.rect, 22);
  const paddyNoise = fbm2(x / 22, z / 22, { octaves: 2, seed: SEED + 181 });
  if (ruralMask > 0.45 && slope < 0.5 && paddyNoise > -0.1) return BIOMES.paddy;

  const orchardMask = rectMask(x, z, { x0: 186, z0: 150, x1: 226, z1: 190 }, 10);
  if (orchardMask > 0.5 && slope < 0.6) return BIOMES.orchard;

  return forestNoise < -0.3 ? BIOMES.dirt : BIOMES.grass;
}

// ---------------------------------------------------------------------------
// Region lookup. Returns the nearest region even when out at sea, so the HUD
// always has a sensible name to show.
// ---------------------------------------------------------------------------

const regionEntries = REGION_ORDER.map((id) => ({
  id,
  rect: REGIONS[id].rect,
  cx: (REGIONS[id].rect.x0 + REGIONS[id].rect.x1) / 2,
  cz: (REGIONS[id].rect.z0 + REGIONS[id].rect.z1) / 2
}));

export function regionAt(x, z) {
  let best = regionEntries[0];
  let bestD = Infinity;
  for (const entry of regionEntries) {
    const dx = Math.max(entry.rect.x0 - x, 0, x - entry.rect.x1);
    const dz = Math.max(entry.rect.z0 - z, 0, z - entry.rect.z1);
    const d = dx * dx + dz * dz;
    if (d < bestD) {
      bestD = d;
      best = entry;
    }
  }
  return best.id;
}

export function regionInfo(x, z) {
  return REGIONS[regionAt(x, z)];
}

// A safe spawn on flat, dry, walkable ground in the city ward.
export function findSpawn() {
  for (let r = 0; r < 220; r += 1) {
    const angle = r * 2.39996;
    const radius = Math.sqrt(r) * 3.4;
    const x = Math.round(86 + Math.cos(angle) * radius);
    const z = Math.round(96 + Math.sin(angle) * radius);
    if (x < 4 || z < 4 || x >= WORLD.size - 4 || z >= WORLD.size - 4) continue;
    const h = heightAt(x, z);
    if (h <= WORLD.seaLevel) continue;
    if (Math.abs(h - PLATEAU_CITY) > 1) continue;
    if (slopeAt(x, z) > 0.6) continue;
    return { x: x + 0.5, y: h, z: z + 0.5, region: regionAt(x, z) };
  }
  return { x: 86.5, y: PLATEAU_CITY, z: 96.5, region: 'city' };
}

// Deterministic per-column jitter, used by the builders so props do not need
// to own a random generator.
export function cellJitter(x, z, salt = 0) {
  return hash2(x, z, SEED + salt);
}

export function clearHeightCache() {
  cache.clear();
}