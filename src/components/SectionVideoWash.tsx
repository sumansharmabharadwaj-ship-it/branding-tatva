"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLazyMount } from "@/hooks/useLazyMount";

// A quiet video backdrop for a bold solid-color section that reads as
// static in a screenshot even with the aurora-glow/DustMotes ambient
// treatment — real motion instead of a CSS drift too subtle to notice.
// Scoped to sit behind one text block rather than the whole section, so
// it fades to the section's own flat color at the top and bottom edges
// (via the gradient below) instead of leaving a visible rectangle seam.
// A first pass used a heavy multiply tint that crushed the footage into
// a flat green wash — direct feedback that it hid the very thing it was
// meant to show. A light normal-blend tint (not multiply, which darkens
// and desaturates everything under it) plus a much higher video opacity
// keeps the actual footage — the light, the water, the motion — clearly
// legible, tied to the section's own color without being buried by it.
// Pass the same clip a VideoBreak just below already uses so the whole
// passage reads as one continuous cinematic moment (text leading into
// its own footage) rather than two unrelated video instances stitched
// together.
export function SectionVideoWash({
  video,
  poster,
  color,
}: {
  video: string;
  poster: string;
  color: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, shouldLoad] = useLazyMount();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad || prefersReducedMotion) return;
    el.play().catch(() => {});
  }, [shouldLoad, prefersReducedMotion]);

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      {shouldLoad && !prefersReducedMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: videoReady ? 0.85 : 0 }}
          onCanPlay={() => setVideoReady(true)}
          src={video}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: color, opacity: 0.18 }} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, ${color} 0%, transparent 45%, transparent 65%, ${color} 100%)`,
        }}
      />
    </div>
  );
}
