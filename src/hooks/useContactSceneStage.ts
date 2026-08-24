"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const MANUAL_HOLD_MS = 1800;
const SCROLL_RECLAIM_THRESHOLD = 0.012;

function stageFromProgress(progress: number, count: number) {
  const safeCount = Math.max(1, count);
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(safeCount - 1, Math.floor(clamped * safeCount));
}

/**
 * A compact, reversible timeline for Contact's one-screen chapters.
 *
 * Scroll owns the default state, while pointer, keyboard and touch taps can
 * briefly inspect any beat without fighting the next native scroll movement.
 */
export function useContactSceneStage({
  count,
  target,
  reducedMotion = false,
}: {
  count: number;
  target: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
}) {
  const safeCount = Math.max(1, count);
  const [activeIndex, setActiveIndex] = useState(0);
  const manualUntilRef = useRef(0);
  const manualProgressRef = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.82", "end 0.18"],
  });

  const syncToProgress = useCallback(
    (progress: number) => {
      if (reducedMotion) return;

      const manualProgress = manualProgressRef.current;
      if (Date.now() < manualUntilRef.current && manualProgress !== null) {
        // Pointer/focus previews should feel stable while the page is still,
        // but the first intentional wheel or touch movement immediately gives
        // control back to the scroll timeline.
        if (Math.abs(progress - manualProgress) < SCROLL_RECLAIM_THRESHOLD) return;
        manualUntilRef.current = 0;
        manualProgressRef.current = null;
      }

      const nextIndex = stageFromProgress(progress, safeCount);
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    },
    [reducedMotion, safeCount],
  );

  useMotionValueEvent(scrollYProgress, "change", syncToProgress);

  useEffect(() => {
    syncToProgress(scrollYProgress.get());
  }, [scrollYProgress, syncToProgress]);

  const choose = useCallback(
    (index: number) => {
      const nextIndex = ((index % safeCount) + safeCount) % safeCount;
      manualUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      manualProgressRef.current = scrollYProgress.get();
      setActiveIndex(nextIndex);
    },
    [safeCount, scrollYProgress],
  );

  return { activeIndex, choose, scrollYProgress };
}
