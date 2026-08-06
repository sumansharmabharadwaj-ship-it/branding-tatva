"use client";

import { useEffect, useState } from "react";

// Long-page wayfinding uses two deliberately different densities. Wide
// screens retain the quiet technical index along the bottom edge. On
// mobile, wayfinding becomes one small corner dial. The complete index
// occupies the viewport only after the visitor explicitly opens it, so
// reading, forms, and calls to action keep their full width.
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
      {/* Mobile: one 48px chapter dial. Earlier 56px evidence showed the
          control covering live Authority and Audit content. This keeps a
          compliant touch target while returning more of the reading
          plane to the chapter underneath it. */}
      <nav
        aria-label="Jump to section"
        data-section-jump-nav-mobile="true"
        className="fixed bottom-[calc(0.65rem+env(safe-area-inset-bottom))] right-[calc(0.65rem+env(safe-area-inset-right))] z-30 sm:hidden"
      >
        {mobileOpen && (
          <div className="absolute bottom-[calc(100%+0.5rem)] right-0 grid w-[min(19rem,calc(100vw-1.5rem))] grid-cols-2 gap-1.5 rounded-2xl border border-ivory/12 bg-soil/95 p-2 shadow-elevation-lg backdrop-blur-md">
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
          data-section-jump-nav-trigger="true"
          aria-expanded={mobileOpen}
          aria-label={`${mobileOpen ? "Close" : "Open"} section navigation. Current chapter ${activeIndex + 1} of ${items.length}: ${activeItem?.label ?? "Sections"}`}
          onClick={() => setMobileOpen((open) => !open)}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-ivory/14 bg-soil/88 shadow-elevation-lg backdrop-blur-md transition-[opacity,transform,background-color] duration-300 hover:scale-[1.03] hover:bg-soil focus-visible:bg-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <span className="flex flex-col items-center justify-center leading-none" aria-hidden="true">
            <span className="font-display text-sm text-terracotta">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[0.43rem] font-medium uppercase tracking-[0.1em] text-ivory/46">
              / {String(items.length).padStart(2, "0")}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`absolute right-1 top-0.5 text-[0.68rem] text-terracotta transition-transform duration-300 ${mobileOpen ? "rotate-45" : ""}`}
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
