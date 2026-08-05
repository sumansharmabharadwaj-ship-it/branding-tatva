"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/Container";

const FORCES = [
  {
    name: "Prithvi",
    role: "Foundation",
    color: "#C77752",
    score: 34,
    consequence:
      "Without a foundation, every campaign has to invent a new reason for the brand to exist.",
  },
  {
    name: "Jal",
    role: "Flow",
    color: "#52756F",
    score: 58,
    consequence:
      "Without flow, offers and touchpoints feel assembled beside one another rather than experienced as one brand.",
  },
  {
    name: "Agni",
    role: "Distinction",
    color: "#D8A251",
    score: 63,
    consequence:
      "Without distinction, the right audience has no reason to notice the brand twice.",
  },
  {
    name: "Vayu",
    role: "Voice",
    color: "#7D8565",
    score: 54,
    consequence:
      "Without a repeatable voice, people cannot carry the brand clearly beyond the moment they encounter it.",
  },
  {
    name: "Akash",
    role: "Recognition",
    color: "#C08A7B",
    score: 47,
    consequence:
      "Without consistency over time, exposure keeps happening but never settles into familiarity.",
  },
] as const;

const NODE_POSITIONS = [
  { x: 250, y: 54 },
  { x: 426, y: 172 },
  { x: 360, y: 364 },
  { x: 140, y: 364 },
  { x: 74, y: 172 },
] as const;

const AUTO_ADVANCE_MS = 4600;
const MANUAL_HOLD_MS = 16000;

export function TatvaSystemLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const pauseUntilRef = useRef(0);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const inView = useInView(sectionRef, { margin: "12% 0px", amount: 0.1 });
  const [omittedIndex, setOmittedIndex] = useState<number | null>(null);
  const omitted = omittedIndex === null ? null : FORCES[omittedIndex];
  const motionActive = inView && !prefersReducedMotion;
  const score = omitted?.score ?? 100;

  useEffect(() => {
    if (!motionActive) return;

    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < pauseUntilRef.current) return;
      setOmittedIndex((current) => (current === null ? 0 : current >= FORCES.length - 1 ? null : current + 1));
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [motionActive]);

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "framework") return;
      pauseUntilRef.current = Date.now() + 700;
      setOmittedIndex(null);
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => window.removeEventListener("bt:home-chapter", onChapter as EventListener);
  }, []);

  function choose(index: number | null) {
    pauseUntilRef.current = Date.now() + MANUAL_HOLD_MS;
    setOmittedIndex((current) => (index !== null && current === index ? null : index));
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-soil/10 py-16 sm:py-24"
      style={{ backgroundColor: "#E9E4D9" }}
      aria-labelledby="tatva-system-lab-title"
      onPointerDown={() => {
        pauseUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
      onTouchStart={() => {
        pauseUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
      onFocusCapture={() => {
        pauseUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-20%] h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(199,119,82,0.13), transparent 70%)" }}
        animate={motionActive ? { x: [0, 72, 0], y: [0, 24, 0], scale: [0.96, 1.08, 0.96] } : undefined}
        transition={motionActive ? { duration: 18, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 bottom-[-32%] h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(82,117,111,0.14), transparent 70%)" }}
        animate={motionActive ? { x: [0, -64, 0], y: [0, -32, 0], scale: [1.05, 0.94, 1.05] } : undefined}
        transition={motionActive ? { duration: 21, repeat: Infinity, ease: "easeInOut" } : undefined}
      />

      <Container className="relative max-w-[94rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(22rem,0.86fr)_minmax(34rem,1.14fr)] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#556B4A]">
              The system under pressure
            </p>
            <h2
              id="tatva-system-lab-title"
              className="mt-3 max-w-xl font-display text-[clamp(2.35rem,4.5vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-soil"
            >
              Remove one force. Watch recognition lose its shape.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-foreground-secondary sm:text-base sm:leading-8">
              This is an illustrative coherence model, rather than a performance score. Select a Tatva to see the strategic burden the remaining four are forced to carry.
            </p>

            <div className="mt-7 grid gap-2 sm:grid-cols-2">
              {FORCES.map((force, index) => {
                const missing = omittedIndex === index;
                return (
                  <button
                    key={force.name}
                    type="button"
                    aria-pressed={missing}
                    onClick={() => choose(index)}
                    className="group flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                    style={{
                      borderColor: missing ? `${force.color}88` : "rgba(39,34,30,0.10)",
                      backgroundColor: missing ? `${force.color}12` : "rgba(255,255,255,0.32)",
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                        style={{
                          backgroundColor: missing ? "transparent" : force.color,
                          border: `1px solid ${force.color}`,
                          boxShadow: missing ? "none" : `0 0 12px ${force.color}66`,
                        }}
                      />
                      <span>
                        <span className="block font-display text-lg leading-none text-soil">{force.name}</span>
                        <span className="mt-1 block text-[0.58rem] font-medium uppercase tracking-[0.14em] text-foreground-secondary/70">
                          {force.role}
                        </span>
                      </span>
                    </span>
                    <span
                      className="text-[0.55rem] font-medium uppercase tracking-[0.14em]"
                      style={{ color: missing ? force.color : "rgba(39,34,30,0.42)" }}
                    >
                      {missing ? "Missing" : "Present"}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => choose(null)}
              className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-[#556B4A] underline decoration-[#556B4A]/35 underline-offset-4 transition-colors hover:text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
            >
              Restore all five forces
            </button>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-soil/10 bg-white/42 p-4 shadow-[0_32px_90px_rgba(39,34,30,0.09)] backdrop-blur-xl sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-soil/10 pb-5">
              <div>
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-foreground-secondary/65">
                  Illustrative system coherence
                </p>
                <div className="mt-1 flex items-end gap-2">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={score}
                      className="font-display text-5xl leading-none text-soil sm:text-6xl"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 10, filter: "blur(5px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {score}
                    </motion.span>
                  </AnimatePresence>
                  <span className="pb-1 text-sm text-foreground-secondary">/ 100</span>
                </div>
              </div>
              <span className="rounded-full border border-soil/10 bg-white/45 px-3 py-2 text-[0.56rem] font-medium uppercase tracking-[0.14em] text-foreground-secondary">
                {omitted ? `${omitted.name} omitted` : "Complete system"}
              </span>
            </div>

            <div className="grid gap-6 pt-5 md:grid-cols-[minmax(17rem,1fr)_minmax(13rem,0.72fr)] md:items-center">
              <div className="relative mx-auto aspect-[5/4] w-full max-w-[36rem]">
                <svg
                  viewBox="0 0 500 420"
                  className="absolute inset-0 h-full w-full overflow-visible"
                  role="img"
                  aria-label={omitted ? `${omitted.name} is removed from the five force brand system` : "All five Tatvas are connected to recognition"}
                >
                  <motion.path
                    d="M250 54 L426 172 L360 364 L140 364 L74 172 Z"
                    fill="rgba(244,239,230,0.25)"
                    stroke="rgba(39,34,30,0.12)"
                    strokeWidth="1.2"
                    animate={motionActive ? { pathLength: [0.72, 1, 0.72], opacity: [0.45, 0.8, 0.45] } : undefined}
                    transition={motionActive ? { duration: 8, repeat: Infinity, ease: "easeInOut" } : undefined}
                  />

                  {NODE_POSITIONS.map((node, index) => {
                    const force = FORCES[index];
                    const missing = omittedIndex === index;
                    return (
                      <g key={force.name}>
                        <motion.line
                          x1={node.x}
                          y1={node.y}
                          x2="250"
                          y2="222"
                          stroke={force.color}
                          strokeWidth={missing ? 0.8 : 1.7}
                          strokeDasharray={missing ? "4 8" : "2 7"}
                          animate={{
                            opacity: missing ? 0.15 : omitted ? 0.62 : 0.86,
                            strokeDashoffset: motionActive && !missing ? [0, -40] : 0,
                          }}
                          transition={{
                            opacity: { duration: 0.5 },
                            strokeDashoffset: { duration: 5 + index * 0.45, repeat: Infinity, ease: "linear" },
                          }}
                        />
                        {!missing && motionActive && (
                          <circle r="3" fill={force.color} style={{ filter: `drop-shadow(0 0 6px ${force.color})` }}>
                            <animateMotion
                              dur={`${3.8 + index * 0.35}s`}
                              repeatCount="indefinite"
                              path={`M${node.x} ${node.y} L250 222`}
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}

                  <motion.circle
                    cx="250"
                    cy="222"
                    r="56"
                    fill="rgba(244,239,230,0.88)"
                    stroke={omitted?.color ?? "#556B4A"}
                    strokeWidth="1.5"
                    animate={
                      motionActive
                        ? {
                            r: omitted ? [52, 56, 52] : [54, 60, 54],
                            opacity: [0.84, 1, 0.84],
                          }
                        : undefined
                    }
                    transition={motionActive ? { duration: 5.2, repeat: Infinity, ease: "easeInOut" } : undefined}
                  />
                </svg>

                <div className="absolute left-1/2 top-[52.8%] w-28 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="block text-[0.52rem] font-medium uppercase tracking-[0.15em] text-foreground-secondary/60">
                    Market
                  </span>
                  <span className="mt-1 block font-display text-xl leading-none text-soil">Recognition</span>
                </div>

                {FORCES.map((force, index) => {
                  const node = NODE_POSITIONS[index];
                  const missing = omittedIndex === index;
                  return (
                    <motion.button
                      key={force.name}
                      type="button"
                      aria-label={`${missing ? "Restore" : "Remove"} ${force.name}`}
                      aria-pressed={missing}
                      onClick={() => choose(index)}
                      className="absolute flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl px-2 py-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                      style={{ left: `${(node.x / 500) * 100}%`, top: `${(node.y / 420) * 100}%` }}
                      animate={{ opacity: missing ? 0.3 : 1, scale: missing ? 0.84 : 1 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span
                        className="h-4 w-4 rounded-full border-2 bg-[#E9E4D9]"
                        style={{
                          borderColor: force.color,
                          boxShadow: missing ? "none" : `0 0 16px ${force.color}77`,
                        }}
                      />
                      <span className="mt-1.5 font-display text-sm leading-none text-soil">{force.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={omitted?.name ?? "complete"}
                  className="rounded-2xl border p-5"
                  style={{
                    borderColor: omitted ? `${omitted.color}55` : "rgba(85,107,74,0.25)",
                    backgroundColor: omitted ? `${omitted.color}0E` : "rgba(85,107,74,0.055)",
                  }}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                  aria-live="polite"
                >
                  <p
                    className="text-[0.58rem] font-medium uppercase tracking-[0.16em]"
                    style={{ color: omitted?.color ?? "#556B4A" }}
                  >
                    {omitted ? `What breaks without ${omitted.name}` : "When all five are present"}
                  </p>
                  <p className="mt-3 font-display text-2xl leading-tight text-soil">
                    {omitted
                      ? omitted.consequence
                      : "Each force keeps its own job, so no single layer has to rescue the rest of the brand."}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-foreground-secondary/75">
                    Select the missing force again to restore it, or let the model continue demonstrating the system automatically.
                  </p>
                  <Link
                    href="#elements"
                    className="link-underline mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[#556B4A]"
                  >
                    Examine every Tatva in depth <span aria-hidden="true">→</span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
