"use client";

import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

const FORCES = [
  { name: "Prithvi", role: "Foundation", title: "Give the idea somewhere firm to stand.", text: "Category, audience, belief and position resolve into one durable strategic ground.", color: "#ad6848" },
  { name: "Jal", role: "Flow", title: "Let every encounter continue the last.", text: "Offers and touchpoints move as one recognisable experience instead of isolated moments.", color: "#527e7b" },
  { name: "Agni", role: "Distinction", title: "Concentrate attention around one difference.", text: "A focused strategic choice becomes visible and verbal cues people can notice and remember.", color: "#c18534" },
  { name: "Vayu", role: "Voice", title: "Give meaning a rhythm people can carry.", text: "A repeatable voice travels across channels while keeping its character intact.", color: "#74805f" },
  { name: "Akash", role: "Recognition", title: "Create the space where memory compounds.", text: "Consistent assets and decisions turn repeated exposure into familiarity over time.", color: "#966778" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function TatvaSystemLab() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const pointerPreviewRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = FORCES[activeIndex];
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reducedMotion || pointerPreviewRef.current) return;
    const next = Math.min(FORCES.length - 1, Math.max(0, Math.floor(progress * FORCES.length)));
    setActiveIndex((current) => current === next ? current : next);
  });

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % FORCES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + FORCES.length - 1) % FORCES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = FORCES.length - 1;
    else return;
    event.preventDefault();
    setActiveIndex(next);
    document.getElementById(`tatva-force-${next}`)?.focus();
  }

  return (
    <section ref={sectionRef} className="tatva-film" aria-labelledby="tatva-film-title">
      <div className="tatva-film__media" aria-hidden="true">
        <video muted autoPlay loop playsInline preload="metadata" poster="/images/pexels-golden-fog-sea-poster.jpg">
          <source src="/videos/pexels-golden-fog-sea.webm" type="video/webm" />
          <source src="/videos/pexels-golden-fog-sea.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="tatva-film__wash" aria-hidden="true" />

      <Container className="tatva-film__frame max-w-[104rem]">
        <header className="tatva-film__header">
          <p>09 · The five Tatvas</p>
          <span>Five forces · one operating system</span>
        </header>

        <div className="tatva-film__story">
          <div className="tatva-film__intro">
            <p>Five distinct jobs inside one brand.</p>
            <h2 id="tatva-film-title">Five forces.<br /><em>One recognisable whole.</em></h2>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.name}
              id="tatva-force-panel"
              role="tabpanel"
              aria-labelledby={`tatva-force-${activeIndex}`}
              className="tatva-film__reading"
              style={{ "--tatva-accent": active.color } as CSSProperties}
              initial={reducedMotion ? false : { opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(3px)" }}
              transition={{ duration: reducedMotion ? 0 : 0.42, ease: EASE }}
              aria-live="polite"
            >
              <div><span>{String(activeIndex + 1).padStart(2, "0")}</span><strong>{active.name}</strong><small>{active.role}</small></div>
              <h3>{active.title}</h3>
              <p>{active.text}</p>
              <Link href="/services">Explore the complete system <span aria-hidden="true">↗</span></Link>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="tatva-film__selector">
          <div className="tatva-film__selector-label">
            <span>Explore the five forces</span>
            <span>{String(activeIndex + 1).padStart(2, "0")} / {String(FORCES.length).padStart(2, "0")}</span>
          </div>
          <div className="tatva-film__forces" role="tablist" aria-label="Explore the five Tatvas">
            {FORCES.map((force, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={force.name}
                  id={`tatva-force-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="tatva-force-panel"
                  tabIndex={selected ? 0 : -1}
                  className={selected ? "is-active" : undefined}
                  style={{ "--tatva-accent": force.color } as CSSProperties}
                  onClick={() => setActiveIndex(index)}
                  onPointerEnter={() => {
                    pointerPreviewRef.current = true;
                    setActiveIndex(index);
                  }}
                  onPointerLeave={() => { pointerPreviewRef.current = false; }}
                  onFocus={() => setActiveIndex(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{force.name}</strong>
                  <small>{force.role}</small>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
