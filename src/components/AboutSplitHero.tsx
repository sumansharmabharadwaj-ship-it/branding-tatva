"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { LinkButton } from "@/components/Button";
import { TiltCard } from "@/components/TiltCard";
import { Fireflies } from "@/components/Fireflies";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";

const ABOUT_HERO_VIDEO_GROUP = "about-hero";

// Full-bleed nature backdrop with a single framed photo/video card
// floating centered on it, the headline carried directly on the card
// rather than in a second separate box. Earlier rounds stacked a
// postcard on top of the photo card — direct feedback that two boxes
// read as cluttered and neither felt considered on its own. One object
// instead: full context of her own footage, a real border, one strong
// headline. Kept from the collage direction: the full-bleed backdrop
// (never rejected on its own), the scroll-linked parallax, and a slow
// independent float so the card feels alive at rest, not just on
// scroll — all dialed back from the last pass rather than removed
// outright, since the clutter came from stacking effects, not from any
// one of them alone.
export function AboutSplitHero({
  eyebrow,
  headline,
  body,
  ctaHref,
  ctaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
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
  // Optional second action — the redesign brief wants the authority
  // hero to carry both the booking path and the work path.
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  video: string;
  poster: string;
  bgVideo: string;
  bgPoster: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const portraitVideoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const heroInView = useInView(ref, { amount: 0.05, margin: "12% 0px 12% 0px" });
  // Keep the same scroll geometry while avoiding Framer Motion's native
  // ViewTimeline cache, which strongly retains unmounted target elements.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0%", "end 0%"] });

  useVideoFadeIn(backgroundVideoRef, !prefersReducedMotion);
  useVideoFadeIn(portraitVideoRef, !prefersReducedMotion);

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-soil pt-24"
      data-about-hero-active={heroInView}
    >
      {prefersReducedMotion ? (
        <Image src={bgPoster} alt="" fill priority sizes="100vw" className="object-cover" />
      ) : (
        <motion.div className="absolute inset-0 top-[-10%] h-[120%] w-full" style={{ y: bgY }}>
          <video
            ref={backgroundVideoRef}
            className="h-full w-full object-cover"
            src={bgVideo}
            poster={bgPoster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            data-video-warden-group={ABOUT_HERO_VIDEO_GROUP}
          />
        </motion.div>
      )}

      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span className="hero-fog" style={{ left: "-10%", top: "40%", width: "50vw", height: "50vw", animationDuration: "30s" }} />
          <span className="hero-fog" style={{ right: "-15%", top: "5%", width: "40vw", height: "40vw", animationDuration: "34s", animationDelay: "-10s" }} />
        </div>
      )}
      <Fireflies />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 85% 68% at 50% 42%, rgba(39,34,30,0.18) 0%, rgba(39,34,30,0.04) 56%, rgba(39,34,30,0.24) 100%)",
        }}
      />

      <motion.div
        className="relative -top-20 z-10 flex flex-col items-center px-6 py-16 text-center sm:top-0 sm:py-24"
        style={prefersReducedMotion ? undefined : { opacity: contentOpacity }}
      >
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
            {eyebrow}
          </span>
        </Reveal>

        {/* One card: her own footage, bordered like a printed
            photograph, with the headline carried directly on it — the
            section's single focal object instead of two competing
            boxes. Arrives with real weight (spring scale-up, not just a
            fade) and responds to the cursor with the same 3D tilt
            TiltCard already gives every other card on the site, so the
            "wow" comes from motion quality and a real interaction, not
            from stacking on more decoration. */}
        <div className="relative z-10 mt-6" style={{ perspective: 1200 }}>
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            <TiltCard glowColor="#C28A28" maxDegrees={7}>
              <motion.div
                className="card-float relative w-[260px] overflow-hidden rounded-2xl border-[6px] border-ivory sm:w-[320px]"
                style={{
                  ...(prefersReducedMotion ? undefined : { y: cardY }),
                  boxShadow: "0 14px 30px rgba(20,17,14,0.4), 0 0 40px 6px rgba(20,17,14,0.2)",
                }}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  {prefersReducedMotion ? (
                    <Image src={poster} alt="" fill sizes="320px" className="object-cover" />
                  ) : (
                    <video
                      ref={portraitVideoRef}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={video}
                      poster={poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      aria-hidden="true"
                      data-video-warden-group={ABOUT_HERO_VIDEO_GROUP}
                    />
                  )}
                  <div
                    className="absolute inset-x-0 top-0 px-5 pb-10 pt-5"
                    // Autopilot audit: text sits at the 0% stop (the
                    // strongest point) of this gradient, which was 0.7 —
                    // under the site's normalized bg-soil/80 contrast
                    // floor. Bumped to match.
                    style={{ backgroundImage: "linear-gradient(180deg, rgba(20,17,14,0.9) 0%, rgba(20,17,14,0.08) 78%, rgba(20,17,14,0) 100%)" }}
                  >
                    <SplitReveal
                      as="h1"
                      className="font-display text-[clamp(1.15rem,3.6vw,1.6rem)] font-normal leading-[1.25] text-ivory [text-shadow:0_2px_14px_rgba(0,0,0,0.72)]"
                    >
                      {headline}
                    </SplitReveal>
                  </div>
                  <div
                    className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-10"
                    style={{ backgroundImage: "linear-gradient(0deg, rgba(20,17,14,0.9) 0%, rgba(20,17,14,0.06) 82%, rgba(20,17,14,0) 100%)" }}
                  >
                    <p className="font-body text-[0.65rem] uppercase tracking-[0.18em] text-ivory/90">{body}</p>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          </motion.div>
        </div>

        <Reveal delay={0.2} className="mt-9">
          <div className="flex flex-wrap gap-3">
            <LinkButton href={ctaHref} trackEvent="hero_booking_click" trackProps={{ page: "about" }}>
              {ctaLabel}
            </LinkButton>
            {secondaryCtaHref && secondaryCtaLabel && (
              <LinkButton href={secondaryCtaHref} variant="secondary" className="border-ivory/40 text-ivory hover:bg-ivory/10">
                {secondaryCtaLabel}
              </LinkButton>
            )}
          </div>
        </Reveal>
      </motion.div>

    </section>
  );
}
