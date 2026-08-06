"use client";

import { useEffect, useMemo, useState } from "react";

// Long-page wayfinding uses two deliberately different densities. Wide
// screens retain the quiet technical index along the bottom edge. On
// mobile, the full-width strip collapses into one safe-area-aware pill
// and opens the destinations only when requested.
type JumpItem = { href: string; label: string };

type SectionJumpNavProps = {
  items: JumpItem[];
  // Conversion chapters such as a booking room need the viewport back.
  // Opting in removes the fixed guide once the final indexed section is
  // active, while every existing call site keeps the persistent default.
  hideOnLast?: boolean;
};

export function SectionJumpNav({ items, hideOnLast = false }: SectionJumpNavProps) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector(item.href))
      .filter((element): element is Element => element !== null);

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

    sections.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  const activeIndex = Math.max(0, items.findIndex((item) => item.href === activeHref));
  const activeItem = items[activeIndex] ?? items[0];
  const finalHref = items[items.length - 1]?.href;
  const hiddenForFinalScene = hideOnLast && Boolean(finalHref) && activeHref === finalHref;
  const position = useMemo(
    () => `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`,
    [activeIndex, items.length]
  );

  useEffect(() => {
    if (hiddenForFinalScene) setMobileOpen(false);
  }, [hiddenForFinalScene]);

  function choose(href: string) {
    setActiveHref(href);
    setMobileOpen(false);
  }

  // The final section can now become a true arrival scene. Returning
  // null also removes every hidden link from keyboard order instead of
  // leaving an invisible fixed layer above the booking interface.
  if (hiddenForFinalScene) return null;

  return (
    <>
      {/* Mobile: one compact guide rather than a bar across the copy. */}
      <nav
        aria-label="Jump to section"
        className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-30 w-[min(19rem,calc(100vw-1.5rem))] -translate-x-1/2 sm:hidden"
      >
        {mobileOpen && (
          <div className="mb-2 grid grid-cols-2 gap-1.5 rounded-2xl border border-ivory/12 bg-soil/95 p-2 shadow-elevation-lg backdrop-blur-md">
            {items.map((item, index) => {
              const active = activeHref === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "location" : undefined}
                  onClick={() => choose(item.href)}
                  className={`flex min-h-11 items-center justify-between rounded-xl px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] transition-colors ${
                    active ? "bg-ivory/10 text-terracotta" : "text-ivory/68 hover:bg-ivory/[0.06] hover:text-ivory"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-display text-xs text-ivory/42" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </a>
              );
            })}
          </div>
        )}

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-label={`${mobileOpen ? "Close" : "Open"} section navigation`}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex min-h-12 w-full items-center justify-between rounded-full border border-ivory/14 bg-soil/95 px-4 py-2.5 shadow-elevation-lg backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 font-display text-sm text-terracotta">{position}</span>
            <span className="truncate text-[0.64rem] font-medium uppercase tracking-[0.16em] text-ivory/78">
              {activeItem?.label ?? "Sections"}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`ml-3 text-base text-terracotta transition-transform duration-300 ${mobileOpen ? "rotate-45" : ""}`}
          >
            +
          </span>
        </button>
      </nav>

      {/* Tablet and desktop: the full technical index remains useful. */}
      <nav
        aria-label="Jump to section"
        className="fixed inset-x-0 bottom-0 z-30 hidden border-t border-ivory/10 bg-soil/95 backdrop-blur-xs sm:block"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const active = activeHref === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? "location" : undefined}
                onClick={() => choose(item.href)}
                className={`whitespace-nowrap text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  active ? "text-terracotta" : "text-ivory/55 hover:text-ivory"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
