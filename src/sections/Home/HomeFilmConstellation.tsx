"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ChapterId =
  | "opening"
  | "diagnosis"
  | "evidence"
  | "scope"
  | "studio"
  | "paths"
  | "framework"
  | "elements"
  | "process"
  | "questions"
  | "invitation";

type Film = {
  video: string;
  poster: string;
  label: string;
};

// These fragments are reserved for chapters whose main argument benefits
// from a peripheral nature cue. Only the active chapter mounts its films,
// and only the primary fragment appears below 1680px. Chapters that already
// contain several local films remain intentionally free of another layer.
const CHAPTER_FILMS: Partial<Record<ChapterId, readonly [Film, Film]>> = {
  diagnosis: [
    {
      video: "/videos/higgsfield-process-ground.mp4",
      poster: "/images/higgsfield-process-ground-poster.jpg",
      label: "The visible symptom is rarely the whole problem.",
    },
    {
      video: "/videos/higgsfield-idea-sketch.mp4",
      poster: "/images/higgsfield-idea-sketch.jpg",
      label: "Diagnosis before decoration.",
    },
  ],
  paths: [
    {
      video: "/videos/higgsfield-process-ground.mp4",
      poster: "/images/higgsfield-process-ground-poster.jpg",
      label: "Begin with what must hold.",
    },
    {
      video: "/videos/higgsfield-process-shape.mp4",
      poster: "/images/higgsfield-process-shape-poster.jpg",
      label: "Then give the business a coherent form.",
    },
  ],
  framework: [
    {
      video: "/videos/higgsfield-process-listen.mp4",
      poster: "/images/higgsfield-process-listen-poster.jpg",
      label: "Each force answers a different strategic question.",
    },
    {
      video: "/videos/higgsfield-confident-light.mp4",
      poster: "/images/higgsfield-confident-light-poster.jpg",
      label: "Five signals, held inside one recognisable system.",
    },
  ],
  questions: [
    {
      video: "/videos/hero-valley.mp4",
      poster: "/images/hero-valley-poster.jpg",
      label: "Clarity arrives by removing one layer of fog at a time.",
    },
    {
      video: "/videos/pexels-golden-fog-sea.mp4",
      poster: "/images/pexels-golden-fog-sea-poster.jpg",
      label: "The practical shape should appear before the first call.",
    },
  ],
  invitation: [
    {
      video: "/videos/hero-goldendunes.mp4",
      poster: "/images/hero-goldendunes-poster.jpg",
      label: "The next decision should feel warmer than the uncertainty before it.",
    },
    {
      video: "/videos/about-hero-bg-meadow.mp4",
      poster: "/images/about-hero-bg-meadow-poster.jpg",
      label: "A living system begins with one committed direction.",
    },
  ],
};

const PLACEMENTS: Partial<Record<ChapterId, readonly [string, string]>> = {
  diagnosis: [
    "-right-8 top-[23vh] aspect-[3/4] w-[clamp(6.5rem,7.6vw,8.75rem)] rounded-[1.6rem]",
    "-left-7 bottom-[16vh] aspect-square w-[clamp(5.2rem,6vw,6.8rem)] rounded-full",
  ],
  paths: [
    "-right-9 top-[24vh] aspect-[3/4] w-[clamp(6.5rem,7.5vw,8.5rem)] rounded-[1.5rem]",
    "-left-8 bottom-[18vh] aspect-square w-[clamp(5.5rem,6.2vw,7rem)] rounded-[1.35rem]",
  ],
  framework: [
    "-left-8 top-[22vh] aspect-[4/5] w-[clamp(6.4rem,7.2vw,8.2rem)] rounded-[42%_58%_48%_52%/58%_42%_58%_42%]",
    "-right-7 bottom-[17vh] aspect-square w-[clamp(5.6rem,6.4vw,7.2rem)] rounded-[1.4rem]",
  ],
  questions: [
    "-right-8 top-[19vh] aspect-square w-[clamp(6.2rem,7vw,8rem)] rounded-full",
    "-left-10 bottom-[17vh] aspect-[5/4] w-[clamp(6.2rem,7vw,8.1rem)] rounded-[1.45rem]",
  ],
  invitation: [
    "-right-8 top-[20vh] aspect-[3/4] w-[clamp(6.8rem,7.8vw,9rem)] rounded-[46%_54%_44%_56%/56%_44%_56%_44%]",
    "-left-8 bottom-[14vh] aspect-square w-[clamp(5.6rem,6.4vw,7.3rem)] rounded-full",
  ],
};

const CHAPTER_LABELS: Partial<Record<ChapterId, string>> = {
  diagnosis: "Find the gap",
  paths: "Choose the path",
  framework: "Read the five forces",
  questions: "Clear the practical fog",
  invitation: "Make the next decision",
};

function isChapterId(value: string | undefined): value is ChapterId {
  return Boolean(
    value &&
      [
        "opening",
        "diagnosis",
        "evidence",
        "scope",
        "studio",
        "paths",
        "framework",
        "elements",
        "process",
        "questions",
        "invitation",
      ].includes(value),
  );
}

export function HomeFilmConstellation() {
  const pathname = usePathname();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [activeChapter, setActiveChapter] = useState<ChapterId>("opening");
  const [showSecondary, setShowSecondary] = useState(false);
  const chapterTargetsRef = useRef<HTMLElement[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1680px)");
    const update = () => setShowSecondary(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const main = document.getElementById("main-content");
    if (!main) return;

    let frame = 0;
    let cancelled = false;

    function resolveTargets() {
      chapterTargetsRef.current = Array.from(
        document.querySelectorAll<HTMLElement>("[data-home-chapter]"),
      );
      scheduleUpdate();
    }

    function updateChapter() {
      frame = 0;
      const targets = chapterTargetsRef.current;
      if (!targets.length) return;

      const anchor = window.scrollY + window.innerHeight * 0.42;
      let active = targets[0];
      targets.forEach((target) => {
        const top = window.scrollY + target.getBoundingClientRect().top;
        if (top <= anchor) active = target;
      });

      const next = active?.dataset.homeChapter;
      if (isChapterId(next)) setActiveChapter(next);
    }

    function scheduleUpdate() {
      if (cancelled || frame) return;
      frame = window.requestAnimationFrame(updateChapter);
    }

    function onChapterChange(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (isChapterId(detail?.id)) setActiveChapter(detail.id);
    }

    resolveTargets();
    const observer = new MutationObserver(resolveTargets);
    observer.observe(main, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-home-chapter"],
    });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("bt:home-chapter", onChapterChange as EventListener);

    const retry = window.setInterval(resolveTargets, 700);
    const stopRetry = window.setTimeout(() => window.clearInterval(retry), 5600);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearInterval(retry);
      window.clearTimeout(stopRetry);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("bt:home-chapter", onChapterChange as EventListener);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/" || prefersReducedMotion) return;
    const videos = videoRefs.current.filter(
      (video): video is HTMLVideoElement => Boolean(video),
    );

    function syncPlayback() {
      videos.forEach((video) => {
        if (document.hidden) video.pause();
        else void video.play().catch(() => {});
      });
    }

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      videos.forEach((video) => video.pause());
    };
  }, [activeChapter, pathname, prefersReducedMotion, showSecondary]);

  if (pathname !== "/" || prefersReducedMotion) return null;

  const chapterFilms = CHAPTER_FILMS[activeChapter];
  const placements = PLACEMENTS[activeChapter];
  const films = chapterFilms
    ? showSecondary
      ? chapterFilms
      : chapterFilms.slice(0, 1)
    : [];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[12] hidden overflow-hidden xl:block"
      data-home-film-constellation
    >
      <AnimatePresence mode="wait" initial={false}>
        {films.length > 0 && placements && (
          <motion.div
            key={activeChapter}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="absolute right-5 top-1/2 -translate-y-1/2 font-display text-[0.56rem] uppercase tracking-[0.2em] text-ivory/24 [writing-mode:vertical-rl]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
            >
              {CHAPTER_LABELS[activeChapter]}
            </motion.span>

            {films.map((film, index) => {
              const primary = index === 0;
              const direction = primary ? 1 : -1;

              return (
                <motion.figure
                  key={film.video}
                  className={[
                    "absolute overflow-hidden border border-ivory/16 bg-soil/38 shadow-[0_22px_70px_rgba(20,17,14,0.22)] backdrop-blur-sm",
                    placements[index],
                    !primary ? "hidden 2xl:block" : "",
                  ].join(" ")}
                  initial={{
                    opacity: 0,
                    x: direction * -18,
                    y: 10,
                    scale: 0.92,
                    rotate: direction * -2.5,
                    filter: "blur(7px)",
                  }}
                  animate={{
                    opacity: primary ? 0.56 : 0.42,
                    x: [0, direction * 5, 0],
                    y: [0, primary ? -8 : -6, 0],
                    scale: [1, primary ? 1.018 : 1.025, 1],
                    rotate: primary
                      ? [-1.2 * direction, 0.7 * direction, -1.2 * direction]
                      : [1.5 * direction, -0.8 * direction, 1.5 * direction],
                    filter: "blur(0px)",
                  }}
                  exit={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                  transition={{
                    opacity: { duration: 0.65 },
                    filter: { duration: 0.65 },
                    x: { duration: primary ? 12 : 14, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: primary ? 9 : 11, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: primary ? 10 : 12, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: primary ? 14 : 16, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <video
                    ref={(node: HTMLVideoElement | null) => {
                      videoRefs.current[index] = node;
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={film.video}
                    poster={film.poster}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                  />
                  <span
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(20,17,14,0.02) 32%, rgba(20,17,14,0.7) 100%)",
                    }}
                  />
                  <motion.span
                    className="absolute -inset-y-6 -left-1/2 w-1/3 rotate-12 bg-ivory/10 blur-xl"
                    animate={{ x: ["0%", "620%"] }}
                    transition={{
                      duration: 6 + index,
                      repeat: Infinity,
                      repeatDelay: 4 + index,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="absolute left-3 top-2.5 text-[0.48rem] font-medium uppercase tracking-[0.16em] text-ivory/48">
                    Fragment {String(index + 1).padStart(2, "0")}
                  </span>
                  <figcaption className="absolute bottom-2.5 left-3 right-3 font-display text-[0.58rem] leading-snug text-ivory/70">
                    {film.label}
                  </figcaption>
                </motion.figure>
              );
            })}

            <motion.span
              aria-hidden="true"
              className="absolute -right-4 top-[17vh] h-16 w-16 rounded-full border border-dashed border-sandstone/22"
              animate={{ rotate: 360, scale: [1, 1.06, 1] }}
              transition={{
                rotate: { duration: 28, repeat: Infinity, ease: "linear" },
                scale: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
