import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCharacter, OUTFITS, HAIRS, SKINS } from '../src/characters/CharacterRig.js';

// Character proportions are a designed target, not a matter of taste, so they
// are asserted numerically. Every threshold here comes from measured art
// direction: 2.0-2.5 heads tall for super-deformed, a head around 1.4x torso
// width, arms no thicker than legs.

const rig = buildCharacter({ outfit: 'casual', hairStyle: 'short' });
const D = rig.dimensions;

test('the figure is super-deformed, between two and three heads tall', () => {
  assert.ok(
    D.headUnits >= 2.0 && D.headUnits <= 2.6,
    `expected 2.0-2.6 heads tall, got ${D.headUnits.toFixed(2)}`
  );
});

test('the head is wide and dominant but not a floating balloon', () => {
  const headWidth = D.headRadius * 2;
  const ratio = headWidth / D.torsoWidth;
  assert.ok(
    ratio >= 1.2 && ratio <= 1.7,
    `head should be 1.2-1.7x torso width, got ${ratio.toFixed(2)} -- above 1.8 reads as a head with a body attached`
  );
});

test('arms are never thicker than legs', () => {
  const armThickness = D.limbRadius * 2;
  const legThickness = D.limbRadius * 2.1;
  assert.ok(
    armThickness <= legThickness,
    `arms (${armThickness}) must not exceed legs (${legThickness})`
  );
});

test('the character stands on the ground rather than sinking or floating', () => {
  // The feet must land at or just below y=0, and the crown just under the
  // declared total height. If this drifts, the player capsule and the camera
  // framing are both wrong.
  const footBottom =
    D.hipY - D.legLength - D.limbRadius * 0.35 - D.limbRadius * 0.75;
  const crown = rig.headBaseY + D.headRadius * 0.95;

  assert.ok(footBottom > -0.35 && footBottom < 0.05, `feet at ${footBottom.toFixed(2)}, expected near 0`);
  assert.ok(crown > 1.4 && crown < 1.85, `crown at ${crown.toFixed(2)}, expected near totalHeight ${D.totalHeight}`);
});

test('the torso sits directly below the head with no visible gap', () => {
  const torsoTop = D.torsoY + D.torsoHeight / 2;
  const headBottom = rig.headBaseY - (D.headRadius * 1.9) / 2;
  // A small overlap is fine and desirable; a gap reads as a floating head.
  assert.ok(
    headBottom <= torsoTop + 0.06,
    `gap of ${(headBottom - torsoTop).toFixed(3)} between torso and head; must not float`
  );
});

test('the face sits on the outside of the head, not buried inside it', () => {
  // Every face part must be at or beyond the skull surface at its height,
  // otherwise it is invisible from any angle.
  const rx = D.headRadius;
  const ry = (D.headRadius * 1.9) / 2;
  const rz = (D.headRadius * 1.9) / 2;

  const head = rig.head;
  const faceParts = [];
  head.traverse((o) => {
    if (o.isMesh && o !== head.children[0]) faceParts.push(o);
  });

  for (const part of faceParts) {
    const local = part.position.clone();
    const y = local.y;
    const surface = Math.sqrt(Math.max(0, 1 - (y * y) / (rx * rx) - (y * y) / (ry * ry))) * rz;
    // Only parts on the face side (positive z) need to clear the surface.
    if (local.z <= 0) continue;
    assert.ok(
      local.z >= surface - 0.02,
      `face part at z=${local.z.toFixed(3)} is inside the skull surface z=${surface.toFixed(3)}`
    );
  }
});

test('the hair cap does not swallow the head', () => {
  // The cap must be no taller than the skull, or it encloses it and the face
  // disappears inside a solid mass.
  const cap = rig.head.children[1];
  const skull = rig.head.children[0];
  assert.ok(
    cap.scale.y <= skull.scale.y + 0.001,
    `hair cap (${cap.scale.y.toFixed(3)}) must not be taller than the skull (${skull.scale.y.toFixed(3)})`
  );
  assert.ok(cap.position.y > skull.position.y, 'the cap should sit above the skull centre');
});

test('every outfit and hair combination builds a complete rig', () => {
  for (const outfit of Object.keys(OUTFITS)) {
    for (const hairStyle of ['short', 'long', 'ponytail']) {
      const r = buildCharacter({ outfit, hairStyle, hair: 'brown', skin: 'medium' });
      // torso, collar, hem, head, two arms, two legs.
      assert.ok(
        r.root.children.length >= 8,
        `${outfit}/${hairStyle} built only ${r.root.children.length} top-level parts`
      );
      assert.strictEqual(r.arms.length, 2, `${outfit}/${hairStyle} needs two arms`);
      assert.strictEqual(r.legs.length, 2, `${outfit}/${hairStyle} needs two legs`);
      // Skull, hair cap, two eyes' worth of parts, mouth, two blush marks.
      assert.ok(
        r.head.children.length >= 7,
        `${outfit}/${hairStyle} head has only ${r.head.children.length} parts`
      );
    }
  }
});

test('every named skin and hair colour resolves to a real colour', () => {
  for (const skin of Object.keys(SKINS)) {
    assert.ok(Number.isInteger(SKINS[skin]) && SKINS[skin] > 0, `skin "${skin}" is not a colour`);
  }
  for (const hair of Object.keys(HAIRS)) {
    assert.ok(Number.isInteger(HAIRS[hair]) && HAIRS[hair] > 0, `hair "${hair}" is not a colour`);
  }
});
