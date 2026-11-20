"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackSide, BufferAttribute, BufferGeometry, GLSL3, ShaderMaterial, type Points } from "three";
import { lamps, lawns, park, roads, trees } from "@/data/scenery";
import { useGame } from "@/context/GameContext";

export function CityEnvironment() {
  const { graphics, reducedMotion } = useGame();
  const high = graphics === "high";
  const sky = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        glslVersion: GLSL3,
        vertexShader: `
          out vec3 vPosition;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vPosition = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          in vec3 vPosition;
          out vec4 fragColor;
          void main() {
            float height = normalize(vPosition).y;
            vec3 top = vec3(0.02, 0.035, 0.09);
            vec3 middle = vec3(0.08, 0.11, 0.22);
            vec3 horizon = vec3(0.42, 0.26, 0.18);
            vec3 color = mix(horizon, middle, smoothstep(0.0, 0.32, height));
            color = mix(color, top, smoothstep(0.18, 0.85, height));
            fragColor = vec4(color, 1.0);
          }
        `,
      }),
    [],
  );

  return (
    <group>
      <mesh frustumCulled={false}>
        <sphereGeometry args={[140, 32, 24]} />
        <primitive object={sky} attach="material" />
      </mesh>
      <hemisphereLight args={["#9eb0ff", "#3a2a1c", 0.62]} />
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[22, 28, 12]}
        intensity={1.45}
        color="#ffd8b4"
        castShadow={high}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={90}
        shadow-camera-left={-46}
        shadow-camera-right={46}
        shadow-camera-top={46}
        shadow-camera-bottom={-46}
      />
      <directionalLight position={[-18, 14, -12]} intensity={0.48} color="#7dd3fc" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, -0.02, -4]} receiveShadow>
        <circleGeometry args={[78, 72]} />
        <meshStandardMaterial color="#101722" roughness={0.96} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2.2]} receiveShadow>
        <circleGeometry args={[8.2, 40]} />
        <meshStandardMaterial color="#1b2636" roughness={0.8} />
      </mesh>
      {roads.map((road) => (
        <Road key={`${road.position.join(":")}:${road.axis}`} road={road} />
      ))}
      {lawns.map((lawn) => (
        <mesh
          key={lawn.position.join(":")}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[lawn.position[0], 0.025, lawn.position[2]]}
          receiveShadow
        >
          <planeGeometry args={lawn.size} />
          <meshStandardMaterial color="#163128" roughness={1} />
        </mesh>
      ))}
      <RoadsidePark />
      {trees.map((tree) => (
        <Tree key={tree.position.join(":")} position={tree.position} variant={tree.variant ?? 0} high={high} />
      ))}
      {lamps.map((lamp, index) => (
        <Lamp key={lamp.position.join(":")} position={lamp.position} glow={high && index < 4 && !reducedMotion} />
      ))}
      {reducedMotion ? null : <Particles count={high ? 160 : 70} />}
    </group>
  );
}

function RoadsidePark() {
  const [x, y, z] = park.position;
  const [width, depth] = park.size;

  return (
    <group position={[x, y, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[width + 0.8, depth + 0.8]} />
        <meshStandardMaterial color="#3f3f46" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#15803d" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0.012, -1.4]} receiveShadow>
        <circleGeometry args={[2.1, 24]} />
        <meshStandardMaterial color="#22c55e" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.7, 0.012, 2.2]} receiveShadow>
        <circleGeometry args={[1.7, 24]} />
        <meshStandardMaterial color="#16a34a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[1.15, depth - 1.4]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.72, 0.025, 0]}>
        <planeGeometry args={[0.08, depth - 1.6]} />
        <meshStandardMaterial color="#57534e" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.72, 0.025, 0]}>
        <planeGeometry args={[0.08, depth - 1.6]} />
        <meshStandardMaterial color="#57534e" />
      </mesh>
      <Hedge position={[0, 0.28, depth / 2 - 0.35]} size={[width - 0.6, 0.55, 0.35]} />
      <Hedge position={[width / 2 - 0.28, 0.28, 0]} size={[0.35, 0.55, depth - 0.8]} />
      <Hedge position={[-width / 2 + 0.28, 0.28, -2.2]} size={[0.35, 0.55, depth * 0.45]} />
      <FlowerBed position={[-2.3, 0, -3.4]} colors={["#fb7185", "#fde68a", "#ffffff", "#f9a8d4"]} />
      <FlowerBed position={[2.15, 0, 3.6]} colors={["#fde68a", "#fb7185", "#ffffff", "#c4b5fd"]} />
      <FlowerBed position={[2.2, 0, -2.6]} colors={["#ffffff", "#fb7185", "#fde68a", "#86efac"]} />
      <Shrub position={[-2.8, 0, 1.6]} />
      <Shrub position={[2.6, 0, -0.4]} scale={0.8} />
      <Bench position={[-1.7, 0, 2.4]} />
      <Bench position={[1.7, 0, -1.6]} rotation={Math.PI / 2} />
      <mesh position={[2.4, 0.38, 4.4]}>
        <cylinderGeometry args={[0.18, 0.22, 0.7, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      <mesh position={[2.4, 0.74, 4.4]}>
        <cylinderGeometry args={[0.24, 0.2, 0.08, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <group position={[-width / 2 + 0.2, 0, -0.2]}>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.08, 1.7, 0.08]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
        <mesh position={[0, 1.7, 0]}>
          <boxGeometry args={[0.7, 0.08, 0.08]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
        <mesh position={[0.42, 1.42, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.62, 0.42]} />
          <meshStandardMaterial color="#14532d" />
        </mesh>
        <mesh position={[0.45, 1.42, 0.01]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.5, 0.08]} />
          <meshBasicMaterial color="#ecfccb" />
        </mesh>
      </group>
    </group>
  );
}

function Hedge({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#166534" roughness={0.9} />
    </mesh>
  );
}

function FlowerBed({
  position,
  colors,
}: {
  position: [number, number, number];
  colors: string[];
}) {
  const blooms: Array<[number, number, number]> = [
    [-0.28, 0.12, -0.12],
    [0.05, 0.16, 0.08],
    [0.26, 0.11, -0.16],
    [-0.08, 0.1, 0.24],
    [0.22, 0.14, 0.2],
  ];
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.55, 16]} />
        <meshStandardMaterial color="#3f2e22" roughness={1} />
      </mesh>
      {blooms.map((bloom, index) => (
        <mesh key={bloom.join(":")} position={bloom}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color={colors[index % colors.length]} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Shrub({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 10]} />
        <meshStandardMaterial color="#15803d" roughness={0.85} />
      </mesh>
      <mesh position={[0.16, 0.38, 0.08]}>
        <sphereGeometry args={[0.18, 10, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Bench({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  const slats = [-0.42, -0.14, 0.14, 0.42];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.28, 0]}>
          <boxGeometry args={[0.06, 0.56, 0.42]} />
          <meshStandardMaterial color="#334155" metalness={0.45} roughness={0.4} />
        </mesh>
      ))}
      {slats.map((z) => (
        <mesh key={z} position={[0, 0.52, z]}>
          <boxGeometry args={[1.25, 0.045, 0.12]} />
          <meshStandardMaterial color="#a16207" roughness={0.72} />
        </mesh>
      ))}
      <mesh position={[0, 0.78, -0.2]}>
        <boxGeometry args={[1.25, 0.32, 0.045]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Road({
  road,
}: {
  road: { position: [number, number, number]; length: number; width: number; axis: "x" | "z" };
}) {
  const spanX = road.axis === "x" ? road.length : road.width;
  const spanZ = road.axis === "z" ? road.length : road.width;
  return (
    <group position={road.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[spanX + 1.6, spanZ + 1.6]} />
        <meshStandardMaterial color="#171f2c" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <planeGeometry args={[spanX, spanZ]} />
        <meshStandardMaterial color="#2a384c" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry
          args={[
            road.axis === "x" ? spanX * 0.94 : 0.07,
            road.axis === "z" ? spanZ * 0.94 : 0.07,
          ]}
        />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

function Tree({
  position,
  variant,
  high,
}: {
  position: [number, number, number];
  variant: number;
  high: boolean;
}) {
  const canopy = variant === 1 ? "#166534" : variant === 2 ? "#15803d" : "#14532d";
  const highlight = variant === 1 ? "#4ade80" : variant === 2 ? "#22c55e" : "#16a34a";
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]} castShadow={high}>
        <cylinderGeometry args={[0.07, 0.13, 1.35, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.92} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.4, 6]} />
        <meshStandardMaterial color="#6b4f3a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.72, 0]} castShadow={high}>
        <sphereGeometry args={[0.72, 14, 12]} />
        <meshStandardMaterial color={canopy} roughness={0.82} />
      </mesh>
      <mesh position={[0.28, 2.05, 0.12]} castShadow={high}>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshStandardMaterial color={highlight} roughness={0.78} />
      </mesh>
      <mesh position={[-0.26, 1.58, -0.1]}>
        <sphereGeometry args={[0.38, 12, 10]} />
        <meshStandardMaterial color={canopy} roughness={0.84} />
      </mesh>
    </group>
  );
}

function Lamp({
  position,
  glow,
}: {
  position: [number, number, number];
  glow: boolean;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.045, 0.07, 3, 8]} />
        <meshStandardMaterial color="#202838" metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 3.05, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffe1b5" emissive="#ffb15a" emissiveIntensity={1.5} />
      </mesh>
      {glow ? (
        <pointLight position={[0, 2.9, 0]} intensity={0.55} distance={8} color="#ffc98a" />
      ) : null}
    </group>
  );
}

function Particles({ count }: { count: number }) {
  const points = useRef<Points>(null);
  const geometry = useMemo(() => {
    const values = new Float32Array(count * 3);
    let seed = 42 + count;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (random() - 0.5) * 90;
      values[index * 3 + 1] = random() * 18 + 1;
      values[index * 3 + 2] = (random() - 0.5) * 80 - 4;
    }
    const next = new BufferGeometry();
    next.setAttribute("position", new BufferAttribute(values, 3));
    return next;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#b9d7ff"
        size={1.7}
        sizeAttenuation={false}
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}
