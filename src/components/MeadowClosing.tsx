"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";

import { LivingImage } from "@/components/LivingImage";
import { useLenis } from "@/components/SmoothScrollProvider";
import { elements } from "@/data/elements";
import { blendHex, SOIL } from "@/lib/sectionWash";
import { stageOpacity } from "@/lib/pinnedStageOpacity";

const CLOSING_LINE = "Everything on this page took time to become one thing. Yours can too.";

// The About page's closing beat, third version. Two earlier attempts
// (abstract WebGL element shapes, then a hand-built 3D butterfly) were
// rejected as cartoonish and disconnected from both the brand and the
// meadow video behind them. This version drops 3D geometry entirely
// and instead gives the site's actual five-elements language its own
// pinned, full-color moment — reusing the exact poetic line already
// approved and live for each element on the Home page (src/data/
// elements.ts), rather than inventing new copy. Direct feedback that
// a single small accent color read as barely visible against the
// video is solved structurally here: each element's hue drives the
// entire overlay tint and a large headline for its own full-screen
// beat, not a small text detail competing with the footage.
//
// Same pinned-sequence mechanics PinnedJourney.tsx already proved on
// the Process section: a (stages+1)*100vh wrapper around a sticky
// h-screen inner, progress computed from rect-top vs a fixed scroll
// distance, mutated into refs every scroll tick rather than React
// state (only the rarely-changing "which stage is active" value is
// state, for aria-hidden/pointer-events — everything continuous is a
// direct style write). No GSAP ScrollTrigger pin, no WebGL.
//
// Same STAGE_SPEED pacing fix as PinnedSlider/ElementsIntroPinned —
// direct, repeated feedback that pinned scrolling site-wide felt too
// fast to actually settle on a stage. Wrapper height below is derived
// from STAGE_SPEED, not hardcoded, so the two can't fall out of sync.
// Dialed back from an earlier 1.8/+200vh pass — applied identically
// across five pinned sections on the same pages, that compounded into
// a document roughly 40 screens tall and direct feedback the whole
// site's scrolling was unusable. The real fix for "no settle point" is
// stageOpacity's hold plateau, which is a fraction of whatever
// distance exists regardless of STAGE_SPEED — so a small multiplier
// plus a 1-screen tail buffer (was 2) keeps the same settle behavior
// without inflating total scroll distance.
const STAGE_SPEED = 1.15;
const STAGES = elements;

export function MeadowClosing() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const indexRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const closingRef = useRef<HTMLParagraphElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const lenis = useLenis();
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function update() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const scrollDistance = (STAGES.length - 1) * window.innerHeight * STAGE_SPEED;
      const raw = scrollDistance > 0 ? -rect.top / scrollDistance : 0;
      const clamped = Math.min(1, Math.max(0, raw));
      const progress = clamped * (STAGES.length - 1);
      const idx = Math.min(STAGES.length - 1, Math.round(progress));

      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }

      if (mediaRef.current) {
        mediaRef.current.style.transform = prefersReducedMotion
          ? "none"
          : `scale(${1 + clamped * 0.12})`;
      }

      if (overlayRef.current) {
        overlayRef.current.style.backgroundColor = blendHex(STAGES[idx].color, SOIL, 40);
      }

      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        const dist = progress - i;
        el.style.opacity = String(stageOpacity(progress, i));
        el.style.transform = `translateY(${dist * 26}px) scale(${1 - Math.min(0.08, Math.abs(dist) * 0.08)})`;
        if (i === STAGES.length - 1 && closingRef.current) {
          const closeT = Math.max(0, Math.min(1, 1 - Math.abs(dist) * 2.2));
          closingRef.current.style.opacity = String(closeT);
          closingRef.current.style.transform = `translateY(${(1 - closeT) * 14}px)`;
        }
      });

      indexRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.color = i === idx ? "#F4EFE6" : "rgba(244,239,230,0.35)";
      });
    }

    update();

    // Lenis doesn't exist at all under prefers-reduced-motion (see
    // SmoothScrollProvider) — without this fallback, update() would
    // only ever run once at mount, and the whole five-stage sequence
    // would stay frozen on whatever it computed then instead of
    // tracking the visitor's actual (still perfectly normal, native)
    // scroll as they move through the pinned section.
    if (lenis) {
      const unsubscribe = lenis.on("scroll", update);
      window.addEventListener("resize", update);
      return () => {
        unsubscribe();
        window.removeEventListener("resize", update);
      };
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [lenis, prefersReducedMotion]);

  return (
    <div ref={wrapperRef} className="relative bg-soil" style={{ height: `${(STAGES.length - 1) * 100 * STAGE_SPEED + 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* The former seven-second meadow loop visibly reset during this
            long pinned sequence. The photograph now responds to the same
            scroll, pointer, touch and focus language as the rest of the
            site, while reduced motion receives a completely still frame. */}
        <div
          ref={mediaRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: "center" }}
        >
          <LivingImage
            src="/images/pixabay-alpine-wildflowers-poster.jpg"
            sizes="100vw"
            imagePosition="center"
            intensity="hero"
          />
        </div>
        {/* Tint shifts to each stage's own element color as it becomes
            active (blendHex toward Soil, matching every other section
            wash on this site) — the color itself moves with scroll,
            not just the text sitting on top of it. */}
        <div
          ref={overlayRef}
          className="absolute inset-0 opacity-60 transition-colors duration-700"
          style={{ backgroundColor: SOIL }}
        />

        {/* Ghost watermark, same technique as the case-study block
            numerals and this page's own "WHY" watermark two sections
            up. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[clamp(4rem,22vw,16rem)] font-bold leading-none text-ivory/[0.06]"
        >
          ELEMENTS
        </span>

        {STAGES.map((stage, i) => (
          <div
            key={stage.slug}
            ref={(node) => {
              stageRefs.current[i] = node;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ opacity: i === 0 ? 1 : 0 }}
            aria-hidden={i !== activeIndex}
          >
            <p
              className="font-display text-[clamp(2.75rem,10vw,6.5rem)] font-normal leading-none"
              style={{ color: stage.color }}
            >
              {stage.name.split(" · ")[0]}
            </p>
            <p className="mt-6 max-w-lg font-display text-[clamp(1.15rem,2.6vw,1.65rem)] italic font-normal text-ivory">
              {stage.poetic}
            </p>
            {i === STAGES.length - 1 && (
              <p
                ref={closingRef}
                className="mt-10 max-w-md font-display text-[clamp(1.05rem,2.1vw,1.3rem)] font-normal text-ivory/85"
                /* Scroll reveals this line, so it starts hidden. Under
                   reduced motion that reveal never runs and the closing
                   sentence of the whole page stayed invisible, so it opens
                   already visible there instead. */
                style={{ opacity: prefersReducedMotion ? 1 : 0 }}
              >
                {CLOSING_LINE}
              </p>
            )}
          </div>
        ))}

        {/* Numbered index, same pattern as PinnedJourney's own. */}
        <div className="pointer-events-none absolute bottom-10 left-6 z-10 flex flex-wrap gap-x-6 gap-y-2 sm:left-16">
          {STAGES.map((stage, i) => (
            <span
              key={stage.slug}
              ref={(node) => {
                indexRefs.current[i] = node;
              }}
              className="font-body text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: i === 0 ? "#F4EFE6" : "rgba(244,239,230,0.35)" }}
            >
              {String(i + 1).padStart(2, "0")} {stage.name.split(" · ")[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
