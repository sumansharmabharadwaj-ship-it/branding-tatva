"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/Container";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { brandStages } from "@/lib/contact-schema";
import { site } from "@/data/site";
import { entityFacts } from "@/data/entityFacts";
import { track } from "@/lib/analytics";

// The closing "Book call" section is a short Strategy Room rather than
// dropping a calendar into the visitor's path without context. Three
// quick choices establish the shape of the conversation. They are shown
// back to the visitor before scheduling, but they do not claim to alter
// or personalize the external booking flow.
const PRIORITIES = ["Getting positioning right", "Building recognition", "Staying consistent", "Still deciding"] as const;
const FOCUS_AREAS = ["Positioning & identity", "Content & voice", "Ongoing management", "Still exploring"] as const;
const QUESTION_COUNT = 3;

// One shared control contract across all three questions. min-h-11 gives
// every pill a 44px touch target even when its label stays on one line;
// the visible focus ring keeps the quiet glass treatment keyboard-clear.
const OPTION_BUTTON_CLASS =
  "min-h-11 rounded-full border border-ivory/25 bg-ivory/[0.04] px-4 py-2.5 text-sm text-ivory/90 transition-colors duration-300 hover:border-sandstone/50 hover:bg-ivory/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone";

const QUIET_ACTION_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm text-ivory/70 transition-colors duration-300 hover:bg-ivory/[0.06] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone";

type Step = 0 | 1 | 2 | 3;

export function StrategyRoomCTA() {
  const [step, setStep] = useState<Step>(0);
  const [stage, setStage] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();

  function pickStage(value: string) {
    setStage(value);
    setPriority(null);
    setFocus(null);
    setStep(1);
  }

  function pickPriority(value: string) {
    setPriority(value);
    setFocus(null);
    setStep(2);
  }

  function pickFocus(value: string) {
    setFocus(value);
    setStep(3);
    track("calendar_opened");
  }

  function goBack() {
    if (step === 1) {
      setStage(null);
      setPriority(null);
      setFocus(null);
      setStep(0);
      return;
    }
    if (step === 2) {
      setPriority(null);
      setFocus(null);
      setStep(1);
      return;
    }
    if (step === 3) {
      setFocus(null);
      setStep(2);
    }
  }

  function restart() {
    setStage(null);
    setPriority(null);
    setFocus(null);
    setStep(0);
  }

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };
  const progressLabel = step < 3 ? `Question ${step + 1} of ${QUESTION_COUNT}` : "Ready to book";
  const completedSegments = step === 3 ? QUESTION_COUNT : step + 1;
  const answers = [stage, priority, focus].filter((answer): answer is string => Boolean(answer));

  return (
    <Container className="relative max-w-2xl text-center">
      {/* Deliberately centered: the one symmetric composition on the
          page, chosen as arrival rather than convenience. After the
          asymmetric chapters, the visitor reaches a balanced room. */}
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sandstone">Book call</p>
        <h2 className="mt-3 text-display-md font-display font-normal leading-[1.06] text-ivory">
          Open the strategy room.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ivory/90">
          A few quick questions, then a real time on the calendar. Thirty minutes, honest feedback either way. You
          talk directly with the person who does the work, from first question to final file.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ivory/70">
          Founder-led remote projects are available across {entityFacts.delivery.regions.slice(0, -1).join(", ")} and{" "}
          {entityFacts.delivery.regions.at(-1)}. Read the{" "}
          <Link
            href="/insights/brand-positioning-strategy-service-businesses"
            className="link-underline text-sandstone"
          >
            brand positioning guide for service businesses
          </Link>
          {" "}before choosing a time.
        </p>
      </motion.div>

      {/* The progress rail makes the tiny interaction feel finite. The
          controls remain reversible, so a fast tap never becomes a trap. */}
      <div className="relative mt-10 min-h-[330px] sm:min-h-[260px]" aria-live="polite">
        <div className="mx-auto mb-6 flex max-w-lg items-center justify-between gap-4">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ivory/60">{progressLabel}</p>
          <div className="flex flex-1 justify-end gap-1.5" aria-hidden="true">
            {Array.from({ length: QUESTION_COUNT }).map((_, index) => (
              <span
                key={index}
                className={`h-1 w-10 rounded-full transition-colors duration-500 sm:w-14 ${
                  index < completedSegments ? "bg-sandstone" : "bg-ivory/15"
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">Where is your brand right now?</p>
              <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2.5">
                {brandStages.map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    data-strategy-control="true"
                    onClick={() => pickStage(option)}
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className={OPTION_BUTTON_CLASS}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="priority" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">What matters most right now?</p>
              <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2.5">
                {PRIORITIES.map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    data-strategy-control="true"
                    onClick={() => pickPriority(option)}
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className={OPTION_BUTTON_CLASS}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
              <button type="button" data-strategy-control="true" onClick={goBack} className={`${QUIET_ACTION_CLASS} mt-5`}>
                <span aria-hidden="true">←</span>
                <span className="ml-2">Back</span>
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">What&apos;s the main focus?</p>
              <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2.5">
                {FOCUS_AREAS.map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    data-strategy-control="true"
                    onClick={() => pickFocus(option)}
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className={OPTION_BUTTON_CLASS}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
              <button type="button" data-strategy-control="true" onClick={goBack} className={`${QUIET_ACTION_CLASS} mt-5`}>
                <span aria-hidden="true">←</span>
                <span className="ml-2">Back</span>
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <p className="text-sm text-ivory/90">Good. Grab a time that works.</p>
              <div
                aria-label="Your Strategy Room answers"
                className="mx-auto mt-4 flex max-w-xl flex-wrap justify-center gap-2"
              >
                {answers.map((answer) => (
                  <span
                    key={answer}
                    className="rounded-full border border-sandstone/30 bg-sandstone/[0.08] px-3 py-1.5 text-xs text-ivory/80"
                  >
                    {answer}
                  </span>
                ))}
              </div>
              <button
                type="button"
                data-strategy-control="true"
                onClick={restart}
                className={`${QUIET_ACTION_CLASS} mt-3`}
              >
                Change answers
              </button>
              <div className="mt-2">
                <CalendlyEmbed url={site.calendlyUrl} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
