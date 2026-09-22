"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { packages } from "@/data/services";
import { SITUATION_KEY } from "@/sections/Home/VisitorRecognition";
import {
  HOME_TO_SERVICES_SITUATION,
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_CLEARED_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  isServicesSituation,
  publishServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import { track } from "@/lib/analytics";
import styles from "./SituationPath.module.css";

const OPTIONS: ReadonlyArray<{
  id: ServicesSituationId;
  shortLabel: string;
  label: string;
  decision: string;
  reason: string;
}> = [
  {
    id: "idea",
    shortLabel: "Idea",
    label: "I have a credible offer but no settled brand.",
    decision: "Give buyers a reason to choose.",
    reason: "Settle the buyer, category, and position first. Naming, language, identity, and the website can then express the same answer.",
  },
  {
    id: "reposition",
    shortLabel: "Reposition",
    label: "The business has outgrown the brand people still see.",
    decision: "Keep the trust. Change the reading.",
    reason: "Separate the cues buyers already trust from the ones that misrepresent the business. Rebuild the position, language, and identity around that distinction.",
  },
  {
    id: "ongoing",
    shortLabel: "Ongoing",
    label: "The brand changes every time the channel changes.",
    decision: "Make every channel sound like one brand.",
    reason: "Set verbal and visual rules, apply them to live work, and review what buyers encounter. Repeated decisions should build recognition over time.",
  },
];

function SituationSketch({ situation }: { situation: ServicesSituationId }) {
  if (situation === "idea") {
    return <div className={`${styles.sketch} ${styles.position}`} role="img" aria-label="Buyer, category, and reason to choose form one brand position">
      <div className={styles.positionInputs}>{["Buyer", "Category", "Reason to choose"].map((label, index) => <span key={label} style={{ "--sketch-index": index } as CSSProperties}>{label}</span>)}</div>
      <p>A position buyers can repeat.</p><span className={styles.positionLine} aria-hidden="true" />
    </div>;
  }
  if (situation === "reposition") {
    return <div className={`${styles.sketch} ${styles.reframe}`} role="img" aria-label="Keep the cues that earn trust and change the cues that misrepresent the business">
      <div><span>Keep</span><strong>The trust<br />already earned.</strong><i aria-hidden="true" /></div>
      <div><span>Change</span><strong>The cues that<br />hold you back.</strong><i aria-hidden="true" /></div>
    </div>;
  }
  return <div className={`${styles.sketch} ${styles.channels}`} role="img" aria-label="Website, content, and campaigns follow the same verbal and visual rules">
    {["Website", "Content", "Campaigns"].map((label, index) => <div key={label} style={{ "--sketch-index": index } as CSSProperties}><span>{label}</span><i aria-hidden="true"><b /><b /><b /></i></div>)}
    <p>One recognisable point of view.</p>
  </div>;
}

function settlePackageChapter(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  if (window.location.hash !== "#desire") window.history.pushState(window.history.state, "", "#desire");
  window.dispatchEvent(new CustomEvent("bt:services-anchor-settle", { detail: { id: "desire" } }));
}

export function SituationPath() {
  const [selected, setSelected] = useState<ServicesSituationId | null>(null);
  const [carried, setCarried] = useState(false);
  const [entered, setEntered] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const choiceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = useHydratedReducedMotion();
  const displayed = selected ?? OPTIONS[0].id;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      const saved = isServicesSituation(stored) ? stored : readCompletedHomeDiagnosis();
      const homeChoice = window.localStorage.getItem(SITUATION_KEY);
      const initial = saved ?? (homeChoice ? HOME_TO_SERVICES_SITUATION[homeChoice] : undefined);
      if (initial) {
        setSelected(initial);
        setCarried(true);
        publishServicesSituation(initial);
      }
    } catch {}

    // Package choices also update this earlier chapter when the visitor returns.
    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      if (!isServicesSituation(detail?.situation ?? null)) return;
      setSelected(detail.situation);
      if (detail.origin === "services_package") setCarried(false);
    }
    function onClear() { setSelected(null); setCarried(false); }
    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation);
    window.addEventListener(SERVICES_SITUATION_CLEARED_EVENT, onClear);
    return () => {
      window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation);
      window.removeEventListener(SERVICES_SITUATION_CLEARED_EVENT, onClear);
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setEntered(true);
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  function pick(id: ServicesSituationId) {
    setSelected(id);
    setCarried(false);
    publishServicesSituation(id);
    track("visitor_situation_selected", { situation: id, page: "services" });
  }

  function moveChoice(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" || event.key === "ArrowDown" ? (index + 1) % OPTIONS.length
      : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index + OPTIONS.length - 1) % OPTIONS.length
      : event.key === "Home" ? 0 : event.key === "End" ? OPTIONS.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    pick(OPTIONS[next].id);
    choiceRefs.current[next]?.focus({ preventScroll: true });
  }

  return (
    <Container className="max-w-6xl">
      <div ref={rootRef} className={styles.root} data-situation-card="true" data-situation-route={displayed}
        data-animate={entered && !prefersReducedMotion ? "true" : "false"}>
        <div className={styles.choicesColumn}>
          <p className={styles.eyebrow}>Your situation</p>
          <h2 className={styles.heading}>Where does the brand stand?</h2>
          <p className={styles.intro}>Choose the closest fit. Your choice carries into the scope, price, and client evidence.</p>
          <div className={styles.choices} role="radiogroup" aria-label="Choose your brand situation">
            {OPTIONS.map((option, index) => <button key={option.id} type="button" role="radio"
              ref={(element) => { choiceRefs.current[index] = element; }} aria-checked={selected === option.id}
              aria-controls={`situation-panel-${option.id}`} aria-label={`${option.shortLabel}: ${option.label}`}
              tabIndex={displayed === option.id ? 0 : -1} data-preview={displayed === option.id ? "true" : "false"}
              onClick={() => pick(option.id)} onKeyDown={(event) => moveChoice(event, index)}>
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <span className={styles.choiceCopy}><strong>{option.shortLabel}</strong><span>{option.label}</span></span>
              <span className={styles.check} aria-hidden="true">{selected === option.id ? "✓" : "↗"}</span>
            </button>)}
          </div>
          <p className={styles.status} aria-live="polite">{carried ? "Your earlier choice is selected. You can change it here." : selected ? "Your choice is carried through the page." : "Explore a starting point, then see the scope."}</p>
        </div>
        <div className={styles.panels}>
          {OPTIONS.map(option => {
            const active = displayed === option.id;
            const pkg = packages.find(entry => entry.slug === SITUATION_TO_PACKAGE[option.id]);
            if (!pkg) return null;
            return <section key={option.id} id={`situation-panel-${option.id}`} role="region" aria-labelledby={`situation-title-${option.id}`}
              className={styles.panel} data-active={active ? "true" : "false"} aria-hidden={!active} inert={!active}>
              <p className={styles.eyebrow}>The first decision</p>
              <h3 id={`situation-title-${option.id}`}>{option.decision}</h3>
              <p className={styles.reason}>{option.reason}</p>
              <SituationSketch situation={option.id} />
              <details key={displayed} className={styles.explanation}>
                <summary>Why start here <span aria-hidden="true">+</span></summary>
                <p>{option.label}</p><p>{option.reason}</p>
              </details>
              <div className={styles.next}>
                <p><span>Matching engagement</span><strong>{pkg.name}</strong></p>
                <Link href="#desire" onClick={event => {
                  // Following the default preview also commits that route so
                  // packages, proof and the booking brief agree on the choice.
                  if (selected !== option.id) pick(option.id);
                  settlePackageChapter(event);
                }}>See scope and price <span aria-hidden="true">→</span></Link>
              </div>
            </section>;
          })}
        </div>
      </div>
    </Container>
  );
}
