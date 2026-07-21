"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useLazyMount } from "@/hooks/useLazyMount";

// Dark section wrapper with a subtle organic texture behind the solid
// soil color, instead of flat, uniform color. The gradient overlay keeps
// contrast high enough that ivory text stays fully readable; the photo
// itself is decorative texture (rock, weathered surface), not standing
// in for a person or a claim about anything specific. Real photography
// by default (own-jagged-peaks reads as abstract rock texture under
// this much darkening), not the AI-generated image this used to
// default to — every call site should still pass its own `image` where
// a specific mood/location matters, this default is only the fallback.
//
// Optional `video` mirrors PhotoHero's own video/poster pattern — a
// still photo reads as a frozen frame for the site's actual closing
// moment (the Footer), where a full-bleed ambient loop matches how
// video-forward every other page break already is. `image` still
// covers reduced-motion and acts as the poster/fallback either way.

export function TexturedDark({
  children,
  className,
  image = "/images/own-jagged-peaks.jpg",
  video,
}: {
  children: React.ReactNode;
  className?: string;
  image?: string;
  video?: string;
}) {
  const [ref, shouldLoad] = useLazyMount();
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad || prefersReducedMotion) return;
    el.play().catch(() => {});
  }, [shouldLoad, prefersReducedMotion]);

  return (
    <section className={`relative overflow-hidden bg-soil ${className ?? ""}`}>
      <div ref={ref} className="absolute inset-0">
        {shouldLoad && (
          <>
            {video && !prefersReducedMotion ? (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={video}
                poster={image}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              // priority — this wrapper is often used far down the page
              // (e.g. the Footer), and confirmed elsewhere on this site
              // that next/image's own native lazy-load can simply never
              // fire once scrolled past; useLazyMount already decides
              // correct timing on its own, so priority just skips that
              // second, unreliable gate.
              <Image
                src={image}
                alt=""
                fill
                priority
                sizes="100vw"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            )}
          </>
        )}
      </div>
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(rgba(39,34,30,0.88), rgba(39,34,30,0.93))" }}
      />
      <div className="aurora-glow" aria-hidden="true" />
      <div className="light-rays" aria-hidden="true" />
      <div className="relative">{children}</div>
    </section>
  );
}
