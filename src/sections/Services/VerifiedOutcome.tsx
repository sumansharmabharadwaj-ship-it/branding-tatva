"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import { projects } from "@/data/projects";
import { packages } from "@/data/services";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_CLEARED_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  SITUATION_TO_PROOF_SLUG,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import styles from "./VerifiedOutcome.module.css";

// All quantities and delivery stages below come from data/projects.ts.
// Monthly counts are shown directly, without deriving a percentage claim.
const PROOF_ROUTES = {
  idea: {
    routeLabel: "Building a new brand",
    headline: "A reason to choose, before the launch spend.",
    value: "4",
    label: "quarters mapped from foundation to market position",
    resultLabel: "Documented delivery",
    record: "A complete brand foundation, content pillars, channel playbooks, and a rollout plan across four quarters. Each phase had a defined role in establishing the brand.",
    stages: ["Brand foundation", "Audience pull", "Lead quality", "Market position"],
  },
  reposition: {
    routeLabel: "Repositioning an established business",
    headline: "A category choice that changed the campaign.",
    value: "5",
    label: "content formats ready to shoot after the campaign reset",
    resultLabel: "Documented delivery",
    record: "Repositioned content themes, five formats ready to shoot, and complete Hinglish video scripts. The campaign gave HerbalCart a clear supplement category to communicate.",
    stages: ["Product comparisons", "Supplement explainers", "DIY recipes", "Real user stories", "Reaction reviews"],
  },
  ongoing: {
    routeLabel: "Keeping channels consistent",
    headline: "Fewer posts. A clearer reason to follow.",
    value: "126",
    label: "new Instagram followers from 12 posts in January",
    resultLabel: "Recorded result",
    record: "Instagram gained 126 new followers from 12 posts in January 2026. December 2025 had brought 111 new followers from 23 posts. The record shows what changed when each post had to earn its place.",
    stages: [],
  },
} satisfies Record<ServicesSituationId, {
  routeLabel: string; headline: string; value: string; label: string;
  resultLabel: string; record: string; stages: string[];
}>;

const TABS = ["Context", "Decision", "Record"];
const MONTHLY_RECORD = [
  { month: "December 2025", posts: 23, followers: 111 },
  { month: "January 2026", posts: 12, followers: 126 },
] as const;
const MEASURES = [
  { key: "posts", label: "Posts" },
  { key: "followers", label: "New followers" },
] as const;
// Each measure shares one scale across months. Posts and followers have
// different units, so neither is presented as a percentage of the other.
const MEASURE_MAXIMUM = {
  posts: Math.max(...MONTHLY_RECORD.map(month => month.posts)),
  followers: Math.max(...MONTHLY_RECORD.map(month => month.followers)),
};

export function VerifiedOutcome() {
  const [activeBeat, setActiveBeat] = useState(0);
  const [situation, setSituation] = useState<ServicesSituationId | null>(null);
  const [entered, setEntered] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = useHydratedReducedMotion();
  const route = situation ?? "ongoing";
  const proofRoute = PROOF_ROUTES[route];
  const proof = projects.find((project) => project.slug === SITUATION_TO_PROOF_SLUG[route]);
  const selectedPackageSlug = situation ? SITUATION_TO_PACKAGE[situation] : null;
  const selectedPackage = packages.find((entry) => entry.slug === selectedPackageSlug);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
      setSituation(isServicesSituation(stored) ? stored : readCompletedHomeDiagnosis());
    } catch {
      setSituation(null);
    }
    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      if (isServicesSituation(detail?.situation)) setSituation(detail.situation);
    }
    function onClear() { setSituation(null); }
    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation);
    window.addEventListener(SERVICES_SITUATION_CLEARED_EVENT, onClear);
    return () => {
      window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation);
      window.removeEventListener(SERVICES_SITUATION_CLEARED_EVENT, onClear);
    };
  }, []);

  // A single finite entrance. Reading state never follows scroll progress,
  // timers or a change to the visitor's motion preference.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setEntered(true);
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  if (!proof) return null;
  const beats = [
    { title: "What the business faced", text: proof.challenge },
    { title: "The choice behind the work", text: route === "reposition"
      ? "The campaign reframed HerbalCart as a modern supplement brand. Product comparisons, practical explainers, recipes, real user stories, and reviews gave that category choice a recognisable form."
      : proof.strategy ?? proof.outcome },
    { title: proofRoute.resultLabel, text: proofRoute.record },
  ];

  function chooseBeat(index: number) {
    setActiveBeat(index);
    track("verified_proof_beat_selected", {
      beat: index + 1, route: situation ?? "unselected", project: SITUATION_TO_PROOF_SLUG[route],
    });
  }

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % TABS.length
      : event.key === "ArrowLeft" ? (index + TABS.length - 1) % TABS.length
      : event.key === "Home" ? 0 : event.key === "End" ? TABS.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    chooseBeat(next);
    tabsRef.current[next]?.focus({ preventScroll: true });
  }

  return (
    <Container className="max-w-6xl">
      <div ref={frameRef} className={styles.root} data-evidence-card="true"
        data-proof-route={situation ?? "default"} data-evidence-step={activeBeat}
        data-animate={entered && !prefersReducedMotion ? "true" : "false"}>
        <div className={styles.overview}>
          <p className={styles.eyebrow}>Client evidence <span aria-hidden="true">/</span> {proofRoute.resultLabel}</p>
          <p className={styles.client}>{proof.title}</p>
          <h2 className={styles.heading}>{proofRoute.headline}</h2>
          <p className={styles.route}>{proofRoute.routeLabel}</p>
          <div className={styles.metric}>
            <strong>{proofRoute.value}</strong><span>{proofRoute.label}</span>
          </div>
          {route === "ongoing" ? (
            <div className={styles.months} role="group" aria-label="Instagram posting and follower record">
              {MONTHLY_RECORD.map((month, index) => (
                <div key={month.month} className={styles.month} role="group" aria-labelledby={`evidence-month-${index}`}>
                  <p id={`evidence-month-${index}`}>{month.month}</p>
                  {MEASURES.map((measure, measureIndex) => (
                    <div key={measure.key} className={styles.measure} data-evidence-measure={measure.key}>
                      <p><span>{measure.label}</span><strong>{month[measure.key]}</strong></p>
                      <div className={styles.barTrack} aria-hidden="true">
                        <span style={{
                          width: `${month[measure.key] / MEASURE_MAXIMUM[measure.key] * 100}%`,
                          "--evidence-index": index * MEASURES.length + measureIndex,
                        } as CSSProperties} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <ol className={styles.stages} aria-label={route === "idea" ? "Quarterly rollout" : "Delivered content formats"}>
              {proofRoute.stages.map((stage, index) => (
                <li key={stage} style={{ "--evidence-index": index } as CSSProperties}>
                  <span>{route === "idea" ? `Q${index + 1}` : String(index + 1).padStart(2, "0")}</span>{stage}
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className={styles.story}>
          <p className={styles.eyebrow}>Read the case</p>
          <div className={styles.tabs} role="tablist" aria-orientation="horizontal" aria-label={`${proof.title} case study`}>
            {TABS.map((label, index) => (
              <button key={label} ref={(element) => { tabsRef.current[index] = element; }}
                type="button" role="tab" id={`evidence-tab-${index}`} aria-controls={`evidence-panel-${index}`}
                aria-selected={activeBeat === index} tabIndex={activeBeat === index ? 0 : -1}
                onClick={() => chooseBeat(index)} onKeyDown={(event) => navigateTabs(event, index)}>
                <span aria-hidden="true">0{index + 1}</span>{label}
              </button>
            ))}
          </div>
          <div className={styles.panels}>
            {beats.map((beat, index) => (
              <div key={index} id={`evidence-panel-${index}`} role="tabpanel" aria-labelledby={`evidence-tab-${index}`}
                tabIndex={activeBeat === index ? 0 : -1} aria-hidden={activeBeat !== index} inert={activeBeat !== index}
                data-active={activeBeat === index ? "true" : "false"} className={styles.panel}>
                <h3>{beat.title}</h3><p>{beat.text}</p>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <Link href={`/work/${proof.slug}`} className={styles.record}>Read the full project <span aria-hidden="true">↗</span></Link>
            <Link href="#book" className={styles.discuss} onClick={() => track("contextual_cta_clicked", {
              source: "verified_outcome", route: situation ?? "unselected", package: selectedPackageSlug ?? "unselected",
            })}>{selectedPackage ? `Discuss ${selectedPackage.name}` : "Book a brand diagnosis"}<span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
