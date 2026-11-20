import { cityBounds, locations, type CityLocation } from "@/data/locations";
import { lamps, trees } from "@/data/scenery";
import { rideState, vehicles, type VehicleId } from "@/data/vehicles";

export interface Obstacle {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface PlayerState {
  x: number;
  z: number;
  yaw: number;
  walking: boolean;
  traveling: boolean;
}

export interface TravelTarget {
  x: number;
  z: number;
}

const PLAYER_RADIUS = 0.62;

export function buildingObstacle(location: CityLocation, pad = 0.35): Obstacle {
  const [width, , depth] = location.size;
  const [x, , z] = location.position;
  return {
    minX: x - width / 2 - pad,
    maxX: x + width / 2 + pad,
    minZ: z - depth / 2 - pad,
    maxZ: z + depth / 2 + pad,
  };
}

export function pointObstacle(x: number, z: number, radius: number): Obstacle {
  return {
    minX: x - radius,
    maxX: x + radius,
    minZ: z - radius,
    maxZ: z + radius,
  };
}

export const sceneryObstacles: Obstacle[] = [
  ...trees.map((tree) =>
    pointObstacle(tree.position[0], tree.position[2], tree.radius),
  ),
  ...lamps.map((lamp) =>
    pointObstacle(lamp.position[0], lamp.position[2], lamp.radius),
  ),
];

export const obstacles: Obstacle[] = [
  ...locations.map((location) => buildingObstacle(location)),
  ...sceneryObstacles,
];

function vehicleObstacles(riding: VehicleId | "walk"): Obstacle[] {
  const parked: VehicleId[] = riding === "bike" ? ["car"] : riding === "car" ? ["bike"] : ["bike", "car"];
  return parked.map((id) =>
    pointObstacle(vehicles[id].x, vehicles[id].z, id === "car" ? 1.75 : 0.72),
  );
}

function obstaclesFor(riding: VehicleId | "walk") {
  return [...obstacles, ...vehicleObstacles(riding)];
}

export function mountRide(player: PlayerState, id: VehicleId) {
  const vehicle = vehicles[id];
  player.x = vehicle.x;
  player.z = vehicle.z;
  player.yaw = vehicle.yaw;
  player.walking = false;
  player.traveling = false;
  rideState.mode = id;
}

export function dismountRide(player: PlayerState) {
  if (rideState.mode === "walk") return;
  const side = rideState.mode === "car" ? 2.55 : 1.4;
  rideState.mode = "walk";
  const solids = obstaclesFor("walk");
  const sides = [side, -side];
  for (const amount of sides) {
    const x = player.x + Math.cos(player.yaw) * amount;
    const z = player.z - Math.sin(player.yaw) * amount;
    if (!blocked(x, z, PLAYER_RADIUS, solids)) {
      player.x = x;
      player.z = z;
      break;
    }
  }
  player.walking = false;
  player.traveling = false;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function blocked(x: number, z: number, radius: number, solids: Obstacle[]) {
  for (const solid of solids) {
    const closestX = clamp(x, solid.minX, solid.maxX);
    const closestZ = clamp(z, solid.minZ, solid.maxZ);
    const dx = x - closestX;
    const dz = z - closestZ;
    if (dx * dx + dz * dz < radius * radius) return true;
  }
  return false;
}

export function moveWithCollision(
  x: number,
  z: number,
  dx: number,
  dz: number,
  solids: Obstacle[] = obstacles,
  radius = PLAYER_RADIUS,
  freeRoam = false,
) {
  const bounds = freeRoam
    ? {
        minX: cityBounds.minX - 14,
        maxX: cityBounds.maxX + 14,
        minZ: cityBounds.minZ - 14,
        maxZ: cityBounds.maxZ + 14,
      }
    : cityBounds;
  let nextX = x + dx;
  let nextZ = z;
  if (!freeRoam && blocked(nextX, nextZ, radius, solids)) nextX = x;

  nextZ = z + dz;
  if (!freeRoam && blocked(nextX, nextZ, radius, solids)) nextZ = z;

  return {
    x: clamp(nextX, bounds.minX + radius, bounds.maxX - radius),
    z: clamp(nextZ, bounds.minZ + radius, bounds.maxZ - radius),
  };
}

export function stepPlayer(
  player: PlayerState,
  input: { x: number; z: number },
  travel: TravelTarget | null,
  walk: TravelTarget | null,
  dt: number,
  canMove: boolean,
  freeRoam: boolean,
) {
  const safeDt = Math.min(Math.max(dt, 0), 0.05);
  const magnitude = Math.hypot(input.x, input.z);

  if (canMove && magnitude >= 0.08) {
    player.traveling = false;
    const riding = rideState.mode;
    const speed = riding === "car" ? 15 : riding === "bike" ? 10.8 : freeRoam ? 8.4 : 6.4;
    const radius = riding === "car" ? 1.4 : PLAYER_RADIUS;
    const next = moveWithCollision(
      player.x,
      player.z,
      (input.x / magnitude) * speed * safeDt,
      (input.z / magnitude) * speed * safeDt,
      obstaclesFor(riding),
      radius,
      freeRoam,
    );
    applyStep(player, next);
    return { travel: null, walk: null };
  }

  if (travel) {
    const dx = travel.x - player.x;
    const dz = travel.z - player.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.18) {
      player.x = travel.x;
      player.z = travel.z;
      player.walking = false;
      player.traveling = false;
      return { travel: null, walk: null };
    }
    const step = Math.min(distance, 18 * safeDt);
    player.x += (dx / distance) * step;
    player.z += (dz / distance) * step;
    player.yaw = Math.atan2(dx, dz);
    player.walking = true;
    player.traveling = true;
    return { travel, walk: null };
  }

  player.traveling = false;

  if (walk && canMove) {
    const dx = walk.x - player.x;
    const dz = walk.z - player.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.4) {
      player.walking = false;
      return { travel: null, walk: null };
    }
    const riding = rideState.mode;
    const step = Math.min(distance, (riding === "car" ? 15 : riding === "bike" ? 10.8 : freeRoam ? 8.4 : 6.4) * safeDt);
    const next = moveWithCollision(
      player.x,
      player.z,
      (dx / distance) * step,
      (dz / distance) * step,
      obstaclesFor(riding),
      riding === "car" ? 1.4 : PLAYER_RADIUS,
      freeRoam,
    );
    const moved = applyStep(player, next);
    if (!moved) {
      player.walking = false;
      return { travel: null, walk: null };
    }
    return { travel: null, walk };
  }

  if (!canMove || magnitude < 0.08) player.walking = false;
  return { travel, walk };
}

function applyStep(player: PlayerState, next: { x: number; z: number }) {
  const movedX = next.x - player.x;
  const movedZ = next.z - player.z;
  const moved = movedX * movedX + movedZ * movedZ > 0.000001;
  if (moved) {
    player.yaw = Math.atan2(movedX, movedZ);
    player.walking = true;
  } else {
    player.walking = false;
  }
  player.x = next.x;
  player.z = next.z;
  return moved;
}

export function distanceToEntrance(x: number, z: number, location: CityLocation) {
  return Math.hypot(location.entrance[0] - x, location.entrance[1] - z);
}

export const INTERACT_RADIUS = 3.5;
