"use client";

import { useEffect, useState } from "react";

const CHAPTERS = [
  ["opening", "First impression"],
  ["recognition", "Recognition"],
  ["cost", "Hidden cost"],
  ["foundation", "Foundation"],
  ["paths", "Paths"],
  ["process", "Method"],
  ["evidence", "Evidence"],
  ["tatva", "Tatva system"],
  ["studio", "Studio"],
  ["decision", "Decision"],
  ["invitation", "Invitation"],
] as const;

export function HomeV4ChapterRail() {
  const [activeId, setActiveId] = useState("opening");

  useEffect(() => {
    const sections = CHAPTERS.map(([id]) => document.getElementById(id)).filter(
      (section): section is HTMLElement => Boolean(section),
    );

    const ratios = new Map<HTMLElement, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.set(entry.target as HTMLElement, entry.intersectionRatio));
        const active = sections.reduce(
          (best, section) =>
            (ratios.get(section) ?? 0) > (ratios.get(best) ?? 0) ? section : best,
          sections[0],
        );
        if (active) setActiveId(active.id);
      },
      { rootMargin: "-18% 0px -24% 0px", threshold: [0, 0.15, 0.35, 0.6, 0.85] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="home-v4-chapter-rail" aria-label="Homepage chapters">
      <ol>
        {CHAPTERS.map(([id, label], index) => {
          const active = activeId === id;
          return (
            <li key={id}>
              <a href={`#${id}`} aria-current={active ? "step" : undefined}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{label}</strong>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
