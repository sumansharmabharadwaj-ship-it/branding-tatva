"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_AIR as EASE } from "@/lib/motion";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";

// A camera-push entrance instead of ClipReveal's curtain-wipe — the
// section scales up from just-below-full-size with a slight blur that
// clears as it settles, reading as the camera pushing into focus rather
// than a mask opening. A second signature for section boundaries that
// want a real mode-shift without repeating ClipReveal's exact motion —
// see ClipReveal's own comment for why this is reserved for a handful
// of boundaries rather than applied everywhere. See useRevealTrigger for
// why this drives the animation instead of whileInView directly.
export function PerspectiveReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [ref, visible] = useRevealTrigger("0px 0px -15% 0px");

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 0.94, opacity: 0, filter: "blur(6px)" }}
      animate={visible ? { scale: 1, opacity: 1, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.72, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
