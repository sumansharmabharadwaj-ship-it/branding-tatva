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

    const instance = new Lenis();
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
