"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";

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
  playbackRate = 1,
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
  // An opt-in pace adjustment for generated or unusually slow ambient
  // clips. Existing sections remain at their encoded 1x speed.
  playbackRate?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  // The bare `autoplay` attribute alone isn't reliable — confirmed
  // elsewhere on this site (PhotoHero/TexturedDark hero videos, via
  // useVideoFadeIn's own comment) that a fully-loaded, muted, autoplay
  // video can sit paused with nothing ever calling play() on it. This
  // component previously had no such fallback, unlike every other
  // video-background component on the site, and every instance of it
  // sits behind a section heading (Selected work, Process, FAQ,
  // SelectedWorkPinned's own backdrop) — exactly the sections that
  // would read as flat/static if their autoplay silently never fired.
  useVideoFadeIn(videoRef, !prefersReducedMotion);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    const safePlaybackRate = Math.min(1.5, Math.max(0.75, playbackRate));
    element.defaultPlaybackRate = safePlaybackRate;
    element.playbackRate = safePlaybackRate;
  }, [playbackRate, video]);

  if (prefersReducedMotion) {
    return (
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: imagePosition }}
      />
    );
  }

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={parallax ? { y, scale: 1.13 } : undefined}>
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover${push ? " bg-slow-push" : ""}`}
          style={{ objectPosition: imagePosition }}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          // Was the browser-default eager preload — a Lighthouse profile of
          // Services caught every BackgroundVideo instance on the page
          // (~27MB combined) downloading during initial load, competing
          // with the LCP hero for bandwidth. metadata-only now; the
          // offscreen-pause observer in useVideoFadeIn calls play() 25%
          // before a video becomes visible, which starts its real download
          // ahead of paint, with the poster covering the gap.
          preload="metadata"
        >
          {videoMobile && <source src={videoMobile} media="(max-width: 767px)" type="video/mp4" />}
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          <source src={video} type="video/mp4" />
        </video>
      </motion.div>
    </div>
  );
}
