"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshBasicMaterial } from "three";
import { getLocation } from "@/data/locations";
import { useGame } from "@/context/GameContext";

export function InteractionManager() {
  const { nearestId } = useGame();
  const material = useRef<MeshBasicMaterial>(null);
  const location = nearestId ? getLocation(nearestId) : undefined;

  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.opacity = 0.35 + Math.sin(clock.elapsedTime * 3) * 0.22;
  });

  if (!location) return null;

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[location.entrance[0], 0.08, location.entrance[1]]}
    >
      <ringGeometry args={[0.75, 1.02, 40]} />
      <meshBasicMaterial ref={material} color={location.accent} transparent opacity={0.7} />
    </mesh>
  );
}
