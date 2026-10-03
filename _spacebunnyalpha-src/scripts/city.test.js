import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRoadNetwork, planCityLots, buildLot, describeLot, isRoadColumn, distanceToRoad } from '../src/world/regions/CityRegion.js';
import { VoxelBatch, PALETTE } from '../src/world/Palette.js';

function buildCity() {
  const network = buildRoadNetwork();
  const lots = planCityLots(network);
  const batch = new VoxelBatch();
  for (const lot of lots) buildLot(batch, lot);
  return { network, lots, batch };
}

test('the street grid lays roads inside the city rectangle', () => {
  const { network } = buildCity();
  assert.ok(network.roads.length > 6, `expected a real grid, got ${network.roads.length} roads`);
  const hasBothAxes = network.roads.some((r) => r.axis === 'v') && network.roads.some((r) => r.axis === 'h');
  assert.ok(hasBothAxes, 'grid should have both north-south and east-west roads');
});

test('the city plans a substantial number of lots', () => {
  const { lots } = buildCity();
  assert.ok(lots.length >= 20, `city only planned ${lots.length} lots`);
});

test('the skyline has variety, not one repeated building', () => {
  const { lots } = buildCity();
  const kinds = new Set(lots.map((l) => l.kind));
  assert.ok(kinds.size >= 3, `expected several building kinds, saw ${[...kinds]}`);
  assert.ok(kinds.has('tower'), 'a dense ward needs at least one tower');
  assert.ok(kinds.has('lotus'), 'a dense ward needs somewhere green to breathe');
});

test('towers are tall and shophouses are low', () => {
  const { lots } = buildCity();
  const towers = lots.filter((l) => l.kind === 'tower').map((l) => describeLot(l).height);
  const shops = lots.filter((l) => l.kind === 'shophouse').map((l) => describeLot(l).height);
  if (towers.length) assert.ok(Math.max(...towers) >= 16, 'towers should reach at least 16 storeys');
  if (shops.length) assert.ok(Math.max(...shops) <= 8, 'shophouses should stay low');
});

test('lot generation is deterministic', () => {
  const a = buildCity();
  const b = buildCity();
  assert.strictEqual(a.lots.length, b.lots.length);
  assert.deepStrictEqual(
    a.lots.map((l) => `${l.x},${l.z},${l.w},${l.d},${l.kind}`),
    b.lots.map((l) => `${l.x},${l.z},${l.w},${l.d},${l.kind}`)
  );
  assert.strictEqual(a.batch.count(), b.batch.count());
});

test('every lot fits inside the city rectangle', () => {
  const { lots } = buildCity();
  // Generous margin: lots are allowed to sit on the sidewalk edge.
  for (const lot of lots) {
    assert.ok(lot.x >= 20 && lot.z >= 20, `lot at ${lot.x},${lot.z} escapes the ward`);
  }
});

test('no lot is placed on top of a road', () => {
  const { network, lots } = buildCity();
  for (const lot of lots) {
    // The centre of a building front must clear every road centre.
    const cx = lot.x + lot.w / 2;
    const cz = lot.z + lot.d / 2;
    assert.ok(distanceToRoad(cx, cz, network) > 2, `lot ${lot.kind} at ${cx.toFixed(1)},${cz.toFixed(1)} sits on the road`);
  }
});

test('lots do not overlap each other', () => {
  const { lots } = buildCity();
  for (let i = 0; i < lots.length; i += 1) {
    for (let j = i + 1; j < lots.length; j += 1) {
      const a = lots[i];
      const b = lots[j];
      const overlapX = a.x < b.x + b.w && b.x < a.x + a.w;
      const overlapZ = a.z < b.z + b.d && b.z < a.z + a.d;
      assert.ok(!(overlapX && overlapZ), `lots ${a.kind}@${a.x},${a.z} and ${b.kind}@${b.x},${b.z} overlap`);
    }
  }
});

test('the city emits geometry using only known materials', () => {
  const { batch } = buildCity();
  for (const name of batch.materials()) {
    assert.ok(PALETTE[name], `city emitted unknown material "${name}"`);
  }
});

test('the city geometry stays inside a sane instance budget', () => {
  const { batch } = buildCity();
  assert.ok(batch.count() > 500, 'the city should actually build something');
  assert.ok(batch.count() < 40000, `city emitted ${batch.count()} boxes, which is too heavy`);
});

test('road column tests agree with the road list', () => {
  const { network } = buildCity();
  const verticals = network.roads.filter((r) => r.axis === 'v').sort((a, b) => a.pos - b.pos);
  assert.ok(verticals.length >= 2, 'need at least two north-south roads to probe a gap');

  assert.ok(isRoadColumn(verticals[0].pos, 50, network), 'a road centre should read as road');

  // Probe the midpoint between two north-south roads, at a z that is clear of
  // every east-west road so only the vertical roads are under test.
  const mid = Math.floor((verticals[0].pos + verticals[1].pos) / 2);
  const clearZ = (() => {
    const h = network.roads.filter((r) => r.axis === 'h');
    for (let z = 20; z < 140; z += 1) {
      if (!h.some((r) => Math.abs(z - r.pos) <= r.width / 2)) return z;
    }
    return -1;
  })();
  assert.ok(clearZ > 0, 'need a z that avoids every east-west road');
  assert.ok(!isRoadColumn(mid, clearZ, network), `the gap at x=${mid}, z=${clearZ} should not read as road`);
});