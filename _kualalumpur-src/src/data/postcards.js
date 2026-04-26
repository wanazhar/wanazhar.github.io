export const postcardTemplates = [
  { id: 'classic', name: 'Classic KL', caption: 'Greetings from Kuala Lumpur.' },
  { id: 'heritage', name: 'Heritage Walk', caption: 'Layers of rivers, markets, mosques, and old civic streets.' },
  { id: 'food', name: 'Food Trail', caption: 'Street grills, market colors, and late-night Jalan Alor energy.' },
  { id: 'rainy', name: 'Monsoon Mood', caption: 'Wet roads and tower lights after tropical rain.' },
  { id: 'malaysia', name: 'Malaysia Highlights', caption: 'KL as a launchpad for islands, highlands, rainforest, and Borneo.' }
];

export function captionForLandmark(landmark, mode = 'Day') {
  const name = landmark?.name ?? 'Kuala Lumpur';
  if (mode === 'Rain' || mode === 'Thunderstorm') return `${name} after rain, with roads glowing under city lights.`;
  if (mode === 'Night') return `${name} at night in the tourism city map.`;
  return `${name}, captured from the voxel tourism guide.`;
}
