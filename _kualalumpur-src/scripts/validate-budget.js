import * as THREE from 'three';
import { createKualaLumpurWorld } from '../src/world/createKualaLumpurWorld.js';

const BUDGETS = {
  maxAuthoredInstances: 750000,
  maxInstancedMeshes: 1200,
  maxChunks: 100,
  maxVisibleInstances: 1000000
};

const scene = new THREE.Scene();
const world = createKualaLumpurWorld(scene);
world.chunkManager.update(world.startPosition);

const stats = world.voxelStats;
const chunkStats = world.chunkManager.getStats();
const checks = [
  ['authored instances', stats.total, BUDGETS.maxAuthoredInstances],
  ['instanced meshes', stats.meshes, BUDGETS.maxInstancedMeshes],
  ['chunks', stats.chunks, BUDGETS.maxChunks],
  ['visible instances', chunkStats.visibleInstances, Math.min(BUDGETS.maxVisibleInstances, chunkStats.visibleInstanceCap)]
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
