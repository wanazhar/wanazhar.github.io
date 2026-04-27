import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const player = readFileSync(new URL('../src/characters/PlayerController.js', import.meta.url), 'utf8');
const renderer = readFileSync(new URL('../src/render/AdaptiveRenderer.js', import.meta.url), 'utf8');
const detailLayer = readFileSync(new URL('../src/world/detail/GeneratedDetailLayer.js', import.meta.url), 'utf8');
const world = readFileSync(new URL('../src/world/createKualaLumpurWorld.js', import.meta.url), 'utf8');

test('player focus has a visible locator and elevated camera target to avoid building occlusion', () => {
  assert.match(player, /createPlayerLocator\s*\(/, 'player should have a dedicated locator/halo');
  assert.match(player, /depthTest:\s*false/, 'locator should render through occluding architecture');
  assert.match(player, /renderOrder\s*=\s*\d+/, 'locator should render after normal world geometry');
  assert.match(player, /getFocusTarget\s*\(/, 'player should expose an elevated focus target');
  assert.match(main, /player\.getFocusTarget\(\)/, 'camera focus should use elevated player focus target');
  assert.match(main, /placeCameraNear\(playerTarget,\s*\{[^}]*heightRatio:\s*1\.05/s, 'walk camera should use a steeper elevated angle');
});

test('low-end renderer keeps crisp voxel pixel quality while 350k cap handles FPS', () => {
  assert.match(renderer, /antialias:\s*true/, 'do not disable antialiasing on touch/low-end if visible cap already protects FPS');
  assert.doesNotMatch(renderer, /0\.78/, 'old low-end pixel-ratio clamp should not remain');
  assert.match(renderer, /this\.pixelRatio\s*=\s*Math\.min\(window\.devicePixelRatio \|\| 1, this\.lowEndMode \? 1 : 1\.25\)/, 'low-end should start at crisp 1x DPR');
  assert.match(renderer, /this\.minPixelRatio\s*=\s*this\.lowEndMode \? 0\.72 : 0\.62/, 'low-end may adapt down, but not to blurry 0.5 unless explicitly changed');
  assert.match(renderer, /this\.maxPixelRatio\s*=\s*Math\.min\(window\.devicePixelRatio \|\| 1, this\.lowEndMode \? 1\.25 : 1\.5\)/, 'low-end can recover above 1x on capable devices');
});

test('generated terrain is more building-dense and less empty grass', () => {
  assert.match(detailLayer, /function sampleUrbanUse\s*\(/, 'detail layer should classify samples as urban buildings, roads, or small accents');
  assert.match(detailLayer, /return 'glassDark';/, 'glass towers should be a primary generated use');
  assert.match(detailLayer, /return 'concrete';/, 'concrete mid-rise buildings should be a primary generated use');
  assert.match(detailLayer, /roll < 0\.035/, 'grass/void samples should be rare, not a dominant generated material');
  assert.match(world, /function addDenseUrbanInfill\s*\(/, 'base world should add deterministic infill around road grids');
  assert.match(world, /addSection\('denseUrbanInfill'/, 'infill should be part of the authored world build');
});
