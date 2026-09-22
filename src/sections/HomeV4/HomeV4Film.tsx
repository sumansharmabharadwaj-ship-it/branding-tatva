"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useHomeGuideMode } from "@/hooks/useHomeGuideMode";

/** A readable first frame, then one appropriately sized film as its scene arrives. */
export function HomeV4Film({
  desktop,
  mobile,
  poster,
  priority = false,
}: {
  desktop: string;
  mobile: string;
  poster: string;
  priority?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const guideMode = useHomeGuideMode();
  const [source, setSource] = useState<string>();
  const [hasFrame, setHasFrame] = useState(false);
  const permitted = hydrated && !prefersReducedMotion && guideMode !== "paused";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !permitted || source) return;
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (connection?.saveData || /^(slow-)?2g$/.test(connection?.effectiveType ?? "")) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      // Select once when the scene first arrives. Resizing does not interrupt
      // a playing film or download a second rendition of the same footage.
      setSource(window.matchMedia("(max-width: 767px)").matches ? mobile : desktop);
      observer.disconnect();
    }, { rootMargin: "20% 0px" });
    observer.observe(video);
    return () => observer.disconnect();
  }, [desktop, mobile, permitted, source]);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (!video) return;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <>
      <Image src={poster} alt="" fill sizes="100vw" priority={priority} style={{ objectFit: "cover" }} />
      <video
        ref={videoRef}
        src={source}
        muted
        autoPlay={permitted && Boolean(source)}
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        data-home-playback-rate="1"
        onLoadedData={() => setHasFrame(true)}
        style={{ opacity: hasFrame && !prefersReducedMotion ? 1 : 0 }}
      />
    </>
  );
}
