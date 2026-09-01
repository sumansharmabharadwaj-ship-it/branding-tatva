"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  FileText,
  Globe2,
  MessageCircle,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { TrackedLink } from "@/components/TrackedLink";
import { consultation, site } from "@/data/site";
import {
  HOME_QUESTION_CHOICE_EVENT,
  readHomeQuestionChoice,
  type HomeQuestionChoice,
  type HomeQuestionChoiceDetail,
} from "@/lib/homeQuestionJourney";
import {
  HOME_STUDIO_LENS_EVENT,
  readHomeStudioLens,
  type HomeStudioLens,
  type HomeStudioLensDetail,
} from "@/lib/homeStudioJourney";
import {
  SERVICES_SITUATION_CLEARED_EVENT,
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  calendlyHrefForServicesPackage,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  servicesContactHrefForSituation,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

type Situation = ServicesSituationId | "default";

type Invitation = {
  eyebrow: string;
  headline: string;
  body: string;
  thanks: string;
  callClose: string;
  accent: string;
};

const INVITATIONS: Record<Situation, Invitation> = {
  default: {
    eyebrow: "Begin with the question you cannot settle alone",
    headline: "Bring the brand problem that keeps returning.",
    body:
      "The thirty minute call separates the visible symptom from the brand decision underneath it.",
    thanks: "Thank you for giving the problem your attention before spending money on the wrong answer.",
    callClose: "You leave with the clearest decision to make first, without being pushed into a larger scope.",
    accent: "#95622D",
  },
  idea: {
    eyebrow: "Your situation · the offer exists before the brand",
    headline: "Give the idea a position the market can recognise.",
    body:
      "Bring the category or buyer question. The call tests what must be decided before naming, identity, or launch work begins.",
    thanks: "Thank you for staying with the idea long enough to ask what it truly needs.",
    callClose: "You leave knowing whether positioning, audience, or the first expression system should come first.",
    accent: "#A34F35",
  },
  reposition: {
    eyebrow: "Your situation · the business outgrew the brand",
    headline: "Find which meaning no longer fits the business.",
    body:
      "Bring the contradiction buyers keep encountering. The call tests whether the position, message, identity, or consistency should change first.",
    thanks: "Thank you for looking at the mismatch before covering it with new design.",
    callClose: "You leave knowing which contradiction to resolve before changing more of the brand.",
    accent: "#66724D",
  },
  ongoing: {
    eyebrow: "Your situation · every channel is becoming its own brand",
    headline: "Stop returning every brand choice to the founder.",
    body:
      "Bring the channel or campaign that needs the most correction. The call looks for the first written rule that would reduce the rework.",
    thanks: "Thank you for caring about the pattern, not only the next campaign.",
    callClose: "You leave knowing which shared rule should steady the next channel or campaign.",
    accent: "#9B681D",
  },
};

function readSituation(): Situation {
  try {
    const completedDiagnosis = readCompletedHomeDiagnosis();
    if (isServicesSituation(completedDiagnosis)) return completedDiagnosis;
    const chosenPath = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
    if (isServicesSituation(chosenPath)) return chosenPath;
  } catch {}
  return "default";
}

export function FinalInvitation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bookingCtaBoundsRef = useRef<DOMRect | null>(null);
  const bookingCtaFrameRef = useRef<number | null>(null);
  const bookingCtaMotionRef = useRef<{
    target: HTMLAnchorElement;
    x: number;
    y: number;
  } | null>(null);
  const [situation, setSituation] = useState<Situation>("default");
  const [questionChoice, setQuestionChoice] = useState<HomeQuestionChoice | null>(null);
  const [studioLens, setStudioLens] = useState<HomeStudioLens | null>(null);
  const [committedCallStep, setCommittedCallStep] = useState(0);
  const [previewCallStep, setPreviewCallStep] = useState<number | null>(null);
  const inView = useInView(rootRef, { amount: 0.28 });
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const activeCallStep = previewCallStep ?? committedCallStep;

  useEffect(() => {
    if (!inView) return;
    setSituation(readSituation());
  }, [inView]);

  useEffect(() => {
    setQuestionChoice(readHomeQuestionChoice());
    setStudioLens(readHomeStudioLens());

    function resetCallStepThread() {
      setCommittedCallStep(0);
      setPreviewCallStep(null);
    }

    function sync() {
      setSituation(readSituation());
    }

    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id === "invitation") sync();
    }

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      if (
        (
          detail?.origin === "home_diagnostic" ||
          detail?.origin === "home_evidence" ||
          detail?.origin === "home_paths"
        ) &&
        isServicesSituation(detail.situation)
      ) {
        setSituation(detail.situation);
        setQuestionChoice(null);
        setStudioLens(null);
        resetCallStepThread();
      }
    }

    function onSituationCleared() {
      setSituation("default");
      setQuestionChoice(null);
      setStudioLens(null);
      resetCallStepThread();
    }

    function onQuestionChoice(event: Event) {
      const detail = (event as CustomEvent<HomeQuestionChoiceDetail>).detail;
      setQuestionChoice(detail?.choice ?? null);
      resetCallStepThread();
    }

    function onStudioLens(event: Event) {
      const detail = (event as CustomEvent<HomeStudioLensDetail>).detail;
      setStudioLens(detail?.lens ?? null);
      resetCallStepThread();
    }

    window.addEventListener("storage", sync);
    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    window.addEventListener(SERVICES_SITUATION_CLEARED_EVENT, onSituationCleared);
    window.addEventListener(HOME_QUESTION_CHOICE_EVENT, onQuestionChoice as EventListener);
    window.addEventListener(HOME_STUDIO_LENS_EVENT, onStudioLens as EventListener);
    window.addEventListener("bt:situation", sync as EventListener);
    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
      window.removeEventListener(SERVICES_SITUATION_CLEARED_EVENT, onSituationCleared);
      window.removeEventListener(HOME_QUESTION_CHOICE_EVENT, onQuestionChoice as EventListener);
      window.removeEventListener(HOME_STUDIO_LENS_EVENT, onStudioLens as EventListener);
      window.removeEventListener("bt:situation", sync as EventListener);
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
      if (bookingCtaFrameRef.current !== null) {
        window.cancelAnimationFrame(bookingCtaFrameRef.current);
      }
    };
  }, []);

  const invitation = INVITATIONS[situation];
  const carriedLens = questionChoice?.lens ?? studioLens;
  const selectedSituation = situation === "default" ? null : situation;
  const selectedPackage = selectedSituation ? SITUATION_TO_PACKAGE[selectedSituation] : null;
  const bookingHref = calendlyHrefForServicesPackage(`${site.calendlyUrl}/30min`, selectedPackage);
  const writeHref = servicesContactHrefForSituation(selectedSituation, "write");
  const conversationSteps = [
    questionChoice
      ? `You begin with the exact question carried from the page: ${questionChoice.question}`
      : consultation.fullSteps[0],
    carriedLens
      ? `The ${carriedLens.name.toLowerCase()} lens tests one thing: ${carriedLens.question}`
      : consultation.fullSteps[1],
    invitation.callClose,
  ] as const;

  function chooseCallStep(index: number, persist = true) {
    if (!persist) {
      setPreviewCallStep(index);
      return;
    }
    setCommittedCallStep(index);
    setPreviewCallStep(null);
  }

  function onCallStepKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % consultation.steps.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index + consultation.steps.length - 1) % consultation.steps.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = consultation.steps.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    chooseCallStep(next);
    document.getElementById(`final-invitation-step-${next}`)?.focus();
  }

  function clearBookingCtaMotion(target: HTMLElement) {
    bookingCtaBoundsRef.current = null;
    bookingCtaMotionRef.current = null;
    if (bookingCtaFrameRef.current !== null) {
      window.cancelAnimationFrame(bookingCtaFrameRef.current);
      bookingCtaFrameRef.current = null;
    }
    target.style.removeProperty("--invitation-cta-x");
    target.style.removeProperty("--invitation-cta-y");
  }

  function onBookingCtaPointerEnter(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || prefersReducedMotion) return;
    bookingCtaBoundsRef.current = event.currentTarget.getBoundingClientRect();
  }

  function onBookingCtaPointerMove(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || prefersReducedMotion) return;
    const target = event.currentTarget;
    const bounds = bookingCtaBoundsRef.current ?? target.getBoundingClientRect();
    bookingCtaBoundsRef.current = bounds;
    if (!bounds.width || !bounds.height) return;
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
    bookingCtaMotionRef.current = { target, x, y };
    if (bookingCtaFrameRef.current !== null) return;
    bookingCtaFrameRef.current = window.requestAnimationFrame(() => {
      bookingCtaFrameRef.current = null;
      const motion = bookingCtaMotionRef.current;
      if (!motion) return;
      motion.target.style.setProperty("--invitation-cta-x", `${motion.x.toFixed(2)}px`);
      motion.target.style.setProperty("--invitation-cta-y", `${motion.y.toFixed(2)}px`);
    });
  }

  return (
    <div
      ref={rootRef}
      data-invitation-situation={situation}
      data-invitation-lens={carriedLens?.name.toLowerCase()}
      data-media-id="BT-HOME-INVITATION-SUMMIT-FIRST-LIGHT-V1"
      className="final-invitation"
      style={{
        "--invitation-accent": invitation.accent,
        "--invitation-lens-accent": carriedLens?.accent ?? invitation.accent,
      } as CSSProperties}
    >
      <motion.div
        className="final-invitation__frame"
        initial={false}
        animate={{
          opacity: prefersReducedMotion || inView ? 1 : 0.92,
          y: prefersReducedMotion || inView ? 0 : 10,
          scale: prefersReducedMotion || inView ? 1 : 0.994,
          filter: prefersReducedMotion || inView ? "blur(0px)" : "blur(2px)",
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="final-invitation__topline">
          <span>09 · Begin</span>
          <span>
            {questionChoice
              ? `${questionChoice.label} question carried`
              : carriedLens
                ? `${carriedLens.name} lens carried`
                : "One quiet conversation"}
          </span>
        </div>

        <div className="final-invitation__composition">
          <div className="final-invitation__copy" data-home-reading-plane>
            <p className="final-invitation__eyebrow">{invitation.eyebrow}</p>
            <h2 className="final-invitation__headline">{invitation.headline}</h2>
            <p className="final-invitation__body">{invitation.body}</p>

            <AnimatePresence mode="sync" initial={false}>
              {questionChoice ? (
                <motion.div
                  key={`${questionChoice.id}-${carriedLens?.name ?? "open"}`}
                  className="final-invitation__carried-question"
                  initial={false}
                  animate={{
                    opacity: prefersReducedMotion || inView ? 1 : 0.24,
                    x: prefersReducedMotion || inView ? 0 : -14,
                    clipPath: prefersReducedMotion || inView
                      ? "inset(0 0% 0 0)"
                      : "inset(0 100% 0 0)",
                  }}
                  exit={prefersReducedMotion ? undefined : {
                    opacity: 0,
                    x: 10,
                    clipPath: "inset(0 0 0 100%)",
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.58,
                    delay: prefersReducedMotion || !inView ? 0 : 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-live="polite"
                >
                  <span>
                    {carriedLens
                      ? `${carriedLens.name} lens · ${questionChoice.label} question`
                      : "The question you chose"}
                  </span>
                  <strong>{questionChoice.question}</strong>
                  {carriedLens ? <small>{carriedLens.question}</small> : null}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="final-invitation__actions">
              <TrackedLink
                href={bookingHref}
                target="_blank"
                rel="noopener noreferrer"
                event="calendar_opened"
                eventProps={{
                  source: "home_final_invitation",
                  situation,
                  ...(selectedPackage ? { package: selectedPackage } : {}),
                  ...(questionChoice ? { question: questionChoice.id } : {}),
                  ...(carriedLens ? { lens: carriedLens.name } : {}),
                }}
                className="final-invitation__primary"
                data-magnetic
                data-cursor-label="Book the diagnosis"
                aria-label={`Open Calendly in your timezone to book a ${consultation.minutes} minute diagnosis with ${site.founder}`}
                onPointerEnter={onBookingCtaPointerEnter}
                onPointerMove={onBookingCtaPointerMove}
                onPointerLeave={(event) => clearBookingCtaMotion(event.currentTarget)}
                onPointerCancel={(event) => clearBookingCtaMotion(event.currentTarget)}
                onFocus={(event) => clearBookingCtaMotion(event.currentTarget)}
                onBlur={(event) => clearBookingCtaMotion(event.currentTarget)}
              >
                {consultation.actionLabel}
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
              </TrackedLink>
              <div className="final-invitation__action-note">
                <ul aria-label="Booking details">
                  <li><Clock3 size={14} strokeWidth={1.7} aria-hidden="true" />{consultation.minutes} minutes</li>
                  <li><Globe2 size={14} strokeWidth={1.7} aria-hidden="true" />Times shown in your timezone</li>
                  <li><FileText size={14} strokeWidth={1.7} aria-hidden="true" />{consultation.preparation}</li>
                </ul>
                <TrackedLink
                  href={writeHref}
                  event="contact_route_selected"
                  eventProps={{
                    source: "home_final_invitation",
                    route: "write_first",
                    situation,
                    ...(selectedPackage ? { package: selectedPackage } : {}),
                    ...(questionChoice ? { question: questionChoice.id } : {}),
                    ...(carriedLens ? { lens: carriedLens.name } : {}),
                  }}
                >
                  <MessageCircle size={14} strokeWidth={1.7} aria-hidden="true" />
                  Prefer to write first
                  <ArrowRight size={14} strokeWidth={1.7} aria-hidden="true" />
                </TrackedLink>
              </div>
            </div>
          </div>

          <aside className="final-invitation__promise" aria-label="Inside the diagnosis">
            <p>Inside the {consultation.minutes} minute diagnosis</p>
            <div className="final-invitation__promise-list">
              <motion.span
                className="final-invitation__thread"
                aria-hidden="true"
                initial={false}
                animate={{
                  opacity: inView ? 1 : 0.25,
                  scaleY: prefersReducedMotion || inView ? 1 : 0,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 1.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <ol
                role="tablist"
                aria-label="Choose a stage of the diagnosis conversation"
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") setPreviewCallStep(null);
                }}
              >
                {consultation.steps.map((step, index) => (
                  <motion.li
                    key={step}
                    role="presentation"
                    data-step-active={activeCallStep === index ? "true" : undefined}
                    initial={false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.62,
                      delay: prefersReducedMotion ? 0 : 0.18 + index * 0.13,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <button
                      id={`final-invitation-step-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={committedCallStep === index}
                      aria-controls="final-invitation-step-detail"
                      tabIndex={committedCallStep === index ? 0 : -1}
                      onClick={() => chooseCallStep(index)}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") chooseCallStep(index, false);
                      }}
                      onFocus={() => chooseCallStep(index)}
                      onKeyDown={(event) => onCallStepKeyDown(event, index)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{step}</strong>
                    </button>
                  </motion.li>
                ))}
              </ol>
              <AnimatePresence mode="sync" initial={false}>
                <motion.p
                  key={`${activeCallStep}-${questionChoice?.id ?? "open"}-${carriedLens?.name ?? "unframed"}-${situation}`}
                  id="final-invitation-step-detail"
                  role="tabpanel"
                  aria-labelledby={`final-invitation-step-${activeCallStep}`}
                  className="final-invitation__step-detail"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 7, filter: "blur(3px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5, filter: "blur(3px)" }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.36,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {conversationSteps[activeCallStep]}
                </motion.p>
              </AnimatePresence>
            </div>
            <motion.p
              key={`${situation}-thanks`}
              className="final-invitation__thanks"
              initial={false}
              animate={{
                opacity: inView ? 1 : 0.5,
                y: prefersReducedMotion || inView ? 0 : 7,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.72,
                delay: prefersReducedMotion ? 0 : 0.48,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {invitation.thanks}
            </motion.p>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
