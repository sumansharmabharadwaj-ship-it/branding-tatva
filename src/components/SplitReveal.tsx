"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(SplitText, ScrollTrigger);

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

    const ctx = gsap.context(() => {
      const split = new SplitText(el, { type: "words" });
      gsap.set(split.words, { opacity: 0, y: "0.4em" });
      gsap.to(split.words, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.045,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });

      return () => split.revert();
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <h2 ref={ref} className={className}>
      {children}
    </h2>
  );
}
