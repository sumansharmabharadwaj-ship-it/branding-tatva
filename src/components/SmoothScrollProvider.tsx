"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

    // The homepage is paced like a trailer rather than a rapid document:
    // slightly lower damping and wheel force give each reveal time to land,
    // while staying responsive enough that the page never feels trapped.
    // Touch remains native-feeling because heavy smoothing on mobile creates
    // latency rather than suspense.
    const instance = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.8,
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
    window.__lenisInstance = instance;

    let hashScrollAttempts = 0;
    function scrollToHash() {
      if (!window.location.hash || hashScrollAttempts >= 6) return;
      let target: HTMLElement | null = null;
      try {
        target = document.querySelector<HTMLElement>(window.location.hash);
      } catch {}
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const alreadyThere = rect.top > -4 && rect.top < window.innerHeight * 0.5;
      if (alreadyThere && hashScrollAttempts > 0) return;

      hashScrollAttempts += 1;
      instance.resize();
      instance.scrollTo(target, { immediate: true });
      if (hashScrollAttempts < 6) window.setTimeout(scrollToHash, 350);
    }

    function refresh() {
      ScrollTrigger.refresh();
      scrollToHash();
    }
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh);
    document.fonts?.ready?.then(refresh);

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
