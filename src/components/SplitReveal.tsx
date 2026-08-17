"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef } from "react";

import { initSplitTextReveal } from "@/animations/splitTextReveal";

// Splits a heading into individual words and staggers them in, instead
// of the whole line fading up as one block. Reserved for the two or
// three headlines on the site meant to carry real editorial weight —
// applying this everywhere would just be Reveal with extra steps.
// Renders the plain content immediately (SplitText only runs client-side
// after mount), so there's no FOUC and reduced-motion users just get
// static text. Children can carry inline markup (e.g. an italicized
// word) since GSAP's SplitText splits by word on the real DOM node and
// leaves nested tags intact — it isn't limited to a plain string, so
// this doesn't have to flatten a headline's own emphasis to use it.

export function SplitReveal({
  children,
  className,
  as: Tag = "h2",
  splitType = "words",
  ...headingProps
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
  splitType?: "words" | "chars";
} & Omit<React.HTMLAttributes<HTMLHeadingElement>, "children" | "className">) {
  const ref = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const ctx = initSplitTextReveal(el, { type: splitType });
    return () => ctx.revert();
  }, [prefersReducedMotion, splitType]);

  return (
    <Tag ref={ref} className={className} {...headingProps}>
      {children}
    </Tag>
  );
}
