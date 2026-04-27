import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GENERATED_DETAIL_VISIBLE_BUDGET } from '../src/world/detail/generatedDetailConfig.js';
import { DETAIL_BUDGETS, getDetailTier } from '../src/world/chunks/chunkVisibility.js';
import { ChunkManager } from '../src/world/chunks/ChunkManager.js';

test('all device tiers cap visible world at 350k instances', () => {
  assert.equal(GENERATED_DETAIL_VISIBLE_BUDGET, 350_000);
  for (const [tier, budget] of Object.entries(DETAIL_BUDGETS)) {
    assert.equal(budget.visibleInstanceCap, 350_000, `${tier} should use the same 350k visible cap`);
  }
});

test('base chunk visibility radius is tiered for performance', () => {
  assert.equal(DETAIL_BUDGETS.mobile.baseVisibleRadius, 3);
  assert.equal(DETAIL_BUDGETS.balanced.baseVisibleRadius, 5);
  assert.equal(DETAIL_BUDGETS.desktop.baseVisibleRadius, 8);
  assert.equal(new ChunkManager({ tier: 'mobile' }).visibleRadius, 3);
  assert.equal(new ChunkManager({ tier: 'balanced' }).visibleRadius, 5);
  assert.equal(new ChunkManager({ tier: 'desktop' }).visibleRadius, 8);
});

test('coarse pointer devices use the low-end mobile tier', () => {
  const environment = {
    navigator: { deviceMemory: 8 },
    matchMedia: (query) => ({ matches: query.includes('pointer: coarse') })
  };
  assert.equal(getDetailTier(environment), 'mobile');
});
