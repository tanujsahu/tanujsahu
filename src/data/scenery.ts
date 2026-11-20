export interface SceneryPoint {
  position: [number, number, number];
  radius: number;
  variant?: number;
}

export const trees: SceneryPoint[] = [
  { position: [-12, 0, 8], radius: 0.7, variant: 0 },
  { position: [12, 0, 7.5], radius: 0.7, variant: 1 },
  { position: [-14, 0, -16], radius: 0.65, variant: 2 },
  { position: [14, 0, -16], radius: 0.65, variant: 0 },
  { position: [-40, 0, 6], radius: 0.7, variant: 1 },
  { position: [40, 0, 8], radius: 0.7, variant: 2 },
  { position: [-8, 0, -18.5], radius: 0.55, variant: 0 },
  { position: [8, 0, -18.5], radius: 0.55, variant: 1 },
  { position: [0, 0, 26.2], radius: 0.7, variant: 2 },
  { position: [-38, 0, -16], radius: 0.65, variant: 0 },
  { position: [38, 0, -18], radius: 0.65, variant: 1 },
  { position: [14, 0, 26], radius: 0.6, variant: 2 },
  { position: [-14, 0, 26], radius: 0.6, variant: 0 },
  { position: [42, 0, -28], radius: 0.55, variant: 1 },
  { position: [-40, 0, -36], radius: 0.6, variant: 2 },
  { position: [-28, 0, 7.15], radius: 0.55, variant: 0 },
  { position: [-20, 0, 7.15], radius: 0.55, variant: 1 },
  { position: [-12, 0, 7.15], radius: 0.55, variant: 2 },
  { position: [10, 0, 7.15], radius: 0.55, variant: 0 },
  { position: [18, 0, 7.15], radius: 0.55, variant: 1 },
  { position: [26, 0, 7.15], radius: 0.55, variant: 2 },
  { position: [-22, 0, 13.55], radius: 0.55, variant: 1 },
  { position: [-11, 0, 13.55], radius: 0.55, variant: 2 },
  { position: [11, 0, 13.55], radius: 0.55, variant: 0 },
  { position: [22, 0, 13.55], radius: 0.55, variant: 1 },
  { position: [-24, 0, -19.3], radius: 0.55, variant: 0 },
  { position: [-12, 0, -19.3], radius: 0.55, variant: 2 },
  { position: [12, 0, -19.3], radius: 0.55, variant: 1 },
  { position: [24, 0, -19.3], radius: 0.55, variant: 0 },
  { position: [-16, 0, -25.6], radius: 0.55, variant: 2 },
  { position: [16, 0, -25.6], radius: 0.55, variant: 1 },
  { position: [-21.8, 0, -14], radius: 0.5, variant: 0 },
  { position: [-15.4, 0, -2], radius: 0.5, variant: 1 },
  { position: [14.2, 0, -16], radius: 0.5, variant: 2 },
  { position: [14.2, 0, 3], radius: 0.5, variant: 0 },
  { position: [36.4, 0, 4.2], radius: 0.6, variant: 1 },
  { position: [42.4, 0, 4.4], radius: 0.6, variant: 2 },
  { position: [36.6, 0, 10.2], radius: 0.55, variant: 0 },
  { position: [42.2, 0, 10.4], radius: 0.6, variant: 1 },
  { position: [39.4, 0, 15.2], radius: 0.6, variant: 2 },
  { position: [36.5, 0, 15.6], radius: 0.5, variant: 0 },
];

export const lamps: SceneryPoint[] = [
  { position: [-6, 0, 4], radius: 0.28 },
  { position: [6, 0, 4], radius: 0.28 },
  { position: [-6, 0, -20], radius: 0.28 },
  { position: [6, 0, -20], radius: 0.28 },
  { position: [-20, 0, 6], radius: 0.28 },
  { position: [18, 0, 6], radius: 0.28 },
  { position: [-20, 0, -22], radius: 0.28 },
  { position: [20, 0, -22], radius: 0.28 },
  { position: [34.2, 0, 8.6], radius: 0.28 },
  { position: [34.2, 0, 14.2], radius: 0.28 },
];

export interface RoadSegment {
  position: [number, number, number];
  length: number;
  width: number;
  axis: "x" | "z";
}

export const roads: RoadSegment[] = [
  { position: [0, 0.02, -18.6], length: 14.2, width: 3.3, axis: "z" },
  { position: [0, 0.02, 4.6], length: 8.4, width: 3.3, axis: "z" },
  { position: [0, 0.02, 10.2], length: 64, width: 3.4, axis: "x" },
  { position: [0, 0.02, -22.5], length: 66, width: 3.2, axis: "x" },
  { position: [-18.6, 0.02, -7.4], length: 26, width: 3.15, axis: "z" },
  { position: [17.4, 0.02, -7.4], length: 26, width: 3.15, axis: "z" },
];

export const lawns: Array<{ position: [number, number, number]; size: [number, number] }> = [
  { position: [-14, 0.01, 2], size: [8, 6] },
  { position: [12, 0.01, -2], size: [7, 5] },
  { position: [-12, 0.01, -14], size: [6, 4] },
  { position: [12, 0.01, 16], size: [5, 3] },
  { position: [-36, 0.01, 16], size: [6, 5] },
  { position: [38, 0.01, 14], size: [5, 4] },
];

/** Grass park just east of the main avenue, on the roadside. */
export const park = {
  position: [39.4, 0.03, 9.6] as [number, number, number],
  size: [9.2, 13.4] as [number, number],
};
