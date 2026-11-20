"use client";

import { ClassicPortfolio } from "@/components/classic/ClassicPortfolio";
import { CityExperience } from "@/components/city/CityExperience";
import { useGame } from "@/context/GameContext";

export function PortfolioShell() {
  const { mode } = useGame();
  if (mode === "classic") return <ClassicPortfolio />;
  return <CityExperience />;
}
