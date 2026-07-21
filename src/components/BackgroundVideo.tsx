"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

// A bare video-with-poster-fallback fill layer, for sections that already
// build their own overlay/content on top rather than wrapping in
// PhotoHero/VideoBreak's own layout and gradient conventions (e.g. the
// homepage FAQ section, which needs a light custom overlay instead of
// either component's fixed dark gradient).

export function BackgroundVideo({
  video,
  poster,
  imagePosition = "center",
}: {
  video: string;
  poster: string;
  imagePosition?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

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
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: imagePosition }}
      src={video}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}
