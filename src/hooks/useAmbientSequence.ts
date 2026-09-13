"use client";

import { useCallback, useEffect, useState } from "react";

type AmbientSequenceOptions = {
  count: number;
  enabled?: boolean;
  reducedMotion?: boolean;
  intervalMs?: number;
};

/**
 * A quiet, optional autoplay layer for compact visualizers.
 *
 * Pointer and keyboard exploration always takes priority. Autoplay resumes
 * only after that interaction ends, while reduced-motion visitors keep a
 * stable first state and can still choose every state manually.
 */
export function useAmbientSequence({
  count,
  enabled = true,
  reducedMotion = false,
  intervalMs = 5200,
}: AmbientSequenceOptions) {
  const safeCount = Math.max(1, count);
  const [activeIndex, setActiveIndex] = useState(0);
  const [exploring, setExploring] = useState(false);

  useEffect(() => {
    if (!enabled || reducedMotion || exploring || safeCount < 2) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % safeCount);
    }, intervalMs);

    return () => window.clearTimeout(timer);
  }, [activeIndex, enabled, exploring, intervalMs, reducedMotion, safeCount]);

  const choose = useCallback(
    (index: number) => {
      setActiveIndex(((index % safeCount) + safeCount) % safeCount);
    },
    [safeCount],
  );

  const preview = useCallback(
    (index: number) => {
      setExploring(true);
      setActiveIndex(((index % safeCount) + safeCount) % safeCount);
    },
    [safeCount],
  );

  const release = useCallback(() => setExploring(false), []);

  return { activeIndex, choose, preview, release };
}
