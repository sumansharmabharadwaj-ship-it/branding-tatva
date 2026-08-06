"use client";

import { useEffect } from "react";

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

    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          const active = entry.isIntersecting && entry.intersectionRatio >= 0.1;
          section.dataset.homeSceneState = active ? "active" : "resting";

          if (active) {
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
    mutationObserver = new MutationObserver(registerSections);
    mutationObserver.observe(main, { childList: true, subtree: true });

    return () => {
      mutationObserver?.disconnect();
      sectionObserver?.disconnect();
      observed.forEach((section) => {
        delete section.dataset.homeSceneObserved;
        delete section.dataset.homeSceneState;
      });
      observed.clear();
    };
  }, []);

  return null;
}
