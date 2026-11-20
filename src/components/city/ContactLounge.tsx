"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { type Group, type Mesh } from "three";
import { pointerIntent } from "@/components/city/cameraRig";
import { drinkState } from "@/data/lounge";
import { useGame } from "@/context/GameContext";

const ignore = { ignoreOcclude: true };

export function ContactLounge() {
  const { serveDrink, walkTo } = useGame();
  const walkFloor = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (pointerIntent.dragging) return;
    walkTo(event.point.x, event.point.z);
  };
  const steam = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!steam.current) return;
    const brewing = drinkState.kind !== null && performance.now() < drinkState.until;
    steam.current.visible = brewing;
    steam.current.position.y = 1.55 + Math.sin(clock.elapsedTime * 3) * 0.06;
  });

  const choose = (kind: "coffee" | "tea") => (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (pointerIntent.dragging) return;
    serveDrink(kind);
  };

  return (
    <group position={[29, 0, -31]} userData={ignore}>
      <mesh position={[0, 0.05, 0]} receiveShadow userData={ignore} onClick={walkFloor}>
        <boxGeometry args={[10.7, 0.08, 8.2]} />
        <meshStandardMaterial color="#d6bfa2" roughness={0.82} />
      </mesh>
      <mesh position={[-0.6, 0.1, -1.55]} rotation={[-Math.PI / 2, 0, 0]} userData={ignore}>
        <planeGeometry args={[4.6, 3.1]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>
      <Wall position={[0, 1.25, -4.18]} size={[11, 2.5, 0.22]} />
      <Wall position={[-5.38, 1.25, 0]} size={[0.22, 2.5, 8.6]} />
      <Wall position={[5.38, 1.25, 0]} size={[0.22, 2.5, 8.6]} />
      <Wall position={[-3.3, 1.25, 4.18]} size={[4.4, 2.5, 0.22]} />
      <Wall position={[3.3, 1.25, 4.18]} size={[4.4, 2.5, 0.22]} />
      <Wall position={[0, 2.28, 4.18]} size={[2.2, 0.44, 0.22]} />
      <mesh position={[0, 0.08, 4.28]} rotation={[-Math.PI / 2, 0, 0]} userData={ignore}>
        <planeGeometry args={[2.05, 0.7]} />
        <meshStandardMaterial color="#fdba74" emissive="#9a3412" emissiveIntensity={0.35} />
      </mesh>
      <Sofa position={[-0.6, 0, -2.6]} />
      <Chair position={[-3.1, 0, -1.4]} rotation={0.5} />
      <Chair position={[1.6, 0, -1.5]} rotation={-0.45} />
      <Table position={[-0.6, 0, -1.35]} />
      <Counter />
      <group ref={steam} position={[4.15, 1.55, 0.25]} userData={ignore}>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#e2e8f0" transparent opacity={0.45} />
        </mesh>
        <mesh position={[0.05, 0.18, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#f8fafc" transparent opacity={0.3} />
        </mesh>
      </group>
      <Cup position={[3.55, 0.92, 0.42]} color="#6f4e37" onClick={choose("coffee")} />
      <Cup position={[3.82, 0.92, 0.08]} color="#e8b86d" onClick={choose("tea")} />
      <pointLight position={[-0.6, 2.2, -1.2]} intensity={1.4} distance={9} color="#fde68a" />
      <pointLight position={[4.1, 1.8, 0.2]} intensity={0.45} distance={4} color="#fdba74" />
    </group>
  );
}

function Wall({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh position={position} userData={ignore} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#f4efe6" roughness={0.78} />
    </mesh>
  );
}

function Sofa({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} userData={ignore}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[3.3, 0.36, 0.95]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.72, -0.36]} castShadow>
        <boxGeometry args={[3.3, 0.55, 0.18]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.62} />
      </mesh>
      <mesh position={[-1.52, 0.48, 0]}>
        <boxGeometry args={[0.18, 0.42, 0.95]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>
      <mesh position={[1.52, 0.48, 0]}>
        <boxGeometry args={[0.18, 0.42, 0.95]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>
      {[-1.05, 0, 1.05].map((x) => (
        <mesh key={x} position={[x, 0.54, 0.08]}>
          <boxGeometry args={[0.95, 0.16, 0.72]} />
          <meshStandardMaterial color="#f3e6d4" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[-1.15, 0.72, -0.12]}>
        <boxGeometry args={[0.42, 0.28, 0.16]} />
        <meshStandardMaterial color="#fdba74" roughness={0.7} />
      </mesh>
      <mesh position={[1.1, 0.72, -0.1]}>
        <boxGeometry args={[0.36, 0.24, 0.16]} />
        <meshStandardMaterial color="#67e8f9" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Chair({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]} userData={ignore}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.78, 0.32, 0.78]} />
        <meshStandardMaterial color="#9a3412" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.66, -0.28]}>
        <boxGeometry args={[0.78, 0.46, 0.12]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.52, 0.04]}>
        <boxGeometry args={[0.62, 0.1, 0.58]} />
        <meshStandardMaterial color="#f3e6d4" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Table({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} userData={ignore}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.75]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.45} />
      </mesh>
      {[
        [-0.55, -0.28],
        [0.55, -0.28],
        [-0.55, 0.28],
        [0.55, 0.28],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.2, z]}>
          <boxGeometry args={[0.06, 0.38, 0.06]} />
          <meshStandardMaterial color="#5c3a1e" />
        </mesh>
      ))}
      <mesh position={[0.28, 0.46, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 10]} />
        <meshStandardMaterial color="#57534e" roughness={0.7} />
      </mesh>
      <mesh position={[0.28, 0.58, 0]}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Counter() {
  return (
    <group position={[4.12, 0, 0.25]} userData={ignore}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[1.15, 0.82, 0.62]} />
        <meshStandardMaterial color="#e7e5e4" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.84, 0]}>
        <boxGeometry args={[1.18, 0.04, 0.66]} />
        <meshStandardMaterial color="#44403c" roughness={0.4} />
      </mesh>
      <mesh position={[0.05, 1.12, -0.02]} castShadow>
        <boxGeometry args={[0.42, 0.48, 0.34]} />
        <meshStandardMaterial color="#1f2937" metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0.05, 1.38, -0.02]}>
        <boxGeometry args={[0.36, 0.06, 0.28]} />
        <meshStandardMaterial color="#d6d3d1" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0.05, 1.18, 0.16]}>
        <boxGeometry args={[0.16, 0.08, 0.06]} />
        <meshStandardMaterial color="#9a3412" />
      </mesh>
      <mesh position={[-0.32, 1.02, 0.08]}>
        <boxGeometry args={[0.16, 0.28, 0.16]} />
        <meshStandardMaterial color="#67e8f9" transparent opacity={0.45} roughness={0.1} />
      </mesh>
    </group>
  );
}

function Cup({
  position,
  color,
  onClick,
}: {
  position: [number, number, number];
  color: string;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
}) {
  const cup = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!cup.current) return;
    cup.current.parent?.position.set(
      position[0],
      position[1] + Math.sin(clock.elapsedTime * 2.2 + position[0]) * 0.015,
      position[2],
    );
  });
  return (
    <group position={position} userData={ignore}>
      <mesh
        ref={cup}
        onClick={onClick}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <cylinderGeometry args={[0.16, 0.16, 0.22, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.055, 0.1, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}
