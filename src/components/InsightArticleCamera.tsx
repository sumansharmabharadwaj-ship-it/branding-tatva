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
        chapter.style.setProperty("--chapter-velocity", "0");
      });
      return;
    }

    let frame = 0;
    let pointerFrame = 0;
    let previousY = window.scrollY;

    function render() {
      const viewportHeight = window.innerHeight;
      const currentY = window.scrollY;
      const distanceTravelled = currentY - previousY;
      const direction = distanceTravelled >= 0 ? "forward" : "back";
      const velocity = clamp(Math.abs(distanceTravelled) / 52);

      articleRoot.dataset.readingDirection = direction;
      articleRoot.style.setProperty("--reading-velocity", velocity.toFixed(3));
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
        chapter.style.setProperty("--chapter-velocity", velocity.toFixed(3));
        chapter.style.setProperty(
          "--chapter-shift",
          `${((1 - focus) * (direction === "forward" ? 18 : -12)).toFixed(2)}px`,
        );
        chapter.dataset.active = focus > 0.54 ? "true" : "false";
      });
    }

    function renderPointer(event: PointerEvent) {
      const target = event.target;
      const chapter =
        target instanceof Element
          ? target.closest<HTMLElement>(".insight-article-section")
          : null;

      if (!chapter) {
        pointerFrame = 0;
        return;
      }

      const rect = chapter.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width);
      const y = clamp((event.clientY - rect.top) / rect.height);
      chapter.style.setProperty("--chapter-pointer-x", `${(x * 100).toFixed(2)}%`);
      chapter.style.setProperty("--chapter-pointer-y", `${(y * 100).toFixed(2)}%`);
      pointerFrame = 0;
    }

    function requestPointerRender(event: PointerEvent) {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => renderPointer(event));
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
    document.addEventListener("pointermove", requestPointerRender, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      document.removeEventListener("pointermove", requestPointerRender);
      if (frame) window.cancelAnimationFrame(frame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      delete articleRoot.dataset.readingDirection;
      articleRoot.style.removeProperty("--reading-velocity");
      chapters.forEach((chapter) => {
        delete chapter.dataset.active;
        chapter.style.removeProperty("--chapter-focus");
        chapter.style.removeProperty("--chapter-progress");
        chapter.style.removeProperty("--chapter-shift");
        chapter.style.removeProperty("--chapter-velocity");
        chapter.style.removeProperty("--chapter-pointer-x");
        chapter.style.removeProperty("--chapter-pointer-y");
      });
    };
  }, [prefersReducedMotion]);

  return null;
}
