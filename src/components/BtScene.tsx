"use client";

import type { ReactNode } from "react";
import { useCinematicScene } from "@/hooks/useCinematicScene";

/*
 * One chapter of the site, in the shape every chapter shares.
 *
 * The point of a single component here is discipline rather than reuse: when
 * each section invents its own scroll trick the result reads as a pile of
 * effects, and when they share one structure it reads as a film. Sections
 * differ in what they say and which layers they mark, not in how they behave.
 *
 * Composition, top to bottom inside the sticky frame:
 *   media    the ground, real footage or photography, drifts slowly
 *   overlay  a scrim carrying legibility for the type above it
 *   content  semantic HTML, never baked into the artwork
 */

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
  /** Scroll distance the scene unfolds across. "none" is a single screen. */
  runway?: Runway;
  /** Chooses the scrim recipe. Dark ground carries ivory type, light carries soil. */
  theme?: "dark" | "light";
  video?: string;
  poster?: string;
  image?: string;
  /** Describe the footage only when it carries meaning; decoration stays silent. */
  mediaAlt?: string;
  /** The hero, and only the hero, loads its media eagerly. */
  priority?: boolean;
  overlay?: boolean;
  className?: string;
  contentClassName?: string;
  /** Where the headline enters from. */
  from?: "below" | "left" | "right";
  scrub?: number;
};

export function BtScene({
  id,
  children,
  runway = "none",
  theme = "dark",
  video,
  poster,
  image,
  mediaAlt = "",
  priority = false,
  overlay = true,
  className = "",
  contentClassName = "",
  from = "below",
  scrub = 0.8,
}: BtSceneProps) {
  const sceneRef = useCinematicScene<HTMLElement>({ from, scrub });
  const hasMedia = Boolean(video || image);

  return (
    <section
      id={id}
      ref={sceneRef}
      data-theme={theme}
      className={`bt-scene ${RUNWAY_CLASS[runway]} ${className}`.trim()}
    >
      <div className="bt-scene__sticky">
        {hasMedia && (
          <div className="bt-scene__media" data-scene-media>
            {video ? (
              <video
                // Ambient footage: silent, looping, and inline so iOS keeps it
                // in the page instead of taking over the screen. VideoWarden
                // decides which clips may actually decode at any moment.
                playsInline
                muted
                loop
                preload={priority ? "auto" : "metadata"}
                poster={poster}
                aria-hidden={mediaAlt ? undefined : true}
              >
                <source src={video} type="video/mp4" />
              </video>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={image}
                alt={mediaAlt}
                loading={priority ? "eager" : "lazy"}
                decoding={priority ? "sync" : "async"}
                fetchPriority={priority ? "high" : "auto"}
              />
            )}
          </div>
        )}

        {hasMedia && overlay && <div className="bt-scene__overlay" aria-hidden="true" />}

        <div className={`bt-scene__content ${contentClassName}`.trim()}>{children}</div>
      </div>
    </section>
  );
}

/* The reveal slots, so a section marks its layers by meaning rather than by
 * remembering the right data attribute. */

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
  /** Each line reveals in turn, so the headline arrives as a thought. */
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
