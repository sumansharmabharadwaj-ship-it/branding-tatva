"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

const CHAPTER_ORDER: ChapterId[] = [
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
];

const CHAPTER_FILMS: Record<ChapterId, readonly [Film, Film]> = {
  opening: [
    { video: "/videos/higgsfield-process-listen.mp4", poster: "/images/higgsfield-process-listen-poster.jpg", label: "Attention begins in stillness." },
    { video: "/videos/higgsfield-process-stay.mp4", poster: "/images/higgsfield-process-stay-poster.jpg", label: "Memory is what remains." },
  ],
  diagnosis: [
    { video: "/videos/higgsfield-process-notice.mp4", poster: "/images/higgsfield-process-notice-poster.jpg", label: "Patterns surface before answers do." },
    { video: "/videos/higgsfield-process-shape.mp4", poster: "/images/higgsfield-process-shape-poster.jpg", label: "The right shape follows the right diagnosis." },
  ],
  evidence: [
    { video: "/videos/card-dr-haley-nutrition.mp4", poster: "/images/card-dr-haley-nutrition-poster.jpg", label: "Fewer posts. Stronger response." },
    { video: "/videos/card-myshopineurope.mp4", poster: "/images/card-myshopineurope-poster.jpg", label: "Craft became the position." },
  ],
  scope: [
    { video: "/videos/higgsfield-idea-sketch.mp4", poster: "/images/higgsfield-idea-sketch.jpg", label: "The work begins by clearing the decision." },
    { video: "/videos/higgsfield-process-ground.mp4", poster: "/images/higgsfield-process-ground-poster.jpg", label: "Scope follows the foundation." },
  ],
  studio: [
    { video: "/videos/higgsfield-idea-sketch.mp4", poster: "/images/higgsfield-idea-sketch.jpg", label: "Psychology finds the pattern." },
    { video: "/videos/higgsfield-process-listen.mp4", poster: "/images/higgsfield-process-listen-poster.jpg", label: "Language makes the pattern memorable." },
  ],
  paths: [
    { video: "/videos/higgsfield-process-ground.mp4", poster: "/images/higgsfield-process-ground-poster.jpg", label: "Begin with what must hold." },
    { video: "/videos/higgsfield-process-shape.mp4", poster: "/images/higgsfield-process-shape-poster.jpg", label: "Then give the business a coherent form." },
  ],
  framework: [
    { video: "/videos/higgsfield-process-express.mp4", poster: "/images/higgsfield-process-express-poster.jpg", label: "Expression is one force, never the whole brand." },
    { video: "/videos/higgsfield-process-stay.mp4", poster: "/images/higgsfield-process-stay-poster.jpg", label: "Consistency turns exposure into recognition." },
  ],
  elements: [
    { video: "/videos/higgsfield-process-ground.mp4", poster: "/images/higgsfield-process-ground-poster.jpg", label: "Earth: the strategic foundation." },
    { video: "/videos/higgsfield-process-shape.mp4", poster: "/images/higgsfield-process-shape-poster.jpg", label: "Water: the experience in motion." },
  ],
  process: [
    { video: "/videos/higgsfield-process-notice.mp4", poster: "/images/higgsfield-process-notice-poster.jpg", label: "Every useful decision begins with a signal." },
    { video: "/videos/higgsfield-process-express.mp4", poster: "/images/higgsfield-process-express-poster.jpg", label: "Strategy counts when the audience can encounter it." },
  ],
  questions: [
    { video: "/videos/pexels-golden-fog-sea.mp4", poster: "/images/pexels-golden-fog-sea-poster.jpg", label: "Clarity arrives by removing the fog." },
    { video: "/videos/higgsfield-process-listen.mp4", poster: "/images/higgsfield-process-listen-poster.jpg", label: "A first conversation should answer more than it asks." },
  ],
  invitation: [
    { video: "/videos/higgsfield-silver-tide.mp4", poster: "/images/higgsfield-silver-tide-poster.jpg", label: "The quietest decision can change the whole direction." },
    { video: "/videos/higgsfield-process-stay.mp4", poster: "/images/higgsfield-process-stay-poster.jpg", label: "Build what people can continue to recognise." },
  ],
};

const LAYOUT_PRESETS = [
  {
    primary: "left-[1.5vw] top-[22vh] aspect-[4/5] w-[clamp(8.5rem,13vw,13.5rem)] rounded-[2rem]",
    secondary: "bottom-[10vh] right-[2.4vw] aspect-square w-[clamp(7rem,10vw,10.5rem)] rounded-full",
  },
  {
    primary: "right-[1.7vw] top-[18vh] aspect-[5/4] w-[clamp(10rem,16vw,16rem)] rounded-[2rem]",
    secondary: "bottom-[12vh] left-[3vw] aspect-square w-[clamp(7rem,9vw,9.5rem)] rounded-full",
  },
  {
    primary: "bottom-[12vh] left-[2vw] aspect-[16/10] w-[clamp(11rem,17vw,17rem)] rounded-[2rem]",
    secondary: "right-[3vw] top-[16vh] aspect-[3/4] w-[clamp(7rem,9vw,9.5rem)] rounded-[2rem]",
  },
  {
    primary: "right-[2vw] bottom-[12vh] aspect-[3/4] w-[clamp(8.5rem,12vw,12.5rem)] rounded-[2rem]",
    secondary: "left-[3vw] top-[19vh] aspect-square w-[clamp(7rem,9vw,9.5rem)] rounded-[1.6rem]",
  },
] as const;

function isChapterId(value: string | undefined): value is ChapterId {
  return Boolean(value && value in CHAPTER_FILMS);
}

export function HomeFilmConstellation() {
  const pathname = usePathname();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [activeChapter, setActiveChapter] = useState<ChapterId>("opening");
  const [showSecondary, setShowSecondary] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const chapterTargetsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
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
      chapterTargetsRef.current = Array.from(document.querySelectorAll<HTMLElement>("[data-home-chapter]"));
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
    const retry = window.setInterval(resolveTargets, 600);
    const stopRetry = window.setTimeout(() => window.clearInterval(retry), 6000);

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
    const videos = videoRefs.current.filter((video): video is HTMLVideoElement => Boolean(video));

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

  const films = showSecondary
    ? CHAPTER_FILMS[activeChapter]
    : CHAPTER_FILMS[activeChapter].slice(0, 1);
  const chapterIndex = Math.max(0, CHAPTER_ORDER.indexOf(activeChapter));
  const layout = LAYOUT_PRESETS[chapterIndex % LAYOUT_PRESETS.length];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[18] hidden overflow-hidden sm:block"
      data-home-film-constellation
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeChapter}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {films.map((film, index) => {
            const primary = index === 0;
            const placement = primary ? layout.primary : layout.secondary;
            const direction = primary ? 1 : -1;

            return (
              <motion.figure
                key={film.video}
                className={[
                  "absolute overflow-hidden border border-ivory/20 bg-soil/45 shadow-[0_28px_90px_rgba(20,17,14,0.26)] backdrop-blur-sm",
                  placement,
                  !primary ? "hidden md:block" : "",
                ].join(" ")}
                initial={{
                  opacity: 0,
                  x: direction * -28,
                  y: 14,
                  scale: 0.9,
                  rotate: direction * -4,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: primary ? 0.78 : 0.68,
                  x: [0, direction * 7, 0],
                  y: [0, primary ? -13 : -9, 0],
                  scale: [1, primary ? 1.025 : 1.04, 1],
                  rotate: primary ? [-2.2 * direction, 1.1 * direction, -2.2 * direction] : [2.4 * direction, -1.4 * direction, 2.4 * direction],
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  x: direction * -22,
                  scale: 0.92,
                  filter: "blur(8px)",
                }}
                transition={{
                  opacity: { duration: 0.75 },
                  filter: { duration: 0.75 },
                  x: { duration: primary ? 10 : 12, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: primary ? 7.5 : 9, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: primary ? 8.5 : 10, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: primary ? 11 : 13, repeat: Infinity, ease: "easeInOut" },
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
                      "linear-gradient(180deg, rgba(20,17,14,0.02) 30%, rgba(20,17,14,0.72) 100%)",
                  }}
                />
                <motion.span
                  className="absolute -inset-y-8 -left-1/2 w-1/3 rotate-12 bg-ivory/12 blur-xl"
                  animate={{ x: ["0%", "620%"] }}
                  transition={{
                    duration: 5.5 + index,
                    repeat: Infinity,
                    repeatDelay: 3 + index,
                    ease: "easeInOut",
                  }}
                />
                <figcaption
                  className={[
                    "absolute bottom-3 left-3 right-3 font-display text-[0.78rem] leading-snug text-ivory/82",
                    primary ? "" : "text-center text-[0.68rem]",
                  ].join(" ")}
                >
                  {film.label}
                </figcaption>
              </motion.figure>
            );
          })}

          <motion.span
            className="absolute left-[7.4vw] top-[18vh] h-24 w-24 rounded-full border border-dashed border-sandstone/35"
            animate={{ rotate: 360, scale: [1, 1.08, 1] }}
            transition={{
              rotate: { duration: 24, repeat: Infinity, ease: "linear" },
              scale: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <motion.span
            className="absolute bottom-[7.5vh] right-[6.3vw] h-2.5 w-2.5 rounded-full bg-sandstone shadow-[0_0_20px_rgba(212,185,154,0.75)]"
            animate={{ scale: [0.75, 1.35, 0.75], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
