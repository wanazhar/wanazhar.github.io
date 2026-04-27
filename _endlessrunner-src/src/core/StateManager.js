import { GameState } from './Constants.js';

const initialState = Object.freeze({
  gameState: GameState.START,
  score: 0,
  coins: 0,
  speedMultiplier: 1,
  distance: 0,
  lastRunScore: 0
});

export class StateManager {
  constructor() {
    this.state = { ...initialState };
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
    this.setState({ ...initialState, gameState: GameState.START });
  }

  startGame() {
    this.setState({
      gameState: GameState.PLAYING,
      score: 0,
      coins: 0,
      speedMultiplier: 1,
      distance: 0,
      lastRunScore: 0
    });
  }

  gameOver() {
    this.setState((state) => ({
      gameState: GameState.GAME_OVER,
      lastRunScore: Math.floor(state.score)
    }));
  }

  addCoin(value = 1) {
    this.setState((state) => ({
      coins: state.coins + value,
      score: state.score + value * 25
    }));
  }

  advanceRun(deltaSeconds, baseSpeed) {
    this.setState((state) => {
      const distance = state.distance + baseSpeed * state.speedMultiplier * deltaSeconds;
      const score = state.score + baseSpeed * state.speedMultiplier * deltaSeconds * 2.2;
      const speedMultiplier = Math.min(3.15, 1 + Math.floor(score / 650) * 0.085 + score / 24000);
      return { distance, score, speedMultiplier };
    });
  }
}

export const stateManager = new StateManager();
