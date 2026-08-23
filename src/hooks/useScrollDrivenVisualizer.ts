"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

type ScrollDrivenVisualizerOptions = {
  count: number;
  target: RefObject<HTMLElement | null>;
  enabled?: boolean;
  reducedMotion?: boolean;
};

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
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });

  const syncToScroll = useCallback(() => {
    if (!enabled || reducedMotion) return;
    const nextIndex = stageFromProgress(scrollYProgress.get(), safeCount);
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  }, [enabled, reducedMotion, safeCount, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!enabled || reducedMotion || previewingRef.current) return;
    const nextIndex = stageFromProgress(progress, safeCount);
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  const choose = useCallback(
    (index: number) => {
      const nextIndex = ((index % safeCount) + safeCount) % safeCount;
      previewingRef.current = false;
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
