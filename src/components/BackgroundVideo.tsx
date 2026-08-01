"use client";

import { useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";

// A bare video-with-poster-fallback fill layer, for sections that already
// build their own overlay/content on top rather than wrapping in
// PhotoHero/VideoBreak's own layout and gradient conventions (e.g. the
// homepage FAQ section, which needs a light custom overlay instead of
// either component's fixed dark gradient).

export function BackgroundVideo({
  video,
  videoWebm,
  poster,
  imagePosition = "center",
}: {
  video: string;
  // Optional WebM sibling, tried first via a real <source> list — same
  // additive pattern TexturedDark established (see its own comment).
  // `video` alone keeps working exactly as before for every existing
  // MP4-only call site.
  videoWebm?: string;
  poster: string;
  imagePosition?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
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
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: imagePosition }}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
    >
      {videoWebm && <source src={videoWebm} type="video/webm" />}
      <source src={video} type="video/mp4" />
    </video>
  );
}
