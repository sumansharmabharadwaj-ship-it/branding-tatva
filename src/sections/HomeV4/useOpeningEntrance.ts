"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

/** A single optional entrance. Visitor intent consumes a pending entrance too. */
export function useOpeningEntrance(sectionRef: RefObject<HTMLElement | null>, hydrated: boolean, still: boolean) {
  const played = useRef(false);
  const animations = useRef<Animation[]>([]);
  const cancelAnimations = useCallback(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
  }, []);
  const stopEntrance = useCallback(() => {
    played.current = true;
    cancelAnimations();
  }, [cancelAnimations]);

  useEffect(() => {
    if (!hydrated) return;
    if (still) { stopEntrance(); return; }
    if (played.current) return;
    const section = sectionRef.current;
    if (!section) return;
    function hasSelection() {
      const selection = document.getSelection();
      return Boolean(selection && !selection.isCollapsed && selection.rangeCount
        && selection.getRangeAt(0).intersectsNode(section!));
    }
    function start() {
      if (played.current) return;
      played.current = true;
      if (window.scrollY > 80 || section!.contains(document.activeElement) || document.hidden || hasSelection()) return;
      const compact = window.matchMedia("(max-width: 820px)").matches;
      animations.current = Array.from(section!.querySelectorAll<HTMLElement>("[data-opening-word]")).flatMap((word, index) =>
        typeof word.animate === "function" ? [word.animate([
          { transform: `translate3d(0, ${compact ? 10 : 22}px, 0) rotate(${compact ? 0 : 2}deg)` },
          { transform: "translate3d(0, 0, 0) rotate(0deg)" },
        ], { duration: 850, delay: index * 45, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" })] : [],
      );
    }
    function onSelection() { if (hasSelection()) stopEntrance(); }
    function onVisibility() { if (document.hidden) stopEntrance(); }
    if (document.documentElement.dataset.homePreludeReady === "true") start();
    window.addEventListener("bt:home-prelude-ready", start, { once: true });
    const intentEvents = ["scroll", "wheel", "touchstart", "pointerdown", "keydown", "focusin"] as const;
    intentEvents.forEach((event) => window.addEventListener(event, stopEntrance, { passive: true, once: true }));
    document.addEventListener("selectionchange", onSelection);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimations();
      window.removeEventListener("bt:home-prelude-ready", start);
      intentEvents.forEach((event) => window.removeEventListener(event, stopEntrance));
      document.removeEventListener("selectionchange", onSelection);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [cancelAnimations, hydrated, sectionRef, still, stopEntrance]);

  return stopEntrance;
}
