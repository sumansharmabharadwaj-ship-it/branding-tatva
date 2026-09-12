"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, Hand, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import {
  publishHomeGuideMode,
  type HomeGuideMode,
} from "@/hooks/useHomeGuideMode";

const CHAPTER_SELECTOR = "[data-home-v4-chapter]";
const DWELL_MS = [4700, 4400, 4700, 5300, 4700, 4900, 5300, 4900, 4600, 4600, 5200];
const GUIDE_HINT_MS = 8200;
const CHAPTER_NAMES = [
  "opening signal",
  "recognition",
  "hidden cost",
  "foundation",
  "three paths",
  "working method",
  "evidence",
  "tatva system",
  "studio",
  "decision",
  "invitation",
] as const;
const TAB_STOP_SELECTOR = "a[href], button, input, select, textarea, [tabindex]";

function isAvailableTabStop(element: HTMLElement) {
  return element.tabIndex >= 0 &&
    !element.matches(":disabled") &&
    !element.closest('[inert], [aria-hidden="true"]') &&
    element.getClientRects().length > 0 &&
    window.getComputedStyle(element).visibility === "visible";
}

type GuideMode = HomeGuideMode;
type HandoffMotif = "mist" | "river" | "root" | "aperture" | "paper" | "constellation" | "light";

export function GuidedView() {
  const lenis = useLenis();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [mode, setMode] = useState<GuideMode>("manual");
  const [activeIndex, setActiveIndex] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const guideRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<HTMLElement[]>([]);
  const guidedScrollRef = useRef(false);
  const modeRef = useRef<GuideMode>("manual");
  const advanceTimerRef = useRef(0);
  const progressFrameRef = useRef(0);
  const hintTimerRef = useRef(0);

  const resolveChapters = useCallback(() => {
    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>(CHAPTER_SELECTOR),
    );
    chaptersRef.current = chapters;
    return chapters;
  }, []);

  const dismissHint = useCallback(() => {
    window.clearTimeout(hintTimerRef.current);
    setHintVisible(false);
  }, []);

  const stopGuidedMotion = useCallback(() => {
    window.clearTimeout(advanceTimerRef.current);
    window.cancelAnimationFrame(progressFrameRef.current);
    guideRef.current?.style.setProperty("--guide-progress", "0deg");

    if (guidedScrollRef.current) {
      if (lenis) lenis.scrollTo(window.scrollY, { immediate: true });
      else window.scrollTo({ top: window.scrollY, left: window.scrollX, behavior: "instant" });
      guidedScrollRef.current = false;
    }
  }, [lenis]);

  const changeMode = useCallback((next: GuideMode) => {
    modeRef.current = next;
    if (next !== "guided") stopGuidedMotion();
    setMode(next);
  }, [stopGuidedMotion]);

  const scrollToChapter = useCallback(
    (index: number) => {
      const chapters = resolveChapters();
      const target = chapters[index];
      if (!target) return;

      guidedScrollRef.current = true;
      window.clearTimeout(advanceTimerRef.current);

      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(target, {
          duration: 0.82,
          easing: (value: number) => 1 - Math.pow(1 - value, 4),
          onComplete: () => { guidedScrollRef.current = false; },
        });
      } else {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [lenis, prefersReducedMotion, resolveChapters],
  );

  useEffect(() => {
    const chapters = resolveChapters();
    if (!chapters.length) return;

    const ratios = new Map<HTMLElement, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target as HTMLElement, entry.intersectionRatio);
        });

        let nextIndex = -1;
        let bestRatio = 0;
        chapters.forEach((chapter, index) => {
          const ratio = ratios.get(chapter) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            nextIndex = index;
          }
        });
        // Between scenes and below the final chapter, keep the last reading
        // position. An empty observer window is not a return to the opening.
        if (nextIndex >= 0) {
          setActiveIndex(nextIndex);
        } else if (chapters[chapters.length - 1].getBoundingClientRect().bottom <= window.innerHeight * 0.2) {
          // A direct jump to the footer can skip every intersection threshold.
          setActiveIndex(chapters.length - 1);
        }
      },
      {
        rootMargin: "-20% 0px -26% 0px",
        threshold: [0, 0.12, 0.28, 0.48, 0.72],
      },
    );

    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, [resolveChapters]);

  useEffect(() => {
    publishHomeGuideMode(mode);
  }, [mode]);

  useEffect(
    () => () => {
      document.documentElement.removeAttribute("data-home-guide-mode");
    },
    [],
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      dismissHint();
      changeMode("manual");
      return;
    }
    const eligible = window.matchMedia("(min-width: 821px) and (pointer: fine)");

    function syncHint() {
      window.clearTimeout(hintTimerRef.current);
      if (!eligible.matches) {
        setHintVisible(false);
        changeMode("manual");
        return;
      }

      setHintVisible(true);
      hintTimerRef.current = window.setTimeout(() => {
        setHintVisible(false);
      }, GUIDE_HINT_MS);
    }

    syncHint();
    eligible.addEventListener("change", syncHint);
    return () => {
      eligible.removeEventListener("change", syncHint);
      window.clearTimeout(hintTimerRef.current);
    };
  }, [changeMode, dismissHint, prefersReducedMotion]);

  useEffect(() => {
    if (activeIndex > 0) dismissHint();
  }, [activeIndex, dismissHint]);

  useEffect(() => {
    window.cancelAnimationFrame(progressFrameRef.current);
    const guide = guideRef.current;

    if (prefersReducedMotion || mode !== "guided") {
      guide?.style.setProperty("--guide-progress", "0deg");
      return;
    }

    const chapters = resolveChapters();
    const nextIndex = activeIndex + 1;
    if (nextIndex >= chapters.length) {
      changeMode("paused");
      return;
    }

    const duration = DWELL_MS[Math.min(activeIndex, DWELL_MS.length - 1)] ?? 4700;
    const startedAt = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, Math.max(0, (now - startedAt) / duration));
      guide?.style.setProperty("--guide-progress", `${progress * 360}deg`);
      if (progress < 1) progressFrameRef.current = window.requestAnimationFrame(tick);
    }

    progressFrameRef.current = window.requestAnimationFrame(tick);
    advanceTimerRef.current = window.setTimeout(() => {
      if (document.hidden || modeRef.current !== "guided") return;
      scrollToChapter(nextIndex);
    }, duration);

    return () => {
      window.clearTimeout(advanceTimerRef.current);
      window.cancelAnimationFrame(progressFrameRef.current);
    };
  }, [activeIndex, changeMode, mode, prefersReducedMotion, resolveChapters, scrollToChapter]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    function takeControl(event: Event) {
      const target = event.target;
      const navigationKey = event instanceof KeyboardEvent &&
        ["Escape", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key);
      if (event.type !== "wheel" && !navigationKey &&
        target instanceof Element && target.closest("[data-guided-controls]")) return;

      dismissHint();
      changeMode("manual");
    }

    function onVisibilityChange() {
      if (document.hidden && modeRef.current === "guided") changeMode("paused");
    }

    function onScrollEnd() {
      guidedScrollRef.current = false;
    }

    const options: AddEventListenerOptions = { passive: true };
    window.addEventListener("wheel", takeControl, options);
    window.addEventListener("touchstart", takeControl, options);
    window.addEventListener("pointerdown", takeControl, options);
    window.addEventListener("keydown", takeControl);
    window.addEventListener("focusin", takeControl);
    window.addEventListener("scrollend", onScrollEnd);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("wheel", takeControl);
      window.removeEventListener("touchstart", takeControl);
      window.removeEventListener("pointerdown", takeControl);
      window.removeEventListener("keydown", takeControl);
      window.removeEventListener("focusin", takeControl);
      window.removeEventListener("scrollend", onScrollEnd);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopGuidedMotion();
      window.clearTimeout(hintTimerRef.current);
      window.cancelAnimationFrame(progressFrameRef.current);
    };
  }, [changeMode, dismissHint, prefersReducedMotion, stopGuidedMotion]);

  function continueReading(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;

    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(TAB_STOP_SELECTOR))
      .filter(isAvailableTabStop);
    if (event.target !== controls[controls.length - 1]) return;

    const chapter = resolveChapters()[activeIndex];
    if (!chapter) return;
    const candidates = Array.from(chapter.querySelectorAll<HTMLElement>(TAB_STOP_SELECTOR))
      .filter(isAvailableTabStop);
    // The fixed guide precedes the opening in DOM order. Leave it at the
    // current reading position, preferring a control already in the viewport.
    const destination = candidates.find((candidate) => {
      const rect = candidate.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }) ?? candidates[0];
    if (!destination) return;

    dismissHint();
    changeMode("manual");
    destination.focus({ preventScroll: true });
    if (document.activeElement !== destination) return;
    event.preventDefault();

    const rect = destination.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      destination.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }

  if (prefersReducedMotion) return null;

  const count = Math.max(1, chaptersRef.current.length || CHAPTER_NAMES.length);
  const atFinalChapter = activeIndex >= count - 1;
  const chapterName = CHAPTER_NAMES[Math.min(activeIndex, CHAPTER_NAMES.length - 1)] ?? "scene";
  const showHint = hintVisible && mode === "manual" && activeIndex === 0;
  const label = atFinalChapter
    ? "journey complete"
    : mode === "guided"
      ? "the page is moving with you"
      : mode === "paused"
        ? "guided journey paused"
        : showHint
          ? "play the journey"
          : "explore at your pace";
  const detail = atFinalChapter
    ? "the invitation"
    : showHint
      ? "eleven scenes · always user-led"
      : chapterName;

  return (
    <div
      ref={guideRef}
      data-guided-controls
      data-guide-mode={mode}
      data-guide-hint={showHint ? "visible" : "hidden"}
      data-guide-final={atFinalChapter ? "true" : "false"}
      className="home-v4-guide"
      aria-label="Guided homepage controls"
      onKeyDown={continueReading}
    >
      <span className="home-v4-guide__signal" aria-hidden="true">
        <motion.i
          animate={
            mode === "guided" || showHint
              ? { scale: [0.72, 1.5, 0.72], opacity: [0.9, 0, 0.9] }
              : { scale: 1, opacity: 0.42 }
          }
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
        />
        <Compass size={13} strokeWidth={1.55} />
      </span>

      <span className="home-v4-guide__copy" aria-live="polite">
        <span className="home-v4-guide__status">
          <small>{label}</small>
          <em>{detail}</em>
        </span>
        <strong>
          {String(activeIndex + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
        </strong>
      </span>

      <button
        type="button"
        onClick={() => {
          dismissHint();
          if (mode === "guided") {
            changeMode("paused");
          } else if (atFinalChapter) {
            changeMode("manual");
            scrollToChapter(0);
          } else {
            changeMode("guided");
          }
        }}
        aria-label={mode === "guided" ? "Pause guided journey" : atFinalChapter ? "Return to beginning" : "Play guided journey"}
        aria-pressed={mode === "guided"}
        data-cursor-label={mode === "guided" ? "pause journey" : "play journey"}
        title={mode === "guided" ? "Pause guided journey" : atFinalChapter ? "Return to beginning" : "Play guided journey"}
      >
        {mode === "guided" ? <Pause size={13} /> : atFinalChapter ? <RotateCcw size={13} /> : <Play size={13} />}
      </button>

      <button
        type="button"
        onClick={() => {
          dismissHint();
          changeMode("manual");
        }}
        aria-label="Explore the homepage manually"
        aria-pressed={mode === "manual"}
        data-cursor-label="manual"
        title="Explore manually"
      >
        <Hand size={13} />
      </button>
    </div>
  );
}

export function SceneHandoff({ motif }: { motif: HandoffMotif }) {
  const handoffRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const { scrollYProgress } = useScroll({ target: handoffRef, offset: ["start end", "end start"] });
  const lightX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0.12, 1]);
  const starsX = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  return (
    <div ref={handoffRef} className={`home-v4-handoff home-v4-handoff--${motif}`} aria-hidden="true">
      <motion.span className="home-v4-handoff__veil" style={{ x: prefersReducedMotion ? 0 : lightX }} />
      {motif === "river" || motif === "root" ? (
        <svg viewBox="0 0 1200 96" preserveAspectRatio="none">
          <motion.path
            d={
              motif === "river"
                ? "M-20 50 C160 8 290 86 462 48 C638 10 770 88 955 42 C1048 20 1120 27 1220 55"
                : "M-20 74 C130 25 250 90 390 56 C530 22 645 78 756 45 C860 14 1010 70 1220 28"
            }
            fill="none"
            stroke="var(--handoff-line)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.4"
            style={{ pathLength: prefersReducedMotion ? 1 : lineProgress }}
          />
        </svg>
      ) : null}
      {motif === "constellation" && (
        <motion.span className="home-v4-handoff__stars" style={{ x: prefersReducedMotion ? 0 : starsX }}>
          {[12, 28, 44, 61, 78, 91].map((left, index) => (
            <i
              key={left}
              style={{ left: `${left}%`, top: `${28 + (index % 3) * 20}%` }}
            />
          ))}
        </motion.span>
      )}
    </div>
  );
}
