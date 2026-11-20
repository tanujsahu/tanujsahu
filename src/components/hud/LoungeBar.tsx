"use client";

import { useGame } from "@/context/GameContext";

export function LoungeBar() {
  const { interior, nearMachine, drink, serveDrink, leaveLounge, activeId, mode } = useGame();
  if (mode !== "explore" || interior !== "contact" || activeId) return null;

  return (
    <div className="pointer-events-auto absolute inset-x-3 bottom-[10.75rem] z-30 flex gap-2 sm:inset-x-auto sm:bottom-28 sm:left-1/2 sm:-translate-x-1/2">
      <button
        type="button"
        className="min-h-11 flex-1 rounded-full bg-amber-900 px-3 py-2 text-sm font-semibold text-amber-50 sm:flex-none sm:px-4"
        onClick={() => serveDrink("coffee")}
      >
        {drink === "coffee" ? "Coffee…" : "Coffee"}
      </button>
      <button
        type="button"
        className="min-h-11 flex-1 rounded-full bg-amber-200 px-3 py-2 text-sm font-semibold text-slate-950 sm:flex-none sm:px-4"
        onClick={() => serveDrink("tea")}
      >
        {drink === "tea" ? "Tea…" : "Tea"}
      </button>
      <button
        type="button"
        className="min-h-11 flex-1 rounded-full border border-white/20 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-white sm:flex-none sm:px-4"
        onClick={leaveLounge}
      >
        Outside
      </button>
      {nearMachine ? <span className="sr-only">Standing at the coffee machine</span> : null}
    </div>
  );
}
