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
    this.powerUpPills = new Map();
    this.powerUpEmpty = null;
    this.powerUpSignature = null;
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
    const entries = Object.entries(activePowerUps)
      .filter(([, remaining]) => remaining > 0)
      .sort((a, b) => b[1] - a[1]);

    // render() runs on every animation frame — advanceRun() emits state 60
    // times a second — and this strip is an aria-live region. It used to be
    // emptied and rebuilt on each of those frames, so screen readers were
    // handed a live region that never settled and the DOM was torn down 60
    // times a second for nothing. Timers are displayed to one decimal, so
    // skip entirely unless that text would change, then update in place.
    const signature = entries.map(([type, remaining]) => `${type}:${remaining.toFixed(1)}`).join('|');
    if (signature === this.powerUpSignature) return;
    this.powerUpSignature = signature;

    const activeTypes = new Set(entries.map(([type]) => type));
    for (const [type, pill] of this.powerUpPills) {
      if (!activeTypes.has(type)) {
        pill.remove();
        this.powerUpPills.delete(type);
      }
    }

    if (!entries.length) {
      if (!this.powerUpEmpty) {
        this.powerUpEmpty = document.createElement('span');
        this.powerUpEmpty.className = 'pill pill-muted';
        this.powerUpEmpty.textContent = 'No active power-ups';
        this.powerUps.appendChild(this.powerUpEmpty);
      }
      return;
    }

    if (this.powerUpEmpty) {
      this.powerUpEmpty.remove();
      this.powerUpEmpty = null;
    }

    entries.forEach(([type, remaining], index) => {
      let pill = this.powerUpPills.get(type);
      if (!pill) {
        pill = document.createElement('span');
        pill.className = 'pill';
        pill.dataset.powerUp = type;
        this.powerUpPills.set(type, pill);
      }
      pill.textContent = `${powerUpLabels[type] ?? type} ${remaining.toFixed(1)}s`;
      // Every timer ticks at the same rate, so the sorted order is stable for
      // the life of a set; this only moves a pill when the order really
      // changed (a new power-up with a longer duration).
      if (this.powerUps.children[index] !== pill) {
        this.powerUps.insertBefore(pill, this.powerUps.children[index] ?? null);
      }
    });
  }
}
