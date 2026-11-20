"use client";

import { forwardRef, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, MathUtils, type Group, type Mesh } from "three";
import { pointerIntent } from "@/components/city/cameraRig";
import { rideState } from "@/data/vehicles";
import { useGame } from "@/context/GameContext";

const TRAIL = 7;

export function Character() {
  const { playerRef, activeId, freeRoam } = useGame();
  const group = useRef<Group>(null);
  const pivot = useRef<Group>(null);
  const body = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const cape = useRef<Group>(null);
  const scarf = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const haloInner = useRef<Mesh>(null);
  const trail = useRef<Array<Mesh | null>>([]);
  const history = useRef(Array.from({ length: TRAIL }, () => ({ x: 0, z: 0, ready: false })));
  const bowUntil = useRef(0);
  const previousPanel = useRef<string | null>(null);

  useEffect(() => {
    if (activeId && activeId !== previousPanel.current) {
      bowUntil.current = performance.now() + 700;
    }
    previousPanel.current = activeId;
  }, [activeId]);

  useFrame((state, delta) => {
    const player = playerRef.current;
    if (!player || !group.current || !pivot.current || !body.current) return;

    group.current.position.x = player.x;
    group.current.position.z = player.z;
    const riding = rideState.mode;
    const seated = riding !== "walk";
    if (riding === "car") {
      group.current.position.x += Math.cos(player.yaw) * 0.28;
      group.current.position.z -= Math.sin(player.yaw) * 0.28;
    }
    const lift = player.traveling ? 3.6 : riding === "car" ? 0.28 : riding === "bike" ? 0.5 : freeRoam ? 0.18 : 0;
    group.current.position.y = MathUtils.damp(group.current.position.y, lift, 4.5, delta);
    pivot.current.rotation.y = dampAngle(pivot.current.rotation.y, player.yaw, 10, delta);

    const time = state.clock.elapsedTime;
    const stride = player.walking ? 9.4 : 1.6;
    const swing = seated ? 0 : player.walking ? Math.sin(time * stride) * 0.72 : 0;
    const bob = seated
      ? Math.sin(time * (player.walking ? 14 : 2)) * (riding === "bike" ? 0.025 : 0.012)
      : player.walking
        ? Math.abs(Math.sin(time * stride)) * 0.07
        : Math.sin(time * 1.6) * 0.03;
    body.current.position.y = bob - (riding === "car" ? 0.55 : riding === "bike" ? 0.12 : 0);
    const bow = seated ? 0.18 : performance.now() < bowUntil.current ? 0.28 : player.walking ? 0.14 : 0;
    body.current.rotation.x = MathUtils.damp(body.current.rotation.x, bow, 6, delta);
    body.current.rotation.z = seated ? 0 : Math.sin(time * stride) * (player.walking ? 0.07 : 0.02);
    const leg = seated ? 1.2 : swing;
    if (leftLeg.current) leftLeg.current.rotation.x = leg;
    if (rightLeg.current) rightLeg.current.rotation.x = seated ? 1.2 : -swing;
    const arm = seated ? (riding === "bike" ? -0.85 : -0.45) : -swing * 0.72;
    if (leftArm.current) leftArm.current.rotation.x = seated ? arm : -swing * 0.72;
    if (rightArm.current) rightArm.current.rotation.x = seated ? arm : swing * 0.72;
    if (cape.current) {
      cape.current.rotation.x =
        0.22 + Math.sin(time * (player.walking ? 8 : 1.5)) * (player.walking || player.traveling ? 0.28 : 0.06);
    }
    if (scarf.current) scarf.current.rotation.z = Math.sin(time * 3.2) * 0.18;
    if (halo.current) halo.current.rotation.z = time * (freeRoam ? 1.8 : 0.85);
    if (haloInner.current) haloInner.current.rotation.z = -time * 1.3;

    const samples = history.current;
    if (!samples[0].ready) {
      for (const sample of samples) {
        sample.x = player.x;
        sample.z = player.z;
        sample.ready = true;
      }
    } else if (player.walking || player.traveling) {
      const newest = samples[0];
      if (Math.hypot(player.x - newest.x, player.z - newest.z) > 0.22) {
        for (let index = samples.length - 1; index > 0; index -= 1) {
          samples[index].x = samples[index - 1].x;
          samples[index].z = samples[index - 1].z;
        }
        newest.x = player.x;
        newest.z = player.z;
      }
    }
    trail.current.forEach((spark, index) => {
      if (!spark) return;
      const sample = samples[index];
      spark.position.set(sample.x - player.x, 0.08 + index * 0.01, sample.z - player.z);
      const scale = (1 - index / TRAIL) * (player.walking || player.traveling ? 1 : 0.35);
      spark.scale.setScalar(scale);
    });
  });

  const accent = freeRoam ? "#c4b5fd" : "#67e8f9";

  return (
    <group ref={group} userData={{ ignoreOcclude: true }}>
      <mesh ref={halo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <torusGeometry args={[0.68, 0.028, 10, 40]} />
        <meshBasicMaterial color={accent} transparent opacity={0.9} />
      </mesh>
      <mesh ref={haloInner} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.14, 0]}>
        <torusGeometry args={[0.4, 0.015, 8, 28]} />
        <meshBasicMaterial color="#e0f2fe" transparent opacity={0.75} />
      </mesh>
      {Array.from({ length: TRAIL }, (_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            trail.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshBasicMaterial color={index % 2 === 0 ? accent : "#e0f2fe"} transparent opacity={0.75} />
        </mesh>
      ))}
      <group ref={pivot}>
        <group ref={body}>
          <mesh position={[0, 1.02, 0]} castShadow>
            <capsuleGeometry args={[0.26, 0.52, 4, 10]} />
            <meshStandardMaterial color="#1a2230" metalness={0.35} roughness={0.38} />
          </mesh>
          <mesh position={[0, 1.28, 0.12]}>
            <boxGeometry args={[0.38, 0.06, 0.08]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.1} />
          </mesh>
          <group ref={cape} position={[0, 1.32, -0.18]}>
            <mesh position={[0, -0.32, 0]}>
              <planeGeometry args={[0.46, 0.62]} />
              <meshStandardMaterial
                color="#0f2744"
                emissive={accent}
                emissiveIntensity={0.45}
                side={DoubleSide}
                roughness={0.4}
              />
            </mesh>
          </group>
          <mesh position={[-0.22, 1.34, 0.02]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={1.6} />
          </mesh>
          <mesh position={[0.22, 1.34, 0.02]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.6} />
          </mesh>
          <group position={[0, 1.62, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.19, 20, 16]} />
              <meshStandardMaterial color="#d8c3ae" roughness={0.62} />
            </mesh>
            <mesh position={[0, 0.08, -0.02]}>
              <sphereGeometry args={[0.2, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
              <meshStandardMaterial color="#10151e" />
            </mesh>
            <mesh position={[0, 0.02, 0.16]}>
              <boxGeometry args={[0.18, 0.05, 0.04]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
            </mesh>
            <mesh ref={scarf} position={[0.16, -0.02, 0.02]} rotation={[0.4, 0, 0.4]}>
              <boxGeometry args={[0.16, 0.035, 0.04]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.7} />
            </mesh>
          </group>
          <Limb ref={leftArm} position={[-0.34, 1.2, 0]} color="#232b3b" />
          <Limb ref={rightArm} position={[0.34, 1.2, 0]} color="#232b3b" />
        </group>
        <Limb ref={leftLeg} position={[-0.12, 0.72, 0]} color="#121826" length={0.34} />
        <Limb ref={rightLeg} position={[0.12, 0.72, 0]} color="#121826" length={0.34} />
      </group>
    </group>
  );
}

export function WalkMarker() {
  const { walkRef } = useGame();
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    const target = walkRef.current;
    if (!group.current) return;
    if (!target) {
      group.current.visible = false;
      return;
    }
    group.current.visible = true;
    group.current.position.set(target.x, 0.06, target.z);
    group.current.rotation.y = clock.elapsedTime * 1.6;
    const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.08;
    group.current.scale.setScalar(pulse);
  });

  return (
    <group ref={group} visible={false} userData={{ ignoreOcclude: true }}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.46, 4]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshBasicMaterial color="#67e8f9" />
      </mesh>
    </group>
  );
}

export function GroundNavigator() {
  const { walkTo } = useGame();

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[1, 0.05, -6]}
      onClick={(event) => {
        event.stopPropagation();
        if (pointerIntent.dragging) return;
        walkTo(event.point.x, event.point.z);
      }}
    >
      <planeGeometry args={[130, 120]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

const Limb = forwardRef<
  Group,
  { position: [number, number, number]; color: string; length?: number }
>(function Limb({ position, color, length = 0.28 }, ref) {
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, -length / 2, 0]} castShadow>
        <capsuleGeometry args={[0.065, length, 3, 6]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
    </group>
  );
});

function dampAngle(current: number, target: number, lambda: number, delta: number) {
  const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + difference * (1 - Math.exp(-lambda * delta));
}
