import { CITY_EXTENT } from '../layout/streetGrid.js';

export const GENERATED_DETAIL_TOTAL = 4200;
export const GENERATED_DETAIL_VISIBLE_BUDGET = 4600;
export const GENERATED_DETAIL_CHUNK_SIZE = 64;
export const GENERATED_DETAIL_GRID_MIN = -4;
export const GENERATED_DETAIL_GRID_MAX = 3;
export const GENERATED_DETAIL_GRID_WIDTH = GENERATED_DETAIL_GRID_MAX - GENERATED_DETAIL_GRID_MIN + 1;
export const GENERATED_DETAIL_CHUNK_COUNT = GENERATED_DETAIL_GRID_WIDTH * GENERATED_DETAIL_GRID_WIDTH;
export const GENERATED_DETAIL_MATERIALS = [
  'concreteDark',
  'lampGlow',
  'treeTrunk',
  'treeLeaf',
  'treeLeaf2',
  'steel',
  'warning',
  'busGreen',
  'silver',
  'stationRoof'
];

const DISTRICT_WEIGHTS = [
  { x: 8, z: 6, weight: 1.6 },
  { x: -12, z: 22, weight: 1.35 },
  { x: 35, z: 18, weight: 1.3 },
  { x: 30, z: -22, weight: 1.25 },
  { x: -20, z: -52, weight: 1.15 },
  { x: -60, z: -60, weight: 0.95 },
  { x: 66, z: 32, weight: 1.2 },
  { x: -35, z: 8, weight: 0.85 }
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function sidewalkDensityAt(x, z) {
  if (Math.abs(x) > CITY_EXTENT + 32 || Math.abs(z) > CITY_EXTENT + 32) return 0;
  let density = 0.32;
  for (const anchor of DISTRICT_WEIGHTS) {
    const distance = Math.hypot(x - anchor.x, z - anchor.z);
    density += anchor.weight * Math.exp(-(distance * distance) / (2 * 82 * 82));
  }
  return clamp(density, 0.25, 2.2);
}

export function createGeneratedDetailChunkPlan() {
  const chunks = [];
  for (let cx = GENERATED_DETAIL_GRID_MIN; cx <= GENERATED_DETAIL_GRID_MAX; cx += 1) {
    for (let cz = GENERATED_DETAIL_GRID_MIN; cz <= GENERATED_DETAIL_GRID_MAX; cz += 1) {
      const center = {
        x: cx * GENERATED_DETAIL_CHUNK_SIZE + GENERATED_DETAIL_CHUNK_SIZE / 2,
        z: cz * GENERATED_DETAIL_CHUNK_SIZE + GENERATED_DETAIL_CHUNK_SIZE / 2
      };
      const density = sidewalkDensityAt(center.x, center.z);
      chunks.push({
        id: `props_${cx}_${cz}`,
        cx,
        cz,
        center,
        density,
        authoredCount: density > 0 ? Math.round(120 * density) : 0,
        lod: Math.abs(center.x) < 96 && Math.abs(center.z) < 96 ? 'high' : 'medium'
      });
    }
  }

  const total = chunks.reduce((sum, chunk) => sum + chunk.authoredCount, 0);
  const scale = total > 0 ? GENERATED_DETAIL_TOTAL / total : 0;
  chunks.forEach((chunk) => {
    chunk.authoredCount = Math.round(chunk.authoredCount * scale);
  });

  let assigned = chunks.reduce((sum, chunk) => sum + chunk.authoredCount, 0);
  const byDensity = [...chunks].sort((a, b) => b.density - a.density);
  for (let index = 0; assigned !== GENERATED_DETAIL_TOTAL && index < byDensity.length * 4; index += 1) {
    const chunk = byDensity[index % byDensity.length];
    if (assigned < GENERATED_DETAIL_TOTAL) {
      chunk.authoredCount += 1;
      assigned += 1;
    } else if (chunk.authoredCount > 0) {
      chunk.authoredCount -= 1;
      assigned -= 1;
    }
  }

  return chunks;
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
