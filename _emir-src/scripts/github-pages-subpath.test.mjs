import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const game = readFileSync(new URL('../src/core/Game.js', import.meta.url), 'utf8');

test('Vite app is configured for GitHub Pages emir subpath', () => {
  assert.match(viteConfig, /base:\s*['"]\/emir\/['"]/, 'Vite base should target /emir/');
  assert.match(viteConfig, /outDir:\s*['"]\.\.\/emir['"]/, 'build output should target ../emir');
  assert.match(viteConfig, /emptyOutDir:\s*true/, 'build should replace only the emir route output');
});

test('Emir Car World source remains maintainable and runnable', () => {
  assert.equal(packageJson.name, 'emir-car-world');
  assert.equal(packageJson.type, 'module');
  assert.ok(packageJson.dependencies.three, 'Three dependency should be declared');
  assert.ok(packageJson.dependencies['@dimforge/rapier3d-compat'], 'Rapier dependency should be declared');
  assert.match(main, /new Game\(/, 'main entry should bootstrap Game');
  assert.match(game, /VehicleManager/, 'game should wire the vehicle manager');
});

test('HTML and public game assets are present', () => {
  assert.match(indexHtml, /<title>Emir's Car World<\/title>/, 'page title should identify the game');
  assert.match(indexHtml, /id="app"/, 'app host should be present');
  assert.ok(existsSync(new URL('../public/data/kl-voxels.json', import.meta.url)), 'KL voxel data should be present');
  for (const vehicle of ['sedan', 'hatchback', 'offroader', 'truck', 'excavator']) {
    assert.ok(existsSync(new URL(`../public/models/vehicles/${vehicle}.glb`, import.meta.url)), `${vehicle} GLB should be present`);
  }
});
