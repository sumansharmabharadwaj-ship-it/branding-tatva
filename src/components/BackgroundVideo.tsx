"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";
import { LivingImage } from "@/components/LivingImage";
import { usesLivingStill } from "@/lib/mediaMode";

function ParallaxLayer({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div
      ref={wrapRef}
      data-background-video-stage="true"
      className="absolute inset-0 overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ y, scale: 1.13 }}>
        {children}
      </motion.div>
    </div>
  );
}

// A bare video-with-poster-fallback fill layer, for sections that already
// build their own overlay/content on top rather than wrapping in
// PhotoHero/VideoBreak's own layout and gradient conventions (e.g. the
// homepage FAQ section, which needs a light custom overlay instead of
// either component's fixed dark gradient).

export function BackgroundVideo({
  video,
  videoMobile,
  videoWebm,
  poster,
  imagePosition = "center",
  parallax = false,
  push = false,
  loop = true,
  playbackRate = 1,
  posterPriority = false,
  managedByHomepage = false,
}: {
  video: string;
  // Optional lower-bandwidth MP4 selected by the browser on phones.
  videoMobile?: string;
  // Optional WebM sibling, tried first via a real <source> list — same
  // additive pattern TexturedDark established (see its own comment).
  // `video` alone keeps working exactly as before for every existing
  // MP4-only call site.
  videoWebm?: string;
  poster: string;
  imagePosition?: string;
  // Opt-in camera drift: the footage scales slightly past the frame and
  // travels against scroll, so the scene reads as a camera moving
  // through an environment rather than a fixed backdrop pinned to its
  // section — the Services page's scroll-choreography device. Off by
  // default so every existing call site (Home, SelectedWorkPinned)
  // renders exactly as before. Transform-only, overscan (1.13) always
  // exceeds the ±6% travel so edges never show.
  parallax?: boolean;
  // Opt-in slow push-in for clips whose own camera is locked off (macro
  // timelapses like the bloom and the leaf): a 55s ease-in-out breathe
  // between 1.04x and 1.14x (bg-slow-push in globals.css) so the frame
  // reads as a documentary camera drifting closer, never a static
  // wallpaper. Disabled automatically under prefers-reduced-motion by
  // the sitewide animation kill rule.
  push?: boolean;
  // Most ambient scenes repeat. Closing scenes can opt out so their final
  // frame becomes a still hold instead of exposing the loop boundary.
  loop?: boolean;
  // An opt-in pace adjustment for generated or unusually slow ambient
  // clips. Existing sections remain at their encoded 1x speed.
  playbackRate?: number;
  // Reduced-motion visitors receive the poster instead of video. Keep eager
  // loading opt-in so a long page's offscreen scenes never compete with its
  // LCP image; first-frame heroes declare posterPriority explicitly.
  posterPriority?: boolean;
  // Homepage scenes share one playback budget. When opted in, this component
  // keeps fade/source cleanup ownership while the page director owns play,
  // pause, preload admission, and visibility arbitration.
  managedByHomepage?: boolean;
}) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const livingStill = usesLivingStill(video);
  const safePlaybackRate = Math.min(1.5, Math.max(0.65, playbackRate));
  // The bare `autoplay` attribute alone isn't reliable — confirmed
  // elsewhere on this site (PhotoHero/TexturedDark hero videos, via
  // useVideoFadeIn's own comment) that a fully-loaded, muted, autoplay
  // video can sit paused with nothing ever calling play() on it. This
  // component previously had no such fallback, unlike every other
  // video-background component on the site, and every instance of it
  // sits behind a section heading (Selected work, Process, FAQ,
  // SelectedWorkPinned's own backdrop) — exactly the sections that
  // would read as flat/static if their autoplay silently never fired.
  useVideoFadeIn(
    videoRef,
    !prefersReducedMotion && !livingStill,
    managedByHomepage,
  );

  useEffect(() => {
    const element = videoRef.current;
    if (!element || livingStill) return;
    element.defaultPlaybackRate = safePlaybackRate;
    element.playbackRate = safePlaybackRate;
  }, [livingStill, safePlaybackRate, video]);

  if (livingStill) {
    return (
      <div
        data-background-video-stage="true"
        data-media-mode="living-still"
        className="absolute inset-0 overflow-hidden"
      >
        <LivingImage
          src={poster}
          priority={posterPriority}
          imagePosition={imagePosition}
          intensity={parallax ? "cinematic" : push ? "hero" : "subtle"}
        />
      </div>
    );
  }

  if (prefersReducedMotion) {
    return (
      <Image
        src={poster}
        alt=""
        fill
        priority={posterPriority}
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: imagePosition }}
      />
    );
  }

  const videoElement = (
    <video
      ref={videoRef}
      className={`absolute inset-0 h-full w-full object-cover${push ? " bg-slow-push" : ""}`}
      style={{ objectPosition: imagePosition }}
      poster={poster}
      // Playback is intentionally owned by useVideoFadeIn. Leaving the
      // native autoplay flag here made every offscreen background start
      // once before the observer could pause it, which was the source of
      // the long-page bandwidth spike.
      muted
      loop={loop}
      playsInline
      aria-hidden="true"
      data-home-playback-rate={safePlaybackRate}
      // The viewport observer calls play() 25% before an offscreen scene
      // arrives. Lower chapters and homepage-directed scenes avoid even
      // metadata requests; explicit first-frame heroes keep metadata warm.
      preload={managedByHomepage ? "none" : posterPriority ? "metadata" : "none"}
    >
      {videoMobile && (
        <source src={videoMobile} media="(max-width: 767px)" type="video/mp4" />
      )}
      {videoWebm && <source src={videoWebm} type="video/webm" />}
      <source src={video} type="video/mp4" />
    </video>
  );

  if (parallax) return <ParallaxLayer>{videoElement}</ParallaxLayer>;

  return (
    <div
      data-background-video-stage="true"
      className="absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0">{videoElement}</div>
    </div>
  );
}
