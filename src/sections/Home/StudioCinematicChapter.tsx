"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

const DISCIPLINES = [
  {
    number: "01",
    label: "Psychology",
    eyebrow: "M.A. Clinical Psychology",
    title: "Read the tension",
    line:
      "Understand what buyers hesitate over, what they value, and how they judge the options. Use those findings to choose the position.",
    result: "Audience tension and perception map",
    video: "/videos/higgsfield-process-listen.mp4",
    poster: "/images/higgsfield-process-listen-poster.jpg",
    proofLabel: "Applied in HerbalCart",
    proofLine:
      "The content reframed supplements as practical support for modern lifestyles.",
    proofHref: "/work/herbalcart",
    accent: "#C98B63",
  },
  {
    number: "02",
    label: "Literature",
    eyebrow: "B.A. English Literature",
    title: "Give it language",
    line:
      "Turn the position into a voice, a message, and a story the team can use consistently.",
    result: "Verbal identity and narrative",
    video: "/videos/higgsfield-idea-sketch.mp4",
    poster: "/images/higgsfield-idea-sketch.jpg",
    proofLabel: "Applied in MyShopInEurope",
    proofLine:
      "Craft and origin replaced cheap access as the story European buyers could pass on to their own customers.",
    proofHref: "/work/myshopineurope",
    accent: "#7D9AA8",
  },
  {
    number: "03",
    label: "Strategy",
    eyebrow: "Strategy led directly by Suman",
    title: "Make it usable",
    line:
      "Connect positioning, identity, website, content, and campaigns so each part supports the same commercial direction.",
    result: "A brand system that can keep moving",
    video: "/videos/higgsfield-process-shape.mp4",
    poster: "/images/higgsfield-process-shape-poster.jpg",
    proofLabel: "Applied in Dr. Haley Nutrition",
    proofLine:
      "Engagement rose from 0.71% to 2.81% with fewer posts.",
    proofHref: "/work/dr-haley-nutrition",
    accent: "#D3A24F",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function StudioCinematicChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const selectionId = useId();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1.01, 1.055]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = DISCIPLINES[activeIndex];

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid || prefersReducedMotion) return;

    const desktopStory = window.matchMedia(
      "(min-width: 1181px) and (min-height: 761px) and (pointer: fine)",
    );
    let frameRequest = 0;

    function render() {
      frameRequest = 0;
      if (!desktopStory.matches) {
        grid?.style.removeProperty("--studio-scroll-progress");
        return;
      }

      const bounds = section?.getBoundingClientRect();
      if (!bounds) return;

      const runway = Math.max(1, bounds.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -bounds.top / runway));
      const nextIndex = Math.min(
        DISCIPLINES.length - 1,
        Math.floor(progress * DISCIPLINES.length),
      );

      grid?.style.setProperty("--studio-scroll-progress", progress.toFixed(4));
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    }

    function schedule() {
      if (frameRequest) return;
      frameRequest = window.requestAnimationFrame(render);
    }

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktopStory.addEventListener("change", schedule);

    return () => {
      if (frameRequest) window.cancelAnimationFrame(frameRequest);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      desktopStory.removeEventListener("change", schedule);
      grid.style.removeProperty("--studio-scroll-progress");
    };
  }, [prefersReducedMotion]);

  function choose(index: number) {
    const section = sectionRef.current;
    const desktopStory = window.matchMedia(
      "(min-width: 1181px) and (min-height: 761px) and (pointer: fine)",
    );

    if (section && desktopStory.matches && !prefersReducedMotion) {
      const bounds = section.getBoundingClientRect();
      const runway = Math.max(1, bounds.height - window.innerHeight);
      const sectionTop = window.scrollY + bounds.top;
      const progress = (index + 0.5) / DISCIPLINES.length;
      window.scrollTo({ top: sectionTop + runway * progress, behavior: "smooth" });
    }

    setActiveIndex(index);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? DISCIPLINES.length - 1
      : event.key === "ArrowRight" ? (index + 1) % DISCIPLINES.length
      : (index - 1 + DISCIPLINES.length) % DISCIPLINES.length;
    choose(next);
    tabsRef.current[next]?.focus();
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

      <div ref={gridRef} className="studio-cinematic__grid">
        <div className="studio-cinematic__media" aria-hidden="true">
          <div className="studio-cinematic__media-layer" key={active.video}>
            <BackgroundVideo video={active.video} poster={active.poster} managedByHomepage loop={false} />
          </div>
          <div className="studio-cinematic__media-wash" />
          <div className="studio-cinematic__media-content">
            <div className="studio-cinematic__media-topline">
              <span>The thinking room</span>
              <span>{active.number} / 03</span>
            </div>
          </div>
        </div>

        <div className="studio-cinematic__content">
          <p className="studio-cinematic__eyebrow">About Suman</p>
          <h2 id="studio-cinematic-title">
            One mind. Three disciplines. <em>One accountable author.</em>
          </h2>
          <p className="studio-cinematic__lede">
            Psychology reads the audience. Literature shapes the language.
            Strategy connects both to the decisions a business makes.
          </p>

          <div className="studio-cinematic__chooser" role="tablist" aria-label="Explore Suman's three disciplines">
            {DISCIPLINES.map((discipline, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={discipline.number}
                  ref={(element) => { tabsRef.current[index] = element; }}
                  id={`studio-discipline-${discipline.number}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="studio-cinematic-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  {selected && (
                    <motion.span
                      className="studio-cinematic__selection"
                      layoutId={`studio-selection-${selectionId}`}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: EASE }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="studio-cinematic__discipline-label">{discipline.label}</span>
                </button>
              );
            })}
          </div>

          <article
            id="studio-cinematic-panel"
            role="tabpanel"
            aria-labelledby={`studio-discipline-${active.number}`}
            tabIndex={0}
            className="studio-cinematic__panel"
          >
            <motion.div
              key={active.number}
              initial={prefersReducedMotion ? false : { y: 8 }}
              animate={{ y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: EASE }}
            >
              <p className="studio-cinematic__credential">{active.eyebrow}</p>
              <h3>{active.title}</h3>
              <p className="studio-cinematic__panel-copy">{active.line}</p>
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
            </motion.div>
          </article>

          <div className="studio-cinematic__footer">
            <Link href="/about">Meet the strategist <span aria-hidden="true">→</span></Link>
            <p>You work directly with Suman, from the first conversation to delivery.</p>
          </div>
        </div>

        <aside className="studio-cinematic__portrait">
          <motion.div
            className="studio-cinematic__portrait-image"
            style={{ y: prefersReducedMotion ? 0 : portraitY, scale: prefersReducedMotion ? 1 : portraitScale }}
          >
            <Image
              src="/images/own-portrait.jpg"
              alt="Suman Sharma, founder and strategist at Branding Tatva"
              fill
              sizes="(min-width: 1100px) 26vw, (min-width: 768px) 42vw, 100vw"
              className="studio-cinematic__portrait-photo"
            />
          </motion.div>
          <div className="studio-cinematic__portrait-wash" aria-hidden="true" />
          <div className="studio-cinematic__authorship">
            <span>Direct authorship</span>
            <strong>The person you meet is the person doing the thinking, writing, and direction.</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
