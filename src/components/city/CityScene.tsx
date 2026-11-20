"use client";

import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import { Buildings } from "@/components/city/Building";
import { ContactLounge } from "@/components/city/ContactLounge";
import { CameraController, CameraRigDirector } from "@/components/city/CameraController";
import { Character, GroundNavigator, WalkMarker } from "@/components/city/Character";
import { CityEnvironment } from "@/components/city/CityEnvironment";
import { Vehicles } from "@/components/city/Vehicles";
import { InteractionManager } from "@/components/city/InteractionManager";
import { useGame } from "@/context/GameContext";

export function CityScene() {
  const { graphics, reducedMotion, setSceneReady, interior } = useGame();
  const high = graphics === "high" && !reducedMotion;

  return (
    <div className={`h-full w-full transition-opacity duration-700 ${reducedMotion ? "" : ""}`}>
      <Canvas
        shadows={high}
        dpr={high ? [1, 1.55] : [1, 1.15]}
        camera={{ position: [32, 24, 32], fov: 40, near: 0.1, far: 240 }}
        gl={{
          antialias: high,
          powerPreference: "high-performance",
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#070b14");
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          setSceneReady(true);
        }}
      >
        <color attach="background" args={["#070b14"]} />
        <fog attach="fog" args={["#10182a", 34, 98]} />
        <CityEnvironment />
        <GroundNavigator />
        <Buildings />
        {interior === "contact" ? <ContactLounge /> : null}
        <Vehicles />
        <WalkMarker />
        <Character />
        <InteractionManager />
        <CameraRigDirector />
        <CameraController />
      </Canvas>
    </div>
  );
}
