"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion";

// A continuous "big bang" cycle, not a one-time settle-and-stop: everything
// begins collapsed into the central bindu, bursts outward into the five
// elements, holds there for a breath, then slowly draws back into the
// point before bursting again. A brand built from a single point of
// origin, looping, rather than five shapes that just float into place
// once and sit still forever. Reduced-motion users see the settled
// composition permanently, no motion at all.

type Fragment = {
  id: string;
  element: string;
  color: string;
  shape: "blob" | "line" | "ring" | "dot" | "arc";
  to: { x: number; y: number; rotate: number; scale: number };
  size: number;
  times: number[];
};

const CYCLE_SECONDS = 7;

const fragments: Fragment[] = [
  {
    id: "earth",
    element: "Earth",
    color: "#B85A34", // clay
    shape: "blob",
    to: { x: -70, y: 40, rotate: 0, scale: 1 },
    size: 120,
    times: [0, 0.13, 0.68, 0.82, 1],
  },
  {
    id: "water",
    element: "Water",
    color: "#24394D", // indigo
    shape: "arc",
    to: { x: 75, y: -55, rotate: 12, scale: 1 },
    size: 100,
    times: [0, 0.16, 0.7, 0.84, 1],
  },
  {
    id: "fire",
    element: "Fire",
    color: "#C28A28", // ochre
    shape: "ring",
    to: { x: 55, y: 65, rotate: 0, scale: 1 },
    size: 70,
    times: [0, 0.19, 0.72, 0.86, 1],
  },
  {
    id: "air",
    element: "Air",
    color: "#5C6B4A", // sage
    shape: "line",
    to: { x: -60, y: -70, rotate: -15, scale: 1 },
    size: 90,
    times: [0, 0.22, 0.74, 0.88, 1],
  },
  {
    id: "space",
    element: "Space",
    color: "#27221E", // soil
    shape: "dot",
    to: { x: 0, y: 0, rotate: 0, scale: 1 },
    size: 14,
    times: [0, 0.1, 0.66, 0.8, 1],
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

export function AnimatedHero({ dark = false }: { dark?: boolean }) {
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
      className="relative mx-auto h-[320px] w-full max-w-md sm:h-[420px] sm:max-w-lg lg:h-[480px] lg:max-w-2xl"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Shockwave — a ring that bursts outward from the bindu at the
            moment of the bang and fades, reinforcing the explosion beat. */}
        {!prefersReducedMotion && (
          <motion.div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${dark ? "border-ivory/40" : "border-soil/25"}`}
            style={{ width: 20, height: 20 }}
            animate={{ scale: [0, 9, 9], opacity: [0.9, 0, 0] }}
            transition={{
              duration: CYCLE_SECONDS,
              times: [0, 0.22, 1],
              repeat: Infinity,
              ease: ["easeOut", "linear"],
            }}
          />
        )}

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
                : { x: 0, y: 0, rotate: 0, scale: 0.15, opacity: 0 }
            }
            animate={
              prefersReducedMotion
                ? { x: f.to.x, y: f.to.y, rotate: f.to.rotate, scale: f.to.scale, opacity: 1 }
                : {
                    x: [0, f.to.x, f.to.x, 0, 0],
                    y: [0, f.to.y, f.to.y, 0, 0],
                    rotate: [0, f.to.rotate, f.to.rotate, 0, 0],
                    scale: [0.15, f.to.scale * 1.12, f.to.scale, 0.15, 0.15],
                    opacity: [0, 1, 1, 0, 0],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: CYCLE_SECONDS,
                    times: f.times,
                    repeat: Infinity,
                    ease: ["easeOut", "easeOut", "easeInOut", "easeIn"],
                  }
            }
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <FragmentShape
                shape={f.shape}
                size={f.size}
                color={dark && f.id === "space" ? "#F4EFE6" : f.color}
              />
            </div>
          </motion.div>
        ))}

        {/* Central bindu — the point of origin everything bursts from and
            eventually returns to, flashing brightest right at the bang. */}
        <motion.div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${dark ? "bg-ivory" : "bg-soil"}`}
          style={{ width: 8, height: 8 }}
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0.6 }}
          animate={
            prefersReducedMotion
              ? { scale: 1, opacity: 1 }
              : { scale: [0.4, 2.2, 1, 0.4, 0.4], opacity: [0.6, 1, 1, 0.6, 0.6] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: CYCLE_SECONDS,
                  times: [0, 0.08, 0.68, 0.82, 1],
                  repeat: Infinity,
                  ease: ["easeOut", "easeOut", "easeInOut", "easeIn"],
                }
          }
        />
      </div>
    </div>
  );
}
