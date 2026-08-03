"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LazyAmbientShader } from "@/components/LazyAmbientShader";
import { AnimatedStat } from "@/components/AnimatedStat";

// "Education" objection — why premium-reading brands look different.
// Reframed from the brief's literal "looks expensive / feels expensive"
// ladder (trips the banned-adjective list — "expensive," close enough
// to "premium," reads as the exact agency-cliché register this site's
// copy standard exists to avoid) into the site's own established
// recognition/mental-availability vocabulary. Sits on the one Three.js
// ambient shader moment (AmbientElementShader) as a quiet backdrop —
// color and light, not literal 3D objects.
// Continuity pass: each rung now opens — the label and line stay as
// the ladder, and inspecting a rung reveals what that position costs
// or earns commercially, with a path into the health check further
// down the page. The ladder connects to the diagnosis instead of
// ending as a diagram.
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
  const prefersReducedMotion = useReducedMotion();
  // Direct critique (Creative Direction Audit) flagged this as the
  // weakest execution on the page — real content, but a plain bordered
  // list with zero motion. The ladder metaphor now literally climbs:
  // a fill line tracks scroll progress through the list instead of a
  // static border, the same target-scoped useScroll technique already
  // proven lightweight elsewhere, no new scroll-math system invented.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative py-20 sm:py-28">
      <LazyAmbientShader opacity={0.16} />
      {/* Was a single centered max-w-2xl column — the same dead-space
          pattern already fixed on the Risk removal section, left
          unaddressed here. The ladder itself is unchanged; a real proof
          companion now fills the second column instead of empty space
          on wide viewports — the exact 0.71% to 2.81% climb already
          named in this page's own hero, restated here as the concrete
          instance of the abstract ladder a visitor just read. */}
      <Container className="relative max-w-5xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">Education</p>
          {/* Phase 4 persuasion pass: "why some brands look different"
              was observation at a distance — this makes the ladder about
              the reader's own brand, already being ranked whether they
              participate or so much as know about it. */}
          <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
            Your brand is already on this ladder.
          </h2>
          <p className="mt-4 max-w-xl text-ivory/90">
            Buyers place it there with or without your involvement. Climbing deliberately is the whole discipline of
            branding.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_minmax(0,20rem)] lg:gap-16">
          <div ref={trackRef} className="relative space-y-8 pl-6 sm:pl-8">
            <div className="absolute inset-y-0 left-0 w-[2px] bg-ivory/15" aria-hidden="true" />
            {!prefersReducedMotion && (
              <motion.div
                className="absolute left-0 top-0 w-[2px] origin-top bg-[#A0A690]"
                style={{ height: "100%", scaleY: fillScale }}
                aria-hidden="true"
              />
            )}
            {/* Phase 2 motion direction — "the climb": each rung's dot
                ignites in sequence as the fill line draws past it, so
                the ladder is climbed rather than shown. Hover inspects
                a rung — the row leans in, its dot glows. */}
            {RUNGS.map((rung, i) => {
              const isOpen = openRung === rung.label;
              return (
                <Reveal key={rung.label} delay={i * 0.1}>
                  <div className="group relative transition-transform duration-300 hover:translate-x-1">
                    <motion.span
                      className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-soil transition-shadow duration-300 group-hover:shadow-[0_0_10px_rgba(160,166,144,0.55)] sm:-left-[33px]"
                      aria-hidden="true"
                      initial={prefersReducedMotion ? { borderColor: "#A0A690" } : { borderColor: "rgba(244,239,230,0.25)", scale: 1 }}
                      whileInView={
                        prefersReducedMotion
                          ? undefined
                          : {
                              borderColor: "#A0A690",
                              scale: [1, 1.35, 1],
                              transition: { delay: 0.35 + i * 0.18, duration: 0.35 },
                            }
                      }
                      viewport={{ once: true, margin: "0px 0px -25% 0px" }}
                    />
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenRung(isOpen ? null : rung.label)}
                      className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A0A690]"
                    >
                      <p className="flex items-baseline gap-3 font-display text-xl font-normal text-ivory sm:text-2xl">
                        {rung.label}
                        <span
                          aria-hidden="true"
                          className={`text-base font-light transition-transform duration-300 ${isOpen ? "rotate-45 text-[#A0A690]" : "text-ivory/40"}`}
                        >
                          +
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-ivory/90 transition-colors duration-300 group-hover:text-ivory/95 sm:text-base">
                        {rung.text}
                      </p>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
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

          <Reveal delay={0.15} className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-ivory/15 p-6 backdrop-blur-md sm:p-8" style={{ backgroundColor: "rgba(26,32,38,0.55)" }}>
              <p className="text-xs font-medium uppercase tracking-wide text-ivory/70">One real climb</p>
              <p className="mt-4 font-display text-4xl font-normal text-ivory sm:text-5xl">
                <AnimatedStat value="0.71%" />
              </p>
              <p className="mt-1 text-sm text-ivory/70">Where one client&apos;s engagement started.</p>
              <div className="my-6 h-px bg-ivory/15" aria-hidden="true" />
              {/* The climb's destination keeps a highlight — sage tint
                  (blendHex(sage, ivory, 45) precomputed), the same
                  accent as the ladder's own fill line. */}
              <p className="font-display text-4xl font-normal text-[#A0A690] sm:text-5xl">
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
