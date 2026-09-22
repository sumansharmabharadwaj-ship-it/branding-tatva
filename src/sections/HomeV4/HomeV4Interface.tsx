"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { ArrowDown, ArrowUp, ChevronDown, Pause, Play, RotateCcw } from "lucide-react";
import guideStyles from "./HomeJourney.module.css";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { focusHomeReading, isAvailableHomeTabStop } from "./homeReadingFocus";
import {
  publishHomeGuideMode,
  type HomeGuideMode,
} from "@/hooks/useHomeGuideMode";

const CHAPTER_SELECTOR = "[data-home-v4-chapter]";
/* Chapter metadata and dwell times are positional: entry N describes the Nth element matching
   CHAPTER_SELECTOR. Inserting a chapter without inserting here shifts
   every later label onto the wrong scene, so they are kept in step.
   The compounding-cost entry sits fourth because that stack pins three
   cards in turn and needs a longer dwell than a single-frame scene. */
const DWELL_MS = [4700, 4400, 4700, 5600, 5300, 4700, 4900, 5300, 4900, 4600, 4600, 6000, 5200];
const CHAPTER_IDS = ["opening", "recognition", "cost", "cost-stack", "foundation", "paths", "process", "evidence", "tatva", "studio", "decision", "brand-diagnostic", "invitation"] as const;
const CHAPTER_LABELS = ["The first impression", "Your brand today", "Mixed messages", "The cost of starting over", "Build the foundation", "Ways to work together", "How a project moves", "The evidence", "The five Tatvas", "Meet Suman", "Your questions", "Find your starting point", "Start a conversation"] as const;
const TAB_STOP_SELECTOR = "a[href], button, input, select, textarea, [tabindex]";

type GuideMode = HomeGuideMode;
type HandoffMotif = "mist" | "river" | "root" | "aperture" | "paper" | "constellation" | "light";

export function GuidedView() {
  const lenis = useLenis();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [mode, setMode] = useState<GuideMode>("manual");
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const menuLinksRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const menuFocusRef = useRef<number | null>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<HTMLElement[]>([]);
  const guidedScrollRef = useRef(false);
  const modeRef = useRef<GuideMode>("manual");
  const advanceTimerRef = useRef(0);

  const resolveChapters = useCallback(() => {
    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>(CHAPTER_SELECTOR),
    );
    chaptersRef.current = chapters;
    return chapters;
  }, []);

  const stopGuidedMotion = useCallback(() => {
    window.clearTimeout(advanceTimerRef.current);

    if (guidedScrollRef.current) {
      if (lenis) lenis.scrollTo(window.scrollY, { immediate: true });
      else window.scrollTo({ top: window.scrollY, left: window.scrollX, behavior: "instant" });
      guidedScrollRef.current = false;
    }
  }, [lenis]);

  const changeMode = useCallback((next: GuideMode) => {
    modeRef.current = next;
    if (next !== "guided") stopGuidedMotion();
    setMode(next);
  }, [stopGuidedMotion]);

  const scrollToChapter = useCallback(
    (index: number) => {
      const chapters = resolveChapters();
      const target = chapters[index];
      if (!target) return;

      guidedScrollRef.current = true;
      window.clearTimeout(advanceTimerRef.current);

      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(target, {
          duration: 0.82,
          easing: (value: number) => 1 - Math.pow(1 - value, 4),
          onComplete: () => { guidedScrollRef.current = false; },
        });
      } else {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "instant" : "smooth",
          block: "start",
        });
      }
    },
    [lenis, prefersReducedMotion, resolveChapters],
  );

  useEffect(() => {
    const chapters = resolveChapters();
    if (!chapters.length) return;

    let frame = 0;
    function update() {
      frame = 0;
      const readingLine = window.innerHeight * .42;
      let next = 0;
      chapters.forEach((chapter, index) => {
        if (chapter.getBoundingClientRect().top <= readingLine) next = index;
      });
      const current = chapters[next].getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (readingLine - current.top) / Math.max(1, current.height)));
      guideRef.current?.style.setProperty("--journey-progress", progress.toFixed(4));
      setActiveIndex((current) => current === next ? current : next);
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    update();
    const resize = new ResizeObserver(schedule);
    chapters.forEach((chapter) => resize.observe(chapter));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [resolveChapters]);

  useEffect(() => {
    publishHomeGuideMode(mode);
  }, [mode]);

  useEffect(
    () => () => {
      document.documentElement.removeAttribute("data-home-guide-mode");
    },
    [],
  );

  useEffect(() => {
    if (prefersReducedMotion) changeMode("manual");
  }, [changeMode, prefersReducedMotion]);

  useEffect(() => {
    const compact = window.matchMedia("(max-width: 820px)");
    function updateProfile() {
      if (!compact.matches) return;
      if (modeRef.current === "guided") changeMode("paused");
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && focused.hasAttribute("data-journey-transport") && guideRef.current?.contains(focused)) {
        menuButtonRef.current?.focus({ preventScroll: true });
      }
    }
    updateProfile();
    compact.addEventListener("change", updateProfile);
    return () => compact.removeEventListener("change", updateProfile);
  }, [changeMode]);

  useEffect(() => {
    if (prefersReducedMotion || mode !== "guided") {
      return;
    }

    const chapters = resolveChapters();
    const nextIndex = activeIndex + 1;
    if (nextIndex >= chapters.length) {
      changeMode("paused");
      return;
    }

    const duration = DWELL_MS[Math.min(activeIndex, DWELL_MS.length - 1)] ?? 4700;
    advanceTimerRef.current = window.setTimeout(() => {
      if (document.hidden || modeRef.current !== "guided") return;
      scrollToChapter(nextIndex);
    }, duration);

    return () => {
      window.clearTimeout(advanceTimerRef.current);
    };
  }, [activeIndex, changeMode, mode, prefersReducedMotion, resolveChapters, scrollToChapter]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    function takeControl(event: Event) {
      const target = event.target;
      const navigationKey = event instanceof KeyboardEvent &&
        ["Escape", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key);
      if (event.type !== "wheel" && !navigationKey &&
        target instanceof Element && target.closest("[data-guided-controls]")) return;

      changeMode("manual");
    }

    function onVisibilityChange() {
      if (document.hidden && modeRef.current === "guided") changeMode("paused");
    }

    function onScrollEnd() {
      guidedScrollRef.current = false;
    }

    const options: AddEventListenerOptions = { passive: true };
    window.addEventListener("wheel", takeControl, options);
    window.addEventListener("touchstart", takeControl, options);
    window.addEventListener("pointerdown", takeControl, options);
    window.addEventListener("keydown", takeControl);
    window.addEventListener("focusin", takeControl);
    window.addEventListener("scrollend", onScrollEnd);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("wheel", takeControl);
      window.removeEventListener("touchstart", takeControl);
      window.removeEventListener("pointerdown", takeControl);
      window.removeEventListener("keydown", takeControl);
      window.removeEventListener("focusin", takeControl);
      window.removeEventListener("scrollend", onScrollEnd);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopGuidedMotion();
      };
  }, [changeMode, prefersReducedMotion, stopGuidedMotion]);

  useEffect(() => {
    if (!menuOpen) return;
    const guide = guideRef.current;
    const menu = menuRef.current;
    if (!guide || !menu) return;
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    let frame = 0;
    function fitMenu() {
      frame = 0;
      if (!guide || !menu) return;
      // Reserve the header's full resting height even while it slides away.
      // The gap is shared with CSS so the entrance transform cannot alter it.
      const headerBottom = header ? header.offsetTop + header.offsetHeight : 0;
      const safeTop = Math.max(headerBottom, window.visualViewport?.offsetTop ?? 0) + 8;
      const gap = parseFloat(getComputedStyle(guide).getPropertyValue("--journey-menu-gap")) || 10;
      const available = guide.getBoundingClientRect().top - Math.max(0, gap) - safeTop;
      menu.style.setProperty("--journey-menu-space", `${Math.max(0, Math.floor(available))}px`);
      const focused = document.activeElement;
      const current = menuLinksRef.current.find((link) => link?.getAttribute("aria-current") === "location");
      if (focused instanceof HTMLElement && menu.contains(focused)) revealMenuLink(focused);
      else if (current) revealMenuLink(current);
    }
    function scheduleFit() {
      if (!frame) frame = window.requestAnimationFrame(fitMenu);
    }
    fitMenu();
    const resize = new ResizeObserver(scheduleFit);
    resize.observe(guide);
    if (header) resize.observe(header);
    const notice = new MutationObserver(scheduleFit);
    notice.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-consent-banner", "data-consent-banner-compact"],
    });
    window.addEventListener("resize", scheduleFit);
    window.visualViewport?.addEventListener("resize", scheduleFit);
    window.visualViewport?.addEventListener("scroll", scheduleFit);
    const requested = menuFocusRef.current;
    const currentLink = requested === null
      ? menuLinksRef.current.find((link) => link?.getAttribute("aria-current") === "location")
      : menuLinksRef.current[requested];
    menuFocusRef.current = null;
    if (currentLink) {
      if (requested !== null) currentLink.focus({ preventScroll: true });
      revealMenuLink(currentLink);
    }
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !guideRef.current?.contains(event.target)) setMenuOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMenuOpen(false);
      menuButtonRef.current?.focus({ preventScroll: true });
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      notice.disconnect();
      window.removeEventListener("resize", scheduleFit);
      window.visualViewport?.removeEventListener("resize", scheduleFit);
      window.visualViewport?.removeEventListener("scroll", scheduleFit);
      menu.style.removeProperty("--journey-menu-space");
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [menuOpen]);

  function revealMenuLink(target: HTMLElement) {
    const menu = menuRef.current;
    if (!menu) return;
    const bounds = menu.getBoundingClientRect();
    const item = target.getBoundingClientRect();
    // Scroll only the floating list. The visitor's page position stays put.
    if (item.top < bounds.top + 8) menu.scrollTop -= bounds.top + 8 - item.top;
    else if (item.bottom > bounds.bottom - 8) menu.scrollTop += item.bottom - bounds.bottom + 8;
  }

  function openMenu(keyboard: boolean) {
    changeMode("manual");
    menuFocusRef.current = keyboard ? activeIndex : null;
    setMenuOpen(true);
  }

  function navigateMenu(event: ReactKeyboardEvent<HTMLAnchorElement>, index: number) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % CHAPTER_IDS.length;
    else if (event.key === "ArrowUp") next = (index + CHAPTER_IDS.length - 1) % CHAPTER_IDS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = CHAPTER_IDS.length - 1;
    else return;
    event.preventDefault();
    const target = menuLinksRef.current[next];
    if (target) { target.focus({ preventScroll: true }); revealMenuLink(target); }
  }

  function focusChapter(id: string) {
    const chapter = document.getElementById(id);
    const target = chapter?.querySelector<HTMLElement>("h1, h2") ?? chapter;
    if (!target) return;
    const temporaryStop = !target.hasAttribute("tabindex");
    if (temporaryStop) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (temporaryStop) {
      if (document.activeElement === target) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
      else target.removeAttribute("tabindex");
    }
  }

  function continueReading(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;

    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(TAB_STOP_SELECTOR))
      .filter(isAvailableHomeTabStop);
    if (event.target !== controls[controls.length - 1]) return;

    changeMode("manual");
    if (focusHomeReading()) { event.preventDefault(); setMenuOpen(false); }
  }

  const count = Math.max(1, chaptersRef.current.length || CHAPTER_LABELS.length);
  const atFinalChapter = activeIndex >= count - 1;
  function jump(index: number) {
    changeMode("manual");
    setMenuOpen(false);
    scrollToChapter(index);
  }

  return (
    <div
      ref={guideRef}
      data-guided-controls
      data-guide-mode={mode}
      className={guideStyles.guide}
      aria-label="Homepage journey controls"
      onKeyDown={continueReading}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
        if (event.relatedTarget === null && event.target.hasAttribute("data-journey-transport") && window.matchMedia("(max-width: 820px)").matches) {
          menuButtonRef.current?.focus({ preventScroll: true });
        }
      }}
    >
      <div className={guideStyles.bar}>
        <button
          ref={menuButtonRef}
          type="button"
          className={guideStyles.chapterButton}
          aria-expanded={menuOpen}
          aria-controls="homepage-chapters"
          aria-label={`Explore homepage sections. Current section: ${CHAPTER_LABELS[activeIndex]}`}
          onClick={(event) => {
            if (menuOpen) setMenuOpen(false);
            else openMenu(event.detail === 0);
          }}
          onKeyDown={(event) => {
            if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
              event.preventDefault();
              if (!menuOpen) openMenu(true);
              else {
                const target = menuLinksRef.current[activeIndex];
                if (target) { target.focus({ preventScroll: true }); revealMenuLink(target); }
              }
            }
          }}
        >
          <span className={guideStyles.count}>{String(activeIndex + 1).padStart(2, "0")}<span> / {count}</span></span>
          <span className={guideStyles.chapterName}>{CHAPTER_LABELS[activeIndex]}</span>
          <ChevronDown size={15} aria-hidden="true" className={menuOpen ? guideStyles.chevronOpen : undefined} />
        </button>
        <span className={guideStyles.divider} aria-hidden="true" />
        <button type="button" data-journey-transport className={guideStyles.iconButton} aria-disabled={activeIndex === 0} onClick={() => { if (activeIndex > 0) jump(activeIndex - 1); }} aria-label="Previous section" title="Previous section"><ArrowUp size={16} aria-hidden="true" /></button>
        <button
          type="button"
          data-journey-transport
          className={`${guideStyles.iconButton} ${guideStyles.playButton}`}
          onClick={() => {
            if (prefersReducedMotion) return;
            setMenuOpen(false);
            if (mode === "guided") changeMode("paused");
            else if (atFinalChapter) jump(0);
            else changeMode("guided");
          }}
          aria-label={prefersReducedMotion ? "Guided journey paused for reduced motion" : mode === "guided" ? "Pause guided journey" : atFinalChapter ? "Return to beginning" : "Play guided journey"}
          aria-disabled={prefersReducedMotion}
          aria-pressed={mode === "guided"}
          title={prefersReducedMotion ? "Guided journey paused for reduced motion" : mode === "guided" ? "Pause guided journey" : atFinalChapter ? "Return to beginning" : "Play guided journey"}
        >
          {mode === "guided" ? <Pause size={14} aria-hidden="true" /> : atFinalChapter ? <RotateCcw size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        </button>
        <button type="button" data-journey-transport className={guideStyles.iconButton} aria-disabled={atFinalChapter} onClick={() => { if (!atFinalChapter) jump(activeIndex + 1); }} aria-label="Next section" title="Next section"><ArrowDown size={16} aria-hidden="true" /></button>
      </div>
      <nav ref={menuRef} id="homepage-chapters" className={guideStyles.menu} hidden={!menuOpen} aria-label="Homepage sections">
        <p>Explore the thinking</p>
        {CHAPTER_LABELS.map((chapter, index) => (
          <a
            key={CHAPTER_IDS[index]}
            ref={(node) => { menuLinksRef.current[index] = node; }}
            href={`#${CHAPTER_IDS[index]}`}
            aria-current={index === activeIndex ? "location" : undefined}
            onClick={(event) => {
              if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              changeMode("manual");
              focusChapter(CHAPTER_IDS[index]);
              setMenuOpen(false);
            }}
            onKeyDown={(event) => navigateMenu(event, index)}
            onFocus={(event) => revealMenuLink(event.currentTarget)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>{chapter}
            {index === activeIndex && <i aria-hidden="true" />}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* Nested scene surfaces paint over their chapter wrapper. Follow only those
 * semantic surfaces, never a card, media overlay or decorative gradient. Keep
 * the last opaque tone as the fallback for a transparent inner surface. */
function chapterTone(start: Element | null, edge: "top" | "bottom"): string | null {
  let node: Element | null = start;
  let tone: string | null = null;

  for (let depth = 0; node && depth < 4; depth += 1) {
    const color = getComputedStyle(node).backgroundColor;
    if (color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)") tone = color;
    const surfaces: Element[] = Array.from(node.querySelectorAll(":scope > section, :scope > [data-home-surface]")).filter(
      (child) => getComputedStyle(child).display !== "none",
    );
    node = (edge === "bottom" ? surfaces[surfaces.length - 1] : surfaces[0]) ?? null;
  }
  return tone;
}

export function SceneHandoff({ motif }: { motif: HandoffMotif }) {
  const handoffRef = useRef<HTMLDivElement>(null);

  // Resolve the visible chapter surfaces after hydration and on reflow.
  // HomeV4ScrollCamera owns all motion; these twelve seams need no separate
  // Framer scroll subscriptions, including while page motion is paused.
  useEffect(() => {
    const el = handoffRef.current;
    if (!el) return;

    const sync = () => {
      const above = chapterTone(el.previousElementSibling, "bottom");
      const below = chapterTone(el.nextElementSibling, "top");
      if (above) el.style.setProperty("--handoff-from", above);
      if (below) el.style.setProperty("--handoff-to", below);
    };

    sync();

    // Chapter tones can change after their own media/theme work settles,
    // and the touching edge can change with a layout reflow.
    const raf = requestAnimationFrame(sync);
    window.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sync);
    };
  }, [motif]);

  return (
    <div ref={handoffRef} className={`home-v4-handoff home-v4-handoff--${motif}`} aria-hidden="true">
      <span className="home-v4-handoff__veil" />
      {motif === "river" || motif === "root" ? (
        <svg viewBox="0 0 1200 96" preserveAspectRatio="none">
          <path
            d={
              motif === "river"
                ? "M-20 50 C160 8 290 86 462 48 C638 10 770 88 955 42 C1048 20 1120 27 1220 55"
                : "M-20 74 C130 25 250 90 390 56 C530 22 645 78 756 45 C860 14 1010 70 1220 28"
            }
            fill="none"
            stroke="var(--handoff-line)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.4"
            pathLength={1}
          />
        </svg>
      ) : null}
      {motif === "constellation" && (
        <span className="home-v4-handoff__stars">
          {[12, 28, 44, 61, 78, 91].map((left, index) => (
            <i
              key={left}
              style={{ left: `${left}%`, top: `${28 + (index % 3) * 20}%` }}
            />
          ))}
        </span>
      )}
    </div>
  );
}
