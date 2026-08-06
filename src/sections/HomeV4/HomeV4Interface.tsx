"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Compass, Hand, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import {
  publishHomeGuideMode,
  type HomeGuideMode,
} from "@/hooks/useHomeGuideMode";

const CHAPTER_SELECTOR = "[data-home-v4-chapter]";
const DWELL_MS = [5200, 4900, 5200, 5900, 5200, 5400, 5900, 5400, 5100, 5000, 5800];
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
const CURSOR_SPRING = { stiffness: 460, damping: 34, mass: 0.34 } as const;

type GuideMode = HomeGuideMode;
type CursorWorld = "dark" | "light";
type HandoffMotif = "mist" | "river" | "root" | "aperture" | "paper" | "constellation" | "light";

export function GuidedView() {
  const lenis = useLenis();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [mode, setMode] = useState<GuideMode>("manual");
  const [activeIndex, setActiveIndex] = useState(0);
  const guideRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<HTMLElement[]>([]);
  const guidedScrollRef = useRef(false);
  const releaseTimerRef = useRef(0);
  const progressFrameRef = useRef(0);
  const autoStartTimerRef = useRef(0);
  const userIntentRef = useRef(false);

  const resolveChapters = useCallback(() => {
    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>(CHAPTER_SELECTOR),
    );
    chaptersRef.current = chapters;
    return chapters;
  }, []);

  const scrollToChapter = useCallback(
    (index: number) => {
      const chapters = resolveChapters();
      const target = chapters[index];
      if (!target) return;

      guidedScrollRef.current = true;
      window.clearTimeout(releaseTimerRef.current);

      if (lenis) {
        lenis.scrollTo(target, {
          duration: 0.92,
          easing: (value: number) => 1 - Math.pow(1 - value, 4),
        });
      } else {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }

      releaseTimerRef.current = window.setTimeout(() => {
        guidedScrollRef.current = false;
      }, 1180);
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

        let nextIndex = 0;
        let bestRatio = -1;
        chapters.forEach((chapter, index) => {
          const ratio = ratios.get(chapter) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            nextIndex = index;
          }
        });
        setActiveIndex(nextIndex);
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
    if (prefersReducedMotion) return;
    const eligible = window.matchMedia("(min-width: 821px) and (pointer: fine)");

    function scheduleAutoStart() {
      window.clearTimeout(autoStartTimerRef.current);
      if (!eligible.matches || userIntentRef.current) {
        if (!eligible.matches) setMode("manual");
        return;
      }

      autoStartTimerRef.current = window.setTimeout(() => {
        if (!userIntentRef.current && eligible.matches) setMode("guided");
      }, 1100);
    }

    scheduleAutoStart();
    eligible.addEventListener("change", scheduleAutoStart);
    return () => {
      eligible.removeEventListener("change", scheduleAutoStart);
      window.clearTimeout(autoStartTimerRef.current);
    };
  }, [prefersReducedMotion]);

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
      setMode("paused");
      return;
    }

    const duration = DWELL_MS[Math.min(activeIndex, DWELL_MS.length - 1)] ?? 5200;
    const startedAt = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, Math.max(0, (now - startedAt) / duration));
      guide?.style.setProperty("--guide-progress", `${progress * 360}deg`);
      if (progress < 1) progressFrameRef.current = window.requestAnimationFrame(tick);
    }

    progressFrameRef.current = window.requestAnimationFrame(tick);
    const timer = window.setTimeout(() => {
      if (document.hidden || mode !== "guided") return;
      scrollToChapter(nextIndex);
    }, duration);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(progressFrameRef.current);
    };
  }, [activeIndex, mode, prefersReducedMotion, resolveChapters, scrollToChapter]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    function takeControl(event: Event) {
      if (guidedScrollRef.current) return;
      const target = event.target;
      if (target instanceof Element && target.closest("[data-guided-controls]")) return;

      userIntentRef.current = true;
      window.clearTimeout(autoStartTimerRef.current);
      setMode("manual");
    }

    const options: AddEventListenerOptions = { passive: true };
    window.addEventListener("wheel", takeControl, options);
    window.addEventListener("touchstart", takeControl, options);
    window.addEventListener("pointerdown", takeControl, options);
    window.addEventListener("keydown", takeControl);

    return () => {
      window.removeEventListener("wheel", takeControl);
      window.removeEventListener("touchstart", takeControl);
      window.removeEventListener("pointerdown", takeControl);
      window.removeEventListener("keydown", takeControl);
      window.clearTimeout(releaseTimerRef.current);
      window.clearTimeout(autoStartTimerRef.current);
      window.cancelAnimationFrame(progressFrameRef.current);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  const count = Math.max(1, chaptersRef.current.length || CHAPTER_NAMES.length);
  const chapterName = CHAPTER_NAMES[Math.min(activeIndex, CHAPTER_NAMES.length - 1)] ?? "scene";
  const label =
    mode === "guided"
      ? "the page is moving with you"
      : mode === "paused"
        ? "guided view paused"
        : "explore at your pace";

  return (
    <div
      ref={guideRef}
      data-guided-controls
      data-guide-mode={mode}
      className="home-v4-guide"
      aria-label="Guided homepage controls"
    >
      <span className="home-v4-guide__signal" aria-hidden="true">
        <motion.i
          animate={
            mode === "guided"
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
          <em>{chapterName}</em>
        </span>
        <strong>
          {String(activeIndex + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
        </strong>
      </span>

      <button
        type="button"
        onClick={() => {
          userIntentRef.current = true;
          setMode((current) => (current === "guided" ? "paused" : "guided"));
        }}
        aria-label={mode === "guided" ? "Pause guided view" : "Continue guided view"}
        aria-pressed={mode === "guided"}
        data-cursor-label={mode === "guided" ? "pause" : "continue"}
        title={mode === "guided" ? "Pause guided view" : "Continue guided view"}
      >
        {mode === "guided" ? <Pause size={13} /> : <Play size={13} />}
      </button>

      <button
        type="button"
        onClick={() => {
          userIntentRef.current = true;
          setMode("manual");
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

export function LivingCursor() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const x = useMotionValue(-80);
  const y = useMotionValue(-80);
  const springX = useSpring(x, CURSOR_SPRING);
  const springY = useSpring(y, CURSOR_SPRING);
  const [enabled, setEnabled] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [world, setWorld] = useState<CursorWorld>("dark");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (prefersReducedMotion) return;
    const finePointer = window.matchMedia("(pointer: fine)");

    function syncEnabled() {
      setEnabled(finePointer.matches);
      document.documentElement.classList.toggle("home-v4-cursor-active", finePointer.matches);
    }

    syncEnabled();
    finePointer.addEventListener("change", syncEnabled);
    return () => {
      finePointer.removeEventListener("change", syncEnabled);
      document.documentElement.classList.remove("home-v4-cursor-active");
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    function move(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const interactiveTarget = target?.closest<HTMLElement>(
        "a, button, [data-magnetic], [role='button']",
      );
      const worldTarget = target?.closest<HTMLElement>("[data-cursor-world]");
      const nextWorld = worldTarget?.dataset.cursorWorld === "light" ? "light" : "dark";

      setWorld(nextWorld);
      setInteractive(Boolean(interactiveTarget));
      setLabel(
        interactiveTarget?.dataset.cursorLabel ||
          interactiveTarget?.getAttribute("aria-label") ||
          "",
      );

      if (interactiveTarget) {
        const rect = interactiveTarget.getBoundingClientRect();
        const attraction = 0.22;
        x.set(event.clientX * (1 - attraction) + (rect.left + rect.width / 2) * attraction);
        y.set(event.clientY * (1 - attraction) + (rect.top + rect.height / 2) * attraction);
      } else {
        x.set(event.clientX);
        y.set(event.clientY);
      }
    }

    function down() {
      setPressed(true);
    }

    function up() {
      setPressed(false);
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [enabled, x, y]);

  if (!enabled || prefersReducedMotion) return null;

  return (
    <motion.div
      className="home-v4-cursor"
      style={{ x: springX, y: springY }}
      aria-hidden="true"
    >
      <motion.div
        className={`home-v4-cursor__orb is-${world}${interactive ? " is-interactive" : ""}`}
        animate={{
          scale: pressed ? 0.72 : interactive ? 1.42 : 1,
          rotate: world === "light" ? -18 : 0,
        }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="home-v4-cursor__core" />
        <span className="home-v4-cursor__crescent" />
        <span className="home-v4-cursor__ray home-v4-cursor__ray--one" />
        <span className="home-v4-cursor__ray home-v4-cursor__ray--two" />
        <span className="home-v4-cursor__ray home-v4-cursor__ray--three" />
        <span className="home-v4-cursor__ray home-v4-cursor__ray--four" />
      </motion.div>
      {interactive && label && <span className="home-v4-cursor__label">{label.slice(0, 18)}</span>}
    </motion.div>
  );
}

export function SceneHandoff({ motif }: { motif: HandoffMotif }) {
  return (
    <div className={`home-v4-handoff home-v4-handoff--${motif}`} aria-hidden="true">
      <span className="home-v4-handoff__veil" />
      {motif === "river" || motif === "root" ? (
        <svg viewBox="0 0 1200 96" preserveAspectRatio="none">
          <motion.path
            d={
              motif === "river"
                ? "M-20 50 C160 8 290 86 462 48 C638 10 770 88 955 42 C1048 20 1120 27 1220 55"
                : "M-20 74 C130 25 250 90 390 56 C530 22 645 78 756 45 C860 14 1010 70 1220 28"
            }
            fill="none"
            stroke={motif === "river" ? "rgba(125,155,175,.72)" : "rgba(199,119,82,.68)"}
            strokeWidth="1.4"
            strokeDasharray="6 11"
            animate={{ strokeDashoffset: [0, -68], opacity: [0.22, 0.78, 0.22] }}
            transition={{ duration: 7.2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      ) : null}
      {motif === "constellation" && (
        <span className="home-v4-handoff__stars">
          {[12, 28, 44, 61, 78, 91].map((left, index) => (
            <motion.i
              key={left}
              style={{ left: `${left}%`, top: `${28 + (index % 3) * 20}%` }}
              animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.75, 1.35, 0.75] }}
              transition={{ duration: 3.2 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </span>
      )}
    </div>
  );
}
