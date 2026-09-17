"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion, useInView, useScroll, useTransform, type MotionStyle, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Container } from "@/components/Container";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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

type Force = (typeof FORCES)[number];
const READING_STATES: (Force | null)[] = [null, ...FORCES];

function SystemHeading({ force }: { force: Force | null }) {
  return (
    <>
      <div>
        <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em]">Brand connections</p>
        <h3 className="mt-2 font-display text-3xl font-normal leading-tight">
          {force ? `${force.role} missing` : "All five working together"}
        </h3>
      </div>
      <span className="tatva-pressure-lab__status rounded-full border px-3 py-2 text-[0.56rem] font-medium uppercase tracking-[0.14em]">
        {force ? `${force.name} omitted` : "Complete system"}
      </span>
    </>
  );
}

function SystemReading({ force }: { force: Force | null }) {
  return (
    <>
      <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: "#D4B99A" }}>
        {force ? `Without ${force.name}` : "When all five are present"}
      </p>
      <p className="tatva-pressure-lab__consequence mt-3 font-display text-2xl leading-tight">
        {force?.consequence ?? "The position, experience, identity, voice, and presence all carry the same promise."}
      </p>
      <div className="tatva-pressure-lab__next-step">
        <p>{force ? "First decision to revisit" : "Where to begin"}</p>
        <p>{force?.repair ?? "Check where customers encounter a different message from the one you intend."}</p>
      </div>
    </>
  );
}

function SystemConnection({ index, missing, reducedMotion, progress }: {
  index: number;
  missing: boolean;
  reducedMotion: boolean;
  progress: MotionValue<number>;
}) {
  const node = NODE_POSITIONS[index];
  const force = FORCES[index];
  const range = [.12 + index * .035, .64 + index * .035];
  const signalX = useTransform(progress, range, [node.x, 250]);
  const signalY = useTransform(progress, range, [node.y, 222]);
  return (
    <g>
      <motion.line
        x1={node.x} y1={node.y} x2="250" y2="222"
        stroke={force.color}
        strokeWidth={missing ? .8 : 1.7}
        strokeDasharray={missing ? "4 8" : undefined}
        initial={false}
        animate={{ opacity: missing ? .18 : .86, pathLength: missing ? .35 : 1 }}
        transition={{ duration: reducedMotion ? 0 : .45, ease: [0.22, 1, 0.36, 1] }}
      />
      {!reducedMotion && (
        <motion.circle
          className="tatva-pressure-lab__signal"
          cx={signalX} cy={signalY} r="3"
          fill={force.color}
          initial={false}
          animate={{ opacity: missing ? 0 : .9 }}
          transition={{ duration: .3 }}
        />
      )}
    </g>
  );
}

export function TatvaSystemLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const readingAnimations = useRef<Animation[]>([]);
  const forceRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const previousIndex = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({ target: diagramRef, offset: ["start end", "end start"] });
  const { scrollYProgress: readingProgress } = useScroll({ target: readingRef, offset: ["start end", "end start"] });
  const readingArrival = useTransform(readingProgress, [.1, .65], [0, 1]);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const compact = useMediaQuery("(max-width: 767px)");
  const inView = useInView(sectionRef, { amount: 0.28 });
  const [omittedIndex, setOmittedIndex] = useState<number | null>(null);
  const omitted = omittedIndex === null ? null : FORCES[omittedIndex];
  const motionActive = inView && !prefersReducedMotion;
  function choose(index: number | null) {
    setOmittedIndex((current) => (index !== null && current === index ? null : index));
  }

  const settleReading = useCallback(() => {
    readingAnimations.current.forEach((animation) => animation.cancel());
    readingAnimations.current = [];
  }, []);
  useEffect(() => {
    const previous = previousIndex.current;
    previousIndex.current = omittedIndex;
    settleReading();
    if (prefersReducedMotion || previous === omittedIndex || readingRef.current?.matches(":focus-within")) return;
    const paragraphs = copyRef.current?.querySelectorAll(":scope > p, :scope > .tatva-pressure-lab__next-step > p");
    if (!paragraphs) return;
    const direction = (omittedIndex ?? -1) > (previous ?? -1) ? 1 : -1;
    // Keep the measured surface, rule and audit link stationary. Only the
    // original paragraphs enter in sequence, without hiding or remounting text.
    readingAnimations.current = Array.from(paragraphs).map((paragraph, index) => paragraph.animate([
      { transform: `translate3d(${-direction * (compact ? 4 : 8)}px, ${compact ? 2 : 3}px, 0)`, opacity: 1 },
      { transform: "translate3d(0, 0, 0)", opacity: 1 },
    ], { duration: 440, delay: index * 45, fill: "backwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)" }));
    return settleReading;
  }, [omittedIndex, compact, prefersReducedMotion, settleReading]);

  function revealFocusedReading(target: HTMLElement) {
    if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) return;
    const bounds = target.getBoundingClientRect();
    if (bounds.top < 80 || bounds.bottom > window.innerHeight - 80) {
      target.scrollIntoView({
        block: bounds.height > window.innerHeight - 160 ? "start" : "center",
        inline: "nearest",
        behavior: "instant",
      });
    }
  }

  function onForceKey(event: KeyboardEvent<HTMLButtonElement>, index: number, buttons: (HTMLButtonElement | null)[]) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? FORCES.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : FORCES.length - 1)) % FORCES.length;
    setOmittedIndex(next);
    const button = buttons[next];
    if (!button) return;
    // A repeated Home or End can target the already focused button after a
    // wheel gesture. No focus event fires in that case, so reveal it directly.
    if (button === document.activeElement) revealFocusedReading(button);
    else button.focus({ preventScroll: true });
  }

  return (
    <section
      ref={sectionRef}
      className="tatva-pressure-lab relative overflow-hidden border-t py-20 sm:py-28"
      style={{ backgroundColor: "#111A18", borderColor: "rgba(244,239,230,0.08)" }}
      aria-labelledby="tatva-system-lab-title"
      onFocusCapture={(event) => revealFocusedReading(event.target)}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-20%] h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(199,119,82,0.22), transparent 70%)" }}
        animate={motionActive ? { x: [0, 72, 0], y: [0, 24, 0], scale: [0.96, 1.08, 0.96] } : { x: 0, y: 0, scale: 1 }}
        transition={motionActive ? { duration: 18, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 bottom-[-32%] h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(82,117,111,0.24), transparent 70%)" }}
        animate={motionActive ? { x: [0, -64, 0], y: [0, -32, 0], scale: [1.05, 0.94, 1.05] } : { x: 0, y: 0, scale: 1 }}
        transition={motionActive ? { duration: 21, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
      />

      <Container className="relative max-w-[94rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(22rem,0.86fr)_minmax(34rem,1.14fr)] lg:items-center lg:gap-16">
          <div className="tatva-pressure-lab__copy">
            <div className="tatva-pressure-lab__intro">
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
                Walk through five common gaps between a brand’s intent and what customers encounter. Each points to a different decision worth revisiting.
              </p>
            </div>

            <div className="mt-7 grid gap-2 sm:grid-cols-2" role="group" aria-label="Choose a missing part of the brand">
              {FORCES.map((force, index) => {
                const missing = omittedIndex === index;
                return (
                  <button
                    key={force.name}
                    ref={(node) => { forceRefs.current[index] = node; }}
                    type="button"
                    aria-pressed={missing}
                    aria-controls="tatva-system-reading"
                    onClick={() => choose(index)}
                    onKeyDown={(event) => onForceKey(event, index, forceRefs.current)}
                    className="tatva-pressure-lab__force group flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,box-shadow] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
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
            <div className="tatva-pressure-lab__board-top tatva-pressure-lab__stack border-b pb-5">
              <div className="tatva-pressure-lab__measure tatva-pressure-lab__stack" aria-hidden="true" inert>
                {READING_STATES.map((force) => (
                  <div key={force?.name ?? "complete"} className="flex flex-wrap items-end justify-between gap-4">
                    <SystemHeading force={force} />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SystemHeading force={omitted} />
              </div>
            </div>

            <div className="grid gap-6 pt-5 md:grid-cols-[minmax(17rem,1fr)_minmax(13rem,0.72fr)] md:items-center">
              <div ref={diagramRef} className="tatva-pressure-lab__diagram relative mx-auto aspect-[500/420] w-full max-w-[36rem]">
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

                  {FORCES.map((force, index) => (
                    <SystemConnection key={force.name} index={index} missing={omittedIndex === index}
                      reducedMotion={prefersReducedMotion} progress={scrollYProgress} />
                  ))}

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
                    <button
                      key={force.name}
                      ref={(node) => { nodeRefs.current[index] = node; }}
                      type="button"
                      aria-label={`${missing ? "Restore" : "Remove"} ${force.name}`}
                      aria-pressed={missing}
                      aria-controls="tatva-system-reading"
                      onClick={() => choose(index)}
                      onKeyDown={(event) => onForceKey(event, index, nodeRefs.current)}
                      className="tatva-pressure-lab__node absolute flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl px-2 py-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                      style={{ left: `${(node.x / 500) * 100}%`, top: `${(node.y / 420) * 100}%` }}
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
                    </button>
                  );
                })}
              </div>

              <motion.div ref={readingRef} id="tatva-system-reading" className="tatva-pressure-lab__reading-region min-w-0"
                style={{ "--pressure-reading": prefersReducedMotion ? 1 : readingArrival, "--pressure-accent": omitted?.color ?? "#8FA283" } as MotionStyle}
                role="region" aria-label="Brand system reading" tabIndex={0}
                onFocusCapture={settleReading} onPointerDown={settleReading}>
                <div
                  className="tatva-pressure-lab__reading rounded-2xl border p-5"
                  style={{
                    borderColor: omitted ? `${omitted.color}77` : "rgba(143,162,131,0.32)",
                    background: omitted
                      ? `radial-gradient(circle at 88% 4%, ${omitted.color}20, transparent 44%), rgba(244,239,230,0.035)`
                      : "radial-gradient(circle at 88% 4%, rgba(143,162,131,0.16), transparent 44%), rgba(244,239,230,0.035)",
                  }}
                >
                  <div className="tatva-pressure-lab__stack">
                    <div className="tatva-pressure-lab__measure tatva-pressure-lab__stack" aria-hidden="true" inert>
                      {READING_STATES.map((force) => (
                        <div key={force?.name ?? "complete"}><SystemReading force={force} /></div>
                      ))}
                    </div>
                    <div ref={copyRef} className="tatva-pressure-lab__reading-copy"
                      aria-live="polite" aria-atomic="true">
                      <SystemReading force={omitted} />
                    </div>
                  </div>
                  <Link href="/services#audit" className="tatva-pressure-lab__audit">
                    Open the brand audit <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
