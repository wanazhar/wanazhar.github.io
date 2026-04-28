import * as THREE from 'three';
import { BASE_WORLD_SPEED, LANES, LANE_WIDTH, RECYCLE_Z } from '../core/Constants.js';
import { applyCurvedWorldMaterial, applyCurvedWorldToObject } from '../graphics/ShaderUtils.js';
import { CoinManager } from './CoinManager.js';
import { ObstaclePool } from './ObstaclePool.js';
import { PowerUpManager } from './PowerUpManager.js';

const TILE_LENGTH = 22;
const TILE_COUNT = 18;
const BUILDING_COUNT = 72;

export class WorldGenerator {
  constructor(scene, stateManager) {
    this.scene = scene;
    this.stateManager = stateManager;
    this.root = new THREE.Group();
    this.root.name = 'WorldRoot';
    this.scene.add(this.root);

    this.rng = mulberry32(52677);
    this.curvedWorldOptions = {
      curveStrength: 0.00185,
      lateralStrength: 0.00016,
      curveStart: 12.0
    };

    this.materials = this.createMaterials();
    this.tiles = [];
    this.sideProps = [];
    this.buildGroundTiles();
    this.buildScenery();

    this.coinManager = new CoinManager(this.scene, {
      curvedWorldOptions: this.curvedWorldOptions,
      onCollect: (value) => this.stateManager.addCoin(value)
    });

    this.obstaclePool = new ObstaclePool(this.scene, {
      size: 13,
      curvedWorldOptions: this.curvedWorldOptions
    });

    this.powerUpManager = new PowerUpManager(this.scene, {
      size: 11,
      curvedWorldOptions: this.curvedWorldOptions,
      onCollect: (type, duration) => this.stateManager.activatePowerUp(type, duration)
    });
  }

  createMaterials() {
    return {
      ground: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: 0x151c37, roughness: 0.76, metalness: 0.08 }), this.curvedWorldOptions),
      lane: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: 0x202a55, roughness: 0.62, metalness: 0.08 }), this.curvedWorldOptions),
      rail: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: 0x32457b, roughness: 0.38, metalness: 0.52 }), this.curvedWorldOptions),
      neon: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: 0x6ed9ff, roughness: 0.35, metalness: 0.12, emissive: 0x2277b8, emissiveIntensity: 0.75 }), this.curvedWorldOptions),
      buildingA: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: 0x11172c, roughness: 0.66, metalness: 0.06, emissive: 0x070b18, emissiveIntensity: 0.25 }), this.curvedWorldOptions),
      buildingB: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: 0x27335d, roughness: 0.62, metalness: 0.1, emissive: 0x080b2d, emissiveIntensity: 0.22 }), this.curvedWorldOptions)
    };
  }

  buildGroundTiles() {
    for (let i = 0; i < TILE_COUNT; i += 1) {
      const tile = new THREE.Group();
      tile.name = `GroundTile_${i}`;
      tile.position.z = -i * TILE_LENGTH;

      const road = new THREE.Mesh(new THREE.BoxGeometry(LANE_WIDTH * 3.55, 0.16, TILE_LENGTH + 0.2), this.materials.ground);
      road.position.y = -0.08;
      road.receiveShadow = true;
      tile.add(road);

      LANES.forEach((x) => {
        const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, TILE_LENGTH + 0.2), this.materials.rail);
        railLeft.position.set(x - 0.72, 0.02, 0);
        const railRight = railLeft.clone();
        railRight.position.x = x + 0.72;
        tile.add(railLeft, railRight);
      });

      [-1, 1].forEach((side) => {
        const marker = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, TILE_LENGTH * 0.78), this.materials.lane);
        marker.position.set(side * LANE_WIDTH * 0.5, 0.035, 0);
        tile.add(marker);
      });

      this.root.add(tile);
      this.tiles.push(tile);
    }
  }

  buildScenery() {
    for (let i = 0; i < BUILDING_COUNT; i += 1) {
      const prop = new THREE.Group();
      prop.name = `Scenery_${i}`;
      const side = i % 2 === 0 ? -1 : 1;
      const height = this.randomRange(2.4, 12.5);
      const width = this.randomRange(1.2, 3.6);
      const depth = this.randomRange(1.2, 4.8);
      const z = -this.randomRange(12, TILE_COUNT * TILE_LENGTH);
      const x = side * this.randomRange(6.5, 14);

      const building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        this.rng() > 0.5 ? this.materials.buildingA : this.materials.buildingB
      );
      building.position.y = height * 0.5 - 0.05;
      building.castShadow = true;
      building.receiveShadow = true;
      prop.add(building);

      if (this.rng() > 0.48) {
        const antenna = new THREE.Mesh(new THREE.BoxGeometry(0.12, this.randomRange(0.8, 2.4), 0.12), this.materials.neon);
        antenna.position.y = height + antenna.geometry.parameters.height * 0.5;
        prop.add(antenna);
      }

      prop.position.set(x, 0, z);
      applyCurvedWorldToObject(prop, this.curvedWorldOptions);
      this.root.add(prop);
      this.sideProps.push(prop);
    }
  }

  reset() {
    this.tiles.forEach((tile, index) => {
      tile.position.z = -index * TILE_LENGTH;
    });

    this.sideProps.forEach((prop, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      prop.position.set(side * this.randomRange(6.5, 14), 0, -this.randomRange(12, TILE_COUNT * TILE_LENGTH));
    });

    this.coinManager.reset();
    this.obstaclePool.reset();
    this.powerUpManager.reset();
  }

  update(deltaSeconds) {
    const { speedMultiplier } = this.stateManager.getState();
    const speed = BASE_WORLD_SPEED * speedMultiplier;

    this.updateTiles(deltaSeconds, speed);
    this.updateScenery(deltaSeconds, speed);
    const { activePowerUps } = this.stateManager.getState();
    this.coinManager.update(deltaSeconds, speed, this.playerRoot, activePowerUps);
    this.powerUpManager.update(deltaSeconds, speed, this.playerRoot);
    this.obstaclePool.update(deltaSeconds, speed);

    return speed;
  }

  attachPlayer(playerRoot) {
    this.playerRoot = playerRoot;
  }

  updateTiles(deltaSeconds, speed) {
    let deepestZ = this.tiles.reduce((min, tile) => Math.min(min, tile.position.z), 0);
    for (const tile of this.tiles) {
      tile.position.z += speed * deltaSeconds;
      if (tile.position.z > RECYCLE_Z) {
        tile.position.z = deepestZ - TILE_LENGTH;
        deepestZ = tile.position.z;
      }
    }
  }

  updateScenery(deltaSeconds, speed) {
    let deepestZ = this.sideProps.reduce((min, prop) => Math.min(min, prop.position.z), -40);
    for (const prop of this.sideProps) {
      prop.position.z += speed * deltaSeconds;
      if (prop.position.z > RECYCLE_Z + 4) {
        const side = prop.position.x < 0 ? -1 : 1;
        prop.position.x = side * this.randomRange(6.5, 14);
        prop.position.z = deepestZ - this.randomRange(4, 12);
        deepestZ = prop.position.z;
      }
    }
  }

  getObstacleOBBs() {
    return this.obstaclePool.getCollisionOBBs();
  }

  randomRange(min, max) {
    return min + (max - min) * this.rng();
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
