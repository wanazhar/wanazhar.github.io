import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { VEHICLE_PROFILES } from '../physics/VehicleProfiles.js';

export class AssetLoader {
  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.cache = new Map();
    this.assetBase = import.meta.env.BASE_URL || '/';
  }

  async preloadVehicles() {
    await Promise.allSettled(Object.values(VEHICLE_PROFILES).map((profile) => this.loadVehicle(profile.id)));
  }

  async loadVehicle(id) {
    if (this.cache.has(id)) return this.cache.get(id);
    const path = `${this.assetBase}models/vehicles/${id}.glb`;
    const promise = new Promise((resolve) => {
      this.gltfLoader.load(
        path,
        (gltf) => resolve(this.#normaliseVehicleScene(gltf.scene, id)),
        undefined,
        () => resolve(this.#createFallbackVehicle(id))
      );
    });
    this.cache.set(id, promise);
    return promise;
  }

  async createVehicleInstance(id) {
    const template = await this.loadVehicle(id);
    const root = SkeletonUtils.clone(template.root);
    const parts = this.#collectParts(root);
    return { root, parts };
  }

  #normaliseVehicleScene(scene, id) {
    scene.name = `${id}_vehicle_template`;
    scene.traverse((object) => {
      object.castShadow = true;
      object.receiveShadow = true;
      if (object.isMesh && object.material) object.material = object.material.clone();
    });
    const parts = this.#collectParts(scene);
    if (!parts.chassis || Object.keys(parts.wheels).length < 4) return this.#createFallbackVehicle(id);
    return { root: scene, parts };
  }

  #collectParts(root) {
    const parts = { chassis: null, wheels: {} };
    root.traverse((object) => {
      const name = object.name.toLowerCase();
      if (name === 'chassis') parts.chassis = object;
      if (name.includes('wheel_fl')) parts.wheels.fl = object;
      if (name.includes('wheel_fr')) parts.wheels.fr = object;
      if (name.includes('wheel_rl')) parts.wheels.rl = object;
      if (name.includes('wheel_rr')) parts.wheels.rr = object;
    });
    return parts;
  }

  #createFallbackVehicle(id) {
    const profile = VEHICLE_PROFILES[id] || VEHICLE_PROFILES.sedan;
    const root = new THREE.Group();
    root.name = `${id}_fallback_vehicle`;
    const bodyMat = new THREE.MeshStandardMaterial({ color: profile.visual.color, roughness: 0.78, metalness: 0.08 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.92, metalness: 0.02 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xf7f4ed, roughness: 0.62, metalness: 0.05 });
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(profile.dimensions.width, profile.dimensions.height, profile.dimensions.length), bodyMat);
    chassis.name = 'chassis';
    chassis.position.y = 0.4;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    root.add(chassis);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(profile.dimensions.width * 0.62, profile.dimensions.height * 0.55, profile.dimensions.length * 0.34), accentMat);
    cabin.name = 'cabin_voxel';
    cabin.position.set(0, profile.dimensions.height * 0.78, -profile.dimensions.length * 0.05);
    cabin.castShadow = true;
    root.add(cabin);
    const wheelGeo = new THREE.BoxGeometry(profile.wheel.radius * 1.18, profile.wheel.radius * 1.18, profile.wheel.width);
    const positions = {
      fl: [-profile.axleWidth * 0.5, -0.12, -profile.wheelBase * 0.5],
      fr: [profile.axleWidth * 0.5, -0.12, -profile.wheelBase * 0.5],
      rl: [-profile.axleWidth * 0.5, -0.12, profile.wheelBase * 0.5],
      rr: [profile.axleWidth * 0.5, -0.12, profile.wheelBase * 0.5]
    };
    for (const [key, pos] of Object.entries(positions)) {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.name = `wheel_${key}`;
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      root.add(wheel);
    }
    if (id === 'excavator') {
      const boom = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 5.6), bodyMat);
      boom.name = 'excavator_boom_voxel';
      boom.position.set(0, 2.15, -2.9);
      boom.rotation.x = -0.36;
      boom.castShadow = true;
      root.add(boom);
    }
    return { root, parts: this.#collectParts(root) };
  }
}
