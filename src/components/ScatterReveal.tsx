"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef } from "react";

import { initScatterTextReveal } from "@/animations/scatterTextReveal";

// The one showcase spot for a scattered-to-settled word entrance — words
// fly in from randomized offsets and rotations rather than SplitReveal's
// calm uniform stagger. Kept to a single moment on purpose, same
// discipline SplitReveal's own comment already establishes: a more
// dramatic gesture reads as intentional once, and as noise applied
// everywhere. Renders plain text immediately (GSAP only splits/animates
// after mount), so there's no FOUC and reduced-motion users just see
// static text.

export function ScatterReveal({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const ctx = initScatterTextReveal(el);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
