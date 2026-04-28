import * as THREE from 'three';
import { OBB } from 'three/addons/math/OBB.js';
import { LANES, RECYCLE_Z } from '../core/Constants.js';
import { ObjectPool } from '../utils/ObjectPool.js';
import { makeOBB, updateWorldOBB } from '../collision/OBBUtils.js';
import { applyCurvedWorldToObject } from '../graphics/ShaderUtils.js';
import { getTheme } from '../core/ThemePresets.js';
import { makeDecalPlane, textureBank } from '../assets/AssetRegistry.js';

const obstacleTypes = Object.freeze([
  {
    key: 'train',
    halfSize: { x: 0.82, y: 1.05, z: 3.1 },
    center: { x: 0, y: 1.05, z: 0 }
  },
  {
    key: 'barrier',
    halfSize: { x: 0.76, y: 0.82, z: 0.56 },
    center: { x: 0, y: 0.82, z: 0 }
  },
  {
    key: 'gate',
    halfSize: { x: 0.86, y: 1.55, z: 0.42 },
    center: { x: 0, y: 1.55, z: 0 }
  }
]);

export class ObstaclePool {
  constructor(scene, { size = 13, curvedWorldOptions = {}, themeId = 'neon' } = {}) {
    this.scene = scene;
    this.curvedWorldOptions = curvedWorldOptions;
    this.themeId = themeId;
    this.obstacles = [];
    this.rng = mulberry32(81421);

    this.pool = new ObjectPool({
      initialSize: size,
      create: (index) => this.createObstacle(index),
      onAcquire: (obstacle) => { obstacle.group.visible = true; },
      onRelease: (obstacle) => { obstacle.group.visible = false; }
    });

    this.bootstrap(size);
  }

  setTheme(themeId) {
    this.themeId = themeId;
    this.obstacles.forEach((obstacle, index) => this.resetObstacle(obstacle, obstacle.group.position.z, index < 3));
  }

  bootstrap(size) {
    let z = -34;
    for (let i = 0; i < size; i += 1) {
      const obstacle = this.pool.acquire();
      this.resetObstacle(obstacle, z, i < 3);
      z -= this.randomRange(22, 44);
      this.obstacles.push(obstacle);
    }
  }

  reset() {
    let z = -34;
    this.obstacles.forEach((obstacle, index) => {
      this.resetObstacle(obstacle, z, index < 3);
      z -= this.randomRange(22, 44);
    });
  }

  createObstacle(index) {
    const group = new THREE.Group();
    group.name = `PooledObstacle_${index}`;
    this.scene.add(group);

    return {
      group,
      type: null,
      localOBB: null,
      worldOBB: new OBB(),
      laneIndex: 1
    };
  }

  resetObstacle(obstacle, z, easyStart = false) {
    obstacle.group.clear();

    const type = easyStart ? obstacleTypes[this.randomInt(0, 1)] : obstacleTypes[this.randomInt(0, obstacleTypes.length - 1)];
    const model = this.buildObstacle(type.key);
    applyCurvedWorldToObject(model, this.curvedWorldOptions);
    obstacle.group.add(model);

    obstacle.type = type.key;
    obstacle.localOBB = makeOBB(type.center, type.halfSize);
    obstacle.laneIndex = easyStart ? this.randomInt(0, 2) : this.pickLaneAwayFromLast(obstacle.laneIndex);
    obstacle.group.position.set(LANES[obstacle.laneIndex], 0, z);
    obstacle.group.rotation.y = type.key === 'barrier' ? this.randomRange(-0.08, 0.08) : 0;
    obstacle.group.scale.setScalar(this.randomRange(0.94, 1.08));
    obstacle.group.visible = true;
    obstacle.group.updateMatrixWorld(true);
  }

  buildObstacle(type) {
    return this.themeId === 'anime'
      ? buildAnimeObstacle(type, getTheme(this.themeId))
      : buildNeonObstacle(type, getTheme(this.themeId));
  }

  update(deltaSeconds, speed) {
    let deepestZ = this.getDeepestZ();
    for (const obstacle of this.obstacles) {
      obstacle.group.position.z += speed * deltaSeconds;
      if (obstacle.group.position.z > RECYCLE_Z) {
        deepestZ -= this.randomRange(24, 48);
        this.resetObstacle(obstacle, deepestZ);
      }
      obstacle.group.updateMatrixWorld(true);
    }
  }

  getCollisionOBBs() {
    return this.obstacles
      .filter((obstacle) => obstacle.group.visible && obstacle.group.position.z > -8 && obstacle.group.position.z < 4)
      .map((obstacle) => updateWorldOBB(obstacle.localOBB, obstacle.group, obstacle.worldOBB));
  }

  getDeepestZ() {
    return this.obstacles.reduce((min, obstacle) => Math.min(min, obstacle.group.position.z), -48);
  }

  randomRange(min, max) {
    return min + (max - min) * this.rng();
  }

  randomInt(min, max) {
    return Math.floor(this.randomRange(min, max + 1));
  }

  pickLaneAwayFromLast(lastLane) {
    if (this.rng() < 0.35) return lastLane;
    let next = this.randomInt(0, 2);
    if (next === lastLane) next = (next + 1 + this.randomInt(0, 1)) % 3;
    return next;
  }
}

function neonMaterial(color, emissive = 0x000000) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.18, emissive, emissiveIntensity: emissive ? 0.22 : 0 });
}

function buildNeonObstacle(type, theme) {
  if (type === 'train') {
    const group = new THREE.Group();
    const bodyMat = neonMaterial(0x232f68, 0x10164b);
    const stripeMat = neonMaterial(theme.player.accent, 0x250513);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xaff9ff, roughness: 0.18, metalness: 0.1, emissive: 0x124556, emissiveIntensity: 0.4 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.62, 1.9, 6.1), bodyMat);
    body.position.y = 1.0;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.28, 5.7), stripeMat);
    roof.position.y = 2.08;
    group.add(roof);
    for (let z = -2.25; z <= 2.25; z += 1.5) {
      const leftWindow = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.45, 0.65), windowMat);
      leftWindow.position.set(-0.835, 1.25, z);
      const rightWindow = leftWindow.clone();
      rightWindow.position.x = 0.835;
      group.add(leftWindow, rightWindow);
    }
    return group;
  }

  if (type === 'barrier') {
    const group = new THREE.Group();
    const mat = neonMaterial(0xffd56e, 0x302000);
    const dark = neonMaterial(0x17213c);
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.1, 0.9), mat);
    base.position.y = 0.55;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    for (let i = -1; i <= 1; i += 1) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.18, 0.94), dark);
      stripe.position.set(i * 0.48, 0.58, -0.01);
      stripe.rotation.z = 0.45;
      group.add(stripe);
    }
    return group;
  }

  const group = new THREE.Group();
  const mat = neonMaterial(0x6376ff, 0x10164b);
  const warning = neonMaterial(0xfff06a, 0x2b2200);
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.26, 3.0, 0.62), mat);
  left.position.set(-0.75, 1.5, 0);
  const right = left.clone();
  right.position.x = 0.75;
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.3, 0.62), mat);
  top.position.set(0, 2.86, 0);
  const lowBar = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.22, 0.64), warning);
  lowBar.position.set(0, 0.55, -0.01);
  group.add(left, right, top, lowBar);
  group.traverse((object) => { if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; } });
  return group;
}

function buildAnimeObstacle(type, theme) {
  const pink = new THREE.MeshStandardMaterial({ color: theme.player.accent, roughness: 0.38, metalness: 0.08, emissive: 0x7a294f, emissiveIntensity: 0.12 });
  const cream = new THREE.MeshStandardMaterial({ color: 0xfff8ff, roughness: 0.5, metalness: 0.02 });
  const lilac = new THREE.MeshStandardMaterial({ color: 0xcad7ff, roughness: 0.42, metalness: 0.03 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x7b648f, roughness: 0.56, metalness: 0.03 });

  if (type === 'train') {
    const group = new THREE.Group();
    const bus = new THREE.Mesh(new THREE.BoxGeometry(1.62, 1.9, 6.1), cream);
    bus.position.y = 1.0;
    bus.castShadow = true;
    group.add(bus);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.26, 5.7), pink);
    stripe.position.set(0, 1.3, 0);
    group.add(stripe);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.22, 5.3), lilac);
    roof.position.set(0, 2.02, 0);
    group.add(roof);
    const catEarL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.32, 4), dark);
    catEarL.position.set(-0.32, 2.25, -2.2);
    const catEarR = catEarL.clone();
    catEarR.position.x = 0.32;
    group.add(catEarL, catEarR);
    const decal = makeDecalPlane(textureBank.animeBusDecal, 1.1, 0.55);
    decal.position.set(0, 1.0, 3.07);
    group.add(decal);
    return group;
  }

  if (type === 'barrier') {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.1, 0.9), lilac);
    body.position.y = 0.55;
    group.add(body);
    for (let i = -1; i <= 1; i += 1) {
      const bow = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.72, 0.2), pink);
      bow.position.set(i * 0.42, 0.62, -0.02);
      bow.rotation.z = i * 0.22;
      group.add(bow);
    }
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.14), cream);
    ribbon.position.set(0, 0.32, -0.02);
    group.add(ribbon);
    return group;
  }

  const group = new THREE.Group();
  const left = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.0, 10), pink);
  left.position.set(-0.75, 1.5, 0);
  const right = left.clone();
  right.position.x = 0.75;
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.28, 0.62), dark);
  top.position.set(0, 2.86, 0);
  const charm = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), cream);
  charm.position.set(0, 2.42, 0);
  const lowBar = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.22, 0.64), lilac);
  lowBar.position.set(0, 0.55, -0.01);
  group.add(left, right, top, charm, lowBar);
  const sign = makeDecalPlane(textureBank.animeGateCharm, 0.7, 0.7);
  sign.position.set(0, 2.05, 0.33);
  group.add(sign);
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
