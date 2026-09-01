"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useCinematicScene } from "@/hooks/useCinematicScene";
import { motionTokens } from "@/lib/motionTokens";
import { LivingImage } from "@/components/LivingImage";
import { usesLivingStill } from "@/lib/mediaMode";

type Runway = "none" | "short" | "default" | "long";

const RUNWAY_CLASS: Record<Runway, string> = {
  none: "",
  short: "bt-scene--unfold-short",
  default: "bt-scene--unfold",
  long: "bt-scene--unfold-long",
};

export type BtSceneProps = {
  id?: string;
  children: ReactNode;
  runway?: Runway;
  theme?: "dark" | "light";
  video?: string;
  videoMobile?: string;
  videoWebm?: string;
  poster?: string;
  image?: string;
  mediaId?: string;
  mediaAlt?: string;
  priority?: boolean;
  overlay?: boolean;
  className?: string;
  contentClassName?: string;
  from?: "below" | "left" | "right";
  scrub?: number;
  playbackRate?: number;
};

export function BtScene({
  id,
  children,
  runway = "none",
  theme = "dark",
  video,
  videoMobile,
  videoWebm,
  poster,
  image,
  mediaId,
  mediaAlt = "",
  priority = false,
  overlay = true,
  className = "",
  contentClassName = "",
  from = "below",
  scrub = motionTokens.scrubCatchUp,
  playbackRate = motionTokens.ambientPlaybackRate,
}: BtSceneProps) {
  const sceneRef = useCinematicScene<HTMLElement>({ from, scrub });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const fallbackImage = poster || image;
  const livingStill = usesLivingStill(video);
  const hasMedia = Boolean((video && !videoFailed && !livingStill) || fallbackImage);

  useEffect(() => {
    setVideoFailed(false);
  }, [video]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || livingStill) return;
    const safeRate = Math.min(1.15, Math.max(1, playbackRate));
    element.defaultPlaybackRate = safeRate;
    element.playbackRate = safeRate;
  }, [livingStill, playbackRate, video]);

  return (
    <section
      id={id}
      ref={sceneRef}
      data-theme={theme}
      className={`bt-scene ${RUNWAY_CLASS[runway]} ${className}`.trim()}
    >
      <div className="bt-scene__sticky">
        {hasMedia && (
          <div className="bt-scene__media" data-scene-media data-media-id={mediaId}>
            {livingStill && fallbackImage ? (
              <LivingImage
                src={fallbackImage}
                alt={mediaAlt}
                priority={priority}
                intensity="cinematic"
              />
            ) : video && !videoFailed ? (
              <video
                ref={videoRef}
                playsInline
                muted
                loop
                preload="metadata"
                poster={poster}
                aria-hidden="true"
                onError={() => setVideoFailed(true)}
              >
                {videoMobile && (
                  <source src={videoMobile} media="(max-width: 767px)" type="video/mp4" />
                )}
                {videoWebm && <source src={videoWebm} type="video/webm" />}
                <source src={video} type="video/mp4" />
              </video>
            ) : fallbackImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={fallbackImage}
                alt={mediaAlt}
                loading={priority ? "eager" : "lazy"}
                decoding={priority ? "sync" : "async"}
                fetchPriority={priority ? "high" : "auto"}
              />
            ) : null}
          </div>
        )}

        {hasMedia && overlay && <div className="bt-scene__overlay" aria-hidden="true" />}

        <div className={`bt-scene__content ${contentClassName}`.trim()}>{children}</div>
      </div>
    </section>
  );
}

export function SceneEyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p data-scene-eyebrow className={`bt-scene__eyebrow ${className}`.trim()}>
      {children}
    </p>
  );
}

export function SceneTitle({
  lines,
  as: Tag = "h2",
  className = "",
}: {
  lines: string[];
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag className={`bt-scene__title ${className}`.trim()}>
      {lines.map((line) => (
        <span key={line} data-scene-line className="bt-scene__line">
          {line}
        </span>
      ))}
    </Tag>
  );
}

export function SceneBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div data-scene-body className={`bt-scene__body ${className}`.trim()}>
      {children}
    </div>
  );
}

export function SceneProof({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div data-scene-proof className={className}>
      {children}
    </div>
  );
}
