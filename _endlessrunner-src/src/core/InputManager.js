const STORAGE_KEY = 'endless-runner-swipe-threshold';

export class InputManager {
  constructor(target = window) {
    this.target = target;
    this.actions = new Map();
    this.touchStart = null;
    this.deadZone = this.readStoredThreshold();
    this.enabled = true;
    this.axisBias = 1.05;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
  }

  bind(actions) {
    this.actions = new Map(Object.entries(actions));
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
    window.addEventListener('pointerup', this.handlePointerUp, { passive: true });
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointerup', this.handlePointerUp);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setSwipeThreshold(value) {
    this.deadZone = Math.max(24, Math.min(96, Math.round(Number(value) || 52)));
    try { window.localStorage.setItem(STORAGE_KEY, String(this.deadZone)); } catch {}
    return this.deadZone;
  }

  getSwipeThreshold() {
    return this.deadZone;
  }

  readStoredThreshold() {
    try {
      const stored = Number(window.localStorage.getItem(STORAGE_KEY));
      if (Number.isFinite(stored) && stored >= 24 && stored <= 96) return Math.round(stored);
    } catch {}
    return 52;
  }

  emit(action) {
    if (!this.enabled) return;
    const handler = this.actions.get(action);
    if (handler) handler();
  }

  handleKeyDown(event) {
    const keyMap = {
      ArrowLeft: 'left',
      KeyA: 'left',
      ArrowRight: 'right',
      KeyD: 'right',
      ArrowUp: 'jump',
      Space: 'jump',
      KeyW: 'jump',
      ArrowDown: 'roll',
      KeyS: 'roll'
    };

    const action = keyMap[event.code];
    if (action) {
      event.preventDefault();
      this.emit(action);
    }
  }

  handlePointerDown(event) {
    if (event.target?.closest?.('button, input, label')) return;
    this.touchStart = { x: event.clientX, y: event.clientY, time: performance.now() };
  }

  handlePointerUp(event) {
    if (!this.touchStart || event.target?.closest?.('button, input, label')) return;

    const dx = event.clientX - this.touchStart.x;
    const dy = event.clientY - this.touchStart.y;
    this.touchStart = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < this.deadZone) return;

    if (absX > absY * this.axisBias) {
      this.emit(dx < 0 ? 'left' : 'right');
      return;
    }

    if (absY > absX * this.axisBias) {
      this.emit(dy < 0 ? 'jump' : 'roll');
      return;
    }

    this.emit(absX >= absY ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'jump' : 'roll'));
  }
}
