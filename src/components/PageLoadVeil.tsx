"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TATVA_CONTOURS, TATVA_MARK_COLORS } from "@/lib/brandMark";

const EASE = [0.22, 1, 0.36, 1] as const;
const SESSION_KEY = "branding-tatva-arrival-seen";

export function PageLoadVeil() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [removed, setRemoved] = useState(true);
  const [activeElement, setActiveElement] = useState(0);

  useEffect(() => {
    if (reduce) return;

    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    setRemoved(false);
    setVisible(true);

    const elementTimers = [0, 1, 2, 3, 4].map((index) =>
      window.setTimeout(() => setActiveElement(index), 180 + index * 150),
    );
    const leave = window.setTimeout(() => setVisible(false), 1540);
    const remove = window.setTimeout(() => setRemoved(true), 2200);

    return () => {
      elementTimers.forEach(window.clearTimeout);
      window.clearTimeout(leave);
      window.clearTimeout(remove);
    };
  }, [reduce]);

  if (removed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0.98 }}
          transition={{ duration: 0.72, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-100 overflow-hidden bg-[#111b15] text-ivory"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-[-18%]"
            style={{
              background:
                "radial-gradient(circle at 50% 44%, rgba(198,169,122,.20), transparent 25%), radial-gradient(circle at 28% 75%, rgba(92,107,74,.18), transparent 34%), radial-gradient(circle at 78% 18%, rgba(78,106,105,.14), transparent 32%)",
            }}
            animate={{ scale: [1, 1.05, 1], x: [0, -12, 0], y: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="paper-grain" style={{ opacity: 0.08 }} />

          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="relative h-48 w-48 sm:h-56 sm:w-56">
              <motion.div
                className="absolute inset-4 rounded-full border border-sandstone/12"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              />
              <svg viewBox="0 0 100 100" fill="none" className="relative h-full w-full">
                {TATVA_CONTOURS.map((path, index) => (
                  <motion.path
                    key={path}
                    d={path}
                    stroke={TATVA_MARK_COLORS[index]}
                    strokeWidth={index === 0 ? 3.8 : 3.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: activeElement >= index ? 1 : 0,
                      opacity: activeElement >= index ? 0.96 : 0,
                    }}
                    transition={{ duration: 0.58, ease: EASE }}
                  />
                ))}
                <motion.circle
                  cx="50"
                  cy="57"
                  r="5.2"
                  fill={TATVA_MARK_COLORS[4]}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: activeElement >= 4 ? 1 : 0, scale: activeElement >= 4 ? 1 : 0 }}
                  transition={{ duration: 0.42, ease: EASE }}
                  style={{ transformOrigin: "50px 57px" }}
                />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              animate={{ opacity: activeElement >= 3 ? 1 : 0, y: activeElement >= 3 ? 0 : 14, filter: "blur(0px)" }}
              transition={{ duration: 0.58, ease: EASE }}
              className="mt-5"
            >
              <p className="font-display text-4xl tracking-[-0.04em] sm:text-5xl">
                Branding <span className="italic text-sandstone">Tatva</span>
              </p>
              <p className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-ivory/48">
                Five decisions. One remembered meaning.
              </p>
            </motion.div>
          </div>

          <div className="absolute inset-x-7 bottom-7 flex items-center gap-4 text-[0.54rem] uppercase tracking-[0.22em] text-ivory/34 sm:inset-x-10 sm:bottom-10">
            <span>Earth</span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sandstone/45 to-transparent" />
            <span>Space</span>
            <span className="tabular-nums text-sandstone/72">0{activeElement + 1} / 05</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
