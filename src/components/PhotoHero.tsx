"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { kenBurnsAnimation } from "@/animations/kenBurns";
import { toSvh } from "@/lib/media";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";

const KEN_BURNS = kenBurnsAnimation({ scale: 1.07, duration: 22 });

// Full-bleed hero, the structure used across every reference site
// (Nevada House, Haven, Sylvan): a real photo or video fills the
// section, a dark gradient keeps text legible, content sits on top.
// Height varies by page: tall on the homepage, shorter elsewhere so
// secondary pages get to their content faster. When only a still image
// is given, it holds a slow continuous Ken Burns drift so it's never
// sitting completely still; a video background moves on its own.
//
// Height is a deliberate four-tier system across the site, not one
// value standardized everywhere or an accident of each page being
// built separately — the variation itself is what signals hierarchy:
//   Tier 1 — Signature   Home            100svh (CinematicHero, not this component)
//   Tier 2 — Personal    About           100vh  (AboutSplitHero, not this component)
//   Tier 3 — Mid         Services, Work, Contact   minHeight="70vh"
//   Tier 4 — Shorter     Blog            minHeight="60vh"
// Home and About use their own bespoke hero components (a full-viewport
// video takeover, and a split video/floating-cards layout) rather than
// this one — they're listed here anyway so the tier table stays
// complete in one place instead of split across files. A new page's
// hero height should be picked from this table, not invented fresh.

// Site-wide contrast audit found this top stop (0.55, sitting directly
// behind every page's badge + headline) well under the bg-soil/80
// standard the rest of the site was just normalized to. Raised across
// all three stops rather than just the top one, so the whole gradient
// stays above that floor instead of dipping mid-scroll.
const gradient =
  "linear-gradient(180deg, rgba(39,34,30,0.8) 0%, rgba(39,34,30,0.86) 60%, rgba(39,34,30,0.94) 100%)";

export function PhotoHero({
  children,
  image,
  video,
  videoMobile,
  poster,
  minHeight = "60vh",
  imagePosition = "center",
  className,
  accentColor,
  overlayGradient = gradient,
  playbackRate = 1,
}: {
  children?: React.ReactNode;
  image?: string;
  video?: string;
  videoMobile?: string;
  poster?: string;
  minHeight?: string;
  imagePosition?: string;
  className?: string;
  accentColor?: string;
  overlayGradient?: string;
  playbackRate?: number;
}) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoFadeIn(videoRef, Boolean(video) && !prefersReducedMotion);

  // Keep ambient films inside a calm range. The Services hero opts into
  // 1.15x so its defining visual event arrives before attention drifts,
  // while every existing call site retains the native 1x pace.
  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    const safePlaybackRate = Math.min(1.5, Math.max(0.75, playbackRate));
    element.defaultPlaybackRate = safePlaybackRate;
    element.playbackRate = safePlaybackRate;
  }, [playbackRate, video]);

  // A case study's hero footage is industry-specific (an office, a
  // warehouse) rather than generic nature photography, so an
  // accentColor tints it toward that project's own element color
  // instead of replacing it outright.
  const accentWash = accentColor ? (
    <div className="absolute inset-0" style={{ backgroundColor: accentColor, opacity: 0.16, mixBlendMode: "multiply" }} />
  ) : null;

  return (
    <section
      className={`relative flex items-center overflow-hidden bg-soil ${className ?? ""}`}
      style={{ minHeight: toSvh(minHeight) }}
    >
      {video && !prefersReducedMotion ? (
        <>
          {/* A next/image base layer instead of relying solely on the
              <video poster> attribute — that's a native browser fetch
              outside Next's own image-optimization/priority pipeline,
              so on a slow mobile connection the banner's real photo
              could show up later than it needs to. priority guarantees
              it's requested immediately, same reasoning as the Ken
              Burns branch below; the video fades in once it actually
              has a playable frame instead of being the only thing
              between the poster and true motion. */}
          <Image
            src={poster ?? ""}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: imagePosition }}
          />
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
            style={{ objectPosition: imagePosition }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            {videoMobile && <source src={videoMobile} media="(max-width: 767px)" type="video/mp4" />}
            <source src={video} type="video/mp4" />
          </video>
          {accentWash}
          <div className="absolute inset-0" style={{ backgroundImage: overlayGradient }} />
        </>
      ) : (
        <motion.div
          className="absolute inset-0"
          initial={KEN_BURNS.initial}
          animate={prefersReducedMotion ? undefined : KEN_BURNS.animate}
          transition={KEN_BURNS.transition}
        >
          <Image
            src={poster ?? image ?? ""}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: imagePosition }}
          />
          {accentWash}
          <div className="absolute inset-0" style={{ backgroundImage: overlayGradient }} />
        </motion.div>
      )}
      {children}
    </section>
  );
}
