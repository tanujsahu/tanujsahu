export type VehicleId = "bike" | "car";
export type RideMode = "walk" | VehicleId;

export interface VehicleState {
  id: VehicleId;
  x: number;
  z: number;
  yaw: number;
}

/** Parked on the sidewalk beside the main avenue. Mutated while the player rides. */
export const vehicles: Record<VehicleId, VehicleState> = {
  bike: { id: "bike", x: 5.4, z: 6.6, yaw: Math.PI / 2 },
  car: { id: "car", x: 0.4, z: 13.45, yaw: Math.PI / 2 },
};

export const rideState: { mode: RideMode } = { mode: "walk" };

export function vehicleReach(id: VehicleId) {
  return id === "car" ? 2.9 : 2.25;
}

export function nearestVehicle(x: number, z: number): VehicleId | null {
  let best: VehicleId | null = null;
  let bestDistance = Infinity;
  const ids: VehicleId[] = ["bike", "car"];
  for (const id of ids) {
    const vehicle = vehicles[id];
    const distance = Math.hypot(vehicle.x - x, vehicle.z - z);
    if (distance <= vehicleReach(id) && distance < bestDistance) {
      best = id;
      bestDistance = distance;
    }
  }
  return best;
}
