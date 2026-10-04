import * as THREE from 'three';
import { PLAYER, CAMERA, WORLD } from '../config.js';
import { heightAt } from '../world/Terrain.js';
import { angleDelta, clamp, clamp01, damp, lerp } from '../util/math.js';

// Reads keyboard, mouse and touch into a single movement intent, so the
// player controller never has to care where the input came from.
export class InputController {
  constructor(domElement) {
    this.dom = domElement;
    this.keys = new Set();
    this.pointer = { down: false, x: 0, y: 0, id: null };
    this.stick = { active: false, x: 0, y: 0 };
    this.buttons = new Set();
    this.listeners = new Map();

    this.onKeyDown = (e) => {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      this.keys.add(e.code);
      // Space and arrows scroll the page otherwise.
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    };
    this.onKeyUp = (e) => this.keys.delete(e.code);
    this.onBlur = () => {
      this.keys.clear();
      this.pointer.down = false;
    };

    this.onPointerDown = (e) => {
      // Ignore drags that start on a UI control.
      if (e.target !== this.dom) return;
      this.pointer.down = true;
      this.pointer.id = e.pointerId;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
    };
    this.onPointerMove = (e) => {
      if (!this.pointer.down || e.pointerId !== this.pointer.id) return;
      const dx = e.clientX - this.pointer.x;
      const dy = e.clientY - this.pointer.y;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.emit('look', { dx, dy });
    };
    this.onPointerUp = (e) => {
      if (e.pointerId === this.pointer.id) this.pointer.down = false;
    };
    this.onWheel = (e) => {
      if (e.target !== this.dom) return;
      e.preventDefault();
      this.emit('zoom', { delta: e.deltaY });
    };

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    this.dom.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    this.dom.addEventListener('wheel', this.onWheel, { passive: false });
    this.dom.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(handler);
    return () => this.listeners.get(event).delete(handler);
  }

  emit(event, payload) {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const fn of set) fn(payload);
  }

  // Virtual thumbstick, fed by the touch overlay.
  setStick(x, y, active = true) {
    this.stick.x = x;
    this.stick.y = y;
    this.stick.active = active;
  }

  press(button) {
    this.buttons.add(button);
  }

  release(button) {
    this.buttons.delete(button);
  }

  isDown(code) {
    return this.keys.has(code);
  }

  get runRequested() {
    return this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || this.buttons.has('run');
  }

  get interactRequested() {
    return this.keys.has('KeyE') || this.buttons.has('interact');
  }

  get jumpRequested() {
    return this.keys.has('Space') || this.buttons.has('jump');
  }

  // Returns { x, z } in world space, already rotated into camera-relative space.
  moveAxis() {
    let forward = 0;
    let right = 0;

    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) forward += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) forward -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) right += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) right -= 1;

    if (this.stick.active) {
      forward += -this.stick.y;
      right += this.stick.x;
    }

    const len = Math.hypot(forward, right);
    if (len > 1) {
      forward /= len;
      right /= len;
    }
    return { x: right, z: forward, magnitude: Math.min(1, len) };
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    this.dom.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.dom.removeEventListener('wheel', this.onWheel);
  }
}

// Third-person orbit camera.
//
// The camera is the thing that makes a walking game feel broken when it is
// wrong, so this does three jobs properly:
//   1. Orbits and zooms under mouse/touch control.
//   2. Never ends up inside a building. Buildings are solid, so the camera
//      pulls in along the line to the player until it is out in the open.
//      Without this the view ends up inside a wall and shows a flat fill,
//      which reads as "the game is broken" rather than "you are close to a wall".
//   3. Never drops below the ground it flies over.
export class FollowCamera {
  constructor(camera, { isBlocked = () => false, groundHeightAt = heightAt, roofHeightAt = null } = {}) {
    this.camera = camera;
    this.isBlocked = isBlocked;
    this.groundHeightAt = groundHeightAt;
    // Optional 3D occupancy test: returns true when a point is inside solid
    // geometry. The 2D footprint grid cannot see that the camera is inside a
    // roof or an upper storey, which renders as being buried in the building.
    this.roofHeightAt = roofHeightAt;

    this.yaw = Math.PI;
    this.pitch = 0.28;
    this.distance = CAMERA.distance;
    this.targetDistance = CAMERA.distance;
    this.currentDistance = CAMERA.distance;
    this.focus = new THREE.Vector3();
  }

  orbit(dx, dy) {
    this.yaw -= dx * 0.0045;
    this.pitch = clamp(this.pitch + dy * 0.0032, -0.5, 1.25);
  }

  zoom(delta) {
    this.targetDistance = clamp(this.targetDistance + delta * 0.012, CAMERA.minDistance, CAMERA.maxDistance);
  }

  // Walks from the focus towards the desired camera position, stopping at the
  // first blocked sample. Returns the shortened distance.
  //
  // Two things this must handle: solid buildings, and terrain. Terrain is the
  // subtle one, because on a hillside the camera can sit below the ground it
  // flies over even when the view looks fine, putting the near plane inside a
  // mountain and rendering a black slab.
  resolveDistance(focusX, focusY, focusZ, desired) {
    const cosPitch = Math.cos(this.pitch);
    const dirX = Math.sin(this.yaw) * cosPitch;
    const dirZ = Math.cos(this.yaw) * cosPitch;
    const dirY = Math.sin(this.pitch);

    const step = 0.35;
    const samples = Math.max(1, Math.ceil(desired / step));

    // The minimum the camera will pull in to. It has to be far enough back that
    // the character is in frame and the near plane is not inside their head:
    // below roughly two character-heights, the camera ends up inside the skull.
    const minDistance = this.minDistance ?? 2.6;

    for (let i = 1; i <= samples; i += 1) {
      const d = i * step;
      const x = focusX + dirX * d;
      const z = focusZ + dirZ * d;
      const y = focusY + dirY * d;

      if (this.isBlocked(x, z)) return Math.max(minDistance, d - 0.5);

      // 3D occupancy: a camera inside a roof or an upper floor is just as
      // broken as one inside a wall, and the footprint grid cannot see it.
      if (this.roofHeightAt && this.roofHeightAt(x, y, z)) return Math.max(minDistance, d - 0.5);

      // Terrain. Measured from the player's own ground height rather than the
      // focus point: the focus sits above the player, so testing against it
      // reported "underground" whenever the aim was raised, which yanked the
      // camera all the way in regardless of how open the view was.
      const ground = this.groundHeightAt(Math.floor(x), Math.floor(z)) + 1.1;
      if (y < ground) return Math.max(minDistance, d - 0.5);
    }
    return desired;
  }

  // Finds the best camera distance by trying several angles around the current
  // heading. Called only when the straight-back shot is badly blocked, which
  // is what happens standing in a street with a house behind you: rather than
  // slamming the camera into the player's back, it slides around until it has
  // somewhere to sit.
  reframeAround(focusX, focusY, focusZ, desired) {
    const offsets = [0.5, -0.5, 0.9, -0.9, 1.3, -1.3, 1.8, -1.8, 2.4, -2.4, Math.PI];
    const saved = this.yaw;
    let best = 1.4;
    let bestYaw = saved;

    for (const offset of offsets) {
      this.yaw = saved + offset;
      const d = this.resolveDistance(focusX, focusY, focusZ, desired);
      if (d > best + 0.3) {
        best = d;
        bestYaw = this.yaw;
      }
      // Good enough; stop early so the view does not swing wildly.
      if (best > desired * 0.75) break;
    }

    this.yaw = bestYaw;
    return best;
  }

  update(deltaSeconds, playerPos, playerHeight) {
    this.distance = damp(this.distance, this.targetDistance, CAMERA.damping, deltaSeconds);

    // Where the camera looks. At a normal walking distance the aim sits above
    // the character so the environment stays dominant; zoomed in close it drops
    // to the character's chest so they fill the frame.
    //
    // A fixed focus height cannot do both: at 3 units away a point 3.3 units
    // above the feet pushes the character clean off the bottom of the screen.
    const t = clamp01((this.currentDistance - 4) / 8);
    const aimAbove = lerp(0.55 * playerHeight, CAMERA.height * 0.62 + playerHeight * 0.4, t);
    this.focus.set(playerPos.x, playerPos.y + aimAbove, playerPos.z);

    let allowed = this.resolveDistance(this.focus.x, this.focus.y, this.focus.z, this.distance);

    // If we cannot get any real distance behind the player, slide sideways
    // around until the view opens up.
    if (allowed < this.distance * 0.55) {
      const reframed = this.reframeAround(this.focus.x, this.focus.y, this.focus.z, this.distance);
      if (reframed > allowed) allowed = reframed;
    }

    if (allowed < this.currentDistance) {
      this.currentDistance = allowed;
    } else {
      this.currentDistance = Math.min(allowed, this.currentDistance + deltaSeconds * 5);
    }

    const cosPitch = Math.cos(this.pitch);
    const camX = this.focus.x + Math.sin(this.yaw) * cosPitch * this.currentDistance;
    const camZ = this.focus.z + Math.cos(this.yaw) * cosPitch * this.currentDistance;
    let camY = this.focus.y + Math.sin(this.pitch) * this.currentDistance;

    // Final hard floor, applied after damping so nothing can slip under.
    const ground = this.groundHeightAt(Math.floor(camX), Math.floor(camZ)) + 1.3;
    if (camY < ground) camY = ground;

    this.camera.position.set(camX, camY, camZ);
    this.camera.lookAt(this.focus);
  }
}

export class PlayerController {
  constructor({ scene, camera, input, groundHeightAt = heightAt, isBlocked = () => false }) {
    this.scene = scene;
    this.camera = camera;
    this.input = input;
    this.groundHeightAt = groundHeightAt;
    this.isBlocked = isBlocked;

    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.yaw = 0;
    this.grounded = true;
    this.running = false;
    this.stamina = PLAYER.staminaMax;
    this.exhausted = false;
    this.distanceWalked = 0;
    this.speedScalar = 0;
    // Lean into the direction of travel, ramped in and out by the same
    // acceleration constant so it never snaps.
    this.lean = 0;

    this.onGround = null;
  }

  spawn({ x, y, z }) {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
  }

  get eyeHeight() {
    return PLAYER.height;
  }

  canRun() {
    return !this.exhausted;
  }

  spendStamina(amount) {
    this.stamina = Math.max(0, this.stamina - amount);
    if (this.stamina <= PLAYER.staminaMax * PLAYER.staminaExhaustedBelow) this.exhausted = true;
  }

  restoreStamina(amount) {
    this.stamina = Math.min(PLAYER.staminaMax, this.stamina + amount);
    if (this.stamina >= PLAYER.staminaMax * PLAYER.staminaExhaustedRecoverAbove) this.exhausted = false;
  }

  update(deltaSeconds) {
    const axis = this.input.moveAxis();
    this.running = this.input.runRequested && this.canRun() && axis.magnitude > 0.1;

    // Exhaustion slows you rather than stopping you dead: a chill game should
    // never feel like it is blocking you.
    const base = this.running ? PLAYER.runSpeed : PLAYER.walkSpeed;
    const tired = this.exhausted ? 0.7 : 1;
    const targetSpeed = base * axis.magnitude * tired;
    this.speedScalar = targetSpeed;

    // Move relative to where the camera is looking.
    //
    // FollowCamera places the camera at focus + (sin(yaw), cos(yaw)) * dist,
    // so it looks along -(sin(yaw), cos(yaw)). "Forward" must therefore be
    // that negated bearing:
    //
    //   lookX = -sin(yaw)   lookZ = -cos(yaw)
    //   right  = (-lookZ, lookX)   -- 90 degrees counter-clockwise from look
    //
    // Two sign errors lived here at different times, and each one was
    // invisible while the other was present:
    //
    //   1. Rotating the stick vector by +yaw instead of negating it. That is
    //      180 degrees out, so pushing the joystick or W moved the player
    //      directly away from the camera and the character walked backwards.
    //   2. The right vector itself, negated. Forward was fixed while this was
    //      left, so up walked correctly and right went left.
    //
    // The rule is that `right` must satisfy: walk left, then left again, and
    // you should be going where the camera faces. Written out, right is the
    // look bearing rotated by the opposite sense to the one the camera sits on.
    const camYaw = this.cameraYaw ?? 0;
    const lookX = -Math.sin(camYaw);
    const lookZ = -Math.cos(camYaw);
    const rightX = -lookZ;
    const rightZ = lookX;

    const dirX = axis.x * rightX + axis.z * lookX;
    const dirZ = axis.x * rightZ + axis.z * lookZ;

    // Turning is smoothed rather than instant. Snapping to face the input
    // direction makes a character feel like a cursor; easing the heading gives
    // the sense of a body swinging around.
    if (axis.magnitude > 0.05) {
      const targetYaw = Math.atan2(dirX, dirZ);
      this.yaw += angleDelta(this.yaw, targetYaw) * Math.min(1, deltaSeconds * PLAYER.turnRate);
      if (this.running) this.spendStamina(PLAYER.staminaDrainRun * deltaSeconds);
    } else {
      this.restoreStamina(PLAYER.staminaRegen * deltaSeconds);
    }

    // Acceleration and braking are deliberately different, and separate from
    // the damp factor. Starting and stopping use different time constants so a
    // character settles into a walk and coasts to a stop, rather than snapping
    // between the two. That difference is most of what "weight" is.
    const accel = axis.magnitude > 0.05 ? PLAYER.accel : PLAYER.decel;
    this.velocity.x = damp(this.velocity.x, dirX * targetSpeed, accel, deltaSeconds);
    this.velocity.z = damp(this.velocity.z, dirZ * targetSpeed, accel, deltaSeconds);

    // A small lean into the direction of travel, scaled by speed. Ramping it in
    // and out with the same acceleration constant keeps it from snapping.
    const leanTarget = Math.min(0.09, Math.hypot(this.velocity.x, this.velocity.z) * 0.022);
    this.lean = damp(this.lean, leanTarget, 0.004, deltaSeconds);

    // Jump and gravity.
    if (this.grounded && this.input.jumpRequested) {
      this.velocity.y = PLAYER.jumpSpeed;
      this.grounded = false;
    }
    this.velocity.y -= PLAYER.gravity * deltaSeconds;

    // Integrate horizontally, resolving one axis at a time so the player slides
    // along walls instead of sticking to them.
    const nextX = this.position.x + this.velocity.x * deltaSeconds;
    const nextZ = this.position.z + this.velocity.z * deltaSeconds;

    if (!this.isBlocked(nextX, this.position.z)) this.position.x = nextX;
    else this.velocity.x = 0;

    if (!this.isBlocked(this.position.x, nextZ)) this.position.z = nextZ;
    else this.velocity.z = 0;

    this.position.y += this.velocity.y * deltaSeconds;

    // Ground.
    const ground = this.groundHeightAt(this.position.x, this.position.z);
    if (this.position.y <= ground) {
      this.position.y = ground;
      this.velocity.y = 0;
      if (!this.grounded) this.onGround?.();
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    // Keep the player on the island and out of deep water.
    const margin = 3;
    this.position.x = clamp(this.position.x, margin, WORLD.size - margin);
    this.position.z = clamp(this.position.z, margin, WORLD.size - margin);

    this.distanceWalked += Math.hypot(this.velocity.x, this.velocity.z) * deltaSeconds;
  }

  faceTowards(x, z) {
    const dx = x - this.position.x;
    const dz = z - this.position.z;
    if (Math.hypot(dx, dz) > 0.05) this.yaw = Math.atan2(dx, dz);
  }

  // Smoothly rotate the model towards the movement direction.
  applyToRig(rig, deltaSeconds) {
    rig.root.position.set(this.position.x, this.position.y, this.position.z);
    const current = rig.root.rotation.y;
    rig.root.rotation.y += angleDelta(current, this.yaw) * Math.min(1, deltaSeconds * PLAYER.turnRate);
    // Lean into the direction of travel, around the axis perpendicular to
    // the heading. Applied on the torso so the legs stay planted.
    rig.root.rotation.z = -this.lean * Math.cos(this.yaw);
    rig.root.rotation.x = this.lean * Math.sin(this.yaw);
  }

  get inWater() {
    return this.position.y < WORLD.seaLevel;
  }

  serialize() {
    return {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
      stamina: this.stamina,
      distanceWalked: this.distanceWalked
    };
  }
}