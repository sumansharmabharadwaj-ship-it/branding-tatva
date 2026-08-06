"use client";

import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
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
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const animateTransitions = hydrated && !prefersReducedMotion;
  const lenis = useLenis();
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const current = projects[active] ?? projects[0];

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px 0px 120px 0px" },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canRotate =
      hydrated &&
      !prefersReducedMotion &&
      inView &&
      !interactionPaused &&
      !manualPaused &&
      projects.length > 1;

    if (!canRotate) return;

    const interval = window.setInterval(() => {
      setActive((index) => (index + 1) % projects.length);
    }, ROTATION_MS);

    return () => window.clearInterval(interval);
  }, [hydrated, inView, interactionPaused, manualPaused, prefersReducedMotion]);

  if (!current) return null;

  const record = getWorkTaxonomy(current.slug);

  function jumpTo(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const element = document.getElementById(id);
    if (!element) return;
    event.preventDefault();
    if (lenis) lenis.scrollTo(element, { offset: -96 });
    else element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  function chooseProject(index: number, pauseAfterSelection = true) {
    setActive(index);
    if (pauseAfterSelection) setManualPaused(true);
  }

  function handleTabKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % projects.length;
    if (event.key === "ArrowLeft") next = (index - 1 + projects.length) % projects.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = projects.length - 1;

    chooseProject(next);
    window.requestAnimationFrame(() => {
      document.getElementById(`hero-project-tab-${projects[next]?.slug}`)?.focus();
    });
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

      <Container className="relative pb-12 pt-24 min-[430px]:pt-28 sm:pb-24 sm:pt-36">
        <div className="grid items-start gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12 xl:gap-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.olive }}>
              Work / evidence
            </p>

            <h1
              className="mt-4 font-display text-[2.45rem] font-normal leading-[1.02] tracking-[-0.015em] min-[430px]:text-[2.65rem] sm:mt-5 sm:text-[clamp(2.75rem,5.1vw,4.55rem)] sm:leading-[1.03]"
              style={{ color: WORK.charcoal }}
            >
              {LINES.map((line) => (
                <span key={line} className="block lg:whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h1>

            <p className="mt-4 max-w-lg text-[0.98rem] leading-[1.62] sm:mt-6 sm:text-lg sm:leading-relaxed" style={{ color: WORK.wood }}>
              Real engagements first. Clearly labelled concept work and independent analysis after. Every chapter reveals the problem, the call, and what changed.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
              <a
                href="#index"
                onClick={(event) => jumpTo(event, "index")}
                className="group inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6 sm:py-3"
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
                className="link-underline text-[0.82rem] font-medium sm:text-sm"
                style={{ color: WORK.forest }}
              >
                Start with your problem <span aria-hidden="true">→</span>
              </a>
            </div>

            <p className="mt-8 hidden text-xs uppercase tracking-[0.15em] sm:block" style={{ color: WORK.stone }}>
              Founder-led strategy, writing, direction, and delivery
            </p>
          </div>

          <div
            ref={stageRef}
            onMouseEnter={() => setInteractionPaused(true)}
            onMouseLeave={() => setInteractionPaused(false)}
            onFocusCapture={() => setInteractionPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setInteractionPaused(false);
              }
            }}
            className="min-w-0 lg:pt-14"
          >
            <div
              id="hero-project-preview"
              role="tabpanel"
              aria-labelledby={`hero-project-tab-${current.slug}`}
              className="relative overflow-hidden rounded-[1.5rem] border shadow-[0_26px_80px_rgba(31,58,40,0.18)]"
              style={{ borderColor: "rgba(85,107,74,0.24)", backgroundColor: WORK.forest }}
            >
              <Link
                href={`/work/${current.slug}`}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ outlineColor: WORK.moss }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black/10">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={current.slug}
                      src={record.evidencePoster}
                      alt={`${current.title} evidence diagram`}
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={animateTransitions ? { opacity: 0, scale: 1.025 } : false}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={animateTransitions ? { opacity: 0 } : undefined}
                      transition={{ duration: animateTransitions ? 0.58 : 0, ease: EASE_ORGANIC }}
                    />
                  </AnimatePresence>
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-16"
                    style={{ background: "linear-gradient(180deg, transparent, rgba(8,12,10,0.3))" }}
                  />
                </div>

                <div
                  className="border-t p-4 sm:p-6"
                  style={{ borderColor: "rgba(255,255,255,0.12)", backgroundColor: WORK.forest }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`${current.slug}-copy`}
                      initial={animateTransitions ? { opacity: 0, y: 10 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={animateTransitions ? { opacity: 0, y: -6 } : undefined}
                      transition={{ duration: animateTransitions ? 0.38 : 0, ease: EASE_ORGANIC }}
                    >
                      <div className="flex items-start justify-between gap-4 sm:gap-5">
                        <div className="min-w-0">
                          <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em] sm:text-[0.62rem] sm:tracking-[0.18em]" style={{ color: WORK.sand }}>
                            {record.evidenceLabel} · {current.industry}
                          </p>
                          <h2 className="mt-1 font-display text-2xl font-normal text-white min-[430px]:text-3xl sm:text-4xl">{current.title}</h2>
                        </div>
                        <span className="shrink-0 font-display text-xs text-white/70 sm:text-sm">
                          {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-2.5 max-w-xl text-[0.82rem] leading-relaxed text-white/80 sm:mt-3 sm:text-base">{decisiveLine(active)}</p>
                      <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white sm:mt-4">
                        Open the project <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Link>
            </div>

            <div className="mt-3 flex items-stretch gap-2">
              <div role="tablist" aria-label="Choose a project preview" className="grid min-w-0 flex-1 grid-cols-5 gap-2">
                {projects.map((project, index) => {
                  const selected = active === index;
                  return (
                    <button
                      key={project.slug}
                      id={`hero-project-tab-${project.slug}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="hero-project-preview"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => chooseProject(index)}
                      onKeyDown={(event) => handleTabKey(event, index)}
                      className="min-h-11 min-w-0 rounded-xl border px-2 py-2 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-3"
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

              <button
                type="button"
                aria-label={
                  prefersReducedMotion
                    ? "Project preview is static in reduced-motion mode"
                    : manualPaused
                      ? "Resume automatic project preview"
                      : "Pause automatic project preview"
                }
                aria-pressed={manualPaused}
                disabled={!hydrated || prefersReducedMotion}
                onClick={() => setManualPaused((value) => !value)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-55"
                style={{ borderColor: WORK.stone, color: WORK.forest, outlineColor: WORK.moss }}
                title={manualPaused ? "Resume preview" : "Pause preview"}
              >
                {manualPaused || prefersReducedMotion ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
