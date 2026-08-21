"use client";

import { useEffect, type RefObject } from "react";

// Fades a video element in once it has data for its current frame, via
// a ref instead of the video's onLoadedData JSX prop. That prop
// attaches its listener through React's synthetic event system some
// time after mount — for a small, CDN-cached video that finishes
// loading fast enough, the native `loadeddata` event can fire before
// that listener is attached, and is missed entirely. With nothing left
// to ever flip opacity to 1, the video stays invisible forever (only
// the poster/photo underneath ever renders) even though the video
// itself has fully loaded and could be playing — confirmed live on a
// case-study hero (readyState 4, opacity stuck at 0). Checking
// readyState immediately after attaching the listener here closes that
// race: either the video already has data (fade in immediately) or the
// listener catches the future event — no window where both miss.
//
// Also calls play() explicitly rather than trusting the bare `autoplay`
// HTML attribute alone — confirmed live on the same hero that autoplay
// wasn't reliably kicking in (video.paused stayed true with a fully
// loaded, muted, autoplay video), while an explicit play() call
// resolved immediately with no error. Harmless to call on a video
// that's already playing.
export function useVideoFadeIn(ref: RefObject<HTMLVideoElement | null>, active: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const video = el;
    if (!active) {
      video.pause();
      return;
    }

    let inView = false;

    function syncPlayback() {
      if (inView) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }

    // Keep offscreen background footage from occupying a decoder. Long
    // cinematic pages can contain many video-backed chapters, while the
    // visitor can only see one or two boundaries at a time. Intersection
    // state is tied to the actual viewport and avoids relying on document
    // visibility, which is unreliable in the cloud review pane.
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              inView = Boolean(entry?.isIntersecting);
              syncPlayback();
            },
            { threshold: 0.04 }
          );

    if (observer) {
      observer.observe(video);
    } else {
      inView = true;
      syncPlayback();
    }

    if (video.readyState >= 2) {
      video.style.opacity = "1";
    }
    function onLoadedData() {
      video.style.opacity = "1";
    }
    video.addEventListener("loadeddata", onLoadedData);
    return () => {
      observer?.disconnect();
      video.removeEventListener("loadeddata", onLoadedData);
      video.pause();
    };
  }, [ref, active]);
}
