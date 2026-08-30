"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

type ScrollDrivenVisualizerOptions = {
  count: number;
  target: RefObject<HTMLElement | null>;
  enabled?: boolean;
  reducedMotion?: boolean;
};

const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);

function stageFromProgress(progress: number, count: number) {
  const safeCount = Math.max(1, count);
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(safeCount - 1, Math.floor(clamped * safeCount));
}

/**
 * Turns a sticky scene's scroll runway into a reversible timeline.
 *
 * Hover and keyboard focus can preview any state without fighting the page.
 * Releasing that preview immediately returns the visualizer to the state that
 * corresponds with the visitor's current scroll position. A click selects the
 * requested state and the next real scroll movement resumes the timeline.
 */
export function useScrollDrivenVisualizer({
  count,
  target,
  enabled = true,
  reducedMotion = false,
}: ScrollDrivenVisualizerOptions) {
  const safeCount = Math.max(1, count);
  const [activeIndex, setActiveIndex] = useState(0);
  const previewingRef = useRef(false);
  const manualChoiceRef = useRef(false);
  const manualChoiceIndexRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });

  const readProgress = useCallback(() => {
    const node = target.current;
    if (!node || typeof window === "undefined") return scrollYProgress.get();

    const rect = node.getBoundingClientRect();
    const runway = rect.height - window.innerHeight;
    if (runway <= 1) return scrollYProgress.get();

    return Math.min(1, Math.max(0, -rect.top / runway));
  }, [scrollYProgress, target]);

  const syncToScroll = useCallback(() => {
    if (reducedMotion || manualChoiceRef.current) return;
    const nextIndex = stageFromProgress(readProgress(), safeCount);
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  }, [readProgress, reducedMotion, safeCount]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!enabled || reducedMotion || previewingRef.current || manualChoiceRef.current) return;
    const nextIndex = stageFromProgress(progress, safeCount);
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  /* Framer's motion value can miss a synthetic/assisted scroll frame when a
     sticky child is exactly one viewport tall. The browser scroll event is the
     source of truth for the runway, so keep a lightweight RAF-synchronised
     fallback. This also makes wheel, trackpad, keyboard and browser-assisted
     scrolling resolve to the same reversible state. */
  useEffect(() => {
    if (!enabled || reducedMotion) return;

    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (previewingRef.current || manualChoiceRef.current) return;
        const progress = readProgress();
        const nextIndex = stageFromProgress(progress, safeCount);
        setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled, readProgress, reducedMotion, safeCount]);

  useEffect(() => {
    if (reducedMotion) return;

    const releaseManualChoice = () => {
      manualChoiceRef.current = false;
    };
    const releaseManualChoiceFromKeyboard = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key)) return;
      if (
        event.target instanceof Element &&
        target.current?.contains(event.target) &&
        event.target.closest('[role="tablist"]')
      ) return;
      releaseManualChoice();
    };

    window.addEventListener("wheel", releaseManualChoice, { passive: true });
    window.addEventListener("touchstart", releaseManualChoice, { passive: true });
    window.addEventListener("keydown", releaseManualChoiceFromKeyboard);

    return () => {
      window.removeEventListener("wheel", releaseManualChoice);
      window.removeEventListener("touchstart", releaseManualChoice);
      window.removeEventListener("keydown", releaseManualChoiceFromKeyboard);
    };
  }, [reducedMotion, target]);

  const choose = useCallback(
    (index: number) => {
      const nextIndex = ((index % safeCount) + safeCount) % safeCount;
      previewingRef.current = false;
      manualChoiceRef.current = true;
      manualChoiceIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    },
    [safeCount],
  );

  const preview = useCallback(
    (index: number) => {
      const nextIndex = ((index % safeCount) + safeCount) % safeCount;
      previewingRef.current = true;
      setActiveIndex(nextIndex);
    },
    [safeCount],
  );

  const releasePreview = useCallback(() => {
    previewingRef.current = false;
    if (manualChoiceRef.current) {
      setActiveIndex(manualChoiceIndexRef.current);
      return;
    }
    syncToScroll();
  }, [syncToScroll]);

  return {
    activeIndex,
    choose,
    preview,
    releasePreview,
    scrollYProgress,
  };
}
