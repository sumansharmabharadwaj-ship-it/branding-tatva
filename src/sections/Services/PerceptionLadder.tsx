"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import styles from "./PerceptionLadder.module.css";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

const EASE = [0.22, 1, 0.36, 1] as const;

const RUNGS = [
  {
    label: "Unfamiliar",
    thought: "What does this business do?",
    sequence: ["Encounter", "Explanation", "Understanding"],
    caption: "Each encounter starts the explanation again.",
    signal: "Buyers understand only after a full explanation.",
    explanation: "The market has no reliable shortcut to the business yet. Every encounter must rebuild category, meaning, and relevance from the beginning.",
    decision: "Define the category and the belief the brand will own.",
    evidence: "Independent descriptions of what the business is and who it is for.",
    system: "Category and position",
  },
  {
    label: "Recognised",
    thought: "I have seen them before.",
    sequence: ["Familiar cue", "Brand name", "Recognition"],
    caption: "A familiar cue brings the name back.",
    signal: "The name or cues register, but the meaning still moves.",
    explanation: "Familiarity has begun, but recognition alone leaves the brand hard to describe or choose. Inconsistent cues can still make it interchangeable.",
    decision: "Repeat a small set of distinctive verbal and visual codes.",
    evidence: "Correct identification from cues other than the name, plus repeated language across interviews.",
    system: "Distinctive codes",
  },
  {
    label: "Recalled",
    thought: "They come to mind for this.",
    sequence: ["Buying need", "Memory", "Your brand"],
    caption: "The need itself brings the brand to mind.",
    signal: "The brand returns in a relevant buying moment.",
    explanation: "Recognition needs a prompt. Recall happens when the need appears and the brand comes to mind without one. Repetition can support that memory; distribution and relevance still matter.",
    decision: "Link the same meaning to the situations in which buyers need it.",
    evidence: "Unaided mentions, branded searches, and repeat direct visits at relevant moments.",
    system: "Mental availability",
  },
  {
    label: "Considered",
    thought: "They belong on my shortlist.",
    sequence: ["Your position", "Evidence", "Shortlist"],
    caption: "A relevant position earns a closer look.",
    signal: "The brand enters the shortlist before price alone decides.",
    explanation: "Recall creates an opportunity rather than guaranteed preference. Relevance, proof, availability, experience, and price still shape the final decision.",
    decision: "Protect the position and support it with evidence buyers can inspect.",
    evidence: "Shortlist mentions, qualified enquiries, and sales notes that cite the position.",
    system: "Consideration",
  },
] as const;

const ROUTE_FOCUS: Record<
  ServicesSituationId,
  { transition: string; note: string }
> = {
  idea: {
    transition: "From unfamiliar to recognised",
    note: "Foundation gives the business a category, position, and repeatable identity before launch.",
  },
  reposition: {
    transition: "From recognised to recalled",
    note: "Full Brand System aligns the meaning and cues already circulating among buyers.",
  },
  ongoing: {
    transition: "From recalled to considered",
    note: "Brand Partnership keeps each live expression recognisable as the business moves.",
  },
};

export function PerceptionLadder() {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [routeFocus, setRouteFocus] = useState<(typeof ROUTE_FOCUS)[ServicesSituationId] | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activeRung = RUNGS[activeIndex] ?? RUNGS[0];

  useEffect(() => {
    function applySituation(situation: ServicesSituationId | null) {
      setRouteFocus(situation ? ROUTE_FOCUS[situation] : null);
    }

    try {
      const storedSituation = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      applySituation(
        isServicesSituation(storedSituation)
          ? storedSituation
          : readCompletedHomeDiagnosis(),
      );
    } catch {
      applySituation(null);
    }

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      applySituation(isServicesSituation(detail?.situation) ? detail.situation : null);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    return () => window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
  }, []);

  // Tabs are deliberate choices. Scrolling never replaces the state being read.
  function activate(index: number, source: "click" | "keyboard") {
    setActiveIndex(index);
    track("capability_selected", {
      page: "services",
      capability: `Recognition ladder: ${RUNGS[index]?.label ?? "stage"}`,
      source: `perception_${source}`,
    });
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLButtonElement>) {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % RUNGS.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + RUNGS.length) % RUNGS.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = RUNGS.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    activate(nextIndex, "keyboard");
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <Container className={styles.container}>
      <div className={styles.system} data-memory-stage={activeIndex + 1}>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>How buyers remember</p>
            <h2>Being seen and being remembered are different jobs.</h2>
          </div>
          <p className={styles.intro}>
            Four states of buyer memory. Each calls for a different decision.
            Choose the one that sounds like your business.
          </p>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Four states of brand recognition">
          {RUNGS.map((rung, index) => (
            <button
              key={rung.label}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={`perception-stage-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="perception-stage-panel"
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => activate(index, "click")}
              onKeyDown={(event) => handleKeyDown(index, event)}
              className={styles.tab}
            >
              <span className={styles.tabNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{rung.label}</span>
              <ArrowRight aria-hidden="true" size={17} strokeWidth={1.5} />
            </button>
          ))}
        </div>

        <div
          id="perception-stage-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`perception-stage-tab-${activeIndex}`}
          className={styles.panel}
        >
          <motion.div
            key={activeRung.label}
            className={styles.reading}
            initial={prefersReducedMotion ? false : { opacity: 0.88, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
          >
            <div className={styles.visual}>
              <p className={styles.eyebrow}>In the buyer’s mind</p>
              <p className={styles.thought}>“{activeRung.thought}”</p>
              <ol className={styles.sequence} aria-label="How this memory state works">
                {activeRung.sequence.map((step, index) => (
                  <li key={step}>
                    <span className={styles.node} aria-hidden="true">
                      {index === 0 ? <span className={styles.seed} /> : index === 1 ? <span className={styles.rings} /> : <span className={styles.mark}>✳</span>}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className={styles.caption}>{activeRung.caption}</p>
              <div className={styles.systemResult}>
                <span>System to build</span>
                <strong>{activeRung.system}</strong>
              </div>
            </div>

            <div className={styles.copy}>
              <p className={styles.eyebrow}>What buyers currently do</p>
              <h3>{activeRung.signal}</h3>
              <p className={styles.explanation}>{activeRung.explanation}</p>
              <dl className={styles.decisions}>
                <div>
                  <dt>What to decide next</dt>
                  <dd>{activeRung.decision}</dd>
                </div>
                <div>
                  <dt>Evidence to collect</dt>
                  <dd>{activeRung.evidence}</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>

        <div className={styles.footer}>
          <p className={styles.context}>
            {routeFocus ? <><span>Your selected engagement</span>{routeFocus.note}</> :
              <>These are market conditions. Familiarity alone promises neither recall nor a place on the shortlist.</>}
          </p>
          <a href="#audit" data-section-jump-yield="true" className={styles.auditLink}>
            Check your brand <ArrowDown aria-hidden="true" size={17} />
          </a>
        </div>
      </div>
    </Container>
  );
}
