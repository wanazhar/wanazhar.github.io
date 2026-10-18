/**
 * Camera rig: a chase camera behind the car that behaves like a real broadcast
 * camera rather than a rigidly attached view.
 *
 * The important behaviours are that it lags the car's heading slightly, so hard
 * direction changes read as the world swinging round, that it pulls back with
 * speed, and that it never ends up inside the track wall.
 */

import * as THREE from 'three';
import { clamp, damp, dampAngle, lerp } from '../util/math.js';
import { locateOnTrack } from '../track/trackGeometry.js';

export const CAMERA_MODES = ['chase', 'cockpit', 'tv'];

const CHASE_DISTANCE = 11.5;
const CHASE_HEIGHT = 4.4;
const COCKPIT_OFFSET = new THREE.Vector3(0, 1.05, 0.35);

/**
 * Speed feel, in the two places a camera can express it: a lens that opens, and a body that
 * vibrates.
 *
 * The field of view gain is in degrees at top speed, with a little more when the DRS is
 * open -- the one moment in a lap when the car genuinely is quicker than it was a second ago.
 * It is approached by damping rather than set, so lifting off does not snap the view back,
 * and it is applied only to the two cameras that ride with the car: a trackside camera that
 * changed lens would be a bug wearing a speed effect's name.
 *
 * The vibration is in metres at top speed. A few centimetres is the difference between a car
 * at 300km/h and a drone following one; more than that and the car reads as broken.
 */
const FOV_SPEED_GAIN = 9;
const FOV_DRS_GAIN = 3;
const FOV_RATE = 3.2;
const VIBRATION = 0.035;
const VIBRATION_RATE = 58;

export class CameraRig {
  constructor(camera, track) {
    this.camera = camera;
    this.track = track;
    this.mode = 'chase';
    this.distance = CHASE_DISTANCE;
    this.distanceTarget = CHASE_DISTANCE;
    this.height = CHASE_HEIGHT;
    this.yaw = 0;
    this.pitch = 0;
    this.lookAt = new THREE.Vector3();
    this.smoothTarget = new THREE.Vector3();
    this.shake = 0;
    this.shakeTime = 0;
    this.vibrationTime = 0;
    /*
     * The lens the game was built around, which every speed change is measured from.
     *
     * Remembered on the camera rather than on the rig because the rig is rebuilt for every
     * circuit and the camera is not: read straight off the camera, a rig built while the
     * lens was still stretched from the last session's top speed would take that as its
     * resting framing and every session would look a little wider than the last.
     */
    this.baseFov = camera.userData.baseFov ?? camera.fov;
    camera.userData.baseFov = this.baseFov;
    this.tvAnchor = null;
    this.tvTimer = 0;
    this.initialised = false;
  }

  setMode(mode) {
    if (!CAMERA_MODES.includes(mode)) return;
    this.mode = mode;
    this.initialised = false;
  }

  cycleMode() {
    const index = CAMERA_MODES.indexOf(this.mode);
    this.setMode(CAMERA_MODES[(index + 1) % CAMERA_MODES.length]);
  }

  /** Add a short shake, e.g. on contact with a barrier. */
  addShake(amount) {
    this.shake = Math.min(1.4, this.shake + amount);
  }

  /**
   * @param {object} car physics state to follow
   * @param {number} dt
   * @param {object} [leader] physics state of the car leading, for the TV camera
   */
  update(car, dt, leader = null) {
    if (!this.initialised) {
      this.yaw = car.heading;
      this.smoothTarget.set(car.x, 0.6, car.z);
      this.distance = this.distanceTarget;
      this.initialised = true;
    }

    const speedT = clamp(car.speed / 90, 0, 1);

    switch (this.mode) {
      case 'cockpit':
        this.#updateCockpit(car);
        break;
      case 'tv':
        this.#updateTv(car, leader, dt);
        break;
      default:
        this.#updateChase(car, dt, speedT);
        break;
    }

    // Shake decays quickly so an impact reads as a jolt, not a wobble.
    this.shake = Math.max(0, this.shake - dt * 2.6);
    if (this.shake > 0) {
      this.shakeTime += dt * 42;
      const magnitude = this.shake * this.shake * 0.4;
      this.camera.position.x += Math.sin(this.shakeTime) * magnitude;
      this.camera.position.y += Math.sin(this.shakeTime * 1.7) * magnitude;
      this.camera.position.z += Math.cos(this.shakeTime * 1.3) * magnitude;
    }

    /*
     * The lens opens with speed, and closes again at rest.
     *
     * This is the oldest trick there is for making a car feel fast: at 300km/h the world
     * rushes past the edges of the screen instead of sitting still at the same framing as it
     * does in the pits. The guard matters as much as the damping -- a camera whose field of
     * view changes but whose projection matrix does not is a change nothing can see.
     */
    const drs = this.mode === 'tv' || !car.drsOpen ? 0 : FOV_DRS_GAIN;
    const fovTarget =
      this.mode === 'tv' ? this.baseFov : this.baseFov + FOV_SPEED_GAIN * speedT + drs;
    if (Math.abs(this.camera.fov - fovTarget) > 0.01) {
      this.camera.fov = damp(this.camera.fov, fovTarget, FOV_RATE, dt);
      this.camera.updateProjectionMatrix();
    }

    /*
     * And the car's own vibration, which is what separates a camera on a car from a camera
     * on a rail. It is added after the mode has placed the camera for this frame, so it can
     * never accumulate, and it scales with the square of speed because the forces at work do.
     */
    const vibration = VIBRATION * speedT * speedT;
    if (vibration > 0 && this.mode !== 'tv') {
      this.vibrationTime += dt * VIBRATION_RATE;
      this.camera.position.x += Math.sin(this.vibrationTime) * vibration;
      this.camera.position.y += Math.sin(this.vibrationTime * 1.7) * vibration;
      this.camera.position.z += Math.cos(this.vibrationTime * 1.3) * vibration;
    }
  }

  #updateChase(car, dt, speedT) {
    // The camera follows a damped version of the car's heading, which is what
    // makes a quick direction change feel like the world swinging past.
    const followRate = lerp(3.2, 7.5, speedT);
    this.yaw = dampAngle(this.yaw, car.heading, followRate, dt);

    // Pull back and lift slightly with speed.
    this.distanceTarget = CHASE_DISTANCE + speedT * 3.4;
    this.distance = damp(this.distance, this.distanceTarget, 3, dt);
    this.height = CHASE_HEIGHT + speedT * 1.1;

    const behind = this.distance;
    let x = car.x - Math.cos(this.yaw) * behind;
    let z = car.z - Math.sin(this.yaw) * behind;
    // Ride the road: the car's own height, not a fixed altitude. On a circuit with
    // fourteen metres of elevation a fixed-height chase camera spends half the lap
    // underground and half of it looking down at the roof.
    const y = this.height + (car.y ?? 0);

    // Keep the camera above the track surface and out of the barrier.
    const located = locateOnTrack(this.track, x, z, null);
    const limit = located.sample.width * 0.5 + 20;
    if (Math.abs(located.lateral) > limit) {
      const clamped = clamp(located.lateral, -limit, limit);
      x = located.sample.x + located.sample.rightX * clamped;
      z = located.sample.z + located.sample.rightZ * clamped;
    }

    this.smoothTarget.set(x, y, z);
    this.camera.position.x = damp(this.camera.position.x, x, 9, dt);
    this.camera.position.y = damp(this.camera.position.y, y, 9, dt);
    this.camera.position.z = damp(this.camera.position.z, z, 9, dt);

    // Look slightly ahead of the car rather than at it, which reads as speed.
    const lead = clamp(car.speed * 0.16, 0, 9);
    this.lookAt.set(
      car.x + Math.cos(car.heading) * lead,
      (car.y ?? 0) + 1.1,
      car.z + Math.sin(car.heading) * lead
    );
    this.camera.lookAt(this.lookAt);
  }

  #updateCockpit(car) {
    const cos = Math.cos(car.heading);
    const sin = Math.sin(car.heading);
    // Body axes: local +X is right, local +Z is forward in this world layout.
    this.camera.position.set(
      car.x + cos * COCKPIT_OFFSET.z + sin * COCKPIT_OFFSET.x,
      (car.y ?? 0) + COCKPIT_OFFSET.y,
      car.z + sin * COCKPIT_OFFSET.z - cos * COCKPIT_OFFSET.x
    );
    const lead = clamp(car.speed * 0.2, 1, 12);
    this.lookAt.set(
      car.x + cos * lead,
      (car.y ?? 0) + 1.0,
      car.z + sin * lead
    );
    this.camera.lookAt(this.lookAt);
    // A little shake from the car itself, more so on rough surface.
    this.camera.rotation.z += -car.yawRate * 0.08;
  }

  /** Trackside cameras that pan to follow whichever car is nearest to them. */
  #updateTv(car, leader, dt) {
    this.tvTimer -= dt;
    if (!this.tvAnchor || this.tvTimer <= 0) {
      this.tvAnchor = this.#pickTvAnchor();
      this.tvTimer = 6.5;
    }

    const anchor = this.tvAnchor;
    const target = this.#nearestCarTo(anchor, car, leader);
    this.camera.position.set(anchor.x, anchor.y, anchor.z);
    /*
     * Aim at the car, at the car's own height -- and if there is no car to aim at, keep
     * looking where we were looking rather than swinging down at the grass underfoot.
     */
    if (target !== anchor) {
      this.lookAt.set(target.x, (target.y ?? anchor.groundY) + 0.7, target.z);
      this.camera.lookAt(this.lookAt);
    }
    this.camera.position.x = damp(this.camera.position.x, anchor.x, 8, dt);
    this.camera.position.z = damp(this.camera.position.z, anchor.z, 8, dt);
  }

  #pickTvAnchor() {
    const samples = this.track.samples;
    const index = Math.floor(Math.random() * samples.length);
    const sample = samples[index];
    const side = Math.random() > 0.5 ? 1 : -1;
    const offset = sample.width * 0.5 + 22;
    const groundY = sample.y ?? 0;
    return {
      x: sample.x + sample.rightX * offset * side,
      /*
       * Above the circuit's own ground, not above sea level.
       *
       * This was `7 + Math.random() * 5` flat, and sixteen of the twenty-four circuits sit
       * entirely above that band: Mexico's circuit is two kilometres up, so its trackside
       * cameras stood two kilometres underground, and Spa's stood 400 metres under. The
       * chase camera already rides the car's own height for the same reason.
       */
      y: groundY + 7 + Math.random() * 5,
      z: sample.z + sample.rightZ * offset * side,
      groundY
    };
  }

  /**
   * The car a trackside camera watches.
   *
   * A trackside camera cannot know what a broadcast director would cut to, so it takes the
   * car it can see: the nearest of the two the rig is handed, or the explicitly focused one.
   *
   * It used to return `this.focus ?? the anchor point`, and nothing anywhere called
   * `setFocus` -- so the "target" in TV mode was the point directly below the camera, and
   * every trackside camera in the game filmed the ground beside the track, from on top of
   * it.
   */
  #nearestCarTo(anchor, car, leader) {
    if (this.focus) return this.focus;
    let nearest = null;
    let nearestDistance = Infinity;
    for (const candidate of [car, leader]) {
      if (!candidate) continue;
      const distance = (candidate.x - anchor.x) ** 2 + (candidate.z - anchor.z) ** 2;
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = candidate;
      }
    }
    return nearest ?? anchor;
  }

  /** Tell the TV camera which car to watch. */
  setFocus(physics) {
    this.focus = physics;
  }
}