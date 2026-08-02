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
import { ELEMENT_HEX, MOOD } from "@/lib/sectionWash";
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
    // Mobile / reduced-motion / pre-hydration fallback — the exact same
    // five layers, stacked in normal document flow, no pin.
    //
    // The wrapper is no longer `sm:hidden`: this branch is also what
    // the SERVER renders (useMediaQuery only flips true after
    // hydration), and hiding it at desktop widths meant desktop
    // visitors got zero Authority section in the server HTML — then a
    // full-viewport pinned section popped into existence at hydration,
    // shifting every section below it by ~100vh. A Lighthouse trace
    // measured that single insertion as a 0.21+ CLS, the whole page's
    // worth. (Slow eager video preloading used to push hydration past
    // the trace window, which is why the score only surfaced after the
    // perf round sped loading up — the shift itself was always there.)
    // It also meant desktop reduced-motion visitors permanently saw
    // nothing here at all. min-h-screen at sm+ reserves exactly the
    // height the pinned branch occupies, so the hydration swap is
    // height-neutral and shifts nothing.
    return (
      <section className="relative flex flex-col justify-center overflow-hidden py-16 sm:min-h-screen" style={{ backgroundColor: MOOD.charcoal }}>
        <Image
          src="/images/higgsfield-mountain-mist-poster.jpg"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="opacity-30"
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(23,24,26,0.7)" }} />
        <Container className="relative">
          <p className="hidden text-sm font-medium uppercase tracking-wide text-ivory/70 sm:block">Authority</p>
          <h2 className="hidden max-w-xl text-display-sm font-display font-normal text-ivory sm:mt-2 sm:block">
            Marketing amplifies whatever is already there.
          </h2>
          <div className="space-y-8 sm:mt-10 sm:space-y-6">
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
    // Mood: CHARCOAL — neutral-cool architectural dark (see MOOD in
    // sectionWash.ts); the warm soil base + soil overlay here were the
    // page's second-largest amber contributor after the shared veil.
    <div ref={sectionRef} className="relative hidden h-screen overflow-hidden sm:block" style={{ backgroundColor: MOOD.charcoal }}>
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
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(23,24,26,0.6)" }} />
      <AmbientElementShader opacity={0.3} />
      {/* Direct, repeated feedback (two screenshots) that this pinned
          frame read as a narrow content strip with empty video on both
          sides on a real wide display, and that the stacked
          heading-above-layers arrangement overflowed the frame's own
          height (the heading visibly scrolled out of the top mid-pin).
          A first attempt answered it with a decorative watermark —
          wrong diagnosis. The actual fix is the layout: the frame is
          now a real two-column composition on its own wider grid (the
          site's max-w-6xl Container is deliberately not used here — a
          full-viewport cinematic frame earns a wider stage), heading
          and closing line locked in the left column, the five layers
          building in the right, both vertically centered. Total column
          height now fits inside h-screen at every common desktop
          height, so nothing gets clipped mid-pin. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[clamp(4rem,13vw,11rem)] font-bold uppercase leading-none text-ivory/[0.04] lg:block"
      >
        Build
      </span>
      <div className="relative mx-auto flex h-full w-full max-w-[100rem] flex-col justify-center px-6 sm:px-10 lg:px-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">Authority</p>
            <h2 className="mt-2 text-display-sm font-display font-normal text-ivory lg:text-display-md">
              Marketing amplifies whatever is already there.
            </h2>
            <p className="mt-8 max-w-md text-sm italic text-ivory/80 lg:text-base">
              Skip one layer, and marketing amplifies the gap instead of the position.
            </p>
          </div>
          {/* The GSAP scrub timeline targets these exact ref nodes by
              index — DOM structure and ref wiring unchanged from the
              working version, only the surrounding layout moved. */}
          <div className="relative">
            {LAYERS.map((layer, i) => (
              <div
                key={layer.slug}
                ref={(node) => {
                  layerRefs.current[i] = node;
                }}
                // Micro-motion (Phase 2): hovering a layer nudges it
                // forward and brightens its divider — inspecting one
                // stratum of the build. Deliberately the ONLY motion
                // added to this section: the scrub assembly is its
                // primary motion, and anything running alongside it
                // would compete rather than support.
                className="group/layer flex items-start gap-6 border-b border-ivory/10 py-4 opacity-0 transition-[border-color,transform] duration-300 last:border-b-0 hover:translate-x-1.5 hover:border-ivory/30 xl:py-5"
                style={{ marginLeft: `${i * 18}px` }}
              >
                <span
                  className="font-display text-3xl font-normal leading-none opacity-40 xl:text-4xl"
                  style={{ color: layer.color }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-start gap-4 pt-1">
                  <ElementGlyph slug={layer.slug} className="mt-1 h-6 w-6 shrink-0" style={{ color: layer.color }} />
                  <div>
                    <p className="font-display text-2xl font-normal text-ivory xl:text-3xl">{layer.label}</p>
                    <p className="mt-1 max-w-lg text-sm text-ivory/80 xl:text-base">{layer.line}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
