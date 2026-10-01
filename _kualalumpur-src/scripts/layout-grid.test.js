import assert from 'node:assert/strict';
import { test } from 'node:test';
import { blockRect, cellZone, districtFor } from '../src/world/layout/streetGrid.js';
import { CollisionMap } from '../src/world/layout/collision.js';
import { createBlockPlan } from '../src/world/layout/cityBlocks.js';

test('street grid classifies streets, blocks and countryside', () => {
  assert.equal(cellZone(0, 0), 'street', 'street centre should be a street cell');
  assert.equal(cellZone(12, 12), 'block', 'block interior should be a block cell');
  assert.equal(cellZone(240, 0), 'country', 'outside the city should be countryside');
  assert.equal(cellZone(2, 0), 'street', 'sidewalk band belongs to the street corridor');

  const rect = blockRect(0, 0);
  assert.equal(rect.x0, 3);
  assert.equal(rect.x1, 20);
  assert.equal(rect.x1 - rect.x0 + 1, 18, 'blocks should be 18 units wide');
});

test('districts ring outward from the downtown core', () => {
  assert.equal(districtFor(8, 6), 'downtown');
  assert.equal(districtFor(8, 80), 'midtown');
  assert.equal(districtFor(8, 120), 'urban');
  assert.equal(districtFor(8, 200), 'suburb');
});

test('block plan covers the city and reserves landmark plots', () => {
  const reservation = { x0: -20, z0: -20, x1: 20, z1: 20, padding: 0, style: 'clear' };
  const plan = createBlockPlan([reservation]);
  assert.equal(plan.size, 14 * 14, 'city core should contain 196 blocks');

  const allowed = new Set(['tower', 'midrise', 'lowrise', 'shophouse', 'kampung', 'park', 'plaza', 'parking', 'clear']);
  for (const entry of plan.values()) {
    assert.ok(allowed.has(entry.style), `unexpected block style ${entry.style}`);
  }

  assert.equal(plan.get('0_0').style, 'clear', 'blocks inside a reserved plot must not be built on');
  const built = [...plan.values()].filter((entry) => entry.style !== 'clear' && entry.style !== 'park');
  assert.ok(built.length > 40, 'most unreserved blocks should be buildable');
});

test('collision map blocks building footprints', () => {
  const collision = new CollisionMap(-50, 50);
  collision.addRect(4, 4, 6, 6);
  assert.equal(collision.isBlocked(5, 5), true);
  assert.equal(collision.isBlocked(9.4, 9.4), true);
  assert.equal(collision.isBlocked(10, 10), false);
  assert.equal(collision.isAreaClear(12, 12, 1), true);
  assert.equal(collision.isAreaClear(4, 4, 1), false);
});
