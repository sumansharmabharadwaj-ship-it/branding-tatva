"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/Logo";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const COUNTER_DURATION_MS = 1780;

export function PageLoadVeil() {
  const prefersReducedMotion = useReducedMotion();
  const [markVisible, setMarkVisible] = useState(false);
  const [wordmarkVisible, setWordmarkVisible] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(false);
  const [visible, setVisible] = useState(!prefersReducedMotion);
  const [removed, setRemoved] = useState(prefersReducedMotion);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const approvalPreview =
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(window.location.search).has("loader-preview");

    if (approvalPreview) {
      setMarkVisible(true);
      setWordmarkVisible(true);
      setCaptionVisible(true);
      setProgress(74);
      return;
    }

    if (prefersReducedMotion) return;
    const timers = [
      setTimeout(() => setMarkVisible(true), 120),
      setTimeout(() => setWordmarkVisible(true), 620),
      setTimeout(() => setCaptionVisible(true), 900),
      setTimeout(() => setVisible(false), 1850),
      setTimeout(() => setRemoved(true), 2550),
    ];

    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / COUNTER_DURATION_MS) * 100));
      setProgress(pct);
      if (pct < 100) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  if (removed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ clipPath: "inset(0% 0 0% 0)" }}
          exit={{ clipPath: "inset(0% 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-100 overflow-hidden bg-[#071117]"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.76, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: EASE }}
          >
            <Image
              src="/images/own-dusk-ridge.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[#071117]/55" />
          <div className="paper-grain" style={{ opacity: 0.09 }} />

          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ paddingTop: "clamp(4rem, 9vh, 7rem)" }}
          >
            <div
              className="relative shrink-0"
              style={{ width: "clamp(13rem, 24vw, 20rem)", height: "clamp(13rem, 24vw, 20rem)" }}
            >
              {[0, 1].map((trail) => (
                <motion.div
                  key={trail}
                  className="absolute inset-0"
                  initial={{ opacity: 0.22, x: trail === 0 ? 34 : -30, y: trail === 0 ? -18 : 24, rotate: trail === 0 ? 7 : -6 }}
                  animate={markVisible ? { opacity: 0, x: 0, y: 0, rotate: 0 } : undefined}
                  transition={{ duration: 0.72, delay: trail * 0.08, ease: EASE }}
                >
                  <Image
                    src="/images/branding-tatva-tatva-mark.png"
                    alt=""
                    fill
                    sizes="240px"
                    className="object-contain brightness-0 invert blur-[2px]"
                  />
                </motion.div>
              ))}

              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.72, rotate: -9, filter: "blur(8px)" }}
                animate={markVisible ? { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" } : undefined}
                transition={{ duration: 0.82, ease: EASE }}
              >
                <Image
                  src="/images/branding-tatva-tatva-mark.png"
                  alt="Branding Tatva mountain, river and roots mark"
                  fill
                  priority
                  sizes="240px"
                  className="object-contain brightness-0 invert"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={wordmarkVisible ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease: EASE }}
              className="mt-5 origin-center scale-[1.5] sm:scale-[2.05]"
            >
              <Logo light />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={captionVisible ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.42, ease: EASE }}
              className="mt-20 flex flex-col items-center sm:mt-24"
            >
              <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.46em] text-ivory/60 sm:text-[0.7rem]">
                Finding the essential
              </span>
              <motion.span
                className="mt-4 block h-px bg-ivory/35"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(8, progress * 0.64)}px` }}
                transition={{ duration: 0.08, ease: "linear" }}
              />
              <span className="mt-3 font-body text-[0.68rem] tabular-nums tracking-[0.24em] text-ivory/80">
                {String(progress).padStart(2, "0")}
              </span>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-7 right-7 h-9 w-9 sm:bottom-9 sm:right-9"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={captionVisible ? { opacity: 0.7, scale: 1 } : undefined}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Image
              src="/images/branding-tatva-tatva-mark.png"
              alt=""
              fill
              sizes="36px"
              className="object-contain brightness-0 invert"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
