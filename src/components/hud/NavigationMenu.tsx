"use client";

import { X } from "lucide-react";
import { locations } from "@/data/locations";
import { useGame } from "@/context/GameContext";

export function NavigationMenu() {
  const { menuOpen, setMenuOpen, discovered, openLocation, travelTo, nearestId } =
    useGame();
  if (!menuOpen) return null;

  const districts = locations.filter((location) => location.kind !== "project");
  const projects = locations.filter((location) => location.kind === "project");

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center p-3 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/60"
        aria-label="Close city guide"
        onClick={() => setMenuOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        className="glass pointer-events-auto relative max-h-[80dvh] w-full max-w-lg overflow-y-auto rounded-3xl p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Navigation</p>
            <h2 id="guide-title" className="mt-1 font-display text-2xl text-white">
              City guide
            </h2>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15"
            onClick={() => setMenuOpen(false)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <LocationGroup
          title="Districts"
          items={districts}
          discovered={discovered}
          nearestId={nearestId}
          onOpen={openLocation}
          onTravel={travelTo}
        />
        <LocationGroup
          title="Innovation Park"
          featured
          items={projects}
          discovered={discovered}
          nearestId={nearestId}
          onOpen={openLocation}
          onTravel={travelTo}
        />
      </div>
    </div>
  );
}

function LocationGroup({
  title,
  items,
  discovered,
  nearestId,
  onOpen,
  onTravel,
  featured = false,
}: {
  title: string;
  items: typeof locations;
  discovered: string[];
  nearestId: string | null;
  onOpen: (id: string) => void;
  onTravel: (id: string) => void;
  featured?: boolean;
}) {
  return (
    <section className="mt-5">
      <h3
        className={
          featured
            ? "text-xs font-semibold uppercase tracking-[0.18em] text-violet-200"
            : "text-xs uppercase tracking-[0.18em] text-slate-400"
        }
      >
        {title}
      </h3>
      <ul className="mt-2 space-y-2">
        {items.map((location) => {
          const emphasis = featured || location.kind === "campus";
          return (
          <li
            key={location.id}
            className={
              emphasis
                ? "flex items-center justify-between gap-3 rounded-2xl border border-cyan-200/35 bg-cyan-200/10 px-3 py-2"
                : "flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
            }
          >
            <div>
              <p className="text-sm text-white">
                {location.shortName}
                {nearestId === location.id ? " · nearby" : ""}
                {discovered.includes(location.id) ? "" : ""}
              </p>
              <p className="text-xs text-slate-400">
                {discovered.includes(location.id) ? "Explored" : "Not yet explored"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-white"
                onClick={() => onTravel(location.id)}
              >
                Go
              </button>
              <button
                type="button"
                className="rounded-full bg-cyan-200 px-3 py-1 text-xs font-semibold text-slate-950"
                onClick={() => onOpen(location.id)}
              >
                Open
              </button>
            </div>
          </li>
          );
        })}
      </ul>
    </section>
  );
}
