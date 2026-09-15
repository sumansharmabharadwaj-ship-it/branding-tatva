"use client";

import { useEffect } from "react";
import { flushSync } from "react-dom";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useMotionPreference } from "@/components/MotionPreference";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";

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
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const { setPref } = useMotionPreference();
  const osReducedMotion = useReducedMotion();
  const followsSystem = hydrated && Boolean(osReducedMotion);

  useEffect(() => {
    const rootElement = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!rootElement || !hydrated || prefersReducedMotion) return;
    const root = rootElement;

    const handoffs = Array.from(
      root.querySelectorAll<HTMLElement>(HANDOFF_SELECTOR),
    );
    const fields = Array.from(root.querySelectorAll<HTMLElement>("[data-living-gradient]"));
    const processGround = root.querySelector<HTMLElement>('[data-home-v4-chapter="process"]');
    const surfaces = processGround ? [...fields, processGround] : fields;
    const finePointer = window.matchMedia("(pointer: fine)");
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    let disposed = false;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let easedVelocity = 0;
    let easedShift = 0;
    let lastDirection = 1;

    function renderCamera(now: number) {
      frame = 0;
      if (disposed || document.hidden) return;
      const viewport = Math.max(1, window.innerHeight);
      const currentY = window.scrollY;
      // A long idle interval must not swallow the next wheel gesture.
      const elapsed = clamp(now - lastTime, 16, 64);
      const delta = currentY - lastY;
      const direction = delta > 0.25 ? 1 : delta < -0.25 ? -1 : 0;
      const rawVelocity = clamp(Math.abs(delta) / elapsed / 2.2);
      const damping = 1 - Math.exp(-Math.min(elapsed, 64) / 110);
      easedVelocity += (rawVelocity - easedVelocity) * damping;
      if (rawVelocity === 0 && easedVelocity < 0.005) easedVelocity = 0;
      pointerX += (targetX - pointerX) * damping;
      pointerY += (targetY - pointerY) * damping;
      if (direction !== 0) lastDirection = direction;
      easedShift += (lastDirection * easedVelocity - easedShift) * damping;
      if (!easedVelocity && Math.abs(easedShift) < 0.002) easedShift = 0;

      // Complete geometry reads before writing any styles. Only decorative
      // fields receive the eased signal; native document scroll stays 1:1.
      const seamPositions = handoffs.map((handoff) => ({ handoff, rect: handoff.getBoundingClientRect() }));
      const fieldPositions = surfaces.map((field) => ({ field, rect: field.getBoundingClientRect() }));
      const leanDistance = finePointer.matches ? Math.min(22, window.innerWidth * 0.012) : 5;
      fieldPositions.forEach(({ field, rect }) => {
        const active = rect.bottom > 0 && rect.top < viewport;
        if (field.dataset.gradientActive !== String(active)) field.dataset.gradientActive = String(active);
        if (!active) return;
        // Publish at each visible surface, never on the whole Home root.
        field.style.setProperty("--field-speed", easedVelocity.toFixed(4));
        field.style.setProperty("--field-lean", `${(easedShift * leanDistance).toFixed(2)}px`);
        if (field === processGround) return;
        const phase = clamp((viewport - rect.top) / (viewport + rect.height));
        const travel = finePointer.matches ? 100 : 28;
        field.style.setProperty("--current-draw", clamp((phase - 0.08) / 0.65).toFixed(4));
        field.style.setProperty("--current-sweep", `${((phase - 0.5) * 70).toFixed(2)}%`);
        field.style.setProperty("--current-breath", (1 + easedVelocity * 0.045).toFixed(4));
        field.style.setProperty("--field-x", `${(pointerX * 16).toFixed(2)}px`);
        field.style.setProperty("--field-y", `${((phase - 0.5) * travel + pointerY * 9).toFixed(2)}px`);
        field.style.setProperty("--field-turn", `${((phase - 0.5) * 9 + pointerX).toFixed(2)}deg`);
      });

      // Keep changing styles local to the visible fields, avoiding inherited
      // custom-property invalidation across the entire homepage.
      root.dataset.cameraDirection = lastDirection > 0 ? "forward" : "reverse";

      seamPositions.forEach(({ handoff, rect }) => {
        const { top, height } = rect;
        const presence = clamp(1 - Math.abs(top - viewport * 0.5) / (viewport * 0.72));
        const phase = clamp((viewport - top) / (viewport + height));
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
      if (easedVelocity > 0 || easedShift !== 0 || Math.abs(targetX - pointerX) > 0.002 || Math.abs(targetY - pointerY) > 0.002) {
        frame = window.requestAnimationFrame(renderCamera);
      }
    }

    function scheduleCamera() {
      if (!disposed && !document.hidden && !frame) frame = window.requestAnimationFrame(renderCamera);
    }

    function onPointerMove(event: PointerEvent) {
      if (!finePointer.matches || event.pointerType === "touch") return;
      const x = clamp(event.clientX / Math.max(1, window.innerWidth), 0, 1);
      const y = clamp(event.clientY / Math.max(1, window.innerHeight), 0, 1);
      targetX = x * 2 - 1;
      targetY = y * 2 - 1;
      scheduleCamera();
    }

    function onPointerLeave() {
      targetX = 0;
      targetY = 0;
      scheduleCamera();
    }

    function onVisibilityChange() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      if (document.hidden) {
        surfaces.forEach((field) => { field.dataset.gradientActive = "false"; });
      } else {
        lastY = window.scrollY;
        lastTime = performance.now();
        easedVelocity = 0;
        easedShift = 0;
        scheduleCamera();
      }
    }

    root.dataset.cameraReady = "true";
    scheduleCamera();

    window.addEventListener("scroll", scheduleCamera, { passive: true });
    window.addEventListener("resize", scheduleCamera, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const resize = new ResizeObserver(scheduleCamera);
    resize.observe(root);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleCamera);
      window.removeEventListener("resize", scheduleCamera);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resize.disconnect();
      surfaces.forEach((field) => {
        delete field.dataset.gradientActive;
        ["--field-x", "--field-y", "--field-turn", "--field-speed", "--field-lean", "--current-draw", "--current-sweep", "--current-breath"].forEach((property) => field.style.removeProperty(property));
      });
      delete root.dataset.cameraReady;
      delete root.dataset.cameraDirection;
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
  }, [hydrated, prefersReducedMotion]);

  // Fragment recovery belongs to initial hydration, not the motion lifecycle.
  // Pausing and resuming must never replay a fragment from earlier in the visit.
  useEffect(() => {
    const rootElement = document.querySelector<HTMLElement>("[data-home-v4]");
    if (!rootElement || !hydrated) return;
    const root = rootElement;
    let disposed = false;
    let hashAttempts = 0;
    let hashCancelled = false;
    let hashTimer = 0;
    let hashFrame = 0;

    function cancelHashRecovery() {
      hashCancelled = true;
      window.clearTimeout(hashTimer);
      window.cancelAnimationFrame(hashFrame);
    }

    function onManualKey(event: KeyboardEvent) {
      if (SCROLL_KEYS.has(event.key) || event.key === "Tab" || event.key === "Escape") cancelHashRecovery();
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

      if (hashAttempts < 6 && !hashCancelled) {
        hashTimer = window.setTimeout(recoverHash, 350);
      }
    }

    function scheduleHashRecovery() {
      if (!window.location.hash || hashCancelled) return;
      window.cancelAnimationFrame(hashFrame);
      hashFrame = window.requestAnimationFrame(recoverHash);
    }

    scheduleHashRecovery();
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

    window.addEventListener("focusin", cancelHashRecovery);
    return () => {
      disposed = true;
      cancelHashRecovery();
      window.removeEventListener("wheel", cancelHashRecovery);
      window.removeEventListener("touchstart", cancelHashRecovery);
      window.removeEventListener("pointerdown", cancelHashRecovery);
      window.removeEventListener("keydown", onManualKey);
      window.removeEventListener("load", scheduleHashRecovery);
      window.removeEventListener("focusin", cancelHashRecovery);
    };
  }, [hydrated]);

  function toggleMotion() {
    // Pausing collapses desktop story runways. Keep a visible reading landmark
    // at the same screen position through that one deliberate layout change.
    const landmarks = Array.from(document.querySelectorAll<HTMLElement>(
      ".home-v4 h1, .home-v4 h2:not(.sr-only), .home-v4 h3, .home-v4 [role='tabpanel'], footer h2",
    ));
    const visible = landmarks.map((node) => ({ node, rect: node.getBoundingClientRect() }))
      .filter(({ node, rect }) => {
        if (rect.height <= 0 || rect.top < 0 || rect.top >= window.innerHeight * .8) return false;
        const hit = document.elementFromPoint(
          clamp(rect.left + rect.width / 2, 1, window.innerWidth - 1),
          rect.top + Math.min(rect.height / 2, 16),
        );
        return hit === node || (hit !== null && node.contains(hit));
      });
    const anchor = visible.sort((a, b) => a.rect.top - b.rect.top)[0];
    // Only this explicit control flushes synchronously; scroll frames never do.
    flushSync(() => setPref(prefersReducedMotion ? "full" : "reduced"));
    if (!anchor?.node.isConnected) return;
    const drift = anchor.node.getBoundingClientRect().top - anchor.rect.top;
    if (Math.abs(drift) > 1) {
      window.scrollTo({ top: Math.max(0, window.scrollY + drift), behavior: "instant" });
    }
  }

  return (
    <button
      type="button"
      className="home-v4-motion-toggle"
      aria-label={followsSystem ? "Reduced motion follows your device setting" : prefersReducedMotion ? "Resume page motion" : "Pause page motion"}
      disabled={followsSystem}
      aria-pressed={prefersReducedMotion}
      onClick={toggleMotion}
    >
      {prefersReducedMotion ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      <span>{followsSystem ? "Reduced motion" : prefersReducedMotion ? "Motion paused" : "Pause motion"}</span>
    </button>
  );
}
