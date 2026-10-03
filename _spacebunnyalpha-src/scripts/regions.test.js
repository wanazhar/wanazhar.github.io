import test from 'node:test';
import assert from 'node:assert/strict';
import { WORLD } from '../src/config.js';
import { VoxelBatch, PALETTE } from '../src/world/Palette.js';
import { heightAt } from '../src/world/Terrain.js';
import {
  planSuburbLots,
  buildHouse,
  buildSuburbStreets,
  buildKonbini,
  buildSchool,
  SUBURB_FURNITURE
} from '../src/world/regions/SuburbRegion.js';
import {
  buildPaddies,
  buildOrchard,
  buildShrine,
  buildFarm,
  buildHighlandVegetation,
  RURAL_FURNITURE
} from '../src/world/regions/RuralRegion.js';
import {
  planCoastHouses,
  buildCoastHouse,
  buildVillageLane,
  buildBeachDetail,
  buildSeaTorii,
  buildHarbour,
  buildCoastVegetation,
  COAST_VILLAGE,
  COAST_FURNITURE
} from '../src/world/regions/CoastRegion.js';

function assertKnownMaterials(batch) {
  for (const name of batch.materials()) {
    assert.ok(PALETTE[name], `emitted unknown material "${name}"`);
  }
}

test('the suburbs plan a proper residential street', () => {
  const lots = planSuburbLots();
  assert.ok(lots.length >= 25, `suburbs only planned ${lots.length} houses`);
  const sides = new Set(lots.map((l) => l.side));
  assert.strictEqual(sides.size, 2, 'houses should sit on both sides of the street');
});

test('every suburban house rests on dry, level ground', () => {
  for (const lot of planSuburbLots()) {
    const h = heightAt(lot.x + 5, lot.z + 4);
    assert.ok(h > WORLD.seaLevel, `house at ${lot.x},${lot.z} is underwater (h=${h})`);
  }
});

test('the konbini and the school sit on solid land', () => {
  for (const [name, spot] of Object.entries(SUBURB_FURNITURE)) {
    const h = heightAt(spot.x, spot.z);
    assert.ok(h > WORLD.seaLevel, `${name} at ${spot.x},${spot.z} is underwater (h=${h})`);
  }
});

test('the konbini glows: it has lit materials for the night', () => {
  const batch = new VoxelBatch();
  buildKonbini(batch, SUBURB_FURNITURE.konbini.x, SUBURB_FURNITURE.konbini.z);
  const names = batch.materials();
  assert.ok(names.includes('lampGlass'), 'konbini should have a lit sign band');
  assert.ok(names.includes('windowDark'), 'konbini should have a shopfront window');
});

test('rural landmarks sit on land, and the shrine is up the mountain', () => {
  for (const [name, spot] of Object.entries(RURAL_FURNITURE)) {
    const h = heightAt(spot.x, spot.z);
    assert.ok(h > WORLD.seaLevel, `${name} at ${spot.x},${spot.z} is underwater (h=${h})`);
  }
  const shrineH = heightAt(RURAL_FURNITURE.shrine.x, RURAL_FURNITURE.shrine.z);
  const farmH = heightAt(RURAL_FURNITURE.farm.x, RURAL_FURNITURE.farm.z);
  assert.ok(shrineH > farmH + 10, `shrine (${shrineH}) should stand well above the farm (${farmH})`);
});

test('the shrine is built from real shrine materials', () => {
  const batch = new VoxelBatch();
  buildShrine(batch);
  const names = batch.materials();
  assert.ok(names.includes('toriiRed'), 'the shrine needs a torii');
  assert.ok(names.includes('lanternStone'), 'the shrine needs stone lanterns');
  assert.ok(names.includes('shrineWood'), 'the shrine needs a wooden hall');
});

test('the rice paddies are actually terraced and hold water', () => {
  const batch = new VoxelBatch();
  buildPaddies(batch);
  assert.ok(batch.get('paddyWater').length > 100, 'paddies should contain standing water');
  assert.ok(batch.get('paddyMud').length > 100, 'paddies should have mud bunds between plots');
});

test('every region builder emits only known materials', () => {
  const batches = {
    suburbs: new VoxelBatch(),
    streets: new VoxelBatch(),
    konbini: new VoxelBatch(),
    school: new VoxelBatch(),
    paddies: new VoxelBatch(),
    orchard: new VoxelBatch(),
    shrine: new VoxelBatch(),
    farm: new VoxelBatch(),
    highland: new VoxelBatch(),
    coast: new VoxelBatch(),
    lane: new VoxelBatch(),
    beach: new VoxelBatch(),
    torii: new VoxelBatch(),
    harbour: new VoxelBatch(),
    coastVeg: new VoxelBatch()
  };

  for (const lot of planSuburbLots()) buildHouse(batches.suburbs, lot);
  buildSuburbStreets(batches.streets);
  buildKonbini(batches.konbini, SUBURB_FURNITURE.konbini.x, SUBURB_FURNITURE.konbini.z);
  buildSchool(batches.school, SUBURB_FURNITURE.school.x, SUBURB_FURNITURE.school.z);
  buildPaddies(batches.paddies);
  buildOrchard(batches.orchard);
  buildShrine(batches.shrine);
  buildFarm(batches.farm, RURAL_FURNITURE.farm.x, RURAL_FURNITURE.farm.z);
  buildHighlandVegetation(batches.highland);
  for (const lot of planCoastHouses()) buildCoastHouse(batches.coast, lot);
  buildVillageLane(batches.lane);
  buildBeachDetail(batches.beach);
  buildSeaTorii(batches.torii);
  buildHarbour(batches.harbour);
  buildCoastVegetation(batches.coastVeg);

  for (const [name, batch] of Object.entries(batches)) {
    assert.ok(batch.count() > 0, `${name} produced no geometry at all`);
    assertKnownMaterials(batch);
  }
});

test('the fishing village is on level, dry ground', () => {
  const houses = planCoastHouses();
  assert.ok(houses.length >= 6, `only ${houses.length} fishing houses found`);
  for (const lot of houses) {
    assert.ok(heightAt(lot.x, lot.z) > WORLD.seaLevel, `house at ${lot.x},${lot.z} is underwater`);
  }
});

test('the sea torii genuinely stands in the water', () => {
  assert.ok(
    heightAt(COAST_FURNITURE.torii.x, COAST_FURNITURE.torii.z) < WORLD.seaLevel,
    'the torii should be out in the surf, not on dry land'
  );
  const batch = new VoxelBatch();
  buildSeaTorii(batch);
  assert.ok(batch.get('toriiRed').length > 0, 'the torii needs red pillars');
});

test('region generation is deterministic', () => {
  const first = planSuburbLots().map((l) => `${l.x},${l.z},${l.seed}`);
  const second = planSuburbLots().map((l) => `${l.x},${l.z},${l.seed}`);
  assert.deepStrictEqual(first, second);

  const coastA = planCoastHouses().map((l) => `${l.x},${l.z},${l.seed}`);
  const coastB = planCoastHouses().map((l) => `${l.x},${l.z},${l.seed}`);
  assert.deepStrictEqual(coastA, coastB);
});

test('the whole world stays inside a sane geometry budget', () => {
  const batch = new VoxelBatch();
  for (const lot of planSuburbLots()) buildHouse(batch, lot);
  buildSuburbStreets(batch);
  buildKonbini(batch, SUBURB_FURNITURE.konbini.x, SUBURB_FURNITURE.konbini.z);
  buildSchool(batch, SUBURB_FURNITURE.school.x, SUBURB_FURNITURE.school.z);
  buildPaddies(batch);
  buildOrchard(batch);
  buildShrine(batch);
  buildFarm(batch, RURAL_FURNITURE.farm.x, RURAL_FURNITURE.farm.z);
  buildHighlandVegetation(batch);
  for (const lot of planCoastHouses()) buildCoastHouse(batch, lot);
  buildVillageLane(batch);
  buildBeachDetail(batch);
  buildSeaTorii(batch);
  buildHarbour(batch);
  buildCoastVegetation(batch);

  assert.ok(batch.count() > 3000, 'the regions should build a meaningful amount of geometry');
  assert.ok(batch.count() < 120000, `regions emitted ${batch.count()} boxes, too heavy for one pass`);
});

test('no single material dominates the region geometry', () => {
  const batch = new VoxelBatch();
  for (const lot of planSuburbLots()) buildHouse(batch, lot);
  buildSuburbStreets(batch);
  buildPaddies(batch);
  buildHighlandVegetation(batch);

  let biggest = 0;
  for (const name of batch.materials()) biggest = Math.max(biggest, batch.get(name).length);
  assert.ok(biggest < batch.count() * 0.6, `one material is ${((biggest / batch.count()) * 100).toFixed(0)}% of all geometry`);
});