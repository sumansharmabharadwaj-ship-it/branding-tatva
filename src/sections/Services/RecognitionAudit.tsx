"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleDot, LockKeyhole } from "lucide-react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import { motionTokens } from "@/lib/motionTokens";
import { publishServicesRecognitionAudit, recognitionAuditGuidance } from "@/lib/servicesJourney";
import styles from "./RecognitionAudit.module.css";

const CHECKS = [
  "Everyone who explains the business uses the same sentence.",
  "The category you compete in was chosen deliberately before the tagline was written.",
  "A stranger could identify your brand with the logo covered.",
  "Colour, type, image direction, and voice repeat across every channel.",
  "Buyers mention the brand without prompting when they describe the category.",
  "Your pricing signals the position you claim.",
  "Every piece of content reads like the same person wrote it.",
  "You could list your three most distinctive assets from memory.",
  "The last five things you published repeated the same position.",
  "Someone who saw the brand six months ago would recognise it today.",
] as const;

const PRIVATE_CHECK_COUNT = 5;
const EMPTY_ANSWERS = Array.from({ length: CHECKS.length }, () => null as boolean | null);

type Status = "idle" | "submitting" | "done" | "error";
type AuditView = "question" | "handoff";

function numberLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function RecognitionAudit() {
  const [status, setStatus] = useState<Status>("idle");
  const [view, setView] = useState<AuditView>("question");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState<(boolean | null)[]>(EMPTY_ANSWERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const focusQuestionRef = useRef(false);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const unlocked = status === "done";

  const setQuestionHeadingRef = useCallback((node: HTMLHeadingElement | null) => {
    questionHeadingRef.current = node;
    if (node && focusQuestionRef.current) {
      focusQuestionRef.current = false;
      node.focus({ preventScroll: true });
    }
  }, []);

  const setFormHeadingRef = useCallback(
    (node: HTMLHeadingElement | null) => {
      formHeadingRef.current = node;
      if (node && view === "handoff") {
        requestAnimationFrame(() => node.focus({ preventScroll: true }));
      }
    },
    [view],
  );

  const scoreTotal = unlocked ? CHECKS.length : PRIVATE_CHECK_COUNT;
  const markedCount = answers.slice(0, scoreTotal).filter((answer) => answer === true).length;
  const privateAnswerCount = answers
    .slice(0, PRIVATE_CHECK_COUNT)
    .filter((answer) => answer !== null).length;
  const answeredCount = answers.slice(0, scoreTotal).filter((answer) => answer !== null).length;
  const privateComplete = privateAnswerCount === PRIVATE_CHECK_COUNT;
  const complete = answeredCount === scoreTotal;
  const pageStart = currentIndex >= PRIVATE_CHECK_COUNT ? PRIVATE_CHECK_COUNT : 0;
  const pageIndexes = Array.from({ length: PRIVATE_CHECK_COUNT }, (_, index) => pageStart + index);
  const scoreGuidance = !complete
    ? "Answer each question, then review which cues hold."
    : recognitionAuditGuidance(markedCount, scoreTotal);

  function publish(nextAnswers: (boolean | null)[], total = scoreTotal) {
    const relevantAnswers = nextAnswers.slice(0, total);
    // An unfinished check is progress, not a recognition result.
    if (relevantAnswers.some((answer) => answer === null)) return;
    const score = relevantAnswers.filter((answer) => answer === true).length;
    publishServicesRecognitionAudit(score, total);
  }

  function goToQuestion(nextIndex: number, focusTab = false) {
    const upperBound = unlocked ? CHECKS.length - 1 : PRIVATE_CHECK_COUNT - 1;
    const safeIndex = Math.min(Math.max(nextIndex, 0), upperBound);
    focusQuestionRef.current = !focusTab;
    setCurrentIndex(safeIndex);
    setView("question");
    setNotice(null);
    requestAnimationFrame(() => {
      if (focusTab) {
        tabRefs.current[safeIndex % PRIVATE_CHECK_COUNT]?.focus({ preventScroll: true });
      } else if (focusQuestionRef.current && questionHeadingRef.current) {
        focusQuestionRef.current = false;
        questionHeadingRef.current.focus({ preventScroll: true });
      }
    });
  }

  function answerCurrent(holds: boolean) {
    const next = [...answers];
    next[currentIndex] = holds;
    setAnswers(next);
    setNotice(null);
    publish(next);
  }

  function finishAnswers() {
    const firstUnanswered = answers.slice(0, scoreTotal).findIndex((answer) => answer === null);
    if (firstUnanswered < 0) return;
    goToQuestion(firstUnanswered);
    const remaining = scoreTotal - answeredCount;
    setNotice(`${remaining} ${remaining === 1 ? "answer remains" : "answers remain"}. Choose an answer below.`);
  }

  function continueCheck() {
    if (currentIndex < scoreTotal - 1) goToQuestion(currentIndex + 1);
    else if (!complete) finishAnswers();
    else openUnlock();
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, visibleIndex: number) {
    let nextVisibleIndex: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextVisibleIndex = visibleIndex + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextVisibleIndex = visibleIndex - 1;
        break;
      case "Home":
        nextVisibleIndex = 0;
        break;
      case "End":
        nextVisibleIndex = pageIndexes.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const wrappedIndex = (nextVisibleIndex + pageIndexes.length) % pageIndexes.length;
    goToQuestion(pageIndexes[wrappedIndex], true);
  }

  function openUnlock() {
    if (!privateComplete) {
      finishAnswers();
      return;
    }
    setError(null);
    setView("handoff");
  }

  async function submit(event: React.FormEvent) {
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
        setError(data.error ?? "The audit request never reached the mailing list. Please send it once more.");
        setStatus("error");
        return;
      }

      track("lead_magnet_requested");
      setStatus("done");
      setView("question");
      focusQuestionRef.current = true;
      setCurrentIndex(PRIVATE_CHECK_COUNT);
    } catch {
      setError("The audit form cannot reach the server. Check the connection, then send again.");
      setStatus("error");
    }
  }

  const questionTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: motionTokens.durationFast, ease: motionTokens.easeOrganic };

  return (
    <div
      data-recognition-audit-desk="true"
      data-section-jump-yield="true"
      className={styles.stage}
    >
      <Image
        src="/images/generated/bt-services-recognition-field-notes.webp"
        alt=""
        fill
        sizes="(max-width: 899px) 100vw, 96rem"
        loading="lazy"
        className={styles.stageImage}
        aria-hidden="true"
      />

      <p className={styles.chapterTab}>Brand recognition check</p>

      <header className={styles.intro}>
        <h2>Ten questions that expose where the brand loses recognition.</h2>
        <p>Choose an answer, then continue. Each answer stays editable.</p>
      </header>

      <aside className={styles.privacyNote} aria-label="Private first pass">
        <span className={styles.privacyTitle}>
          <LockKeyhole aria-hidden="true" />
          First five questions are private
        </span>
        <p>
          Answer the first five without sharing contact details. The remaining five appear only after you request the
          complete check.
        </p>
      </aside>

      <section className={styles.folio} aria-label="Brand recognition field notes">
        <div
          className={styles.paper}
          id="recognition-audit-question-panel"
          role="tabpanel"
          aria-label={view === "handoff" ? "Request the complete recognition check" : `Question ${currentIndex + 1}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {view === "handoff" && !unlocked ? (
              <motion.form
                key="handoff"
                className={styles.unlockForm}
                onSubmit={submit}
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, x: -12 }}
                transition={questionTransition}
              >
                <div className={styles.paperEyebrow}>
                  <span>Private handoff</span>
                  <button type="button" onClick={() => goToQuestion(PRIVATE_CHECK_COUNT - 1)}>
                    <ArrowLeft aria-hidden="true" />
                    Back to question five
                  </button>
                </div>
                <div className={styles.formIntro}>
                  <p className={styles.questionNumber}>Your complete check</p>
                  <h3 ref={setFormHeadingRef} tabIndex={-1}>
                    Keep all ten questions in one field note.
                  </h3>
                  <p>Email arrives only after you confirm your address.</p>
                </div>

                <div className={styles.fields}>
                  <label>
                    <span>First name</span>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      autoComplete="given-name"
                    />
                  </label>
                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                    />
                  </label>
                  <label className={styles.businessField}>
                    <span>Business name, optional</span>
                    <input
                      type="text"
                      value={business}
                      onChange={(event) => setBusiness(event.target.value)}
                      autoComplete="organization"
                    />
                  </label>
                </div>

                <label className={styles.consentField}>
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                  />
                  <span>I agree to receive the audit and occasional branding insights by email.</span>
                </label>

                {error && (
                  <p className={styles.formError} role="status" aria-live="polite">
                    {error}
                  </p>
                )}

                <button className={styles.submitButton} type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Opening your field note" : "Open the complete check"}
                  <ArrowRight aria-hidden="true" />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="question"
                className={styles.questionView}
                data-copy-density={CHECKS[currentIndex].length > 78 ? "compact" : "standard"}
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={questionTransition}
              >
                <div className={styles.paperEyebrow}>
                  <span>{answeredCount} of {scoreTotal} answered</span>
                  {unlocked && (
                    <button
                      type="button"
                      onClick={() => goToQuestion(currentIndex >= PRIVATE_CHECK_COUNT ? 0 : PRIVATE_CHECK_COUNT)}
                    >
                      {currentIndex >= PRIVATE_CHECK_COUNT ? "Review private five" : "Open questions six to ten"}
                      <ArrowRight aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className={styles.answerProgress} aria-hidden="true">
                  <motion.span
                    initial={false}
                    animate={{ scaleX: answeredCount / scoreTotal }}
                    transition={questionTransition}
                  />
                </div>
                <p className={styles.questionNumber}>Question {numberLabel(currentIndex)}</p>
                <motion.h3
                  key={currentIndex}
                  ref={setQuestionHeadingRef}
                  tabIndex={-1}
                  initial={prefersReducedMotion ? undefined : { opacity: 0.65, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={questionTransition}
                >
                  {CHECKS[currentIndex]}
                </motion.h3>

                <div className={styles.answerStatus} role="status" aria-live="polite">
                  {notice ? <span>{notice}</span> : answers[currentIndex] === true ? (
                    <span>
                      <Check aria-hidden="true" /> This already holds
                    </span>
                  ) : answers[currentIndex] === false ? (
                    <span><CircleDot aria-hidden="true" /> Marked for attention</span>
                  ) : <span>Choose what is true today</span>}
                </div>

                <div className={styles.questionActions}>
                  <button
                    type="button"
                    className={styles.holdsButton}
                    aria-pressed={answers[currentIndex] === true}
                    onClick={() => answerCurrent(true)}
                  >
                    <Check aria-hidden="true" />
                    Already holds
                  </button>
                  <button
                    type="button"
                    className={styles.attentionButton}
                    aria-pressed={answers[currentIndex] === false}
                    onClick={() => answerCurrent(false)}
                  >
                    <CircleDot aria-hidden="true" />
                    Needs attention
                  </button>
                </div>
                <nav className={styles.questionNavigation} aria-label="Move through recognition questions">
                  <button type="button" onClick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0}>
                    <ArrowLeft aria-hidden="true" /> Previous
                  </button>
                  {unlocked && complete && currentIndex === scoreTotal - 1 ? (
                    <a href="#book" onClick={() => publish(answers)}>
                      Discuss result <ArrowRight aria-hidden="true" />
                    </a>
                  ) : (
                    <button type="button" onClick={continueCheck} disabled={answers[currentIndex] === null}>
                      {currentIndex < scoreTotal - 1 ? "Next question" : complete ? "Continue check" : "Finish answers"}
                      <ArrowRight aria-hidden="true" />
                    </button>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Recognition questions">
          {pageIndexes.map((checkIndex, visibleIndex) => {
            const active = view === "question" && currentIndex === checkIndex;
            const answer = answers[checkIndex];
            return (
              <button
                key={checkIndex}
                ref={(node) => {
                  tabRefs.current[visibleIndex] = node;
                }}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="recognition-audit-question-panel"
                tabIndex={active ? 0 : -1}
                className={styles.questionTab}
                data-active={active ? "true" : "false"}
                data-answered={answer !== null ? "true" : "false"}
                onClick={() => goToQuestion(checkIndex, true)}
                onKeyDown={(event) => handleTabKey(event, visibleIndex)}
                disabled={view === "handoff"}
                aria-label={`Question ${checkIndex + 1}${answer === true ? ", already holds" : answer === false ? ", marked for attention" : ""}`}
              >
                <span>{numberLabel(checkIndex)}</span>
                {answer === true ? <Check className={styles.tabAnswer} aria-hidden="true" /> : answer === false ? <CircleDot className={styles.tabAnswer} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        <aside className={styles.signal} aria-label={complete ? `${markedCount} of ${scoreTotal} recognition answers hold` : `${answeredCount} of ${scoreTotal} questions answered`}>
          <div className={styles.dialReadout} aria-hidden="true">
            <svg className={styles.dialProgress} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" />
              <motion.circle
                cx="50" cy="50" r="46" pathLength="1"
                strokeDasharray="1"
                initial={false}
                animate={{ strokeDashoffset: 1 - answeredCount / scoreTotal }}
                transition={questionTransition}
              />
            </svg>
            <strong>{complete ? markedCount : answeredCount}</strong>
            <span>of {scoreTotal}</span>
          </div>
          <div className={styles.signalCopy}>
            <p>{complete ? "Cues that hold" : "Questions answered"}</p>
            <span>{scoreGuidance}</span>
          </div>
        </aside>

        <div className={styles.railAction}>
          {!unlocked ? (
            <button type="button" onClick={openUnlock} data-ready={privateComplete ? "true" : "false"}>
              <span>
                {privateComplete ? "Continue to all ten questions" : "Finish the private five"}
                <small>{privateComplete ? "First five complete" : `${privateAnswerCount} of 5 answered`}</small>
              </span>
              <ArrowRight aria-hidden="true" />
            </button>
          ) : complete ? (
            <a
              href="#book"
              data-recognition-audit-handoff="true"
              onClick={() => publish(answers)}
            >
              <span>Bring this result to the Strategy Room</span>
              <ArrowRight aria-hidden="true" />
            </a>
          ) : (
            <button type="button" onClick={finishAnswers}>
              <span>Finish your check<small>{answeredCount} of 10 answered</small></span>
              <ArrowRight aria-hidden="true" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
