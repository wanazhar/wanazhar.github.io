import * as THREE from 'three';
import { createKualaLumpurWorld } from '../src/world/createKualaLumpurWorld.js';
import { getGeneratedDetailSummary } from '../src/world/detail/generatedDetailConfig.js';

const scene = new THREE.Scene();
const world = createKualaLumpurWorld(scene);
world.chunkManager.update(world.startPosition);
const stats = world.voxelStats;
const chunkStats = world.chunkManager.getStats();
const generatedDetail = getGeneratedDetailSummary();

const measurement = {
  totalInstances: stats.total,
  generatedDetailInstances: generatedDetail.totalAuthored,
  totalAuthoredWithGeneratedDetail: stats.total + generatedDetail.totalAuthored,
  instancedMeshes: stats.meshes,
  chunks: stats.chunks,
  chunkSize: stats.chunkSize,
  visibleInstances: chunkStats.visibleInstances,
  targetVisibleWithGeneratedDetail: generatedDetail.visibleBudget,
  visibleInstanceCap: chunkStats.visibleInstanceCap,
  chunkManifestEntries: stats.chunkManifest?.length ?? 0,
  generatedDetailChunks: generatedDetail.chunks,
  generatedDetailTopChunks: generatedDetail.topChunks.map(({ id, authoredCount, center }) => ({ id, authoredCount, center })),
  sectionCounts: stats.sections,
  materialCounts: stats.materials
};

console.log(JSON.stringify(measurement, null, 2));
