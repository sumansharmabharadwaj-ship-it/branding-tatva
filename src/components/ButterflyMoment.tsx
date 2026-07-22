"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useLazyMount } from "@/hooks/useLazyMount";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLenis } from "@/components/SmoothScrollProvider";
import { BackgroundVideo } from "@/components/BackgroundVideo";

// Gated behind shouldLoad (not just rendered-but-hidden) so the
// three/@react-three/fiber chunk is genuinely only fetched once this
// section is scrolled near — mirrors DeferredCursor's own dynamic()
// pattern for SparkCursor.
const ButterflyCanvas = dynamic(
  () => import("./ButterflyCanvas").then((m) => m.ButterflyCanvas),
  { ssr: false }
);

// The closing beat of the About page: a 3D butterfly drifting a loose
// figure-eight over the wildflower meadow already playing behind it,
// settling and folding its wings to rest as you scroll through the
// section — direct feedback that an earlier version of this scene
// (five abstract element shapes) read as cartoonish and disconnected
// from the video. Deliberately wordless.
//
// Placed as the last section before Footer, not right after the Hero —
// useLazyMount's rootMargin is only meaningful this far down the page.
// Full WebGL experience only when scrolled near, motion is allowed,
// and the viewport isn't a phone; every other case just shows the
// meadow video on its own, no static stand-in for the butterfly.
export function ButterflyMoment() {
  // 1000px instead of useLazyMount's 600px default — extra lead time
  // specifically because this section's chunk (three + @react-three/
  // fiber, ~900KB) is far heavier than anything else the hook gates.
  const [mediaRef, shouldLoad] = useLazyMount("1000px 0px");
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const lenis = useLenis();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const willShowCanvas = !prefersReducedMotion && !isMobile;
  const showCanvas = shouldLoad && willShowCanvas;

  // shouldLoad firing near the viewport only controls when the (fast)
  // WebGL context and geometry actually get created — it doesn't
  // control when the chunk's JS starts downloading, since next/dynamic
  // doesn't fetch anything until the lazy component first renders.
  // Warming the same import() specifier during idle time, right from
  // page load, means that fetch/parse work happens in the background
  // while someone's still reading the sections above, so by the time
  // shouldLoad fires the module is already cached. Skipped entirely
  // when this section will never render the canvas anyway.
  useEffect(() => {
    if (!willShowCanvas) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
    const prefetch = () => {
      import("./ButterflyCanvas");
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(prefetch, { timeout: 3000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const timeout = setTimeout(prefetch, 1500);
    return () => clearTimeout(timeout);
  }, [willShowCanvas]);

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
      <section ref={mediaRef} className="relative flex items-center justify-center overflow-hidden bg-soil py-28">
        <BackgroundVideo
          video="/videos/pixabay-alpine-wildflowers.mp4"
          poster="/images/pixabay-alpine-wildflowers-poster.jpg"
        />
        <div className="absolute inset-0 bg-soil/40" />
      </section>
    );
  }

  return (
    <div ref={wrapperRef} className="relative bg-soil" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <BackgroundVideo
          video="/videos/pixabay-alpine-wildflowers.mp4"
          poster="/images/pixabay-alpine-wildflowers-poster.jpg"
        />
        <div className="absolute inset-0 bg-soil/35" />
        <ButterflyCanvas progressRef={progressRef} />
      </div>
    </div>
  );
}
