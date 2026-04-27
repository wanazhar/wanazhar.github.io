import * as THREE from 'three';
import { createKualaLumpurWorld } from '../src/world/createKualaLumpurWorld.js';

const scene = new THREE.Scene();
const world = createKualaLumpurWorld(scene);
world.chunkManager.update(world.startPosition);
const stats = world.voxelStats;
const chunkStats = world.chunkManager.getStats();

const measurement = {
  totalInstances: stats.total,
  instancedMeshes: stats.meshes,
  chunks: stats.chunks,
  chunkSize: stats.chunkSize,
  visibleInstances: chunkStats.visibleInstances,
  visibleInstanceCap: chunkStats.visibleInstanceCap,
  chunkManifestEntries: stats.chunkManifest?.length ?? 0,
  sectionCounts: stats.sections,
  materialCounts: stats.materials
};

console.log(JSON.stringify(measurement, null, 2));
