"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * The motion half of the scene system. bt-scene.css holds the frame still;
 * this decides what changes inside it as the visitor scrolls through the
 * runway.
 *
 * Everything is opt in by data attribute rather than by ref plumbing, so a
 * section only animates the parts it actually marks, and a section that
 * marks nothing still renders correctly.
 *
 *   data-scene-media    the background layer, drifts on scale
 *   data-scene-eyebrow  the small label above the headline
 *   data-scene-line     one line of the headline, revealed in sequence
 *   data-scene-body     supporting copy, arrives after the headline lands
 *   data-scene-proof    proof points, cards or details, staggered last
 *
 * No element carries a hidden resting state in CSS. The start states below
 * are set by GSAP at runtime and only inside the media query that is going
 * to animate them back, so with JavaScript unavailable, animation disabled,
 * or a trigger that never fires, every word is still on screen and readable.
 */

type SceneOptions = {
  /** Scrub weight. Lower feels tighter, higher feels heavier. */
  scrub?: number;
  /** How far the background drifts across the scene, as a scale delta. */
  mediaDrift?: number;
  /** Where the headline enters from. Meaningful direction beats habit. */
  from?: "below" | "left" | "right";
};

export function useCinematicScene<T extends HTMLElement>(options: SceneOptions = {}) {
  const sceneRef = useRef<T | null>(null);
  const { scrub = 0.8, mediaDrift = 0.08, from = "below" } = options;

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    const build = (config: { drift: number; scrub: number; distance: number }) => {
      const ctx = gsap.context(() => {
        const media = scene.querySelector<HTMLElement>("[data-scene-media]");
        const eyebrow = scene.querySelector<HTMLElement>("[data-scene-eyebrow]");
        const lines = scene.querySelectorAll<HTMLElement>("[data-scene-line]");
        const body = scene.querySelector<HTMLElement>("[data-scene-body]");
        const proof = scene.querySelectorAll<HTMLElement>("[data-scene-proof]");

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "bottom bottom",
            scrub: config.scrub,
            invalidateOnRefresh: true,
          },
        });

        // Depth: the ground moves most, the type moves least, so the words
        // stay legible while the world behind them shifts.
        if (media) {
          timeline.fromTo(
            media,
            { scale: 1 + config.drift },
            { scale: 1.01, ease: "none" },
            0,
          );
        }

        if (eyebrow) {
          timeline.fromTo(
            eyebrow,
            { autoAlpha: 0, yPercent: 40 },
            { autoAlpha: 1, yPercent: 0, ease: "power2.out" },
            0.12,
          );
        }

        if (lines.length) {
          const entry =
            from === "left"
              ? { autoAlpha: 0, xPercent: -8 }
              : from === "right"
                ? { autoAlpha: 0, xPercent: 8 }
                : { autoAlpha: 0, yPercent: 110 };
          timeline.fromTo(
            lines,
            entry,
            {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              ease: "power3.out",
              stagger: 0.12,
            },
            0.22,
          );
        }

        if (body) {
          timeline.fromTo(
            body,
            { autoAlpha: 0, y: config.distance },
            { autoAlpha: 1, y: 0, ease: "power2.out" },
            0.5,
          );
        }

        if (proof.length) {
          timeline.fromTo(
            proof,
            { autoAlpha: 0, y: config.distance * 0.65 },
            { autoAlpha: 1, y: 0, ease: "power2.out", stagger: 0.1 },
            0.68,
          );
        }
      }, scene);

      return () => ctx.revert();
    };

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () =>
      build({ drift: mediaDrift, scrub, distance: 28 }),
    );

    // Tablet keeps the choreography and loses some of the depth, because a
    // heavy parallax layer costs more than it reads at this width.
    mm.add(
      "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      () => build({ drift: mediaDrift * 0.5, scrub: Math.min(scrub, 0.7), distance: 22 }),
    );

    // Phones get entrances only, tied to the section arriving rather than to
    // a scrub, since there is no runway to scrub across down here.
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const reveal = scene.querySelectorAll<HTMLElement>(
          "[data-scene-eyebrow],[data-scene-line],[data-scene-body],[data-scene-proof]",
        );
        if (!reveal.length) return;
        gsap.fromTo(
          reveal,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: scene,
              start: "top 78%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }, scene);
      return () => ctx.revert();
    });

    return () => {
      // Reverts every context this hook created, kills their ScrollTriggers,
      // and restores the inline styles GSAP set. Route changes and unmounts
      // both land here.
      mm.revert();
    };
  }, [scrub, mediaDrift, from]);

  return sceneRef;
}
