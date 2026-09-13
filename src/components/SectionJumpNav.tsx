"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, List, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { usePathname } from "next/navigation";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

// Long-page wayfinding uses different densities according to the route.
// Most pages retain the quiet technical index along the bottom edge. A
// cinematic route can opt into a narrow desktop rail instead, while mobile
// keeps one small chapter pill. The complete index only expands after the
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
  // Hero scenes can keep their full cinematic frame. The guide still tracks
  // the route from mount, then enters only after the visitor leaves chapter 1.
  hideOnFirst?: boolean;
  // Conversion chapters such as a booking room need the viewport back.
  // Opting in removes the fixed guide once the final indexed section is
  // active, while every existing call site keeps the persistent default.
  hideOnLast?: boolean;
  // The compact rail is intentionally opt in. Services uses it by default;
  // other routes retain the established bottom bar unless they request it.
  desktopMode?: "bar" | "rail";
  // Light cinematic pages can keep an ivory navigation surface while the
  // established dark treatment remains the default everywhere else.
  tone?: "dark" | "light";
  // Dense editorial frames can keep the rail as a quiet progress marker and
  // reveal chapter names only when a visitor asks through hover or focus.
  showActiveLabel?: boolean;
  // A long conversion journey can turn the compact mobile control into a
  // progress cue and keep the active destination visible when the list opens.
  guidedMobile?: boolean;
  // Cinematic routes can feed their existing frame-bounded page progress into
  // the desktop rail. Active chapter dots remain discrete, while the thread
  // between them follows the visitor continuously instead of jumping.
  continuousProgress?: boolean;
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
  hideOnFirst = false,
  hideOnLast = false,
  desktopMode,
  tone = "dark",
  showActiveLabel = true,
  guidedMobile = false,
  continuousProgress = false,
}: SectionJumpNavProps) {
  const pathname = usePathname();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const isServicesRoute = pathname === "/services";
  const resolvedDesktopMode = desktopMode ?? (isServicesRoute ? "rail" : "bar");
  const [servicesItems, setServicesItems] = useState<JumpItem[] | null>(null);
  const navigationItems = isServicesRoute && servicesItems?.length ? servicesItems : items;
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileYielding, setMobileYielding] = useState(false);
  const [mobileTargetHref, setMobileTargetHref] = useState<string | null>(null);
  const [mobileStatus, setMobileStatus] = useState("");
  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const desktopItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const lightTone = tone === "light";

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
  const nextItem = navigationItems[activeIndex + 1] ?? null;
  const mobileTargetIndex = mobileTargetHref
    ? navigationItems.findIndex((item) => item.href === mobileTargetHref)
    : -1;
  const mobileDisplayIndex = mobileTargetIndex >= 0 ? mobileTargetIndex : activeIndex;
  const mobileDisplayItem = navigationItems[mobileDisplayIndex] ?? activeItem;
  const firstHref = navigationItems[0]?.href;
  const finalHref = navigationItems[navigationItems.length - 1]?.href;
  const hiddenForFirstScene = hideOnFirst && Boolean(firstHref) && activeHref === firstHref;
  const hiddenForFinalScene = hideOnLast && Boolean(finalHref) && activeHref === finalHref;
  const progress = navigationItems.length > 0 ? ((activeIndex + 1) / navigationItems.length) * 100 : 0;
  const mobileDisplayProgress = navigationItems.length > 0
    ? ((mobileDisplayIndex + 1) / navigationItems.length) * 100
    : 0;

  useEffect(() => {
    if (!guidedMobile || !mobileTargetHref) return;

    const targetItem = navigationItems.find((item) => item.href === mobileTargetHref);
    const arrived = activeHref === mobileTargetHref;
    const delay = arrived ? (prefersReducedMotion ? 0 : 220) : 1800;
    const timer = window.setTimeout(() => {
      if (arrived && targetItem) setMobileStatus(`${targetItem.label} ready`);
      else setMobileStatus("");
      setMobileTargetHref(null);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeHref, guidedMobile, mobileTargetHref, navigationItems, prefersReducedMotion]);

  useEffect(() => {
    if (!guidedMobile || !mobileTargetHref) return;

    const release = () => {
      setMobileTargetHref(null);
      setMobileStatus("");
    };
    const releaseFromKeyboard = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        release();
      }
    };

    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    window.addEventListener("pointerdown", release, { passive: true });
    window.addEventListener("keydown", releaseFromKeyboard);
    return () => {
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("pointerdown", release);
      window.removeEventListener("keydown", releaseFromKeyboard);
    };
  }, [guidedMobile, mobileTargetHref]);

  useEffect(() => {
    if (hiddenForFirstScene || hiddenForFinalScene || mobileYielding) setMobileOpen(false);
  }, [hiddenForFirstScene, hiddenForFinalScene, mobileYielding]);

  useEffect(() => {
    if (!guidedMobile) return;
    const main = document.getElementById("main-content");
    if (!main) return;
    const mainRoot: HTMLElement = main;

    const observed = new Set<HTMLElement>();
    const intersecting = new Set<HTMLElement>();

    function syncYielding() {
      const yielding = intersecting.size > 0;

      if (yielding && mobileNavRef.current?.contains(document.activeElement)) {
        intersecting.values().next().value?.focus({ preventScroll: true });
      }

      setMobileYielding((current) => (current === yielding ? current : yielding));
    }

    // Short phones need the guide to leave earlier because one primary action
    // occupies a larger share of the visible frame. The wider action zone
    // protects conversion controls without changing the normal page rhythm.
    const shortCompactViewport = window.matchMedia(
      "(max-width: 1023px) and (max-height: 620px)",
    ).matches;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0) intersecting.add(target);
          else intersecting.delete(target);
        });
        syncYielding();
      },
      {
        rootMargin: `${shortCompactViewport ? "-45%" : "-62%"} 0px 0px 0px`,
        threshold: [0, 0.01, 0.4],
      },
    );

    function registerActions() {
      mainRoot.querySelectorAll<HTMLElement>('[data-section-jump-yield="true"]').forEach((action) => {
        if (observed.has(action)) return;
        observed.add(action);
        observer.observe(action);
      });

      observed.forEach((action) => {
        if (mainRoot.contains(action)) return;
        observer.unobserve(action);
        observed.delete(action);
        intersecting.delete(action);
      });
      syncYielding();
    }

    registerActions();
    const mutationObserver = new MutationObserver(registerActions);
    mutationObserver.observe(mainRoot, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      observed.clear();
      intersecting.clear();
    };
  }, [guidedMobile]);

  useEffect(() => {
    if (!guidedMobile || !mobileOpen) return;

    const frame = window.requestAnimationFrame(() => {
      const activeLink = mobileItemRefs.current[activeIndex];
      activeLink?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });

      if (mobileTriggerRef.current?.matches(":focus-visible")) {
        activeLink?.focus({ preventScroll: true });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, guidedMobile, mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    function dismissFromKeyboard(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      mobileTriggerRef.current?.focus();
    }

    function dismissFromOutside(event: PointerEvent) {
      if (mobileNavRef.current?.contains(event.target as Node)) return;
      setMobileOpen(false);
    }

    document.addEventListener("keydown", dismissFromKeyboard);
    document.addEventListener("pointerdown", dismissFromOutside);
    return () => {
      document.removeEventListener("keydown", dismissFromKeyboard);
      document.removeEventListener("pointerdown", dismissFromOutside);
    };
  }, [mobileOpen]);

  function choose(href: string) {
    setActiveHref(href);
    setMobileOpen(false);
  }

  function focusMobileDestination(target: HTMLElement) {
    const existingTabIndex = target.getAttribute("tabindex");
    if (existingTabIndex === null) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });

    if (existingTabIndex === null) {
      target.addEventListener(
        "blur",
        () => target.removeAttribute("tabindex"),
        { once: true },
      );
    }
  }

  function chooseMobile(event: ReactMouseEvent<HTMLAnchorElement>, item: JumpItem) {
    // Keyboard and assistive-technology activation keep the browser's native
    // destination focus while pointer taps get a short, interruptible native
    // transition and a visible destination confirmation.
    if (!guidedMobile) {
      choose(item.href);
      return;
    }

    const target = document.getElementById(item.href.slice(1));
    if (!target) {
      choose(item.href);
      return;
    }

    event.preventDefault();

    if (event.detail === 0) {
      choose(item.href);
      setMobileStatus(`${item.label} ready`);
      if (window.location.hash !== item.href) {
        window.history.pushState(null, "", item.href);
      }
      target.scrollIntoView({ behavior: "auto", block: "start" });
      focusMobileDestination(target);
      return;
    }

    setMobileTargetHref(item.href);
    setMobileStatus(`Moving to ${item.label}`);
    setMobileOpen(false);

    if (window.location.hash !== item.href) {
      window.history.pushState(null, "", item.href);
    }
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function focusMobileChapter(
    event: ReactKeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = Math.min(index + 1, navigationItems.length - 1);
    }
    if (event.key === "ArrowLeft") nextIndex = Math.max(index - 1, 0);
    if (event.key === "ArrowDown") {
      nextIndex = Math.min(index + 2, navigationItems.length - 1);
    }
    if (event.key === "ArrowUp") nextIndex = Math.max(index - 2, 0);
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = navigationItems.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    if (nextIndex === index) return;
    mobileItemRefs.current[nextIndex]?.focus({ preventScroll: true });
    mobileItemRefs.current[nextIndex]?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "nearest",
    });
  }

  function focusDesktopChapter(
    event: ReactKeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) {
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown") {
      nextIndex = Math.min(index + 1, navigationItems.length - 1);
    }
    if (event.key === "ArrowUp") nextIndex = Math.max(index - 1, 0);
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = navigationItems.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    if (nextIndex === index) return;
    desktopItemRefs.current[nextIndex]?.focus({ preventScroll: true });
  }

  // The opening and final sections keep their full cinematic frame. Returning
  // null also removes every hidden link from keyboard order instead of leaving
  // an invisible fixed layer above either composition.
  if (hiddenForFirstScene || hiddenForFinalScene) return null;

  const mobileBreakpoint = resolvedDesktopMode === "rail" ? "lg:hidden" : "sm:hidden";

  return (
    <>
      {/* Compact touch and small-screen guide. Cinematic routes keep this
          through tablet widths because the desktop rail begins at lg. */}
      <nav
        ref={mobileNavRef}
        aria-label="Jump to section"
        data-section-jump-nav-mobile="true"
        data-section-jump-tone={tone}
        data-section-jump-guided={guidedMobile ? "true" : undefined}
        data-section-jump-progress-mode={continuousProgress ? "continuous" : "chapters"}
        data-section-jump-yielding={mobileYielding ? "true" : "false"}
        data-section-jump-moving={mobileTargetHref ? "true" : "false"}
        aria-hidden={mobileYielding || undefined}
        inert={mobileYielding || undefined}
        style={{
          right: "calc(0.75rem + env(safe-area-inset-right))",
          bottom: "calc(0.75rem + env(safe-area-inset-bottom))",
          opacity: mobileYielding ? 0 : undefined,
        }}
        className={`fixed z-30 transition-[opacity,transform] ${
          prefersReducedMotion ? "duration-0" : "duration-300"
        } ${
          mobileYielding
            ? "pointer-events-none translate-y-[calc(100%+1.5rem)] opacity-0"
            : "translate-y-0 opacity-100"
        } ${mobileBreakpoint}`}
      >
        <button
          ref={mobileTriggerRef}
          type="button"
          data-section-jump-nav-trigger="true"
          aria-expanded={mobileOpen}
          aria-controls={mobileOpen ? "section-jump-mobile-menu" : undefined}
          aria-label={
            mobileTargetHref
              ? `Moving to chapter ${mobileDisplayIndex + 1} of ${navigationItems.length}: ${mobileDisplayItem?.label ?? "Sections"}`
              : `${mobileOpen ? "Close" : "Open"} section navigation. Current chapter ${activeIndex + 1} of ${navigationItems.length}: ${activeItem?.label ?? "Sections"}`
          }
          tabIndex={mobileYielding ? -1 : undefined}
          onClick={() => setMobileOpen((open) => !open)}
          style={{ maxWidth: "min(18rem, calc(100vw - 1.5rem))" }}
          className={`relative flex h-14 items-center justify-center gap-2.5 rounded-full border px-3.5 shadow-elevation-lg backdrop-blur-md transition-[opacity,transform,background-color] duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
            lightTone
              ? "border-soil/14 bg-ivory/92 hover:bg-ivory"
              : "border-ivory/16 bg-soil/92 hover:bg-soil"
          } ${guidedMobile ? "touch-manipulation active:scale-[0.97]" : ""}`}
        >
          {guidedMobile && (
            <motion.span
              key={mobileTargetHref ?? "travel-idle"}
              aria-hidden="true"
              data-section-jump-travel-cue="one-shot"
              className="pointer-events-none absolute inset-[-1px] rounded-full border border-terracotta/55"
              initial={false}
              animate={
                prefersReducedMotion
                  ? { opacity: mobileTargetHref ? 0.42 : 0, scale: 1 }
                  : mobileTargetHref
                    ? { opacity: [0, 0.58, 0], scale: [0.985, 1.025, 1] }
                    : { opacity: 0, scale: 1 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : mobileTargetHref
                    ? { duration: 0.68, times: [0, 0.38, 1], ease: [0.22, 1, 0.36, 1] }
                    : { duration: 0.16, ease: "easeOut" }
              }
            />
          )}
          {guidedMobile && (
            <span
              aria-hidden="true"
              data-section-jump-progress="true"
              className={`absolute bottom-1 left-4 right-4 h-px overflow-hidden rounded-full ${lightTone ? "bg-soil/12" : "bg-ivory/14"}`}
            >
              <span
                className="block h-full origin-left bg-terracotta"
                style={{
                  transform: continuousProgress
                    ? `scaleX(var(--home-page-progress, ${mobileDisplayProgress / 100}))`
                    : `scaleX(${mobileDisplayProgress / 100})`,
                  transition:
                    prefersReducedMotion || continuousProgress
                      ? "none"
                      : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: continuousProgress ? "transform" : undefined,
                }}
              />
            </span>
          )}
          <motion.span
            key={mobileDisplayItem?.href ?? "sections"}
            data-section-jump-mobile-label="true"
            className="flex min-w-0 items-center gap-2 leading-none"
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-display text-base text-terracotta">
              {String(mobileDisplayIndex + 1).padStart(2, "0")}
            </span>
            <span
              className={`max-w-[10rem] truncate text-[0.625rem] font-semibold uppercase tracking-[0.1em] ${
                lightTone ? "text-soil/72" : "text-ivory/72"
              }`}
            >
              {mobileDisplayItem?.label ?? "Sections"}
            </span>
            <span className={`text-[0.55rem] font-medium tracking-[0.06em] ${lightTone ? "text-soil/48" : "text-ivory/52"}`}>
              / {String(navigationItems.length).padStart(2, "0")}
            </span>
          </motion.span>
          <span
            aria-hidden="true"
            data-section-jump-mobile-icon="true"
            className="ml-0.5 flex h-4 w-4 items-center justify-center text-terracotta"
          >
            {mobileTargetHref ? (
              <ArrowDownRight size={15} strokeWidth={1.8} />
            ) : mobileOpen ? (
              <X size={15} strokeWidth={1.8} />
            ) : (
              <List size={15} strokeWidth={1.8} />
            )}
          </span>
        </button>

        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {mobileStatus}
        </span>

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              id="section-jump-mobile-menu"
              key="section-jump-mobile-menu"
              data-section-jump-mobile-menu="true"
              initial={
                prefersReducedMotion || !guidedMobile
                  ? false
                  : { opacity: 0, y: 10, scale: 0.975 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion || !guidedMobile
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8, scale: 0.985, pointerEvents: "none" }
              }
              transition={
                prefersReducedMotion || !guidedMobile
                  ? { duration: 0 }
                  : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
              }
              style={{
                bottom: "calc(100% + 0.5rem)",
                maxHeight: "calc(100dvh - 6.5rem - env(safe-area-inset-top, 0px))",
                width: "min(19rem, calc(100vw - 1.5rem))",
              }}
              className={`absolute right-0 grid origin-bottom-right grid-cols-2 gap-1.5 overflow-y-auto overscroll-contain rounded-2xl border p-2 shadow-elevation-lg backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                lightTone ? "border-soil/12 bg-ivory/95" : "border-ivory/12 bg-soil/95"
              }`}
            >
              {guidedMobile && (
                <div
                  data-section-jump-menu-summary="true"
                  className="col-span-2 flex min-h-14 items-end justify-between gap-3 rounded-xl px-3 pb-2 pt-1.5"
                >
                  <div className="min-w-0">
                    <p
                      className={`text-[0.55rem] font-semibold uppercase tracking-[0.13em] ${
                        lightTone ? "text-soil/46" : "text-ivory/45"
                      }`}
                    >
                      Current chapter
                    </p>
                    <p
                      className={`mt-1 truncate font-display text-lg leading-none ${
                        lightTone ? "text-soil" : "text-ivory"
                      }`}
                    >
                      {activeItem?.label}
                    </p>
                  </div>
                  {nextItem && (
                    <a
                      href={nextItem.href}
                      onClick={(event) => chooseMobile(event, nextItem)}
                      aria-label={`Continue to chapter ${activeIndex + 2}: ${nextItem.label}`}
                      className={`group flex min-h-11 max-w-[9.5rem] touch-manipulation items-center justify-end gap-1.5 rounded-lg px-1.5 text-right text-[0.56rem] font-medium uppercase leading-relaxed tracking-[0.1em] transition-[color,transform] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                        lightTone ? "text-soil/52" : "text-ivory/50"
                      }`}
                    >
                      <span>
                        Next chapter<br />
                        <span className="text-terracotta">{nextItem.label}</span>
                      </span>
                      <ArrowDownRight
                        size={14}
                        strokeWidth={1.8}
                        aria-hidden="true"
                        className="shrink-0 text-terracotta transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 motion-reduce:transition-none"
                      />
                    </a>
                  )}
                </div>
              )}
              {navigationItems.map((item, index) => {
                const active = activeHref === item.href;
                return (
                  <a
                    key={item.href}
                    ref={(node) => {
                      mobileItemRefs.current[index] = node;
                    }}
                    href={item.href}
                    aria-current={active ? "location" : undefined}
                    onClick={(event) => chooseMobile(event, item)}
                    onKeyDown={(event) => focusMobileChapter(event, index)}
                    className={`flex min-h-11 touch-manipulation items-center justify-between rounded-xl px-3 py-2 text-[0.6875rem] font-medium uppercase leading-tight tracking-[0.1em] transition-[color,background-color,transform] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-terracotta ${
                      active
                        ? lightTone
                          ? "bg-soil/[0.08] text-terracotta"
                          : "bg-ivory/10 text-terracotta"
                        : lightTone
                          ? "text-soil/70 hover:bg-soil/[0.06] hover:text-soil"
                          : "text-ivory/68 hover:bg-ivory/[0.06] hover:text-ivory"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`font-display text-xs ${lightTone ? "text-soil/45" : "text-ivory/42"}`}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {resolvedDesktopMode === "rail" ? (
        <nav
          aria-label="Jump to section"
          data-section-jump-nav-desktop-mode="rail"
          data-section-jump-progress-mode={continuousProgress ? "continuous" : "chapters"}
          data-section-jump-tone={tone}
          data-section-jump-desktop-yielding={guidedMobile && mobileYielding ? "true" : "false"}
          style={{ right: "calc(0.75rem + env(safe-area-inset-right))" }}
          className="fixed top-1/2 z-30 hidden -translate-y-1/2 lg:block"
        >
          <div
            style={{ borderRadius: "1.65rem" }}
            className={`relative flex w-12 flex-col items-center border px-1.5 py-3 shadow-elevation-lg backdrop-blur-md ${
              lightTone ? "border-soil/12 bg-ivory/90" : "border-ivory/12 bg-soil/88"
            }`}
          >
            <span className="font-display text-[0.68rem] leading-none text-terracotta" aria-hidden="true">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span
              className={`mt-1 text-[0.42rem] font-medium uppercase tracking-[0.12em] ${lightTone ? "text-soil/45" : "text-ivory/40"}`}
              aria-hidden="true"
            >
              / {String(navigationItems.length).padStart(2, "0")}
            </span>

            <div className="relative mt-3">
              <span
                aria-hidden="true"
                className={`absolute bottom-2 left-1/2 top-2 w-px -translate-x-1/2 overflow-hidden ${lightTone ? "bg-soil/12" : "bg-ivory/10"}`}
              >
                <span
                  className={`block w-full ${
                    continuousProgress
                      ? ""
                      : "transition-[height] duration-500 ease-out"
                  } ${lightTone ? "bg-terracotta" : "bg-sandstone"}`}
                  style={{
                    height: continuousProgress
                      ? `calc(var(--home-page-progress, ${progress / 100}) * 100%)`
                      : `${progress}%`,
                    willChange: continuousProgress ? "height" : undefined,
                  }}
                />
              </span>
              <ol className="relative flex flex-col items-center gap-0.5">
                {navigationItems.map((item, index) => {
                  const active = activeHref === item.href;
                  return (
                    <li key={item.href}>
                      <a
                        ref={(node) => {
                          desktopItemRefs.current[index] = node;
                        }}
                        href={item.href}
                        aria-current={active ? "location" : undefined}
                        aria-label={`Chapter ${index + 1}: ${item.label}`}
                        onClick={() => choose(item.href)}
                        onKeyDown={(event) => focusDesktopChapter(event, index)}
                        className={`group relative flex h-7 w-7 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${lightTone ? "focus-visible:outline-terracotta" : "focus-visible:outline-sandstone"}`}
                      >
                        <span
                          style={{ right: "calc(100% + 0.55rem)" }}
                          className={`absolute whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.14em] shadow-elevation-lg backdrop-blur-md transition-[opacity,transform] duration-200 ${
                            active && showActiveLabel && !(guidedMobile && mobileYielding)
                              ? lightTone
                                ? "border-terracotta/30 bg-ivory/96 text-terracotta opacity-100"
                                : "border-sandstone/35 bg-soil/96 text-sandstone opacity-100"
                              : lightTone
                                ? "pointer-events-none translate-x-1 border-soil/12 bg-ivory/96 text-soil/75 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                                : "pointer-events-none translate-x-1 border-ivory/12 bg-soil/94 text-ivory/75 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                          }`}
                        >
                          {item.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`relative z-10 rounded-full transition-all duration-300 ${
                            active
                              ? lightTone
                                ? "h-2.5 w-2.5 bg-terracotta shadow-[0_0_14px_rgba(199,119,82,0.34)]"
                                : "h-2.5 w-2.5 bg-sandstone shadow-[0_0_14px_rgba(212,185,154,0.42)]"
                              : lightTone
                                ? "h-1.5 w-1.5 bg-soil/35 group-hover:h-2 group-hover:w-2 group-hover:bg-soil/70"
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
          data-section-jump-tone={tone}
          className={`fixed inset-x-0 bottom-0 z-30 hidden border-t backdrop-blur-xs sm:block ${
            lightTone ? "border-soil/10 bg-ivory/95" : "border-ivory/10 bg-soil/95"
          }`}
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
                    active
                      ? "text-terracotta"
                      : lightTone
                        ? "text-soil/60 hover:text-soil"
                        : "text-ivory/55 hover:text-ivory"
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
