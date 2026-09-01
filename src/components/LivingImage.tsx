"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import styles from "./LivingImage.module.css";

type LivingImageIntensity = "subtle" | "cinematic" | "hero";

const TRAVEL: Record<LivingImageIntensity, number> = {
  subtle: 2.6,
  cinematic: 4.4,
  hero: 5.2,
};

const POINTER_TRAVEL: Record<LivingImageIntensity, number> = {
  subtle: 4,
  cinematic: 7,
  hero: 9,
};

export function LivingImage({
  src,
  alt = "",
  priority = false,
  sizes = "100vw",
  imagePosition = "center",
  intensity = "subtle",
  className = "",
}: {
  src: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  imagePosition?: string;
  intensity?: LivingImageIntensity;
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const [pointerActive, setPointerActive] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, { stiffness: 84, damping: 24, mass: 0.7 });
  const pointerY = useSpring(rawY, { stiffness: 84, damping: 24, mass: 0.7 });
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });
  const travel = TRAVEL[intensity];
  const scrollY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [`-${travel}%`, "0%", `${travel}%`],
  );
  const scrollScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    intensity === "hero" ? [1.105, 1.035, 1.075] : [1.085, 1.025, 1.06],
  );

  const moveLight = useCallback((clientX: number, clientY: number) => {
    if (prefersReducedMotion) return;
    const stage = stageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const unitX = Math.min(1, Math.max(0, (clientX - bounds.left) / bounds.width));
    const unitY = Math.min(1, Math.max(0, (clientY - bounds.top) / bounds.height));
    const pointerTravel = POINTER_TRAVEL[intensity];
    stage.style.setProperty("--living-light-x", `${unitX * 100}%`);
    stage.style.setProperty("--living-light-y", `${unitY * 100}%`);
    rawX.set((unitX - 0.5) * pointerTravel);
    rawY.set((unitY - 0.5) * pointerTravel);
    setPointerActive(true);
  }, [intensity, prefersReducedMotion, rawX, rawY]);

  const settlePointer = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setPointerActive(false);
  }, [rawX, rawY]);

  useEffect(() => {
    const stage = stageRef.current;
    const scene = stage?.closest<HTMLElement>(
      "figure, article, section, [data-reading-scene]",
    );
    if (!scene) return;

    const onFocusIn = () => setFocusWithin(true);
    const onFocusOut = (event: FocusEvent) => {
      if (!scene.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
    };
    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (prefersReducedMotion) return;
      moveLight(event.clientX, event.clientY);
    };
    const onPointerLeave = () => settlePointer();

    scene.addEventListener("focusin", onFocusIn);
    scene.addEventListener("focusout", onFocusOut);
    scene.addEventListener("pointermove", onPointerMove, { passive: true });
    scene.addEventListener("pointerleave", onPointerLeave);
    scene.addEventListener("pointercancel", onPointerLeave);
    return () => {
      scene.removeEventListener("focusin", onFocusIn);
      scene.removeEventListener("focusout", onFocusOut);
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", onPointerLeave);
      scene.removeEventListener("pointercancel", onPointerLeave);
    };
  }, [moveLight, prefersReducedMotion, settlePointer]);

  const still = (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
      className={styles.image}
      style={{ objectPosition: imagePosition }}
    />
  );

  return (
    <div
      ref={stageRef}
      data-living-image-stage="true"
      data-living-active={pointerActive ? "true" : "false"}
      data-living-focus={focusWithin ? "true" : "false"}
      className={`${styles.stage} ${className}`.trim()}
    >
      {prefersReducedMotion ? (
        still
      ) : (
        <motion.div
          className={styles.scrollPlane}
          style={{ y: scrollY, scale: scrollScale }}
        >
          <motion.div className={styles.pointerPlane} style={{ x: pointerX, y: pointerY }}>
            {still}
          </motion.div>
        </motion.div>
      )}
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.edge} aria-hidden="true" />
    </div>
  );
}
