"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef } from "react";
import Image from "next/image";

import { useLazyMount } from "@/hooks/useLazyMount";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";

// Dark section wrapper with a subtle organic texture behind the solid
// soil color, instead of flat, uniform color. The gradient overlay keeps
// contrast high enough that ivory text stays fully readable; the photo
// itself is decorative texture, not standing in for a person or a claim
// about anything specific. Every call site passes its own `image` — no
// shared default, so no two sections can silently end up on the same
// fallback photo.
//
// Optional video sources mirror PhotoHero's video/poster pattern. The
// still image remains the immediate fallback and the reduced-motion
// experience; a dedicated mobile MP4 can be supplied without changing
// existing desktop-only call sites. `overlayGradient` is intentionally
// local rather than global so one warm closing scene does not re-grade
// every TexturedDark section into the same brown wash.

export function TexturedDark({
  children,
  className,
  id,
  image,
  video,
  videoMobile,
  videoWebm,
  imagePosition = "center",
  overlayGradient,
}: {
  children: React.ReactNode;
  className?: string;
  // Optional anchor id so in-page links (the Services hero's "open the
  // strategy room" line) can target a TexturedDark chapter directly.
  id?: string;
  image: string;
  video?: string;
  // Optional lower-bandwidth MP4 selected by the browser on phones.
  videoMobile?: string;
  // Optional WebM sibling, tried before the desktop MP4 when supported.
  // `video` alone keeps working exactly as before for existing callers.
  videoWebm?: string;
  imagePosition?: string;
  // A section-specific grade. Omit it to retain the established soil
  // overlay; provide it when the source film has its own color script.
  overlayGradient?: string;
}) {
  const [ref, shouldLoad] = useLazyMount();
  const prefersReducedMotion = useHydratedReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useSpotlight(sectionRef, Boolean(prefersReducedMotion) || !video);
  // useVideoFadeIn handles both the fade-in and the explicit play() call
  // (autoplay alone is not reliable across browsers and power modes).
  useVideoFadeIn(videoRef, shouldLoad && Boolean(video) && !prefersReducedMotion);

  const resolvedOverlayGradient =
    overlayGradient ??
    (video
      ? "linear-gradient(180deg, rgba(39,34,30,0.6) 0%, rgba(39,34,30,0.7) 55%, rgba(39,34,30,0.85) 100%)"
      : "linear-gradient(rgba(39,34,30,0.88), rgba(39,34,30,0.93))");

  return (
    <section ref={sectionRef} id={id} className={`relative overflow-hidden bg-soil ${className ?? ""}`}>
      <div ref={ref} className="absolute inset-0">
        {/* The still renders immediately instead of waiting for lazy video
            activation. Far-down-page chapters therefore have a complete
            visual frame before their film begins downloading. */}
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: imagePosition }}
        />
        {shouldLoad && video && !prefersReducedMotion && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
            style={{ objectPosition: imagePosition }}
            muted
            loop
            playsInline
            preload="metadata"
          >
            {videoMobile && <source src={videoMobile} media="(max-width: 767px)" type="video/mp4" />}
            {videoWebm && <source src={videoWebm} type="video/webm" />}
            <source src={video} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="absolute inset-0" style={{ backgroundImage: resolvedOverlayGradient }} />
      <div className="aurora-glow" aria-hidden="true" />
      <div className="light-rays" aria-hidden="true" />
      {video && !prefersReducedMotion && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="cursor-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        />
      )}
      <div className="relative">
        {/* The film grade stays light enough to remain visible. This local
            radial scrim protects only the content block, preserving the
            surrounding motion instead of darkening the whole frame. */}
        {video && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-2xl sm:-inset-x-10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(22,20,18,0.58) 0%, rgba(22,20,18,0.32) 65%, transparent 100%)",
            }}
          />
        )}
        {children}
      </div>
    </section>
  );
}
