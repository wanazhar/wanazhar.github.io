// Reports the size of the generated island so a detail pass cannot quietly
// blow up the instance count. Runs in plain Node: the builders emit plain box
// lists, so no renderer is needed.

import { STREAMING, WORLD, REGIONS } from '../src/config.js';
import { WorldPlan } from '../src/world/World.js';
import { buildTerrainBoxes } from '../src/world/ChunkMeshes.js';
import { heightAt, biomeAt, regionAt } from '../src/world/Terrain.js';

const t0 = performance.now();
const plan = new WorldPlan();
const tPlan = performance.now() - t0;

const t1 = performance.now();
const statics = plan.buildAllStatics();
const tStatics = performance.now() - t1;

// Terrain chunks inside the streaming radius around the spawn.
const t2 = performance.now();
let chunkBoxes = 0;
let chunkCount = 0;
const chunkMaterials = new Set();
for (let dz = -STREAMING.loadRadius; dz <= STREAMING.loadRadius; dz += 1) {
  for (let dx = -STREAMING.loadRadius; dx <= STREAMING.loadRadius; dx += 1) {
    const boxes = buildTerrainBoxes(4 + dx, 4 + dz);
    chunkCount += 1;
    for (const [material, list] of boxes) {
      chunkBoxes += list.length;
      chunkMaterials.add(material);
    }
  }
}
const tChunks = performance.now() - t2;

// Biome census over the whole island.
const census = new Map();
let land = 0;
let sea = 0;
for (let x = 0; x < WORLD.size; x += 2) {
  for (let z = 0; z < WORLD.size; z += 2) {
    const biome = biomeAt(x, z);
    census.set(biome, (census.get(biome) ?? 0) + 1);
    if (heightAt(x, z) > WORLD.seaLevel) land += 1;
    else sea += 1;
  }
}

// Per-region static footprint, by counting lots and houses.
const counts = {
  cityLots: plan.cityLots.length,
  suburbHouses: plan.suburbLots.length,
  coastHouses: plan.coastHouses.length,
  collisionCells: plan.collision.count,
  npcs: 10
};

const total = statics.count() + chunkBoxes;

const rows = [
  ['plan built', `${tPlan.toFixed(0)} ms`],
  ['statics built', `${tStatics.toFixed(0)} ms`],
  ['terrain sampled', `${tChunks.toFixed(0)} ms`],
  ['', ''],
  ['static boxes', statics.count().toLocaleString('en-US')],
  ['static materials', statics.materials().length],
  ['streamed chunks', chunkCount],
  ['terrain boxes in range', chunkBoxes.toLocaleString('en-US')],
  ['terrain materials', chunkMaterials.size],
  ['TOTAL instances on screen', total.toLocaleString('en-US')],
  ['approximate draw calls', statics.materials().length + chunkMaterials.size * chunkCount],
  ['collision cells', counts.collisionCells.toLocaleString('en-US')],
  ['', ''],
  ['city lots', counts.cityLots],
  ['suburb houses', counts.suburbHouses],
  ['coast houses', counts.coastHouses],
  ['', ''],
  ['land cells', `${land.toLocaleString('en-US')} (${((land / (land + sea)) * 100).toFixed(1)}%)`],
  ['sea cells', sea.toLocaleString('en-US')]
];

console.log('spacebunnyalpha world report');
console.log('='.repeat(46));
for (const [label, value] of rows) {
  if (label === '') {
    console.log('');
    continue;
  }
  console.log(String(label).padEnd(30), value);
}

console.log('\nbiome census');
console.log('-'.repeat(46));
for (const [biome, count] of [...census.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(biome.padEnd(16), count.toLocaleString('en-US'));
}

console.log('\nregion extents');
console.log('-'.repeat(46));
for (const [id, region] of Object.entries(REGIONS)) {
  console.log(region.label.padEnd(20), JSON.stringify(region.rect));
}

console.log('\ntop static materials');
console.log('-'.repeat(46));
const top = statics
  .materials()
  .map((m) => [m, statics.get(m).length])
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12);
for (const [material, count] of top) {
  console.log(material.padEnd(18), count.toLocaleString('en-US'));
}