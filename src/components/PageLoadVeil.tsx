"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/Logo";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const SEEN_KEY = "branding-tatva-identity-seen";

export function PageLoadVeil() {
  const prefersReducedMotion = useReducedMotion();
  const [markVisible, setMarkVisible] = useState(false);
  const [wordmarkVisible, setWordmarkVisible] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(false);
  const [visible, setVisible] = useState(!prefersReducedMotion);
  const [removed, setRemoved] = useState(prefersReducedMotion);

  useEffect(() => {
    const approvalPreview =
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(window.location.search).has("loader-preview");

    if (approvalPreview) {
      setMarkVisible(true);
      setWordmarkVisible(true);
      setCaptionVisible(true);
      return;
    }

    if (prefersReducedMotion) return;
    if (window.sessionStorage.getItem(SEEN_KEY)) {
      setVisible(false);
      setRemoved(true);
      return;
    }

    const timers = [
      setTimeout(() => setMarkVisible(true), 80),
      setTimeout(() => setWordmarkVisible(true), 360),
      setTimeout(() => setCaptionVisible(true), 520),
      setTimeout(() => setVisible(false), 900),
      setTimeout(() => {
        window.sessionStorage.setItem(SEEN_KEY, "1");
        setRemoved(true);
      }, 1180),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [prefersReducedMotion]);

  if (removed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ clipPath: "inset(0% 0 0% 0)" }}
          exit={{ clipPath: "inset(0% 0 100% 0)" }}
          transition={{ duration: 0.24, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-100 overflow-hidden bg-[#071117]"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.76, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
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
                  transition={{ duration: 0.58, delay: trail * 0.05, ease: EASE }}
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
                transition={{ duration: 0.64, ease: EASE }}
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
              transition={{ duration: 0.38, ease: EASE }}
              className="mt-5 origin-center scale-[1.5] sm:scale-[2.05]"
            >
              <Logo light />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={captionVisible ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-16 flex flex-col items-center sm:mt-20"
            >
              <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.46em] text-ivory/60 sm:text-[0.7rem]">
                Strategy before styling
              </span>
              <motion.span
                className="mt-4 block h-px bg-ivory/35"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ duration: 0.42, ease: EASE }}
              />
              <span className="mt-3 font-body text-[0.64rem] uppercase tracking-[0.18em] text-ivory/75">
                Five elements · one decision system
              </span>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-7 right-7 h-9 w-9 sm:bottom-9 sm:right-9"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={captionVisible ? { opacity: 0.7, scale: 1 } : undefined}
            transition={{ duration: 0.28, ease: EASE }}
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
