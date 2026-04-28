import * as THREE from 'three';
import { LANES, RECYCLE_Z, PowerUpType, POWER_UP_DURATIONS } from '../core/Constants.js';
import { applyCurvedWorldToObject } from '../graphics/ShaderUtils.js';

const playerPosition = new THREE.Vector3();

const DEFINITIONS = Object.freeze([
  { type: PowerUpType.MAGNET, label: 'MAG', color: 0x6ef3ff, emissive: 0x2086aa, build: buildMagnet },
  { type: PowerUpType.MULTIPLIER, label: '2X', color: 0xffd95a, emissive: 0x8d5f00, build: buildMultiplier },
  { type: PowerUpType.JETPACK, label: 'JET', color: 0xff6aa9, emissive: 0x7d173d, build: buildJetpack },
  { type: PowerUpType.SHIELD, label: 'SHD', color: 0x8aa9ff, emissive: 0x1a2d8c, build: buildShield }
]);

export class PowerUpManager {
  constructor(scene, { size = 11, curvedWorldOptions = {}, onCollect = null } = {}) {
    this.scene = scene;
    this.size = size;
    this.curvedWorldOptions = curvedWorldOptions;
    this.onCollect = onCollect;
    this.rng = mulberry32(90491);
    this.items = [];

    for (let i = 0; i < size; i += 1) {
      const item = {
        group: new THREE.Group(),
        type: PowerUpType.MAGNET,
        laneIndex: 1,
        phase: this.rng() * Math.PI * 2,
        baseY: 1.35,
        z: -80,
        active: true
      };
      item.group.name = `PowerUp_${i}`;
      this.scene.add(item.group);
      this.items.push(item);
    }

    this.reset();
  }

  reset() {
    let z = -52;
    this.items.forEach((item, index) => {
      this.resetPowerUp(item, z, index);
      z -= this.randomRange(34, 66);
    });
  }

  resetPowerUp(item, z, index = 0) {
    item.group.clear();
    const definition = this.pickDefinition(index);
    const model = definition.build(definition);
    applyCurvedWorldToObject(model, this.curvedWorldOptions);
    item.group.add(model);

    item.type = definition.type;
    item.laneIndex = this.randomInt(0, 2);
    item.baseY = definition.type === PowerUpType.JETPACK ? 1.72 : 1.32;
    item.phase = this.rng() * Math.PI * 2;
    item.z = z;
    item.active = true;
    item.group.visible = true;
    item.group.position.set(LANES[item.laneIndex], item.baseY, item.z);
    item.group.rotation.set(0, this.rng() * Math.PI * 2, 0);
  }

  update(deltaSeconds, speed, playerRoot) {
    playerRoot.getWorldPosition(playerPosition);
    let deepestZ = this.getDeepestZ();

    for (const item of this.items) {
      item.z += speed * deltaSeconds;
      item.phase += deltaSeconds * 3.1;
      item.group.position.z = item.z;
      item.group.position.y = item.baseY + Math.sin(item.phase) * 0.18;
      item.group.rotation.y += deltaSeconds * 1.55;

      if (item.active) {
        const dx = Math.abs(playerPosition.x - item.group.position.x);
        const dz = Math.abs(playerPosition.z - item.group.position.z);
        const dy = Math.abs((playerPosition.y + 1.1) - item.group.position.y);
        if (dx < 0.95 && dz < 0.92 && dy < 2.2) {
          item.active = false;
          item.group.visible = false;
          if (this.onCollect) this.onCollect(item.type, POWER_UP_DURATIONS[item.type]);
          deepestZ -= this.randomRange(42, 78);
          this.resetPowerUp(item, deepestZ);
        }
      }

      if (item.z > RECYCLE_Z + 2) {
        deepestZ -= this.randomRange(42, 78);
        this.resetPowerUp(item, deepestZ);
      }
    }
  }

  getDeepestZ() {
    return this.items.reduce((min, item) => Math.min(min, item.z), -90);
  }

  pickDefinition(index) {
    if (index < DEFINITIONS.length) return DEFINITIONS[index];
    return DEFINITIONS[this.randomInt(0, DEFINITIONS.length - 1)];
  }

  randomRange(min, max) {
    return min + (max - min) * this.rng();
  }

  randomInt(min, max) {
    return Math.floor(this.randomRange(min, max + 1));
  }
}

function material(color, emissive) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.24, metalness: 0.22, emissive, emissiveIntensity: 0.68 });
}

function buildMagnet(definition) {
  const group = new THREE.Group();
  const main = material(definition.color, definition.emissive);
  const hot = material(0xff6aa9, 0x8a1642);

  const left = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.88, 0.18), main);
  left.position.set(-0.36, 0, 0);
  const right = left.clone();
  right.position.x = 0.36;
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.18), main);
  top.position.y = 0.36;
  const poleL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.22), hot);
  poleL.position.set(-0.36, -0.5, 0);
  const poleR = poleL.clone();
  poleR.position.x = 0.36;
  group.add(left, right, top, poleL, poleR);
  group.scale.setScalar(1.05);
  return group;
}

function buildMultiplier(definition) {
  const group = new THREE.Group();
  const main = material(definition.color, definition.emissive);
  const dark = material(0x161a2f, 0x000000);

  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), main);
  star.rotation.z = Math.PI / 4;
  group.add(star);

  const twoA = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.62, 0.12), dark);
  twoA.position.set(-0.22, 0.02, -0.5);
  const twoB = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.12), dark);
  twoB.position.set(-0.11, 0.27, -0.5);
  const xA = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.12), dark);
  xA.position.set(0.28, -0.02, -0.5);
  xA.rotation.z = 0.72;
  const xB = xA.clone();
  xB.rotation.z = -0.72;
  group.add(twoA, twoB, xA, xB);
  return group;
}

function buildJetpack(definition) {
  const group = new THREE.Group();
  const main = material(definition.color, definition.emissive);
  const flame = material(0xffd95a, 0x9b5c00);
  const metal = material(0x8aa9ff, 0x182b82);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.72, 0.34), main);
  body.position.y = 0.08;
  const tankL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.82, 10), metal);
  tankL.rotation.z = Math.PI / 2;
  tankL.position.set(-0.33, 0.02, 0);
  const tankR = tankL.clone();
  tankR.position.x = 0.33;
  const flameL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.42, 10), flame);
  flameL.position.set(-0.22, -0.56, 0);
  flameL.rotation.x = Math.PI;
  const flameR = flameL.clone();
  flameR.position.x = 0.22;
  group.add(body, tankL, tankR, flameL, flameR);
  return group;
}

function buildShield(definition) {
  const group = new THREE.Group();
  const main = material(definition.color, definition.emissive);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.06, 10, 28), main);
  ring.rotation.x = Math.PI / 2;
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 1), main);
  core.scale.set(0.9, 1.14, 0.9);
  group.add(ring, core);
  return group;
}

function mulberry32(seed) {
  return function next() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
