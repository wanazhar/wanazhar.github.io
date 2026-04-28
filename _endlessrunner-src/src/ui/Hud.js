import { GameState } from '../core/Constants.js';

export class Hud {
  constructor(stateManager, { onSwipeThresholdChange = null, getSwipeThreshold = null } = {}) {
    this.stateManager = stateManager;
    this.onSwipeThresholdChange = onSwipeThresholdChange;
    this.getSwipeThreshold = getSwipeThreshold;

    this.scoreEl = document.querySelector('[data-hud="score"]');
    this.speedEl = document.querySelector('[data-hud="speed"]');
    this.coinsEl = document.querySelector('[data-hud="coins"]');
    this.menuEl = document.querySelector('[data-hud="menu"]');
    this.buttonEl = document.querySelector('[data-action="start"]');
    this.panelTitle = document.querySelector('[data-hud="panel-title"]');
    this.panelCopy = document.querySelector('[data-hud="panel-copy"]');
    this.swipeRange = document.querySelector('[data-action="swipe-threshold"]');
    this.swipeLabel = document.querySelector('[data-hud="swipe-threshold-label"]');

    this.buttonEl?.addEventListener('click', () => this.stateManager.startGame());

    if (this.swipeRange) {
      const initialValue = getSwipeThreshold ? getSwipeThreshold() : Number(this.swipeRange.value);
      this.swipeRange.value = String(initialValue);
      this.updateSwipeLabel(initialValue);
      this.swipeRange.addEventListener('input', (event) => {
        const value = Number(event.target.value);
        const applied = this.onSwipeThresholdChange ? this.onSwipeThresholdChange(value) : value;
        this.updateSwipeLabel(applied);
      });
    }

    this.unsubscribe = this.stateManager.subscribe((state, previous) => this.render(state, previous));
  }

  render(state) {
    if (this.scoreEl) this.scoreEl.textContent = `${Math.floor(state.score).toLocaleString()}`;
    if (this.speedEl) this.speedEl.textContent = `${state.speedMultiplier.toFixed(2)}x`;
    if (this.coinsEl) this.coinsEl.textContent = `${state.coins.toLocaleString()}`;

    if (!this.menuEl) return;

    const isPlaying = state.gameState === GameState.PLAYING;
    this.menuEl.classList.toggle('is-hidden', isPlaying);

    if (state.gameState === GameState.START) {
      if (this.panelTitle) this.panelTitle.textContent = 'Endless Runner';
      if (this.panelCopy) this.panelCopy.textContent = 'Swipe to dodge, jump, and roll.';
      if (this.buttonEl) this.buttonEl.textContent = 'Start run';
    }

    if (state.gameState === GameState.GAME_OVER) {
      if (this.panelTitle) this.panelTitle.textContent = 'Run over';
      if (this.panelCopy) this.panelCopy.textContent = `Final score ${state.lastRunScore.toLocaleString()}. Tap below to run again.`;
      if (this.buttonEl) this.buttonEl.textContent = 'Run again';
    }
  }

  updateSwipeLabel(value) {
    if (!this.swipeLabel) return;
    const mode = value <= 40 ? 'Fast' : value <= 64 ? 'Balanced' : 'Precise';
    this.swipeLabel.textContent = `${mode} · ${Math.round(value)}px`;
  }

  destroy() {
    this.unsubscribe?.();
  }
}
