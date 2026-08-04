"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { projects } from "@/data/projects";
import { ProjectFile } from "@/sections/Home/ProjectFile";

const ACTION: Record<string, string> = {
  "dr-haley-nutrition": "Watch the story",
  myshopineurope: "Open the file",
  "executive-springboard": "View the case",
  herbalcart: "View the case",
  "plaxonic-content-portfolio": "Open the file",
};

const DECISION: Record<string, { big: string; label: string }> = {
  myshopineurope: {
    big: "Craft over price",
    label: "the positioning refusal that reframed the platform",
  },
  "executive-springboard": {
    big: "Registrations",
    label: "content built to end in one, well past a like",
  },
  herbalcart: {
    big: "Wellness first",
    label: "perception moved from herbal supplement to modern brand",
  },
};

const TRAILS: Record<string, { signal: string; decision: string; proof: string }> = {
  "dr-haley-nutrition": {
    signal: "More posts were producing weaker audience response.",
    decision: "Post less, then make every remaining post earn its place.",
    proof: "Engagement moved from 0.71% to 2.81%; followers earned per post rose 104%.",
  },
  myshopineurope: {
    signal: "A new marketplace risked reading as generic access and cheap supply.",
    decision: "Position Indian craft, origin, and wellness heritage ahead of price.",
    proof: "A complete brand foundation and year long content operating system.",
  },
  "executive-springboard": {
    signal: "Social content was building awareness without a clear destination.",
    decision: "Sequence each platform toward webinar registration and mentor action.",
    proof: "An eight pillar, platform specific content system built around conversion.",
  },
  herbalcart: {
    signal: "A modern supplement range was being read through a purely herbal lens.",
    decision: "Explain supplementation as a practical gap filler for active lifestyles.",
    proof: "Five content formats ready to shoot and complete Hinglish video scripts.",
  },
  "plaxonic-content-portfolio": {
    signal: "One content tone failed to serve beginners and technical experts with equal credibility.",
    decision: "Give research, perspective, education, and fast consumption different jobs.",
    proof: "A sixteen piece authority portfolio structured to validate, challenge, humanise, and define.",
  },
};

const AUTO_ADVANCE_MS = 6200;
const MANUAL_PAUSE_MS = 18000;

export function EvidenceWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const manualPauseUntilRef = useRef(0);
  const frameRef = useRef(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.42 });
  const activeProject = projects[activeIndex] ?? projects[0];
  const activeTrail = TRAILS[activeProject.slug];

  function pauseAutoplay() {
    manualPauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
  }

  const moveTo = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const list = listRef.current;
      if (!list || !projects.length) return;

      const safeIndex = ((index % projects.length) + projects.length) % projects.length;
      const target = list.children[safeIndex];
      if (!(target instanceof HTMLElement)) return;

      setActiveIndex(safeIndex);
      list.scrollTo({
        left: Math.max(0, target.offsetLeft - 8),
        behavior: behavior ?? (prefersReducedMotion ? "auto" : "smooth"),
      });
    },
    [prefersReducedMotion],
  );

  function syncActiveFromScroll() {
    if (frameRef.current) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0;
      const list = listRef.current;
      if (!list) return;

      const viewportCenter = list.scrollLeft + list.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      Array.from(list.children).forEach((child, index) => {
        if (!(child instanceof HTMLElement)) return;
        const center = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(center - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    });
  }

  useEffect(() => {
    if (prefersReducedMotion || !inView) return;

    const timer = window.setInterval(() => {
      if (
        Date.now() < manualPauseUntilRef.current ||
        openSlug ||
        document.hidden
      ) {
        return;
      }
      moveTo(activeIndex + 1);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, inView, moveTo, openSlug, prefersReducedMotion]);

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "evidence") return;
      manualPauseUntilRef.current = Date.now() + 750;
      moveTo(0, "auto");
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => window.removeEventListener("bt:home-chapter", onChapter as EventListener);
  }, [moveTo]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    function syncPlayback() {
      const video = activeVideoRef.current;
      if (!video) return;
      if (inView && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    }

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      activeVideoRef.current?.pause();
    };
  }, [activeIndex, inView, prefersReducedMotion]);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-soil py-16 sm:py-24"
      aria-labelledby="evidence-wall-title"
      onFocusCapture={pauseAutoplay}
      onPointerDown={pauseAutoplay}
      onTouchStart={pauseAutoplay}
    >
      <BackgroundVideo
        video="/videos/pexels-fog-sunrise.mp4"
        videoWebm="/videos/pexels-fog-sunrise.webm"
        poster="/images/pexels-fog-sunrise-poster.jpg"
      />
      <div className="absolute inset-0 bg-soil/82" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 bottom-[-30%] h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(184,90,52,0.16), transparent 68%)" }}
        animate={
          prefersReducedMotion || !inView
            ? undefined
            : { x: [0, 110, 0], y: [0, -42, 0], scale: [1, 1.14, 1] }
        }
        transition={
          prefersReducedMotion || !inView
            ? undefined
            : { duration: 17, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <Container className="relative max-w-[100rem]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
          <Reveal className="lg:w-80 lg:shrink-0 lg:pt-4">
            <div className="flex gap-5">
              <div aria-hidden="true" className="hidden flex-col items-center pt-2 sm:flex">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={activeIndex}
                    className="font-display text-xs text-ivory/65"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    {String(activeIndex + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
                <span className="relative my-2 h-20 w-px overflow-hidden bg-ivory/20">
                  <motion.span
                    className="absolute inset-x-0 top-0 origin-top bg-sandstone"
                    animate={{ height: `${((activeIndex + 1) / projects.length) * 100}%` }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-sandstone" />
                <span className="my-2 h-16 w-px bg-ivory/25" />
                <span className="font-display text-xs text-ivory/50">
                  {String(projects.length).padStart(2, "0")}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-sandstone">The work</p>
                <h2
                  id="evidence-wall-title"
                  className="mt-3 font-display text-display-sm font-normal leading-[1.05] text-ivory lg:text-display-md"
                >
                  Decisions.
                  <br />
                  Then proof.
                </h2>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/75">
                  Five real engagements. Each one begins with the signal that was misread, then the decision that changed the direction.
                </p>
                <p className="mt-3 max-w-xs text-xs leading-relaxed text-ivory/48">
                  The archive advances while you watch. Select a file and it waits.
                </p>
                <Link
                  href="/work"
                  className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-sandstone transition-colors duration-300 hover:text-ivory"
                >
                  Explore the full archive <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0 lg:flex-1">
            <ul
              ref={listRef}
              className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-5 pt-3"
              aria-label="Project archive"
              onScroll={syncActiveFromScroll}
              onWheel={pauseAutoplay}
            >
              {projects.map((project, index) => {
                const stat = project.stats?.[0];
                const fallback = DECISION[project.slug];
                const isActive = index === activeIndex;

                return (
                  <motion.li
                    key={project.slug}
                    className="group relative w-64 shrink-0 snap-start sm:w-72"
                    animate={{ y: isActive ? -8 : 0, scale: isActive ? 1.035 : 0.985, opacity: isActive ? 1 : 0.72 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      type="button"
                      aria-label={`Open project file: ${project.title}`}
                      onClick={() => {
                        pauseAutoplay();
                        setOpenSlug(project.slug);
                      }}
                      className="absolute inset-0 z-[5] rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                    />

                    <span
                      className={`flex h-full flex-col overflow-hidden rounded-2xl border transition-[border-color,box-shadow] duration-500 ${
                        isActive
                          ? "border-sandstone/60 shadow-[0_24px_70px_rgba(20,17,14,0.34)]"
                          : "border-ivory/12 group-hover:border-sandstone/45"
                      }`}
                      style={{ backgroundColor: "rgba(244,239,230,0.055)" }}
                    >
                      <span className="relative block h-40 w-full overflow-hidden" style={{ backgroundColor: project.accent }}>
                        {project.cardImage && (
                          <Image
                            src={project.cardImage}
                            alt=""
                            fill
                            sizes="288px"
                            style={{ objectFit: "cover" }}
                            className="transition-transform duration-700 group-hover:scale-[1.05]"
                          />
                        )}

                        <AnimatePresence>
                          {isActive && inView && project.cardVideo && (
                            <motion.video
                              ref={activeVideoRef}
                              key={project.cardVideo}
                              className="absolute inset-0 h-full w-full object-cover"
                              src={project.cardVideo}
                              poster={project.cardImage}
                              muted
                              loop
                              autoPlay
                              playsInline
                              preload="metadata"
                              onCanPlay={(event) => {
                                if (isActive && inView) void event.currentTarget.play().catch(() => {});
                              }}
                              initial={{ opacity: 0, scale: 1.04 }}
                              animate={{ opacity: 1, scale: 1.1 }}
                              exit={{ opacity: 0 }}
                              transition={{ opacity: { duration: 0.8 }, scale: { duration: 7, ease: "linear" } }}
                            />
                          )}
                        </AnimatePresence>

                        <span
                          aria-hidden="true"
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(180deg, transparent 38%, rgba(20,17,14,0.5) 100%)" }}
                        />
                        {isActive && inView && (
                          <motion.span
                            aria-hidden="true"
                            className="absolute -inset-y-6 -left-1/2 w-1/3 rotate-12 bg-ivory/18 blur-xl"
                            animate={{ x: ["0%", "620%"] }}
                            transition={{ duration: 4.6, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                          />
                        )}
                      </span>

                      <span className="flex flex-1 flex-col p-5">
                        <span className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ivory/60">{project.title}</span>
                        <span className="mt-2 font-display text-3xl font-normal leading-none text-ivory sm:text-4xl">
                          {stat ? stat.value : fallback?.big}
                        </span>
                        <span className="mt-2 text-xs leading-relaxed text-ivory/70">
                          {stat ? stat.label : fallback?.label}
                        </span>
                        <span className="mt-auto pt-4 text-[0.65rem] uppercase tracking-[0.15em] text-ivory/50">{project.industry}</span>
                        <Link
                          href={`/work/${project.slug}`}
                          className="relative z-10 mt-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-300 hover:text-ivory"
                          style={{ color: project.accent }}
                        >
                          {ACTION[project.slug] ?? "View the case"} <span aria-hidden="true">→</span>
                        </Link>
                      </span>
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-ivory/42">Active file</p>
                <p className="mt-1 font-display text-xl text-ivory">{activeProject.title}</p>
              </div>

              <div className="flex items-center gap-2" aria-label="Choose a project file">
                {projects.map((project, index) => {
                  const selected = index === activeIndex;
                  return (
                    <button
                      key={project.slug}
                      type="button"
                      aria-label={`Show ${project.title}`}
                      aria-pressed={selected}
                      onClick={() => {
                        pauseAutoplay();
                        moveTo(index);
                      }}
                      className="flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-[0.58rem] tracking-[0.12em] transition-[border-color,background-color,color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                      style={{
                        borderColor: selected ? project.accent : "rgba(244,239,230,0.14)",
                        backgroundColor: selected ? `${project.accent}22` : "transparent",
                        color: selected ? "#F4EFE6" : "rgba(244,239,230,0.48)",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Show previous project"
                  onClick={() => {
                    pauseAutoplay();
                    moveTo(activeIndex - 1);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-colors hover:border-sandstone/55 hover:text-sandstone focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Show next project"
                  onClick={() => {
                    pauseAutoplay();
                    moveTo(activeIndex + 1);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-colors hover:border-sandstone/55 hover:text-sandstone focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                >
                  →
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeProject.slug}
                className="mt-5 grid overflow-hidden rounded-3xl border border-ivory/12 bg-ivory/[0.045] backdrop-blur-md md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                aria-live="polite"
              >
                {[
                  ["The signal", activeTrail.signal],
                  ["The decision", activeTrail.decision],
                  ["Recorded proof", activeTrail.proof],
                ].map(([label, value], index) => (
                  <div key={label} className="contents">
                    <div className="px-5 py-5 sm:px-6 sm:py-6">
                      <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em]" style={{ color: activeProject.accent }}>
                        {label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-ivory/80">{value}</p>
                    </div>
                    {index < 2 && (
                      <div aria-hidden="true" className="relative hidden w-12 items-center justify-center md:flex">
                        <span className="h-px w-full bg-ivory/10" />
                        <motion.span
                          className="absolute h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: activeProject.accent }}
                          animate={
                            prefersReducedMotion || !inView
                              ? undefined
                              : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }
                          }
                          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1, ease: "easeInOut", delay: index * 0.35 }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </Container>

      <ProjectFile
        project={projects.find((project) => project.slug === openSlug) ?? null}
        onClose={() => setOpenSlug(null)}
      />
    </section>
  );
}
