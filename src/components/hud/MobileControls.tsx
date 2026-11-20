"use client";

import { PointerEvent, useRef } from "react";
import { useGame } from "@/context/GameContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function MobileControls() {
  const { joystickRef, interact, nearestId, nearestVehicleId, ride, toggleRide, mode, freeRoam, toggleFreeRoam, interior } = useGame();
  const coarse = useMediaQuery("(max-width: 820px)");
  const base = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const active = useRef(false);

  if (!coarse || mode === "intro") return null;

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!active.current || !base.current || !knob.current) return;
    const rect = base.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = event.clientX - centerX;
    let dy = event.clientY - centerY;
    const max = rect.width / 2 - 18;
    const magnitude = Math.hypot(dx, dy) || 1;
    const clamped = Math.min(magnitude, max);
    dx = (dx / magnitude) * clamped;
    dy = (dy / magnitude) * clamped;
    knob.current.style.transform = `translate(${dx}px, ${dy}px)`;
    joystickRef.current.x = dx / max;
    joystickRef.current.z = dy / max;
  }

  function end() {
    active.current = false;
    joystickRef.current.x = 0;
    joystickRef.current.z = 0;
    if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
  }

  return (
    <>
      <div
        ref={base}
        className="absolute bottom-6 left-4 z-30 h-28 w-28 touch-none rounded-full border border-white/20 bg-slate-950/50 backdrop-blur"
        onPointerDown={(event) => {
          active.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event);
        }}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        role="application"
        aria-label="Move joystick"
      >
        <div
          ref={knob}
          className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/90 shadow-lg"
        />
      </div>
      <button
        type="button"
        onClick={() => toggleRide()}
        className={`absolute bottom-[9.5rem] right-4 z-30 rounded-full px-4 py-2 text-xs font-semibold ${
          ride !== "walk" || nearestVehicleId
            ? "bg-amber-200 text-slate-950"
            : "hidden"
        }`}
      >
        {ride === "car" || ride === "bike" ? "Step off" : nearestVehicleId === "car" ? "Drive" : "Ride"}
      </button>
      <button
        type="button"
        onClick={toggleFreeRoam}
        aria-pressed={freeRoam}
        className={`absolute bottom-24 right-4 z-30 rounded-full px-4 py-2 text-xs font-semibold ${
          freeRoam ? "bg-violet-300 text-slate-950" : "border border-white/20 bg-slate-950/70 text-white"
        }`}
      >
        {freeRoam ? "Roaming" : "Move anywhere"}
      </button>
      <button
        type="button"
        onClick={interact}
        disabled={!nearestId && interior !== "contact"}
        className="absolute bottom-8 right-4 z-30 min-h-11 rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-40"
      >
        Explore
      </button>
    </>
  );
}
