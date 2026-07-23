"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "@/components/SmoothScrollProvider";
import { useLazyMount } from "@/hooks/useLazyMount";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { BREAK_OVERLAY_GRADIENT, toSvh } from "@/lib/media";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { ProcessSectionProps } from "./types";

type GlyphSlug = "earth" | "water" | "fire" | "air" | "space";

// The pinned/full-bleed sibling to VerticalJourney, same relationship
// ElementsSection already has between PinnedSlider and VerticalUnfold —
// see PinnedSlider's own comment for why this uses plain CSS
// `position: sticky` rather than a GSAP ScrollTrigger pin (a past
// version of this exact section lost real time to pin-desync bugs;
// sticky positioning can't fall out of sync with the wrapper's own
// height because it IS the wrapper's own layout).
//
// Used to reuse one shared backdrop across all six stages — direct
// feedback that the background should actually change with each stage,
// not just the foreground text. Each stage now gets its own short
// atmospheric loop (see data/process.ts), crossfaded with the exact same
// per-tick scroll math already driving the foreground text's opacity/
// drift, so background and foreground move together instead of the
// backdrop being a static layer underneath an animated one. Only the
// active stage's video actually plays — the rest stay paused — so six
// autoplaying loops don't all compete for the same GPU/decode budget at
// once.
export function PinnedJourney({ stages, elementColor }: ProcessSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const lenis = useLenis();

  const [mediaRef, shouldLoad] = useLazyMount();
  const prefersReducedMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState<boolean[]>(() => stages.map(() => false));

  // Only the active stage's video plays — every other one stays paused,
  // so switching stages is a play/pause swap rather than six loops
  // running simultaneously the whole time the section is pinned.
  useEffect(() => {
    if (prefersReducedMotion || !shouldLoad) return;
    videoRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === activeIndex) el.play().catch(() => {});
      else el.pause();
    });
  }, [activeIndex, shouldLoad, prefersReducedMotion]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function update() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      // Fixed distance, not rect.height - innerHeight — the wrapper is
      // deliberately taller than this (see the (stages.length + 1) * 100vh
      // below) so there's a dedicated buffer after the last stage becomes
      // fully active. Tying progress to the wrapper's own full height meant
      // progress=1 and the moment CSS sticky has to start releasing
      // (remaining wrapper height drops to exactly one viewport) landed on
      // the exact same scroll position — the last stage never got a stable
      // instant on screen, it started sliding away the moment it appeared.
      const scrollDistance = (stages.length - 1) * window.innerHeight;
      const raw = scrollDistance > 0 ? -rect.top / scrollDistance : 0;
      const clamped = Math.min(1, Math.max(0, raw));
      const progress = clamped * (stages.length - 1);
      const idx = Math.min(stages.length - 1, Math.round(progress));
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
      stageRefs.current.forEach((stageEl, i) => {
        if (!stageEl) return;
        const dist = progress - i;
        // Text opacity falls off steeper than the background crossfade
        // below (1.6x distance instead of 1x) — at the original 1:1
        // rate, two adjacent stages' text sat at ~50% opacity each
        // simultaneously right at the midpoint, and since each stage's
        // description is a different length, that read as a genuine
        // double-exposure glitch (one paragraph visibly overlapping
        // another) rather than a clean crossfade. Steeper falloff keeps
        // the transition smooth while shrinking that overlap window.
        stageEl.style.opacity = String(Math.max(0, 1 - Math.abs(dist) * 1.6));
        // Was opacity-only — the stage crossfaded in place with nothing
        // else tying it to scroll position, which read as a slideshow
        // rather than something actually driven by scroll. Distance from
        // the active stage now drives a drift + scale too, so a stage
        // visibly moves through the frame as you scroll rather than just
        // fading, still purely CSS transforms on the same per-tick
        // scroll value already computed above.
        const drift = dist * 28;
        const scale = 1 - Math.min(0.1, Math.abs(dist) * 0.1);
        stageEl.style.transform = `translateY(${drift}px) scale(${scale})`;
      });
      // Each stage's own backdrop crossfades on the exact same distance
      // value driving its text above — background and foreground change
      // together rather than the backdrop being a static layer underneath.
      bgRefs.current.forEach((bgEl, i) => {
        if (!bgEl) return;
        const dist = progress - i;
        bgEl.style.opacity = String(Math.max(0, 1 - Math.abs(dist)));
      });
      // The whole backdrop stack slowly pushes in across the section (not
      // per-stage) — a continuous "diving deeper" read as the six stages
      // advance, using the same clamped 0-1 progress already computed for
      // the sticky release buffer above.
      const media = mediaRef.current;
      if (media) media.style.transform = `scale(${1 + clamped * 0.07})`;
    }

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe?.();
      window.removeEventListener("resize", update);
    };
  }, [stages.length, lenis, mediaRef]);

  return (
    // +1 stage-height of buffer beyond what the crossfade math needs —
    // see update()'s own comment for why sticky needs dedicated room to
    // release in, separate from the last stage's own on-screen moment.
    // That release itself used to read as a hard cut to flat Soil once
    // the sticky child scrolled fully out of view — direct feedback
    // flagged this exact spot as a blank gap right before FAQ. A plain,
    // non-sticky water clip sits behind the whole wrapper now (not the
    // sticky child, which already has its own six videos) so the last
    // stretch of scroll reveals continuous motion instead of flat color
    // as the pinned content scrolls away above it.
    <div ref={wrapperRef} className="relative" style={{ height: toSvh(`${(stages.length + 1) * 100}vh`) }}>
      {/* -z-10 removed — same fix as VerticalJourney's own background
          layer: this section sits inside a bg-soil ancestor (Home
          page's Process section), and a negative z-index can escape
          into that ancestor's stacking context instead of staying
          behind just the sticky child below, painting this "release
          buffer" video underneath the ancestor's own solid fill —
          invisible despite rendering correctly in the DOM. Being first
          in the JSX, before the .sticky sibling, already puts it
          behind that sibling with the default z-index:auto — no
          negative value needed. */}
      <div className="absolute inset-0" aria-hidden="true">
        <BackgroundVideo video="/videos/higgsfield-element-water.mp4" poster="/images/higgsfield-element-water.jpg" />
        <div className="absolute inset-0 bg-soil/70" />
      </div>
      {/* bg-soil fallback + a hair of extra height beyond exactly
          100svh — real mobile browsers animate their toolbar in/out
          during an active scroll gesture, and svh's own recalculation
          isn't always perfectly synced to that animation frame-by-
          frame, which showed up as a thin strip of the wrapper's own
          (unrelated) water-clip backdrop peeking out beneath this
          sticky child mid-scroll. bg-soil means any such sliver reads
          as the section's own dark tone instead of a mismatched
          lighter color; the extra height means overflow-hidden clips
          any shortfall before it's ever visible at all. */}
      <div
        className="sticky top-0 w-full overflow-hidden bg-soil"
        style={{ height: "calc(100svh + 8px)" }}
      >
        <div ref={mediaRef} className="absolute inset-0" aria-hidden="true">
          {stages.map((stage, i) => (
            <div
              key={stage.stage}
              ref={(node) => {
                bgRefs.current[i] = node;
              }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {stage.poster && (
                <Image
                  src={stage.poster}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              )}
              {stage.video && shouldLoad && !prefersReducedMotion && (
                <video
                  ref={(node) => {
                    videoRefs.current[i] = node;
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                  style={{ opacity: videoReady[i] ? 1 : 0 }}
                  onCanPlay={() =>
                    setVideoReady((prev) => {
                      const next = [...prev];
                      next[i] = true;
                      return next;
                    })
                  }
                  src={stage.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              )}
            </div>
          ))}
          <div className="absolute inset-0" style={{ backgroundImage: BREAK_OVERLAY_GRADIENT }} />
        </div>

        {stages.map((stage, i) => {
          const color = elementColor[stage.element];
          return (
            <div
              key={stage.stage}
              ref={(node) => {
                stageRefs.current[i] = node;
              }}
              className="absolute inset-0 flex items-center px-6 sm:px-16 will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === activeIndex ? "auto" : "none" }}
              aria-hidden={i !== activeIndex}
            >
              <div className="max-w-xl">
                <div className="flex items-center gap-4">
                  <span
                    className="font-display text-[clamp(3.5rem,9vw,6.5rem)] font-normal leading-none opacity-40"
                    style={{ color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ElementGlyph
                    slug={stage.element.toLowerCase() as GlyphSlug}
                    className="h-10 w-10 opacity-90"
                    style={{ color }}
                  />
                </div>
                <p className="mt-4 font-display text-3xl font-normal text-ivory sm:text-4xl">{stage.stage}</p>
                <p className="mt-4 max-w-lg text-sm text-ivory/75 sm:text-base">{stage.description}</p>
              </div>
            </div>
          );
        })}

        {/* Numbered index, same pattern as PinnedSlider's own — six
            stages read comfortably on one line even at the sm breakpoint
            since stage names are short (Listen, Notice, Ground...). */}
        {/* right-6/right-16 added alongside left — this is absolutely
            positioned with no explicit width, and on a narrow phone
            viewport six wrapped stage labels need a real right-hand
            bound to reliably wrap instead of risking a shrink-to-fit
            width wider than the screen. */}
        <div className="pointer-events-none absolute bottom-6 left-6 right-6 z-10 flex flex-wrap gap-x-4 gap-y-2 sm:bottom-10 sm:left-16 sm:right-16 sm:gap-x-6">
          {stages.map((stage, i) => (
            <span
              key={stage.stage}
              className="font-body text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: i === activeIndex ? "#F4EFE6" : "rgba(244,239,230,0.4)" }}
            >
              {String(i + 1).padStart(2, "0")} {stage.stage}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
