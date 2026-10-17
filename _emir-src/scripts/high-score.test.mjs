import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { nextHighScore } from '../src/services/highScore.js';

const garageStore = readFileSync(new URL('../src/services/GarageStore.js', import.meta.url), 'utf8');
const uiManager = readFileSync(new URL('../src/ui/UIManager.js', import.meta.url), 'utf8');

test('a worse run never lowers the persisted high score', () => {
  assert.equal(nextHighScore(120, 40), 120, 'a lower run must not win');
  assert.equal(nextHighScore(40, 120), 120, 'a higher run must replace');
  assert.equal(nextHighScore(40, 40), 40, 'a tie is a tie');
  assert.equal(nextHighScore(0, 0), 0, 'a first save of zero is still a save');
});

test('missing or broken values cannot poison the high score', () => {
  assert.equal(nextHighScore(undefined, 12.6), 13, 'absent stored value starts at zero, current run rounds');
  assert.equal(nextHighScore(null, 7), 7, 'localStorage may hand back null');
  assert.equal(nextHighScore('80', 20), 80, 'a stringified stored value still counts');
  assert.equal(nextHighScore(50, NaN), 50, 'NaN must not become the high score');
  assert.equal(nextHighScore(50, undefined), 50, 'an absent run must not become the high score');
});

test('the Save button score is wired to the persisted field', () => {
  assert.match(uiManager, /score: this\.game\.score/, 'Save still reports the run score');
  assert.match(garageStore, /nextHighScore\(/, 'GarageStore must turn the run score into the high score');
  assert.match(garageStore, /high_score: this\.state\.high_score \|\| 0/, 'the Supabase payload must carry high_score');
});
