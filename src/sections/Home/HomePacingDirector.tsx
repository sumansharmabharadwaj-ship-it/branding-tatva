"use client";

import { useEffect } from "react";

const SECTION_SELECTOR = "[data-home-v4-chapter]";
const SCROLL_INTENT_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
const SCROLL_INTENT_WINDOW_MS = 480;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

/**
 * HomeV4MediaDirector is the sole owner of homepage video playback. This
 * director only publishes scene presence and a restrained, page-wide motion
 * signal for the restored handoffs.
 */
export function HomePacingDirector() {
  useEffect(() => {
    const main = document.getElementById("main-content");
    const homeRoot = main?.querySelector<HTMLElement>("[data-home-v4]");
    if (!main || !homeRoot) return;
    const mainContent = main;
    const root = homeRoot;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observed = new Set<HTMLElement>();
    let sectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let layoutObserver: ResizeObserver | null = null;
    let motionFrame = 0;
    let settleTimer = 0;
    let previousScrollY = window.scrollY;
    let smoothedVelocity = 0;
    let scrollIntentUntil = 0;

    function markScrollIntent(duration = SCROLL_INTENT_WINDOW_MS) {
      scrollIntentUntil = Date.now() + duration;
    }

    function markPointerScrollIntent() {
      markScrollIntent();
    }

    function markKeyboardScrollIntent(event: KeyboardEvent) {
      if (!SCROLL_INTENT_KEYS.has(event.key)) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, select, textarea, [contenteditable='true']")) return;
      markScrollIntent(720);
    }

    function clearMotionState() {
      window.clearTimeout(settleTimer);
      scrollIntentUntil = 0;
      delete root.dataset.homeMotion;
      delete root.dataset.homeScrollDirection;
      root.style.removeProperty("--home-page-progress");
      root.style.removeProperty("--home-scroll-velocity");
      document.documentElement.style.removeProperty("--home-page-progress");
    }

    function publishMotionState() {
      motionFrame = 0;
      if (reducedMotion.matches) {
        clearMotionState();
        return;
      }

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - previousScrollY;
      const viewport = Math.max(1, window.innerHeight);
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - viewport);
      const hasScrollIntent = Date.now() <= scrollIntentUntil;

      if (Math.abs(delta) > 0.5 && hasScrollIntent) {
        const rawVelocity = clamp(delta / viewport, -1, 1);
        smoothedVelocity += (rawVelocity - smoothedVelocity) * 0.24;
        root.dataset.homeScrollDirection = delta > 0 ? "forward" : "backward";
        root.dataset.homeMotion = "live";
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          scrollIntentUntil = 0;
          root.dataset.homeMotion = "idle";
          delete root.dataset.homeScrollDirection;
          smoothedVelocity = 0;
          root.style.setProperty("--home-scroll-velocity", "0");
        }, 160);
      } else if (root.dataset.homeMotion !== "live") {
        smoothedVelocity = 0;
        root.dataset.homeMotion = "idle";
      }
      const progress = clamp(currentScrollY / scrollRange).toFixed(5);
      root.style.setProperty("--home-page-progress", progress);
      root.style.setProperty("--home-scroll-velocity", smoothedVelocity.toFixed(4));
      document.documentElement.style.setProperty("--home-page-progress", progress);
      previousScrollY = currentScrollY;
    }

    function scheduleMotionState() {
      if (motionFrame) return;
      motionFrame = window.requestAnimationFrame(publishMotionState);
    }

    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          const active = entry.isIntersecting && entry.intersectionRatio >= 0.1;
          const wasActive = section.dataset.homeSceneState === "active";
          section.dataset.homeSceneState = active ? "active" : "resting";

          if (active && !wasActive) {
            window.dispatchEvent(
              new CustomEvent("bt:home-scene-enter", {
                detail: {
                  id:
                    section.dataset.homeV4Chapter ||
                    section.dataset.homeChapter ||
                    section.dataset.homeSection ||
                    section.id ||
                    undefined,
                },
              }),
            );
          }
        });
      },
      { rootMargin: "7% 0px -9% 0px", threshold: [0, 0.1, 0.25, 0.48] },
    );

    function registerSections() {
      mainContent.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach((section) => {
        if (observed.has(section)) return;
        observed.add(section);
        section.dataset.homeSceneObserved = "true";
        section.dataset.homeSceneState = "resting";
        sectionObserver?.observe(section);
      });

      observed.forEach((section) => {
        if (mainContent.contains(section)) return;
        sectionObserver?.unobserve(section);
        observed.delete(section);
      });
    }

    registerSections();
    scheduleMotionState();
    mutationObserver = new MutationObserver(registerSections);
    mutationObserver.observe(mainContent, { childList: true, subtree: true });

    if (typeof ResizeObserver !== "undefined") {
      layoutObserver = new ResizeObserver(scheduleMotionState);
      layoutObserver.observe(root);
    }

    window.addEventListener("scroll", scheduleMotionState, { passive: true });
    window.addEventListener("resize", scheduleMotionState, { passive: true });
    window.addEventListener("wheel", markPointerScrollIntent, { passive: true });
    window.addEventListener("touchmove", markPointerScrollIntent, { passive: true });
    window.addEventListener("keydown", markKeyboardScrollIntent);
    reducedMotion.addEventListener("change", scheduleMotionState);

    return () => {
      mutationObserver?.disconnect();
      sectionObserver?.disconnect();
      layoutObserver?.disconnect();
      window.cancelAnimationFrame(motionFrame);
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", scheduleMotionState);
      window.removeEventListener("resize", scheduleMotionState);
      window.removeEventListener("wheel", markPointerScrollIntent);
      window.removeEventListener("touchmove", markPointerScrollIntent);
      window.removeEventListener("keydown", markKeyboardScrollIntent);
      reducedMotion.removeEventListener("change", scheduleMotionState);
      observed.forEach((section) => {
        delete section.dataset.homeSceneObserved;
        delete section.dataset.homeSceneState;
      });
      observed.clear();
      clearMotionState();
    };
  }, []);

  return null;
}
