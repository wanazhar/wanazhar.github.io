import * as THREE from 'three';
import { shapeGeometry } from '../world/RoundedGeometry.js';

// Characters.
//
// The old rig was adult-proportioned boxes: roughly a 7-head figure with small
// eyes and a cube for a head. It read as a placeholder no matter how it was
// coloured. Cute-game characters are super-deformed, and the proportions carry
// most of the personality.
//
// The numbers below are measured rather than guessed. Anime face proportions
// from Rimsoft's artwork: eye span about 0.8x face width, eye height about 0.3x
// face height, eyes set in the upper-middle third. Chibi bodies: 1.5 to 2.5
// heads tall, head at least as wide as it is tall.
//
// So the head is roughly a third of total height rather than a seventh. That
// single change does more for "cute" than any amount of colour, and it is why
// the head is a squashed sphere: the Rimsoft blob silhouette is never a cube.

const SKINS = {
  light: 0xFFF6E5,
  medium: 0xF7CAAC,
  tan: 0xE0A888,
  deep: 0xB07850
};

const HAIRS = {
  black: 0x4A4450,
  brown: 0x9C6A44,
  blonde: 0xE0C090,
  blue: 0x8FD8F0,
  pink: 0xF39CCC,
  white: 0xE8E4EC,
  red: 0xD4513B
};

export const OUTFITS = {
  office: { top: 0x4A5060, bottom: 0x3A4054, accent: 0xFCF3D4 },
  casual: { top: 0x7FBF4A, bottom: 0x5A6484, accent: 0xFCF3D4 },
  school: { top: 0x5A6484, bottom: 0x3A4054, accent: 0xFCF3D4 },
  apron: { top: 0xFCF3D4, bottom: 0x8A90A4, accent: 0xD4513B },
  fisherman: { top: 0x4FA8E8, bottom: 0x3A5068, accent: 0xF5DC5E },
  farmer: { top: 0xDDC9A4, bottom: 0x8F6A47, accent: 0xD6C257 },
  shrinekeeper: { top: 0xD4513B, bottom: 0x9C2045, accent: 0xFCF3D4 },
  oldperson: { top: 0xA8AEBE, bottom: 0x6A7084, accent: 0xE8E4EC },
  shopkeeper: { top: 0xD4513B, bottom: 0x5A6484, accent: 0xFCF3D4 }
};

// Proportions in world units. totalHeight is a contract the rest of the game
// relies on: the player capsule, camera framing and collision all assume roughly
// this tall, so it must not drift between builds.
//
// The head is deliberately large. Measured targets: 2.0 to 2.5 heads tall puts
// a figure firmly in super-deformed territory, and a head about 1.4x the torso
// width reads as cute rather than as a baby with an adult's body. The first
// pass here used 1.83x, which is technically chibi but reads as a floating
// head with a body attached.
const P = {
  totalHeight: 1.75,
  headRadius: 0.4,
  torsoWidth: 0.54,
  torsoDepth: 0.36,
  torsoHeight: 0.62,
  limbRadius: 0.1,
  armLength: 0.4,
  legLength: 0.42
};

// Head height as a fraction of total height. This is the number that decides
// whether a figure reads as chibi or as an adult; ~2.2 heads is squarely
// super-deformed.
P.headUnits = P.totalHeight / (P.headRadius * 1.9);

let cachedGeometries = null;
function geometries() {
  if (!cachedGeometries) {
    cachedGeometries = {
      head: shapeGeometry('blob'),
      body: shapeGeometry('soft'),
      limb: shapeGeometry('soft'),
      foot: shapeGeometry('rounded'),
      accent: shapeGeometry('blob')
    };
  }
  return cachedGeometries;
}

// Builds one character rig. Returns the group, the pivots the animator drives,
// and the face parts so expressions can be changed at runtime.
export function buildCharacter({
  skin = 'light',
  hair = 'black',
  outfit = 'casual',
  hairStyle = 'short',
  scale = 1
} = {}) {
  const geo = geometries();

  const skinColor = typeof skin === 'number' ? skin : SKINS[skin] ?? SKINS.light;
  const hairColor = typeof hair === 'number' ? hair : HAIRS[hair] ?? HAIRS.black;
  const o = typeof outfit === 'string' ? OUTFITS[outfit] ?? OUTFITS.casual : outfit;

  const mat = (color, opts = {}) => new THREE.MeshLambertMaterial({ color, ...opts });

  const skinMat = mat(skinColor);
  const hairMat = mat(hairColor);
  const topMat = mat(o.top);
  const bottomMat = mat(o.bottom);
  const accentMat = mat(o.accent);
  const shoeMat = mat(0x3A3448);
  // The eyes are the darkest thing on the face. Rimsoft's line work is thin and
  // variable-weight, and the lash arc is the strongest single element: at small
  // on-screen size it is what makes a face legible.
  const eyeWhiteMat = mat(0xFFFFFF);
  const eyeMat = mat(0x2A2320);
  const blushMat = mat(0xF3A0A8, { transparent: true, opacity: 0.45 });

  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const H = P.totalHeight;
  const headR = P.headRadius;
  // Build upward from the feet rather than downward from the crown, so the
  // figure stands exactly on the ground. Placing the head first and stacking
  // down left the feet 0.24 units below y=0, which buried the legs.
  //
  // The total is then reconciled against totalHeight by scaling the crown gap,
  // so totalHeight stays the single source of truth for how tall a character is.
  const skullHalf = (P.headRadius * 1.9) / 2;
  const legDrop = P.limbRadius * 0.35 + (P.limbRadius * 1.5) / 2;
  const hipY = P.legLength + legDrop;
  const torsoY = hipY + P.torsoHeight / 2;
  const torsoTop = torsoY + P.torsoHeight / 2;
  // A small overlap between neck and skull keeps them visually joined.
  const neck = skullHalf * 0.62;
  let headY = torsoTop + neck;

  // Reconcile: if the crown overshoots totalHeight, pull the head down to sit.
  const crown = headY + skullHalf;
  if (crown > H) {
    headY -= crown - H;
  }

  // ---- torso: an egg. Inverted triangles read as aggressive, which is the
  // opposite of what this art direction wants.
  const torso = new THREE.Mesh(geo.body, topMat);
  torso.scale.set(P.torsoWidth, P.torsoHeight, P.torsoDepth);
  torso.position.set(0, torsoY, 0);
  root.add(torso);

  const collar = new THREE.Mesh(geo.body, accentMat);
  collar.scale.set(P.torsoWidth * 0.84, 0.13, P.torsoDepth * 0.9);
  collar.position.set(0, torsoY + P.torsoHeight * 0.44, 0);
  root.add(collar);

  const hem = new THREE.Mesh(geo.body, bottomMat);
  hem.scale.set(P.torsoWidth * 1.02, 0.2, P.torsoDepth * 1.04);
  hem.position.set(0, hipY + 0.08, 0);
  root.add(hem);

  // ---- head: a squashed sphere, wider than tall.
  const head = new THREE.Group();
  head.position.set(0, headY, 0);
  root.add(head);

  // The skull is an ellipsoid, so its surface curves away from the centre. Any
  // face part placed at a fixed fraction of the radius ends up *inside* it and
  // is invisible. These are the radii, and a helper that returns the surface z
  // at a given height: for an ellipsoid, z = c * sqrt(1 - (y/a)^2 - (y/b)^2).
  const rx = headR * 2 * 0.5;
  const ry = headR * 1.9 * 0.5;
  const rz = headR * 1.9 * 0.5;
  const surfaceZAt = (y) =>
    Math.sqrt(Math.max(0, 1 - (y * y) / (rx * rx) - (y * y) / (ry * ry))) * rz;

  const skull = new THREE.Mesh(geo.head, skinMat);
  skull.scale.set(headR * 2, headR * 1.9, headR * 1.9);
  skull.position.set(0, headR * 0.06, 0);
  head.add(skull);

  // Hair sits ON the skull, not around it. An earlier version scaled the cap
  // slightly larger than the head in every axis, which made it swallow the
  // skull whole: the face ended up inside a solid dark sphere and the head
  // rendered as a featureless cone. The cap now matches the head footprint and
  // is raised, so only the top and back are covered.
  const cap = new THREE.Mesh(geo.head, hairMat);
  cap.scale.set(headR * 2.02, headR * 1.72, headR * 2.0);
  cap.position.set(0, headR * 0.32, -headR * 0.06);
  head.add(cap);

  if (hairStyle === 'long') {
    // A bob either side plus a back mass, so the canopy has depth instead of
    // reading as one solid shape.
    for (const side of [-1, 1]) {
      const lock = new THREE.Mesh(geo.body, hairMat);
      lock.scale.set(0.15, headR * 1.6, 0.28);
      lock.position.set(side * headR * 0.85, -headR * 0.32, -headR * 0.12);
      head.add(lock);
    }
    const back = new THREE.Mesh(geo.body, hairMat);
    back.scale.set(headR * 1.86, headR * 1.6, 0.22);
    back.position.set(0, -headR * 0.18, -headR * 0.72);
    head.add(back);
  } else if (hairStyle === 'ponytail') {
    const tail = new THREE.Mesh(geo.body, hairMat);
    tail.scale.set(0.14, headR * 1.2, 0.14);
    tail.position.set(0, headR * 0.5, -headR * 0.98);
    tail.rotation.x = -0.35;
    head.add(tail);
    const tie = new THREE.Mesh(geo.accent, accentMat);
    tie.scale.set(0.17, 0.085, 0.17);
    tie.position.set(0, headR * 0.26, -headR * 0.92);
    head.add(tie);
  } else if (hairStyle === 'short') {
    // Fringe wedges across the brow, placed on the skull surface. Cheap, and
    // they stop the smooth cap from reading as a helmet.
    const fringeY = headR * 0.5;
    const fringeZ = Math.sqrt(Math.max(0, 1 - (fringeY * fringeY) / (rx * rx) - (fringeY * fringeY) / (ry * ry))) * rz;
    for (let i = -1; i <= 1; i += 1) {
      const fringe = new THREE.Mesh(geo.accent, hairMat);
      fringe.scale.set(0.15, 0.13, 0.08);
      fringe.position.set(i * headR * 0.42, fringeY, fringeZ * 0.96);
      fringe.rotation.x = -0.2;
      head.add(fringe);
    }
  }

  // ---- face. Every part is placed on the ellipsoid surface via surfaceZAt,
  // pushed slightly further forward so it clears the skin instead of
  // z-fighting with it.
  const eyeSpan = headR * 0.62;
  const eyeH = headR * 0.4;
  const eyeW = headR * 0.3;
  const eyeY = headR * 0.1;
  const eyeZ = surfaceZAt(eyeY) + 0.012;

  const eyes = [];
  for (const side of [-1, 1]) {
    const white = new THREE.Mesh(geo.accent, eyeWhiteMat);
    white.scale.set(eyeW, eyeH, 0.05);
    white.position.set(side * eyeSpan, eyeY, eyeZ);
    head.add(white);

    const iris = new THREE.Mesh(geo.accent, eyeMat);
    iris.scale.set(eyeW * 0.6, eyeH * 0.7, 0.04);
    iris.position.set(side * eyeSpan, eyeY, eyeZ + 0.03);
    head.add(iris);

    // The catchlight: the single brightest pixel in the face.
    const spark = new THREE.Mesh(geo.accent, eyeWhiteMat);
    spark.scale.set(eyeW * 0.24, eyeH * 0.28, 0.03);
    spark.position.set(side * eyeSpan - eyeW * 0.13, eyeY + eyeH * 0.22, eyeZ + 0.06);
    head.add(spark);

    const lash = new THREE.Mesh(geo.accent, eyeMat);
    lash.scale.set(eyeW * 1.05, eyeH * 0.18, 0.04);
    lash.position.set(side * eyeSpan, eyeY + eyeH * 0.44, eyeZ + 0.02);
    head.add(lash);

    eyes.push(white, iris, spark, lash);
  }

  const mouthY = -headR * 0.26;
  const mouth = new THREE.Mesh(geo.accent, eyeMat);
  mouth.scale.set(0.09, 0.045, 0.035);
  mouth.position.set(0, mouthY, surfaceZAt(mouthY) + 0.008);
  head.add(mouth);

  for (const side of [-1, 1]) {
    const blushY = -headR * 0.12;
    const blush = new THREE.Mesh(geo.accent, blushMat);
    blush.scale.set(0.13, 0.06, 0.02);
    blush.position.set(side * headR * 0.62, blushY, surfaceZAt(blushY) + 0.006);
    head.add(blush);
  }

  // ---- arms, pivoting at the shoulder. Arms must not be thicker than legs:
  // a cute-character rule that keeps the silhouette soft.
  const arms = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * (P.torsoWidth / 2 + P.limbRadius * 0.6), torsoY + P.torsoHeight * 0.34, 0);
    root.add(pivot);

    const upper = new THREE.Mesh(geo.limb, topMat);
    upper.scale.set(P.limbRadius * 2, P.armLength, P.limbRadius * 2);
    upper.position.set(0, -P.armLength / 2, 0);
    pivot.add(upper);

    const hand = new THREE.Mesh(geo.accent, skinMat);
    hand.scale.set(P.limbRadius * 2.2, P.limbRadius * 2.2, P.limbRadius * 2.2);
    hand.position.set(0, -P.armLength - P.limbRadius * 0.6, 0);
    pivot.add(hand);

    arms.push(pivot);
  }

  // ---- legs, pivoting at the hip
  const legs = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * P.torsoWidth * 0.24, hipY, 0);
    root.add(pivot);

    const leg = new THREE.Mesh(geo.limb, bottomMat);
    leg.scale.set(P.limbRadius * 2.1, P.legLength, P.limbRadius * 2.1);
    leg.position.set(0, -P.legLength / 2, 0);
    pivot.add(leg);

    const shoe = new THREE.Mesh(geo.foot, shoeMat);
    shoe.scale.set(P.limbRadius * 2.6, P.limbRadius * 1.5, P.limbRadius * 3.2);
    shoe.position.set(0, -P.legLength - P.limbRadius * 0.35, 0.04);
    pivot.add(shoe);

    legs.push(pivot);
  }

  return {
    root,
    head,
    headBaseY: headY,
    torso,
    hem,
    collar,
    arms,
    legs,
    eyes,
    mouth,
    materials: [skinMat, hairMat, topMat, bottomMat, accentMat, shoeMat, eyeWhiteMat, eyeMat, blushMat],
    // Derived heights are included so tests can assert the rig's geometry
    // numerically instead of eyeballing a screenshot.
    dimensions: { ...P, headY, torsoY, hipY }
  };
}

// Drives a walk and idle cycle with squash and stretch.
//
// Squash on the down-beat and stretch on the up-beat is what gives a character
// weight; without it a walk reads as a sliding puppet. Kept separate from the
// rig so the player and every NPC share it.
export class CharacterAnimator {
  constructor(rig) {
    this.rig = rig;
    this.phase = 0;
    this.speed = 0;
    this.idleTime = 0;
    // Whatever moves the character owns its ground height. The bob is tracked
    // separately so it can be subtracted again next frame; assigning
    // position.y directly made the character drift upward every frame.
    this.baseY = 0;
    this._lastBob = 0;
    const d = rig.dimensions;
    this._baseTorsoScale = d
      ? new THREE.Vector3(d.torsoWidth, d.torsoHeight, d.torsoDepth)
      : new THREE.Vector3(1, 1, 1);
  }

  update(deltaSeconds, speed, { running = false, carrying = false } = {}) {
    this.speed = speed;
    this.baseY = this.rig.root.position.y - this._lastBob;
    this._lastBob = 0;

    const moving = speed > 0.15;
    const stride = running ? 9 : 6.5;

    if (moving) {
      this.phase += deltaSeconds * stride * Math.min(1.4, speed / 3.6);
      this.idleTime = 0;
    } else {
      this.phase = 0;
      this.idleTime += deltaSeconds;
    }

    const swing = moving ? Math.min(0.9, 0.35 + speed * 0.11) : 0;
    const s = Math.sin(this.phase);
    const c = Math.cos(this.phase);

    const [armL, armR] = this.rig.arms;
    const [legL, legR] = this.rig.legs;

    legL.rotation.x = s * swing;
    legR.rotation.x = -s * swing;
    armL.rotation.x = -s * swing * (carrying ? 0.3 : 0.85);
    armR.rotation.x = s * swing * (carrying ? 0.3 : 0.85);

    // A slight outward splay keeps the arms clear of the torso.
    armL.rotation.z = 0.1;
    armR.rotation.z = -0.1;

    // Squash and stretch, counter-scaled on the other axes so volume holds.
    const base = this._baseTorsoScale;
    const squash = moving ? Math.sin(this.phase * 2) * (running ? 0.06 : 0.04) : 0;
    this.rig.torso.scale.set(
      base.x * (1 - squash * 0.8),
      base.y * (1 + squash),
      base.z * (1 - squash * 0.8)
    );

    // Vertical bob, twice per stride so the body rises as each foot passes.
    this._lastBob = moving ? Math.abs(c) * (running ? 0.07 : 0.04) : 0;
    this.rig.root.position.y = this.baseY + this._lastBob;

    this.rig.torso.rotation.x = running && moving ? 0.1 : 0;

    if (!moving) {
      // Idle: a slow breath and a slight sway, so a standing character is never
      // perfectly still.
      const breathe = Math.sin(this.idleTime * 1.5) * 0.02;
      this.rig.head.position.y = (this.rig.headBaseY ?? 0) + breathe;
      this.rig.head.rotation.z = Math.sin(this.idleTime * 0.6) * 0.03;
      armL.rotation.x = breathe * 0.8;
      armR.rotation.x = -breathe * 0.8;
      this.rig.torso.scale.copy(base);
    } else {
      this.rig.head.rotation.z = 0;
    }
  }

  dispose() {
    for (const material of this.rig.materials) material.dispose();
  }
}

// A character that lives in the world: has a home, follows a daily schedule,
// and turns to face the player when spoken to.
export class Villager {
  constructor({ rig, animator, npcId, home, x, z, y, wanderRadius = 6, schedule = null }) {
    this.rig = rig;
    this.animator = animator;
    this.npcId = npcId;
    this.home = home;
    this.x = x;
    this.z = z;
    this.y = y;
    this.yaw = 0;
    this.wanderRadius = wanderRadius;
    this.schedule = schedule;
    this.target = null;
    this.state = 'idle';
  }

  get position() {
    return new THREE.Vector3(this.x, this.y, this.z);
  }

  setTarget(x, z) {
    this.target = { x, z };
  }

  clearTarget() {
    this.target = null;
  }

  update(deltaSeconds, groundHeightAt) {
    let speed = 0;
    let moving = false;

    if (this.target) {
      const dx = this.target.x - this.x;
      const dz = this.target.z - this.z;
      const d = Math.hypot(dx, dz);
      if (d > 0.4) {
        const step = Math.min(d, 2.2 * deltaSeconds);
        this.x += (dx / d) * step;
        this.z += (dz / d) * step;
        this.yaw = Math.atan2(dx, dz);
        speed = 2.2;
        moving = true;
      } else {
        this.target = null;
      }
    }

    const drift = Math.hypot(this.x - this.home.x, this.z - this.home.z);
    if (!this.target && drift > this.wanderRadius) {
      this.x += (this.home.x - this.x) * 0.02;
      this.z += (this.home.z - this.z) * 0.02;
    }

    if (groundHeightAt) this.y = groundHeightAt(this.x, this.z);

    this.rig.root.position.set(this.x, this.y, this.z);
    this.rig.root.rotation.y = this.yaw;
    this.animator.update(deltaSeconds, speed);
    this.state = moving ? 'walking' : 'idle';
  }

  faceTowards(x, z) {
    const dx = x - this.x;
    const dz = z - this.z;
    if (Math.hypot(dx, dz) > 0.1) this.yaw = Math.atan2(dx, dz);
    this.rig.root.rotation.y = this.yaw;
  }

  dispose() {
    this.animator.dispose();
  }
}

export { SKINS, HAIRS };