"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";

const DEFAULT_DWELL_MS = 18000;
const MANUAL_HOLD_MS = 18000;
const CHAPTER_DWELL_MS: Record<string, number> = {
  opening: 14000,
  diagnosis: 22000,
  evidence: 22000,
  studio: 23000,
  paths: 22000,
  framework: 19000,
  elements: 30000,
  process: 30000,
  questions: 24000,
  invitation: 18000,
};

type ChapterChangeSource = "scroll" | "journey" | "replay";

export function HomeAutoJourney() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const targetsRef = useRef<HTMLElement[]>([]);
  const activeIndexRef = useRef(0);
  const lastBroadcastIndexRef = useRef(-1);
  const autoScrollRef = useRef(false);
  const holdUntilRef = useRef(0);
  const holdTimerRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [holding, setHolding] = useState(false);
  const [complete, setComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const resolveTargets = useCallback(() => {
    targetsRef.current = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-chapter]"),
    );
  }, []);

  const broadcastChapter = useCallback(
    (index: number, source: ChapterChangeSource) => {
      const target = targetsRef.current[index];
      const id = target?.dataset.homeChapter;
      if (!target || !id) return;

      lastBroadcastIndexRef.current = index;
      window.dispatchEvent(
        new CustomEvent("bt:home-chapter", {
          detail: { id, index, source, targetId: target.id },
        }),
      );
    },
    [],
  );

  const currentIndex = useCallback(() => {
    const targets = targetsRef.current;
    if (!targets.length) return 0;

    const anchor = window.scrollY + window.innerHeight * 0.42;
    let index = 0;
    targets.forEach((target, targetIndex) => {
      const top = window.scrollY + target.getBoundingClientRect().top;
      if (top <= anchor) index = targetIndex;
    });

    activeIndexRef.current = index;
    setActiveIndex((current) => (current === index ? current : index));

    if (lastBroadcastIndexRef.current !== index) {
      broadcastChapter(index, autoScrollRef.current ? "journey" : "scroll");
    }

    return index;
  }, [broadcastChapter]);

  const dwellForIndex = useCallback((index: number) => {
    const chapter = targetsRef.current[index]?.dataset.homeChapter;
    return chapter
      ? CHAPTER_DWELL_MS[chapter] ?? DEFAULT_DWELL_MS
      : DEFAULT_DWELL_MS;
  }, []);

  const scrollToIndex = useCallback(
    (index: number, source: ChapterChangeSource = "journey") => {
      const target = targetsRef.current[index];
      if (!target) return;

      broadcastChapter(index, source);

      const offset = 0;

      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(target, { offset, duration: 1.35 });
      } else {
        const top =
          window.scrollY + target.getBoundingClientRect().top + offset;
        window.scrollTo({
          top,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    },
    [broadcastChapter, lenis, prefersReducedMotion],
  );

  const pauseForReading = useCallback(() => {
    if (autoScrollRef.current) return;

    holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
    setHolding(true);
    window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = window.setTimeout(() => {
      if (Date.now() >= holdUntilRef.current) setHolding(false);
    }, MANUAL_HOLD_MS + 120);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const main = document.getElementById("main-content");
    if (!main) return;

    resolveTargets();
    currentIndex();

    const observer = new MutationObserver(() => {
      resolveTargets();
      currentIndex();
    });
    observer.observe(main, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-home-chapter"],
    });

    const onScroll = () => currentIndex();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const retry = window.setInterval(resolveTargets, 650);
    const stopRetry = window.setTimeout(() => window.clearInterval(retry), 5600);

    return () => {
      observer.disconnect();
      window.clearInterval(retry);
      window.clearTimeout(stopRetry);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [currentIndex, pathname, resolveTargets]);

  useEffect(() => {
    if (pathname !== "/") return;

    function onManualInput(event: Event) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("[data-auto-journey-ui]")
      ) {
        return;
      }
      setMobileMenuOpen(false);
      pauseForReading();
    }

    function onKeydown(event: KeyboardEvent) {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
          event.key,
        )
      ) {
        onManualInput(event);
      }
    }

    window.addEventListener("wheel", onManualInput, { passive: true });
    window.addEventListener("touchstart", onManualInput, { passive: true });
    window.addEventListener("pointerdown", onManualInput, { passive: true });
    window.addEventListener("keydown", onKeydown);

    return () => {
      window.removeEventListener("wheel", onManualInput);
      window.removeEventListener("touchstart", onManualInput);
      window.removeEventListener("pointerdown", onManualInput);
      window.removeEventListener("keydown", onKeydown);
    };
  }, [pathname, pauseForReading]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");

    function syncViewport() {
      setIsMobile(query.matches);
      if (!query.matches) setMobileMenuOpen(false);
    }

    function onAudioState(event: Event) {
      const detail = (event as CustomEvent<{ enabled?: boolean }>).detail;
      setAudioEnabled(Boolean(detail?.enabled));
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }

    syncViewport();
    query.addEventListener("change", syncViewport);
    window.addEventListener(
      "bt:ambient-audio-state",
      onAudioState as EventListener,
    );
    window.addEventListener("keydown", onEscape);
    window.dispatchEvent(new CustomEvent("bt:ambient-audio-query"));

    return () => {
      query.removeEventListener("change", syncViewport);
      window.removeEventListener(
        "bt:ambient-audio-state",
        onAudioState as EventListener,
      );
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPlaying(false);
      setHolding(false);
      setMobileMenuOpen(false);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (pathname !== "/" || !playing || prefersReducedMotion) return;

    let cancelled = false;
    let timer = 0;
    let releaseTimer = 0;

    function schedule(delay: number) {
      timer = window.setTimeout(run, delay);
    }

    function run() {
      if (cancelled) return;

      resolveTargets();
      const targets = targetsRef.current;
      const focused = document.activeElement;
      const editing =
        focused instanceof HTMLElement &&
        Boolean(
          focused.closest("input, textarea, select, [contenteditable='true']"),
        );

      if (
        targets.length < 2 ||
        document.hidden ||
        editing ||
        Date.now() < holdUntilRef.current
      ) {
        const remaining = Math.max(
          1200,
          holdUntilRef.current - Date.now() + 450,
        );
        schedule(Math.min(remaining, 4500));
        return;
      }

      const next = currentIndex() + 1;
      if (next >= targets.length) {
        setPlaying(false);
        setHolding(false);
        setComplete(true);
        return;
      }

      autoScrollRef.current = true;
      scrollToIndex(next, "journey");
      releaseTimer = window.setTimeout(() => {
        autoScrollRef.current = false;
      }, 1900);
    }

    schedule(dwellForIndex(activeIndex));

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearTimeout(releaseTimer);
      autoScrollRef.current = false;
    };
  }, [
    activeIndex,
    currentIndex,
    dwellForIndex,
    pathname,
    playing,
    prefersReducedMotion,
    resolveTargets,
    scrollToIndex,
  ]);

  useEffect(() => {
    function openMobileCinemaControls() {
      if (!isMobile || playing) return;
      setMobileMenuOpen(true);
    }

    window.addEventListener(
      "bt:open-cinema-controls",
      openMobileCinemaControls,
    );
    return () => {
      window.removeEventListener(
        "bt:open-cinema-controls",
        openMobileCinemaControls,
      );
    };
  }, [isMobile, playing]);

  useEffect(
    () => () => {
      window.clearTimeout(holdTimerRef.current);
    },
    [],
  );

  if (pathname !== "/" || prefersReducedMotion) return null;

  const label = playing
    ? holding
      ? "Journey resting"
      : "Journey playing"
    : complete
      ? "Replay journey"
      : "Play journey";
  const total = Math.max(1, targetsRef.current.length || 10);

  function startJourney() {
    holdUntilRef.current = 0;
    setHolding(false);
    setMobileMenuOpen(false);

    if (complete) {
      setComplete(false);
      autoScrollRef.current = true;
      scrollToIndex(0, "replay");
      window.setTimeout(() => {
        autoScrollRef.current = false;
      }, 1900);
    } else {
      broadcastChapter(activeIndexRef.current, "journey");
    }

    setPlaying(true);
  }

  function stopJourney() {
    setPlaying(false);
    setHolding(false);
    setMobileMenuOpen(false);
  }

  function handlePrimaryControl() {
    if (playing) {
      stopJourney();
      return;
    }

    if (isMobile) {
      setMobileMenuOpen((open) => !open);
      return;
    }

    startJourney();
  }

  function toggleAmbientSound() {
    window.dispatchEvent(new CustomEvent("bt:ambient-audio-toggle"));
  }

  const controlLabel =
    isMobile && !playing ? "Open journey and sound controls" : label;

  return (
    <div data-auto-journey-ui className="contents">
      <AnimatePresence>
        {isMobile && mobileMenuOpen && !playing && (
          <motion.div
            id="mobile-cinema-controls"
            data-auto-journey-ui
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[7.9rem] right-4 z-[47] w-60 overflow-hidden rounded-3xl border border-white/12 bg-[#17140f]/94 p-2 text-left text-ivory shadow-[0_24px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:hidden"
          >
            <p className="px-3 pb-2 pt-2 text-[0.55rem] font-medium uppercase tracking-[0.2em] text-ivory/38">
              Cinema controls
            </p>
            <button
              type="button"
              data-auto-journey-ui
              onClick={startJourney}
              className="flex w-full items-center justify-between gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
            >
              <span>
                <span className="block font-display text-lg leading-none text-ivory">
                  {complete ? "Replay the journey" : "Play the journey"}
                </span>
                <span className="mt-1.5 block text-[0.62rem] leading-relaxed text-ivory/45">
                  Move chapter by chapter. Any touch returns control to you.
                </span>
              </span>
              <span aria-hidden="true" className="text-sandstone">
                ▶
              </span>
            </button>
            <button
              type="button"
              data-auto-journey-ui
              aria-pressed={audioEnabled}
              onClick={toggleAmbientSound}
              className="mt-1 flex w-full items-center justify-between gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
            >
              <span>
                <span className="block font-display text-lg leading-none text-ivory">
                  Ambient sound
                </span>
                <span className="mt-1.5 block text-[0.62rem] leading-relaxed text-ivory/45">
                  {audioEnabled
                    ? "Playing softly. Tap to mute."
                    : "Silent by default. Tap to listen."}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${
                  audioEnabled
                    ? "bg-sandstone shadow-[0_0_14px_rgba(212,185,154,0.75)]"
                    : "border border-ivory/25"
                }`}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        data-auto-journey-control
        data-auto-journey-ui
        aria-pressed={playing}
        aria-expanded={isMobile && !playing ? mobileMenuOpen : undefined}
        aria-controls={
          isMobile && !playing ? "mobile-cinema-controls" : undefined
        }
        aria-label={controlLabel}
        onClick={handlePrimaryControl}
        className="fixed bottom-4 right-4 z-[46] inline-flex min-h-10 items-center gap-2 rounded-full border border-white/12 bg-[#17140f]/82 px-3.5 text-[0.56rem] font-medium uppercase tracking-[0.15em] text-ivory/72 shadow-[0_14px_42px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone lg:bottom-5 lg:left-1/2 lg:right-auto lg:-translate-x-1/2"
      >
        <span
          aria-hidden="true"
          className="relative flex h-3.5 w-3.5 items-center justify-center text-sandstone"
        >
          {playing ? (
            <>
              <span className="h-2.5 w-px bg-current" />
              <span className="ml-1 h-2.5 w-px bg-current" />
            </>
          ) : (
            <span className="ml-0.5 h-0 w-0 border-b-[4px] border-l-[7px] border-t-[4px] border-b-transparent border-l-current border-t-transparent" />
          )}
          {playing && !holding && (
            <motion.span
              className="absolute inset-0 rounded-full border border-sandstone/40"
              animate={{ scale: [0.72, 1.5, 0.72], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </span>
        <span>{label}</span>
        <span className="text-sandstone/70">
          {String(activeIndex + 1).padStart(2, "0")}/
          {String(total).padStart(2, "0")}
        </span>
      </button>
    </div>
  );
}
