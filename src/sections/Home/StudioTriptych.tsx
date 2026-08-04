"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const DISCIPLINES = [
  {
    number: "01",
    eyebrow: "M.A. Clinical Psychology",
    title: "Read the tension",
    line: "Audience behaviour is treated as evidence, not a demographic label. The work looks for the friction people feel before they can explain it.",
    result: "Audience tension + perception map",
    video: "/videos/higgsfield-process-listen.mp4",
    poster: "/images/higgsfield-process-listen-poster.jpg",
    diagram: ["Notice", "Interpret", "Choose"],
  },
  {
    number: "02",
    eyebrow: "B.A. English Literature",
    title: "Give it language",
    line: "Voice, narrative, rhythm, and symbolism turn a strategic idea into language people can recognise, repeat, and carry beyond the page.",
    result: "Verbal identity + narrative spine",
    video: "/videos/higgsfield-idea-sketch.mp4",
    poster: "/images/higgsfield-idea-sketch.jpg",
    diagram: ["Meaning", "Language", "Memory"],
  },
  {
    number: "03",
    eyebrow: "Strategy led directly by Suman",
    title: "Make it usable",
    line: "Positioning, identity, website, content, and campaigns are built as one connected system, so the business can keep using the idea after launch.",
    result: "A brand system that can keep moving",
    video: "/videos/higgsfield-process-shape.mp4",
    poster: "/images/higgsfield-process-shape-poster.jpg",
    diagram: ["Decision", "System", "Recognition"],
  },
] as const;

const ROTATE_MS = 6200;
const MANUAL_PAUSE_MS = 16000;

export function StudioTriptych() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const pauseUntilRef = useRef(0);
  const active = DISCIPLINES[activeIndex];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current || document.hidden) return;
      setActiveIndex((current) => (current + 1) % DISCIPLINES.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  function choose(index: number) {
    pauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
    setActiveIndex(index);
  }

  return (
    <section
      className="relative isolate overflow-hidden border-y border-soil/10"
      style={{ backgroundColor: "#F2F0E8" }}
      onPointerEnter={() => {
        pauseUntilRef.current = Date.now() + 7000;
      }}
      onFocusCapture={() => {
        pauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[18%] -z-10 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(184,90,52,0.12), transparent 68%)" }}
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, 84, 0], y: [0, 34, 0], scale: [1, 1.12, 1] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 17, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 bottom-[-18%] -z-10 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(85,107,74,0.14), transparent 70%)" }}
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, -68, 0], y: [0, -36, 0], scale: [1.04, 0.94, 1.04] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 20, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <div className="grid min-h-[42rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)_minmax(0,0.78fr)]">
        <div className="relative min-h-[27rem] overflow-hidden bg-soil lg:min-h-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.video}
              className="absolute inset-0"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.08, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1.14, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 1.04, filter: "blur(6px)" }}
              transition={{
                opacity: { duration: prefersReducedMotion ? 0 : 0.8 },
                filter: { duration: prefersReducedMotion ? 0 : 0.8 },
                scale: { duration: prefersReducedMotion ? 0 : 10, ease: "linear" },
              }}
            >
              {!prefersReducedMotion && (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={active.video}
                  poster={active.poster}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              )}
              {prefersReducedMotion && (
                <Image src={active.poster} alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
              )}
            </motion.div>
          </AnimatePresence>

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,18,16,0.08) 0%, rgba(20,18,16,0.28) 45%, rgba(20,18,16,0.86) 100%)",
            }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute -inset-y-16 -left-1/2 w-1/3 rotate-12 bg-ivory/10 blur-2xl"
            animate={prefersReducedMotion ? undefined : { x: ["0%", "650%"] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 6.4, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }
            }
          />

          <div className="absolute inset-x-6 top-6 flex items-center justify-between text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/65 sm:inset-x-8 sm:top-8">
            <span>The thinking room</span>
            <span>{active.number} / 03</span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.title}
              className="absolute inset-x-6 bottom-7 sm:inset-x-8 sm:bottom-9"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-sandstone">
                {active.eyebrow}
              </p>
              <p className="mt-2 max-w-sm font-display text-3xl font-normal leading-[1.02] text-ivory sm:text-4xl">
                {active.title}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-12 lg:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.24em]" style={{ color: "#8a6b3d" }}>
            About Suman
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(2.2rem,4vw,4rem)] font-normal leading-[1.02] text-soil">
            One mind. Three disciplines. No hand-off.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground-secondary sm:text-base">
            Psychology reveals what people notice. Literature shapes what they remember. Strategy makes both commercially useful.
          </p>

          <div className="mt-9 grid grid-cols-3 gap-2">
            {DISCIPLINES.map((discipline, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={discipline.title}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose(index)}
                  onPointerEnter={() => {
                    pauseUntilRef.current = Date.now() + 9000;
                    setActiveIndex(index);
                  }}
                  className="relative min-h-24 overflow-hidden rounded-2xl border px-3 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone sm:px-4"
                  style={{
                    borderColor: selected ? "rgba(138,107,61,0.42)" : "rgba(39,34,30,0.1)",
                    backgroundColor: selected ? "rgba(138,107,61,0.085)" : "rgba(39,34,30,0.025)",
                  }}
                >
                  <span className="block text-[0.56rem] tracking-[0.15em]" style={{ color: "#8a6b3d" }}>
                    {discipline.number}
                  </span>
                  <span className="mt-2 block font-display text-base leading-tight text-soil sm:text-lg">
                    {discipline.title}
                  </span>
                  {selected && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-left"
                      style={{ backgroundColor: "#C6A97A" }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: prefersReducedMotion ? 0 : ROTATE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.title}
              className="mt-8 rounded-[1.6rem] border border-soil/10 bg-soil/[0.035] p-6 sm:p-7"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <p className="text-sm leading-relaxed text-foreground-secondary sm:text-base">
                {active.line}
              </p>

              <div className="mt-6 flex items-center gap-2 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-foreground-secondary">
                {active.diagram.map((step, index) => (
                  <div key={step} className="contents">
                    <span>{step}</span>
                    {index < active.diagram.length - 1 && (
                      <motion.span
                        aria-hidden="true"
                        className="h-px min-w-6 flex-1 origin-left"
                        style={{ backgroundColor: "#C6A97A" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.9,
                          delay: prefersReducedMotion ? 0 : index * 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 border-l-2 pl-4" style={{ borderColor: "#C6A97A" }}>
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-foreground-secondary/65">
                  What the client receives
                </p>
                <p className="mt-1 font-display text-xl leading-tight text-soil">{active.result}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/about"
              className="link-underline inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: "#8a6b3d" }}
            >
              Meet the strategist <span aria-hidden="true">→</span>
            </Link>
            <p className="text-xs leading-relaxed text-foreground-secondary/75">
              The person you meet is the person doing the thinking, writing, and direction.
            </p>
          </div>
        </div>

        <div className="relative min-h-[28rem] overflow-hidden bg-soil lg:min-h-full">
          <motion.div
            className="absolute inset-0"
            animate={prefersReducedMotion ? undefined : { scale: [1.03, 1.11, 1.03], x: [0, -8, 0] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Image
              src="/images/own-portrait.jpg"
              alt="Suman Sharma, founder and strategist at Branding Tatva"
              fill
              sizes="(min-width: 1024px) 26vw, 100vw"
              className="object-cover object-[center_30%]"
            />
          </motion.div>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(20,18,16,0.02) 32%, rgba(20,18,16,0.82) 100%)" }}
          />

          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-ivory/15 bg-soil/70 p-5 text-ivory backdrop-blur-md sm:inset-x-7 sm:bottom-7">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sandstone">
              Direct authorship
            </p>
            <p className="mt-2 font-display text-2xl leading-tight">
              No account-manager relay. No anonymous production layer.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ivory/62">
              Every engagement is led directly by Suman, from the first diagnosis to the system delivered at the end.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
