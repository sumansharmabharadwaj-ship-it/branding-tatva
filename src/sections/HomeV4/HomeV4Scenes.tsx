"use client";

import { useHydratedMotionPreference, useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { motion, useAnimationControls, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Mail, MessageSquare, Monitor } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { publishServicesSituation } from "@/lib/servicesJourney";
import recognitionStyles from "./RecognitionChoices.module.css";
import costStyles from "./HiddenCost.module.css";
import openingStyles from "./OpeningScene.module.css";
import { LivingGradient } from "@/components/LivingGradient";

const EASE = [0.22, 1, 0.36, 1] as const;

const RECOGNITION_STATES = [
  {
    number: "01",
    situation: "idea",
    label: "The idea is clear in your head.",
    headline: "The market keeps meeting a different version.",
    body:
      "The logo, website, pitch, and content are making separate promises because the position was never committed first.",
    path: "Build the foundation",
    proof: "A position the rest of the business can inherit.",
    example: [
      { label: "The pitch", text: "For every business." },
      { label: "The buyer’s question", text: "Is this built for a business like mine?" },
    ],
    accent: "#C77752",
  },
  {
    number: "02",
    situation: "reposition",
    label: "The identity already exists.",
    headline: "The business has quietly outgrown it.",
    body:
      "What the company has become and what its brand still teaches people to expect are no longer the same thing.",
    path: "Reposition the system",
    proof: "Useful recognition kept. Confusing signals removed.",
    example: [
      { label: "The old story", text: "Natural wellness." },
      { label: "The business now", text: "Supplements for an active life." },
    ],
    accent: "#7D9BAF",
  },
  {
    number: "03",
    situation: "ongoing",
    label: "Marketing is active.",
    headline: "Memory is starting from zero each time.",
    body:
      "Every campaign works alone. Attention arrives, then disappears because no repeated pattern is waiting underneath it.",
    path: "Create consistency",
    proof: "One idea repeated with intent across every channel.",
    example: [
      { label: "What keeps changing", text: "A fresh tone with every campaign." },
      { label: "What should stay", text: "The same promise, expressed in new ways." },
    ],
    accent: "#C6A97A",
  },
] as const;

const MESSAGE_TOUCHPOINTS = [
  { channel: "Website", icon: Monitor, meaning: "Personal goals", separate: "Eat for your goals.", shared: "Dinner, decided before six." },
  { channel: "Email", icon: Mail, meaning: "Something for everyone", separate: "Recipes for everyone.", shared: "A week of dinners. One short list." },
  { channel: "Social", icon: MessageSquare, meaning: "Calorie control", separate: "Count every calorie.", shared: "Five dinners from one Sunday shop." },
] as const;

type MessageMode = "separate" | "shared";

const MESSAGE_MEANINGS: Record<MessageMode, string> = {
  separate: "Three channels. Three different reasons to choose.",
  shared: "Make weekday dinners easier to decide.",
};

type RecognitionState = (typeof RECOGNITION_STATES)[number];

function RecognitionReading({ state }: { state: RecognitionState }) {
  return <><h3>{state.headline}</h3><p className={recognitionStyles.body}>{state.body}</p></>;
}

function RecognitionExample({ item }: { item: RecognitionState["example"][number] }) {
  return <><span>{item.label}</span><p>{item.text}</p></>;
}

function RecognitionAnswer({ state }: { state: RecognitionState }) {
  return <><span>The useful move</span><strong>{state.path}</strong><p>{state.proof}</p></>;
}

export function V4OpeningScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const entrancePlayed = useRef(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const landscapeScale = useTransform(scrollYProgress, [0, 0.65, 1], [1.02, 1.17, 1.2]);
  const landscapeY = useTransform(scrollYProgress, [0, 1], [0, 58]);
  const lightX = useTransform(scrollYProgress, [0, 1], ["-18%", "80%"]);
  const proofSweep = useTransform(scrollYProgress, [0, .62], ["-110%", "110%"]);
  const signatureDraw = useTransform(scrollYProgress, [0, .48], [.3, 1]);

  // A finite entrance on the original text nodes, after the existing prelude.
  // Reading, focus, pause and a restored scroll position always take priority.
  useEffect(() => {
    if (!hydrated || entrancePlayed.current) return;
    if (prefersReducedMotion) { entrancePlayed.current = true; return; }
    const section = sectionRef.current;
    if (!section) return;
    let animations: Animation[] = [];
    const finish = () => animations.forEach((animation) => animation.cancel());
    const start = () => {
      if (entrancePlayed.current) return;
      entrancePlayed.current = true;
      if (window.scrollY > 80 || section.contains(document.activeElement) || document.hidden) return;
      const compact = window.matchMedia("(max-width: 820px)").matches;
      animations = Array.from(section.querySelectorAll<HTMLElement>("[data-opening-word]")).map((word, index) =>
        word.animate([
          { transform: `translate3d(0, ${compact ? 10 : 22}px, 0) rotate(${compact ? 0 : 2}deg)` },
          { transform: "translate3d(0, 0, 0) rotate(0deg)" },
        ], { duration: 850, delay: index * 45, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }),
      );
    };
    const onSelection = () => {
      const selection = document.getSelection();
      if (selection && !selection.isCollapsed && selection.anchorNode && section.contains(selection.anchorNode)) finish();
    };
    const onVisibility = () => { if (document.hidden) finish(); };
    if (document.documentElement.dataset.homePreludeReady === "true") start();
    window.addEventListener("bt:home-prelude-ready", start, { once: true });
    window.addEventListener("scroll", finish, { passive: true, once: true });
    section.addEventListener("focusin", finish);
    document.addEventListener("selectionchange", onSelection);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      finish();
      window.removeEventListener("bt:home-prelude-ready", start);
      window.removeEventListener("scroll", finish);
      section.removeEventListener("focusin", finish);
      document.removeEventListener("selectionchange", onSelection);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hydrated, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="opening"
      data-home-v4-chapter="opening"
      data-home-chapter="opening"
      data-home-section="opening"
      data-cursor-world="dark"
      className={`home-v4-opening ${openingStyles.opening}`}
      aria-labelledby="home-v4-opening-title"
    >
      <div className="home-v4-opening__media" aria-hidden="true">
        <motion.div
          className={openingStyles.landscape}
          data-opening-landscape
          style={{ scale: prefersReducedMotion ? 1 : landscapeScale, y: prefersReducedMotion ? 0 : landscapeY }}
        >
          {/* The `src` attribute is deliberately gone. A <video> with src set
              ignores its <source> children entirely, so the mobile
              derivative could never win while src was present. Sources
              only, narrowest first, since the browser takes the first
              whose media and type both match.
              The mobile file is the same framing at 768 wide rather than a
              reframe, so the shot is unchanged: 2.03MB down to 0.25MB on
              the hero, which is the first thing a phone downloads. */}
          <video
            poster="/images/hero-forest-sanctuary-poster.jpg"
            muted
            autoPlay={!prefersReducedMotion}
            loop
            playsInline
            preload="auto"
          >
            <source src="/videos/hero-forest-sanctuary-mobile.mp4" media="(max-width: 767px)" type="video/mp4" />
            <source src="/videos/hero-forest-sanctuary.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <span className="home-v4-opening__wash" />
      </div>

      <motion.span
        aria-hidden="true"
        className="home-v4-opening__light home-v4-opening__light--one"
        data-opening-light
        style={{ x: prefersReducedMotion ? 0 : lightX, opacity: prefersReducedMotion ? 0 : 0.3 }}
      />

      <div className="home-v4-opening__shell">
        <div className="home-v4-opening__topline">
          <span>Audience psychology · brand systems</span>
          <span>Strategy led directly by Suman</span>
        </div>

        <div className="home-v4-opening__copy">
          <div className="home-v4-opening__reading">
            <p className="home-v4-opening__eyebrow">
              Psychology finds the tension. Strategy gives it shape.
            </p>
            <h1 id="home-v4-opening-title" className={openingStyles.headline}>
              <span>{"Your audience has already formed an opinion.".split(" ").map((word, index) => (
                <span key={index}>{index > 0 ? " " : ""}<span className={openingStyles.word} data-opening-word>{word}</span></span>
              ))}</span>
              <em><span className={openingStyles.word} data-opening-word>Did you</span>{" "}<span className={openingStyles.word} data-opening-word>design it?</span></em>
            </h1>
            <motion.span className={openingStyles.signature} aria-hidden="true" style={{ "--signature-draw": prefersReducedMotion ? 1 : signatureDraw } as MotionStyle}>
              <svg viewBox="0 0 420 18" fill="none" preserveAspectRatio="none">
                <path d="M2 13C96 2 217 1 418 7" pathLength={1} />
                <path d="M74 17C182 9 275 10 350 12" pathLength={1} />
              </svg>
            </motion.span>
            <p className="home-v4-opening__lede">
              Brand strategy, words, and design shaped by how your audience thinks. A clear position, carried through every place people meet your business, so the next person arrives already leaning toward yes.
            </p>
          </div>

          <div className="home-v4-opening__actions">
            {/* Native fragment links carry keyboard focus into the destination scene. */}
            <a
              href="#recognition"
              className="home-v4-button home-v4-button--primary"
              data-magnetic
              data-cursor-label="inspect"
            >
              <span>Find the gap in your brand</span> <ArrowDownRight size={15} aria-hidden="true" />
            </a>
            <a
              href="#evidence"
              className="home-v4-button home-v4-button--quiet"
              data-magnetic
              data-cursor-label="proof"
            >
              <span>See recorded proof</span> <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        <motion.aside
          className="home-v4-opening__proof"
          style={{ "--proof-sweep": prefersReducedMotion ? "0%" : proofSweep } as MotionStyle}
        >
          <span>Dr. Haley Nutrition</span>
          <p className={openingStyles.proofStory}>Fewer posts.<br />A clearer reason to pay attention.</p>
          <p className={openingStyles.proofCaption}>LinkedIn engagement rate</p>
          <dl className={openingStyles.proofComparison}>
            {[
              { month: "December 2025", value: "0.71%", width: `${(.71 / 2.81) * 100}%` },
              { month: "January 2026", value: "2.81%", width: "100%" },
            ].map((period) => (
              <div key={period.month} className={openingStyles.proofPeriod}>
                <dt>{period.month}</dt>
                <dd>
                  <span className={openingStyles.proofValue}>{period.value}</span>
                  <span className={openingStyles.proofTrack} aria-hidden="true">
                    <span style={{ width: period.width }} />
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <Link href="/work/dr-haley-nutrition" className={openingStyles.proofLink}>
            Read the case study <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </motion.aside>

        <a href="#recognition" className="home-v4-opening__scroll" aria-label="Continue to visitor recognition">
          <span>Follow the signal</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function V4RecognitionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const choiceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectionDirection, setSelectionDirection] = useState<"forward" | "backward">("forward");
  const active = RECOGNITION_STATES[activeIndex];
  const previousIndexRef = useRef(activeIndex);
  const readingControls = useAnimationControls();
  const exampleControls = useAnimationControls();
  const answerControls = useAnimationControls();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const { scrollYProgress: readingProgress } = useScroll({ target: panelRef, offset: ["start end", "end start"] });
  const reflectionX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const exampleSignal = useTransform(readingProgress, [0.1, 0.6], [0.08, 1]);

  const settleReading = useCallback(() => {
    readingControls.stop();
    exampleControls.stop();
    answerControls.stop();
    readingControls.set({ x: 0, y: 0 });
    exampleControls.set({ x: 0, y: 0 });
    answerControls.set({ x: 0 });
  }, [readingControls, exampleControls, answerControls]);

  useEffect(() => {
    const changed = previousIndexRef.current !== activeIndex;
    previousIndexRef.current = activeIndex;
    settleReading();
    if (!changed || prefersReducedMotion) return;
    const direction = selectionDirection === "forward" ? 1 : -1;
    readingControls.set({ x: direction * 8, y: 3 });
    exampleControls.set({ x: direction * -6, y: 2 });
    answerControls.set({ x: direction * 6 });
    void readingControls.start({ x: 0, y: 0, transition: { duration: .38, ease: EASE } });
    void exampleControls.start({ x: 0, y: 0, transition: { duration: .42, ease: EASE } });
    void answerControls.start({ x: 0, transition: { duration: .44, ease: EASE } });
    return () => { readingControls.stop(); exampleControls.stop(); answerControls.stop(); };
  }, [activeIndex, selectionDirection, prefersReducedMotion, readingControls, exampleControls, answerControls, settleReading]);

  function choose(index: number) {
    publishServicesSituation(RECOGNITION_STATES[index].situation, "home_recognition");
    if (index === activeIndex) return;
    setSelectionDirection(index > activeIndex ? "forward" : "backward");
    setActiveIndex(index);
  }

  function revealControl(target: HTMLElement | null) {
    if (!target) return;
    const bounds = target.getBoundingClientRect();
    if (bounds.top < 80 || bounds.bottom > window.innerHeight - 80) {
      target.scrollIntoView({
        // Tall reading starts below the header. Smaller controls move only
        // far enough to clear the fixed controls, using their scroll margins.
        block: bounds.height > window.innerHeight - 160 ? "start" : "nearest",
        inline: "nearest",
        behavior: "instant",
      });
    }
  }

  function handleChoiceKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % RECOGNITION_STATES.length;
    else if (event.key === "ArrowUp") next = (index + RECOGNITION_STATES.length - 1) % RECOGNITION_STATES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = RECOGNITION_STATES.length - 1;
    else return;
    event.preventDefault();
    choose(next);
    const target = choiceRefs.current[next];
    // A repeated Home or End creates no new focus event. Other targets use
    // the same focus visibility path as ordinary Tab and Shift Tab.
    if (target === document.activeElement) revealControl(target);
    else target?.focus({ preventScroll: true });
  }

  return (
    <section
      ref={sectionRef}
      id="recognition"
      tabIndex={-1}
      data-home-v4-chapter="recognition"
      data-home-chapter="recognition"
      data-home-section="recognition"
      data-recognition-state={active.number}
      data-cursor-world="light"
      className={`home-v4-recognition ${recognitionStyles.section}`}
      aria-labelledby="home-v4-recognition-title"
      style={{ "--recognition-accent": active.accent } as React.CSSProperties}
      onFocusCapture={(event) => {
        if (event.target !== event.currentTarget && event.target.matches(":focus-visible")) {
          revealControl(event.target);
        }
      }}
    >
      <LivingGradient contours preset="meadow" shaft={false} />
      <div className="home-v4-recognition__media" aria-hidden="true">
        <video
          muted
          autoPlay={!prefersReducedMotion}
          loop
          playsInline
          preload="metadata"
          poster="/images/pexels-fog-sunrise-poster.jpg"
        >
          <source src="/videos/pexels-fog-sunrise.webm" type="video/webm" />
          <source src="/videos/pexels-fog-sunrise.mp4" type="video/mp4" />
        </video>
        <span />
      </div>

      <motion.div
        className="home-v4-recognition__reflection"
        aria-hidden="true"
        style={{ x: prefersReducedMotion ? 0 : reflectionX, opacity: 0.3 }}
      />

      <div className="home-v4-recognition__shell">
        <header className="home-v4-recognition__header">
          <div>
            <p>01 · Recognition</p>
            <h2 id="home-v4-recognition-title">
              Most inconsistency begins <em>before the design file.</em>
            </h2>
          </div>
          <span>Choose the situation that sounds like yours.</span>
        </header>

        <div className={recognitionStyles.stage}>
          <div className={recognitionStyles.choices} role="tablist" aria-label="Your brand situation" aria-orientation="vertical">
            {RECOGNITION_STATES.map((state, index) => (
              <button
                key={state.number}
                ref={(node) => { choiceRefs.current[index] = node; }}
                type="button"
                role="tab"
                id={`recognition-choice-${state.number}`}
                aria-selected={index === activeIndex}
                aria-controls="recognition-reading"
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => choose(index)}
                onKeyDown={(event) => handleChoiceKey(event, index)}
                className={recognitionStyles.choice}
                data-cursor-label="choose"
              >
                <span className={recognitionStyles.number} aria-hidden="true">{state.number}</span>
                <span className={recognitionStyles.choiceLabel}>{state.label}</span>
                <ArrowDownRight className={recognitionStyles.choiceArrow} size={20} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div
            ref={panelRef}
            id="recognition-reading"
            role="tabpanel"
            aria-labelledby={`recognition-choice-${active.number}`}
            tabIndex={0}
            className={recognitionStyles.panel}
            onFocusCapture={settleReading}
            onPointerDown={settleReading}
          >
            <p className={recognitionStyles.label}>What this means</p>
            <div className={recognitionStyles.readingStack}>
              <div className={recognitionStyles.readingMeasure} aria-hidden="true" inert>
                {RECOGNITION_STATES.map((state) => <div key={state.number}><RecognitionReading state={state} /></div>)}
              </div>
              <motion.div initial={false} animate={readingControls} data-recognition-reading>
                <RecognitionReading state={active} />
              </motion.div>
            </div>
            <div className={recognitionStyles.example}>
              <motion.i className={recognitionStyles.exampleSignal} aria-hidden="true" style={{ scaleX: prefersReducedMotion ? 1 : exampleSignal }} />
              <p className={recognitionStyles.exampleLabel}>Illustrative example</p>
              <div className={recognitionStyles.examplePair}>
                {active.example.map((item, index) => (
                  <div key={index}>
                    <div className={recognitionStyles.readingStack}>
                      <div className={recognitionStyles.readingMeasure} aria-hidden="true" inert>
                        {RECOGNITION_STATES.map((state) => <div key={state.number}><RecognitionExample item={state.example[index]} /></div>)}
                      </div>
                      <motion.div initial={false} animate={exampleControls} data-recognition-example>
                        <RecognitionExample item={item} />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={recognitionStyles.answer}>
              <div className={recognitionStyles.readingStack}>
                <div className={recognitionStyles.readingMeasure} aria-hidden="true" inert>
                  {RECOGNITION_STATES.map((state) => <div key={state.number}><RecognitionAnswer state={state} /></div>)}
                </div>
                <motion.div initial={false} animate={answerControls} data-recognition-answer>
                  <RecognitionAnswer state={active} />
                </motion.div>
              </div>
            </div>

            <a
              href="#cost"
              onClick={() => publishServicesSituation(active.situation, "home_recognition")}
              className={recognitionStyles.link}
              data-cursor-label="follow"
            >
              See what this is quietly costing you <ArrowDownRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function V4HiddenCostScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const [comparison, setComparison] = useState<{ mode: MessageMode; direction: number }>({ mode: "separate", direction: 0 });
  const manuallyChosen = useRef(false);
  const demonstrated = useRef(false);
  const [arrived, setArrived] = useState(false);
  const [entranceFinished, setEntranceFinished] = useState(false);

  // One finite demonstration per visit. Reading, manual choices, hidden tabs
  // and the global motion preference take priority over automatic progression.
  useEffect(() => {
    const element = comparisonRef.current;
    if (!element || !hydrated || prefersReducedMotion || demonstrated.current || manuallyChosen.current) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    const clear = () => { clearTimeout(timer); timer = undefined; };
    const schedule = () => {
      clear();
      if (!visible || document.hidden || manuallyChosen.current || demonstrated.current) return;
      timer = setTimeout(() => {
        if (!visible || document.hidden || manuallyChosen.current || demonstrated.current || element.contains(document.activeElement)) return;
        const selection = document.getSelection();
        if (selection && !selection.isCollapsed && selection.anchorNode && element.contains(selection.anchorNode)) return;
        demonstrated.current = true;
        setComparison({ mode: "shared", direction: 1 });
      }, 3600);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .65;
      if (visible) setArrived(true);
      schedule();
    }, { threshold: [0, .65] });
    observer.observe(element);
    document.addEventListener("visibilitychange", schedule);
    return () => { clear(); observer.disconnect(); document.removeEventListener("visibilitychange", schedule); };
  }, [hydrated, prefersReducedMotion]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const { scrollYProgress: comparisonProgress } = useScroll({ target: comparisonRef, offset: ["start end", "end start"] });
  const lineProgress = useTransform(scrollYProgress, [0.2, 0.6], [0.08, 1]);
  const comparisonArrival = useTransform(comparisonProgress, [0, 0.62], [0, 1]);
  const messageTransition = comparison.direction === 0 ? "idle" : comparison.direction > 0 ? "forward" : "reverse";

  const settleComparison = useCallback(() => {
    setComparison((current) => current.direction === 0 ? current : { ...current, direction: 0 });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      settleComparison();
      setEntranceFinished(true);
    }
  }, [prefersReducedMotion, settleComparison]);

  function chooseMessageMode(mode: MessageMode) {
    manuallyChosen.current = true;
    setComparison((current) => current.mode === mode ? current : { mode, direction: prefersReducedMotion ? 0 : mode === "shared" ? 1 : -1 });
  }

  function revealFocusedComparison(event: React.FocusEvent<HTMLDivElement>) {
    manuallyChosen.current = true;
    settleComparison();
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) return;
    const bounds = target.getBoundingClientRect();
    if (bounds.top < 80 || bounds.bottom > window.innerHeight - 80) {
      target.scrollIntoView({
        block: bounds.height > window.innerHeight - 160 ? "start" : "center",
        inline: "nearest",
        behavior: "instant",
      });
    }
  }

  return (
    <section
      ref={sectionRef}
      id="cost"
      tabIndex={-1}
      data-home-v4-chapter="cost"
      data-home-chapter="cost"
      data-home-section="cost"
      data-cursor-world="light"
      className={costStyles.section}
      aria-labelledby="home-v4-cost-title"
    >
      <LivingGradient contours preset="wanderlust" />
      <div className={costStyles.shell}>
        <header className={costStyles.header}>
          <div data-home-cost-heading>
            <p className={costStyles.eyebrow}>02 · The hidden cost</p>
            <h2 id="home-v4-cost-title">More content.<br /><em>The same introduction.</em></h2>
          </div>
          <p className={costStyles.intro}>
            A different promise in every channel makes buyers start again. A shared position gives every message something familiar to build on.
          </p>
        </header>
        <motion.div
          ref={comparisonRef}
          data-home-cost-comparison
          className={costStyles.comparison}
          data-message-mode={comparison.mode}
          data-story-arrived={arrived && !entranceFinished && !prefersReducedMotion}
          style={{ "--comparison-arrival": prefersReducedMotion ? 1 : comparisonArrival } as MotionStyle}
          onFocusCapture={revealFocusedComparison}
          onPointerDown={() => { manuallyChosen.current = true; }}
        >
          <div className={costStyles.comparisonHeader}>
            <p className={costStyles.exampleLabel}>Illustrative example · Meal planning</p>
            <div className={costStyles.modeChoices} role="group" aria-label="Compare how a brand communicates">
              <button type="button" aria-pressed={comparison.mode === "separate"} aria-controls="brand-message-example" onClick={() => chooseMessageMode("separate")}>
                Separate promises
              </button>
              <button type="button" aria-pressed={comparison.mode === "shared"} aria-controls="brand-message-example" onClick={() => chooseMessageMode("shared")}>
                Shared position
              </button>
            </div>
          </div>

          <div
            id="brand-message-example"
            className={costStyles.messageExample}
            role="region"
            aria-label="Message comparison"
            tabIndex={0}
            onFocusCapture={settleComparison}
            onPointerDown={settleComparison}
          >
            <dl className={costStyles.touchpoints}>
              {MESSAGE_TOUCHPOINTS.map((touchpoint, index) => (
                <div
                  key={touchpoint.channel}
                  style={{ "--message-order": index } as React.CSSProperties}
                  onAnimationEnd={(event) => {
                    if (event.target === event.currentTarget && index === MESSAGE_TOUCHPOINTS.length - 1) setEntranceFinished(true);
                  }}
                >
                  <dt>
                    <touchpoint.icon size={20} strokeWidth={1.4} aria-hidden="true" />
                    {touchpoint.channel}
                    <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  </dt>
                  <dd>
                    <span className={costStyles.messageMeasure} aria-hidden="true" inert>
                      <span>{touchpoint.separate}</span>
                      <span>{touchpoint.shared}</span>
                    </span>
                    <span
                      className={costStyles.messageText}
                      data-message-transition={messageTransition}
                      onAnimationEnd={(event) => {
                        const last = comparison.direction > 0 ? MESSAGE_TOUCHPOINTS.length - 1 : 0;
                        if (event.target === event.currentTarget && index === last) settleComparison();
                      }}
                    >
                      {touchpoint[comparison.mode]}
                    </span>
                  </dd>
                  <dd className={costStyles.buyerMeaning}>
                    <span className={costStyles.meaningDot} aria-hidden="true" />
                    <span>{comparison.mode === "shared" ? "Easier weekday dinners" : touchpoint.meaning}</span>
                  </dd>
                </div>
              ))}
            </dl>
            {/* The diagram repeats the written comparison below. Its paths
                carry motion while messages and hit targets stay in place. */}
            <svg className={costStyles.connections} viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <g className={costStyles.separateConnections}>
                <path d="M166 0C166 24 120 30 120 64" />
                <path d="M500 0C500 22 540 32 540 74" />
                <path d="M834 0C834 20 884 30 884 54" />
              </g>
              <g className={costStyles.sharedConnections}>
                <path d="M166 0V22Q166 42 196 42H470Q500 42 500 68V90" pathLength="1" />
                <path d="M500 0V90" pathLength="1" />
                <path d="M834 0V22Q834 42 804 42H530Q500 42 500 68V90" pathLength="1" />
              </g>
            </svg>
            <div className={costStyles.comparisonMeaning}>
              <div className={costStyles.memoryCount} aria-hidden="true">
                <span>{comparison.mode === "shared" ? "01" : "03"}</span>
              </div>
              <div className={costStyles.memoryReading}>
                <p className={costStyles.memoryLabel}>{comparison.mode === "shared" ? "One reason to remember" : "Three competing ideas"}</p>
                <div className={costStyles.meaningStack}>
                  <div className={costStyles.messageMeasure} aria-hidden="true" inert>
                    <p className={costStyles.meaningText}>{MESSAGE_MEANINGS.separate}</p>
                    <p className={costStyles.meaningText}>{MESSAGE_MEANINGS.shared}</p>
                  </div>
                  <p className={costStyles.meaningText} role="status" aria-atomic="true" data-message-transition={messageTransition}>
                    {MESSAGE_MEANINGS[comparison.mode]}
                  </p>
                </div>
              </div>
            </div>
            <p className={costStyles.takeaway}>Different words. The same reason to choose you.</p>
          </div>
        </motion.div>

        <div className={costStyles.rule} aria-hidden="true">
          <motion.span style={{ scaleX: prefersReducedMotion ? 1 : lineProgress }} />
        </div>

        {/* The three costs and the closing link moved to
            V4CostStackScene, the dark chapter directly below this one.
            They were a three column row, which states that the costs
            compound while showing the opposite; stacked, the earlier
            costs are still physically under the later ones by the time
            the reader reaches the third. This scene keeps the argument
            and the worked example that sets them up. */}
      </div>
    </section>
  );
}
