"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useCallback, useEffect, useRef, useState } from "react";

import { ElementRowBackground } from "@/components/ElementRowBackground";
import { ElementSignature } from "@/sections/Elements/ElementSignature";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { Element } from "@/data/elements";

const AUTO_ADVANCE_MS = 5000;
const MANUAL_HOLD_MS = 14000;

export function PinnedSlider({ elements }: { elements: Element[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const holdUntilRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const showIndex = useCallback(
    (index: number, hold = 0) => {
      if (!elements.length) return;
      const next = ((index % elements.length) + elements.length) % elements.length;
      if (hold) holdUntilRef.current = Date.now() + hold;
      setActiveIndex(next);
    },
    [elements.length],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.22));
      },
      { rootMargin: "10% 0px -10% 0px", threshold: [0, 0.22, 0.48, 0.72] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "elements") return;
      showIndex(0, 900);
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => window.removeEventListener("bt:home-chapter", onChapter as EventListener);
  }, [showIndex]);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion || elements.length < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < holdUntilRef.current) return;
      setActiveIndex((current) => (current + 1) % elements.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [elements.length, isVisible, prefersReducedMotion]);

  const active = elements[activeIndex];

  return (
    <section
      ref={sectionRef}
      data-elements-carousel="true"
      className="relative h-[100svh] min-h-[44rem] max-h-[60rem] w-full overflow-hidden bg-soil"
      onWheel={() => {
        holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
      onTouchStart={() => {
        holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
      onPointerDown={() => {
        holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
      onFocusCapture={() => {
        holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
      aria-label="The five Tatvas in practice"
    >
      {elements.map((element, index) => {
        const selected = index === activeIndex;
        return (
          <div
            key={element.slug}
            className="absolute inset-0 transition-[opacity,filter,transform] duration-700 ease-out"
            style={{
              opacity: selected ? 1 : 0,
              filter: selected ? "blur(0px)" : "blur(5px)",
              transform: selected ? "scale(1)" : "scale(1.018)",
              pointerEvents: selected ? "auto" : "none",
            }}
            aria-hidden={!selected}
          >
            <ElementRowBackground
              image={element.image}
              video={element.video}
              color={element.color}
              imagePosition={element.imagePosition}
              active={selected && isVisible}
            />

            {selected && <ElementSignature slug={element.slug} color={element.color} />}

            <div className="relative flex h-full items-center px-6 pb-24 pt-24 sm:px-12 sm:pb-28 sm:pt-28 lg:px-16">
              <div className="max-w-xl">
                <div className="flex items-center gap-4">
                  <span
                    className="font-display text-[clamp(3.4rem,8vw,6rem)] font-normal leading-none"
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

                <div className="mt-5 grid max-w-lg grid-cols-1 gap-x-7 gap-y-2 sm:grid-cols-2">
                  {element.concepts.map((concept, conceptIndex) => (
                    <p
                      key={conceptIndex}
                      className="border-l border-ivory/16 pl-3 text-sm text-ivory/72 sm:text-base"
                    >
                      {concept}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-x-5 top-6 z-30 flex items-center justify-between gap-4 sm:inset-x-10 sm:top-9 lg:inset-x-16">
        <div>
          <p className="text-[0.58rem] font-medium uppercase tracking-[0.2em] text-ivory/45">
            The five-element chapter
          </p>
          <p className="mt-1 font-display text-xl text-ivory sm:text-2xl">
            {active?.name}
          </p>
        </div>
        <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-ivory/48">
          Autoplaying · choose to hold
        </p>
      </div>

      <nav
        aria-label="Choose a Tatva"
        className="absolute bottom-7 left-1/2 z-30 flex max-w-[calc(100%-2rem)] -translate-x-1/2 gap-1 overflow-x-auto rounded-full border border-ivory/14 bg-soil/64 p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:bottom-9 sm:gap-2"
      >
        {elements.map((element, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={element.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => showIndex(index, MANUAL_HOLD_MS)}
              className="group relative flex min-h-10 shrink-0 items-center gap-2 overflow-hidden rounded-full px-3 text-[0.6rem] uppercase tracking-[0.13em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
              style={{
                color: selected ? "#F4EFE6" : "rgba(244,239,230,0.5)",
                backgroundColor: selected
                  ? "rgba(244,239,230,0.1)"
                  : "transparent",
              }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: element.color }}
              />
              {String(index + 1).padStart(2, "0")} {element.name.split(" ")[0]}
              {selected && !prefersReducedMotion && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 bottom-0 h-px origin-left animate-[tatva-carousel-progress_5s_linear_forwards]"
                  style={{ backgroundColor: element.color }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <style>{`
        @keyframes tatva-carousel-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-elements-carousel] * {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </section>
  );
}
