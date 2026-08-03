"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";

const SIGNALS = [
  { label: "Notice", detail: "Attention", angle: -42 },
  { label: "Understand", detail: "Meaning", angle: 0 },
  { label: "Remember", detail: "Recognition", angle: 42 },
] as const;

export function HomeOpening() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 130, damping: 24, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 130, damping: 24, mass: 0.5 });
  const nearX = useTransform(springX, (value) => value * 22);
  const nearY = useTransform(springY, (value) => value * 22);
  const farX = useTransform(springX, (value) => value * -10);
  const farY = useTransform(springY, (value) => value * -10);

  function moveField(event: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function resetField() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-soil text-ivory">
      <BackgroundVideo
        video="/videos/hero-forest-sanctuary.mp4"
        poster="/images/hero-forest-sanctuary-poster.jpg"
        imagePosition="30% 40%"
        parallax
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,20,14,.94)_0%,rgba(12,20,14,.72)_50%,rgba(12,20,14,.42)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(198,169,122,.18),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-soil via-soil/54 to-transparent" />

      <Container className="relative flex min-h-[100svh] max-w-[92rem] items-center py-28 sm:py-32">
        <div className="grid w-full gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div className="max-w-3xl">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-sandstone"
            >
              Philosophical branding. Commercial consequence.
            </motion.p>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: reduce ? 0 : 1.15, delay: reduce ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-4xl font-display text-[clamp(3.7rem,8vw,8.4rem)] font-normal leading-[0.84] tracking-[-0.055em] text-ivory"
            >
              Most brands are visible.
              <span className="mt-2 block italic text-sandstone">Very few become easy to remember.</span>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.35 }}
              className="mt-7 max-w-2xl text-base leading-relaxed text-ivory/76 sm:text-lg"
            >
              Positioning, identity, voice, experience, and market presence shaped through psychology, language, and the five Tatvas so every signal reinforces one meaning.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.85, delay: reduce ? 0 : 0.52 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
              <LinkButton href="/work" variant="secondary" className="border-ivory/28 text-ivory hover:bg-ivory/10">
                Explore the Work
              </LinkButton>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.72 }}
              className="mt-8 flex max-w-2xl flex-wrap items-center gap-x-5 gap-y-2 border-t border-ivory/14 pt-5 text-xs leading-relaxed text-ivory/56 sm:text-sm"
            >
              <span className="font-display text-xl text-sandstone">0.71% → 2.81%</span>
              <span>Verified engagement growth from one focused content system over two months.</span>
            </motion.div>
          </div>

          <motion.div
            ref={fieldRef}
            onPointerMove={moveField}
            onPointerLeave={resetField}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-square w-full max-w-[40rem] overflow-hidden rounded-full border border-ivory/14 bg-soil/28 shadow-2xl backdrop-blur-md"
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-[8%] rounded-full border border-ivory/12"
              style={reduce ? undefined : { x: farX, y: farY }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-[22%] rounded-full border border-sandstone/28"
              style={reduce ? undefined : { x: nearX, y: nearY }}
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-[36%] rounded-full border border-ivory/18"
              animate={reduce ? undefined : { rotate: -360 }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative flex h-32 w-32 items-center justify-center rounded-full border border-sandstone/44 bg-soil/70 text-center shadow-[0_0_80px_rgba(198,169,122,.18)] backdrop-blur-xl sm:h-40 sm:w-40"
                style={reduce ? undefined : { x: nearX, y: nearY }}
                animate={reduce ? undefined : { scale: [0.97, 1.03, 0.97] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div>
                  <span className="block text-[0.58rem] uppercase tracking-[0.22em] text-ivory/48">What remains</span>
                  <span className="mt-2 block font-display text-3xl text-ivory sm:text-4xl">Memory</span>
                </div>
              </motion.div>
            </div>

            {SIGNALS.map((signal, index) => {
              const position = [
                "left-[9%] top-[22%]",
                "right-[8%] top-[44%]",
                "left-[16%] bottom-[16%]",
              ][index];
              return (
                <motion.div
                  key={signal.label}
                  className={`absolute ${position} rounded-[1.2rem] border border-ivory/12 bg-soil/58 px-4 py-3 backdrop-blur-xl`}
                  style={reduce ? undefined : { x: index === 1 ? farX : nearX, y: index === 1 ? farY : nearY }}
                  animate={reduce ? undefined : { y: [0, index % 2 === 0 ? -6 : 6, 0] }}
                  transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="block text-[0.56rem] uppercase tracking-[0.18em] text-sandstone">{signal.label}</span>
                  <span className="mt-1 block font-display text-xl text-ivory">{signal.detail}</span>
                </motion.div>
              );
            })}

            <div className="absolute inset-x-[12%] bottom-[7%] flex items-center gap-3 text-[0.55rem] uppercase tracking-[0.2em] text-ivory/42">
              <span>Attention</span>
              <span className="h-px flex-1 bg-gradient-to-r from-sandstone/65 via-ivory/24 to-sandstone/65" />
              <span>Recognition</span>
            </div>
          </motion.div>
        </div>
      </Container>

      <div className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.55rem] uppercase tracking-[0.24em] text-ivory/42">
        <span>Enter the argument</span>
        <motion.span
          className="h-8 w-px bg-gradient-to-b from-sandstone/80 to-transparent"
          animate={reduce ? undefined : { scaleY: [0.35, 1, 0.35], opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
