// Every item in the game. Prices live here so the shop, the sell price and
// recipe costs all read from one table.
export const ITEMS = {
  // Foraged / caught
  fish_sardine: { name: 'Sardine', nameJa: 'イワシ', price: 45, sell: 22, category: 'fish', stamina: 12 },
  fish_bream: { name: 'Sea Bream', nameJa: 'タイ', price: 120, sell: 60, category: 'fish', stamina: 20 },
  fish_puffer: { name: 'Pufferfish', nameJa: 'フグ', price: 180, sell: 90, category: 'fish', stamina: 16 },
  fish_crab: { name: 'Shore Crab', nameJa: 'カニ', price: 90, sell: 45, category: 'fish', stamina: 15 },
  veg_mushroom: { name: 'Wild Mushroom', nameJa: 'きのこ', price: 30, sell: 15, category: 'forage', stamina: 6 },
  veg_fern: { name: 'Mountain Fern', nameJa: 'ワラビ', price: 25, sell: 12, category: 'forage', stamina: 5 },
  fruit_ume: { name: 'Ume', nameJa: '梅', price: 60, sell: 30, category: 'forage', stamina: 8 },
  fruit_orange: { name: 'Orange', nameJa: 'みかん', price: 55, sell: 28, category: 'forage', stamina: 8 },

  // Farming
  crop_rice: { name: 'Rice', nameJa: '米', price: 70, sell: 32, category: 'crop', stamina: 4 },
  crop_rice_gold: { name: 'Golden Rice', nameJa: '金色の稲', price: 110, sell: 60, category: 'crop', stamina: 4 },
  seed_rice: { name: 'Rice Seeds', nameJa: '稲の種', price: 20, sell: 8, category: 'seed' },
  veg_cabbage: { name: 'Cabbage', nameJa: 'キャベツ', price: 40, sell: 18, category: 'crop', stamina: 5 },
  veg_radish: { name: 'Radish', nameJa: '大根', price: 35, sell: 15, category: 'crop', stamina: 5 },

  // Cooked food
  dish_grilled_fish: { name: 'Grilled Fish', nameJa: '焼き魚', price: 130, sell: 65, category: 'dish', stamina: 32 },
  dish_tamagoyaki: { name: 'Tamagoyaki', nameJa: '卵焼き', price: 90, sell: 45, category: 'dish', stamina: 22 },
  dish_onigiri: { name: 'Onigiri', nameJa: 'おにぎり', price: 80, sell: 40, category: 'dish', stamina: 24 },
  dish_miso_soup: { name: 'Miso Soup', nameJa: 'みそ汁', price: 110, sell: 55, category: 'dish', stamina: 26 },
  dish_rice_ball_lunch: { name: 'Lunch Box', nameJa: '弁当', price: 180, sell: 90, category: 'dish', stamina: 40 },
  dish_seafood_platter: { name: 'Seafood Platter', nameJa: '海鮮盛り合わせ', price: 280, sell: 140, category: 'dish', stamina: 45 },
  dish_melonpan: { name: 'Melonpan', nameJa: 'メロンパン', price: 95, sell: 48, category: 'dish', stamina: 20 },

  // Materials
  wood: { name: 'Wood', nameJa: '材木', price: 12, sell: 6, category: 'material' },
  bamboo: { name: 'Bamboo', nameJa: '竹', price: 10, sell: 5, category: 'material' },
  fibre: { name: 'Fibre', nameJa: '繊維', price: 8, sell: 4, category: 'material' },

  // Tools
  hoe: { name: 'Hoe', nameJa: 'クワ', price: 200, sell: 80, category: 'tool', tool: 'hoe' },
  fishing_rod: { name: 'Fishing Rod', nameJa: '釣り竿', price: 320, sell: 130, category: 'tool', tool: 'rod' },
  watering_can: { name: 'Watering Can', nameJa: 'じょうろ', price: 150, sell: 60, category: 'tool', tool: 'can' },

  // Consumables
  bento: { name: 'Bento', nameJa: '弁当', price: 150, sell: 0, category: 'food', stamina: 30, consumable: true },
  dango: { name: 'Dango', nameJa: 'だんご', price: 100, sell: 50, category: 'food', stamina: 25, consumable: true },
  tea: { name: 'Green Tea', nameJa: '緑茶', price: 70, sell: 35, category: 'food', stamina: 18, consumable: true },

  // Quest items
  letter_from_mimi: { name: 'Letter for Mimi', nameJa: 'ミミへの手紙', price: 0, sell: 0, category: 'quest' },
  shrine_charm: { name: 'Shrine Charm', nameJa: 'お守り', price: 0, sell: 0, category: 'quest' },
  lost_seal: { name: 'Lost Seal', nameJa: '印鑑', price: 0, sell: 0, category: 'quest' }
};

export function itemName(id) {
  return ITEMS[id]?.name ?? id;
}

export function itemNameJa(id) {
  return ITEMS[id]?.nameJa ?? id;
}

export function itemPrice(id) {
  return ITEMS[id]?.price ?? 0;
}

export function itemSell(id) {
  return ITEMS[id]?.sell ?? Math.round(itemPrice(id) * 0.4);
}

export function itemCategory(id) {
  return ITEMS[id]?.category ?? 'misc';
}

export function itemStamina(id) {
  return ITEMS[id]?.stamina ?? 0;
}

export function isConsumable(id) {
  return Boolean(ITEMS[id]?.consumable || ITEMS[id]?.category === 'dish' || ITEMS[id]?.category === 'food');
}

export function isTool(id) {
  return ITEMS[id]?.category === 'tool';
}

export function isQuestItem(id) {
  return itemCategory(id) === 'quest';
}

export function allItems() {
  return Object.keys(ITEMS);
}