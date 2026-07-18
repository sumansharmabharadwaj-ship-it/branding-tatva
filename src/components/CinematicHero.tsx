"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// Full-screen photographic hero with slow parallax on the image and a
// gentle fade/rise on the content as it scrolls past. Deliberately
// asymmetric: headline sits low and large rather than dead-center, the
// way an editorial spread lets a photograph breathe before the text
// arrives. Reduced-motion users get the settled, static composition.

export function CinematicHero({
  image,
  eyebrow,
  headline,
  children,
}: {
  image: string;
  eyebrow: string;
  headline: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-soil">
      <motion.div
        className="absolute inset-0 -top-[10%] h-[120%] w-full"
        style={{
          y: prefersReducedMotion ? 0 : imageY,
          backgroundImage: `linear-gradient(180deg, rgba(39,34,30,0.35) 0%, rgba(39,34,30,0.35) 45%, rgba(39,34,30,0.88) 100%), url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <motion.div
        style={
          prefersReducedMotion ? undefined : { opacity: contentOpacity, y: contentY }
        }
        className="relative flex h-full flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-24 lg:px-16"
      >
        <p className="font-body text-xs font-medium uppercase tracking-[0.35em] text-sandstone">
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[1.02] text-ivory">
          {headline}
        </h1>
        {children}
      </motion.div>

      <div className="absolute bottom-8 right-6 hidden flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-ivory/50 sm:right-10 sm:flex lg:right-16">
        <span className="h-10 w-px bg-ivory/30" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
