"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutCinematicRuntime.module.css";

const CHAPTERS = [
  "Point of view",
  "Two disciplines",
  "Principles",
  "Founder-led",
  "Evidence",
  "Resolution",
] as const;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function AboutCinematicRuntime() {
  const runtimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runtime = runtimeRef.current;
    const film = document.querySelector<HTMLElement>("#main-content");
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-about-film-scene]"));
    if (!runtime || !film || scenes.length === 0) return;

    const cameraReady = window.matchMedia(
      "(min-width: 941px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!cameraReady.matches) return;

    const chapterMarks = Array.from(runtime.querySelectorAll<HTMLElement>("[data-film-chapter-mark]"));
    let frame = 0;
    let lastScrollY = window.scrollY;
    let smoothedVelocity = 0;
    let lastDirection = 1;
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.5;
    let pointerTargetX = pointerX;
    let pointerTargetY = pointerY;

    const render = () => {
      frame = 0;
      if (document.documentElement.dataset.motion === "reduced") {
        smoothedVelocity = 0;
        delete document.documentElement.dataset.aboutFilmSnap;
        return;
      }

      const viewportHeight = Math.max(window.innerHeight, 1);
      if (window.scrollY >= scenes[0].offsetTop - 2) {
        document.documentElement.dataset.aboutFilmSnap = "true";
      } else {
        delete document.documentElement.dataset.aboutFilmSnap;
      }
      const rawVelocity = clamp((window.scrollY - lastScrollY) / viewportHeight, -0.12, 0.12);
      smoothedVelocity += (rawVelocity - smoothedVelocity) * 0.18;
      if (rawVelocity !== 0) lastDirection = rawVelocity > 0 ? 1 : -1;
      pointerX += (pointerTargetX - pointerX) * 0.18;
      pointerY += (pointerTargetY - pointerY) * 0.18;
      lastScrollY = window.scrollY;

      let activeScene = 0;
      let strongestFocus = -1;

      scenes.forEach((scene, index) => {
        const rect = scene.getBoundingClientRect();
        const totalTravel = viewportHeight + rect.height;
        const progress = clamp((viewportHeight - rect.top) / totalTravel);
        const centerDelta = Math.abs(rect.top + rect.height * 0.5 - viewportHeight * 0.5);
        const focus = clamp(1 - centerDelta / Math.max(viewportHeight * 0.78, rect.height * 0.58));
        const enter = clamp((viewportHeight - rect.top) / (viewportHeight * 0.72));
        const exit = clamp(-rect.top / Math.max(rect.height * 0.56, 1));
        const phase = progress < 0.27
          ? "anticipation"
          : progress < 0.5
            ? "activation"
            : progress < 0.76
              ? "discovery"
              : "resolution";

        scene.style.setProperty("--scene-progress", progress.toFixed(4));
        scene.style.setProperty("--scene-focus", focus.toFixed(4));
        scene.style.setProperty("--scene-enter", enter.toFixed(4));
        scene.style.setProperty("--scene-exit", exit.toFixed(4));
        scene.style.setProperty("--scene-velocity", Math.abs(smoothedVelocity).toFixed(4));
        scene.style.setProperty("--scene-direction", String(lastDirection));
        scene.dataset.scenePhase = phase;

        if (focus > strongestFocus) {
          strongestFocus = focus;
          activeScene = index;
        }
      });

      scenes.forEach((scene, index) => {
        scene.dataset.sceneActive = String(index === activeScene);
      });
      chapterMarks.forEach((mark, index) => {
        mark.dataset.active = String(index === activeScene);
      });

      const pageRunway = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      runtime.style.setProperty("--film-progress", clamp(window.scrollY / pageRunway).toFixed(4));
      runtime.style.setProperty("--film-velocity", Math.abs(smoothedVelocity).toFixed(4));
      runtime.style.setProperty("--film-direction", String(lastDirection));
      runtime.style.setProperty("--film-pointer-x", `${pointerX.toFixed(1)}px`);
      runtime.style.setProperty("--film-pointer-y", `${pointerY.toFixed(1)}px`);

      const pointerSettling = Math.abs(pointerTargetX - pointerX) + Math.abs(pointerTargetY - pointerY) > 0.5;
      if ((Math.abs(smoothedVelocity) > 0.0002 || pointerSettling) && !document.hidden) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const requestRender = () => {
      if (frame || document.hidden) return;
      frame = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (document.documentElement.dataset.motion === "reduced") return;
      pointerTargetX = event.clientX;
      pointerTargetY = event.clientY;
      requestRender();
    };

    const onVisibilityChange = () => {
      if (!document.hidden) requestRender();
    };

    const motionPreferenceObserver = new MutationObserver(requestRender);
    motionPreferenceObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });

    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionPreferenceObserver.disconnect();
      delete document.documentElement.dataset.aboutFilmSnap;
      scenes.forEach((scene) => {
        delete scene.dataset.sceneActive;
        delete scene.dataset.scenePhase;
        scene.style.removeProperty("--scene-progress");
        scene.style.removeProperty("--scene-focus");
        scene.style.removeProperty("--scene-enter");
        scene.style.removeProperty("--scene-exit");
        scene.style.removeProperty("--scene-velocity");
        scene.style.removeProperty("--scene-direction");
      });
    };
  }, []);

  return (
    <div ref={runtimeRef} className={styles.runtime} aria-hidden="true">
      <div className={styles.cursorLight} />
      <div className={styles.velocityVeil} />
      <div className={styles.chapterSpine}>
        <span className={styles.spineTrack}><i /></span>
        <ol>
          {CHAPTERS.map((chapter, index) => (
            <li key={chapter} data-film-chapter-mark data-active={index === 0}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{chapter}</strong>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
