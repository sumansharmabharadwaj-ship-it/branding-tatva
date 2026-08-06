"use client";

import { useEffect, useState } from "react";

export type HomeGuideMode = "manual" | "guided" | "paused";

export const HOME_GUIDE_MODE_EVENT = "bt:home-guide-mode";

function isGuideMode(value: unknown): value is HomeGuideMode {
  return value === "manual" || value === "guided" || value === "paused";
}

function readGuideMode(): HomeGuideMode {
  if (typeof document === "undefined") return "manual";
  const mode = document.documentElement.dataset.homeGuideMode;
  return isGuideMode(mode) ? mode : "manual";
}

export function publishHomeGuideMode(mode: HomeGuideMode) {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  document.documentElement.dataset.homeGuideMode = mode;
  window.dispatchEvent(
    new CustomEvent<{ mode: HomeGuideMode }>(HOME_GUIDE_MODE_EVENT, {
      detail: { mode },
    }),
  );
}

export function useHomeGuideMode() {
  const [mode, setMode] = useState<HomeGuideMode>("manual");

  useEffect(() => {
    setMode(readGuideMode());

    function onMode(event: Event) {
      const nextMode = (event as CustomEvent<{ mode?: HomeGuideMode }>).detail?.mode;
      if (isGuideMode(nextMode)) setMode(nextMode);
    }

    window.addEventListener(HOME_GUIDE_MODE_EVENT, onMode as EventListener);
    return () => window.removeEventListener(HOME_GUIDE_MODE_EVENT, onMode as EventListener);
  }, []);

  return mode;
}
