"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { MeshStandardMaterial, type Group, type Mesh } from "three";
import { locations, type CityLocation, type Facing } from "@/data/locations";
import { getLocation } from "@/data/locations";
import { INTERACT_RADIUS, distanceToEntrance } from "@/lib/movement";
import { useGame } from "@/context/GameContext";
import { pointerIntent } from "@/components/city/cameraRig";
import { getFacadeTexture, getLabelTexture } from "@/components/city/textures";

export function Buildings() {
  const { graphics } = useGame();
  const high = graphics === "high";

  return (
    <group>
      {locations.map((location) => (
        <Building key={location.id} location={location} high={high} />
      ))}
    </group>
  );
}

function Building({ location, high }: { location: CityLocation; high: boolean }) {
  const { playerRef, presentLocation, setHint, nearestId, interior } = useGame();
  const beacon = useRef<Mesh>(null);
  const labelGroup = useRef<Group>(null);
  const marker = useRef<Mesh>(null);
  const lights = useMemo(() => lightColors(location), [location]);
  const label = useMemo(
    () => getLabelTexture(location.shortName, location.district, location.accent),
    [location.accent, location.district, location.shortName],
  );
  const facade = useMemo(
    () =>
      getFacadeTexture(
        location.id,
        location.kind === "tower" ? 14 : 8,
        location.kind === "project" ? 3 : 5,
        location.name.length * 3.1,
        lights,
      ),
    [lights, location],
  );
  const wall = useMemo(
    () =>
      new MeshStandardMaterial({
        map: facade,
        color: "#d5e2f5",
        roughness: 0.62,
        metalness: 0.22,
      }),
    [facade],
  );
  const trim = useMemo(
    () =>
      new MeshStandardMaterial({
        color: location.accent,
        emissive: location.emissive,
        emissiveIntensity: location.kind === "project" || location.kind === "campus" ? 1.15 : 0.55,
        roughness: 0.4,
        metalness: 0.3,
      }),
    [location.accent, location.emissive, location.kind],
  );
  useEffect(() => {
    return () => {
      wall.dispose();
      trim.dispose();
    };
  }, [trim, wall]);

  const [x, , z] = location.position;
  const [width, height, depth] = location.size;
  const spotlight = location.kind === "project" || location.kind === "campus";
  const badgeWidth = labelWidth(location.shortName);
  const badgeHeight = badgeWidth * (360 / 1024);

  useFrame(({ clock }) => {
    if (!beacon.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.2 + location.position[0]) * 0.12;
    const emphasis = nearestId === location.id ? 1.35 : 1;
    beacon.current.scale.setScalar(pulse * emphasis);
    const bob = Math.sin(clock.elapsedTime * 1.35 + location.position[0]) * 0.16;
    if (labelGroup.current) {
      labelGroup.current.position.y = height + (spotlight ? 2.15 : 1.7) + bob;
    }
    if (marker.current) marker.current.rotation.z = clock.elapsedTime * 0.9;
  });

  const events = {
    onClick: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      if (pointerIntent.dragging) return;
      const current = getLocation(location.id);
      if (!current || !playerRef.current) return;
      const distance = distanceToEntrance(
        playerRef.current.x,
        playerRef.current.z,
        current,
      );
      if (distance <= INTERACT_RADIUS + 0.6) presentLocation(location.id);
      else setHint(`Move closer to ${location.shortName}, or open it from the city guide.`);
    },
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "";
    },
  };

  if (location.id === "contact" && interior === "contact") return null;

  return (
    <group position={[x, 0, z]} userData={{ occluder: true }}>
      {location.kind === "tower" ? (
        <Tower width={width} height={height} depth={depth} wall={wall} trim={trim} events={events} high={high} />
      ) : location.kind === "headquarters" ? (
        <Headquarters width={width} height={height} depth={depth} wall={wall} trim={trim} events={events} high={high} />
      ) : (
        <Block
          position={[0, height / 2, 0]}
          size={[width, height, depth]}
          material={wall}
          high={high}
          events={events}
        />
      )}
      <mesh position={[0, height + 0.08, 0]} material={trim}>
        <boxGeometry args={[width * 0.72, 0.16, depth * 0.72]} />
      </mesh>
      {spotlight ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} userData={{ ignoreOcclude: true }}>
          <ringGeometry args={[Math.max(width, depth) * 0.62, Math.max(width, depth) * 0.78, 48]} />
          <meshBasicMaterial color={location.accent} transparent opacity={0.7} />
        </mesh>
      ) : null}
      <mesh ref={beacon} position={[0, height + (spotlight ? 0.7 : 0.45), 0]} userData={{ ignoreOcclude: true }}>
        <sphereGeometry args={[spotlight ? 0.24 : 0.14, 18, 18]} />
        <meshStandardMaterial
          color={location.accent}
          emissive={location.accent}
          emissiveIntensity={spotlight ? 2.6 : 1.8}
        />
      </mesh>
      <Door location={location} />
      {location.kind === "education" ? <Columns width={width} depth={depth} /> : null}
      {location.kind === "lab" ? <Frame width={width} height={height} depth={depth} trim={trim} /> : null}
      <group ref={labelGroup} position={[0, height + (spotlight ? 2.15 : 1.7), 0]} userData={{ ignoreOcclude: true }}>
        <Billboard>
          <mesh>
            <planeGeometry args={[badgeWidth, badgeHeight]} />
            <meshBasicMaterial map={label} transparent depthWrite={false} />
          </mesh>
          <mesh ref={marker} position={[0, -badgeHeight * 0.58, 0]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshBasicMaterial color={location.accent} />
          </mesh>
        </Billboard>
      </group>
    </group>
  );
}

function Headquarters({
  width,
  height,
  depth,
  wall,
  trim,
  events,
  high,
}: MassProps) {
  return (
    <group>
      <Block position={[0, height * 0.14, 0]} size={[width, height * 0.28, depth]} material={wall} high={high} events={events} />
      <Block
        position={[0, height * 0.64, 0]}
        size={[width * 0.78, height * 0.72, depth * 0.74]}
        material={wall}
        high={high}
        events={events}
      />
      <mesh position={[0, height * 0.28, 0]} material={trim}>
        <boxGeometry args={[width * 0.82, 0.12, depth * 0.78]} />
      </mesh>
    </group>
  );
}

function Tower({
  width,
  height,
  depth,
  wall,
  trim,
  events,
  high,
}: MassProps) {
  const bands = [0.42, 0.74];
  return (
    <group>
      <Block position={[0, height * 0.21, 0]} size={[width, height * 0.42, depth]} material={wall} high={high} events={events} />
      <Block position={[0, height * 0.58, 0]} size={[width * 0.8, height * 0.32, depth * 0.8]} material={wall} high={high} events={events} />
      <Block position={[0, height * 0.87, 0]} size={[width * 0.58, height * 0.26, depth * 0.58]} material={wall} high={high} events={events} />
      {bands.map((band) => (
        <mesh key={band} position={[0, height * band, 0]} material={trim}>
          <boxGeometry args={[width * 0.86, 0.12, depth * 0.86]} />
        </mesh>
      ))}
    </group>
  );
}

interface MassProps {
  width: number;
  height: number;
  depth: number;
  wall: MeshStandardMaterial;
  trim: MeshStandardMaterial;
  high: boolean;
  events: PointerBindings;
}

interface PointerBindings {
  onClick: (event: ThreeEvent<MouseEvent>) => void;
  onPointerOver: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut: () => void;
}

function Block({
  position,
  size,
  material,
  high,
  events,
}: {
  position: [number, number, number];
  size: [number, number, number];
  material: MeshStandardMaterial;
  high: boolean;
  events: PointerBindings;
}) {
  return (
    <mesh position={position} castShadow={high} receiveShadow material={material} {...events}>
      <boxGeometry args={size} />
    </mesh>
  );
}

function Door({ location }: { location: CityLocation }) {
  return (
    <mesh position={doorPosition(location.facing, location.size, 0.08)}>
      <boxGeometry args={doorSize(location.facing, 1.25, 1.9, 0.12)} />
      <meshStandardMaterial
        color="#071018"
        emissive={location.accent}
        emissiveIntensity={0.45}
        roughness={0.35}
      />
    </mesh>
  );
}

function Columns({ width, depth }: { width: number; depth: number }) {
  return (
    <group>
      {[-0.32, -0.12, 0.12, 0.32].map((offset) => (
        <mesh key={offset} position={[width * offset, 1.3, depth / 2 + 0.2]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 2.6, 8]} />
          <meshStandardMaterial color="#d6d3d1" roughness={0.45} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Frame({
  width,
  height,
  depth,
  trim,
}: {
  width: number;
  height: number;
  depth: number;
  trim: MeshStandardMaterial;
}) {
  const corners: Array<[number, number]> = [
    [-width / 2, -depth / 2],
    [width / 2, -depth / 2],
    [-width / 2, depth / 2],
    [width / 2, depth / 2],
  ];
  return (
    <group>
      {corners.map(([cornerX, cornerZ]) => (
        <mesh key={`${cornerX}-${cornerZ}`} position={[cornerX, height / 2, cornerZ]} material={trim}>
          <boxGeometry args={[0.18, height, 0.18]} />
        </mesh>
      ))}
    </group>
  );
}

function doorPosition(
  facing: Facing,
  size: [number, number, number],
  inset: number,
): [number, number, number] {
  const [width, , depth] = size;
  if (facing === "south") return [0, 0.95, depth / 2 + inset];
  if (facing === "north") return [0, 0.95, -depth / 2 - inset];
  if (facing === "east") return [width / 2 + inset, 0.95, 0];
  return [-width / 2 - inset, 0.95, 0];
}

function doorSize(facing: Facing, width: number, height: number, depth: number): [number, number, number] {
  if (facing === "east" || facing === "west") return [depth, height, width];
  return [width, height, depth];
}

function labelWidth(label: string) {
  return Math.min(8.4, Math.max(4.6, label.length * 0.38 + 2));
}

function lightColors(location: CityLocation) {
  if (location.kind === "contact") return ["#fdba74", "#fed7aa", "#67e8f9", "#1e293b"];
  if (location.kind === "education") return ["#fcd34d", "#bfdbfe", "#e2e8f0"];
  if (location.kind === "tower") return ["#c4b5fd", "#67e8f9", "#f8fafc", "#312e81"];
  return [location.accent, "#bae6fd", "#e2e8f0", "#fef3c7"];
}
