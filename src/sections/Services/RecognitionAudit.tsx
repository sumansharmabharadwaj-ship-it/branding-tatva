"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";

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

const PUBLIC_CHECKS = 5;
const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "submitting" | "done" | "error";
type Answer = "holds" | "gap" | null;

export function RecognitionAudit() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
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

  const unlocked = status === "done";
  const visibleChecks: readonly string[] = unlocked ? CHECKS : CHECKS.slice(0, PUBLIC_CHECKS);
  const currentCheck = visibleChecks[activeIndex] ?? visibleChecks[0];
  const currentAnswer = answers[activeIndex] ?? null;
  const answered = visibleChecks.reduce(
    (total, _check, index) => total + (answers[index] ? 1 : 0),
    0,
  );
  const holding = visibleChecks.reduce(
    (total, _check, index) => total + (answers[index] === "holds" ? 1 : 0),
    0,
  );
  const completion = visibleChecks.length ? answered / visibleChecks.length : 0;

  useEffect(() => {
    const section = rootRef.current?.closest("section");
    const header = document.querySelector<HTMLElement>("header");
    if (!section || !header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        header.dataset.servicesAuditActive =
          entry.isIntersecting && entry.intersectionRatio >= 0.12 ? "true" : "false";
      },
      { threshold: [0, 0.12, 0.35], rootMargin: "-6% 0px -18% 0px" },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      delete header.dataset.servicesAuditActive;
    };
  }, []);

  function focusTab(index: number) {
    window.requestAnimationFrame(() => {
      document.getElementById(`recognition-check-tab-${index}`)?.focus();
    });
  }

  function moveTo(index: number, focus = false) {
    const safeIndex = Math.max(0, Math.min(index, visibleChecks.length - 1));
    setActiveIndex(safeIndex);
    if (focus) focusTab(safeIndex);
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % visibleChecks.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + visibleChecks.length) % visibleChecks.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = visibleChecks.length - 1;
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
      setActiveIndex(PUBLIC_CHECKS);
    } catch {
      setError("The server was unreachable. Check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 760px) {
          header[data-services-audit-active="true"]:not(:has([aria-expanded="true"])) {
            transform: translateY(calc(-100% - 1.5rem)) !important;
            pointer-events: none;
          }
        }
      `}</style>
      <Container className="max-w-6xl">
        <div
          ref={rootRef}
          className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,23rem)] lg:items-start lg:gap-10 xl:gap-14"
        >
          <div className="min-w-0">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">
                The Brand Recognition Audit
              </p>
              <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
                Ten checks that tell you where recognition stands today.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-ivory/85">
                Consider one signal at a time. The first five are open to anyone; the second five join the same
                instrument after the form is complete.
              </p>
            </div>

            <div
              data-recognition-audit-deck="true"
              className="relative mt-6 overflow-hidden rounded-[2rem] border border-ivory/14 bg-[rgba(10,15,15,0.56)] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-5"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(212,185,154,0.15), transparent 68%)" }}
              />

              <div className="relative grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-5">
                <div>
                  <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-ivory/48">
                    Recognition instrument
                  </p>
                  <p className="mt-1 font-display text-lg text-ivory">
                    Check {String(activeIndex + 1).padStart(2, "0")} of {String(visibleChecks.length).padStart(2, "0")}
                  </p>
                </div>
                <p className="hidden max-w-xs justify-self-end text-xs leading-relaxed text-ivory/52 sm:block sm:text-right">
                  Arrow keys move through the index. Each answer updates the reading in place.
                </p>
                <div
                  data-recognition-score="true"
                  aria-live="polite"
                  className="flex items-end justify-between rounded-xl border border-ivory/10 bg-black/15 px-3 py-2 sm:block sm:min-w-24 sm:text-right"
                >
                  <p className="text-[0.52rem] font-medium uppercase tracking-[0.15em] text-ivory/42">
                    Reading
                  </p>
                  <p className="font-display text-xl text-ivory">
                    {holding} / {visibleChecks.length}
                  </p>
                  <p className="text-[0.6rem] text-ivory/48">{answered} considered</p>
                </div>
              </div>

              <ol
                role="tablist"
                aria-label="Brand recognition checks"
                className={`relative mt-4 grid gap-2 ${
                  visibleChecks.length > PUBLIC_CHECKS ? "grid-cols-5 sm:grid-cols-10" : "grid-cols-5"
                }`}
              >
                {visibleChecks.map((check, index) => {
                  const selected = index === activeIndex;
                  const answer = answers[index];
                  const borderColor = selected
                    ? "rgba(212,185,154,0.72)"
                    : answer === "holds"
                      ? "rgba(92,107,74,0.72)"
                      : answer === "gap"
                        ? "rgba(205,122,76,0.72)"
                        : "rgba(244,239,230,0.12)";
                  const backgroundColor = selected
                    ? "rgba(212,185,154,0.14)"
                    : answer === "holds"
                      ? "rgba(92,107,74,0.14)"
                      : answer === "gap"
                        ? "rgba(205,122,76,0.12)"
                        : "rgba(244,239,230,0.025)";

                  return (
                    <li key={check} className="contents">
                      <button
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
                          borderColor,
                          backgroundColor,
                          color: selected ? "#F4EFE6" : "rgba(244,239,230,0.62)",
                        }}
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {answer && (
                          <span
                            aria-hidden="true"
                            className="absolute bottom-1.5 h-1 w-1 rounded-full"
                            style={{ backgroundColor: answer === "holds" ? "#91A082" : "#CD7A4C" }}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>

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
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -7, filter: "blur(3px)" }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.38, ease: EASE }}
                  className="relative mt-4 flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-3xl border border-ivory/12 bg-ivory/[0.035] p-5 sm:min-h-[17rem] sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-8 font-display text-[7rem] leading-none text-ivory/[0.035] sm:text-[9rem]"
                  >
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>

                  <div className="relative">
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sandstone">
                      Read the signal
                    </p>
                    <p className="mt-4 max-w-2xl font-display text-[clamp(1.72rem,3.35vw,2.85rem)] font-normal leading-[1.02] text-ivory">
                      {currentCheck}
                    </p>
                  </div>

                  <div className="relative mt-6">
                    <p className="text-sm leading-relaxed text-ivory/62">
                      Does this hold true for the brand as it works today?
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2" aria-label={`Answer check ${activeIndex + 1}`}>
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
                    <p className="mt-2 min-h-5 text-xs text-ivory/48" aria-live="polite">
                      {currentAnswer === "holds"
                        ? "Marked as holding true."
                        : currentAnswer === "gap"
                          ? "Marked as needing work."
                          : "No answer recorded yet."}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="relative mt-3 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  aria-label="Previous check"
                  onClick={() => moveTo(activeIndex === 0 ? visibleChecks.length - 1 : activeIndex - 1)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/14 px-4 text-sm text-ivory/68 transition-colors duration-300 hover:border-sandstone/55 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                >
                  <span aria-hidden="true">←</span> Previous
                </button>
                <p className="text-center text-xs text-ivory/46">
                  {answered === visibleChecks.length
                    ? "Pass complete. Every answer remains editable."
                    : `${visibleChecks.length - answered} check${visibleChecks.length - answered === 1 ? "" : "s"} left.`}
                </p>
                <button
                  type="button"
                  aria-label="Next check"
                  onClick={() => moveTo(activeIndex === visibleChecks.length - 1 ? 0 : activeIndex + 1)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/14 px-4 text-sm text-ivory/68 transition-colors duration-300 hover:border-sandstone/55 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                >
                  Next <span aria-hidden="true">→</span>
                </button>
              </div>

              {!unlocked && (
                <p className="relative mt-3 border-t border-ivory/10 pt-3 text-xs leading-relaxed text-ivory/48">
                  Checks 06–10 open from the form attached to this instrument. Answers already marked stay in place.
                </p>
              )}
              {unlocked && (
                <p className="relative mt-3 border-t border-ivory/10 pt-3 text-xs leading-relaxed text-ivory/58">
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
                    onClick={() => moveTo(PUBLIC_CHECKS, true)}
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
    </>
  );
}
