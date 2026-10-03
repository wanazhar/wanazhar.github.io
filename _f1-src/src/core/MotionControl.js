/**
 * Gyroscope steering and pedals.
 *
 * Lets the phone be held like the thing it is imitating: roll to steer, pitch to
 * go faster or slower. It is offered alongside the on-screen stick rather than
 * instead of it, because a thumbstick is more precise and motion is more
 * immersive, and which one you want depends on whether you are holding the phone in
 * two hands or one.
 *
 * ## Why this is more than a listener
 *
 * Three things make device orientation controls fail silently, and all three are
 * handled here rather than left to the user to discover:
 *
 * **Permission.** Since iOS 13 `DeviceOrientationEvent.requestPermission()` exists
 * and must be called from inside a user gesture. Calling it on page load returns
 * `denied` with no error, and the game then has a control scheme that looks
 * selected and does nothing.
 *
 * **Null readings.** Plenty of hardware -- desktops, some tablets, anything with no
 * gyroscope -- fires `deviceorientation` perfectly happily with `beta` and `gamma`
 * set to `null`, forever. A handler that reads them gets `NaN`, and `NaN` steering
 * is a car that will not respond to anything. So the first *real* reading is
 * awaited, and if none arrives the scheme reports itself unsupported instead of
 * quietly doing nothing.
 *
 * **Screen rotation.** The raw axes are relative to the *device*, not to what the
 * player sees. Held in landscape, the axis they call "steering" is reported by a
 * completely different raw field. Without compensating, tilting the phone left
 * pitches it forward in the data, and the car accelerates instead of turning.
 *
 * ## Feel
 *
 * Raw orientation is far too twitchy to steer a car. Everything here exists to
 * make it feel like an analogue input rather than a seismograph: a deadzone so a
 * resting phone does not creep, a low-pass filter so hand tremor does not become
 * steering input, and a squared response curve so small corrections are precise and
 * large ones still reach full lock.
 */

/** How far the phone must be tilted, in degrees, for full lock. */
const STEER_RANGE = 34;

/** Pitch beyond neutral for full throttle or full brake, degrees. */
const PEDAL_RANGE = 26;

/**
 * Tilt ignored as hand tremor, degrees.
 *
 * In *output* terms, not input terms: this is the angle at which the stick starts
 * to move at all. It has to exist or a phone resting on a table slowly winds the
 * steering on.
 */
const STEER_DEADZONE = 2.2;

/** Pitch inside this angle of neutral is treated as no pedal input. */
const PEDAL_DEADZONE = 2.5;

/**
 * Smoothing, per frame at 60fps.
 *
 * Low. A filter heavy enough to kill tremor is also heavy enough to add lag to the
 * steering, and lag in a steering input feels like the car is on ropes. Hand
 * tremor is mostly high frequency, so a modest filter removes most of it for very
 * little delay.
 */
const STEER_SMOOTHING = 0.45;
const PEDAL_SMOOTHING = 0.35;

/**
 * Which way is "faster".
 *
 * Beta is positive when the top of the device leans back toward the player, so
 * pushing the phone away from you -- the natural "more speed" gesture -- is
 * negative. Isolated as a constant because it is exactly the kind of thing that
 * differs between how a device is held and which way the player is facing, and it
 * has to be flippable from the settings screen without touching the mapping code.
 */
const PITCH_TO_THROTTLE = -1;

/**
 * How long to wait for a permission answer, milliseconds.
 *
 * A real prompt is answered by the player and can legitimately take as long as they
 * take. This is not that: it is the bound on a *silently broken* prompt, so it is
 * long enough not to fire on a deliberate decision and short enough that the screen
 * recovers on its own if the browser never answers.
 */
const PERMISSION_TIMEOUT = 6000;

/** A reading is only trusted if it is finite and the event is not a null stub. */
function isRealReading(beta, gamma) {
  return Number.isFinite(beta) && Number.isFinite(gamma);
}

export class MotionControl {
  /**
   * A listener installed only for the duration of a single start-up wait, so it
   * can be removed without disturbing the main handler.
   */
  #check = null;

  /**
   * @param {object} [options]
   * @param {Window} [options.target] window to listen on, for testing
   */
  constructor({ target = window } = {}) {
    this.target = target;

    /** Raw device orientation in degrees, or null before the first real reading. */
    this.beta = null;
    this.gamma = null;

    /** Tilt expressed in the player's screen axes, after rotation compensation. */
    this.screenTilt = { x: 0, y: 0 };

    /**
     * Neutral pose, captured by `calibrate()`.
     *
     * Nobody holds a phone perfectly level, and more to the point nobody holds it
     * the same way twice. Measuring the pose the player is actually holding and
     * treating *that* as centre is what makes the control usable rather than
     * something that happens to work for the person who wrote it.
     */
    this.neutral = { x: 0, y: 0 };

    /** Smoothed outputs, -1..1. */
    this.steer = 0;
    this.throttle = 0;
    this.brake = 0;

    /** True once real readings have arrived and the listener is attached. */
    this.active = false;

    /** Flips both axes. See `setInverted`. */
    this.inverted = false;

    /** Why motion is unavailable, for the UI to explain rather than just fail. */
    this.status = 'idle';

  }

  /**
   * Is this device capable of motion input at all?
   *
   * Reports true for a device that *has* the API. That is deliberately not the same
   * question as whether motion will work -- see {@link isBlockedByPolicy} -- and the
   * two are checked separately because they fail for different reasons and need
   * different advice.
   */
  static isSupported(target = window) {
    return typeof target.DeviceOrientationEvent !== 'undefined';
  }

  /**
   * Is motion blocked because the page is not on a secure connection?
   *
   * This is the single most common reason motion appears not to work, and it is
   * invisible: on an insecure origin the API is still *present*, Safari does not
   * throw, no permission prompt appears -- the events simply never fire. Reporting
   * it as "this device has no gyroscope" sends the player to Settings to enable
   * Motion & Orientation Access, which is already on, and changes nothing.
   *
   * `DeviceOrientationEvent` is specified as secure-context-only, so `localhost`
   * counts as secure and a LAN IP address does not.
   */
  static isBlockedByPolicy(target = window) {
    return target.isSecureContext === false;
  }

  /**
   * Does using motion require an explicit permission prompt?
   *
   * True on iOS 13+, where `requestPermission` exists and must be called from a
   * user gesture. Everywhere else the browser grants it silently or not at all, and
   * calling `requestPermission` is either absent or a no-op.
   */
  static needsPermission(target = window) {
    const event = target.DeviceOrientationEvent;
    return Boolean(event && typeof event.requestPermission === 'function');
  }

  /**
   * Ask for permission. Must be called synchronously from a user gesture.
   * @returns {Promise<boolean>} whether motion may be used
   */
  static async requestPermission(target = window) {
    const event = target.DeviceOrientationEvent;
    if (!event) return false;
    if (typeof event.requestPermission !== 'function') return true;

    let timer;
    try {
      // Raced against a timer, because the promise is not always well behaved. Some
      // builds expose `requestPermission` and return a promise that never settles:
      // the call looks exactly like the real one and resolves to nothing, ever.
      // Awaiting it unguarded leaves the caller awaiting forever, which for the
      // settings screen means the button appears to do nothing and no error is ever
      // shown. Racing it turns an invisible hang into an ordinary "unavailable".
      const answer = await Promise.race([
        event.requestPermission(),
        new Promise((resolve) => {
          timer = setTimeout(() => resolve('timeout'), PERMISSION_TIMEOUT);
        })
      ]);
      return answer === 'granted';
    } catch {
      // Thrown when called outside a user gesture. There is nothing to recover to
      // -- the caller has to try again from a real tap -- so this reports false.
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Begin listening, and report whether usable data actually arrives.
   *
   * Resolves rather than throwing: "this device has no gyroscope" is an ordinary
   * outcome to handle in the settings screen, not an error.
   *
   * @returns {Promise<boolean>} whether real readings arrived
   */
  async start() {
    // Checked first, and separately: over plain HTTP the API still exists and
    // nothing throws, so this failure is otherwise indistinguishable from hardware
    // that has no sensor at all.
    if (MotionControl.isBlockedByPolicy(this.target)) {
      this.status = 'insecure';
      return false;
    }
    if (!MotionControl.isSupported(this.target)) {
      this.status = 'unsupported';
      return false;
    }

    this.status = 'waiting';
    this.target.addEventListener('deviceorientation', this.#handleOrientation, { passive: true });

    // Give the device a moment to produce a reading. Some report instantly, others
    // need a second or two of being held still, and giving up too early reports
    // working hardware as broken.
    const arrived = await this.#waitForReading(1500);
    this.active = arrived;
    this.status = arrived ? 'active' : 'no-signal';
    return arrived;
  }

  stop() {
    this.target.removeEventListener('deviceorientation', this.#handleOrientation);
    this.active = false;
    this.steer = 0;
    this.throttle = 0;
    this.brake = 0;
    if (this.status === 'active') this.status = 'idle';

    /*
     * Forget the last reading.
     *
     * `start()` treats a stored reading as proof the sensor is live, so keeping it
     * means a controller that is switched off and on again reports success without
     * the sensor ever having spoken. In practice that presents as motion controls
     * that are selected, show as calibrated, and do nothing -- the exact failure
     * this class exists to make impossible. A fresh session has to prove itself.
     */
    this.beta = null;
    this.gamma = null;
  }

  /**
   * Treat the current pose as centre.
   *
   * The neutral pose is captured as the first real reading rather than an average,
   * because averaging would still include the motion of the hand that is holding
   * the phone -- which is exactly the tremor being filtered out.
   */
  calibrate() {
    if (this.screenTilt.x === 0 && this.screenTilt.y === 0 && this.beta === null) return false;
    this.neutral = { ...this.screenTilt };
    this.steer = 0;
    this.throttle = 0;
    this.brake = 0;
    return true;
  }

  /**
   * Read the controls for this frame.
   * @param {number} dt seconds
   * @returns {{steer: number, throttle: number, brake: number, active: boolean}}
   */
  read(dt) {
    if (!this.active) return { steer: 0, throttle: 0, brake: 0, active: false };

    const steerOffset = (this.screenTilt.x - this.neutral.x) * (this.inverted ? -1 : 1);
    const pitchOffset = (this.screenTilt.y - this.neutral.y) * PITCH_TO_THROTTLE * (this.inverted ? -1 : 1);

    const steerTarget = this.#axis(steerOffset, STEER_RANGE, STEER_DEADZONE);
    const pitchTarget = this.#axis(pitchOffset, PEDAL_RANGE, PEDAL_DEADZONE);

    this.steer += (steerTarget - this.steer) * (1 - Math.exp(-STEER_SMOOTHING * 60 * dt));
    this.throttle += (Math.max(pitchTarget, 0) - this.throttle) * (1 - Math.exp(-PEDAL_SMOOTHING * 60 * dt));
    this.brake += (Math.max(-pitchTarget, 0) - this.brake) * (1 - Math.exp(-PEDAL_SMOOTHING * 60 * dt));

    return {
      steer: clamp(this.steer, -1, 1),
      throttle: clamp(this.throttle, 0, 1),
      brake: clamp(this.brake, 0, 1),
      active: true
    };
  }

  /**
   * Flip both axes.
   *
   * Offered because there is no way to be sure which way a given device reports its
   * axes once a screen rotation is involved, and a steering axis that is reversed is
   * immediately obvious to the player and completely invisible in testing. A toggle
   * in the settings screen solves it without needing the hardware.
   */
  setInverted(inverted) {
    this.inverted = Boolean(inverted);
  }

  /** Human-readable reason motion is not working, for the settings screen. */
  describeFailure() {
    switch (this.status) {
      case 'insecure':
        return 'Motion sensors need HTTPS. This page is not on a secure connection, so the browser will never report any. Try the https:// address, not http://.';
      case 'unsupported':
        return 'This browser does not report orientation.';
      case 'no-signal':
        return 'The sensor is reachable but reported nothing. On iPhone, check Settings > Safari > Motion & Orientation Access is on.';
      case 'denied':
        return 'Motion access was declined.';
      case 'waiting':
        return 'Waiting for the motion sensor…';
      default:
        return null;
    }
  }

  /*
   * An arrow-function field rather than a method.
   *
   * This handler is handed straight to `addEventListener` and later to
   * `removeEventListener`, and those have to be given the *same* function object or
   * the listener is never detached. A method would need binding in the constructor,
   * and private methods are read-only -- `this.#handler = ...` throws
   * "Private method is not writable". A field holds its own bound copy.
   */
  #handleOrientation = (event) => {
    if (!isRealReading(event.beta, event.gamma)) return;
    this.beta = event.beta;
    this.gamma = event.gamma;
    this.screenTilt = this.#toScreenAxes(event.beta, event.gamma);
  };

  /**
   * Resolves true as soon as a real reading lands.
   * @param {number} timeout milliseconds
   */
  #waitForReading(timeout) {
    return new Promise((resolve) => {
      if (this.beta !== null) {
        resolve(true);
        return;
      }
      const timer = setTimeout(() => {
        this.target.removeEventListener('deviceorientation', this.#check);
        resolve(this.beta !== null);
      }, timeout);
      this.#check = () => {
        if (this.beta === null) return;
        clearTimeout(timer);
        this.target.removeEventListener('deviceorientation', this.#check);
        resolve(true);
      };
      this.target.addEventListener('deviceorientation', this.#check, { passive: true });
    });
  }

  /**
   * Convert device-relative tilt into the axes the player is looking at.
   *
   * `beta` is rotation about the device's long axis and `gamma` about its short
   * one, both relative to how the *device* is held. When the screen is rotated --
   * which for this game is always, since it requires landscape -- the field the
   * player would call "sideways" is a different one entirely.
   *
   * @param {number} beta
   * @param {number} gamma
   * @returns {{x: number, y: number}} x is screen-horizontal tilt, y screen-vertical
   */
  #toScreenAxes(beta, gamma) {
    const angle = this.#screenAngle();
    switch (angle) {
      case 90:
        // Device rotated a quarter turn anticlockwise: the long axis now measures
        // what the player sees as sideways.
        return { x: -beta, y: gamma };
      case 180:
        return { x: -gamma, y: -beta };
      case 270:
        return { x: beta, y: -gamma };
      default:
        return { x: gamma, y: beta };
    }
  }

  #screenAngle() {
    const orientation = this.target.screen?.orientation;
    if (orientation && typeof orientation.angle === 'number') return orientation.angle;
    // `window.orientation` is deprecated but is still the only source on some iOS
    // versions, where `screen.orientation` is absent.
    const legacy = this.target.orientation;
    return typeof legacy === 'number' ? (legacy < 0 ? legacy + 360 : legacy) : 0;
  }

  /**
   * Map an angle offset onto -1..1, with a deadzone and a squared curve.
   *
   * Squaring is what makes this steerable: linear tilt means the first degree of
   * roll produces a full unit of steering, and nothing finer is expressible. Squared
   * means small movements are small, which is most of what a driver does.
   */
  #axis(offset, range, deadzone) {
    const magnitude = Math.abs(offset);
    if (magnitude <= deadzone) return 0;
    const scaled = Math.min((magnitude - deadzone) / (range - deadzone), 1);
    const curved = scaled * scaled;
    return Math.sign(offset) * curved;
  }

}

function clamp(value, low, high) {
  return value < low ? low : value > high ? high : value;
}