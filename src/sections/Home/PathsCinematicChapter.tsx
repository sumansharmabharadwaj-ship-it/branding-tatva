"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import {
  useEffect,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  SERVICES_SITUATION_CLEARED_EVENT,
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  isServicesSituation,
  publishServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

const PATHS = [
  {
    number: "01",
    situation: "idea",
    choice: "I have a strong offer but no brand yet.",
    shortChoice: "New brand",
    title: "Build the foundation",
    eyebrow: "An idea becoming a business",
    body:
      "Decide the category, priority buyer, promise, and proof before identity or launch work begins.",
    route: "Category / Buyer / Position",
    result: "A market position that makes later creative choices easier to judge.",
    tint: "#ad7336",
    proof: "MyShopInEurope chose craft and origin ahead of price before the platform entered the market.",
    evidenceBridge:
      "The case began before the market had a clear category signal. Foundation came before identity.",
  },
  {
    number: "02",
    situation: "reposition",
    choice: "The business has outgrown what the brand says about it.",
    shortChoice: "Outgrown",
    title: "Reposition the business",
    eyebrow: "An established business in transition",
    body:
      "Study what buyers still recognise, keep what earns trust, and replace the meaning that no longer fits the business.",
    route: "Audit / Keep / Reposition",
    result: "A brand that represents the business customers are buying today.",
    tint: "#667d63",
    proof: "HerbalCart moved from an accidental herbal frame to a modern supplement position.",
    evidenceBridge:
      "The case already had market activity. The immediate work was correcting the meaning buyers received.",
  },
  {
    number: "03",
    situation: "ongoing",
    choice: "Everything changes from channel to channel.",
    shortChoice: "Scale it",
    title: "Make the brand easier to use",
    eyebrow: "A brand moving across channels",
    body:
      "Turn the brand choices into usable rules for language, content, campaigns, websites, and teams.",
    route: "Write / Apply / Review",
    result: "A brand the team can use without returning every choice to the founder.",
    tint: "#bd8a3f",
    proof: "Dr. Haley Nutrition posted 48% less and earned 104% more followers per post.",
    evidenceBridge:
      "The case already had active channels. The next move was making every signal repeat one decision.",
  },
] as const satisfies ReadonlyArray<{
  number: string;
  situation: ServicesSituationId;
  choice: string;
  shortChoice: string;
  title: string;
  eyebrow: string;
  body: string;
  route: string;
  result: string;
  tint: string;
  proof: string;
  evidenceBridge: string;
}>;

const EASE = [0.22, 1, 0.36, 1] as const;
type CarriedPathSource = "diagnostic" | "evidence" | null;
const SITUATION_TO_INDEX: Record<ServicesSituationId, number> = {
  idea: 0,
  reposition: 1,
  ongoing: 2,
};

export function PathsCinematicChapter() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [committedIndex, setCommittedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [carriedFrom, setCarriedFrom] = useState<CarriedPathSource>(null);
  const activeIndex = previewIndex ?? committedIndex;
  const isPreviewing = previewIndex !== null && previewIndex !== committedIndex;
  const active = PATHS[activeIndex];

  useEffect(() => {
    function applySituation(value: string | null, source: CarriedPathSource) {
      if (!isServicesSituation(value)) return;
      setCommittedIndex(SITUATION_TO_INDEX[value]);
      setPreviewIndex(null);
      setCarriedFrom(source);
    }

    try {
      const completedDiagnosis = readCompletedHomeDiagnosis();
      if (completedDiagnosis) applySituation(completedDiagnosis, "diagnostic");
      else applySituation(window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY), null);
    } catch {}

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      const source = detail?.origin === "home_diagnostic"
        ? "diagnostic"
        : detail?.origin === "home_evidence"
          ? "evidence"
          : null;
      applySituation(detail?.situation ?? null, source);
    }

    function onSituationCleared() {
      setCommittedIndex(0);
      setPreviewIndex(null);
      setCarriedFrom(null);
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

  function choose(index: number, persist = true) {
    if (!persist) {
      setPreviewIndex(index);
      return;
    }
    setCommittedIndex(index);
    setPreviewIndex(null);
    setCarriedFrom(null);
    publishServicesSituation(PATHS[index].situation, "home_paths");
  }

  function onChoiceKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % PATHS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index + PATHS.length - 1) % PATHS.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = PATHS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    choose(next);
    document.getElementById(`path-film-tab-${PATHS[next].number}`)?.focus();
  }

  return (
    <section
      id="paths"
      data-active-path={active.situation}
      data-path-origin={carriedFrom ?? "direct"}
      className="paths-film home-scene"
      aria-labelledby="paths-film-title"
      style={{ "--paths-film-accent": active.tint } as CSSProperties}
    >
      <div className="paths-film__media" aria-hidden="true">
        <video
          muted
          loop
          playsInline
          preload="none"
          poster="/images/hero-goldendunes-poster.jpg"
          data-media-id="BT-HOME-PATHS-GOLDEN-DUNES"
          data-home-playback-rate="0.82"
          aria-hidden="true"
        >
          <source src="/videos/hero-goldendunes.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="paths-film__veil" aria-hidden="true" />

      <div className="paths-film__frame">
        <header className="paths-film__header">
          <div className="paths-film__chapter">
            <span>05</span>
            <p>Brand Strategy &amp; Systems</p>
          </div>
          <p className="paths-film__counter" aria-live="polite">
            {active.number} / 03
          </p>
        </header>

        <div className="paths-film__story">
          <div className="paths-film__lead">
            <p className="paths-film__eyebrow">Three business situations</p>
            <h2 id="paths-film-title">
              Which sentence sounds most like <em>your business today?</em>
            </h2>
            <p className="paths-film__instruction">
              The right engagement depends on what the business has already
              built and what buyers are currently misunderstanding.
            </p>

            <div className="paths-film__chooser">
              <div className="paths-film__chooser-label">
                <span>
                  {isPreviewing
                    ? "Previewing another starting point"
                    : carriedFrom === "diagnostic"
                      ? "Your 30 second diagnosis is carried forward"
                      : carriedFrom === "evidence"
                        ? "This path follows the case you selected"
                        : "Choose your starting point"}
                </span>
                <span>{active.choice}</span>
              </div>
              <div
                className="paths-film__choices"
                role="tablist"
                aria-label="Choose the service starting point that matches your brand"
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") setPreviewIndex(null);
                }}
              >
                {PATHS.map((path, index) => {
                  const displayed = index === activeIndex;
                  const committed = index === committedIndex;
                  return (
                    <button
                      key={path.number}
                      id={`path-film-tab-${path.number}`}
                      type="button"
                      role="tab"
                      aria-selected={committed}
                      aria-controls="path-active-panel"
                      tabIndex={committed ? 0 : -1}
                      onClick={() => choose(index)}
                      onFocus={() => choose(index, false)}
                      onKeyDown={(event) => onChoiceKeyDown(event, index)}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") choose(index, false);
                      }}
                      className={displayed ? "is-active" : undefined}
                      data-committed={committed ? "true" : undefined}
                      style={{ "--path-choice-accent": path.tint } as CSSProperties}
                    >
                      <span className="paths-film__choice-number">{path.number}</span>
                      <strong>{path.choice}</strong>
                      <span className="paths-film__choice-short" aria-hidden="true">
                        {path.shortChoice}
                      </span>
                      <span className="paths-film__choice-cue">
                        {displayed && isPreviewing ? "Preview" : committed ? "Chosen" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <AnimatePresence mode="sync" initial={false}>
            <motion.article
              key={active.number}
              id="path-active-panel"
              className="paths-film__answer"
              role="tabpanel"
              aria-labelledby={`path-film-tab-${active.number}`}
              data-path-state={isPreviewing ? "preview" : "chosen"}
              data-home-reading-plane
              initial={prefersReducedMotion ? false : { opacity: 0, x: 18, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -8, y: -8, filter: "blur(3px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
            >
              <p className="paths-film__answer-eyebrow">{active.eyebrow}</p>
              <h3>{active.title}</h3>
              <p className="paths-film__answer-body">{active.body}</p>
              <dl>
                <div>
                  <dt>What we decide</dt>
                  <dd>{active.route}</dd>
                </div>
                <div>
                  <dt>What changes</dt>
                  <dd>{active.result}</dd>
                </div>
              </dl>
              <AnimatePresence mode="sync" initial={false}>
                <motion.p
                  key={`${active.number}-${carriedFrom ?? "direct"}-${isPreviewing ? "preview" : "chosen"}`}
                  className="paths-film__proof"
                  data-proof-origin={carriedFrom === "evidence" && !isPreviewing ? "evidence" : "case"}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 5, filter: "blur(3px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4, filter: "blur(2px)" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: EASE }}
                >
                  {carriedFrom === "evidence" && !isPreviewing ? (
                    <>
                      <span>Why this path follows</span>
                      {active.evidenceBridge}
                    </>
                  ) : active.proof}
                </motion.p>
              </AnimatePresence>
              <Link
                className="paths-film__method-link"
                href="#process"
                data-section-jump-yield="true"
                onClick={() => choose(activeIndex)}
              >
                <span className="paths-film__method-link-copy">
                  <small>Next chapter</small>
                  See how Suman makes the decision
                </span>
                <span className="paths-film__method-link-arrow" aria-hidden="true">
                  <ArrowDown size={16} strokeWidth={1.8} />
                </span>
              </Link>
            </motion.article>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
