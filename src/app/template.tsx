"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { initPageEnter, PAGE_ENTER_FROM } from "@/animations/pageTransition";

// Next.js remounts template.tsx fresh on every navigation (unlike
// layout.tsx, which persists) — the documented, low-risk mechanism for
// a per-page enter animation, versus fighting AnimatePresence's
// exit-tracking against App Router's Server Component streaming model.
// Sits between the root layout (Header, Footer, SmoothScrollProvider,
// SparkCursor — all untouched, stay mounted across navigations) and
// each page's own content, so only the page body gets this motion.
//
// GSAP rather than Framer Motion, per this project's own animation-
// stack rule that page transitions are GSAP's job — see
// animations/pageTransition.ts for the actual tween and why the
// element renders pre-styled at PAGE_ENTER_FROM instead of animating
// from a gsap.set() inside the effect.

export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;
    const tween = initPageEnter(ref.current);
    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div ref={ref} style={PAGE_ENTER_FROM}>
      {children}
    </div>
  );
}
