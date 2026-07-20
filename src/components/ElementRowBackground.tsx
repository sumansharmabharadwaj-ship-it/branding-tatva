"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { kenBurnsAnimation } from "@/animations/kenBurns";
import { useLazyMount } from "@/hooks/useLazyMount";

const KEN_BURNS = kenBurnsAnimation({ scale: 1.06, duration: 26 });

// The photographic backdrop behind each Five Elements row. Previously
// rendered at 16% opacity with mix-blend-mode: color — a blend mode that
// keeps only the photo's hue/saturation and takes luminosity from
// whatever's behind it, which against this section's pale cream
// background crushed five real photos down to a barely-visible tint.
// The row read as a flat color card, not a photograph. Now the photo
// shows at real opacity, and where a matching clip exists (video),
// cross-fades into a continuously-playing loop once the row nears the
// viewport instead of just drifting via Ken Burns — the image alone
// still carries the Ken Burns drift as the poster/fallback. A tinted
// wash in the element's own color keeps the five rows reading as one
// coherent set rather than five unrelated photos or clips.
export function ElementRowBackground({
  image,
  video,
  color,
}: {
  image: string;
  video?: string;
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
      <motion.div
        className="absolute inset-0"
        initial={KEN_BURNS.initial}
        animate={prefersReducedMotion ? undefined : KEN_BURNS.animate}
        transition={KEN_BURNS.transition}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </motion.div>
      {video && shouldLoad && !prefersReducedMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: videoReady ? 1 : 0 }}
          onCanPlay={() => setVideoReady(true)}
          src={video}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: color, opacity: 0.22, mixBlendMode: "multiply" }} />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(244,239,230,0.55) 0%, rgba(244,239,230,0.7) 100%)" }}
      />
    </div>
  );
}
