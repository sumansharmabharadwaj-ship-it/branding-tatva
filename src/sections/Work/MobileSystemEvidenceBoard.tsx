"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import type { Project } from "@/data/projects";
import { getWorkTaxonomy } from "@/data/workTaxonomy";
import { WORK, EASE_ORGANIC } from "@/sections/Work/palette";

const VISUAL_STATES = [
  {
    word: "ACCESS",
    eyebrow: "The default meaning",
    line: "A generic route to inexpensive supply.",
  },
  {
    word: "ORIGIN",
    eyebrow: "The positioning decision",
    line: "Craft and story before price.",
  },
  {
    word: "SYSTEM",
    eyebrow: "What the work built",
    line: "One foundation carried through channels and rollout.",
  },
] as const;

const SYSTEM_CARDS = [
  ["Foundation", "Belief · mission · promise · value"],
  ["Content architecture", "65% authority · 25% culture · 10% direct brand"],
  ["Rollout", "Foundation → audience pull → lead quality → market position"],
] as const;

const MOBILE_CSS = `
@media (max-width: 1023px) {
  [data-mobile-narrative-original-system="true"] {
    display: none !important;
  }
  [data-mobile-system-project-host="true"] {
    display: block;
  }
}
@media (min-width: 1024px) {
  [data-mobile-system-project-host="true"] {
    display: none !important;
  }
}
`;

export function MobileSystemEvidenceBoard({ project }: { project: Project }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const animate = hydrated && !prefersReducedMotion;
  const evidencePoster = getWorkTaxonomy(project.slug).evidencePoster;

  const steps = [
    {
      label: "The category risk",
      title: "A real opportunity was about to inherit a generic meaning.",
      body: project.challenge,
    },
    {
      label: "The strategic choice",
      title: "The advantage was not access. It was origin.",
      body: project.strategy ?? project.insight ?? "",
    },
    {
      label: "The operating system",
      title: "The position had to survive contact with every channel.",
      body: project.execution ?? project.outcome,
    },
  ];
  const step = steps[active] ?? steps[0];
  const visual = VISUAL_STATES[active] ?? VISUAL_STATES[0];

  useEffect(() => {
    const firstStep = document.querySelector<HTMLElement>("[data-system-step]");
    const narrativeColumn = firstStep?.parentElement;
    const grid = narrativeColumn?.parentElement;
    const container = grid?.parentElement;
    if (!grid || !container) return;

    const portalHost = document.createElement("div");
    portalHost.dataset.mobileSystemProjectHost = "true";
    container.insertBefore(portalHost, grid);
    grid.dataset.mobileNarrativeOriginalSystem = "true";
    setHost(portalHost);

    return () => {
      portalHost.remove();
      delete grid.dataset.mobileNarrativeOriginalSystem;
    };
  }, []);

  return (
    <>
      {/* The marker prevents the generic DOM-derived fallback from
          mounting when this project-aware board is present. */}
      <span id="mobile-system-step" hidden />
      <style dangerouslySetInnerHTML={{ __html: MOBILE_CSS }} />

      {host && step && createPortal(
        <div className="mt-8 lg:hidden" data-mobile-system-project-board="true">
          <div className="relative overflow-hidden rounded-[1.45rem] border" style={{ borderColor: "rgba(198,169,122,0.28)", backgroundColor: "#172027" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={evidencePoster} alt={`${project.title} brand-system evidence diagram`} className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(16,21,26,0.26), rgba(16,21,26,0.95) 76%)" }} />

            <div className="relative p-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={visual.word}
                  initial={animate ? { opacity: 0, y: 8 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={animate ? { opacity: 0, y: -6 } : undefined}
                  transition={{ duration: animate ? 0.4 : 0, ease: EASE_ORGANIC }}
                >
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.sand }}>{visual.eyebrow}</p>
                  <p className="mt-1 font-display text-[2.85rem] leading-none tracking-[-0.04em] text-white">{visual.word}</p>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-white/68">{visual.line}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 grid gap-2.5">
                {SYSTEM_CARDS.map(([label, detail], index) => (
                  <div
                    key={label}
                    className="rounded-xl border p-3.5 transition-colors duration-300"
                    style={{
                      borderColor: active >= index ? "rgba(198,169,122,0.42)" : "rgba(255,255,255,0.12)",
                      backgroundColor: active >= index ? "rgba(31,58,40,0.82)" : "rgba(8,13,16,0.48)",
                    }}
                  >
                    <p className="text-[0.54rem] font-medium uppercase tracking-[0.14em]" style={{ color: WORK.sand }}>
                      {String(index + 1).padStart(2, "0")} · {label}
                    </p>
                    <p className="mt-1 text-[0.74rem] leading-relaxed text-white/72">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Choose a system-building case-study stage">
            {steps.map((item, index) => {
              const selected = active === index;
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={selected}
                  aria-controls="mobile-system-project-panel"
                  onClick={() => setActive(index)}
                  className="min-h-11 rounded-xl border px-2 py-2 font-display text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    borderColor: selected ? WORK.sand : "rgba(198,169,122,0.22)",
                    backgroundColor: selected ? "rgba(198,169,122,0.12)" : "transparent",
                    color: selected ? WORK.sand : "rgba(242,240,232,0.58)",
                    outlineColor: WORK.sand,
                  }}
                  aria-label={`${String(index + 1).padStart(2, "0")}: ${item.label}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              id="mobile-system-project-panel"
              key={`${active}-${step.label}`}
              role="region"
              aria-label={`${step.label}: ${step.title}`}
              initial={animate ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={animate ? { opacity: 0, y: -8 } : undefined}
              transition={{ duration: animate ? 0.42 : 0, ease: EASE_ORGANIC }}
              className="mt-4 rounded-[1.35rem] border p-5"
              style={{ borderColor: "rgba(198,169,122,0.3)", backgroundColor: "rgba(23,32,39,0.92)" }}
            >
              <p className="flex items-center justify-between gap-4 text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.sand }}>
                <span>{step.label}</span>
                <span className="font-display text-sm" aria-hidden="true">{String(active + 1).padStart(2, "0")} / 03</span>
              </p>
              <h3 className="mt-3 font-display text-2xl font-normal leading-tight text-white min-[430px]:text-3xl">{step.title}</h3>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-white/76">{step.body}</p>
            </motion.article>
          </AnimatePresence>

          <div className="mt-4 rounded-[1.35rem] border p-5" style={{ borderColor: "rgba(198,169,122,0.3)", backgroundColor: "rgba(198,169,122,0.08)" }}>
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.sand }}>Outcome on record</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-white/82">{project.outcome}</p>
            <a href={`/work/${project.slug}`} className="mt-5 inline-flex min-h-11 items-center text-sm font-medium" style={{ color: WORK.sand }}>
              Read the full case study <span aria-hidden="true" className="ml-2">→</span>
            </a>
          </div>
        </div>,
        host,
      )}
    </>
  );
}
