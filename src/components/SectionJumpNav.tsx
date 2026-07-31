"use client";

import { useEffect, useState } from "react";

// A persistent, dark utility bar for long pages with several distinct
// sections — a bounded, deliberate contrast against the site's warm
// cream/serif identity everywhere else, not a wholesale dark-mode
// treatment. Tracked-out uppercase labels read closer to a technical
// index than the display serif used for real headings, which is the
// point: it's a wayfinding tool, not a piece of the page's own voice.

type JumpItem = { href: string; label: string };

export function SectionJumpNav({ items }: { items: JumpItem[] }) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -55% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Jump to section"
      // Audit found this was hidden entirely below sm: with no mobile
      // equivalent — on the exact long pages (Services: 7 items) this
      // exists to help navigate, likely hidden specifically because the
      // full row would overflow a narrow screen if shown unchanged.
      // Now always visible; the row scrolls horizontally on viewports
      // too narrow to fit every item rather than disappearing outright.
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ivory/10 bg-soil/95 backdrop-blur-xs"
    >
      <div className="mx-auto flex max-w-4xl items-center gap-5 overflow-x-auto px-6 py-3 [scrollbar-width:none] sm:justify-between sm:gap-4 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            // terracotta, not clay — clay only reaches 3.41:1 on this dark
            // bar at this text size, below WCAG's 4.5:1 for normal text.
            className={`whitespace-nowrap text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
              activeHref === item.href ? "text-terracotta" : "text-ivory/55 hover:text-ivory"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
