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
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenisInstance?: Lenis;
  }
}

const LenisContext = createContext<Lenis | null>(null);

function readCssPixelValue(value: string) {
  const parsedValue = Number.parseFloat(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function getAnchorRestingTop(target: HTMLElement, scrollRoot: HTMLElement) {
  const targetStyles = window.getComputedStyle(target);
  const rootStyles = window.getComputedStyle(scrollRoot);

  return (
    readCssPixelValue(targetStyles.scrollMarginTop) +
    readCssPixelValue(rootStyles.scrollPaddingTop)
  );
}

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();

  useEffect(() => {
    if (!hydrated || !prefersReducedMotion || !window.location.hash) return;

    let cancelled = false;
    let attempts = 0;
    let timer: number | null = null;

    function cancelHashRecovery() {
      cancelled = true;
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
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

    function alignHashWithoutMotion() {
      if (cancelled || attempts >= 6) return;

      let target: HTMLElement | null = null;
      try {
        target = document.querySelector<HTMLElement>(window.location.hash);
      } catch {}
      if (!target) return;

      const restingTop = getAnchorRestingTop(target, document.documentElement);
      const alreadyThere = Math.abs(target.getBoundingClientRect().top - restingTop) <= 1;
      if (alreadyThere && attempts > 0) return;

      attempts += 1;
      target.scrollIntoView({ behavior: "auto", block: "start" });
      if (attempts < 6 && !cancelled) {
        timer = window.setTimeout(() => {
          timer = null;
          alignHashWithoutMotion();
        }, 350);
      }
    }

    // Native hash navigation may happen before fonts and client-only scenes
    // settle. Re-align without animation, but immediately yield to any real
    // visitor input so accessibility preferences never create scroll fights.
    window.addEventListener("wheel", cancelHashRecovery, { passive: true });
    window.addEventListener("touchstart", cancelHashRecovery, { passive: true });
    window.addEventListener("keydown", onManualKey);
    alignHashWithoutMotion();
    document.fonts?.ready?.then(alignHashWithoutMotion);

    return () => {
      cancelHashRecovery();
      window.removeEventListener("wheel", cancelHashRecovery);
      window.removeEventListener("touchstart", cancelHashRecovery);
      window.removeEventListener("keydown", onManualKey);
    };
  }, [hydrated, pathname, prefersReducedMotion]);

  useEffect(() => {
    const usesNativeSceneScroll = pathname === "/" || pathname === "/contact";

    // Home and Contact already compose native scroll into full-height camera
    // scenes. Keeping input at a true 1:1 response prevents Lenis momentum
    // from competing with their own forgiving scene settling. Other routes
    // retain the existing soft scroll.
    if (!hydrated || prefersReducedMotion || usesNativeSceneScroll) return;

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
      // Hydration can move a chapter by a few pixels after the browser's
      // native hash jump. Finish recovery only when the anchor is genuinely
      // aligned. Lenis honours the same CSS scroll margin and padding as the
      // browser, so compare against that shared resting point instead of the
      // viewport edge. This keeps anchored controls clear of fixed headers.
      const restingTop = getAnchorRestingTop(target, instance.rootElement);
      const alreadyThere = Math.abs(rect.top - restingTop) <= 1;
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
  }, [hydrated, pathname, prefersReducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
