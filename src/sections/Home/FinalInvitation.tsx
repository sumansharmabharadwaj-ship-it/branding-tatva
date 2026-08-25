"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LinkButton } from "@/components/Button";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  isServicesSituation,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

type Situation = ServicesSituationId | "default";

type Invitation = {
  eyebrow: string;
  headline: string;
  body: string;
  action: string;
  trail: readonly [string, string, string];
  accent: string;
};

const INVITATIONS: Record<Situation, Invitation> = {
  default: {
    eyebrow: "The next clear decision",
    headline: "Leave with the three decisions your brand needs next.",
    body:
      "In thirty focused minutes, we will name the tension, choose a direction, and define the first useful move.",
    action: "Book the 30-minute diagnosis",
    trail: ["Name the tension", "Choose the position", "Build the system"],
    accent: "#D4B99A",
  },
  idea: {
    eyebrow: "Your diagnosis · the idea is ahead of the brand",
    headline: "Give the idea a position the market can recognise.",
    body:
      "We will name the category, audience tension, belief, and promise the first system should inherit.",
    action: "Book the 30-minute diagnosis",
    trail: ["Decode founder truth", "Commit the position", "Build the first system"],
    accent: "#C77752",
  },
  reposition: {
    eyebrow: "Your diagnosis · the brand has drifted",
    headline: "Bring the scattered pieces back to one recognisable idea.",
    body:
      "We will locate the contradictions, choose the position, and decide what every touchpoint must repeat.",
    action: "Book the 30-minute diagnosis",
    trail: ["Audit contradictions", "Re-centre the story", "Rebuild recognition"],
    accent: "#7D8565",
  },
  ongoing: {
    eyebrow: "Your diagnosis · growth is outrunning consistency",
    headline: "Give growth a system strong enough to hold it.",
    body:
      "We will turn the strongest signals into rules for identity, content, campaigns, and recognition.",
    action: "Book the 30-minute diagnosis",
    trail: ["Find the strongest signals", "Turn them into rules", "Compound across channels"],
    accent: "#D8A251",
  },
};

function readSituation(): Situation {
  try {
    const savedServicesChoice = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
    if (isServicesSituation(savedServicesChoice)) return savedServicesChoice;

    const savedLegacyChoice = window.localStorage.getItem("bt-situation");
    if (savedLegacyChoice === "idea") return "idea";
    if (savedLegacyChoice === "inconsistent") return "reposition";
    if (savedLegacyChoice === "outgrown") return "ongoing";
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

    window.addEventListener("storage", sync);
    window.addEventListener(SERVICES_SITUATION_EVENT, sync as EventListener);
    window.addEventListener("bt:situation", sync as EventListener);
    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SERVICES_SITUATION_EVENT, sync as EventListener);
      window.removeEventListener("bt:situation", sync as EventListener);
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
    };
  }, []);

  const invitation = INVITATIONS[situation];
  const motionActive = inView && !prefersReducedMotion;

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
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18, filter: "blur(7px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-live="polite"
      >
        <div className="final-invitation__topline">
          <span>13 · Begin</span>
          <span>A clear first conversation</span>
        </div>

        <div className="final-invitation__composition">
          <div className="final-invitation__copy">
            <p className="final-invitation__eyebrow">{invitation.eyebrow}</p>
            <h2 className="final-invitation__headline">{invitation.headline}</h2>
            <p className="final-invitation__body">{invitation.body}</p>

            <div className="final-invitation__actions">
              <LinkButton href="/contact">{invitation.action}</LinkButton>
              <span>30 minutes · honest diagnosis · no pitch deck</span>
            </div>
          </div>

          <aside className="final-invitation__promise" aria-label="What becomes clear in the diagnosis">
            <p>We leave with</p>
            <ol>
              {invitation.trail.map((step, index) => (
                <motion.li
                  key={step}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
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
            <motion.p
              className="final-invitation__thanks"
              animate={motionActive ? { opacity: [0.58, 0.9, 0.58] } : undefined}
              transition={motionActive ? { duration: 5.8, repeat: Infinity, ease: "easeInOut" } : undefined}
            >
              Clarity first. The larger system can follow.
            </motion.p>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
