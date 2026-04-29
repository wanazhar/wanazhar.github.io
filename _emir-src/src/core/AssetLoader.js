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
    return this.#createFallbackVehicle(id);
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
    this.#buildRealisticVehicle(root, profile);
    return { root, parts: this.#collectParts(root) };
  }

  #buildRealisticVehicle(root, profile) {
    const d = profile.dimensions;
    const bodyMat = makePaint(profile.visual.color, 0.44, 0.18);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x1b2028, roughness: 0.56, metalness: 0.22 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: profile.visual.glass || 0x6f8fa8, roughness: 0.06, metalness: 0.02, transmission: 0.18, transparent: true, opacity: 0.72, clearcoat: 0.35 });
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.98, d.height * 0.42, d.length * 0.78), bodyMat);
    chassis.name = 'chassis';
    chassis.position.y = d.height * 0.42;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    root.add(chassis);

    const lowerTrim = new THREE.Mesh(new THREE.BoxGeometry(d.width * 1.04, d.height * 0.14, d.length * 0.84), trimMat);
    lowerTrim.name = 'black_lower_sill';
    lowerTrim.position.set(0, d.height * 0.2, 0);
    root.add(lowerTrim);

    const cabinLength = profile.id === 'hatchback' ? 0.4 : profile.id === 'truck' ? 0.24 : profile.id === 'excavator' ? 0.24 : 0.34;
    const cabinZ = profile.id === 'truck' ? -d.length * 0.24 : profile.id === 'hatchback' ? -d.length * 0.02 : -d.length * 0.08;
    const roof = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.58, d.height * 0.14, d.length * cabinLength * 0.86), bodyMat);
    roof.name = 'painted_roof_panel';
    roof.position.set(0, d.height * 1.18, cabinZ + d.length * 0.01);
    roof.castShadow = true;
    root.add(roof);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.54, d.height * 0.36, 0.08), glassMat);
    windshield.name = 'front_windshield_glass';
    windshield.position.set(0, d.height * 0.92, cabinZ - d.length * cabinLength * 0.43);
    windshield.rotation.x = -0.22;
    root.add(windshield);

    const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.5, d.height * 0.32, 0.08), glassMat);
    rearGlass.name = 'rear_window_glass';
    rearGlass.position.set(0, d.height * 0.9, cabinZ + d.length * cabinLength * 0.43);
    rearGlass.rotation.x = 0.18;
    root.add(rearGlass);

    for (const side of [-1, 1]) {
      const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.06, d.height * 0.32, d.length * cabinLength * 0.62), glassMat);
      sideGlass.name = side < 0 ? 'left_side_window_glass' : 'right_side_window_glass';
      sideGlass.position.set(side * d.width * 0.33, d.height * 0.93, cabinZ);
      root.add(sideGlass);

      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.18), trimMat);
      mirror.name = side < 0 ? 'left_side_mirror' : 'right_side_mirror';
      mirror.position.set(side * d.width * 0.56, d.height * 0.78, cabinZ - d.length * cabinLength * 0.45);
      root.add(mirror);
    }

    const hoodLength = profile.id === 'truck' ? 0.24 : profile.id === 'hatchback' ? 0.26 : 0.32;
    const hood = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.84, d.height * 0.18, d.length * hoodLength), bodyMat);
    hood.name = 'low_front_hood';
    hood.position.set(0, d.height * 0.66, -d.length * 0.31);
    hood.rotation.x = -0.08;
    hood.castShadow = true;
    root.add(hood);

    const grille = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.48, d.height * 0.2, 0.07), trimMat);
    grille.name = 'front_grille';
    grille.position.set(0, d.height * 0.46, -d.length * 0.46);
    root.add(grille);

    if (profile.id !== 'truck' && profile.id !== 'excavator') {
      const trunk = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.76, d.height * 0.18, d.length * 0.23), bodyMat);
      trunk.name = profile.id === 'hatchback' ? 'hatch_tailgate' : 'sedan_trunk';
      trunk.position.set(0, d.height * 0.62, d.length * 0.31);
      trunk.castShadow = true;
      root.add(trunk);
    }

    this.#addCommonDetails(root, profile);
    if (profile.id === 'truck') this.#addCargoBed(root, profile);
    if (profile.id === 'offroader') this.#addOffroadKit(root, profile);
    if (profile.id === 'excavator') this.#addExcavatorKit(root, profile);
  }

  #addCommonDetails(root, profile) {
    const d = profile.dimensions;
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x08090b, roughness: 0.82, metalness: 0.02 });
    const sidewallMat = new THREE.MeshStandardMaterial({ color: 0x17191d, roughness: 0.74, metalness: 0.03 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xc8ccd1, roughness: 0.28, metalness: 0.55 });
    const headlightMat = new THREE.MeshStandardMaterial({ color: 0xfff2a6, emissive: 0xffd86b, emissiveIntensity: 0.65, roughness: 0.32 });
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xff4757, emissive: 0xb31b2c, emissiveIntensity: 0.45, roughness: 0.42 });
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x202833, roughness: 0.56, metalness: 0.24 });

    const tireGeo = new THREE.TorusGeometry(profile.wheel.radius * 0.78, profile.wheel.radius * 0.19, 20, 72);
    const treadGeo = new THREE.CylinderGeometry(profile.wheel.radius * 0.78, profile.wheel.radius * 0.78, profile.wheel.width, 72);
    const rimGeo = new THREE.CylinderGeometry(profile.wheel.radius * 0.46, profile.wheel.radius * 0.46, profile.wheel.width * 1.1, 48);
    const hubGeo = new THREE.CylinderGeometry(profile.wheel.radius * 0.16, profile.wheel.radius * 0.16, profile.wheel.width * 1.16, 32);
    const positions = {
      fl: [-profile.axleWidth * 0.5, -d.height * 0.45, -profile.wheelBase * 0.5],
      fr: [profile.axleWidth * 0.5, -d.height * 0.45, -profile.wheelBase * 0.5],
      rl: [-profile.axleWidth * 0.5, -d.height * 0.45, profile.wheelBase * 0.5],
      rr: [profile.axleWidth * 0.5, -d.height * 0.45, profile.wheelBase * 0.5]
    };
    for (const [key, pos] of Object.entries(positions)) {
      const wheel = new THREE.Group();
      wheel.name = `wheel_${key}`;
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.z = Math.PI / 2;

      const tire = new THREE.Mesh(tireGeo, wheelMat);
      tire.name = `round_tire_${key}`;
      tire.rotation.y = Math.PI / 2;
      tire.castShadow = true;
      tire.receiveShadow = true;
      wheel.add(tire);

      const tread = new THREE.Mesh(treadGeo, sidewallMat);
      tread.name = `cylindrical_tire_tread_${key}`;
      tread.rotation.z = Math.PI / 2;
      tread.castShadow = true;
      tread.receiveShadow = true;
      wheel.add(tread);

      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.name = `round_rim_${key}`;
      rim.castShadow = true;
      wheel.add(rim);

      const hub = new THREE.Mesh(hubGeo, rimMat);
      hub.name = `wheel_hub_${key}`;
      hub.castShadow = true;
      wheel.add(hub);
      root.add(wheel);
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
      bumper.name = 'realistic_bumper';
      bumper.position.set(0, d.height * 0.28, z);
      bumper.castShadow = true;
      root.add(bumper);
    }
  }

  #addCargoBed(root, profile) {
    const d = profile.dimensions;
    const bedMat = makePaint(profile.visual.accent || 0x9aa0a6, 0.54, 0.16);
    const bed = new THREE.Mesh(new THREE.BoxGeometry(d.width * 0.9, d.height * 0.42, d.length * 0.42), bedMat);
    bed.name = 'flatbed_cargo_body';
    bed.position.set(0, d.height * 0.72, d.length * 0.2);
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
