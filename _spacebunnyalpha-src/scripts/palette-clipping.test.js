// The anime shader adds rim light and a subsurface bleed on top of the lit
// term. That means a surface whose base colour is already near white clips: it
// renders as a featureless white blob with no shading at all.
//
// Every surface in a suburb row went this way at once, which made the whole
// district look like a pile of paper. The cure is to keep non-emissive
// surfaces below paper white -- emissive ones are meant to be bright, because
// they stand in for windows, lamps and signs.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { PALETTE } from '../src/world/Palette.js';
import { AnimeMaterialFactory } from '../src/render/AnimeMaterial.js';

const rgb = (hex) => [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];

// Perceptual lightness, the same measure the render analysis uses.
const lightness = (hex) => {
  const [r, g, b] = rgb(hex);
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255;
};

// Surfaces that are meant to be bright. They are their own light source.
const EMISSIVE = new Set([
  'windowLit',
  'lampGlass',
  'signWhite',
  'laneWhite',
  'foam',
  'sailCloth',
  'eyeWhite'
]);

// The brightest a non-emissive surface is allowed to be. Above roughly this
// the additive terms clip and the shading is lost.
const CEILING = 0.86;

test('no non-emissive surface is bright enough to clip', () => {
  const offenders = Object.entries(PALETTE)
    .filter(([name, hex]) => !EMISSIVE.has(name) && lightness(hex) > CEILING)
    .map(([name, hex]) => `${name} (#${hex.toString(16)}) L=${lightness(hex).toFixed(2)}`);

  assert.deepEqual(offenders, [], `surfaces too bright to shade: ${offenders.join(', ')}`);
});

test('every palette colour is a real colour', () => {
  for (const [name, hex] of Object.entries(PALETTE)) {
    assert.ok(Number.isInteger(hex), `${name} is not an integer colour`);
    assert.ok(hex >= 0 && hex <= 0xffffff, `${name} is outside the 24-bit range`);
  }
});

test('emissive surfaces stay lit while their surroundings dim', () => {
  // At night the walls drop to 0.62 brightness, but the shader holds glowing
  // materials at full strength whatever the hour -- they are their own light
  // source, exactly as a real window or street lamp is.
  //
  // That gap, not the raw palette ratio, is what makes a lit window read as lit.
  // Without the immunity the whole town goes black at night.
  const wall = new AnimeMaterialFactory().get('buildingWall', {
    color: PALETTE.buildingWall
  });
  const window = new AnimeMaterialFactory().get('windowLit', {
    color: PALETTE.windowLit
  });

  assert.ok(
    window.uniforms.uLightStrength.value === 1,
    'lit windows should ignore the day/night light strength'
  );
  assert.ok(
    wall.uniforms.uLightStrength.value === 1,
    'walls start at full strength and are dimmed per frame by the sky'
  );

  const NIGHT = 0.62;
  const nightWallL = lightness(PALETTE.buildingWall) * NIGHT;
  const nightWindowL = lightness(PALETTE.windowLit);

  assert.ok(
    nightWindowL > nightWallL * 1.5,
    `at night a lit window (L=${nightWindowL.toFixed(2)}) should stand well clear of the wall (L=${nightWallL.toFixed(2)})`
  );
});