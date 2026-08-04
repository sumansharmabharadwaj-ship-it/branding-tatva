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

export function PinnedSlider({ elements }: { elements: Element[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  const pauseAutoplay = useCallback(() => {
    pauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
  }, []);

  const showIndex = useCallback(
    (index: number) => {
      if (!elements.length) return;
      const next = ((index % elements.length) + elements.length) % elements.length;
      activeRef.current = next;
      setActiveIndex(next);
      slideRefs.current.forEach((slide, slideIndex) => {
        if (slide) slide.style.opacity = slideIndex === next ? "1" : "0";
      });
    },
    [elements.length],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.5)),
      { threshold: [0, 0.5, 0.8] },
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function update() {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const distance = (elements.length - 1) * window.innerHeight * STAGE_SPEED;
      const raw = distance > 0 ? -rect.top / distance : 0;
      const progress = Math.min(1, Math.max(0, raw)) * (elements.length - 1);
      const index = Math.min(elements.length - 1, Math.round(progress));
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActiveIndex(index);
      }
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
    }

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      unsubscribe?.();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [elements.length, lenis]);

  useEffect(() => {
    if (!isVisible || elements.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < pauseUntilRef.current) return;
      showIndex(activeRef.current + 1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [elements.length, isVisible, showIndex]);

  const height = (elements.length - 1) * 100 * STAGE_SPEED + TAIL_BUFFER_VH;

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: `${height}vh` }}
      onWheel={pauseAutoplay}
      onTouchStart={pauseAutoplay}
      onPointerDown={pauseAutoplay}
      onFocusCapture={pauseAutoplay}
    >
      <div ref={viewportRef} className="sticky top-0 h-screen w-full overflow-hidden">
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
              active={index === activeIndex}
            />
            {index === activeIndex && (
              <ElementSignature slug={element.slug} color={element.color} />
            )}
            <div className="relative flex h-full items-center px-6 sm:px-16">
              <div className="max-w-xl">
                <div className="flex items-center gap-4">
                  <span
                    className="font-display text-[clamp(3.5rem,9vw,6.5rem)] font-normal leading-none"
                    style={{ color: element.color, textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}
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
                    <p key={conceptIndex} className="text-sm text-ivory/75 sm:text-base">
                      {concept}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute bottom-10 left-6 z-10 flex gap-6 sm:left-16">
          {elements.map((element, index) => (
            <span
              key={element.slug}
              className="font-body text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: index === activeIndex ? "#F4EFE6" : "rgba(244,239,230,0.4)" }}
            >
              {String(index + 1).padStart(2, "0")} {element.name.split(" ")[0]}
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-10 right-6 z-10 hidden text-right sm:block sm:right-16">
          <p className="text-[0.6rem] uppercase tracking-[0.18em] text-ivory/42">
            The Tatvas keep moving
          </p>
          <p className="mt-1 text-xs text-ivory/66">Scroll to steer · pause to watch</p>
        </div>
      </div>
    </div>
  );
}
