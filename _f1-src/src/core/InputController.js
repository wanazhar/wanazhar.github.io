/**
 * Input: keyboard, touch and gamepad, normalised into one control shape.
 *
 * Analogue steering is the priority. Keyboard steering is rate-limited so it
 * feels like a steering wheel rather than a switch, and the touch stick feeds
 * the same analogue value rather than pretending to be digital.
 */

import { clamp, lerp, moveToward } from '../util/math.js';

export const ACTIONS = {
  throttle: 'throttle',
  brake: 'brake',
  steerLeft: 'steerLeft',
  steerRight: 'steerRight',
  ers: 'ers',
  drs: 'drs',
  reset: 'reset',
  camera: 'camera',
  pause: 'pause'
};

const KEY_BINDINGS = {
  ArrowUp: ACTIONS.throttle,
  KeyW: ACTIONS.throttle,
  ArrowDown: ACTIONS.brake,
  KeyS: ACTIONS.brake,
  ArrowLeft: ACTIONS.steerLeft,
  KeyA: ACTIONS.steerLeft,
  ArrowRight: ACTIONS.steerRight,
  KeyD: ACTIONS.steerRight,
  Space: ACTIONS.ers,
  ShiftLeft: ACTIONS.drs,
  ShiftRight: ACTIONS.drs,
  KeyR: ACTIONS.reset,
  KeyC: ACTIONS.camera,
  Escape: ACTIONS.pause,
  KeyP: ACTIONS.pause
};

/** Keyboard steering rate: how fast the digital input ramps to full lock. */
const KEY_STEER_RATE = 3.6;
const KEY_STEER_RETURN = 5.4;

/*
 * Steering slew, as a fraction of full lock per second.
 *
 * The analogue command is rate-limited before it reaches the car. This is the
 * single biggest contributor to the car feeling twitchy, and it is a real
 * limitation rather than a game-feel choice: no driver can move the wheel from
 * full left to full right instantly, and a command that can produces a car that
 * snaps between directions and is impossible to place.
 *
 * Scaled by speed. At walking pace a driver has plenty of time; at 300 kph the
 * same rate limit is what keeps the car on the road. `CarPhysics` already
 * reduces the maximum steering *angle* with speed, which stops the car
 * oversteering -- but it does nothing for the rate at which the wheel can be
 * turned, which is what actually feels like twitchiness.
 */
const STEER_SLEW_SLOW = 4.2;
const STEER_SLEW_FAST = 1.5;
/** Speed in m/s at which the slew limit has fully tightened. */
const STEER_SLEW_REF_SPEED = 70;

export class InputController {
  constructor(target = window) {
    this.keys = new Set();
    this.pressed = new Set();
    this.touch = { throttle: 0, brake: 0, steer: 0, active: false };
    this.touchButtons = new Set();
    this.steerValue = 0;
    this.lastAction = null;
    this.enabled = true;
    /** Elements the UI binds touch controls to, filled in by the UI manager. */
    this.stickElement = null;
    this.stickKnob = null;
    this.boundElements = new Map();

    /**
     * Which control scheme the player chose: 'touch' for the on-screen stick or
     * 'motion' for the gyroscope.
     *
     * A scheme rather than a set of booleans, because the two are alternatives. In
     * motion mode the stick is hidden, so it cannot also be feeding steering -- and
     * if both were live the car would steer towards whichever happened to be
     * larger, which is not a control scheme, it is a coin toss.
     */
    this.controlScheme = 'touch';

    /** Gyroscope controls, or null until the player opts in and permission is granted. */
    this.motion = null;

    this.onKeyDown = (event) => {
      if (!this.enabled) return;
      if (event.repeat) return;
      const action = KEY_BINDINGS[event.code];
      if (!action) return;
      // Space and arrows scroll the page otherwise.
      event.preventDefault();
      this.keys.add(action);
      this.pressed.add(action);
    };
    this.onKeyUp = (event) => {
      const action = KEY_BINDINGS[event.code];
      if (!action) return;
      this.keys.delete(action);
    };
    this.onBlur = () => {
      this.keys.clear();
      this.touch.throttle = 0;
      this.touch.brake = 0;
      this.touch.steer = 0;
    };

    target.addEventListener('keydown', this.onKeyDown, { passive: false });
    target.addEventListener('keyup', this.onKeyUp);
    target.addEventListener('blur', this.onBlur);
    this.target = target;
  }

  /**
   * Bind an on-screen control.
   *
   * Every on-screen control goes through here -- there is no second path. The
   * pedals previously wrote to `touch.throttle` / `touch.brake` from the UI
   * manager while `read()` looked at `this.touchButtons`, which is only ever
   * populated by this method. Nothing called it, so the gas and brake pedals did
   * nothing at all: they set fields no code path consulted. Two names for one
   * piece of state, and the UI had wired up the one `read()` ignored.
   *
   * @param {HTMLElement} element
   * @param {string} action
   * @param {'hold'|'toggle'} mode
   */
  bindButton(element, action, mode = 'hold') {
    if (!element) return;
    this.boundElements.set(element, { action, mode });

    const down = (event) => {
      event.preventDefault();
      // Capture so a finger that slides off the button still holds it. Without
      // this, dragging a thumb slightly -- entirely normal on a phone -- drops
      // the input, and a car that cuts throttle when you shift your grip feels
      // broken rather than unresponsive.
      element.setPointerCapture?.(event.pointerId);
      element.classList.add('is-pressed');
      if (mode === 'toggle') {
        this.pressed.add(action);
      } else {
        this.touchButtons.add(action);
      }
    };
    const up = (event) => {
      event.preventDefault();
      element.releasePointerCapture?.(event.pointerId);
      element.classList.remove('is-pressed');
      if (mode === 'hold') this.touchButtons.delete(action);
    };

    // `pointerleave` must NOT release. With pointer capture active the element
    // receives pointerup wherever the finger ends up, so releasing on leave fires
    // a spurious release the instant a thumb crosses the button's edge.
    element.addEventListener('pointerdown', down);
    element.addEventListener('pointerup', up);
    element.addEventListener('pointercancel', up);
  }

  /** True once per physical press. */
  consume(action) {
    if (this.pressed.has(action)) {
      this.pressed.delete(action);
      return true;
    }
    return false;
  }

  isDown(action) {
    return this.keys.has(action);
  }

  /**
   * Bind the floating thumbstick.
   *
   * One contact drives everything: sideways is steering, up is throttle, down is
   * brake. Two pedals plus a steering bar needed two thumbs working independently,
   * which is why they overlapped and why the layout fought the player's grip.
   *
   * The stick is drawn wherever the finger lands rather than in a fixed corner,
   * so it is always under the thumb. Travel is measured from the landing point,
   * not from the centre of the widget, so a thumb that lands off to one side
   * still gets full lock from there.
   *
   * @param {HTMLElement} element The stick ring, moved to the touch point.
   * @param {HTMLElement} knob The inner cap, moved by the travel vector.
   * @param {HTMLElement} zone The area that accepts the initial touch.
   */
  bindStick(element, knob, zone = null) {
    if (!element) return;
    this.stickElement = element;
    this.stickKnob = knob;
    const area = zone ?? element;
    let pointerId = null;
    let originX = 0;
    let originY = 0;

    /** Travel available in each axis, from the ring's rendered size. */
    const size = () => element.getBoundingClientRect().width || 132;
    const travel = () => size() * 0.32;

    const paint = (dx, dy) => {
      // Clamped to the same radius the input uses, so the knob stays inside the
      // ring. Painting the raw offset let it slide out of the ring and off the
      // screen edge while the controls were still at full lock -- the readout
      // disagreed with the input.
      const reach = travel();
      const len = Math.hypot(dx, dy);
      const scale = len > reach && len > 0 ? reach / len : 1;
      const px = dx * scale;
      const py = dy * scale;
      if (knob) knob.style.transform = `translate(${px}px, ${py}px)`;
      // Colour tells the player which axis is doing what, which is otherwise
      // invisible on a round control: up is throttle, down is brake.
      knob?.classList.toggle('is-throttle', dy < -6);
      knob?.classList.toggle('is-brake', dy > 6);
    };

    const release = () => {
      if (pointerId === null) return;
      pointerId = null;
      this.touch.steer = 0;
      this.touch.throttle = 0;
      this.touch.brake = 0;
      this.touch.active = false;
      paint(0, 0);
      knob?.classList.remove('is-throttle', 'is-brake');
      element.classList.remove('is-active');
    };

    const move = (event) => {
      if (event.pointerId !== pointerId) return;
      const reach = travel();
      if (reach <= 0) return;
      const dx = event.clientX - originX;
      const dy = event.clientY - originY;

      // Steer from horizontal travel, throttle/brake from vertical. Throttle and
      // brake are mutually exclusive by construction: the sign of dy decides.
      this.touch.steer = clamp(dx / reach, -1, 1);
      this.touch.throttle = clamp(-dy / reach, 0, 1);
      this.touch.brake = clamp(dy / reach, 0, 1);
      this.touch.active = true;
      paint(dx, dy);
    };

    area.addEventListener('pointerdown', (event) => {
      if (pointerId !== null) return;
      if (event.target !== area && !area.contains(event.target)) return;
      pointerId = event.pointerId;
      originX = event.clientX;
      originY = event.clientY;
      area.setPointerCapture?.(event.pointerId);
      element.style.left = `${event.clientX}px`;
      element.style.top = `${event.clientY}px`;
      element.classList.add('is-active');
      paint(0, 0);
      move(event);
    });
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerup', (event) => {
      if (event.pointerId === pointerId) release();
    });
    area.addEventListener('pointercancel', (event) => {
      if (event.pointerId === pointerId) release();
    });
    // A finger that leaves the window never fires pointerup on the element.
    window.addEventListener('pointerup', release);
    window.addEventListener('blur', release);
  }

  /**
   * Resolve every input source into a single control triple.
   * @param {number} dt for the steering ramp
   * @param {number} [speed] current road speed in m/s, used to tighten the
   *   steering slew limit. Optional so the unit tests can call it without a car.
   */
  read(dt, speed = 0) {
    const keyboardLeft = this.isDown(ACTIONS.steerLeft) ? 1 : 0;
    const keyboardRight = this.isDown(ACTIONS.steerRight) ? 1 : 0;
    const digital = keyboardRight - keyboardLeft;

    const motion = this.motion && this.controlScheme === 'motion' ? this.motion.read(dt) : null;

    /*
     * Steering priority: an explicit key press, then motion, then the stick, then
     * self-centring.
     *
     * The key press comes first on purpose. Motion is a coarse input, and a player
     * who has selected it and then finds themselves unable to place the car on an
     * apex needs a way out that does not involve a menu. Holding a steer key
     * overrides the gyroscope for as long as it is held, which costs nothing for
     * anyone driving with motion -- their hands are on the phone, nowhere near the
     * keys -- and rescues anyone who is not.
     */
    const requested = digital !== 0
      ? moveToward(this.steerValue, digital, KEY_STEER_RATE * dt)
      : motion?.active
        ? motion.steer
        : this.touch.active
          ? // Analogue input wins outright: ramping it here would make the stick feel
            // laggy, which is why the ramp moved to the output stage instead.
            this.touch.steer
          : moveToward(this.steerValue, 0, KEY_STEER_RETURN * dt);

    /*
     * Rate-limit the output rather than the input.
     *
     * Applying this to the requested value means a keyboard ramp and a thumbstick
     * snap get the same physical limit, so the car behaves identically whichever
     * is being used -- which is not true if the limit is applied only to the
     * digital path.
     */
    const slew = lerp(STEER_SLEW_SLOW, STEER_SLEW_FAST, clamp(Math.abs(speed) / STEER_SLEW_REF_SPEED, 0, 1));
    this.steerValue = moveToward(this.steerValue, requested, slew * dt);

    // Both on-screen sources are consulted. `touchButtons` is the one `bindButton`
    // fills and the UI should use; `touch.throttle`/`touch.brake` are the legacy
    // fields and are still accepted so nothing silently regresses to a dead pedal.
    const touchThrottle = Math.max(
      this.touchButtons.has(ACTIONS.throttle) ? 1 : 0,
      this.touch.throttle
    );
    const touchBrake = Math.max(this.touchButtons.has(ACTIONS.brake) ? 1 : 0, this.touch.brake);

    const gamepad = this.readGamepad();

    /*
     * The keyboard still wins over motion.
     *
     * Motion is a coarse input and is not always precise enough to place a car on
     * an apex. Keeping the keys live means anyone can pick the phone up mid-corner
     * without opening a menu first, which is what makes the scheme safe to leave
     * switched on rather than something you commit to before a race.
     */
    const digitalThrottle = this.isDown(ACTIONS.throttle) ? 1 : 0;
    const digitalBrake = this.isDown(ACTIONS.brake) ? 1 : 0;

    return {
      throttle: clamp(
        Math.max(digitalThrottle, touchThrottle, gamepad.throttle, motion?.throttle ?? 0),
        0,
        1
      ),
      brake: clamp(
        Math.max(digitalBrake, touchBrake, gamepad.brake, motion?.brake ?? 0),
        0,
        1
      ),
      steer: clamp(this.steerValue + gamepad.steer, -1, 1),
      handbrake: gamepad.handbrake,
      drs:
        this.isDown(ACTIONS.drs) ||
        this.touchButtons.has(ACTIONS.drs) ||
        this.pressed.has(ACTIONS.drs) ||
        gamepad.drs,
      /*
       * Both halves of this were crossed.
       *
       * ERS was bound as a held button, which writes to `touchButtons`, but
       * `Game.frame` deploys it via `input.consume()`, which reads `pressed`. DRS
       * was bound as a toggle, which writes to `pressed`, but it is read from
       * `controls.drs`, which consults `touchButtons`. Neither worked from touch,
       * and both worked from the keyboard, which is the only way this went
       * unnoticed.
       *
       * Both are now reported as held booleans from both sets, so the binding mode
       * and the read path cannot disagree again. `Game` uses `controls.ers` for
       * symmetry with `controls.drs`.
       */
      ers: this.isDown(ACTIONS.ers) || this.touchButtons.has(ACTIONS.ers) || gamepad.ers
    };
  }

  readGamepad() {
    const result = { throttle: 0, brake: 0, steer: 0, handbrake: false, drs: false, ers: false };
    const pads = navigator.getGamepads?.();
    if (!pads) return result;
    const pad = [...pads].find((candidate) => candidate);
    if (!pad) return result;
    // Standard mapping: RT is the throttle, LT the brake, left stick steering.
    const rightTrigger = pad.buttons[7]?.value ?? 0;
    const leftTrigger = pad.buttons[6]?.value ?? 0;
    result.throttle = rightTrigger;
    result.brake = leftTrigger;
    result.steer = clamp(pad.axes[0] ?? 0, -1, 1);
    result.handbrake = Boolean(pad.buttons[0]?.pressed);
    result.drs = Boolean(pad.buttons[1]?.pressed);
    result.ers = Boolean(pad.buttons[5]?.pressed ?? pad.buttons[7]?.pressed);
    return result;
  }

  /** Clear the digital state, used when the game is paused. */
  clear() {
    this.keys.clear();
    this.touchButtons.clear();
    this.touch.throttle = 0;
    this.touch.brake = 0;
    this.touch.steer = 0;
    this.steerValue = 0;
    // A phone that gets put down mid-corner must not come back with the throttle
    // still wound on from whatever tilt was holding it.
    if (this.motion?.active) this.motion.read(1);
  }

  destroy() {
    this.target.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('keyup', this.onKeyUp);
    this.target.removeEventListener('blur', this.onBlur);
  }
}