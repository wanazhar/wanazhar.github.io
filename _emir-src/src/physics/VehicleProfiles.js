export const VEHICLE_PROFILES = {
  sedan: {
    id: 'sedan', label: 'Standard Sedan', className: 'Urban balanced',
    mass: 1350, dimensions: { width: 1.85, height: 0.92, length: 4.45 }, wheelBase: 2.72, axleWidth: 1.72,
    centerOfMass: { x: 0, y: -0.34, z: 0.05 }, wheel: { radius: 0.36, width: 0.26 },
    suspension: { restLength: 0.48, stiffness: 42000, damping: 4800, travel: 0.34 },
    friction: { lateral: 7.2, longitudinal: 1.0 }, torque: 8100, brakeForce: 7800, maxSteer: 0.48, drag: 0.035,
    drivenWheels: ['rl', 'rr'], visual: { color: 0x171717 }
  },
  hatchback: {
    id: 'hatchback', label: 'Hatchback', className: 'Light city sprint',
    mass: 1050, dimensions: { width: 1.76, height: 0.98, length: 3.75 }, wheelBase: 2.42, axleWidth: 1.62,
    centerOfMass: { x: 0, y: -0.28, z: 0.03 }, wheel: { radius: 0.32, width: 0.23 },
    suspension: { restLength: 0.43, stiffness: 36000, damping: 4100, travel: 0.29 },
    friction: { lateral: 6.6, longitudinal: 1.0 }, torque: 7200, brakeForce: 6500, maxSteer: 0.56, drag: 0.04,
    drivenWheels: ['fl', 'fr'], visual: { color: 0xe4e0d7 }
  },
  offroader: {
    id: 'offroader', label: '4WD Off-roader', className: 'Long-travel crawler',
    mass: 1900, dimensions: { width: 2.05, height: 1.28, length: 4.7 }, wheelBase: 2.86, axleWidth: 1.9,
    centerOfMass: { x: 0, y: -0.48, z: 0 }, wheel: { radius: 0.48, width: 0.34 },
    suspension: { restLength: 0.72, stiffness: 52000, damping: 6200, travel: 0.52 },
    friction: { lateral: 8.4, longitudinal: 1.25 }, torque: 11200, brakeForce: 9200, maxSteer: 0.46, drag: 0.055,
    drivenWheels: ['fl', 'fr', 'rl', 'rr'], visual: { color: 0x434034 }
  },
  truck: {
    id: 'truck', label: 'Heavy Truck', className: 'Industrial haulage',
    mass: 7200, dimensions: { width: 2.45, height: 1.72, length: 7.4 }, wheelBase: 4.2, axleWidth: 2.16,
    centerOfMass: { x: 0, y: -0.62, z: 0.42 }, wheel: { radius: 0.55, width: 0.42 },
    suspension: { restLength: 0.62, stiffness: 125000, damping: 14500, travel: 0.42 },
    friction: { lateral: 10.8, longitudinal: 1.18 }, torque: 20500, brakeForce: 19000, maxSteer: 0.34, drag: 0.095,
    drivenWheels: ['rl', 'rr'], visual: { color: 0x8c1919 }
  },
  excavator: {
    id: 'excavator', label: 'Excavator', className: 'Massive slow torque',
    mass: 18500, dimensions: { width: 2.85, height: 1.95, length: 5.6 }, wheelBase: 3.05, axleWidth: 2.38,
    centerOfMass: { x: 0, y: -0.82, z: 0.36 }, wheel: { radius: 0.58, width: 0.54 },
    suspension: { restLength: 0.46, stiffness: 245000, damping: 28000, travel: 0.26 },
    friction: { lateral: 18.5, longitudinal: 1.4 }, torque: 42000, brakeForce: 28000, maxSteer: 0.22, drag: 0.18,
    drivenWheels: ['fl', 'fr', 'rl', 'rr'], accelerationLimiter: 0.38, visual: { color: 0xd1a114 }
  }
};

export const VEHICLE_ORDER = ['sedan', 'hatchback', 'offroader', 'truck', 'excavator'];
