"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  },
] as const;

const ROTATE_MS = 4300;
const MANUAL_HOLD_MS = 10500;
const HOVER_HOLD_MS = 3400;
const EASE = [0.22, 1, 0.36, 1] as const;

export function StudioCinematicChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const holdUntilRef = useRef(0);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const inView = useInView(sectionRef, {
    amount: 0.18,
    margin: "8% 0px -12% 0px",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const active = DISCIPLINES[activeIndex];

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < holdUntilRef.current) return;
      setActiveIndex((current) => (current + 1) % DISCIPLINES.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [inView, prefersReducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.playbackRate = 1.18;

    if (inView && !document.hidden) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }

    return () => video.pause();
  }, [activeIndex, inView, prefersReducedMotion]);

  function choose(index: number, hold = MANUAL_HOLD_MS) {
    holdUntilRef.current = Date.now() + hold;
    setActiveIndex(index);
  }

  return (
    <section
      ref={sectionRef}
      id="studio"
      data-home-chapter="studio"
      data-home-section="studio"
      className="studio-cinematic home-scene"
      aria-labelledby="studio-cinematic-title"
      onPointerDown={() => {
        holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
      onFocusCapture={() => {
        holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
    >
      <div className="studio-cinematic__aurora studio-cinematic__aurora--clay" aria-hidden="true" />
      <div className="studio-cinematic__aurora studio-cinematic__aurora--sage" aria-hidden="true" />

      <div className="studio-cinematic__grid">
        <article className="studio-cinematic__media" aria-live="polite">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={active.video}
              className="studio-cinematic__media-layer"
              initial={prefersReducedMotion ? false : { opacity: 0.35, scale: 1.045 }}
              animate={{ opacity: 1, scale: inView ? 1.08 : 1.03 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 1.025 }}
              transition={{
                opacity: { duration: prefersReducedMotion ? 0 : 0.46, ease: EASE },
                scale: { duration: prefersReducedMotion ? 0 : 9.5, ease: "linear" },
              }}
            >
              {prefersReducedMotion ? (
                <Image
                  src={active.poster}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 29vw, (min-width: 768px) 42vw, 100vw"
                  className="studio-cinematic__media-image"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={active.video}
                  poster={active.poster}
                  className="studio-cinematic__media-video"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
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
              initial={prefersReducedMotion ? false : { opacity: 0.64, y: 8 }}
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
            Psychology reveals what people notice. Literature shapes what they remember.
            Strategy turns both into decisions the business can keep using.
          </p>

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
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="studio-cinematic-panel"
                  onClick={() => choose(index)}
                  onPointerEnter={() => choose(index, HOVER_HOLD_MS)}
                  onFocus={() => choose(index)}
                  className={selected ? "is-active" : undefined}
                >
                  <span>{discipline.number}</span>
                  <strong>{discipline.title}</strong>
                  <i aria-hidden="true">
                    <b
                      style={{
                        animationDuration: `${ROTATE_MS}ms`,
                        animationPlayState:
                          selected && inView && !prefersReducedMotion ? "running" : "paused",
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
            className="studio-cinematic__panel"
            initial={prefersReducedMotion ? false : { opacity: 0.72, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.34, ease: EASE }}
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
          <motion.div
            className="studio-cinematic__portrait-image"
            animate={
              prefersReducedMotion || !inView
                ? undefined
                : { scale: [1.02, 1.075, 1.02], x: [0, -6, 0] }
            }
            transition={
              prefersReducedMotion || !inView
                ? undefined
                : { duration: 13, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Image
              src="/images/own-portrait.jpg"
              alt="Suman Sharma, founder and strategist at Branding Tatva"
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 100vw, 100vw"
              className="studio-cinematic__portrait-photo"
            />
          </motion.div>
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
