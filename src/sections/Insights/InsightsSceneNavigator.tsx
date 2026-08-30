"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

export type InsightScene = {
  id: string;
  label: string;
  shortLabel: string;
  theme: "light" | "dark";
  accent: string;
};

type InsightsSceneNavigatorProps = {
  scenes: InsightScene[];
};

const OBSERVER_THRESHOLDS = [0.06, 0.14, 0.26, 0.4, 0.58, 0.76];
const SCENE_STYLE_PROPERTIES = [
  "--scene-progress",
  "--scene-presence",
  "--scene-anticipation",
  "--scene-activation",
  "--scene-discovery",
  "--scene-resolution",
  "--scene-camera-x",
  "--scene-camera-y",
  "--scene-camera-scale",
  "--scene-camera-roll",
  "--scene-entry-shift",
  "--scene-discovery-shift",
  "--scene-resolution-shift",
  "--scene-seam-shift",
  "--scene-mask",
  "--scene-content-opacity",
] as const;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function range(progress: number, start: number, end: number) {
  return clamp((progress - start) / Math.max(0.001, end - start));
}

function phaseFromProgress(progress: number) {
  if (progress < 0.2) return "anticipation";
  if (progress < 0.43) return "activation";
  if (progress < 0.72) return "discovery";
  return "resolution";
}

/**
 * Directs the shared Insights camera without taking ownership of scrolling.
 *
 * Every scene receives the same four-beat timeline as CSS custom properties:
 * anticipation -> activation -> discovery -> resolution. Lenis supplies the
 * inertial velocity when available; native scroll remains the fallback and
 * the only source of page position. Pointer and touch input merely change the
 * focal point, so the page stays keyboard-, anchor-, and browser-history-safe.
 */
export function InsightsSceneNavigator({ scenes }: InsightsSceneNavigatorProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const activeIndexRef = useRef(-1);
  const ratiosRef = useRef(new Map<string, number>());
  const prefersReducedMotion = useHydratedReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    const targets = scenes
      .map((scene) => document.getElementById(scene.id))
      .filter((target): target is HTMLElement => Boolean(target));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratiosRef.current.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });

        let nextIndex = 0;
        let strongestRatio = -1;

        scenes.forEach((scene, index) => {
          const ratio = ratiosRef.current.get(scene.id) ?? 0;
          if (ratio > strongestRatio) {
            strongestRatio = ratio;
            nextIndex = index;
          }
        });

        if (strongestRatio <= 0) {
          activeIndexRef.current = -1;
          setActiveIndex(-1);
          return;
        }
        activeIndexRef.current = nextIndex;
        setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
      },
      {
        rootMargin: "-12% 0px -20% 0px",
        threshold: OBSERVER_THRESHOLDS,
      },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      activeIndexRef.current = -1;
      observer.disconnect();
    };
  }, [scenes]);

  useEffect(() => {
    const pageNode = document.querySelector<HTMLElement>(".insights-page");
    if (!pageNode) return;
    const page = pageNode;

    const targets = scenes
      .map((scene) => document.getElementById(scene.id))
      .filter((target): target is HTMLElement => Boolean(target));
    if (targets.length === 0) return;

    page.dataset.insightsMotion = prefersReducedMotion ? "reduced" : "full";

    if (prefersReducedMotion) {
      targets.forEach((target) => {
        target.dataset.scenePhase = "resolved";
        target.style.setProperty("--scene-progress", "0.5");
        target.style.setProperty("--scene-presence", "1");
        target.style.setProperty("--scene-anticipation", "1");
        target.style.setProperty("--scene-activation", "1");
        target.style.setProperty("--scene-discovery", "1");
        target.style.setProperty("--scene-resolution", "1");
        target.style.setProperty("--scene-camera-x", "0px");
        target.style.setProperty("--scene-camera-y", "0px");
        target.style.setProperty("--scene-camera-scale", "1");
        target.style.setProperty("--scene-camera-roll", "0deg");
        target.style.setProperty("--scene-entry-shift", "0px");
        target.style.setProperty("--scene-discovery-shift", "0px");
        target.style.setProperty("--scene-resolution-shift", "0px");
        target.style.setProperty("--scene-seam-shift", "0px");
        target.style.setProperty("--scene-mask", "100%");
        target.style.setProperty("--scene-content-opacity", "1");
      });

      return () => {
        delete page.dataset.insightsMotion;
        delete page.dataset.scrollState;
        targets.forEach((target) => {
          delete target.dataset.scenePhase;
          SCENE_STYLE_PROPERTIES.forEach((property) =>
            target.style.removeProperty(property),
          );
        });
      };
    }

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let touchOriginX = 0;
    let touchOriginY = 0;
    let touchDriftX = 0;
    let touchDriftY = 0;
    let direction = 1;
    let lastScroll = window.scrollY;
    let targetVelocity = 0;
    let renderedVelocity = 0;
    let settleTimer: number | null = null;

    page.dataset.scrollState = "settled";

    function viewportMetrics() {
      const visualViewport = window.visualViewport;
      return {
        height: Math.max(1, visualViewport?.height ?? window.innerHeight),
        top: visualViewport?.offsetTop ?? 0,
      };
    }

    function setScrollState(state: "moving" | "settled") {
      if (page.dataset.scrollState !== state) page.dataset.scrollState = state;
    }

    function scheduleSceneSettle() {
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        settleTimer = null;

        const activeElement = document.activeElement;
        if (
          activeElement instanceof HTMLElement &&
          activeElement.matches(
            "input, textarea, select, [contenteditable='true'], [role='dialog'] *",
          )
        ) {
          return;
        }

        const viewportHeight = viewportMetrics().height;
        const threshold = Math.min(96, viewportHeight * 0.11);
        let nearestTarget: HTMLElement | null = null;
        let nearestDistance = Number.POSITIVE_INFINITY;

        for (const target of targets) {
          const distance = Math.abs(target.getBoundingClientRect().top);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestTarget = target;
          }
        }

        if (!nearestTarget || nearestDistance <= 1 || nearestDistance > threshold) {
          return;
        }

        setScrollState("moving");
        if (lenis) {
          lenis.scrollTo(nearestTarget, {
            duration: 0.42,
            easing: (value) => 1 - Math.pow(1 - value, 3),
          });
          return;
        }

        nearestTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 210);
    }

    function renderCamera() {
      frame = 0;
      if (document.visibilityState === "hidden") return;

      pointerX += (pointerTargetX - pointerX) * 0.12;
      pointerY += (pointerTargetY - pointerY) * 0.12;
      renderedVelocity += (targetVelocity - renderedVelocity) * 0.18;
      targetVelocity *= 0.84;

      page.dataset.scrollDirection = direction > 0 ? "forward" : "backward";
      page.style.setProperty("--insights-pointer-x", pointerX.toFixed(4));
      page.style.setProperty("--insights-pointer-y", pointerY.toFixed(4));
      page.style.setProperty(
        "--insights-scroll-velocity",
        Math.abs(renderedVelocity).toFixed(4),
      );

      const viewport = viewportMetrics();
      const viewportHeight = viewport.height;
      const viewportBottom = viewport.top + viewportHeight;

      targets.forEach((target, index) => {
        const bounds = target.getBoundingClientRect();
        if (
          bounds.bottom < viewport.top - viewportHeight ||
          bounds.top > viewportBottom + viewportHeight
        ) {
          return;
        }

        const sceneProgress = clamp(
          (viewportBottom - bounds.top) / (viewportHeight + bounds.height),
        );
        const presence = clamp(1 - Math.abs(sceneProgress - 0.5) * 2);
        const anticipation = range(sceneProgress, 0.03, 0.23);
        const activation = range(sceneProgress, 0.18, 0.43);
        const discovery = range(sceneProgress, 0.36, 0.67);
        const resolution = range(sceneProgress, 0.64, 0.9);
        const alternatingPan = index % 2 === 0 ? -1 : 1;
        const velocityKick = renderedVelocity;
        const cameraX =
          pointerX * 8 + alternatingPan * (1 - presence) * 12 + touchDriftX * 7;
        const cameraY =
          pointerY * 5 + velocityKick * 9 + (0.5 - sceneProgress) * 16 + touchDriftY * 5;
        const cameraScale =
          1 + (1 - presence) * 0.032 + Math.abs(renderedVelocity) * 0.008;
        const cameraRoll = alternatingPan * pointerX * 0.22 + velocityKick * 0.16;
        const entryShift = (1 - activation) * 18;
        const discoveryShift = (1 - discovery) * 22 * alternatingPan;
        const resolutionShift = resolution * -10;
        const seamShift = direction * Math.abs(velocityKick) * 14;
        const mask = 18 + activation * 82;
        const contentOpacity = 0.72 + presence * 0.28;

        const nextPhase = phaseFromProgress(sceneProgress);
        if (target.dataset.scenePhase !== nextPhase) {
          target.dataset.scenePhase = nextPhase;
        }
        target.style.setProperty("--scene-progress", sceneProgress.toFixed(4));
        target.style.setProperty("--scene-presence", presence.toFixed(4));
        target.style.setProperty("--scene-anticipation", anticipation.toFixed(4));
        target.style.setProperty("--scene-activation", activation.toFixed(4));
        target.style.setProperty("--scene-discovery", discovery.toFixed(4));
        target.style.setProperty("--scene-resolution", resolution.toFixed(4));
        target.style.setProperty("--scene-camera-x", `${cameraX.toFixed(2)}px`);
        target.style.setProperty("--scene-camera-y", `${cameraY.toFixed(2)}px`);
        target.style.setProperty("--scene-camera-scale", cameraScale.toFixed(4));
        target.style.setProperty("--scene-camera-roll", `${cameraRoll.toFixed(3)}deg`);
        target.style.setProperty("--scene-entry-shift", `${entryShift.toFixed(2)}px`);
        target.style.setProperty(
          "--scene-discovery-shift",
          `${discoveryShift.toFixed(2)}px`,
        );
        target.style.setProperty(
          "--scene-resolution-shift",
          `${resolutionShift.toFixed(2)}px`,
        );
        target.style.setProperty(
          "--scene-seam-shift",
          `${seamShift.toFixed(2)}px`,
        );
        target.style.setProperty("--scene-mask", `${mask.toFixed(2)}%`);
        target.style.setProperty("--scene-content-opacity", contentOpacity.toFixed(4));
      });

      const needsAnotherFrame =
        Math.abs(targetVelocity) > 0.004 ||
        Math.abs(renderedVelocity) > 0.004 ||
        Math.abs(pointerTargetX - pointerX) > 0.003 ||
        Math.abs(pointerTargetY - pointerY) > 0.003;

      if (needsAnotherFrame) {
        setScrollState("moving");
        frame = window.requestAnimationFrame(renderCamera);
      } else {
        setScrollState("settled");
      }
    }

    function scheduleCamera() {
      if (document.visibilityState === "hidden") return;
      if (!frame) frame = window.requestAnimationFrame(renderCamera);
    }

    function updateFromScroll(scroll: number, velocity?: number) {
      const delta = scroll - lastScroll;
      if (Math.abs(delta) > 0.2) direction = delta > 0 ? 1 : -1;
      lastScroll = scroll;
      targetVelocity = clamp((velocity ?? delta) / 32, -1, 1);
      if (Math.abs(delta) > 0.2 || Math.abs(targetVelocity) > 0.01) {
        setScrollState("moving");
        scheduleSceneSettle();
      }
      scheduleCamera();
    }

    function handleNativeScroll() {
      updateFromScroll(window.scrollY);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      if (activeIndexRef.current < 0) return;
      pointerTargetX = clamp(
        (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2,
        -1,
        1,
      );
      pointerTargetY = clamp(
        (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2,
        -1,
        1,
      );
      scheduleCamera();
    }

    function handlePointerLeave() {
      pointerTargetX = 0;
      pointerTargetY = 0;
      scheduleCamera();
    }

    function handleTouchStart(event: TouchEvent) {
      if (activeIndexRef.current < 0) return;
      const touch = event.touches[0];
      if (!touch) return;
      touchOriginX = touch.clientX;
      touchOriginY = touch.clientY;
      touchDriftX = 0;
      touchDriftY = 0;
    }

    function handleTouchMove(event: TouchEvent) {
      if (activeIndexRef.current < 0) return;
      const touch = event.touches[0];
      if (!touch) return;
      touchDriftX = clamp(
        (touch.clientX - touchOriginX) / Math.max(1, window.innerWidth * 0.35),
        -1,
        1,
      );
      touchDriftY = clamp(
        (touch.clientY - touchOriginY) / Math.max(1, window.innerHeight * 0.35),
        -1,
        1,
      );
      scheduleCamera();
    }

    function handleTouchEnd() {
      touchDriftX = 0;
      touchDriftY = 0;
      scheduleCamera();
    }

    function handleViewportChange() {
      lastScroll = window.scrollY;
      targetVelocity = 0;
      renderedVelocity = 0;
      scheduleCamera();
    }

    function handlePageShow() {
      lastScroll = window.scrollY;
      scheduleCamera();
    }

    function handleVisualViewportScroll() {
      scheduleCamera();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        window.cancelAnimationFrame(frame);
        frame = 0;
        targetVelocity = 0;
        renderedVelocity = 0;
        setScrollState("settled");
        return;
      }

      lastScroll = window.scrollY;
      scheduleCamera();
    }

    const unsubscribeLenis = lenis?.on("scroll", (instance) => {
      updateFromScroll(instance.scroll, instance.velocity);
    });

    if (!lenis) window.addEventListener("scroll", handleNativeScroll, { passive: true });
    window.addEventListener("resize", handleViewportChange, { passive: true });
    window.visualViewport?.addEventListener("resize", handleViewportChange, {
      passive: true,
    });
    window.visualViewport?.addEventListener("scroll", handleVisualViewportScroll, {
      passive: true,
    });
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    renderCamera();

    return () => {
      window.cancelAnimationFrame(frame);
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      unsubscribeLenis?.();
      window.removeEventListener("scroll", handleNativeScroll);
      window.removeEventListener("resize", handleViewportChange);
      window.visualViewport?.removeEventListener("resize", handleViewportChange);
      window.visualViewport?.removeEventListener(
        "scroll",
        handleVisualViewportScroll,
      );
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      delete page.dataset.insightsMotion;
      delete page.dataset.scrollDirection;
      delete page.dataset.scrollState;
      page.style.removeProperty("--insights-pointer-x");
      page.style.removeProperty("--insights-pointer-y");
      page.style.removeProperty("--insights-scroll-velocity");
      targets.forEach((target) => {
        delete target.dataset.scenePhase;
        SCENE_STYLE_PROPERTIES.forEach((property) =>
          target.style.removeProperty(property),
        );
      });
    };
  }, [lenis, prefersReducedMotion, scenes]);

  useEffect(() => {
    scenes.forEach((scene, index) => {
      const target = document.getElementById(scene.id);
      if (target) target.dataset.sceneActive = String(index === activeIndex);
    });
  }, [activeIndex, scenes]);

  useEffect(() => {
    function restoreSceneFromHistory() {
      const scene = scenes.find(({ id }) => window.location.hash === `#${id}`);
      if (!scene) return;

      const target = document.getElementById(scene.id);
      if (!target) return;

      window.requestAnimationFrame(() => {
        if (lenis && !prefersReducedMotion) {
          lenis.scrollTo(target, {
            duration: 0.68,
            easing: (value) => 1 - Math.pow(1 - value, 3),
          });
          return;
        }

        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }

    window.addEventListener("popstate", restoreSceneFromHistory);
    return () => window.removeEventListener("popstate", restoreSceneFromHistory);
  }, [lenis, prefersReducedMotion, scenes]);

  function handleSceneJourney(
    event: MouseEvent<HTMLAnchorElement>,
    scene: InsightScene,
  ) {
    const target = document.getElementById(scene.id);
    if (!target) return;

    event.preventDefault();
    const nextHash = `#${scene.id}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }

    if (lenis && !prefersReducedMotion) {
      lenis.scrollTo(target, {
        duration: 0.86,
        easing: (value) => 1 - Math.pow(1 - value, 3),
      });
      return;
    }

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  const activeScene = scenes[activeIndex];

  return (
    <nav
      className="insights-scene-compass"
      aria-label="Insights chapters"
      data-visible={activeScene ? "true" : "false"}
      data-theme={activeScene?.theme ?? "light"}
      style={
        {
          "--compass-accent": activeScene?.accent ?? "#D77A51",
        } as CSSProperties
      }
    >
      <ol>
        {scenes.map((scene, index) => {
          const isActive = index === activeIndex;

          return (
            <li key={scene.id}>
              <Link
                href={`#${scene.id}`}
                aria-label={`Chapter ${index + 1}: ${scene.label}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => handleSceneJourney(event, scene)}
              >
                <span className="insights-scene-compass__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="insights-scene-compass__label">
                  {scene.shortLabel}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
