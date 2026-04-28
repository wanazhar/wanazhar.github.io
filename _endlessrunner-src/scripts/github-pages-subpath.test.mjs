import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('Vite app is configured for GitHub Pages endlessrunner subpath', () => {
  assert.match(viteConfig, /base:\s*['"]\/endlessrunner\/['"]/, 'Vite base should target /endlessrunner/');
  assert.match(viteConfig, /outDir:\s*['"]\.\.\/endlessrunner['"]/, 'build output should target ../endlessrunner');
  assert.match(viteConfig, /emptyOutDir:\s*true/, 'build should replace only the endlessrunner route output');
});

test('endless runner v3 source remains maintainable and runnable', () => {
  assert.equal(packageJson.name, 'endless-runner', 'package should use the public app name');
  assert.equal(packageJson.version, '3.0.0');
  assert.equal(packageJson.type, 'module');
  assert.ok(packageJson.dependencies.three, 'Three dependency should be declared');
  assert.ok(packageJson.dependencies.gsap, 'GSAP dependency should be declared');
  assert.match(main, /new Game\(/, 'main entry should bootstrap Game');
});

test('HTML exposes the endless runner canvas, start action, and v3 power-up HUD', () => {
  assert.match(indexHtml, /id="game-canvas"/, 'game canvas should be present');
  assert.match(indexHtml, /data-action="start"/, 'start action should be present');
  assert.match(indexHtml, /data-action="swipe-threshold"/, 'swipe sensitivity control should be present for touch tuning');
  assert.match(indexHtml, /data-hud="powerups"/, 'v3 power-up HUD should be present');
});
