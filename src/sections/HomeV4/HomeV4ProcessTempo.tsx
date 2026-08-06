"use client";

import { useEffect, useRef, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useHomeGuideMode } from "@/hooks/useHomeGuideMode";

const PROCESS_SELECTOR = '[data-project-journey="true"]';
const TAB_SELECTOR = '.project-journey__rail [role="tab"]';
const FIRST_ADVANCE_MS = 2400;
const AUTO_ADVANCE_MS = 4200;
const USER_HOLD_MS = 12000;

/**
 * The Process scene already owns its semantic state and accessible tabs.
 * This director only tightens the pace from the outside so the working method
 * begins changing within one reading beat rather than waiting through a long
 * static interval. Programmatic selection uses the same tab controls a visitor
 * uses, which keeps the diagram, video, proof card, and readiness signals in
 * sync without creating a second visual state model.
 */
export function HomeV4ProcessTempo() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const guideMode = useHomeGuideMode();
  const [visible, setVisible] = useState(false);
  const [revision, setRevision] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const holdUntilRef = useRef(0);
  const timerRef = useRef(0);
  const firstAdvanceRef = useRef(true);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(PROCESS_SELECTOR);
    if (!section) return;
    sectionRef.current = section;
    section.dataset.processTempoManaged = "true";

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.18);
        setVisible(nextVisible);
        if (!nextVisible) firstAdvanceRef.current = true;
      },
      {
        rootMargin: "10% 0px -12% 0px",
        threshold: [0, 0.18, 0.38, 0.62],
      },
    );
    observer.observe(section);

    const mutationObserver = new MutationObserver(() => setRevision((value) => value + 1));
    mutationObserver.observe(section, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-selected"],
    });

    function holdForReading() {
      holdUntilRef.current = Date.now() + USER_HOLD_MS;
      window.clearTimeout(timerRef.current);
      setRevision((value) => value + 1);
    }

    function resumeAfterVisibilityChange() {
      setRevision((value) => value + 1);
    }

    section.addEventListener("pointerdown", holdForReading, { passive: true });
    section.addEventListener("touchstart", holdForReading, { passive: true });
    section.addEventListener("focusin", holdForReading);
    document.addEventListener("visibilitychange", resumeAfterVisibilityChange);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      section.removeEventListener("pointerdown", holdForReading);
      section.removeEventListener("touchstart", holdForReading);
      section.removeEventListener("focusin", holdForReading);
      document.removeEventListener("visibilitychange", resumeAfterVisibilityChange);
      delete section.dataset.processTempoManaged;
      sectionRef.current = null;
      window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    window.clearTimeout(timerRef.current);

    if (
      prefersReducedMotion ||
      guideMode === "paused" ||
      !visible ||
      document.hidden ||
      Date.now() < holdUntilRef.current
    ) {
      const remaining = Math.max(0, holdUntilRef.current - Date.now());
      if (remaining > 0 && visible && !prefersReducedMotion && guideMode !== "paused") {
        timerRef.current = window.setTimeout(
          () => setRevision((value) => value + 1),
          remaining + 40,
        );
      }
      return;
    }

    const section = sectionRef.current;
    if (!section) return;
    const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>(TAB_SELECTOR));
    if (tabs.length < 2) return;

    const currentIndex = Math.max(
      0,
      tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"),
    );
    const delay = firstAdvanceRef.current ? FIRST_ADVANCE_MS : AUTO_ADVANCE_MS;

    timerRef.current = window.setTimeout(() => {
      if (document.hidden || Date.now() < holdUntilRef.current) return;
      firstAdvanceRef.current = false;
      tabs[(currentIndex + 1) % tabs.length]?.click();
      setRevision((value) => value + 1);
    }, delay);

    return () => window.clearTimeout(timerRef.current);
  }, [guideMode, prefersReducedMotion, revision, visible]);

  return null;
}
