"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";

type ChapterEventDetail = {
  id?: string;
  source?: "scroll" | "journey" | "replay";
};

const LAB_REVEAL_DELAY_MS = 9400;

export function FrameworkJourneyNudge() {
  const lenis = useLenis();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const timerRef = useRef(0);

  useEffect(() => {
    function clearScheduledReveal() {
      window.clearTimeout(timerRef.current);
      timerRef.current = 0;
    }

    function revealLab() {
      const heading = document.getElementById("tatva-system-lab-title");
      const target = heading?.closest("section");
      if (!(target instanceof HTMLElement)) return;

      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(target, { offset: -72, duration: 1.05 });
        return;
      }

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }

    function onChapter(event: Event) {
      const detail = (event as CustomEvent<ChapterEventDetail>).detail;
      clearScheduledReveal();

      if (
        detail?.id !== "framework" ||
        (detail.source !== "journey" && detail.source !== "replay")
      ) {
        return;
      }

      timerRef.current = window.setTimeout(revealLab, LAB_REVEAL_DELAY_MS);
    }

    const cancelEvents: Array<keyof WindowEventMap> = [
      "wheel",
      "pointerdown",
      "touchstart",
      "keydown",
    ];

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    cancelEvents.forEach((eventName) => {
      window.addEventListener(eventName, clearScheduledReveal, { passive: true });
    });

    return () => {
      clearScheduledReveal();
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
      cancelEvents.forEach((eventName) => {
        window.removeEventListener(eventName, clearScheduledReveal);
      });
    };
  }, [lenis, prefersReducedMotion]);

  return null;
}
