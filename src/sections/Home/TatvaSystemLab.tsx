"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Container } from "@/components/Container";
import Link from "next/link";

const FORCES = [
  {
    name: "Prithvi",
    role: "Foundation",
    color: "#C77752",
    consequence:
      "Campaigns start making different promises because the brand has no shared position.",
    repair: "Choose the audience, position, and reason to believe.",
  },
  {
    name: "Jal",
    role: "Flow",
    color: "#52756F",
    consequence:
      "The ad, website, and first conversation tell different stories.",
    repair: "Carry the same promise from first impression to enquiry.",
  },
  {
    name: "Agni",
    role: "Distinction",
    color: "#D8A251",
    consequence:
      "Buyers struggle to tell the brand apart from its competitors.",
    repair: "Define the visual and verbal cues people should recognise.",
  },
  {
    name: "Vayu",
    role: "Voice",
    color: "#7D8565",
    consequence:
      "The message changes depending on who writes it.",
    repair: "Give the team a shared voice and a small set of core messages.",
  },
  {
    name: "Akash",
    role: "Recognition",
    color: "#C08A7B",
    consequence:
      "Each new campaign feels like a different business.",
    repair: "Keep the chosen cues consistent across channels and over time.",
  },
] as const;

const NODE_POSITIONS = [
  { x: 250, y: 54 },
  { x: 426, y: 172 },
  { x: 360, y: 364 },
  { x: 140, y: 364 },
  { x: 74, y: 172 },
] as const;

export function TatvaSystemLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.28 });
  const [omittedIndex, setOmittedIndex] = useState<number | null>(null);
  const omitted = omittedIndex === null ? null : FORCES[omittedIndex];
  const motionActive = inView && !prefersReducedMotion;
  function choose(index: number | null) {
    setOmittedIndex((current) => (index !== null && current === index ? null : index));
  }

  return (
    <section
      ref={sectionRef}
      className="tatva-pressure-lab relative overflow-hidden border-t py-20 sm:py-28"
      style={{ backgroundColor: "#111A18", borderColor: "rgba(244,239,230,0.08)" }}
      aria-labelledby="tatva-system-lab-title"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-20%] h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(199,119,82,0.22), transparent 70%)" }}
        animate={motionActive ? { x: [0, 72, 0], y: [0, 24, 0], scale: [0.96, 1.08, 0.96] } : undefined}
        transition={motionActive ? { duration: 18, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 bottom-[-32%] h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(82,117,111,0.24), transparent 70%)" }}
        animate={motionActive ? { x: [0, -64, 0], y: [0, -32, 0], scale: [1.05, 0.94, 1.05] } : undefined}
        transition={motionActive ? { duration: 21, repeat: Infinity, ease: "easeInOut" } : undefined}
      />

      <Container className="relative max-w-[94rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(22rem,0.86fr)_minmax(34rem,1.14fr)] lg:items-center lg:gap-16">
          <div className="tatva-pressure-lab__copy">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#D4B99A]">
              The system under pressure
            </p>
            <h2
              id="tatva-system-lab-title"
              className="mt-3 max-w-xl font-display text-[clamp(2.35rem,4.5vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.02em]"
            >
              A gap in one place changes the whole brand.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 sm:text-base sm:leading-8">
              Explore five common gaps between a brand’s intent and what customers encounter. Each points to a different decision worth revisiting.
            </p>

            <div className="mt-7 grid gap-2 sm:grid-cols-2" role="group" aria-label="Choose a missing part of the brand">
              {FORCES.map((force, index) => {
                const missing = omittedIndex === index;
                return (
                  <button
                    key={force.name}
                    type="button"
                    aria-pressed={missing}
                    aria-controls="tatva-system-reading"
                    onClick={() => choose(index)}
                    className="tatva-pressure-lab__force group flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                    style={{
                      borderColor: missing ? `${force.color}99` : "rgba(244,239,230,0.12)",
                      backgroundColor: missing ? `${force.color}1A` : "rgba(244,239,230,0.035)",
                      boxShadow: missing ? `0 16px 44px ${force.color}13` : "none",
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                        style={{
                          backgroundColor: missing ? "transparent" : force.color,
                          border: `1px solid ${force.color}`,
                          boxShadow: missing ? "none" : `0 0 12px ${force.color}88`,
                        }}
                      />
                      <span>
                        <span className="block font-display text-lg leading-none">{force.name}</span>
                        <span className="mt-1 block text-[0.58rem] font-medium uppercase tracking-[0.14em]">
                          {force.role}
                        </span>
                      </span>
                    </span>
                    <span
                      className="text-[0.55rem] font-medium uppercase tracking-[0.14em]"
                      style={{ color: missing ? "#F4EFE6" : "#C3C1B8" }}
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
              className="tatva-pressure-lab__restore mt-4 inline-flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.16em] underline underline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sandstone"
            >
              Restore all five forces
            </button>
          </div>

          <div className="tatva-pressure-lab__board overflow-hidden rounded-[2rem] border p-4 backdrop-blur-xl sm:p-7">
            <div className="tatva-pressure-lab__board-top flex flex-wrap items-end justify-between gap-4 border-b pb-5">
              <div>
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em]">Brand connections</p>
                <h3 className="mt-2 font-display text-3xl font-normal leading-tight">
                  {omitted ? `${omitted.role} missing` : "All five working together"}
                </h3>
              </div>
              <span className="tatva-pressure-lab__status rounded-full border px-3 py-2 text-[0.56rem] font-medium uppercase tracking-[0.14em]">
                {omitted ? `${omitted.name} omitted` : "Complete system"}
              </span>
            </div>

            <div className="grid gap-6 pt-5 md:grid-cols-[minmax(17rem,1fr)_minmax(13rem,0.72fr)] md:items-center">
              <div className="tatva-pressure-lab__diagram relative mx-auto aspect-[5/4] w-full max-w-[36rem]">
                <svg
                  viewBox="0 0 500 420"
                  className="absolute inset-0 h-full w-full overflow-visible"
                  role="img"
                  aria-label={omitted ? `${omitted.name} is removed from the five force brand system` : "All five Tatvas are connected to recognition"}
                >
                  <path
                    d="M250 54 L426 172 L360 364 L140 364 L74 172 Z"
                    fill="rgba(244,239,230,0.035)"
                    stroke="rgba(244,239,230,0.13)"
                    strokeWidth="1.2"
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
                          strokeDasharray={missing ? "4 8" : undefined}
                          animate={{ opacity: missing ? 0.18 : 0.86, pathLength: missing ? 0.35 : 1 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </g>
                    );
                  })}

                  <motion.circle
                    cx="250"
                    cy="222"
                    r="56"
                    fill="rgba(10,20,18,0.94)"
                    stroke={omitted?.color ?? "#8FA283"}
                    strokeWidth="1.5"
                    animate={{ r: omitted ? 48 : 56 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>

                <div className="tatva-pressure-lab__core-copy absolute left-1/2 top-[52.8%] w-28 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="block text-[0.52rem] font-medium uppercase tracking-[0.15em]">
                    Market
                  </span>
                  <span className="mt-1 block font-display text-xl leading-none">Recognition</span>
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
                      aria-controls="tatva-system-reading"
                      onClick={() => choose(index)}
                      className="tatva-pressure-lab__node absolute flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl px-2 py-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                      style={{ left: `${(node.x / 500) * 100}%`, top: `${(node.y / 420) * 100}%` }}
                      animate={{ y: missing ? 3 : 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span
                        className="h-4 w-4 rounded-full border-2"
                        style={{
                          backgroundColor: "#111A18",
                          borderColor: force.color,
                          borderStyle: missing ? "dashed" : "solid",
                          boxShadow: missing ? "none" : `0 0 16px ${force.color}88`,
                        }}
                      />
                      <span className="mt-1.5 font-display text-sm leading-none">{force.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              <div id="tatva-system-reading" className="min-w-0" aria-live="polite" aria-atomic="true">
                <motion.div
                  key={omitted?.name ?? "complete"}
                  className="tatva-pressure-lab__reading rounded-2xl border p-5"
                  style={{
                    borderColor: omitted ? `${omitted.color}77` : "rgba(143,162,131,0.32)",
                    background: omitted
                      ? `radial-gradient(circle at 88% 4%, ${omitted.color}20, transparent 44%), rgba(244,239,230,0.035)`
                      : "radial-gradient(circle at 88% 4%, rgba(143,162,131,0.16), transparent 44%), rgba(244,239,230,0.035)",
                  }}
                  initial={prefersReducedMotion ? false : { y: 8 }}
                  animate={{ y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p
                    className="text-[0.58rem] font-medium uppercase tracking-[0.16em]"
                    style={{ color: "#D4B99A" }}
                  >
                    {omitted ? `Without ${omitted.name}` : "When all five are present"}
                  </p>
                  <p className="mt-3 font-display text-2xl leading-tight">
                    {omitted
                      ? omitted.consequence
                      : "The position, experience, identity, voice, and presence all carry the same promise."}
                  </p>
                  <div className="tatva-pressure-lab__next-step">
                    <p>{omitted ? "First decision to revisit" : "Where to begin"}</p>
                    <p>{omitted?.repair ?? "Check where customers encounter a different message from the one you intend."}</p>
                  </div>
                  <Link href="/services#audit" className="tatva-pressure-lab__audit">
                    Explore the brand audit <span aria-hidden="true">→</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
