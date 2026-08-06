"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Container } from "@/components/Container";
import { LazyAmbientShader } from "@/components/LazyAmbientShader";
import { Reveal } from "@/components/Reveal";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { MobilePerceptionClimb } from "@/sections/Services/MobilePerceptionClimb";

// Five distinct states, following the manual's recognition journey from
// unknown to preferred. Every stage separates the buyer's question from
// the job of branding, the job of marketing, the asset that carries the
// work, and a useful measurement category. Metrics are directions for
// evaluation, not promises of growth.
const RUNGS = [
  {
    label: "Unknown",
    text: "No stored cue, association, or reason to retrieve the brand.",
    visitorQuestion: "Who are they, and what are they for?",
    brandingRole: "Define the category, audience, difference, and reason to believe.",
    marketingRole: "Earn the first qualified exposure without changing the story each time.",
    asset: "Positioning sentence and category cue.",
    metric: "Qualified reach and aided-awareness baseline.",
    implication: "Every sale begins with a cold explanation.",
  },
  {
    label: "Noticed",
    text: "Attention lands, but the source is not yet identifiable.",
    visitorQuestion: "What just caught my attention?",
    brandingRole: "Create distinctive visual and verbal cues that belong to one brand.",
    marketingRole: "Repeat the same cues in relevant contexts instead of chasing novelty.",
    asset: "Distinctive colour, shape, phrase, or sound.",
    metric: "Attention quality and distinctive-asset recognition.",
    implication: "Attention is rented one impression at a time.",
  },
  {
    label: "Recognized",
    text: "The source is identifiable when its cues appear again.",
    visitorQuestion: "Have I seen this brand before?",
    brandingRole: "Keep identity and voice consistent enough to be attributed.",
    marketingRole: "Build coherent frequency across the customer journey.",
    asset: "Connected identity and verbal system.",
    metric: "Aided recognition, returning visitors, or branded search.",
    implication: "Familiarity exists, but competitors can still replace it.",
  },
  {
    label: "Remembered",
    text: "The brand can be retrieved without being shown again.",
    visitorQuestion: "Who comes to mind when I need this?",
    brandingRole: "Own a useful association and make it easy to retrieve.",
    marketingRole: "Reinforce the category moments that should trigger recall.",
    asset: "Repeatable narrative linked to a specific need.",
    metric: "Unaided recall, direct demand, or branded search.",
    implication: "Mental availability starts carrying part of the sale.",
  },
  {
    label: "Preferred",
    text: "The choice feels decided before comparison finishes.",
    visitorQuestion: "Why choose them instead of continuing to compare?",
    brandingRole: "Turn recognition into specific meaning, trust, and a credible point of view.",
    marketingRole: "Connect memory to proof, experience, and a clear next action.",
    asset: "Proof and experience around the brand promise.",
    metric: "Share of preference, qualified conversion, repeat, or referral.",
    implication: "Price no longer carries the whole decision.",
  },
] as const;

export function PerceptionLadder() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [openRung, setOpenRung] = useState<string | null>(RUNGS[0].label);
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative py-20 sm:py-28">
      <LazyAmbientShader opacity={0.16} />
      <Container className="relative max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">Education</p>
          <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
            Recognition has five distinct states.
          </h2>
          <p className="mt-4 max-w-2xl text-ivory/90">
            Attention is only the first rung. Branding builds the cues and meaning; marketing helps those cues become
            available when a buyer is ready to choose.
          </p>
        </Reveal>

        {/* Mobile spends one panel-height on the ladder. All five states
            remain directly reachable, and each active state explains
            buyer question, roles, asset, metric, and consequence. */}
        <MobilePerceptionClimb rungs={RUNGS} />

        {/* Desktop keeps the measured scroll-linked spine. One stage is
            open at a time so the added diagnostic detail does not become
            a wall of twenty-five simultaneous facts. */}
        <div
          data-perception-desktop-ladder="true"
          data-perception-stage-count={RUNGS.length}
          className="mt-12 hidden gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-16"
        >
          <div ref={trackRef} data-perception-desktop-track="true" className="relative space-y-7 pl-8">
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
              const panelId = `perception-desktop-panel-${index}`;
              return (
                <Reveal key={rung.label} delay={index * 0.08}>
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
                              transition: { delay: 0.3 + index * 0.14, duration: 0.35 },
                            }
                      }
                      viewport={{ once: true, margin: "0px 0px -25% 0px" }}
                    />
                    <button
                      type="button"
                      data-perception-desktop-rung="true"
                      data-perception-stage={rung.label.toLowerCase()}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenRung(isOpen ? null : rung.label)}
                      className="w-full rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A0A690]"
                    >
                      <div className="flex items-baseline justify-between gap-5">
                        <p className="flex items-baseline gap-3 font-display text-2xl font-normal text-ivory">
                          <span className="text-sm text-[#A0A690]">{String(index + 1).padStart(2, "0")}</span>
                          {rung.label}
                        </p>
                        <span
                          aria-hidden="true"
                          className={`text-base font-light transition-transform duration-300 ${
                            isOpen ? "rotate-45 text-[#A0A690]" : "text-ivory/40"
                          }`}
                        >
                          +
                        </span>
                      </div>
                      <p className="mt-1 text-base text-ivory/90 transition-colors duration-300 group-hover:text-ivory/95">
                        {rung.text}
                      </p>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          data-perception-desktop-detail="true"
                          initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.42,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 rounded-2xl border border-ivory/12 bg-black/10 p-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="sm:col-span-2">
                                <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-ivory/45">
                                  Buyer is asking
                                </p>
                                <p className="mt-1 font-display text-lg text-ivory">{rung.visitorQuestion}</p>
                              </div>
                              <div>
                                <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-ivory/45">
                                  Branding role
                                </p>
                                <p className="mt-1.5 text-sm leading-relaxed text-ivory/78">{rung.brandingRole}</p>
                              </div>
                              <div>
                                <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-ivory/45">
                                  Marketing role
                                </p>
                                <p className="mt-1.5 text-sm leading-relaxed text-ivory/78">{rung.marketingRole}</p>
                              </div>
                              <div>
                                <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-ivory/45">
                                  Asset to build
                                </p>
                                <p className="mt-1.5 text-sm leading-relaxed text-ivory/78">{rung.asset}</p>
                              </div>
                              <div>
                                <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-ivory/45">
                                  Useful metric
                                </p>
                                <p className="mt-1.5 text-sm leading-relaxed text-ivory/78">{rung.metric}</p>
                              </div>
                            </div>
                            <p className="mt-4 border-l-2 border-[#A0A690]/55 pl-4 text-sm leading-relaxed text-ivory/78">
                              {rung.implication}
                            </p>
                            <a
                              href="#health"
                              className="link-underline mt-3 inline-flex min-h-11 items-center text-sm text-[#A0A690] transition-colors duration-300 hover:text-ivory"
                            >
                              Find your own rung in the health check
                            </a>
                          </div>
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
              <p className="text-xs font-medium uppercase tracking-wide text-ivory/70">One verified signal</p>
              <p className="mt-4 font-display text-5xl font-normal text-ivory">
                <AnimatedStat value="0.71%" />
              </p>
              <p className="mt-1 text-sm text-ivory/70">LinkedIn engagement rate at the start.</p>
              <div className="my-6 h-px bg-ivory/15" aria-hidden="true" />
              <p className="font-display text-5xl font-normal text-[#A0A690]">
                <AnimatedStat value="2.81%" />
              </p>
              <p className="mt-1 text-sm text-ivory/70">LinkedIn engagement rate eight weeks later.</p>
              <p className="mt-5 border-t border-ivory/12 pt-4 text-xs leading-relaxed text-ivory/48">
                A campaign-performance signal, not a direct measure of brand recall. Recall requires separate research.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
