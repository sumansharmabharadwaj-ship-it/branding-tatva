"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { conceptProjects } from "@/data/conceptProjects";
import { track } from "@/lib/analytics";
import { WORK } from "@/sections/Work/palette";
import { motionTokens } from "@/lib/motionTokens";

// Branding Tatva Lab — concept studies presented at the same craft
// level as client work and labelled so clearly that confusion is
// impossible: the section frame, every dossier, and every sample line
// carries the concept framing. The studies open as dossiers, one at a
// time, using the accessible accordion pattern (aria-expanded plus
// hidden); reduced motion opens instantly. Capability proven through
// the quality of the thinking, never through implied experience.
export function TatvaLab() {
  const [openSlug, setOpenSlug] = useState<string | null>(conceptProjects[0].slug);
  const prefersReducedMotion = useReducedMotion();

  function toggle(slug: string) {
    const next = openSlug === slug ? null : slug;
    setOpenSlug(next);
    if (next) track("lab_project_explored", { study: slug });
  }

  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: WORK.cream }}>
      <Container className="max-w-5xl">
        <Reveal>
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
        </Reveal>

        <div className="mt-10">
          {conceptProjects.map((project) => {
            const open = openSlug === project.slug;
            return (
              <div key={project.slug} className="border-t" style={{ borderColor: WORK.stone + "88" }}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`lab-${project.slug}`}
                  onClick={() => toggle(project.slug)}
                  className="group grid w-full grid-cols-[1fr_auto] items-baseline gap-4 py-6 text-left focus-visible:outline focus-visible:outline-2 sm:py-7"
                  style={{ outlineColor: WORK.moss }}
                >
                  <span>
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-display text-2xl font-normal transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl" style={{ color: WORK.charcoal }}>
                        {project.conceptName}
                      </span>
                      <span className="text-sm" style={{ color: WORK.wood }}>
                        {project.title}
                      </span>
                      <span
                        className="rounded-full border px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.14em]"
                        style={{ borderColor: project.accent + "88", color: project.accent }}
                      >
                        Concept work
                      </span>
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.14em]" style={{ color: WORK.stone }}>
                      {project.sector}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`text-xl font-light transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                    style={{ color: open ? project.accent : WORK.stone }}
                  >
                    +
                  </span>
                </button>

                <div id={`lab-${project.slug}`} hidden={!open}>
                  {open && (
                    <motion.div
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: motionTokens.durationBase, ease: motionTokens.easeOrganic }}
                      className="pb-10"
                    >
                      <div className="flex flex-wrap gap-2">
                        {project.demonstrates.map((d) => (
                          <span
                            key={d}
                            className="rounded-full border px-3 py-1 text-xs"
                            style={{ borderColor: WORK.stone, color: WORK.wood }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>

                      <div className="mt-8 space-y-7">
                        {project.chapters.map((chapter, i) => (
                          <div key={chapter.label} className="grid gap-2 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8">
                            <p className="flex items-baseline gap-3">
                              <span className="font-display text-sm" style={{ color: project.accent }} aria-hidden="true">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: WORK.wood }}>
                                {chapter.label}
                              </span>
                            </p>
                            <div>
                              <p className="text-sm leading-relaxed" style={{ color: WORK.charcoal }}>
                                {chapter.body}
                              </p>
                              {chapter.samples && (
                                <div className="mt-3 rounded-xl border p-4" style={{ borderColor: WORK.stone + "88", backgroundColor: "rgba(255,255,255,0.5)" }}>
                                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: WORK.stone }}>
                                    Concept material
                                  </p>
                                  <ul className="mt-2 space-y-1.5">
                                    {chapter.samples.map((line) => (
                                      <li key={line} className="font-display text-base leading-snug" style={{ color: WORK.charcoal }}>
                                        {line}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        <div className="grid gap-2 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8">
                          <p className="flex items-baseline gap-3">
                            <span className="font-display text-sm" style={{ color: project.accent }} aria-hidden="true">
                              {String(project.chapters.length + 1).padStart(2, "0")}
                            </span>
                            <span className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: WORK.wood }}>
                              The measurement plan
                            </span>
                          </p>
                          <div>
                            <ul className="space-y-1.5">
                              {project.measurementPlan.map((m) => (
                                <li key={m} className="text-sm leading-relaxed before:mr-2 before:content-['·']" style={{ color: WORK.charcoal }}>
                                  {m}
                                </li>
                              ))}
                            </ul>
                            <p className="mt-2 text-[0.62rem] uppercase tracking-[0.14em]" style={{ color: WORK.stone }}>
                              A plan for measuring, never a claimed result
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="h-px" style={{ backgroundColor: WORK.stone + "88" }} aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
