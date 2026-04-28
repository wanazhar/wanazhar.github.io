const KEY_BINDINGS = {
  KeyW: ['throttle', 1], ArrowUp: ['throttle', 1],
  KeyS: ['brake', 1], ArrowDown: ['brake', 1],
  KeyA: ['steerLeft', 1], ArrowLeft: ['steerLeft', 1],
  KeyD: ['steerRight', 1], ArrowRight: ['steerRight', 1],
  Space: ['handbrake', 1], KeyR: ['reset', 1], Tab: ['toggleUi', 1]
};

export class InputController {
  constructor(target = window) {
    this.target = target;
    this.keys = new Set();
    this.touch = new Map();
    this.pressed = new Set();
    this.state = { throttle: 0, brake: 0, steer: 0, handbrake: 0 };

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
    element.addEventListener('pointerdown', (event) => { event.preventDefault(); element.setPointerCapture?.(event.pointerId); setPressed(true); });
    element.addEventListener('pointerup', () => setPressed(false));
    element.addEventListener('pointercancel', () => setPressed(false));
    element.addEventListener('pointerleave', () => setPressed(false));
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
  }

  consumePressed(action) {
    if (!this.pressed.has(action)) return false;
    this.pressed.delete(action);
    return true;
  }
}
