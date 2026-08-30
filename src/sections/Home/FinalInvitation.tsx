"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LinkButton } from "@/components/Button";
import { consultation } from "@/data/site";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  isServicesSituation,
  readCompletedHomeDiagnosis,
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
  const inView = useInView(rootRef, { amount: 0.28 });
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    if (!inView) return;
    setSituation(readSituation());
  }, [inView]);

  useEffect(() => {
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
      }
    }

    window.addEventListener("storage", sync);
    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    window.addEventListener("bt:situation", sync as EventListener);
    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
      window.removeEventListener("bt:situation", sync as EventListener);
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
    };
  }, []);

  const invitation = INVITATIONS[situation];

  return (
    <div
      ref={rootRef}
      data-invitation-situation={situation}
      data-media-id="BT-HOME-INVITATION-SUMMIT-FIRST-LIGHT-V1"
      className="final-invitation"
      style={{ "--invitation-accent": invitation.accent } as CSSProperties}
    >
      <motion.div
        className="final-invitation__frame"
        initial={false}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="final-invitation__topline">
          <span>09 · Begin</span>
          <span>One quiet conversation</span>
        </div>

        <div className="final-invitation__composition">
          <div className="final-invitation__copy" data-home-reading-plane>
            <p className="final-invitation__eyebrow">{invitation.eyebrow}</p>
            <h2 className="final-invitation__headline">{invitation.headline}</h2>
            <p className="final-invitation__body">{invitation.body}</p>

            <div className="final-invitation__actions">
              <LinkButton
                href="/contact#call"
                trackEvent="hero_booking_click"
                trackProps={{ page: "home", position: "final_invitation", situation }}
              >
                {consultation.actionLabel}
              </LinkButton>
              <span>{consultation.minutes} minutes · honest feedback · no pitch deck</span>
            </div>
          </div>

          <aside className="final-invitation__promise" aria-label="What becomes clear in the diagnosis">
            <p>What becomes clear</p>
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
              <ol>
                {consultation.steps.map((step, index) => (
                  <motion.li
                    key={step}
                    initial={false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.62,
                      delay: prefersReducedMotion ? 0 : 0.18 + index * 0.13,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{step}</strong>
                  </motion.li>
                ))}
              </ol>
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
