export const quests = [
  { id: 'welcome-walk', name: 'Welcome Walk', description: 'Collect any 5 landmark stamps.', type: 'visitCount', target: 5 },
  { id: 'heritage-steps', name: 'Heritage Steps', description: 'Visit 5 heritage or culture stops.', type: 'tagVisits', tags: ['heritage', 'history', 'mosque', 'temple', 'architecture'], target: 5 },
  { id: 'food-scout', name: 'Food Scout', description: 'Visit 3 food or market places.', type: 'tagVisits', tags: ['food', 'market', 'night market', 'wet market'], target: 3 },
  { id: 'rail-rider', name: 'Rail Rider', description: 'Take 2 train rides.', type: 'trainRides', target: 2 },
  { id: 'postcard-starter', name: 'Postcard Starter', description: 'Capture 3 postcards.', type: 'photos', target: 3 },
  { id: 'weather-watcher', name: 'Weather Watcher', description: 'Try Rain or Thunderstorm mode.', type: 'weather', modes: ['Rain', 'Thunderstorm'], target: 1 },
  { id: 'malaysia-planner', name: 'Malaysia Planner', description: 'Visit 4 Malaysia highlight gateway pads.', type: 'districtVisits', district: 'Malaysia Highlights', target: 4 }
];

export const achievements = [
  { id: 'kl-completist', name: 'KL Completist', description: 'Collect 20 stamps.' },
  { id: 'route-finisher', name: 'Route Finisher', description: 'Complete any guided route.' },
  { id: 'night-photographer', name: 'Night Photographer', description: 'Take a postcard in Night, Rain, or Thunderstorm mode.' }
];
