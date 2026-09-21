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
      style={{
        // Explicit resting values replace live bindings. Removing the style
        // object can leave a spring's last custom-property values behind.
        "--contact-footer-progress": enabled ? progress : 1,
        "--contact-footer-horizon-scale": enabled ? horizonScale : 0.62,
        "--contact-footer-horizon-opacity": enabled ? horizonOpacity : 0.45,
        "--contact-footer-light-y": enabled ? lightY : "0%",
        "--contact-footer-light-scale": enabled ? lightScale : 1.08,
        "--contact-footer-light-opacity": enabled ? lightOpacity : 0.14,
      } as MotionStyle}
    >
      {children}
    </motion.div>
  );
}
