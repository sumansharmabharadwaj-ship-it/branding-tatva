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
  const [hasNavigationFocus, setHasNavigationFocus] = useState(false);
  const activeIndexRef = useRef(-1);
  const prefersReducedMotion = useHydratedReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    const targets = scenes
      .map((scene) => document.getElementById(scene.id))
      .filter((target): target is HTMLElement => Boolean(target));

    if (targets.length === 0) return;

    let observer: IntersectionObserver | undefined;
    let observing = true;

    function observeReadingLine() {
      observer?.disconnect();
      const visible = new Set<string>();
      const height = Math.max(1, window.innerHeight);
      const line = Math.round(height * 0.42);

      // A narrow reading line gives long sections the same chapter ownership
      // as short ones. Pixel margins also avoid width-based percentage margins.
      const nextObserver = new IntersectionObserver(
        (entries) => {
          if (!observing || observer !== nextObserver) return;
          entries.forEach((entry) => {
            if (entry.isIntersecting) visible.add(entry.target.id);
            else visible.delete(entry.target.id);
          });
          const nextIndex = scenes.findIndex((scene) => visible.has(scene.id));
          activeIndexRef.current = nextIndex;
          setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
        },
        {
          rootMargin: `${-line}px 0px ${-Math.max(0, height - line - 2)}px 0px`,
          threshold: 0,
        },
      );
      observer = nextObserver;
      targets.forEach((target) => nextObserver.observe(target));
    }

    observeReadingLine();
    window.addEventListener("resize", observeReadingLine, { passive: true });
    return () => {
      observing = false;
      activeIndexRef.current = -1;
      observer?.disconnect();
      window.removeEventListener("resize", observeReadingLine);
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
    let renderedTouchX = 0;
    let renderedTouchY = 0;
    let touchIdentifier: number | null = null;
    let direction = 1;
    let lastScroll = window.scrollY;
    let targetVelocity = 0;
    let renderedVelocity = 0;
    let lastFrameTime = 0;
    const styleValues = new WeakMap<HTMLElement, Map<string, string>>();

    function writeStyle(node: HTMLElement, property: string, value: string) {
      let values = styleValues.get(node);
      if (!values) {
        values = new Map();
        styleValues.set(node, values);
      }
      if (values.get(property) === value) return;
      values.set(property, value);
      node.style.setProperty(property, value);
    }

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

    function renderCamera(timestamp = performance.now()) {
      frame = 0;
      if (document.visibilityState === "hidden") return;

      const frameStep = lastFrameTime
        ? clamp((timestamp - lastFrameTime) / (1000 / 60), 0.1, 3)
        : 1;
      lastFrameTime = timestamp;
      const pointerEase = 1 - Math.pow(0.88, frameStep);
      const velocityEase = 1 - Math.pow(0.82, frameStep);
      pointerX += (pointerTargetX - pointerX) * pointerEase;
      pointerY += (pointerTargetY - pointerY) * pointerEase;
      renderedTouchX += (touchDriftX - renderedTouchX) * pointerEase;
      renderedTouchY += (touchDriftY - renderedTouchY) * pointerEase;
      if (Math.abs(touchDriftX - renderedTouchX) < 0.003) renderedTouchX = touchDriftX;
      if (Math.abs(touchDriftY - renderedTouchY) < 0.003) renderedTouchY = touchDriftY;
      renderedVelocity += (targetVelocity - renderedVelocity) * velocityEase;
      targetVelocity *= Math.pow(0.84, frameStep);

      // Read all geometry before changing styles, including page variables.
      const viewport = viewportMetrics();
      const viewportHeight = viewport.height;
      const viewportBottom = viewport.top + viewportHeight;
      const measuredScenes = targets.map((target, index) => ({
        target,
        index,
        bounds: target.getBoundingClientRect(),
      }));

      const scrollDirection = direction > 0 ? "forward" : "backward";
      if (page.dataset.scrollDirection !== scrollDirection) {
        page.dataset.scrollDirection = scrollDirection;
      }
      writeStyle(page, "--insights-pointer-x", pointerX.toFixed(4));
      writeStyle(page, "--insights-pointer-y", pointerY.toFixed(4));
      writeStyle(
        page,
        "--insights-scroll-velocity",
        Math.abs(renderedVelocity).toFixed(4),
      );

      measuredScenes.forEach(({ target, index, bounds }) => {
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
          pointerX * 8 + alternatingPan * (1 - presence) * 12 + renderedTouchX * 7;
        const cameraY =
          pointerY * 5 + velocityKick * 9 + (0.5 - sceneProgress) * 16 + renderedTouchY * 5;
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
        writeStyle(target, "--scene-progress", sceneProgress.toFixed(4));
        writeStyle(target, "--scene-presence", presence.toFixed(4));
        writeStyle(target, "--scene-anticipation", anticipation.toFixed(4));
        writeStyle(target, "--scene-activation", activation.toFixed(4));
        writeStyle(target, "--scene-discovery", discovery.toFixed(4));
        writeStyle(target, "--scene-resolution", resolution.toFixed(4));
        writeStyle(target, "--scene-camera-x", `${cameraX.toFixed(2)}px`);
        writeStyle(target, "--scene-camera-y", `${cameraY.toFixed(2)}px`);
        writeStyle(target, "--scene-camera-scale", cameraScale.toFixed(4));
        writeStyle(target, "--scene-camera-roll", `${cameraRoll.toFixed(3)}deg`);
        writeStyle(target, "--scene-entry-shift", `${entryShift.toFixed(2)}px`);
        writeStyle(
          target,
          "--scene-discovery-shift",
          `${discoveryShift.toFixed(2)}px`,
        );
        writeStyle(
          target,
          "--scene-resolution-shift",
          `${resolutionShift.toFixed(2)}px`,
        );
        writeStyle(
          target,
          "--scene-seam-shift",
          `${seamShift.toFixed(2)}px`,
        );
        writeStyle(target, "--scene-mask", `${mask.toFixed(2)}%`);
        writeStyle(target, "--scene-content-opacity", contentOpacity.toFixed(4));
      });

      const scrollIsMoving =
        Math.abs(targetVelocity) > 0.004 ||
        Math.abs(renderedVelocity) > 0.004;
      const needsAnotherFrame =
        scrollIsMoving ||
        Math.abs(pointerTargetX - pointerX) > 0.003 ||
        Math.abs(pointerTargetY - pointerY) > 0.003 ||
        renderedTouchX !== touchDriftX ||
        renderedTouchY !== touchDriftY;

      if (needsAnotherFrame) {
        setScrollState(scrollIsMoving ? "moving" : "settled");
        frame = window.requestAnimationFrame(renderCamera);
      } else {
        lastFrameTime = 0;
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
      const target = event.target;
      // Native controls, horizontal topic rails, and pinch gestures own their
      // input. Track one finger only when the gesture begins on a scene.
      if (
        activeIndexRef.current < 0 || event.touches.length !== 1 ||
        !(target instanceof Element) || !page.contains(target) ||
        !target.closest(".insights-scene") ||
        target.closest(
          "a, button, input, textarea, select, label, [contenteditable], [role='slider'], [role='tablist'], .insights-worksheet, .insights-library__topics, .insights-library__pager",
        )
      ) {
        handleTouchEnd();
        return;
      }
      const touch = event.touches[0];
      if (!touch) return;
      touchIdentifier = touch.identifier;
      touchOriginX = touch.clientX;
      touchOriginY = touch.clientY;
      touchDriftX = 0;
      touchDriftY = 0;
    }

    function handleTouchMove(event: TouchEvent) {
      if (touchIdentifier === null) return;
      if (activeIndexRef.current < 0 || event.touches.length !== 1) {
        handleTouchEnd();
        return;
      }
      const touch = Array.from(event.touches).find(
        (point) => point.identifier === touchIdentifier,
      );
      if (!touch) {
        handleTouchEnd();
        return;
      }
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
      touchIdentifier = null;
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
        lastFrameTime = 0;
        targetVelocity = 0;
        renderedVelocity = 0;
        touchIdentifier = null;
        touchDriftX = 0;
        touchDriftY = 0;
        renderedTouchX = 0;
        renderedTouchY = 0;
        pointerTargetX = 0;
        pointerTargetY = 0;
        pointerX = 0;
        pointerY = 0;
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
    window.addEventListener("blur", handleTouchEnd);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    renderCamera();

    return () => {
      window.cancelAnimationFrame(frame);
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
      window.removeEventListener("blur", handleTouchEnd);
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
    let restoreFrame = 0;
    function restoreSceneFromHistory() {
      window.cancelAnimationFrame(restoreFrame);
      const scene = scenes.find(({ id }) => window.location.hash === `#${id}`);
      if (!scene) return;

      const target = document.getElementById(scene.id);
      if (!target) return;

      restoreFrame = window.requestAnimationFrame(() => {
        restoreFrame = 0;
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
    return () => {
      window.cancelAnimationFrame(restoreFrame);
      window.removeEventListener("popstate", restoreSceneFromHistory);
    };
  }, [lenis, prefersReducedMotion, scenes]);

  function handleSceneJourney(
    event: MouseEvent<HTMLAnchorElement>,
    scene: InsightScene,
  ) {
    if (
      event.defaultPrevented || event.button !== 0 || event.metaKey ||
      event.ctrlKey || event.shiftKey || event.altKey
    ) return;
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
  const navigationVisible = Boolean(activeScene) || hasNavigationFocus;

  return (
    <nav
      className="insights-scene-compass"
      data-insights-scene-compass
      aria-label="Insights chapters"
      aria-hidden={navigationVisible ? undefined : true}
      inert={!navigationVisible}
      data-visible={navigationVisible ? "true" : "false"}
      data-current={activeScene ? "true" : "false"}
      data-theme={activeScene?.theme ?? "light"}
      onFocusCapture={() => setHasNavigationFocus(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHasNavigationFocus(false);
        }
      }}
      style={
        {
          "--compass-accent": activeScene?.accent ?? "#D77A51",
          "--compass-index": Math.max(0, activeIndex),
          "--compass-count": scenes.length,
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
