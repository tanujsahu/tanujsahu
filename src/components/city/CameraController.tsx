"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { MathUtils, Raycaster, Vector3, type Object3D } from "three";
import { cameraRig, pointerIntent } from "@/components/city/cameraRig";
import { useGame } from "@/context/GameContext";

export function CameraRigDirector() {
  const { mode, reducedMotion } = useGame();

  useEffect(() => {
    if (reducedMotion || mode !== "intro") {
      if (mode === "intro") {
        cameraRig.angle = 0.9;
        cameraRig.radius = 28;
        cameraRig.height = 16;
      }
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    timeline.fromTo(
      cameraRig,
      { angle: 0.2, radius: 56, height: 30 },
      { angle: 1.35, radius: 38, height: 21, duration: 5.6 },
    );
    timeline.to(cameraRig, { angle: 2.25, radius: 26, height: 15, duration: 3.6 });
    return () => {
      timeline.kill();
    };
  }, [mode, reducedMotion]);

  return null;
}

export function CameraController() {
  const { camera, gl, scene } = useThree();
  const { mode, playerRef } = useGame();
  const modeRef = useRef(mode);
  const look = useRef(new Vector3(0, 3, -6));
  const desired = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const raycaster = useRef(new Raycaster());
  const zoom = useRef(20);
  const yaw = useRef(0.64);
  const pitch = useRef(1.12);
  const drag = useRef({ active: false, x: 0, y: 0, moved: false });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const element = gl.domElement;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (modeRef.current !== "explore") return;
      zoom.current = MathUtils.clamp(zoom.current + event.deltaY * 0.007, 8, 32);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || modeRef.current !== "explore") return;
      drag.current.active = true;
      drag.current.moved = false;
      drag.current.x = event.clientX;
      drag.current.y = event.clientY;
      pointerIntent.dragging = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag.current.active || modeRef.current !== "explore") return;
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;
      if (!drag.current.moved && dx * dx + dy * dy < 36) return;
      drag.current.moved = true;
      pointerIntent.dragging = true;
      drag.current.x = event.clientX;
      drag.current.y = event.clientY;
      yaw.current -= dx * 0.0055;
      pitch.current = MathUtils.clamp(pitch.current + dy * 0.0045, 0.16, 1.42);
      element.style.cursor = "grabbing";
    };

    const endDrag = () => {
      drag.current.active = false;
      if (element.style.cursor === "grabbing") element.style.cursor = "";
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const player = playerRef.current;
    if (!player) return;

    if (modeRef.current === "intro") {
      desired.current.set(
        Math.sin(cameraRig.angle) * cameraRig.radius,
        cameraRig.height,
        Math.cos(cameraRig.angle) * cameraRig.radius - 4,
      );
      camera.position.lerp(desired.current, 1 - Math.pow(0.02, delta));
      camera.lookAt(0, 3, -6);
      return;
    }

    const distance = zoom.current;
    const horizontal = Math.cos(pitch.current) * distance;
    lookTarget.current.set(player.x, 1.45, player.z);
    desired.current.set(
      player.x + Math.sin(yaw.current) * horizontal,
      1.45 + Math.sin(pitch.current) * distance + (player.traveling ? 2.2 : 0),
      player.z + Math.cos(yaw.current) * horizontal,
    );

    direction.current.copy(desired.current).sub(lookTarget.current);
    const span = direction.current.length();
    if (span > 0.01) {
      direction.current.multiplyScalar(1 / span);
      const caster = raycaster.current;
      caster.set(lookTarget.current, direction.current);
      caster.far = span;
      const hits = caster.intersectObjects(scene.children, true);
      for (const hit of hits) {
        if (hit.distance < 1.2 || hit.distance > span - 0.5) continue;
        if (!isOccluder(hit.object)) continue;
        const lifted = Math.max(desired.current.y, hit.point.y + 7);
        const keep = hit.distance - 1.4;
        if (keep > 3.5 && keep < span) {
          desired.current.copy(lookTarget.current).addScaledVector(direction.current, keep);
        }
        desired.current.y = lifted;
        break;
      }
    }

    const blend = drag.current.active ? Math.min(1, delta * 14) : 1 - Math.pow(0.0016, delta);
    camera.position.lerp(desired.current, blend);
    look.current.lerp(lookTarget.current, blend);
    camera.lookAt(look.current);
  });

  return null;
}

function isOccluder(object: Object3D) {
  let current: Object3D | null = object;
  while (current) {
    if (current.userData.ignoreOcclude) return false;
    if (current.userData.occluder) return true;
    current = current.parent;
  }
  return false;
}
