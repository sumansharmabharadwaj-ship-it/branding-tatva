"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion";

// "The Elements Find Their Form" — five fragments (one per element) begin
// scattered and settle into a loose composition around a central bindu.
// Reduced-motion users see the settled composition immediately, no motion.
// Mobile drops pointer parallax and reduces layer count automatically via CSS.

type Fragment = {
  id: string;
  element: string;
  color: string;
  shape: "blob" | "line" | "ring" | "dot" | "arc";
  from: { x: number; y: number; rotate: number; scale: number };
  to: { x: number; y: number; rotate: number; scale: number };
  size: number;
  delay: number;
};

const fragments: Fragment[] = [
  {
    id: "earth",
    element: "Earth",
    color: "#A65F46", // clay
    shape: "blob",
    from: { x: -180, y: 60, rotate: -25, scale: 0.7 },
    to: { x: -70, y: 40, rotate: 0, scale: 1 },
    size: 120,
    delay: 0,
  },
  {
    id: "water",
    element: "Water",
    color: "#31485A", // indigo
    shape: "arc",
    from: { x: 160, y: -90, rotate: 40, scale: 0.6 },
    to: { x: 75, y: -55, rotate: 12, scale: 1 },
    size: 100,
    delay: 0.1,
  },
  {
    id: "fire",
    element: "Fire",
    color: "#C9953D", // ochre
    shape: "ring",
    from: { x: 140, y: 110, rotate: 15, scale: 0.5 },
    to: { x: 55, y: 65, rotate: 0, scale: 1 },
    size: 70,
    delay: 0.2,
  },
  {
    id: "air",
    element: "Air",
    color: "#79816D", // sage
    shape: "line",
    from: { x: -140, y: -100, rotate: -60, scale: 0.8 },
    to: { x: -60, y: -70, rotate: -15, scale: 1 },
    size: 90,
    delay: 0.3,
  },
  {
    id: "space",
    element: "Space",
    color: "#27221E", // soil
    shape: "dot",
    from: { x: 0, y: -140, rotate: 0, scale: 0.3 },
    to: { x: 0, y: 0, rotate: 0, scale: 1 },
    size: 14,
    delay: 0.45,
  },
];

function FragmentShape({ shape, size, color }: Pick<Fragment, "shape" | "size" | "color">) {
  switch (shape) {
    case "blob":
      return (
        <div
          style={{ width: size, height: size * 0.8, background: color }}
          className="rounded-[45%_55%_60%_40%/50%_45%_55%_50%] opacity-90"
        />
      );
    case "line":
      return (
        <div
          style={{ width: size, height: 3, background: color }}
          className="rounded-full opacity-80"
        />
      );
    case "ring":
      return (
        <div
          style={{ width: size, height: size, borderColor: color }}
          className="rounded-full border-[6px] opacity-80"
        />
      );
    case "arc":
      return (
        <svg width={size} height={size * 0.6} viewBox="0 0 100 60" fill="none">
          <path
            d="M5 55 Q50 -10 95 55"
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.85}
          />
        </svg>
      );
    case "dot":
      return (
        <div style={{ width: size, height: size, background: color }} className="rounded-full" />
      );
  }
}

export function AnimatedHero() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const parallaxX = useSpring(mvX, { stiffness: 60, damping: 20 });
  const parallaxY = useSpring(mvY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function handlePointerMove(e: React.PointerEvent) {
    if (isMobile || prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mvX.set(relX * 16);
    mvY.set(relY * 16);
  }

  // Mobile shows a simplified set — earth, air, space only — to keep the
  // concept legible without overwhelming a small screen.
  const activeFragments = isMobile ? fragments.filter((f) => ["earth", "air", "space"].includes(f.id)) : fragments;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative mx-auto h-[320px] w-full max-w-md sm:h-[420px] sm:max-w-lg"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {activeFragments.map((f) => (
          <motion.div
            key={f.id}
            className="absolute left-1/2 top-1/2"
            style={
              prefersReducedMotion
                ? undefined
                : { x: parallaxX, y: parallaxY }
            }
            initial={
              prefersReducedMotion
                ? { x: f.to.x, y: f.to.y, rotate: f.to.rotate, scale: f.to.scale, opacity: 1 }
                : { x: f.from.x, y: f.from.y, rotate: f.from.rotate, scale: f.from.scale, opacity: 0 }
            }
            animate={{ x: f.to.x, y: f.to.y, rotate: f.to.rotate, scale: f.to.scale, opacity: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 1.1, delay: f.delay, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <FragmentShape shape={f.shape} size={f.size} color={f.color} />
            </div>
          </motion.div>
        ))}

        {/* Central bindu — point of origin/convergence */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-soil"
          style={{ width: 8, height: 8 }}
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.6 }}
        />
      </div>
    </div>
  );
}
