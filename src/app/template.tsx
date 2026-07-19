"use client";

import { motion, useReducedMotion } from "framer-motion";

// Next.js remounts template.tsx fresh on every navigation (unlike
// layout.tsx, which persists) — the documented, low-risk mechanism for
// a per-page enter animation, versus fighting AnimatePresence's
// exit-tracking against App Router's Server Component streaming model.
// Sits between the root layout (Header, Footer, SmoothScrollProvider,
// SparkCursor — all untouched, stay mounted across navigations) and
// each page's own content, so only the page body gets this motion.

export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
