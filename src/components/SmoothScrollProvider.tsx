"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lenis drives the actual page scroll (a real, eased scrollTo each frame
// via GSAP's ticker — not a transform-based virtual scroll), so native
// `window.scrollY` and the native `scroll` event both stay accurate.
// The one prior failure here (see git history: "Revert Lenis + GSAP
// ScrollTrigger integration") was a component reading window.scrollY via
// its own addEventListener("scroll", ...) instead of Lenis's own scroll
// event — Lenis batches/dispatches scroll updates through its own emitter,
// and components need to subscribe to that via useLenis() rather than
// assume the native event still fires on every tick.
//
// Skipped entirely under prefers-reduced-motion — smooth/eased scrolling
// is exactly the kind of motion that preference exists to turn off.
// Consumers of useLenis() must fall back to native scroll behavior when
// this returns null.

// window.lenis is already reserved by the lenis package's own type
// declarations (an unrelated config-detection shape), hence the
// underscore-prefixed name here instead.
declare global {
  interface Window {
    __lenisInstance?: Lenis;
  }
}

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Options made explicit rather than left as unstated defaults, so a
    // future edit doesn't accidentally change the scroll feel without
    // realizing it was ever a deliberate choice:
    //
    // lerp: 0.1 — Lenis's own default, and the right one specifically
    // because PinnedJourney/PinnedSlider/MeadowClosing all compute their
    // progress from wrapper.getBoundingClientRect().top, which reflects
    // this *smoothed* scroll position, not raw wheel delta. A lower lerp
    // would lag those pinned sections behind the user's own scrolling; a
    // higher one approaches "barely smoothed," undercutting the reason
    // Lenis is here at all.
    //
    // duration/easing deliberately left unset — traced through Lenis's
    // own source (node_modules/lenis/dist/lenis.mjs): every wheel/touch
    // delta calls scrollTo() again, which resets the tween's elapsed
    // time on every single input event. A duration+easing tween never
    // gets to play out its curve under continuous scrolling; only
    // lerp's frame-rate-independent damping is correct for that. That
    // mode's real use case is a one-shot destination (see scrollToHash
    // below, which intentionally uses `{ immediate: true }` instead
    // since it's correcting drift after the fact, not the primary case
    // duration/easing was built for).
    //
    // wheelMultiplier/touchMultiplier: 1 — kept at 1:1 since the three
    // pinned sections' own scroll-distance math ((N+1) * 100vh wrapper
    // heights) is tuned against real wheel/touch delta; rescaling either
    // would require re-tuning all three together, a separate change.
    //
    // syncTouch: false — this site has no drag-synced canvas/WebGL scene
    // that would need JS-mimicked touch scroll, and Lenis's own docs
    // flag that mode as unstable on iOS < 16, so there's no reason to
    // take on that risk for no benefit here.
    const instance = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.92,
      touchMultiplier: 1,
      syncTouch: false,
    });
    instance.on("scroll", ScrollTrigger.update);
    setLenis(instance);

    function ticker(time: number) {
      instance.raf(time * 1000);
    }
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Exposed on window as a debugging hook (e.g. console-testing
    // `window.__lenisInstance.scrollTo(...)`).
    window.__lenisInstance = instance;

    // A URL like /services#brand-beginning relies on the browser's own
    // native "scroll to the element matching location.hash" behavior on
    // load — but Lenis takes over scroll control the moment it mounts,
    // before that native scroll reliably resolves, and sections built on
    // client-only pinned-scroll components (ProcessSection's 700vh
    // wrapper, the Five Elements slider) don't establish their real
    // height until they mount and measure themselves on the client. A
    // single well-timed scroll consistently overshot by almost exactly
    // one such section's own height, which points at something in that
    // mounting process (GSAP's ScrollTrigger.refresh() among the likely
    // culprits, since it runs right alongside this) nudging scroll
    // position on its own terms after the fact — not worth chasing the
    // exact mechanism when the actual goal is simple: land on the
    // target and stay there. This scrolls once, then rechecks and
    // re-corrects a few times over the next couple of seconds, so
    // whatever moves the target after the first attempt gets overridden
    // rather than needing to be predicted in advance.
    let hashScrollAttempts = 0;
    function scrollToHash() {
      if (!window.location.hash || hashScrollAttempts >= 6) return;
      let target: HTMLElement | null = null;
      try {
        target = document.querySelector<HTMLElement>(window.location.hash);
      } catch {
        // location.hash can contain characters that aren't a valid CSS
        // selector (e.g. a bare numeric id) — not this site's own
        // links, but worth not throwing on if one ever shows up.
      }
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const alreadyThere = rect.top > -4 && rect.top < window.innerHeight * 0.5;
      if (alreadyThere && hashScrollAttempts > 0) return;

      hashScrollAttempts += 1;
      instance.resize();
      instance.scrollTo(target, { immediate: true });
      if (hashScrollAttempts < 6) {
        window.setTimeout(scrollToHash, 350);
      }
    }

    // Every ScrollTrigger on the page (pinned or not) has its start/end
    // positions computed from whatever the DOM measures at the moment
    // each one is created — usually before images have finished loading
    // or web fonts have swapped in, both of which can change section
    // heights after the fact. A resize triggers GSAP's own automatic
    // refresh, but neither of these does, so nothing currently corrects
    // for it. Refreshing once after the page and fonts have actually
    // settled catches both without forcing every trigger to guess at a
    // width/height that hasn't stabilized yet.
    function refresh() {
      ScrollTrigger.refresh();
      scrollToHash();
    }
    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh);
    }
    document.fonts?.ready?.then(refresh);

    // A backgrounded tab throttles rAF, which is what GSAP's ticker (and
    // therefore every scrub/pin ScrollTrigger, including the Process
    // section's horizontal pin) runs on. A tab minimized or switched away
    // from mid-scroll can come back with a pinned section's `x` tween
    // stalled at a stale scroll position while the *real* scroll offset
    // has moved on underneath it — the pin's `position: fixed` state and
    // the actual scroll position disagree, and until something forces a
    // recalculation, the section renders wrong (in the worst case,
    // pinned content sitting outside the current viewport entirely,
    // which looks like the page going blank at that scroll depth). Same
    // fix as the load-time refresh above, just triggered by regaining
    // visibility instead of by the page finishing its first load.
    function onVisibilityChange() {
      if (!document.hidden) refresh();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      gsap.ticker.remove(ticker);
      instance.destroy();
      setLenis(null);
      delete window.__lenisInstance;
      window.removeEventListener("load", refresh);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
