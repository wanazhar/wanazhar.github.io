/**
 * Persistence for championship progress. localStorage is the only backend, which
 * keeps the game a pure static bundle with no server or environment variables.
 */

const STORAGE_KEY = 'apexgp.championship.v1';

export function createStore(storage = globalThis.localStorage) {
  let available = true;
  try {
    // Safari private mode throws on setItem, so probe once up front.
    const probe = '__apexgp_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
  } catch {
    available = false;
  }

  return {
    available,

    load() {
      if (!available) return null;
      try {
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        return parsed;
      } catch {
        // A corrupt save should never block the menu; start fresh instead.
        return null;
      }
    },

    save(state) {
      if (!available) return false;
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
      } catch {
        return false;
      }
    },

    clear() {
      if (!available) return;
      try {
        storage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  };
}