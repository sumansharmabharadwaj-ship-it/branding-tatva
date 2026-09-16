"use client";

import { createContext, useEffect, useMemo, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type ContactSceneVariant = "branch" | "paper" | "horizon" | "daybreak" | "afterglow";

export const ContactSceneMotion = createContext<{
  progress: MotionValue<number>;
  readingRest: MotionValue<number>;
  enabled: boolean;
  compact: boolean;
} | null>(null);

const SCENE_EXPOSURE: Record<ContactSceneVariant, string> = {
  branch: "radial-gradient(ellipse at 18% 28%, #ffe6b6 0%, transparent 62%)",
  paper: "radial-gradient(ellipse at 78% 22%, #e7edce 0%, transparent 62%)",
  horizon: "radial-gradient(ellipse at 52% 88%, #edc38e 0%, transparent 62%)",
  daybreak: "radial-gradient(ellipse at 76% 18%, #ffd5b4 0%, transparent 62%)",
  afterglow: "radial-gradient(ellipse at 62% 72%, #f8cd8e 0%, transparent 62%)",
};

/** One scroll timeline moves the scenery, light and headline. Content and
 * hit targets retain a stable plane, including while a form changes height. */
export function ContactCinematicScene({ id, labelledBy, variant, media, children, className }: {
  id?: string;
  labelledBy: string;
  variant: ContactSceneVariant;
  media: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const sceneRef = useRef<HTMLElement>(null);
  const [hasReadingFocus, setHasReadingFocus] = useState(false);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const compact = useMediaQuery("(max-width: 940px), (pointer: coarse)");
  const nearViewport = useInView(sceneRef, { margin: "20% 0px 20% 0px" });
  // The server and first client frame remain readable, especially on a deep
  // link. Start the camera only after the viewport and preference are known.
  const enabled = hydrated && !prefersReducedMotion;
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
    trackContentSize: true,
  });
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32, mass: 0.45 });
  const readingRest = useSpring(0, { stiffness: 240, damping: 32, mass: 0.5 });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const lightX = useSpring(pointerX, { stiffness: 65, damping: 24, mass: 0.6 });
  const lightY = useSpring(pointerY, { stiffness: 65, damping: 24, mass: 0.6 });
  // Window light crosses the same timeline as the camera. Pointer movement
  // only nudges that path; reversing the scroll retraces the whole exposure.
  const sunlightTravelX = useTransform(progress, [0, 0.48, 1], compact ? [-32, 0, 32] : [-150, 0, 150]);
  const sunlightTravelY = useTransform(progress, [0, 1], compact ? [-12, 12] : [-36, 36]);
  const sunlightScaleTravel = useTransform(progress, [0, 0.48, 1], [1.12, 0.92, 1.08]);
  const cameraTravelY = useTransform(progress, [0, 0.46, 1], compact ? [-8, 0, 8] : [-24, 0, 24]);
  const cameraScaleTravel = useTransform(progress, [0, 0.46, 1], compact ? [1.045, 1.03, 1.045] : [1.1, 1.045, 1.075]);
  const currentTravelX = useTransform(progress, [0, 1], variant === "paper" ? [14, -14] : [-14, 14]);
  const currentTravelY = useTransform(progress, [0, 1], [-8, 8]);
  const currentRotation = useTransform(progress, [0, 1], variant === "paper" ? [12, -8] : [-12, 8]);
  const exposureTravel = useTransform(progress, [0, 0.35, 0.7, 1], [0.4, 0.12, 0.14, 0.35]);
  const lineTravel = useTransform(progress, [0.08, 0.66], [0, 1]);
  const arrivalFeather = useTransform(progress, [0, 0.5, 1], compact ? [1.18, 1, 0.92] : [1.45, 1, 0.8]);
  const departureFeather = useTransform(progress, [0, 0.5, 1], compact ? [0.92, 1, 1.18] : [0.8, 1, 1.45]);
  // The whole composition shares the heading's reading rest. Resizing the
  // form or scrolling with a field focused can update the underlying timeline
  // without pulling the scenery around the reader. Blur rejoins its live pose.
  const cameraY = useTransform(() => cameraTravelY.get() * (1 - readingRest.get()));
  const cameraScale = useTransform(() => cameraScaleTravel.get() + (1.03 - cameraScaleTravel.get()) * readingRest.get());
  const currentX = useTransform(() => `${currentTravelX.get() * (1 - readingRest.get())}%`);
  const currentY = useTransform(() => `${currentTravelY.get() * (1 - readingRest.get())}%`);
  const currentRotate = useTransform(() => currentRotation.get() * (1 - readingRest.get()));
  const exposure = useTransform(() => exposureTravel.get() + (0.12 - exposureTravel.get()) * readingRest.get());
  const sunlightX = useTransform(() => (sunlightTravelX.get() + (compact ? 0 : lightX.get())) * (1 - readingRest.get()));
  const sunlightY = useTransform(() => (sunlightTravelY.get() + (compact ? 0 : lightY.get())) * (1 - readingRest.get()));
  const sunlightScale = useTransform(() => sunlightScaleTravel.get() + (1 - sunlightScaleTravel.get()) * readingRest.get());
  const sunlightOpacity = useTransform(() => 0.42 * (1 - readingRest.get()));
  const lineDraw = useTransform(() => lineTravel.get() + (1 - lineTravel.get()) * readingRest.get());
  const arrivalScale = useTransform(() => arrivalFeather.get() + (1 - arrivalFeather.get()) * readingRest.get());
  const departureScale = useTransform(() => departureFeather.get() + (1 - departureFeather.get()) * readingRest.get());
  const value = useMemo(() => ({ progress, readingRest, enabled, compact }), [progress, readingRest, enabled, compact]);

  useEffect(() => {
    // The shared spring settles scenery and type together; no new scroll
    // listener, frame loop, or React render is needed for individual layers.
    const destination = hasReadingFocus ? 1 : 0;
    if (enabled) readingRest.set(destination);
    else readingRest.jump(destination);
  }, [enabled, hasReadingFocus, readingRest]);

  useEffect(() => {
    // Direct links and preference changes begin at the actual scroll position.
    progress.jump(scrollYProgress.get());
    pointerX.set(0);
    pointerY.set(0);
  }, [enabled, compact, progress, scrollYProgress, pointerX, pointerY]);

  function settlePointer() { pointerX.set(0); pointerY.set(0); }
  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!enabled || compact || hasReadingFocus || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left - rect.width / 2) * 0.25);
    pointerY.set((event.clientY - rect.top - rect.height / 2) * 0.15);
  }
  function onFocus(event: FocusEvent<HTMLElement>) {
    if (event.target instanceof HTMLElement && event.target.matches("input, textarea, select, [contenteditable='true'], :focus-visible")) {
      settlePointer();
      setHasReadingFocus(true);
    }
  }

  return (
    <ContactSceneMotion.Provider value={value}>
      <section
        ref={sceneRef}
        id={id}
        aria-labelledby={labelledBy}
        data-contact-scene={variant}
        data-contact-camera={compact ? "touch" : "full"}
        data-contact-playback="authored"
        data-contact-motion={enabled ? "full" : "reduced"}
        data-contact-in-view={nearViewport ? "true" : "false"}
        data-contact-reading-focus={hasReadingFocus ? "true" : undefined}
        onPointerMove={onPointerMove}
        onPointerLeave={settlePointer}
        onPointerCancel={settlePointer}
        onFocusCapture={onFocus}
        onBlurCapture={(event) => {
          if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setHasReadingFocus(false);
        }}
        // Clip the oversized light layers without creating a scroll container.
        // Hidden overflow let focus navigation scroll the whole composition
        // inside its section, leaving its seam above the actual boundary.
        // Flow-root retains the previous formatting context.
        className={cn("relative flow-root min-h-[100svh] overflow-clip touch-pan-y", className)}
      >
        <motion.div
          aria-hidden="true"
          data-contact-scene-media="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ y: enabled ? cameraY : 0, scale: enabled ? cameraScale : 1, willChange: enabled && nearViewport ? "transform" : undefined }}
        >{media}</motion.div>
        <motion.div
          aria-hidden="true"
          data-contact-scene-current
          style={{ x: enabled ? currentX : 0, y: enabled ? currentY : 0, rotate: enabled ? currentRotate : 0, willChange: enabled && nearViewport ? "transform" : undefined }}
        />
        <motion.div
          aria-hidden="true"
          data-contact-scene-exposure="true"
          className="pointer-events-none absolute inset-0 z-[4]"
          style={{ backgroundImage: SCENE_EXPOSURE[variant], opacity: enabled ? exposure : 0.12 }}
        />
        <motion.div
          aria-hidden="true"
          data-contact-scene-sunlight="true"
          data-contact-light-timeline="shared"
          style={{ x: enabled ? sunlightX : 0, y: enabled ? sunlightY : 0, scale: enabled ? sunlightScale : 1, opacity: enabled ? sunlightOpacity : 0.16 }}
        />
        {(variant === "paper" || variant === "daybreak") && (
          <motion.div
            aria-hidden="true"
            data-contact-scene-seam="arrival"
            style={{ scaleY: enabled ? arrivalScale : 1 }}
          />
        )}
        {(variant === "branch" || variant === "paper" || variant === "daybreak") && (
          <motion.div
            aria-hidden="true"
            data-contact-scene-seam="departure"
            style={{ scaleY: enabled ? departureScale : 1 }}
          />
        )}
        <div data-contact-scene-plane="true" data-contact-focus-pull="crisp" className="relative z-10 flex min-h-[100svh] w-full items-center">
          {children}
        </div>
        <svg data-contact-scene-thread aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <motion.path d="M-40 90 C280 110 400 12 700 60 S1110 130 1480 25" fill="none" vectorEffect="non-scaling-stroke" style={{ pathLength: enabled ? lineDraw : 1 }} />
        </svg>
      </section>
    </ContactSceneMotion.Provider>
  );
}
