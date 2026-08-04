"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const PATHS = [
  {
    n: "01",
    title: "Build the foundation",
    body: "For founders with a real idea, before logos, websites, and content begin making promises the business has not chosen yet.",
    start: "An idea",
    href: "/services#desire",
    tint: "#6F4E37",
    route: ["Question", "Architect", "Signal"],
    result: "A position the business can grow from",
    icon: (
      <>
        <path d="M20 30V16" />
        <path d="M20 20c-4 0-7-3-7-7 4 0 7 3 7 7z" />
        <path d="M20 22c4 0 7-3 7-7-4 0-7 3-7 7z" />
      </>
    ),
  },
  {
    n: "02",
    title: "Reposition an existing brand",
    body: "For brands that exist, but no longer sound, look, or behave like the business they have become.",
    start: "A brand that drifted",
    href: "/services#situation",
    tint: "#556B4A",
    route: ["Decode", "Architect", "Signal"],
    result: "One recognisable idea across every touchpoint",
    icon: (
      <>
        <circle cx="16" cy="22" r="7" />
        <circle cx="24" cy="22" r="7" />
        <circle cx="20" cy="15" r="7" />
      </>
    ),
  },
  {
    n: "03",
    title: "Create ongoing consistency",
    body: "For growing brands that need content, campaigns, and teams to keep compounding one idea instead of reinventing it.",
    start: "A brand in motion",
    href: "/services#offerings",
    tint: "#8A6B3D",
    route: ["Signal", "Influence", "Compound"],
    result: "Recognition that keeps earning after launch",
    icon: (
      <>
        <circle cx="20" cy="20" r="9" />
        <path d="M20 8v4M20 28v4M8 20h4M28 20h4M20 14l3 6-3 6-3-6z" />
      </>
    ),
  },
] as const;

const CURVES = [
  "M150 60 C 240 60, 250 150, 330 150",
  "M150 150 C 240 150, 250 150, 330 150",
  "M150 240 C 240 240, 250 150, 330 150",
];
const ENTRY_Y = [60, 150, 240];
const AUTO_ADVANCE_MS = 6000;

export function ThreePathsSection() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [autoPath, setAutoPath] = useState(0);
  const [heldPath, setHeldPath] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const shown = heldPath ?? autoPath;
  const active = PATHS[shown];

  useEffect(() => {
    if (prefersReducedMotion || paused) return;
    const timer = window.setInterval(() => {
      setAutoPath((current) => (current + 1) % PATHS.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused, prefersReducedMotion]);

  function holdPath(index: number) {
    setHeldPath(index);
    setPaused(true);
  }

  function releasePath() {
    setHeldPath(null);
    setPaused(false);
  }

  return (
    <motion.section
      className="relative isolate overflow-hidden"
      animate={{ backgroundColor: `${active.tint}12` }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="three-paths-title"
    >
      <style>{`
        @keyframes tatva-flow { to { stroke-dashoffset: -28; } }
        @keyframes tatva-breathe { 0%,100% { opacity: .4 } 50% { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .tatva-flow, .tatva-breathe { animation: none !important; }
        }
      `}</style>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-44 top-[8%] -z-10 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${active.tint}2B, transparent 68%)` }}
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, 74, 0], y: [0, 34, 0], scale: [1, 1.12, 1] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-[-30%] -z-10 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(198,169,122,0.18), transparent 68%)" }}
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, -58, 0], y: [0, -30, 0], scale: [1.06, 0.96, 1.06] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 18, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="flex items-center px-6 pb-4 pt-14 sm:px-12 lg:px-14 lg:py-14">
          <div className="max-w-sm">
            <p className="text-xs font-medium uppercase tracking-[0.25em]" style={{ color: "#8A6B3D" }}>
              Three paths
            </p>
            <h2
              id="three-paths-title"
              className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-normal leading-[1.1] text-soil"
            >
              The work should begin where the business is, rather than where a package expects it to be.
            </h2>
            <span aria-hidden="true" className="mt-5 block h-px w-14" style={{ backgroundColor: "#C6A97A" }} />
            <p className="mt-5 text-sm leading-relaxed text-foreground-secondary">
              Each path unfolds automatically: the starting tension, the decisions it needs, and the recognition it should earn.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-foreground-secondary/70">
              The map keeps moving. Touch a path to hold it.
            </p>
          </div>
        </div>

        <div className="flex items-center px-4 pb-6 sm:px-8 lg:py-14">
          <svg
            viewBox="0 0 900 300"
            className="h-auto w-full"
            role="img"
            aria-label="Three starting points moving through the decisions required to create a recognisable brand"
          >
            {CURVES.map((curve, index) => {
              const isActive = shown === index;
              return (
                <g key={index}>
                  <path
                    d={curve}
                    fill="none"
                    stroke={PATHS[index].tint}
                    strokeWidth={1}
                    opacity={isActive ? 0.34 : 0.08}
                    style={{ transition: "opacity 500ms" }}
                  />
                  <path
                    className="tatva-flow"
                    d={curve}
                    fill="none"
                    stroke={PATHS[index].tint}
                    strokeWidth={isActive ? 2.4 : 1.2}
                    strokeLinecap="round"
                    strokeDasharray="5 9"
                    opacity={isActive ? 1 : 0.14}
                    style={{
                      animation: `tatva-flow ${isActive ? 1.05 : 2.8}s linear infinite`,
                      transition: "opacity 500ms, stroke-width 500ms",
                    }}
                  />
                </g>
              );
            })}

            {PATHS.map((path, index) => {
              const isActive = shown === index;
              return (
                <g key={path.n} opacity={isActive ? 1 : 0.25} style={{ transition: "opacity 500ms" }}>
                  <circle
                    className="tatva-breathe"
                    cx={150}
                    cy={ENTRY_Y[index]}
                    r={isActive ? 7 : 5}
                    fill={path.tint}
                    style={{ animation: `tatva-breathe 3.6s ease-in-out ${index * 0.5}s infinite` }}
                  />
                  <text x={132} y={ENTRY_Y[index] + 5} textAnchor="end" fontSize={15} fill="#27221E" opacity={0.78}>
                    {path.start}
                  </text>
                </g>
              );
            })}

            <line x1={330} y1={150} x2={650} y2={150} stroke="#C6A97A" strokeWidth={1.6} strokeLinecap="round" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.g
                key={shown}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -7 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.55 }}
              >
                {active.route.map((step, stepIndex) => (
                  <g key={step}>
                    <circle cx={380 + stepIndex * 100} cy={150} r={4.5} fill="#C6A97A" />
                    <text x={380 + stepIndex * 100} y={128} textAnchor="middle" fontSize={13} fill="#27221E" opacity={0.72}>
                      {step}
                    </text>
                  </g>
                ))}
                <motion.circle
                  cx={330}
                  cy={150}
                  r={4}
                  fill={active.tint}
                  animate={prefersReducedMotion ? undefined : { cx: [330, 650], opacity: [0, 1, 1, 0] }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 2.8, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }
                  }
                />
              </motion.g>
            </AnimatePresence>

            <circle cx={690} cy={150} r={30} fill="none" stroke="#C6A97A" strokeWidth={1.2} opacity={0.45} />
            <circle className="tatva-breathe" cx={690} cy={150} r={8} fill="#C6A97A" style={{ animation: "tatva-breathe 3.6s ease-in-out infinite" }} />
            <text x={734} y={140} fontSize={18} fill="#27221E" className="font-display">
              A brand people
            </text>
            <text x={734} y={163} fontSize={18} fill="#27221E" className="font-display">
              recognise and choose
            </text>
            <text x={734} y={185} fontSize={11} fill="#5A5148" opacity={0.72}>
              {active.result}
            </text>
          </svg>
        </div>
      </div>

      <div className="relative px-6 pb-14 sm:px-10">
        <ul className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          {PATHS.map((path, index) => {
            const isActive = shown === index;
            return (
              <motion.li
                key={path.n}
                animate={{
                  opacity: isActive ? 1 : 0.52,
                  y: isActive ? -8 : 0,
                  scale: isActive ? 1.015 : 0.985,
                }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={path.href}
                  onMouseEnter={() => holdPath(index)}
                  onMouseLeave={releasePath}
                  onFocus={() => holdPath(index)}
                  onBlur={releasePath}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition-all duration-500"
                  style={{
                    borderColor: isActive ? `${path.tint}66` : "rgba(39,34,30,0.10)",
                    backgroundColor: isActive ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.55)",
                    boxShadow: isActive ? `0 28px 72px -34px ${path.tint}99` : "none",
                  }}
                >
                  {isActive && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute -inset-y-8 -left-1/2 w-1/3 rotate-12 bg-white/35 blur-xl"
                      animate={prefersReducedMotion ? undefined : { x: ["0%", "620%"] }}
                      transition={
                        prefersReducedMotion
                          ? undefined
                          : { duration: 4.8, repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut" }
                      }
                    />
                  )}
                  <span className="relative flex items-center gap-4">
                    <span className="rounded-2xl px-2.5 py-1 font-display text-sm text-ivory" style={{ backgroundColor: path.tint }}>
                      {path.n}
                    </span>
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-soil/12">
                      <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" stroke={path.tint} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                        {path.icon}
                      </svg>
                    </span>
                  </span>
                  <span className="relative mt-5 block font-display text-2xl font-normal leading-tight text-soil">{path.title}</span>
                  <span className="relative mt-3 block text-sm leading-relaxed text-foreground-secondary">{path.body}</span>
                  <span className="relative mt-auto pt-6 text-xs font-medium uppercase tracking-[0.16em]" style={{ color: path.tint }}>
                    Follow this path{" "}
                    <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.16em] text-foreground-secondary">
          <span>Still between paths?</span>
          <span aria-hidden="true" className="h-4 w-px bg-soil/20" />
          <Link href="/services#health" className="link-underline font-medium" style={{ color: "#8A6B3D" }}>
            Find the right starting point <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        Exploring {active.title}. {active.result}.
      </span>
    </motion.section>
  );
}
