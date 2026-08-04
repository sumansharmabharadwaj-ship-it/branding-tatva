"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function FounderRouteHandoff() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const light = useTransform(scrollYProgress, [0.35, 0.9], [0, 1]);
  const first = useTransform(scrollYProgress, [0, 0.12, 0.54, 0.76], [0.35, 1, 1, 0]);
  const second = useTransform(scrollYProgress, [0.56, 0.74, 1], [0, 1, 1]);
  const ring = useTransform(scrollYProgress, [0, 1], [0.84, 1.55]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-10, 45]);

  return (
    <section ref={ref} className="relative h-[125svh] bg-[#151411]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.div className="absolute inset-0 bg-[#ECE7DC]" style={{ opacity: reduced ? 1 : light }} />
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[48vmin] w-[48vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sandstone/35"
          style={reduced ? undefined : { scale: ring, rotate }}
        >
          <span className="absolute inset-[18%] rounded-full border border-sandstone/20" />
          <span className="absolute inset-[36%] rounded-full border border-sandstone/20" />
        </motion.div>

        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-ivory"
          style={reduced ? { opacity: 0 } : { opacity: first }}
        >
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-sandstone">Three disciplines. One judgement.</p>
            <h2 className="mt-7 font-display text-[clamp(2.6rem,6.5vw,6.4rem)] leading-[0.9] tracking-[-0.05em]">
              attention <span className="text-sandstone/40">×</span> <span className="italic text-sandstone">language</span> <span className="text-sandstone/40">×</span> sequence
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-ivory/62 sm:text-base">
              The method matters only when perception, expression, and movement agree on what should happen next.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center text-soil"
          style={reduced ? { opacity: 1 } : { opacity: second }}
        >
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-soil/45">The method becomes a choice</p>
            <h2 className="mt-7 font-display text-[clamp(3rem,7.2vw,7.2rem)] leading-[0.88] tracking-[-0.055em]">
              Where does your<br />signal break first?
            </h2>
          </div>
        </motion.div>

        <div className="absolute inset-x-6 bottom-6 z-30 flex items-center gap-4 sm:inset-x-10 lg:inset-x-16">
          <span className="text-[0.58rem] uppercase tracking-[0.2em] text-sandstone/62">Author</span>
          <div className="h-px flex-1 bg-soil/12"><motion.div className="h-full origin-left bg-sandstone" style={{ scaleX: scrollYProgress }} /></div>
          <span className="text-[0.58rem] uppercase tracking-[0.2em] text-soil/48">Route</span>
        </div>
      </div>
    </section>
  );
}
