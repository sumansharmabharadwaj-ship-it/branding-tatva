"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type ChapterEventDetail = {
  id?: string;
  targetId?: string;
  source?: "scroll" | "journey" | "replay";
};

const HEADING_SELECTOR: Record<string, string> = {
  opening: "h1",
  diagnosis: "h2",
  evidence: "h2",
  studio: "h2",
  paths: "h2",
  framework: "h2",
  elements: "p.font-display, h2",
  process: "h2",
  questions: "h2",
  invitation: "h2",
};

const ENTRY_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function chapterTarget(detail?: ChapterEventDetail) {
  if (detail?.targetId) {
    const target = document.getElementById(detail.targetId);
    if (target) return target;
  }

  if (detail?.id) {
    return document.querySelector<HTMLElement>(
      `[data-home-chapter="${detail.id}"]`,
    );
  }

  return document.querySelector<HTMLElement>(
    "[data-home-chapter='opening']",
  );
}

function visibleSupportCopy(target: HTMLElement, heading: Element) {
  const candidates = Array.from(
    target.querySelectorAll<HTMLElement>("p, [role='tabpanel']"),
  );

  return candidates.find((candidate) => {
    if (candidate === heading || candidate.closest("nav")) return false;
    const style = window.getComputedStyle(candidate);
    const rect = candidate.getBoundingClientRect();
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      rect.width > 0 &&
      rect.height > 0
    );
  });
}

function playEntrance(
  target: HTMLElement,
  id: string,
  source: ChapterEventDetail["source"],
) {
  const heading = target.querySelector<HTMLElement>(
    HEADING_SELECTOR[id] ?? "h2",
  );
  if (!heading) return;

  heading.getAnimations().forEach((animation) => animation.cancel());
  heading.animate(
    [
      {
        opacity: 0.34,
        transform: "translate3d(0, 22px, 0)",
        filter: "blur(8px)",
        clipPath: "inset(0 0 28% 0)",
      },
      {
        opacity: 1,
        transform: "translate3d(0, 0, 0)",
        filter: "blur(0px)",
        clipPath: "inset(0 0 0% 0)",
      },
    ],
    {
      duration: source === "journey" || source === "replay" ? 1080 : 860,
      easing: ENTRY_EASE,
      fill: "none",
    },
  );

  const support = visibleSupportCopy(target, heading);
  if (support) {
    support.getAnimations().forEach((animation) => animation.cancel());
    support.animate(
      [
        { opacity: 0.42, transform: "translate3d(0, 12px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 720,
        delay: 130,
        easing: ENTRY_EASE,
        fill: "none",
      },
    );
  }

  const activeInstrument = target.querySelector<HTMLElement>(
    "[role='tabpanel'], [aria-live='polite'], [data-project-journey='true']",
  );
  if (activeInstrument && activeInstrument !== support) {
    activeInstrument.getAnimations().forEach((animation) => animation.cancel());
    activeInstrument.animate(
      [
        { opacity: 0.78, transform: "translate3d(0, 9px, 0) scale(0.992)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      ],
      {
        duration: 780,
        delay: 210,
        easing: ENTRY_EASE,
        fill: "none",
      },
    );
  }
}

export function HomeChapterDirector() {
  const pathname = usePathname();
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (pathname !== "/" || prefersReducedMotion) return;

    function direct(event?: Event) {
      const detail = event
        ? (event as CustomEvent<ChapterEventDetail>).detail
        : ({ id: "opening", source: "scroll" } satisfies ChapterEventDetail);
      const target = chapterTarget(detail);
      if (!target || !detail?.id) return;

      document
        .querySelectorAll<HTMLElement>("[data-home-chapter][data-scene-awake='true']")
        .forEach((chapter) => {
          if (chapter !== target) chapter.removeAttribute("data-scene-awake");
        });

      target.dataset.sceneAwake = "true";
      playEntrance(target, detail.id, detail.source);
    }

    window.addEventListener("bt:home-chapter", direct as EventListener);
    const firstFrame = window.requestAnimationFrame(() => direct());

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.removeEventListener("bt:home-chapter", direct as EventListener);
    };
  }, [pathname, prefersReducedMotion]);

  return null;
}
