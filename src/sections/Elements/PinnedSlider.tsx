"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import { ElementSignature } from "@/sections/Elements/ElementSignature";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { Element } from "@/data/elements";

const STAGE_SPEED = 0.85;
const HOLD = 0.36;
const TAIL_BUFFER_VH = 60;
const AUTO_ADVANCE_MS = 4800;
const MANUAL_PAUSE_MS = 12000;
const SCROLL_IDLE_MS = 320;

export function PinnedSlider({ elements }: { elements: Element[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const frameRef = useRef(0);
  const scrollIdleTimerRef = useRef(0);
  const lastTopRef = useRef<number | null>(null);
  const scrollDrivenRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  const pauseAutoplay = useCallback((duration = MANUAL_PAUSE_MS) => {
    pauseUntilRef.current = Date.now() + duration;
  }, []);

  const showIndex = useCallback(
    (index: number) => {
      if (!elements.length) return;
      const next = ((index % elements.length) + elements.length) % elements.length;
      activeRef.current = next;
      setActiveIndex((current) => (current === next ? current : next));
      slideRefs.current.forEach((slide, slideIndex) => {
        if (slide) slide.style.opacity = slideIndex === next ? "1" : "0";
      });
    },
    [elements.length],
  );

  const renderScrollProgress = useCallback(
    (progress: number) => {
      if (!elements.length) return;
      const index = Math.min(elements.length - 1, Math.round(progress));
      activeRef.current = index;
      setActiveIndex((current) => (current === index ? current : index));

      slideRefs.current.forEach((slide, slideIndex) => {
        if (!slide) return;
        const delta = Math.abs(progress - slideIndex);
        const opacity =
          delta <= HOLD
            ? 1
            : delta <= 1 - HOLD
              ? 1 - (delta - HOLD) / (1 - 2 * HOLD)
              : 0;
        slide.style.opacity = String(opacity);
      });
    },
    [elements.length],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.45);
        setIsVisible(visible);
      },
      { threshold: [0, 0.45, 0.75] },
    );

    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function updateFromScroll(force = false) {
      if (frameRef.current) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0;
        const wrapper = wrapperRef.current;
        if (!wrapper || !elements.length) return;

        const rect = wrapper.getBoundingClientRect();
        const previousTop = lastTopRef.current;
        const moved =
          previousTop === null || Math.abs(rect.top - previousTop) > 0.45;
        lastTopRef.current = rect.top;

        if (!moved && !force) return;

        scrollDrivenRef.current = true;
        window.clearTimeout(scrollIdleTimerRef.current);
        scrollIdleTimerRef.current = window.setTimeout(() => {
          scrollDrivenRef.current = false;
          showIndex(activeRef.current);
        }, SCROLL_IDLE_MS);

        const distance =
          (elements.length - 1) * window.innerHeight * STAGE_SPEED;
        const raw = distance > 0 ? -rect.top / distance : 0;
        const progress =
          Math.min(1, Math.max(0, raw)) * (elements.length - 1);
        renderScrollProgress(progress);
      });
    }

    const onScroll = () => updateFromScroll(false);
    const onResize = () => updateFromScroll(true);

    updateFromScroll(true);
    const unsubscribe = lenis?.on("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      unsubscribe?.();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(frameRef.current);
      window.clearTimeout(scrollIdleTimerRef.current);
    };
  }, [elements.length, lenis, renderScrollProgress, showIndex]);

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "elements") return;
      setIsVisible(true);
      pauseAutoplay(900);
      showIndex(0);
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => {
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
    };
  }, [pauseAutoplay, showIndex]);

  useEffect(() => {
    if (!isVisible || elements.length < 2) return;

    const timer = window.setInterval(() => {
      if (
        document.hidden ||
        scrollDrivenRef.current ||
        Date.now() < pauseUntilRef.current
      ) {
        return;
      }
      showIndex(activeRef.current + 1);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [elements.length, isVisible, showIndex]);

  const height =
    (elements.length - 1) * 100 * STAGE_SPEED + TAIL_BUFFER_VH;

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: `${height}vh` }}
      onWheel={() => pauseAutoplay()}
      onTouchStart={() => pauseAutoplay()}
      onPointerDown={() => pauseAutoplay()}
      onFocusCapture={() => pauseAutoplay()}
    >
      <div
        ref={viewportRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {elements.map((element, index) => (
          <div
            key={element.slug}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{
              opacity: index === 0 ? 1 : 0,
              pointerEvents: index === activeIndex ? "auto" : "none",
            }}
            aria-hidden={index !== activeIndex}
          >
            <ElementRowBackground
              image={element.image}
              video={element.video}
              color={element.color}
              imagePosition={element.imagePosition}
              active={index === activeIndex && isVisible}
            />
            {index === activeIndex && (
              <ElementSignature slug={element.slug} color={element.color} />
            )}
            <div className="relative flex h-full items-center px-6 sm:px-16">
              <div className="max-w-xl">
                <div className="flex items-center gap-4">
                  <span
                    className="font-display text-[clamp(3.5rem,9vw,6.5rem)] font-normal leading-none"
                    style={{
                      color: element.color,
                      textShadow: "0 2px 16px rgba(0,0,0,0.55)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ElementGlyph
                    slug={element.slug}
                    className="h-10 w-10 opacity-90"
                    style={{ color: element.color }}
                  />
                </div>
                <p className="mt-4 font-display text-3xl font-normal text-ivory sm:text-4xl">
                  {element.name}
                </p>
                <div className="mt-4 space-y-1.5 font-display text-xl italic text-ivory/85 sm:text-2xl">
                  {element.manifesto.map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
                </div>
                <div className="mt-5 max-w-md space-y-2">
                  {element.concepts.map((concept, conceptIndex) => (
                    <p
                      key={conceptIndex}
                      className="text-sm text-ivory/75 sm:text-base"
                    >
                      {concept}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <nav
          aria-label="Choose a Tatva"
          className="absolute bottom-8 left-4 z-20 flex max-w-[calc(100%-2rem)] gap-1 overflow-x-auto rounded-full border border-ivory/12 bg-soil/55 p-1.5 backdrop-blur-md sm:bottom-10 sm:left-12 sm:gap-2"
        >
          {elements.map((element, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={element.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  pauseAutoplay();
                  showIndex(index);
                }}
                className="group flex min-h-9 shrink-0 items-center gap-2 rounded-full px-3 text-[0.62rem] uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                style={{
                  color: selected ? "#F4EFE6" : "rgba(244,239,230,0.48)",
                  backgroundColor: selected
                    ? "rgba(244,239,230,0.09)"
                    : "transparent",
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125"
                  style={{ backgroundColor: element.color }}
                />
                {String(index + 1).padStart(2, "0")} {element.name.split(" ")[0]}
              </button>
            );
          })}
        </nav>

        <div className="pointer-events-none absolute bottom-10 right-6 z-10 hidden text-right lg:block lg:right-16">
          <p className="text-[0.6rem] uppercase tracking-[0.18em] text-ivory/42">
            {scrollDrivenRef.current ? "Scroll is steering" : "The Tatvas keep moving"}
          </p>
          <p className="mt-1 text-xs text-ivory/66">
            Scroll to steer · choose a Tatva to hold
          </p>
        </div>
      </div>
    </div>
  );
}
