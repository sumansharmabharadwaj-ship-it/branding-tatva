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
}: {
  eyebrow: string;
  headline: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  video: string;
  poster: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative grid min-h-screen bg-soil sm:grid-cols-2">
      <div className="relative flex flex-col justify-center px-6 py-28 sm:px-10 sm:py-24 lg:px-16">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
            {eyebrow}
          </span>
          <SplitReveal
            as="h1"
            className="mt-6 max-w-lg font-display text-[clamp(2rem,4.2vw,3.25rem)] font-normal leading-[1.12] text-ivory"
          >
            {headline}
          </SplitReveal>
          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-ivory/65 sm:text-lg">{body}</p>
          <div className="mt-9">
            <LinkButton href={ctaHref}>{ctaLabel}</LinkButton>
          </div>
        </Reveal>
      </div>

      <div className="relative h-[56vh] overflow-hidden sm:h-auto">
        {prefersReducedMotion ? (
          <Image src={poster} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
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
