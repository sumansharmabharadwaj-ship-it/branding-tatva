"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Replaces an earlier version of this scene (five abstract element
// shapes converging into a line) — direct feedback that geometric
// primitives read as cartoonish against a real photographic meadow,
// and didn't fit the video at all. A butterfly settling onto the
// flowers already in that footage is a much more literal, legible fit
// for a nature/five-elements brand than an abstract shape ever was.
const WING_COLOR_NEAR = "#AD6F5C"; // rose — near the body
const WING_COLOR_FAR = "#C28A28"; // ochre — wing tip
const BODY_COLOR = "#27221E"; // soil

function buildWingShape(kind: "upper" | "lower") {
  const shape = new THREE.Shape();
  if (kind === "upper") {
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.15, 0.55, 0.75, 0.7, 0.95, 0.35);
    shape.bezierCurveTo(1.1, 0.05, 0.85, -0.25, 0.5, -0.15);
    shape.bezierCurveTo(0.25, -0.08, 0.1, -0.05, 0, 0);
  } else {
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.1, -0.15, 0.55, -0.35, 0.65, -0.55);
    shape.bezierCurveTo(0.7, -0.7, 0.45, -0.75, 0.25, -0.55);
    shape.bezierCurveTo(0.1, -0.35, 0.02, -0.15, 0, 0);
  }
  return shape;
}

// A soft near-to-far gradient across the wing (warm rose at the body,
// brightening to ochre at the tip) via per-vertex color rather than a
// flat fill — the one thing that keeps a simple hand-built shape from
// reading as a flat paper cutout.
function applyGradient(geometry: THREE.ShapeGeometry, near: string, far: string) {
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox as THREE.Box3;
  const width = Math.max(bbox.max.x - bbox.min.x, 0.0001);
  const colorNear = new THREE.Color(near);
  const colorFar = new THREE.Color(far);
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getX(i) - bbox.min.x) / width;
    tmp.copy(colorNear).lerp(colorFar, t);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

function useWingGeometry(kind: "upper" | "lower") {
  return useMemo(() => {
    const geometry = new THREE.ShapeGeometry(buildWingShape(kind), 24);
    applyGradient(geometry, WING_COLOR_NEAR, WING_COLOR_FAR);
    return geometry;
  }, [kind]);
}

function Butterfly({ progressRef }: { progressRef: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const wingURRef = useRef<THREE.Mesh>(null);
  const wingULRef = useRef<THREE.Mesh>(null);
  const wingLRRef = useRef<THREE.Mesh>(null);
  const wingLLRef = useRef<THREE.Mesh>(null);

  const upperGeo = useWingGeometry("upper");
  const lowerGeo = useWingGeometry("lower");

  useFrame((state) => {
    const progress = progressRef.current;
    const t = state.clock.elapsedTime;

    // A loose, drifting figure-eight while still "in flight" — settles
    // toward a fixed low-frame resting point as scroll progress nears
    // 1, reading as the butterfly drifting the meadow before landing.
    const flightX = Math.sin(t * 0.6) * 2.1 + Math.sin(t * 1.3) * 0.4;
    const flightY = Math.sin(t * 0.9) * 1.0 + 0.25;
    const settle = THREE.MathUtils.smoothstep(progress, 0.55, 1);

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(flightX, 0.15, settle);
      groupRef.current.position.y = THREE.MathUtils.lerp(flightY, -0.6, settle);
      const bank = Math.sin(t * 0.6) * 0.35 * (1 - settle);
      groupRef.current.rotation.z = bank;
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.25 * (1 - settle) + state.pointer.x * 0.08;
    }

    // Fast, wide flap while flying; a slow, shallow rest-flutter once
    // landed — never fully static, just quieter.
    const flapSpeed = THREE.MathUtils.lerp(9, 2.2, settle);
    const flapRange = THREE.MathUtils.lerp(0.85, 0.16, settle);
    const flapBase = THREE.MathUtils.lerp(0.35, 1.05, settle);
    const flap = Math.sin(t * flapSpeed) * flapRange + flapBase;

    if (wingURRef.current) wingURRef.current.rotation.y = flap;
    if (wingLRRef.current) wingLRRef.current.rotation.y = flap;
    if (wingULRef.current) wingULRef.current.rotation.y = -flap;
    if (wingLLRef.current) wingLLRef.current.rotation.y = -flap;
  });

  const wingMaterialProps = {
    vertexColors: true as const,
    transparent: true,
    opacity: 0.93,
    side: THREE.DoubleSide,
    roughness: 0.35,
    metalness: 0.05,
  };

  return (
    <group ref={groupRef} scale={0.85}>
      <mesh>
        <capsuleGeometry args={[0.045, 0.5, 4, 8]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.7} />
      </mesh>
      <mesh position={[0.04, 0.28, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.006, 0.006, 0.18, 4]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.6} />
      </mesh>
      <mesh position={[-0.04, 0.28, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.006, 0.006, 0.18, 4]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.6} />
      </mesh>
      <mesh ref={wingURRef} geometry={upperGeo} position={[0, 0.1, 0]}>
        <meshStandardMaterial {...wingMaterialProps} />
      </mesh>
      <mesh ref={wingULRef} geometry={upperGeo} position={[0, 0.1, 0]} scale={[-1, 1, 1]}>
        <meshStandardMaterial {...wingMaterialProps} />
      </mesh>
      <mesh ref={wingLRRef} geometry={lowerGeo} position={[0, -0.05, 0]}>
        <meshStandardMaterial {...wingMaterialProps} opacity={0.9} />
      </mesh>
      <mesh ref={wingLLRef} geometry={lowerGeo} position={[0, -0.05, 0]} scale={[-1, 1, 1]}>
        <meshStandardMaterial {...wingMaterialProps} opacity={0.9} />
      </mesh>
    </group>
  );
}

export function ButterflyCanvas({ progressRef }: { progressRef: RefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <directionalLight position={[-3, -2, -4]} intensity={0.3} />
      <Butterfly progressRef={progressRef} />
    </Canvas>
  );
}
