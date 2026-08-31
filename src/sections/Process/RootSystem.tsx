"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { ProcessStage } from "@/data/process";
import {
  clearHomeMethodDecision,
  publishHomeMethodDecision,
} from "@/lib/homeMethodJourney";
import {
  SERVICES_SITUATION_CLEARED_EVENT,
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

type StageMeta = {
  becomes: string;
  explanation: string;
  output: string;
  prevents: string;
};

const STAGE_META: StageMeta[] = [
  {
    becomes: "A truth worth building on.",
    explanation:
      "The business truth, intended audience, and contradictions in the current language come into view before expression begins.",
    output: "Strategic diagnosis + founder truth map",
    prevents: "A polished brand built on borrowed assumptions.",
  },
  {
    becomes: "A pattern drawn from evidence.",
    explanation:
      "Customer behaviour, category codes, and competitor habits are read together until the real tension becomes visible.",
    output: "Audience tensions + category and perception map",
    prevents: "Strategy decided by the loudest opinion in the room.",
  },
  {
    becomes: "One defensible position.",
    explanation:
      "The brand commits to the idea it can own, the promise it can keep, and the choices it will refuse.",
    output: "Positioning system + narrative spine",
    prevents: "A brand with many messages and no position.",
  },
  {
    becomes: "A recognisable expression.",
    explanation:
      "Voice, identity, and messaging take the shape the strategy demands, while staying recognisably part of one system.",
    output: "Verbal identity + design direction + message system",
    prevents: "An identity nobody can recognise twice.",
  },
  {
    becomes: "A brand people can encounter.",
    explanation:
      "Strategy enters the website, content, campaigns, and selling moments where an audience can actually meet it.",
    output: "Launch ecosystem + channel playbooks",
    prevents: "A strategy that never survives contact with the market.",
  },
  {
    becomes: "Recognition that keeps earning.",
    explanation:
      "The strongest signals are measured, repeated, governed, and improved after launch so recognition can compound.",
    output: "Brand governance + recognition roadmap",
    prevents: "Campaigns that disappear when the spend stops.",
  },
];

const ELEMENT_COLORS: Record<string, string> = {
  Air: "#7f9274",
  Fire: "#b77547",
  Earth: "#b46b4d",
  Water: "#5f8790",
  Space: "#9f7066",
};

const EASE = [0.22, 1, 0.36, 1] as const;
const FINE_POINTER_QUERY = "(min-width: 901px) and (hover: hover) and (pointer: fine)";
const FIRST_BEAT_MS = 4400;
const AMBIENT_BEAT_MS = 6200;
const MANUAL_HOLD_MS = 14000;
const SITUATION_TO_STAGE: Record<ServicesSituationId, number> = {
  idea: 0,
  reposition: 1,
  ongoing: 4,
};
const SITUATION_LABEL: Record<ServicesSituationId, string> = {
  idea: "New brand",
  reposition: "Repositioning",
  ongoing: "Repeatable system",
};
const SITUATION_PATH_REASON: Record<ServicesSituationId, string> = {
  idea: "A new brand begins by naming the truth every later expression must carry.",
  reposition: "Repositioning begins by decoding the signals the market already reads.",
  ongoing: "A repeatable system begins where strategy enters real channels and selling moments.",
};

function fallbackMeta(): StageMeta {
  return {
    becomes: "A clearer decision.",
    explanation: "Each stage removes a different kind of ambiguity before the next layer is built.",
    output: "A committed decision the next stage can use",
    prevents: "Work that looks finished while the underlying decision is unresolved.",
  };
}

export function RootSystem({ stages }: { stages: ProcessStage[] }) {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, margin: "8% 0px -10% 0px" });
  const [active, setActive] = useState(0);
  const [committedStage, setCommittedStage] = useState(0);
  const [finePointer, setFinePointer] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [selectorEngaged, setSelectorEngaged] = useState(false);
  const [manualHoldUntil, setManualHoldUntil] = useState(0);
  const [carriedSituation, setCarriedSituation] = useState<ServicesSituationId | null>(null);
  const firstBeatRef = useRef(true);

  useEffect(() => {
    function applySituation(value: string | null) {
      if (!isServicesSituation(value)) return;
      const situationStage = SITUATION_TO_STAGE[value];
      setCarriedSituation(value);
      setActive(situationStage);
      setCommittedStage(situationStage);
      setManualHoldUntil(Date.now() + MANUAL_HOLD_MS);
      publishHomeMethodDecision(situationStage, "path_entry");
      firstBeatRef.current = true;
    }

    try {
      const completedDiagnosis = readCompletedHomeDiagnosis();
      if (completedDiagnosis) applySituation(completedDiagnosis);
      else applySituation(window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY));
    } catch {}

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      applySituation(detail?.situation ?? null);
    }

    function onSituationCleared() {
      setCarriedSituation(null);
      setActive(0);
      setCommittedStage(0);
      setManualHoldUntil(0);
      clearHomeMethodDecision();
      firstBeatRef.current = true;
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    window.addEventListener(SERVICES_SITUATION_CLEARED_EVENT, onSituationCleared);
    return () => {
      window.removeEventListener(
        SERVICES_SITUATION_EVENT,
        onSituation as EventListener,
      );
      window.removeEventListener(SERVICES_SITUATION_CLEARED_EVENT, onSituationCleared);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER_QUERY);
    const syncPointer = () => setFinePointer(media.matches);
    syncPointer();
    media.addEventListener("change", syncPointer);
    return () => media.removeEventListener("change", syncPointer);
  }, []);

  useEffect(() => {
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    if (!inView) firstBeatRef.current = true;
  }, [inView]);

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !finePointer ||
      !inView ||
      !pageVisible ||
      selectorEngaged ||
      stages.length < 2
    ) {
      return;
    }

    const remainingHold = Math.max(0, manualHoldUntil - Date.now());
    if (remainingHold > 0) {
      const holdTimer = window.setTimeout(() => setManualHoldUntil(0), remainingHold + 40);
      return () => window.clearTimeout(holdTimer);
    }
    if (manualHoldUntil !== 0) {
      setManualHoldUntil(0);
      return;
    }

    const delay = firstBeatRef.current ? FIRST_BEAT_MS : AMBIENT_BEAT_MS;
    const beatTimer = window.setTimeout(() => {
      firstBeatRef.current = false;
      setActive((current) => (current + 1) % stages.length);
    }, delay);

    return () => window.clearTimeout(beatTimer);
  }, [finePointer, inView, manualHoldUntil, pageVisible, prefersReducedMotion, selectorEngaged, stages.length, active]);

  if (stages.length === 0) return null;

  const stage = stages[active] ?? stages[0];
  const meta = STAGE_META[active] ?? fallbackMeta();
  const accent = ELEMENT_COLORS[stage.element] ?? "#9b7457";
  const pathEntryIndex = carriedSituation === null ? null : SITUATION_TO_STAGE[carriedSituation];
  const pathEntryStage = pathEntryIndex === null ? null : stages[pathEntryIndex] ?? stages[0];
  const sectionStyle = {
    "--decision-accent": accent,
    "--decision-beat": `${firstBeatRef.current ? FIRST_BEAT_MS : AMBIENT_BEAT_MS}ms`,
    "--decision-progress": (active + 0.5) / stages.length,
  } as CSSProperties;
  const ambientMotion =
    !prefersReducedMotion &&
    finePointer &&
    inView &&
    pageVisible &&
    !selectorEngaged &&
    manualHoldUntil === 0;

  function chooseStage(index: number, commit = false) {
    const next = ((index % stages.length) + stages.length) % stages.length;
    if (commit) {
      firstBeatRef.current = true;
      setManualHoldUntil(Date.now() + MANUAL_HOLD_MS);
      setCommittedStage(next);
      publishHomeMethodDecision(next, "method_selection");
    }
    setActive(next);
  }

  function onStageKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % stages.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + stages.length - 1) % stages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else return;

    event.preventDefault();
    chooseStage(next, true);
    document.getElementById(`decision-flow-tab-${next}`)?.focus();
  }

  function holdForReading() {
    firstBeatRef.current = true;
    setManualHoldUntil(Date.now() + MANUAL_HOLD_MS);
  }

  function moveLight(event: PointerEvent<HTMLElement>) {
    if (prefersReducedMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--decision-pointer-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--decision-pointer-y", `${y.toFixed(2)}%`);
  }

  function resetLight(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.removeProperty("--decision-pointer-x");
    event.currentTarget.style.removeProperty("--decision-pointer-y");
  }

  return (
    <section
      ref={sectionRef}
      data-project-journey="true"
      data-scroll-story="process"
      data-method-motion={ambientMotion ? "ambient" : "held"}
      data-method-stage={active + 1}
      data-path-entry-stage={pathEntryIndex === null ? undefined : pathEntryIndex + 1}
      className={`decision-flow ${inView ? "is-awake" : "is-resting"}`}
      style={sectionStyle}
      aria-labelledby="decision-flow-title"
      onPointerMove={moveLight}
      onPointerDown={holdForReading}
      onPointerLeave={resetLight}
    >
      <div className="decision-flow__media" aria-hidden="true" data-media-id="BT-HOME-METHOD-STREAM-LIGHT">
        <video
          src="/videos/pixabay-stream-mist-rays.mp4"
          poster="/images/pixabay-stream-mist-rays-poster.jpg"
          aria-hidden="true"
          muted
          loop
          playsInline
          preload="none"
          data-home-playback-rate="0.72"
        />
        <span className="decision-flow__veil" />
        <span className="decision-flow__light" />
      </div>

      <div className="decision-flow__shell">
        <header className="decision-flow__header">
          <div>
            <p>
              06 · The method
              {carriedSituation ? ` · ${SITUATION_LABEL[carriedSituation]} path` : ""}
            </p>
            <h2 id="decision-flow-title">
              Six decisions. <em>One recognisable system.</em>
            </h2>
          </div>
          {carriedSituation && pathEntryIndex !== null && pathEntryStage ? (
            <aside className="decision-flow__path-brief">
              <span>Path carried forward</span>
              <strong>
                {SITUATION_LABEL[carriedSituation]} begins at Decision {String(pathEntryIndex + 1).padStart(2, "0")}
              </strong>
              <p>{SITUATION_PATH_REASON[carriedSituation]}</p>
              {active === pathEntryIndex ? (
                <small>Starting here</small>
              ) : (
                <button type="button" onClick={() => chooseStage(pathEntryIndex, true)}>
                  Return to {pathEntryStage.stage}
                </button>
              )}
            </aside>
          ) : (
            <p>
              Each choice gives the next one somewhere solid to begin. Expression waits until the decision beneath it is clear.
            </p>
          )}
        </header>

        <div className="decision-flow__stage">
          <AnimatePresence mode="sync" initial={false}>
            <motion.article
              key={`${active}-${stage.stage}`}
              id="decision-flow-panel"
              role="tabpanel"
              aria-labelledby={`decision-flow-tab-${active}`}
              aria-live={selectorEngaged ? "polite" : "off"}
              data-home-reading-plane
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.62, ease: EASE }}
            >
              <div className="decision-flow__topline">
                <span>Decision {String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>
                <span>{stage.element}</span>
              </div>
              <p className="decision-flow__stage-name">{stage.stage}</p>
              <h3>{meta.becomes}</h3>
              <p className="decision-flow__explanation">{meta.explanation}</p>
              <dl className="decision-flow__result">
                <div>
                  <dt>Leaves you with</dt>
                  <dd>{meta.output}</dd>
                </div>
                <div>
                  <dt>So you avoid</dt>
                  <dd>{meta.prevents}</dd>
                </div>
              </dl>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="decision-flow__selector">
          <div className="decision-flow__selector-label">
            <span>
              {carriedSituation && pathEntryStage
                ? `Your path begins at ${pathEntryStage.stage}`
                : "The six decisions"}
            </span>
            <Link
              href="#studio"
              onClick={() => chooseStage(active, true)}
              aria-label={`Carry Decision ${active + 1}, ${stage.stage}, into the thinking behind the work`}
            >
              Carry Decision {String(active + 1).padStart(2, "0")} forward
              <ArrowDown size={13} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
          <div
            className="decision-flow__rail"
            role="tablist"
            aria-label="Choose a decision in the Branding Tatva method"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setSelectorEngaged(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "mouse") return;
              setActive(committedStage);
              setSelectorEngaged(false);
            }}
            onFocusCapture={() => setSelectorEngaged(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setSelectorEngaged(false);
            }}
          >
            {stages.map((item, index) => {
              const displayed = active === index;
              const committed = committedStage === index;
              const pathEntry = pathEntryIndex === index;
              return (
                <button
                  key={item.stage}
                  id={`decision-flow-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={committed}
                  aria-controls="decision-flow-panel"
                  tabIndex={committed ? 0 : -1}
                  className={displayed ? "is-active" : undefined}
                  data-committed={committed ? "true" : undefined}
                  data-path-entry={pathEntry ? "true" : undefined}
                  aria-label={`${item.stage}${pathEntry && carriedSituation ? `, ${SITUATION_LABEL[carriedSituation]} path entry` : ""}`}
                  onClick={() => chooseStage(index, true)}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    firstBeatRef.current = true;
                    chooseStage(index);
                  }}
                  onFocus={() => chooseStage(index, true)}
                  onKeyDown={(event) => onStageKeyDown(event, index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.stage}</strong>
                  <small className="decision-flow__rail-cue">
                    {pathEntry ? "Entry" : committed ? "Chosen" : ""}
                  </small>
                  <i aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
