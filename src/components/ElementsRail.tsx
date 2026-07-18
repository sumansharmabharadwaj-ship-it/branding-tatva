"use client";

import { useEffect, useState } from "react";

// A quiet scrollspy rail, the same idea as a site section nav that
// highlights where you currently are, scoped down to the five elements
// list so it reinforces the site's own structure instead of adding a
// generic UI pattern borrowed from somewhere else.
//
// Two things have to hold regardless of what photo or section happens to
// be scrolled behind it: it must disappear once the elements section is
// out of view (it previously stayed active forever after first trigger),
// and its own backdrop must guarantee contrast rather than depending on
// the color of whatever's beneath it.

export function ElementsRail({
  elements,
}: {
  elements: { slug: string; name: string; color: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) {
          setActive(null);
          return;
        }
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActive(topmost.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    const nodes = elements
      .map((el) => document.getElementById(el.slug))
      .filter((node): node is HTMLElement => Boolean(node));
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [elements]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed right-8 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
      {elements.map((el) => {
        const isActive = el.slug === active;
        return (
          <div
            key={el.slug}
            className={`flex items-center justify-end gap-3 rounded-full border py-1.5 pl-3 pr-2 backdrop-blur-md transition-all duration-500 ${
              isActive
                ? "border-soil/15 bg-ivory/90 opacity-100"
                : "border-soil/10 bg-ivory/70 opacity-70"
            }`}
          >
            <span
              className={`font-body text-[0.65rem] uppercase tracking-[0.25em] transition-colors duration-500 ${
                isActive ? "text-soil" : "text-soil/50"
              }`}
            >
              {el.name}
            </span>
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500"
              style={{
                backgroundColor: el.color,
                opacity: isActive ? 1 : 0.4,
                transform: isActive ? "scale(1.4)" : "scale(1)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
