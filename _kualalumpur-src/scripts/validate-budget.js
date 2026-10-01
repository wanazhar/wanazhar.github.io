import * as THREE from 'three';
import { createKualaLumpurWorld } from '../src/world/createKualaLumpurWorld.js';
import { getGeneratedDetailSummary } from '../src/world/detail/generatedDetailConfig.js';

const BUDGETS = {
  maxAuthoredInstances: 400_000,
  maxInstancedMeshes: 900,
  maxChunks: 100,
  maxVisibleInstances: 350000
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
  ['target visible instances incl generated detail', generatedDetail.visibleBudget, BUDGETS.maxVisibleInstances],
  ['blocked cells at spawn point', world.collision.isBlocked(world.startPosition.x, world.startPosition.z) ? 1 : 0, 0],
  ['building collision cells', world.collision.size > 2000 ? 0 : 1, 0]
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
