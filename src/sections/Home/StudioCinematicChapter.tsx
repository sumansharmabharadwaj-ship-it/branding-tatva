"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
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
    title: "Find the tension before the audience has words for it.",
    line: "Behaviour becomes evidence. The work studies the friction, desire and perception shaping a buyer's choice.",
    signal: "The choice stalls before the objection is spoken.",
    move: "Name the hidden tension.",
    decision: "Build the position around the belief that must change.",
    outcome: "Audience tension + perception map",
    proof: "Applied in HerbalCart",
    proofHref: "/work/herbalcart",
    video: "/videos/pexels-fog-sunrise.mp4",
    poster: "/images/pexels-fog-sunrise-poster.jpg",
    accent: "#a86645",
  },
  {
    number: "02",
    name: "Literature",
    credential: "Applied literature",
    verb: "shapes meaning",
    title: "Turn a strategic choice into language people can carry.",
    line: "Voice, narrative, rhythm and symbolism give the idea a form people can recognise, repeat and remember.",
    signal: "The strategy is understood, but not remembered.",
    move: "Give the choice rhythm, metaphor and voice.",
    decision: "Turn the position into a story people can repeat.",
    outcome: "Verbal identity + narrative spine",
    proof: "Applied in MyShopInEurope",
    proofHref: "/work/myshopineurope",
    video: "/videos/pexels-studio-morning-light.mp4",
    poster: "/images/pexels-studio-morning-light-poster.jpg",
    accent: "#527687",
  },
  {
    number: "03",
    name: "Strategy",
    credential: "Founder-led direction",
    verb: "makes both useful",
    title: "Make the insight usable long after the room goes quiet.",
    line: "Positioning, identity, website, content and campaigns move as one system led directly by Suman.",
    signal: "Every output looks considered; together they drift.",
    move: "Set one governing decision.",
    decision: "Align identity, website, content and campaigns to it.",
    outcome: "A brand system that keeps moving",
    proof: "Applied in Dr. Haley Nutrition",
    proofHref: "/work/dr-haley-nutrition",
    video: "/videos/pexels-aspen-sunburst.mp4",
    poster: "/images/pexels-aspen-sunburst-poster.jpg",
    accent: "#9c6f26",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const STUDIO_SCROLL_QUERY = "(min-width: 1101px) and (min-height: 700px) and (pointer: fine)";

type ManualMode = "none" | "pointer" | "focus";

export function StudioCinematicChapter() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const manualModeRef = useRef<ManualMode>("none");
  const syncStageRef = useRef<() => void>(() => {});
  const [activeIndex, setActiveIndex] = useState(0);
  const active = DISCIPLINES[activeIndex];

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
      const next = Math.min(DISCIPLINES.length - 1, Math.floor(progress * DISCIPLINES.length));
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
    setActiveIndex(index);
  }

  function previewFromPointer(event: ReactPointerEvent<HTMLButtonElement>, index: number) {
    if (event.pointerType !== "mouse") return;
    manualModeRef.current = "pointer";
    setActiveIndex(index);
  }

  function releasePointerPreview(event: ReactPointerEvent<HTMLButtonElement>) {
    if (manualModeRef.current !== "pointer" || document.activeElement === event.currentTarget) return;
    manualModeRef.current = "none";
    syncStageRef.current();
  }

  function previewFromFocus(index: number) {
    manualModeRef.current = "focus";
    setActiveIndex(index);
  }

  function releaseFocusPreview() {
    if (manualModeRef.current !== "focus") return;
    manualModeRef.current = "none";
    syncStageRef.current();
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
            <p>One mind · three disciplines</p>
            <h2 id="studio-film-title">
              <span className={activeIndex === 0 ? "is-active" : undefined}>Psychology <em>reads people.</em></span>
              <span className={activeIndex === 1 ? "is-active" : undefined}>Literature <em>shapes meaning.</em></span>
              <span className={activeIndex === 2 ? "is-active" : undefined}>Strategy <em>makes both useful.</em></span>
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
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reducedMotion ? 0 : 0.34, ease: EASE }}
              aria-live="polite"
            >
              <div className="studio-film__reading-label">
                <span>{active.number}</span><strong>{active.name}</strong><small>{active.credential}</small>
              </div>
              <h3>{active.title}</h3>
              <p>{active.line}</p>
              <div className="studio-film__synthesis" aria-label={`${active.name} from human signal to brand decision`}>
                <div>
                  <span>Human signal</span>
                  <strong>{active.signal}</strong>
                </div>
                <div>
                  <span>{active.name} move</span>
                  <strong>{active.move}</strong>
                </div>
                <div>
                  <span>Brand decision</span>
                  <strong>{active.decision}</strong>
                </div>
              </div>
              <div className="studio-film__outcome"><span>What this produces</span><strong>{active.outcome}</strong></div>
              <Link href={active.proofHref}>{active.proof} <span aria-hidden="true">→</span></Link>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="studio-film__footer">
          <div className="studio-film__selector">
            <div className="studio-film__selector-label"><span>Three disciplines · one decision system</span><span>{active.number} / 03</span></div>
            <div className="studio-film__chapters" role="tablist" aria-label="Explore Suman's three disciplines">
            {DISCIPLINES.map((discipline, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={discipline.name}
                  id={`studio-film-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="studio-film-panel"
                  tabIndex={selected ? 0 : -1}
                  className={selected ? "is-active" : undefined}
                  style={{ "--studio-chapter-accent": discipline.accent } as CSSProperties}
                  onClick={() => choose(index)}
                  onPointerEnter={(event) => previewFromPointer(event, index)}
                  onPointerLeave={releasePointerPreview}
                  onFocus={() => previewFromFocus(index)}
                  onBlur={releaseFocusPreview}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  <span>{discipline.number}</span><strong>{discipline.name}</strong><small>{discipline.verb}</small>
                </button>
              );
            })}
            </div>
          </div>
          <Link href="/about" className="studio-film__about">Meet the strategist <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
