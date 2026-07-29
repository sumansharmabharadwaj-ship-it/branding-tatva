"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "@/components/SmoothScrollProvider";

const FADE_DISTANCE = 150;

// A small "keep going" affordance for the About hero — purely decorative
// scroll invitation, not a UI indicator, so (unlike ScrollProgress) it's
// removed outright rather than kept-but-static under reduced motion,
// matching this codebase's own precedent for pure decoration
// (DustMotes, SparkCursor). PhotoHero's outer section is `relative`, so
// this renders as its sibling and anchors to the full hero height.
//
// Writes opacity directly to the wrapper's own ref instead of going
// through React state — same reasoning as ScrollProgress's own fix:
// this value changes on nearly every scroll frame while scrolling, so
// setState here meant a full re-render every tick for what's ultimately
// a single inline style write.
export function ScrollCue() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (prefersReducedMotion) return;

    function onScroll(scrollY: number) {
      if (ref.current) ref.current.style.opacity = String(Math.max(0, 1 - scrollY / FADE_DISTANCE));
    }

    if (lenis) {
      const unsubscribe = lenis.on("scroll", (l) => onScroll(l.scroll));
      return () => unsubscribe();
    }

    function onNativeScroll() {
      onScroll(window.scrollY);
    }
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    return () => window.removeEventListener("scroll", onNativeScroll);
  }, [lenis, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2"
      style={{ opacity: 1 }}
      aria-hidden="true"
    >
      <span className="font-body text-[0.65rem] uppercase tracking-[0.3em] text-ivory/60">Scroll</span>
      <span className="h-8 w-px animate-pulse bg-ivory/40" />
    </div>
  );
}
