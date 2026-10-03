// Central tuning surface. Every gameplay and world number lives here so the
// whole game can be rebalanced without hunting through gameplay code.

export const SEED = 20261002;

// The island is one seamless landmass. World is measured in blocks, and the
// whole playable surface fits inside WORLD.size on both axes.
export const WORLD = {
  size: 320,
  chunkSize: 32,
  seaLevel: 6,
  // How far the player may walk past the shoreline before the surf pushes back.
  beachTolerance: 10,
  maxHeight: 34
};

// Regions are contiguous rectangles in world-block space. The island reads
// north-west to south-east: dense city core, then suburbs below it, the rural
// highlands to the east, and the coast as the southern shoreline.
export const REGIONS = {
  city: {
    id: 'city',
    label: 'Sakura Ward',
    labelJa: 'さくら区',
    rect: { x0: 24, z0: 24, x1: 148, z1: 140 },
    blurb: 'Neon alleys, konbini light and a river of commuters.',
    blurbJa: 'ネオン、路地の光、通勤客の流れ。'
  },
  suburbs: {
    id: 'suburbs',
    label: 'Hinode Suburbs',
    labelJa: 'ひのね郊外',
    rect: { x0: 24, z0: 140, x1: 172, z1: 216 },
    blurb: 'Detached houses, a school route, and a konbini that never closes.',
    blurbJa: '戸建、学校の道、年中無休のコンビニ。'
  },
  rural: {
    id: 'rural',
    label: 'Kisumi Highlands',
    labelJa: 'きすみ高地',
    rect: { x0: 172, z0: 24, x1: 292, z1: 216 },
    blurb: 'Rice paddies, orchards, and a shrine up the mountain road.',
    blurbJa: '田畑、畑、そして坂の途中の神社。'
  },
  coast: {
    id: 'coast',
    label: 'Aoi Coast',
    labelJa: 'あおい海岸',
    rect: { x0: 24, z0: 216, x1: 292, z1: 272 },
    blurb: 'Torii in the surf, a fishing boat, and nowhere else to be.',
    blurbJa: '波のなかの鳥居、漁船、そして何もない場所。'
  }
};

export const REGION_ORDER = ['city', 'suburbs', 'rural', 'coast'];

export const PLAYER = {
  height: 1.7,
  radius: 0.34,
  walkSpeed: 3.6,
  runSpeed: 6.4,
  staminaMax: 100,
  staminaDrainRun: 9,
  staminaRegen: 7,
  // Below this fraction of max stamina, running is locked out until it recovers.
  staminaExhaustedBelow: 0.2,
  staminaExhaustedRecoverAbove: 0.35,
  jumpSpeed: 6.2,
  gravity: 20,
  reachDistance: 3.2
};

export const CLOCK = {
  // One real second maps to this many in-game minutes by default.
  minutesPerSecond: 1.2,
  startHour: 7.5,
  minutesPerDay: 1440,
  dawnHour: 5.5,
  duskHour: 18.5
};

export const ECONOMY = {
  startingYen: 500,
  // Fallback when selling an item with no explicit price.
  defaultSellRatio: 0.4
};

export const CAMERA = {
  distance: 9,
  minDistance: 3.5,
  maxDistance: 18,
  height: 4.2,
  lookAhead: 1.6,
  damping: 0.0015,
  fov: 58
};

export const WEATHER = {
  // Chance of rain per in-game hour when conditions allow it.
  rainChancePerHour: 0.14,
  clearMin: 52,
  cloudyMin: 16,
  overcastMin: 12,
  rainMin: 14,
  durationMin: [25, 90]
};

export const STREAMING = {
  // Chunks are built within this many blocks of the player, and unloaded past
  // the unload radius so walking the island stays at a stable draw-call count.
  loadRadius: 2,
  unloadRadius: 3,
  buildBudgetMs: 6
};

export const RENDER = {
  fogNear: 60,
  fogFar: 190,
  maxPixelRatio: 2,
  // Tone mapping exposure. Slightly above 1 to lift the pale Ghibli palette
  // into its intended lightness band without washing out the sky.
  exposure: 1.15,
  // Instanced-mesh ceiling per material, so the island cannot outgrow a
  // target device's uniform and attribute limits.
  maxInstancesPerMesh: 60000
};

export const AUDIO = {
  masterVolume: 0.55,
  musicVolume: 0.35
};