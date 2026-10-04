// The cast. Each NPC has a home region, a daily routine, and dialogue that
// changes with the time of day, the weather, and how well you know them.
// This is where the game's warmth actually comes from, so the writing matters.

export const NPCS = [
  {
    id: 'mimi',
    name: 'Mimi',
    nameJa: 'ミミ',
    region: 'city',
    role: 'Konbini clerk',
    roleJa: 'コンビニ店員',
    x: 150, z: 173,
    appearance: { skin: 'light', hair: 'pink', outfit: 'apron', hairStyle: 'long' },
    // Where she goes over the course of the day.
    schedule: [
      { fromHour: 6, toHour: 14, x: 150, z: 173 },
      { fromHour: 14, toHour: 18, x: 60, z: 60 },
      { fromHour: 18, toHour: 23, x: 150, z: 173 }
    ],
    personality: 'cheerful, chatty, knows everyone',
    lines: {
      any: [
        'Welcome in! The konbini is open 24 hours, but I only smile properly until about 2pm.',
        'Did you eat today? You look like someone who forgot.',
        'The coffee machine is free after 8pm. Do not tell my manager.'
      ],
      morning: ['Morning! Fresh stock arrived. The onigiri are still warm.'],
      evening: ['Closing-up time. Just me and the hum of the fridge.'],
      rainy: ['Take an umbrella. We sell them, and we also lend them, and we also judge you if you forget.'],
      friendly: [
        'You came back! I was hoping it was a real "visiting" and not a "needed something" visit.',
        'My shift is boring on purpose. It is the only way I get to read.'
      ]
    },
    shop: { stock: ['bento', 'dango', 'tea', 'seed_rice'] },
    dialogue: {
      firstMeeting: 'Hi! I have not seen you around. Are you new to Sakura Ward?',
      afterMeeting: 'Aoi, right? I will remember. I remember everyone.'
    }
  },
  {
    id: 'aoi',
    name: 'Aoi',
    nameJa: 'アオイ',
    region: 'suburbs',
    role: 'School student',
    roleJa: '学生',
    x: 48, z: 172,
    appearance: { skin: 'light', hair: 'black', outfit: 'school', hairStyle: 'ponytail' },
    schedule: [
      { fromHour: 7, toHour: 16, x: 48, z: 172 },
      { fromHour: 16, toHour: 20, x: 70, z: 196 },
      { fromHour: 20, toHour: 23, x: 48, z: 172 }
    ],
    personality: 'curious, asks a lot of questions',
    lines: {
      any: [
        'Sorry, that was a weird question. I am working on it.',
        'Do you know why the station building is painted that colour? Nobody knows.',
        'I am writing a report about the island. You are probably in it. Chapter one.'
      ],
      morning: ['You are up early. Or you never went to bed. Both are valid.'],
      evening: ['Homework first, then fish. That is the order.'],
      rainy: ['Rain days are for reading and for soup. Both at once if possible.'],
      friendly: [
        'Okay, you are one of my four favourite people. It is a short list but I maintain it carefully.',
        'When you find something on the beach, tell me. I like things nobody else found.'
      ]
    },
    dialogue: {
      firstMeeting: 'Um, hi! I do not think we have met. I am Aoi.',
      afterMeeting: 'Oh, you are Aoi too? That is confusing but I am glad.'
    }
  },
  {
    id: 'yoba-ji',
    name: 'Grandpa Yoba',
    nameJa: 'ヨバじ',
    region: 'rural',
    role: 'Rice farmer',
    roleJa: '稲作農家',
    x: 200, z: 200,
    appearance: { skin: 'tan', hair: 'white', outfit: 'farmer', hairStyle: 'short', scale: 0.94 },
    schedule: [
      { fromHour: 5, toHour: 11, x: 200, z: 200 },
      { fromHour: 11, toHour: 15, x: 228, z: 150 },
      { fromHour: 15, toHour: 20, x: 196, z: 196 }
    ],
    personality: 'patient, says little, means a lot',
    lines: {
      any: [
        'Water is the whole job. Everything else is just waiting.',
        'You do not rush rice. It is not listening anyway.',
        'Sit if you like. Standing up all day is no way to meet a field.'
      ],
      morning: ['Best light is now. The water is doing that silver thing again.'],
      rainy: ['Good rain. The fields drink it and I get a nap. Everybody wins.'],
      friendly: [
        'You came back to the field, not just to the shop. I noticed.',
        'My grandmother grew things on this slope too. Same slope. Funny.'
      ]
    },
    gifts: { loves: ['fish_bream', 'dish_grilled_fish', 'fruit_ume'] },
    dialogue: {
      firstMeeting: 'Ah. A stranger with time on their hands. Good.',
      afterMeeting: 'Good. Sit. Do not help, you will only make it worse.'
    }
  },
  {
    id: 'takeshi',
    name: 'Takeshi',
    nameJa: 'タケシ',
    region: 'coast',
    role: 'Fisherman',
    roleJa: '漁師',
    x: 216, z: 228,
    appearance: { skin: 'medium', hair: 'brown', outfit: 'fisherman', hairStyle: 'short' },
    schedule: [
      { fromHour: 4, toHour: 10, x: 210, z: 240 },
      { fromHour: 10, toHour: 16, x: 216, z: 228 },
      { fromHour: 16, toHour: 22, x: 222, z: 244 }
    ],
    personality: 'blunt, generous in small ways',
    lines: {
      any: [
        'Fish do not care about your schedule. Neither do I.',
        'If it is raining, stay in. I will sell you what I caught anyway.',
        'The sea is not dangerous today. It is only loud.'
      ],
      morning: ['Early. Good. The only time the water is worth looking at.'],
      evening: ['Day is done. Whatever I have, you can have.'],
      rainy: ['Do not go out. I am serious. I will not say it twice.'],
      friendly: [
        'You fish? Sit. I will show you the spot. It takes an hour to explain and an hour to earn.',
        'You are the one from the city who does not ask how far the fish go. Rare.'
      ]
    },
    shop: { stock: ['fish_sardine', 'fish_bream', 'fish_crab'] },
    dialogue: {
      firstMeeting: 'You are not from here. Sit down anyway.',
      afterMeeting: 'Aoi. Fine name. Means blue, right?'
    }
  },
  {
    id: 'hana',
    name: 'Hana',
    nameJa: 'ハナ',
    region: 'city',
    role: 'Office worker',
    roleJa: '会社員',
    x: 58, z: 62,
    appearance: { skin: 'light', hair: 'brown', outfit: 'office', hairStyle: 'long' },
    schedule: [
      { fromHour: 8, toHour: 19, x: 58, z: 62 },
      { fromHour: 19, toHour: 22, x: 84, z: 96 }
    ],
    personality: 'tired, secretly likes the island',
    lines: {
      any: [
        'I work in the tall one. I will not say which one. That is the whole skill.',
        'Do not tell my boss I said this, but the walk here is the best part of my day.',
        'Buy something small. It is all we have to do with each other now.'
      ],
      morning: ['Good morning. Genuinely. That is the first one today.'],
      evening: ['I can smell the sea from the station. That is not normal.'],
      rainy: ['Rain makes the city honest. Nobody is pretending today.'],
      friendly: [
        'You are the only person here who does not want me to keep working.',
        'Someday I will move to the coast. Do not tell anyone I said that.'
      ]
    },
    dialogue: {
      firstMeeting: 'Um, hello. Sorry. I was looking at my phone, not at you. I was looking at nothing.',
      afterMeeting: 'You again. Good. Conversation is my least favourite hobby but I am getting better at it.'
    }
  },
  {
    id: 'kenji',
    name: 'Kenji',
    nameJa: 'ケンジ',
    region: 'suburbs',
    role: 'Station attendant',
    roleJa: '駅員',
    x: 148, z: 116,
    appearance: { skin: 'medium', hair: 'black', outfit: 'office', hairStyle: 'short' },
    schedule: [
      { fromHour: 6, toHour: 15, x: 148, z: 116 },
      { fromHour: 15, toHour: 21, x: 148, z: 116 }
    ],
    personality: 'proper, likes trains, quietly lonely',
    lines: {
      any: [
        'The 07:12 is the best train. Nothing else comes close.',
        'I know every train on this line. There are six. I know them well.',
        'If the train is late I will be the first to know and the last to admit it.'
      ],
      morning: ['Commuters are a species. Observe them. Learn their moods.'],
      evening: ['Last train soon. Everyone looks the same on a platform at dusk.'],
      rainy: ['Rain means delays. Delays mean we all stand here together. Small mercy.'],
      friendly: [
        'You take the 07:12 sometimes. I noticed. I notice people.',
        'I am glad you are on this line. That is the nicest thing I have said today.'
      ]
    },
    dialogue: {
      firstMeeting: 'Welcome to Hinode Station. Where are you headed? Or just leaving?',
      afterMeeting: 'Ah, you. Good. The platform is nicer with someone on it.'
    }
  },
  {
    id: 'rin',
    name: 'Rin',
    nameJa: 'リン',
    region: 'rural',
    role: 'Shrine keeper',
    roleJa: '神社社司',
    x: 232, z: 98,
    appearance: { skin: 'light', hair: 'red', outfit: 'shrinekeeper', hairStyle: 'ponytail' },
    schedule: [
      { fromHour: 7, toHour: 18, x: 232, z: 98 }
    ],
    personality: 'serene, says surprising things',
    lines: {
      any: [
        'Climb slowly. The mountain is not going anywhere and neither am I.',
        'You do not have to believe anything here. You just have to be quiet for a bit.',
        'This gate has been repaired nine times. Same colour every time. That is devotion.'
      ],
      morning: ['The light on the steps is best just now. Come up.',
        'The bell is for the wind. Sometimes the wind answers.'],
      rainy: ['Rain at a shrine is the best kind of visitor. It does not want anything.'],
      friendly: [
        'You have come up here four times. I have counted. I count most things.',
        'I will put something in your hand. Do not argue, it is already decided.'
      ]
    },
    dialogue: {
      firstMeeting: 'Welcome. Take your time. The steps are patient.',
      afterMeeting: 'You again. Good. I will walk the path with you as far as the top.'
    }
  },
  {
    id: 'sora',
    name: 'Sora',
    nameJa: 'ソラ',
    region: 'coast',
    role: 'Child',
    roleJa: '子ども',
    x: 206, z: 222,
    appearance: { skin: 'light', hair: 'blue', outfit: 'casual', hairStyle: 'short', scale: 0.74 },
    schedule: [
      { fromHour: 9, toHour: 19, x: 206, z: 222 }
    ],
    personality: 'loud, asks impossible questions',
    lines: {
      any: [
        'Do fish get tired? They swim all day!',
        'I found a thing. It was very important. I have forgotten what it was.',
        'When I am big I am going to swim to the next island. Obviously.',
        'Can you do a jump? Look at this. Look! Bigger. Bigger!'
      ],
      rainy: ['Can we go look at the rain? It sounds different near the sea.'],
      friendly: [
        'I told everyone about you. I said you are my friend now.',
        'You came back! I knew you would. I did not actually know. But I knew.'
      ]
    },
    dialogue: {
      firstMeeting: 'Hi hi hi. What is your name. Wait, I will guess. Aoi.',
      afterMeeting: 'Aoi! Okay. Okay. Best name. Bye! ... stay.'
    }
  },
  {
    id: 'old-sato',
    name: 'Old Sato',
    nameJa: 'サトさん',
    region: 'city',
    role: 'Retired',
    roleJa: '退職者',
    x: 96, z: 84,
    appearance: { skin: 'light', hair: 'white', outfit: 'oldperson', hairStyle: 'short', scale: 0.92 },
    schedule: [
      { fromHour: 7, toHour: 12, x: 84, z: 60 },
      { fromHour: 12, toHour: 17, x: 96, z: 84 },
      { fromHour: 17, toHour: 21, x: 60, z: 70 }
    ],
    personality: 'slow, kind, tells the same story well',
    lines: {
      any: [
        'I built half this ward. The other half I only admired from a bench.',
        'Sit. Knees. Mine, anyway.',
        'Young people walk fast. I have got time and a good bench.',
        'The fountain used to be a flower bed. I am fairly sure. Ask anyone.'
      ],
      morning: ['The park is mine until ten. Then it is everyone and nobody.',
        'Good morning. I saw the sunrise. That was the whole plan.'],
      rainy: ['Rain on a bench is the best seat in the park. Do not tell the pigeons.'],
      friendly: [
        'You come by often now. I have started saving you the good end of the bench.',
        'This ward is not big. But I have seen it in every season. That is my work now.'
      ]
    },
    dialogue: {
      firstMeeting: 'Sit, sit. I am not going anywhere. Nobody has asked me to yet.',
      afterMeeting: 'Aoi. Good. A name for a person who walks slow and looks up.'
    }
  },
  {
    id: 'nana',
    name: 'Nana',
    nameJa: 'ナナ',
    region: 'suburbs',
    role: 'Homemaker',
    roleJa: '主婦',
    x: 96, z: 186,
    appearance: { skin: 'light', hair: 'brown', outfit: 'apron', hairStyle: 'long' },
    schedule: [
      { fromHour: 8, toHour: 12, x: 96, z: 186 },
      { fromHour: 12, toHour: 18, x: 120, z: 200 }
    ],
    personality: 'warm, feeds people first',
    lines: {
      any: [
        'You are too thin. Do not argue. Sit.',
        'I made extra again. It happens when I am thinking about someone.',
        'The konbini lady says hello. She is my spy. She reports back.'
      ],
      morning: ['Morning! Come in, come in. Tea? No? Then come in anyway.'],
      evening: ['Dinner is at seven. There is always room. There is always room.'],
      rainy: ['Rainy days you need something hot. That is science, not hospitality.'],
      friendly: [
        'You came back! I put the good cup out just in case.',
        'You are part of this street now. That is decided. I decided.'
      ]
    },
    dialogue: {
      firstMeeting: 'Oh! A new face. Where are you staying? You are staying here, that is what I mean.',
      afterMeeting: 'Aoi. Beautiful. I will tell everyone. Everyone.'
    }
  }
];

export function npcById(id) {
  return NPCS.find((n) => n.id === id);
}

export function npcsInRegion(region) {
  return NPCS.filter((n) => n.region === region);
}

// Picks the line that best fits the moment. Order matters: the most specific
// context wins, and the friendly line only shows up once you know them.
export function chooseLine(npc, { phase, weather, friendship = 0, firstMeeting = false }) {
  if (firstMeeting && npc.dialogue?.firstMeeting) return npc.dialogue.firstMeeting;

  const lines = npc.lines ?? {};
  const pools = [];

  if (friendship >= 3 && lines.friendly?.length) pools.push(lines.friendly);
  if (weather === 'rain' && lines.rainy?.length) pools.push(lines.rainy);
  if (lines[phase]?.length) pools.push(lines[phase]);
  if (lines.any?.length) pools.push(lines.any);

  if (pools.length === 0) return '...';

  // Deterministic-ish but varied: pick based on time so a line is not repeated
  // every single time you walk past.
  const pool = pools[0];
  const index = Math.floor(Date.now() / 60000 + npc.id.length) % pool.length;
  return pool[index];
}

// Nudges friendship when you talk, buy, or give a gift.
export function friendshipGain(action) {
  return { talk: 1, gift: 2, quest: 3, dailyGift: 1, help: 2 }[action] ?? 1;
}

export function friendshipTier(value) {
  if (value >= 8) return 'close';
  if (value >= 4) return 'friend';
  if (value >= 1) return 'acquaintance';
  return 'stranger';
}