"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionStyle } from "framer-motion";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";

/** The closing light resolves at the reachable page endpoint. Its timeline
 * spans only the footer's entry, so every viewport can finish the last shot. */
export function ContactFooterMotion({ children }: { children: ReactNode }) {
  const footerRef = useRef<HTMLDivElement>(null);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const enabled = hydrated && !prefersReducedMotion;
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
    trackContentSize: true,
  });
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32, mass: 0.45 });
  const horizonScale = useTransform(progress, [0, 0.46, 1], [0.16, 1, 0.62]);
  const horizonOpacity = useTransform(progress, [0, 0.46, 1], [0.24, 0.82, 0.45]);
  const lightY = useTransform(progress, [0, 1], ["-24%", "0%"]);
  const lightScale = useTransform(progress, [0, 1], [0.8, 1.08]);
  const lightOpacity = useTransform(progress, [0, 1], [0.3, 0.14]);

  useEffect(() => {
    // Reloads, deep links and preference changes start at the actual position.
    progress.jump(scrollYProgress.get());
  }, [enabled, progress, scrollYProgress]);

  return (
    <motion.div
      ref={footerRef}
      data-contact-footer-motion={enabled ? "full" : "reduced"}
      data-contact-footer-timeline="entry"
      style={enabled ? {
        "--contact-footer-progress": progress,
        "--contact-footer-horizon-scale": horizonScale,
        "--contact-footer-horizon-opacity": horizonOpacity,
        "--contact-footer-light-y": lightY,
        "--contact-footer-light-scale": lightScale,
        "--contact-footer-light-opacity": lightOpacity,
      } as MotionStyle : undefined}
    >
      {children}
    </motion.div>
  );
}
