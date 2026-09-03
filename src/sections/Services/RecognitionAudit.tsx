"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
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
  const [direction, setDirection] = useState(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const unlocked = status === "done";

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
  const pageStart = currentIndex >= PRIVATE_CHECK_COUNT ? PRIVATE_CHECK_COUNT : 0;
  const pageIndexes = Array.from({ length: PRIVATE_CHECK_COUNT }, (_, index) => pageStart + index);
  const scoreGuidance =
    markedCount === 0 && answeredCount > 0
      ? "Recognition is still relying on isolated cues."
      : recognitionAuditGuidance(markedCount, scoreTotal);

  function publish(nextAnswers: (boolean | null)[], total = scoreTotal) {
    const score = nextAnswers.slice(0, total).filter((answer) => answer === true).length;
    publishServicesRecognitionAudit(score, total);
  }

  function goToQuestion(nextIndex: number, focusTab = false) {
    const upperBound = unlocked ? CHECKS.length - 1 : PRIVATE_CHECK_COUNT - 1;
    const safeIndex = Math.min(Math.max(nextIndex, 0), upperBound);
    setDirection(safeIndex >= currentIndex ? 1 : -1);
    setCurrentIndex(safeIndex);
    setView("question");
    setNotice(null);
    if (focusTab) {
      requestAnimationFrame(() => tabRefs.current[safeIndex % PRIVATE_CHECK_COUNT]?.focus());
    }
  }

  function answerCurrent(holds: boolean) {
    const next = [...answers];
    next[currentIndex] = holds;
    setAnswers(next);
    setNotice(null);
    publish(next);

    const finalIndex = unlocked ? CHECKS.length - 1 : PRIVATE_CHECK_COUNT - 1;
    if (currentIndex < finalIndex) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
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
      const firstUnanswered = answers.slice(0, PRIVATE_CHECK_COUNT).findIndex((answer) => answer === null);
      setNotice(
        `${PRIVATE_CHECK_COUNT - privateAnswerCount} private ${PRIVATE_CHECK_COUNT - privateAnswerCount === 1 ? "answer remains" : "answers remain"}.`,
      );
      goToQuestion(Math.max(firstUnanswered, 0));
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
        setError(data.error ?? "The audit request did not reach the mailing list. Please send it once more.");
        setStatus("error");
        return;
      }

      track("lead_magnet_requested");
      setStatus("done");
      setView("question");
      setDirection(1);
      setCurrentIndex(PRIVATE_CHECK_COUNT);
      publish(answers, CHECKS.length);
    } catch {
      setError("The audit form cannot reach the server. Check the connection, then send again.");
      setStatus("error");
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch" || !stageRef.current) return;
    const bounds = stageRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stageRef.current.style.setProperty("--field-x", `${(x * 5).toFixed(2)}px`);
    stageRef.current.style.setProperty("--field-y", `${(y * 4).toFixed(2)}px`);
  }

  function settlePointer() {
    stageRef.current?.style.setProperty("--field-x", "0px");
    stageRef.current?.style.setProperty("--field-y", "0px");
  }

  const questionTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: motionTokens.durationFast, ease: motionTokens.easeOrganic };

  return (
    <div
      ref={stageRef}
      data-recognition-audit-desk="true"
      data-section-jump-yield="true"
      className={styles.stage}
      onPointerMove={handlePointerMove}
      onPointerLeave={settlePointer}
      style={{ "--audit-progress": `${(markedCount / scoreTotal) * 100}%` } as CSSProperties}
    >
      <Image
        src="/images/generated/bt-services-recognition-field-notes.webp"
        alt=""
        fill
        sizes="(max-width: 899px) 100vw, 96rem"
        loading="eager"
        className={styles.stageImage}
        aria-hidden="true"
      />

      <p className={styles.chapterTab}>Brand recognition check</p>

      <header className={styles.intro}>
        <h2>Ten questions that expose where the brand loses recognition.</h2>
        <p>Mark what is true today.</p>
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
                key={`question-${currentIndex}`}
                className={styles.questionView}
                data-copy-density={CHECKS[currentIndex].length > 78 ? "compact" : "standard"}
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: direction * 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, x: direction * -14 }}
                transition={questionTransition}
              >
                <div className={styles.paperEyebrow}>
                  <span>{unlocked && currentIndex >= PRIVATE_CHECK_COUNT ? "Complete check" : "Question"}</span>
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

                <p className={styles.questionNumber}>{numberLabel(currentIndex)}</p>
                <h3>{CHECKS[currentIndex]}</h3>

                <div className={styles.answerStatus} role="status" aria-live="polite">
                  {answers[currentIndex] === true && (
                    <span>
                      <Check aria-hidden="true" /> This already holds
                    </span>
                  )}
                  {answers[currentIndex] === false && <span>Marked for attention</span>}
                  {answers[currentIndex] === null && <span>Choose what is true today</span>}
                </div>

                <div className={styles.questionActions}>
                  <button
                    type="button"
                    className={styles.holdsButton}
                    aria-pressed={answers[currentIndex] === true}
                    onClick={() => answerCurrent(true)}
                  >
                    This already holds
                    <ArrowRight aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={styles.notYetButton}
                    aria-pressed={answers[currentIndex] === false}
                    onClick={() => answerCurrent(false)}
                  >
                    Not yet
                  </button>
                </div>
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
                onClick={() => goToQuestion(checkIndex)}
                onKeyDown={(event) => handleTabKey(event, visibleIndex)}
                disabled={view === "handoff"}
                aria-label={`Question ${checkIndex + 1}${answer === true ? ", already holds" : answer === false ? ", marked for attention" : ""}`}
              >
                {answer === true ? <Check aria-hidden="true" /> : numberLabel(checkIndex)}
              </button>
            );
          })}
        </div>

        <aside className={styles.signal} aria-label={`${markedCount} of ${scoreTotal} recognition answers hold`}>
          <div className={styles.dialReadout} aria-hidden="true">
            <strong>{markedCount}</strong>
            <span>of {scoreTotal}</span>
          </div>
          <div className={styles.signalCopy}>
            <p>Recognition signal</p>
            <span>{scoreGuidance}</span>
          </div>
        </aside>

        <div className={styles.railAction}>
          {!unlocked ? (
            <button type="button" onClick={openUnlock} data-ready={privateComplete ? "true" : "false"}>
              <span>
                Continue to all ten questions
                <small>{privateAnswerCount} of 5 answered</small>
              </span>
              <ArrowRight aria-hidden="true" />
            </button>
          ) : (
            <a
              href="#book"
              data-recognition-audit-handoff="true"
              onClick={() => publishServicesRecognitionAudit(markedCount, CHECKS.length)}
            >
              <span>Bring this result to the Strategy Room</span>
              <ArrowRight aria-hidden="true" />
            </a>
          )}
          {notice && (
            <p role="status" aria-live="polite">
              {notice}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
