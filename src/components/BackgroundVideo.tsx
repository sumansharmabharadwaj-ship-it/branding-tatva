"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";

// A bare video-with-poster-fallback fill layer, for sections that already
// build their own overlay/content on top rather than wrapping in
// PhotoHero/VideoBreak's own layout and gradient conventions.
export function BackgroundVideo({
  video,
  videoWebm,
  poster,
  imagePosition = "center",
  parallax = false,
  push = false,
  mobilePosterOnly = false,
}: {
  video: string;
  videoWebm?: string;
  poster: string;
  imagePosition?: string;
  parallax?: boolean;
  push?: boolean;
  // A chapter that already owns a foreground film can keep its environmental
  // poster on phones instead of decoding a second loop behind it. The desktop
  // composition remains unchanged. The initial unknown state also renders the
  // poster, preventing an unnecessary mobile video request during hydration.
  mobilePosterOnly?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(
    mobilePosterOnly ? null : false,
  );
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  useEffect(() => {
    if (!mobilePosterOnly) return;

    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [mobilePosterOnly]);

  const posterOnly = Boolean(
    prefersReducedMotion ||
      (mobilePosterOnly && isMobile !== false),
  );

  // The bare autoplay attribute is not reliable after a delayed mount or tab
  // return. This hook owns explicit play/pause only when a video is actually
  // rendered for the current device.
  useVideoFadeIn(videoRef, !posterOnly);

  if (posterOnly) {
    return (
      <Image
        src={poster}
        alt=""
        fill
        priority={Boolean(prefersReducedMotion)}
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: imagePosition }}
      />
    );
  }

  return (
    <div ref={wrapRef} data-video-decorative-root className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={parallax ? { y, scale: 1.13 } : undefined}
      >
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover${push ? " bg-slow-push" : ""}`}
          style={{ objectPosition: imagePosition }}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          <source src={video} type="video/mp4" />
        </video>
      </motion.div>
    </div>
  );
}
