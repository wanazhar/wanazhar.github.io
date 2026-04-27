import { GameState } from '../core/Constants.js';

export class Hud {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.scoreEl = document.querySelector('[data-hud="score"]');
    this.speedEl = document.querySelector('[data-hud="speed"]');
    this.coinsEl = document.querySelector('[data-hud="coins"]');
    this.menuEl = document.querySelector('[data-hud="menu"]');
    this.buttonEl = document.querySelector('[data-action="start"]');
    this.panelTitle = document.querySelector('.hud__panel h1');
    this.panelCopy = document.querySelector('.hud__panel p:nth-of-type(2)');

    this.buttonEl?.addEventListener('click', () => this.stateManager.startGame());
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
      this.panelTitle.textContent = 'Curved Horizon Runner';
      this.panelCopy.textContent = 'Three lanes, GSAP movement, instanced coins, pooled obstacles, OBB collisions, shader-bent world, and post-processing.';
      this.buttonEl.textContent = 'Start run';
    }

    if (state.gameState === GameState.GAME_OVER) {
      this.panelTitle.textContent = 'Run complete';
      this.panelCopy.textContent = `Final score: ${state.lastRunScore.toLocaleString()}. The engine recycled every obstacle instead of destroying it.`;
      this.buttonEl.textContent = 'Run again';
    }
  }

  destroy() {
    this.unsubscribe?.();
  }
}
