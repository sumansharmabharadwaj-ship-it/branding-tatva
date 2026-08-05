"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";

type ChapterDefinition = {
  id: string;
  label: string;
  detail: string;
  match?: string;
  elementId?: string;
  position?: "first" | "last";
};

type ResolvedChapter = ChapterDefinition & {
  targetId: string;
};

const CHAPTERS: ChapterDefinition[] = [
  {
    id: "opening",
    label: "Opening",
    detail: "Why memory matters more than visibility.",
    position: "first",
  },
  {
    id: "diagnosis",
    label: "Find the gap",
    detail: "Name what is holding the brand back.",
    match: "Where you stand",
  },
  {
    id: "evidence",
    label: "Evidence",
    detail: "See the decisions behind the outcomes.",
    // EvidenceWall was renamed from a generic "Evidence" heading to the
    // sharper "Decisions. Then proof." The ladder still searched the old
    // copy, so guided mode silently jumped from Diagnosis to Studio. Match
    // the current language and keep proof inside the intended journey.
    match: "Decisions.",
  },
  {
    id: "studio",
    label: "The studio",
    detail: "Meet the thinking behind the work.",
    match: "About Suman",
  },
  {
    id: "paths",
    label: "Three paths",
    detail: "Choose what the business should build next.",
    match: "Three paths",
  },
  {
    id: "framework",
    label: "Tatva framework",
    detail: "See the five forces working as one system.",
    match: "The framework",
  },
  {
    id: "elements",
    label: "Five elements",
    detail: "Explore each Tatva in depth.",
    elementId: "elements",
  },
  {
    id: "process",
    label: "The process",
    detail: "Follow how decisions become recognition.",
    match: "How a project moves",
  },
  {
    id: "questions",
    label: "Questions",
    detail: "Resolve the practical details before beginning.",
    match: "The practical questions",
  },
  {
    id: "invitation",
    label: "Begin",
    detail: "Turn the diagnosis into a real conversation.",
    position: "last",
  },
];

function resolveChapterTargets(main: HTMLElement) {
  const directChildren = Array.from(main.children).filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  );

  return CHAPTERS.flatMap((chapter) => {
    let target: HTMLElement | null = null;

    if (chapter.elementId) {
      target = document.getElementById(chapter.elementId);
    } else if (chapter.position === "first") {
      target = directChildren[0] ?? null;
    } else if (chapter.position === "last") {
      target = directChildren.at(-1) ?? null;
    } else if (chapter.match) {
      const needle = chapter.match.toLowerCase();
      target =
        directChildren.find((element) => element.textContent?.toLowerCase().includes(needle)) ?? null;
    }

    if (!target) return [];

    if (!target.id) target.id = `chapter-${chapter.id}`;
    target.dataset.homeChapter = chapter.id;

    return [{ chapter: { ...chapter, targetId: target.id }, target }];
  });
}

export function ChapterLadder() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();
  const targetsRef = useRef<HTMLElement[]>([]);
  const activeIndexRef = useRef(0);
  const progressRef = useRef(0);
  const [chapters, setChapters] = useState<ResolvedChapter[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    const mainElement = document.getElementById("main-content");
    if (!mainElement) return;
    const mainRoot: HTMLElement = mainElement;

    let frame = 0;
    let cancelled = false;
    let observer: MutationObserver | null = null;

    function updatePosition() {
      frame = 0;
      const targets = targetsRef.current;
      if (!targets.length) return;

      const anchor = window.scrollY + window.innerHeight * 0.42;
      const positions = targets.map((target) => window.scrollY + target.getBoundingClientRect().top);
      let nextActive = 0;

      positions.forEach((position, index) => {
        if (position <= anchor) nextActive = index;
      });

      const lastIndex = targets.length - 1;
      const currentTop = positions[nextActive] ?? 0;
      const nextTop = positions[nextActive + 1] ?? document.documentElement.scrollHeight;
      const localProgress = Math.min(1, Math.max(0, (anchor - currentTop) / Math.max(1, nextTop - currentTop)));
      const nextProgress =
        lastIndex <= 0 ? 0 : Math.min(1, (nextActive + (nextActive < lastIndex ? localProgress : 0)) / lastIndex);

      if (nextActive !== activeIndexRef.current) {
        activeIndexRef.current = nextActive;
        setActiveIndex(nextActive);
      }

      if (Math.abs(nextProgress - progressRef.current) > 0.002) {
        progressRef.current = nextProgress;
        setProgress(nextProgress);
      }
    }

    function schedulePositionUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(updatePosition);
    }

    function resolveTargets() {
      if (cancelled) return;
      const resolved = resolveChapterTargets(mainRoot);
      targetsRef.current = resolved.map((entry) => entry.target);
      setChapters(resolved.map((entry) => entry.chapter));
      schedulePositionUpdate();

      if (resolved.length === CHAPTERS.length) observer?.disconnect();
    }

    resolveTargets();
    observer = new MutationObserver(resolveTargets);
    observer.observe(mainRoot, { childList: true, subtree: true });

    const unsubscribe = lenis?.on("scroll", schedulePositionUpdate);
    window.addEventListener("scroll", schedulePositionUpdate, { passive: true });
    window.addEventListener("resize", schedulePositionUpdate);
    window.addEventListener("load", resolveTargets);
    document.fonts?.ready?.then(resolveTargets);

    const observerTimeout = window.setTimeout(() => observer?.disconnect(), 5000);

    return () => {
      cancelled = true;
      observer?.disconnect();
      unsubscribe?.();
      window.clearTimeout(observerTimeout);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedulePositionUpdate);
      window.removeEventListener("resize", schedulePositionUpdate);
      window.removeEventListener("load", resolveTargets);
    };
  }, [pathname, lenis]);

  useEffect(() => {
    if (!mobileOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  if (pathname !== "/" || chapters.length < 2) return null;

  const displayIndex = hoveredIndex ?? activeIndex;
  const displayChapter = chapters[Math.min(displayIndex, chapters.length - 1)];
  const motionTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.7 };

  function scrollToChapter(index: number) {
    const target = targetsRef.current[index];
    if (!target) return;

    setMobileOpen(false);
    window.history.replaceState(null, "", `#${target.id}`);

    const chapter = target.dataset.homeChapter;
    const offset = ["process", "questions", "invitation"].includes(
      chapter ?? "",
    )
      ? 0
      : -72;

    if (lenis && !prefersReducedMotion) {
      lenis.scrollTo(target, { offset, duration: 1.05 });
      return;
    }

    const top = window.scrollY + target.getBoundingClientRect().top + offset;
    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <>
      <nav
        aria-label="Explore the homepage"
        data-chapter-ladder
        className="pointer-events-none fixed right-3 top-1/2 z-[45] hidden -translate-y-1/2 xl:block xl:right-5"
      >
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={displayChapter.id}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 10, filter: "blur(5px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: 8, filter: "blur(4px)" }}
              transition={motionTransition}
              className="pointer-events-none w-40 rounded-2xl border border-white/12 bg-[#17140f]/78 px-4 py-3 text-right shadow-[0_18px_55px_rgba(0,0,0,0.24)] backdrop-blur-xl lg:w-44 2xl:w-52"
            >
              <p className="text-[0.58rem] font-medium uppercase tracking-[0.22em] text-ivory/45">
                What you are exploring
              </p>
              <div className="mt-1.5 flex items-baseline justify-end gap-2">
                <span className="text-[0.62rem] tracking-[0.18em] text-sandstone/75">
                  {String(displayIndex + 1).padStart(2, "0")}
                </span>
                <p className="font-display text-lg font-normal leading-none text-ivory">{displayChapter.label}</p>
              </div>
              <p className="mt-1.5 text-[0.68rem] leading-relaxed text-ivory/55">{displayChapter.detail}</p>
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-auto relative rounded-full border border-white/12 bg-[#15120f]/76 px-2.5 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div aria-hidden="true" className="absolute inset-y-4 left-[10px] right-[10px]">
              <span className="absolute inset-y-0 left-0 w-px bg-ivory/15" />
              <span className="absolute inset-y-0 right-0 w-px bg-ivory/15" />
              <span
                className="absolute inset-y-0 left-0 w-px origin-top bg-sandstone/80 transition-transform duration-150 ease-linear"
                style={{ transform: `scaleY(${progress})` }}
              />
              <span
                className="absolute inset-y-0 right-0 w-px origin-top bg-sandstone/80 transition-transform duration-150 ease-linear"
                style={{ transform: `scaleY(${progress})` }}
              />
              <motion.span
                className="absolute right-0 h-2 w-2 -translate-x-[3.5px] -translate-y-1/2 rounded-full border border-[#15120f] bg-sandstone shadow-[0_0_16px_rgba(212,185,154,0.65)]"
                animate={{ top: `${progress * 100}%` }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-1.5">
              {chapters.map((chapter, index) => {
                const isActive = index === activeIndex;
                const isHovered = index === hoveredIndex;
                const isLit = isActive || isHovered;

                return (
                  <button
                    key={chapter.id}
                    type="button"
                    aria-label={`Go to ${chapter.label}: ${chapter.detail}`}
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => scrollToChapter(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex(null)}
                    className="group flex h-5 w-8 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="block h-px rounded-full"
                      animate={{
                        width: isLit ? 28 : 20,
                        opacity: isActive ? 1 : isHovered ? 0.9 : 0.38,
                        backgroundColor: isLit ? "#D4B99A" : "#F4EFE6",
                        boxShadow: isActive ? "0 0 12px rgba(212,185,154,0.55)" : "0 0 0 rgba(0,0,0,0)",
                      }}
                      transition={motionTransition}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed bottom-5 left-4 z-[45] xl:hidden" data-chapter-ladder-mobile>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-chapter-ladder"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
              transition={motionTransition}
              className="mb-3 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/12 bg-[#17140f]/92 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between px-2 pb-2 pt-1">
                <div>
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.22em] text-ivory/45">Explore the page</p>
                  <p className="mt-1 font-display text-lg text-ivory">{displayChapter.label}</p>
                </div>
                <span className="text-[0.62rem] tracking-[0.18em] text-sandstone/75">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(
                    new CustomEvent("bt:open-cinema-controls"),
                  );
                }}
                className="mb-2 flex w-full items-center justify-between gap-4 rounded-2xl border border-sandstone/20 bg-sandstone/[0.06] px-3 py-3 text-left transition-colors hover:bg-sandstone/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
              >
                <span>
                  <span className="block font-display text-base text-ivory">
                    Cinema and sound
                  </span>
                  <span className="mt-1 block text-[0.62rem] leading-relaxed text-ivory/42">
                    Start the guided journey or turn on the ambient score.
                  </span>
                </span>
                <span aria-hidden="true" className="text-sandstone">
                  ▶
                </span>
              </button>

              <div className="max-h-[54vh] space-y-1 overflow-y-auto pr-1">
                {chapters.map((chapter, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      aria-current={isActive ? "step" : undefined}
                      onClick={() => scrollToChapter(index)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.58rem] tracking-[0.12em]"
                        style={{
                          borderColor: isActive ? "rgba(212,185,154,0.75)" : "rgba(244,239,230,0.14)",
                          color: isActive ? "#D4B99A" : "rgba(244,239,230,0.5)",
                          backgroundColor: isActive ? "rgba(212,185,154,0.08)" : "transparent",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className={`block font-display text-base ${isActive ? "text-ivory" : "text-ivory/65"}`}>
                          {chapter.label}
                        </span>
                        <span className="mt-0.5 block text-[0.62rem] leading-relaxed text-ivory/38">{chapter.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-chapter-ladder"
          aria-label={mobileOpen ? "Close homepage chapters" : `Open homepage chapters. Currently ${displayChapter.label}`}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex min-h-11 items-center gap-3 rounded-full border border-white/12 bg-[#17140f]/84 px-3.5 text-ivory shadow-[0_16px_48px_rgba(0,0,0,0.3)] backdrop-blur-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
        >
          <span aria-hidden="true" className="flex h-5 w-5 flex-col items-center justify-center gap-1">
            {[0, 1, 2].map((line) => (
              <motion.span
                key={line}
                className="block h-px rounded-full bg-sandstone"
                animate={{ width: line === 1 ? 15 : 10, x: line === 1 ? 2 : 0 }}
                transition={motionTransition}
              />
            ))}
          </span>
          <span className="text-left">
            <span className="block text-[0.5rem] font-medium uppercase tracking-[0.16em] text-ivory/40">Exploring</span>
            <span className="mt-0.5 block font-display text-sm leading-none text-ivory">{displayChapter.label}</span>
          </span>
          <span className="ml-1 text-[0.58rem] tracking-[0.16em] text-sandstone/70">
            {String(activeIndex + 1).padStart(2, "0")}/{String(chapters.length).padStart(2, "0")}
          </span>
        </button>
      </div>
    </>
  );
}
