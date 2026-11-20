"use client";

import { useEffect, useState } from "react";
import { lawns, park, roads, trees } from "@/data/scenery";
import { vehicles } from "@/data/vehicles";
import { locations, playerSpawn } from "@/data/locations";
import { INTERACT_RADIUS, distanceToEntrance } from "@/lib/movement";
import { useGame } from "@/context/GameContext";

const SCALE = 14;

export function FallbackMap() {
  const { playerRef, nearestId, openLocation, travelTo, walkTo, webglAvailable, renderPreference } =
    useGame();
  const [frame, setFrame] = useState({
    x: playerSpawn.x,
    z: playerSpawn.z,
    yaw: playerSpawn.yaw,
    bikeX: vehicles.bike.x,
    bikeZ: vehicles.bike.z,
    carX: vehicles.car.x,
    carZ: vehicles.car.z,
  });

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      if (now - last > 32) {
        last = now;
        const player = playerRef.current;
        if (player) {
          setFrame((current) =>
            current.x === player.x &&
            current.z === player.z &&
            current.yaw === player.yaw &&
            current.bikeX === vehicles.bike.x &&
            current.bikeZ === vehicles.bike.z &&
            current.carX === vehicles.car.x &&
            current.carZ === vehicles.car.z
              ? current
              : {
                  x: player.x,
                  z: player.z,
                  yaw: player.yaw,
                  bikeX: vehicles.bike.x,
                  bikeZ: vehicles.bike.z,
                  carX: vehicles.car.x,
                  carZ: vehicles.car.z,
                },
          );
        }
      }
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [playerRef]);

  const reason =
    renderPreference === "map"
      ? "Map view is on. Movement and every dossier stay available."
      : webglAvailable === false
        ? "3D graphics are unavailable here, so the city is shown as a playable map."
        : "Map view";

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#070b14]"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / SCALE + frame.x;
        const z = (event.clientY - rect.top - rect.height / 2) / SCALE + frame.z;
        walkTo(x, z);
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_42%),linear-gradient(#10182a,#070b14)]" />
      <p className="pointer-events-none absolute left-1/2 top-20 z-10 max-w-md -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-center text-xs text-slate-300">
        {reason}
      </p>
      <div
        className="absolute left-1/2 top-1/2 h-0 w-0"
        style={{ transform: `translate(${-frame.x * SCALE}px, ${-frame.z * SCALE}px)` }}
      >
        {lawns.map((lawn) => (
          <div
            key={lawn.position.join(":")}
            className="absolute rounded-2xl bg-emerald-950/80"
            style={box(lawn.position[0], lawn.position[2], lawn.size[0], lawn.size[1])}
          />
        ))}
        <div
          className="absolute rounded-2xl bg-emerald-800/80"
          style={box(park.position[0], park.position[2], park.size[0], park.size[1])}
          aria-label="City park"
        />
        {trees.map((tree) => (
          <div
            key={tree.position.join(":")}
            className="absolute rounded-full bg-emerald-600/80"
            style={box(tree.position[0], tree.position[2], 0.7, 0.7)}
          />
        ))}
        {roads.map((road) => {
          const spanX = road.axis === "x" ? road.length : road.width;
          const spanZ = road.axis === "z" ? road.length : road.width;
          return (
            <div
              key={`${road.position.join(":")}:${road.axis}`}
              className="absolute rounded-md bg-slate-700/80"
              style={box(road.position[0], road.position[2], spanX, spanZ)}
            />
          );
        })}
        {locations.map((location) => {
          const near = nearestId === location.id;
          const spotlight = location.kind === "project" || location.kind === "campus";
          return (
            <button
              key={location.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                const player = playerRef.current;
                if (!player) return;
                const distance = distanceToEntrance(player.x, player.z, location);
                if (distance <= INTERACT_RADIUS + 0.4) openLocation(location.id);
                else travelTo(location.id);
              }}
              aria-label={`${location.name}. ${near ? "Explore" : "Go to this building"}`}
              className={`absolute grid place-items-center rounded-lg border px-1 text-center font-semibold text-white shadow-lg ${spotlight ? "text-[11px]" : "text-[10px]"}`}
              style={{
                ...box(
                  location.position[0],
                  location.position[2],
                  location.size[0],
                  location.size[2],
                ),
                background: spotlight ? "#123044" : "#152033",
                borderColor: near || spotlight ? location.accent : "rgba(255,255,255,0.18)",
                boxShadow: near || spotlight ? `0 0 0 3px ${location.accent}` : undefined,
              }}
            >
              {location.shortName}
            </button>
          );
        })}
        <div
          className="absolute rounded-full bg-cyan-200"
          style={box(frame.bikeX, frame.bikeZ, 0.8, 0.8)}
          aria-label="Bike"
        />
        <div
          className="absolute rounded-md bg-amber-400"
          style={box(frame.carX, frame.carZ, 1.3, 2.2)}
          aria-label="Car"
        />
        <div
          className="absolute"
          style={{
            transform: `translate(${frame.x * SCALE}px, ${frame.z * SCALE}px) translate(-50%, -50%) rotate(${-frame.yaw}rad)`,
          }}
          aria-hidden="true"
        >
          <div className="relative h-4 w-4 rounded-full bg-white shadow">
            <span className="absolute left-1/2 top-full h-2 w-1 -translate-x-1/2 rounded-full bg-cyan-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function box(x: number, z: number, width: number, depth: number) {
  return {
    width: width * SCALE,
    height: depth * SCALE,
    transform: `translate(${x * SCALE}px, ${z * SCALE}px) translate(-50%, -50%)`,
  };
}
