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
// Muted color-multiply + low video opacity keeps this a hint of motion
// under the text, not a competing video moment.
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
          style={{ opacity: videoReady ? 0.5 : 0 }}
          onCanPlay={() => setVideoReady(true)}
          src={video}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: color, opacity: 0.55, mixBlendMode: "multiply" }} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, ${color} 0%, transparent 30%, transparent 70%, ${color} 100%)`,
        }}
      />
    </div>
  );
}
