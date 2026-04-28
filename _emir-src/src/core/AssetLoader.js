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
    this.#applyToyCarPaint(scene, id);
    this.#addVehicleDetails(scene, id);
    return { root: scene, parts: this.#collectParts(scene) };
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
    this.#buildToyVehicle(root, profile);
    return { root, parts: this.#collectParts(root) };
  }

  #applyToyCarPaint(scene, id) {
    const profile = VEHICLE_PROFILES[id] || VEHICLE_PROFILES.sedan;
    const bodyMat = makePaint(profile.visual.color, 0.42, 0.2);
    const glassMat = new THREE.MeshStandardMaterial({ color: profile.visual.glass || 0x73d2ff, roughness: 0.22, metalness: 0.02, emissive: 0x0b2b42, emissiveIntensity: 0.05 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x151923, roughness: 0.7, metalness: 0.05 });
    scene.traverse((object) => {
      if (!object.isMesh) return;
      const name = object.name.toLowerCase();
      if (name.includes('wheel')) object.material = wheelMat;
      else if (name.includes('cabin') || name.includes('glass') || name.includes('window')) object.material = glassMat;
      else object.material = bodyMat;
    });
  }

  #addVehicleDetails(root, id) {
    const profile = VEHICLE_PROFILES[id] || VEHICLE_PROFILES.sedan;
    const detail = new THREE.Group();
    detail.name = `${id}_better_vehicle_details`;
    this.#addCommonDetails(detail, profile);
    if (id === 'truck') this.#addCargoBed(detail, profile);
    if (id === 'offroader') this.#addOffroadKit(detail, profile);
    if (id === 'excavator') this.#addExcavatorKit(detail, profile);
    root.add(detail);
  }

  #buildToyVehicle(root, profile) {
    const d = profile.dimensions;
    const bodyMat = makePaint(profile.visual.color, 0.38, 0.22);
    const accentMat = makePaint(profile.visual.accent || 0xffffff, 0.5, 0.05);
    const glassMat = new THREE.MeshStandardMaterial({ color: profile.visual.glass || 0x7ed6ff, roughness: 0.2, metalness: 0.04, emissive: 0x102c42, emissiveIntensity: 0.08 });
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(d.width, d.height * 0.7, d.length), bodyMat);
    chassis.name = 'chassis';
    chassis.position.y = 0.45;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    root.add(chassis);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.88, d.height * 0.22, d.length * 0.28), accentMat);
    hood.name = 'painted_hood_stripe';
    hood.position.set(0, d.height * 0.9, -d.length * 0.28);
    hood.castShadow = true;
    root.add(hood);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.64, d.height * 0.72, d.length * 0.34), glassMat);
    cabin.name = 'cabin_glass';
    cabin.position.set(0, d.height * 1.05, -d.length * 0.02);
    cabin.castShadow = true;
    root.add(cabin);

    this.#addCommonDetails(root, profile);
    if (profile.id === 'truck') this.#addCargoBed(root, profile);
    if (profile.id === 'offroader') this.#addOffroadKit(root, profile);
    if (profile.id === 'excavator') this.#addExcavatorKit(root, profile);
  }

  #addCommonDetails(root, profile) {
    const d = profile.dimensions;
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x10131a, roughness: 0.68, metalness: 0.04 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xf7f0d0, roughness: 0.36, metalness: 0.18 });
    const headlightMat = new THREE.MeshStandardMaterial({ color: 0xfff2a6, emissive: 0xffd86b, emissiveIntensity: 0.65, roughness: 0.32 });
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xff4757, emissive: 0xb31b2c, emissiveIntensity: 0.45, roughness: 0.42 });
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x202833, roughness: 0.56, metalness: 0.24 });

    const wheelGeo = new THREE.CylinderGeometry(profile.wheel.radius, profile.wheel.radius, profile.wheel.width, 24);
    const rimGeo = new THREE.CylinderGeometry(profile.wheel.radius * 0.48, profile.wheel.radius * 0.48, profile.wheel.width * 1.04, 18);
    const positions = {
      fl: [-profile.axleWidth * 0.5, -d.height * 0.45, -profile.wheelBase * 0.5],
      fr: [profile.axleWidth * 0.5, -d.height * 0.45, -profile.wheelBase * 0.5],
      rl: [-profile.axleWidth * 0.5, -d.height * 0.45, profile.wheelBase * 0.5],
      rr: [profile.axleWidth * 0.5, -d.height * 0.45, profile.wheelBase * 0.5]
    };
    for (const [key, pos] of Object.entries(positions)) {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.name = `wheel_${key}`;
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      root.add(wheel);

      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.name = `rim_${key}`;
      rim.position.copy(wheel.position);
      rim.rotation.z = Math.PI / 2;
      rim.castShadow = true;
      root.add(rim);
    }

    for (const x of [-d.width * 0.28, d.width * 0.28]) {
      const light = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.08), headlightMat);
      light.name = 'warm_headlight';
      light.position.set(x, d.height * 0.58, -d.length * 0.52 - 0.04);
      root.add(light);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.08), tailMat);
      tail.name = 'red_tail_light';
      tail.position.set(x, d.height * 0.58, d.length * 0.52 + 0.04);
      root.add(tail);
    }

    for (const z of [-d.length * 0.52, d.length * 0.52]) {
      const bumper = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.82, 0.18, 0.16), bumperMat);
      bumper.name = 'chunky_bumper';
      bumper.position.set(0, d.height * 0.28, z);
      bumper.castShadow = true;
      root.add(bumper);
    }
  }

  #addCargoBed(root, profile) {
    const d = profile.dimensions;
    const bedMat = makePaint(0xffb703, 0.52, 0.08);
    const bed = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.86, d.height * 0.5, d.length * 0.34), bedMat);
    bed.name = 'bright_cargo_box';
    bed.position.set(0, d.height * 0.95, d.length * 0.18);
    bed.castShadow = true;
    root.add(bed);
  }

  #addOffroadKit(root, profile) {
    const d = profile.dimensions;
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.58, metalness: 0.2 });
    const rack = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.7, 0.16, d.length * 0.42), rackMat);
    rack.name = 'roof_rack';
    rack.position.set(0, d.height * 1.62, -d.length * 0.04);
    rack.castShadow = true;
    root.add(rack);
  }

  #addExcavatorKit(root, profile) {
    const boomMat = makePaint(0xffc300, 0.48, 0.12);
    const bucketMat = new THREE.MeshStandardMaterial({ color: 0x2d3436, roughness: 0.5, metalness: 0.22 });
    const boom = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.42, 5.2), boomMat);
    boom.name = 'excavator_boom';
    boom.position.set(0, profile.dimensions.height * 1.34, -2.65);
    boom.rotation.x = -0.34;
    boom.castShadow = true;
    root.add(boom);
    const bucket = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.62, 0.82), bucketMat);
    bucket.name = 'excavator_bucket';
    bucket.position.set(0, profile.dimensions.height * 0.82, -5.12);
    bucket.rotation.x = -0.55;
    bucket.castShadow = true;
    root.add(bucket);
  }
}

function makePaint(color, roughness = 0.46, metalness = 0.12) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    metalness,
    clearcoat: 0.55,
    clearcoatRoughness: 0.28
  });
}
