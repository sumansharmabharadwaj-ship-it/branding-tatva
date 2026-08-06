"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { BREAK_OVERLAY_GRADIENT, toSvh } from "@/lib/media";
import { EASE_AIR } from "@/lib/motion";
import { useLazyMount } from "@/hooks/useLazyMount";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";
import { kenBurnsAnimation } from "@/animations/kenBurns";
import { initSplitTextReveal } from "@/animations/splitTextReveal";
import { BREAK_QUOTE_INITIAL, BREAK_QUOTE_ANIMATE, BREAK_QUOTE_TRANSITION } from "@/animations/breakQuote";

const CAMERA_PUSH = kenBurnsAnimation({ scale: 1.06, duration: 30 });
const ENTRANCE_SCALE_DELTA = 0.06;
const ENTRANCE_TRANSITION = { duration: 2.4, ease: EASE_AIR };

type QuoteVariant = "center" | "statement" | "left";

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
  cameraPush?: boolean;
  wordFade?: boolean;
  spotlight?: boolean;
  topContent?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, shouldLoadVideo] = useLazyMount();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const usesParallax = parallax && !prefersReducedMotion;
  const usesCameraPush = cameraPush && !prefersReducedMotion;
  const spotlightRef = useSpotlight(ref, spotlight ? Boolean(prefersReducedMotion) : true);
  const restScale = usesParallax ? 1.16 : 1;

  // `autoPlay` alone can still leave a fully-loaded muted video paused in
  // Chrome and Safari. This hook explicitly calls play(), pauses the film
  // when it leaves the viewport, and resumes it before the section returns.
  useVideoFadeIn(
    videoRef,
    Boolean(shouldLoadVideo && !prefersReducedMotion),
  );

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
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: imagePosition,
              ...(usesParallax ? { y: mediaY } : undefined),
            }}
            initial={usesCameraPush ? CAMERA_PUSH.initial : { scale: restScale + ENTRANCE_SCALE_DELTA }}
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
            className="max-w-4xl font-display text-4xl font-normal leading-[1.1] text-ivory sm:text-5xl"
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
