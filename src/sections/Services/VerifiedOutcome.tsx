"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";
import { AnimatedStat } from "@/components/AnimatedStat";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { projects } from "@/data/projects";

const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const EASE = [0.22, 1, 0.36, 1] as const;

type ServicesProgressDetail = {
  id?: string;
  progress?: number;
};

// Conversion architecture: proof sits directly after the packages instead of
// waiting for the Work page. Every sentence and number below comes from the
// verified Dr. Haley Nutrition project record. Services still foregrounds one
// result only; the complete four-stat narrative remains on the Work page.
//
// A natural 100svh chapter now carries three semantic beats through the same
// stable composition: the strategic decision, the behavioural shift it
// created, and the verified result. React changes only that discrete semantic
// state, never every scroll pixel.
export function VerifiedOutcome() {
  const proof = projects.find((p) => p.slug === "dr-haley-nutrition");
  const [activeBeat, setActiveBeat] = useState(0);
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveBeat(2);
      return;
    }

    function onProgress(event: Event) {
      const detail = (event as CustomEvent<ServicesProgressDetail>).detail;
      if (detail?.id !== "verified-outcome" || typeof detail.progress !== "number") return;
      const next = detail.progress < 0.43 ? 0 : detail.progress < 0.7 ? 1 : 2;
      setActiveBeat((current) => (current === next ? current : next));
    }

    window.addEventListener(SCENE_PROGRESS_EVENT, onProgress as EventListener);
    return () => window.removeEventListener(SCENE_PROGRESS_EVENT, onProgress as EventListener);
  }, [prefersReducedMotion]);

  if (!proof?.stats) return null;

  const lead = proof.stats.find((s) => s.value === "104%") ?? proof.stats[0];
  const beats = [
    {
      label: "The decision",
      text: proof.strategy ?? proof.challenge,
    },
    {
      label: "What changed",
      text: proof.hook ?? proof.reflection ?? proof.outcome,
    },
    {
      label: "Verified result",
      text: `${lead.value} ${lead.label}.`,
    },
  ];

  return (
    <Container className="max-w-6xl">
      <div data-verified-outcome-phase={activeBeat} className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-20">
        <div data-services-chapter-copy="true">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Verified outcome</p>
            <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
              {proof.title}: eight weeks of exactly this work.
            </h2>
          </Reveal>

          <motion.div
            animate={
              prefersReducedMotion
                ? { opacity: 1, y: 0, scale: 1 }
                : activeBeat === 2
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0.78, y: 5, scale: 0.98 }
            }
            transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
            className="mt-10 origin-left"
          >
            <p className="font-display text-[clamp(4.5rem,11vw,9rem)] font-normal leading-none text-sandstone">
              <AnimatedStat value={lead.value} />
            </p>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-ivory/90">{lead.label}</p>
          </motion.div>

          <div className="mt-8 flex items-center gap-3" aria-hidden="true">
            <span className="font-display text-xs text-sandstone">{String(activeBeat + 1).padStart(2, "0")}</span>
            <span className="relative h-px flex-1 overflow-hidden bg-ivory/12">
              <motion.span
                className="absolute inset-y-0 left-0 bg-sandstone"
                animate={{ width: `${((activeBeat + 1) / beats.length) * 100}%` }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.44, ease: EASE }}
              />
            </span>
            <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-ivory/45">
              / {String(beats.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div data-services-chapter-instrument="true" className="relative">
          <p className="mb-4 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-ivory/70">
            One decision, followed through
          </p>
          <ol className="border-y border-ivory/12">
            {beats.map((beat, index) => {
              const active = activeBeat === index;
              const completed = index < activeBeat;
              return (
                <li key={beat.label} className="relative border-b border-ivory/10 last:border-b-0">
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1, x: 0 }
                        : { opacity: active ? 1 : completed ? 0.9 : 0.82, x: active ? 7 : 0 }
                    }
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
                    className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 sm:py-6"
                  >
                    <span
                      className={`font-display text-sm transition-colors duration-300 ${
                        active ? "text-sandstone" : "text-ivory/55"
                      }`}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-[0.16em] ${active ? "text-sandstone" : "text-ivory/72"}`}>
                        {beat.label}
                      </p>
                      <p className={`mt-2 max-w-xl text-sm leading-relaxed sm:text-base ${active || prefersReducedMotion ? "text-ivory/95" : "text-ivory/90"}`}>
                        {beat.text}
                      </p>
                    </div>
                  </motion.div>
                  {active && !prefersReducedMotion && (
                    <motion.span
                      layoutId="verified-proof-active-line"
                      aria-hidden="true"
                      className="absolute inset-y-4 left-0 w-px bg-sandstone"
                      transition={{ duration: 0.42, ease: EASE }}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          <Reveal delay={0.08}>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href={`/work/${proof.slug}`}>See the full decision trail</LinkButton>
              <LinkButton href="/services#offerings" variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
                Explore the Services
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
