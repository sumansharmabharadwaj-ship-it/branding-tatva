"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { KenBurnsImage } from "@/components/KenBurnsImage";

const PILLARS = [
  {
    label: "Perception",
    line: "Clinical psychology turns audience behaviour into a strategic pattern.",
    degree: "M.A. Clinical Psychology",
    icon: (
      <>
        <path d="M20 10c-3 0-5 2-5 4 -3 0-5 2-5 5 0 2 1 4 3 5 0 3 2 5 5 5 1 0 2 0 2-1V10z" />
        <path d="M20 10c3 0 5 2 5 4 3 0 5 2 5 5 0 2-1 4-3 5 0 3-2 5-5 5-1 0-2 0-2-1" />
      </>
    ),
  },
  {
    label: "Language",
    line: "English literature turns meaning, voice and symbolism into memory.",
    degree: "B.A. English Literature",
    icon: (
      <>
        <path d="M12 28l3-9 11-11 6 6-11 11-9 3z" />
        <path d="M24 10l6 6" />
      </>
    ),
  },
  {
    label: "Brand system",
    line: "Strategy and design make those insights usable across every encounter.",
    degree: "Led directly by Suman",
    icon: (
      <>
        <circle cx="16" cy="20" r="7" />
        <circle cx="24" cy="20" r="7" />
        <circle cx="20" cy="14" r="7" />
      </>
    ),
  },
] as const;

const AUTO_ROTATE_MS = 5200;

export function StudioTriptych() {
  const [activeIndex, setActiveIndex] = useState(0);
  const manualPauseUntilRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      if (Date.now() < manualPauseUntilRef.current) return;
      setActiveIndex((current) => (current + 1) % PILLARS.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  function choose(index: number) {
    manualPauseUntilRef.current = Date.now() + 15000;
    setActiveIndex(index);
  }

  const activePillar = PILLARS[activeIndex];

  return (
    <section
      className="relative grid items-stretch overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)]"
      style={{ backgroundColor: "#F2F0E8" }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(198,169,122,0.16), transparent 68%)",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, 80, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 16, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <div className="relative z-10 flex items-center p-8 lg:p-10">
        <motion.div
          className="relative w-full overflow-hidden rounded-2xl p-8"
          style={{ backgroundColor: "#1B1B1B" }}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -8, 0], rotate: [-0.45, 0.35, -0.45] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <motion.span
            aria-hidden="true"
            className="absolute -inset-y-8 -left-1/2 w-1/3 rotate-12 bg-sandstone/12 blur-2xl"
            animate={prefersReducedMotion ? undefined : { x: ["0%", "640%"] }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 6,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut",
                  }
            }
          />
          <span
            aria-hidden="true"
            className="relative font-display text-4xl leading-none"
            style={{ color: "#C6A97A" }}
          >
            &ldquo;
          </span>
          <p className="relative mt-3 font-display text-xl font-normal leading-snug text-ivory">
            Psychology reveals what people notice. Literature shapes what they remember. Strategy turns both into a brand they can choose.
          </p>
          <span
            aria-hidden="true"
            className="relative mt-6 block h-px w-12"
            style={{ backgroundColor: "#C6A97A" }}
          />
          <p className="relative mt-5 text-xs leading-relaxed text-ivory/52">
            One practice. One person responsible for the thinking, writing and direction from beginning to end.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 px-6 py-14 text-center sm:px-10">
        <p
          className="text-xs font-medium uppercase tracking-[0.25em]"
          style={{ color: "#8a6b3d" }}
        >
          About Suman
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-[clamp(1.9rem,3.4vw,2.9rem)] font-normal leading-[1.07] text-soil">
          A brand practice where human behaviour meets language and design.
        </h2>

        <span aria-hidden="true" className="mt-4 flex items-center justify-center gap-3">
          <motion.span
            className="h-px w-12 origin-right"
            style={{ backgroundColor: "#C6A97A" }}
            animate={prefersReducedMotion ? undefined : { scaleX: [0.5, 1, 0.5] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <motion.svg
            viewBox="0 0 24 20"
            className="h-4 w-5"
            fill="none"
            style={{ color: "#C6A97A" }}
            animate={prefersReducedMotion ? undefined : { y: [0, -3, 0], rotate: [-2, 2, -2] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <path
              d="M12 19V6M12 6C12 6 9 1 4 1c0 5 4 6 8 5zM12 6c0 0 3-5 8-5 0 5-4 6-8 5z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          <motion.span
            className="h-px w-12 origin-left"
            style={{ backgroundColor: "#C6A97A" }}
            animate={prefersReducedMotion ? undefined : { scaleX: [0.5, 1, 0.5] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </span>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground-secondary sm:text-base">
          Your brand is read by human beings before it is measured by dashboards. The work starts with perception, gives it a language, and builds a system the business can actually use.
        </p>

        <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {PILLARS.map((pillar, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.li
                key={pillar.label}
                animate={{
                  y: isActive ? -8 : 0,
                  scale: isActive ? 1.035 : 0.985,
                  opacity: isActive ? 1 : 0.62,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => choose(index)}
                  onPointerEnter={() => {
                    manualPauseUntilRef.current = Date.now() + 9000;
                    setActiveIndex(index);
                  }}
                  className={`relative h-full w-full overflow-hidden rounded-2xl border px-5 py-6 text-center transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone ${
                    isActive
                      ? "border-soil/30 bg-soil/[0.07]"
                      : "border-soil/12 bg-soil/[0.025] hover:border-soil/25"
                  }`}
                >
                  <svg
                    viewBox="0 0 40 40"
                    className="mx-auto h-9 w-9"
                    fill="none"
                    stroke="#8a6b3d"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {pillar.icon}
                  </svg>
                  <p className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-soil">
                    {pillar.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                    {pillar.line}
                  </p>
                  <p
                    className="mt-4 text-[0.6rem] font-medium uppercase tracking-[0.16em]"
                    style={{ color: "#8a6b3d" }}
                  >
                    {pillar.degree}
                  </p>
                  <span className="absolute inset-x-5 bottom-3 h-px overflow-hidden bg-soil/10">
                    {isActive && (
                      <motion.span
                        key={`${activeIndex}-${pillar.label}`}
                        className="block h-full origin-left"
                        style={{ backgroundColor: "#C6A97A" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : AUTO_ROTATE_MS / 1000,
                          ease: "linear",
                        }}
                      />
                    )}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={activePillar.label}
            className="mx-auto mt-7 max-w-xl font-display text-xl leading-relaxed text-soil"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: 8, filter: "blur(5px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, y: -5, filter: "blur(4px)" }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-live="polite"
          >
            {activePillar.line}
          </motion.p>
        </AnimatePresence>

        <Link
          href="/about"
          className="link-underline mt-8 inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: "#8a6b3d" }}
        >
          See how the disciplines become strategy <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="relative z-10 min-h-[22rem] lg:min-h-full">
        <KenBurnsImage
          image="/images/own-portrait.jpg"
          gradient="linear-gradient(to top, rgba(20,18,16,0.54), rgba(20,18,16,0.02) 62%)"
          imagePosition="center 30%"
          className="absolute inset-0 h-full w-full"
          sizes="(min-width: 1024px) 25vw, 100vw"
        />

        <div className="absolute inset-x-5 bottom-5 space-y-2">
          {["M.A. Clinical Psychology", "B.A. English Literature", "Direct strategy lead"].map(
            (credential, index) => (
              <motion.div
                key={credential}
                className="w-fit rounded-full border border-ivory/18 bg-soil/62 px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ivory/88 backdrop-blur-md"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        x: [0, index % 2 === 0 ? 6 : -5, 0],
                        y: [0, -4 - index, 0],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        duration: 6 + index,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.55,
                      }
                }
              >
                {credential}
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
