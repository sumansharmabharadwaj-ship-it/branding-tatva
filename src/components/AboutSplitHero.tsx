"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { LinkButton } from "@/components/Button";
import { ScrollCue } from "@/components/ScrollCue";

// Collage hero, not a full-bleed banner or a 50/50 split: a full-bleed
// nature backdrop with two small physical-feeling cards floating
// centered on top of it — a "postcard" carrying the headline, and a
// bordered photo/video card carrying Suman's own footage with a
// caption overlay, slightly rotated like something actually pinned to
// a corkboard. Direct reference: a set of Pinterest pins showing this
// exact pattern (a postage-stamp/postcard-style card centered on a
// full-bleed landscape photo) — both cards get their own natural
// aspect ratio instead of forcing her portrait video to cover an
// arbitrary banner shape, which is what every earlier full-bleed and
// split-panel attempt at this hero kept fighting.
export function AboutSplitHero({
  eyebrow,
  headline,
  body,
  ctaHref,
  ctaLabel,
  video,
  poster,
  bgVideo,
  bgPoster,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  video: string;
  poster: string;
  bgVideo: string;
  bgPoster: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-soil">
      {prefersReducedMotion ? (
        <Image src={bgPoster} alt="" fill priority sizes="100vw" className="object-cover" />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={bgVideo}
          poster={bgPoster}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(39,34,30,0.72) 0%, rgba(39,34,30,0.4) 55%, rgba(39,34,30,0.62) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 py-28 text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
            {eyebrow}
          </span>

          {/* The postcard — carries the headline, tilted a touch as
              though it's been set down rather than laid out on a grid. */}
          <div className="relative z-20 mx-auto mt-6 max-w-[19rem] -rotate-1 rounded-md bg-ivory px-6 py-6 shadow-elevation-lg sm:max-w-sm sm:px-8 sm:py-7">
            <SplitReveal
              as="h1"
              className="font-display text-[clamp(1.35rem,3.6vw,2.1rem)] font-normal leading-[1.2] text-soil"
            >
              {headline}
            </SplitReveal>
          </div>
        </Reveal>

        {/* The photo card — her own footage, bordered like a printed
            photograph, overlapping the postcard's bottom edge and
            tilted the opposite way for that "two things set down, not
            designed" feeling the references share. */}
        <Reveal delay={0.12} className="relative z-10 -mt-4">
          <div className="relative w-[230px] rotate-1 overflow-hidden rounded-lg border-[6px] border-ivory shadow-elevation-lg sm:w-[280px]">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              {prefersReducedMotion ? (
                <Image src={poster} alt="" fill sizes="280px" className="object-cover" />
              ) : (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={video}
                  poster={poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              <div
                className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-8"
                style={{ backgroundImage: "linear-gradient(0deg, rgba(20,17,14,0.75) 0%, rgba(20,17,14,0) 100%)" }}
              >
                <p className="font-body text-[0.65rem] uppercase tracking-[0.18em] text-ivory/90">{body}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.22} className="mt-9">
          <LinkButton href={ctaHref}>{ctaLabel}</LinkButton>
        </Reveal>
      </div>

      <ScrollCue />
    </section>
  );
}
