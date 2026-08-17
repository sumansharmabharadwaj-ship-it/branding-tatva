"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { conceptProjects } from "@/data/conceptProjects";
import { track } from "@/lib/analytics";
import { WORK } from "@/sections/Work/palette";
import { motionTokens } from "@/lib/motionTokens";

const PHASES = [
  {
    id: "diagnose",
    number: "01",
    label: "Diagnose",
    line: "Read the category and the audience tension.",
    chapterIndexes: [0, 1],
  },
  {
    id: "decide",
    number: "02",
    label: "Decide",
    line: "Choose the position, name, and verbal register.",
    chapterIndexes: [2, 3, 4],
  },
  {
    id: "build",
    number: "03",
    label: "Build",
    line: "Carry the decision into expression, journey, and launch.",
    chapterIndexes: [5, 6],
  },
] as const;

const CARD_SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
] as const;

const ROUTE_LABELS = ["Category", "Audience", "Position", "System"] as const;

// The Lab proves method without borrowing credibility from client work.
// On phones, opening one dossier temporarily removes the other covers so
// the selected study hands directly into its evidence instead of making
// the visitor carry the entire archive through the expanded state.
export function TatvaLab() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const dossierRef = useRef<HTMLElement>(null);
  const openProject = conceptProjects.find((project) => project.slug === openSlug) ?? null;
  const phase = PHASES[activePhase] ?? PHASES[0];

  useEffect(() => {
    if (!openSlug || !dossierRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      dossierRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openSlug, prefersReducedMotion]);

  function toggle(slug: string) {
    const next = openSlug === slug ? null : slug;
    setOpenSlug(next);
    setActivePhase(0);
    if (next) track("lab_project_explored", { study: slug });
  }

  return (
    <section className="relative scroll-mt-32 overflow-hidden py-14 sm:py-24" style={{ backgroundColor: WORK.cream }}>
      <BackgroundVideo
        video="/videos/work-lab-film-v2.mp4"
        poster="/images/work-lab-film-v2-poster.jpg"
        parallax
        playbackRate={0.88}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[#F2F0E8]/85" />
      <Container className="relative max-w-6xl">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.olive }}>
              Branding Tatva Lab
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
              Concept studies: the method, demonstrated in the open.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: WORK.wood }}>
              Independent, speculative brand work. Zero clients are implied and zero outcomes are claimed; each study
              exists to show how the decisions get made.
            </p>
          </div>

          <div
            className="grid grid-cols-3 overflow-hidden rounded-2xl border bg-white/40"
            style={{ borderColor: WORK.stone + "66" }}
            aria-label="Lab evidence boundary"
          >
            {[
              ["04", "Concept studies"],
              ["00", "Clients implied"],
              ["00", "Outcomes claimed"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`px-2.5 py-3.5 text-center sm:px-4 sm:py-4 ${index ? "border-l" : ""}`}
                style={{ borderColor: WORK.stone + "55" }}
              >
                <p className="font-display text-2xl font-normal" style={{ color: WORK.charcoal }}>
                  {value}
                </p>
                <p className="mt-1 text-[0.58rem] font-medium uppercase leading-snug tracking-[0.09em]" style={{ color: WORK.wood }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2 lg:grid-cols-12" aria-label="Concept study dossiers">
          {conceptProjects.map((project, index) => {
            const open = openSlug === project.slug;
            return (
              <article
                key={project.slug}
                className={`min-w-0 ${openSlug && !open ? "hidden md:block" : ""} ${CARD_SPANS[index] ?? "lg:col-span-6"}`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`lab-${project.slug}`}
                  onClick={() => toggle(project.slug)}
                  className="group relative flex min-h-[9.75rem] w-full flex-col overflow-hidden rounded-[1.4rem] border p-4 text-left transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:min-h-[18rem] sm:p-6"
                  style={{
                    borderColor: open ? project.accent : WORK.stone + "66",
                    background: `radial-gradient(circle at 88% 12%, ${project.accent}24 0%, transparent 35%), linear-gradient(145deg, rgba(255,255,255,0.76), ${project.accent}0D)`,
                    boxShadow: open ? `0 22px 70px ${project.accent}20` : "0 18px 55px rgba(48,39,31,0.06)",
                    outlineColor: project.accent,
                  }}
                >
                  <span className="flex items-start justify-between gap-4 sm:gap-5">
                    <span className="min-w-0">
                      <span className="text-[0.56rem] font-medium uppercase tracking-[0.15em] sm:text-[0.58rem] sm:tracking-[0.17em]" style={{ color: project.accent }}>
                        Dossier {String(index + 1).padStart(2, "0")} · Concept work
                      </span>
                      <span className="mt-2 block font-display text-[2rem] font-normal leading-none sm:mt-3 sm:text-4xl" style={{ color: WORK.charcoal }}>
                        {project.conceptName}
                      </span>
                      <span className="mt-1.5 block text-[0.9rem] leading-relaxed sm:mt-2 sm:text-sm" style={{ color: WORK.wood }}>
                        {project.title}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg transition-transform duration-500"
                      style={{
                        borderColor: project.accent + "66",
                        color: project.accent,
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </span>

                  <span className="mt-2 block text-[0.58rem] font-medium uppercase tracking-[0.13em] sm:mt-4 sm:text-[0.6rem] sm:tracking-[0.15em]" style={{ color: WORK.stone }}>
                    {project.sector}
                  </span>

                  <span className="relative mt-auto block pt-3 sm:pt-8">
                    <span
                      aria-hidden="true"
                      className="absolute left-[8%] right-[8%] top-[1.12rem] h-px sm:top-[2.35rem]"
                      style={{ backgroundColor: project.accent + "44" }}
                    />
                    <span className="relative grid grid-cols-4 gap-1.5 sm:gap-2">
                      {ROUTE_LABELS.map((label, routeIndex) => (
                        <span key={label} className="text-center">
                          <span
                            className="mx-auto flex h-4 w-4 items-center justify-center rounded-full border bg-white"
                            style={{ borderColor: project.accent + "88" }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.accent }} />
                          </span>
                          <span className="mt-1.5 block text-[0.6rem] uppercase tracking-[0.04em] sm:mt-2 sm:text-[0.52rem] sm:tracking-[0.1em]" style={{ color: WORK.wood }}>
                            {label}
                          </span>
                          <span className="sr-only">Step {routeIndex + 1}</span>
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              </article>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {openProject && (
            <motion.article
              ref={dossierRef}
              id={`lab-${openProject.slug}`}
              key={openProject.slug}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: motionTokens.distanceSmall }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -motionTokens.distanceMicro }}
              transition={{ duration: motionTokens.durationBase, ease: motionTokens.easeOrganic }}
              className="mt-4 scroll-mt-32 overflow-hidden rounded-[1.7rem] border sm:mt-6"
              style={{ borderColor: openProject.accent + "66", backgroundColor: "rgba(255,255,255,0.58)" }}
            >
              <div
                className="grid gap-5 border-b p-4 sm:gap-8 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end"
                style={{
                  borderColor: openProject.accent + "44",
                  background: `radial-gradient(circle at 86% 0%, ${openProject.accent}24, transparent 38%)`,
                }}
              >
                <div>
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.15em] sm:text-[0.6rem] sm:tracking-[0.17em]" style={{ color: openProject.accent }}>
                    Open concept dossier · independent speculative study
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-normal sm:text-5xl" style={{ color: WORK.charcoal }}>
                    {openProject.conceptName}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: WORK.wood }}>
                    {openProject.title}. The study below separates diagnosis, decision, and system so the reasoning can be inspected before the proposed expression.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenSlug(null)}
                  className="w-fit rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ borderColor: openProject.accent + "66", color: openProject.accent, outlineColor: openProject.accent }}
                >
                  Close dossier
                </button>
              </div>

              <div className="p-4 sm:p-7">
                <div
                  role="tablist"
                  aria-label={`${openProject.conceptName} strategy phases`}
                  className="relative grid grid-cols-3 overflow-hidden rounded-2xl border"
                  style={{ borderColor: WORK.stone + "66" }}
                >
                  {PHASES.map((item, phaseIndex) => {
                    const selected = activePhase === phaseIndex;
                    return (
                      <button
                        key={item.id}
                        id={`lab-${openProject.slug}-tab-${item.id}`}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls={`lab-${openProject.slug}-panel-${item.id}`}
                        onClick={() => setActivePhase(phaseIndex)}
                        className={`relative min-h-20 border-l px-3 py-3.5 text-left first:border-l-0 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 sm:min-h-24 sm:px-5 sm:py-4 ${
                          selected ? "bg-white/70" : "bg-transparent hover:bg-white/35"
                        }`}
                        style={{ borderColor: WORK.stone + "55", outlineColor: openProject.accent }}
                      >
                        <span className="block font-display text-base sm:text-lg" style={{ color: selected ? openProject.accent : WORK.stone }}>
                          {item.number}
                        </span>
                        <span className="mt-1 block font-display text-base leading-none sm:text-2xl" style={{ color: WORK.charcoal }}>
                          {item.label}
                        </span>
                        <span className="mt-2 hidden text-xs leading-relaxed sm:block" style={{ color: WORK.wood }}>
                          {item.line}
                        </span>
                        {selected && (
                          <motion.span
                            layoutId="lab-phase-line"
                            aria-hidden="true"
                            className="absolute inset-x-3 bottom-0 h-0.5 sm:inset-x-5"
                            style={{ backgroundColor: openProject.accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${openProject.slug}-${phase.id}`}
                    id={`lab-${openProject.slug}-panel-${phase.id}`}
                    role="tabpanel"
                    aria-labelledby={`lab-${openProject.slug}-tab-${phase.id}`}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, x: motionTokens.distanceSmall }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, x: -motionTokens.distanceSmall }}
                    transition={{ duration: motionTokens.durationBase, ease: motionTokens.easeOrganic }}
                    className="mt-5 grid gap-5 sm:mt-7 sm:gap-7 lg:grid-cols-[minmax(14rem,0.64fr)_minmax(0,1.36fr)] lg:gap-10"
                  >
                    <aside
                      className="rounded-2xl border p-4 sm:p-6"
                      style={{
                        borderColor: openProject.accent + "55",
                        background: `linear-gradient(145deg, ${openProject.accent}18, rgba(255,255,255,0.55))`,
                      }}
                    >
                      <p className="font-display text-4xl font-normal sm:text-5xl" style={{ color: openProject.accent }}>
                        {phase.number}
                      </p>
                      <p className="mt-2 font-display text-2xl font-normal sm:mt-3 sm:text-3xl" style={{ color: WORK.charcoal }}>
                        {phase.label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed sm:mt-3" style={{ color: WORK.wood }}>
                        {phase.line}
                      </p>
                      <div className="mt-5 border-t pt-4 sm:mt-6 sm:pt-5" style={{ borderColor: openProject.accent + "44" }}>
                        <p className="text-[0.56rem] font-medium uppercase tracking-[0.15em]" style={{ color: WORK.stone }}>
                          Capability demonstrated
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {openProject.demonstrates.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border px-3 py-1 text-[0.66rem]"
                              style={{ borderColor: openProject.accent + "55", color: WORK.wood }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </aside>

                    <div className="grid gap-3 sm:gap-4">
                      {phase.chapterIndexes.map((chapterIndex) => {
                        const chapter = openProject.chapters[chapterIndex];
                        if (!chapter) return null;
                        return (
                          <section
                            key={chapter.label}
                            className="rounded-2xl border bg-white/55 p-4 sm:p-6"
                            style={{ borderColor: WORK.stone + "66" }}
                          >
                            <p className="flex items-baseline gap-3">
                              <span className="font-display text-sm" style={{ color: openProject.accent }} aria-hidden="true">
                                {String(chapterIndex + 1).padStart(2, "0")}
                              </span>
                              <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em]" style={{ color: WORK.wood }}>
                                {chapter.label}
                              </span>
                            </p>
                            <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: WORK.charcoal }}>
                              {chapter.body}
                            </p>
                            {chapter.samples && (
                              <div
                                className="mt-4 rounded-2xl border p-4 sm:mt-5 sm:p-5"
                                style={{ borderColor: openProject.accent + "55", backgroundColor: openProject.accent + "0D" }}
                              >
                                <p className="text-[0.55rem] font-medium uppercase tracking-[0.16em]" style={{ color: openProject.accent }}>
                                  Concept material
                                </p>
                                <ul className="mt-3 space-y-2">
                                  {chapter.samples.map((line) => (
                                    <li key={line} className="font-display text-lg leading-snug sm:text-xl" style={{ color: WORK.charcoal }}>
                                      {line}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </section>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div
                  className="mt-5 rounded-2xl border p-4 sm:mt-7 sm:p-6"
                  style={{ borderColor: openProject.accent + "66", backgroundColor: WORK.charcoal }}
                >
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-[0.56rem] font-medium uppercase tracking-[0.16em]" style={{ color: openProject.accent }}>
                        Measurement plan
                      </p>
                      <p className="mt-1 font-display text-2xl font-normal text-white">What would be watched after launch.</p>
                    </div>
                    <p className="text-[0.56rem] uppercase tracking-[0.14em] text-white/45">
                      A plan for measuring, never a claimed result
                    </p>
                  </div>
                  <ol className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3 lg:grid-cols-4">
                    {openProject.measurementPlan.map((item, index) => (
                      <li key={item} className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 sm:p-4">
                        <span className="font-display text-sm" style={{ color: openProject.accent }} aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="mt-2 text-xs leading-relaxed text-white/75">{item}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
