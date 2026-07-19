"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { initSplitTextReveal } from "@/animations/splitTextReveal";

// Splits a heading into individual words and staggers them in on scroll,
// instead of the whole line fading up as one block. Reserved for the one
// or two headlines on the site meant to carry real editorial weight —
// applying this everywhere would just be Reveal with extra steps.
// Renders the plain text immediately (SplitText only runs client-side
// after mount), so there's no FOUC and reduced-motion users just get
// static text.

export function SplitReveal({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const ctx = initSplitTextReveal(el);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <h2 ref={ref} className={className}>
      {children}
    </h2>
  );
}
