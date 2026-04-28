import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const game = readFileSync(new URL('../src/core/Game.js', import.meta.url), 'utf8');
const uiManager = readFileSync(new URL('../src/ui/UIManager.js', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('Vite app is configured for GitHub Pages emir subpath', () => {
  assert.match(viteConfig, /base:\s*['"]\/emir\/['"]/, 'Vite base should target /emir/');
  assert.match(viteConfig, /outDir:\s*['"]\.\.\/emir['"]/, 'build output should target ../emir');
  assert.match(viteConfig, /emptyOutDir:\s*true/, 'build should replace only the emir route output');
});

test('Emir Car World source remains maintainable and runnable', () => {
  assert.equal(packageJson.name, 'emir-car-world');
  assert.equal(packageJson.type, 'module');
  assert.match(packageJson.description, /Emir’s Car World/, 'package description should use the public game name');
  assert.ok(packageJson.dependencies.three, 'Three dependency should be declared');
  assert.ok(packageJson.dependencies['@dimforge/rapier3d-compat'], 'Rapier dependency should be declared');
  assert.match(main, /new Game\(/, 'main entry should bootstrap Game');
  assert.match(game, /VehicleManager/, 'game should wire the vehicle manager');
});

test('HTML and public game assets are present', () => {
  assert.match(indexHtml, /<title>Emir’s Car World<\/title>/, 'page title should identify the game');
  assert.match(indexHtml, /id="app"/, 'app host should be present');
  assert.ok(existsSync(new URL('../public/data/city-blocks.json', import.meta.url)), 'city block data should be present');
  for (const vehicle of ['sedan', 'hatchback', 'offroader', 'truck', 'excavator']) {
    assert.ok(existsSync(new URL(`../public/models/vehicles/${vehicle}.glb`, import.meta.url)), `${vehicle} GLB should be present`);
  }
});

test('UI overlays start hidden with a visible toggle and correct public name', () => {
  assert.match(uiManager, /this\.hidden\s*=\s*true/, 'overlays should be hidden by default');
  assert.match(uiManager, /data-action="toggle-ui"/, 'a visible overlay toggle should be rendered');
  assert.match(uiManager, /Emir’s Car World/, 'UI should show the exact public game name');
  assert.doesNotMatch(uiManager, new RegExp(['Voxel', 'Kuala', 'Lumpur'].join(' ')), 'old heading should not appear in UI');
  assert.doesNotMatch(uiManager, new RegExp(['Instanced', 'OSM', 'voxel', 'chunks'].join(' ')), 'old technical map copy should not appear in UI');
  assert.match(styles, /\.hidden-ui \.ui-overlay/, 'hidden state should target bulky overlays');
  assert.doesNotMatch(styles, /\.hidden-ui[^\n]*\.touch-pad/, 'touch driving controls should not be hidden by the overlay state');
});
