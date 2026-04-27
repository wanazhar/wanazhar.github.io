import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { createKualaLumpurWorld } from '../src/world/createKualaLumpurWorld.js';
import { CHUNK_FORMAT_VERSION } from '../src/world/chunks/chunkFormat.js';
import { createGeneratedDetailChunkPlan, getGeneratedDetailSummary } from '../src/world/detail/generatedDetailConfig.js';

const scene = new THREE.Scene();
const world = createKualaLumpurWorld(scene);
world.chunkManager.update(world.startPosition);

const outputDir = path.resolve('public/chunks');
await mkdir(outputDir, { recursive: true });

const chunkStats = world.chunkManager.getStats();
const generatedDetail = getGeneratedDetailSummary();
const generatedDetailChunks = createGeneratedDetailChunkPlan();
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
  mode: 'phase3-5m-generated-detail',
  note: '5M authored deterministic KL/Klang Valley detail layer. Base world remains bundled; generated detail chunks are streamed/rendered up to the shared 950k visibility budget.',
  totalInstances: world.voxelStats.total,
  generatedDetailInstances: generatedDetail.totalAuthored,
  totalAuthoredWithGeneratedDetail: world.voxelStats.total + generatedDetail.totalAuthored,
  chunkSize: world.voxelStats.chunkSize,
  chunks: chunks.map(({ materialCounts, ...chunk }) => ({ ...chunk, materialKinds: Object.keys(materialCounts).length })),
  generatedDetailChunks: generatedDetailChunks.map((chunk) => ({
    id: chunk.id,
    cx: chunk.cx,
    cz: chunk.cz,
    center: chunk.center,
    authoredCount: chunk.authoredCount,
    density: Number(chunk.density.toFixed(4)),
    lod: chunk.lod,
    format: 'deterministic-procedural-v1'
  })),
  runtimeBudget: {
    tier: chunkStats.tier,
    visibleInstanceCap: chunkStats.visibleInstanceCap,
    generatedDetailVisibleBudget: generatedDetail.visibleBudget,
    visibleRadius: chunkStats.visibleRadius
  },
  sectionCounts: world.voxelStats.sections,
  materialCounts: world.voxelStats.materials
};

await writeFile(path.join(outputDir, 'metadata.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ output: 'public/chunks/metadata.json', baseChunks: manifest.chunks.length, generatedDetailChunks: manifest.generatedDetailChunks.length, totalAuthoredWithGeneratedDetail: manifest.totalAuthoredWithGeneratedDetail, visibleBudget: manifest.runtimeBudget.generatedDetailVisibleBudget }, null, 2));
