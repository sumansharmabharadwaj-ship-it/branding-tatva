"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Long-page wayfinding uses different densities according to the route.
// Most pages retain the quiet technical index along the bottom edge. A
// cinematic route can opt into a narrow desktop rail instead, while mobile
// keeps one small corner dial. The complete index only expands after the
// visitor asks for it, so reading, forms, and calls to action keep their space.
type JumpItem = { href: string; label: string };

type ServicesChapterEventDetail = {
  chapters?: Array<{ href?: string; label?: string }>;
};

type ServicesActiveChapterEventDetail = {
  href?: string;
};

type SectionJumpNavProps = {
  items: JumpItem[];
  // Conversion chapters such as a booking room need the viewport back.
  // Opting in removes the fixed guide once the final indexed section is
  // active, while every existing call site keeps the persistent default.
  hideOnLast?: boolean;
  // The compact rail is intentionally opt in. Services uses it by default;
  // other routes retain the established bottom bar unless they request it.
  desktopMode?: "bar" | "rail";
};

const SERVICES_CHAPTERS_READY_EVENT = "bt:services-chapters-ready";
const SERVICES_ACTIVE_CHAPTER_EVENT = "bt:services-active-chapter";

function validChapterItems(chapters: ServicesChapterEventDetail["chapters"]): JumpItem[] {
  if (!Array.isArray(chapters)) return [];
  return chapters.flatMap((chapter) =>
    typeof chapter.href === "string" &&
    chapter.href.startsWith("#") &&
    typeof chapter.label === "string" &&
    chapter.label.trim()
      ? [{ href: chapter.href, label: chapter.label }]
      : [],
  );
}

export function SectionJumpNav({
  items,
  hideOnLast = false,
  desktopMode,
}: SectionJumpNavProps) {
  const pathname = usePathname();
  const isServicesRoute = pathname === "/services";
  const resolvedDesktopMode = desktopMode ?? (isServicesRoute ? "rail" : "bar");
  const [servicesItems, setServicesItems] = useState<JumpItem[] | null>(null);
  const navigationItems = isServicesRoute && servicesItems?.length ? servicesItems : items;
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Services contains more directed scenes than the page's short editorial
  // hero index. The runtime publishes every real scene after it has assigned
  // stable IDs. This lets the fixed route guide represent the complete film
  // without duplicating scene metadata in the server page.
  useEffect(() => {
    if (!isServicesRoute) {
      setServicesItems(null);
      return;
    }

    function syncFromDom() {
      const discovered = Array.from(
        document.querySelectorAll<HTMLElement>("[data-services-scroll-scene][id]"),
      ).flatMap((scene) => {
        const label = scene.dataset.servicesChapterLabel;
        return scene.id && label ? [{ href: `#${scene.id}`, label }] : [];
      });
      if (discovered.length > 0) setServicesItems(discovered);
    }

    function onChaptersReady(event: Event) {
      const detail = (event as CustomEvent<ServicesChapterEventDetail>).detail;
      const next = validChapterItems(detail?.chapters);
      if (next.length > 0) setServicesItems(next);
    }

    window.addEventListener(SERVICES_CHAPTERS_READY_EVENT, onChaptersReady as EventListener);
    // Effects across the page and route layout can mount in either order.
    // Two animation frames give the runtime one paint cycle to assign scene
    // anchors when its ready event fired before this listener attached.
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(syncFromDom);
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener(SERVICES_CHAPTERS_READY_EVENT, onChaptersReady as EventListener);
    };
  }, [isServicesRoute]);

  useEffect(() => {
    if (isServicesRoute) {
      function syncFromRuntime(event?: Event) {
        const eventHref = (event as CustomEvent<ServicesActiveChapterEventDetail> | undefined)?.detail?.href;
        const activeId = document.documentElement.dataset.servicesActiveChapterId;
        const href = eventHref ?? (activeId ? `#${activeId}` : "");
        if (href && navigationItems.some((item) => item.href === href)) {
          setActiveHref(href);
        }
      }

      window.addEventListener(SERVICES_ACTIVE_CHAPTER_EVENT, syncFromRuntime as EventListener);
      const frame = window.requestAnimationFrame(() => syncFromRuntime());
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener(SERVICES_ACTIVE_CHAPTER_EVENT, syncFromRuntime as EventListener);
      };
    }

    const sections = navigationItems
      .map((item) => document.querySelector(item.href))
      .filter((element): element is Element => element !== null);

    if (sections.length === 0) return;

    const initialHash = window.location.hash;
    if (navigationItems.some((item) => item.href === initialHash)) {
      setActiveHref(initialHash);
    }

    // Keep the last known ratio for every section. IntersectionObserver
    // callbacks contain only sections whose intersection changed, so choosing
    // from the current callback alone can incorrectly relabel a pinned scene
    // when a neighbouring section briefly crosses a threshold.
    const ratios = new Map<Element, number>();
    sections.forEach((section) => ratios.set(section, 0));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const focalY = window.innerHeight * 0.32;
        const ranked = sections
          .map((section) => {
            const bounds = section.getBoundingClientRect();
            return {
              section,
              ratio: ratios.get(section) ?? 0,
              distance: Math.abs(bounds.top + Math.min(bounds.height, window.innerHeight) / 2 - focalY),
            };
          })
          .sort((a, b) => {
            if (Math.abs(a.ratio - b.ratio) > 0.01) return b.ratio - a.ratio;
            return a.distance - b.distance;
          });

        const next = ranked[0];
        if (next?.ratio > 0 && next.section.id) {
          setActiveHref(`#${next.section.id}`);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.12, 0.3, 0.55] },
    );

    sections.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [isServicesRoute, navigationItems]);

  const activeIndex = Math.max(0, navigationItems.findIndex((item) => item.href === activeHref));
  const activeItem = navigationItems[activeIndex] ?? navigationItems[0];
  const finalHref = navigationItems[navigationItems.length - 1]?.href;
  const hiddenForFinalScene = hideOnLast && Boolean(finalHref) && activeHref === finalHref;
  const progress = navigationItems.length > 0 ? ((activeIndex + 1) / navigationItems.length) * 100 : 0;

  useEffect(() => {
    if (hiddenForFinalScene) setMobileOpen(false);
  }, [hiddenForFinalScene]);

  function choose(href: string) {
    setActiveHref(href);
    setMobileOpen(false);
  }

  // The final section can become a true arrival scene. Returning null also
  // removes every hidden link from keyboard order instead of leaving an
  // invisible fixed layer above the booking interface.
  if (hiddenForFinalScene) return null;

  const mobileBreakpoint = resolvedDesktopMode === "rail" ? "lg:hidden" : "sm:hidden";

  return (
    <>
      {/* Compact touch and small-screen guide. Cinematic routes keep this
          through tablet widths because the desktop rail begins at lg. */}
      <nav
        aria-label="Jump to section"
        data-section-jump-nav-mobile="true"
        className={`fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-[calc(0.75rem+env(safe-area-inset-right))] z-30 ${mobileBreakpoint}`}
      >
        {mobileOpen && (
          <div className="absolute bottom-[calc(100%+0.5rem)] right-0 grid w-[min(19rem,calc(100vw-1.5rem))] grid-cols-2 gap-1.5 rounded-2xl border border-ivory/12 bg-soil/95 p-2 shadow-elevation-lg backdrop-blur-md">
            {navigationItems.map((item, index) => {
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
          aria-label={`${mobileOpen ? "Close" : "Open"} section navigation. Current chapter ${activeIndex + 1} of ${navigationItems.length}: ${activeItem?.label ?? "Sections"}`}
          onClick={() => setMobileOpen((open) => !open)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-ivory/16 bg-soil/92 shadow-elevation-lg backdrop-blur-md transition-[opacity,transform] duration-300 hover:scale-[1.03] hover:bg-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <span className="flex flex-col items-center justify-center leading-none" aria-hidden="true">
            <span className="font-display text-base text-terracotta">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[0.48rem] font-medium uppercase tracking-[0.12em] text-ivory/48">
              / {String(navigationItems.length).padStart(2, "0")}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`absolute right-1.5 top-1 text-xs text-terracotta transition-transform duration-300 ${mobileOpen ? "rotate-45" : ""}`}
          >
            +
          </span>
        </button>
      </nav>

      {resolvedDesktopMode === "rail" ? (
        <nav
          aria-label="Jump to section"
          data-section-jump-nav-desktop-mode="rail"
          className="fixed right-[calc(0.75rem+env(safe-area-inset-right))] top-1/2 z-30 hidden -translate-y-1/2 lg:block"
        >
          <div className="relative flex w-12 flex-col items-center rounded-[1.65rem] border border-ivory/12 bg-soil/88 px-1.5 py-3 shadow-elevation-lg backdrop-blur-md">
            <span className="font-display text-[0.68rem] leading-none text-terracotta" aria-hidden="true">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[0.42rem] font-medium uppercase tracking-[0.12em] text-ivory/40" aria-hidden="true">
              / {String(navigationItems.length).padStart(2, "0")}
            </span>

            <div className="relative mt-3">
              <span
                aria-hidden="true"
                className="absolute bottom-2 left-1/2 top-2 w-px -translate-x-1/2 overflow-hidden bg-ivory/10"
              >
                <span
                  className="block w-full bg-sandstone transition-[height] duration-500 ease-out"
                  style={{ height: `${progress}%` }}
                />
              </span>
              <ol className="relative flex flex-col items-center gap-0.5">
                {navigationItems.map((item, index) => {
                  const active = activeHref === item.href;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-current={active ? "location" : undefined}
                        aria-label={`Chapter ${index + 1}: ${item.label}`}
                        onClick={() => choose(item.href)}
                        className="group relative flex h-7 w-7 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                      >
                        <span
                          className={`absolute right-[calc(100%+0.55rem)] whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.14em] shadow-elevation-lg backdrop-blur-md transition-[opacity,transform] duration-200 ${
                            active
                              ? "border-sandstone/35 bg-soil/96 text-sandstone opacity-100"
                              : "pointer-events-none translate-x-1 border-ivory/12 bg-soil/94 text-ivory/75 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                          }`}
                        >
                          {item.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`relative z-10 rounded-full transition-all duration-300 ${
                            active
                              ? "h-2.5 w-2.5 bg-sandstone shadow-[0_0_14px_rgba(212,185,154,0.42)]"
                              : "h-1.5 w-1.5 bg-ivory/35 group-hover:h-2 group-hover:w-2 group-hover:bg-ivory/75"
                          }`}
                        />
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </nav>
      ) : (
        <nav
          aria-label="Jump to section"
          data-section-jump-nav-desktop-mode="bar"
          className="fixed inset-x-0 bottom-0 z-30 hidden border-t border-ivory/10 bg-soil/95 backdrop-blur-xs sm:block"
        >
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navigationItems.map((item) => {
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
      )}
    </>
  );
}
