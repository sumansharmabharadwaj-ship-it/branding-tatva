"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LogoMark } from "./Logo";

// A brief ivory veil over the very first paint, so the site arrives
// rather than just snapping into view. Lives in the root layout, which
// Next.js keeps mounted across client-side navigations — so this only
// plays once per hard load, never on internal link clicks. Skipped
// entirely for reduced-motion, since a full-screen fade is itself a
// flash some users specifically want to avoid.

export function PageLoadVeil() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(!prefersReducedMotion);
  // AnimatePresence only unmounts once its exit animation reports
  // complete, which depends on requestAnimationFrame — real browsers
  // throttle rAF in a backgrounded tab, so someone who switches away
  // mid-fade could otherwise be left with a stuck (if harmless, since
  // it's pointer-events-none) translucent layer. This is a hard,
  // animation-independent removal that always wins.
  const [removed, setRemoved] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const fadeTimer = setTimeout(() => setVisible(false), 500);
    const removeTimer = setTimeout(() => setRemoved(true), 1500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [prefersReducedMotion]);

  if (removed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-background"
          aria-hidden="true"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <LogoMark size={48} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
