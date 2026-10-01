export const CITY_EXTENT = 168;
export const BLOCK_PITCH = 24;
export const STREET_WIDTH = 6;
export const HALF_STREET = STREET_WIDTH / 2;
export const BLOCK_SIZE = BLOCK_PITCH - STREET_WIDTH;
export const BLOCK_INSET = 1;
export const LOT_SIZE = BLOCK_SIZE - BLOCK_INSET * 2;
export const DOWNTON_CENTER = { x: 8, z: 6 };
export const CITY_BLOCK_MIN = -Math.floor(CITY_EXTENT / BLOCK_PITCH);
export const CITY_BLOCK_MAX = Math.floor((CITY_EXTENT - BLOCK_PITCH) / BLOCK_PITCH);

export function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

export function isStreetCoord(value) {
  const local = mod(value, BLOCK_PITCH);
  return local <= HALF_STREET - 1 || local >= BLOCK_PITCH - HALF_STREET;
}

export function isCityCoord(value) {
  return value >= -CITY_EXTENT && value <= CITY_EXTENT;
}

export function cellZone(x, z) {
  if (!isCityCoord(x) || !isCityCoord(z)) return 'country';
  if (isStreetCoord(x) || isStreetCoord(z)) return 'street';
  return 'block';
}

export function blockIndexAt(value) {
  return Math.floor((value - HALF_STREET) / BLOCK_PITCH);
}

export function blockOrigin(index) {
  return index * BLOCK_PITCH + HALF_STREET;
}

export function blockCenter(index) {
  return blockOrigin(index) + BLOCK_SIZE / 2;
}

export function blockRect(bx, bz) {
  return {
    x0: blockOrigin(bx),
    z0: blockOrigin(bz),
    x1: blockOrigin(bx) + BLOCK_SIZE - 1,
    z1: blockOrigin(bz) + BLOCK_SIZE - 1
  };
}

export function forEachCityBlock(callback) {
  for (let bx = CITY_BLOCK_MIN; bx <= CITY_BLOCK_MAX; bx += 1) {
    for (let bz = CITY_BLOCK_MIN; bz <= CITY_BLOCK_MAX; bz += 1) {
      callback(bx, bz);
    }
  }
}

export function rectsIntersect(a, b, padding = 0) {
  return !(
    a.x1 + padding < b.x0 ||
    a.x0 - padding > b.x1 ||
    a.z1 + padding < b.z0 ||
    a.z0 - padding > b.z1
  );
}

export function districtFor(x, z) {
  const radius = Math.hypot(x - DOWNTON_CENTER.x, z - DOWNTON_CENTER.z);
  if (radius < 54) return 'downtown';
  if (radius < 98) return 'midtown';
  if (radius < 142) return 'urban';
  return 'suburb';
}

export function isStreetCell(x, z) {
  return cellZone(x, z) === 'street';
}

export function streetLinesWithin(min, max) {
  const lines = [];
  const start = Math.ceil(min / BLOCK_PITCH);
  const end = Math.floor(max / BLOCK_PITCH);
  for (let k = start; k <= end; k += 1) lines.push(k * BLOCK_PITCH);
  return lines;
}
