"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { site } from "@/data/site";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const DURATION_MS = 2250;
const REMOVE_MS = 2920;
const EASE = [0.22, 1, 0.36, 1] as const;
const TATVAS = [
  { name: "Earth", role: "position" },
  { name: "Water", role: "experience" },
  { name: "Fire", role: "distinction" },
  { name: "Air", role: "voice" },
  { name: "Space", role: "recognition" },
] as const;

const BIRDS = [
  { left: 82, top: 22, scale: 1.05, travel: -170, drift: 10, delay: 0 },
  { left: 87, top: 27, scale: 0.82, travel: -145, drift: 4, delay: 0.12 },
  { left: 91, top: 23, scale: 0.68, travel: -160, drift: 14, delay: 0.24 },
] as const;

export function PageLoadVeil() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [visible, setVisible] = useState(true);
  const [removed, setRemoved] = useState(false);
  const [progress, setProgress] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) {
      setVisible(false);
      setRemoved(true);
      return;
    }

    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const next = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));
      setProgress(next);
      if (next < 100) frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    const hideTimer = window.setTimeout(() => setVisible(false), DURATION_MS + 120);
    const removeTimer = window.setTimeout(() => setRemoved(true), REMOVE_MS);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [prefersReducedMotion]);

  const activeIndex = useMemo(
    () => Math.min(TATVAS.length - 1, Math.floor((progress / 101) * TATVAS.length)),
    [progress],
  );
  const active = TATVAS[activeIndex];

  if (removed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-page-load-veil
          aria-hidden="true"
          className="fixed inset-0 z-100 overflow-hidden bg-[#17140f]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.012,
            filter: "blur(8px)",
          }}
          transition={{ duration: 0.62, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08, x: 0 }}
            animate={{ scale: 1.015, x: -8 }}
            transition={{ duration: 4.2, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/loading-cairn-sunrise.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_52%]"
            />
          </motion.div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,17,14,0.48) 0%, rgba(20,17,14,0.08) 34%, rgba(20,17,14,0.28) 66%, rgba(20,17,14,0.76) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 72% 23%, rgba(235,205,150,0.24), transparent 24%), radial-gradient(circle at 50% 82%, rgba(20,17,14,0.24), transparent 48%)",
            }}
          />

          <motion.div
            className="absolute left-[-32%] top-[48%] h-[24%] w-[118%]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(234,232,224,0.18) 30%, rgba(234,232,224,0.08) 67%, transparent)",
              filter: "blur(12px)",
            }}
            initial={{ x: -30, y: 5 }}
            animate={{ x: 86, y: -4 }}
            transition={{ duration: 5.2, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-38%] top-[58%] h-[22%] w-[112%]"
            style={{
              background:
                "linear-gradient(270deg, transparent, rgba(225,227,220,0.15) 28%, rgba(225,227,220,0.06) 66%, transparent)",
              filter: "blur(13px)",
            }}
            initial={{ x: 45, y: -4 }}
            animate={{ x: -90, y: 5 }}
            transition={{ duration: 5.4, ease: "easeInOut" }}
          />

          {BIRDS.map((bird, index) => (
            <motion.span
              key={`${bird.left}-${bird.top}`}
              className="absolute"
              style={{ left: `${bird.left}%`, top: `${bird.top}%` }}
              initial={{ x: 0, y: 0, opacity: 0.48 }}
              animate={{ x: bird.travel, y: bird.drift, opacity: 0.82 }}
              transition={{ duration: 4.2, delay: bird.delay, ease: [0.3, 0.55, 0.6, 1] }}
            >
              <svg
                width={22 * bird.scale}
                height={11 * bird.scale}
                viewBox="0 0 22 11"
                fill="none"
              >
                <motion.path
                  d="M1 7 Q6 2 11 6 Q16 2 21 7"
                  animate={{
                    d: [
                      "M1 7 Q6 2 11 6 Q16 2 21 7",
                      "M1 4 Q6 8 11 5 Q16 8 21 4",
                      "M1 7 Q6 2 11 6 Q16 2 21 7",
                    ],
                  }}
                  transition={{
                    duration: 0.72 + index * 0.11,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  stroke="rgba(45,39,31,0.72)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </motion.span>
          ))}

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
              className="flex flex-col items-center"
            >
              <LogoMark size={58} light />
              <p
                className="mt-4 font-display text-lg font-medium uppercase tracking-[0.34em] text-ivory sm:text-xl"
                style={{ textShadow: "0 2px 16px rgba(20,17,14,0.55)" }}
              >
                {site.name}
              </p>
              <span
                aria-hidden="true"
                className="mt-4 h-px w-16"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(224,195,145,0.95), transparent)",
                }}
              />
              <p
                className="mt-5 max-w-xl font-display text-[clamp(2.35rem,5.2vw,5rem)] font-normal leading-[0.96] text-ivory"
                style={{ textShadow: "0 2px 20px rgba(20,17,14,0.62)" }}
              >
                Uncovering the <em className="text-[#ead1a2]">essence.</em>
              </p>
            </motion.div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={active.name}
                className="mt-7 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-ivory/76"
                initial={{ opacity: 0, y: 7, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -7, filter: "blur(4px)" }}
                transition={{ duration: 0.26, ease: EASE }}
              >
                {active.name} <span className="text-[#ead1a2]">·</span> {active.role}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="absolute inset-x-0 bottom-[8%] px-6">
            <div className="mx-auto flex w-full max-w-lg items-center gap-4">
              <span className="text-[0.58rem] font-medium tracking-[0.16em] text-ivory/58">
                {String(progress).padStart(2, "0")}
              </span>
              <span className="relative h-px flex-1 overflow-hidden bg-ivory/24">
                <span
                  className="absolute inset-y-0 left-0 bg-[#ead1a2]"
                  style={{
                    width: `${progress}%`,
                    boxShadow: "0 0 18px rgba(234,209,162,0.7)",
                    transition: "width 60ms linear",
                  }}
                />
              </span>
              <span className="text-[0.58rem] font-medium tracking-[0.16em] text-ivory/58">
                100
              </span>
            </div>
            <p className="mx-auto mt-3 max-w-lg text-center text-[0.52rem] uppercase tracking-[0.24em] text-ivory/46">
              Essence first. Recognition follows.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
