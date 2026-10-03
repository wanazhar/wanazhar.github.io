// Fails the build if the island outgrows its budget. These ceilings are
// deliberately well above the current numbers: their job is to catch an
// accidental explosion, not to police ordinary growth.

import { STREAMING, RENDER, WORLD } from '../src/config.js';
import { WorldPlan } from '../src/world/World.js';
import { buildTerrainBoxes } from '../src/world/ChunkMeshes.js';
import { PALETTE } from '../src/world/Palette.js';

export const BUDGET = {
  maxStaticBoxes: 30000,
  maxStaticMaterials: 140,
  maxTerrainBoxesInRange: 60000,
  maxTerrainMaterials: 30,
  maxTotalInstances: 90000,
  maxApproxDrawCalls: 900,
  maxCollisionCells: 40000,
  maxPlanBuildMs: 6000
};

export function collectMetrics() {
  const t0 = performance.now();
  const plan = new WorldPlan();
  const planMs = performance.now() - t0;

  const statics = plan.buildAllStatics();

  let terrainBoxes = 0;
  let chunkCount = 0;
  const terrainMaterials = new Set();
  for (let dz = -STREAMING.loadRadius; dz <= STREAMING.loadRadius; dz += 1) {
    for (let dx = -STREAMING.loadRadius; dx <= STREAMING.loadRadius; dx += 1) {
      const boxes = buildTerrainBoxes(4 + dx, 4 + dz);
      chunkCount += 1;
      for (const [material, list] of boxes) {
        terrainBoxes += list.length;
        terrainMaterials.add(material);
      }
    }
  }

  const staticMaterials = statics.materials();
  return {
    planMs,
    staticBoxes: statics.count(),
    staticMaterials: staticMaterials.length,
    terrainBoxes,
    terrainMaterials: terrainMaterials.size,
    chunkCount,
    totalInstances: statics.count() + terrainBoxes,
    approxDrawCalls: staticMaterials.length + terrainMaterials.size * chunkCount,
    collisionCells: plan.collision.count,
    // Any material the builders emit must exist in the palette, or the
    // instancer would throw at runtime.
    unknownMaterials: [...staticMaterials, ...terrainMaterials].filter((m) => !(m in PALETTE))
  };
}

export function validate(metrics) {
  const failures = [];

  const check = (label, actual, limit) => {
    if (actual > limit) {
      failures.push(`${label}: ${actual.toLocaleString('en-US')} exceeds the ceiling of ${limit.toLocaleString('en-US')}`);
    }
  };

  check('static boxes', metrics.staticBoxes, BUDGET.maxStaticBoxes);
  check('static materials', metrics.staticMaterials, BUDGET.maxStaticMaterials);
  check('terrain boxes in range', metrics.terrainBoxes, BUDGET.maxTerrainBoxesInRange);
  check('terrain materials', metrics.terrainMaterials, BUDGET.maxTerrainMaterials);
  check('total instances on screen', metrics.totalInstances, BUDGET.maxTotalInstances);
  check('approximate draw calls', metrics.approxDrawCalls, BUDGET.maxApproxDrawCalls);
  check('collision cells', metrics.collisionCells, BUDGET.maxCollisionCells);
  check('plan build time (ms)', Math.round(metrics.planMs), BUDGET.maxPlanBuildMs);

  if (metrics.unknownMaterials.length) {
    failures.push(`unknown materials emitted: ${metrics.unknownMaterials.join(', ')}`);
  }

  return failures;
}

// Run directly to validate; imported by the budget test.
const isMain = process.argv[1] && process.argv[1].endsWith('validate-budget.js');
if (isMain) {
  const metrics = collectMetrics();
  const failures = validate(metrics);

  console.log('spacebunnyalpha world budget');
  console.log('='.repeat(46));
  for (const [label, value, limit] of [
    ['static boxes', metrics.staticBoxes, BUDGET.maxStaticBoxes],
    ['static materials', metrics.staticMaterials, BUDGET.maxStaticMaterials],
    ['terrain boxes in range', metrics.terrainBoxes, BUDGET.maxTerrainBoxesInRange],
    ['terrain materials', metrics.terrainMaterials, BUDGET.maxTerrainMaterials],
    ['total instances', metrics.totalInstances, BUDGET.maxTotalInstances],
    ['approx draw calls', metrics.approxDrawCalls, BUDGET.maxApproxDrawCalls],
    ['collision cells', metrics.collisionCells, BUDGET.maxCollisionCells],
    ['plan build ms', Math.round(metrics.planMs), BUDGET.maxPlanBuildMs]
  ]) {
    const pct = ((value / limit) * 100).toFixed(0);
    console.log(String(label).padEnd(24), String(value).toLocaleString('en-US').padStart(10), ` / ${limit.toLocaleString('en-US')}  (${pct}%)`);
  }

  if (failures.length) {
    console.log('\nBUDGET EXCEEDED');
    for (const failure of failures) console.log('  -', failure);
    process.exit(1);
  }

  console.log('\nwithin budget');
}