export class DetailPerformanceGovernor {
  constructor(options = {}) {
    this.maxBudget = options.maxBudget ?? 350_000;
    this.minBudget = options.minBudget ?? 120_000;
    this.budget = options.initialBudget ?? this.maxBudget;
    this.cooldownMs = options.cooldownMs ?? 1800;
    this.lastChange = 0;
    this.samplesAboveTarget = 0;
  }

  update({ fps, now = performance.now() } = {}) {
    if (!Number.isFinite(fps) || fps <= 0) return { changed: false, budget: this.budget };
    if (now - this.lastChange < this.cooldownMs) return { changed: false, budget: this.budget };

    let next = this.budget;
    if (fps < 24) {
      next = Math.max(this.minBudget, Math.floor(this.budget * 0.68));
      this.samplesAboveTarget = 0;
    } else if (fps < 42) {
      next = Math.max(this.minBudget, Math.floor(this.budget * 0.84));
      this.samplesAboveTarget = 0;
    } else if (fps >= 56) {
      this.samplesAboveTarget += 1;
      if (this.samplesAboveTarget >= 2) {
        next = Math.min(this.maxBudget, Math.ceil(this.budget * 1.12));
        this.samplesAboveTarget = 0;
      }
    } else {
      this.samplesAboveTarget = 0;
    }

    if (next === this.budget) return { changed: false, budget: this.budget };
    this.budget = next;
    this.lastChange = now;
    return { changed: true, budget: this.budget };
  }
}
