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
const CAMERA_ORBIT_KEY_RATE = 2.3;
const CAMERA_ZOOM_RATE = 9;

export class Game {
  constructor(root) {
    this.root = root;
    this.clock = new THREE.Clock();
    this.running = false;
    this.stats = { fps: 0, activeColliders: 0, visibleChunks: 0, vehicle: 'sedan' };
    this.fpsSamples = [];
    this.cameraYawOffset = 0;
    this.cameraZoomTarget = 1;
    this.cameraZoom = 1;
    this.cameraLookAt = new THREE.Vector3();
  }

  async start() {
    await RAPIER.init();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 190, 520);

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
    this.input.bindCameraElement(this.renderer.domElement);
    this.assetLoader = new AssetLoader();
    this.physics = new PhysicsWorld(RAPIER);
    this.garageStore = new GarageStore();

    this.city = new VoxelCity(this.scene);
    await Promise.all([this.city.load(), this.assetLoader.preloadVehicles()]);

    this.colliderManager = new WorldColliderManager({ rapier: RAPIER, world: this.physics.world, spatialHash: this.city.solidSpatialHash, cellSize: this.city.cellSize });
    this.vehicleManager = new VehicleManager({ rapier: RAPIER, scene: this.scene, physics: this.physics, assetLoader: this.assetLoader });

    const persisted = await this.garageStore.load();
    const initialVehicle = persisted?.selected_vehicle || persisted?.selectedVehicle || 'sedan';
    await this.vehicleManager.spawn(initialVehicle);
    this.stats.vehicle = initialVehicle;
    this.colliderManager.update(this.vehicleManager.getPosition(), true);

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

    const debugParams = new URLSearchParams(window.location.search);
    if (debugParams.has('debug')) {
      window.__EMIR_DEBUG__ = {
        vehicle: () => this.vehicleManager.getDebugState(),
        camera: () => this.getCameraDebugState(),
        input: () => ({ ...this.input.state }),
        stats: () => ({ ...this.stats })
      };
    }

    window.addEventListener('resize', () => this.#onResize());
    this.running = true;
    this.renderer.setAnimationLoop(() => this.#tick());
  }

  #setupLighting() {
    const hemi = new THREE.HemisphereLight(0xfff4cc, 0x65c18c, 2.2);
    this.scene.add(hemi);
    const fill = new THREE.AmbientLight(0xfff1c7, 0.75);
    this.scene.add(fill);
    const key = new THREE.DirectionalLight(0xfff0b3, 3.1);
    key.position.set(-42, 82, 36);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -140; key.shadow.camera.right = 140; key.shadow.camera.top = 140; key.shadow.camera.bottom = -140;
    key.shadow.camera.near = 5; key.shadow.camera.far = 220;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x6cc6ff, 1.15);
    rim.position.set(44, 26, -58);
    this.scene.add(rim);
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(8, 24, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd166 })
    );
    sun.name = 'warm_sky_sun';
    sun.position.set(-120, 118, -210);
    this.scene.add(sun);
    const ambientGrid = new THREE.GridHelper(640, 160, 0xffffff, 0x7cbf6d);
    ambientGrid.name = 'subtle_grass_grid';
    ambientGrid.position.y = -0.01;
    ambientGrid.material.opacity = 0.12;
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
    if (this.input.consumePressed('resetCamera')) this.#focusCamera();
    if (this.input.consumePressed('toggleUi')) this.ui.toggleHidden();
    this.cameraYawOffset += this.input.state.cameraOrbit + this.input.state.cameraOrbitKeyboard * CAMERA_ORBIT_KEY_RATE * dt;
    this.cameraZoomTarget = THREE.MathUtils.clamp(this.cameraZoomTarget + this.input.state.cameraZoom * dt * CAMERA_ZOOM_RATE, 0.58, 1.62);
    const preStepPosition = this.vehicleManager.getPosition();
    this.colliderManager.update(preStepPosition);
    this.stats.activeColliders = this.colliderManager.activeCount;
    this.vehicleManager.update(dt, this.input.state);
    this.physics.step(dt);
    this.vehicleManager.syncAfterPhysics(dt);
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
    const forward = this.vehicleManager.getForwardVector().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYawOffset);
    this.cameraZoom = THREE.MathUtils.lerp(this.cameraZoom, this.cameraZoomTarget, 1 - Math.pow(0.00005, dt));
    const chaseDistance = Math.max(11, 16 - this.vehicleManager.getSpeedKph() * 0.035) * this.cameraZoom;
    const cameraHeight = THREE.MathUtils.lerp(5.4, 11.6, this.cameraZoom);
    const desired = target.clone().add(CAMERA_TARGET_OFFSET).addScaledVector(forward, -chaseDistance).add(new THREE.Vector3(0, cameraHeight, 0));
    this.camera.position.lerp(desired, 1 - Math.pow(0.00025, dt));
    const lookAt = target.clone().add(CAMERA_TARGET_OFFSET).addScaledVector(forward, 4.5);
    this.cameraLookAt.lerp(lookAt, 1 - Math.pow(0.0001, dt));
    this.camera.lookAt(this.cameraLookAt);
  }

  #focusCamera() {
    this.cameraYawOffset = 0;
    this.cameraZoomTarget = 1;
  }

  getCameraDebugState() {
    return {
      yawOffset: this.cameraYawOffset,
      zoom: this.cameraZoom,
      zoomTarget: this.cameraZoomTarget,
      position: this.camera ? this.camera.position.toArray() : [0, 0, 0],
      lookAt: this.cameraLookAt.toArray()
    };
  }

  #onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  }
}
