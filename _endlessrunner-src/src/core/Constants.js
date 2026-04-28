export const GameState = Object.freeze({
  START: 'Start',
  PLAYING: 'Playing',
  GAME_OVER: 'GameOver'
});

export const PowerUpType = Object.freeze({
  MAGNET: 'magnet',
  MULTIPLIER: 'multiplier',
  JETPACK: 'jetpack',
  SHIELD: 'shield'
});

export const POWER_UP_DURATIONS = Object.freeze({
  [PowerUpType.MAGNET]: 9,
  [PowerUpType.MULTIPLIER]: 10,
  [PowerUpType.JETPACK]: 8,
  [PowerUpType.SHIELD]: 7
});

export const LANES = Object.freeze([-2.45, 0, 2.45]);
export const LANE_WIDTH = 2.45;
export const GROUND_Y = 0;
export const PLAYER_Z = 0;
export const BASE_WORLD_SPEED = 18;
export const MAX_DELTA = 1 / 30;
export const FAR_Z = -240;
export const RECYCLE_Z = 12;

export const Layers = Object.freeze({
  WORLD: 0,
  PLAYER: 1
});
