"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
// Optional `video` mirrors PhotoHero's own video/poster pattern — a
// still photo reads as a frozen frame for the site's actual closing
// moment (the Footer), where a full-bleed ambient loop matches how
// video-forward every other page break already is. `image` still
// covers reduced-motion and acts as the poster/fallback either way.

export function TexturedDark({
  children,
  className,
  id,
  image,
  video,
  videoWebm,
  imagePosition = "center",
  scene = false,
}: {
  children: React.ReactNode;
  className?: string;
  // Optional anchor id so in-page links (the Services hero's "open the
  // strategy room" line) can target a TexturedDark chapter directly.
  id?: string;
  image: string;
  video?: string;
  // Optional WebM sibling, tried first via a real <source> list (was a
  // single `src` string). The first WebM asset on this site (the
  // Services CTA's sunlight-on-wood clip) established this pattern —
  // VP9/WebM compresses meaningfully smaller than H.264 at the same
  // visual quality, the browser picks whichever <source> it can
  // decode, and `video` alone still works exactly as before for every
  // existing MP4-only call site (the Footer), so this is additive, not
  // a breaking change to the prop contract.
  videoWebm?: string;
  imagePosition?: string;
  // Opt-in full-screen chapter treatment. This deliberately does not pin:
  // ordinary reading sections should unfold gracefully, not trap scrolling.
  scene?: boolean;
}) {
  const [ref, shouldLoad] = useLazyMount();
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  // Only wired for the video variant (the Footer's closing scene) —
  // TexturedDark's other caller (the Services CTA) has no video and
  // already reads as a calm, static panel that doesn't need a cursor
  // response competing with the CTA button.
  const spotlightRef = useSpotlight(sectionRef, Boolean(prefersReducedMotion) || !video);
  // useVideoFadeIn now handles both the fade-in and the explicit
  // play() call (autoplay attribute alone isn't reliable — see the
  // hook's own comment) — this used to be a separate effect here.
  useVideoFadeIn(videoRef, shouldLoad && Boolean(video) && !prefersReducedMotion);

  return (
    <section ref={sectionRef} id={id} className={`relative overflow-hidden bg-soil ${scene ? "flex min-h-[100svh] items-center" : ""} ${className ?? ""}`}>
      <motion.div
        ref={ref}
        className={`absolute inset-0 ${scene ? "scale-[1.08]" : ""}`}
        style={scene && !prefersReducedMotion ? { y: mediaY } : undefined}
      >
        {/* image renders immediately, unconditionally — not gated behind
            shouldLoad. This wrapper is almost always far down the page
            (the Footer, every page's closing CTA), so before this fix
            the entire background was a flat bg-soil rectangle until
            shouldLoad fired *and* the video itself finished a full
            network round-trip (preload="metadata" only fetches
            metadata; actual frame data only starts downloading once
            play() is called in the effect above) — two sequential
            delays stacked on mobile, read as "the footer takes forever
            to load." The real photo now shows the instant it's
            rendered (same reasoning as ElementRowBackground's solid
            fallback fill); the video, once shouldLoad fires and it's
            actually playable, fades in on top instead of being the
            only thing standing between a blank rectangle and content. */}
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
            {videoWebm && <source src={videoWebm} type="video/webm" />}
            <source src={video} type="video/mp4" />
          </video>
        )}
      </motion.div>
      {/* Was a near-opaque 0.88-0.93 flat overlay — with a video behind
          it (the Footer's closing scene) that crushed the motion to
          almost nothing, reading as a static dark image rather than a
          video loop, the same "technically there but invisible"
          problem the Five Elements rows and Process background had
          before switching to BREAK_OVERLAY_GRADIENT's ~0.6 peak. Same
          fix here: bring the darkest point down to what the rest of
          the site's video sections already use, so the footage
          actually reads as moving. The original 0.45 top stop still let
          own-jagged-peaks.mp4's own bright sky/cloud frame read as a
          near-white band right where it meets the section above —
          direct, repeated feedback pointed at exactly this band as a
          leftover "divider." imagePosition (below, biased toward the
          mountains on the Footer's own call site) does the real work;
          raising the stops here just keeps any residual sky a shade
          darker regardless of crop. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: video
            ? "linear-gradient(180deg, rgba(39,34,30,0.6) 0%, rgba(39,34,30,0.7) 55%, rgba(39,34,30,0.85) 100%)"
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
      <div className="relative w-full">
        {/* Audit found the video variant's overlay (above) sits below
            the site's normalized bg-soil/80 text-contrast floor —
            deliberately, per the comment above: raising it site-wide
            already caused a real regression once (crushed the Footer's
            video to a static-looking image). Rather than re-fighting
            that trade-off with one shared value, a second, local scrim
            sized to exactly this block's own content bounds (not the
            whole section) sits only behind the text/CTA, so contrast
            improves where it's actually read without darkening the
            video everywhere else it's visible. No-op for the no-video
            variant, which is already at 0.88-0.93. */}
        {video && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-3xl sm:-inset-x-10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(39,34,30,0.55) 0%, rgba(39,34,30,0.3) 65%, transparent 100%)",
            }}
          />
        )}
        {children}
      </div>
    </section>
  );
}
