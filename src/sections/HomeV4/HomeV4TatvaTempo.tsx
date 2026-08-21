"use client";

import { useEffect, useRef, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useHomeGuideMode } from "@/hooks/useHomeGuideMode";

const TATVA_SELECTOR = '[data-home-v4-chapter="tatva"]';
const FORCE_SELECTOR = ".tatva-pressure-lab__copy .tatva-pressure-lab__force";
const NODE_SELECTOR = ".tatva-pressure-lab__node";
const RESTORE_SELECTOR = ".tatva-pressure-lab__restore";
const INTERACTION_SELECTOR = `${FORCE_SELECTOR}, ${NODE_SELECTOR}, ${RESTORE_SELECTOR}`;
const FINE_POINTER_QUERY = "(min-width: 821px) and (hover: hover) and (pointer: fine)";
const FIRST_ADVANCE_MS = 1150;
const AUTO_ADVANCE_MS = 2250;
const USER_HOLD_MS = 16000;
const TOUCH_HOLD_REFRESH_MS = 3400;

/**
 * TatvaSystemLab remains the sole owner of the active mechanism state.
 * This director only coordinates its existing controls with the compressed V4
 * homepage rhythm.
 *
 * Fine-pointer desktop demonstrates the pressure model quickly enough that the
 * 3.4s guided chapter reveals more than a static board. Touch stays manual by
 * repeatedly invoking the lab's no-op "restore all" action, which renews the
 * component's own auto-rotation hold without changing the visitor's state.
 */
export function HomeV4TatvaTempo() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const guideMode = useHomeGuideMode();
  const [visible, setVisible] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [revision, setRevision] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef(0);
  const touchRefreshRef = useRef(0);
  const holdUntilRef = useRef(0);
  const nextIndexRef = useRef(0);
  const firstAdvanceRef = useRef(true);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(TATVA_SELECTOR);
    if (!section) return;
    sectionRef.current = section;
    section.dataset.tatvaTempoManaged = "true";

    const media = window.matchMedia(FINE_POINTER_QUERY);
    const syncPointer = () => setFinePointer(media.matches);
    syncPointer();
    media.addEventListener("change", syncPointer);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.2);
        setVisible(nextVisible);
        if (!nextVisible) {
          firstAdvanceRef.current = true;
          nextIndexRef.current = 0;
        }
      },
      {
        rootMargin: "8% 0px -12% 0px",
        threshold: [0, 0.2, 0.42, 0.68],
      },
    );
    observer.observe(section);

    function holdForReading(event: Event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest(INTERACTION_SELECTOR)) return;
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
      delete section.dataset.tatvaTempoManaged;
      sectionRef.current = null;
    };
  }, []);

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    window.clearInterval(touchRefreshRef.current);

    const section = sectionRef.current;
    if (!section || !visible || prefersReducedMotion || guideMode === "paused" || document.hidden) return;

    const forces = Array.from(section.querySelectorAll<HTMLButtonElement>(FORCE_SELECTOR));
    const restore = section.querySelector<HTMLButtonElement>(RESTORE_SELECTOR);
    if (forces.length < 2 || !restore) return;

    if (!finePointer) {
      // `restore.click()` is a semantic no-op when the full system is already
      // restored, and after a visitor selects a force their real pointer event
      // activates the external hold before this interval can run again.
      const refreshLabHold = () => {
        if (Date.now() >= holdUntilRef.current) restore.click();
      };
      refreshLabHold();
      touchRefreshRef.current = window.setInterval(refreshLabHold, TOUCH_HOLD_REFRESH_MS);
      return () => window.clearInterval(touchRefreshRef.current);
    }

    const remaining = Math.max(0, holdUntilRef.current - Date.now());
    if (remaining > 0) {
      timerRef.current = window.setTimeout(() => setRevision((value) => value + 1), remaining + 40);
      return;
    }

    const delay = firstAdvanceRef.current ? FIRST_ADVANCE_MS : AUTO_ADVANCE_MS;
    timerRef.current = window.setTimeout(() => {
      if (document.hidden || Date.now() < holdUntilRef.current) return;
      firstAdvanceRef.current = false;
      const nextIndex = nextIndexRef.current % forces.length;
      forces[nextIndex]?.click();
      nextIndexRef.current = (nextIndex + 1) % forces.length;
      setRevision((value) => value + 1);
    }, delay);

    return () => window.clearTimeout(timerRef.current);
  }, [finePointer, guideMode, prefersReducedMotion, revision, visible]);

  return null;
}
