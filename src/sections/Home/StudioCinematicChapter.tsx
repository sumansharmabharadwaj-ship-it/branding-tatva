"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

const DISCIPLINES = [
  {
    number: "01",
    name: "Psychology",
    credential: "Applied psychology",
    verb: "reads people",
    title: "Find the tension before the audience has words for it.",
    line: "Behaviour becomes evidence. The work studies the friction, desire and perception shaping a buyer's choice.",
    outcome: "Audience tension + perception map",
    proof: "Applied in HerbalCart",
    proofHref: "/work/herbalcart",
    video: "/videos/pexels-fog-sunrise.mp4",
    poster: "/images/pexels-fog-sunrise-poster.jpg",
    accent: "#d19670",
  },
  {
    number: "02",
    name: "Literature",
    credential: "Applied literature",
    verb: "shapes meaning",
    title: "Turn a strategic choice into language people can carry.",
    line: "Voice, narrative, rhythm and symbolism give the idea a form people can recognise, repeat and remember.",
    outcome: "Verbal identity + narrative spine",
    proof: "Applied in MyShopInEurope",
    proofHref: "/work/myshopineurope",
    video: "/videos/pexels-studio-morning-light.mp4",
    poster: "/images/pexels-studio-morning-light-poster.jpg",
    accent: "#92afbb",
  },
  {
    number: "03",
    name: "Strategy",
    credential: "Founder-led direction",
    verb: "makes both useful",
    title: "Make the insight usable long after the room goes quiet.",
    line: "Positioning, identity, website, content and campaigns move as one system led directly by Suman.",
    outcome: "A brand system that keeps moving",
    proof: "Applied in Dr. Haley Nutrition",
    proofHref: "/work/dr-haley-nutrition",
    video: "/videos/pexels-aspen-sunburst.mp4",
    poster: "/images/pexels-aspen-sunburst-poster.jpg",
    accent: "#e0b45f",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function StudioCinematicChapter() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const pointerPreviewRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = DISCIPLINES[activeIndex];
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reducedMotion || pointerPreviewRef.current) return;
    const next = Math.min(DISCIPLINES.length - 1, Math.max(0, Math.floor(progress * DISCIPLINES.length)));
    setActiveIndex((current) => current === next ? current : next);
  });

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % DISCIPLINES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + DISCIPLINES.length - 1) % DISCIPLINES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = DISCIPLINES.length - 1;
    else return;
    event.preventDefault();
    setActiveIndex(next);
    document.getElementById(`studio-film-tab-${next}`)?.focus();
  }

  return (
    <section
      ref={sectionRef}
      className="studio-film"
      aria-labelledby="studio-film-title"
      style={{ "--studio-film-accent": active.accent } as CSSProperties}
    >
      <div className="studio-film__media" aria-hidden="true">
        <AnimatePresence mode="sync" initial={false}>
          <motion.video
            key={active.video}
            src={active.video}
            poster={active.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            initial={reducedMotion ? false : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 1.015 }}
            transition={{ duration: reducedMotion ? 0 : 0.62, ease: EASE }}
          />
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
              Psychology <em>reads people.</em><br />
              Literature <em>shapes meaning.</em><br />
              Strategy <em>makes both useful.</em>
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
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: reducedMotion ? 0 : 0.46, ease: EASE }}
              aria-live="polite"
            >
              <div className="studio-film__reading-label">
                <span>{active.number}</span><strong>{active.name}</strong><small>{active.credential}</small>
              </div>
              <h3>{active.title}</h3>
              <p>{active.line}</p>
              <div className="studio-film__outcome"><span>What this produces</span><strong>{active.outcome}</strong></div>
              <Link href={active.proofHref}>{active.proof} <span aria-hidden="true">↗</span></Link>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="studio-film__footer">
          <div className="studio-film__selector">
            <div className="studio-film__selector-label"><span>Explore the three disciplines</span><span>{active.number} / 03</span></div>
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
                  onClick={() => setActiveIndex(index)}
                  onPointerEnter={() => {
                    pointerPreviewRef.current = true;
                    setActiveIndex(index);
                  }}
                  onPointerLeave={() => { pointerPreviewRef.current = false; }}
                  onFocus={() => setActiveIndex(index)}
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
