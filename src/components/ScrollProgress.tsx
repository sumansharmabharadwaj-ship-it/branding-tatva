"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef } from "react";

import { useLenis } from "@/components/SmoothScrollProvider";

// A thin reading-progress bar for the About page specifically — About is
// this site's most narrative, long-form page, the one place a "how far
// through this am I" affordance actually earns its keep. Subscribes via
// useLenis() rather than a native scroll listener, same rule every other
// scroll-driven piece on this site follows (see SmoothScrollProvider's
// own comment on why). The scroll callback receives the Lenis instance
// itself, not an event payload — it exposes its own `progress` getter.
//
// Writes width directly to the bar's own ref instead of going through
// React state — `progress` changes on essentially every scroll frame
// while scrolling, and routing that through setState forced a full
// component re-render every tick. PinnedJourney/PinnedSlider/
// MeadowClosing already settled on direct ref-style mutation for this
// exact reason; this just applies the same pattern here.
//
// z-50 specifically: the header's nav pill sits at z-40, its mobile-menu
// backdrop at z-30. This only needs to sit above both, not reason about
// the rest of the stack, hence the round number rather than z-41.
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    function setProgress(progress: number) {
      if (barRef.current) barRef.current.style.width = `${progress * 100}%`;
    }

    if (lenis) {
      const unsubscribe = lenis.on("scroll", (l) => setProgress(l.progress));
      return () => unsubscribe();
    }

    // Lenis doesn't exist at all under prefers-reduced-motion (see
    // SmoothScrollProvider) — its own comment documents that consumers
    // must fall back to native scroll behavior when useLenis() is null.
    function onNativeScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    }
    onNativeScroll();
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    return () => window.removeEventListener("scroll", onNativeScroll);
  }, [lenis]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full bg-clay"
        style={{
          width: "0%",
          transition: prefersReducedMotion ? "none" : "width 100ms linear",
        }}
      />
    </div>
  );
}
