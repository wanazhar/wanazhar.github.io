import * as THREE from 'three';
import { OBB } from 'three/addons/math/OBB.js';
import { LANES, RECYCLE_Z } from '../core/Constants.js';
import { ObjectPool } from '../utils/ObjectPool.js';
import { makeOBB, updateWorldOBB } from '../collision/OBBUtils.js';
import { applyCurvedWorldToObject } from '../graphics/ShaderUtils.js';

const obstacleTypes = Object.freeze([
  {
    key: 'train',
    halfSize: { x: 0.82, y: 1.05, z: 3.1 },
    center: { x: 0, y: 1.05, z: 0 },
    build: buildTrain
  },
  {
    key: 'barrier',
    halfSize: { x: 0.76, y: 0.82, z: 0.56 },
    center: { x: 0, y: 0.82, z: 0 },
    build: buildBarrier
  },
  {
    key: 'gate',
    halfSize: { x: 0.86, y: 1.55, z: 0.42 },
    center: { x: 0, y: 1.55, z: 0 },
    build: buildGate
  }
]);

export class ObstaclePool {
  constructor(scene, { size = 13, curvedWorldOptions = {} } = {}) {
    this.scene = scene;
    this.curvedWorldOptions = curvedWorldOptions;
    this.obstacles = [];
    this.rng = mulberry32(81421);

    this.pool = new ObjectPool({
      initialSize: size,
      create: (index) => this.createObstacle(index),
      onAcquire: (obstacle) => {
        obstacle.group.visible = true;
      },
      onRelease: (obstacle) => {
        obstacle.group.visible = false;
      }
    });

    this.bootstrap(size);
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
    group.matrixAutoUpdate = true;
    this.scene.add(group);

    const obstacle = {
      group,
      type: null,
      localOBB: null,
      worldOBB: new OBB(),
      laneIndex: 1
    };

    return obstacle;
  }

  resetObstacle(obstacle, z, easyStart = false) {
    obstacle.group.clear();

    const type = easyStart ? obstacleTypes[this.randomInt(0, 1)] : obstacleTypes[this.randomInt(0, obstacleTypes.length - 1)];
    const model = type.build();
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

function buildTrain() {
  const group = new THREE.Group();
  group.name = 'MaglevObstacle';

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x232f68, roughness: 0.42, metalness: 0.22 });
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xff69ad, roughness: 0.35, metalness: 0.18, emissive: 0x250513, emissiveIntensity: 0.16 });
  const windowMat = new THREE.MeshStandardMaterial({ color: 0xaff9ff, roughness: 0.18, metalness: 0.1, emissive: 0x124556, emissiveIntensity: 0.4 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.62, 1.9, 6.1), bodyMat);
  body.position.y = 1.0;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.28, 5.7), stripeMat);
  roof.position.y = 2.08;
  roof.castShadow = true;
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

function buildBarrier() {
  const group = new THREE.Group();
  group.name = 'BarrierObstacle';
  const mat = new THREE.MeshStandardMaterial({ color: 0xffd56e, roughness: 0.48, metalness: 0.12, emissive: 0x302000, emissiveIntensity: 0.18 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x17213c, roughness: 0.55, metalness: 0.14 });

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

function buildGate() {
  const group = new THREE.Group();
  group.name = 'GateObstacle';
  const mat = new THREE.MeshStandardMaterial({ color: 0x6376ff, roughness: 0.38, metalness: 0.3, emissive: 0x10164b, emissiveIntensity: 0.22 });
  const warning = new THREE.MeshStandardMaterial({ color: 0xfff06a, roughness: 0.4, metalness: 0.12, emissive: 0x2b2200, emissiveIntensity: 0.2 });

  const left = new THREE.Mesh(new THREE.BoxGeometry(0.26, 3.0, 0.62), mat);
  left.position.set(-0.75, 1.5, 0);
  const right = left.clone();
  right.position.x = 0.75;
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.3, 0.62), mat);
  top.position.set(0, 2.86, 0);
  const lowBar = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.22, 0.64), warning);
  lowBar.position.set(0, 0.55, -0.01);
  group.add(left, right, top, lowBar);

  group.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

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
