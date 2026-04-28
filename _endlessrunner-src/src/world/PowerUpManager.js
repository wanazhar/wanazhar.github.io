import * as THREE from 'three';
import { LANES, RECYCLE_Z, PowerUpType, POWER_UP_DURATIONS } from '../core/Constants.js';
import { applyCurvedWorldToObject } from '../graphics/ShaderUtils.js';
import { getTheme } from '../core/ThemePresets.js';
import { makeDecalPlane, textureBank } from '../assets/AssetRegistry.js';

const playerPosition = new THREE.Vector3();

const BASE_DEFINITIONS = Object.freeze([
  { type: PowerUpType.MAGNET, label: 'MAG' },
  { type: PowerUpType.MULTIPLIER, label: '2X' },
  { type: PowerUpType.JETPACK, label: 'JET' },
  { type: PowerUpType.SHIELD, label: 'SHD' }
]);

export class PowerUpManager {
  constructor(scene, { size = 11, curvedWorldOptions = {}, onCollect = null, themeId = 'neon' } = {}) {
    this.scene = scene;
    this.size = size;
    this.curvedWorldOptions = curvedWorldOptions;
    this.onCollect = onCollect;
    this.themeId = themeId;
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

  setTheme(themeId) {
    this.themeId = themeId;
    this.items.forEach((item, index) => this.resetPowerUp(item, item.z, index));
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
    const model = this.buildModel(definition.type);
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

  buildModel(type) {
    return this.themeId === 'anime'
      ? buildAnimePowerUp(type, getTheme(this.themeId))
      : buildNeonPowerUp(type, getTheme(this.themeId));
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
    if (index < BASE_DEFINITIONS.length) return BASE_DEFINITIONS[index];
    return BASE_DEFINITIONS[this.randomInt(0, BASE_DEFINITIONS.length - 1)];
  }

  randomRange(min, max) {
    return min + (max - min) * this.rng();
  }

  randomInt(min, max) {
    return Math.floor(this.randomRange(min, max + 1));
  }
}

function themedMaterial(color, emissive) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.24, metalness: 0.22, emissive, emissiveIntensity: 0.68 });
}

function buildNeonPowerUp(type, theme) {
  const colorMap = {
    [PowerUpType.MAGNET]: [theme.items.powerA, 0x2086aa],
    [PowerUpType.MULTIPLIER]: [theme.items.powerC, 0x8d5f00],
    [PowerUpType.JETPACK]: [theme.items.powerB, 0x7d173d],
    [PowerUpType.SHIELD]: [0x8aa9ff, 0x1a2d8c]
  };
  const [color, emissive] = colorMap[type];
  const main = themedMaterial(color, emissive);
  const hot = themedMaterial(theme.items.powerB, 0x8a1642);
  const metal = themedMaterial(0x8aa9ff, 0x182b82);
  const group = new THREE.Group();

  if (type === PowerUpType.MAGNET) {
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
  } else if (type === PowerUpType.MULTIPLIER) {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), main);
    star.rotation.z = Math.PI / 4;
    group.add(star);
  } else if (type === PowerUpType.JETPACK) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.72, 0.34), main);
    body.position.y = 0.08;
    const tankL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.82, 10), metal);
    tankL.rotation.z = Math.PI / 2;
    tankL.position.set(-0.33, 0.02, 0);
    const tankR = tankL.clone();
    tankR.position.x = 0.33;
    const flameL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.42, 10), themedMaterial(theme.player.jetpack, 0x9b5c00));
    flameL.position.set(-0.22, -0.56, 0);
    flameL.rotation.x = Math.PI;
    const flameR = flameL.clone();
    flameR.position.x = 0.22;
    group.add(body, tankL, tankR, flameL, flameR);
  } else {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.06, 10, 28), main);
    ring.rotation.x = Math.PI / 2;
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 1), main);
    core.scale.set(0.9, 1.14, 0.9);
    group.add(ring, core);
  }
  return group;
}

function buildAnimePowerUp(type, theme) {
  const group = new THREE.Group();
  const pink = themedMaterial(theme.items.powerA, 0x7f2852);
  const blue = themedMaterial(theme.items.powerB, 0x27527f);
  const gold = themedMaterial(theme.items.powerC, 0x8d6500);

  if (type === PowerUpType.MAGNET) {
    const heartA = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), pink);
    heartA.position.set(-0.14, 0.1, 0);
    const heartB = heartA.clone();
    heartB.position.x = 0.14;
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 16), pink);
    point.position.set(0, -0.18, 0);
    point.rotation.z = Math.PI;
    group.add(heartA, heartB, point);
    const icon = makeDecalPlane(textureBank.animePowerMagnet, 0.54, 0.54);
    icon.position.set(0, 0.02, 0.3);
    group.add(icon);
  } else if (type === PowerUpType.MULTIPLIER) {
    const star = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), gold);
    group.add(star);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.03, 6, 30), blue);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.02;
    group.add(halo);
    const icon = makeDecalPlane(textureBank.animePower2x, 0.56, 0.56);
    icon.position.set(0, 0.02, 0.3);
    group.add(icon);
  } else if (type === PowerUpType.JETPACK) {
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.24, 0.18), pink);
    const loopL = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 22, Math.PI), blue);
    loopL.position.set(-0.25, 0.03, 0);
    loopL.rotation.z = Math.PI / 2;
    const loopR = loopL.clone();
    loopR.position.x = 0.25;
    const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.08), gold);
    tailL.position.set(-0.12, -0.28, 0);
    const tailR = tailL.clone();
    tailR.position.x = 0.12;
    group.add(ribbon, loopL, loopR, tailL, tailR);
    const icon = makeDecalPlane(textureBank.animePowerJet, 0.58, 0.58);
    icon.position.set(0, 0.02, 0.3);
    group.add(icon);
  } else {
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.4, 18, 14), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 0.05, metalness: 0.1 }));
    const star = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), blue);
    group.add(bubble, star);
    const icon = makeDecalPlane(textureBank.animePowerShield, 0.54, 0.54);
    icon.position.set(0, 0.02, 0.3);
    group.add(icon);
  }

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
