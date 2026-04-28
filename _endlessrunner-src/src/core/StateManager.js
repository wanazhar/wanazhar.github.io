import { GameState, PowerUpType, POWER_UP_DURATIONS } from './Constants.js';
import { readHighScore, resetStoredScores, writeHighScore } from '../utils/ScoreStorage.js';

const emptyPowerUps = () => ({
  [PowerUpType.MAGNET]: 0,
  [PowerUpType.MULTIPLIER]: 0,
  [PowerUpType.JETPACK]: 0,
  [PowerUpType.SHIELD]: 0
});

const createInitialState = () => ({
  gameState: GameState.START,
  score: 0,
  coins: 0,
  speedMultiplier: 1,
  scoreMultiplierBoost: 1,
  distance: 0,
  lastRunScore: 0,
  highScore: readHighScore(),
  activePowerUps: emptyPowerUps(),
  lastCollectedPowerUp: null
});

export class StateManager {
  constructor() {
    this.state = createInitialState();
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state, this.state);
    return () => this.listeners.delete(listener);
  }

  setState(partial) {
    const previous = this.state;
    const next = typeof partial === 'function' ? partial(previous) : partial;
    this.state = { ...previous, ...next };
    for (const listener of this.listeners) listener(this.state, previous);
  }

  resetToMenu() {
    const fresh = createInitialState();
    this.setState({ ...fresh, gameState: GameState.START, highScore: this.state.highScore });
  }

  startGame() {
    this.setState((state) => ({
      gameState: GameState.PLAYING,
      score: 0,
      coins: 0,
      speedMultiplier: 1,
      scoreMultiplierBoost: 1,
      distance: 0,
      lastRunScore: 0,
      highScore: state.highScore,
      activePowerUps: emptyPowerUps(),
      lastCollectedPowerUp: null
    }));
  }

  gameOver() {
    this.setState((state) => {
      const lastRunScore = Math.floor(state.score);
      const highScore = Math.max(state.highScore, lastRunScore);
      if (highScore !== state.highScore) writeHighScore(highScore);
      return {
        gameState: GameState.GAME_OVER,
        lastRunScore,
        highScore
      };
    });
  }

  resetScores() {
    resetStoredScores();
    this.setState((state) => ({
      ...state,
      score: 0,
      coins: 0,
      lastRunScore: 0,
      highScore: 0
    }));
  }

  addCoin(value = 1) {
    this.setState((state) => ({
      coins: state.coins + value,
      score: state.score + value * 25 * state.scoreMultiplierBoost
    }));
  }

  activatePowerUp(type, duration = POWER_UP_DURATIONS[type] ?? 8) {
    this.setState((state) => {
      const activePowerUps = { ...state.activePowerUps };
      activePowerUps[type] = Math.max(activePowerUps[type] ?? 0, duration);
      return {
        activePowerUps,
        scoreMultiplierBoost: activePowerUps[PowerUpType.MULTIPLIER] > 0 ? 2 : 1,
        lastCollectedPowerUp: type
      };
    });
  }

  tickPowerUps(deltaSeconds) {
    if (this.state.gameState !== GameState.PLAYING) return;
    this.setState((state) => {
      const activePowerUps = { ...state.activePowerUps };
      let changed = false;
      for (const type of Object.keys(activePowerUps)) {
        if (activePowerUps[type] > 0) {
          activePowerUps[type] = Math.max(0, activePowerUps[type] - deltaSeconds);
          changed = true;
        }
      }
      if (!changed) return {};
      return {
        activePowerUps,
        scoreMultiplierBoost: activePowerUps[PowerUpType.MULTIPLIER] > 0 ? 2 : 1
      };
    });
  }

  hasPowerUp(type) {
    return (this.state.activePowerUps?.[type] ?? 0) > 0;
  }

  consumeShield() {
    if (!this.hasPowerUp(PowerUpType.SHIELD)) return false;
    this.setState((state) => ({
      activePowerUps: { ...state.activePowerUps, [PowerUpType.SHIELD]: 0 }
    }));
    return true;
  }

  advanceRun(deltaSeconds, baseSpeed) {
    this.setState((state) => {
      const distance = state.distance + baseSpeed * state.speedMultiplier * deltaSeconds;
      const score = state.score + baseSpeed * state.speedMultiplier * deltaSeconds * 2.2 * state.scoreMultiplierBoost;
      const speedMultiplier = Math.min(3.15, 1 + Math.floor(score / 650) * 0.085 + score / 24000);
      return { distance, score, speedMultiplier };
    });
  }
}

export const stateManager = new StateManager();
