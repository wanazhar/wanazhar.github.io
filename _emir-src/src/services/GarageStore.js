import { hasSupabaseConfig, supabase } from './supabaseClient.js';

const STORAGE_KEY = 'emir-car-world:garage-state:v1';
const DEFAULT_STATE = {
  selected_vehicle: 'sedan',
  unlocked_vehicles: ['sedan', 'hatchback', 'offroader', 'truck', 'excavator'],
  high_score: 0,
  odometer_meters: 0,
  preferences: {}
};

export class GarageStore {
  constructor() {
    this.state = loadLocal() || { ...DEFAULT_STATE };
    this.user = null;
  }

  async load() {
    if (!hasSupabaseConfig) return this.state;
    const { data: auth } = await supabase.auth.getUser();
    this.user = auth?.user || null;
    if (!this.user) return this.state;
    const { data, error } = await supabase.from('garage_state').select('*').eq('user_id', this.user.id).maybeSingle();
    if (error) {
      console.warn('Garage load failed, using local state', error);
      return this.state;
    }
    if (data) {
      this.state = { ...DEFAULT_STATE, ...data };
      saveLocal(this.state);
    }
    return this.state;
  }

  async signInWithMagicLink(email) {
    if (!hasSupabaseConfig) throw new Error('Supabase env vars are missing. Using localStorage-only mode.');
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } });
    if (error) throw error;
    return true;
  }

  async refreshUser() {
    if (!hasSupabaseConfig) return null;
    const { data } = await supabase.auth.getUser();
    this.user = data?.user || null;
    return this.user;
  }

  updateLocalState(partial) {
    this.state = { ...this.state, ...partial };
    saveLocal(this.state);
  }

  async save(partial = {}) {
    this.updateLocalState(partial);
    if (!hasSupabaseConfig) return { mode: 'localStorage' };
    await this.refreshUser();
    if (!this.user) return { mode: 'localStorage', reason: 'not-authenticated' };
    const payload = {
      user_id: this.user.id,
      selected_vehicle: this.state.selected_vehicle || this.state.selectedVehicle || 'sedan',
      unlocked_vehicles: this.state.unlocked_vehicles || DEFAULT_STATE.unlocked_vehicles,
      high_score: this.state.high_score || 0,
      odometer_meters: this.state.odometer_meters || 0,
      preferences: this.state.preferences || {}
    };
    const { error } = await supabase.from('garage_state').upsert(payload, { onConflict: 'user_id' });
    if (error) throw error;
    return { mode: 'supabase' };
  }
}

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function saveLocal(state) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
