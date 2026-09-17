"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
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
import { LivingGradient } from "@/components/LivingGradient";

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
  const frameRef = useRef<HTMLDivElement>(null);
  const agendaRef = useRef<HTMLOListElement>(null);
  const preserveStep = useRef(false);
  const [situation, setSituation] = useState<Situation>("default");
  const [activeStep, setActiveStep] = useState(0);
  const [frameFits, setFrameFits] = useState(false);
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
  const signoffInk = useTransform(entranceProgress, [0.5, 1], ["#625a4d", "#70482f"]);
  const conversationProgress = useMotionValue(0);
  const desktopStory = cinematicMotion && !reducedMotion && frameFits;

  // The frame always keeps its natural height, even while sticky. Measuring
  // that height prevents longer personalised copy, zoom or font changes from
  // trapping the booking links and signoff below the reading viewport.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => setFrameFits(Math.max(frame.offsetHeight, frame.scrollHeight) <= window.innerHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Preference changes reflow the page. Keep the reading light on the same
  // step until a fresh scroll gesture, rather than treating that reflow as input.
  useEffect(() => {
    if (reducedMotion) preserveStep.current = true;
  }, [reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    const agenda = agendaRef.current;
    if (!root || !agenda || reducedMotion) return;
    let frame = 0;
    function render() {
      frame = 0;
      if (preserveStep.current) return;
      const bounds = root!.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && root!.contains(focused) && focused.matches(":focus-visible")) return;
      const selection = document.getSelection();
      if (selection && !selection.isCollapsed && selection.rangeCount
        && selection.getRangeAt(0).intersectsNode(root!)) return;
      // Compact layouts use the agenda's natural travel through the reading
      // zone. The desktop hold uses its existing runway. Neither moves text.
      const agendaBounds = agenda!.getBoundingClientRect();
      const progress = desktopStory
        ? -bounds.top / Math.max(1, bounds.height - window.innerHeight)
        : (window.innerHeight * 0.42 - agendaBounds.top) / Math.max(1, agendaBounds.height);
      conversationProgress.set(Math.min(1, Math.max(0, progress)));
      setActiveStep((current) => invitationStep(progress, current, STEP_LABELS.length));
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(render);
    }
    function release() { preserveStep.current = false; }
    function onKey(event: KeyboardEvent) {
      if (event.defaultPrevented || !["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"], [role="tablist"]')) return;
      release();
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", onKey);
    };
  }, [conversationProgress, desktopStory, reducedMotion]);

  // Refresh the two local timelines after the hold changes the scene height.
  // A font, viewport or preference change can happen while scrolling is idle.
  useEffect(() => {
    const root = rootRef.current;
    if (root) {
      const { top, height } = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      const clamp = (value: number) => Math.min(1, Math.max(0, value));
      entranceProgress.set(clamp((viewport - top) / Math.max(1, height)));
      storyProgress.set(clamp(-top / Math.max(1, height - viewport)));
    }
  }, [desktopStory, entranceProgress, storyProgress]);

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
      data-home-surface
      data-cursor-world="light"
      data-invitation-situation={situation}
      data-invitation-step={activeStep + 1}
      data-invitation-story={desktopStory ? "held" : "flow"}
    >
      <LivingGradient contours preset="wanderlust" plain opacity={0.5} />
      <div className={styles.invitationMedia} aria-hidden="true">
        <motion.div
          className={styles.invitationMediaCamera}
          style={{
            scale: desktopStory ? mediaScale : 1,
            x: desktopStory ? mediaX : 0,
          }}
        >
          <BackgroundVideo
            video="/videos/higgsfield-silver-tide.mp4"
            videoMobile="/videos/higgsfield-silver-tide-mobile.mp4"
            poster="/images/higgsfield-silver-tide-poster.jpg"
            imagePosition="50% 18%"
            loop={false}
          />
        </motion.div>
      </div>
      <div ref={frameRef} className={styles.invitationFrame}>
        <motion.div className={styles.invitationRule} style={{ scaleX: reducedMotion ? 1 : lineProgress }} aria-hidden="true" />
        <div className={styles.invitationCopy} data-invitation-copy>
          <div data-invitation-reading>
            <p className={styles.eyebrow}>{invitation.eyebrow}</p>
            {/* Native text wrapping and one scroll-ink owner keep the heading
                readable through personalisation, pause and reverse scrolling. */}
            <h2>{invitation.headline}</h2>
            <p className={styles.lede}>{invitation.body}</p>
          </div>
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
          <div className={styles.conversationAgenda}>
            <div className={styles.conversationTrack} aria-hidden="true">
              <motion.i style={{ scaleY: reducedMotion ? 1 : conversationProgress }} />
            </div>
            <ol ref={agendaRef}>
              {consultation.fullSteps.map((step, index) => (
                <li key={step} data-current={activeStep === index}>
                  <motion.span
                    className={styles.conversationRule}
                    initial={false}
                    animate={{ opacity: activeStep === index ? 1 : 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                  />
                  <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{STEP_LABELS[index]}</h3>
                    <p>{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <p className={styles.conversationFooter}>Direct with Suman · Your timezone</p>
        </aside>
        <motion.p
          className={styles.signoff}
          style={{
            color: reducedMotion ? "#625a4d" : signoffInk,
          }}
        >
          Thank you for giving your brand the attention it deserves.
        </motion.p>
      </div>
    </div>
  );
}
