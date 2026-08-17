"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { LogoMark } from "@/components/Logo";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const SESSION_KEY = "branding-tatva-v4-prelude-seen";
const FIRST_VISIT_MS = 800;
const REPEAT_VISIT_MS = 700;
const EXIT_MS = 220;
const EXIT_SECONDS = EXIT_MS / 1000;
const EASE = [0.22, 1, 0.36, 1] as const;

const NODES = [
  { name: "Earth", x: 92, y: 248, color: "#C77752" },
  { name: "Water", x: 204, y: 132, color: "#7D9BAF" },
  { name: "Fire", x: 318, y: 252, color: "#C6A04E" },
  { name: "Air", x: 430, y: 126, color: "#8FA283" },
  { name: "Space", x: 544, y: 246, color: "#C08A7B" },
] as const;

const CONNECTIONS = [
  "M92 248 C136 214 162 166 204 132",
  "M204 132 C245 168 277 220 318 252",
  "M318 252 C356 216 390 162 430 126",
  "M430 126 C474 162 506 214 544 246",
  "M92 248 C224 316 412 316 544 246",
] as const;

const COPY = [
  "finding the signal",
  "the pattern is forming",
  "bringing the system into view",
] as const;

export function PageLoadVeil() {
  const pathname = usePathname();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [visible, setVisible] = useState(pathname === "/");
  const [removed, setRemoved] = useState(pathname !== "/");
  const [phase, setPhase] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const systemReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (pathname !== "/" || prefersReducedMotion || systemReducedMotion) {
      setVisible(false);
      setRemoved(true);
      return;
    }

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {}

    const duration = seen ? REPEAT_VISIT_MS : FIRST_VISIT_MS;
    const phaseOne = window.setTimeout(() => setPhase(1), duration * 0.27);
    const phaseTwo = window.setTimeout(() => setPhase(2), duration * 0.58);
    const hideTimer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "true");
      } catch {}
      setVisible(false);
    }, duration);
    const removeTimer = window.setTimeout(
      () => setRemoved(true),
      duration + EXIT_MS + 40,
    );

    return () => {
      window.clearTimeout(phaseOne);
      window.clearTimeout(phaseTwo);
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [pathname, prefersReducedMotion]);

  if (removed) return null;

  return (
    <motion.div
      data-page-load-veil
      data-page-load-state={visible ? "present" : "leaving"}
      aria-hidden="true"
      className="fixed inset-0 z-100 overflow-hidden bg-[#111518] motion-reduce:hidden"
      initial={false}
      animate={
        visible
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: -8, filter: "blur(6px)" }
      }
      transition={{ duration: EXIT_SECONDS, ease: EASE }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(125,155,175,0.10), transparent 34%), radial-gradient(circle at 18% 82%, rgba(199,119,82,0.08), transparent 32%), linear-gradient(180deg, #111518, #0d1215)",
        }}
      />

      <motion.span
        className="absolute left-[-12%] top-[18%] h-[64%] w-[28%] rotate-[11deg]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,185,154,0.09), transparent)",
          filter: "blur(16px)",
        }}
        animate={{ x: ["0%", "430%"], opacity: [0.12, 0.56, 0.12] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="relative w-full max-w-3xl">
          <svg
            viewBox="0 0 636 380"
            className="block h-auto w-full overflow-visible"
          >
            <motion.path
              d="M-20 192 C28 192 52 224 92 248"
              fill="none"
              stroke="rgba(212,185,154,.58)"
              strokeWidth="1.25"
              strokeLinecap="round"
              pathLength="1"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 0.78 }}
              transition={{ duration: 0.5, ease: EASE }}
            />

            {CONNECTIONS.map((path, index) => (
              <motion.path
                key={path}
                d={path}
                fill="none"
                stroke={NODES[Math.min(index, NODES.length - 1)].color}
                strokeWidth="1.15"
                strokeLinecap="round"
                pathLength="1"
                initial={{ pathLength: 0, opacity: 0.16 }}
                animate={{
                  pathLength: phase >= 1 ? 1 : 0,
                  opacity: phase >= 1 ? 0.72 : 0.16,
                }}
                transition={{
                  duration: 0.38,
                  delay: index * 0.055,
                  ease: EASE,
                }}
              />
            ))}

            {NODES.map((node, index) => (
              <g key={node.name}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="4.5"
                  fill={node.color}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{
                    scale: phase >= 1 ? 1 : 0.3,
                    opacity: phase >= 1 ? 1 : 0,
                  }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  transition={{
                    duration: 0.28,
                    delay: index * 0.058,
                    ease: EASE,
                  }}
                />
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="13"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="0.8"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={
                    phase >= 2
                      ? { scale: [0.72, 1.34, 0.72], opacity: [0.46, 0, 0.46] }
                      : { scale: 0.5, opacity: 0 }
                  }
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  transition={{
                    duration: 2.2 + index * 0.12,
                    delay: index * 0.09,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.text
                  x={node.x}
                  y={node.y + (index % 2 === 0 ? 34 : -27)}
                  textAnchor="middle"
                  fill="rgba(244,239,230,.48)"
                  fontSize="9"
                  letterSpacing="2.2"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.14 + index * 0.045 }}
                >
                  {node.name.toUpperCase()}
                </motion.text>
              </g>
            ))}

            <motion.path
              d="M544 246 C582 220 600 194 660 194"
              fill="none"
              stroke="rgba(244,239,230,.56)"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 0.72 : 0 }}
              transition={{ duration: 0.38, ease: EASE }}
            />
          </svg>

          <motion.div
            className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory/12 bg-[#111518]/72 backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.74 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.74 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <LogoMark size={42} light />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[10%] px-6 text-center">
        <motion.p
          key={COPY[phase]}
          className="text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-ivory/58"
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          {COPY[phase]}
        </motion.p>
        <span className="mx-auto mt-4 block h-px w-24 overflow-hidden bg-ivory/12">
          <motion.span
            className="block h-full origin-left bg-[#d4b99a]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.05, ease: "linear" }}
          />
        </span>
      </div>
    </motion.div>
  );
}
