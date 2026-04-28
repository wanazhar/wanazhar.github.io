import * as THREE from 'three';
import { LANES, RECYCLE_Z, PowerUpType } from '../core/Constants.js';
import { applyCurvedWorldMaterial } from '../graphics/ShaderUtils.js';
import { getTheme } from '../core/ThemePresets.js';

const dummy = new THREE.Object3D();
const playerPosition = new THREE.Vector3();
const coinPosition = new THREE.Vector3();

const MAGNET_RADIUS = 8.5;
const SKY_COIN_MIN_Y = 4.55;
const SKY_COIN_MAX_Y = 5.9;

export class CoinManager {
  constructor(scene, { count = 132, curvedWorldOptions = {}, onCollect = null, themeId = 'neon' } = {}) {
    this.scene = scene;
    this.count = count;
    this.onCollect = onCollect;
    this.curvedWorldOptions = curvedWorldOptions;
    this.rng = mulberry32(12188);
    this.coins = [];
    this.mesh = null;
    this.themeId = themeId;

    this.setTheme(themeId);
    this.reset();
  }

  setTheme(themeId) {
    this.themeId = themeId;
    const theme = getTheme(themeId);
    if (this.mesh) this.scene.remove(this.mesh);

    const geometry = themeId === 'anime'
      ? new THREE.IcosahedronGeometry(0.24, 0)
      : new THREE.TorusGeometry(0.24, 0.065, 8, 18);

    const material = applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({
      color: theme.items.coinColor,
      roughness: themeId === 'anime' ? 0.32 : 0.24,
      metalness: themeId === 'anime' ? 0.18 : 0.55,
      emissive: theme.items.coinEmissive,
      emissiveIntensity: themeId === 'anime' ? 0.72 : 1.15
    }), this.curvedWorldOptions);

    this.mesh = new THREE.InstancedMesh(geometry, material, this.count);
    this.mesh.name = 'InstancedHaloCoins';
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.mesh);
    this.updateMatrices();
  }

  reset() {
    this.coins.length = 0;
    let z = -18;
    for (let i = 0; i < this.count; i += 1) {
      const wave = i % 18;
      const lane = this.pickLaneForWave(wave);
      const y = 1.05 + (wave > 12 ? Math.sin(wave * 0.7) * 0.5 : 0);
      this.coins.push({
        laneIndex: lane,
        x: LANES[lane],
        z,
        y,
        baseY: y,
        angle: this.rng() * Math.PI * 2,
        active: true
      });
      z -= wave % 6 === 5 ? this.randomRange(7.5, 13.5) : 2.15;
    }
    this.updateMatrices();
  }

  update(deltaSeconds, speed, playerRoot, activePowerUps = {}) {
    playerRoot.getWorldPosition(playerPosition);
    const magnetActive = (activePowerUps[PowerUpType.MAGNET] ?? 0) > 0;
    const jetpackActive = (activePowerUps[PowerUpType.JETPACK] ?? 0) > 0;
    let deepestZ = this.getDeepestZ();

    for (const coin of this.coins) {
      coin.z += speed * deltaSeconds;
      coin.angle += deltaSeconds * 6.5;

      if (jetpackActive && coin.active && coin.z < -4 && coin.z > -140) {
        const skyTarget = THREE.MathUtils.mapLinear(Math.sin(coin.angle * 0.42), -1, 1, SKY_COIN_MIN_Y, SKY_COIN_MAX_Y);
        coin.y = THREE.MathUtils.lerp(coin.y, skyTarget, Math.min(1, deltaSeconds * 2.8));
      } else if (!jetpackActive && coin.active && coin.z < -4) {
        coin.y = THREE.MathUtils.lerp(coin.y, coin.baseY, Math.min(1, deltaSeconds * 2.1));
      }

      if (coin.active) {
        coinPosition.set(coin.x, coin.y, coin.z);

        if (magnetActive) {
          const targetY = playerPosition.y + 1.05;
          const dx = playerPosition.x - coin.x;
          const dy = targetY - coin.y;
          const dz = playerPosition.z - coin.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < MAGNET_RADIUS) {
            const pull = Math.min(1, deltaSeconds * (11.5 / Math.max(dist, 1.05)));
            coin.x = THREE.MathUtils.lerp(coin.x, playerPosition.x, pull);
            coin.y = THREE.MathUtils.lerp(coin.y, targetY, pull * 1.12);
            coin.z = THREE.MathUtils.lerp(coin.z, playerPosition.z, pull * 0.72);
            coinPosition.set(coin.x, coin.y, coin.z);
          }
        }

        const laneAligned = Math.abs(playerPosition.x - coinPosition.x) < (magnetActive ? 0.92 : 0.68);
        const zAligned = Math.abs(playerPosition.z - coinPosition.z) < (magnetActive ? 0.85 : 0.62);
        const yAligned = Math.abs((playerPosition.y + 1.1) - coinPosition.y) < (jetpackActive || magnetActive ? 1.95 : 1.65);
        if (laneAligned && zAligned && yAligned) {
          coin.active = false;
          if (this.onCollect) this.onCollect(1);
        }
      }

      if (coin.z > RECYCLE_Z) {
        deepestZ -= this.randomRange(1.9, 4.1);
        this.resetCoinAtFront(coin, deepestZ, jetpackActive);
      }
    }

    this.updateMatrices();
  }

  resetCoinAtFront(coin, z, jetpackActive = false) {
    coin.laneIndex = this.randomInt(0, 2);
    coin.x = LANES[coin.laneIndex];
    coin.z = z;
    coin.baseY = this.rng() < 0.18 ? this.randomRange(1.65, 2.65) : this.randomRange(0.92, 1.18);
    coin.y = jetpackActive ? this.randomRange(SKY_COIN_MIN_Y, SKY_COIN_MAX_Y) : coin.baseY;
    coin.angle = this.rng() * Math.PI * 2;
    coin.active = true;
  }

  updateMatrices() {
    if (!this.mesh) return;
    for (let i = 0; i < this.count; i += 1) {
      const coin = this.coins[i] ?? { x: 0, y: 0, z: -999, angle: 0, active: false };
      const scale = coin.active ? 1 : 0.0001;
      dummy.position.set(coin.x, coin.y + Math.sin(coin.angle * 1.3) * 0.045, coin.z);
      dummy.rotation.set(this.themeId === 'anime' ? coin.angle * 0.5 : Math.PI / 2, coin.angle, Math.PI / 6);
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
