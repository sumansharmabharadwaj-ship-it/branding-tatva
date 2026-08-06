"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { brandStages } from "@/lib/contact-schema";
import { site } from "@/data/site";
import { track } from "@/lib/analytics";

// The closing "Book call" section, reframed as a Strategy Room per
// direct feedback: a few quick taps before the calendar appears,
// instead of the calendar being the very first thing shown. This is a
// pacing device, not a data-collection claim: nothing here promises
// the booking flow personalizes based on the answers (it does not),
// which would break this site's own commercial-honesty rule. Q1 reuses
// the Contact form's own real brandStages options verbatim
// (lib/contact-schema.ts); Q3 compresses the site's own real six
// `offerings` names (data/services.ts) into four focus areas, rather
// than inventing separate wording for either.
const PRIORITIES = ["Getting positioning right", "Building recognition", "Staying consistent", "Still deciding"] as const;
const FOCUS_AREAS = ["Positioning & identity", "Content & voice", "Ongoing management", "Still exploring"] as const;

// One shared control contract across all three questions. min-h-11 gives
// every pill a 44px touch target even when its label stays on one line;
// the visible focus ring keeps the quiet glass treatment keyboard-clear.
const OPTION_BUTTON_CLASS =
  "min-h-11 rounded-full border border-ivory/25 bg-ivory/[0.04] px-4 py-2.5 text-sm text-ivory/90 transition-colors duration-300 hover:border-sandstone/50 hover:bg-ivory/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone";

type Step = 0 | 1 | 2 | 3;

export function StrategyRoomCTA() {
  const [step, setStep] = useState<Step>(0);
  const [stage, setStage] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  function pickStage(value: string) {
    setStage(value);
    setStep(1);
  }
  function pickPriority(value: string) {
    setPriority(value);
    setStep(2);
  }
  function pickFocus(value: string) {
    setFocus(value);
    setStep(3);
    track("calendar_opened");
  }

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Container className="relative max-w-2xl text-center">
      {/* Deliberately centered: the one symmetric composition on the
          page, chosen as arrival rather than convenience. After seven
          asymmetric chapters, the visitor reaches a calm, balanced
          room. Typography breathes wider here than anywhere else. */}
      {/* Phase 2 motion direction, "arrival": the single slowest
          entrance on the page, one unhurried breath rather than a
          staggered sequence. Everything after the visitor gets here is
          meant to feel settled; the welcome moves accordingly. */}
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
        {/* Phase 4: the one trust line between Desire and the calendar.
            A real fact (one-person practice, already established on
            About and in the Footer) sits at the exact moment the
            visitor decides whether to hand over their time. */}
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ivory/90">
          A few quick questions, then a real time on the calendar. Twenty minutes, honest feedback either way. You
          talk directly with the person who does the work, from first question to final file.
        </p>
      </motion.div>

      {/* Six brand-stage options can wrap across several rows on a
          narrow screen. More room on mobile prevents the changing step
          from colliding with the content below; larger screens retain
          the tighter original rhythm. */}
      <div className="relative mt-10 min-h-[280px] sm:min-h-[220px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">Where is your brand right now?</p>
              <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2.5">
                {brandStages.map((option) => (
                  <motion.button
                    key={option}
                    type="button"
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
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <p className="text-sm text-ivory/90">Good. Grab a time that works.</p>
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
