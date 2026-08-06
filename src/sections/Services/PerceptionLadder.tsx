"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Container } from "@/components/Container";
import { LazyAmbientShader } from "@/components/LazyAmbientShader";
import { Reveal } from "@/components/Reveal";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { MobilePerceptionClimb } from "@/sections/Services/MobilePerceptionClimb";

const RUNGS = [
  {
    label: "Unknown",
    text: "Zero recall, zero association. Where every brand starts.",
    implication: "The market has zero shortcut to you here. Every sale starts from a cold explanation.",
    signal: "Every encounter begins from zero.",
  },
  {
    label: "Recognized",
    text: "Seen enough times to register. Still replaceable by the next thing seen.",
    implication: "Familiar enough to be seen, still interchangeable. Price becomes the tiebreaker.",
    signal: "The name registers, but the meaning still moves.",
  },
  {
    label: "Remembered",
    text: "Recalled without being shown again. Mental availability doing its actual job.",
    implication: "The brand comes to mind unprompted. Distinctive assets sell before you arrive.",
    signal: "The pattern returns before the advertisement does.",
  },
  {
    label: "Preferred",
    text: "The default choice, decided before any comparison even starts.",
    implication: "Comparison ends before it begins. This is where positioning pays for itself.",
    signal: "The choice begins to feel already made.",
  },
] as const;

const MANUAL_HOLD_MS = 12000;

export function PerceptionLadder() {
  const trackRef = useRef<HTMLDivElement>(null);
  const manualUntilRef = useRef(0);
  const [openRung, setOpenRung] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.76", "end 0.38"],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const activeRung = RUNGS[activeIndex] ?? RUNGS[0];

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (prefersReducedMotion || Date.now() < manualUntilRef.current) return;
    const nextIndex = Math.min(
      RUNGS.length - 1,
      Math.max(0, Math.floor(progress * RUNGS.length)),
    );
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  function chooseRung(index: number, label: string) {
    manualUntilRef.current = Date.now() + MANUAL_HOLD_MS;
    setActiveIndex(index);
    setOpenRung((current) => (current === label ? null : label));
  }

  return (
    <div className="relative py-20 sm:py-28">
      <LazyAmbientShader opacity={0.16} />
      <Container className="relative max-w-5xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">Education</p>
          <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
            Your brand is already on this ladder.
          </h2>
          <p className="mt-4 max-w-xl text-ivory/90">
            Buyers place it there with or without your involvement. Climbing deliberately is the whole discipline of
            branding.
          </p>
        </Reveal>

        <MobilePerceptionClimb rungs={RUNGS} />

        <div
          data-perception-desktop-ladder="true"
          className="mt-12 hidden gap-12 lg:grid lg:grid-cols-[1fr_minmax(0,21rem)] lg:gap-16"
        >
          <div
            ref={trackRef}
            data-perception-desktop-track="true"
            className="relative space-y-8 pl-8"
          >
            <div className="absolute inset-y-0 left-0 w-[2px] bg-ivory/15" aria-hidden="true" />
            {!prefersReducedMotion && (
              <motion.div
                className="absolute left-0 top-0 w-[2px] origin-top bg-[#A0A690]"
                style={{ height: "100%", scaleY: fillScale }}
                aria-hidden="true"
              />
            )}

            {RUNGS.map((rung, index) => {
              const isOpen = openRung === rung.label;
              const isActive = activeIndex === index;
              return (
                <Reveal key={rung.label} delay={index * 0.08}>
                  <div
                    data-perception-active={isActive ? "true" : "false"}
                    className={`group relative rounded-2xl border px-5 py-4 transition-[transform,border-color,background-color,box-shadow,opacity] duration-400 ${
                      isActive
                        ? "translate-x-2 border-[#A0A690]/50 bg-ivory/[0.055] opacity-100 shadow-[0_18px_55px_rgba(0,0,0,0.15)]"
                        : "border-transparent opacity-60 hover:translate-x-1 hover:opacity-100"
                    }`}
                  >
                    <motion.span
                      className="absolute -left-[38px] top-6 h-3 w-3 rounded-full border-2 bg-soil"
                      aria-hidden="true"
                      animate={
                        prefersReducedMotion
                          ? { borderColor: "#A0A690", scale: 1 }
                          : isActive
                            ? {
                                borderColor: "#A0A690",
                                scale: [1, 1.42, 1],
                                boxShadow: [
                                  "0 0 0 rgba(160,166,144,0)",
                                  "0 0 16px rgba(160,166,144,0.7)",
                                  "0 0 0 rgba(160,166,144,0)",
                                ],
                              }
                            : { borderColor: "rgba(244,239,230,0.25)", scale: 1 },
                      }
                      transition={{
                        duration: isActive ? 2.4 : 0.35,
                        repeat: isActive && !prefersReducedMotion ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    />
                    <button
                      type="button"
                      data-perception-desktop-rung="true"
                      aria-expanded={isOpen}
                      aria-current={isActive ? "step" : undefined}
                      onClick={() => chooseRung(index, rung.label)}
                      className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A0A690]"
                    >
                      <p className="flex items-baseline justify-between gap-3 font-display text-2xl font-normal text-ivory">
                        <span>{rung.label}</span>
                        <span
                          aria-hidden="true"
                          className={`text-base font-light transition-transform duration-300 ${
                            isOpen ? "rotate-45 text-[#A0A690]" : isActive ? "text-[#A0A690]" : "text-ivory/40"
                          }`}
                        >
                          +
                        </span>
                      </p>
                      <p className="mt-1 text-base text-ivory/90 transition-colors duration-300 group-hover:text-ivory/95">
                        {rung.text}
                      </p>
                      {isActive && !isOpen && (
                        <p className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.15em] text-[#A0A690]">
                          {rung.signal}
                        </p>
                      )}
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.42,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 max-w-md border-l-2 border-[#A0A690]/50 pl-4 text-sm leading-relaxed text-ivory/80">
                            {rung.implication}
                          </p>
                          <a
                            href="#health"
                            className="link-underline mt-2 inline-block pl-4 text-sm text-[#A0A690] transition-colors duration-300 hover:text-ivory"
                          >
                            Find your own rung in the health check
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.12} className="sticky top-28 self-start">
            <div
              data-perception-desktop-proof="true"
              className="overflow-hidden rounded-2xl border border-ivory/15 p-8 backdrop-blur-md"
              style={{ backgroundColor: "rgba(26,32,38,0.62)" }}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-medium uppercase tracking-wide text-ivory/70">Current market state</p>
                <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#A0A690]">
                  {String(activeIndex + 1).padStart(2, "0")} / 04
                </span>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeRung.label}
                  data-perception-proof-state={activeRung.label}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.44, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="mt-4 font-display text-4xl font-normal text-ivory">{activeRung.label}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/78">{activeRung.implication}</p>
                  <p className="mt-4 border-l-2 border-[#A0A690]/55 pl-3 text-sm italic text-[#C6CCB8]">
                    {activeRung.signal}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="my-7 h-px bg-ivory/15" aria-hidden="true" />
              <p className="text-xs font-medium uppercase tracking-wide text-ivory/55">One recorded climb</p>
              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                <div>
                  <p className="font-display text-4xl font-normal text-ivory">
                    <AnimatedStat value="0.71%" />
                  </p>
                  <p className="mt-1 text-xs text-ivory/55">Starting engagement</p>
                </div>
                <span aria-hidden="true" className="pb-4 text-[#A0A690]">→</span>
                <div className="text-right">
                  <p className="font-display text-4xl font-normal text-[#A0A690]">
                    <AnimatedStat value="2.81%" />
                  </p>
                  <p className="mt-1 text-xs text-ivory/55">After eight weeks</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
