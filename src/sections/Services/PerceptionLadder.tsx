"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Plus } from "lucide-react";
import styles from "./PerceptionLadder.module.css";
import { BuyerMemoryScene } from "./BuyerMemoryScene";
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

const RUNGS = [
  {
    label: "Unfamiliar",
    thought: "What does this business do?",
    signal: "Buyers understand only after a full explanation.",
    explanation: "Each encounter needs a fresh explanation of the category, offer, and buyer.",
    decision: "Define the category and the belief the brand will own.",
    evidence: "Independent descriptions of what the business is and who it is for.",
    system: "Category and position",
  },
  {
    label: "Recognised",
    thought: "I have seen them before.",
    signal: "The name or cues register, but the meaning still moves.",
    explanation: "People recognise the cues. They may still struggle to explain the difference or choose the brand.",
    decision: "Repeat a small set of distinctive verbal and visual codes.",
    evidence: "Correct identification from cues other than the name, plus repeated language across interviews.",
    system: "Distinctive codes",
  },
  {
    label: "Recalled",
    thought: "They come to mind for this.",
    signal: "The brand returns in a relevant buying moment.",
    explanation: "A relevant need brings the brand to mind without a visible cue. Relevance and availability still shape what happens next.",
    decision: "Link the same meaning to the situations in which buyers need it.",
    evidence: "Unaided mentions, branded searches, and repeat direct visits at relevant moments.",
    system: "Mental availability",
  },
  {
    label: "Considered",
    thought: "They belong on my shortlist.",
    signal: "The brand enters the shortlist before price alone decides.",
    explanation: "Recall earns a closer look. Buyers still weigh the position, evidence, experience, availability, and price.",
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
  function activate(index: number, source: "click" | "keyboard" | "picker" | "previous" | "next") {
    const nextIndex = (index + RUNGS.length) % RUNGS.length;
    if (nextIndex === activeIndex) return;
    setActiveIndex(nextIndex);
    track("capability_selected", {
      page: "services",
      capability: `Recognition ladder: ${RUNGS[nextIndex].label}`,
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
    tabRefs.current[nextIndex]?.focus({ preventScroll: true });
  }

  const copyPanels = RUNGS.map((rung, index) => (
    <div key={rung.label} className={styles.copy} data-active={index === activeIndex} aria-hidden={index !== activeIndex} inert={index !== activeIndex}>
      <p className={styles.eyebrow}>What buyers currently do</p>
      <h3>{rung.signal}</h3>
      <p className={styles.explanation}>{rung.explanation}</p>
      <dl className={styles.decisions}>
        <div className={styles.detailDecision}><dt>What to decide next</dt><dd>{rung.decision}</dd></div>
        <div><dt>Evidence to collect</dt><dd>{rung.evidence}</dd></div>
      </dl>
    </div>
  ));

  return (
    <Container className={styles.container}>
      <div className={styles.system} data-memory-stage={activeIndex + 1}>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>How buyers remember</p>
            <h2>Being seen and being remembered are different jobs.</h2>
          </div>
          <p className={styles.intro}>
            Four states of buyer memory. Four different branding decisions.
          </p>
        </header>

        <div className={styles.picker} data-section-jump-yield="true" tabIndex={-1}>
          <div className={styles.pickerHeading}>
            <label htmlFor="buyer-memory-stage">Explore buyer memory</label>
            <span aria-hidden="true">{String(activeIndex + 1).padStart(2, "0")} / 04</span>
          </div>
          <div className={styles.pickerControls}>
            <button type="button" aria-label="Previous memory stage" aria-controls="perception-stage-panel" onClick={() => activate(activeIndex - 1, "previous")}>
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <select id="buyer-memory-stage" value={activeIndex} aria-controls="perception-stage-panel" onChange={(event) => activate(Number(event.target.value), "picker")}>
              {RUNGS.map((rung, index) => <option key={rung.label} value={index}>{rung.label}</option>)}
            </select>
            <button type="button" aria-label="Next memory stage" aria-controls="perception-stage-panel" onClick={() => activate(activeIndex + 1, "next")}>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

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
          aria-label={activeRung.label}
          className={styles.panel}
          data-section-jump-yield="true"
        >
          <div className={styles.reading}>
            <div className={styles.visual}>
              <p className={styles.eyebrow}>In the buyer’s mind</p>
              <div className={styles.thoughts}>
                {RUNGS.map((rung, index) => (
                  <p key={rung.label} className={styles.thought} data-active={index === activeIndex} aria-hidden={index !== activeIndex}>“{rung.thought}”</p>
                ))}
              </div>
              <div className={styles.mobileDecision}>
                <p className={styles.eyebrow}>What to decide next</p>
                <div className={styles.decisionDeck}>
                  {RUNGS.map((rung, index) => (
                    <p key={rung.label} data-active={index === activeIndex} aria-hidden={index !== activeIndex}>{rung.decision}</p>
                  ))}
                </div>
              </div>
              <BuyerMemoryScene stage={activeIndex} reducedMotion={prefersReducedMotion} />
              <div className={styles.systemResult}>
                <span>System to build</span>
                <strong>{activeRung.system}</strong>
              </div>
            </div>

            <div className={`${styles.copyDeck} ${styles.desktopCopy}`}>
              {copyPanels}
            </div>
            <details className={styles.mobileDetails}>
              <summary>Why this matters and evidence <Plus size={18} aria-hidden="true" /></summary>
              <div className={styles.copyDeck}>{copyPanels}</div>
            </details>
          </div>
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
