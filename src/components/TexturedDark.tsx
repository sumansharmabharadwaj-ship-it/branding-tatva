"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useLazyMount } from "@/hooks/useLazyMount";
import { useSpotlight } from "@/hooks/useSpotlight";

// Dark section wrapper with a subtle organic texture behind the solid
// soil color, instead of flat, uniform color. The gradient overlay keeps
// contrast high enough that ivory text stays fully readable; the photo
// itself is decorative texture, not standing in for a person or a claim
// about anything specific. Every call site passes its own `image` — no
// shared default, so no two sections can silently end up on the same
// fallback photo.
//
// Optional `video` mirrors PhotoHero's own video/poster pattern — a
// still photo reads as a frozen frame for the site's actual closing
// moment (the Footer), where a full-bleed ambient loop matches how
// video-forward every other page break already is. `image` still
// covers reduced-motion and acts as the poster/fallback either way.

export function TexturedDark({
  children,
  className,
  image,
  video,
}: {
  children: React.ReactNode;
  className?: string;
  image: string;
  video?: string;
}) {
  const [ref, shouldLoad] = useLazyMount();
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Only wired for the video variant (the Footer's closing scene) —
  // TexturedDark's other caller (the Services CTA) has no video and
  // already reads as a calm, static panel that doesn't need a cursor
  // response competing with the CTA button.
  const spotlightRef = useSpotlight(sectionRef, Boolean(prefersReducedMotion) || !video);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad || prefersReducedMotion) return;
    el.play().catch(() => {});
  }, [shouldLoad, prefersReducedMotion]);

  return (
    <section ref={sectionRef} className={`relative overflow-hidden bg-soil ${className ?? ""}`}>
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
      {/* Was a near-opaque 0.88-0.93 flat overlay — with a video behind
          it (the Footer's closing scene) that crushed the motion to
          almost nothing, reading as a static dark image rather than a
          video loop, the same "technically there but invisible"
          problem the Five Elements rows and Process background had
          before switching to BREAK_OVERLAY_GRADIENT's ~0.6 peak. Same
          fix here: bring the darkest point down to what the rest of
          the site's video sections already use, so the footage
          actually reads as moving. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: video
            ? "linear-gradient(180deg, rgba(39,34,30,0.45) 0%, rgba(39,34,30,0.65) 55%, rgba(39,34,30,0.8) 100%)"
            : "linear-gradient(rgba(39,34,30,0.88), rgba(39,34,30,0.93))",
        }}
      />
      <div className="aurora-glow" aria-hidden="true" />
      <div className="light-rays" aria-hidden="true" />
      {video && !prefersReducedMotion && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="cursor-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        />
      )}
      <div className="relative">{children}</div>
    </section>
  );
}
