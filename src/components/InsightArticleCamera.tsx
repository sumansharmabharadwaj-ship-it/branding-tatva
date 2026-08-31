"use client";

import { useEffect } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function InsightArticleCamera() {
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".insight-article-page");
    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>(".insight-article-section"),
    );

    if (!root || chapters.length === 0) return;
    const articleRoot = root;

    if (prefersReducedMotion) {
      chapters.forEach((chapter) => {
        chapter.style.setProperty("--chapter-shift", "0px");
        chapter.style.setProperty("--chapter-focus", "1");
        chapter.style.setProperty("--chapter-progress", "1");
      });
      return;
    }

    let frame = 0;
    let previousY = window.scrollY;

    function render() {
      const viewportHeight = window.innerHeight;
      const currentY = window.scrollY;
      const direction = currentY >= previousY ? "forward" : "back";

      articleRoot.dataset.readingDirection = direction;
      previousY = currentY;

      chapters.forEach((chapter) => {
        const rect = chapter.getBoundingClientRect();
        const center = rect.top + rect.height * 0.42;
        const distance = Math.abs(center - viewportHeight * 0.5);
        const focus = clamp(1 - distance / (viewportHeight * 0.78));
        const progress = clamp(
          (viewportHeight * 0.84 - rect.top) /
            Math.max(viewportHeight * 0.72, rect.height),
        );

        chapter.style.setProperty("--chapter-focus", focus.toFixed(3));
        chapter.style.setProperty("--chapter-progress", progress.toFixed(3));
        chapter.style.setProperty(
          "--chapter-shift",
          `${((1 - focus) * (direction === "forward" ? 18 : -12)).toFixed(2)}px`,
        );
        chapter.dataset.active = focus > 0.54 ? "true" : "false";
      });
    }

    function requestRender() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        render();
      });
    }

    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      if (frame) window.cancelAnimationFrame(frame);
      delete articleRoot.dataset.readingDirection;
      chapters.forEach((chapter) => {
        delete chapter.dataset.active;
        chapter.style.removeProperty("--chapter-focus");
        chapter.style.removeProperty("--chapter-progress");
        chapter.style.removeProperty("--chapter-shift");
      });
    };
  }, [prefersReducedMotion]);

  return null;
}
