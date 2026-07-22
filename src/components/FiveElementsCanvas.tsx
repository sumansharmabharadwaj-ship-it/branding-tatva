"use client";

import { useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ELEMENT_HEX, type ElementSlug } from "@/lib/sectionWash";

// Direct feedback that five identical capsules just read as "colored
// pills," not as anything belonging to a nature/five-elements brand.
// Each element now gets its own literal, differently-shaped form
// instead of a shared silhouette in five colors: a faceted rock for
// earth, a droplet for water, a rising flame for fire, a ring/current
// for air, and a smooth orb for space. Colors and relative sizes still
// come straight from ELEMENT_HEX and the same skyline profile
// (small/med/large/med/small) PageLoadVeil's own five bars use, so this
// still reads as the same five-part idea, just rendered as things that
// actually look like their element rather than a repeated primitive.
const ELEMENTS: { slug: ElementSlug; targetX: number; targetScale: number }[] = [
  { slug: "earth", targetX: -1.7, targetScale: 0.85 },
  { slug: "water", targetX: -0.85, targetScale: 1.0 },
  { slug: "fire", targetX: 0, targetScale: 1.2 },
  { slug: "air", targetX: 0.85, targetScale: 1.0 },
  { slug: "space", targetX: 1.7, targetScale: 0.85 },
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

// A hand-built teardrop profile, revolved around the Y axis by
// latheGeometry — rounded bulb at the bottom tapering to a point at
// the top, the same silhouette water actually forms as a droplet.
const DROPLET_PROFILE = [
  new THREE.Vector2(0, -0.4),
  new THREE.Vector2(0.16, -0.34),
  new THREE.Vector2(0.27, -0.14),
  new THREE.Vector2(0.25, 0.06),
  new THREE.Vector2(0.14, 0.26),
  new THREE.Vector2(0, 0.44),
];

function ElementForm({ slug }: { slug: ElementSlug }) {
  const color = ELEMENT_HEX[slug];
  switch (slug) {
    case "earth":
      // Low-poly, unevenly faceted — reads as a cut stone rather than
      // a perfect geometric solid.
      return (
        <>
          <icosahedronGeometry args={[0.36, 0]} />
          <meshStandardMaterial color={color} roughness={0.95} metalness={0} flatShading />
        </>
      );
    case "water":
      return (
        <>
          <latheGeometry args={[DROPLET_PROFILE, 20]} />
          <meshStandardMaterial color={color} roughness={0.12} metalness={0.05} />
        </>
      );
    case "fire":
      // Cone's apex sits at +Y by default — already a rising flame
      // shape with no extra rotation needed.
      return (
        <>
          <coneGeometry args={[0.28, 0.88, 8]} />
          <meshStandardMaterial
            color={color}
            roughness={0.35}
            metalness={0}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </>
      );
    case "air":
      // A ring facing the camera — a current of moving air, not a
      // solid object, the one element with no fixed mass or shape.
      return (
        <>
          <torusGeometry args={[0.28, 0.09, 12, 32]} />
          <meshStandardMaterial color={color} roughness={0.55} metalness={0} />
        </>
      );
    case "space":
      // A plain, perfectly smooth sphere — the one element defined by
      // absence rather than a specific texture or edge.
      return (
        <>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.35} />
        </>
      );
  }
}

function Elements({ progressRef }: { progressRef: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const progress = progressRef.current;
    const eased = 1 - Math.pow(1 - progress, 3);

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const scatter = SCATTER[i];
      const target = ELEMENTS[i];
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
      const scale = THREE.MathUtils.lerp(0.5, target.targetScale, eased);
      mesh.scale.setScalar(scale);
    });

    // Idle rotation and pointer-parallax only kick in once the shapes
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
      {ELEMENTS.map((el, i) => (
        <mesh
          key={el.slug}
          ref={(node) => {
            meshRefs.current[i] = node;
          }}
        >
          <ElementForm slug={el.slug} />
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
      <Elements progressRef={progressRef} />
    </Canvas>
  );
}
