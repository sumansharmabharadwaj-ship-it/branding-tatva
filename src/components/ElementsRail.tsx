"use client";

import { useEffect, useState } from "react";

// A quiet scrollspy rail, the same idea as a site section nav that
// highlights where you currently are, scoped down to the five elements
// list so it reinforces the site's own structure instead of adding a
// generic UI pattern borrowed from somewhere else.

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
        if (visible.length === 0) return;
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
    <div className="pointer-events-none fixed right-8 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
      {elements.map((el) => {
        const isActive = el.slug === active;
        return (
          <div key={el.slug} className="flex items-center justify-end gap-3">
            <span
              className={`font-body text-[0.65rem] uppercase tracking-[0.25em] transition-all duration-500 ${
                isActive ? "text-soil opacity-100" : "text-foreground-secondary opacity-40"
              }`}
            >
              {el.name}
            </span>
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500"
              style={{
                backgroundColor: el.color,
                opacity: isActive ? 1 : 0.3,
                transform: isActive ? "scale(1.4)" : "scale(1)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
