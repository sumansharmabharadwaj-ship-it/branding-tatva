"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ElementRowBackground } from "@/components/ElementRowBackground";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { Element } from "@/data/elements";

gsap.registerPlugin(ScrollTrigger);

// A true pinned slide sequence — one element fills the viewport at a
// time, cross-fading as you scroll, instead of scrolling past five
// stacked rows. This is the same category of feature the Process
// section's old horizontal pin used and lost to real bugs (pin desync
// on tab backgrounding, stale trigger positions once lazy content
// shifted things) — see sections/Process/index.tsx's own history. Two
// choices here specifically avoid that failure class rather than just
// hoping it doesn't recur:
//
// 1. The scrollable range comes from a fixed `elements.length * 100vh`
//    height on the outer wrapper, not from measuring the pinned
//    content's own rendered size. The slides are absolutely positioned
//    inside the pinned viewport and don't participate in document
//    flow, so a video or image finishing its lazy-mount load later
//    can't change the wrapper's height and can't desync the trigger's
//    start/end — the one thing the removed pin's own postmortem
//    specifically named as a cause.
// 2. Tab-backgrounding desync is SmoothScrollProvider's job (it already
//    calls ScrollTrigger.refresh() on visibilitychange, added when the
//    old pin was still in use) — nothing extra needed here.
//
// Reduced-motion users never see this at all; ElementsSection renders
// VerticalUnfold instead, same split Process/index.tsx already
// established for its own pinned/fallback pair.
export function PinnedSlider({ elements }: { elements: Element[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // Mirrors activeIndex without triggering a re-render on read — lets
  // onUpdate (fires on effectively every scrub frame while scrolling)
  // skip the setState call entirely on the vast majority of frames
  // where the rounded index hasn't actually changed, instead of
  // re-rendering the whole slider every frame for the entire scroll
  // range.
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const slides = slideRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (slides.length === 0) return;

      gsap.set(slides, { opacity: 0 });
      gsap.set(slides[0], { opacity: 1 });

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: () => `+=${(elements.length - 1) * window.innerHeight}`,
        pin: pinRef.current,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress * (elements.length - 1);
          const idx = Math.min(elements.length - 1, Math.round(progress));
          if (idx !== activeIndexRef.current) {
            activeIndexRef.current = idx;
            setActiveIndex(idx);
          }
          slides.forEach((slide, i) => {
            const opacity = Math.max(0, 1 - Math.abs(progress - i));
            gsap.set(slide, { opacity });
          });
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [elements.length]);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${elements.length * 100}vh` }}>
      {/* pin targets this div specifically, not wrapperRef — pinning the
          scroll-height wrapper itself (elements.length * 100vh tall)
          left it fixed at its own full height once pinned, so only its
          top 100vh (this inner div) ever showed through the viewport
          while the remaining height sat pinned off-screen; once
          ScrollTrigger unpinned, the page had to scroll through that
          leftover space as blank before the next section, and the
          pin-spacer/trigger size mismatch let a sliver of it show as a
          stray line at the seam. Pinning this h-screen div instead
          keeps the pinned box's own size equal to the viewport. */}
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {elements.map((el, i) => (
          <div
            key={el.slug}
            ref={(node) => {
              slideRefs.current[i] = node;
            }}
            className="absolute inset-0"
            style={{ pointerEvents: i === activeIndex ? "auto" : "none" }}
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
                    className="font-display text-[clamp(3.5rem,9vw,6.5rem)] font-semibold leading-none opacity-40"
                    style={{ color: el.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ElementGlyph slug={el.slug} className="h-10 w-10 opacity-90" style={{ color: el.color }} />
                </div>
                <p className="mt-4 font-display text-3xl font-semibold text-ivory sm:text-4xl">{el.name}</p>
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
