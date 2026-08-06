"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { brandStages } from "@/lib/contact-schema";
import { site } from "@/data/site";

const PRIORITIES = ["Getting positioning right", "Building recognition", "Staying consistent", "Still deciding"] as const;
const FOCUS_AREAS = ["Positioning & identity", "Content & voice", "Ongoing management", "Still exploring"] as const;
const QUESTION_COUNT = 3;

const CALL_PREVIEW = [
  {
    label: "For",
    text: "Founders and existing businesses with one real brand question to untangle.",
  },
  {
    label: "Bring",
    text: "No polished brief. The three answers below are enough to begin.",
  },
  {
    label: "During",
    text: "We isolate the hardest decision, test fit, and identify the useful next step.",
  },
  {
    label: "Leave with",
    text: "A clear recommendation, including honest feedback when a project is not the answer.",
  },
] as const;

const OPTION_BUTTON_CLASS =
  "min-h-11 rounded-full border border-ivory/25 bg-ivory/[0.04] px-4 py-2.5 text-sm text-ivory/90 transition-colors duration-300 hover:border-sandstone/50 hover:bg-ivory/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone";

const QUIET_ACTION_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm text-ivory/70 transition-colors duration-300 hover:bg-ivory/[0.06] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone";

type Step = 0 | 1 | 2 | 3;
type CopyState = "idle" | "copied" | "manual";

export function StrategyRoomCTA() {
  const [step, setStep] = useState<Step>(0);
  const [stage, setStage] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const prefersReducedMotion = useHydratedReducedMotion();

  function pickStage(value: string) {
    setStage(value);
    setPriority(null);
    setFocus(null);
    setCopyState("idle");
    setStep(1);
  }

  function pickPriority(value: string) {
    setPriority(value);
    setFocus(null);
    setCopyState("idle");
    setStep(2);
  }

  function pickFocus(value: string) {
    setFocus(value);
    setCopyState("idle");
    setStep(3);
  }

  function goBack() {
    setCopyState("idle");
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
    setCopyState("idle");
    setStep(0);
  }

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };
  const progressLabel = step < 3 ? `Question ${step + 1} of ${QUESTION_COUNT}` : "Your call brief";
  const completedSegments = step === 3 ? QUESTION_COUNT : step + 1;
  const briefRows = [
    { label: "Brand stage", value: stage },
    { label: "Priority", value: priority },
    { label: "Main focus", value: focus },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));
  const briefText = [
    "Branding Tatva strategy-session brief",
    ...briefRows.map((row) => `${row.label}: ${row.value}`),
  ].join("\n");
  const emailHref = `mailto:${site.email}?subject=${encodeURIComponent("Brand strategy question")}&body=${encodeURIComponent(
    `Hi Suman,\n\n${briefText}\n\nThe hardest question I want to discuss is: `,
  )}`;

  async function copyBrief() {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(briefText);
      setCopyState("copied");
    } catch {
      setCopyState("manual");
    }
  }

  return (
    <Container className="relative max-w-3xl text-center">
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
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/90">
          Twenty minutes, direct conversation, honest feedback either way. The small preview below explains who the call is for, what to bring, what happens inside it, and what you leave with.
        </p>
      </motion.div>

      <div
        data-strategy-call-preview="true"
        className="mx-auto mt-7 grid max-w-2xl grid-cols-2 gap-2 text-left sm:grid-cols-4 sm:gap-3"
      >
        {CALL_PREVIEW.map((item, index) => (
          <motion.div
            key={item.label}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.42, delay: index * 0.07 }}
            className="rounded-2xl border border-ivory/12 bg-black/10 p-3.5 backdrop-blur-md"
          >
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-sandstone/75">{item.label}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ivory/68">{item.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative mt-8 min-h-[330px] sm:min-h-[260px]" aria-live="polite">
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
              <div
                data-strategy-brief="true"
                aria-label="Your Strategy Room brief"
                className="mx-auto max-w-xl rounded-2xl border border-sandstone/25 bg-sandstone/[0.07] p-4 text-left backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.17em] text-sandstone/75">Your three-line brief</p>
                    <p className="mt-1 text-sm text-ivory/65">Keep it beside you when the conversation begins.</p>
                  </div>
                  <button
                    type="button"
                    data-strategy-copy-brief="true"
                    onClick={copyBrief}
                    className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-ivory/20 px-3 py-2 text-xs text-ivory/75 transition-colors hover:border-sandstone/55 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                  >
                    Copy brief
                  </button>
                </div>
                <dl className="mt-4 grid gap-2 sm:grid-cols-3">
                  {briefRows.map((row) => (
                    <div key={row.label} className="rounded-xl border border-ivory/10 bg-black/10 p-3">
                      <dt className="text-[0.54rem] font-medium uppercase tracking-[0.14em] text-ivory/42">{row.label}</dt>
                      <dd className="mt-1 text-xs leading-relaxed text-ivory/82">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p data-strategy-copy-status="true" className="mt-3 text-xs text-ivory/52" aria-live="polite">
                  {copyState === "copied"
                    ? "Copied. Add the hardest question in your own words."
                    : copyState === "manual"
                      ? "Clipboard access was blocked. The three lines remain visible above."
                      : "No private answer text is sent to analytics."}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <button type="button" data-strategy-control="true" onClick={goBack} className={QUIET_ACTION_CLASS}>
                  <span aria-hidden="true">←</span>
                  <span className="ml-2">Back</span>
                </button>
                <button type="button" data-strategy-control="true" onClick={restart} className={QUIET_ACTION_CLASS}>
                  Start again
                </button>
              </div>

              <div className="mt-2">
                <CalendlyEmbed url={site.calendlyUrl} />
              </div>

              <a
                data-strategy-email-alternative="true"
                href={emailHref}
                className="link-underline mt-5 inline-flex min-h-11 items-center text-sm text-ivory/62 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
              >
                Prefer email? Send this brief instead
                <span aria-hidden="true" className="ml-2">→</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
