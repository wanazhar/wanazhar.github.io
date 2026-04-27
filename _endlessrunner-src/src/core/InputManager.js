export class InputManager {
  constructor(target = window) {
    this.target = target;
    this.actions = new Map();
    this.touchStart = null;
    this.deadZone = 34;
    this.enabled = true;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
  }

  bind(actions) {
    this.actions = new Map(Object.entries(actions));
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
    window.addEventListener('pointerup', this.handlePointerUp, { passive: true });

    document.querySelectorAll('[data-touch]').forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        this.emit(button.dataset.touch);
      });
    });
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointerup', this.handlePointerUp);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
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
    if (event.target?.closest?.('button')) return;
    this.touchStart = { x: event.clientX, y: event.clientY, time: performance.now() };
  }

  handlePointerUp(event) {
    if (!this.touchStart || event.target?.closest?.('button')) return;
    const dx = event.clientX - this.touchStart.x;
    const dy = event.clientY - this.touchStart.y;
    this.touchStart = null;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < this.deadZone) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.emit(dx < 0 ? 'left' : 'right');
    } else {
      this.emit(dy < 0 ? 'jump' : 'roll');
    }
  }
}
