import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const hud = readFileSync(new URL('../src/ui/Hud.js', import.meta.url), 'utf8');

test('Vite app is configured for GitHub Pages endlessrunner subpath', () => {
  assert.match(viteConfig, /base:\s*['"]\/endlessrunner\/['"]/, 'Vite base should target /endlessrunner/');
  assert.match(viteConfig, /outDir:\s*['"]\.\.\/endlessrunner['"]/, 'build output should target ../endlessrunner');
  assert.match(viteConfig, /emptyOutDir:\s*true/, 'build should replace only the endlessrunner route output');
});

test('endless runner v4 source remains maintainable and runnable', () => {
  assert.equal(packageJson.name, 'endless-runner', 'package should use the public app name');
  assert.equal(packageJson.version, '4.0.0');
  assert.equal(packageJson.type, 'module');
  assert.ok(packageJson.dependencies.three, 'Three dependency should be declared');
  assert.ok(packageJson.dependencies.gsap, 'GSAP dependency should be declared');
  assert.match(main, /new Game\(/, 'main entry should bootstrap Game');
});

test('HTML exposes v4 theme, high-score, start, touch, and power-up controls', () => {
  assert.match(indexHtml, /id="game-canvas"/, 'game canvas should be present');
  assert.match(indexHtml, /data-start-button/, 'start button should be present');
  assert.match(indexHtml, /data-theme-button="anime"/, 'anime theme switcher should be present');
  assert.match(indexHtml, /data-high-score-value/, 'high score HUD should be present');
  assert.match(indexHtml, /data-reset-scores-button/, 'reset scores control should be present');
  assert.match(indexHtml, /data-swipe-threshold/, 'swipe sensitivity control should be present');
  assert.match(indexHtml, /data-powerups/, 'power-up HUD should be present');
  assert.match(hud, /Endless Runner v4/, 'HUD overlay should identify v4');
});
