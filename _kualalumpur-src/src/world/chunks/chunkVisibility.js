export const DEFAULT_CHUNK_SIZE = 64;

export function getDetailTier(environment = globalThis) {
  const nav = environment.navigator ?? {};
  const win = environment.window ?? environment;
  const coarse = Boolean(win.matchMedia?.('(pointer: coarse)').matches);
  const small = Boolean(win.matchMedia?.('(max-width: 860px)').matches);
  const memory = nav.deviceMemory ?? 4;

  if (coarse || small || memory <= 4) return 'mobile';
  if (memory <= 8) return 'balanced';
  return 'desktop';
}

export const DETAIL_BUDGETS = {
  mobile: {
    highRadius: 1,
    mediumRadius: 2,
    visibleInstanceCap: 1100000
  },
  balanced: {
    highRadius: 2,
    mediumRadius: 3,
    visibleInstanceCap: 1100000
  },
  desktop: {
    highRadius: 2,
    mediumRadius: 4,
    visibleInstanceCap: 1100000
  }
};

export function chunkCoordsForPosition(x, z, chunkSize = DEFAULT_CHUNK_SIZE) {
  return {
    cx: Math.floor(x / chunkSize),
    cz: Math.floor(z / chunkSize)
  };
}

export function chunkIdForPosition(x, z, chunkSize = DEFAULT_CHUNK_SIZE) {
  const { cx, cz } = chunkCoordsForPosition(x, z, chunkSize);
  return `${cx}_${cz}`;
}

export function chunkDistance(a, b) {
  return Math.max(Math.abs(a.cx - b.cx), Math.abs(a.cz - b.cz));
}

export function isChunkVisible(chunk, origin, options = {}) {
  const radius = options.visibleRadius ?? DETAIL_BUDGETS[options.tier ?? 'desktop'].mediumRadius;
  return chunkDistance(chunk, origin) <= radius;
}
