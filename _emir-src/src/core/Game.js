import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { InputController } from './InputController.js';
import { AssetLoader } from './AssetLoader.js';
import { PhysicsWorld } from '../physics/PhysicsWorld.js';
import { VehicleManager } from '../physics/VehicleManager.js';
import { VoxelCity } from '../world/VoxelCity.js';
import { WorldColliderManager } from '../world/WorldColliderManager.js';
import { UIManager } from '../ui/UIManager.js';
import { GarageStore } from '../services/GarageStore.js';

const CAMERA_TARGET_OFFSET = new THREE.Vector3(0, 2.2, 0);

export class Game {
  constructor(root) {
    this.root = root;
    this.clock = new THREE.Clock();
    this.running = false;
    this.stats = { fps: 0, activeColliders: 0, visibleChunks: 0, vehicle: 'sedan' };
    this.fpsSamples = [];
  }

  async start() {
    await RAPIER.init();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf7f4ed);
    this.scene.fog = new THREE.Fog(0xf7f4ed, 160, 460);

    this.camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 9, 20);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.root.appendChild(this.renderer.domElement);

    this.#setupLighting();
    this.input = new InputController(window);
    this.assetLoader = new AssetLoader();
    this.physics = new PhysicsWorld(RAPIER);
    this.garageStore = new GarageStore();

    this.city = new VoxelCity(this.scene);
    await Promise.all([this.city.load(), this.assetLoader.preloadVehicles()]);

    this.colliderManager = new WorldColliderManager({ rapier: RAPIER, world: this.physics.world, spatialHash: this.city.spatialHash, cellSize: this.city.cellSize });
    this.vehicleManager = new VehicleManager({ rapier: RAPIER, scene: this.scene, physics: this.physics, assetLoader: this.assetLoader });

    const persisted = await this.garageStore.load();
    const initialVehicle = persisted?.selected_vehicle || persisted?.selectedVehicle || 'sedan';
    await this.vehicleManager.spawn(initialVehicle);
    this.stats.vehicle = initialVehicle;

    this.ui = new UIManager({
      input: this.input,
      garageStore: this.garageStore,
      vehicleManager: this.vehicleManager,
      stats: this.stats,
      onVehicleSelect: async (id) => {
        await this.vehicleManager.spawn(id);
        this.stats.vehicle = id;
        this.garageStore.updateLocalState({ selected_vehicle: id, selectedVehicle: id });
      },
      onReset: () => this.vehicleManager.resetActiveVehicle()
    });
    this.ui.mount(document.body);

    window.addEventListener('resize', () => this.#onResize());
    this.running = true;
    this.renderer.setAnimationLoop(() => this.#tick());
  }

  #setupLighting() {
    const hemi = new THREE.HemisphereLight(0xffffff, 0xd9d0bf, 2.4);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(-38, 72, 32);
    key.castShadow = true;
    key.shadow.mapSize.set(1536, 1536);
    key.shadow.camera.left = -120; key.shadow.camera.right = 120; key.shadow.camera.top = 120; key.shadow.camera.bottom = -120;
    key.shadow.camera.near = 5; key.shadow.camera.far = 180;
    this.scene.add(key);
    const ambientGrid = new THREE.GridHelper(640, 160, 0x111111, 0xd0c8b9);
    ambientGrid.position.y = -0.02;
    ambientGrid.material.opacity = 0.22;
    ambientGrid.material.transparent = true;
    this.scene.add(ambientGrid);
  }

  #tick() {
    if (!this.running) return;
    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 1 / 30);
    this.#updateFps(rawDt);
    this.input.update();
    if (this.input.consumePressed('reset')) this.vehicleManager.resetActiveVehicle();
    if (this.input.consumePressed('toggleUi')) this.ui.toggleHidden();
    this.vehicleManager.update(dt, this.input.state);
    this.physics.step(dt);
    const activePosition = this.vehicleManager.getPosition();
    this.colliderManager.update(activePosition);
    this.stats.activeColliders = this.colliderManager.activeCount;
    this.stats.visibleChunks = this.city.updateVisibility(this.camera, activePosition);
    this.#updateCamera(dt);
    this.ui.update(dt);
    this.renderer.render(this.scene, this.camera);
  }

  #updateFps(dt) {
    if (dt <= 0) return;
    this.fpsSamples.push(1 / dt);
    if (this.fpsSamples.length > 30) this.fpsSamples.shift();
    this.stats.fps = Math.round(this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length);
  }

  #updateCamera(dt) {
    const target = this.vehicleManager.getPositionVector();
    const forward = this.vehicleManager.getForwardVector();
    const chaseDistance = Math.max(11, 16 - this.vehicleManager.getSpeedKph() * 0.035);
    const desired = target.clone().add(CAMERA_TARGET_OFFSET).addScaledVector(forward, -chaseDistance).add(new THREE.Vector3(0, 8.5, 0));
    this.camera.position.lerp(desired, 1 - Math.pow(0.0008, dt));
    const lookAt = target.clone().add(CAMERA_TARGET_OFFSET).addScaledVector(forward, 4.5);
    this.camera.lookAt(lookAt);
  }

  #onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  }
}
