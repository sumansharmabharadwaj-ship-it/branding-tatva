"use client";

import { useEffect } from "react";
import { trackRuntimeIssue } from "@/lib/analytics";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const SECTION_SELECTOR = "[data-home-section], [data-home-chapter], [data-home-v4-chapter]";
const CINEMATIC_MOTION_QUERY =
  "(min-width: 901px) and (min-height: 640px) and (pointer: fine)";

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

/**
 * The V4 homepage has one scene-motion owner and one media owner. This
 * director publishes scene presence plus small visitor-controlled camera
 * variables; HomeV4MediaDirector exclusively owns video playback and preload.
 * Keeping those responsibilities separate prevents scroll motion from
 * rewriting playback rate or eligibility.
 */
export function HomePacingDirector() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;
    const homeRoot = main.querySelector<HTMLElement>("[data-home-v4]");

    const observed = new Set<HTMLElement>();
    let sectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    const visibilityTimers = new Map<HTMLElement, number>();
    const recoveryFrames = new Map<HTMLElement, number>();
    let qaProbeTimer: number | null = null;
    let motionFrame = 0;
    let previousScrollY = window.scrollY;
    let previousMotionTime = performance.now();
    let smoothedVelocity = 0;
    let scrollDirection = 1;
    let pointerX = 0;
    let pointerY = 0;
    const cinematicMotion = window.matchMedia(CINEMATIC_MOTION_QUERY);

    function clearCinematicMotion() {
      if (!homeRoot) return;
      delete homeRoot.dataset.homeMotion;
      delete homeRoot.dataset.homeScrollDirection;
      [
        "--home-page-progress",
        "--home-pointer-x",
        "--home-pointer-y",
        "--home-scroll-velocity",
        "--home-velocity-y",
      ].forEach((property) => homeRoot.style.removeProperty(property));
      observed.forEach((section) => {
        [
          "--home-scene-progress",
          "--home-scene-presence",
          "--home-media-y",
          "--home-content-y",
        ].forEach((property) => section.style.removeProperty(property));
      });
    }

    function renderCinematicMotion(now: number) {
      motionFrame = 0;
      if (!homeRoot || prefersReducedMotion || !cinematicMotion.matches) {
        clearCinematicMotion();
        return;
      }

      const viewport = Math.max(1, window.innerHeight);
      const currentScrollY = window.scrollY;
      const elapsed = Math.max(16, now - previousMotionTime);
      const delta = currentScrollY - previousScrollY;
      const rawVelocity = Math.min(1, Math.abs(delta) / elapsed / 1.35);
      smoothedVelocity += (rawVelocity - smoothedVelocity) * 0.22;

      homeRoot.dataset.homeMotion = "live";
      if (Math.abs(delta) > 0.25) {
        scrollDirection = delta > 0 ? 1 : -1;
        homeRoot.dataset.homeScrollDirection = scrollDirection > 0 ? "forward" : "backward";
      }

      const scrollRange = Math.max(1, document.documentElement.scrollHeight - viewport);
      homeRoot.style.setProperty(
        "--home-page-progress",
        clamp(currentScrollY / scrollRange).toFixed(5),
      );
      homeRoot.style.setProperty("--home-pointer-x", `${(pointerX * 5.5).toFixed(2)}px`);
      homeRoot.style.setProperty("--home-pointer-y", `${(pointerY * 3.5).toFixed(2)}px`);
      homeRoot.style.setProperty("--home-scroll-velocity", smoothedVelocity.toFixed(4));
      homeRoot.style.setProperty(
        "--home-velocity-y",
        `${(-scrollDirection * smoothedVelocity * 5).toFixed(2)}px`,
      );

      observed.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        const progress = clamp((viewport - bounds.top) / (viewport + bounds.height));
        const travel = progress * 2 - 1;
        const centre = bounds.top + bounds.height / 2;
        const presence = clamp(
          1 - Math.abs(centre - viewport / 2) / ((viewport + bounds.height) * 0.53),
        );

        section.style.setProperty("--home-scene-progress", progress.toFixed(4));
        section.style.setProperty("--home-scene-presence", presence.toFixed(4));
        section.style.setProperty("--home-media-y", `${(-travel * 9).toFixed(2)}px`);
        section.style.setProperty("--home-content-y", `${(-travel * 4.5).toFixed(2)}px`);
      });

      previousScrollY = currentScrollY;
      previousMotionTime = now;
      if (smoothedVelocity > 0.01) {
        motionFrame = window.requestAnimationFrame(renderCinematicMotion);
      }
    }

    function scheduleCinematicMotion() {
      if (!motionFrame) motionFrame = window.requestAnimationFrame(renderCinematicMotion);
    }

    function trackPointer(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      pointerX = clamp(event.clientX / Math.max(1, window.innerWidth), 0, 1) * 2 - 1;
      pointerY = clamp(event.clientY / Math.max(1, window.innerHeight), 0, 1) * 2 - 1;
      scheduleCinematicMotion();
    }

    function releasePointer() {
      pointerX = 0;
      pointerY = 0;
      scheduleCinematicMotion();
    }

    function sceneId(section: HTMLElement) {
      return (
        section.dataset.homeV4Chapter ||
        section.dataset.homeChapter ||
        section.dataset.homeSection ||
        section.id ||
        "unknown"
      );
    }

    function hasVisibleReadingPlane(section: HTMLElement) {
      return [...section.querySelectorAll<HTMLElement>("[data-home-reading-plane]")].some(
        (plane) => {
          const rect = plane.getBoundingClientRect();
          let rendered = true;
          let effectiveOpacity = 1;
          let current: HTMLElement | null = plane;

          while (current) {
            const style = window.getComputedStyle(current);
            effectiveOpacity *= Number(style.opacity || 1);
            if (style.display === "none" || style.visibility === "hidden") rendered = false;
            if (current === section) break;
            current = current.parentElement;
          }

          return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.top < window.innerHeight &&
            rendered &&
            effectiveOpacity > 0.05
          );
        },
      );
    }

    function forceReadableFallback(section: HTMLElement) {
      section.dataset.homeSceneRecovery = "forced";
      section.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      const recoveryNodes = new Set<HTMLElement>([section]);
      section
        .querySelectorAll<HTMLElement>("[data-home-reading-plane]")
        .forEach((plane) => {
          let current: HTMLElement | null = plane;
          while (current) {
            recoveryNodes.add(current);
            if (current === section) break;
            current = current.parentElement;
          }
        });
      recoveryNodes.forEach((node) => {
        node.style.setProperty("animation", "none", "important");
        node.style.setProperty("transition", "none", "important");
        node.style.setProperty("opacity", "1", "important");
        node.style.setProperty("visibility", "visible", "important");
        node.style.setProperty("transform", "none", "important");
        node.style.setProperty("filter", "none", "important");
        node.style.setProperty("clip-path", "none", "important");
      });

      const existingFrame = recoveryFrames.get(section);
      if (existingFrame) window.cancelAnimationFrame(existingFrame);
      const frame = window.requestAnimationFrame(() => {
        recoveryFrames.delete(section);
        if (section.dataset.homeSceneState !== "active") return;
        if (!hasVisibleReadingPlane(section)) return;
        section.dataset.homeSceneContent = "visible";
        trackRuntimeIssue("scene_visibility_recovered", { scene: sceneId(section) });
      });
      recoveryFrames.set(section, frame);
    }

    function scheduleVisibilityCheck(section: HTMLElement) {
      const existing = visibilityTimers.get(section);
      if (existing) window.clearTimeout(existing);
      const timer = window.setTimeout(() => {
        visibilityTimers.delete(section);
        if (section.dataset.homeSceneState !== "active") return;
        const visible = hasVisibleReadingPlane(section);
        if (!visible) {
          section.dataset.homeSceneContent = "missing";
          trackRuntimeIssue("scene_visibility_failed", { scene: sceneId(section) });
          forceReadableFallback(section);
          return;
        }
        if (section.dataset.homeSceneContent === "missing") {
          trackRuntimeIssue("scene_visibility_recovered", { scene: sceneId(section) });
        }
        section.dataset.homeSceneContent = "visible";
      }, 400);
      visibilityTimers.set(section, timer);
    }

    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          const active = entry.isIntersecting && entry.intersectionRatio >= 0.1;
          section.dataset.homeSceneState = active ? "active" : "resting";

          if (active) {
            scheduleVisibilityCheck(section);
            window.dispatchEvent(
              new CustomEvent("bt:home-scene-enter", {
                detail: {
                  id:
                    sceneId(section),
                },
              }),
            );
          }
        });
      },
      {
        rootMargin: "7% 0px -9% 0px",
        threshold: [0, 0.1, 0.25, 0.48],
      },
    );

    // A hoisted `function` declaration loses the `if (!main) return` narrowing
    // above, because TypeScript has to assume it could be called before that
    // guard ran. A const arrow keeps it.
    const registerSections = () => {
      main.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach((section) => {
        if (observed.has(section)) return;
        observed.add(section);
        section.dataset.homeSceneObserved = "true";
        section.dataset.homeSceneState = "resting";
        sectionObserver?.observe(section);
      });

      observed.forEach((section) => {
        if (main.contains(section)) return;
        sectionObserver?.unobserve(section);
        observed.delete(section);
      });
    };

    registerSections();
    scheduleCinematicMotion();
    window.addEventListener("scroll", scheduleCinematicMotion, { passive: true });
    window.addEventListener("resize", scheduleCinematicMotion, { passive: true });
    window.addEventListener("pointermove", trackPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", releasePointer);
    cinematicMotion.addEventListener("change", scheduleCinematicMotion);

    // Deployed previews expose a bounded failure-injection hook so the recovery
    // contract can be verified in the real browser without shipping a failure
    // mode on the public brandingtatva.com domain.
    const qaProbeRequested =
      window.location.hostname.endsWith(".vercel.app") &&
      new URLSearchParams(window.location.search).get("qa-home-scene-recovery") === "ancestor";
    if (qaProbeRequested) {
      qaProbeTimer = window.setTimeout(() => {
        const section =
          [...observed].find((candidate) => candidate.dataset.homeSceneState === "active") ??
          [...observed][0];
        const plane = section?.querySelector<HTMLElement>("[data-home-reading-plane]");
        if (!section || !plane) return;

        const injectedAncestor = plane.parentElement ?? plane;
        injectedAncestor.style.setProperty("opacity", "0", "important");
        injectedAncestor.style.setProperty("transform", "translateX(120vw)", "important");
        section.dataset.homeSceneRecoveryProbe = "injected";
        section.dataset.homeSceneState = "active";
        scheduleVisibilityCheck(section);
      }, 50);
    }

    mutationObserver = new MutationObserver((mutations) => {
      registerSections();
      const changedActiveSections = new Set<HTMLElement>();
      mutations.forEach((mutation) => {
        const section = mutation.target instanceof Element
          ? mutation.target.closest<HTMLElement>(SECTION_SELECTOR)
          : null;
        if (section?.dataset.homeSceneState === "active") changedActiveSections.add(section);
      });
      changedActiveSections.forEach(scheduleVisibilityCheck);
    });
    mutationObserver.observe(main, { childList: true, subtree: true });

    return () => {
      mutationObserver?.disconnect();
      sectionObserver?.disconnect();
      window.cancelAnimationFrame(motionFrame);
      window.removeEventListener("scroll", scheduleCinematicMotion);
      window.removeEventListener("resize", scheduleCinematicMotion);
      window.removeEventListener("pointermove", trackPointer);
      document.documentElement.removeEventListener("pointerleave", releasePointer);
      cinematicMotion.removeEventListener("change", scheduleCinematicMotion);
      clearCinematicMotion();
      if (qaProbeTimer !== null) window.clearTimeout(qaProbeTimer);
      visibilityTimers.forEach((timer) => window.clearTimeout(timer));
      visibilityTimers.clear();
      recoveryFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      recoveryFrames.clear();
      observed.forEach((section) => {
        delete section.dataset.homeSceneObserved;
        delete section.dataset.homeSceneState;
        delete section.dataset.homeSceneContent;
        delete section.dataset.homeSceneRecovery;
        delete section.dataset.homeSceneRecoveryProbe;
      });
      observed.clear();
    };
  }, [prefersReducedMotion]);

  return null;
}
