"use client";

import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import type { Project } from "@/data/projects";
import { getWorkTaxonomy, WORK_NEEDS, type WorkFilterId } from "@/data/workTaxonomy";
import { WORK, EASE_ORGANIC } from "@/sections/Work/palette";
import { track } from "@/lib/analytics";

function decisiveLine(project: Project) {
  const source = project.hook ?? project.reflection ?? project.closingQuote ?? project.outcome;
  return source.split(/(?<=\.)\s/)[0];
}

export function WorkIndex({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<WorkFilterId>("all");
  const [active, setActive] = useState(0);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const animateTransitions = hydrated && !prefersReducedMotion;

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((project) => getWorkTaxonomy(project.slug).needs.includes(filter))),
    [filter, projects],
  );
  const current = filtered[active] ?? filtered[0] ?? projects[0];
  const activeNeed = WORK_NEEDS.find((need) => need.id === filter) ?? WORK_NEEDS[0];

  if (!current) return null;

  const currentRecord = getWorkTaxonomy(current.slug);

  function chooseFilter(next: WorkFilterId) {
    setFilter(next);
    setActive(0);
    track("work_filter_selected", { filter: next });
  }

  function openProject(project: Project, source: string) {
    track("case_study_opened", { project: project.slug, source });
  }

  return (
    <section id="index" className="scroll-mt-24 py-16 sm:py-24" style={{ backgroundColor: WORK.cream }}>
      <Container className="max-w-6xl">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.olive }}>
                Work index
              </p>
              <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
                Find the proof closest to the problem.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: WORK.wood }}>
                Scan everything, or filter by the condition your brand is currently trying to change.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: WORK.stone }} aria-live="polite">
              {String(filtered.length).padStart(2, "0")} of {String(projects.length).padStart(2, "0")} engagements
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter work by business problem">
            {WORK_NEEDS.map((need) => {
              const selected = filter === need.id;
              return (
                <button
                  key={need.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => chooseFilter(need.id)}
                  className="min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    borderColor: selected ? WORK.forest : WORK.stone,
                    backgroundColor: selected ? WORK.forest : "transparent",
                    color: selected ? "white" : WORK.wood,
                    outlineColor: WORK.moss,
                  }}
                >
                  {need.label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm" style={{ color: WORK.moss }} aria-live="polite">
            {activeNeed.description}
          </p>
        </Reveal>

        <div className="mt-8 lg:hidden" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              id="mobile-work-preview"
              key={current.slug}
              data-mobile-work-preview
              initial={animateTransitions ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={animateTransitions ? { opacity: 0, y: -8 } : undefined}
              transition={{ duration: animateTransitions ? 0.38 : 0, ease: EASE_ORGANIC }}
              className="overflow-hidden rounded-[1.4rem] border shadow-[0_18px_55px_rgba(31,58,40,0.1)]"
              style={{ borderColor: WORK.stone + "88", backgroundColor: WORK.forest }}
            >
              <Link
                href={`/work/${current.slug}`}
                onClick={() => openProject(current, "mobile_active_work_preview")}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ outlineColor: WORK.moss }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentRecord.evidencePoster}
                    alt={`${current.title} evidence diagram`}
                    className="absolute inset-0 h-full w-full object-contain"
                    loading="eager"
                    decoding="async"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-16"
                    style={{ background: "linear-gradient(180deg, transparent, rgba(8,12,10,0.28))" }}
                  />
                </div>

                <div className="border-t p-5" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: WORK.sand }}>
                        {currentRecord.evidenceLabel} · {current.industry}
                      </p>
                      <h3 className="mt-1 font-display text-3xl font-normal leading-tight text-white">{current.title}</h3>
                    </div>
                    <span
                      className="shrink-0 rounded-full border px-2.5 py-1 text-[0.54rem] font-medium uppercase tracking-[0.11em]"
                      style={{ borderColor: "rgba(255,255,255,0.22)", color: WORK.sage }}
                    >
                      {currentRecord.tier === "flagship" ? "Flagship" : "Project story"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/78">{decisiveLine(current)}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
                    {currentRecord.tier === "flagship" ? "Open the case study" : "Open the project story"}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-4 grid gap-12 lg:mt-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div role="list" aria-label="Filtered projects">
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((project, index) => {
                const isActive = active === index;
                const record = getWorkTaxonomy(project.slug);
                return (
                  <motion.div
                    layout={animateTransitions}
                    key={project.slug}
                    role="listitem"
                    initial={animateTransitions ? { opacity: 0, y: 10 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={animateTransitions ? { opacity: 0, y: -8 } : undefined}
                    transition={{ duration: animateTransitions ? 0.36 : 0, ease: EASE_ORGANIC }}
                    className="relative"
                  >
                    <button
                      type="button"
                      aria-pressed={isActive}
                      aria-controls="mobile-work-preview"
                      onClick={() => setActive(index)}
                      className="grid min-h-[4.75rem] w-full grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-t px-1 py-3 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
                      style={{
                        borderColor: WORK.stone + "66",
                        backgroundColor: isActive ? "rgba(85,107,74,0.08)" : "transparent",
                        outlineColor: WORK.moss,
                      }}
                    >
                      <span className="font-display text-sm" style={{ color: isActive ? WORK.olive : WORK.stone }} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-lg leading-tight" style={{ color: WORK.charcoal }}>
                          {project.title}
                        </span>
                        <span className="mt-1 block truncate text-[0.56rem] font-medium uppercase tracking-[0.13em]" style={{ color: WORK.olive }}>
                          {record.evidenceLabel}
                        </span>
                      </span>
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full border font-display text-sm"
                        style={{
                          borderColor: isActive ? WORK.moss : WORK.stone,
                          color: isActive ? WORK.forest : WORK.wood,
                        }}
                        aria-hidden="true"
                      >
                        {isActive ? "•" : "+"}
                      </span>
                    </button>

                    <div className="hidden h-px lg:block" style={{ backgroundColor: WORK.stone + "66" }} aria-hidden="true" />
                    <Link
                      href={`/work/${project.slug}`}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => openProject(project, "desktop_filtered_work_index")}
                      onFocus={() => setActive(index)}
                      className={`group hidden gap-4 py-6 transition-all duration-500 focus-visible:outline focus-visible:outline-2 sm:grid-cols-[3rem_1fr_auto] sm:gap-6 sm:py-7 lg:grid ${
                        isActive ? "opacity-100" : "opacity-[0.82]"
                      }`}
                      style={{
                        transform: animateTransitions && isActive ? "translateX(8px)" : "translateX(0)",
                        outlineColor: WORK.moss,
                      }}
                    >
                      <span className="pt-1 font-display text-base" style={{ color: isActive ? WORK.olive : WORK.wood }} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span>
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-2xl font-normal leading-snug sm:text-3xl" style={{ color: WORK.charcoal }}>
                            {project.title}
                          </span>
                          <span
                            className="rounded-full border px-2.5 py-1 text-[0.56rem] font-medium uppercase tracking-[0.13em]"
                            style={{ borderColor: WORK.stone, color: WORK.moss }}
                          >
                            {record.tier === "flagship" ? "Flagship" : "Project story"}
                          </span>
                        </span>

                        <span className="mt-1 block text-xs font-medium uppercase tracking-[0.15em]" style={{ color: WORK.olive }}>
                          {record.evidenceLabel} · {project.industry}
                        </span>
                        <span className="mt-2 block max-w-md text-sm leading-relaxed" style={{ color: WORK.wood }}>
                          {decisiveLine(project)}
                        </span>

                        <span className="mt-3 flex flex-wrap gap-1.5" aria-label="Relevant business problems">
                          {record.needs.map((needId) => {
                            const need = WORK_NEEDS.find((item) => item.id === needId);
                            return need ? (
                              <span
                                key={needId}
                                className="rounded-full px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.1em]"
                                style={{ backgroundColor: WORK.mist, color: WORK.moss }}
                              >
                                {need.label}
                              </span>
                            ) : null;
                          })}
                        </span>
                      </span>

                      <span
                        className="flex items-center gap-2 self-center text-sm transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: isActive ? WORK.forest : WORK.moss }}
                      >
                        {record.tier === "flagship" ? "View case study" : "View project story"} <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div className="h-px" style={{ backgroundColor: WORK.stone + "66" }} aria-hidden="true" />
          </div>

          <div className="relative hidden lg:block">
            <div className="sticky top-28 overflow-hidden rounded-2xl" style={{ backgroundColor: WORK.mist }}>
              <div className="relative aspect-[4/3]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={current.slug}
                    src={currentRecord.evidencePoster}
                    alt={`${current.title} evidence diagram`}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={animateTransitions ? { opacity: 0, scale: 1.02 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={animateTransitions ? { opacity: 0 } : undefined}
                    transition={{ duration: animateTransitions ? 0.52 : 0, ease: EASE_ORGANIC }}
                  />
                </AnimatePresence>
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 58%, rgba(10,14,12,0.48) 100%)" }}
                />
                <p className="absolute bottom-4 left-4 rounded-full bg-black/30 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                  {currentRecord.tier === "flagship" ? "Flagship case study" : "Project story"}
                </p>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-5 py-4" style={{ backgroundColor: WORK.forest }}>
                <p className="font-display text-lg font-normal text-white">{current.title}</p>
                <p className="text-right text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: WORK.sage }}>
                  {currentRecord.evidenceLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
