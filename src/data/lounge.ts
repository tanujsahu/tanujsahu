export type DrinkKind = "coffee" | "tea";

export const loungeState = {
  active: false,
  aimCamera: false,
};

export const drinkState: { kind: DrinkKind | null; until: number } = {
  kind: null,
  until: 0,
};

/** Contact building interior, in world meters. The door faces south (+z). */
export const contactLounge = {
  spawn: { x: 29, z: -28.35, yaw: Math.PI },
  exit: { x: 29, z: -24.1, yaw: Math.PI },
  bounds: { minX: 24.4, maxX: 33.55, minZ: -34.45, maxZ: -27.55 },
  door: { minX: 28.05, maxX: 29.95, exitZ: -26.85 },
  serve: { x: 31.65, z: -30.75, yaw: Math.PI / 2 },
  reach: 2,
};

export const loungeFurniture: Array<{ minX: number; maxX: number; minZ: number; maxZ: number }> = [
  { minX: 26.75, maxX: 30.05, minZ: -34.1, maxZ: -33.1 },
  { minX: 25.45, maxX: 26.4, minZ: -32.9, maxZ: -31.9 },
  { minX: 30.15, maxX: 31.1, minZ: -33.0, maxZ: -32.0 },
  { minX: 27.7, maxX: 29.1, minZ: -32.75, maxZ: -31.95 },
  { minX: 32.55, maxX: 33.7, minZ: -31.15, maxZ: -30.35 },
];
