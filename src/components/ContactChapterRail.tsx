"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

const CHAPTERS = [
  { id: "choose", label: "Choose", tone: "light" },
  { id: "write", label: "Write", tone: "light" },
  { id: "call", label: "Call", tone: "light" },
  { id: "thanks", label: "Thank you", tone: "light" },
] as const;

export function ContactChapterRail() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [obscuresForm, setObscuresForm] = useState(false);
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const chapters = CHAPTERS.map(({ id }) => document.getElementById(id)).filter(
      (chapter): chapter is HTMLElement => Boolean(chapter),
    );
    if (chapters.length !== CHAPTERS.length) return;

    const root = document.documentElement;
    const compactDock = window.matchMedia("(max-width: 1359px), (pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousReadingIndex = -1;

    function update() {
      frame = 0;
      const viewportHeight = Math.max(1, window.visualViewport?.height ?? window.innerHeight);
      const viewportCenter = viewportHeight / 2;
      const rects = chapters.map((chapter) => chapter.getBoundingClientRect());
      const firstRect = rects[0];
      const lastRect = rects[rects.length - 1];
      setObscuresForm(compactDock.matches && root.dataset.contactFormOwnsViewport === "true");
      // Wait until the first chapter meaningfully enters the frame. The old
      // 76% threshold exposed the rail while the opening hero was still the
      // visitor's primary decision surface on medium desktop viewports.
      const isInsideJourney = firstRect.top <= viewportHeight * 0.6 && lastRect.bottom >= viewportHeight * 0.24;

      if (!isInsideJourney) {
        previousReadingIndex = -1;
        setActiveIndex((current) => (current === -1 ? current : -1));
        return;
      }

      const firstCenter = firstRect.top + firstRect.height / 2;
      const lastCenter = lastRect.top + lastRect.height / 2;
      const journeyDistance = Math.max(1, lastCenter - firstCenter);
      const journeyProgress = Math.min(
        1,
        Math.max(0, (viewportCenter - firstCenter) / journeyDistance),
      );
      const reduceContinuousMotion =
        root.dataset.motion === "reduced" || reducedMotion.matches;
      if (reduceContinuousMotion) {
        railRef.current?.style.removeProperty("--contact-chapter-progress");
      } else {
        railRef.current?.style.setProperty(
          "--contact-chapter-progress",
          journeyProgress.toFixed(4),
        );
      }

      // A small directional buffer keeps trackpad settling and fractional
      // layout changes from alternating chapters at the reading line. Measure
      // section tops so opening optional form fields preserves the Write chapter.
      let readingIndex = 0;
      rects.forEach((rect, index) => {
        const readingLine = previousReadingIndex < 0
          ? viewportCenter
          : viewportCenter + (index <= previousReadingIndex ? 12 : -12);
        if (rect.top <= readingLine) readingIndex = index;
      });

      previousReadingIndex = readingIndex;
      setActiveIndex((current) => (current === readingIndex ? current : readingIndex));
    }

    function scheduleUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    const layoutObserver = new ResizeObserver(scheduleUpdate);
    chapters.forEach((chapter) => layoutObserver.observe(chapter));
    const preferenceObserver = new MutationObserver(scheduleUpdate);
    preferenceObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-motion", "data-contact-form-owns-viewport"],
    });
    compactDock.addEventListener("change", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.visualViewport?.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      layoutObserver.disconnect();
      preferenceObserver.disconnect();
      compactDock.removeEventListener("change", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.visualViewport?.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  // The closing invitation owns its routes; the chapter dock yields so
  // the personal note keeps the selected open composition.
  const visible = activeIndex >= 0 && activeIndex < CHAPTERS.length - 1 && !obscuresForm;
  const activeChapter = CHAPTERS[Math.max(activeIndex, 0)] ?? CHAPTERS[0];

  return (
    <>
      <span
        data-contact-chapter-status
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {activeIndex >= 0
          ? `Chapter ${activeIndex + 1} of ${CHAPTERS.length}: ${activeChapter.label}`
          : ""}
      </span>
      <nav
        ref={railRef}
        data-contact-chapter-rail
        data-contact-chapter-progress="continuous"
        data-visible={visible ? "true" : "false"}
        data-tone={activeChapter.tone}
        data-active-index={visible ? activeIndex : undefined}
        aria-label="Contact chapters"
        aria-hidden={!visible}
        inert={!visible}
      >
        <ol>
          {CHAPTERS.map((chapter, index) => {
            const active = index === activeIndex;
            return (
              <li key={chapter.id} data-active={active ? "true" : "false"}>
                <a
                  href={`#${chapter.id}`}
                  aria-label={`Chapter ${index + 1} of ${CHAPTERS.length}: ${chapter.label}`}
                  aria-current={active ? "location" : undefined}
                  tabIndex={visible ? 0 : -1}
                  data-cursor-label={chapter.label}
                  onClick={() => {
                    // Native scrolling owns chapter selection. An optimistic
                    // destination would flash back through every intermediate
                    // chapter and briefly hide the dock on a Thank you click.
                    track("contact_route_selected", {
                      source: "contact_chapter_rail",
                      route: chapter.id,
                    });
                  }}
                >
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{chapter.label}</strong>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
