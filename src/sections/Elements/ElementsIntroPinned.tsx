"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ElementsConstellation } from "@/components/ElementsConstellation";
import { MorphingGlyph } from "@/components/MorphingGlyph";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/Container";
import { BREAK_OVERLAY_GRADIENT } from "@/lib/media";
import { stageOpacity } from "@/lib/pinnedStageOpacity";

const STAGE_LABELS = ["One brand", "The elements"];

// Same STAGE_SPEED/HOLD pacing fix as PinnedSlider — direct, repeated
// feedback that pinned scrolling on the elements sections felt too
// fast to actually read. Wrapper height below is derived from
// STAGE_SPEED (not hardcoded) so the two stay in sync — a real bug in
// an earlier pass bumped STAGE_SPEED without updating the wrapper's
// own height, so the available pin-scroll room fell short of what the
// math needed and the last stage's hold never fully completed.
// Dialed back from an earlier 1.8/+200vh pass — applied identically
// across five pinned sections on the same pages, that compounded into
// a document roughly 40 screens tall and direct feedback the whole
// site's scrolling was unusable. The real fix for "no settle point" is
// stageOpacity's hold plateau, which is a fraction of whatever
// distance exists regardless of STAGE_SPEED — so a small multiplier
// plus a 1-screen tail buffer (was 2) keeps the same settle behavior
// without inflating total scroll distance.
const STAGE_SPEED = 1.15;

// Pilot: a pinned 2-stage cinematic intro merging two sections that used
// to scroll past independently (the "Five elements. One brand." text
// block and "The five elements" intro right before ElementsSection's own
// pinned slider) — direct feedback pointed at PinnedSlider's own Fire
// stage as the feeling to extend elsewhere on the page. Same mechanism
// as PinnedSlider/PinnedJourney/MeadowClosing: plain CSS position:
// sticky, progress derived from live getBoundingClientRect() on every
// scroll tick, no GSAP ScrollTrigger pin (see PinnedSlider's own comment
// for the pin-desync bugs that approach lost real time to previously on
// this exact site) and no WebGL (see MeadowClosing's own comment for the
// two WebGL attempts rejected as cartoonish before it existed).
//
// Deliberately scoped to just these two already-adjacent sections, not
// the whole page — see this session's own plan notes for why a full-page
// pin was assessed and set aside as too large a risk to attempt in one
// pass. This is the bounded pilot to gauge feel before deciding whether
// to extend further.
export function ElementsIntroPinned() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function update() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const scrollDistance = 1 * window.innerHeight * STAGE_SPEED;
      const raw = scrollDistance > 0 ? -rect.top / scrollDistance : 0;
      const clamped = Math.min(1, Math.max(0, raw));
      const progress = clamped;
      const idx = Math.min(1, Math.round(progress));
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
      stageRefs.current.forEach((stage, i) => {
        if (!stage) return;
        stage.style.opacity = String(stageOpacity(progress, i));
      });
      bgRefs.current.forEach((bg, i) => {
        if (!bg) return;
        bg.style.opacity = String(stageOpacity(progress, i));
      });
    }

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe?.();
      window.removeEventListener("resize", update);
    };
  }, [lenis]);

  function jumpTo(index: number) {
    const wrapper = wrapperRef.current;
    if (!wrapper || !lenis) return;
    const wrapperTop = window.scrollY + wrapper.getBoundingClientRect().top;
    lenis.scrollTo(wrapperTop + index * window.innerHeight * STAGE_SPEED, { duration: 1.1 });
  }

  return (
    // +1 stage-height of buffer beyond the 1-stage-height crossfade
    // range — same reasoning as PinnedSlider/PinnedJourney's own wrapper
    // math: sticky needs dedicated room to release in, separate from
    // the last stage's own on-screen moment, or it starts sliding away
    // the instant it finishes settling in.
    <div ref={wrapperRef} className="relative" style={{ height: `${100 * STAGE_SPEED + 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Stage 0 — "Five elements. One brand." */}
        <div
          ref={(node) => {
            bgRefs.current[0] = node;
          }}
          className="absolute inset-0"
          style={{ opacity: 1 }}
          aria-hidden="true"
        >
          <BackgroundVideo
            video="/videos/pixabay-refreshing-river.mp4"
            poster="/images/pixabay-refreshing-river-poster.jpg"
          />
          <div className="absolute inset-0" style={{ backgroundImage: BREAK_OVERLAY_GRADIENT }} />
        </div>
        <div
          ref={(node) => {
            stageRefs.current[0] = node;
          }}
          className="absolute inset-0 flex items-center"
          style={{ opacity: 1, pointerEvents: activeIndex === 0 ? "auto" : "none" }}
          aria-hidden={activeIndex !== 0}
        >
          <Container className="relative">
            <div className="grid gap-8 sm:grid-cols-2 sm:items-start sm:gap-16">
              <Reveal className="sm:order-2">
                <h2
                  className="font-display text-[clamp(2rem,5vw,3.75rem)] font-normal leading-[1.1] text-ivory sm:text-right"
                  style={{ textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}
                >
                  Five elements.
                  <br />
                  One brand.
                </h2>
              </Reveal>
              <Reveal delay={0.15} className="sm:order-1">
                <div className="max-w-md space-y-4 text-ivory/85" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                  <p>
                    A brand is every small decision that tells someone
                    whether they can trust you. What you stand on. How
                    you show up for them. What earns a second look.
                    What you say when it matters. Whether you&apos;re
                    still there once the excitement fades.
                  </p>
                  <p>
                    Most businesses get one or two of these right,
                    usually by accident. The ones people actually
                    remember get all five right, on purpose. That&apos;s{" "}
                    <span className="font-medium text-ivory">
                      the method behind every project below, and the
                      one I&apos;d use on yours
                    </span>
                    .
                  </p>
                </div>
              </Reveal>
            </div>
          </Container>
        </div>

        {/* Stage 1 — "The five elements" */}
        <div
          ref={(node) => {
            bgRefs.current[1] = node;
          }}
          className="absolute inset-0"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <BackgroundVideo
            video="/videos/pixabay-kashmir-valley.mp4"
            poster="/images/pixabay-kashmir-valley-poster.jpg"
          />
          <div className="absolute inset-0 bg-soil/70" />
          <ElementsConstellation />
        </div>
        <div
          ref={(node) => {
            stageRefs.current[1] = node;
          }}
          className="absolute inset-0 flex items-center"
          style={{ opacity: 0, pointerEvents: activeIndex === 1 ? "auto" : "none" }}
          aria-hidden={activeIndex !== 1}
        >
          <Container className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-none text-ivory/[0.1] sm:-top-8"
            >
              ELEMENTS
            </span>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <Reveal>
                <h2 className="relative text-display-sm font-display font-normal text-ivory">
                  The five elements
                </h2>
                <p className="mt-3 max-w-md text-sm text-ivory/70">
                  Every project moves through some version of all five, in
                  this order. Here&apos;s what each one actually covers, and
                  what it looks like when it&apos;s missing.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="shrink-0 opacity-90">
                <MorphingGlyph size={104} />
              </Reveal>
            </div>
          </Container>
        </div>

        {/* Numbered index, same visual language as PinnedSlider's own —
            but a real jump-to-stage control here, not decorative. */}
        <div className="pointer-events-auto absolute bottom-10 left-6 z-10 flex gap-6 sm:left-16">
          {STAGE_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => jumpTo(i)}
              className="font-body text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: i === activeIndex ? "#F4EFE6" : "rgba(244,239,230,0.4)" }}
            >
              {String(i + 1).padStart(2, "0")} {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
