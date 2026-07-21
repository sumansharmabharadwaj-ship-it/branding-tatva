"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { BREAK_OVERLAY_GRADIENT, toSvh } from "@/lib/media";
import { EASE_AIR } from "@/lib/motion";
import { useLazyMount } from "@/hooks/useLazyMount";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";
import { useSpotlight } from "@/hooks/useSpotlight";
import { kenBurnsAnimation } from "@/animations/kenBurns";
import { initSplitTextReveal } from "@/animations/splitTextReveal";
import { BREAK_QUOTE_INITIAL, BREAK_QUOTE_ANIMATE, BREAK_QUOTE_TRANSITION } from "@/animations/breakQuote";

// A slower, more subtle push than the card/hero Ken Burns loops — this
// sits behind a long quote someone is meant to actually read, not a
// glanced-at card, so the drift should be closer to imperceptible.
const CAMERA_PUSH = kenBurnsAnimation({ scale: 1.06, duration: 30 });

// How much extra zoom a non-cameraPush video starts at before settling
// to its rest scale as it scrolls into view — the same "don't just hard
// cut into frame" entrance ImageBreak's photos already use, so a video
// break isn't the one full-bleed moment on the page that just pops in.
const ENTRANCE_SCALE_DELTA = 0.06;
const ENTRANCE_TRANSITION = { duration: 2.2, ease: EASE_AIR };

// The video counterpart to ImageBreak: a full-bleed cinematic moment, but
// with real motion in the shot itself rather than a static photograph.
// Muted, looping, and silent by design, it's atmosphere rather than
// promotional footage. Reduced-motion users get the poster frame only,
// same as a photo would show.

type QuoteVariant = "center" | "statement" | "left";

// Opt-in word-by-word GSAP reveal (reusing the same SplitText setup as
// SplitReveal's headlines) instead of the default single-block Framer
// Motion fade — reserved for the handful of quote moments meant to
// carry real weight, same reasoning SplitReveal itself already uses
// for headlines.
function QuoteText({
  quote,
  wordFade,
  prefersReducedMotion,
  className,
  style,
}: {
  quote: string;
  wordFade: boolean;
  prefersReducedMotion: boolean | null;
  className: string;
  style: React.CSSProperties;
}) {
  const splitRef = useRef<HTMLParagraphElement>(null);
  const [revealRef, revealed] = useRevealTrigger();

  useEffect(() => {
    const el = splitRef.current;
    if (!el || !wordFade || prefersReducedMotion) return;
    const ctx = initSplitTextReveal(el);
    return () => ctx.revert();
  }, [wordFade, prefersReducedMotion]);

  if (wordFade) {
    return (
      // GSAP's SplitText auto-adds an aria-label with the original,
      // unfragmented sentence to this <p> so screen readers get one
      // readable text instead of the individual word spans (each
      // already aria-hidden — see initSplitTextReveal). Correct
      // behavior, but aria-label is technically only valid on elements
      // whose role permits a distinct accessible name, and a plain <p>
      // doesn't by default; role="text" is the documented pattern for
      // exactly this "visually split, should read as one text node"
      // case and is what quiets the false-positive without changing
      // what's actually announced.
      <p ref={splitRef} role="text" className={className} style={style}>
        {quote}
      </p>
    );
  }

  return (
    <motion.p
      ref={revealRef}
      initial={BREAK_QUOTE_INITIAL}
      animate={revealed ? BREAK_QUOTE_ANIMATE : undefined}
      transition={BREAK_QUOTE_TRANSITION}
      className={className}
      style={style}
    >
      {quote}
    </motion.p>
  );
}

export function VideoBreak({
  src,
  poster,
  quote,
  height = "70vh",
  imagePosition = "center",
  quoteVariant = "center",
  overlayGradient = BREAK_OVERLAY_GRADIENT,
  parallax = false,
  cameraPush = false,
  wordFade = false,
  spotlight = false,
  topContent,
  children,
}: {
  src: string;
  poster: string;
  quote?: string;
  height?: string;
  imagePosition?: string;
  quoteVariant?: QuoteVariant;
  overlayGradient?: string;
  parallax?: boolean;
  // A slow continuous zoom on the video itself — "the camera pushing
  // in" on top of whatever the footage is already doing.
  cameraPush?: boolean;
  // Splits the quote into words that fade/rise in one at a time instead
  // of the whole line arriving as one block.
  wordFade?: boolean;
  // A soft light following the cursor within this break, same
  // technique as the Home hero and Threshold split-screen.
  spotlight?: boolean;
  // Extra content rendered above the quote, inside the same video —
  // lets a section that wants its own lead-in text share one video
  // instance instead of needing a second, separate <video> just to
  // put motion behind that text too.
  topContent?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  // Every break on the page otherwise mounts and starts downloading its
  // full video immediately, regardless of scroll position — a real
  // weight cost on pages with several of these below the fold. The
  // poster still renders instantly; only the .mp4 fetch is deferred
  // until the section is within ~600px of the viewport.
  const [ref, shouldLoadVideo] = useLazyMount();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const usesParallax = parallax && !prefersReducedMotion;
  const usesCameraPush = cameraPush && !prefersReducedMotion;
  const spotlightRef = useSpotlight(ref, spotlight ? Boolean(prefersReducedMotion) : true);
  // Parallax needs a small permanent overscan so its ±8% vertical
  // translate never reveals an edge; without it there's no such
  // requirement, so rest is a plain 1.
  const restScale = usesParallax ? 1.16 : 1;

  return (
    <div
      ref={ref}
      data-cursor-media
      className="relative flex flex-col overflow-hidden bg-soil"
      style={{ height: toSvh(height) }}
    >
      {prefersReducedMotion ? (
        <div className="absolute inset-0">
          {shouldLoadVideo && (
            // priority — reuses the same shouldLoadVideo signal that
            // already gates the video branch below; without it this
            // fallback (the only content reduced-motion users ever see
            // here) relied purely on next/image's own native lazy-load,
            // confirmed elsewhere on this site to sometimes never fire.
            <Image
              src={poster}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: imagePosition }}
            />
          )}
          <div className="absolute inset-0" style={{ backgroundImage: overlayGradient }} />
        </div>
      ) : (
        <>
          <motion.video
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: imagePosition,
              ...(usesParallax ? { y: mediaY } : undefined),
            }}
            initial={usesCameraPush ? CAMERA_PUSH.initial : { scale: restScale + ENTRANCE_SCALE_DELTA }}
            // The entrance settle (non-cameraPush case) used to be driven
            // by whileInView directly; now reuses shouldLoadVideo — the
            // same already-hardened (IntersectionObserver + Lenis-scroll
            // fallback) signal that gates the video's own src/autoplay —
            // instead of a second, independent visibility mechanism that
            // could disagree with it or fail on its own. See
            // useRevealTrigger for the general reasoning.
            animate={usesCameraPush ? CAMERA_PUSH.animate : shouldLoadVideo ? { scale: restScale } : undefined}
            transition={usesCameraPush ? CAMERA_PUSH.transition : ENTRANCE_TRANSITION}
            src={shouldLoadVideo ? src : undefined}
            poster={poster}
            autoPlay={shouldLoadVideo}
            muted
            loop
            playsInline
            preload={shouldLoadVideo ? "auto" : "none"}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: overlayGradient }}
          />
        </>
      )}

      {spotlight && !prefersReducedMotion && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="cursor-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        />
      )}

      {topContent && (
        <div className="relative pt-20 sm:pt-28">
          <Container>{topContent}</Container>
        </div>
      )}

      {quote && quoteVariant === "statement" && (
        <div className="relative flex flex-1 flex-col items-center justify-center gap-14 px-6 text-center">
          <QuoteText
            quote={quote}
            wordFade={wordFade}
            prefersReducedMotion={prefersReducedMotion}
            className="max-w-4xl font-display text-4xl font-semibold leading-[1.1] text-ivory sm:text-5xl"
            style={{ textShadow: "0 2px 14px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)" }}
          />
          {children}
        </div>
      )}

      {quote && quoteVariant === "left" && (
        <div className="relative flex flex-1 items-end px-6 pb-12 sm:px-12 sm:pb-16">
          <QuoteText
            quote={`“${quote}”`}
            wordFade={wordFade}
            prefersReducedMotion={prefersReducedMotion}
            className="max-w-md font-display text-2xl italic text-ivory sm:text-3xl"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
          />
        </div>
      )}

      {quote && quoteVariant === "center" && (
        <div className="relative flex flex-1 items-center justify-center px-6 text-center">
          <QuoteText
            quote={`“${quote}”`}
            wordFade={wordFade}
            prefersReducedMotion={prefersReducedMotion}
            className="max-w-xl px-6 font-display text-2xl italic text-ivory sm:text-3xl"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
          />
        </div>
      )}
    </div>
  );
}
