"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

// Adapted from Motion Primitives' Magnetic component (MIT, ibelick/motion-primitives)
// — pulls the element toward the cursor within `range`, eases back with a
// spring on mouse-leave. Trimmed to the self-hover case, since that's the
// only one any CTA on this site needs.

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
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const calculateDistance = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const distanceX = e.clientX - (rect.left + rect.width / 2);
      const distanceY = e.clientY - (rect.top + rect.height / 2);
      const absoluteDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (isHovered && absoluteDistance <= range) {
        const scale = 1 - absoluteDistance / range;
        x.set(distanceX * intensity * scale);
        y.set(distanceY * intensity * scale);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    document.addEventListener("mousemove", calculateDistance);
    return () => document.removeEventListener("mousemove", calculateDistance);
  }, [isHovered, intensity, range, prefersReducedMotion, x, y]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
