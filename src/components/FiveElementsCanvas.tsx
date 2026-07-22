"use client";

import { useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ELEMENT_HEX, type ElementSlug } from "@/lib/sectionWash";

// The literal 3D version of the line sitting directly above this
// section on the page: "Five bars, one per element, rising and
// settling like a skyline." Same five colors and the same relative
// heights as the flat SVG mark (LogoMark) and the loading veil
// (PageLoadVeil) already use — sourced from ELEMENT_HEX directly
// rather than a third hardcoded copy of these hexes.
const BARS: { slug: ElementSlug; targetX: number; targetHeight: number }[] = [
  { slug: "earth", targetX: -1.6, targetHeight: 0.7 },
  { slug: "water", targetX: -0.8, targetHeight: 1.0 },
  { slug: "fire", targetX: 0, targetHeight: 1.3 },
  { slug: "air", targetX: 0.8, targetHeight: 1.0 },
  { slug: "space", targetX: 1.6, targetHeight: 0.7 },
];

// Deterministic scatter (not Math.random()) so the starting pose is
// stable across renders/hydration rather than jumping on every mount.
const SCATTER = [
  { x: -2.6, y: 1.4, z: -0.6, rx: 0.9, ry: 0.4, rz: -1.1 },
  { x: 1.8, y: -1.6, z: 0.8, rx: -1.3, ry: 0.8, rz: 0.6 },
  { x: -0.6, y: 2.1, z: 0.4, rx: 0.5, ry: -0.9, rz: 1.4 },
  { x: 2.4, y: 1.1, z: -0.9, rx: -0.7, ry: 1.2, rz: -0.5 },
  { x: -1.9, y: -1.8, z: 0.6, rx: 1.1, ry: -0.5, rz: 0.9 },
];

function Bars({ progressRef }: { progressRef: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const barRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const progress = progressRef.current;
    const eased = 1 - Math.pow(1 - progress, 3);

    barRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const scatter = SCATTER[i];
      const target = BARS[i];
      mesh.position.set(
        THREE.MathUtils.lerp(scatter.x, target.targetX, eased),
        THREE.MathUtils.lerp(scatter.y, 0, eased),
        THREE.MathUtils.lerp(scatter.z, 0, eased)
      );
      mesh.rotation.set(
        THREE.MathUtils.lerp(scatter.rx, 0, eased),
        THREE.MathUtils.lerp(scatter.ry, 0, eased),
        THREE.MathUtils.lerp(scatter.rz, 0, eased)
      );
      const heightScale = THREE.MathUtils.lerp(0.4, target.targetHeight, eased);
      mesh.scale.set(1, heightScale, 1);
    });

    // Idle rotation and pointer-parallax only kick in once the bars
    // have essentially finished assembling, so they read as "settled"
    // rather than spinning while still converging.
    if (groupRef.current) {
      const settle = THREE.MathUtils.smoothstep(progress, 0.85, 1);
      groupRef.current.rotation.y =
        state.clock.elapsedTime * 0.08 * settle + state.pointer.x * 0.15 * settle;
      groupRef.current.rotation.x = state.pointer.y * 0.08 * settle;
    }
  });

  return (
    <group ref={groupRef}>
      {BARS.map((bar, i) => (
        <mesh
          key={bar.slug}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
        >
          <capsuleGeometry args={[0.22, 0.6, 4, 12]} />
          <meshStandardMaterial color={ELEMENT_HEX[bar.slug]} roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export function FiveElementsCanvas({ progressRef }: { progressRef: RefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <directionalLight position={[-3, -2, -4]} intensity={0.3} />
      <Bars progressRef={progressRef} />
    </Canvas>
  );
}
