"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  HOME_METHOD_DECISION_EVENT,
  readHomeMethodDecision,
  type HomeMethodDecision,
  type HomeMethodDecisionDetail,
  type HomeMethodStage,
} from "@/lib/homeMethodJourney";
import {
  HOME_STUDIO_LENSES,
  publishHomeStudioLens,
} from "@/lib/homeStudioJourney";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

const DISCIPLINES = [
  {
    number: "01",
    name: "Psychology",
    credential: "Applied psychology",
    verb: "reads people",
    title: "Notice the hesitation before it becomes an objection.",
    line: "Psychology helps examine attention, association, memory, and choice without pretending buyers behave like survey answers.",
    signal: "The choice stalls before the objection is spoken.",
    move: "Name the hidden tension.",
    decision: "Build the position around the belief that must change.",
    outcome: "Buyer tension and perception map",
    questionFrame: HOME_STUDIO_LENSES[0].question,
    proof: "Applied in HerbalCart",
    proofHref: "/work/herbalcart",
    video: "/videos/pexels-fog-sunrise.mp4",
    poster: "/images/pexels-fog-sunrise-poster.jpg",
    accent: HOME_STUDIO_LENSES[0].accent,
  },
  {
    number: "02",
    name: "Literature",
    credential: "Applied literature",
    verb: "shapes meaning",
    title: "Give a strategic choice language people can repeat.",
    line: "Voice, narrative, rhythm and symbolism give the idea a form people can recognise, repeat and remember.",
    signal: "The strategy makes sense in the room, then leaves no memory.",
    move: "Give the choice rhythm, metaphor and voice.",
    decision: "Turn the position into a story people can repeat.",
    outcome: "Verbal identity and narrative spine",
    questionFrame: HOME_STUDIO_LENSES[1].question,
    proof: "Applied in MyShopInEurope",
    proofHref: "/work/myshopineurope",
    video: "/videos/pexels-studio-morning-light.mp4",
    poster: "/images/pexels-studio-morning-light-poster.jpg",
    accent: HOME_STUDIO_LENSES[1].accent,
  },
  {
    number: "03",
    name: "Strategy",
    credential: "Founder direction",
    verb: "makes both useful",
    title: "Make the insight usable long after the room goes quiet.",
    line: "Positioning, identity, website, content and campaigns move as one system led directly by Suman.",
    signal: "Every output looks considered; together they drift.",
    move: "Set one governing decision.",
    decision: "Align identity, website, content and campaigns to it.",
    outcome: "One decision the business can keep applying",
    questionFrame: HOME_STUDIO_LENSES[2].question,
    proof: "Applied in Dr. Haley Nutrition",
    proofHref: "/work/dr-haley-nutrition",
    video: "/videos/pexels-aspen-sunburst.mp4",
    poster: "/images/pexels-aspen-sunburst-poster.jpg",
    accent: HOME_STUDIO_LENSES[2].accent,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const STUDIO_SCROLL_QUERY = "(min-width: 1101px) and (min-height: 700px) and (pointer: fine)";
const METHOD_TO_LENS: Record<HomeMethodStage, { index: number; bridge: string }> = {
  Question: {
    index: 0,
    bridge: "Psychology separates a real belief from the language a business feels expected to use.",
  },
  Decode: {
    index: 0,
    bridge: "Psychology reads behaviour and perception before the room settles for opinion.",
  },
  Architect: {
    index: 2,
    bridge: "Strategy turns evidence into one position that governs every later choice.",
  },
  Signal: {
    index: 1,
    bridge: "Literature gives the position rhythm, voice and symbols people can remember.",
  },
  Influence: {
    index: 1,
    bridge: "Literature keeps the same meaning intact across public expression.",
  },
  Compound: {
    index: 2,
    bridge: "Strategy governs the signals that keep earning recognition after launch.",
  },
};

type ManualMode = "none" | "pointer" | "focus";

export function StudioCinematicChapter() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const manualModeRef = useRef<ManualMode>("none");
  const methodLensIndexRef = useRef(0);
  const syncStageRef = useRef<() => void>(() => {});
  const [activeIndex, setActiveIndex] = useState(0);
  const [committedIndex, setCommittedIndex] = useState(0);
  const [carriedMethodDecision, setCarriedMethodDecision] = useState<HomeMethodDecision | null>(null);
  const active = DISCIPLINES[activeIndex];
  const methodMatch = carriedMethodDecision
    ? METHOD_TO_LENS[carriedMethodDecision.stage]
    : null;
  const matchedLensIndex = methodMatch?.index ?? null;
  const activeMatchesMethod = matchedLensIndex === activeIndex;

  useEffect(() => {
    function applyDecision(decision: HomeMethodDecision | null) {
      setCarriedMethodDecision(decision);
      if (!decision) {
        methodLensIndexRef.current = 0;
        return;
      }
      const next = METHOD_TO_LENS[decision.stage].index;
      methodLensIndexRef.current = next;
      manualModeRef.current = "none";
      setCommittedIndex(next);
      setActiveIndex(next);
    }

    applyDecision(readHomeMethodDecision());

    function onMethodDecision(event: Event) {
      const detail = (event as CustomEvent<HomeMethodDecisionDetail>).detail;
      applyDecision(detail?.decision ?? null);
    }

    window.addEventListener(HOME_METHOD_DECISION_EVENT, onMethodDecision as EventListener);
    return () => {
      window.removeEventListener(HOME_METHOD_DECISION_EVENT, onMethodDecision as EventListener);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const runway = section?.closest<HTMLElement>('[data-home-v4-chapter="studio"]');
    if (!section || !runway) return;
    const runwayElement = runway;

    const eligible = window.matchMedia(STUDIO_SCROLL_QUERY);
    let frame = 0;

    function syncStage() {
      if (reducedMotion || !eligible.matches) return;
      if (manualModeRef.current === "focus") return;
      if (manualModeRef.current === "pointer") manualModeRef.current = "none";

      const bounds = runwayElement.getBoundingClientRect();
      const travel = Math.max(1, bounds.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      const offset = Math.min(DISCIPLINES.length - 1, Math.floor(progress * DISCIPLINES.length));
      const next = (methodLensIndexRef.current + offset) % DISCIPLINES.length;
      setCommittedIndex((current) => current === next ? current : next);
      setActiveIndex((current) => current === next ? current : next);
    }

    function scheduleScrollStage() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncStage);
    }

    syncStageRef.current = syncStage;
    scheduleScrollStage();
    window.addEventListener("scroll", scheduleScrollStage, { passive: true });
    window.addEventListener("resize", scheduleScrollStage);
    eligible.addEventListener("change", scheduleScrollStage);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleScrollStage);
      window.removeEventListener("resize", scheduleScrollStage);
      eligible.removeEventListener("change", scheduleScrollStage);
      syncStageRef.current = () => {};
    };
  }, [reducedMotion]);

  function choose(index: number) {
    manualModeRef.current = "none";
    setCommittedIndex(index);
    setActiveIndex(index);
  }

  function previewFromPointer(event: ReactPointerEvent<HTMLButtonElement>, index: number) {
    if (event.pointerType !== "mouse" || document.activeElement === event.currentTarget) return;
    manualModeRef.current = "pointer";
    setActiveIndex(index);
  }

  function releasePointerPreview(event: ReactPointerEvent<HTMLButtonElement>) {
    if (manualModeRef.current !== "pointer" || document.activeElement === event.currentTarget) return;
    manualModeRef.current = "none";
    setActiveIndex(committedIndex);
  }

  function previewFromFocus(index: number) {
    manualModeRef.current = "focus";
    setCommittedIndex(index);
    setActiveIndex(index);
  }

  function releaseFocusPreview() {
    if (manualModeRef.current !== "focus") return;
    manualModeRef.current = "none";
    setActiveIndex(committedIndex);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % DISCIPLINES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + DISCIPLINES.length - 1) % DISCIPLINES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = DISCIPLINES.length - 1;
    else return;
    event.preventDefault();
    manualModeRef.current = "focus";
    setCommittedIndex(next);
    setActiveIndex(next);
    document.getElementById(`studio-film-tab-${next}`)?.focus();
  }

  return (
    <section
      ref={sectionRef}
      className="studio-film"
      aria-labelledby="studio-film-title"
      data-scroll-story="studio-disciplines"
      data-studio-stage={active.number}
      data-method-lens={matchedLensIndex === null ? undefined : DISCIPLINES[matchedLensIndex].name}
      style={{ "--studio-film-accent": active.accent } as CSSProperties}
    >
      <div className="studio-film__media" aria-hidden="true">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={active.video}
            className="studio-film__shot"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.62, ease: EASE }}
          >
            <video
              src={active.video}
              poster={active.poster}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="studio-film__wash" aria-hidden="true" />

      <div className="studio-film__frame">
        <header className="studio-film__topline">
          <span>07 · The thinking behind the work</span>
          <span>Led directly by Suman Sharma</span>
        </header>

        <div className="studio-film__body">
          <div className="studio-film__statement">
            <p>Three disciplines, used by one strategist</p>
            <h2 id="studio-film-title">
              <AnimatePresence mode="sync" initial={false}>
                <motion.span
                  key={active.name}
                  className="is-active"
                  initial={reducedMotion ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(3px)" }}
                  transition={{ duration: reducedMotion ? 0 : 0.42, ease: EASE }}
                >
                  {active.name} <em>{active.verb}.</em>
                </motion.span>
              </AnimatePresence>
            </h2>
          </div>

          <AnimatePresence mode="sync" initial={false}>
            <motion.article
              key={active.name}
              id="studio-film-panel"
              role="tabpanel"
              aria-labelledby={`studio-film-tab-${activeIndex}`}
              className="studio-film__reading"
              data-home-reading-plane
              initial={reducedMotion ? false : { opacity: 0, x: 14, y: 5, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
              exit={reducedMotion ? undefined : { opacity: 0, x: -7, y: -5, filter: "blur(3px)" }}
              transition={{ duration: reducedMotion ? 0 : 0.34, ease: EASE }}
              aria-live={manualModeRef.current === "focus" ? "polite" : "off"}
            >
              <div className="studio-film__reading-label">
                <span>{active.number}</span>
                <strong>{active.name}</strong>
                <small>
                  {activeMatchesMethod && carriedMethodDecision
                    ? `From ${carriedMethodDecision.stage}`
                    : active.credential}
                </small>
              </div>
              <h3>{active.title}</h3>
              <p>{activeMatchesMethod && methodMatch ? methodMatch.bridge : active.line}</p>
              <ol className="studio-film__synthesis" aria-label={`${active.name} from human signal to brand decision`}>
                {[
                  ["What the buyer is doing", active.signal],
                  [`${active.name} move`, active.move],
                  ["What the brand should do", active.decision],
                ].map(([label, value], index) => (
                  <motion.li
                    key={label}
                    initial={reducedMotion ? false : { opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.4,
                      delay: reducedMotion ? 0 : 0.07 + index * 0.07,
                      ease: EASE,
                    }}
                  >
                    <span className="studio-film__synthesis-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  </motion.li>
                ))}
              </ol>
              <div className="studio-film__outcome"><span>What this produces</span><strong>{active.outcome}</strong></div>
              <div className="studio-film__reading-actions">
                <Link href={active.proofHref}>
                  {active.proof} <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
                </Link>
                <Link
                  href="#decision"
                  data-section-jump-yield="true"
                  onClick={() => publishHomeStudioLens({
                    name: active.name,
                    question: active.questionFrame,
                    accent: active.accent,
                  })}
                >
                  Carry {active.name} into your question
                  <ArrowDown size={15} strokeWidth={1.8} aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="studio-film__footer">
          <div className="studio-film__selector">
            <div className="studio-film__selector-label">
              <span>
                {carriedMethodDecision && matchedLensIndex !== null
                  ? `${carriedMethodDecision.stage} · ${DISCIPLINES[matchedLensIndex].name} lens`
                  : "Three disciplines · one decision system"}
              </span>
              <span>{active.number} / 03</span>
            </div>
            <div className="studio-film__chapters" role="tablist" aria-label="Choose one of Suman's three disciplines">
            {DISCIPLINES.map((discipline, index) => {
              const displayed = index === activeIndex;
              const committed = index === committedIndex;
              const matched = index === matchedLensIndex;
              return (
                <button
                  key={discipline.name}
                  id={`studio-film-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={committed}
                  aria-controls="studio-film-panel"
                  tabIndex={committed ? 0 : -1}
                  className={displayed ? "is-active" : undefined}
                  data-studio-state={displayed ? "active" : committed ? "committed" : "idle"}
                  data-method-match={matched ? "true" : undefined}
                  aria-label={`${discipline.name}: ${discipline.verb}${matched && carriedMethodDecision ? `, matched to ${carriedMethodDecision.stage}` : ""}`}
                  style={{ "--studio-chapter-accent": discipline.accent } as CSSProperties}
                  onClick={() => choose(index)}
                  onPointerEnter={(event) => previewFromPointer(event, index)}
                  onPointerLeave={releasePointerPreview}
                  onFocus={() => previewFromFocus(index)}
                  onBlur={releaseFocusPreview}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  <span>{discipline.number}</span>
                  <strong>{discipline.name}</strong>
                  <small>
                    {matched && carriedMethodDecision
                      ? `For ${carriedMethodDecision.stage}`
                      : discipline.verb}
                  </small>
                </button>
              );
            })}
            </div>
          </div>
          <Link href="/about" className="studio-film__about">
            Meet the strategist <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
