import * as THREE from 'three';
import { createKualaLumpurWorld } from '../src/world/createKualaLumpurWorld.js';
import { getGeneratedDetailSummary } from '../src/world/detail/generatedDetailConfig.js';

const BUDGETS = {
  maxAuthoredInstances: 5_400_000,
  maxInstancedMeshes: 1200,
  maxChunks: 100,
  maxVisibleInstances: 950000
};

const scene = new THREE.Scene();
const world = createKualaLumpurWorld(scene);
world.chunkManager.update(world.startPosition);

const stats = world.voxelStats;
const chunkStats = world.chunkManager.getStats();
const generatedDetail = getGeneratedDetailSummary();
const checks = [
  ['authored instances incl generated detail', stats.total + generatedDetail.totalAuthored, BUDGETS.maxAuthoredInstances],
  ['instanced meshes', stats.meshes, BUDGETS.maxInstancedMeshes],
  ['chunks', stats.chunks, BUDGETS.maxChunks],
  ['base visible instances', chunkStats.visibleInstances, Math.min(BUDGETS.maxVisibleInstances, chunkStats.visibleInstanceCap)],
  ['target visible instances incl generated detail', generatedDetail.visibleBudget, BUDGETS.maxVisibleInstances]
];

let failed = false;
for (const [name, actual, limit] of checks) {
  const ok = actual <= limit;
  failed ||= !ok;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${actual.toLocaleString()} <= ${limit.toLocaleString()}`);
}

if (failed) {
  process.exitCode = 1;
}
