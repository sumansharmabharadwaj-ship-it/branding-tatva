"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

const CHAPTERS = [
  { id: "choose", label: "Choose", tone: "light" },
  { id: "write", label: "Write", tone: "light" },
  { id: "call", label: "Call", tone: "dark" },
  { id: "thanks", label: "Thank you", tone: "dark" },
] as const;

export function ContactChapterRail() {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const chapters = CHAPTERS.map(({ id }) => document.getElementById(id)).filter(
      (chapter): chapter is HTMLElement => Boolean(chapter),
    );
    if (chapters.length !== CHAPTERS.length) return;

    let frame = 0;

    function update() {
      frame = 0;
      const viewportHeight = Math.max(1, window.visualViewport?.height ?? window.innerHeight);
      const viewportCenter = viewportHeight / 2;
      const firstRect = chapters[0].getBoundingClientRect();
      const lastRect = chapters[chapters.length - 1].getBoundingClientRect();
      const isInsideJourney = firstRect.top <= viewportHeight * 0.76 && lastRect.bottom >= viewportHeight * 0.24;

      if (!isInsideJourney) {
        setActiveIndex((current) => (current === -1 ? current : -1));
        return;
      }

      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const chapterCenter = rect.top + rect.height / 2;
        const distance = Math.abs(chapterCenter - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActiveIndex((current) => (current === nearestIndex ? current : nearestIndex));
    }

    function scheduleUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.visualViewport?.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.visualViewport?.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const visible = activeIndex >= 0;
  const activeChapter = CHAPTERS[Math.max(activeIndex, 0)] ?? CHAPTERS[0];

  return (
    <nav
      data-contact-chapter-rail
      data-visible={visible ? "true" : "false"}
      data-tone={activeChapter.tone}
      aria-label="Contact chapters"
      aria-hidden={!visible}
    >
      <ol>
        {CHAPTERS.map((chapter, index) => {
          const active = index === activeIndex;
          return (
            <li key={chapter.id} data-active={active ? "true" : "false"}>
              <a
                href={`#${chapter.id}`}
                aria-current={active ? "location" : undefined}
                tabIndex={visible ? 0 : -1}
                data-cursor-label={chapter.label}
                onClick={() => {
                  setActiveIndex(index);
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
  );
}
