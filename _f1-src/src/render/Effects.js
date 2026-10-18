/**
 * What the tyres leave behind.
 *
 * Smoke off a spinning or locked wheel, dust off a wheel that has left the road, sparks
 * off a barrier, and the black rubber a slide lays down: the four things a driver reads to
 * tell what the car is doing without looking away from the road. None of it touches the
 * physics; all of it is what makes the physics visible from a chase camera.
 *
 * Three draw calls, whatever is happening -- one `Points` for the soft particles (smoke
 * and dust share it, because they never peak together), one for the additive ones
 * (sparks), one mesh for every skid mark in the session. The pools are typed arrays
 * allocated once and every particle field lives in them, so the render loop allocates
 * nothing but a small recipe object per emitted particle. A phone frame is 16ms for the
 * whole scene, and a garbage collection in the middle of a corner reads as a stutter
 * rather than as a dropped frame.
 *
 * Sprites are computed in the fragment shader instead of loaded: a soft round dot is four
 * lines of maths, where a texture would be a file to fetch, decode and upload before the
 * first corner -- and this game has no other files to fetch.
 */

import * as THREE from 'three';
import { clamp } from '../util/math.js';

/** Soft particles: smoke and dust share one pool. */
export const SOFT_CAPACITY = 520;
/** Sparks, which are additive and therefore need a material of their own. */
export const SPARK_CAPACITY = 160;
/** Skid marks, in 2.5m segments: the ring holds about 750m of rubber. */
export const MARK_CAPACITY = 300;
const MARK_STEP = 2.5;
/** Metres. A tyre is 0.3m wide and a strip two thirds of that reads as one mark. */
const MARK_WIDTH = 0.34;
/** Seconds. Long enough that a slide is still there when the car comes round again. */
export const MARK_LIFE = 14;

/**
 * Emission, in particles per second per tyre at full intensity.
 *
 * Low enough that one wheel is a wisp rather than a cloud: smoke at 26/s with a life
 * around a second leaves about 30 particles in the air, and the pool is sized for four
 * cars sliding at once with room to spare. When the pool does fill, new particles are
 * dropped rather than old ones recycled -- an evicted particle that vanishes mid-life
 * reads as a flicker, and the frame where the pool is full is a frame with enough smoke
 * on screen already.
 */
const SMOKE_RATE = 26;
const DUST_RATE = 34;

const SMOKE_LIFE = [0.9, 1.6];
/** Metres across at birth, and metres added over the life as it expands. */
const SMOKE_SIZE = [0.5, 0.95];
const SMOKE_GROWTH = [1.1, 1.8];
const SMOKE_ALPHA = [0.22, 0.38];
const DUST_LIFE = [0.5, 0.9];
const DUST_SIZE = [0.35, 0.6];
const DUST_GROWTH = [0.5, 0.9];
const DUST_ALPHA = [0.3, 0.5];

const SMOKE_COLOUR = [0.84, 0.84, 0.86];
/** Dry run-off, which is what the dust is: grass, gravel and paint all read as this. */
const DUST_COLOUR = [0.62, 0.56, 0.44];
const SPARK_COLOUR = [1, 0.72, 0.28];

/**
 * Rear slip angle past which a tyre is sliding rather than gripping, in radians.
 *
 * The friction curve in `CarPhysics` peaks around 0.1 rad, so this sits a little past the
 * peak -- where a driver would already be correcting. Lower and the smoke fires in every
 * corner; higher and a car that is visibly sideways looks like it is on rails.
 */
export const SLIDE_ANGLE = 0.14;
/** How much further past the peak a tyre is before the effect is at full strength. */
const SLIDE_RANGE = 0.22;
/**
 * Wheelspin, as a fraction of the drive force over the traction limit.
 *
 * `CarPhysics` raises `wheelSlip` whenever the engine asks for more than the rear tyres can
 * put down, which in these cars is most of a lap: anything on the power out of a corner is
 * technically spinning. The effect therefore only starts well past that. A first version
 * counted the whole range, and the first look at it in the browser had all twenty-two cars
 * trailing smoke and laying rubber through a green-flag lap -- which is the opposite of the
 * point, since a cue that is always on is not a cue.
 */
const SPIN_VISIBLE = 0.3;
const SPIN_RANGE = 0.5;
/** Past this the rear tyres are leaving rubber rather than only asking for it. */
const SPIN_MARKING = 0.5;
/** The kerb, in metres, either side of the road (`RaceSession` measures the same 1.4). */
export const KERB_WIDTH = 1.4;

/**
 * Read a car's physics for the signals the effects need.
 *
 * Pure, and exported, so the thresholds can be asserted against the car's own numbers
 * rather than only being seen in a screenshot: the cases worth testing are a car at the
 * limit of grip, which must not smoke, and one just past it, which must.
 *
 * The signals are the physics module's own -- rear slip angle measured against the friction
 * curve's peak, wheelspin past the traction limit, the front axle's lock-up flag -- because
 * thresholds invented for the effect would fire smoke on cars that are not sliding, and a
 * cue that lies is worse than no cue at all.
 *
 * @param {object} physics a `CarPhysics`
 * @param {{halfWidth?: number, lateral?: number}} [surface] the session's view of where the
 *   car is on the road. Omitted for a car the session has not placed yet, which is on it.
 */
export function tyreSignals(physics, surface = {}) {
  const speed = Math.abs(physics.speed);
  const slip = Math.abs(physics.rearSlipAngle);
  const locked = physics.brakeLock === 1 && speed > 6;
  /*
   * Sliding is measured as the excess past the peak, not as the slip angle itself.
   *
   * The distinction is the whole point of the effect: a tyre at 0.08 rad is working at the
   * limit of its grip and a tyre at 0.2 rad has let go, and an effect that treats the first
   * as half of the second is telling the player the car is sliding when it is not.
   */
  const past = Math.max(0, slip - SLIDE_ANGLE) / SLIDE_RANGE;
  const spinning = Math.max(0, physics.wheelSlip - SPIN_VISIBLE) / SPIN_RANGE;
  const sliding = clamp(Math.max(past, spinning, locked ? 0.8 : 0), 0, 1);
  /** Past the kerb the wheels are throwing whatever the run-off is made of. */
  const offTrack = Math.abs(surface.lateral ?? 0) > (surface.halfWidth ?? Infinity) + KERB_WIDTH;
  return {
    speed,
    /** 0..1: how far past the limit the rear tyres are. */
    sliding,
    /** Smoke wants a tyre that is past the limit and moving enough to be doing something. */
    smoky: sliding > 0.08 && speed > 1.5,
    /**
     * Rubber wants the road as well, and a wheel that is actually travelling: marks are
     * laid one segment per 2.5m, so a wheel spinning on the spot would lay nothing anyway.
     * Off the road there is nothing to mark -- the dust is what says the car is there.
     */
    laying: !offTrack && speed > 4 && (slip > SLIDE_ANGLE || physics.wheelSlip > SPIN_MARKING || locked),
    offTrack
  };
}

/**
 * The fields of one particle, named once.
 *
 * Copying a particle from one slot to another is where a pool like this goes wrong: a
 * field added to the emitters and forgotten in the copy shows up as a particle that keeps
 * a stale size or an immortal life, and it only shows under load, in a corner. These two
 * lists are the single place that knows what a particle is.
 */
const SCALAR_FIELDS = ['alpha', 'peak', 'size', 'growth', 'life', 'lifetime', 'gravity', 'drag'];
const VECTOR_FIELDS = ['position', 'colour', 'velocity'];

const PARTICLE_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColour;

  uniform float uViewport;

  varying float vAlpha;
  varying vec3 vColour;

  void main() {
    vAlpha = aAlpha;
    vColour = aColour;

    vec4 view = modelViewMatrix * vec4(position, 1.0);
    /*
     * A size in metres, drawn at the size it would cover on screen.
     *
     * The projection matrix already carries 1/tan(fov/2), so reading it back means the
     * particles stay the right size when the camera's field of view opens up with speed,
     * and stay the right size on a phone with a different pixel ratio -- neither of which
     * a baked-in constant survives.
     */
    float pixels = 0.5 * uViewport * projectionMatrix[1][1];
    gl_PointSize = max(aSize * pixels / max(-view.z, 0.5), 1.0);
    gl_Position = projectionMatrix * view;
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColour;

  void main() {
    // Soft round sprite, computed rather than sampled: see the module comment.
    float radius = length(gl_PointCoord - vec2(0.5)) * 2.0;
    float alpha = smoothstep(1.0, 0.15, radius) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColour, alpha);
  }
`;

/**
 * A fixed-size pool of billboarded particles in one draw call.
 *
 * Live particles are packed at the front of every array, so `update` walks exactly the
 * live ones and the draw range is the live count. A dead particle is overwritten by the
 * last live one, which is why the field lists above exist.
 */
class ParticlePool {
  constructor({ capacity, additive }) {
    this.capacity = capacity;
    this.live = 0;

    this.position = new Float32Array(capacity * 3);
    this.colour = new Float32Array(capacity * 3);
    this.velocity = new Float32Array(capacity * 3);
    this.alpha = new Float32Array(capacity);
    this.peak = new Float32Array(capacity);
    this.size = new Float32Array(capacity);
    this.growth = new Float32Array(capacity);
    this.life = new Float32Array(capacity);
    this.lifetime = new Float32Array(capacity);
    this.gravity = new Float32Array(capacity);
    this.drag = new Float32Array(capacity);

    const geometry = new THREE.BufferGeometry();
    this.attributes = {
      position: new THREE.BufferAttribute(this.position, 3),
      aColour: new THREE.BufferAttribute(this.colour, 3),
      aAlpha: new THREE.BufferAttribute(this.alpha, 1),
      aSize: new THREE.BufferAttribute(this.size, 1)
    };
    for (const [name, attribute] of Object.entries(this.attributes)) {
      attribute.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute(name, attribute);
    }
    geometry.setDrawRange(0, 0);
    /*
     * Culling is off and the bounding sphere is a lie on purpose.
     *
     * The live particles are wherever the cars have been all race, so the honest bounding
     * sphere is the whole circuit -- which never culls anything anyway. Recomputing it
     * every frame to discover that would be work for nothing.
     */
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    this.geometry = geometry;

    this.material = new THREE.ShaderMaterial({
      uniforms: { uViewport: { value: 900 } },
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending
    });

    this.points = new THREE.Points(geometry, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 4;
    this.points.name = additive ? 'sparks' : 'smoke';
  }

  setViewport(height) {
    this.material.uniforms.uViewport.value = height;
  }

  /**
   * Add one particle, or nothing if the pool is full.
   *
   * @param {object} recipe position, velocity, size, growth, life, alpha, colour,
   *   gravity (positive falls) and drag (per second)
   */
  emit(recipe) {
    if (this.live >= this.capacity) return -1;
    const slot = this.live;
    this.live += 1;

    const index = slot * 3;
    const { position, velocity, colour } = this;
    position[index] = recipe.x;
    position[index + 1] = recipe.y;
    position[index + 2] = recipe.z;
    velocity[index] = recipe.vx;
    velocity[index + 1] = recipe.vy;
    velocity[index + 2] = recipe.vz;
    colour[index] = recipe.colour[0];
    colour[index + 1] = recipe.colour[1];
    colour[index + 2] = recipe.colour[2];

    this.alpha[slot] = 0;
    this.peak[slot] = recipe.alpha;
    this.size[slot] = recipe.size;
    this.growth[slot] = recipe.growth ?? 0;
    this.life[slot] = recipe.life;
    this.lifetime[slot] = recipe.life;
    this.gravity[slot] = recipe.gravity ?? 0;
    this.drag[slot] = recipe.drag ?? 0;
    return slot;
  }

  update(dt) {
    for (let slot = 0; slot < this.live; slot += 1) {
      this.life[slot] -= dt;
      if (this.life[slot] <= 0) {
        this.#remove(slot);
        slot -= 1;
        continue;
      }

      const index = slot * 3;
      const damp = Math.exp(-this.drag[slot] * dt);
      this.velocity[index] *= damp;
      this.velocity[index + 1] = this.velocity[index + 1] * damp - this.gravity[slot] * dt;
      this.velocity[index + 2] *= damp;
      this.position[index] += this.velocity[index] * dt;
      this.position[index + 1] += this.velocity[index + 1] * dt;
      this.position[index + 2] += this.velocity[index + 2] * dt;

      const age = 1 - this.life[slot] / this.lifetime[slot];
      this.size[slot] += this.growth[slot] * dt;
      /*
       * Fade in as well as out.
       *
       * A particle that arrives at full opacity is a sprite popping into existence; smoke
       * coming off a tyre has to appear *because* it is coming off the tyre. The fade in
       * is a fixed fraction of the life rather than a fixed time, so a short-lived spark
       * does not spend most of its life fading in.
       */
      this.alpha[slot] = this.peak[slot] * Math.min(1, age / 0.18) * (1 - age);
    }

    this.geometry.setDrawRange(0, this.live);
    for (const attribute of Object.values(this.attributes)) attribute.needsUpdate = true;
  }

  clear() {
    this.live = 0;
    this.geometry.setDrawRange(0, 0);
  }

  /** Drop a dead particle by overwriting it with the last live one. */
  #remove(slot) {
    this.live -= 1;
    const last = this.live;
    if (slot === last) return;
    for (const name of SCALAR_FIELDS) this[name][slot] = this[name][last];
    const from = last * 3;
    const to = slot * 3;
    for (const name of VECTOR_FIELDS) {
      const array = this[name];
      array[to] = array[from];
      array[to + 1] = array[from + 1];
      array[to + 2] = array[from + 2];
    }
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

/**
 * Skid marks: rubber laid along a strip, as a ring of quads that fade out.
 *
 * One quad per axle per 2.5m is enough to read as a continuous line from a chase camera,
 * and it is what makes the ring predictable: 300 quads is 750m of strip per axle, so a
 * car sliding for ten seconds at racing speed (about 400m) still leaves the whole of its
 * slide on the road behind it. Longer segments than that start to cut corners on a
 * hairpin, which is exactly where the marks are worth having.
 */
class MarkPool {
  constructor({ capacity }) {
    this.capacity = capacity;
    this.cursor = 0;
    this.live = 0;
    this.life = new Float32Array(capacity);
    this.peak = new Float32Array(capacity);

    this.position = new Float32Array(capacity * 12);
    this.colour = new Float32Array(capacity * 16);

    const geometry = new THREE.BufferGeometry();
    this.positionAttribute = new THREE.BufferAttribute(this.position, 3);
    this.colourAttribute = new THREE.BufferAttribute(this.colour, 4);
    this.positionAttribute.setUsage(THREE.DynamicDrawUsage);
    this.colourAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', this.positionAttribute);
    geometry.setAttribute('color', this.colourAttribute);

    const indices = new Uint16Array(capacity * 6);
    for (let quad = 0; quad < capacity; quad += 1) {
      const base = quad * 4;
      indices.set([base, base + 1, base + 2, base + 2, base + 1, base + 3], quad * 6);
    }
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    this.geometry = geometry;

    this.material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      // The marks are 2cm above the asphalt. Without the offset the two surfaces z-fight
      // at distance, which reads as the marks flickering rather than as rubber.
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 2;
    this.mesh.name = 'skid-marks';
  }

  /**
   * Lay one segment of rubber, from the last point of a strip to this one.
   *
   * @param {number} width metres across
   * @param {number} alpha how dark the new rubber is, 0..1
   */
  lay(fromX, fromY, fromZ, toX, toY, toZ, width, alpha) {
    const dx = toX - fromX;
    const dz = toZ - fromZ;
    const length = Math.hypot(dx, dz);
    if (length < 1e-4) return false;
    // Perpendicular in the ground plane, so the strip follows the car's path.
    const halfX = (-dz / length) * (width * 0.5);
    const halfZ = (dx / length) * (width * 0.5);

    const quad = this.cursor;
    this.cursor = (this.cursor + 1) % this.capacity;
    this.life[quad] = MARK_LIFE;
    this.peak[quad] = clamp(alpha, 0, 1);
    if (this.live < this.capacity) this.live += 1;

    const position = quad * 12;
    const corners = [
      [fromX + halfX, fromY, fromZ + halfZ],
      [fromX - halfX, fromY, fromZ - halfZ],
      [toX + halfX, toY, toZ + halfZ],
      [toX - halfX, toY, toZ - halfZ]
    ];
    for (let corner = 0; corner < 4; corner += 1) {
      const base = position + corner * 3;
      this.position[base] = corners[corner][0];
      this.position[base + 1] = corners[corner][1];
      this.position[base + 2] = corners[corner][2];
      // Near-black, and the alpha is what fades: a mark does not lighten towards the
      // colour of the road, it wears away.
      const colour = quad * 16 + corner * 4;
      this.colour[colour] = 0.05;
      this.colour[colour + 1] = 0.05;
      this.colour[colour + 2] = 0.06;
      this.colour[colour + 3] = this.peak[quad];
    }
    this.#flush();
    return true;
  }

  update(dt) {
    if (this.live === 0) return;
    let alive = 0;
    for (let quad = 0; quad < this.capacity; quad += 1) {
      if (this.life[quad] <= 0) continue;
      this.life[quad] -= dt;
      const fade = Math.max(0, this.life[quad] / MARK_LIFE);
      const alpha = this.peak[quad] * fade;
      const base = quad * 16;
      for (let corner = 0; corner < 4; corner += 1) this.colour[base + corner * 4 + 3] = alpha;
      if (this.life[quad] > 0) alive += 1;
    }
    this.live = alive;
    this.#flush();
  }

  clear() {
    this.life.fill(0);
    this.live = 0;
    this.cursor = 0;
    this.#flush();
  }

  #flush() {
    this.positionAttribute.needsUpdate = true;
    this.colourAttribute.needsUpdate = true;
    this.geometry.setDrawRange(0, this.capacity * 6);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export class Effects {
  /**
   * @param {THREE.Scene} scene
   * @param {{random?: () => number}} [options] `random` is injectable so the tests can
   *   ask for a particle rather than hoping for one.
   */
  constructor(scene, { random = Math.random, softCapacity, sparkCapacity, markCapacity } = {}) {
    this.random = random;
    this.soft = new ParticlePool({ capacity: softCapacity ?? SOFT_CAPACITY, additive: false });
    this.glow = new ParticlePool({ capacity: sparkCapacity ?? SPARK_CAPACITY, additive: true });
    this.marks = new MarkPool({ capacity: markCapacity ?? MARK_CAPACITY });

    /** Where each skid strip was last laid, keyed by the strip. */
    this.strips = new Map();

    this.group = new THREE.Group();
    this.group.name = 'effects';
    this.group.add(this.marks.mesh, this.soft.points, this.glow.points);
    scene?.add(this.group);
  }

  /** Particles and marks in the pools right now; the tests make assertions on these. */
  get particleCount() {
    return this.soft.live + this.glow.live;
  }

  get markCount() {
    return this.marks.live;
  }

  /**
   * The renderer's height in device pixels, for size attenuation.
   *
   * Not the CSS height: a phone reporting three device pixels per CSS pixel draws three
   * times the particles into the same space, and passing the CSS number would draw every
   * one of them a third of the size it should be.
   */
  setViewport(height) {
    this.soft.setViewport(height);
    this.glow.setViewport(height);
  }

  /**
   * Quote Poisson emission: `rate` per second, at most one per call.
   *
   * A per-frame probability rather than an accumulator, because an accumulator has to be
   * kept per emitter and a fraction of a particle left over from the last frame is state
   * that has to be cleared on every session change to avoid a burst at the start of the
   * next one.
   */
  #fires(rate, dt) {
    if (rate <= 0) return false;
    return this.random() < Math.min(rate * dt, 1);
  }

  #spread(range) {
    return (this.random() - 0.5) * range;
  }

  #between([low, high]) {
    return low + this.random() * (high - low);
  }

  /**
   * Smoke off a tyre that is spinning up or locked.
   *
   * @param {number} x,y,z the contact patch
   * @param {number} intensity 0..1 how far past the limit the tyre is
   * @param {number} vx,vz the car's world velocity, so the smoke is left behind
   */
  smoke(x, y, z, intensity, vx = 0, vz = 0, dt = 1 / 60) {
    if (!this.#fires(SMOKE_RATE * clamp(intensity, 0, 1), dt)) return;
    this.soft.emit({
      x: x + this.#spread(0.35),
      y: y + 0.12 + this.random() * 0.1,
      z: z + this.#spread(0.35),
      // A quarter of the car's velocity plus a lazy rise: the tyre is not throwing the
      // smoke anywhere, the car is driving out from under it.
      vx: vx * 0.25 + this.#spread(1.2),
      vy: 0.5 + this.random() * 0.8,
      vz: vz * 0.25 + this.#spread(1.2),
      size: this.#between(SMOKE_SIZE),
      growth: this.#between(SMOKE_GROWTH),
      life: this.#between(SMOKE_LIFE),
      alpha: this.#between(SMOKE_ALPHA) * clamp(intensity, 0.25, 1),
      colour: SMOKE_COLOUR,
      // Rises: this is the one particle here that is lighter than the air it is in.
      gravity: -0.35,
      drag: 1.5
    });
  }

  /**
   * Dust off a wheel that has left the road.
   *
   * Distinct from smoke by weight, not just colour: dust is thrown backwards and falls out
   * of the air, where smoke hangs. From a chase camera that difference is what says
   * "off the road" rather than "spinning up".
   */
  dust(x, y, z, intensity, vx = 0, vz = 0, dt = 1 / 60) {
    if (!this.#fires(DUST_RATE * clamp(intensity, 0, 1), dt)) return;
    this.soft.emit({
      x: x + this.#spread(0.4),
      y: y + 0.08 + this.random() * 0.1,
      z: z + this.#spread(0.4),
      vx: vx * 0.45 + this.#spread(2),
      vy: 0.8 + this.random() * 1.1,
      vz: vz * 0.45 + this.#spread(2),
      size: this.#between(DUST_SIZE),
      growth: this.#between(DUST_GROWTH),
      life: this.#between(DUST_LIFE),
      alpha: this.#between(DUST_ALPHA) * clamp(intensity, 0.3, 1),
      colour: DUST_COLOUR,
      gravity: 1.6,
      drag: 2.4
    });
  }

  /**
   * Sparks off a barrier, thrown along the wall's normal.
   *
   * A burst rather than a rate, because a barrier strike is an event: `strength` is the
   * speed that went into the wall, in m/s, straight off the collision resolution.
   */
  sparks(x, y, z, strength, nx = 0, nz = 0) {
    const count = Math.min(28, 3 + Math.round(clamp(strength, 0, 40) * 0.6));
    const speed = Math.min(9, 1.5 + strength * 0.35);
    for (let i = 0; i < count; i += 1) {
      const scale = 0.35 + this.random() * 0.9;
      this.glow.emit({
        x: x + this.#spread(0.5),
        y: y + this.#spread(0.35),
        z: z + this.#spread(0.5),
        vx: nx * speed * scale + this.#spread(2.4),
        // Up and out: sparks come off the top of the scrape and fall back down.
        vy: 1 + this.random() * 3.4,
        vz: nz * speed * scale + this.#spread(2.4),
        size: 0.04 + this.random() * 0.05,
        life: 0.25 + this.random() * 0.35,
        alpha: 0.75 + this.random() * 0.25,
        colour: SPARK_COLOUR,
        gravity: 9.8,
        drag: 0.5
      });
    }
  }

  /**
   * Continue a strip of rubber.
   *
   * Called every frame that a wheel is sliding; the strip is only laid once the car has
   * moved `MARK_STEP` from where the last segment ended, so the cost is a function of
   * distance rather than of frame rate -- a phone at 30fps lays exactly as many quads as
   * one at 60.
   *
   * @param {string} key which strip, e.g. one per wheel per car
   * @param {number} intensity 0..1 how hard the tyre is sliding
   */
  skid(key, x, y, z, intensity) {
    const last = this.strips.get(key);
    if (!last) {
      this.strips.set(key, { x, y, z });
      return false;
    }
    const span = Math.hypot(x - last.x, z - last.z);
    if (span < MARK_STEP) return false;
    const laid = this.marks.lay(last.x, last.y, last.z, x, y, z, MARK_WIDTH, 0.35 + 0.45 * clamp(intensity, 0, 1));
    this.strips.set(key, { x, y, z });
    return laid;
  }

  /** Forget where the strips were, e.g. when a car is teleported back to the pits. */
  clearStrip(key) {
    this.strips.delete(key);
  }

  update(dt) {
    this.soft.update(dt);
    this.glow.update(dt);
    this.marks.update(dt);
  }

  /** Between sessions: no smoke in the air, no rubber on the road. */
  reset() {
    this.soft.clear();
    this.glow.clear();
    this.marks.clear();
    this.strips.clear();
  }

  dispose() {
    this.group.removeFromParent();
    this.soft.dispose();
    this.glow.dispose();
    this.marks.dispose();
  }
}
