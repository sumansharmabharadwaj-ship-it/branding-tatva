"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// Full-screen photographic hero, deliberately uncluttered: the photograph
// is the entire statement, the way an editorial spread lets an image hold
// a full page before any text arrives. No headline, no paragraph, no
// buttons stacked on top of it, just the mark (rendered by the transparent
// header above it) and a scroll cue. The words that used to live here now
// live in a plain, quiet block directly below, once the photo has had its
// moment. Reduced-motion users get the settled, static composition.

export function CinematicHero({ image }: { image: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-soil">
      <motion.div
        className="absolute inset-0 -top-[10%] h-[120%] w-full"
        style={{
          y: prefersReducedMotion ? 0 : imageY,
          backgroundImage: `linear-gradient(180deg, rgba(39,34,30,0.18) 0%, rgba(39,34,30,0.05) 30%, rgba(39,34,30,0.4) 100%), url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-ivory/60">
        <span>Scroll</span>
        <span className="h-10 w-px bg-ivory/40" />
      </div>
    </section>
  );
}
