"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LinkButton } from "@/components/Button";

type Situation = "idea" | "inconsistent" | "outgrown" | "default";

type Invitation = {
  eyebrow: string;
  headline: string;
  body: string;
  action: string;
};

const INVITATIONS: Record<Situation, Invitation> = {
  default: {
    eyebrow: "The next decision",
    headline:
      "Let’s find the Tatva of your business: the idea people should remember after everything else has moved on.",
    body:
      "Twenty minutes, a real conversation, and an honest view of what the brand needs next.",
    action: "Book a Brand Strategy Session",
  },
  idea: {
    eyebrow: "Your diagnosis · the idea is ahead of the brand",
    headline:
      "Turn the idea in your head into a position the market can understand, remember, and choose.",
    body:
      "We will identify the belief, category, audience tension, and promise the rest of the brand should inherit.",
    action: "Build the foundation",
  },
  inconsistent: {
    eyebrow: "Your diagnosis · the brand has drifted",
    headline: "Bring the scattered pieces back to one recognisable idea.",
    body:
      "We will find where the brand is contradicting itself, then decide the position every touchpoint should reinforce.",
    action: "Reposition the brand",
  },
  outgrown: {
    eyebrow: "Your diagnosis · growth is outrunning consistency",
    headline: "Give the brand a system strong enough to keep pace with the business.",
    body:
      "We will turn the strongest signals into rules for identity, content, campaigns, and recognition that keeps compounding.",
    action: "Build the living system",
  },
};

function readSituation(): Situation {
  try {
    const saved = window.localStorage.getItem("bt-situation");
    if (saved === "idea" || saved === "inconsistent" || saved === "outgrown") {
      return saved;
    }
  } catch {}
  return "default";
}

export function FinalInvitation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [situation, setSituation] = useState<Situation>("default");
  const inView = useInView(rootRef, { amount: 0.35 });
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (!inView) return;
    setSituation(readSituation());
  }, [inView]);

  useEffect(() => {
    function sync() {
      setSituation(readSituation());
    }

    window.addEventListener("storage", sync);
    window.addEventListener("bt:situation", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("bt:situation", sync as EventListener);
    };
  }, []);

  const invitation = INVITATIONS[situation];

  return (
    <div ref={rootRef} className="relative mx-auto max-w-3xl text-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={situation}
          initial={
            prefersReducedMotion
              ? false
              : { opacity: 0, y: 16, filter: "blur(7px)" }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={
            prefersReducedMotion
              ? undefined
              : { opacity: 0, y: -10, filter: "blur(5px)" }
          }
          transition={{
            duration: prefersReducedMotion ? 0 : 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-live="polite"
        >
          <p
            className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-sandstone"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
          >
            {invitation.eyebrow}
          </p>
          <h2
            className="mx-auto mt-4 max-w-3xl text-display-md font-display font-normal text-ivory"
            style={{
              textShadow:
                "0 2px 14px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)",
            }}
          >
            {invitation.headline}
          </h2>
          <div className="mt-8">
            <LinkButton href="/contact">{invitation.action}</LinkButton>
            <p
              className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ivory/80"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
            >
              {invitation.body}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
