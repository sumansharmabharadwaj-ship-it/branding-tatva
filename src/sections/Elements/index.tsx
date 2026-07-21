"use client";

import { useReducedMotion } from "framer-motion";
import { PinnedSlider } from "./PinnedSlider";
import { VerticalUnfold } from "./VerticalUnfold";
import type { Element } from "@/data/elements";

// Same pinned/fallback split Process/index.tsx already established for
// its own now-removed horizontal pin — reduced-motion (and, unlike
// Process, mobile too: a pinned full-viewport slide sequence assumes
// room to breathe that a phone screen doesn't have) gets the vertical
// unfold instead of the slide sequence.
export function ElementsSection({ elements }: { elements: Element[] }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <VerticalUnfold elements={elements} />;
  }

  return (
    <>
      <div className="hidden sm:block">
        <PinnedSlider elements={elements} />
      </div>
      {/* overflow-x-hidden here, not on a shared ancestor with
          PinnedSlider — VerticalUnfold's rows use ElementReveal's
          per-element entrance signatures (water/air slide in from off
          to the side by design), which used to rely on this whole
          section's own now-removed overflow-hidden to stay contained
          during the animation. Scoping the clip to this motion-only,
          non-sticky branch keeps that containment without reintroducing
          the ancestor that broke PinnedSlider's sticky positioning. */}
      <div className="overflow-x-hidden sm:hidden">
        <VerticalUnfold elements={elements} />
      </div>
    </>
  );
}
