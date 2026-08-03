"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function FounderRouteHandoff() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const light = useTransform(scrollYProgress, [0.48, 1], [0, 1]);
  const first = useTransform(scrollYProgress, [0.08, 0.25, 0.7, 0.86], [0, 1, 1, 0]);
  const second = useTransform(scrollYProgress, [0.68, 0.86], [0, 1]);
  const ring = useTransform(scrollYProgress, [0, 1], [0.72, 2.2]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-20, 90]);

  return (
    <section ref={ref} className="relative h-[180svh] bg-[#151411]">
      <div className="sticky top-0 h-svh min-h-[640px] overflow-hidden">
        <motion.div className="absolute inset-0 bg-[#ECE7DC]" style={{ opacity: reduced ? 0 : light }} />
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[54vmin] w-[54vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sandstone/35"
          style={reduced ? undefined : { scale: ring, rotate }}
        >
          <span className="absolute inset-[18%] rounded-full border border-sandstone/20" />
          <span className="absolute inset-[36%] rounded-full border border-sandstone/20" />
        </motion.div>

        <motion.div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-ivory" style={reduced ? undefined : { opacity: first }}>
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-sandstone">Three disciplines. One judgement.</p>
            <h2 className="mt-7 font-display text-[clamp(3rem,7vw,7rem)] leading-[0.88] tracking-[-0.05em]">
              attention <span className="text-sandstone/40">×</span> <span className="italic text-sandstone">language</span> <span className="text-sandstone/40">×</span> sequence
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ivory/62 sm:text-base">
              The method matters only when perception, expression, and movement agree on what should happen next.
            </p>
          </div>
        </motion.div>

        <motion.div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center text-soil" style={reduced ? { opacity: 0 } : { opacity: second }}>
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-soil/45">The method becomes a choice</p>
            <h2 className="mt-7 font-display text-[clamp(3.4rem,8vw,8rem)] leading-[0.86] tracking-[-0.055em]">
              Where does your<br />signal break first?
            </h2>
          </div>
        </motion.div>

        <div className="absolute inset-x-6 bottom-7 z-30 flex items-center gap-4 sm:inset-x-10 lg:inset-x-16">
          <span className="text-[0.58rem] uppercase tracking-[0.2em] text-sandstone/62">Author</span>
          <div className="h-px flex-1 bg-soil/12"><motion.div className="h-full origin-left bg-sandstone" style={{ scaleX: scrollYProgress }} /></div>
          <span className="text-[0.58rem] uppercase tracking-[0.2em] text-soil/48">Route</span>
        </div>
      </div>
    </section>
  );
}
