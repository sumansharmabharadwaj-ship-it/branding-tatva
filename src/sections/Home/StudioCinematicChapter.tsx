"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { studioProgress, studioStep } from "./studioScroll";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useAnimationControls, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

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
const DESKTOP_STORY = "(min-width: 1181px) and (min-height: 761px) and (pointer: fine)";
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
const MEDIA_TRANSITION = {
  enter: (direction: number) => ({ opacity: 0.82, y: direction * 16, scale: 1.035 }),
  visible: { opacity: 1, y: 0, scale: 1.015 },
  exit: (direction: number) => ({ opacity: 0.78, y: direction * -12, scale: 1.015 }),
};

type Discipline = (typeof DISCIPLINES)[number];

function DisciplineReading({ discipline }: { discipline: Discipline }) {
  return (
    <>
      <p className="studio-cinematic__credential">{discipline.eyebrow}</p>
      <h3>{discipline.title}</h3>
      <p className="studio-cinematic__panel-copy">{discipline.line}</p>
    </>
  );
}

function DisciplineResult({ discipline }: { discipline: Discipline }) {
  return (
    <>
      <span>What the client receives</span>
      <strong>{discipline.result}</strong>
    </>
  );
}

function DisciplineProof({ discipline }: { discipline: Discipline }) {
  return (
    <>
      <small>{discipline.proofLabel}</small>
      <strong>{discipline.proofLine}</strong>
    </>
  );
}

export function StudioCinematicChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const selectionId = useId();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const cinematicViewport = useMediaQuery(DESKTOP_STORY);
  const [frameFits, setFrameFits] = useState(false);
  const desktopMotion = cinematicViewport && !prefersReducedMotion && frameFits;
  const decisionControls = useAnimationControls();
  const resultControls = useAnimationControls();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const { scrollYProgress: readingProgress } = useScroll({ target: panelRef, offset: ["start end", "end start"] });
  const resultSignal = useTransform(readingProgress, [0.12, 0.62], [0.08, 1]);
  const portraitY = useTransform(scrollYProgress, [0, 0.5, 1], [18, -8, 8]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.035, 1.14, 1.06]);
  const portraitX = useTransform(scrollYProgress, [0, 0.5, 1], ["-1%", "1.5%", "-1.5%"]);
  const portraitTurn = useTransform(scrollYProgress, [0, 0.5, 1], [-1.2, 0.8, 0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectionRef = useRef({ index: 0, direction: 0 });
  const manualChoiceRef = useRef(false);
  const animatedIndexRef = useRef(0);
  const active = DISCIPLINES[activeIndex];

  const select = useCallback((index: number) => {
    if (index === selectionRef.current.index) return;
    selectionRef.current = { index, direction: Math.sign(index - selectionRef.current.index) };
    setActiveIndex(index);
  }, []);

  // Collapsing the desktop hold changes its progress. Preserve the current
  // discipline through pause/resume until the visitor scrolls again.
  useEffect(() => {
    if (prefersReducedMotion) manualChoiceRef.current = true;
  }, [prefersReducedMotion]);

  // The natural frame height includes the portrait and the complete proof.
  // Release the hold when a shorter viewport or larger type needs more room.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => setFrameFits(grid.offsetHeight <= window.innerHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const settleReading = useCallback(() => {
    decisionControls.stop();
    resultControls.stop();
    decisionControls.set({ x: 0, y: 0 });
    resultControls.set({ x: 0 });
  }, [decisionControls, resultControls]);

  // Only copy moves. The mounted proof link keeps its geometry and focus.
  useEffect(() => {
    const changed = animatedIndexRef.current !== activeIndex;
    animatedIndexRef.current = activeIndex;
    settleReading();
    if (!prefersReducedMotion && changed) {
      const direction = selectionRef.current.direction;
      decisionControls.set({ x: direction * 8, y: 3 });
      resultControls.set({ x: direction * 10 });
      void decisionControls.start({
        x: 0, y: 0,
        transition: { duration: 0.38, ease: EASE },
      });
      void resultControls.start({
        x: 0,
        transition: { duration: 0.42, ease: EASE },
      });
    }
    return () => {
      decisionControls.stop();
      resultControls.stop();
    };
  }, [activeIndex, prefersReducedMotion, decisionControls, resultControls, settleReading]);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid || !desktopMotion) return;

    let frameRequest = 0;

    function render() {
      frameRequest = 0;
      const bounds = section?.getBoundingClientRect();
      if (!bounds) return;

      const progress = studioProgress(bounds.top, bounds.height, window.innerHeight);
      if (progress === null) return;

      grid?.style.setProperty("--studio-scroll-progress", progress.toFixed(4));
      if (manualChoiceRef.current) return;
      // A keyboard user owns the selected panel until focus leaves it.
      // Scrolling must preserve the destination of the proof they are reading.
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && section?.contains(focused) && focused.matches(":focus-visible")) return;
      const selection = document.getSelection();
      if (selection && !selection.isCollapsed && selection.rangeCount
        && selection.getRangeAt(0).intersectsNode(section!)) return;
      select(studioStep(progress, selectionRef.current.index, DISCIPLINES.length));
    }

    function schedule() {
      if (frameRequest) return;
      frameRequest = window.requestAnimationFrame(render);
    }

    function releaseManualChoice() {
      manualChoiceRef.current = false;
      // The next scroll event resumes the sequence; intent alone stays still.
    }

    function onScrollKey(event: globalThis.KeyboardEvent) {
      if (event.defaultPrevented || !SCROLL_KEYS.has(event.key)) return;
      if (event.target instanceof Element && event.target.closest('[role="tablist"], input, textarea, select, [contenteditable="true"]')) return;
      releaseManualChoice();
    }

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", releaseManualChoice, { passive: true });
    window.addEventListener("touchstart", releaseManualChoice, { passive: true });
    window.addEventListener("keydown", onScrollKey);
    section.addEventListener("focusout", schedule);

    return () => {
      if (frameRequest) window.cancelAnimationFrame(frameRequest);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", releaseManualChoice);
      window.removeEventListener("touchstart", releaseManualChoice);
      window.removeEventListener("keydown", onScrollKey);
      section.removeEventListener("focusout", schedule);
      grid.style.removeProperty("--studio-scroll-progress");
    };
  }, [desktopMotion, select]);

  function choose(index: number) {
    manualChoiceRef.current = true;
    select(index);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? DISCIPLINES.length - 1
      : event.key === "ArrowRight" ? (index + 1) % DISCIPLINES.length
      : (index - 1 + DISCIPLINES.length) % DISCIPLINES.length;
    choose(next);
    const target = tabsRef.current[next];
    const bounds = target?.getBoundingClientRect();
    // Keep keyboard choices clear of the fixed header and bottom controls.
    // Center only an obscured target, then focus without a second scroll.
    if (bounds && (bounds.top < 80 || bounds.bottom > window.innerHeight - 64)) {
      target?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    }
    target?.focus({ preventScroll: true });
  }

  return (
    <section
      ref={sectionRef}
      id="studio"
      data-home-chapter="studio"
      data-home-section="studio"
      data-studio-state={active.number}
      data-studio-story={desktopMotion ? "held" : "flow"}
      className="studio-cinematic home-scene"
      aria-labelledby="studio-cinematic-title"
      style={{ "--studio-accent": active.accent } as CSSProperties}
    >
      <div className="studio-cinematic__aurora studio-cinematic__aurora--clay" aria-hidden="true" />
      <div className="studio-cinematic__aurora studio-cinematic__aurora--sage" aria-hidden="true" />

      <div ref={gridRef} className="studio-cinematic__grid">
        <div className="studio-cinematic__media" aria-hidden="true">
          <AnimatePresence mode="sync" initial={false} custom={selectionRef.current.direction}>
            <motion.div
              className="studio-cinematic__media-layer"
              key={active.video}
              custom={selectionRef.current.direction}
              variants={MEDIA_TRANSITION}
              initial={prefersReducedMotion ? false : "enter"}
              animate={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : "visible"}
              exit={prefersReducedMotion ? undefined : "exit"}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: EASE }}
            >
              <BackgroundVideo video={active.video} poster={active.poster} managedByHomepage loop={false} />
            </motion.div>
          </AnimatePresence>
          <div className="studio-cinematic__media-wash" />
          <div className="studio-cinematic__media-content">
            <div className="studio-cinematic__media-topline">
              <span>The thinking room</span>
              <span>{active.number} / 03</span>
            </div>
          </div>
        </div>

        <div className="studio-cinematic__content">
          <div className="studio-cinematic__intro" data-studio-intro>
            <p className="studio-cinematic__eyebrow">About Suman</p>
            <h2 id="studio-cinematic-title">
              One mind. Three disciplines. <em>One accountable author.</em>
            </h2>
            <p className="studio-cinematic__lede">
              Psychology reads the audience. Literature shapes the language.
              Strategy connects both to the decisions a business makes.
            </p>
          </div>

          <div className="studio-cinematic__chooser" role="tablist" aria-label="Choose one of Suman's three disciplines">
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
            ref={panelRef}
            id="studio-cinematic-panel"
            role="tabpanel"
            aria-labelledby={`studio-discipline-${active.number}`}
            tabIndex={0}
            className="studio-cinematic__panel"
            onFocusCapture={settleReading}
            onPointerDown={settleReading}
          >
            <div className="studio-cinematic__reading-stack">
              <div className="studio-cinematic__reading-measure" aria-hidden="true" inert>
                {DISCIPLINES.map((discipline) => (
                  <div key={discipline.number}>
                    <DisciplineReading discipline={discipline} />
                    <div className="studio-cinematic__result"><DisciplineResult discipline={discipline} /></div>
                  </div>
                ))}
              </div>
              <motion.div data-studio-decision initial={false} animate={decisionControls}>
                <DisciplineReading discipline={active} />
                <motion.div className="studio-cinematic__result" initial={false} animate={resultControls}>
                  <motion.i
                    className="studio-cinematic__result-signal"
                    aria-hidden="true"
                    style={{ scaleY: prefersReducedMotion ? 1 : resultSignal }}
                  />
                  <DisciplineResult discipline={active} />
                </motion.div>
              </motion.div>
            </div>
            <Link href={active.proofHref} className="studio-cinematic__proof">
              <span className="studio-cinematic__reading-stack">
                <span className="studio-cinematic__reading-measure" aria-hidden="true" inert>
                  {DISCIPLINES.map((discipline) => (
                    <span key={discipline.number}><DisciplineProof discipline={discipline} /></span>
                  ))}
                </span>
                <span><DisciplineProof discipline={active} /></span>
              </span>
              <i aria-hidden="true">→</i>
            </Link>
          </article>

          <div className="studio-cinematic__footer">
            <Link href="/about">Meet the strategist <span aria-hidden="true">→</span></Link>
            <p>You work directly with Suman, from the first conversation to delivery.</p>
          </div>
        </div>

        <aside className="studio-cinematic__portrait">
          <motion.div
            className="studio-cinematic__portrait-image"
            data-studio-portrait-camera
            style={{ y: prefersReducedMotion || !desktopMotion ? 0 : portraitY, x: prefersReducedMotion || !desktopMotion ? 0 : portraitX, rotate: prefersReducedMotion || !desktopMotion ? 0 : portraitTurn, scale: prefersReducedMotion || !desktopMotion ? 1 : portraitScale }}
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
