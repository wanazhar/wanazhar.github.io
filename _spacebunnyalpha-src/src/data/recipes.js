// Cooking, crafting and fishing tables. Recipes are gated behind skill levels
// so the player has something to come back for without any urgency.
// Inputs are arrays rather than objects because a recipe may need two of the
// same thing, which an object literal cannot express.

export const RECIPES = [
  // Cooking
  { id: 'dish_onigiri', result: 'dish_onigiri', qty: 2, skill: 'cooking', level: 1, inputs: [{ id: 'crop_rice', qty: 1 }], minutes: 10, station: 'kitchen' },
  { id: 'dish_tamagoyaki', result: 'dish_tamagoyaki', qty: 1, skill: 'cooking', level: 1, inputs: [{ id: 'veg_mushroom', qty: 1 }], minutes: 15, station: 'kitchen' },
  { id: 'dish_miso_soup', result: 'dish_miso_soup', qty: 1, skill: 'cooking', level: 2, inputs: [{ id: 'veg_mushroom', qty: 1 }, { id: 'fish_sardine', qty: 1 }], minutes: 25, station: 'kitchen' },
  { id: 'dish_grilled_fish', result: 'dish_grilled_fish', qty: 1, skill: 'cooking', level: 2, inputs: [{ id: 'fish_bream', qty: 1 }], minutes: 20, station: 'kitchen' },
  { id: 'dish_rice_ball_lunch', result: 'dish_rice_ball_lunch', qty: 1, skill: 'cooking', level: 3, inputs: [{ id: 'crop_rice', qty: 2 }, { id: 'veg_cabbage', qty: 1 }], minutes: 35, station: 'kitchen' },
  { id: 'dish_seafood_platter', result: 'dish_seafood_platter', qty: 1, skill: 'cooking', level: 4, inputs: [{ id: 'fish_bream', qty: 1 }, { id: 'fish_sardine', qty: 1 }, { id: 'fish_crab', qty: 1 }], minutes: 45, station: 'kitchen' },

  // Crafting
  { id: 'craft_fibre', result: 'fibre', qty: 2, skill: 'farming', level: 1, inputs: [{ id: 'veg_fern', qty: 2 }], minutes: 8, station: 'anywhere' },
  { id: 'craft_wood', result: 'wood', qty: 2, skill: 'farming', level: 1, inputs: [{ id: 'bamboo', qty: 1 }], minutes: 10, station: 'anywhere' }
];

// Fishing table. Chance is a weight, not a percentage, and the weights shift
// with the hour so dawn and dusk feel different on the pier.
export const FISH_TABLE = [
  { id: 'fish_sardine', weight: 46, minHour: 0, maxHour: 24 },
  { id: 'fish_bream', weight: 26, minHour: 5, maxHour: 19 },
  { id: 'fish_crab', weight: 18, minHour: 0, maxHour: 24 },
  { id: 'fish_puffer', weight: 10, minHour: 14, maxHour: 22 }
];

// Where and when each kind of fish is likely. Dawn and dusk bias towards the
// rarer fish, which is the whole reason to fish at awkward hours.
export function fishAvailableAt(hour) {
  return FISH_TABLE.filter((f) => hour >= f.minHour && hour < f.maxHour);
}

export function rollFish(hour, rng = Math.random) {
  const pool = fishAvailableAt(hour);
  if (pool.length === 0) return FISH_TABLE[0];

  const total = pool.reduce((sum, f) => sum + f.weight, 0);
  let roll = rng() * total;

  for (const fish of pool) {
    roll -= fish.weight;
    if (roll <= 0) return fish;
  }
  return pool[pool.length - 1];
}

// Forage spawns: what grows where.
export const FORAGE_TABLE = {
  rural: [
    { id: 'veg_mushroom', weight: 34 },
    { id: 'veg_fern', weight: 40 },
    { id: 'fruit_ume', weight: 26 }
  ],
  coast: [
    { id: 'fruit_orange', weight: 45 },
    { id: 'veg_fern', weight: 30 },
    { id: 'veg_mushroom', weight: 25 }
  ],
  suburbs: [
    { id: 'veg_mushroom', weight: 40 },
    { id: 'fruit_orange', weight: 60 }
  ],
  city: [
    { id: 'veg_mushroom', weight: 100 }
  ]
};

export function rollForage(region, rng = Math.random) {
  const table = FORAGE_TABLE[region] ?? FORAGE_TABLE.suburbs;
  const total = table.reduce((sum, f) => sum + f.weight, 0);
  let roll = rng() * total;
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return table[table.length - 1];
}

// Fishing is a small skill check rather than pure luck, so a levelled player
// reliably pulls in the better fish.
export function fishingSuccess(skillLevel, rng = Math.random) {
  const chance = Math.min(0.95, 0.6 + skillLevel * 0.08);
  return rng() < chance;
}

// Stamina cost of each activity, kept in one place so the HUD can warn first.
export const ACTIVITY_COST = {
  fish: 8,
  forage: 4,
  farm: 6,
  cook: 2
};

// Crafting is allowed from anywhere, cooking needs a kitchen. Kitchens are
// placed by the world builder; the player gets a home kitchen too.
export function canCraft(recipe, { skill, inventory, station = 'anywhere', unlockedStations = new Set(['anywhere', 'home']) }) {
  if ((recipe.skill === 'cooking' || recipe.skill === 'farming') && (skill[recipe.skill] ?? 1) < recipe.level) {
    return { ok: false, reason: 'skill' };
  }
  if (recipe.station === 'kitchen' && !unlockedStations.has('kitchen') && !unlockedStations.has('home')) {
    return { ok: false, reason: 'station' };
  }
  if (!hasInputs(recipe, inventory)) return { ok: false, reason: 'inputs' };
  return { ok: true };
}

// Inputs are already a multiset list, so checking is a straight comparison.
export function hasInputs(recipe, inventory) {
  return missingInputs(recipe, inventory).length === 0;
}

export function missingInputs(recipe, inventory) {
  const missing = [];
  for (const input of recipe.inputs) {
    const have = inventory.countOf(input.id);
    if (have < input.qty) missing.push({ id: input.id, need: input.qty - have });
  }
  return missing;
}

export function recipesForSkill(skill) {
  return RECIPES.filter((r) => r.skill === skill);
}