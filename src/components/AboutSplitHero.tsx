"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { LinkButton } from "@/components/Button";
import { ScrollCue } from "@/components/ScrollCue";

// Split-panel hero, not a full-bleed banner: the earlier version forced
// Suman's own vertical trip footage to cover a ~2:1 wide banner, which
// meant either an extreme crop (just eyes, no context) or heavy
// pillarboxing. A tall, roughly half-width media column is a natural
// aspect fit for portrait phone footage instead of a workaround for a
// mismatch — direct reference: atrangiworks.com/about-us's mission
// split (bold statement + short line on a dark panel, photo filling
// the other half edge to edge).
export function AboutSplitHero({
  eyebrow,
  headline,
  body,
  ctaHref,
  ctaLabel,
  video,
  poster,
  leftVideo,
  leftPoster,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  video: string;
  poster: string;
  leftVideo: string;
  leftPoster: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative grid min-h-screen grid-cols-2 bg-soil">
      <div className="relative flex flex-col justify-center overflow-hidden px-3 py-16 sm:px-10 sm:py-24 lg:px-16">
        {prefersReducedMotion ? (
          <Image src={leftPoster} alt="" fill sizes="50vw" className="object-cover" />
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={leftVideo}
            poster={leftPoster}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(39,34,30,0.68) 0%, rgba(39,34,30,0.58) 45%, rgba(39,34,30,0.72) 100%)" }}
        />
        <Reveal className="relative z-10">
          <span
            className="inline-flex items-center rounded-full border border-ivory/30 px-2 py-1 text-[0.5rem] font-medium uppercase tracking-[0.15em] text-ivory/85 sm:px-4 sm:py-1.5 sm:text-[0.65rem] sm:tracking-[0.25em]"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
          >
            {eyebrow}
          </span>
          <SplitReveal
            as="h1"
            className="mt-4 max-w-lg font-display text-[clamp(1.15rem,4.6vw,3.25rem)] font-normal leading-[1.15] text-ivory [text-shadow:0_2px_16px_rgba(0,0,0,0.65)] sm:mt-6"
          >
            {headline}
          </SplitReveal>
          <p
            className="mt-3 max-w-md font-body text-[0.75rem] leading-relaxed text-ivory/80 sm:mt-6 sm:text-base lg:text-lg"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
          >
            {body}
          </p>
          <div className="mt-5 sm:mt-9">
            <LinkButton href={ctaHref} className="px-3 py-2 text-[0.7rem] sm:px-6 sm:py-3 sm:text-sm">
              {ctaLabel}
            </LinkButton>
          </div>
        </Reveal>
      </div>

      <div className="relative overflow-hidden">
        {prefersReducedMotion ? (
          <Image src={poster} alt="" fill sizes="50vw" className="object-cover" />
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
          className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(0deg, rgba(39,34,30,0.35) 0%, rgba(39,34,30,0) 30%)" }}
        />
      </div>
      <ScrollCue />
    </section>
  );
}
