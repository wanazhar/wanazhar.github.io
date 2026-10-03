import * as THREE from 'three';
import { createBlockGeometry } from '../world/Palette.js';

// Voxel people built from a small box rig: head, torso, two arms, two legs.
// Limbs pivot from the shoulder and hip so a walk cycle is just a rotation,
// which is far cheaper than skinned meshes and matches the blocky world.

let sharedGeometry = null;
function geometry() {
  if (!sharedGeometry) sharedGeometry = createBlockGeometry();
  return sharedGeometry;
}

const SKINS = {
  light: 0xf2c9a0,
  medium: 0xe0b088,
  tan: 0xc98f66,
  deep: 0x8d5a3b
};

const HAIRS = {
  black: 0x3f3038,
  brown: 0x6b4a35,
  blonde: 0xc9a071,
  blue: 0x6fb8c9,
  pink: 0xe89bb0,
  white: 0xd8d4cc,
  red: 0xa84a3a
};

// Outfit presets used by the NPCs.
const OUTFITS = {
  office: { top: 0x3a4458, bottom: 0x2f3646, accent: 0xf0ece4 },
  casual: { top: 0x5aa06a, bottom: 0x4a5560, accent: 0xf2e4c8 },
  school: { top: 0x3f4a6b, bottom: 0x2f3a52, accent: 0xf0ece4 },
  apron: { top: 0xf0ece4, bottom: 0x8a8a90, accent: 0xc94f4f },
  fisherman: { top: 0x4a7fc9, bottom: 0x2f4a6e, accent: 0xe8c65a },
  farmer: { top: 0xc9a882, bottom: 0x6f5439, accent: 0xd6b45a },
  shrinekeeper: { top: 0xb04a3c, bottom: 0x96291f, accent: 0xf2e4c8 },
  oldperson: { top: 0x8a8a90, bottom: 0x5a5a60, accent: 0xd8d4cc },
  shopkeeper: { top: 0xc94f4f, bottom: 0x6a6a70, accent: 0xf2e4c8 }
};

// A simple humanoid rig. Returns a group plus the pivots needed to animate.
export function buildCharacter({
  skin = 'light',
  hair = 'black',
  outfit = 'casual',
  hairStyle = 'short',
  scale = 1
} = {}) {
  const geo = geometry();
  const skinColor = typeof skin === 'number' ? skin : SKINS[skin] ?? SKINS.light;
  const hairColor = typeof hair === 'number' ? hair : HAIRS[hair] ?? HAIRS.black;
  const o = typeof outfit === 'string' ? OUTFITS[outfit] ?? OUTFITS.casual : outfit;

  const mat = (color) => new THREE.MeshLambertMaterial({ color });

  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const skinMat = mat(skinColor);
  const hairMat = mat(hairColor);
  const topMat = mat(o.top);
  const bottomMat = mat(o.bottom);
  const accentMat = mat(o.accent);

  // Torso.
  const torso = new THREE.Mesh(geo, topMat);
  torso.scale.set(0.62, 0.68, 0.36);
  torso.position.y = 1.06;
  root.add(torso);

  // A collar or scarf in the accent colour, for a bit of silhouette variety.
  const collar = new THREE.Mesh(geo, accentMat);
  collar.scale.set(0.5, 0.14, 0.38);
  collar.position.y = 1.36;
  root.add(collar);

  // Head.
  const head = new THREE.Group();
  head.position.y = 1.46;
  root.add(head);

  const skull = new THREE.Mesh(geo, skinMat);
  skull.scale.set(0.5, 0.5, 0.5);
  skull.position.y = 0.25;
  head.add(skull);

  // Hair depends on style: short cap, long bob, ponytail, or a headscarf.
  if (hairStyle === 'long') {
    const back = new THREE.Mesh(geo, hairMat);
    back.scale.set(0.54, 0.44, 0.16);
    back.position.set(0, 0.22, -0.2);
    head.add(back);
    const side = new THREE.Mesh(geo, hairMat);
    side.scale.set(0.1, 0.44, 0.4);
    side.position.set(-0.27, 0.16, 0);
    head.add(side);
    const side2 = side.clone();
    side2.position.x = 0.27;
    head.add(side2);
  } else if (hairStyle === 'ponytail') {
    const tail = new THREE.Mesh(geo, hairMat);
    tail.scale.set(0.16, 0.4, 0.16);
    tail.position.set(0, 0.3, -0.28);
    head.add(tail);
  }

  const cap = new THREE.Mesh(geo, hairMat);
  cap.scale.set(0.54, 0.22, 0.54);
  cap.position.y = 0.47;
  head.add(cap);

  // Eyes: two dark blocks on the face. Enough to give them a direction.
  for (const sx of [-0.13, 0.13]) {
    const eye = new THREE.Mesh(geo, mat(0x2a2430));
    eye.scale.set(0.08, 0.09, 0.03);
    eye.position.set(sx, 0.26, 0.26);
    head.add(eye);
  }

  // Arms, pivoting at the shoulder.
  const arms = [];
  for (const sx of [-0.38, 0.38]) {
    const pivot = new THREE.Group();
    pivot.position.set(sx, 1.34, 0);
    root.add(pivot);
    const upper = new THREE.Mesh(geo, topMat);
    upper.scale.set(0.18, 0.42, 0.18);
    upper.position.y = -0.21;
    pivot.add(upper);
    const hand = new THREE.Mesh(geo, skinMat);
    hand.scale.set(0.18, 0.16, 0.18);
    hand.position.y = -0.46;
    pivot.add(hand);
    arms.push(pivot);
  }

  // Legs, pivoting at the hip.
  const legs = [];
  for (const sx of [-0.16, 0.16]) {
    const pivot = new THREE.Group();
    pivot.position.set(sx, 0.74, 0);
    root.add(pivot);
    const leg = new THREE.Mesh(geo, bottomMat);
    leg.scale.set(0.22, 0.5, 0.22);
    leg.position.y = -0.25;
    pivot.add(leg);
    const shoe = new THREE.Mesh(geo, mat(0x3f3a44));
    shoe.scale.set(0.24, 0.12, 0.3);
    shoe.position.set(0, -0.52, 0.04);
    pivot.add(shoe);
    legs.push(pivot);
  }

  return { root, head, torso, arms, legs, materials: [skinMat, hairMat, topMat, bottomMat, accentMat] };
}

// Drives a walk/idle cycle from a speed value. Kept separate from the rig so
// it can be reused for NPCs and the player.
export class CharacterAnimator {
  constructor(rig) {
    this.rig = rig;
    this.phase = 0;
    this.speed = 0;
    this.idleTime = 0;
    // The rig's feet sit at the character's ground height; the walk bob is
    // added on top of it rather than replacing it. Without this the character
    // snaps to y=0 (or is invisible below ground) the moment the animator runs.
    this.baseY = 0;
    this._lastBob = 0;
  }

  update(deltaSeconds, speed, { running = false, carrying = false } = {}) {
    this.speed = speed;

    // Whatever placed the character owns its ground height. The bob from the
    // previous frame is still in position.y, so subtract it off before adding
    // this frame's, or the character drifts upward every frame.
    this.baseY = this.rig.root.position.y - this._lastBob;
    this._lastBob = 0;

    const moving = speed > 0.15;

    if (moving) {
      // Stride frequency scales with speed; running takes shorter, faster steps.
      const stride = running ? 9 : 6.5;
      this.phase += deltaSeconds * stride * Math.min(1.4, speed / 3.6);
      this.idleTime = 0;
    } else {
      // Ease back to a neutral stance, then breathe.
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

    // A little vertical bob, added on top of the character's ground height rather
    // than replacing it, plus a slight lean when running.
    this._lastBob = moving ? Math.abs(c) * (running ? 0.07 : 0.04) : 0;
    this.rig.root.position.y = this.baseY + this._lastBob;
    this.rig.torso.rotation.x = running && moving ? 0.12 : 0;

    // Gentle breathing when standing still.
    if (!moving) {
      const breathe = Math.sin(this.idleTime * 1.6) * 0.02;
      this.rig.head.position.y = 1.46 + breathe;
      armL.rotation.x = breathe;
      armR.rotation.x = -breathe;
    }
  }

  dispose() {
    for (const material of this.rig.materials) material.dispose();
  }
}

// A one-off character that lives in the world: has a home position, wanders
// a little, and turns to face the player when talked to.
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

    // Keep villagers on their patch.
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