// Quests. Each one is small on purpose: this is a slice-of-life game, so the
// point is the errand and the person, not the reward.

export const QUESTS = [
  {
    id: 'konbini_intro',
    title: 'A Quick Word with Mimi',
    titleJa: 'ミミとの短い話',
    giver: 'mimi',
    region: 'city',
    summary: 'Mimi wants you to grab some tea while you are out. She will not say why.',
    objectives: [{ type: 'haveItem', item: 'tea', count: 1 }],
    rewards: { yen: 60, friendship: { mimi: 2 }, items: [{ id: 'dango', qty: 1 }] },
    repeatable: true,
    cooldownMinutes: 240
  },
  {
    id: 'first_catch',
    title: 'Something From The Water',
    titleJa: '海からの贈り物',
    giver: 'takeshi',
    region: 'coast',
    summary: 'Takeshi asked you to bring back anything the tide left behind.',
    objectives: [{ type: 'haveItem', category: 'fish', count: 1 }],
    rewards: { yen: 90, friendship: { takeshi: 2 } },
    repeatable: false
  },
  {
    id: 'shrine_walk',
    title: 'The Long Stair',
    titleJa: '長い石段',
    giver: 'rin',
    region: 'rural',
    summary: 'Rin asked you to climb to the shrine and see what the view looks like at this hour.',
    objectives: [{ type: 'visitRegion', region: 'rural', count: 1 }],
    rewards: { friendship: { rin: 2 }, items: [{ id: 'shrine_charm', qty: 1 }] },
    repeatable: false
  },
  {
    id: 'rice_field',
    title: 'Watering With Grandpa',
    titleJa: 'ヨバじの水やり',
    giver: 'yoba-ji',
    region: 'rural',
    summary: 'Grandpa Yoba will not ask for help. He will just leave the gate open. Go through it.',
    objectives: [{ type: 'haveItem', item: 'crop_rice', count: 2 }],
    rewards: { yen: 120, friendship: { 'yoba-ji': 3 } },
    repeatable: true,
    cooldownMinutes: 480
  },
  {
    id: 'station_seal',
    title: 'The Lost Seal',
    titleJa: 'なくした印鑑',
    giver: 'kenji',
    region: 'suburbs',
    summary: 'Kenji misplaced his station stamp somewhere along the line. He has checked twice.',
    objectives: [{ type: 'haveItem', item: 'lost_seal', count: 1 }],
    rewards: { yen: 80, friendship: { kenji: 2 } },
    repeatable: false
  },
  {
    id: 'school_report',
    title: 'Chapter One',
    titleJa: '第一章',
    giver: 'aoi',
    region: 'suburbs',
    summary: 'Aoi is writing a report about the island and needs something interesting to write about.',
    objectives: [
      { type: 'haveItem', category: 'forage', count: 2 },
      { type: 'talkedTo', npc: 'sora', count: 1 }
    ],
    rewards: { yen: 110, friendship: { aoi: 3 }, items: [{ id: 'dish_melonpan', qty: 1 }] },
    repeatable: false
  },
  {
    id: 'nana_lunch',
    title: 'Dinner Is At Seven',
    titleJa: '夕食は七時',
    giver: 'nana',
    region: 'suburbs',
    summary: 'Nana saved you a seat. She saved you a plate too, which is the important part.',
    objectives: [{ type: 'haveItem', item: 'fish_sardine', count: 2 }],
    rewards: { friendship: { nana: 3 }, items: [{ id: 'dish_tamagoyaki', qty: 1 }] },
    repeatable: true,
    cooldownMinutes: 360
  },
  {
    id: 'harbour_help',
    title: 'Unloading',
    titleJa: '荷下ろし',
    giver: 'takeshi',
    region: 'coast',
    summary: 'The boat came in heavy. Takeshi will deny needing help but will not stop asking.',
    objectives: [{ type: 'haveItem', item: 'wood', count: 3 }],
    rewards: { yen: 150, friendship: { takeshi: 2, sora: 1 } },
    repeatable: true,
    cooldownMinutes: 300
  }
];

export function questById(id) {
  return QUESTS.find((q) => q.id === id);
}

export function questsFrom(npcId) {
  return QUESTS.filter((q) => q.giver === npcId);
}

export function questSummary(quest) {
  return quest.objectives
    .map((o) => {
      if (o.type === 'haveItem') return `Bring ${o.count} ${o.item ?? o.category}`;
      if (o.type === 'visitRegion') return `Visit ${o.region}`;
      if (o.type === 'talkedTo') return `Talk to ${o.npc}`;
      return o.type;
    })
    .join(', ');
}