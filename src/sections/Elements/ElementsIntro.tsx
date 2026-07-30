"use client";

import { useReducedMotion } from "framer-motion";
import { ElementsIntroPinned } from "./ElementsIntroPinned";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ElementsConstellation } from "@/components/ElementsConstellation";
import { MorphingGlyph } from "@/components/MorphingGlyph";
import { PerspectiveReveal } from "@/components/PerspectiveReveal";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/Container";
import { BREAK_OVERLAY_GRADIENT } from "@/lib/media";

// Same pinned/fallback split ElementsSection already established for its
// own PinnedSlider — desktop and motion-allowed only. Mobile and
// reduced-motion get the original two sections back exactly as they
// were before this pilot, in normal document flow, zero behavior
// change. See ElementsIntroPinned's own comment for why this pilot is
// scoped to just these two sections rather than the whole page.
export function ElementsIntro() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <ElementsIntroFallback />;
  }

  return (
    <>
      <div className="hidden sm:block">
        <ElementsIntroPinned />
      </div>
      <div className="sm:hidden">
        <ElementsIntroFallback />
      </div>
    </>
  );
}

function ElementsIntroFallback() {
  return (
    <>
      <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-24">
        <BackgroundVideo
          video="/videos/pixabay-misty-rain-valley.mp4"
          poster="/images/pixabay-misty-rain-valley-poster.jpg"
        />
        <div className="absolute inset-0" style={{ backgroundImage: BREAK_OVERLAY_GRADIENT }} />
        <div className="relative">
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
      </section>

      <section className="relative overflow-hidden pt-16 pb-28 sm:pt-20 sm:pb-40">
        <BackgroundVideo
          video="/videos/pixabay-kedarkantha-himalaya.mp4"
          poster="/images/pixabay-kedarkantha-himalaya-poster.jpg"
        />
        <div className="absolute inset-0 bg-soil/70" />
        <ElementsConstellation />
        <PerspectiveReveal>
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
        </PerspectiveReveal>
      </section>
    </>
  );
}
