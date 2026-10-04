import test from 'node:test';
import assert from 'node:assert/strict';
import { collectMetrics, validate, BUDGET } from './validate-budget.js';
import { PALETTE } from '../src/world/Palette.js';

test('the world stays inside its declared budget', () => {
  const metrics = collectMetrics();
  const failures = validate(metrics);
  assert.deepStrictEqual(failures, [], `world exceeded budget:\n${failures.join('\n')}`);
});

test('every material the world emits exists in the palette', () => {
  const metrics = collectMetrics();
  assert.deepStrictEqual(metrics.unknownMaterials, [], 'the instancer would throw on an unknown material');
});

test('the budget validator actually rejects an oversized world', () => {
  // A metrics object far past every ceiling must fail, otherwise the guard
  // would silently pass anything.
  const absurd = {
    staticBoxes: BUDGET.maxStaticBoxes + 1,
    staticMaterials: 0,
    terrainBoxes: 0,
    terrainMaterials: 0,
    totalInstances: 0,
    approxDrawCalls: 0,
    collisionCells: 0,
    planMs: 0,
    unknownMaterials: []
  };
  const failures = validate(absurd);
  assert.ok(failures.length > 0, 'an oversized world should be rejected');
  assert.match(failures.join(' '), /static boxes/);
});

test('the budget validator rejects an unknown material', () => {
  const metrics = collectMetrics();
  const broken = { ...metrics, unknownMaterials: ['not_a_material'] };
  const failures = validate(broken);
  assert.ok(failures.some((f) => f.includes('not_a_material')), 'an unknown material should be reported');
});

test('the palette is large enough to cover what the world needs', () => {
  const metrics = collectMetrics();
  assert.ok(
    Object.keys(PALETTE).length >= metrics.staticMaterials + metrics.terrainMaterials,
    'the palette should cover every material in use'
  );
});