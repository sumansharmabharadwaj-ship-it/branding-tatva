"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { KenBurnsImage } from "@/components/KenBurnsImage";
import { useLazyMount } from "@/hooks/useLazyMount";

const DUST = [
  { top: "20%", left: "15%", size: 3, delay: "0s", duration: "9s" },
  { top: "65%", left: "78%", size: 2, delay: "2s", duration: "7.5s" },
  { top: "40%", left: "50%", size: 2, delay: "4s", duration: "8.5s" },
];

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
//
// Two separate transform-bearing layers on purpose: the outer motion.div
// carries the scroll-linked parallax (a MotionValue written to style),
// the inner div carries the hover zoom (a Tailwind group-hover class).
// Framer computes one combined inline `transform` for whatever it
// controls, which silently overrides a Tailwind transform utility on
// the *same* element rather than combining with it — splitting the two
// concerns across two elements avoids that fight entirely.
export function CinematicCardMedia({
  image,
  video,
  gradient,
  sizes = "(min-width: 768px) 50vw, 100vw",
  isHovered = false,
  dust = false,
  accent,
  imagePosition = "center",
}: {
  image?: string;
  video?: string;
  gradient: string;
  sizes?: string;
  isHovered?: boolean;
  dust?: boolean;
  accent?: string;
  imagePosition?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, shouldLoad] = useLazyMount();
  const [videoReady, setVideoReady] = useState(false);
  const prefersReducedMotion = useHydratedReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad || prefersReducedMotion) return;
    el.play().catch(() => {});
  }, [shouldLoad, prefersReducedMotion]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = isHovered ? 1.12 : 1;
  }, [isHovered]);

  const mediaFilter = isHovered ? "brightness(1.08)" : "brightness(1)";

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      style={prefersReducedMotion ? undefined : { scale: parallaxScale, y: parallaxY }}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
        {image && (
          <div className="absolute inset-0 transition-[filter] duration-500" style={{ filter: mediaFilter }}>
            <KenBurnsImage image={image} gradient={gradient} sizes={sizes} imagePosition={imagePosition} />
          </div>
        )}
        {video && shouldLoad && !prefersReducedMotion && (
          <video
            aria-hidden="true"
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-500"
            style={{ opacity: videoReady ? 1 : 0, filter: mediaFilter, objectPosition: imagePosition }}
            onCanPlay={() => setVideoReady(true)}
            src={video}
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
      </div>

      {/* Glass reflection — a fixed diagonal glint rather than a moving
          shimmer sweep, so it reads as light caught on a surface instead
          of a loading-spinner-style animation competing with the video
          underneath. Brightens slightly on hover, like catching it at a
          better angle. */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-70"
        style={{
          background:
            "linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.12) 49%, rgba(255,255,255,0.03) 57%, transparent 66%)",
        }}
      />

      {dust && !prefersReducedMotion && (
        <div className="card-dust" aria-hidden="true">
          {DUST.map((d, i) => (
            <span
              key={i}
              style={{ top: d.top, left: d.left, width: d.size, height: d.size, animationDelay: d.delay, animationDuration: d.duration }}
            />
          ))}
        </div>
      )}

      {/* Case-study media stays industry-specific (an office, a
          warehouse, a supplement shelf) rather than generic nature
          photography, so this tints it toward the project's own
          element color instead of replacing it outright — still nods
          to Earth/Water/Fire/Air/Space without losing what the image
          is actually showing. */}
      {accent && <div className="absolute inset-0" style={{ backgroundColor: accent, opacity: 0.16, mixBlendMode: "multiply" }} />}

      <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
    </motion.div>
  );
}
