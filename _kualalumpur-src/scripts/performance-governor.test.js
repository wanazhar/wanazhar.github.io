import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DetailPerformanceGovernor } from '../src/render/DetailPerformanceGovernor.js';

test('performance governor reduces cap quickly below playable FPS', () => {
  const governor = new DetailPerformanceGovernor({ maxBudget: 350_000, minBudget: 120_000, initialBudget: 350_000, cooldownMs: 0 });
  const result = governor.update({ fps: 18, now: 1000 });
  assert.equal(result.changed, true);
  assert.ok(result.budget < 350_000);
});

test('performance governor never increases beyond the 350k ceiling', () => {
  const governor = new DetailPerformanceGovernor({ maxBudget: 350_000, minBudget: 120_000, initialBudget: 340_000, cooldownMs: 0 });
  governor.update({ fps: 58, now: 1000 });
  governor.update({ fps: 61, now: 2000 });
  assert.equal(governor.budget, 350_000);
});
