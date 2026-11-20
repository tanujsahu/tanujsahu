"use client";

import { forwardRef, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Quaternion, Vector3, type Group } from "three";
import { pointerIntent } from "@/components/city/cameraRig";
import { vehicles, type VehicleId } from "@/data/vehicles";
import { useGame } from "@/context/GameContext";

const up = new Vector3(0, 1, 0);

export function Vehicles() {
  return (
    <group>
      <Bike />
      <Car />
    </group>
  );
}

function Bike() {
  const { toggleRide, vehicleFinish } = useGame();
  const paint = vehicleFinish === "dark" ? darkPaint : lightPaint;
  const group = useRef<Group>(null);
  const front = useRef<Group>(null);
  const rear = useRef<Group>(null);
  const previous = useRef({ x: vehicles.bike.x, z: vehicles.bike.z });
  const spin = useRef(0);

  useFrame(() => {
    const vehicle = vehicles.bike;
    if (!group.current) return;
    group.current.position.set(vehicle.x, 0, vehicle.z);
    group.current.rotation.y = vehicle.yaw;
    const moved = Math.hypot(vehicle.x - previous.current.x, vehicle.z - previous.current.z);
    previous.current.x = vehicle.x;
    previous.current.z = vehicle.z;
    spin.current += moved / 0.34;
    if (front.current) front.current.rotation.y = spin.current;
    if (rear.current) rear.current.rotation.y = spin.current;
  });

  return (
    <group
      ref={group}
      userData={{ ignoreOcclude: true }}
      onClick={(event) => chooseVehicle(event, "bike", toggleRide)}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.85, 1.02, 28]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.28} />
      </mesh>
      <SpokeWheel ref={rear} position={[0, 0.36, -0.5]} radius={0.36} />
      <SpokeWheel ref={front} position={[0, 0.36, 0.58]} radius={0.36} />
      <Fender position={[0, 0.36, -0.5]} color={paint.frame} />
      <Fender position={[0, 0.36, 0.58]} color={paint.frame} />
      <Tube from={[0, 0.36, -0.5]} to={[0, 0.38, -0.02]} radius={0.03} color={paint.trim} />
      <Tube from={[0, 0.38, -0.02]} to={[0, 0.98, -0.16]} radius={0.034} color={paint.frame} />
      <Tube from={[0, 0.38, -0.02]} to={[0, 0.86, 0.46]} radius={0.034} color={paint.frame} />
      <Tube from={[0, 0.98, -0.16]} to={[0, 0.86, 0.46]} radius={0.028} color={paint.accent} />
      <Tube from={[0, 0.98, -0.16]} to={[0, 0.36, -0.5]} radius={0.026} color={paint.trim} />
      <Tube from={[0, 0.86, 0.46]} to={[0, 0.36, 0.58]} radius={0.03} color={paint.trim} />
      <mesh position={[0, 0.4, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.012, 6, 18]} />
        <meshStandardMaterial color={paint.trim} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.04, -0.18]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.16, 0.06, 0.34]} />
        <meshStandardMaterial color={paint.saddle} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.92, 0.52]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.52, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.24, 0.92, 0.52]}>
        <boxGeometry args={[0.1, 0.04, 0.12]} />
        <meshStandardMaterial color={paint.grip} roughness={0.8} />
      </mesh>
      <mesh position={[0.24, 0.92, 0.52]}>
        <boxGeometry args={[0.1, 0.04, 0.12]} />
        <meshStandardMaterial color={paint.grip} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.4, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.18, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[-0.14, 0.36, 0.04]}>
        <boxGeometry args={[0.14, 0.028, 0.07]} />
        <meshStandardMaterial color={paint.trim} />
      </mesh>
      <mesh position={[0.14, 0.36, -0.08]}>
        <boxGeometry args={[0.14, 0.028, 0.07]} />
        <meshStandardMaterial color={paint.trim} />
      </mesh>
      <mesh position={[0, 0.5, 0.68]}>
        <boxGeometry args={[0.1, 0.07, 0.06]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#fef9c3"
          emissiveIntensity={paint.lamp}
        />
      </mesh>
    </group>
  );
}

function Car() {
  const { toggleRide, vehicleFinish } = useGame();
  const paint = vehicleFinish === "dark" ? darkPaint : lightPaint;
  const group = useRef<Group>(null);
  const wheels = useRef<Array<Group | null>>([]);
  const previous = useRef({ x: vehicles.car.x, z: vehicles.car.z });
  const spin = useRef(0);

  useFrame(() => {
    const vehicle = vehicles.car;
    if (!group.current) return;
    group.current.position.set(vehicle.x, 0, vehicle.z);
    group.current.rotation.y = vehicle.yaw;
    const moved = Math.hypot(vehicle.x - previous.current.x, vehicle.z - previous.current.z);
    previous.current.x = vehicle.x;
    previous.current.z = vehicle.z;
    spin.current += moved / 0.34;
    for (const wheel of wheels.current) {
      if (wheel) wheel.rotation.y = spin.current;
    }
  });

  const corners: Array<[number, number, number]> = [
    [-0.72, 0.34, 0.98],
    [0.72, 0.34, 0.98],
    [-0.72, 0.34, -0.98],
    [0.72, 0.34, -0.98],
  ];

  return (
    <group
      ref={group}
      userData={{ ignoreOcclude: true }}
      onClick={(event) => chooseVehicle(event, "car", toggleRide)}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[1.7, 1.92, 36]} />
        <meshBasicMaterial color="#fdba74" transparent opacity={0.22} />
      </mesh>
      <mesh position={[0, 0.42, 0.15]} castShadow>
        <boxGeometry args={[1.52, 0.42, 3.15]} />
        <meshStandardMaterial color={paint.car} metalness={0.78} roughness={paint.dark ? 0.32 : 0.18} />
      </mesh>
      <mesh position={[0, 0.58, 1.05]} rotation={[-0.18, 0, 0]} castShadow>
        <boxGeometry args={[1.46, 0.16, 1.15]} />
        <meshStandardMaterial color={paint.carDeep} metalness={0.75} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.56, -1.22]} rotation={[0.16, 0, 0]} castShadow>
        <boxGeometry args={[1.46, 0.18, 0.85]} />
        <meshStandardMaterial color={paint.carDeep} metalness={0.72} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.62, 0.1]}>
        <boxGeometry args={[1.54, 0.04, 2.7]} />
        <meshStandardMaterial color={paint.trim} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.22, -0.12]} castShadow>
        <boxGeometry args={[1.32, 0.07, 1.35]} />
        <meshStandardMaterial color={paint.roof} metalness={0.65} roughness={0.3} />
      </mesh>
      <Pillar position={[-0.64, 0.92, 0.48]} color={paint.trim} />
      <Pillar position={[0.64, 0.92, 0.48]} color={paint.trim} />
      <Pillar position={[-0.64, 0.92, -0.72]} color={paint.trim} />
      <Pillar position={[0.64, 0.92, -0.72]} color={paint.trim} />
      <mesh position={[-0.76, 0.72, 0.15]}>
        <boxGeometry args={[0.02, 0.55, 0.02]} />
        <meshStandardMaterial color={paint.trim} />
      </mesh>
      <mesh position={[0.76, 0.72, 0.15]}>
        <boxGeometry args={[0.02, 0.55, 0.02]} />
        <meshStandardMaterial color={paint.trim} />
      </mesh>
      <mesh position={[-0.32, 0.58, -0.2]}>
        <boxGeometry args={[0.36, 0.16, 0.4]} />
        <meshStandardMaterial color={paint.saddle} roughness={0.75} />
      </mesh>
      <mesh position={[0.32, 0.58, -0.2]}>
        <boxGeometry args={[0.36, 0.16, 0.4]} />
        <meshStandardMaterial color={paint.saddle} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.86, 0.62]} rotation={[-0.42, 0, 0]}>
        <boxGeometry args={[1.22, 0.46, 0.04]} />
        <meshStandardMaterial color={paint.glass} transparent opacity={0.4} roughness={0.05} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.86, -0.82]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[1.18, 0.4, 0.04]} />
        <meshStandardMaterial color={paint.glass} transparent opacity={0.34} roughness={0.05} />
      </mesh>
      <mesh position={[-0.74, 0.84, -0.12]}>
        <boxGeometry args={[0.04, 0.36, 1.05]} />
        <meshStandardMaterial color={paint.glass} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.74, 0.84, -0.12]}>
        <boxGeometry args={[0.04, 0.36, 1.05]} />
        <meshStandardMaterial color={paint.glass} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 1.62]}>
        <boxGeometry args={[1.48, 0.16, 0.12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.48, 1.52]}>
        <boxGeometry args={[0.72, 0.16, 0.04]} />
        <meshStandardMaterial color="#1e293b" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[-0.42, 0.48, 1.58]}>
        <boxGeometry args={[0.28, 0.1, 0.06]} />
        <meshStandardMaterial color="#f8fafc" emissive="#fef9c3" emissiveIntensity={paint.lamp} />
      </mesh>
      <mesh position={[0.42, 0.48, 1.58]}>
        <boxGeometry args={[0.28, 0.1, 0.06]} />
        <meshStandardMaterial color="#f8fafc" emissive="#fef9c3" emissiveIntensity={paint.lamp} />
      </mesh>
      <mesh position={[0, 0.4, -1.6]}>
        <boxGeometry args={[1.48, 0.16, 0.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.55} />
      </mesh>
      <mesh position={[-0.48, 0.52, -1.58]}>
        <boxGeometry args={[0.32, 0.1, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={paint.dark ? 0.85 : 0.25} />
      </mesh>
      <mesh position={[0.48, 0.52, -1.58]}>
        <boxGeometry args={[0.32, 0.1, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={paint.dark ? 0.85 : 0.25} />
      </mesh>
      <mesh position={[-0.82, 0.78, 0.35]}>
        <boxGeometry args={[0.1, 0.12, 0.18]} />
        <meshStandardMaterial color={paint.carDeep} metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[0.82, 0.78, 0.35]}>
        <boxGeometry args={[0.1, 0.12, 0.18]} />
        <meshStandardMaterial color={paint.carDeep} metalness={0.55} roughness={0.3} />
      </mesh>
      {paint.dark ? (
        <pointLight position={[0, 0.55, 1.75]} intensity={0.7} distance={7} color="#fef3c7" />
      ) : null}
      {corners.map((position, index) => (
        <SpokeWheel
          key={position.join(":")}
          ref={(node) => {
            wheels.current[index] = node;
          }}
          position={position}
          radius={0.34}
          tire={0.09}
        />
      ))}
    </group>
  );
}

function Pillar({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.06, 0.64, 0.06]} />
      <meshStandardMaterial color={color} metalness={0.45} roughness={0.38} />
    </mesh>
  );
}

function Fender({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={[position[0], position[1] + 0.08, position[2]]} rotation={[0, Math.PI / 2, 0]}>
      <torusGeometry args={[0.4, 0.028, 6, 12, Math.PI]} />
      <meshStandardMaterial color={color} metalness={0.45} roughness={0.4} />
    </mesh>
  );
}

const SpokeWheel = forwardRef<Group, { position: [number, number, number]; radius: number; tire?: number }>(
  function SpokeWheel({ position, radius, tire = 0.055 }, ref) {
    return (
      <group position={position} rotation={[0, 0, Math.PI / 2]}>
        <group ref={ref}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, tire, 10, 24]} />
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[radius * 0.58, radius * 0.58, tire * 0.7, 18]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.18} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((spoke) => (
            <mesh key={spoke} rotation={[0, (Math.PI / 3) * spoke, 0]}>
              <boxGeometry args={[0.012, tire * 0.45, radius * 1.05]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
            </mesh>
          ))}
          <mesh>
            <cylinderGeometry args={[0.055, 0.055, tire * 1.15, 10]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>
    );
  },
);

const darkPaint = {
  dark: true,
  frame: "#18181b",
  accent: "#115e59",
  trim: "#3f3f46",
  saddle: "#1c1917",
  grip: "#09090b",
  car: "#18181b",
  carDeep: "#09090b",
  roof: "#27272a",
  glass: "#0f172a",
  lamp: 1.35,
};

const lightPaint = {
  dark: false,
  frame: "#f4f4f5",
  accent: "#0f766e",
  trim: "#71717a",
  saddle: "#44403c",
  grip: "#292524",
  car: "#f8fafc",
  carDeep: "#e4e4e7",
  roof: "#d4d4d8",
  glass: "#e0f2fe",
  lamp: 0.2,
};

function Tube({
  from,
  to,
  radius,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius: number;
  color: string;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);
    const direction = end.clone().sub(start);
    const span = direction.length();
    return {
      position: start.add(end).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(up, direction.normalize()),
      length: span,
    };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 7]} />
      <meshStandardMaterial color={color} metalness={0.45} roughness={0.38} />
    </mesh>
  );
}

function chooseVehicle(
  event: ThreeEvent<MouseEvent>,
  id: VehicleId,
  toggleRide: (id?: VehicleId) => void,
) {
  event.stopPropagation();
  if (pointerIntent.dragging) return;
  toggleRide(id);
}
