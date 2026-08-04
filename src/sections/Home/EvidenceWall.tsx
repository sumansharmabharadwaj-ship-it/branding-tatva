"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

const AUTO_ADVANCE_MS = 6200;
const MANUAL_PAUSE_MS = 18000;

export function EvidenceWall() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const manualPauseUntilRef = useRef(0);
  const frameRef = useRef(0);
  const prefersReducedMotion = Boolean(useReducedMotion());

  function pauseAutoplay() {
    manualPauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
  }

  const moveTo = useCallback(
    (index: number) => {
      const list = listRef.current;
      const target = list?.children[index];
      if (!list || !(target instanceof HTMLElement)) return;

      setActiveIndex(index);
      list.scrollTo({
        left: Math.max(0, target.offsetLeft - 8),
        behavior: prefersReducedMotion ? "auto" : "smooth",
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
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      if (
        Date.now() < manualPauseUntilRef.current ||
        openSlug ||
        document.hidden
      ) {
        return;
      }

      moveTo((activeIndex + 1) % projects.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, moveTo, openSlug, prefersReducedMotion]);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return (
    <section className="relative overflow-hidden bg-soil py-16 sm:py-24">
      <BackgroundVideo
        video="/videos/pexels-fog-sunrise.mp4"
        videoWebm="/videos/pexels-fog-sunrise.webm"
        poster="/images/pexels-fog-sunrise-poster.jpg"
      />
      <div className="absolute inset-0 bg-soil/82" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 bottom-[-30%] h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(184,90,52,0.16), transparent 68%)",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, 110, 0], y: [0, -42, 0], scale: [1, 1.14, 1] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 17, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <Container className="relative max-w-[100rem]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
          <Reveal className="lg:w-80 lg:shrink-0">
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
                    animate={{
                      height: `${((activeIndex + 1) / projects.length) * 100}%`,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-sandstone" />
                <span className="my-2 h-16 w-px bg-ivory/25" />
                <span className="font-display text-xs text-ivory/50">
                  {String(projects.length).padStart(2, "0")}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-sandstone">
                  The work
                </p>
                <h2 className="mt-3 font-display text-display-sm font-normal leading-[1.05] text-ivory lg:text-display-md">
                  Evidence.
                  <br />
                  Not Portfolio.
                </h2>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/75">
                  Five real engagements. Each file opens on the decision that changed what the audience could understand.
                </p>
                <p className="mt-3 max-w-xs text-xs leading-relaxed text-ivory/48">
                  The archive moves on its own. Touch any file and it waits for you.
                </p>
                <Link
                  href="/work"
                  className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-sandstone transition-colors duration-300 hover:text-ivory"
                >
                  Explore the archive <span aria-hidden="true">→</span>
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
              onPointerDown={pauseAutoplay}
              onPointerEnter={pauseAutoplay}
              onWheel={pauseAutoplay}
              onTouchStart={pauseAutoplay}
            >
              {projects.map((project, index) => {
                const stat = project.stats?.[0];
                const fallback = DECISION[project.slug];
                const isActive = index === activeIndex;

                return (
                  <motion.li
                    key={project.slug}
                    className="group relative w-64 shrink-0 snap-start sm:w-72"
                    animate={{
                      y: isActive ? -8 : 0,
                      scale: isActive ? 1.035 : 0.985,
                      opacity: isActive ? 1 : 0.72,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
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
                      <span
                        className="relative block h-40 w-full overflow-hidden"
                        style={{ backgroundColor: project.accent }}
                      >
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
                          {isActive && project.cardVideo && (
                            <motion.video
                              key={project.cardVideo}
                              className="absolute inset-0 h-full w-full object-cover"
                              src={project.cardVideo}
                              poster={project.cardImage}
                              muted
                              loop
                              autoPlay
                              playsInline
                              preload="metadata"
                              initial={{ opacity: 0, scale: 1.04 }}
                              animate={{ opacity: 1, scale: 1.1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                opacity: { duration: 0.8 },
                                scale: { duration: 7, ease: "linear" },
                              }}
                            />
                          )}
                        </AnimatePresence>

                        <span
                          aria-hidden="true"
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(180deg, transparent 38%, rgba(20,17,14,0.5) 100%)",
                          }}
                        />
                        {isActive && (
                          <motion.span
                            aria-hidden="true"
                            className="absolute -inset-y-6 -left-1/2 w-1/3 rotate-12 bg-ivory/18 blur-xl"
                            animate={{ x: ["0%", "620%"] }}
                            transition={{
                              duration: 4.6,
                              repeat: Infinity,
                              repeatDelay: 3,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </span>

                      <span className="flex flex-1 flex-col p-5">
                        <span className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ivory/60">
                          {project.title}
                        </span>
                        <span className="mt-2 font-display text-3xl font-normal leading-none text-ivory sm:text-4xl">
                          {stat ? stat.value : fallback?.big}
                        </span>
                        <span className="mt-2 text-xs leading-relaxed text-ivory/70">
                          {stat ? stat.label : fallback?.label}
                        </span>
                        <span className="mt-auto pt-4 text-[0.65rem] uppercase tracking-[0.15em] text-ivory/50">
                          {project.industry}
                        </span>
                        <Link
                          href={`/work/${project.slug}`}
                          className="relative z-10 mt-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-300 hover:text-ivory"
                          style={{ color: project.accent }}
                        >
                          {ACTION[project.slug] ?? "View the case"}{" "}
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </span>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
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
