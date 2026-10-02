import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { InputController } from './InputController.js';
import { PhysicsWorld } from '../physics/PhysicsWorld.js';
import { VehiclePhysics } from '../physics/VehiclePhysics.js';
import { buildVehicleVisual } from '../physics/VehicleModels.js';
import { VEHICLE_PROFILES } from '../physics/VehicleProfiles.js';
import { VoxelCity } from '../world/VoxelCity.js';
import { TerrainCollider } from '../world/TerrainCollider.js';
import { WorldColliderManager } from '../world/WorldColliderManager.js';
import { TrafficSystem } from '../world/Traffic.js';
import { UIManager } from '../ui/UIManager.js';
import { GarageStore } from '../services/GarageStore.js';

// Spawn on the north-south avenue south of the towers, facing them.
const SPAWN = { x: 0, z: 8, facingX: -0.61, facingZ: -0.79 };

const CAMERA_FOCUS_HEIGHT = 1.5;
const CAMERA_PITCH_DEFAULT = 0.28;
const CAMERA_PITCH_MIN = 0.04;
const CAMERA_PITCH_MAX = 1.25;
// The default chase boom, restored whenever you come back to the car.
const CAMERA_CHASE_DISTANCE = 19;
const CAMERA_DISTANCE_MIN = 6;
// Far enough to pull back and take in the skyline, towers included.
const CAMERA_DISTANCE_MAX = 320;
// Above this the boom is treated as an overview: buildings no longer clip it short.
const CAMERA_OVERVIEW_DISTANCE = 65;

function damp(current, target, lambda, dt) {
  return target + (current - target) * Math.exp(-lambda * dt);
}

// Damp along the shortest way round the circle so the camera never unwinds the long way.
function dampAngle(current, target, lambda, dt) {
  let delta = (target - current) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return current + delta * (1 - Math.exp(-lambda * dt));
}

export class Game {
  constructor(root) {
    this.root = root;
    this.clock = new THREE.Clock();
    this.elapsed = 0;
    this.running = false;
    this.score = 0;
    this.coinsCollected = 0;
    this.landmarksFound = new Set();
    this.airtimeBest = 0;
    this.stats = { fps: 0, speed: 0, vehicle: 'sedan' };
    this.fpsSamples = [];
    this.cameraFollowYaw = 0;
    this.cameraOrbitOffset = 0;
    this.cameraPitch = CAMERA_PITCH_DEFAULT;
    this.cameraReverseBlend = 0;
    this.cameraDistance = CAMERA_CHASE_DISTANCE;
    this.cameraDistanceTarget = CAMERA_CHASE_DISTANCE;
    this.cameraLook = new THREE.Vector3();
    this.cameraPosition = new THREE.Vector3();
    this.cameraFocus = new THREE.Vector3();
    this.cameraShake = 0;
    this.cameraShakeSeed = Math.random() * 100;
    this.cameraVerticalVelocity = 0;
    this.cameraLookAhead = new THREE.Vector3();
    // 'follow' keeps the camera locked to the car; 'free' lets it roam the whole city.
    this.cameraMode = 'follow';
    this.driftActive = false;
  }

  async start() {
    await RAPIER.init();
    this.rapierRef = RAPIER;
    const debugParams = new URLSearchParams(window.location.search);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.4, 4000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.root.appendChild(this.renderer.domElement);

    this.#setupSkyAndLights();

    this.input = new InputController(window);
    this.input.bindCameraElement(this.renderer.domElement);
    this.garageStore = new GarageStore();

    this.city = new VoxelCity(this.scene);
    await this.city.load();
    this.physics = new PhysicsWorld(RAPIER);
    this.terrainCollider = new TerrainCollider({ rapier: RAPIER, world: this.physics.world, layout: this.city.layout }).build();
    this.colliderRecords = this.city.layout.colliders;
    this.colliderManager = new WorldColliderManager({
      rapier: RAPIER,
      world: this.physics.world,
      records: this.colliderRecords,
      radius: 70
    });
    this.traffic = new TrafficSystem({
      scene: this.scene,
      layout: this.city.layout,
      count: Number(debugParams.get('trafficcount') ?? 34)
    }).build();

    this.vehicle = null;
    this.vehicleVisual = null;
    const persisted = await this.garageStore.load();
    const initialVehicle = persisted?.selected_vehicle || persisted?.selectedVehicle || 'sedan';
    this.setVehicle(initialVehicle);
    this.colliderManager.update(this.vehicle.getPosition());
    this.stats.activeColliders = this.colliderManager.activeCount;

    this.ui = new UIManager({
      input: this.input,
      garageStore: this.garageStore,
      game: this,
      onVehicleSelect: (id) => this.setVehicle(id),
      onReset: () => this.resetVehicle(),
      onCameraMode: (action) => this.setCameraMode(action)
    });
    this.ui.mount(document.body);

    if (debugParams.has('debug')) {
      window.__EMIR_DEBUG__ = {
        vehicle: () => this.vehicle?.getDebugState(),
        input: () => ({
          ...this.input.state,
          stickSteer: this.input.stickSteer,
          pressed: [...this.input.pressed],
          touch: [...this.input.touch.keys()],
          keys: [...this.input.keys]
        }),
        simulate: (frames = 60, overrides = {}) => {
          for (let i = 0; i < frames; i += 1) {
            // Runs the same order the real tick does, so camera and input behaviour is covered.
            this.input.update();
            const command = { ...this.input.state, ...overrides };
            this.vehicle.step(1 / 60, command);
            this.physics.step(1 / 60);
            this.#updateCamera(1 / 60, this.vehicle.getPosition());
          }
          return this.vehicle.getDebugState();
        },
        tickCamera: (frames = 60) => {
          for (let i = 0; i < frames; i += 1) {
            this.input.update();
            this.#updateCamera(1 / 60, this.vehicle.getPosition());
          }
          return { mode: this.cameraMode, distance: Number(this.cameraDistance.toFixed(1)), focus: { x: Number(this.cameraFocus.x.toFixed(1)), z: Number(this.cameraFocus.z.toFixed(1)) } };
        },
        world: () => {
          const batches = {};
          this.scene.traverse((o) => { if (o.name) batches[o.name] = o.count ?? 1; });
          const props = {};
          for (const prop of this.city.layout.props) props[prop.kind] = (props[prop.kind] || 0) + 1;
          const furniture = {};
          for (const item of this.city.layout.streetFurniture) furniture[item.kind] = (furniture[item.kind] || 0) + 1;
          return { props, furniture, batches, shake: Number(this.cameraShake.toFixed(2)), lookAhead: Number(this.cameraLookAhead.length().toFixed(1)) };
        },
        traffic: () => ({
          count: this.traffic?.cars?.length ?? 0,
          sample: (this.traffic?.cars ?? []).slice(0, 3).map((car) => ({
            axis: car.axis,
            x: Number(car.x.toFixed(1)),
            z: Number(car.z.toFixed(1)),
            speed: Number(car.speed.toFixed(1)),
            turning: Boolean(car.turn),
            onRoad: this.city.layout.isRoadCoord(car.x, car.z)
          }))
        }),
        camera: () => ({
          yaw: Number(this.cameraFollowYaw.toFixed(3)),
          pitch: Number(this.cameraPitch.toFixed(3)),
          distance: Number(this.cameraDistance.toFixed(1)),
          target: Number(this.cameraDistanceTarget.toFixed(1)),
          mode: this.cameraMode,
          orbit: Number(this.cameraOrbitOffset.toFixed(3)),
          yawError: Number((((this.#behindYaw() - this.cameraFollowYaw) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI).toFixed(3)),
          focus: { x: Number(this.cameraFocus.x.toFixed(1)), z: Number(this.cameraFocus.z.toFixed(1)) },
          position: { x: Number(this.camera.position.x.toFixed(1)), y: Number(this.camera.position.y.toFixed(1)), z: Number(this.camera.position.z.toFixed(1)) }
        }),
        stats: () => ({ ...this.stats, score: this.score, coins: this.coinsCollected, landmarks: [...this.landmarksFound], tickErrors: this.tickErrors ?? 0 }),
        groundAt: ({ x, z }) => ({
          layout: this.city.layout.groundHeight(x, z),
          collider: this.terrainCollider.heightAt(x, z)
        }),
      };
    }

    window.addEventListener('resize', () => this.#onResize());
    this.running = !debugParams.has('paused');
    this.clock.start();
    this.renderer.setAnimationLoop(() => this.#tickGuarded());
  }

  setVehicle(profileId) {
    const profile = VEHICLE_PROFILES[profileId] ?? VEHICLE_PROFILES.sedan;
    if (this.vehicleVisual) {
      this.scene.remove(this.vehicleVisual.root);
    }
    if (this.vehicle) {
      this.vehicle.dispose();
    }
    this.vehicleVisual = buildVehicleVisual(profile);
    this.scene.add(this.vehicleVisual.root);
    this.vehicle = new VehiclePhysics({
      rapier: RAPIER,
      world: this.physics.world,
      scene: this.scene,
      layout: this.city.layout,
      profile,
      onImpact: ({ speed, airTime }) => this.#onLanding(speed, airTime)
    });
    this.vehicle.setVisual(this.vehicleVisual);
    // Spawn just clear of the ground so the suspension settles onto its springs.
    const restHeight = profile.dimensions.height * 0.45 + profile.wheel.radius;
    const groundY = this.city.layout.groundHeight(SPAWN.x, SPAWN.z);
    const spawnY = groundY + restHeight + 0.35;
    if (!Number.isFinite(spawnY)) {
      console.warn('Game: non-finite spawn', { SPAWN, groundY, profile: profile.id, dims: profile.dimensions, susp: profile.suspension, wheel: profile.wheel });
    }
    // Face north-west so the Petronas towers are the first thing the driver sees.
    const heading = Math.atan2(SPAWN.facingX ?? 0, SPAWN.facingZ ?? 1);
    this.vehicle.spawn({ x: SPAWN.x, y: spawnY, z: SPAWN.z, heading });
    const probe = this.vehicle.getPosition();
    if (!Number.isFinite(probe.x) || !Number.isFinite(probe.y) || !Number.isFinite(probe.z)) {
      console.warn('Game: vehicle non-finite immediately after spawn', { probe, heading, spawnY });
    }
    this.#snapCameraBehind();
    this.stats.vehicle = profileId;
    this.garageStore.updateLocalState?.({ selected_vehicle: profileId, selectedVehicle: profileId });
  }

  resetVehicle() {
    if (!this.vehicle) return;
    const position = this.vehicle.getPosition();
    const y = this.terrainCollider.heightAt(position.x, position.z) + 3;
    this.vehicle.reset({ x: position.x, y, z: position.z, heading: this.vehicle.heading });
  }

  /**
   * Return to the driving view: locked to the car, from directly behind, at the normal chase
   * distance. Without restoring the boom the camera would sit wherever the free look left it and
   * the car would still be a speck, which looks like the button did nothing.
   */
  recenterCamera() {
    this.cameraMode = 'follow';
    this.cameraDistanceTarget = CAMERA_CHASE_DISTANCE;
    this.cameraDistance = CAMERA_CHASE_DISTANCE;
    this.#snapCameraBehind();
    this.ui?.showToast?.('Camera: follow');
  }

  /** Detach from the car, keeping the current view so nothing jumps. */
  enterFreeLook() {
    if (this.cameraMode === 'free') return;
    this.cameraMode = 'free';
    const p = this.vehicle.getPosition();
    this.cameraFocus.set(p.x, p.y + CAMERA_FOCUS_HEIGHT, p.z);
    this.ui?.showToast?.('Camera: free');
  }

  toggleCameraMode() {
    if (this.cameraMode === 'follow') this.enterFreeLook();
    else this.recenterCamera();
  }

  setCameraMode(action) {
    if (action === 'free') this.enterFreeLook();
    else if (action === 'toggle') this.toggleCameraMode();
    else this.recenterCamera();
  }

  // Drop the camera straight behind the car, used on spawn, reset and mode changes so the view
  // never eases in from wherever it happened to be.
  /** Yaw that places the camera directly behind the car, shared by the snap and the follow rig. */
  #behindYaw() {
    const forward = this.vehicle.getForwardVector();
    return Math.atan2(forward.x, forward.z) + Math.PI;
  }

  #snapCameraBehind() {
    this.cameraFollowYaw = this.#behindYaw();
    this.cameraOrbitOffset = 0;
    this.cameraReverseBlend = 0;
    this.cameraPitch = CAMERA_PITCH_DEFAULT;
    const carPosition = this.vehicle.getPosition();
    this.cameraFocus.set(carPosition.x, carPosition.y + CAMERA_FOCUS_HEIGHT, carPosition.z);
    const horizontal = Math.cos(this.cameraPitch) * this.cameraDistance;
    this.camera.position.set(
      carPosition.x + Math.sin(this.cameraFollowYaw) * horizontal,
      carPosition.y + CAMERA_FOCUS_HEIGHT + Math.sin(this.cameraPitch) * this.cameraDistance,
      carPosition.z + Math.cos(this.cameraFollowYaw) * horizontal
    );
    this.cameraLook.copy(this.cameraFocus);
  }

  #setupSkyAndLights() {
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(1600, 24, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          top: { value: new THREE.Color(0x2f7fd4) },
          horizon: { value: new THREE.Color(0xcfe6f7) },
          bottom: { value: new THREE.Color(0xf6e7cf) }
        },
        vertexShader: `
          varying vec3 vWorld;
          void main() {
            vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 top;
          uniform vec3 horizon;
          uniform vec3 bottom;
          varying vec3 vWorld;
          void main() {
            float h = normalize(vWorld).y;
            vec3 color = mix(horizon, top, clamp(pow(max(h, 0.0), 0.55), 0.0, 1.0));
            color = mix(color, bottom, clamp(-h * 1.6, 0.0, 1.0));
            gl_FragColor = vec4(color, 1.0);
          }
        `
      })
    );
    sky.name = 'sky_dome';
    this.scene.add(sky);
    this.sky = sky;
    this.scene.fog = new THREE.Fog(0xbcd7ec, 180, 1150);

    const hemi = new THREE.HemisphereLight(0xdcecff, 0x7d8a6a, 1.25);
    this.scene.add(hemi);
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff2d8, 2.6);
    sun.position.set(-120, 190, 90);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 20;
    sun.shadow.camera.far = 700;
    sun.shadow.camera.left = -90;
    sun.shadow.camera.right = 90;
    sun.shadow.camera.top = 90;
    sun.shadow.camera.bottom = -90;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.6;
    this.scene.add(sun);
    this.sun = sun;
    this.hemi = hemi;
    this.ambient = ambient;

    const sunDisc = new THREE.Mesh(
      new THREE.SphereGeometry(26, 18, 12),
      new THREE.MeshBasicMaterial({ color: 0xfff2c0, fog: false })
    );
    sunDisc.position.set(-420, 320, 640);
    this.scene.add(sunDisc);

    // Metal and glass have no diffuse term, so without something to reflect they render black
    // on any face turned away from the sun. Bake the sky gradient (plus the sun) into an
    // environment map and hand it to the scene.
    const envScene = new THREE.Scene();
    envScene.add(sky.clone());
    const envSun = new THREE.Mesh(
      new THREE.SphereGeometry(140, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xfff6dc, fog: false })
    );
    envSun.position.set(-420, 320, 640);
    envScene.add(envSun);
    const ground = new THREE.Mesh(
      new THREE.SphereGeometry(900, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0x6f7d5a, side: THREE.BackSide, fog: false })
    );
    ground.position.y = -700;
    envScene.add(ground);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    pmrem.dispose();
  }

  // A non-finite body means an integration step went wrong: put the car back somewhere sane so
  // the frame can continue, and rebuild the world if it keeps happening.
  #vehicleFinite(phase) {
    if (!this.vehicle) return true;
    const p = this.vehicle.getPosition();
    const v = this.vehicle.getVelocity();
    const w = this.vehicle.getAngularVelocity();
    const ok = Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z)
      && Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z)
      && Number.isFinite(w.x) && Number.isFinite(w.y) && Number.isFinite(w.z);
    if (ok) {
      this.nanStreak = 0;
      return true;
    }
    this.nanStreak = (this.nanStreak ?? 0) + 1;
    if (this.nanStreak === 1) console.warn(`Vehicle physics recovered from non-finite state (${phase})`);
    this.vehicle.recover();
    this.vehicle.syncVisual();
    if (this.nanStreak >= 3 && (this.rebuilds ?? 0) < 3) this.#rebuildPhysics();
    return false;
  }

  // Last resort for a world that stays non-finite: discard it, rebuild the terrain and streaming
  // colliders against a fresh one, and put the car back at the spawn.
  #rebuildPhysics() {
    this.rebuilds = (this.rebuilds ?? 0) + 1;
    // Detach first: the vehicle's body/collider handles belong to the outgoing world and using
    // them against the new one would hand wasm a null pointer.
    this.vehicle.detach();
    const world = this.physics.rebuild();
    this.terrainCollider = new TerrainCollider({
      rapier: RAPIER,
      world,
      layout: this.city.layout
    }).build();
    this.colliderManager = new WorldColliderManager({
      rapier: RAPIER,
      world,
      records: this.colliderRecords,
      radius: 70
    });
    this.traffic = new TrafficSystem({
      scene: this.scene,
      layout: this.city.layout
    }).build();
    this.vehicle.world = world;
    const spawnY = this.city.layout.groundHeight(SPAWN.x, SPAWN.z) + 2.2;
    const heading = Math.atan2(SPAWN.facingX, SPAWN.facingZ);
    this.vehicle.spawn({ x: SPAWN.x, y: spawnY, z: SPAWN.z, heading });
    this.#snapCameraBehind();
    this.colliderManager.update(this.vehicle.getPosition());
    this.stats.activeColliders = this.colliderManager.activeCount;
    this.nanStreak = 0;
    console.warn('Game: rebuilt physics world', this.rebuilds);
  }

  /** Kick the camera — used for hard landings and traffic collisions. */
  addCameraShake(strength) {
    this.cameraShake = Math.min(1.2, this.cameraShake + strength);
  }

  #onLanding(speed, airTime) {
    const hit = Math.min(1, speed / 22 + airTime * 0.2);
    this.addCameraShake(hit * 0.9);
    const bonus = Math.round(speed * 6 + airTime * 22);
    if (bonus > 0) {
      this.score += bonus;
      this.airtimeBest = Math.max(this.airtimeBest, airTime);
      this.ui?.showToast?.(`Landing! +${bonus}`);
    }
    this.ui?.setImpact?.(hit);
  }

  #tick() {
    if (!this.running) return;
    const rawDt = Math.min(this.clock.getDelta(), 0.1);
    this.elapsed += rawDt;
    this.#updateFps(rawDt);
    this.input.update();

    if (this.input.consumePressed('reset')) this.resetVehicle();
    if (this.input.consumePressed('resetCamera') || this.input.consumePressed('recenterCamera')) this.recenterCamera();
    if (this.input.consumePressed('cameraToggle')) this.toggleCameraMode();
    if (this.input.consumePressed('toggleUi')) this.ui.toggleHidden();

    this.colliderManager.update(this.vehicle.getPosition());
    this.stats.activeColliders = this.colliderManager.activeCount;
    this.vehicle.step(rawDt, this.input.state);
    const vehicleOk = this.#vehicleFinite('vehicle-step');
    this.physics.step(rawDt);
    const worldOk = this.#vehicleFinite('world-step');
    if (vehicleOk && worldOk) this.nanStreak = 0;

    const position = this.vehicle.getPosition();
    this.traffic.update(rawDt, position, this.vehicle);
    if (this.vehicle.impactPulse > 0) {
      this.addCameraShake(this.vehicle.impactPulse * 0.55);
      if (this.vehicle.impactPulse > 0.3) this.ui?.setImpact?.(this.vehicle.impactPulse);
      this.vehicle.impactPulse = 0;
    }
    const collected = this.city.collectCoins(position, 4.4);
    if (collected > 0) {
      this.coinsCollected += collected;
      this.score += collected * 25;
      this.ui?.showToast?.(`+${collected * 25} coin${collected > 1 ? 's' : ''}`);
    }
    this.#checkLandmarks(position);

    this.city.update(this.elapsed);
    this.#updateCamera(rawDt, position);
    this.#updateSunTarget(position);
    this.sky.position.set(this.camera.position.x, 0, this.camera.position.z);

    this.stats.speed = this.vehicle.getSpeedKph();
    this.driftActive = this.vehicle.isSliding();
    this.ui.update(rawDt);
    this.renderer.render(this.scene, this.camera);
  }

  #tickGuarded() {
    try {
      this.#tick();
    } catch (error) {
      this.tickErrors = (this.tickErrors ?? 0) + 1;
      if (this.tickErrors <= 2) console.error('Game loop error', error?.stack || error);
    }
  }

  #checkLandmarks(position) {
    const nearest = this.city.nearestLandmark(position);
    if (!nearest) return;
    if (nearest.distance < nearest.landmark.radius * 0.7 && !this.landmarksFound.has(nearest.landmark.id)) {
      this.landmarksFound.add(nearest.landmark.id);
      this.score += 250;
      this.ui?.showToast?.(`${nearest.landmark.name} discovered! +250`);
    }
  }

  #updateFps(dt) {
    if (dt <= 0) return;
    this.fpsSamples.push(1 / dt);
    if (this.fpsSamples.length > 40) this.fpsSamples.shift();
    this.stats.fps = Math.round(this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length);
  }

  #updateCamera(dt, position) {
    const input = this.input.state;
    const vehicle = this.vehicle;
    const free = this.cameraMode === 'free';

    // A drag of N pixels should always turn the view the same amount, so orbit and pitch come
    // straight from the pixel deltas rather than being scaled by frame time.
    this.cameraOrbitOffset += input.cameraOrbit + input.cameraOrbitKeyboard * 1.9 * dt;
    this.cameraPitch = THREE.MathUtils.clamp(
      this.cameraPitch + input.cameraPitch,
      CAMERA_PITCH_MIN,
      CAMERA_PITCH_MAX
    );
    // Zoom only changes the boom length — it never moves the focus — and is multiplicative so a
    // few notches travel from bumper view out to a whole-city view.
    const zoomed = this.cameraDistanceTarget * Math.exp(input.cameraZoom * 0.22);
    this.cameraDistanceTarget = THREE.MathUtils.clamp(zoomed, CAMERA_DISTANCE_MIN, CAMERA_DISTANCE_MAX);
    this.cameraDistance = damp(this.cameraDistance, this.cameraDistanceTarget, 7, dt);

    const speed = vehicle.getSpeedKph();
    const reversing = vehicle.forwardSpeed < -1.2;
    this.cameraReverseBlend = damp(this.cameraReverseBlend, reversing && !free ? 1 : 0, 4.5, dt);

    if (free) {
      this.#panFreeFocus(input, dt);
      this.cameraLookAhead.set(0, 0, 0);
    } else {
      // Aim a little ahead of the car so you look where you are going rather than at the bonnet.
      const velocity = vehicle.getVelocity();
      const lead = Math.min(Math.hypot(velocity.x, velocity.z) * 0.55, 14);
      const forward = vehicle.getForwardVector();
      this.cameraLookAhead.set(forward.x * lead, 0, forward.z * lead);
      const target = new THREE.Vector3(
        position.x + this.cameraLookAhead.x * 0.6,
        position.y + CAMERA_FOCUS_HEIGHT,
        position.z + this.cameraLookAhead.z * 0.6
      );
      const lambda = 6 + Math.min(speed / 12, 1) * 8;
      this.cameraFocus.lerp(target, 1 - Math.exp(-lambda * dt));
      this.cameraFollowYaw = dampAngle(this.cameraFollowYaw, this.#behindYaw(), 3.4, dt);
      this.cameraOrbitOffset = damp(this.cameraOrbitOffset, 0, 0.45 + Math.min(speed / 45, 1) * 3.2, dt);
    }

    const yaw = this.cameraFollowYaw + this.cameraOrbitOffset + this.cameraReverseBlend * Math.PI;
    const pitch = this.cameraPitch + this.cameraReverseBlend * 0.14;
    const speedStretch = free ? 1 : 1 + Math.min(speed / 130, 1) * 0.26;
    // A tall narrow viewport has a much tighter horizontal field of view, so pull the boom back or
    // the car fills the screen on a portrait phone.
    const aspect = this.camera.aspect || 1.6;
    const aspectStretch = THREE.MathUtils.clamp(1.45 / Math.max(aspect, 0.35), 1, 1.8);
    const distance = this.cameraDistance * speedStretch * aspectStretch;

    const focus = this.cameraFocus;
    const cosPitch = Math.cos(pitch);
    const desired = new THREE.Vector3(
      focus.x + Math.sin(yaw) * distance * cosPitch,
      focus.y + Math.sin(pitch) * distance,
      focus.z + Math.cos(yaw) * distance * cosPitch
    );

    // Never let the camera sink under the road...
    const groundY = this.city.layout.groundHeight(desired.x, desired.z) + 1.7;
    if (desired.y < groundY) desired.y = groundY;

    // ...or push through a building: shorten the boom to the first obstruction. Pulled-back
    // overview shots are meant to look over the rooftops, so they are exempt.
    const overview = distance > CAMERA_OVERVIEW_DISTANCE;
    const clear = overview ? 1 : this.colliderManager.clearFraction(focus, desired, 0.9);
    if (clear < 1) {
      desired.set(
        focus.x + (desired.x - focus.x) * clear,
        focus.y + (desired.y - focus.y) * clear,
        focus.z + (desired.z - focus.z) * clear
      );
      desired.y = Math.max(desired.y, this.city.layout.groundHeight(desired.x, desired.z) + 1.4);
    } else if (overview) {
      // Pulled back this far the boom skips building collision, so rise with the distance instead
      // and look over the rooftops rather than through them.
      desired.y = Math.max(desired.y, focus.y + distance * 0.2);
    }

    this.cameraPosition.copy(desired);
    // Follow horizontally with pace, but ease the height gently so kerbs, crests and landings do
    // not jolt the view. A blocked boom snaps in on both axes.
    const horizontalLambda = clear < 1 ? 26 : (free ? 14 : 9);
    const verticalLambda = clear < 1 ? 26 : (free ? 14 : 4.5);
    const follow = 1 - Math.exp(-horizontalLambda * dt);
    const rise = 1 - Math.exp(-verticalLambda * dt);
    this.camera.position.x += (this.cameraPosition.x - this.camera.position.x) * follow;
    this.camera.position.z += (this.cameraPosition.z - this.camera.position.z) * follow;
    this.camera.position.y += (this.cameraPosition.y - this.camera.position.y) * rise;

    // Landing and impact shake, decaying quickly.
    if (this.cameraShake > 0.001) {
      this.cameraShake = Math.max(0, this.cameraShake - dt * 2.4);
      const t = this.elapsed * 46 + this.cameraShakeSeed;
      const amp = this.cameraShake * 0.5;
      this.camera.position.x += Math.sin(t * 1.7) * amp;
      this.camera.position.y += Math.sin(t * 2.3 + 1.1) * amp;
      this.camera.position.z += Math.cos(t * 1.3 + 0.6) * amp;
    }

    const look = focus.clone();
    look.y += free ? 0.4 : 1.0;
    // Look slightly ahead of the car when driving, dead at it otherwise.
    look.x += this.cameraLookAhead.x;
    look.z += this.cameraLookAhead.z;
    this.cameraLook.lerp(look, 1 - Math.exp(-12 * dt));
    this.camera.lookAt(this.cameraLook);

    // A little lens stretch with speed, only while actually driving.
    const targetFov = free ? 62 : 62 + Math.min(speed / 150, 1) * 9;
    if (Math.abs(this.camera.fov - targetFov) > 0.03) {
      this.camera.fov = damp(this.camera.fov, targetFov, 3, dt);
      this.camera.updateProjectionMatrix();
    }
  }

  /** Slide the free camera's focus across the city, in the plane the view is looking along. */
  #panFreeFocus(input, dt) {
    const panX = input.cameraPanX;
    const panY = input.cameraPanY;
    if (!panX && !panY) return;

    const yaw = this.cameraFollowYaw + this.cameraOrbitOffset;
    // Screen-right and screen-forward on the ground plane.
    const rightX = Math.cos(yaw);
    const rightZ = -Math.sin(yaw);
    const forwardX = -Math.sin(yaw);
    const forwardZ = -Math.cos(yaw);

    // Scale the slide with the boom so a drag covers a similar share of the view at any zoom.
    const scale = Math.max(0.06, this.cameraDistance * 0.0042);
    this.cameraFocus.x += (rightX * panX - forwardX * panY) * scale;
    this.cameraFocus.z += (rightZ * panX - forwardZ * panY) * scale;

    const limit = this.city.layout.cityHalf + 260;
    this.cameraFocus.x = THREE.MathUtils.clamp(this.cameraFocus.x, -limit, limit);
    this.cameraFocus.z = THREE.MathUtils.clamp(this.cameraFocus.z, -limit, limit);
    void dt;
  }

  #updateSunTarget(position) {
    this.sun.position.set(position.x - 120, 190, position.z + 90);
    this.sun.target.position.set(position.x, 0, position.z);
    this.sun.target.updateMatrixWorld();
  }

  #onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  }
}
