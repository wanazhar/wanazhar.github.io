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

test('city is laid out on a street grid instead of scattered random buildings', () => {
  assert.match(world, /createBlockPlan\s*\(/, 'world should plan city blocks on a street grid');
  assert.match(world, /fillCityBlocks\s*\(/, 'blocks should be filled from the plan');
  assert.match(world, /addStreetMarkings\s*\(/, 'streets should carry lane markings');
  assert.match(world, /registerLandmarkCollision\s*\(/, 'landmark structures should register collision volumes');
  assert.match(world, /new CollisionMap\s*\(/, 'world should expose a building collision map');
  assert.doesNotMatch(world, /function addDenseUrbanInfill\s*\(/, 'the random infill scatter should be gone');
  assert.doesNotMatch(world, /mulberry32\(2026/, 'layout randomness should come from deterministic block hashes');
});

test('generated detail is street furniture, not random building slabs', () => {
  assert.match(detailLayer, /function buildProp\s*\(/, 'detail layer should build street furniture props');
  assert.match(detailLayer, /SIDEWALK_OFFSET/, 'props should sit on the sidewalk band of the street grid');
  assert.match(detailLayer, /collectProps\s*\(/, 'props should be collected per chunk from the street grid');
  assert.match(detailLayer, /this\.collision\.isBlocked|isBlocked\(/, 'props should avoid building footprints');
  assert.doesNotMatch(detailLayer, /sampleUrbanUse/, 'the random urban sample classifier should be gone');
});
