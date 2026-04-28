import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES } from './ThemePresets.js';

export class ThemeManager {
  constructor() {
    this.listeners = new Set();
    this.theme = this.readStoredTheme();
  }

  readStoredTheme() {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && THEMES[stored]) return stored;
    } catch {}
    return DEFAULT_THEME;
  }

  getTheme() {
    return this.theme;
  }

  setTheme(theme) {
    if (!THEMES[theme] || theme === this.theme) return this.theme;
    const previous = this.theme;
    this.theme = theme;
    try { window.localStorage.setItem(THEME_STORAGE_KEY, theme); } catch {}
    for (const listener of this.listeners) listener(this.theme, previous);
    return this.theme;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.theme, this.theme);
    return () => this.listeners.delete(listener);
  }
}
