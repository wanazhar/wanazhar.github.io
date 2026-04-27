import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { createKualaLumpurWorld } from '../src/world/createKualaLumpurWorld.js';
import { CHUNK_FORMAT_VERSION } from '../src/world/chunks/chunkFormat.js';

const scene = new THREE.Scene();
const world = createKualaLumpurWorld(scene);
world.chunkManager.update(world.startPosition);

const outputDir = path.resolve('public/chunks');
await mkdir(outputDir, { recursive: true });

const chunkStats = world.chunkManager.getStats();
const chunks = world.voxelStats.chunkManifest.map((chunk) => ({
  ...chunk,
  path: `summaries/${chunk.id}.json`
}));

await mkdir(path.join(outputDir, 'summaries'), { recursive: true });
await Promise.all(chunks.map((chunk) => writeFile(
  path.join(outputDir, 'summaries', `${chunk.id}.json`),
  `${JSON.stringify({ formatVersion: CHUNK_FORMAT_VERSION, ...chunk }, null, 2)}\n`
)));

const manifest = {
  formatVersion: CHUNK_FORMAT_VERSION,
  generatedAt: new Date().toISOString(),
  mode: 'phase2-static-manifest-prototype',
  note: 'Prototype static chunk metadata for GitHub Pages. Visual voxels remain bundled until binary chunk streaming is implemented.',
  totalInstances: world.voxelStats.total,
  chunkSize: world.voxelStats.chunkSize,
  chunks: chunks.map(({ materialCounts, ...chunk }) => ({ ...chunk, materialKinds: Object.keys(materialCounts).length })),
  runtimeBudget: {
    tier: chunkStats.tier,
    visibleInstanceCap: chunkStats.visibleInstanceCap,
    visibleRadius: chunkStats.visibleRadius
  },
  sectionCounts: world.voxelStats.sections,
  materialCounts: world.voxelStats.materials
};

await writeFile(path.join(outputDir, 'metadata.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ output: 'public/chunks/metadata.json', chunks: manifest.chunks.length, totalInstances: manifest.totalInstances }, null, 2));
