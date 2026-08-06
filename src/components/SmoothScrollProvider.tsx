"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const isHomepage = pathname === "/";
    const instance = new Lenis({
      // V4 needs immediate response with a short, soft settle. The rest
      // of the site keeps its quieter historical damping.
      lerp: isHomepage ? 0.145 : 0.1,
      wheelMultiplier: isHomepage ? 1 : 0.92,
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
    let hashScrollCancelled = false;
    // window.setTimeout returns a number in the browser. Deriving the type
    // from typeof window.setTimeout picks up Node's overload once @types/node
    // is in scope, which broke the build.
    let hashTimer: number | null = null;

    function cancelHashRecovery() {
      hashScrollCancelled = true;
      if (hashTimer !== null) {
        window.clearTimeout(hashTimer);
        hashTimer = null;
      }
    }

    function onManualKey(event: KeyboardEvent) {
      if (
        event.key === "PageDown" ||
        event.key === "PageUp" ||
        event.key === "Home" ||
        event.key === "End" ||
        event.key === " " ||
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
      ) {
        cancelHashRecovery();
      }
    }

    // Hash recovery exists only to repair initial browser alignment after
    // fonts/layout hydrate. The moment the visitor wheels, touches, or uses a
    // scrolling key, that explicit input wins and no delayed timeout may pull
    // the page back to the original anchor.
    window.addEventListener("wheel", cancelHashRecovery, { passive: true });
    window.addEventListener("touchstart", cancelHashRecovery, { passive: true });
    window.addEventListener("keydown", onManualKey);

    function scrollToHash() {
      if (hashScrollCancelled || !window.location.hash || hashScrollAttempts >= 6) return;

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
      if (hashScrollAttempts < 6 && !hashScrollCancelled) {
        hashTimer = window.setTimeout(() => {
          hashTimer = null;
          scrollToHash();
        }, 350);
      }
    }

    function refresh() {
      instance.resize();
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
      if (hashTimer !== null) window.clearTimeout(hashTimer);
      window.removeEventListener("wheel", cancelHashRecovery);
      window.removeEventListener("touchstart", cancelHashRecovery);
      window.removeEventListener("keydown", onManualKey);
      gsap.ticker.remove(ticker);
      instance.destroy();
      setLenis(null);
      delete window.__lenisInstance;
      window.removeEventListener("load", refresh);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pathname]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
