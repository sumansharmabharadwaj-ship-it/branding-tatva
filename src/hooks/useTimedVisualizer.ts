"use client";

import { useCallback, useEffect, useState } from "react";

type TimedVisualizerOptions = {
  count: number;
  durationMs?: number;
  enabled?: boolean;
  reducedMotion?: boolean;
};

export function useTimedVisualizer({
  count,
  durationMs = 5200,
  enabled = true,
  reducedMotion = false,
}: TimedVisualizerOptions) {
  const safeCount = Math.max(1, count);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    function syncVisibility() {
      setDocumentVisible(!document.hidden);
    }

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  const isRunning = enabled && playing && documentVisible && !reducedMotion;

  useEffect(() => {
    if (!isRunning || safeCount < 2) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % safeCount);
      setCycle((current) => current + 1);
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [activeIndex, cycle, durationMs, isRunning, safeCount]);

  const choose = useCallback(
    (index: number, pause = true) => {
      const nextIndex = ((index % safeCount) + safeCount) % safeCount;
      setActiveIndex(nextIndex);
      setCycle((current) => current + 1);
      if (pause) setPlaying(false);
    },
    [safeCount],
  );

  const toggle = useCallback(() => {
    setPlaying((current) => !current);
    setCycle((current) => current + 1);
  }, []);

  const progressKey = `${activeIndex}-${cycle}-${isRunning ? "running" : "paused"}`;

  return {
    activeIndex,
    choose,
    durationMs,
    isRunning,
    playing,
    progressKey,
    setPlaying,
    toggle,
  };
}
