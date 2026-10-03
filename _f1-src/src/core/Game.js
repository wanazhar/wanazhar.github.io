/**
 * Renderer, scene and the main game loop.
 *
 * Owns the WebGL context, the cars, the track and the session, and drives
 * everything from a single requestAnimationFrame loop. Physics runs on a fixed
 * timestep with an accumulator so handling never depends on frame rate.
 */

import * as THREE from 'three';

import { buildTrack } from '../track/trackGeometry.js';
import { getCircuit } from '../track/circuits.js';
import { buildCarMesh, buildEnvironment, buildTrackMesh, syncCarMesh } from '../render/TrackMesh.js';
import { RaceSession, SESSION_TYPE, FIXED_TIMESTEP } from '../race/RaceSession.js';
import { CameraRig } from './CameraRig.js';
import { InputController, ACTIONS } from './InputController.js';
import { createRandom } from '../util/math.js';
import { POWERTRAIN } from '../physics/CarPhysics.js';

/** Geometry built from primitives does not need high precision. */
const DEFAULT_FOV = 62;

export class Game {
  constructor(container, options = {}) {
    this.container = container;
    this.onUpdate = options.onUpdate ?? (() => {});
    this.onImpact = options.onImpact ?? (() => {});
    this.onSessionEnd = options.onSessionEnd ?? (() => {});
    this.random = createRandom(options.seed ?? 20240218);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      DEFAULT_FOV,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.4,
      6000
    );

    this.renderer = new THREE.WebGLRenderer({
      // Antialiasing on regardless of device pixel ratio. It used to be switched
      // off above DPR 2, which is exactly backwards: that is most modern phones
      // and every laptop, so the machines that could afford to draw more pixels
      // per sample were the ones told not to. A 320x190 road with no MSAA at 3x
      // density looks far worse than 1.5x with it, and the pixel-ratio cap below
      // is where the cost should be controlled instead.
      antialias: true,
      powerPreference: 'high-performance'
    });
    // Cap the pixel ratio: on a high-DPI phone a full-resolution buffer halves
    // the frame rate for a difference nobody can see at speed.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(container.clientWidth, Math.max(container.clientHeight, 1));
    this.renderer.shadowMap.enabled = true;
    // PCFShadowMap, not PCFSoftShadowMap. Three.js deprecated the soft variant and
    // silently substitutes this one anyway, logging a warning on every renderer
    // construction. The two look near-identical at this shadow-map resolution.
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    // Filmic tone mapping. Without it every lit surface clips straight to white
    // where it exceeds 1.0, which is most of a sunlit white car and all of the
    // specular highlights -- the flat, over-bright look that reads as "cheap 3D".
    // It also gives highlights somewhere to roll off instead of hard-edging.
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this.input = new InputController(window);
    this.cars = [];
    this.carMeshes = new Map();
    this.accumulator = 0;
    this.lastFrame = 0;
    this.running = false;
    this.session = null;
    this.rig = null;
    this.track = null;
    this.trackGroup = null;
    this.environmentGroup = null;
    this.drsAvailable = true;
    this.drsCooldown = 0;
    this.raceTime = 0;
    this.lastLap = Infinity;
    this.bestLap = Infinity;
    this.newLapFlash = 0;
    this.positionFlash = 0;

    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);
    this.resize();
  }

  resize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Load a circuit and set up lighting for its theme.
   *
   * Synchronous, and deliberately so: the geometry build is a few hundred
   * milliseconds of straight-line work with no awaits in it, so splitting it
   * would only add scheduling overhead. Callers that need a progress indicator
   * should use `prepareCircuit`, which runs the phases separately and yields
   * between them.
   */
  loadCircuit(circuitId) {
    const circuit = getCircuit(circuitId);
    this.track = buildTrack(circuit);

    this.#clearGroup('trackGroup');
    this.#clearGroup('environmentGroup');
    this.#clearCars();

    this.trackGroup = buildTrackMesh(this.track);
    this.scene.add(this.trackGroup);
    this.environmentGroup = buildEnvironment(this.track, circuit.theme);
    this.scene.add(this.environmentGroup);

    const theme = circuit.theme;
    this.scene.fog = new THREE.Fog(theme.fog, 320, 1500 * theme.daylight);

    // The sky and environment map are built in #buildLights.
    this.#buildLights(theme);

    this.rig = new CameraRig(this.camera, this.track);
    return this.track;
  }

  /**
   * Load a circuit in phases, reporting progress and yielding to the browser
   * between them.
   *
   * The whole build blocks the main thread for roughly half a second on a
   * desktop and several seconds on a phone. Done in one go, the loading screen is
   * painted once and then freezes -- which reads as the game hanging, and on a
   * slow device is indistinguishable from an actual crash.
   *
   * @param {string} circuitId
   * @param {(phase: string, note: string) => void} [onProgress]
   */
  async prepareCircuit(circuitId, onProgress = () => {}) {
    const circuit = getCircuit(circuitId);

    onProgress('track', 'Surveying the circuit');
    await nextPaint();
    this.track = buildTrack(circuit);

    onProgress('mesh', 'Laying the tarmac');
    await nextPaint();
    this.#clearGroup('trackGroup');
    this.#clearGroup('environmentGroup');
    this.#clearCars();
    this.trackGroup = buildTrackMesh(this.track);
    this.scene.add(this.trackGroup);

    onProgress('scenery', 'Raising the grandstands');
    await nextPaint();
    this.environmentGroup = buildEnvironment(this.track, circuit.theme);
    this.scene.add(this.environmentGroup);

    onProgress('lighting', 'Switching on the lights');
    await nextPaint();
    const theme = circuit.theme;
    this.scene.fog = new THREE.Fog(theme.fog, 320, 1500 * theme.daylight);
    this.#buildLights(theme);
    this.rig = new CameraRig(this.camera, this.track);

    return this.track;
  }

  #buildLights(theme) {
    this.#buildSky(theme);

    if (this.sun) {
      this.scene.remove(this.sun);
      this.sun.dispose?.();
    }
    this.sun = new THREE.DirectionalLight(0xffffff, 2.1 * theme.daylight);
    this.sun.position.set(180, 320, 120);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 40;
    this.sun.shadow.camera.far = 900;
    const extent = 160;
    this.sun.shadow.camera.left = -extent;
    this.sun.shadow.camera.right = extent;
    this.sun.shadow.camera.top = extent;
    this.sun.shadow.camera.bottom = -extent;
    this.sun.shadow.bias = -0.0006;
    this.scene.add(this.sun);

    if (!this.ambient) {
      this.ambient = new THREE.HemisphereLight(0xffffff, 0x2f3b2a, 1.05);
      this.scene.add(this.ambient);
    }
    this.ambient.intensity = 1.05 * theme.daylight;
    this.ambient.color.setHex(theme.sky);
    this.ambient.groundColor.setHex(theme.grass);
  }

  /**
   * Rain particles, built once and shown only when it is raining.
   *
   * Created lazily rather than per session: rebuilding a particle system every
   * time a race starts costs a shader compile, which is exactly the kind of stall
   * the loading screen exists to avoid.
   */
  #ensureRain() {
    if (this.rain) return this.rain;
    const count = 2600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // A column around the camera, tall enough to always contain falling drops.
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = Math.random() * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.rain = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0xcfe0ee,
        size: 0.09,
        transparent: true,
        opacity: 0.35,
        depthWrite: false
      })
    );
    this.rain.frustumCulled = false;
    this.rain.visible = false;
    this.scene.add(this.rain);
    return this.rain;
  }

  /**
   * Gradient sky, and an environment map derived from it.
   *
   * The background used to be a flat colour and `scene.environment` was never
   * set. That second part is the expensive mistake: a `MeshStandardMaterial` with
   * any metalness in it has almost no diffuse response, so with nothing to
   * reflect it renders close to black. Car bodywork, wheel rims and the pylon
   * metal all went flat and dead.
   *
   * A tiny equirectangular gradient (64x128, regenerated per circuit) is run
   * through PMREM once per circuit load. That is enough for the sky gradient to
   * show up in reflections and for metal to pick up a highlight from the sky and
   * a darker tone from the ground, which is what makes it read as painted metal.
   */
  #buildSky(theme) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 128;
    const context = canvas.getContext('2d');

    const sky = new THREE.Color(theme.sky);
    const fog = new THREE.Color(theme.fog);
    const grass = new THREE.Color(theme.grass);

    // Horizon at the vertical centre: sky above, hazy ground below, brightened
    // slightly towards the horizon the way real haze behaves.
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `#${sky.clone().multiplyScalar(0.82).getHexString()}`);
    gradient.addColorStop(0.42, `#${sky.getHexString()}`);
    gradient.addColorStop(0.5, `#${fog.getHexString()}`);
    gradient.addColorStop(0.56, `#${grass.clone().lerp(fog, 0.45).getHexString()}`);
    gradient.addColorStop(1, `#${grass.clone().multiplyScalar(0.7).getHexString()}`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // A soft bright patch where the sun sits, so reflections have a highlight to
    // catch rather than a uniform field.
    const sun = context.createRadialGradient(20, 26, 0, 20, 26, 30);
    sun.addColorStop(0, `rgba(255,252,240,${0.85 * theme.daylight})`);
    sun.addColorStop(1, 'rgba(255,252,240,0)');
    context.fillStyle = sun;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    this.scene.background = texture;

    if (!this.pmrem) {
      this.pmrem = new THREE.PMREMGenerator(this.renderer);
      this.pmrem.compileEquirectangularShader();
    }
    // Discard the previous circuit's map rather than leaking its render target.
    this.envMap?.dispose();
    this.envMap = this.pmrem.fromEquirectangular(texture).texture;
    this.scene.environment = this.envMap;

    texture.dispose();
  }

  /**
   * Apply the session's weather to the world.
   *
   * The sky, fog and lights are rebuilt rather than tinted, because the weather
   * preset carries its own sky and fog colours. Tinting the circuit's daylight sky
   * grey would give a believable-looking dull day; a wet race should look wet.
   *
   * Also drives the rain particles, which only exist while it is actually raining.
   */
  #applyConditions() {
    const weather = this.session?.weatherState;
    if (!weather) return;
    const circuit = getCircuit(this.track.circuit.id);
    const theme = circuit.theme;

    const daylight = weather.daylight * theme.daylight;

    if (weather.id === 'clear') {
      // Already built for this circuit by `prepareCircuit`. Rebuilding the sky
      // regenerates the environment map, which is a render and a shader compile,
      // and doing it a second time on every load roughly doubled the wait.
    } else {
      // Overcast and wet presets carry their own sky and fog. Tinting the
      // circuit's daylight sky grey would give a believable dull afternoon; a wet
      // race should look wet, so the sky is rebuilt rather than tinted.
      this.scene.fog = new THREE.Fog(weather.fog, 320 * weather.visibility, 1500 * daylight * weather.visibility);
      this.#buildSky({ ...theme, daylight });
      this.#buildLights({ ...theme, daylight });
    }

    this.#setRain(weather.spray);
  }

  /** Show, hide and scale the rain particles to match the weather. */
  #setRain(amount) {
    const rain = this.#ensureRain();
    rain.visible = amount > 0.01;
    if (amount > 0.01) rain.material.opacity = 0.18 + amount * 0.42;
  }

  /**
   * Start a session on the loaded circuit.
   * @param {object} options
   * @param {Array} options.entries championship entries
   * @param {'qualifying'|'race'} options.type
   * @param {number} options.totalLaps
   * @param {Array<number>} [options.gridOrder] entry index per grid position
   */
  startSession({ entries, type, totalLaps, gridOrder = null, conditions = null }) {
    this.session = new RaceSession({
      track: this.track,
      entries,
      type,
      totalLaps,
      gridOrder: gridOrder ?? entries.map((entry, index) => ({ entry, grid: index })),
      random: this.random,
      conditions
    });
    this.#applyConditions();
    this.session.onImpact = this.onImpact;

    this.#buildCarMeshes();
    this.rig.setMode(this.rig.mode);
    this.raceTime = 0;
    this.newLapFlash = 0;
    this.positionFlash = 0;
    this.lastLap = this.session.player.timer.lastLap;
    this.bestLap = this.session.player.timer.bestLap;
    return this.session;
  }

  #buildCarMeshes() {
    this.#clearCars();
    for (const car of this.session.cars) {
      const mesh = buildCarMesh(car.entry.colour, car.entry.accent);
      // Shadows only for the cars near the player; the rest are lit by the sun.
      mesh.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = false;
        }
      });
      this.scene.add(mesh);
      this.carMeshes.set(car.entry.short, mesh);
    }
  }

  #clearCars() {
    for (const mesh of this.carMeshes.values()) {
      this.scene.remove(mesh);
      disposeTree(mesh);
    }
    this.carMeshes.clear();
    this.cars = [];
  }

  #clearGroup(key) {
    const group = this[key];
    if (!group) return;
    this.scene.remove(group);
    disposeTree(group);
    this[key] = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastFrame = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      const dt = Math.min((now - this.lastFrame) / 1000, 0.25);
      this.lastFrame = now;
      this.frame(dt);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
  }

  frame(dt) {
    if (!this.session) return;
    this.raceTime += dt;

    if (this.input.consume(ACTIONS.camera)) this.rig.cycleMode();
    if (this.input.consume(ACTIONS.reset)) this.respawnPlayer();
    if (this.input.consume(ACTIONS.pause)) this.onPause?.();

    // The player's road speed is passed in so the steering slew limit can tighten with
    // it. Without that the car is equally twitchy at 40 kph and 300.
    const controls = this.input.read(dt, this.session?.player?.physics?.speed ?? 0);

    // Rain follows the camera and falls. Without this the drops are a static
    // screen-space haze, which reads as fog rather than as weather.
    if (this.rain?.visible) {
      const positions = this.rain.geometry.getAttribute('position');
      const array = positions.array;
      const camera = this.camera.position;
      for (let i = 1; i < array.length; i += 3) {
        array[i] -= 34 * dt;
        if (array[i] < 0) array[i] += 45;
      }
      positions.needsUpdate = true;
      this.rain.position.set(camera.x, 0, camera.z);
    }

    // DRS is only usable on the straights, and only when it is allowed.
    this.drsCooldown = Math.max(0, this.drsCooldown - dt);
    if (controls.drs && this.drsAvailable && this.drsCooldown <= 0) {
      this.#toggleDrs();
    }
    if (controls.ers) this.session.player.physics.deployErs();

    this.session.update(dt, controls);

    const player = this.session.player;

    // DRS is only worth using on a straight, and the flap closes again in the
    // next corner. Availability is derived from the track rather than timed, so
    // it lines up with where the straights actually are.
    const curvature = Math.abs(this.track.samples[player.timer.hintIndex]?.curvature ?? 1);
    this.drsAvailable = curvature < 0.0035 && player.physics.speed > 25;
    this.drsArmed = this.drsAvailable;
    if (!this.drsAvailable && player.physics.drsOpen) {
      player.physics.drsOpen = false;
      this.drsCooldown = 0;
    }

    this.#syncMeshes();
    this.#updateSunFollow(player.physics);

    // Lap-time events for the HUD.
    const lastLap = player.timer.lastLap;
    if (Number.isFinite(lastLap) && lastLap !== this.lastLap) {
      this.lastLap = lastLap;
      this.newLapFlash = 2.2;
      this.onLap?.(lastLap, player.timer.bestLap, player.timer.sectorDeltas());
    }
    this.newLapFlash = Math.max(0, this.newLapFlash - dt);

    const position = this.session.playerPosition;
    if (position !== this.lastPosition) {
      if (this.lastPosition) this.positionFlash = 1.4;
      this.lastPosition = position;
    }
    this.positionFlash = Math.max(0, this.positionFlash - dt);

    this.rig.update(player.physics, dt, this.#leaderPhysics());
    this.onUpdate(this.#telemetry());
  }

  #toggleDrs() {
    const player = this.session.player;
    if (player.physics.drsOpen) return;
    player.physics.drsOpen = true;
    this.drsCooldown = 4.5;
    this.drsAvailable = false;
  }

  /** Put a beached or spun car back on the racing line, facing the right way. */
  respawnPlayer() {
    const player = this.session.player;
    const distance = player.distance;
    const sample = this.track.samples[
      Math.round((distance / this.track.length) * this.track.count) % this.track.count
    ];
    player.physics.reset(sample.lineX, sample.lineZ, sample.heading, 12);
    player.physics.drsOpen = false;
  }

  #syncMeshes() {
    for (const car of this.session.cars) {
      const mesh = this.carMeshes.get(car.entry.short);
      if (!mesh) continue;
      syncCarMesh(mesh, car.physics);
    }
  }

  /** Keep the shadow camera tight around the player for crisp shadows. */
  #updateSunFollow(physics) {
    if (!this.sun) return;
    this.sun.position.set(physics.x + 180, 320, physics.z + 120);
    this.sun.target.position.set(physics.x, 0, physics.z);
    this.sun.target.updateMatrixWorld();
    if (!this.sun.target.parent) this.scene.add(this.sun.target);
  }

  #leaderPhysics() {
    const leader = this.session.order.entries[0];
    const car = this.session.cars.find((candidate) => candidate.entry.short === leader?.id);
    return car?.physics ?? null;
  }

  /** Everything the HUD needs, in one object. */
  #telemetry() {
    const player = this.session.player;
    const physics = player.physics;
    const timer = player.timer;
    const order = this.session.order.entries;
    const position = order.find((entry) => entry.id === player.entry.short);
    const ahead = order[(order.findIndex((entry) => entry.id === player.entry.short)) - 1];

    return {
      speedKph: physics.speedKph,
      gear: physics.gear + 1,
      rpm: physics.rpm,
      revLimit: POWERTRAIN.revLimit,
      ersCharge: physics.ersCharge,
      boosting: physics.boost > 0,
      drsOpen: physics.drsOpen,
      drsAvailable: this.drsArmed,
      lap: Math.min(timer.lap + 1, this.session.totalLaps),
      totalLaps: this.session.totalLaps,
      lastLap: timer.lastLap,
      bestLap: timer.bestLap,
      currentLapTime: timer.lapStarted ? timer.lapTime : 0,
      sectorDeltas: timer.sectorDeltas(),
      invalidLap: timer.invalid,
      position: this.session.playerPosition,
      totalCars: this.session.cars.length,
      gapToLeader: position?.gapToLeader ?? 0,
      gapToAhead: ahead?.secondsToAhead ?? 0,
      progress: timer.progress,
      newLapFlash: this.newLapFlash,
      positionFlash: this.positionFlash,
      onKerb: player.onKerb ?? false,
      brakeLock: physics.brakeLock,
      wheelSlip: physics.wheelSlip,
      frontTemp: physics.frontTemp,
      rearTemp: physics.rearTemp,
      frontWear: physics.frontWear,
      rearWear: physics.rearWear,
      sessionType: this.session.type,
      finished: this.session.finished,
      cameraMode: this.rig.mode
    };
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    this.input.destroy();
    this.#clearCars();
    this.#clearGroup('trackGroup');
    this.#clearGroup('environmentGroup');
    this.envMap?.dispose();
    this.pmrem?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

/**
 * Yield long enough for the browser to actually paint.
 *
 * `requestAnimationFrame` alone is not enough: the callback runs *before* paint,
 * so awaiting one lets the pending work happen first and the screen never
 * updates. Waiting for two frames guarantees the previous frame reached the
 * screen.
 */
function nextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/** Recursively release GPU memory for a subtree. */
function disposeTree(root) {
  root.traverse((node) => {
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of materials) material.dispose();
    }
  });
}

export { SESSION_TYPE, FIXED_TIMESTEP };