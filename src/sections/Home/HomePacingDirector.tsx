"use client";

import { useEffect } from "react";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { homeReadingOwnsMotion, watchHomeMotionOwnership } from "../HomeV4/homeMotionOwnership";

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
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  useEffect(() => {
    if (!hydrated || prefersReducedMotion) return;
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
    let disposed = false;

    function motionIsHeld() {
      return document.hidden || reducedMotion.matches || homeReadingOwnsMotion(root);
    }

    function markScrollIntent(duration = SCROLL_INTENT_WINDOW_MS) {
      scrollIntentUntil = Date.now() + duration;
    }

    function markPointerScrollIntent(event: WheelEvent | TouchEvent) {
      if (disposed || event.defaultPrevented || event.ctrlKey || motionIsHeld()) return;
      if ("touches" in event && event.touches.length > 1) return;
      markScrollIntent();
    }

    function markKeyboardScrollIntent(event: KeyboardEvent) {
      if (disposed || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing || !SCROLL_INTENT_KEYS.has(event.key) || motionIsHeld()) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, select, textarea, [contenteditable]:not([contenteditable='false'])")) return;
      markScrollIntent(720);
    }

    function settleMotionState() {
      window.clearTimeout(settleTimer);
      settleTimer = 0;
      scrollIntentUntil = 0;
      previousScrollY = window.scrollY;
      smoothedVelocity = 0;
      root.dataset.homeMotion = "idle";
      delete root.dataset.homeScrollDirection;
      root.style.setProperty("--home-scroll-velocity", "0");
    }

    function holdMotionState() {
      window.cancelAnimationFrame(motionFrame);
      motionFrame = 0;
      settleMotionState();
    }

    function clearMotionState() {
      window.clearTimeout(settleTimer);
      delete root.dataset.homeMotion;
      delete root.dataset.homeScrollDirection;
      root.style.removeProperty("--home-page-progress");
      root.style.removeProperty("--home-scroll-velocity");
      document.documentElement.style.removeProperty("--home-page-progress");
    }

    function publishMotionState() {
      motionFrame = 0;
      if (disposed) return;
      if (motionIsHeld()) {
        holdMotionState();
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
          if (!disposed) settleMotionState();
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
      if (disposed || document.hidden || motionFrame) return;
      motionFrame = window.requestAnimationFrame(publishMotionState);
    }

    function onReadingChange() {
      if (disposed) return;
      if (motionIsHeld()) holdMotionState();
      else previousScrollY = window.scrollY;
      scheduleMotionState();
    }

    function onLayoutChange() {
      if (disposed) return;
      holdMotionState();
      scheduleMotionState();
    }

    sectionObserver = new IntersectionObserver(
      (entries) => {
        if (disposed) return;
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
      if (disposed) return;
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
      layoutObserver = new ResizeObserver(onLayoutChange);
      layoutObserver.observe(root);
    }

    window.addEventListener("scroll", scheduleMotionState, { passive: true });
    window.addEventListener("resize", onLayoutChange, { passive: true });
    window.addEventListener("wheel", markPointerScrollIntent, { passive: true });
    window.addEventListener("touchmove", markPointerScrollIntent, { passive: true });
    window.addEventListener("keydown", markKeyboardScrollIntent);
    reducedMotion.addEventListener("change", onReadingChange);
    const stopWatchingOwnership = watchHomeMotionOwnership(onReadingChange);

    return () => {
      disposed = true;
      stopWatchingOwnership();
      mutationObserver?.disconnect();
      sectionObserver?.disconnect();
      layoutObserver?.disconnect();
      window.cancelAnimationFrame(motionFrame);
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", scheduleMotionState);
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("wheel", markPointerScrollIntent);
      window.removeEventListener("touchmove", markPointerScrollIntent);
      window.removeEventListener("keydown", markKeyboardScrollIntent);
      reducedMotion.removeEventListener("change", onReadingChange);
      observed.forEach((section) => {
        delete section.dataset.homeSceneObserved;
        delete section.dataset.homeSceneState;
      });
      observed.clear();
      clearMotionState();
    };
  }, [hydrated, prefersReducedMotion]);

  return null;
}
