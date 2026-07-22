"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useLazyMount } from "@/hooks/useLazyMount";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLenis } from "@/components/SmoothScrollProvider";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ELEMENT_HEX, type ElementSlug } from "@/lib/sectionWash";

// Gated behind shouldLoad (not just rendered-but-hidden) so the
// three/@react-three/fiber chunk is genuinely only fetched once this
// section is scrolled near — mirrors DeferredCursor's own dynamic()
// pattern for SparkCursor.
const FiveElementsCanvas = dynamic(
  () => import("./FiveElementsCanvas").then((m) => m.FiveElementsCanvas),
  { ssr: false }
);

const FALLBACK_BARS: { slug: ElementSlug; height: number }[] = [
  { slug: "earth", height: 68 },
  { slug: "water", height: 96 },
  { slug: "fire", height: 128 },
  { slug: "air", height: 96 },
  { slug: "space", height: 68 },
];

// The closing beat of the About page: a literal 3D realization of "Five
// bars, one per element, rising and settling like a skyline" — the line
// sitting directly above this section in "Why this site looks the way
// it does". Deliberately wordless; the copy already carries the idea.
//
// Placed as the last section before Footer, not right after the Hero —
// useLazyMount's rootMargin is only meaningful this far down the page,
// and it reads as payoff for the line above it rather than an
// interruption. Full WebGL experience only when scrolled near, motion
// is allowed, and the viewport isn't a phone; every other case gets a
// static version of the same five bars on an ordinary section height,
// not the oversized scroll-pinned wrapper the real experience needs.
export function FiveElementsMoment() {
  const [mediaRef, shouldLoad] = useLazyMount();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const lenis = useLenis();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const showCanvas = shouldLoad && !prefersReducedMotion && !isMobile;

  useEffect(() => {
    if (!showCanvas) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Same rect-top-vs-viewport-height style PinnedJourney.update() uses
    // — mutated into a ref every scroll tick, never setState, so the
    // R3F render loop (not React) drives the animation.
    function update() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const raw = -rect.top / window.innerHeight;
      progressRef.current = Math.min(1, Math.max(0, raw));
    }

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe?.();
      window.removeEventListener("resize", update);
    };
  }, [lenis, showCanvas]);

  if (!showCanvas) {
    return (
      <section className="relative flex items-center justify-center overflow-hidden bg-soil py-28">
        <BackgroundVideo
          video="/videos/pixabay-alpine-wildflowers.mp4"
          poster="/images/pixabay-alpine-wildflowers-poster.jpg"
        />
        <div className="absolute inset-0 bg-soil/55" />
        <div ref={mediaRef} className="relative flex items-end gap-3" aria-hidden="true">
          {FALLBACK_BARS.map((bar) => (
            <span
              key={bar.slug}
              className="w-3 rounded-full opacity-90"
              style={{ height: bar.height, backgroundColor: ELEMENT_HEX[bar.slug] }}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div ref={wrapperRef} className="relative bg-soil" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Was flat bg-soil behind the capsules — direct feedback that
            an animation over a plain solid color reads as monotonous.
            A vibrant alpine wildflower meadow (Pixabay, free-licensed —
            Higgsfield credits were exhausted this session) sits behind
            the canvas at moderate overlay strength, since the whole
            point of the earlier Sandstone-section fix was that too much
            overlay drowns the footage out again. */}
        <BackgroundVideo
          video="/videos/pixabay-alpine-wildflowers.mp4"
          poster="/images/pixabay-alpine-wildflowers-poster.jpg"
        />
        <div className="absolute inset-0 bg-soil/50" />
        <FiveElementsCanvas progressRef={progressRef} />
      </div>
    </div>
  );
}
