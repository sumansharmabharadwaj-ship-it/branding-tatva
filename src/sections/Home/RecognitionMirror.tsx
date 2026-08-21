"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { EASE_AIR } from "@/lib/motion";

const CHALLENGES = [
  {
    title: "People understand the offer, then remember another brand.",
    signal: "The message explains. The identity leaves too few memory cues behind.",
    response: "Strengthen the distinctive assets that make recognition accumulate between encounters.",
    href: "/work#recognition",
  },
  {
    title: "Every channel sounds like it belongs to a different company.",
    signal: "Each piece works alone. Together, they create several competing impressions.",
    response: "Build one verbal and visual system that can travel without losing its character.",
    href: "/work#services",
  },
  {
    title: "Every campaign begins recognition from zero.",
    signal: "Activity keeps rising while memory keeps resetting.",
    response: "Ground each campaign in the same positioning, codes and repeatable brand decisions.",
    href: "/work#mechanism",
  },
] as const;

export function RecognitionMirror() {
  const groupId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);
  const activeChallenge = selected === null ? null : CHALLENGES[selected];

  return (
    <section
      id="recognition-mirror"
      aria-labelledby={`${groupId}-heading`}
      className="relative flex min-h-svh scroll-mt-24 items-center overflow-hidden bg-soil py-20 sm:py-24 lg:h-svh lg:min-h-[720px]"
    >
      <BackgroundVideo
        video="/videos/higgsfield-forest-trail-mist.mp4"
        poster="/images/higgsfield-forest-trail-mist-poster.jpg"
        imagePosition="50% 48%"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(16,21,20,0.96) 0%, rgba(16,21,20,0.82) 42%, rgba(16,21,20,0.54) 100%), linear-gradient(180deg, rgba(16,21,20,0.3) 0%, rgba(16,21,20,0.82) 100%)",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[18%] inset-y-0 opacity-30"
        style={{
          background:
            "linear-gradient(105deg, transparent 18%, rgba(244,239,230,0.16) 42%, transparent 65%)",
        }}
        animate={prefersReducedMotion ? undefined : { x: ["-8%", "8%"] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-sandstone">
            Recognition mirror
          </p>
          <h2
            id={`${groupId}-heading`}
            className="mt-4 max-w-lg font-display text-[clamp(2.25rem,4.5vw,4.25rem)] font-normal leading-[1.02] text-ivory"
          >
            Which pattern feels closest to your brand?
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/72 sm:text-lg">
            Choose the tension you recognise. The next step points to the part of the system carrying the strain.
          </p>

          <div className="mt-8 min-h-[170px] border-t border-ivory/18 pt-6" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {activeChallenge ? (
                <motion.div
                  key={activeChallenge.title}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE_AIR }}
                >
                  <p className="text-sm leading-relaxed text-ivory/78">{activeChallenge.response}</p>
                  <div className="mt-5">
                    <LinkButton href={activeChallenge.href}>Find what is holding the brand back</LinkButton>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-sm text-sm leading-relaxed text-ivory/52"
                >
                  Select one signal to reveal the most useful path forward.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <fieldset className="relative" aria-describedby={`${groupId}-instructions`}>
          <legend className="sr-only">Choose the brand pattern closest to your current situation</legend>
          <p id={`${groupId}-instructions`} className="sr-only">
            Use the arrow keys to move between the three choices.
          </p>
          <div className="absolute bottom-8 left-[1.55rem] top-8 w-px bg-ivory/16" aria-hidden="true" />
          <div className="relative space-y-3">
            {CHALLENGES.map((challenge, index) => {
              const isSelected = selected === index;
              const inputId = `${groupId}-challenge-${index}`;

              return (
                <label
                  key={challenge.title}
                  htmlFor={inputId}
                  className={`group relative grid min-h-11 cursor-pointer grid-cols-[3.1rem_1fr] gap-4 rounded-xl border px-5 py-5 backdrop-blur-sm transition-[background-color,border-color,transform] duration-500 ease-air sm:px-6 sm:py-6 ${
                    isSelected
                      ? "translate-x-2 border-sandstone/70 bg-soil/82"
                      : "border-ivory/16 bg-soil/48 hover:translate-x-1 hover:border-ivory/32 hover:bg-soil/64"
                  }`}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={`${groupId}-brand-pattern`}
                    value={challenge.title}
                    checked={isSelected}
                    onChange={() => setSelected(index)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border font-display text-sm transition-colors duration-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-state-focus ${
                      isSelected
                        ? "border-sandstone bg-sandstone text-soil"
                        : "border-ivory/30 bg-soil/60 text-ivory/62 group-hover:border-ivory/50 group-hover:text-ivory"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="relative z-10">
                    <span className="block font-display text-xl font-normal leading-tight text-ivory sm:text-2xl">
                      {challenge.title}
                    </span>
                    <span
                      className={`mt-2 block text-sm leading-relaxed transition-colors duration-500 ${
                        isSelected ? "text-ivory/78" : "text-ivory/52 group-hover:text-ivory/68"
                      }`}
                    >
                      {challenge.signal}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </Container>
    </section>
  );
}
