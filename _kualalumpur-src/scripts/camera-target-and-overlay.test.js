import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

test('world visibility and generated detail follow camera target focus', () => {
  assert.match(main, /function getWorldFocusPosition\s*\(/, 'main should expose a single world-focus helper');
  assert.match(main, /world\.chunkManager\?\.update\(worldFocusPosition\)/, 'base chunks should update from camera/world focus');
  assert.match(main, /generatedDetailLayer\.update\(worldFocusPosition\)/, 'generated detail should update from camera/world focus');
  assert.doesNotMatch(main, /generatedDetailLayer\.update\(player\.group\.position\)/, 'detail generation should not be player-position only');
});

test('overlay uses mode dock with uncluttered panels', () => {
  assert.match(html, /id="mode-dock"/, 'bottom mode dock should exist');
  assert.match(html, /data-ui-mode="explore"/, 'explore mode button should exist');
  assert.match(html, /data-ui-mode="map"/, 'map mode button should exist');
  assert.match(html, /data-ui-mode="places"/, 'places mode button should exist');
  assert.match(html, /data-ui-mode="debug"/, 'debug mode button should exist');
  assert.match(html, /id="places-sheet"/, 'places should be a sheet instead of a permanently crowded panel');
  assert.match(html, /id="debug-sheet"/, 'debug stats should live behind a debug drawer');
  assert.match(css, /#mode-dock/, 'mode dock should be styled');
  assert.match(css, /\.mode-sheet/, 'mode sheets should be styled');
});
