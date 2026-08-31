"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ChevronDown, ChevronUp, ListTree } from "lucide-react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import styles from "./AboutCinematicRuntime.module.css";

const CHAPTERS = [
  { id: "about-origin", label: "Formative fields" },
  { id: "about-philosophy", label: "Point of view" },
  { id: "about-convergence", label: "Synthesis" },
  { id: "about-system", label: "Brand system" },
  { id: "about-principles", label: "Working standards" },
  { id: "about-founder-led", label: "One strategic thread" },
  { id: "about-evidence", label: "Evidence chain" },
  { id: "about-resolution", label: "The next move" },
] as const;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const THREAD_ACTIVE_FRAME_MS = 32;
const THREAD_IDLE_FRAME_MS = 64;

export function AboutCinematicRuntime() {
  const runtimeRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLCanvasElement>(null);
  const mobileControlsRef = useRef<HTMLElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const lenis = useLenis();
  const [activeChapter, setActiveChapter] = useState(0);
  const [navigatorActive, setNavigatorActive] = useState(false);
  const [navigatorTone, setNavigatorTone] = useState("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.aboutFilm = "true";
    return () => {
      delete root.dataset.aboutFilm;
    };
  }, []);

  useEffect(() => {
    const runtime = runtimeRef.current;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-about-film-scene]"));
    if (!runtime || scenes.length === 0) return;

    let frame = 0;

    const updateNavigator = () => {
      frame = 0;
      const viewportHeight = Math.max(window.innerHeight, 1);
      const sceneRects = scenes.map((scene) => scene.getBoundingClientRect());
      let strongestFocus = -1;
      let nextActive = 0;

      sceneRects.forEach((rect, index) => {
        const centerDelta = Math.abs(rect.top + rect.height * 0.5 - viewportHeight * 0.5);
        const focus = clamp(1 - centerDelta / Math.max(viewportHeight * 0.78, rect.height * 0.58));
        if (focus > strongestFocus) {
          strongestFocus = focus;
          nextActive = index;
        }
      });

      const firstRect = sceneRects[0];
      const finalRect = sceneRects[sceneRects.length - 1];
      const firstTop = window.scrollY + firstRect.top;
      const finalBottom = window.scrollY + finalRect.bottom;
      const runway = Math.max(finalBottom - viewportHeight - firstTop, 1);
      const progress = clamp((window.scrollY - firstTop) / runway);
      const active = firstRect.top <= viewportHeight * 0.82 && finalRect.bottom >= viewportHeight * 0.18;
      const tone = scenes[nextActive].dataset.sceneTone ?? "dark";

      scenes.forEach((scene, index) => {
        scene.dataset.sceneActive = String(index === nextActive);
      });
      runtime.style.setProperty("--navigator-progress", progress.toFixed(4));
      runtime.dataset.navigatorActive = String(active);
      runtime.dataset.navigatorTone = tone;
      setActiveChapter(nextActive);
      setNavigatorActive(active);
      setNavigatorTone(tone);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateNavigator);
    };

    updateNavigator();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      scenes.forEach((scene) => delete scene.dataset.sceneActive);
    };
  }, []);

  useEffect(() => {
    function restoreChapterFromHistory() {
      const index = CHAPTERS.findIndex(({ id }) => window.location.hash === `#${id}`);
      if (index < 0) return;

      const target = document.getElementById(CHAPTERS[index].id);
      if (!target) return;
      setActiveChapter(index);

      window.requestAnimationFrame(() => {
        if (lenis && !reducedMotion) {
          lenis.scrollTo(target, {
            duration: 0.68,
            easing: (value) => 1 - Math.pow(1 - value, 3),
          });
          return;
        }

        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }

    window.addEventListener("popstate", restoreChapterFromHistory);
    return () => window.removeEventListener("popstate", restoreChapterFromHistory);
  }, [lenis, reducedMotion]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeChapter, navigatorActive]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMobileMenuOpen(false);
      window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      if (event.target instanceof Node && mobileControlsRef.current?.contains(event.target)) return;
      setMobileMenuOpen(false);
    }

    function closeOnScroll() {
      setMobileMenuOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("scroll", closeOnScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("scroll", closeOnScroll);
    };
  }, [mobileMenuOpen]);

  function goToChapter(index: number, moveFocus = false) {
    const chapter = CHAPTERS[index];
    if (!chapter) return;
    const target = document.getElementById(chapter.id);
    if (!target) return;
    setMobileMenuOpen(false);

    const nextHash = `#${chapter.id}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState({ aboutChapter: chapter.id }, "", nextHash);
    }

    if (moveFocus) {
      const focusTarget = target.querySelector<HTMLElement>("h2") ?? target;
      focusTarget.tabIndex = -1;
      focusTarget.focus({ preventScroll: true });
    }

    if (lenis && !reducedMotion) {
      lenis.scrollTo(target, {
        duration: 0.82,
        easing: (value) => 1 - Math.pow(1 - value, 3),
      });
      return;
    }

    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function onChapterKeyDown(event: ReactKeyboardEvent<HTMLAnchorElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = Math.min(index + 1, CHAPTERS.length - 1);
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = Math.max(index - 1, 0);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = CHAPTERS.length - 1;
    else return;
    event.preventDefault();
    goToChapter(next);
    document.getElementById(`about-chapter-control-${next}`)?.focus();
  }

  useEffect(() => {
    const runtime = runtimeRef.current;
    const thread = threadRef.current;
    const film = document.querySelector<HTMLElement>("#main-content");
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-about-film-scene]"));
    const context = thread?.getContext("2d", { alpha: true });
    if (!runtime || !thread || !context || !film || scenes.length === 0) return;

    const cameraReady = window.matchMedia(
      "(min-width: 941px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!cameraReady.matches) return;

    let frame = 0;
    let lastScrollY = window.scrollY;
    let smoothedVelocity = 0;
    let lastDirection = 1;
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.5;
    let pointerTargetX = pointerX;
    let pointerTargetY = pointerY;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let pixelRatio = 1;
    let previousFrameAt = performance.now();
    let ambientPhase = 0;
    let layoutDirty = true;
    let activeScene = 0;
    let activeSceneProgress = 0;
    let narrativeActive = false;
    let activeTone = "dark";
    let filmProgress = 0;
    let previousActiveScene = -1;
    let previousVelocityValue = "";
    let previousDirectionValue = "";
    let previousPointerXValue = "";
    let previousPointerYValue = "";
    let previousNarrativeActive = false;
    let previousThreadTone = activeTone;
    let lastThreadPaintAt = Number.NEGATIVE_INFINITY;
    let threadPaintDirty = true;

    const resizeThread = () => {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
      thread.width = Math.round(canvasWidth * pixelRatio);
      thread.height = Math.round(canvasHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      layoutDirty = true;
      threadPaintDirty = true;
    };

    const pointOnCurve = (
      t: number,
      start: readonly [number, number],
      controlA: readonly [number, number],
      controlB: readonly [number, number],
      end: readonly [number, number],
    ) => {
      const inverse = 1 - t;
      const inverseSquared = inverse * inverse;
      const tSquared = t * t;
      return {
        x: inverseSquared * inverse * start[0]
          + 3 * inverseSquared * t * controlA[0]
          + 3 * inverse * tSquared * controlB[0]
          + tSquared * t * end[0],
        y: inverseSquared * inverse * start[1]
          + 3 * inverseSquared * t * controlA[1]
          + 3 * inverse * tSquared * controlB[1]
          + tSquared * t * end[1],
      };
    };

    const drawThread = ({
      active,
      activeProgress,
      filmProgress,
      tone,
    }: {
      active: boolean;
      activeProgress: number;
      filmProgress: number;
      tone: string;
    }) => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      if (!active) return;

      const darkScene = tone !== "light";
      const color = darkScene ? "222, 199, 166" : "116, 83, 63";
      const drift = Math.sin(ambientPhase * 0.72) * canvasHeight * 0.012;
      const pointerLift = (pointerY / Math.max(canvasHeight, 1) - 0.5) * canvasHeight * 0.08;
      const velocityWake = smoothedVelocity * canvasHeight * 1.8;
      const start: [number, number] = [
        -canvasWidth * 0.04,
        canvasHeight * (0.79 - filmProgress * 0.31) + drift,
      ];
      const controlA: [number, number] = [
        canvasWidth * 0.28,
        canvasHeight * 0.72 + pointerLift + velocityWake,
      ];
      const controlB: [number, number] = [
        canvasWidth * 0.7,
        canvasHeight * 0.23 - pointerLift - velocityWake,
      ];
      const end: [number, number] = [
        canvasWidth * 1.04,
        canvasHeight * (0.19 + filmProgress * 0.28) - drift,
      ];

      const drawCurve = (offsetY: number, alpha: number, width: number) => {
        const gradient = context.createLinearGradient(0, 0, canvasWidth, 0);
        gradient.addColorStop(0, `rgba(${color}, 0)`);
        gradient.addColorStop(0.22, `rgba(${color}, ${alpha * 0.42})`);
        gradient.addColorStop(0.54, `rgba(${color}, ${alpha})`);
        gradient.addColorStop(0.82, `rgba(${color}, ${alpha * 0.36})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        context.beginPath();
        context.moveTo(start[0], start[1] + offsetY);
        context.bezierCurveTo(
          controlA[0],
          controlA[1] + offsetY,
          controlB[0],
          controlB[1] + offsetY,
          end[0],
          end[1] + offsetY,
        );
        context.strokeStyle = gradient;
        context.lineWidth = width;
        context.stroke();
      };

      context.save();
      context.globalCompositeOperation = darkScene ? "screen" : "multiply";
      drawCurve(0, darkScene ? 0.2 : 0.16, 0.85 + Math.abs(smoothedVelocity) * 9);
      if (Math.abs(smoothedVelocity) > 0.002) {
        drawCurve(
          lastDirection * Math.abs(smoothedVelocity) * canvasHeight * 0.42,
          Math.min(0.12, Math.abs(smoothedVelocity) * 1.8),
          0.55,
        );
      }

      const beadProgress = 0.16 + activeProgress * 0.68;
      const bead = pointOnCurve(beadProgress, start, controlA, controlB, end);
      const glow = context.createRadialGradient(bead.x, bead.y, 0, bead.x, bead.y, 11);
      glow.addColorStop(0, `rgba(${color}, ${darkScene ? 0.72 : 0.54})`);
      glow.addColorStop(0.18, `rgba(${color}, 0.28)`);
      glow.addColorStop(1, `rgba(${color}, 0)`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(bead.x, bead.y, 11, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = `rgba(${color}, ${darkScene ? 0.88 : 0.72})`;
      context.beginPath();
      context.arc(bead.x, bead.y, 1.35 + Math.abs(smoothedVelocity) * 8, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const render = (now = performance.now()) => {
      frame = 0;
      if (document.documentElement.dataset.motion === "reduced") {
        smoothedVelocity = 0;
        runtime.dataset.active = "false";
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        delete document.documentElement.dataset.aboutFilmSnap;
        return;
      }

      const frameElapsed = Math.min(100, Math.max(0, now - previousFrameAt));
      previousFrameAt = now;
      ambientPhase += Math.min(34, frameElapsed) / 1000;
      const responseBlend = 1 - Math.pow(0.82, frameElapsed / (1000 / 60));

      const viewportHeight = Math.max(window.innerHeight, 1);
      const currentScrollY = window.scrollY;
      const scrollChanged = currentScrollY !== lastScrollY;
      const rawVelocity = clamp((currentScrollY - lastScrollY) / viewportHeight, -0.12, 0.12);
      smoothedVelocity += (rawVelocity - smoothedVelocity) * responseBlend;
      if (rawVelocity === 0 && Math.abs(smoothedVelocity) < 0.00005) smoothedVelocity = 0;
      if (rawVelocity !== 0) lastDirection = rawVelocity > 0 ? 1 : -1;
      pointerX += (pointerTargetX - pointerX) * responseBlend;
      pointerY += (pointerTargetY - pointerY) * responseBlend;
      if (Math.abs(pointerTargetX - pointerX) < 0.1) pointerX = pointerTargetX;
      if (Math.abs(pointerTargetY - pointerY) < 0.1) pointerY = pointerTargetY;
      lastScrollY = currentScrollY;

      if (layoutDirty || scrollChanged) {
        layoutDirty = false;
        const sceneRects = scenes.map((scene) => scene.getBoundingClientRect());
        const firstSceneTop = currentScrollY + sceneRects[0].top;
        if (currentScrollY >= firstSceneTop - 2) {
          document.documentElement.dataset.aboutFilmSnap = "true";
        } else {
          delete document.documentElement.dataset.aboutFilmSnap;
        }

        let strongestFocus = -1;
        sceneRects.forEach((rect, index) => {
          const scene = scenes[index];
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
          scene.dataset.scenePhase = phase;

          if (focus > strongestFocus) {
            strongestFocus = focus;
            activeScene = index;
            activeSceneProgress = progress;
          }
        });

        if (activeScene !== previousActiveScene) {
          scenes.forEach((scene, index) => {
            scene.dataset.sceneActive = String(index === activeScene);
          });
          previousActiveScene = activeScene;
        }

        const finalSceneBottom = currentScrollY + sceneRects[sceneRects.length - 1].bottom;
        const narrativeRunway = Math.max(finalSceneBottom - viewportHeight - firstSceneTop, 1);
        filmProgress = clamp((currentScrollY - firstSceneTop) / narrativeRunway);
        narrativeActive = currentScrollY >= firstSceneTop - viewportHeight * 0.12
          && currentScrollY <= finalSceneBottom;
        activeTone = scenes[activeScene].dataset.sceneTone ?? "dark";

        runtime.dataset.active = String(narrativeActive);
        runtime.dataset.tone = activeTone;
        runtime.dataset.phase = scenes[activeScene].dataset.scenePhase ?? "anticipation";
        runtime.style.setProperty("--film-progress", filmProgress.toFixed(4));
        runtime.style.setProperty("--active-chapter-progress", activeSceneProgress.toFixed(4));
      }

      const pointerSettling = Math.abs(pointerTargetX - pointerX) + Math.abs(pointerTargetY - pointerY) > 0.5;
      const velocityValue = Math.abs(smoothedVelocity).toFixed(4);
      const directionValue = String(lastDirection);
      if (velocityValue !== previousVelocityValue || directionValue !== previousDirectionValue) {
        scenes.forEach((scene) => {
          scene.style.setProperty("--scene-velocity", velocityValue);
          scene.style.setProperty("--scene-direction", directionValue);
        });
        runtime.style.setProperty("--film-velocity", velocityValue);
        runtime.style.setProperty("--film-direction", directionValue);
        previousVelocityValue = velocityValue;
        previousDirectionValue = directionValue;
      }

      const pointerXValue = `${pointerX.toFixed(1)}px`;
      const pointerYValue = `${pointerY.toFixed(1)}px`;
      if (pointerXValue !== previousPointerXValue || pointerYValue !== previousPointerYValue) {
        runtime.style.setProperty("--film-pointer-x", pointerXValue);
        runtime.style.setProperty("--film-pointer-y", pointerYValue);
        previousPointerXValue = pointerXValue;
        previousPointerYValue = pointerYValue;
      }

      // The final thread frame remains visible while the visitor pauses, but
      // full-screen canvas compositing yields completely once input settles.
      // Scene progress still updates on every scheduled render; only the
      // decorative paint is capped during input.
      const threadInteracting = scrollChanged || Math.abs(smoothedVelocity) > 0.0002 || pointerSettling;
      const threadFrameInterval = threadInteracting ? THREAD_ACTIVE_FRAME_MS : THREAD_IDLE_FRAME_MS;
      const threadStateChanged =
        narrativeActive !== previousNarrativeActive || activeTone !== previousThreadTone;
      if (threadPaintDirty || threadStateChanged || now - lastThreadPaintAt >= threadFrameInterval) {
        drawThread({
          active: narrativeActive,
          activeProgress: activeSceneProgress,
          filmProgress,
          tone: activeTone,
        });
        // Measure the next interval from completed paint, not the rAF start.
        // On a constrained device the paint itself may consume a frame; using
        // `now` would make the next callback immediately eligible again.
        lastThreadPaintAt = performance.now();
        previousNarrativeActive = narrativeActive;
        previousThreadTone = activeTone;
        threadPaintDirty = false;
      }

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

    resizeThread();
    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", resizeThread);
    window.addEventListener("resize", requestRender);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", resizeThread);
      window.removeEventListener("resize", requestRender);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionPreferenceObserver.disconnect();
      context.clearRect(0, 0, canvasWidth, canvasHeight);
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

  const mobileNavigatorActive = navigatorActive;

  return (
    <div ref={runtimeRef} className={styles.runtime} data-navigator-ending={activeChapter === CHAPTERS.length - 1}>
      <canvas ref={threadRef} className={styles.livingThread} aria-hidden="true" />
      <div className={styles.cursorLight} aria-hidden="true" />
      <div className={styles.velocityVeil} aria-hidden="true" />
      <nav
        className={styles.chapterSpine}
        aria-label="About page chapters"
        aria-hidden={!navigatorActive}
        data-tone={navigatorTone}
      >
        <span className={styles.spineTrack}><i /></span>
        <ol>
          {CHAPTERS.map((chapter, index) => (
            <li
              key={chapter.id}
              data-active={index === activeChapter}
              data-state={index < activeChapter ? "passed" : index === activeChapter ? "active" : "waiting"}
            >
              <a
                id={`about-chapter-control-${index}`}
                href={`#${chapter.id}`}
                aria-current={index === activeChapter ? "step" : undefined}
                aria-controls={chapter.id}
                aria-label={`${String(index + 1).padStart(2, "0")}. ${chapter.label}`}
                tabIndex={navigatorActive && index === activeChapter ? 0 : -1}
                onClick={(event) => {
                  event.preventDefault();
                  goToChapter(index, event.detail === 0);
                }}
                onKeyDown={(event) => onChapterKeyDown(event, index)}
              >
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <strong>{chapter.label}</strong>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <nav
        ref={mobileControlsRef}
        className={styles.mobileChapterControls}
        data-about-mobile-chapter-controls
        aria-label="Move through About page chapters"
        aria-hidden={!mobileNavigatorActive}
        data-active={mobileNavigatorActive}
        data-tone={navigatorTone}
      >
        <div
          id="about-mobile-chapter-list"
          className={styles.mobileChapterPanel}
          data-open={mobileMenuOpen}
          aria-hidden={!mobileMenuOpen}
        >
          <ol>
            {CHAPTERS.map((chapter, index) => (
              <li key={chapter.id} data-active={index === activeChapter}>
                <a
                  href={`#${chapter.id}`}
                  aria-current={index === activeChapter ? "step" : undefined}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  onClick={(event) => {
                    event.preventDefault();
                    goToChapter(index, true);
                  }}
                >
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{chapter.label}</strong>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <button
          className={styles.mobileStepButton}
          type="button"
          aria-label="Previous About chapter"
          disabled={activeChapter === 0}
          tabIndex={mobileNavigatorActive ? 0 : -1}
          onClick={() => goToChapter(activeChapter - 1)}
        >
          <ChevronUp size={16} aria-hidden="true" />
        </button>
        <button
          ref={mobileMenuButtonRef}
          className={styles.mobileChapterSummary}
          type="button"
          aria-label={`Choose About chapter. Current chapter: ${CHAPTERS[activeChapter].label}`}
          aria-expanded={mobileMenuOpen}
          aria-controls="about-mobile-chapter-list"
          tabIndex={mobileNavigatorActive ? 0 : -1}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span aria-live="polite">
            <small>{String(activeChapter + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}</small>
            <strong>{CHAPTERS[activeChapter].label}</strong>
            <i className={styles.mobileChapterProgress} aria-hidden="true"><b /></i>
          </span>
          <ListTree size={15} aria-hidden="true" />
        </button>
        <button
          className={styles.mobileStepButton}
          type="button"
          aria-label="Next About chapter"
          disabled={activeChapter === CHAPTERS.length - 1}
          tabIndex={mobileNavigatorActive ? 0 : -1}
          onClick={() => goToChapter(activeChapter + 1, activeChapter === CHAPTERS.length - 2)}
        >
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
