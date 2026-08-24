"use client";

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EASE_AIR } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ContactSceneVariant = "branch" | "paper" | "horizon" | "afterglow";

type SceneMotion = {
  cameraX: number[];
  cameraY: number[];
  cameraScale: number[];
  cameraClip: string[];
  contentX: number[];
  contentY: number[];
  contentScale: number[];
  contentRotateX: number[];
  contentRotateY: number[];
};

const BEATS = [0, 0.18, 0.48, 0.78, 1];

const SCENE_HANDOFF: Record<ContactSceneVariant, string> = {
  branch: "linear-gradient(180deg, rgba(221,226,220,0) 0%, rgba(221,226,220,0.9) 100%)",
  paper: "linear-gradient(180deg, rgba(39,34,30,0) 0%, rgba(39,34,30,0.9) 100%)",
  horizon: "linear-gradient(180deg, rgba(39,34,30,0) 0%, rgba(39,34,30,0.96) 100%)",
  afterglow: "linear-gradient(180deg, rgba(39,34,30,0) 0%, rgba(39,34,30,0.98) 100%)",
};

const SCENE_MOTION: Record<ContactSceneVariant, SceneMotion> = {
  branch: {
    cameraX: [18, 9, 0, -5, -12],
    cameraY: [-30, -16, 0, 12, 26],
    cameraScale: [1.18, 1.1, 1.035, 1.035, 1.08],
    cameraClip: [
      "inset(14% 8% 16% 8% round 2.75rem)",
      "inset(7% 4% 8% 4% round 2.1rem)",
      "inset(0% 0% 0% 0% round 0rem)",
      "inset(0% 0% 0% 0% round 0rem)",
      "inset(6% 3% 5% 3% round 1.75rem)",
    ],
    contentX: [24, 12, 0, -4, -10],
    contentY: [22, 11, 0, -4, -13],
    contentScale: [0.975, 0.988, 1, 1, 0.992],
    contentRotateX: [1.4, 0.7, 0, 0, -0.7],
    contentRotateY: [-2, -1, 0, 0.2, 1.1],
  },
  paper: {
    cameraX: [-20, -10, 0, 4, 12],
    cameraY: [-24, -12, 0, 10, 24],
    cameraScale: [1.16, 1.09, 1.035, 1.04, 1.08],
    cameraClip: [
      "inset(10% 14% 12% 2% round 2.5rem)",
      "inset(5% 8% 6% 1% round 1.9rem)",
      "inset(0% 0% 0% 0% round 0rem)",
      "inset(0% 0% 0% 0% round 0rem)",
      "inset(5% 2% 4% 10% round 1.8rem)",
    ],
    contentX: [-17, -8, 0, 3, 10],
    contentY: [28, 14, 0, -5, -16],
    contentScale: [0.97, 0.986, 1, 1, 0.992],
    contentRotateX: [2.2, 1.1, 0, 0, -1],
    contentRotateY: [1.5, 0.7, 0, -0.2, -1.2],
  },
  horizon: {
    cameraX: [0, 0, 0, -3, -7],
    cameraY: [-36, -20, 0, 12, 28],
    cameraScale: [1.22, 1.14, 1.055, 1.035, 1.08],
    cameraClip: [
      "inset(15% 4% 0% 4% round 2.75rem 2.75rem 0rem 0rem)",
      "inset(7% 2% 0% 2% round 2rem 2rem 0rem 0rem)",
      "inset(0% 0% 0% 0% round 0rem)",
      "inset(0% 0% 0% 0% round 0rem)",
      "inset(4% 3% 3% 3% round 1.8rem)",
    ],
    contentX: [0, 0, 0, -2, -6],
    contentY: [34, 17, 0, -5, -16],
    contentScale: [0.968, 0.985, 1, 1, 0.99],
    contentRotateX: [2.8, 1.3, 0, -0.1, -1.2],
    contentRotateY: [-0.7, -0.3, 0, 0.2, 0.7],
  },
  afterglow: {
    cameraX: [0, 0, 0, 2, 5],
    cameraY: [-18, -9, 0, 10, 24],
    cameraScale: [1.16, 1.09, 1.03, 1.04, 1.1],
    cameraClip: [
      "circle(27% at 50% 44%)",
      "circle(48% at 50% 46%)",
      "circle(76% at 50% 50%)",
      "circle(76% at 50% 52%)",
      "circle(58% at 50% 62%)",
    ],
    contentX: [0, 0, 0, 0, 0],
    contentY: [24, 12, 0, -4, -14],
    contentScale: [0.97, 0.986, 1, 1, 0.992],
    contentRotateX: [1.8, 0.9, 0, 0, -0.8],
    contentRotateY: [0, 0, 0, 0, 0],
  },
};

/**
 * Contact's shared camera grammar. Each chapter moves through the same four
 * beats—contained anticipation, opening activation, full-frame discovery and
 * a gently compressed handoff—without pinning or replacing native scrolling.
 */
export function ContactCinematicScene({
  id,
  labelledBy,
  variant,
  media,
  children,
  className,
}: {
  id?: string;
  labelledBy: string;
  variant: ContactSceneVariant;
  media: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const sceneRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const [hasReadingFocus, setHasReadingFocus] = useState(false);
  const prefersReducedMotion = useHydratedReducedMotion();
  const simplifiedCamera = useMediaQuery("(max-width: 940px), (pointer: coarse)");
  const isNearViewport = useInView(sceneRef, { margin: "40% 0px 40% 0px" });
  const motionEnabled = !prefersReducedMotion && isNearViewport;
  const config = SCENE_MOTION[variant];
  const { scrollY, scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 118,
    damping: 29,
    mass: 0.32,
  });

  const scrollVelocity = useVelocity(scrollY);
  const velocityDriftRaw = useTransform(scrollVelocity, [-2400, 0, 2400], [-12, 0, 12]);
  const velocityTiltRaw = useTransform(scrollVelocity, [-2400, 0, 2400], [0.9, 0, -0.9]);
  const velocityDrift = useSpring(velocityDriftRaw, { stiffness: 145, damping: 27, mass: 0.28 });
  const velocityTilt = useSpring(velocityTiltRaw, { stiffness: 155, damping: 28, mass: 0.26 });
  const pointerXSmooth = useSpring(pointerX, { stiffness: 105, damping: 22, mass: 0.32 });
  const pointerYSmooth = useSpring(pointerY, { stiffness: 105, damping: 22, mass: 0.32 });

  const cameraX = useTransform(progress, BEATS, config.cameraX);
  const cameraY = useTransform(progress, BEATS, config.cameraY);
  const cameraScale = useTransform(progress, BEATS, config.cameraScale);
  const cameraClip = useTransform(progress, BEATS, config.cameraClip);
  const contentX = useTransform(progress, BEATS, config.contentX);
  const contentY = useTransform(progress, BEATS, config.contentY);
  const contentScale = useTransform(progress, BEATS, config.contentScale);
  const contentRotateX = useTransform(progress, BEATS, config.contentRotateX);
  const contentRotateY = useTransform(progress, BEATS, config.contentRotateY);
  const touchCameraY = useTransform(progress, [0, 0.48, 1], [-10, 0, 8]);
  const touchCameraScale = useTransform(progress, [0, 0.48, 1], [1.055, 1.025, 1.04]);
  const touchContentY = useTransform(progress, [0, 0.48, 1], [10, 0, -7]);
  const touchContentScale = useTransform(progress, [0, 0.48, 1], [0.992, 1, 0.996]);
  const seamProgress = useTransform(progress, [0.08, 0.86], [0, 1]);
  const seamY = useTransform(progress, [0.08, 0.86], ["0%", "100%"]);
  const seamOpacity = useTransform(progress, [0, 0.12, 0.5, 0.88, 1], [0, 0.45, 0.72, 0.38, 0]);
  const handoffOpacity = useTransform(progress, [0.68, 0.88, 1], [0, 0.38, 1]);

  const cameraTranslateX = useTransform(
    [cameraX, pointerXSmooth],
    ([sceneX, cursorX]) => Number(sceneX) + Number(cursorX),
  );
  const cameraTranslateY = useTransform(
    [cameraY, pointerYSmooth, velocityDrift],
    ([sceneY, cursorY, inertia]) => Number(sceneY) + Number(cursorY) + Number(inertia),
  );
  const contentTranslateX = useTransform(
    [contentX, pointerXSmooth],
    ([sceneX, cursorX]) => Number(sceneX) - Number(cursorX) * 0.34,
  );
  const contentTranslateY = useTransform(
    [contentY, pointerYSmooth],
    ([sceneY, cursorY]) => Number(sceneY) - Number(cursorY) * 0.26,
  );

  useEffect(() => {
    const video = sceneRef.current?.querySelector("video");
    if (!video || prefersReducedMotion) return;

    if (hasReadingFocus) {
      const keepPaused = () => video.pause();
      video.addEventListener("play", keepPaused);
      video.pause();
      return () => video.removeEventListener("play", keepPaused);
    }

    const rect = video.getBoundingClientRect();
    const margin = window.innerHeight * 0.25;
    const nearViewport = rect.bottom >= -margin && rect.top <= window.innerHeight + margin;
    if (nearViewport && !document.hidden) video.play().catch(() => undefined);
  }, [hasReadingFocus, prefersReducedMotion]);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!motionEnabled || hasReadingFocus || simplifiedCamera || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(normalizedX * 16);
    pointerY.set(normalizedY * 12);
  }

  function settlePointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  function handleFocusCapture(event: FocusEvent<HTMLElement>) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const readingFocus =
      target.matches("input, textarea, select, [contenteditable='true']") ||
      target.matches(":focus-visible");
    if (!readingFocus) return;

    settlePointer();
    setHasReadingFocus(true);
  }

  function handleBlurCapture(event: FocusEvent<HTMLElement>) {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
    setHasReadingFocus(false);
  }

  return (
    <section
      ref={sceneRef}
      id={id}
      aria-labelledby={labelledBy}
      data-contact-scene={variant}
      data-contact-camera={simplifiedCamera ? "touch" : "full"}
      data-contact-reading-focus={hasReadingFocus ? "true" : undefined}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      onPointerMove={handlePointerMove}
      onPointerLeave={settlePointer}
      onPointerCancel={settlePointer}
      className={cn(
        "relative min-h-[100svh] scroll-mt-24 overflow-hidden touch-pan-y [perspective:1600px]",
        className,
      )}
    >
      <motion.div
        aria-hidden="true"
        data-contact-scene-media="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        initial={false}
        animate={{ opacity: hasReadingFocus ? 0.8 : 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE_AIR }}
        style={
          !motionEnabled
            ? undefined
            : simplifiedCamera
              ? {
                  y: touchCameraY,
                  scale: touchCameraScale,
                  transformPerspective: 1200,
                  willChange: "transform",
                }
            : {
                x: cameraTranslateX,
                y: cameraTranslateY,
                scale: cameraScale,
                rotateZ: velocityTilt,
                clipPath: cameraClip,
                transformPerspective: 1600,
                willChange: "transform, clip-path",
              }
        }
      >
        {media}
      </motion.div>

      {/* The three chapters share a match cut: the outgoing landscape
          develops the ground colour of the next scene before the boundary
          arrives. It lives behind the readable plane, so the transition
          changes atmosphere without veiling copy or controls. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[18%]"
        style={{
          backgroundImage: SCENE_HANDOFF[variant],
          opacity: motionEnabled ? handoffOpacity : 0.72,
        }}
      />

      <motion.div
        data-contact-scene-plane="true"
        className="relative z-10 flex min-h-[100svh] w-full items-center"
        style={
          !motionEnabled
            ? undefined
            : simplifiedCamera
              ? {
                  y: touchContentY,
                  scale: touchContentScale,
                  transformOrigin: "50% 50%",
                  willChange: "transform",
                }
            : {
                x: contentTranslateX,
                y: contentTranslateY,
                scale: contentScale,
                rotateX: contentRotateX,
                rotateY: contentRotateY,
                transformPerspective: 1600,
                transformOrigin: "50% 50%",
                willChange: "transform",
              }
        }
      >
        {children}
      </motion.div>

      <motion.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute bottom-[18%] right-[clamp(0.8rem,2vw,1.75rem)] top-[18%] z-20 hidden w-px origin-top bg-current/15 lg:block",
          variant === "horizon" || variant === "afterglow" ? "text-sandstone" : "text-soil",
        )}
        style={motionEnabled ? { opacity: seamOpacity } : { opacity: 0.28 }}
      >
        <motion.span
          className="absolute inset-0 block origin-top bg-current/55"
          style={{ scaleY: motionEnabled ? seamProgress : 1 }}
        />
        <motion.span
          className="absolute -left-[0.22rem] top-0 h-[0.5rem] w-[0.5rem] rounded-full border border-current/45 bg-current/20 shadow-[0_0_24px_currentColor]"
          style={
            motionEnabled
              ? { top: seamY, translateY: "-50%" }
              : { top: "50%", translateY: "-50%" }
          }
        />
      </motion.div>
    </section>
  );
}
