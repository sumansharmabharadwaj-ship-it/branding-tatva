"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import type { Project } from "@/data/projects";
import { WORK, EASE_ORGANIC } from "@/sections/Work/palette";
import { track } from "@/lib/analytics";

// Work Page 2.0 selected work index — an editorial contents structure,
// deliberately unlike a card gallery. Desktop: project rows on the
// left (number, title, industry, one decisive sentence, view action)
// with a live preview surface on the right that changes as rows
// receive hover or keyboard focus; rows away from the pointer drop
// contrast. Mobile renders each row's still inline, so nothing depends
// on hover. Every decisive sentence is that project's own recorded
// line (hook, reflection, or closing quote), never new copy.
function decisiveLine(p: Project) {
  const source = p.hook ?? p.reflection ?? p.closingQuote ?? p.outcome;
  return source.split(/(?<=\.)\s/)[0];
}

export function WorkIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const current = projects[active];

  return (
    <section id="index" className="scroll-mt-24 py-16 sm:py-24" style={{ backgroundColor: WORK.cream }}>
      <Container className="max-w-6xl">
        <Reveal>
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
              Contents
            </h2>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: WORK.stone }}>
              {String(projects.length).padStart(2, "0")} engagements
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div role="list">
            {projects.map((project, i) => {
              const isActive = active === i;
              return (
                <Reveal key={project.slug} delay={i * 0.06}>
                  <div role="listitem" className="relative">
                    <div className="h-px" style={{ backgroundColor: WORK.stone + "66" }} aria-hidden="true" />
                    <Link
                      href={`/work/${project.slug}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => track("case_study_click", { project: project.slug })}
                      onFocus={() => setActive(i)}
                      className="group grid grid-cols-[2.5rem_1fr] gap-4 py-6 transition-all duration-500 focus-visible:outline focus-visible:outline-2 sm:grid-cols-[3rem_1fr_auto] sm:gap-6 sm:py-7"
                      style={{
                        opacity: prefersReducedMotion || isActive ? 1 : 0.55,
                        transform: !prefersReducedMotion && isActive ? "translateX(8px)" : "translateX(0)",
                        outlineColor: WORK.moss,
                      }}
                    >
                      <span className="pt-1 font-display text-base" style={{ color: isActive ? WORK.olive : WORK.stone }} aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block font-display text-2xl font-normal leading-snug sm:text-3xl" style={{ color: WORK.charcoal }}>
                          {project.title}
                        </span>
                        <span className="mt-1 block text-xs font-medium uppercase tracking-[0.15em]" style={{ color: WORK.olive }}>
                          {project.industry}
                        </span>
                        <span className="mt-2 block max-w-md text-sm leading-relaxed" style={{ color: WORK.wood }}>
                          {decisiveLine(project)}
                        </span>
                        {/* Mobile preview — the same real still the desktop
                            surface shows, inline so nothing hides behind
                            hover. */}
                        <span className="mt-4 block overflow-hidden rounded-xl lg:hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={project.cardImage} alt="" className="block h-auto w-full" loading="lazy" />
                        </span>
                      </span>
                      <span
                        className="hidden items-center gap-2 self-center text-sm transition-transform duration-300 group-hover:translate-x-1 sm:flex"
                        style={{ color: isActive ? WORK.forest : WORK.stone }}
                      >
                        View project <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </div>
                </Reveal>
              );
            })}
            <div className="h-px" style={{ backgroundColor: WORK.stone + "66" }} aria-hidden="true" />
          </div>

          {/* The preview surface — one fixed frame, the active row's
              real still settling into it. Scale 1.02 to 1 and a fade,
              nothing beyond the threshold where motion competes with
              reading. */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28 overflow-hidden rounded-2xl" style={{ backgroundColor: WORK.mist }}>
              <div className="relative aspect-[4/3]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={current.slug}
                    src={current.cardImage}
                    alt={`${current.title} preview`}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: EASE_ORGANIC }}
                  />
                </AnimatePresence>
              </div>
              <div className="flex items-baseline justify-between px-5 py-4" style={{ backgroundColor: WORK.forest }}>
                <p className="font-display text-lg font-normal text-white">{current.title}</p>
                <p className="text-xs uppercase tracking-[0.15em]" style={{ color: WORK.sage }}>
                  {current.industry}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
