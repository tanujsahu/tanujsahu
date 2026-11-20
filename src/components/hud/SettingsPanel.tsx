"use client";

import { X } from "lucide-react";
import { useGame, type GraphicsQuality, type MotionPreference, type RenderPreference, type VehicleFinish } from "@/context/GameContext";

export function SettingsPanel() {
  const {
    settingsOpen,
    setSettingsOpen,
    soundOn,
    toggleSound,
    graphics,
    setGraphics,
    renderPreference,
    setRenderPreference,
    motionPreference,
    setMotionPreference,
    webglAvailable,
    freeRoam,
    toggleFreeRoam,
    vehicleFinish,
    setVehicleFinish,
  } = useGame();

  if (!settingsOpen) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center p-3 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/60"
        aria-label="Close settings"
        onClick={() => setSettingsOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="glass pointer-events-auto relative w-full max-w-md rounded-3xl p-5"
      >
        <div className="flex items-start justify-between">
          <h2 id="settings-title" className="font-display text-2xl text-white">
            Settings
          </h2>
          <button
            type="button"
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15"
            onClick={() => setSettingsOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 space-y-5 text-sm">
          <label className="flex items-center justify-between gap-4">
            <span>Move anywhere</span>
            <input type="checkbox" checked={freeRoam} onChange={toggleFreeRoam} />
          </label>
          <p className="-mt-3 text-xs leading-5 text-slate-400">
            Walk through the city without stopping at buildings. Click the ground to head there, or press F to toggle.
          </p>
          <label className="flex items-center justify-between gap-4">
            <span>Ambient sound</span>
            <input type="checkbox" checked={soundOn} onChange={toggleSound} />
          </label>
          <Choice
            label="Bike and car"
            value={vehicleFinish}
            options={[
              ["light", "Light"],
              ["dark", "Dark"],
            ]}
            onChange={(value) => setVehicleFinish(value as VehicleFinish)}
          />
          <Choice
            label="Graphics"
            value={graphics}
            options={[
              ["balanced", "Balanced"],
              ["high", "High"],
            ]}
            onChange={(value) => setGraphics(value as GraphicsQuality)}
          />
          <Choice
            label="City rendering"
            value={renderPreference}
            options={[
              ["auto", "Automatic"],
              ["3d", "3D city"],
              ["map", "Map fallback"],
            ]}
            onChange={(value) => setRenderPreference(value as RenderPreference)}
          />
          <Choice
            label="Motion"
            value={motionPreference}
            options={[
              ["system", "Match device"],
              ["reduce", "Reduce"],
              ["allow", "Allow"],
            ]}
            onChange={(value) => setMotionPreference(value as MotionPreference)}
          />
          <p className="text-xs leading-5 text-slate-400">
            {webglAvailable === false
              ? "This browser does not expose WebGL, so the playable map is used."
              : "Automatic mode uses the 3D city when WebGL is available. The map keeps the same movement and dossiers."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-slate-300">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([id, text]) => (
          <label
            key={id}
            className={`cursor-pointer rounded-full border px-3 py-1 ${
              value === id
                ? "border-cyan-200 bg-cyan-200 text-slate-950"
                : "border-white/15 text-slate-200"
            }`}
          >
            <input
              className="sr-only"
              type="radio"
              name={label}
              value={id}
              checked={value === id}
              onChange={() => onChange(id)}
            />
            {text}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
