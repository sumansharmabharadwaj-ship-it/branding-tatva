"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/Logo";
import { site } from "@/data/site";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const EASE = [0.22, 1, 0.36, 1] as const;
const SESSION_KEY = "bt-intro-seen";
const ELEMENTS = ["Position", "Experience", "Expression", "Voice", "Memory"] as const;

/**
 * A first-session threshold, rather than a second homepage.
 * Five separate decisions align into one signal, then that signal exits
 * through the same centre line used by the hero. No media readiness gate,
 * no simulated progress and no replay during client navigation.
 */
export function PageLoadVeil() {
  const prefersReducedMotion = useHydratedReducedMotion();
  const [visible, setVisible] = useState(true);
  const [removed, setRemoved] = useState(false);

  useIsomorphicLayoutEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}

    if (prefersReducedMotion || seen) {
      setVisible(false);
      setRemoved(true);
      return;
    }

    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    const hide = window.setTimeout(() => setVisible(false), 1650);
    const remove = window.setTimeout(() => setRemoved(true), 2200);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(remove);
    };
  }, [prefersReducedMotion]);

  if (removed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.48, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-100 overflow-hidden bg-soil"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 44%, rgba(198,169,122,0.18), transparent 24%), radial-gradient(circle at 22% 18%, rgba(143,174,131,0.1), transparent 35%), linear-gradient(150deg, #201b17 0%, #2d271f 52%, #1b1b1b 100%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative flex w-full max-w-3xl flex-col items-center px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <LogoMark size={54} light />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
                className="mt-5 text-[0.64rem] font-medium uppercase tracking-[0.36em] text-ivory/65"
              >
                {site.name}
              </motion.p>

              <div className="relative mt-12 w-full">
                <div className="absolute left-[8%] right-[8%] top-2.5 h-px bg-ivory/12" />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
                  className="absolute left-[8%] right-[8%] top-2.5 h-px origin-left bg-sandstone/75 shadow-[0_0_18px_rgba(198,169,122,0.42)]"
                />

                <div className="relative grid grid-cols-5 gap-1">
                  {ELEMENTS.map((element, index) => (
                    <motion.div
                      key={element}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.42, delay: 0.18 + index * 0.1, ease: EASE }}
                      className="flex flex-col items-center"
                    >
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.45, delay: 0.2 + index * 0.1, ease: EASE }}
                        className="relative z-10 block h-5 w-5 rounded-full border border-sandstone/55 bg-soil"
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.35, delay: 0.36 + index * 0.1, ease: EASE }}
                          className="absolute inset-[5px] rounded-full bg-sandstone shadow-[0_0_12px_rgba(198,169,122,0.65)]"
                        />
                      </motion.span>
                      <span className="mt-3 hidden text-[0.56rem] uppercase tracking-[0.16em] text-ivory/45 sm:block">
                        {element}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.92, ease: EASE }}
                className="mt-11"
              >
                <p className="font-display text-xl font-normal text-ivory sm:text-2xl">
                  Separate decisions. One remembered meaning.
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-ivory/45">The essential is forming</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0.85] }}
            transition={{ duration: 1.45, times: [0, 0.72, 1], ease: EASE }}
            className="absolute bottom-0 left-1/2 h-px w-[min(72vw,900px)] -translate-x-1/2 origin-center bg-sandstone/70 shadow-[0_0_22px_rgba(198,169,122,0.5)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
