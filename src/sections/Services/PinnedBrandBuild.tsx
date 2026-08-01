"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ELEMENT_HEX } from "@/lib/sectionWash";
import { elements } from "@/data/elements";
import { AmbientElementShader } from "@/components/AmbientElementShader";

gsap.registerPlugin(ScrollTrigger);

// The one deliberate ScrollTrigger.pin on the site. Every other pinned
// section (PinnedSlider, PinnedJourney, SelectedWorkPinned, PinnedHold)
// runs on plain CSS position: sticky, rebuilt that way after real,
// repeated pin-desync bugs (see CLAUDE.md and this file's own history:
// git log "Revert Lenis + GSAP ScrollTrigger integration"). This one
// section is the exception, and on purpose: it needs five independent
// layers accumulating on top of each other while a single scrubbed
// GSAP timeline keeps their entrances relative to one another exactly
// in sync with scroll position — a genuinely different job than
// crossfading between discrete stages, which sticky + manual rect-top
// math already does well elsewhere on this site.
//
// Guards applied specifically against the two documented failure
// classes:
// - invalidateOnRefresh: true — recomputes the pin/scrub range from
//   live DOM on every ScrollTrigger.refresh() (SmoothScrollProvider
//   already calls this on window load, document.fonts.ready, and
//   visibilitychange) instead of trusting a cached start/end captured
//   before images/fonts settled.
// - anticipatePin: 1 — removes the one-frame jump at pin start.
// - pinSpacing left at its default (true) — ScrollTrigger owns the
//   compensating space itself rather than a manually-sized wrapper.
// - Wrapped in gsap.context(), reverted on unmount — matters under App
//   Router client navigation, where this can unmount without a full
//   page reload and would otherwise leave an orphaned pin spacer.
// - Scoped to exactly this one section, desktop/motion-allowed only
//   (useMediaQuery, not a CSS hidden/sm:block split — a pin registered
//   against a hidden 0-height element would compute a broken range).
const LAYERS = elements.map((el) => ({
  slug: el.slug,
  label: el.name.split("·")[1]?.trim() ?? el.name,
  line: el.manifesto[0],
  color: ELEMENT_HEX[el.slug],
}));

export function PinnedBrandBuild() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const runPinned = isDesktop && !prefersReducedMotion;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !runPinned) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (LAYERS.length - 1) * 0.9}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      layerRefs.current.forEach((layer, i) => {
        if (!layer) return;
        tl.fromTo(
          layer,
          { opacity: 0, y: 36, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
          i * 0.85
        );
      });
    }, section);

    return () => ctx.revert();
  }, [runPinned]);

  if (!runPinned) {
    // Mobile / reduced-motion fallback — the exact same five layers,
    // stacked in normal document flow with a plain per-item reveal
    // instead of scroll-scrubbed, no pin at all.
    return (
      <section className="relative overflow-hidden bg-soil py-16 sm:hidden">
        <Image
          src="/images/higgsfield-mountain-mist-poster.jpg"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="opacity-30"
        />
        <div className="absolute inset-0 bg-soil/70" />
        <Container className="relative">
          <div className="space-y-8">
            {LAYERS.map((layer, i) => (
              <div key={layer.slug} className="flex items-start gap-4">
                <span
                  className="font-display text-2xl font-normal opacity-50"
                  style={{ color: layer.color }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <ElementGlyph slug={layer.slug} className="h-4 w-4" style={{ color: layer.color }} />
                    <p className="font-display text-lg font-normal text-ivory">{layer.label}</p>
                  </div>
                  <p className="mt-1 text-sm text-ivory/80">{layer.line}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <div ref={sectionRef} className="relative hidden h-screen overflow-hidden bg-soil sm:block">
      {/* Direct feedback that this section read as flat and motionless —
          the shader alone (opacity 0.22) is too subtle as the section's
          only source of visible movement while the five layers are
          still building. Mist slowly clearing over a ridge doubles as a
          literal echo of the section's own line ("marketing amplifies
          whatever is already there") — the shape is already there
          underneath, becoming visible. Shared with PerceptionLadder's
          own AmbientElementShader right after it, so both "Authority"
          and "Education" keep reading as one continuous visual system. */}
      <BackgroundVideo video="/videos/higgsfield-mountain-mist.mp4" poster="/images/higgsfield-mountain-mist-poster.jpg" />
      <div className="absolute inset-0 bg-soil/55" />
      <AmbientElementShader opacity={0.3} />
      {/* Direct feedback (screenshot) that the content sat in a narrow
          left column while most of the section's real width, on any
          wide screen, was just empty video with nothing placed on it —
          "the biggest issue." Same ghost watermark technique this site
          already proves on the hero/FAQ/deliverables sections, sized to
          actually occupy the right side rather than leaving it blank. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 select-none whitespace-nowrap font-display text-[clamp(4rem,13vw,11rem)] font-bold uppercase leading-none text-ivory/[0.05] lg:block"
      >
        Build
      </span>
      <Container className="relative flex h-full flex-col justify-center">
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Authority</p>
        <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
          Marketing amplifies whatever is already there.
        </h2>
        {/* Typography/spacing pass only — the GSAP scrub timeline below
            targets these exact ref nodes by index, so the DOM structure
            and ref wiring stay untouched; only the visual treatment of
            each layer changes. Was a plain left-border row with a small
            icon and tight type — reads more like a museum wall plate
            now: a real ghost numeral, a wider gap, and a hairline
            divider closing each entry instead of a colored bar doing
            all the work alone. */}
        <div className="relative mt-14 max-w-3xl">
          {LAYERS.map((layer, i) => (
            <div
              key={layer.slug}
              ref={(node) => {
                layerRefs.current[i] = node;
              }}
              className="flex items-start gap-6 border-b border-ivory/10 py-5 opacity-0 last:border-b-0"
              style={{ marginLeft: `${i * 18}px` }}
            >
              <span
                className="font-display text-3xl font-normal leading-none opacity-40 sm:text-4xl"
                style={{ color: layer.color }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-start gap-4 pt-1">
                <ElementGlyph slug={layer.slug} className="mt-1 h-6 w-6 shrink-0" style={{ color: layer.color }} />
                <div>
                  <p className="font-display text-2xl font-normal text-ivory sm:text-3xl">{layer.label}</p>
                  <p className="mt-1.5 max-w-md text-sm text-ivory/80 sm:text-base">{layer.line}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-md text-sm italic text-ivory/80">
          Skip one layer, and marketing amplifies the gap instead of the position.
        </p>
      </Container>
    </div>
  );
}
