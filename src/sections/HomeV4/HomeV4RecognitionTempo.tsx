"use client";

import { useEffect, useRef, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useHomeGuideMode } from "@/hooks/useHomeGuideMode";

const RECOGNITION_SELECTOR = '[data-home-v4-chapter="recognition"]';
const BUTTON_SELECTOR = ".home-v4-recognition__diagram button";
const FINE_POINTER_QUERY = "(min-width: 821px) and (hover: hover) and (pointer: fine)";
const FIRST_ADVANCE_MS = 1350;
const AUTO_ADVANCE_MS = 2400;
const USER_HOLD_MS = 11000;
const TOUCH_HOLD_REFRESH_MS = 3200;

/**
 * Recognition owns the real semantic state. This director only coordinates its
 * existing three buttons with the live V4 pace, using the same outside-control
 * pattern as HomeV4ProcessTempo.
 *
 * Fine-pointer desktop: a first meaningful change arrives quickly, then the
 * three conditions rotate every 2.4s while visible.
 *
 * Touch/tablet: no automatic condition changes. A quiet synthetic re-selection
 * of the already-active button refreshes Recognition's own internal reading
 * hold, keeping the scene tap-led without creating a second state model.
 *
 * Real pointer/focus interaction always gets the full 11-second reading hold.
 */
export function HomeV4RecognitionTempo() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const guideMode = useHomeGuideMode();
  const [visible, setVisible] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [revision, setRevision] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef(0);
  const touchRefreshRef = useRef(0);
  const holdUntilRef = useRef(0);
  const firstAdvanceRef = useRef(true);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(RECOGNITION_SELECTOR);
    if (!section) return;
    sectionRef.current = section;
    section.dataset.recognitionTempoManaged = "true";

    const media = window.matchMedia(FINE_POINTER_QUERY);
    const syncPointer = () => setFinePointer(media.matches);
    syncPointer();
    media.addEventListener("change", syncPointer);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.22);
        setVisible(nextVisible);
        if (!nextVisible) firstAdvanceRef.current = true;
      },
      {
        rootMargin: "8% 0px -12% 0px",
        threshold: [0, 0.22, 0.4, 0.64],
      },
    );
    observer.observe(section);

    function holdForReading(event: Event) {
      // Synthetic HTMLElement.click() does not emit pointerdown or focusin, so
      // this only records real user intent (or explicit keyboard focus).
      const target = event.target;
      if (!(target instanceof Element) || !target.closest(BUTTON_SELECTOR)) return;
      holdUntilRef.current = Date.now() + USER_HOLD_MS;
      window.clearTimeout(timerRef.current);
      setRevision((value) => value + 1);
    }

    function onVisibilityChange() {
      setRevision((value) => value + 1);
    }

    section.addEventListener("pointerdown", holdForReading, { passive: true });
    section.addEventListener("touchstart", holdForReading, { passive: true });
    section.addEventListener("focusin", holdForReading);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncPointer);
      section.removeEventListener("pointerdown", holdForReading);
      section.removeEventListener("touchstart", holdForReading);
      section.removeEventListener("focusin", holdForReading);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearTimeout(timerRef.current);
      window.clearInterval(touchRefreshRef.current);
      delete section.dataset.recognitionTempoManaged;
      sectionRef.current = null;
    };
  }, []);

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    window.clearInterval(touchRefreshRef.current);

    const section = sectionRef.current;
    if (!section || !visible || prefersReducedMotion || guideMode === "paused" || document.hidden) return;

    const buttons = Array.from(section.querySelectorAll<HTMLButtonElement>(BUTTON_SELECTOR));
    if (buttons.length < 2) return;

    if (!finePointer) {
      // Touch stays on whichever state the visitor chose. Refreshing the
      // active button only renews the component's own auto-rotation hold.
      const refreshActiveHold = () => {
        const active = buttons.find((button) => button.getAttribute("aria-pressed") === "true") ?? buttons[0];
        active?.click();
      };
      refreshActiveHold();
      touchRefreshRef.current = window.setInterval(refreshActiveHold, TOUCH_HOLD_REFRESH_MS);
      return () => window.clearInterval(touchRefreshRef.current);
    }

    const remaining = Math.max(0, holdUntilRef.current - Date.now());
    if (remaining > 0) {
      timerRef.current = window.setTimeout(() => setRevision((value) => value + 1), remaining + 40);
      return;
    }

    const currentIndex = Math.max(
      0,
      buttons.findIndex((button) => button.getAttribute("aria-pressed") === "true"),
    );
    const delay = firstAdvanceRef.current ? FIRST_ADVANCE_MS : AUTO_ADVANCE_MS;

    timerRef.current = window.setTimeout(() => {
      if (document.hidden || Date.now() < holdUntilRef.current) return;
      firstAdvanceRef.current = false;
      buttons[(currentIndex + 1) % buttons.length]?.click();
      setRevision((value) => value + 1);
    }, delay);

    return () => window.clearTimeout(timerRef.current);
  }, [finePointer, guideMode, prefersReducedMotion, revision, visible]);

  return null;
}
