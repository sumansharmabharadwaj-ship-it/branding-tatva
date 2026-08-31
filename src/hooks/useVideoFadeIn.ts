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
// HTML attribute alone — but only when the video is close to the viewport.
// Starting every background once before immediately pausing it allowed long
// article/topic pages to begin downloading all of their films at mount.
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
export function useVideoFadeIn(
  ref: RefObject<HTMLVideoElement | null>,
  active: boolean,
  playbackManagedExternally = false,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    if (el.readyState >= 2) {
      el.style.opacity = "1";
    } else {
      el.addEventListener("loadeddata", onLoadedData);
    }
    function onLoadedData() {
      if (el) el.style.opacity = "1";
    }

    const observer = playbackManagedExternally
      ? null
      : new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !document.hidden) {
              el.play().catch(() => {});
            } else {
              el.pause();
            }
          },
          { rootMargin: "25% 0px" },
        );

    // IntersectionObserver reports asynchronously. Establish the correct
    // initial state synchronously so an offscreen autoplay element never gets
    // a head start on the network while a visible hero still needs bandwidth.
    if (!playbackManagedExternally) {
      const rect = el.getBoundingClientRect();
      const margin = window.innerHeight * 0.25;
      const nearViewport = rect.bottom >= -margin && rect.top <= window.innerHeight + margin;
      if (nearViewport && !document.hidden) el.play().catch(() => {});
      else el.pause();
    }

    function syncVisibility() {
      if (!el) return;
      if (document.hidden) el.pause();
      else {
        const nextRect = el.getBoundingClientRect();
        const nextMargin = window.innerHeight * 0.25;
        if (nextRect.bottom >= -nextMargin && nextRect.top <= window.innerHeight + nextMargin) {
          el.play().catch(() => {});
        }
      }
    }

    observer?.observe(el);
    if (!playbackManagedExternally) {
      document.addEventListener("visibilitychange", syncVisibility);
    }

    return () => {
      el.removeEventListener("loadeddata", onLoadedData);
      observer?.disconnect();
      if (!playbackManagedExternally) {
        document.removeEventListener("visibilitychange", syncVisibility);
      }

      // Release the media element itself, which React removing the node does
      // not do. A <source media="..."> registers a MediaQueryList listener,
      // and those are held by a Blink GC root ("Pending activities"). Traced
      // from a heap snapshot: that root held the listener, which held the
      // <source>, which held its parent <video>, which held the whole
      // section's DOM. Every visit to a page with responsive video sources
      // stranded another copy, around 3,150 nodes a round trip on Services,
      // growing without limit.
      //
      // Dropping the sources and calling load() resets the element and lets
      // the listeners go. Clear each responsive source's media query while
      // it is still attached so Blink can unregister its MediaQueryList
      // listener before React detaches the source node. Order matters: pause
      // first so no fetch is in flight, reset the attached source list, and
      // only then remove it.
      try {
        el.pause();
        const sources = Array.from(el.querySelectorAll("source"));
        for (const source of sources) {
          source.removeAttribute("media");
          source.removeAttribute("src");
        }
        el.removeAttribute("src");
        el.load();
        for (const source of sources) source.remove();
        el.load();
      } catch {
        // Releasing is best effort. A browser that objects to any step here
        // leaves the element as it was rather than breaking the unmount.
      }
    };
  }, [ref, active, playbackManagedExternally]);
}
