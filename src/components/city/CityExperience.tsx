"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, type ReactNode } from "react";
import { ControlsGuide } from "@/components/hud/ControlsGuide";
import { GameHUD } from "@/components/hud/GameHUD";
import { IntroOverlay } from "@/components/hud/IntroOverlay";
import { LocationPanel } from "@/components/hud/LocationPanel";
import { MiniMap } from "@/components/hud/MiniMap";
import { MobileControls } from "@/components/hud/MobileControls";
import { NavigationMenu } from "@/components/hud/NavigationMenu";
import { SettingsPanel } from "@/components/hud/SettingsPanel";
import { FallbackMap } from "@/components/city/FallbackMap";
import { useGame } from "@/context/GameContext";

const CityScene = dynamic(
  () => import("@/components/city/CityScene").then((module) => module.CityScene),
  { ssr: false },
);

export function CityExperience() {
  const { useMap, graphics, mode } = useGame();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#070b14] text-white">
      <div className="city-sky absolute inset-0" />
      <div className="absolute inset-0" id="content">
        {useMap ? (
          <FallbackMap />
        ) : (
          <SceneBoundary fallback={<FallbackMap />}>
            <CityScene key={graphics} />
          </SceneBoundary>
        )}
      </div>
      <GameHUD />
      <ControlsGuide />
      <MiniMap />
      <MobileControls />
      {mode === "intro" ? <IntroOverlay /> : null}
      <LocationPanel />
      <NavigationMenu />
      <SettingsPanel />
    </div>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
