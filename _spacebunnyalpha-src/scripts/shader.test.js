// The anime shader is assembled as GLSL template strings. Nothing in the JS
// test suite parses it, so a stray JavaScript object literal pasted into the
// uniform block compiled to nothing at all and every surface in the world
// silently stopped drawing -- the scene rendered as sky with a character
// floating in it. The build stayed green and all 108 existing tests stayed
// green while the game showed nothing but sky.
//
// The guard is deliberately cheap: check the GLSL is shaped like GLSL, not
// like JavaScript, and check the day-cycle arithmetic keeps its invariants.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { AnimeMaterialFactory } from '../src/render/AnimeMaterial.js';
import {
  dayCycle,
  normaliseToUnitBrightness,
  rimFor,
  sceneExposure
} from '../src/render/SkySystem.js';

function shadersFrom() {
  const factory = new AnimeMaterialFactory();
  const material = factory.get('buildingWall', { color: 0xffffff });
  return { vertex: material.vertexShader, fragment: material.fragmentShader };
}

test('GLSL uniform blocks contain no JavaScript object literals', () => {
  const { vertex, fragment } = shadersFrom();

  for (const [name, src] of [['vertex', vertex], ['fragment', fragment]]) {
    // `uFoo: { value: 1.0 };` is JavaScript, not GLSL. It is the exact shape
    // of a bad edit, and GLSL reports it only as a bare "syntax error" with no
    // hint that a JavaScript object ended up in the middle of the shader.
    assert.equal(
      /^\s*u[A-Z]\w*\s*:\s*\{/m.test(src),
      false,
      `${name} shader contains a JavaScript object literal inside its GLSL`
    );
  }
});

test('every uniform the shader declares is also supplied by the factory', () => {
  const { fragment } = shadersFrom();
  const declared = [...fragment.matchAll(/^\s*uniform\s+\w+\s+(\w+)\s*;/gm)].map(
    (m) => m[1]
  );

  assert.ok(declared.length > 5, 'expected the fragment shader to declare uniforms');

  const material = shadersFrom && new AnimeMaterialFactory().get('buildingWall');

  for (const name of declared) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(material.uniforms, name),
      `shader declares uniform ${name} but the material supplies no value for it`
    );
  }
});

test('no uniform value is undefined or NaN', () => {
  const material = new AnimeMaterialFactory().get('buildingWall', { color: 0xffffff });

  for (const [name, uniform] of Object.entries(material.uniforms)) {
    assert.notEqual(uniform.value, undefined, `uniform ${name} has no value`);
    if (typeof uniform.value === 'number') {
      assert.equal(Number.isNaN(uniform.value), false, `uniform ${name} is NaN`);
    }
  }
});

test('the shadow floor keeps night readable instead of going black', () => {
  // Multiplying base colour by the raw night ambient drove grass to lightness
  // 0.14 -- a near-black cold cast that looked like a horror film. The floor,
  // plus tinting the ambient instead of multiplying by it, is what stops that.
  const material = new AnimeMaterialFactory().get('grass', { color: 0x7fbf4a });
  const { uShadowFloor, uTintAmount } = material.uniforms;

  assert.ok(
    uShadowFloor.value >= 0.5,
    `shadow floor ${uShadowFloor.value} is low enough to crush night into black`
  );
  assert.ok(
    uTintAmount.value > 0 && uTintAmount.value < 1,
    'the ambient should tint shadows rather than replace them'
  );
});

test('the key light never points below the horizon', () => {
  // With the sun set, a downward light vector makes every upward-facing
  // surface read as back-facing, so the town renders as a flat dark slab with
  // the character floating in mid-air.
  for (let hour = 0; hour < 24; hour += 1) {
    const { dir } = dayCycle(hour);
    assert.ok(
      dir.y > 0,
      `at ${hour}:00 the key light points below the horizon (y=${dir.y.toFixed(3)})`
    );
  }
});

test('sun elevation still peaks at midday and troughs at midnight', () => {
  const noon = dayCycle(12).elevation;
  const midnight = dayCycle(0).elevation;

  assert.ok(noon > 0.9, `noon elevation ${noon} should be near its peak`);
  assert.ok(midnight < 0, `midnight elevation ${midnight} should be below the horizon`);
});

test('normalising to unit brightness caps every channel at 1', () => {
  // HSL lightness is a poor brightness measure for a saturated colour: using
  // it pushed a deep blue's channel to 1.45 and the scene came out lurid.
  const cases = [0x546185, 0x324064, 0xfff6e5, 0x263e60, 0x000000];

  for (const hex of cases) {
    const colour = { r: ((hex >> 16) & 255) / 255, g: ((hex >> 8) & 255) / 255, b: (hex & 255) / 255 };
    colour.multiplyScalar = (k) => {
      colour.r *= k;
      colour.g *= k;
      colour.b *= k;
    };

    normaliseToUnitBrightness(colour);

    for (const channel of ['r', 'g', 'b']) {
      assert.ok(
        colour[channel] <= 1.0001,
        `#${hex.toString(16)} channel ${channel} is ${colour[channel]}, above 1`
      );
      assert.equal(Number.isNaN(colour[channel]), false, `#${hex.toString(16)} went NaN`);
    }
  }
});

test('night dims and desaturates together, but stays readable', () => {
  // Dimming without desaturating left the ground fully chromatic at midnight,
  // which reads as an overcast afternoon rather than as night.
  const day = sceneExposure(dayCycle(13).elevation);
  const night = sceneExposure(dayCycle(23).elevation);

  assert.ok(night.lightStrength < day.lightStrength, 'night should be dimmer than midday');
  assert.ok(night.saturation < day.saturation, 'night should be less saturated than midday');
  assert.ok(
    night.lightStrength >= 0.5,
    `night light ${night.lightStrength} is too dark to navigate`
  );
  assert.ok(night.saturation >= 0.4, `night saturation ${night.saturation} is too grey`);
});

test('rim light stays low enough not to blow surfaces out to white', () => {
  // Rim is added on top of everything else. At night the surface underneath is
  // already dim, so a rim tuned for daylight clips: every wall in a suburb row
  // became a featureless white blob.
  for (let daylight = 0; daylight <= 1.0001; daylight += 0.1) {
    const rim = rimFor(daylight);
    assert.ok(
      rim <= 0.35,
      `rim ${rim.toFixed(2)} at daylight ${daylight.toFixed(1)} is high enough to clip`
    );
    assert.ok(rim > 0, 'rim should not be fully disabled');
  }
});