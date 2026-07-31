"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { LinkButton } from "@/components/Button";
import { brandStages } from "@/lib/contact-schema";
import { site } from "@/data/site";

// The closing "Book call" section, reframed as a Strategy Room per
// direct feedback: a few quick taps before the calendar appears,
// instead of the calendar being the very first thing shown. This is a
// pacing device, not a data-collection claim — nothing here promises
// the booking flow personalizes based on the answers (it doesn't),
// which would break this site's own commercial-honesty rule. Q1 reuses
// the Contact form's own real brandStages options verbatim
// (lib/contact-schema.ts); Q3 compresses the site's own real six
// `offerings` names (data/services.ts) into four focus areas, rather
// than inventing separate wording for either.
const PRIORITIES = ["Getting positioning right", "Building recognition", "Staying consistent", "Still deciding"] as const;
const FOCUS_AREAS = ["Positioning & identity", "Content & voice", "Ongoing management", "Still exploring"] as const;

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
  }

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Container className="relative max-w-2xl text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Book call</p>
      <h2 className="mt-2 text-display-md font-display font-normal text-ivory">
        Open the strategy room.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-ivory/70">
        A few quick questions, then a real time on the calendar. Twenty minutes, honest feedback either way.
      </p>

      <div className="relative mt-10 min-h-[220px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <p className="text-sm font-medium uppercase tracking-wide text-ivory/60">Where is your brand right now?</p>
              <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2.5">
                {brandStages.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => pickStage(option)}
                    className="rounded-full border border-ivory/25 px-4 py-2 text-sm text-ivory/85 transition-colors duration-300 hover:border-ivory/50 hover:bg-ivory/10"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="priority" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <p className="text-sm font-medium uppercase tracking-wide text-ivory/60">What matters most right now?</p>
              <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2.5">
                {PRIORITIES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => pickPriority(option)}
                    className="rounded-full border border-ivory/25 px-4 py-2 text-sm text-ivory/85 transition-colors duration-300 hover:border-ivory/50 hover:bg-ivory/10"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <p className="text-sm font-medium uppercase tracking-wide text-ivory/60">What&apos;s the main focus?</p>
              <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2.5">
                {FOCUS_AREAS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => pickFocus(option)}
                    className="rounded-full border border-ivory/25 px-4 py-2 text-sm text-ivory/85 transition-colors duration-300 hover:border-ivory/50 hover:bg-ivory/10"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <p className="text-sm text-ivory/70">Good. Grab a time that works.</p>
              <div className="mt-2">
                <CalendlyEmbed url={site.calendlyUrl} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step < 3 && (
        <p className="mt-8 text-xs text-ivory/50">
          Prefer to skip ahead? <SkipLink onSkip={() => setStep(3)} />
        </p>
      )}
    </Container>
  );
}

function SkipLink({ onSkip }: { onSkip: () => void }) {
  return (
    <button type="button" onClick={onSkip} className="link-underline text-xs text-ivory/70 hover:text-ivory">
      Go straight to the calendar
    </button>
  );
}
