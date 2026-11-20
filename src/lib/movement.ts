import { cameraAim } from "@/components/city/cameraRig";
import { cityBounds, locations, type CityLocation } from "@/data/locations";
import { contactLounge, loungeFurniture, loungeState } from "@/data/lounge";
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

const glide = { vx: 0, vz: 0, surge: 0 };

function resetGlide() {
  glide.vx = 0;
  glide.vz = 0;
  glide.surge = 0;
}

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
  resetGlide();
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
  resetGlide();
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

export function enterContactLounge(player: PlayerState) {
  loungeState.active = true;
  loungeState.aimCamera = true;
  player.x = contactLounge.spawn.x;
  player.z = contactLounge.spawn.z;
  player.yaw = contactLounge.spawn.yaw;
  player.walking = false;
  player.traveling = false;
  resetGlide();
}

export function leaveContactLounge(player: PlayerState) {
  loungeState.active = false;
  loungeState.aimCamera = false;
  player.x = contactLounge.exit.x;
  player.z = contactLounge.exit.z;
  player.yaw = contactLounge.exit.yaw;
  player.walking = false;
  player.traveling = false;
  resetGlide();
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
  if (loungeState.active) return stepLounge(player, input, walk, dt, canMove);

  const safeDt = Math.min(Math.max(dt, 0), 0.05);
  const steered = steer(input, safeDt, false, freeRoam);

  if (canMove && steered.pushing) {
    player.traveling = false;
    const riding = rideState.mode;
    const radius = riding === "car" ? 1.4 : PLAYER_RADIUS;
    const next = moveWithCollision(
      player.x,
      player.z,
      glide.vx * safeDt,
      glide.vz * safeDt,
      obstaclesFor(riding),
      radius,
      freeRoam,
    );
    applyStep(player, next, steered.face, safeDt);
    return { travel: null, walk: null, exitLounge: false };
  }

  if (travel) {
    resetGlide();
    const dx = travel.x - player.x;
    const dz = travel.z - player.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.18) {
      player.x = travel.x;
      player.z = travel.z;
      player.walking = false;
      player.traveling = false;
      return { travel: null, walk: null, exitLounge: false };
    }
    const step = Math.min(distance, 18 * safeDt);
    player.x += (dx / distance) * step;
    player.z += (dz / distance) * step;
    player.yaw = Math.atan2(dx, dz);
    player.walking = true;
    player.traveling = true;
    return { travel, walk: null, exitLounge: false };
  }

  player.traveling = false;

  if (canMove && steered.coasting) {
    const riding = rideState.mode;
    const radius = riding === "car" ? 1.4 : PLAYER_RADIUS;
    const next = moveWithCollision(
      player.x,
      player.z,
      glide.vx * safeDt,
      glide.vz * safeDt,
      obstaclesFor(riding),
      radius,
      freeRoam,
    );
    applyStep(player, next, null, safeDt);
    return { travel: null, walk, exitLounge: false };
  }

  if (walk && canMove) {
    resetGlide();
    const dx = walk.x - player.x;
    const dz = walk.z - player.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.4) {
      player.walking = false;
      return { travel: null, walk: null, exitLounge: false };
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
    const moved = applyStep(player, next, { x: dx, z: dz }, safeDt);
    if (!moved) {
      player.walking = false;
      return { travel: null, walk: null, exitLounge: false };
    }
    return { travel: null, walk, exitLounge: false };
  }

  if (!canMove) resetGlide();
  if (!canMove || !steered.coasting) player.walking = false;
  return { travel, walk, exitLounge: false };
}

function stepLounge(
  player: PlayerState,
  input: { x: number; z: number },
  walk: TravelTarget | null,
  dt: number,
  canMove: boolean,
) {
  const safeDt = Math.min(Math.max(dt, 0), 0.05);
  player.traveling = false;
  const steered = steer(input, safeDt, true, false);

  const advance = (dx: number, dz: number, face: { x: number; z: number } | null) => {
    const { bounds, door } = contactLounge;
    let nextX = player.x + dx;
    let nextZ = player.z;
    if (blocked(nextX, nextZ, PLAYER_RADIUS, loungeFurniture)) nextX = player.x;
    nextZ = player.z + dz;
    if (blocked(nextX, nextZ, PLAYER_RADIUS, loungeFurniture)) nextZ = player.z;
    const throughDoor = nextX > door.minX && nextX < door.maxX && nextZ > bounds.maxZ;
    if (throughDoor) {
      leaveContactLounge(player);
      return true;
    }
    nextX = clamp(nextX, bounds.minX, bounds.maxX);
    nextZ = clamp(nextZ, bounds.minZ, bounds.maxZ);
    applyStep(player, { x: nextX, z: nextZ }, face, safeDt);
    return false;
  };

  if (canMove && (steered.pushing || steered.coasting)) {
    const exited = advance(glide.vx * safeDt, glide.vz * safeDt, steered.pushing ? steered.face : null);
    return { travel: null, walk: steered.pushing ? null : walk, exitLounge: exited };
  }

  if (walk && canMove) {
    const dx = walk.x - player.x;
    const dz = walk.z - player.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.4) {
      player.walking = false;
      return { travel: null, walk: null, exitLounge: false };
    }
    const step = Math.min(distance, 5.2 * safeDt);
    const exited = advance((dx / distance) * step, (dz / distance) * step, { x: dx, z: dz });
    return { travel: null, walk: exited ? null : walk, exitLounge: exited };
  }

  if (!canMove) resetGlide();
  if (!canMove || !steered.coasting) player.walking = false;
  return { travel: null, walk, exitLounge: false };
}

function steer(
  input: { x: number; z: number },
  dt: number,
  indoors: boolean,
  freeRoam: boolean,
) {
  let strafe = input.x;
  let forward = -input.z;
  const magnitude = Math.hypot(strafe, forward);
  if (magnitude > 1) {
    strafe /= magnitude;
    forward /= magnitude;
  }
  const pushing = magnitude >= 0.08;
  const riding = rideState.mode;
  const base = indoors ? 5.2 : riding === "car" ? 15 : riding === "bike" ? 10.8 : freeRoam ? 8.4 : 6.4;
  if (!indoors && riding === "walk" && forward > 0.2) glide.surge = Math.min(1, glide.surge + dt * 0.9);
  else glide.surge = Math.max(0, glide.surge - dt * 1.7);

  const yaw = cameraAim.yaw;
  const forwardX = -Math.sin(yaw);
  const forwardZ = -Math.cos(yaw);
  const rightX = Math.cos(yaw);
  const rightZ = -Math.sin(yaw);
  const forwardSpeed = riding === "walk" && !indoors ? base * (1 + 0.42 * glide.surge) : base;
  const backSpeed = riding === "walk" ? base * 0.62 : base * 0.78;
  const alongSpeed = forward >= 0 ? forwardSpeed : backSpeed;
  let wishX = rightX * strafe * base + forwardX * forward * alongSpeed;
  let wishZ = rightZ * strafe * base + forwardZ * forward * alongSpeed;
  const wish = Math.hypot(wishX, wishZ);
  const cap = Math.max(base * (strafe === 0 ? 0 : 1), Math.abs(forward) * alongSpeed);
  if (wish > cap && wish > 0) {
    wishX *= cap / wish;
    wishZ *= cap / wish;
  }
  if (!pushing) {
    wishX = 0;
    wishZ = 0;
  }

  const rate = 1 - Math.exp(-(pushing ? 14 : 8) * dt);
  glide.vx += (wishX - glide.vx) * rate;
  glide.vz += (wishZ - glide.vz) * rate;
  if (Math.hypot(glide.vx, glide.vz) < 0.18) {
    glide.vx = 0;
    glide.vz = 0;
  }
  return {
    pushing,
    coasting: glide.vx !== 0 || glide.vz !== 0,
    face: { x: wishX, z: wishZ },
  };
}

function faceToward(player: PlayerState, dx: number, dz: number, dt: number) {
  if (dx * dx + dz * dz < 0.0001) return;
  const target = Math.atan2(dx, dz);
  const difference = Math.atan2(Math.sin(target - player.yaw), Math.cos(target - player.yaw));
  player.yaw += difference * (1 - Math.exp(-12 * dt));
}

function applyStep(
  player: PlayerState,
  next: { x: number; z: number },
  face: { x: number; z: number } | null,
  dt: number,
) {
  const movedX = next.x - player.x;
  const movedZ = next.z - player.z;
  const moved = movedX * movedX + movedZ * movedZ > 0.000001;
  if (face) faceToward(player, face.x, face.z, dt);
  player.walking = moved;
  player.x = next.x;
  player.z = next.z;
  return moved;
}

export function distanceToEntrance(x: number, z: number, location: CityLocation) {
  return Math.hypot(location.entrance[0] - x, location.entrance[1] - z);
}

export const INTERACT_RADIUS = 3.5;
