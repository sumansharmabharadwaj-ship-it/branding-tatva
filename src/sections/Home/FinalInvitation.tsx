"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LinkButton } from "@/components/Button";
import { consultation } from "@/data/site";
import {
  SERVICES_SITUATION_EVENT,
  completedHomeDiagnosisFrom,
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
  accent: string;
};

const INVITATIONS: Record<Situation, Invitation> = {
  default: {
    eyebrow: "The next clear decision",
    headline: "Bring the question taking up the most room.",
    body:
      "One focused conversation gives the question an honest diagnosis and a clearer next move.",
    accent: "#D4B99A",
  },
  idea: {
    eyebrow: "Your diagnosis · the idea is ahead of the brand",
    headline: "Give the idea a position the market can recognise.",
    body:
      "Bring the category or audience question. The conversation will test where the idea needs clarity first.",
    accent: "#C77752",
  },
  reposition: {
    eyebrow: "Your diagnosis · the brand has drifted",
    headline: "Bring the scattered pieces back to one recognisable idea.",
    body:
      "Bring the contradiction causing the most friction. The conversation will identify the clearest place to begin.",
    accent: "#7D8565",
  },
  ongoing: {
    eyebrow: "Your diagnosis · consistency needs a stronger centre",
    headline: "Give every channel one idea to return to.",
    body:
      "Bring the channel or campaign creating the most drift. The conversation will surface the first rule worth defining.",
    accent: "#D8A251",
  },
};

function readSituation(): Situation {
  try {
    const completedDiagnosis = readCompletedHomeDiagnosis();
    if (isServicesSituation(completedDiagnosis)) return completedDiagnosis;
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

    function onCompletedDiagnosis(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      setSituation(completedHomeDiagnosisFrom(detail) ?? "default");
    }

    window.addEventListener("storage", sync);
    window.addEventListener(SERVICES_SITUATION_EVENT, onCompletedDiagnosis as EventListener);
    window.addEventListener("bt:situation", sync as EventListener);
    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SERVICES_SITUATION_EVENT, onCompletedDiagnosis as EventListener);
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
            <p className="final-invitation__thanks">
              Thank you for giving the thinking your attention.
            </p>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
