"use client";

import { useGame } from "@/context/GameContext";

export function LoungeBar() {
  const { interior, nearMachine, drink, serveDrink, leaveLounge, activeId, mode } = useGame();
  if (mode !== "explore" || interior !== "contact" || activeId) return null;

  return (
    <div className="pointer-events-auto absolute bottom-36 left-1/2 z-30 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2">
      {drink ? (
        <p className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-slate-950">
          {drink === "coffee" ? "Coffee" : "Tea"}
        </p>
      ) : nearMachine ? (
        <>
          <button
            type="button"
            className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50"
            onClick={() => serveDrink("coffee")}
          >
            Coffee
          </button>
          <button
            type="button"
            className="rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-950"
            onClick={() => serveDrink("tea")}
          >
            Tea
          </button>
        </>
      ) : null}
      <button
        type="button"
        className="rounded-full border border-white/20 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-white"
        onClick={leaveLounge}
      >
        Step outside
      </button>
    </div>
  );
}
