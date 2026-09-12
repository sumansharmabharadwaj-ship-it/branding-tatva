"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { EASE_AIR } from "@/lib/motion";
import { cn } from "@/lib/utils";

type NoteField = "name" | "email" | "description";

const NOTE_STEPS: { field: NoteField; label: string }[] = [
  { field: "name", label: "Name" },
  { field: "email", label: "Email" },
  { field: "description", label: "Question" },
];

export function ContactNoteProgress({
  checks,
  activeField,
  completionLabel,
  submitting,
  reducedMotion,
  onSelect,
}: {
  checks: readonly boolean[];
  activeField: NoteField | null;
  completionLabel: string;
  submitting: boolean;
  reducedMotion: boolean;
  onSelect: (field: NoteField) => void;
}) {
  const id = useId();
  const complete = checks.filter(Boolean).length;
  const duration = reducedMotion ? 0 : 0.4;

  return (
    <div
      data-contact-form-progress
      className="mt-6 rounded-2xl border border-soil/10 bg-white/30 px-3 py-2.5"
    >
      <div
        role="progressbar"
        aria-label="Required enquiry details"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={complete}
        aria-valuetext={completionLabel}
        className="flex items-center justify-between gap-3 px-1"
      >
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-soil/55">Your note</p>
        <p className="text-[0.65rem] text-soil/65">{completionLabel}</p>
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {completionLabel}
      </span>

      <div className="mt-2 grid grid-cols-3 gap-1" role="group" aria-label="Move between enquiry details">
        {NOTE_STEPS.map(({ field, label }, index) => {
          const active = activeField === field;
          const ready = checks[index];
          return (
            <motion.button
              key={field}
              type="button"
              onClick={() => onSelect(field)}
              disabled={submitting}
              aria-label={`Edit ${label.toLowerCase()}${ready ? ", complete" : ""}`}
              aria-current={active ? "step" : undefined}
              data-contact-note-step={field}
              data-complete={ready ? "true" : "false"}
              whileHover={reducedMotion || submitting ? undefined : { y: -2 }}
              whileTap={reducedMotion || submitting ? undefined : { scale: 0.97 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              className={cn(
                "relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-1.5 text-soil/65 outline-offset-2 hover:text-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay disabled:cursor-wait sm:min-h-12 sm:flex-row sm:gap-2.5",
                active && "text-soil",
                ready && "text-clay",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`${id}-field`}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-xl border border-clay/20 bg-gradient-to-br from-white/65 to-clay/10 shadow-[0_4px_16px_rgba(104,75,49,0.06)]"
                  transition={{ duration, ease: EASE_AIR }}
                />
              ) : null}
              <span aria-hidden="true" className="relative grid h-5 w-5 shrink-0 place-items-center">
                <motion.span
                  className="font-display text-xl leading-none"
                  initial={false}
                  animate={{ y: ready ? -5 : 0, opacity: ready ? 0 : 1 }}
                  transition={{ duration }}
                >
                  {index + 1}
                </motion.span>
                <svg className="absolute inset-0 h-5 w-5" viewBox="0 0 20 20" fill="none">
                  <motion.path
                    d="M4 10.5 8 14.5 16 5.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={false}
                    animate={{ pathLength: ready ? 1 : 0, opacity: ready ? 1 : 0 }}
                    transition={{ duration, ease: EASE_AIR }}
                  />
                </svg>
              </span>
              <span className="relative text-[0.68rem] font-medium tracking-[0.03em]">{label}</span>
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-3 bottom-0 h-px origin-left bg-clay/55"
                initial={false}
                animate={{ scaleX: ready || active ? 1 : 0 }}
                transition={{ duration, ease: EASE_AIR }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
