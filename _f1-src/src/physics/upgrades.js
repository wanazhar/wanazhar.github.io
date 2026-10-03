/**
 * Upgrades. Development points are earned from race finishes and spent between
 * races to change how the car behaves.
 *
 * Every upgrade is expressed as a modifier on an existing physics parameter, so
 * there is one source of truth for what a car actually does. An upgrade that
 * nobody can feel is not worth having, so the tiers here are deliberately large.
 */

import { clamp } from '../util/math.js';

/**
 * @typedef {object} Upgrade
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]} affects  physics fields this changes, for the UI
 * @property {number} cost       development points for the next tier
 * @property {number[]} values   the value at each tier, index 0 = stock
 */

/** Power: engine and gearbox. */
export const POWER_TIERS = {
  id: 'power',
  name: 'Power Unit',
  description: 'Engine power and torque delivery.',
  affects: ['powerScale'],
  values: [1.0, 1.035, 1.07, 1.105],
  costs: [0, 3, 5, 8]
};

/** Aerodynamics: downforce raises cornering grip and high-speed stability. */
export const AERO_TIERS = {
  id: 'aero',
  name: 'Aerodynamics',
  description: 'Downforce. More grip in corners, more drag on the straights.',
  affects: ['downforceArea'],
  values: [7.4, 7.95, 8.5, 9.1],
  costs: [0, 3, 5, 8]
};

/** Brakes: more force, and the pedal does not fade as quickly. */
export const BRAKE_TIERS = {
  id: 'brakes',
  name: 'Brakes',
  description: 'Brake force and stability under heavy braking.',
  affects: ['maxBrakeForce'],
  values: [40000, 43000, 46000, 49000],
  costs: [0, 2, 4, 6]
};

/** Grip: tyres. */
export const TYRE_TIERS = {
  id: 'tyres',
  name: 'Tyres',
  description: 'Slick compound. Higher peak grip, wider temperature window.',
  affects: ['peakGrip', 'optimalBand'],
  values: [0, 1, 2, 3],
  costs: [0, 3, 5, 7]
};

/** DRS: how much drag the flap removes when open. */
export const DRS_TIERS = {
  id: 'drs',
  name: 'DRS',
  description: 'Rear wing flap. More speed on the straights.',
  affects: ['drsDragReduction'],
  values: [0.42, 0.47, 0.52, 0.57],
  costs: [0, 3, 5, 8]
};

/** Reliability, which is the cost side of the whole upgrade economy. */
export const RELIABILITY_TIERS = {
  id: 'reliability',
  name: 'Reliability',
  description: 'Fewer retirements and fewer random mistakes.',
  affects: ['reliability'],
  values: [0.9, 0.94, 0.97, 0.99],
  costs: [0, 4, 6, 9]
};

export const UPGRADES = [POWER_TIERS, AERO_TIERS, BRAKE_TIERS, TYRE_TIERS, DRS_TIERS, RELIABILITY_TIERS];

/** Baseline physics values that an upgrade overrides. Kept next to the tiers so the two cannot drift apart. */
const STOCK_TYRE = { peakGrip: 1.62, optimalBand: 45 };

/** Total cost to take an upgrade from its current tier to `target`. */
export function upgradeCost(upgrade, from, target) {
  let total = 0;
  for (let tier = from + 1; tier <= target; tier += 1) total += upgrade.costs[tier] ?? 0;
  return total;
}

/** Clamp an upgrade level into its valid range. */
export function normaliseTier(upgrade, level) {
  return clamp(Math.round(level), 0, upgrade.values.length - 1);
}

/**
 * Development points earned from a race result.
 * Finishing on the podium or scoring well pays; a retirement pays nothing.
 * @param {number} position 1-based finishing position
 * @param {boolean} finished false for a retirement or disqualification
 */
export function developmentPointsFor(position, finished) {
  if (!finished) return 0;
  const points = [8, 6, 5, 4, 3, 2, 2, 1, 1, 0];
  return points[Math.max(0, Math.min(points.length - 1, position - 1))];
}

/**
 * Apply a set of upgrade tiers to a physics setup.
 * @param {{power: number, aero: number, brakes: number, tyres: number, drs: number}} levels
 * @returns {{grip: number, powerScale: number, downforceArea: number, maxBrakeForce: number, drsDragReduction: number, peakGrip: number, optimalBand: number, reliability: number}}
 */
export function applyUpgrades(levels, base = {}) {
  const power = normaliseTier(POWER_TIERS, levels.power ?? 0);
  const aero = normaliseTier(AERO_TIERS, levels.aero ?? 0);
  const brakes = normaliseTier(BRAKE_TIERS, levels.brakes ?? 0);
  const tyres = normaliseTier(TYRE_TIERS, levels.tyres ?? 0);
  const drs = normaliseTier(DRS_TIERS, levels.drs ?? 0);
  const reliability = normaliseTier(RELIABILITY_TIERS, levels.reliability ?? 0);

  // Tyre tier widens the working window as well as raising peak grip.
  const tyreGrip = STOCK_TYRE.peakGrip + tyres * 0.055;
  const tyreBand = STOCK_TYRE.optimalBand + tyres * 6;

  // The AI's baseline team rating multiplies the player's power tier, so a
  // driver on a good engine still gains from their own development.
  const basePower = base.powerScale ?? 1;
  const baseGrip = base.grip ?? 1;

  return {
    powerScale: basePower * POWER_TIERS.values[power],
    grip: baseGrip * (1 + tyres * 0.012),
    downforceArea: AERO_TIERS.values[aero],
    maxBrakeForce: BRAKE_TIERS.values[brakes],
    peakGrip: tyreGrip,
    optimalBand: tyreBand,
    drsDragReduction: DRS_TIERS.values[drs],
    reliability: RELIABILITY_TIERS.values[reliability],
    // `CarPhysics` reads `drsStrength` and `ersStrength`, and neither was passed
    // through here -- so both always fell back to their default of 1. The DRS
    // upgrade tier, which the player spends development points on, had no effect
    // on the car whatsoever.
    drsStrength: (base.drsStrength ?? 1) * (0.9 + drs * 0.1),
    ersStrength: base.ersStrength ?? 1
  };
}