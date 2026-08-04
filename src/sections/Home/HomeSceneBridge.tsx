"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
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

const EASE = [0.22, 1, 0.36, 1] as const;
const SANDSTONE = "#D4B99A";
const CLAY = "#B85A34";
const SAGE = "#5C6B4A";
const INDIGO = "#24394D";
const OCHRE = "#C28A28";
const IVORY = "#F4EFE6";

function AirBridge({ active }: { active: boolean }) {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="absolute left-[-18%] h-px w-[136%] origin-left rounded-full"
          style={{
            top: `${28 + index * 20}%`,
            background:
              index === 1
                ? "linear-gradient(90deg, transparent, rgba(244,239,230,0.62), transparent)"
                : "linear-gradient(90deg, transparent, rgba(212,185,154,0.42), transparent)",
            filter: `blur(${index === 1 ? 0 : 1.5}px)`,
          }}
          animate={
            active
              ? {
                  x: ["-6%", "8%", "-6%"],
                  scaleX: [0.82, 1.06, 0.82],
                  opacity: [0.18, 0.82, 0.18],
                }
              : undefined
          }
          transition={{
            duration: 7.5 + index * 1.4,
            delay: index * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.span
          key={`seed-${index}`}
          className="absolute h-1 w-1 rounded-full"
          style={{
            left: `${13 + index * 18}%`,
            top: `${35 + (index % 2) * 30}%`,
            backgroundColor: index % 2 === 0 ? SANDSTONE : IVORY,
            boxShadow: `0 0 10px ${index % 2 === 0 ? SANDSTONE : IVORY}`,
          }}
          animate={
            active
              ? {
                  x: [0, 16 + index * 3, 0],
                  y: [0, index % 2 === 0 ? -10 : 10, 0],
                  opacity: [0.28, 0.88, 0.28],
                }
              : undefined
          }
          transition={{
            duration: 5.5 + index * 0.7,
            delay: index * 0.28,
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
    "M-20 65 C120 18 238 104 382 54 C526 4 642 96 820 42 C930 10 1040 38 1140 72",
    "M-10 82 C140 34 258 122 416 72 C570 22 710 110 864 58 C970 22 1080 52 1160 88",
    "M40 102 C166 66 304 132 454 92 C612 50 738 136 914 88 C1000 64 1090 76 1160 108",
  ];

  return (
    <svg
      viewBox="0 0 1120 128"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      {paths.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          fill="none"
          stroke={index === 1 ? CLAY : SANDSTONE}
          strokeWidth={index === 1 ? 1.5 : 0.8}
          strokeLinecap="round"
          strokeDasharray={index === 1 ? "5 10" : "2 8"}
          initial={{ pathLength: 0.08, opacity: 0.12 }}
          animate={
            active
              ? {
                  pathLength: [0.08, 1, 1],
                  pathOffset: [0, 0, 1],
                  opacity: [0.16, 0.72, 0.16],
                }
              : { pathLength: 0.82, opacity: 0.24 }
          }
          transition={{
            duration: 8.5 + index,
            delay: index * 0.45,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.circle
        cx="560"
        cy="64"
        r="4"
        fill={CLAY}
        animate={
          active
            ? { r: [3, 7, 3], opacity: [0.45, 1, 0.45] }
            : undefined
        }
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function WaterBridge({ active }: { active: boolean }) {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-1/2 rounded-full border"
          style={{
            width: `${46 + index * 28}px`,
            height: `${18 + index * 12}px`,
            marginLeft: `${-(46 + index * 28) / 2}px`,
            marginTop: `${-(18 + index * 12) / 2}px`,
            borderColor:
              index === 1
                ? "rgba(212,185,154,0.62)"
                : "rgba(125,155,175,0.48)",
          }}
          animate={
            active
              ? {
                  scale: [0.62, 2.2],
                  opacity: [0.78, 0],
                }
              : { scale: 1.1, opacity: 0.28 }
          }
          transition={{
            duration: 4.6,
            delay: index * 1.1,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.span
        className="absolute inset-y-0 -left-1/3 w-1/3 rotate-6"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(244,239,230,0.24), transparent)",
          filter: "blur(10px)",
        }}
        animate={active ? { x: ["0%", "520%"] } : undefined}
        transition={{ duration: 6.8, repeat: Infinity, repeatDelay: 1.8, ease: EASE }}
      />
    </>
  );
}

function ConfluenceBridge({ active }: { active: boolean }) {
  const starts = [92, 272, 452, 632, 812];
  const colors = [CLAY, "#7D9BAF", OCHRE, SAGE, "#C08A7B"];

  return (
    <svg
      viewBox="0 0 904 128"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      {starts.map((start, index) => (
        <motion.path
          key={start}
          d={`M${start} -8 C${start} 35 ${452 + (start - 452) * 0.24} 43 452 64 C452 86 452 96 452 136`}
          fill="none"
          stroke={colors[index]}
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="0.08 0.1"
          animate={
            active
              ? {
                  strokeDashoffset: [0, -1],
                  opacity: [0.32, 0.88, 0.32],
                }
              : { opacity: 0.3 }
          }
          transition={{
            strokeDashoffset: { duration: 5 + index * 0.25, repeat: Infinity, ease: "linear" },
            opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}
      <motion.circle
        cx="452"
        cy="64"
        r="6"
        fill={SANDSTONE}
        animate={active ? { r: [4, 9, 4], opacity: [0.55, 1, 0.55] } : undefined}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function SpaceBridge({ active }: { active: boolean }) {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-1/2 rounded-full border border-dashed"
          style={{
            width: `${54 + index * 34}px`,
            height: `${54 + index * 34}px`,
            marginLeft: `${-(54 + index * 34) / 2}px`,
            marginTop: `${-(54 + index * 34) / 2}px`,
            borderColor:
              index === 0
                ? "rgba(212,185,154,0.65)"
                : "rgba(244,239,230,0.24)",
          }}
          animate={
            active
              ? {
                  rotate: index % 2 === 0 ? 360 : -360,
                  scale: [0.94, 1.06, 0.94],
                }
              : undefined
          }
          transition={{
            rotate: { duration: 15 + index * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span
            className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full"
            style={{
              backgroundColor: index === 0 ? SANDSTONE : IVORY,
              boxShadow: `0 0 12px ${index === 0 ? SANDSTONE : IVORY}`,
            }}
          />
        </motion.span>
      ))}
      <motion.span
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: SANDSTONE, boxShadow: `0 0 22px ${SANDSTONE}` }}
        animate={active ? { scale: [0.8, 1.45, 0.8], opacity: [0.55, 1, 0.55] } : undefined}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function FireBridge({ active }: { active: boolean }) {
  return (
    <>
      <motion.span
        className="absolute bottom-[-85%] left-1/2 h-[180%] w-[62%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(circle at 50% 18%, rgba(194,138,40,0.76), rgba(184,90,52,0.28) 28%, transparent 66%)",
          filter: "blur(8px)",
        }}
        animate={active ? { scale: [0.82, 1.12, 0.82], opacity: [0.52, 0.92, 0.52] } : undefined}
        transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="absolute bottom-0 left-1/2 h-[135%] w-px origin-bottom"
          style={{
            marginLeft: `${(index - 1) * 34}px`,
            background:
              "linear-gradient(0deg, rgba(212,185,154,0.72), transparent 76%)",
            filter: "blur(0.4px)",
          }}
          animate={
            active
              ? {
                  rotate: [index * 3 - 6, index * 3 + 5, index * 3 - 6],
                  scaleY: [0.62, 1.06, 0.62],
                  opacity: [0.22, 0.72, 0.22],
                }
              : undefined
          }
          transition={{
            duration: 5.2 + index * 0.65,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

export function HomeSceneBridge({ family, from, to }: HomeSceneBridgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const inView = useInView(ref, { margin: "22% 0px 22% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.58, 1, 1, 0.58]);
  const active = inView && !prefersReducedMotion;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none relative z-[18] -my-8 h-16 overflow-hidden sm:-my-12 sm:h-24"
      style={{
        background: `linear-gradient(180deg, ${from} 0%, color-mix(in srgb, ${from} 50%, ${to}) 48%, ${to} 100%)`,
      }}
    >
      <motion.div
        className="absolute inset-x-0 -top-4 -bottom-4"
        style={prefersReducedMotion ? undefined : { y, opacity }}
      >
        <span
          className="absolute inset-0"
          style={{
            background:
              family === "water"
                ? `radial-gradient(ellipse at 50% 50%, rgba(125,155,175,0.18), transparent 58%)`
                : family === "earth"
                  ? `radial-gradient(ellipse at 50% 55%, rgba(184,90,52,0.13), transparent 60%)`
                  : family === "fire"
                    ? `radial-gradient(ellipse at 50% 78%, rgba(194,138,40,0.22), transparent 62%)`
                    : family === "space"
                      ? `radial-gradient(ellipse at 50% 50%, rgba(36,57,77,0.18), transparent 58%)`
                      : `radial-gradient(ellipse at 50% 50%, rgba(212,185,154,0.14), transparent 60%)`,
          }}
        />

        {family === "air" && <AirBridge active={active} />}
        {family === "earth" && <EarthBridge active={active} />}
        {family === "water" && <WaterBridge active={active} />}
        {family === "confluence" && <ConfluenceBridge active={active} />}
        {family === "space" && <SpaceBridge active={active} />}
        {family === "fire" && <FireBridge active={active} />}

        <motion.span
          className="absolute inset-y-0 -left-1/4 w-1/4 rotate-6"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(244,239,230,0.09), transparent)",
            filter: "blur(8px)",
          }}
          animate={active ? { x: ["0%", "620%"] } : undefined}
          transition={{ duration: 8.5, repeat: Infinity, repeatDelay: 3, ease: EASE }}
        />
      </motion.div>
    </div>
  );
}
