"use client";

import { useEffect } from "react";
import { trackRuntimeIssue } from "@/lib/analytics";

const SECTION_SELECTOR = "[data-home-section], [data-home-chapter], [data-home-v4-chapter]";

/**
 * The V4 homepage now has one media owner: HomeV4MediaDirector. This legacy
 * director remains only as a lightweight scene-presence publisher because
 * older visual layers still read `data-home-scene-state` and the
 * `bt:home-scene-enter` event. Keeping video observation/playback here as well
 * caused two directors to repeatedly rewrite playback rate and eligibility.
 */
export function HomePacingDirector() {
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;

    const observed = new Set<HTMLElement>();
    let sectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    const visibilityTimers = new Map<HTMLElement, number>();

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
          const style = window.getComputedStyle(plane);
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.top < window.innerHeight &&
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity || 1) > 0.05
          );
        },
      );
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
      visibilityTimers.forEach((timer) => window.clearTimeout(timer));
      visibilityTimers.clear();
      observed.forEach((section) => {
        delete section.dataset.homeSceneObserved;
        delete section.dataset.homeSceneState;
      });
      observed.clear();
    };
  }, []);

  return null;
}
