const KEY_BINDINGS = {
  KeyW: ['throttle', 1], ArrowUp: ['throttle', 1],
  KeyS: ['brake', 1], ArrowDown: ['brake', 1],
  KeyA: ['steerLeft', 1], ArrowLeft: ['steerLeft', 1],
  KeyD: ['steerRight', 1], ArrowRight: ['steerRight', 1],
  KeyQ: ['cameraLeft', 1], KeyE: ['cameraRight', 1],
  Equal: ['cameraZoomIn', 1], NumpadAdd: ['cameraZoomIn', 1],
  Minus: ['cameraZoomOut', 1], NumpadSubtract: ['cameraZoomOut', 1],
  Space: ['handbrake', 1], KeyR: ['reset', 1],
  KeyC: ['resetCamera', 1], KeyV: ['cameraToggle', 1], Tab: ['toggleUi', 1]
};

const ORBIT_PER_PIXEL = 0.0072;
const PITCH_PER_PIXEL = 0.0055;
const WHEEL_STEP = 0.9;
const DOUBLE_TAP_MS = 280;
const STICK_DEAD_ZONE = 0.08;

export class InputController {
  constructor(target = window) {
    this.target = target;
    this.keys = new Set();
    this.touch = new Map();
    this.pressed = new Set();
    this.orbitDelta = 0;
    this.pitchDelta = 0;
    this.zoomDelta = 0;
    this.pinchDistance = 0;
    this.draggingPointer = null;
    this.pinchPointers = new Map();
    this.lastX = 0;
    this.lastY = 0;
    this.lastTapAt = 0;
    this.stickSteer = 0;
    this.stickActive = false;
    this.panX = 0;
    this.panY = 0;
    this.panPointer = null;
    this.pinchMid = null;
    this.state = {
      throttle: 0, brake: 0, steer: 0, handbrake: 0,
      cameraOrbit: 0, cameraPitch: 0, cameraZoom: 0, cameraOrbitKeyboard: 0, cameraPanX: 0, cameraPanY: 0
    };

    target.addEventListener('keydown', (event) => {
      const binding = KEY_BINDINGS[event.code];
      if (!binding) return;
      if (event.code === 'Tab' || event.code === 'Space') event.preventDefault();
      if (!this.keys.has(event.code)) this.pressed.add(binding[0]);
      this.keys.add(event.code);
    });
    target.addEventListener('keyup', (event) => this.keys.delete(event.code));
  }

  bindTouchElement(element) {
    const control = element.dataset.control;
    if (!control) return;
    const setPressed = (pressed) => {
      if (pressed) this.touch.set(control, true);
      else this.touch.delete(control);
      element.dataset.pressed = pressed ? 'true' : 'false';
    };
    element.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      setPressed(true);
      if (element.dataset.action === 'reset') this.pressed.add('reset');
      if (element.dataset.action === 'camera') this.pressed.add('cameraToggle');
      // Zoom buttons also fire a discrete step on press, so a quick tap always registers even
      // though the held state is only sampled once per frame.
      if (control === 'cameraZoomIn') this.zoomDelta -= WHEEL_STEP;
      if (control === 'cameraZoomOut') this.zoomDelta += WHEEL_STEP;
      try { element.setPointerCapture?.(event.pointerId); } catch { /* synthetic pointers may not be capturable */ }
    });
    element.addEventListener('pointerup', () => setPressed(false));
    element.addEventListener('pointercancel', () => setPressed(false));
    element.addEventListener('pointerleave', () => setPressed(false));
  }

  /**
   * Analogue steering: a horizontal track whose knob follows the thumb. The offset from centre is
   * the steering input, which gives proportional control instead of the on/off of arrow buttons.
   */
  bindStickElement(element) {
    const knob = element.querySelector('[data-knob]');
    const travel = () => Math.max(1, element.clientWidth / 2 - 26);

    const apply = (event) => {
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const limit = travel();
      // Dead zone plus a gentle expo curve: fine corrections near centre, full lock at the ends.
      const raw = Math.max(-1, Math.min(1, dx / limit));
      const magnitude = Math.abs(raw);
      const dead = STICK_DEAD_ZONE;
      this.stickSteer = magnitude <= dead
        ? 0
        : Math.sign(raw) * Math.pow((magnitude - dead) / (1 - dead), 1.3);
      if (knob) knob.style.transform = `translate(calc(-50% + ${this.stickSteer * limit}px), -50%)`;
      element.setAttribute('aria-valuenow', String(Math.round(this.stickSteer * 100)));
    };

    const release = () => {
      this.stickSteer = 0;
      this.stickActive = false;
      if (knob) knob.style.transform = 'translate(-50%, -50%)';
      element.removeAttribute('data-active');
      element.setAttribute('aria-valuenow', '0');
    };

    element.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      this.stickActive = true;
      element.setAttribute('data-active', 'true');
      try { element.setPointerCapture?.(event.pointerId); } catch { /* synthetic pointers may not be capturable */ }
      apply(event);
    });
    element.addEventListener('pointermove', (event) => {
      if (!this.stickActive) return;
      event.preventDefault();
      apply(event);
    });
    element.addEventListener('pointerup', release);
    element.addEventListener('pointercancel', release);
    element.addEventListener('lostpointercapture', release);
  }

  bindCameraElement(element) {
    element.style.touchAction = 'none';

    const pinchSpan = () => {
      const [a, b] = [...this.pinchPointers.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const pinchMid = () => {
      const [a, b] = [...this.pinchPointers.values()];
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    };

    element.addEventListener('pointerdown', (event) => {
      this.pinchPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (this.pinchPointers.size === 2) {
        this.pinchDistance = pinchSpan();
        this.pinchMid = pinchMid();
        this.draggingPointer = null;
        return;
      }
      if (this.pinchPointers.size > 2) return;

      // Middle or right drag pans the camera across the world, like a map.
      if (event.button === 1 || event.button === 2) {
        this.panPointer = event.pointerId;
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        try { element.setPointerCapture?.(event.pointerId); } catch { /* ignored */ }
        return;
      }

      const now = performance.now();
      if (now - this.lastTapAt < DOUBLE_TAP_MS) {
        this.pressed.add('recenterCamera');
        this.lastTapAt = 0;
      } else {
        this.lastTapAt = now;
      }

      this.draggingPointer = event.pointerId;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      try { element.setPointerCapture?.(event.pointerId); } catch { /* ignored */ }
    });

    element.addEventListener('pointermove', (event) => {
      if (!this.pinchPointers.has(event.pointerId)) return;
      this.pinchPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (this.pinchPointers.size >= 2) {
        const span = pinchSpan();
        // Zoom on the ratio rather than the raw gap, so the gesture feels the same at any scale.
        if (this.pinchDistance > 0 && span > 0) {
          this.zoomDelta += Math.log(this.pinchDistance / span) * 2.2;
        }
        this.pinchDistance = span;

        // Moving both fingers together slides the camera across the world.
        const mid = pinchMid();
        if (this.pinchMid) {
          this.panX -= mid.x - this.pinchMid.x;
          this.panY -= mid.y - this.pinchMid.y;
        }
        this.pinchMid = mid;
        return;
      }

      if (this.panPointer === event.pointerId) {
        this.panX -= event.clientX - this.lastX;
        this.panY -= event.clientY - this.lastY;
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        return;
      }

      if (this.draggingPointer !== event.pointerId) return;
      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.orbitDelta += dx * ORBIT_PER_PIXEL;
      this.pitchDelta += dy * PITCH_PER_PIXEL;
    });

    const release = (event) => {
      this.pinchPointers.delete(event.pointerId);
      if (this.pinchPointers.size < 2) {
        this.pinchDistance = 0;
        this.pinchMid = null;
      }
      if (this.draggingPointer === event.pointerId) this.draggingPointer = null;
      if (this.panPointer === event.pointerId) this.panPointer = null;
    };
    element.addEventListener('pointerup', release);
    element.addEventListener('pointercancel', release);
    element.addEventListener('pointerleave', release);
    element.addEventListener('contextmenu', (event) => event.preventDefault());

    element.addEventListener('wheel', (event) => {
      event.preventDefault();
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1;
      const delta = event.deltaY * scale;
      const trackpad = !Number.isInteger(event.deltaY) || Math.abs(event.deltaY) < 40 || event.ctrlKey;
      const step = trackpad ? WHEEL_STEP * 0.5 : WHEEL_STEP;
      this.zoomDelta += Math.sign(delta) * step;
    }, { passive: false });
  }

  update() {
    const key = (code) => this.keys.has(code);
    const touch = (name) => this.touch.has(name);
    this.state.throttle = key('KeyW') || key('ArrowUp') || touch('throttle') ? 1 : 0;
    this.state.brake = key('KeyS') || key('ArrowDown') || touch('brake') ? 1 : 0;
    const steerLeft = key('KeyA') || key('ArrowLeft') || touch('steerLeft') ? 1 : 0;
    const steerRight = key('KeyD') || key('ArrowRight') || touch('steerRight') ? 1 : 0;
    const digital = steerRight - steerLeft;
    this.state.steer = Math.max(-1, Math.min(1, this.stickSteer + digital));
    this.state.handbrake = key('Space') || touch('handbrake') ? 1 : 0;
    this.state.cameraOrbitKeyboard = (key('KeyE') ? 1 : 0) - (key('KeyQ') ? 1 : 0);

    const keyboardZoom = (key('Minus') || key('NumpadSubtract') || touch('cameraZoomOut') ? 1 : 0)
      - (key('Equal') || key('NumpadAdd') || touch('cameraZoomIn') ? 1 : 0);

    this.state.cameraOrbit = this.orbitDelta;
    this.state.cameraPitch = this.pitchDelta;
    this.state.cameraZoom = this.zoomDelta + keyboardZoom * 0.7;
    this.state.cameraPanX = this.panX;
    this.state.cameraPanY = this.panY;
    this.orbitDelta = 0;
    this.pitchDelta = 0;
    this.zoomDelta = 0;
    this.panX = 0;
    this.panY = 0;
  }

  consumePressed(action) {
    if (!this.pressed.has(action)) return false;
    this.pressed.delete(action);
    return true;
  }
}
