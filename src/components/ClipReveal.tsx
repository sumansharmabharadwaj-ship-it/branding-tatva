"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_AIR } from "@/lib/motion";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";

// A curtain-style entrance for a whole section boundary — the section's
// own background/border wipes into view as it's scrolled to, rather than
// just appearing, the way every full-bleed chapter change on the page
// currently does. clip-path only, so it never touches layout and never
// stacks awkwardly with whatever entrance animation the content inside
// already has (see Reveal for that — the two are meant to be used on
// different things, not both on the same block). Reserved for the
// handful of section boundaries that read as a real mode-shift — a
// light section giving way to a dark one, a card grid giving way to a
// closing statement — not applied to every section on the page.
//
// See useRevealTrigger for why this uses that instead of whileInView
// directly — a stuck-at-100%-clipped section would look identical to a
// blank one.
export function ClipReveal({
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
      initial={{ clipPath: "inset(0% 0 100% 0)" }}
      animate={visible ? { clipPath: "inset(0% 0 0% 0)" } : undefined}
      transition={{ duration: 1.2, ease: EASE_AIR }}
    >
      {children}
    </motion.div>
  );
}
