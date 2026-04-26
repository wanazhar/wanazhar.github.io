const SAVE_KEY = 'voxel-kl-tourism-save-v2';
const VERSION = 2;

const DEFAULT_SAVE = {
  version: VERSION,
  visited: [],
  completedQuests: [],
  unlockedPostcards: ['classic'],
  activeRoute: 'first-timer-kl',
  timeMode: 'Day',
  trainRides: 0,
  photoCaptures: 0,
  weatherModes: [],
  completedRoutes: [],
  updatedAt: 0
};

function cloneDefault() {
  return { ...DEFAULT_SAVE, visited: [], completedQuests: [], unlockedPostcards: ['classic'], weatherModes: [], completedRoutes: [] };
}

export class SaveSystem {
  constructor(storage = window.localStorage) {
    this.storage = storage;
    this.data = this.load();
  }

  load() {
    try {
      const raw = this.storage?.getItem(SAVE_KEY);
      if (!raw) return cloneDefault();
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== VERSION) return cloneDefault();
      return { ...cloneDefault(), ...parsed };
    } catch {
      return cloneDefault();
    }
  }

  persist() {
    this.data.updatedAt = Date.now();
    try {
      this.storage?.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch {
      // Private browsing or blocked storage should not break the static app.
    }
  }

  reset() {
    this.data = cloneDefault();
    try {
      this.storage?.removeItem(SAVE_KEY);
    } catch {
      // Ignore blocked storage.
    }
  }

  setActiveRoute(routeId) {
    this.data.activeRoute = routeId;
    this.persist();
  }

  setTimeMode(mode) {
    this.data.timeMode = mode;
    if (!this.data.weatherModes.includes(mode)) this.data.weatherModes.push(mode);
    this.persist();
  }

  markVisited(name) {
    if (!this.data.visited.includes(name)) {
      this.data.visited.push(name);
      this.persist();
      return true;
    }
    return false;
  }

  completeQuest(id) {
    if (!this.data.completedQuests.includes(id)) {
      this.data.completedQuests.push(id);
      this.persist();
      return true;
    }
    return false;
  }

  unlockPostcard(id) {
    if (!this.data.unlockedPostcards.includes(id)) {
      this.data.unlockedPostcards.push(id);
      this.persist();
      return true;
    }
    return false;
  }

  addTrainRide(routeName) {
    this.data.trainRides += 1;
    this.data.lastTrainRoute = routeName;
    this.persist();
  }

  addPhotoCapture({ postcardId, timeMode }) {
    this.data.photoCaptures += 1;
    if (postcardId) this.unlockPostcard(postcardId);
    if (['Night', 'Rain', 'Thunderstorm'].includes(timeMode)) this.data.nightPhoto = true;
    this.persist();
  }

  completeRoute(routeId) {
    if (!this.data.completedRoutes.includes(routeId)) {
      this.data.completedRoutes.push(routeId);
      this.persist();
      return true;
    }
    return false;
  }
}
