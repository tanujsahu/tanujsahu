"use client";

import { getLocation } from "@/data/locations";
import { useGame } from "@/context/GameContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function ControlsGuide() {
  const { nearestId, nearestVehicleId, ride, hint, mode, interior, nearMachine, drink } = useGame();
  const coarse = useMediaQuery("(max-width: 820px)");
  if (mode === "intro") return null;

  const nearest = nearestId ? getLocation(nearestId) : undefined;
  const ridePrompt =
    ride !== "walk"
      ? "Press V to step off"
      : nearestVehicleId === "car"
        ? coarse
          ? "Tap Drive to use the car"
          : "Press V to drive the car"
        : nearestVehicleId === "bike"
          ? coarse
            ? "Tap Ride to use the bike"
            : "Press V to ride the bike"
          : null;
  const loungePrompt =
    interior === "contact"
      ? drink
        ? drink === "coffee"
          ? "Enjoying a coffee."
          : "Enjoying a tea."
        : nearMachine
          ? coarse
            ? "Tap Coffee or Tea"
            : "Take a coffee or a tea, or click a cup"
          : coarse
            ? "Walk to the sofa or the coffee machine. Tap Explore for details."
            : "Walk to the sofa or the coffee machine. Press E for the contact details."
      : null;
  const prompt = loungePrompt
    ? loungePrompt
    : nearest
    ? coarse
      ? `Tap Explore to enter ${nearest.shortName}`
      : `Press E to explore ${nearest.shortName}`
    : ridePrompt || hint || "Walk up to any building. The city guide can open a location directly.";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex items-end justify-between gap-3 p-3 sm:bottom-0 sm:p-5">
      <div className="glass hidden max-w-sm rounded-2xl px-4 py-3 text-xs leading-5 text-slate-300 md:block">
        <p className="font-semibold tracking-wide text-white">Controls</p>
        <p className="mt-1">Arrows or WASD follow the camera: up forward, down back, left and right to the side</p>
        <p>E or click a nearby building to explore</p>
        <p>V to ride the bike or drive the car, then V to step off</p>
        <p>Drag to look left, right, up, and down</p>
        <p>Click the ground to walk there · F to move anywhere</p>
        <p>Mouse wheel to zoom · M city guide · C classic view</p>
      </div>
      <div className="glass pointer-events-none mx-auto max-w-md rounded-full px-4 py-2 text-center text-sm text-cyan-50 md:mx-0">
        <p aria-live="polite">{prompt}</p>
      </div>
      <div className="hidden w-44 md:block" />
    </div>
  );
}
