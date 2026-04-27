import * as THREE from 'three';
import { LANES, RECYCLE_Z } from '../core/Constants.js';
import { applyCurvedWorldMaterial } from '../graphics/ShaderUtils.js';

const dummy = new THREE.Object3D();
const playerPosition = new THREE.Vector3();
const coinPosition = new THREE.Vector3();

export class CoinManager {
  constructor(scene, { count = 120, curvedWorldOptions = {}, onCollect = null } = {}) {
    this.scene = scene;
    this.count = count;
    this.onCollect = onCollect;
    this.rng = mulberry32(12188);
    this.coins = [];

    const geometry = new THREE.TorusGeometry(0.24, 0.065, 8, 18);
    const material = applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({
      color: 0xffd95a,
      roughness: 0.24,
      metalness: 0.55,
      emissive: 0xffbf20,
      emissiveIntensity: 1.15
    }), curvedWorldOptions);

    this.mesh = new THREE.InstancedMesh(geometry, material, count);
    this.mesh.name = 'InstancedCoins';
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.mesh);

    this.reset();
  }

  reset() {
    this.coins.length = 0;
    let z = -18;
    for (let i = 0; i < this.count; i += 1) {
      const wave = i % 18;
      const lane = this.pickLaneForWave(wave);
      this.coins.push({
        laneIndex: lane,
        z,
        y: 1.05 + (wave > 12 ? Math.sin(wave * 0.7) * 0.5 : 0),
        angle: this.rng() * Math.PI * 2,
        active: true,
        collectedPulse: 0
      });
      z -= wave % 6 === 5 ? this.randomRange(7.5, 13.5) : 2.15;
    }
    this.updateMatrices();
  }

  update(deltaSeconds, speed, playerRoot) {
    playerRoot.getWorldPosition(playerPosition);
    let deepestZ = this.getDeepestZ();

    for (const coin of this.coins) {
      coin.z += speed * deltaSeconds;
      coin.angle += deltaSeconds * 6.5;

      if (coin.active) {
        coinPosition.set(LANES[coin.laneIndex], coin.y, coin.z);
        const laneAligned = Math.abs(playerPosition.x - coinPosition.x) < 0.68;
        const zAligned = Math.abs(playerPosition.z - coinPosition.z) < 0.62;
        const yAligned = Math.abs((playerPosition.y + 1.1) - coinPosition.y) < 1.65;
        if (laneAligned && zAligned && yAligned) {
          coin.active = false;
          coin.collectedPulse = 1;
          if (this.onCollect) this.onCollect(1);
        }
      }

      if (coin.z > RECYCLE_Z) {
        deepestZ -= this.randomRange(1.9, 4.1);
        this.resetCoinAtFront(coin, deepestZ);
      }
    }

    this.updateMatrices();
  }

  resetCoinAtFront(coin, z) {
    coin.laneIndex = this.randomInt(0, 2);
    coin.z = z;
    coin.y = this.rng() < 0.18 ? this.randomRange(1.65, 2.65) : this.randomRange(0.92, 1.18);
    coin.angle = this.rng() * Math.PI * 2;
    coin.active = true;
    coin.collectedPulse = 0;
  }

  updateMatrices() {
    for (let i = 0; i < this.count; i += 1) {
      const coin = this.coins[i];
      const scale = coin.active ? 1 : 0.0001;
      dummy.position.set(LANES[coin.laneIndex], coin.y, coin.z);
      dummy.rotation.set(Math.PI / 2, coin.angle, 0);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.computeBoundingSphere();
  }

  getDeepestZ() {
    return this.coins.reduce((min, coin) => Math.min(min, coin.z), -40);
  }

  pickLaneForWave(wave) {
    if (wave < 6) return 1;
    if (wave < 12) return this.rng() < 0.5 ? 0 : 2;
    return this.randomInt(0, 2);
  }

  randomRange(min, max) {
    return min + (max - min) * this.rng();
  }

  randomInt(min, max) {
    return Math.floor(this.randomRange(min, max + 1));
  }
}

function mulberry32(seed) {
  return function next() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
