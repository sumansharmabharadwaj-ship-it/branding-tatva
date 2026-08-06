"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type BridgeFamily =
  | "air"
  | "earth"
  | "water"
  | "confluence"
  | "space"
  | "fire";

type HomeSceneBridgeProps = {
  family: BridgeFamily;
  from: string;
  to: string;
};

const SANDSTONE = "#D4B99A";
const CLAY = "#B85A34";
const SAGE = "#5C6B4A";
const OCHRE = "#C28A28";
const IVORY = "#F4EFE6";
const WATER = "#7D9BAF";
const EASE = [0.22, 1, 0.36, 1] as const;

function AirBridge({ active }: { active: boolean }) {
  return (
    <>
      {[0, 1].map((index) => (
        <motion.span
          key={index}
          className="absolute left-[-12%] h-px w-[124%] origin-left rounded-full"
          style={{
            top: `${36 + index * 28}%`,
            background:
              index === 0
                ? "linear-gradient(90deg, transparent, rgba(244,239,230,0.5), transparent)"
                : "linear-gradient(90deg, transparent, rgba(212,185,154,0.34), transparent)",
          }}
          animate={
            active
              ? {
                  x: ["-4%", "5%", "-4%"],
                  scaleX: [0.9, 1.04, 0.9],
                  opacity: [0.16, 0.64, 0.16],
                }
              : { opacity: 0.2 }
          }
          transition={{
            duration: 7.6 + index * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {[0, 1, 2].map((index) => (
        <motion.span
          key={`air-seed-${index}`}
          className="absolute h-1 w-1 rounded-full"
          style={{
            left: `${20 + index * 29}%`,
            top: `${42 + (index % 2) * 22}%`,
            backgroundColor: index === 1 ? IVORY : SANDSTONE,
            boxShadow: `0 0 8px ${index === 1 ? IVORY : SANDSTONE}`,
          }}
          animate={
            active
              ? {
                  x: [0, 12 + index * 4, 0],
                  y: [0, index % 2 === 0 ? -5 : 5, 0],
                  opacity: [0.22, 0.72, 0.22],
                }
              : { opacity: 0.24 }
          }
          transition={{
            duration: 5.7 + index * 0.7,
            delay: index * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

function EarthBridge({ active }: { active: boolean }) {
  const paths = [
    "M-20 48 C150 10 260 80 430 43 C600 5 730 80 900 42 C1000 20 1080 30 1160 55",
    "M-10 72 C150 38 290 98 450 67 C610 35 760 95 930 61 C1030 42 1100 50 1170 78",
  ];

  return (
    <svg viewBox="0 0 1120 96" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      {paths.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          fill="none"
          stroke={index === 0 ? CLAY : SANDSTONE}
          strokeWidth={index === 0 ? 1.25 : 0.8}
          strokeLinecap="round"
          strokeDasharray={index === 0 ? "5 12" : "2 10"}
          animate={
            active
              ? {
                  strokeDashoffset: [0, -40],
                  opacity: [0.16, 0.58, 0.16],
                }
              : { opacity: 0.2 }
          }
          transition={{
            strokeDashoffset: {
              duration: 7.8 + index * 1.1,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: {
              duration: 5.6,
              delay: index * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}
      <motion.circle
        cx="560"
        cy="50"
        r="4"
        fill={CLAY}
        animate={active ? { scale: [0.72, 1.45, 0.72], opacity: [0.42, 0.9, 0.42] } : undefined}
        style={{ transformOrigin: "560px 50px" }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function WaterBridge({ active }: { active: boolean }) {
  const rings = [
    { width: 150, height: 34, delay: 0 },
    { width: 240, height: 54, delay: 1.05 },
    { width: 330, height: 74, delay: 2.1 },
  ];

  return (
    <>
      {rings.map((ring) => (
        <motion.span
          key={ring.width}
          className="absolute left-1/2 top-1/2 rounded-[50%] border"
          style={{
            width: ring.width,
            height: ring.height,
            marginLeft: -ring.width / 2,
            marginTop: -ring.height / 2,
            borderColor:
              ring.width === 240
                ? "rgba(212,185,154,0.44)"
                : "rgba(125,155,175,0.35)",
          }}
          animate={
            active
              ? { scale: [0.72, 1.55], opacity: [0.55, 0] }
              : { scale: 1, opacity: 0.18 }
          }
          transition={{
            duration: 4.8,
            delay: ring.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.span
        className="absolute inset-y-0 -left-1/4 w-1/4 rotate-3"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(244,239,230,0.16), transparent)",
          filter: "blur(8px)",
        }}
        animate={active ? { x: ["0%", "610%"] } : undefined}
        transition={{ duration: 7, repeat: Infinity, repeatDelay: 2.2, ease: EASE }}
      />
    </>
  );
}

function ConfluenceBridge({ active }: { active: boolean }) {
  const starts = [72, 260, 452, 644, 832];
  const colors = [CLAY, WATER, OCHRE, SAGE, "#C08A7B"];

  return (
    <svg viewBox="0 0 904 96" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      {starts.map((start, index) => (
        <motion.path
          key={start}
          d={`M${start} -5 C${start} 24 ${452 + (start - 452) * 0.2} 31 452 48 C452 64 452 72 452 103`}
          fill="none"
          stroke={colors[index]}
          strokeWidth="1.25"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="0.08 0.12"
          animate={
            active
              ? { strokeDashoffset: [0, -1], opacity: [0.22, 0.68, 0.22] }
              : { opacity: 0.24 }
          }
          transition={{
            strokeDashoffset: {
              duration: 5 + index * 0.2,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}
      <motion.circle
        cx="452"
        cy="48"
        r="5"
        fill={SANDSTONE}
        animate={active ? { scale: [0.76, 1.42, 0.76], opacity: [0.46, 0.9, 0.46] } : undefined}
        style={{ transformOrigin: "452px 48px" }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function SpaceBridge({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 500 96" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
      {[0, 1, 2].map((index) => (
        <motion.ellipse
          key={index}
          cx="250"
          cy="48"
          rx={42 + index * 35}
          ry={14 + index * 11}
          fill="none"
          stroke={index === 0 ? SANDSTONE : "rgba(244,239,230,0.24)"}
          strokeWidth={index === 0 ? 1.2 : 0.8}
          strokeDasharray={index === 0 ? "5 8" : "2 9"}
          animate={
            active
              ? {
                  rotate: index % 2 === 0 ? 360 : -360,
                  scale: [0.96, 1.04, 0.96],
                  opacity: [0.28, 0.62, 0.28],
                }
              : { opacity: 0.24 }
          }
          style={{ transformOrigin: "250px 48px" }}
          transition={{
            rotate: { duration: 17 + index * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 5.2 + index, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 5.2 + index, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}
      <motion.circle
        cx="250"
        cy="48"
        r="3.5"
        fill={SANDSTONE}
        animate={active ? { scale: [0.82, 1.35, 0.82], opacity: [0.48, 0.92, 0.48] } : undefined}
        style={{ transformOrigin: "250px 48px" }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function FireBridge({ active }: { active: boolean }) {
  return (
    <>
      <motion.span
        className="absolute bottom-[-115%] left-1/2 h-[220%] w-[54%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(194,138,40,0.58), rgba(184,90,52,0.2) 30%, transparent 66%)",
          filter: "blur(7px)",
        }}
        animate={active ? { scale: [0.86, 1.08, 0.86], opacity: [0.38, 0.72, 0.38] } : undefined}
        transition={{ duration: 6.3, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="absolute bottom-0 left-1/2 h-[130%] w-px origin-bottom"
          style={{
            marginLeft: `${(index - 1) * 32}px`,
            background: "linear-gradient(0deg, rgba(212,185,154,0.58), transparent 78%)",
          }}
          animate={
            active
              ? {
                  rotate: [index * 3 - 5, index * 3 + 4, index * 3 - 5],
                  scaleY: [0.68, 1.02, 0.68],
                  opacity: [0.18, 0.56, 0.18],
                }
              : { opacity: 0.2 }
          }
          transition={{ duration: 5.2 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

export function HomeSceneBridge({ family, from, to }: HomeSceneBridgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(ref, { margin: "18% 0px 18% 0px" });
  const active = inView && !prefersReducedMotion;

  return (
    <div
      ref={ref}
      data-home-scene-bridge={family}
      aria-hidden="true"
      className="pointer-events-none relative z-[4] my-0 h-8 overflow-hidden sm:h-10 lg:h-12"
      style={{
        background: `linear-gradient(180deg, ${from} 0%, color-mix(in srgb, ${from} 52%, ${to}) 50%, ${to} 100%)`,
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)",
        maskImage:
          "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)",
      }}
    >
      <div className="absolute inset-x-0 -top-2 -bottom-2">
        <span
          className="absolute inset-0"
          style={{
            background:
              family === "water"
                ? "radial-gradient(ellipse at 50% 50%, rgba(125,155,175,0.14), transparent 62%)"
                : family === "earth"
                  ? "radial-gradient(ellipse at 50% 54%, rgba(184,90,52,0.11), transparent 62%)"
                  : family === "fire"
                    ? "radial-gradient(ellipse at 50% 76%, rgba(194,138,40,0.16), transparent 64%)"
                    : family === "space"
                      ? "radial-gradient(ellipse at 50% 50%, rgba(36,57,77,0.14), transparent 62%)"
                      : "radial-gradient(ellipse at 50% 50%, rgba(212,185,154,0.1), transparent 62%)",
          }}
        />

        {family === "air" && <AirBridge active={active} />}
        {family === "earth" && <EarthBridge active={active} />}
        {family === "water" && <WaterBridge active={active} />}
        {family === "confluence" && <ConfluenceBridge active={active} />}
        {family === "space" && <SpaceBridge active={active} />}
        {family === "fire" && <FireBridge active={active} />}
      </div>
    </div>
  );
}
