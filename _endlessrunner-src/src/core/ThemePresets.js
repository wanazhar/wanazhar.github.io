export const ThemeId = Object.freeze({
  NEON: 'neon',
  ANIME: 'anime'
});

export const DEFAULT_THEME = ThemeId.NEON;

export const THEME_STORAGE_KEY = 'endless-runner-theme';

export const THEMES = Object.freeze({
  [ThemeId.NEON]: {
    id: ThemeId.NEON,
    label: 'Neon',
    uiLabel: 'Neon Future',
    scene: {
      background: 0x08101f,
      fog: 0x08101f,
      hemiSky: 0x87c6ff,
      hemiGround: 0x171520,
      magenta: 0xff5ea8,
      cyan: 0x55d8ff,
      accent: '#79e6ff'
    },
    player: {
      primary: 0x3c52ff,
      accent: 0xff6aa9,
      dark: 0x11172b,
      face: 0x9fc4ff,
      hair: 0x6e84ff,
      hairDark: 0x2b3472,
      skin: 0x9fc4ff,
      skirt: 0x1a2448,
      boot: 0x11172b,
      blush: 0xff8dc3,
      shield: 0x8aa9ff,
      magnet: 0x6ef3ff,
      jetpack: 0xffd95a
    },
    world: {
      ground: 0x151c37,
      lane: 0x202a55,
      rail: 0x32457b,
      neon: 0x6ed9ff,
      buildingA: 0x11172c,
      buildingB: 0x27335d,
      treeLeaf: 0x47cff7,
      treeTrunk: 0x2f2354,
      roadGlow: 0x2277b8
    },
    items: {
      coinColor: 0xffd95a,
      coinEmissive: 0xffbf20,
      powerA: 0x6ef3ff,
      powerB: 0xff6aa9,
      powerC: 0x8aa9ff
    }
  },
  [ThemeId.ANIME]: {
    id: ThemeId.ANIME,
    label: 'Anime',
    uiLabel: 'Anime Mode',
    scene: {
      background: 0xffdced,
      fog: 0xffdced,
      hemiSky: 0xffe2f4,
      hemiGround: 0x90739d,
      magenta: 0xff7dbd,
      cyan: 0x86dfff,
      accent: '#ff6fb5'
    },
    player: {
      primary: 0xffffff,
      accent: 0xff8fbc,
      dark: 0x6a5a8e,
      face: 0xfff2ee,
      hair: 0xffb7de,
      hairDark: 0xd86aa8,
      skin: 0xffe7dc,
      skirt: 0x7aa4ff,
      boot: 0xffffff,
      blush: 0xff8ba6,
      shield: 0x9dc4ff,
      magnet: 0xff9ccd,
      jetpack: 0xffd766
    },
    world: {
      ground: 0xf3d8ff,
      lane: 0xffffff,
      rail: 0xffb8d9,
      neon: 0xff8fc9,
      buildingA: 0xfff4fb,
      buildingB: 0xdfe7ff,
      treeLeaf: 0xffadc7,
      treeTrunk: 0x886677,
      roadGlow: 0xff9fcd
    },
    items: {
      coinColor: 0xffd766,
      coinEmissive: 0xffa6ce,
      powerA: 0xff9ccd,
      powerB: 0x8fd2ff,
      powerC: 0xffe68a
    }
  }
});

export function getTheme(themeId) {
  return THEMES[themeId] ?? THEMES[DEFAULT_THEME];
}
