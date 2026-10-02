/**
 * Rapier collision groups.
 *
 * Rapier packs membership and filter into one 32-bit value: the high 16 bits are the groups a
 * collider belongs to, the low 16 are the groups it will collide with. Two colliders interact
 * only when each one's membership appears in the other's filter.
 *
 * Traffic is deliberately kept off the terrain trimesh: kinematic car boxes resting on that mesh
 * make Rapier's solver panic, which poisons the whole world and freezes the player's car.
 */
export const GROUP_WORLD = 0x0001;
export const GROUP_PLAYER = 0x0002;
export const GROUP_TRAFFIC = 0x0004;

const pack = (memberships, filter) => ((memberships << 16) | filter) >>> 0;

/** Static terrain, floor and buildings: collide with the player only. */
export const GROUPS_WORLD = pack(GROUP_WORLD, GROUP_WORLD | GROUP_PLAYER);
/** The player's vehicle: everything except other traffic. */
export const GROUPS_PLAYER = pack(GROUP_PLAYER, GROUP_WORLD | GROUP_TRAFFIC);
/** Traffic: the player only, so cars never touch the heightfield or each other. */
export const GROUPS_TRAFFIC = pack(GROUP_TRAFFIC, GROUP_PLAYER);
