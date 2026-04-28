import * as THREE from 'three';
import { BASE_WORLD_SPEED, LANES, LANE_WIDTH, RECYCLE_Z } from '../core/Constants.js';
import { applyCurvedWorldMaterial, applyCurvedWorldToObject } from '../graphics/ShaderUtils.js';
import { CoinManager } from './CoinManager.js';
import { ObstaclePool } from './ObstaclePool.js';
import { PowerUpManager } from './PowerUpManager.js';
import { getTheme } from '../core/ThemePresets.js';

const TILE_LENGTH = 22;
const TILE_COUNT = 18;
const BUILDING_COUNT = 72;

export class WorldGenerator {
  constructor(scene, stateManager, { themeId = 'neon' } = {}) {
    this.scene = scene;
    this.stateManager = stateManager;
    this.themeId = themeId;
    this.root = new THREE.Group();
    this.root.name = 'WorldRoot';
    this.scene.add(this.root);

    this.rng = mulberry32(52677);
    this.curvedWorldOptions = {
      curveStrength: 0.00185,
      lateralStrength: 0.00016,
      curveStart: 12.0
    };

    this.tiles = [];
    this.sideProps = [];
    this.rebuildStaticWorld();

    this.coinManager = new CoinManager(this.scene, {
      curvedWorldOptions: this.curvedWorldOptions,
      themeId: this.themeId,
      onCollect: (value) => this.stateManager.addCoin(value)
    });

    this.obstaclePool = new ObstaclePool(this.scene, {
      size: 13,
      curvedWorldOptions: this.curvedWorldOptions,
      themeId: this.themeId
    });

    this.powerUpManager = new PowerUpManager(this.scene, {
      size: 11,
      curvedWorldOptions: this.curvedWorldOptions,
      themeId: this.themeId,
      onCollect: (type, duration) => this.stateManager.activatePowerUp(type, duration)
    });
  }

  setTheme(themeId) {
    this.themeId = themeId;
    this.rebuildStaticWorld();
    this.coinManager?.setTheme(themeId);
    this.obstaclePool?.setTheme(themeId);
    this.powerUpManager?.setTheme(themeId);
  }

  rebuildStaticWorld() {
    this.tiles = [];
    this.sideProps = [];
    while (this.root.children.length) this.root.remove(this.root.children[0]);
    this.materials = this.createMaterials();
    this.buildGroundTiles();
    this.buildScenery();
  }

  createMaterials() {
    const theme = getTheme(this.themeId);
    return {
      ground: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: theme.world.ground, roughness: this.themeId === 'anime' ? 0.82 : 0.76, metalness: 0.08 }), this.curvedWorldOptions),
      lane: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: theme.world.lane, roughness: 0.48, metalness: 0.06 }), this.curvedWorldOptions),
      rail: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: theme.world.rail, roughness: 0.38, metalness: 0.18, emissive: theme.world.roadGlow, emissiveIntensity: this.themeId === 'anime' ? 0.14 : 0.5 }), this.curvedWorldOptions),
      neon: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: theme.world.neon, roughness: 0.35, metalness: 0.12, emissive: theme.world.roadGlow, emissiveIntensity: this.themeId === 'anime' ? 0.24 : 0.75 }), this.curvedWorldOptions),
      buildingA: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: theme.world.buildingA, roughness: 0.66, metalness: 0.06, emissive: this.themeId === 'anime' ? 0xe8a8d2 : 0x070b18, emissiveIntensity: this.themeId === 'anime' ? 0.06 : 0.25 }), this.curvedWorldOptions),
      buildingB: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: theme.world.buildingB, roughness: 0.62, metalness: 0.1, emissive: this.themeId === 'anime' ? 0xb2c2ff : 0x080b2d, emissiveIntensity: this.themeId === 'anime' ? 0.06 : 0.22 }), this.curvedWorldOptions),
      treeLeaf: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: theme.world.treeLeaf, roughness: 0.72, metalness: 0.02 }), this.curvedWorldOptions),
      treeTrunk: applyCurvedWorldMaterial(new THREE.MeshStandardMaterial({ color: theme.world.treeTrunk, roughness: 0.82, metalness: 0.01 }), this.curvedWorldOptions)
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

      if (this.themeId === 'anime') {
        for (let side = -1; side <= 1; side += 2) {
          for (let z = -TILE_LENGTH * 0.35; z <= TILE_LENGTH * 0.35; z += 2.8) {
            const petal = new THREE.Mesh(new THREE.CircleGeometry(0.08, 5), this.materials.neon);
            petal.rotation.x = -Math.PI / 2;
            petal.position.set(side * 2.9, 0.04, z + (side === -1 ? 0.6 : -0.6));
            tile.add(petal);
          }
        }
      }

      this.root.add(tile);
      this.tiles.push(tile);
    }
  }

  buildScenery() {
    for (let i = 0; i < BUILDING_COUNT; i += 1) {
      const prop = this.themeId === 'anime' ? this.buildAnimeProp(i) : this.buildNeonProp(i);
      const side = i % 2 === 0 ? -1 : 1;
      prop.position.set(side * this.randomRange(6.5, 14), 0, -this.randomRange(12, TILE_COUNT * TILE_LENGTH));
      applyCurvedWorldToObject(prop, this.curvedWorldOptions);
      this.root.add(prop);
      this.sideProps.push(prop);
    }
  }

  buildNeonProp(i) {
    const prop = new THREE.Group();
    prop.name = `Scenery_${i}`;
    const height = this.randomRange(2.4, 12.5);
    const width = this.randomRange(1.2, 3.6);
    const depth = this.randomRange(1.2, 4.8);

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

    return prop;
  }

  buildAnimeProp(i) {
    const prop = new THREE.Group();
    prop.name = `Scenery_${i}`;
    if (this.rng() > 0.42) {
      const height = this.randomRange(2.6, 8.8);
      const width = this.randomRange(1.6, 3.8);
      const depth = this.randomRange(1.4, 3.8);
      const building = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), this.rng() > 0.5 ? this.materials.buildingA : this.materials.buildingB);
      building.position.y = height * 0.5 - 0.05;
      building.castShadow = true;
      building.receiveShadow = true;
      prop.add(building);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(width * 0.7, this.randomRange(0.7, 1.1), 4), this.materials.neon);
      roof.position.y = height + 0.35;
      roof.rotation.y = Math.PI * 0.25;
      prop.add(roof);
    } else {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.5, 8), this.materials.treeTrunk);
      trunk.position.y = 0.72;
      trunk.castShadow = true;
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.72, 14, 12), this.materials.treeLeaf);
      canopy.scale.set(1.1, 0.9, 1.15);
      canopy.position.y = 1.7;
      canopy.castShadow = true;
      const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.54, 14, 12), this.materials.neon);
      blossom.scale.set(0.9, 0.65, 0.95);
      blossom.position.set(0.24, 1.96, 0.14);
      blossom.castShadow = true;
      prop.add(trunk, canopy, blossom);
    }
    return prop;
  }

  reset() {
    this.tiles.forEach((tile, index) => { tile.position.z = -index * TILE_LENGTH; });
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
