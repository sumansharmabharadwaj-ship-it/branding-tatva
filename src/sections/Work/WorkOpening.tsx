"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { useLenis } from "@/components/SmoothScrollProvider";
import { projects } from "@/data/projects";
import { getWorkTaxonomy } from "@/data/workTaxonomy";
import { WORK, EASE_ORGANIC } from "@/sections/Work/palette";

const LINES = ["The work is easier", "to judge when the", "decisions are visible."];
const ROTATION_MS = 2800;

function decisiveLine(index: number) {
  const project = projects[index];
  if (!project) return "";
  const source = project.hook ?? project.reflection ?? project.outcome;
  return source.split(/\.\s/)[0] + (source.includes(". ") ? "." : "");
}

export function WorkOpening() {
  const prefersReducedMotion = useHydratedReducedMotion();
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = projects[active] ?? projects[0];

  useEffect(() => {
    if (prefersReducedMotion || paused || projects.length < 2) return;
    const interval = window.setInterval(() => {
      setActive((index) => (index + 1) % projects.length);
    }, ROTATION_MS);
    return () => window.clearInterval(interval);
  }, [paused, prefersReducedMotion]);

  if (!current) return null;

  const record = getWorkTaxonomy(current.slug);

  function jumpTo(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const element = document.getElementById(id);
    if (!element) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(element, { offset: -80 });
    else element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: WORK.cream }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[18%] -top-[24%] h-[72%] w-[70%] rounded-full opacity-80"
        style={{
          background: `radial-gradient(ellipse at center, ${WORK.mist} 0%, rgba(221,226,220,0.44) 44%, transparent 72%)`,
        }}
      />

      <Container className="relative pb-16 pt-28 sm:pb-24 sm:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.15fr] lg:gap-16 xl:gap-20">
          <div>
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.62 }}
              className="text-sm font-medium uppercase tracking-[0.2em]"
              style={{ color: WORK.olive }}
            >
              Work / evidence
            </motion.p>

            <h1
              className="mt-5 font-display text-[clamp(2.75rem,5.8vw,4.9rem)] font-normal leading-[1.03] tracking-[-0.015em]"
              style={{ color: WORK.charcoal }}
            >
              {LINES.map((line, index) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: prefersReducedMotion ? 0 : 0.08 + index * 0.14, ease: EASE_ORGANIC }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: prefersReducedMotion ? 0 : 0.56, ease: EASE_ORGANIC }}
              className="mt-6 max-w-lg text-base leading-relaxed sm:text-lg"
              style={{ color: WORK.wood }}
            >
              Real engagements first. Clearly labelled concept work and independent analysis after. Every chapter reveals the problem, the call, and what changed.
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: prefersReducedMotion ? 0 : 0.7, ease: EASE_ORGANIC }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#index"
                onClick={(event) => jumpTo(event, "index")}
                className="group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: WORK.forest, outlineColor: WORK.moss }}
              >
                Explore the evidence
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
              <a
                href="#find-relevant-proof"
                onClick={(event) => jumpTo(event, "find-relevant-proof")}
                className="link-underline text-sm font-medium"
                style={{ color: WORK.forest }}
              >
                Start with your problem <span aria-hidden="true">→</span>
              </a>
            </motion.div>

            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.62, delay: prefersReducedMotion ? 0 : 0.86 }}
              className="mt-8 text-xs uppercase tracking-[0.15em]"
              style={{ color: WORK.stone }}
            >
              Founder-led strategy, writing, direction, and delivery
            </motion.p>
          </div>

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.76, delay: prefersReducedMotion ? 0 : 0.3, ease: EASE_ORGANIC }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            className="min-w-0"
          >
            <div
              id="hero-project-preview"
              role="tabpanel"
              className="relative overflow-hidden rounded-[1.5rem] border shadow-[0_26px_80px_rgba(31,58,40,0.18)]"
              style={{ borderColor: "rgba(85,107,74,0.24)", backgroundColor: WORK.forest }}
            >
              <Link href={`/work/${current.slug}`} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" style={{ outlineColor: WORK.moss }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={current.slug}
                      src={record.evidencePoster}
                      alt={`${current.title} evidence diagram`}
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.58, ease: EASE_ORGANIC }}
                    />
                  </AnimatePresence>

                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(8,12,10,0.02) 32%, rgba(8,12,10,0.9) 100%)" }}
                  />

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
                    <span className="rounded-full border border-white/30 bg-black/20 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                      {record.tier === "flagship" ? "Flagship case study" : "Project story"}
                    </span>
                    <span className="font-display text-sm text-white/85">
                      {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={`${current.slug}-copy`}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: EASE_ORGANIC }}
                      >
                        <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em]" style={{ color: WORK.sand }}>
                          {record.evidenceLabel} · {current.industry}
                        </p>
                        <h2 className="mt-1 font-display text-3xl font-normal text-white sm:text-4xl">{current.title}</h2>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{decisiveLine(active)}</p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
                          Open the project <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </Link>
            </div>

            <div role="tablist" aria-label="Choose a project preview" className="mt-3 grid grid-cols-5 gap-2">
              {projects.map((project, index) => {
                const selected = active === index;
                return (
                  <button
                    key={project.slug}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="hero-project-preview"
                    onClick={() => setActive(index)}
                    className="min-h-11 rounded-xl border px-2 py-2 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-3"
                    style={{
                      borderColor: selected ? WORK.moss : "rgba(181,179,170,0.7)",
                      backgroundColor: selected ? WORK.forest : "rgba(255,255,255,0.42)",
                      color: selected ? "white" : WORK.wood,
                      outlineColor: WORK.moss,
                    }}
                    title={project.title}
                  >
                    <span className="block font-display text-sm">{String(index + 1).padStart(2, "0")}</span>
                    <span className="sr-only">{project.title}</span>
                    <span className="mt-0.5 hidden truncate text-[0.58rem] uppercase tracking-[0.1em] xl:block" aria-hidden="true">
                      {project.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
