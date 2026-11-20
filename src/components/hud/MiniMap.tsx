"use client";

import { useEffect, useState } from "react";
import { cityBounds, locations } from "@/data/locations";
import { useGame } from "@/context/GameContext";

const SIZE = 168;

function project(x: number, z: number) {
  const left = ((x - cityBounds.minX) / (cityBounds.maxX - cityBounds.minX)) * SIZE;
  const top = ((z - cityBounds.minZ) / (cityBounds.maxZ - cityBounds.minZ)) * SIZE;
  return { left, top };
}

export function MiniMap() {
  const { playerRef, nearestId, discovered, travelTo, mode, interior } = useGame();
  const [position, setPosition] = useState({ x: 0, z: 8.5 });

  useEffect(() => {
    let frame = 0;
    let last = 0;
    const loop = (now: number) => {
      if (now - last > 90) {
        last = now;
        const next = playerRef.current;
        if (next) {
          setPosition((current) =>
            current.x === next.x && current.z === next.z
              ? current
              : { x: next.x, z: next.z },
          );
        }
      }
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [playerRef]);

  if (mode === "intro" || interior === "contact") return null;
  const player = project(position.x, position.z);
  const progress = Math.round((discovered.length / locations.length) * 100);

  return (
    <div className="pointer-events-auto absolute right-3 top-[4.5rem] z-20 w-[168px] origin-top-right scale-[0.72] sm:bottom-5 sm:right-5 sm:top-auto sm:scale-100">
      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mb-2 text-right text-[11px] text-slate-300">
        Explored {discovered.length}/{locations.length}
      </p>
      <div
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75"
        style={{ width: SIZE, height: SIZE }}
        aria-label="City map"
      >
        {locations.map((location) => {
          const point = project(location.position[0], location.position[2]);
          const seen = discovered.includes(location.id);
          const near = nearestId === location.id;
          const spotlight = location.kind === "project" || location.kind === "campus";
          return (
            <button
              key={location.id}
              type="button"
              title={`Go to ${location.shortName}`}
              aria-label={`Go to ${location.shortName}`}
              onClick={() => travelTo(location.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${spotlight ? "h-3.5 w-3.5" : "h-2.5 w-2.5"}`}
              style={{
                left: point.left,
                top: point.top,
                background: near || seen || spotlight ? location.accent : "transparent",
                boxShadow: spotlight
                  ? `0 0 0 4px ${location.accent}55`
                  : near
                    ? `0 0 0 4px ${location.accent}55`
                    : undefined,
                border: `1px solid ${location.accent}`,
              }}
            />
          );
        })}
        <span
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{ left: player.left, top: player.top }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
