// Minimal synchronous event bus. Gameplay systems talk through this instead of
// holding references to each other, which keeps the systems independently
// testable in Node without a DOM.
export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  once(event, handler) {
    const wrapped = (...args) => {
      this.off(event, wrapped);
      handler(...args);
    };
    return this.on(event, wrapped);
  }

  off(event, handler) {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) this.listeners.delete(event);
  }

  emit(event, payload) {
    const set = this.listeners.get(event);
    if (!set) return;
    // Copy first: handlers are allowed to unsubscribe during dispatch.
    for (const handler of [...set]) {
      try {
        handler(payload);
      } catch (error) {
        console.error(`[bus] handler for "${event}" threw`, error);
      }
    }
  }

  clear() {
    this.listeners.clear();
  }
}