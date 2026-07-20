"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { KenBurnsImage } from "@/components/KenBurnsImage";
import { useLazyMount } from "@/hooks/useLazyMount";

// A card's ambient clip plays continuously once it nears the viewport,
// instead of sitting as a still photo (or only waking up on hover) — a
// static image behind a whole grid of cards reads as frozen, and the
// per-industry cinematic loops (see data/projects.ts) are the actual
// point of giving each project its own world. KenBurnsImage stays
// mounted underneath as the poster: it's what's visible immediately,
// and what stays visible for prefers-reduced-motion or before the
// video's own canplay fires, so there's never a blank frame waiting on
// network. Shared by CaseStudyCard and Home's secondary featured cards
// rather than each re-implementing the same lazy-mount + autoplay wiring.
export function CinematicCardMedia({
  image,
  video,
  gradient,
  sizes = "(min-width: 768px) 50vw, 100vw",
}: {
  image?: string;
  video?: string;
  gradient: string;
  sizes?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, shouldLoad] = useLazyMount();
  const [videoReady, setVideoReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad || prefersReducedMotion) return;
    el.play().catch(() => {});
  }, [shouldLoad, prefersReducedMotion]);

  return (
    <div ref={ref} className="absolute inset-0">
      {image && (
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
          <KenBurnsImage image={image} gradient={gradient} sizes={sizes} />
        </div>
      )}
      {video && shouldLoad && !prefersReducedMotion && (
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
          <video
            ref={videoRef}
            className="h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: videoReady ? 1 : 0 }}
            onCanPlay={() => setVideoReady(true)}
            src={video}
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      )}
      <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
    </div>
  );
}
