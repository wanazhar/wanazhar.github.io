import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const hud = readFileSync(new URL('../src/ui/Hud.js', import.meta.url), 'utf8');
const assetRegistry = readFileSync(new URL('../src/assets/AssetRegistry.js', import.meta.url), 'utf8');

test('Vite app is configured for GitHub Pages endlessrunner subpath', () => {
  assert.match(viteConfig, /base:\s*['"]\/endlessrunner\/['"]/, 'Vite base should target /endlessrunner/');
  assert.match(viteConfig, /outDir:\s*['"]\.\.\/endlessrunner['"]/, 'build output should target ../endlessrunner');
  assert.match(viteConfig, /emptyOutDir:\s*true/, 'build should replace only the endlessrunner route output');
});

test('endless runner v5 source remains maintainable and runnable', () => {
  assert.equal(packageJson.name, 'endless-runner', 'package should use the public app name');
  assert.equal(packageJson.version, '5.0.0');
  assert.equal(packageJson.type, 'module');
  assert.ok(packageJson.dependencies.three, 'Three dependency should be declared');
  assert.ok(packageJson.dependencies.gsap, 'GSAP dependency should be declared');
  assert.match(main, /new Game\(/, 'main entry should bootstrap Game');
});

test('HTML exposes v5 compact HUD, settings drawer, theme, score, and power-up controls', () => {
  assert.match(indexHtml, /<title>Endless Runner v5<\/title>/, 'page title should identify v5');
  assert.match(indexHtml, /id="game-canvas"/, 'game canvas should be present');
  assert.match(indexHtml, /settings-drawer/, 'settings drawer should be present');
  assert.match(indexHtml, /data-start-button/, 'start button should be present');
  assert.match(indexHtml, /data-theme-button="anime"/, 'anime theme switcher should be present');
  assert.match(indexHtml, /data-high-score-value/, 'high score HUD should be present');
  assert.match(indexHtml, /data-reset-scores-button/, 'reset scores control should be present');
  assert.match(indexHtml, /data-swipe-threshold/, 'swipe sensitivity control should be present');
  assert.match(indexHtml, /data-powerups[^>]*aria-live="polite"/, 'power-up HUD should be aria-live');
  assert.match(hud, /Endless Runner v5/, 'HUD overlay should identify v5');
});

test('v5 anime art assets are registered from public assets', () => {
  for (const asset of ['anime-face.svg', 'anime-bow.svg', 'anime-skirt.svg', 'anime-emblem.svg', 'anime-bus-decal.svg', 'anime-gate-charm.svg', 'anime-power-magnet.svg', 'anime-power-jet.svg', 'anime-power-shield.svg', 'anime-power-2x.svg']) {
    assert.match(assetRegistry, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${asset} should be referenced by AssetRegistry`);
  }
});
