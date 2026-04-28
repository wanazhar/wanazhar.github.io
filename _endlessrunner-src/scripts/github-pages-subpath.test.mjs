import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('Vite app is configured for GitHub Pages endlessrunner subpath', () => {
  assert.match(viteConfig, /base:\s*['"]\.\/['"]/, 'Vite base should use relative assets for /endlessrunner/');
  assert.match(viteConfig, /outDir:\s*['"]\.\.\/endlessrunner['"]/, 'build output should target ../endlessrunner');
  assert.match(viteConfig, /emptyOutDir:\s*true/, 'build should replace only the endlessrunner route output');
});

test('endless runner source remains maintainable and runnable', () => {
  assert.equal(packageJson.name, 'endless-runner', 'package should use the public app name');
  assert.equal(packageJson.type, 'module');
  assert.ok(packageJson.dependencies.three, 'Three dependency should be declared');
  assert.ok(packageJson.dependencies.gsap, 'GSAP dependency should be declared');
  assert.match(main, /new Game\(/, 'main entry should bootstrap Game');
});

test('HTML exposes the endless runner canvas and start action', () => {
  assert.match(indexHtml, /id="game-canvas"/, 'game canvas should be present');
  assert.match(indexHtml, /data-action="start"/, 'start action should be present');
  assert.match(indexHtml, /data-action="swipe-threshold"/, 'v2 swipe sensitivity control should be present for touch tuning');
});
