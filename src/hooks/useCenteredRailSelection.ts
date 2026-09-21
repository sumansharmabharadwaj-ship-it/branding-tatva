"use client";

import { useEffect, type RefObject } from "react";

/**
 * Keeps the active item in a horizontal decision rail visible without moving
 * the page vertically. Native focus scrolling can shift the whole viewport;
 * this hook only adjusts the rail's inline position and respects reduced
 * motion for carried choices, keyboard changes, and touch selections alike.
 */
export function useCenteredRailSelection<
  TRail extends HTMLElement,
  TItem extends HTMLElement,
>(
  railRef: RefObject<TRail | null>,
  itemRefs: RefObject<Array<TItem | null>>,
  activeIndex: number,
  prefersReducedMotion: boolean,
) {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const rail = railRef.current;
      const item = itemRefs.current[activeIndex];

      if (!rail || !item || rail.scrollWidth <= rail.clientWidth + 2) return;

      const centeredPosition =
        item.offsetLeft - (rail.clientWidth - item.clientWidth) / 2;
      const maximumPosition = Math.max(0, rail.scrollWidth - rail.clientWidth);

      rail.scrollTo({
        left: Math.min(maximumPosition, Math.max(0, centeredPosition)),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, itemRefs, prefersReducedMotion, railRef]);
}
