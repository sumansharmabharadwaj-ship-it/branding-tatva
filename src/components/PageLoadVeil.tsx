"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/Logo";
import { site } from "@/data/site";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const EASE = [0.22, 0.61, 0.36, 1] as const;
const DURATION_MS = 2500;
const WING_UP = "M1 5.5 Q 5 1.5 9 5 Q 13 1.5 17 5.5";
const WING_DOWN = "M1 3.5 Q 5 7 9 4.5 Q 13 7 17 3.5";

const BIRDS = [
  { left: 87, top: 24, scale: 1.2, fly: -190, fall: 10, flap: 0.72 },
  { left: 91, top: 28, scale: 0.92, fly: -165, fall: 16, flap: 0.61 },
  { left: 95, top: 25, scale: 0.78, fly: -180, fall: 8, flap: 0.8 },
] as const;

const TATVAS = [
  ["earth", "position"],
  ["water", "experience"],
  ["fire", "distinction"],
  ["air", "voice"],
  ["space", "recognition"],
] as const;

export function PageLoadVeil() {
  const prefersReducedMotion = useReducedMotion();
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

    const tick = (now: number) => {
      const next = Math.min(100, Math.round(((now - start) / DURATION_MS) * 100));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    const reveal = window.setTimeout(() => setVisible(false), DURATION_MS + 100);
    const remove = window.setTimeout(() => setRemoved(true), DURATION_MS + 1150);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(reveal);
      window.clearTimeout(remove);
    };
  }, [prefersReducedMotion]);

  if (removed) return null;

  const activeTatva = Math.min(TATVAS.length - 1, Math.floor((progress / 101) * TATVAS.length));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-100 overflow-hidden bg-[#111512] text-[#F4F0E7]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, delay: 0.5, ease: EASE }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08, x: 0 }}
            animate={{ scale: 1.015, x: -10 }}
            transition={{ duration: 4.2, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/loading-cairn-sunrise.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[54%_50%]"
            />
          </motion.div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(10,14,12,.42),rgba(10,14,12,.08) 36%,rgba(10,14,12,.18) 64%,rgba(10,14,12,.82)),linear-gradient(90deg,rgba(10,14,12,.4),transparent 54%,rgba(10,14,12,.1))",
            }}
          />

          <motion.div
            className="absolute -left-[22%] top-[52%] h-[18%] w-[98%]"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(231,235,228,.2) 32%,rgba(231,235,228,.07) 68%,transparent)",
              filter: "blur(13px)",
            }}
            initial={{ x: -35, opacity: 0.32 }}
            animate={{ x: 125, opacity: 0.72 }}
            transition={{ duration: 4.2, ease: "easeInOut" }}
          />

          {BIRDS.map((bird, index) => (
            <motion.span
              key={index}
              className="absolute"
              style={{ left: `${bird.left}%`, top: `${bird.top}%` }}
              initial={{ x: 0, y: 0 }}
              animate={{ x: bird.fly, y: [0, bird.fall * 0.35, bird.fall] }}
              transition={{
                x: { duration: 4.8, ease: [0.3, 0.55, 0.6, 1] },
                y: { duration: 4.8, ease: "easeInOut", times: [0, 0.55, 1] },
              }}
            >
              <svg width={18 * bird.scale} height={9 * bird.scale} viewBox="0 0 18 9" fill="none">
                <motion.path
                  d={WING_UP}
                  initial={{ d: WING_UP }}
                  animate={{ d: [WING_UP, WING_DOWN, WING_UP] }}
                  transition={{ duration: bird.flap, repeat: Infinity, ease: "easeInOut", delay: index * 0.16 }}
                  stroke="rgba(36,33,29,.78)"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                />
              </svg>
            </motion.span>
          ))}

          <motion.div
            className="absolute inset-x-0 top-[11%] flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.92, delay: 0.12, ease: EASE }}
          >
            <LogoMark size={54} light />
            <span className="mt-4 font-display text-base font-medium uppercase tracking-[0.42em] text-[#F6F1E7] sm:text-lg">
              {site.name}
            </span>
          </motion.div>

          <motion.div
            className="absolute left-[7vw] top-[42%] max-w-[30rem] sm:left-[9vw]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.92, delay: 0.38, ease: EASE }}
          >
            <p className="font-body text-[0.56rem] uppercase tracking-[0.34em] text-[#F4F0E7]/62">
              entering the brand system
            </p>
            <p className="mt-4 font-display text-[clamp(2.1rem,5.2vw,5.6rem)] leading-[0.92] tracking-[-0.045em] text-[#F6F1E7]">
              From meaning
              <br />
              <em className="font-normal text-[#D5B985]">to memory.</em>
            </p>
          </motion.div>

          <div className="absolute inset-x-[7vw] bottom-[8vh] sm:inset-x-[9vw] sm:bottom-[9vh]">
            <div className="grid grid-cols-5 gap-2 border-b border-[#F4F0E7]/20 pb-4 sm:gap-5">
              {TATVAS.map(([name, label], index) => {
                const active = index <= activeTatva;
                return (
                  <motion.div
                    key={name}
                    className="min-w-0"
                    animate={{ opacity: active ? 1 : 0.28, y: active ? 0 : 5 }}
                    transition={{ duration: 0.42, ease: EASE }}
                  >
                    <span className="block font-body text-[0.48rem] uppercase tracking-[0.16em] text-[#D5B985] sm:text-[0.58rem] sm:tracking-[0.28em]">
                      {name}
                    </span>
                    <span className="mt-1 hidden font-body text-[0.53rem] uppercase tracking-[0.15em] text-[#F4F0E7]/58 sm:block">
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between gap-6">
              <span className="font-body text-[0.54rem] uppercase tracking-[0.28em] text-[#F4F0E7]/64">
                composing the whole
              </span>
              <span className="font-display text-lg tabular-nums text-[#F6F1E7] sm:text-2xl">
                {String(progress).padStart(2, "0")}
              </span>
            </div>
          </div>

          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-[#111512]"
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-102%" }}
            transition={{ duration: 0.82, ease: EASE }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-[#111512]"
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "102%" }}
            transition={{ duration: 0.82, ease: EASE }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
