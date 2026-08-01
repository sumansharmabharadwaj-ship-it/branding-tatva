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
// Also pauses the video whenever it scrolls fully offscreen and resumes
// it when it returns. A production Playwright sweep of Services found
// all ten of the page's background videos decoding simultaneously —
// every one of them, including nine that were nowhere near the
// viewport. Ten concurrent decodes is real, page-wide work fighting the
// scroll's frame budget for no visible benefit. A 25% rootMargin keeps
// the resume ahead of the reveal, so a video is already playing again
// by the time any part of it is actually visible — no visible freeze
// frame on the way in. Only this hook's consumers (the always-on
// full-bleed backgrounds: PhotoHero, TexturedDark, BackgroundVideo,
// FeaturedWorkHero) get this; stage-managed components (PinnedSlider
// etc.) own their play/pause explicitly and don't run through here.
export function useVideoFadeIn(ref: RefObject<HTMLVideoElement | null>, active: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    el.play().catch(() => {});
    if (el.readyState >= 2) {
      el.style.opacity = "1";
    } else {
      el.addEventListener("loadeddata", onLoadedData);
    }
    function onLoadedData() {
      if (el) el.style.opacity = "1";
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "25% 0px" }
    );
    observer.observe(el);

    return () => {
      el.removeEventListener("loadeddata", onLoadedData);
      observer.disconnect();
    };
  }, [ref, active]);
}
