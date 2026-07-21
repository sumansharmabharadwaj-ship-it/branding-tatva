"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { kenBurnsAnimation } from "@/animations/kenBurns";
import { useLazyMount } from "@/hooks/useLazyMount";
import { BREAK_OVERLAY_GRADIENT } from "@/lib/media";

const KEN_BURNS = kenBurnsAnimation({ scale: 1.06, duration: 26 });

// The photographic backdrop behind each Five Elements row. First fix
// (16% opacity + mix-blend-mode: color) crushed the photo to a barely
// visible tint. Second attempt kept real photo opacity but painted a
// 55-70%-opaque cream gradient on top for text contrast — direct
// feedback that this was just as washed-out, only cream instead of
// grey. This now reuses the same dark overlay every other photo/video
// section on the site already uses (BREAK_OVERLAY_GRADIENT), which is
// why the row's text also flips to ivory in page.tsx — dark text was
// only ever legible against the old cream wash, not against a photo
// that's actually visible. Photo shows at real opacity, and where a
// matching clip exists (video), cross-fades into a continuously-
// playing loop once the row nears the viewport instead of just
// drifting via Ken Burns — the image alone still carries the Ken
// Burns drift as the poster/fallback. A light tint in the element's
// own color keeps the five rows reading as one coherent set rather
// than five unrelated photos or clips.
export function ElementRowBackground({
  image,
  video,
  color,
  imagePosition = "center",
  active = true,
}: {
  image: string;
  video?: string;
  color: string;
  imagePosition?: string;
  // Lets a caller with several of these mounted at once (PinnedSlider:
  // all five slides exist in the DOM simultaneously, distinguished only
  // by opacity) pause every video but the one actually on screen,
  // instead of five autoplaying loops decoding behind each other at
  // once. Defaults to true so the row-list usage (VerticalUnfold),
  // where every mounted row is genuinely meant to play, is unaffected.
  active?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, shouldLoad] = useLazyMount();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad || prefersReducedMotion) return;
    if (active) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [shouldLoad, prefersReducedMotion, active]);

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        initial={KEN_BURNS.initial}
        animate={prefersReducedMotion ? undefined : KEN_BURNS.animate}
        transition={KEN_BURNS.transition}
      >
        {/* priority only for the active instance — next/image's own
            default lazy loading is an independent, unreliable second
            gate on top of this row already being scroll-position-aware
            (Ken Burns only animates once near view, the matching video
            only loads via useLazyMount below); confirmed elsewhere on
            this site that an image scrolled fully into view can still
            never fire native lazy-load on its own. But PinnedSlider
            mounts all five of these at once from page load (opacity is
            all that distinguishes them), so unconditional priority
            meant five full-size images force-loading immediately
            regardless of which one is actually visible — real,
            avoidable weight at first load. Only the visible slide
            needs the eager/high-priority fetch; the rest can lazy-load
            normally since they won't be seen until scrolled into their
            turn anyway. */}
        <Image
          src={image}
          alt=""
          fill
          priority={active}
          loading={active ? undefined : "lazy"}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: imagePosition }}
        />
      </motion.div>
      {video && shouldLoad && !prefersReducedMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: videoReady ? 1 : 0, objectPosition: imagePosition }}
          onCanPlay={() => setVideoReady(true)}
          src={video}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: color, opacity: 0.16, mixBlendMode: "multiply" }} />
      <div className="absolute inset-0" style={{ backgroundImage: BREAK_OVERLAY_GRADIENT }} />
    </div>
  );
}
