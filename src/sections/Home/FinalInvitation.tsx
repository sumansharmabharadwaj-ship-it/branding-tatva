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
  accent: string;
};

const INVITATIONS: Record<Situation, Invitation> = {
  default: {
    eyebrow: "The next clear decision",
    headline: "Bring the question taking up the most room.",
    body:
      "One focused conversation gives the question an honest diagnosis and a clearer next move.",
    thanks: "Thank you for giving the thinking your attention. That care is where clearer work begins.",
    accent: "#95622D",
  },
  idea: {
    eyebrow: "Your path · the idea is ahead of the brand",
    headline: "Give the idea a position the market can recognise.",
    body:
      "Bring the category or audience question. The conversation will test where the idea needs clarity first.",
    thanks: "Thank you for staying with the idea long enough to ask what it truly needs.",
    accent: "#A34F35",
  },
  reposition: {
    eyebrow: "Your path · the brand has drifted",
    headline: "Bring the scattered pieces back to one recognisable idea.",
    body:
      "Bring the contradiction causing the most friction. The conversation will identify the clearest place to begin.",
    thanks: "Thank you for looking at the drift honestly. That is where coherence begins.",
    accent: "#66724D",
  },
  ongoing: {
    eyebrow: "Your path · consistency needs a stronger centre",
    headline: "Give every channel one idea to return to.",
    body:
      "Bring the channel or campaign creating the most drift. The conversation will surface the first rule worth defining.",
    thanks: "Thank you for caring about the pattern, not only the next campaign.",
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
  const [situation, setSituation] = useState<Situation>("default");
  const [questionChoice, setQuestionChoice] = useState<HomeQuestionChoice | null>(null);
  const [studioLens, setStudioLens] = useState<HomeStudioLens | null>(null);
  const [activeCallStep, setActiveCallStep] = useState(0);
  const inView = useInView(rootRef, { amount: 0.28 });
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    if (!inView) return;
    setSituation(readSituation());
  }, [inView]);

  useEffect(() => {
    setQuestionChoice(readHomeQuestionChoice());
    setStudioLens(readHomeStudioLens());

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
        (detail?.origin === "home_diagnostic" || detail?.origin === "home_paths") &&
        isServicesSituation(detail.situation)
      ) {
        setSituation(detail.situation);
        setQuestionChoice(null);
        setStudioLens(null);
      }
    }

    function onSituationCleared() {
      setSituation("default");
      setQuestionChoice(null);
      setStudioLens(null);
    }

    function onQuestionChoice(event: Event) {
      const detail = (event as CustomEvent<HomeQuestionChoiceDetail>).detail;
      setQuestionChoice(detail?.choice ?? null);
    }

    function onStudioLens(event: Event) {
      const detail = (event as CustomEvent<HomeStudioLensDetail>).detail;
      setStudioLens(detail?.lens ?? null);
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
    };
  }, []);

  const invitation = INVITATIONS[situation];
  const carriedLens = questionChoice?.lens ?? studioLens;
  const selectedSituation = situation === "default" ? null : situation;
  const selectedPackage = selectedSituation ? SITUATION_TO_PACKAGE[selectedSituation] : null;
  const bookingHref = calendlyHrefForServicesPackage(`${site.calendlyUrl}/30min`, selectedPackage);
  const writeHref = servicesContactHrefForSituation(selectedSituation, "write");

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
    setActiveCallStep(next);
    document.getElementById(`final-invitation-step-${next}`)?.focus();
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
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="final-invitation__topline">
          <span>09 · Begin</span>
          <span>{carriedLens ? `${carriedLens.name} lens carried` : "One quiet conversation"}</span>
        </div>

        <div className="final-invitation__composition">
          <div className="final-invitation__copy" data-home-reading-plane>
            <p className="final-invitation__eyebrow">{invitation.eyebrow}</p>
            <h2 className="final-invitation__headline">{invitation.headline}</h2>
            <p className="final-invitation__body">{invitation.body}</p>

            {questionChoice ? (
              <div className="final-invitation__carried-question">
                <span>
                  {carriedLens
                    ? `${carriedLens.name} lens · ${questionChoice.label} question`
                    : "The question you chose"}
                </span>
                <strong>{questionChoice.question}</strong>
                {carriedLens ? <small>{carriedLens.question}</small> : null}
              </div>
            ) : null}

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
                data-cursor-label="Book the diagnosis"
                aria-label={`Open Calendly in your timezone to book a ${consultation.minutes} minute diagnosis with ${site.founder}`}
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
              <ol role="tablist" aria-label="Explore the diagnosis conversation">
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
                      aria-selected={activeCallStep === index}
                      aria-controls="final-invitation-step-detail"
                      tabIndex={activeCallStep === index ? 0 : -1}
                      onClick={() => setActiveCallStep(index)}
                      onFocus={() => setActiveCallStep(index)}
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
                  key={activeCallStep}
                  id="final-invitation-step-detail"
                  role="tabpanel"
                  aria-labelledby={`final-invitation-step-${activeCallStep}`}
                  className="final-invitation__step-detail"
                  initial={false}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5, filter: "blur(3px)" }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.36,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {consultation.fullSteps[activeCallStep]}
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
