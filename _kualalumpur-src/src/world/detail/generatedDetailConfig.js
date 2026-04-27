export const GENERATED_DETAIL_TOTAL = 5_000_000;
export const GENERATED_DETAIL_VISIBLE_BUDGET = 950_000;
export const GENERATED_DETAIL_CHUNK_SIZE = 64;
export const GENERATED_DETAIL_GRID_MIN = -7;
export const GENERATED_DETAIL_GRID_MAX = 7;
export const GENERATED_DETAIL_GRID_WIDTH = GENERATED_DETAIL_GRID_MAX - GENERATED_DETAIL_GRID_MIN + 1;
export const GENERATED_DETAIL_CHUNK_COUNT = GENERATED_DETAIL_GRID_WIDTH * GENERATED_DETAIL_GRID_WIDTH;
export const GENERATED_DETAIL_MATERIALS = ['glassDark', 'concrete', 'road', 'grassDark', 'lampGlow'];

const DISTRICT_ANCHORS = [
  { name: 'KLCC / Golden Triangle', x: 47, z: 43, weight: 1.55 },
  { name: 'Bukit Bintang / TRX', x: 41, z: 30, weight: 1.45 },
  { name: 'Merdeka / Chinatown', x: 37, z: 37, weight: 1.28 },
  { name: 'Bangsar / Mid Valley', x: 10, z: 18, weight: 1.05 },
  { name: 'Petaling Jaya', x: -42, z: 13, weight: 1.05 },
  { name: 'Subang / Sunway', x: -82, z: -25, weight: 0.98 },
  { name: 'Shah Alam', x: -57, z: -4, weight: 0.92 },
  { name: 'Klang', x: -150, z: -3, weight: 0.72 },
  { name: 'Putrajaya', x: 35, z: -88, weight: 0.8 },
  { name: 'KLIA / Sepang', x: 45, z: -199, weight: 0.54 },
  { name: 'Batu Caves / Gombak', x: 57, z: 88, weight: 0.72 },
  { name: 'Genting foothills', x: 91, z: 199, weight: 0.45 },
  { name: 'Kuala Selangor coast', x: -203, z: 150, weight: 0.38 }
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function chunkCenter(cx, cz, chunkSize = GENERATED_DETAIL_CHUNK_SIZE) {
  return {
    x: cx * chunkSize + chunkSize / 2,
    z: cz * chunkSize + chunkSize / 2
  };
}

function anchorDensity(x, z) {
  let density = 0.08;
  for (const anchor of DISTRICT_ANCHORS) {
    const distance = Math.hypot(x - anchor.x, z - anchor.z);
    density += anchor.weight * Math.exp(-(distance * distance) / (2 * 78 * 78));
  }
  const corridor = Math.exp(-(Math.abs(z - 20) ** 2) / (2 * 34 * 34)) * 0.34;
  const northSouth = Math.exp(-(Math.abs(x - 42) ** 2) / (2 * 38 * 38)) * 0.22;
  return clamp(density + corridor + northSouth, 0.08, 2.4);
}

export function createGeneratedDetailChunkPlan() {
  const weighted = [];
  let totalWeight = 0;
  for (let cx = GENERATED_DETAIL_GRID_MIN; cx <= GENERATED_DETAIL_GRID_MAX; cx += 1) {
    for (let cz = GENERATED_DETAIL_GRID_MIN; cz <= GENERATED_DETAIL_GRID_MAX; cz += 1) {
      const center = chunkCenter(cx, cz);
      const density = anchorDensity(center.x, center.z);
      totalWeight += density;
      weighted.push({
        id: `detail_${cx}_${cz}`,
        cx,
        cz,
        center,
        density,
        authoredCount: 0,
        lod: Math.abs(cx) <= 4 && Math.abs(cz) <= 4 ? 'high' : 'medium'
      });
    }
  }

  let assigned = 0;
  for (const chunk of weighted) {
    chunk.authoredCount = Math.max(1, Math.floor((chunk.density / totalWeight) * GENERATED_DETAIL_TOTAL));
    assigned += chunk.authoredCount;
  }

  let remaining = GENERATED_DETAIL_TOTAL - assigned;
  weighted.sort((a, b) => b.density - a.density);
  for (let i = 0; remaining > 0; i = (i + 1) % weighted.length, remaining -= 1) weighted[i].authoredCount += 1;

  return weighted.sort((a, b) => a.cx - b.cx || a.cz - b.cz);
}

export function getGeneratedDetailSummary() {
  const chunks = createGeneratedDetailChunkPlan();
  return {
    totalAuthored: chunks.reduce((sum, chunk) => sum + chunk.authoredCount, 0),
    chunks: chunks.length,
    chunkSize: GENERATED_DETAIL_CHUNK_SIZE,
    visibleBudget: GENERATED_DETAIL_VISIBLE_BUDGET,
    grid: {
      min: GENERATED_DETAIL_GRID_MIN,
      max: GENERATED_DETAIL_GRID_MAX,
      width: GENERATED_DETAIL_GRID_WIDTH
    },
    topChunks: [...chunks].sort((a, b) => b.authoredCount - a.authoredCount).slice(0, 12)
  };
}
