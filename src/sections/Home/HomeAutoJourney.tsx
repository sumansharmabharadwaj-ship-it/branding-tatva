"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";

const FIRST_ADVANCE_MS = 14000;
const CHAPTER_ADVANCE_MS = 16000;
const MANUAL_HOLD_MS = 18000;

export function HomeAutoJourney() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const targetsRef = useRef<HTMLElement[]>([]);
  const activeIndexRef = useRef(0);
  const autoScrollRef = useRef(false);
  const holdUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [holding, setHolding] = useState(false);
  const [complete, setComplete] = useState(false);

  const resolveTargets = useCallback(() => {
    targetsRef.current = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-chapter]"),
    );
  }, []);

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
    setActiveIndex(index);
    return index;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const target = targetsRef.current[index];
      if (!target) return;

      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(target, { offset: -72, duration: 1.35 });
      } else {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [lenis, prefersReducedMotion],
  );

  const pauseForReading = useCallback(() => {
    if (autoScrollRef.current) return;

    holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
    setHolding(true);
    window.setTimeout(() => {
      if (Date.now() >= holdUntilRef.current) setHolding(false);
    }, MANUAL_HOLD_MS + 100);
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
        target.closest("[data-auto-journey-control]")
      ) {
        return;
      }
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
    if (prefersReducedMotion) {
      setPlaying(false);
      setHolding(false);
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
      scrollToIndex(next);
      releaseTimer = window.setTimeout(() => {
        autoScrollRef.current = false;
      }, 1900);
      schedule(CHAPTER_ADVANCE_MS);
    }

    schedule(activeIndexRef.current === 0 ? FIRST_ADVANCE_MS : CHAPTER_ADVANCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearTimeout(releaseTimer);
      autoScrollRef.current = false;
    };
  }, [currentIndex, pathname, playing, prefersReducedMotion, resolveTargets, scrollToIndex]);

  if (pathname !== "/" || prefersReducedMotion) return null;

  const label = playing
    ? holding
      ? "Journey resting"
      : "Journey playing"
    : complete
      ? "Replay journey"
      : "Play journey";
  const total = Math.max(1, targetsRef.current.length || 11);

  function toggle() {
    setPlaying((current) => {
      const next = !current;
      if (next) {
        holdUntilRef.current = 0;
        setHolding(false);
        if (complete) {
          setComplete(false);
          autoScrollRef.current = true;
          scrollToIndex(0);
          window.setTimeout(() => {
            autoScrollRef.current = false;
          }, 1900);
        }
      }
      return next;
    });
  }

  return (
    <button
      type="button"
      data-auto-journey-control
      aria-pressed={playing}
      aria-label={label}
      onClick={toggle}
      className="fixed bottom-4 right-4 z-[46] inline-flex min-h-10 items-center gap-2 rounded-full border border-white/12 bg-[#17140f]/82 px-3.5 text-[0.56rem] font-medium uppercase tracking-[0.15em] text-ivory/72 shadow-[0_14px_42px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone md:bottom-5 md:left-1/2 md:right-auto md:-translate-x-1/2"
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
        {String(activeIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </span>
    </button>
  );
}
