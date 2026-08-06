"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { track } from "@/lib/analytics";

// The Brand Recognition Audit keeps ten real checks drawn from the site's
// own frameworks: positioning, distinctive assets, mental availability,
// verbal identity, and consistency. Five checks remain public with no email
// required. The second five open only after the existing double opt-in flow.
//
// This scene used to stack every public check in one long receipt. The check
// deck preserves the complete source copy while letting one compact frame
// change state, update the visitor's score, and expose the next decision.
const CHECKS = [
  "One sentence says what the brand stands for, and everyone involved repeats the same one.",
  "The category you compete in was named deliberately, well before any tagline.",
  "A stranger could pick your brand out of a lineup with the logo covered.",
  "Colors, type, and voice repeat exactly across every channel.",
  "Buyers mention the brand unprompted when they describe the category.",
  "Your pricing signals the position you claim.",
  "Every piece of content reads like the same person wrote it.",
  "You could list your three most distinctive assets from memory.",
  "The last five things you published served one recognizable position.",
  "Someone who saw the brand six months ago would recognize it today.",
] as const;

const VISIBLE = 5;
const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "submitting" | "done" | "error";
type Answer = "holds" | "gap" | null;

export function RecognitionAudit() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [consent, setConsent] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(() =>
    Array.from({ length: CHECKS.length }, () => null),
  );
  const prefersReducedMotion = useHydratedReducedMotion();
  const unlocked = status === "done";
  const shown = unlocked ? CHECKS : CHECKS.slice(0, VISIBLE);
  const currentCheck = shown[activeIndex] ?? shown[0];
  const currentAnswer = answers[activeIndex] ?? null;
  const answered = shown.reduce(
    (total, _check, index) => total + (answers[index] ? 1 : 0),
    0,
  );
  const holding = shown.reduce(
    (total, _check, index) => total + (answers[index] === "holds" ? 1 : 0),
    0,
  );
  const completion = shown.length ? answered / shown.length : 0;

  function focusTab(index: number) {
    window.requestAnimationFrame(() => {
      document.getElementById(`recognition-check-tab-${index}`)?.focus();
    });
  }

  function moveTo(index: number, shouldFocus = false) {
    const safeIndex = Math.max(0, Math.min(index, shown.length - 1));
    setActiveIndex(safeIndex);
    if (shouldFocus) focusTab(safeIndex);
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % shown.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + shown.length) % shown.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = shown.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    moveTo(nextIndex, true);
  }

  function answerCurrent(answer: Exclude<Answer, null>) {
    setAnswers((current) => {
      const next = [...current];
      next[activeIndex] = current[activeIndex] === answer ? null : answer;
      return next;
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent || status === "submitting") return;
    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          business: business || undefined,
          consent,
          source: "recognition-audit",
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      track("lead_magnet_requested");
      setStatus("done");
      setActiveIndex(VISIBLE);
    } catch {
      setError("The server was unreachable. Check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <Container className="max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,23rem)] lg:items-start lg:gap-10 xl:gap-14">
        <div className="min-w-0">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">
                The Brand Recognition Audit
              </p>
              <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
                Ten checks that tell you where recognition stands today.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
                Consider one signal at a time. The first five are open to anyone; the second five join the same
                instrument after the form is complete.
              </p>
            </div>

            <div
              data-recognition-score="true"
              aria-live="polite"
              className="w-full shrink-0 rounded-2xl border border-ivory/12 bg-black/15 px-4 py-3 sm:w-auto sm:min-w-40 sm:text-right"
            >
              <p className="text-[0.58rem] font-medium uppercase tracking-[0.17em] text-ivory/48">
                Current reading
              </p>
              <p className="mt-1 font-display text-2xl font-normal text-ivory">
                {holding} / {shown.length}
              </p>
              <p className="mt-1 text-xs text-ivory/58">
                {answered} considered
              </p>
            </div>
          </div>

          <div
            data-recognition-audit-deck="true"
            className="relative mt-7 overflow-hidden rounded-[2rem] border border-ivory/14 bg-[rgba(10,15,15,0.56)] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(212,185,154,0.15), transparent 68%)" }}
            />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-ivory/48">
                  Recognition instrument
                </p>
                <p className="mt-1 font-display text-lg text-ivory">
                  Check {String(activeIndex + 1).padStart(2, "0")} of {String(shown.length).padStart(2, "0")}
                </p>
              </div>
              <p className="max-w-xs text-xs leading-relaxed text-ivory/52 sm:text-right">
                Arrow keys move through the index. Each answer updates the reading without moving the page.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Brand recognition checks"
              className={`relative mt-5 grid gap-2 ${shown.length > VISIBLE ? "grid-cols-5 sm:grid-cols-10" : "grid-cols-5"}`}
            >
              {shown.map((check, index) => {
                const selected = index === activeIndex;
                const answer = answers[index];

                return (
                  <button
                    key={check}
                    id={`recognition-check-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="recognition-check-panel"
                    aria-label={`Check ${index + 1}: ${check}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => moveTo(index)}
                    onKeyDown={(event) => handleTabKey(event, index)}
                    className="relative grid min-h-11 min-w-11 place-items-center overflow-hidden rounded-xl border text-xs font-medium transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                    style={{
                      borderColor: selected
                        ? "rgba(212,185,154,0.72)"
                        : answer === "holds"
                          ? "rgba(92,107,74,0.72)"
                          : answer === "gap"
                            ? "rgba(205,122,76,0.72)"
                            : "rgba(244,239,230,0.12)",
                      backgroundColor: selected
                        ? "rgba(212,185,154,0.14)"
                        : answer === "holds"
                          ? "rgba(92,107,74,0.14)"
                          : answer === "gap"
                            ? "rgba(205,122,76,0.12)"
                            : "rgba(244,239,230,0.025)",
                      color: selected ? "#F4EFE6" : "rgba(244,239,230,0.62)",
                    }}
                  >
                    <span className="relative">{String(index + 1).padStart(2, "0")}</span>
                    {answer && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1.5 h-1 w-1 rounded-full"
                        style={{ backgroundColor: answer === "holds" ? "#91A082" : "#CD7A4C" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <span className="relative mt-4 block h-px overflow-hidden bg-ivory/10" aria-hidden="true">
              <motion.span
                className="block h-full origin-left bg-sandstone"
                animate={{ scaleX: completion }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.48, ease: EASE }}
              />
            </span>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                id="recognition-check-panel"
                role="tabpanel"
                aria-labelledby={`recognition-check-tab-${activeIndex}`}
                data-recognition-audit-panel="true"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(3px)" }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.42, ease: EASE }}
                className="relative mt-5 flex min-h-[18rem] flex-col justify-between overflow-hidden rounded-3xl border border-ivory/12 bg-ivory/[0.035] p-5 sm:min-h-[20rem] sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-8 font-display text-[8rem] leading-none text-ivory/[0.035] sm:text-[10rem]"
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sandstone">
                    Read the signal
                  </p>
                  <p className="mt-5 max-w-2xl font-display text-[clamp(1.75rem,4vw,3.35rem)] font-normal leading-[1.03] text-ivory">
                    {currentCheck}
                  </p>
                </div>

                <div className="relative mt-8">
                  <p className="text-sm leading-relaxed text-ivory/62">
                    Does this hold true for the brand as it works today?
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2" aria-label={`Answer check ${activeIndex + 1}`}>
                    <button
                      type="button"
                      aria-pressed={currentAnswer === "holds"}
                      onClick={() => answerCurrent("holds")}
                      className={`min-h-12 rounded-2xl border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone ${
                        currentAnswer === "holds"
                          ? "border-sage/80 bg-sage/25 text-ivory"
                          : "border-ivory/14 bg-ivory/[0.025] text-ivory/72 hover:border-sage/60 hover:text-ivory"
                      }`}
                    >
                      Holds true
                    </button>
                    <button
                      type="button"
                      aria-pressed={currentAnswer === "gap"}
                      onClick={() => answerCurrent("gap")}
                      className={`min-h-12 rounded-2xl border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone ${
                        currentAnswer === "gap"
                          ? "border-terracotta/80 bg-terracotta/20 text-ivory"
                          : "border-ivory/14 bg-ivory/[0.025] text-ivory/72 hover:border-terracotta/60 hover:text-ivory"
                      }`}
                    >
                      Needs work
                    </button>
                  </div>
                  <p className="mt-3 min-h-5 text-xs text-ivory/48" aria-live="polite">
                    {currentAnswer === "holds"
                      ? "Marked as holding true."
                      : currentAnswer === "gap"
                        ? "Marked as needing work."
                        : "No answer recorded yet."}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                aria-label="Previous check"
                onClick={() => moveTo(activeIndex === 0 ? shown.length - 1 : activeIndex - 1)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/14 px-4 text-sm text-ivory/68 transition-colors duration-300 hover:border-sandstone/55 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
              >
                <span aria-hidden="true">←</span>
                Previous
              </button>
              <p className="text-center text-xs text-ivory/46">
                {answered === shown.length
                  ? "This pass is complete. You can still revise any answer."
                  : `${shown.length - answered} check${shown.length - answered === 1 ? "" : "s"} left in this pass.`}
              </p>
              <button
                type="button"
                aria-label="Next check"
                onClick={() => moveTo(activeIndex === shown.length - 1 ? 0 : activeIndex + 1)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/14 px-4 text-sm text-ivory/68 transition-colors duration-300 hover:border-sandstone/55 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
              >
                Next
                <span aria-hidden="true">→</span>
              </button>
            </div>

            {!unlocked && (
              <div className="relative mt-5 flex items-start gap-4 rounded-2xl border border-sandstone/20 bg-sandstone/[0.055] p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sandstone/35 font-display text-sm text-sandstone">
                  +5
                </span>
                <div>
                  <p className="font-display text-lg text-ivory">The second half stays in this instrument.</p>
                  <p className="mt-1 text-sm leading-relaxed text-ivory/62">
                    Complete the form to open checks six through ten without leaving this scene or losing the answers
                    already marked.
                  </p>
                </div>
              </div>
            )}

            {unlocked && (
              <p className="relative mt-5 rounded-2xl border border-ivory/12 bg-ivory/[0.035] p-4 text-sm leading-relaxed text-ivory/72">
                Fewer than seven holding true usually means recognition is leaking somewhere specific. The health
                check above narrows down where.
              </p>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AnimatePresence mode="wait" initial={false}>
            {unlocked ? (
              <motion.div
                key="thanks"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-ivory/15 bg-[rgba(244,239,230,0.05)] p-6 backdrop-blur-md sm:p-7"
              >
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sandstone">
                  Checks 06–10 unlocked
                </p>
                <p className="mt-3 font-display text-2xl font-normal text-ivory">The full audit is open.</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/80">
                  All ten checks now live inside the same index. A confirmation email is on its way to {email}, and
                  future insights follow only after you confirm.
                </p>
                <button
                  type="button"
                  onClick={() => moveTo(VISIBLE, true)}
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-sandstone/45 px-5 text-sm text-sandstone transition-colors duration-300 hover:bg-sandstone/10 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                >
                  Continue at check 06 <span aria-hidden="true">→</span>
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                className="rounded-3xl border border-ivory/15 bg-[rgba(244,239,230,0.05)] p-6 backdrop-blur-md sm:p-7"
              >
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sandstone">
                  Unlock the second half
                </p>
                <p className="mt-2 font-display text-xl font-normal text-ivory">See all ten checks</p>
                <p className="mt-2 text-sm leading-relaxed text-ivory/62">
                  The first five remain useful without a form. This opens the deeper five in place and sends the audit
                  through the existing confirmation flow.
                </p>

                <label className="mt-5 block text-xs font-medium uppercase tracking-[0.12em] text-ivory/60">
                  First name
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    autoComplete="given-name"
                    className="mt-1.5 min-h-11 w-full border-b border-ivory/25 bg-transparent pb-2 text-base normal-case tracking-normal text-ivory outline-none transition-colors focus:border-sandstone"
                  />
                </label>
                <label className="mt-5 block text-xs font-medium uppercase tracking-[0.12em] text-ivory/60">
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="mt-1.5 min-h-11 w-full border-b border-ivory/25 bg-transparent pb-2 text-base normal-case tracking-normal text-ivory outline-none transition-colors focus:border-sandstone"
                  />
                </label>
                <label className="mt-5 block text-xs font-medium uppercase tracking-[0.12em] text-ivory/60">
                  Business name, optional
                  <input
                    type="text"
                    value={business}
                    onChange={(event) => setBusiness(event.target.value)}
                    autoComplete="organization"
                    className="mt-1.5 min-h-11 w-full border-b border-ivory/25 bg-transparent pb-2 text-base normal-case tracking-normal text-ivory outline-none transition-colors focus:border-sandstone"
                  />
                </label>
                <label className="mt-6 flex min-h-11 items-start gap-3 text-sm text-ivory/80">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[#D4B99A]"
                  />
                  <span>
                    I agree to receive the audit and occasional branding insights by email. Unsubscribing takes one
                    click, any time.
                  </span>
                </label>
                {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-6 min-h-12 w-full rounded-full bg-sandstone px-6 py-3 text-sm font-medium text-soil transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {status === "submitting" ? "Opening the audit…" : "Open the full audit"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </Container>
  );
}
