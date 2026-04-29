const KEY_BINDINGS = {
  KeyW: ['throttle', 1], ArrowUp: ['throttle', 1],
  KeyS: ['brake', 1], ArrowDown: ['brake', 1],
  KeyA: ['steerLeft', 1], ArrowLeft: ['steerLeft', 1],
  KeyD: ['steerRight', 1], ArrowRight: ['steerRight', 1],
  KeyQ: ['cameraLeft', 1], KeyE: ['cameraRight', 1],
  Equal: ['cameraZoomIn', 1], NumpadAdd: ['cameraZoomIn', 1],
  Minus: ['cameraZoomOut', 1], NumpadSubtract: ['cameraZoomOut', 1],
  Space: ['handbrake', 1], KeyR: ['reset', 1], KeyC: ['resetCamera', 1], Tab: ['toggleUi', 1]
};

export class InputController {
  constructor(target = window) {
    this.target = target;
    this.keys = new Set();
    this.touch = new Map();
    this.pressed = new Set();
    this.pointerCameraDelta = 0;
    this.pointerZoomDelta = 0;
    this.draggingCameraPointer = null;
    this.lastCameraPointerX = 0;
    this.state = { throttle: 0, brake: 0, steer: 0, handbrake: 0, cameraOrbit: 0, cameraOrbitKeyboard: 0, cameraZoom: 0 };

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
      if (pressed) this.touch.set(control, true); else this.touch.delete(control);
      element.dataset.pressed = pressed ? 'true' : 'false';
    };
    element.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      setPressed(true);
      if (control === 'resetCamera') this.pressed.add('resetCamera');
      try { element.setPointerCapture?.(event.pointerId); } catch { /* synthetic/test pointers may not be capturable */ }
    });
    element.addEventListener('pointerup', () => setPressed(false));
    element.addEventListener('pointercancel', () => setPressed(false));
    element.addEventListener('pointerleave', () => setPressed(false));
  }

  bindCameraElement(element) {
    element.style.touchAction = 'none';
    element.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button > 0) return;
      this.draggingCameraPointer = event.pointerId;
      this.lastCameraPointerX = event.clientX;
      try { element.setPointerCapture?.(event.pointerId); } catch { /* ignored for synthetic/test pointers */ }
    });
    element.addEventListener('pointermove', (event) => {
      if (this.draggingCameraPointer !== event.pointerId) return;
      const dx = event.clientX - this.lastCameraPointerX;
      this.lastCameraPointerX = event.clientX;
      this.pointerCameraDelta += dx * 0.008;
    });
    const stopDrag = (event) => {
      if (this.draggingCameraPointer === event.pointerId) this.draggingCameraPointer = null;
    };
    element.addEventListener('pointerup', stopDrag);
    element.addEventListener('pointercancel', stopDrag);
    element.addEventListener('wheel', (event) => {
      event.preventDefault();
      this.pointerZoomDelta += Math.sign(event.deltaY) * 0.9;
    }, { passive: false });
  }

  update() {
    const key = (code) => this.keys.has(code);
    const touch = (name) => this.touch.has(name);
    this.state.throttle = key('KeyW') || key('ArrowUp') || touch('throttle') ? 1 : 0;
    this.state.brake = key('KeyS') || key('ArrowDown') || touch('brake') ? 1 : 0;
    const steerLeft = key('KeyA') || key('ArrowLeft') || touch('steerLeft') ? 1 : 0;
    const steerRight = key('KeyD') || key('ArrowRight') || touch('steerRight') ? 1 : 0;
    this.state.steer = steerRight - steerLeft;
    this.state.handbrake = key('Space') || touch('handbrake') ? 1 : 0;
    const keyboardCamera = (key('KeyE') ? 1 : 0) - (key('KeyQ') ? 1 : 0);
    const keyboardZoom = (key('Minus') || key('NumpadSubtract') || touch('cameraZoomOut') ? 1 : 0)
      - (key('Equal') || key('NumpadAdd') || touch('cameraZoomIn') ? 1 : 0);
    this.state.cameraOrbit = this.pointerCameraDelta;
    this.state.cameraOrbitKeyboard = keyboardCamera;
    this.state.cameraZoom = this.pointerZoomDelta + keyboardZoom * 0.6;
    this.pointerCameraDelta = 0;
    this.pointerZoomDelta = 0;
  }

  consumePressed(action) {
    if (!this.pressed.has(action)) return false;
    this.pressed.delete(action);
    return true;
  }
}
