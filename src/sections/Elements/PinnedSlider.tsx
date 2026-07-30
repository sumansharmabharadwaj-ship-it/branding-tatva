"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { Element } from "@/data/elements";

// A true pinned slide sequence — one element fills the viewport at a
// time, cross-fading as you scroll, instead of scrolling past five
// stacked rows. This used to be driven by a GSAP ScrollTrigger `pin`
// (a separate trigger/pin-target pair, a cached start/end scroll
// range, anticipatePin, a visibilitychange refresh) — the same
// category of feature the Process section's old horizontal pin used
// and lost to real, repeated bugs (pin desync on tab backgrounding,
// stale trigger positions, a pin-target/wrapper mismatch that left
// dead scroll space after unpinning). Rebuilt on plain CSS
// `position: sticky` instead: the browser's own layout engine keeps
// the slide viewport in place for exactly as long as the wrapper
// below it is in the document, recomputed from live geometry on every
// scroll tick rather than a value cached once up front — there's no
// separate trigger/pin-target pairing left to fall out of sync, and
// no scenario where "sticky" and "the wrapper's actual height" can
// disagree, because sticky positioning IS the wrapper's own layout,
// not a second system tracking it.
// Direct feedback that the slider felt "too fast," with no stage ever
// reading as settled — the original crossfade math (opacity = 1 - |progress
// - i|) only hits full opacity at one exact scroll pixel per stage, then
// immediately starts fading into the neighbor. There was never a real
// "hold": every scroll frame was mid-transition. Two changes fix that:
// STAGE_SPEED slows the whole sequence (more real scroll distance per
// stage-to-stage transition), and HOLD carves out a plateau around each
// stage's own center where it stays fully opaque before the crossfade
// into the next one begins.
const STAGE_SPEED = 1.3;
const HOLD = 0.35;

export function PinnedSlider({ elements }: { elements: Element[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // Mirrors activeIndex without triggering a re-render on read — lets
  // the scroll handler (fires on effectively every frame while
  // scrolling) skip the setState call entirely on the vast majority of
  // frames where the rounded index hasn't actually changed, instead of
  // re-rendering the whole slider every frame for the entire scroll
  // range.
  const activeIndexRef = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function update() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      // Fixed distance, not rect.height - innerHeight — the wrapper is
      // deliberately taller than this (see the (elements.length + 1) * 100vh
      // below) so there's a dedicated buffer after the last slide becomes
      // fully active. Tying progress to the wrapper's own full height meant
      // progress=1 and the moment CSS sticky has to start releasing
      // (remaining wrapper height drops to exactly one viewport) landed on
      // the exact same scroll position — the last slide never got a stable
      // instant on screen, it started sliding away the moment it appeared.
      const scrollDistance = (elements.length - 1) * window.innerHeight * STAGE_SPEED;
      const raw = scrollDistance > 0 ? -rect.top / scrollDistance : 0;
      const clamped = Math.min(1, Math.max(0, raw));
      const progress = clamped * (elements.length - 1);
      const idx = Math.min(elements.length - 1, Math.round(progress));
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;
        const d = Math.abs(progress - i);
        const opacity = d <= HOLD ? 1 : d <= 1 - HOLD ? 1 - (d - HOLD) / (1 - 2 * HOLD) : 0;
        slide.style.opacity = String(opacity);
      });
    }

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe?.();
      window.removeEventListener("resize", update);
    };
  }, [elements.length, lenis]);

  return (
    // +1 slide-height of buffer beyond what the crossfade math needs —
    // see update()'s own comment for why sticky needs dedicated room to
    // release in, separate from the last slide's own on-screen moment.
    <div ref={wrapperRef} className="relative" style={{ height: `${(elements.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {elements.map((el, i) => (
          <div
            key={el.slug}
            ref={(node) => {
              slideRefs.current[i] = node;
            }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === activeIndex ? "auto" : "none" }}
            aria-hidden={i !== activeIndex}
          >
            <ElementRowBackground
              image={el.image}
              video={el.video}
              color={el.color}
              imagePosition={el.imagePosition}
              active={i === activeIndex}
            />
            <div className="relative flex h-full items-center px-6 sm:px-16">
              <div className="max-w-xl">
                <div className="flex items-center gap-4">
                  <span
                    className="font-display text-[clamp(3.5rem,9vw,6.5rem)] font-normal leading-none opacity-40"
                    style={{ color: el.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ElementGlyph slug={el.slug} className="h-10 w-10 opacity-90" style={{ color: el.color }} />
                </div>
                <p className="mt-4 font-display text-3xl font-normal text-ivory sm:text-4xl">{el.name}</p>
                <p className="mt-4 font-display text-xl italic text-ivory/85 sm:text-2xl">
                  &ldquo;{el.poetic}&rdquo;
                </p>
                <p className="mt-3 max-w-md text-sm text-ivory/75 sm:text-base">{el.meaning}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Numbered index — same idea as the reference site's own
            "1. Timber / 2. Heat" list, tracking scroll progress within
            this pinned range instead of an IntersectionObserver (there's
            nothing to observe — every slide occupies the same viewport
            rect at once, only opacity differs). */}
        <div className="pointer-events-none absolute bottom-10 left-6 z-10 flex gap-6 sm:left-16">
          {elements.map((el, i) => (
            <div key={el.slug} className="flex items-center gap-2">
              <span
                className="font-body text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500"
                style={{ color: i === activeIndex ? "#F4EFE6" : "rgba(244,239,230,0.4)" }}
              >
                {String(i + 1).padStart(2, "0")} {el.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
