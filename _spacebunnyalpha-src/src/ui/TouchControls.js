import { el } from './HUD.js';

// Touch controls. Only mounted on coarse-pointer devices, so a desktop player
// never sees them and a phone player is not stuck without a way to walk.
export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(pointer: coarse)').matches ?? 'ontouchstart' in window;
}

export class TouchControls {
  constructor(root, input, { onInteract, onJournal, onMap, onBag } = {}) {
    this.input = input;
    this.node = el('div', 'touch');

    // Left thumbstick: an analog pad that feeds camera-relative movement.
    this.stick = el('div', 'touch-stick');
    this.knob = el('div', 'touch-stick-knob');
    this.stick.appendChild(this.knob);
    this.stickIndex = null;
    this.origin = { x: 0, y: 0 };
    this.radius = 52;

    // Right cluster: run, interact, and the menus.
    this.buttons = el('div', 'touch-buttons');
    this.buttonMap = {};

    for (const [key, label, mode] of [
      ['interact', 'E', 'press'],
      ['run', '走', 'hold'],
      ['jump', '↑', 'hold'],
      ['menu', '≡', 'once']
    ]) {
      const button = el('button', 'touch-button', label);
      button.type = 'button';
      button.setAttribute('aria-label', label);
      this.buttons.appendChild(button);
      this.buttonMap[key] = button;
      this.wireButton(button, key, mode);
    }

    this.node.append(this.stick, this.buttons);
    root.appendChild(this.node);

    this.wireStick();
    this.onInteract = onInteract;
    this.onJournal = onJournal;
    this.onMap = onMap;
    this.onBag = onBag;
  }

  wireStick() {
    const move = (e) => {
      const touch = [...e.touches].find((t) => t.identifier === this.stickIndex);
      if (!touch) return;
      const dx = touch.clientX - this.origin.x;
      const dy = touch.clientY - this.origin.y;
      const dist = Math.hypot(dx, dy);
      const clamped = Math.min(dist, this.radius);
      const nx = dist > 0 ? (dx / dist) * clamped : 0;
      const ny = dist > 0 ? (dy / dist) * clamped : 0;
      this.knob.style.transform = `translate(${nx}px, ${ny}px)`;
      // Normalised so the stick is camera-relative but speed-scaled by distance.
      this.input.setStick(nx / this.radius, -ny / this.radius, true);
    };

    const end = (e) => {
      const stillDown = [...e.touches].some((t) => t.identifier === this.stickIndex);
      if (stillDown) return;
      this.stickIndex = null;
      this.knob.style.transform = 'translate(0px, 0px)';
      this.input.setStick(0, 0, false);
    };

    this.stick.addEventListener(
      'touchstart',
      (e) => {
        const touch = e.changedTouches[0];
        this.stickIndex = touch.identifier;
        const rect = this.stick.getBoundingClientRect();
        this.origin = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        move(e);
        e.preventDefault();
      },
      { passive: false }
    );
    this.stick.addEventListener('touchmove', move, { passive: false });
    this.stick.addEventListener('touchend', end);
    this.stick.addEventListener('touchcancel', end);
  }

  wireButton(button, key, mode) {
    const down = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (mode === 'hold') this.input.press(key);
      if (mode === 'press') {
        // Interact fires once on press rather than being held.
        this.input.press(key);
        this.onInteract?.();
      }
      if (mode === 'once') this.onMenu?.();
    };
    const up = (e) => {
      e.preventDefault();
      if (mode === 'hold' || mode === 'press') this.input.release(key);
    };
    button.addEventListener('touchstart', down, { passive: false });
    button.addEventListener('touchend', up, { passive: false });
    button.addEventListener('touchcancel', up, { passive: false });
    // Also accept a mouse click, which makes the overlay testable on desktop.
    button.addEventListener('click', (e) => {
      if (mode === 'once') this.onMenu?.();
      if (mode === 'press') this.onInteract?.();
    });
  }

  setMenuHandler(handler) {
    this.onMenu = handler;
  }

  dispose() {
    this.input.setStick(0, 0, false);
    this.node.remove();
  }
}