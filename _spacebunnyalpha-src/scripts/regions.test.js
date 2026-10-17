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

test('every suburban house piece reaches the ground under it', () => {
  // The bug this guards: buildHouse() planted the slab, the wall shell, the path
  // and the hedge on heightAt(lot centre) — one sample. Wherever the lot ran a
  // block lower than that sample, they hung in the air, and the 8 x 6 slab and
  // the stone path read as wide grey plates (AGENTS.md §8).
  const batch = new VoxelBatch();
  const lots = planSuburbLots();
  for (const lot of lots) buildHouse(batch, lot);

  const lowestGround = (x0, z0, x1, z1) => {
    let low = Infinity;
    for (let x = x0; x <= x1 + 1e-6; x += 0.25) {
      for (let z = z0; z <= z1 + 1e-6; z += 0.25) low = Math.min(low, heightAt(x, z));
    }
    return low;
  };

  // Each house builds a floor slab and a ceiling slab: 8 x 0.12 x 6 across the
  // wall ring (lots are 11 x 9, walls 8 x 6). The lower of a house's two slabs
  // is the one that meets the ground.
  const slabs = batch.get('concrete').filter((o) => o.sx === 8 && o.sy === 0.12 && o.sz === 6);
  assert.strictEqual(slabs.length, lots.length * 2, 'expected a floor and a ceiling slab per house');

  const footing = new Map();
  for (const slab of slabs) {
    const key = `${slab.x},${slab.z}`;
    const seen = footing.get(key);
    if (!seen || slab.y < seen.y) footing.set(key, slab);
  }
  assert.strictEqual(footing.size, lots.length, 'every house should have a footing');

  for (const slab of footing.values()) {
    const bottom = slab.y - slab.sy / 2;
    const low = lowestGround(slab.x - 4, slab.z - 3, slab.x + 4, slab.z + 3);
    assert.ok(
      bottom <= low + 0.05,
      `floor slab at ${slab.x},${slab.z} floats ${(bottom - low).toFixed(2)}m above the ground`
    );
  }

  // The path runs out past the lot line, so it is measured against its own span.
  const paths = batch.get('stone').filter((o) => o.sx === 1.4 && o.sy === 0.12 && o.sz === 4);
  assert.strictEqual(paths.length, lots.length, 'expected a garden path per house');
  for (const path of paths) {
    const bottom = path.y - path.sy / 2;
    const low = lowestGround(path.x - 0.7, path.z - 2, path.x + 0.7, path.z + 2);
    assert.ok(
      bottom <= low + 0.05,
      `garden path at ${path.x},${path.z} floats ${(bottom - low).toFixed(2)}m above the ground`
    );
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