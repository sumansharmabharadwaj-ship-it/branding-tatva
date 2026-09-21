"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";

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
  persistManualSelection = false,
  followScroll = true,
}: {
  count: number;
  target: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
  persistManualSelection?: boolean;
  followScroll?: boolean;
}) {
  const safeCount = Math.max(1, count);
  const [activeIndex, setActiveIndex] = useState(0);
  // Decorative traces share the same owner as the selected step. A pointer
  // preview must move the light and the ledger together, even without scroll.
  const stageProgress = useMotionValue(0);
  const manualUntilRef = useRef(0);
  const manualProgressRef = useRef<number | null>(null);
  const hasManualSelectionRef = useRef(false);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.82", "end 0.18"],
    trackContentSize: true,
  });

  const syncToProgress = useCallback(
    (progress: number) => {
      // A route choice must survive scrolling through a panel that is taller
      // than the viewport, so its actions still belong to the selected route.
      if (!followScroll || reducedMotion || (persistManualSelection && hasManualSelectionRef.current)) return;

      const manualProgress = manualProgressRef.current;
      if (Date.now() < manualUntilRef.current && manualProgress !== null) {
        // Pointer/focus previews should feel stable while the page is still,
        // but the first intentional wheel or touch movement immediately gives
        // control back to the scroll timeline.
        if (Math.abs(progress - manualProgress) < SCROLL_RECLAIM_THRESHOLD) return;
        manualUntilRef.current = 0;
        manualProgressRef.current = null;
      }

      stageProgress.set(progress);
      const nextIndex = stageFromProgress(progress, safeCount);
      setActiveIndex((current) => {
        // A small dead band prevents trackpad settling at a boundary from
        // repeatedly exchanging the two highlighted rows.
        const lower = current / safeCount - SCROLL_RECLAIM_THRESHOLD;
        const upper = (current + 1) / safeCount + SCROLL_RECLAIM_THRESHOLD;
        return progress >= lower && progress <= upper ? current : nextIndex;
      });
    },
    [followScroll, persistManualSelection, reducedMotion, safeCount, stageProgress],
  );

  useMotionValueEvent(scrollYProgress, "change", syncToProgress);

  useEffect(() => {
    syncToProgress(scrollYProgress.get());
  }, [scrollYProgress, syncToProgress]);

  const choose = useCallback(
    (index: number) => {
      const nextIndex = ((index % safeCount) + safeCount) % safeCount;
      hasManualSelectionRef.current = true;
      manualUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      manualProgressRef.current = scrollYProgress.get();
      stageProgress.set((nextIndex + 0.5) / safeCount);
      setActiveIndex(nextIndex);
    },
    [safeCount, scrollYProgress, stageProgress],
  );

  return { activeIndex, choose, scrollYProgress, stageProgress };
}
