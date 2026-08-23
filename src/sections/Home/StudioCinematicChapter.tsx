"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useTimedVisualizer } from "@/hooks/useTimedVisualizer";
import { VisualizerPlayback } from "@/components/VisualizerPlayback";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, type CSSProperties, type KeyboardEvent } from "react";

const DISCIPLINE_DWELL_MS = 5200;

const DISCIPLINES = [
  {
    number: "01",
    eyebrow: "M.A. Clinical Psychology",
    title: "Read the tension",
    line:
      "Audience behaviour is treated as evidence, not a demographic label. The work finds the friction people feel before they can explain it.",
    result: "Audience tension + perception map",
    video: "/videos/higgsfield-process-listen.mp4",
    poster: "/images/higgsfield-process-listen-poster.jpg",
    diagram: ["Notice", "Interpret", "Choose"],
    proofLabel: "Applied in HerbalCart",
    proofLine:
      "A supplement range being read through a purely herbal lens was repositioned as a modern, supplement-first wellness brand.",
    proofHref: "/work/herbalcart",
    accent: "#C98B63",
  },
  {
    number: "02",
    eyebrow: "B.A. English Literature",
    title: "Give it language",
    line:
      "Voice, narrative, rhythm, and symbolism turn a committed idea into language people can recognise, repeat, and carry beyond the page.",
    result: "Verbal identity + narrative spine",
    video: "/videos/higgsfield-idea-sketch.mp4",
    poster: "/images/higgsfield-idea-sketch.jpg",
    diagram: ["Meaning", "Language", "Memory"],
    proofLabel: "Applied in MyShopInEurope",
    proofLine:
      "Craft and origin replaced cheap access as the story European buyers could pass on to their own customers.",
    proofHref: "/work/myshopineurope",
    accent: "#7D9AA8",
  },
  {
    number: "03",
    eyebrow: "Strategy led directly by Suman",
    title: "Make it usable",
    line:
      "Positioning, identity, website, content, and campaigns are built as one connected system, so the business can keep using the idea after launch.",
    result: "A brand system that can keep moving",
    video: "/videos/higgsfield-process-shape.mp4",
    poster: "/images/higgsfield-process-shape-poster.jpg",
    diagram: ["Decision", "System", "Recognition"],
    proofLabel: "Applied in Dr. Haley Nutrition",
    proofLine:
      "A quality-first content system moved engagement from 0.71% to 2.81% while the account posted less.",
    proofHref: "/work/dr-haley-nutrition",
    accent: "#D3A24F",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function StudioCinematicChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, {
    amount: 0.18,
    margin: "8% 0px -12% 0px",
  });
  const visualizer = useTimedVisualizer({
    count: DISCIPLINES.length,
    durationMs: DISCIPLINE_DWELL_MS,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const { activeIndex } = visualizer;
  const active = DISCIPLINES[activeIndex];

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % DISCIPLINES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + DISCIPLINES.length - 1) % DISCIPLINES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = DISCIPLINES.length - 1;
    else return;

    event.preventDefault();
    visualizer.choose(next);
    document.getElementById(`studio-tab-${next}`)?.focus();
  }

  return (
    <section
      ref={sectionRef}
      id="studio"
      data-home-chapter="studio"
      data-home-section="studio"
      data-studio-state={active.number}
      className="studio-cinematic home-scene"
      aria-labelledby="studio-cinematic-title"
      style={{ "--studio-accent": active.accent } as CSSProperties}
    >
      <div className="studio-cinematic__aurora studio-cinematic__aurora--clay" aria-hidden="true" />
      <div className="studio-cinematic__aurora studio-cinematic__aurora--sage" aria-hidden="true" />

      <div className="studio-cinematic__grid">
        <article className="studio-cinematic__media" aria-live="polite">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={active.video}
              className="studio-cinematic__media-layer"
              initial={prefersReducedMotion ? false : { opacity: 0.28, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1.04 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 1.025 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
            >
              {prefersReducedMotion ? (
                <Image
                  src={active.poster}
                  alt=""
                  fill
                  sizes="100vw"
                  className="studio-cinematic__media-image"
                />
              ) : (
                <video
                  src={active.video}
                  poster={active.poster}
                  className="studio-cinematic__media-video"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload={inView ? "metadata" : "none"}
                  data-home-playback-rate="1.12"
                  aria-hidden="true"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="studio-cinematic__media-wash" aria-hidden="true" />

          <div className="studio-cinematic__media-content">
            <div className="studio-cinematic__media-topline">
              <span>The thinking room</span>
              <span>{active.number} / 03</span>
            </div>

            <motion.div
              key={`caption-${active.title}`}
              className="studio-cinematic__media-caption"
              initial={prefersReducedMotion ? false : { opacity: 0.5, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: EASE }}
            >
              <p>{active.eyebrow}</p>
              <h3>{active.title}</h3>
            </motion.div>
          </div>
        </article>

        <div className="studio-cinematic__content">
          <p className="studio-cinematic__eyebrow">About Suman</p>
          <h2 id="studio-cinematic-title">
            One mind. Three disciplines. <em>One accountable author.</em>
          </h2>
          <p className="studio-cinematic__lede">
            Psychology finds the tension. Literature gives it language. Strategy makes the answer usable after the room goes quiet.
          </p>

          <VisualizerPlayback
            current={activeIndex}
            total={DISCIPLINES.length}
            durationMs={visualizer.durationMs}
            isRunning={visualizer.isRunning}
            progressKey={visualizer.progressKey}
            onToggle={visualizer.toggle}
            label="Psychology and literature autoplay"
            tone="dark"
            className="studio-cinematic__playback"
          />

          <div
            className="studio-cinematic__tabs"
            role="tablist"
            aria-label="Explore Suman's three disciplines"
          >
            {DISCIPLINES.map((discipline, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={discipline.title}
                  id={`studio-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="studio-cinematic-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => visualizer.choose(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  onFocus={() => visualizer.choose(index)}
                  className={selected ? "is-active" : undefined}
                  style={{ "--studio-tab-accent": discipline.accent } as CSSProperties}
                >
                  <span>{discipline.number}</span>
                  <strong>{discipline.title}</strong>
                  <small>{discipline.eyebrow}</small>
                  <i aria-hidden="true">
                    <b
                      key={visualizer.progressKey}
                      style={{
                        animation:
                          selected && visualizer.isRunning
                            ? `studio-tab-progress ${DISCIPLINE_DWELL_MS}ms linear forwards`
                            : "none",
                        transform: selected && prefersReducedMotion ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition: prefersReducedMotion ? "none" : undefined,
                      }}
                    />
                  </i>
                </button>
              );
            })}
          </div>

          <motion.article
            key={`panel-${active.title}`}
            id="studio-cinematic-panel"
            role="tabpanel"
            aria-labelledby={`studio-tab-${activeIndex}`}
            className="studio-cinematic__panel"
            initial={prefersReducedMotion ? false : { opacity: 0.64, y: 8, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: EASE }}
            aria-live="polite"
          >
            <p className="studio-cinematic__panel-copy">{active.line}</p>

            <div className="studio-cinematic__logic" aria-label={`${active.title} decision sequence`}>
              {active.diagram.map((step, index) => (
                <div key={step} className="studio-cinematic__logic-step">
                  <span>{step}</span>
                  {index < active.diagram.length - 1 && <i aria-hidden="true" />}
                </div>
              ))}
            </div>

            <div className="studio-cinematic__result">
              <span>What the client receives</span>
              <strong>{active.result}</strong>
            </div>

            <Link href={active.proofHref} className="studio-cinematic__proof">
              <span>
                <small>{active.proofLabel}</small>
                <strong>{active.proofLine}</strong>
              </span>
              <i aria-hidden="true">↗</i>
            </Link>
          </motion.article>

          <div className="studio-cinematic__footer">
            <Link href="/about">
              Meet the strategist <span aria-hidden="true">→</span>
            </Link>
            <p>The person you meet is the person doing the thinking, writing, and direction.</p>
          </div>
        </div>

        <aside className="studio-cinematic__portrait">
          <div className="studio-cinematic__portrait-image">
            <Image
              src="/images/own-portrait.jpg"
              alt="Suman Sharma, founder and strategist at Branding Tatva"
              fill
              sizes="(min-width: 1100px) 26vw, (min-width: 768px) 42vw, 100vw"
              className="studio-cinematic__portrait-photo"
            />
          </div>
          <div className="studio-cinematic__portrait-wash" aria-hidden="true" />
          <div className="studio-cinematic__authorship">
            <span>Direct authorship</span>
            <strong>
              The same person hears the problem, makes the decisions, writes the language,
              and directs the work.
            </strong>
            <p>Every engagement is led directly by Suman, from diagnosis to delivery.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
