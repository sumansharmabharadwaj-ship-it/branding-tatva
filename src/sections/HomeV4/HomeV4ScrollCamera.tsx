"use client";

import { useEffect } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const HANDOFF_SELECTOR = ".home-v4-handoff";
const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

/**
 * Turns native homepage scroll into a shared camera signal. Individual scenes
 * keep ownership of their semantic state; this director only publishes
 * progress, direction, velocity and pointer position for atmospheric motion.
 * It also owns homepage hash recovery because Lenis intentionally stands down
 * on this route.
 */
export function HomeV4ScrollCamera() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    const rootElement = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!rootElement || prefersReducedMotion) return;
    const root = rootElement;

    const handoffs = Array.from(
      root.querySelectorAll<HTMLElement>(HANDOFF_SELECTOR),
    );
    let frame = 0;
    let disposed = false;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let easedVelocity = 0;
    let lastDirection = 1;
    let hashAttempts = 0;
    let hashCancelled = false;
    let hashTimer = 0;
    let hashFrame = 0;

    function renderCamera(now: number) {
      frame = 0;
      const viewport = Math.max(1, window.innerHeight);
      const currentY = window.scrollY;
      const elapsed = Math.max(16, now - lastTime);
      const delta = currentY - lastY;
      const direction = delta > 0.25 ? 1 : delta < -0.25 ? -1 : 0;
      const rawVelocity = clamp(Math.abs(delta) / elapsed / 2.2);
      easedVelocity += (rawVelocity - easedVelocity) * 0.22;
      if (direction !== 0) lastDirection = direction;

      root.style.setProperty("--home-camera-velocity", easedVelocity.toFixed(4));
      root.style.setProperty(
        "--home-camera-light-opacity",
        (0.22 + easedVelocity * 0.34).toFixed(4),
      );
      root.style.setProperty(
        "--home-camera-light-scale",
        (0.94 + easedVelocity * 0.12).toFixed(4),
      );
      root.style.setProperty(
        "--home-camera-light-blur",
        `${(12 + easedVelocity * 10).toFixed(2)}px`,
      );
      root.style.setProperty(
        "--home-camera-edge-opacity",
        (0.2 + easedVelocity * 0.2).toFixed(4),
      );
      root.style.setProperty("--home-camera-direction", String(lastDirection));
      root.style.setProperty(
        "--home-camera-angle",
        `${90 + lastDirection * 5}deg`,
      );
      root.style.setProperty(
        "--home-camera-shift",
        `${(lastDirection * easedVelocity * -1.2).toFixed(3)}vw`,
      );
      root.dataset.cameraDirection = lastDirection > 0 ? "forward" : "reverse";

      handoffs.forEach((handoff) => {
        const top = handoff.getBoundingClientRect().top;
        const presence = clamp(1 - Math.abs(top - viewport * 0.5) / (viewport * 0.72));
        const phase = clamp((viewport - top) / (viewport * 1.45));
        if (presence <= 0.001) {
          if (handoff.dataset.cameraVisible === "true") {
            handoff.dataset.cameraVisible = "false";
            handoff.style.setProperty("--home-handoff-presence", "0");
            handoff.style.setProperty("--home-handoff-opacity", "0");
          }
          return;
        }

        handoff.dataset.cameraVisible = "true";
        handoff.style.setProperty("--home-handoff-presence", presence.toFixed(4));
        handoff.style.setProperty("--home-handoff-phase", phase.toFixed(4));
        handoff.style.setProperty(
          "--home-handoff-opacity",
          (presence * 0.72).toFixed(4),
        );
        handoff.style.setProperty(
          "--home-handoff-shift",
          `${((phase - 0.5) * 7).toFixed(3)}vw`,
        );
        handoff.style.setProperty(
          "--home-handoff-scale",
          (0.88 + presence * 0.16).toFixed(4),
        );
        handoff.style.setProperty(
          "--home-handoff-star-opacity",
          (0.18 + presence * 0.72).toFixed(4),
        );
        handoff.style.setProperty(
          "--home-handoff-star-scale",
          (0.72 + presence * 0.58).toFixed(4),
        );
        handoff.style.setProperty(
          "--home-handoff-dash",
          `${(phase * -72).toFixed(2)}px`,
        );
      });

      lastY = currentY;
      lastTime = now;
      if (easedVelocity > 0.005) frame = window.requestAnimationFrame(renderCamera);
    }

    function scheduleCamera() {
      if (!frame) frame = window.requestAnimationFrame(renderCamera);
    }

    function onPointerMove(event: PointerEvent) {
      const x = clamp(event.clientX / Math.max(1, window.innerWidth), 0, 1);
      const y = clamp(event.clientY / Math.max(1, window.innerHeight), 0, 1);
      root.style.setProperty("--home-camera-x", `${(x * 100).toFixed(3)}%`);
      root.style.setProperty("--home-camera-y", `${(y * 100).toFixed(3)}%`);
    }

    function cancelHashRecovery() {
      hashCancelled = true;
      window.clearTimeout(hashTimer);
      window.cancelAnimationFrame(hashFrame);
    }

    function onManualKey(event: KeyboardEvent) {
      if (SCROLL_KEYS.has(event.key)) cancelHashRecovery();
    }

    function resolveHashTarget() {
      const rawHash = window.location.hash.slice(1);
      if (!rawHash) return null;

      let id = rawHash;
      try {
        id = decodeURIComponent(rawHash);
      } catch {}

      const target = document.getElementById(id);
      return target instanceof HTMLElement && root.contains(target) ? target : null;
    }

    function recoverHash() {
      if (disposed || hashCancelled || hashAttempts >= 6) return;
      const target = resolveHashTarget();
      if (!target) return;

      const top = target.getBoundingClientRect().top;
      if (Math.abs(top) <= 1) return;

      hashAttempts += 1;
      window.scrollTo({
        top: Math.max(0, window.scrollY + top),
        behavior: "auto",
      });
      scheduleCamera();

      if (hashAttempts < 6 && !hashCancelled) {
        hashTimer = window.setTimeout(recoverHash, 350);
      }
    }

    function scheduleHashRecovery() {
      if (!window.location.hash || hashCancelled) return;
      window.cancelAnimationFrame(hashFrame);
      hashFrame = window.requestAnimationFrame(recoverHash);
    }

    root.style.setProperty("--home-camera-x", "50%");
    root.style.setProperty("--home-camera-y", "42%");
    root.style.setProperty("--home-camera-direction", "1");
    root.style.setProperty("--home-camera-angle", "95deg");
    root.style.setProperty("--home-camera-shift", "0vw");
    root.dataset.cameraReady = "true";
    scheduleCamera();
    scheduleHashRecovery();

    window.addEventListener("scroll", scheduleCamera, { passive: true });
    window.addEventListener("resize", scheduleCamera, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("wheel", cancelHashRecovery, { passive: true });
    window.addEventListener("touchstart", cancelHashRecovery, { passive: true });
    window.addEventListener("pointerdown", cancelHashRecovery, { passive: true });
    window.addEventListener("keydown", onManualKey);

    if (document.readyState !== "complete") {
      window.addEventListener("load", scheduleHashRecovery);
    }
    void document.fonts?.ready?.then(() => {
      if (!disposed) scheduleHashRecovery();
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(hashFrame);
      window.clearTimeout(hashTimer);
      window.removeEventListener("scroll", scheduleCamera);
      window.removeEventListener("resize", scheduleCamera);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("wheel", cancelHashRecovery);
      window.removeEventListener("touchstart", cancelHashRecovery);
      window.removeEventListener("pointerdown", cancelHashRecovery);
      window.removeEventListener("keydown", onManualKey);
      window.removeEventListener("load", scheduleHashRecovery);
      delete root.dataset.cameraReady;
      delete root.dataset.cameraDirection;
      [
        "--home-camera-x",
        "--home-camera-y",
        "--home-camera-velocity",
        "--home-camera-direction",
        "--home-camera-light-opacity",
        "--home-camera-light-scale",
        "--home-camera-light-blur",
        "--home-camera-edge-opacity",
        "--home-camera-angle",
        "--home-camera-shift",
      ].forEach((property) => root.style.removeProperty(property));
      handoffs.forEach((handoff) => {
        delete handoff.dataset.cameraVisible;
        handoff.style.removeProperty("--home-handoff-presence");
        handoff.style.removeProperty("--home-handoff-phase");
        handoff.style.removeProperty("--home-handoff-opacity");
        handoff.style.removeProperty("--home-handoff-shift");
        handoff.style.removeProperty("--home-handoff-scale");
        handoff.style.removeProperty("--home-handoff-star-opacity");
        handoff.style.removeProperty("--home-handoff-star-scale");
        handoff.style.removeProperty("--home-handoff-dash");
      });
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className="home-v4-scroll-camera" aria-hidden="true">
      <span className="home-v4-scroll-camera__light" />
      <span className="home-v4-scroll-camera__edge" />
    </div>
  );
}
