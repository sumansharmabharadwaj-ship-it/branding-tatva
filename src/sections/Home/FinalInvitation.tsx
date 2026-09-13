"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Clock3 } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { consultation } from "@/data/site";
import {
  HOME_TO_SERVICES_SITUATION,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  SERVICES_SITUATION_CLEARED_EVENT,
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  servicesContactHrefForSituation,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import styles from "./HomeConversation.module.css";
import { invitationStep } from "./invitationScroll";

type Situation = ServicesSituationId | "default";

const INVITATIONS = {
  default: {
    eyebrow: "A conversation with Suman",
    headline: "One conversation. A clearer next move.",
    body: "Bring the brand decision you keep circling. We’ll look at what people understand today and what deserves attention first.",
    proofHref: "/services#proof",
    proofLabel: "See the work behind the conversation",
  },
  idea: {
    eyebrow: "For the brand you’re beginning",
    headline: "Start with the question behind the idea.",
    body: "Tell me who the business is for and what you want it to mean. We’ll examine the assumptions that need attention before the first identity or website.",
    proofHref: "/work/myshopineurope",
    proofLabel: "See how a first brand took shape",
  },
  reposition: {
    eyebrow: "For a brand that has drifted",
    headline: "Find where the business and brand parted ways.",
    body: "Bring the words, visuals, or touchpoints that no longer fit. We’ll look at what still earns recognition and what may need to change.",
    proofHref: "/work/herbalcart",
    proofLabel: "See a repositioning in practice",
  },
  ongoing: {
    eyebrow: "For the business you’ve become",
    headline: "Give the next stage a clearer starting point.",
    body: "Tell me where growth is making the brand harder to hold together. We’ll find the decision that needs attention before adding more activity.",
    proofHref: "/work/dr-haley-nutrition",
    proofLabel: "See a consistent brand at work",
  },
} as const;

const STEP_LABELS = ["Bring the context", "Test the question", "Choose what comes next"] as const;

function legacySituation(value: string | null | undefined): ServicesSituationId | null {
  if (value !== "idea" && value !== "inconsistent" && value !== "outgrown") return null;
  return HOME_TO_SERVICES_SITUATION[value];
}

function readSituation(): Situation {
  try {
    const stored = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
    const current = isServicesSituation(stored) ? stored : readCompletedHomeDiagnosis();
    if (current) return current;
    const saved = legacySituation(window.localStorage.getItem("bt-situation"));
    if (saved) return saved;
  } catch {
    // The invitation remains usable when browser storage is unavailable.
  }
  return "default";
}

export function FinalInvitation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const agendaId = useId();
  const [situation, setSituation] = useState<Situation>("default");
  const [activeStep, setActiveStep] = useState(0);
  const reducedMotion = useHydratedReducedMotion();
  const cinematicMotion = useMediaQuery(
    "(min-width: 1181px) and (min-height: 761px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );
  const { scrollYProgress: entranceProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end end"],
  });
  const { scrollYProgress: storyProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const lineProgress = useTransform(entranceProgress, [0.1, 0.9], [0, 1]);
  const mediaScale = useTransform(storyProgress, [0, 0.52, 1], [1.05, 1.025, 1]);
  const mediaX = useTransform(storyProgress, [0, 0.52, 1], ["0.8%", "0.25%", "0%"]);
  const signoffOpacity = useTransform(storyProgress, [0, 0.66, 0.84, 1], [0, 0, 1, 1]);
  const signoffY = useTransform(storyProgress, [0, 0.66, 0.84, 1], [10, 10, 0, 0]);
  const desktopStory = cinematicMotion && !reducedMotion;

  useMotionValueEvent(storyProgress, "change", (progress) => {
    setActiveStep((current) => desktopStory
      ? invitationStep(progress, current, STEP_LABELS.length)
      : 0,
    );
  });

  // A preference or breakpoint change must settle without another scroll event.
  useEffect(() => {
    setActiveStep((current) => desktopStory
      ? invitationStep(storyProgress.get(), current, STEP_LABELS.length)
      : 0,
    );
  }, [desktopStory, storyProgress]);

  useEffect(() => {
    function sync() { setSituation(readSituation()); }
    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      if (isServicesSituation(detail?.situation ?? null)) setSituation(detail.situation);
    }
    function onLegacySituation(event: Event) {
      const saved = legacySituation((event as CustomEvent<{ situation?: string }>).detail?.situation);
      if (saved) setSituation(saved);
      else sync();
    }
    function onStorage(event: StorageEvent) {
      if (event.key === "bt-situation") {
        setSituation(legacySituation(event.newValue) ?? "default");
      } else if (event.key === SERVICES_SITUATION_STORAGE_KEY || event.key === null) {
        if (event.newValue === null) setSituation("default");
        else sync();
      }
    }
    function clear() { setSituation("default"); }
    sync();
    window.addEventListener("storage", onStorage);
    window.addEventListener("bt:situation", onLegacySituation);
    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation);
    window.addEventListener(SERVICES_SITUATION_CLEARED_EVENT, clear);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("bt:situation", onLegacySituation);
      window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation);
      window.removeEventListener(SERVICES_SITUATION_CLEARED_EVENT, clear);
    };
  }, []);

  const invitation = INVITATIONS[situation];
  const contactHref = servicesContactHrefForSituation(situation === "default" ? null : situation, "call");

  return (
    <div
      ref={rootRef}
      className={styles.invitation}
      data-cursor-world="light"
      data-invitation-situation={situation}
      data-invitation-step={activeStep + 1}
    >
      <div className={styles.invitationMedia} aria-hidden="true">
        <motion.div
          className={styles.invitationMediaCamera}
          style={{
            scale: cinematicMotion && !reducedMotion ? mediaScale : 1,
            x: cinematicMotion && !reducedMotion ? mediaX : 0,
          }}
        >
          <BackgroundVideo
            video="/videos/higgsfield-silver-tide.mp4"
            poster="/images/higgsfield-silver-tide-poster.jpg"
            imagePosition="50% 18%"
            loop={false}
          />
        </motion.div>
      </div>
      <div className={styles.invitationFrame}>
        <motion.div className={styles.invitationRule} style={{ scaleX: reducedMotion ? 1 : lineProgress }} aria-hidden="true" />
        <div className={styles.invitationCopy}>
          <p className={styles.eyebrow}>{invitation.eyebrow}</p>
          <h2>{invitation.headline}</h2>
          <p className={styles.lede}>{invitation.body}</p>
          <Link href={contactHref} className={styles.bookButton}>
            {consultation.actionLabel} <ArrowRight size={20} aria-hidden="true" />
          </Link>
          <p className={styles.preparation}>{consultation.preparation}</p>
          <Link href={invitation.proofHref} className={styles.textLink}>
            {invitation.proofLabel} <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <aside className={styles.conversation} aria-label="What happens in the first conversation">
          <div className={styles.conversationTopline}>
            <span>What we’ll talk through</span>
            <span><Clock3 size={15} aria-hidden="true" /> {consultation.minutes} minutes</span>
          </div>
          <ol>
            {consultation.fullSteps.map((step, index) => (
              <li key={step} data-current={activeStep === index}>
                {desktopStory && activeStep === index && (
                  <motion.span
                    className={styles.conversationRule}
                    layoutId={`home-conversation-rule-${agendaId}`}
                    initial={false}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                  />
                )}
                <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{STEP_LABELS[index]}</h3>
                  <p>{step}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={styles.conversationFooter}>Direct with Suman · Your timezone</p>
        </aside>
        <motion.p
          className={styles.signoff}
          style={{
            opacity: cinematicMotion && !reducedMotion ? signoffOpacity : 1,
            y: cinematicMotion && !reducedMotion ? signoffY : 0,
          }}
        >
          Thank you for giving your brand the attention it deserves.
        </motion.p>
      </div>
    </div>
  );
}
