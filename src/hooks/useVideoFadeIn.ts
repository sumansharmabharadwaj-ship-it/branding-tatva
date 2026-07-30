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
export function useVideoFadeIn(ref: RefObject<HTMLVideoElement | null>, active: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    if (el.readyState >= 2) {
      el.style.opacity = "1";
      return;
    }
    function onLoadedData() {
      if (el) el.style.opacity = "1";
    }
    el.addEventListener("loadeddata", onLoadedData);
    return () => el.removeEventListener("loadeddata", onLoadedData);
  }, [ref, active]);
}
