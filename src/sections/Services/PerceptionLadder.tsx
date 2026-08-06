"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Container } from "@/components/Container";
import { LazyAmbientShader } from "@/components/LazyAmbientShader";
import { Reveal } from "@/components/Reveal";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { MobilePerceptionClimb } from "@/sections/Services/MobilePerceptionClimb";

// The ladder stays inside the site's recognition and mental-availability
// vocabulary. Each rung names a real state, its visible behaviour, and
// the commercial implication of remaining there.
const RUNGS = [
  {
    label: "Unknown",
    text: "Zero recall, zero association. Where every brand starts.",
    implication: "The market has zero shortcut to you here. Every sale starts from a cold explanation.",
  },
  {
    label: "Recognized",
    text: "Seen enough times to register. Still replaceable by the next thing seen.",
    implication: "Familiar enough to be seen, still interchangeable. Price becomes the tiebreaker.",
  },
  {
    label: "Remembered",
    text: "Recalled without being shown again. Mental availability doing its actual job.",
    implication: "The brand comes to mind unprompted. Distinctive assets sell before you arrive.",
  },
  {
    label: "Preferred",
    text: "The default choice, decided before any comparison even starts.",
    implication: "Comparison ends before it begins. This is where positioning pays for itself.",
  },
] as const;

export function PerceptionLadder() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [openRung, setOpenRung] = useState<string | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

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

        {/* Small screens receive one proof rail and one changing rung
            panel. All four states remain directly reachable without
            stacking the complete ladder and proof card vertically. */}
        <MobilePerceptionClimb rungs={RUNGS} />

        {/* Desktop retains the scroll-linked ladder and sticky proof
            companion. The mobile control above disappears from the lg
            breakpoint, so each viewport gets one clear interaction. */}
        <div
          data-perception-desktop-ladder="true"
          className="mt-12 hidden gap-12 lg:grid lg:grid-cols-[1fr_minmax(0,20rem)] lg:gap-16"
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
              return (
                <Reveal key={rung.label} delay={index * 0.1}>
                  <div className="group relative transition-transform duration-300 hover:translate-x-1">
                    <motion.span
                      className="absolute -left-[33px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-soil transition-shadow duration-300 group-hover:shadow-[0_0_10px_rgba(160,166,144,0.55)]"
                      aria-hidden="true"
                      initial={
                        prefersReducedMotion
                          ? { borderColor: "#A0A690" }
                          : { borderColor: "rgba(244,239,230,0.25)", scale: 1 }
                      }
                      whileInView={
                        prefersReducedMotion
                          ? undefined
                          : {
                              borderColor: "#A0A690",
                              scale: [1, 1.35, 1],
                              transition: { delay: 0.35 + index * 0.18, duration: 0.35 },
                            }
                      }
                      viewport={{ once: true, margin: "0px 0px -25% 0px" }}
                    />
                    <button
                      type="button"
                      data-perception-desktop-rung="true"
                      aria-expanded={isOpen}
                      onClick={() => setOpenRung(isOpen ? null : rung.label)}
                      className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A0A690]"
                    >
                      <p className="flex items-baseline gap-3 font-display text-2xl font-normal text-ivory">
                        {rung.label}
                        <span
                          aria-hidden="true"
                          className={`text-base font-light transition-transform duration-300 ${
                            isOpen ? "rotate-45 text-[#A0A690]" : "text-ivory/40"
                          }`}
                        >
                          +
                        </span>
                      </p>
                      <p className="mt-1 text-base text-ivory/90 transition-colors duration-300 group-hover:text-ivory/95">
                        {rung.text}
                      </p>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.45,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2 max-w-md border-l-2 border-[#A0A690]/50 pl-4 text-sm leading-relaxed text-ivory/80">
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

          <Reveal delay={0.15} className="sticky top-28 self-start">
            <div
              data-perception-desktop-proof="true"
              className="rounded-2xl border border-ivory/15 p-8 backdrop-blur-md"
              style={{ backgroundColor: "rgba(26,32,38,0.55)" }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-ivory/70">One real climb</p>
              <p className="mt-4 font-display text-5xl font-normal text-ivory">
                <AnimatedStat value="0.71%" />
              </p>
              <p className="mt-1 text-sm text-ivory/70">Where one client&apos;s engagement started.</p>
              <div className="my-6 h-px bg-ivory/15" aria-hidden="true" />
              <p className="font-display text-5xl font-normal text-[#A0A690]">
                <AnimatedStat value="2.81%" />
              </p>
              <p className="mt-1 text-sm text-ivory/70">Eight weeks after climbing this exact ladder.</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
