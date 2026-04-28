import { GameState, PowerUpType } from '../core/Constants.js';
import { THEMES } from '../core/ThemePresets.js';

const powerUpLabels = {
  [PowerUpType.MAGNET]: 'Magnet',
  [PowerUpType.MULTIPLIER]: '2x Score',
  [PowerUpType.JETPACK]: 'Jetpack',
  [PowerUpType.SHIELD]: 'Shield'
};

export class Hud {
  constructor(stateManager, themeManager, options = {}) {
    this.stateManager = stateManager;
    this.themeManager = themeManager;
    this.options = options;

    this.scoreValue = document.querySelector('[data-score-value]');
    this.coinsValue = document.querySelector('[data-coins-value]');
    this.highScoreValue = document.querySelector('[data-high-score-value]');
    this.startButton = document.querySelector('[data-start-button]');
    this.resetScoresButton = document.querySelector('[data-reset-scores-button]');
    this.overlay = document.querySelector('[data-overlay]');
    this.overlayTitle = document.querySelector('[data-overlay-title]');
    this.overlayBody = document.querySelector('[data-overlay-body]');
    this.overlayMeta = document.querySelector('[data-overlay-meta]');
    this.powerUps = document.querySelector('[data-powerups]');
    this.swipeSlider = document.querySelector('[data-swipe-threshold]');
    this.swipeValue = document.querySelector('[data-swipe-threshold-value]');
    this.themeButtons = Array.from(document.querySelectorAll('[data-theme-button]'));
    this.themeLabel = document.querySelector('[data-theme-label]');

    this.bind();
    this.stateManager.subscribe((state) => this.render(state));
    this.themeManager.subscribe((themeId) => this.renderTheme(themeId));
  }

  bind() {
    this.startButton?.addEventListener('click', () => this.options.onStart?.());
    this.resetScoresButton?.addEventListener('click', () => {
      this.options.onResetScores?.();
      this.render(this.stateManager.getState());
    });

    if (this.swipeSlider) {
      const initial = this.options.getSwipeThreshold?.() ?? Number(this.swipeSlider.value);
      this.swipeSlider.value = String(initial);
      this.setSwipeText(initial);
      this.swipeSlider.addEventListener('input', (event) => {
        const value = Number(event.target.value);
        this.setSwipeText(value);
        this.options.onSwipeThresholdChange?.(value);
      });
    }

    this.themeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const theme = button.dataset.themeButton;
        if (theme) this.options.onThemeChange?.(theme);
      });
    });
  }

  setSwipeText(value) {
    if (this.swipeValue) this.swipeValue.textContent = `${value}px`;
  }

  renderTheme(themeId) {
    this.themeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.themeButton === themeId);
      button.setAttribute('aria-pressed', String(button.dataset.themeButton === themeId));
    });
    if (this.themeLabel) this.themeLabel.textContent = THEMES[themeId]?.uiLabel ?? 'Theme';
  }

  render(state) {
    this.scoreValue.textContent = Math.floor(state.score).toLocaleString();
    this.coinsValue.textContent = state.coins.toLocaleString();
    this.highScoreValue.textContent = Math.floor(state.highScore).toLocaleString();
    this.renderPowerUps(state.activePowerUps);

    if (state.gameState === GameState.START) {
      this.overlay.hidden = false;
      this.overlayTitle.textContent = 'Endless Runner v5';
      this.overlayBody.textContent = 'Redesigned anime mode now uses dedicated art assets, while gameplay stays fast and unobstructed.';
      this.overlayMeta.innerHTML = `High Score <strong>${Math.floor(state.highScore).toLocaleString()}</strong>`;
      this.startButton.textContent = 'Start Run';
    } else if (state.gameState === GameState.GAME_OVER) {
      this.overlay.hidden = false;
      this.overlayTitle.textContent = 'Run Over';
      this.overlayBody.textContent = 'Swap themes or adjust controls in Settings, then jump straight back in.';
      this.overlayMeta.innerHTML = `Run Score <strong>${state.lastRunScore.toLocaleString()}</strong> · High Score <strong>${Math.floor(state.highScore).toLocaleString()}</strong>`;
      this.startButton.textContent = 'Restart';
    } else {
      this.overlay.hidden = true;
    }
  }

  renderPowerUps(activePowerUps = {}) {
    if (!this.powerUps) return;
    this.powerUps.innerHTML = '';
    const entries = Object.entries(activePowerUps).filter(([, remaining]) => remaining > 0);

    if (!entries.length) {
      this.powerUps.innerHTML = '<span class="pill pill-muted">No active power-ups</span>';
      return;
    }

    entries
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, remaining]) => {
        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = `${powerUpLabels[type] ?? type} ${remaining.toFixed(1)}s`;
        this.powerUps.appendChild(pill);
      });
  }
}
