"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Adapted from Motion Primitives' Magnetic component (MIT, ibelick/motion-primitives)
// — pulls the element toward the cursor within `range`, eases back with a
// spring on mouse-leave. Trimmed to the self-hover case, since that's the
// only one any CTA on this site needs.
//
// Every LinkButton on the site wraps itself in this, so a normal page has
// 8-15+ instances mounted at once (Header alone contributes 2, most pages
// several more). The original version attached a *document-level*
// mousemove listener unconditionally for the component's whole lifetime,
// calling getBoundingClientRect() — a layout-forcing browser call — on
// every single listener, on every pixel of mouse movement, whether or not
// the cursor was anywhere near that button. With that many instances
// mounted, that's dozens of forced layout recalculations per mousemove
// event, competing with Lenis's own scroll loop for main-thread time —
// a real, confirmed contributor to the site feeling laggy under the
// cursor and while scrolling. Fixed by only attaching the listener while
// the pointer is actually over this element (so idle buttons cost
// nothing) and caching the rect once per hover rather than
// re-measuring it on every move (a button's position can't change mid-hover).

const SPRING_CONFIG = { stiffness: 26.7, damping: 4.1, mass: 0.2 };

export function Magnetic({
  children,
  intensity = 0.3,
  range = 80,
  className,
}: {
  children: React.ReactNode;
  intensity?: number;
  range?: number;
  className?: string;
}) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  useEffect(() => {
    if (prefersReducedMotion) return;

    function calculateDistance(e: MouseEvent) {
      const rect = rectRef.current;
      if (!rect) return;
      const distanceX = e.clientX - (rect.left + rect.width / 2);
      const distanceY = e.clientY - (rect.top + rect.height / 2);
      const absoluteDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (absoluteDistance <= range) {
        const scale = 1 - absoluteDistance / range;
        x.set(distanceX * intensity * scale);
        y.set(distanceY * intensity * scale);
      } else {
        x.set(0);
        y.set(0);
      }
    }

    function handleEnter() {
      if (!ref.current) return;
      rectRef.current = ref.current.getBoundingClientRect();
      document.addEventListener("mousemove", calculateDistance);
    }

    function handleLeave() {
      document.removeEventListener("mousemove", calculateDistance);
      rectRef.current = null;
      x.set(0);
      y.set(0);
    }

    const el = ref.current;
    el?.addEventListener("mouseenter", handleEnter);
    el?.addEventListener("mouseleave", handleLeave);
    return () => {
      el?.removeEventListener("mouseenter", handleEnter);
      el?.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mousemove", calculateDistance);
    };
  }, [intensity, range, prefersReducedMotion, x, y]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} className={className} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  );
}
