"use client";

import { Footprints, Map, Moon, Settings, Sun, Volume2, VolumeX } from "lucide-react";
import { getLocation } from "@/data/locations";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";

export function GameHUD() {
  const {
    mode,
    setMode,
    nearestId,
    soundOn,
    toggleSound,
    setMenuOpen,
    setSettingsOpen,
    menuOpen,
    settingsOpen,
    freeRoam,
    toggleFreeRoam,
    vehicleFinish,
    setVehicleFinish,
  } = useGame();
  const nearest = nearestId ? getLocation(nearestId) : undefined;
  const place =
    mode === "intro"
      ? "City overview"
      : nearest
        ? `${nearest.district} · ${nearest.shortName}`
        : "Central Plaza";

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-5">
      <div className="glass pointer-events-auto max-w-[70vw] rounded-2xl px-4 py-3">
        <p className="font-display text-sm text-white sm:text-base">{profile.name}</p>
        <p className="text-[11px] text-slate-300 sm:text-xs">{profile.title}</p>
        <p className="mt-1 text-xs text-cyan-100">{place}</p>
      </div>
      <div className="pointer-events-auto flex items-center gap-2">
        <Button
          variant="icon"
          aria-pressed={vehicleFinish === "dark"}
          aria-label={vehicleFinish === "dark" ? "Switch the bike and car to light" : "Switch the bike and car to dark"}
          onClick={() => setVehicleFinish(vehicleFinish === "dark" ? "light" : "dark")}
        >
          {vehicleFinish === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button
          variant="icon"
          aria-pressed={freeRoam}
          aria-label={freeRoam ? "Turn off free roam" : "Move anywhere"}
          onClick={toggleFreeRoam}
        >
          <Footprints className="h-4 w-4" />
        </Button>
        <Button
          variant="icon"
          aria-pressed={soundOn}
          aria-label={soundOn ? "Mute ambient sound" : "Enable ambient sound"}
          onClick={toggleSound}
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        {mode !== "intro" ? (
          <Button
            variant="icon"
            aria-pressed={menuOpen}
            aria-label="Open city guide"
            onClick={() => setMenuOpen(true)}
          >
            <Map className="h-4 w-4" />
          </Button>
        ) : null}
        <Button
          variant="icon"
          aria-pressed={settingsOpen}
          aria-label="Open settings"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="secondary" className="hidden px-3 sm:inline-flex" onClick={() => setMode("classic")}>
          Classic Portfolio
        </Button>
        <Button
          variant="icon"
          className="sm:hidden"
          aria-label="Open classic portfolio"
          onClick={() => setMode("classic")}
        >
          <span className="text-[11px] font-semibold">Aa</span>
        </Button>
      </div>
    </div>
  );
}
