"use client";

import { useHydratedMotionPreference, useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimationControls, useInView, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Mail, MessageSquare, Monitor } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { publishServicesSituation, SITUATION_TO_PROOF_SLUG } from "@/lib/servicesJourney";
import recognitionStyles from "./RecognitionChoices.module.css";
import costStyles from "./HiddenCost.module.css";
import openingStyles from "./OpeningScene.module.css";
import { useOpeningEntrance } from "./useOpeningEntrance";
import { LivingGradient } from "@/components/LivingGradient";
import { HomeV4Film } from "./HomeV4Film";
import filmStyles from "./HomeV4Film.module.css";
import { projects } from "./homeSnapshotProjects";

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

const RECOGNITION_PROOFS = RECOGNITION_STATES.map((state) =>
  projects.find((project) => project.slug === SITUATION_TO_PROOF_SLUG[state.situation])!,
);

const MESSAGE_TOUCHPOINTS = [
  { channel: "Website", icon: Monitor, meaning: "A different look", separate: "A new look for your business.", shared: "Give buyers a reason to choose you." },
  { channel: "Email", icon: Mail, meaning: "More content", separate: "Fill your next content calendar.", shared: "Make that reason clear in every message." },
  { channel: "Social", icon: MessageSquare, meaning: "A faster launch", separate: "Your next website, ready in a week.", shared: "Show what makes your business worth choosing." },
] as const;

type MessageMode = "separate" | "shared";

const MESSAGE_MEANINGS: Record<MessageMode, string> = {
  separate: "Design, content or speed. What does this business stand for?",
  shared: "A clear reason to choose your business.",
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
  const [keyboardReading, setKeyboardReading] = useState(false);
  const readingStill = prefersReducedMotion || keyboardReading;
  const stopEntrance = useOpeningEntrance(sectionRef, hydrated, readingStill);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const landscapeScale = useTransform(scrollYProgress, [0, 0.65, 1], [1.02, 1.17, 1.2]);
  const landscapeY = useTransform(scrollYProgress, [0, 1], [0, 58]);
  const lightX = useTransform(scrollYProgress, [0, 1], ["-18%", "80%"]);
  const proofSweep = useTransform(scrollYProgress, [0, .62], ["-110%", "110%"]);
  const signatureDraw = useTransform(scrollYProgress, [0, .48], [.3, 1]);

  return (
    <section
      ref={sectionRef}
      id="opening"
      data-home-v4-chapter="opening"
      data-home-chapter="opening"
      data-home-section="opening"
      data-cursor-world="dark"
      data-opening-reading-still={readingStill}
      onFocusCapture={(event) => {
        stopEntrance();
        if (event.target.matches(":focus-visible")) setKeyboardReading(true);
      }}
      onKeyDownCapture={() => { stopEntrance(); setKeyboardReading(true); }}
      onPointerDownCapture={() => { stopEntrance(); setKeyboardReading(false); }}
      className={`home-v4-opening ${openingStyles.opening}`}
      aria-labelledby="home-v4-opening-title"
    >
      <div className="home-v4-opening__media" aria-hidden="true">
        <motion.div
          className={openingStyles.landscape}
          data-opening-landscape
          style={{ scale: readingStill ? 1 : landscapeScale, y: readingStill ? 0 : landscapeY }}
        >
          {readingStill ? (
            <Image
              src="/images/hero-forest-sanctuary-poster.jpg"
              alt=""
              fill
              sizes="100vw"
              priority
              className={filmStyles.poster}
            />
          ) : <HomeV4Film
            desktop="/videos/hero-forest-sanctuary.mp4"
            mobile="/videos/hero-forest-sanctuary-mobile.mp4"
            poster="/images/hero-forest-sanctuary-poster.jpg"
            priority
          />}
        </motion.div>
        <span className="home-v4-opening__wash" />
      </div>

      <motion.span
        aria-hidden="true"
        className="home-v4-opening__light home-v4-opening__light--one"
        data-opening-light
        style={{ x: readingStill ? 0 : lightX, opacity: readingStill ? 0 : 0.3 }}
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
            <motion.span className={openingStyles.signature} aria-hidden="true" style={{ "--signature-draw": readingStill ? 1 : signatureDraw } as MotionStyle}>
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
          style={{ "--proof-sweep": readingStill ? "0%" : proofSweep } as MotionStyle}
        >
          <span>Dr. Haley Nutrition</span>
          <p className={openingStyles.proofStory}>A clearer message.<br />A recorded change in response.</p>
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
          <Link href="/work/dr-haley-nutrition" className={openingStyles.proofLink} prefetch={false}>
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
  const [keyboardReading, setKeyboardReading] = useState(false);
  const readingStill = prefersReducedMotion || keyboardReading;
  const inView = useInView(sectionRef, { amount: .08 });
  const motionActive = inView && !readingStill;
  const selectionId = useId();
  const active = RECOGNITION_STATES[activeIndex];
  const proof = RECOGNITION_PROOFS[activeIndex];
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
    if (!changed || !motionActive) return;
    const direction = selectionDirection === "forward" ? 1 : -1;
    readingControls.set({ x: direction * 8, y: 3 });
    exampleControls.set({ x: direction * -6, y: 2 });
    answerControls.set({ x: direction * 6 });
    void readingControls.start({ x: 0, y: 0, transition: { duration: .38, ease: EASE } });
    void exampleControls.start({ x: 0, y: 0, transition: { duration: .42, ease: EASE } });
    void answerControls.start({ x: 0, transition: { duration: .44, ease: EASE } });
    return () => { readingControls.stop(); exampleControls.stop(); answerControls.stop(); };
  }, [activeIndex, selectionDirection, motionActive, readingControls, exampleControls, answerControls, settleReading]);

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
      data-recognition-reading-still={readingStill}
      data-cursor-world="light"
      className={`home-v4-recognition ${recognitionStyles.section}`}
      aria-labelledby="home-v4-recognition-title"
      style={{ "--recognition-accent": active.accent } as React.CSSProperties}
      onFocusCapture={(event) => {
        settleReading();
        if (event.target !== event.currentTarget && event.target.matches(":focus-visible")) {
          setKeyboardReading(true);
          revealControl(event.target);
        }
      }}
      onKeyDownCapture={() => { settleReading(); setKeyboardReading(true); }}
      onPointerDownCapture={() => setKeyboardReading(false)}
    >
      <LivingGradient contours preset="meadow" shaft={false} />
      <div className="home-v4-recognition__media" aria-hidden="true">
        {readingStill ? (
          <Image src="/images/pexels-fog-sunrise-poster.jpg" alt="" fill sizes="100vw" className={filmStyles.poster} />
        ) : (
          <HomeV4Film
            desktop="/videos/pexels-fog-sunrise.mp4"
            mobile="/videos/pexels-fog-sunrise-mobile.mp4"
            poster="/images/pexels-fog-sunrise-poster.jpg"
          />
        )}
        <span />
      </div>

      <motion.div
        className="home-v4-recognition__reflection"
        aria-hidden="true"
        style={{ x: readingStill ? 0 : reflectionX, opacity: 0.3 }}
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
                {index === activeIndex && (
                  <motion.span
                    key={motionActive ? "animated" : "settled"}
                    className={recognitionStyles.choiceIndicator}
                    layoutId={motionActive ? `recognition-selection-${selectionId}` : undefined}
                    transition={{ duration: motionActive ? .38 : 0, ease: EASE }}
                    aria-hidden="true"
                  />
                )}
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
              <motion.i className={recognitionStyles.exampleSignal} aria-hidden="true" style={{ scaleX: readingStill ? 1 : exampleSignal }} />
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
            <a
              href="#paths"
              className={recognitionStyles.answer}
              onClick={() => publishServicesSituation(active.situation, "home_recognition")}
              aria-label={`${active.path}: explore this path`}
              data-cursor-label="explore"
            >
              <div className={recognitionStyles.readingStack}>
                <div className={recognitionStyles.readingMeasure} aria-hidden="true" inert>
                  {RECOGNITION_STATES.map((state) => <div key={state.number}><RecognitionAnswer state={state} /></div>)}
                </div>
                <motion.div initial={false} animate={answerControls} data-recognition-answer>
                  <RecognitionAnswer state={active} />
                </motion.div>
              </div>
              <span className={recognitionStyles.answerArrow} aria-hidden="true">
                <ArrowDownRight size={22} />
              </span>
              <span className={recognitionStyles.answerHint} aria-hidden="true">Explore this path</span>
            </a>

            <div className={recognitionStyles.readingLinks}>
              <Link
                href={`/work/${proof.slug}`}
                prefetch={false}
                onClick={() => publishServicesSituation(active.situation, "home_recognition")}
                className={recognitionStyles.link}
                aria-label={`Read the ${proof.title} case study`}
                data-cursor-label="read"
              >
                <span className={recognitionStyles.readingStack}>
                  <span className={recognitionStyles.readingMeasure} aria-hidden="true" inert>
                    {RECOGNITION_PROOFS.map((project) => <span key={project.slug}>Case study: {project.title}</span>)}
                  </span>
                  <span>Case study: {proof.title}</span>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <a
                href="#cost"
                onClick={() => publishServicesSituation(active.situation, "home_recognition")}
                className={recognitionStyles.link}
                data-cursor-label="follow"
              >
                Follow the cost of inconsistency <ArrowDownRight size={18} aria-hidden="true" />
              </a>
            </div>
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
  const [keyboardReading, setKeyboardReading] = useState(false);
  const inView = useInView(sectionRef, { amount: .06 });
  const motionActive = hydrated && inView && !prefersReducedMotion && !keyboardReading;
  const [comparison, setComparison] = useState<{ mode: MessageMode; direction: number }>({ mode: "separate", direction: 0 });
  const manuallyChosen = useRef(false);
  const touchActive = useRef(false);
  const demonstrated = useRef(false);
  const [arrived, setArrived] = useState(false);
  const [entranceFinished, setEntranceFinished] = useState(false);
  const restartDemonstration = useRef<() => void>(() => {});

  const settleComparison = useCallback(() => {
    setComparison((current) => current.direction === 0 ? current : { ...current, direction: 0 });
  }, []);

  function claimReading() {
    manuallyChosen.current = true;
    restartDemonstration.current();
    setEntranceFinished(true);
    settleComparison();
  }

  // One finite demonstration per visit. Reading, manual choices, hidden tabs
  // and the global motion preference take priority over automatic progression.
  useEffect(() => {
    const element = comparisonRef.current;
    if (!element || !motionActive || demonstrated.current || manuallyChosen.current) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    let disposed = false;
    const clear = () => { clearTimeout(timer); timer = undefined; };
    const selectionOwnsReading = () => {
      const selection = document.getSelection();
      return Boolean(selection && !selection.isCollapsed && selection.rangeCount &&
        selection.getRangeAt(0).intersectsNode(sectionRef.current ?? element));
    };
    const protectSelection = () => {
      if (disposed || !selectionOwnsReading()) return;
      manuallyChosen.current = true;
      clear();
      settleComparison();
      setEntranceFinished(true);
    };
    const schedule = () => {
      clear();
      if (disposed || !visible || document.hidden || touchActive.current || manuallyChosen.current || demonstrated.current) return;
      if (selectionOwnsReading()) { protectSelection(); return; }
      timer = setTimeout(() => {
        if (disposed || !visible || document.hidden || touchActive.current || manuallyChosen.current || demonstrated.current || element.contains(document.activeElement)) return;
        if (selectionOwnsReading()) { protectSelection(); return; }
        demonstrated.current = true;
        setComparison({ mode: "shared", direction: 1 });
      }, 4800);
    };
    restartDemonstration.current = schedule;
    const observer = new IntersectionObserver(([entry]) => {
      if (disposed) return;
      visible = entry.isIntersecting && entry.intersectionRatio >= .65;
      if (visible) setArrived(true);
      schedule();
    }, { threshold: [0, .65] });
    observer.observe(element);
    document.addEventListener("visibilitychange", schedule);
    document.addEventListener("selectionchange", protectSelection);
    return () => {
      disposed = true;
      clear();
      restartDemonstration.current = () => {};
      observer.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      document.removeEventListener("selectionchange", protectSelection);
    };
  }, [motionActive, settleComparison]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const { scrollYProgress: comparisonProgress } = useScroll({ target: comparisonRef, offset: ["start end", "end start"] });
  const lineProgress = useTransform(scrollYProgress, [0.2, 0.6], [0.08, 1]);
  const comparisonArrival = useTransform(comparisonProgress, [0, 0.62], [0, 1]);
  const messageTransition = comparison.direction === 0 ? "idle" : comparison.direction > 0 ? "forward" : "reverse";

  useEffect(() => {
    if (!motionActive) {
      settleComparison();
      // An interrupted entrance is consumed. Initial offscreen rendering
      // leaves the first arrival available once the chapter enters view.
      if (arrived || prefersReducedMotion || keyboardReading) setEntranceFinished(true);
    }
  }, [arrived, keyboardReading, motionActive, prefersReducedMotion, settleComparison]);

  function chooseMessageMode(mode: MessageMode, keyboardChoice: boolean) {
    claimReading();
    if (keyboardChoice) setKeyboardReading(true);
    // Keyboard and assistive activation update the reading in place. Pointer
    // choices retain the directional text motion and connected diagram.
    const direction = !motionActive || keyboardChoice ? 0 : mode === "shared" ? 1 : -1;
    setComparison((current) => current.mode === mode
      ? current.direction === 0 ? current : { ...current, direction: 0 }
      : { mode, direction });
  }

  function revealFocusedComparison(event: React.FocusEvent<HTMLElement>) {
    claimReading();
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) return;
    setKeyboardReading(true);
    const bounds = target.getBoundingClientRect();
    if (bounds.top < 80 || bounds.bottom > window.innerHeight - 80) {
      target.scrollIntoView({
        block: bounds.height > window.innerHeight - 160 ? "start" : "nearest",
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
      data-cost-reading-still={!motionActive}
      className={costStyles.section}
      aria-labelledby="home-v4-cost-title"
      onFocusCapture={revealFocusedComparison}
      onKeyDownCapture={() => { claimReading(); setKeyboardReading(true); }}
      onPointerDownCapture={(event) => {
        setKeyboardReading(false);
        // Touch scrolling pauses the timer; a click confirms intent, while
        // pointercancel permits a fresh reading interval after scrolling.
        if (event.pointerType === "touch" || event.pointerType === "pen") {
          touchActive.current = true;
          restartDemonstration.current();
        } else claimReading();
      }}
      onPointerUp={() => { touchActive.current = false; restartDemonstration.current(); }}
      onPointerCancel={() => { touchActive.current = false; restartDemonstration.current(); }}
      onClickCapture={(event) => { claimReading(); if (event.detail === 0) setKeyboardReading(true); }}
    >
      <LivingGradient contours preset="wanderlust" />
      <div className={costStyles.shell}>
        <header className={costStyles.header}>
          <div data-home-cost-heading>
            <p className={costStyles.eyebrow}>02 · The hidden cost</p>
            <h2 id="home-v4-cost-title">More content.<br /><em>Less recognition.</em></h2>
          </div>
          <p className={costStyles.intro}>
            Your website, emails and social posts can say different things about the same business. Positioning gives them one reason for buyers to remember you.
          </p>
        </header>
        <motion.div
          ref={comparisonRef}
          data-home-cost-comparison
          className={costStyles.comparison}
          data-message-mode={comparison.mode}
          data-story-arrived={arrived && !entranceFinished && motionActive}
          style={{ "--comparison-arrival": motionActive ? comparisonArrival : 1 } as MotionStyle}
        >
          <div className={costStyles.comparisonHeader}>
            <p className={costStyles.exampleLabel}>Illustrative example · A brand consultancy</p>
            <div className={costStyles.modeChoices} role="group" aria-label="Compare how a brand communicates">
              <button type="button" aria-pressed={comparison.mode === "separate"} aria-controls="brand-message-example" onClick={(event) => chooseMessageMode("separate", event.detail === 0)}>
                Mixed messages
              </button>
              <button type="button" aria-pressed={comparison.mode === "shared"} aria-controls="brand-message-example" onClick={(event) => chooseMessageMode("shared", event.detail === 0)}>
                Clear positioning
              </button>
            </div>
          </div>

          <div
            id="brand-message-example"
            className={costStyles.messageExample}
            role="region"
            aria-label="Message comparison"
            tabIndex={0}
            onPointerDown={() => { settleComparison(); setEntranceFinished(true); }}
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
                    <span className={costStyles.meaningStack}>
                      <span className={costStyles.messageMeasure} aria-hidden="true" inert>
                        <span>{touchpoint.meaning}</span><span>A clear reason to choose</span>
                      </span>
                      <span className={costStyles.meaningText}>{comparison.mode === "shared" ? "A clear reason to choose" : touchpoint.meaning}</span>
                    </span>
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
                <span className={costStyles.countWindow}>
                  <span className={costStyles.countReel}><span>03</span><span>01</span></span>
                </span>
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

        <div className={costStyles.nextChapter}>
          <div className={costStyles.rule} aria-hidden="true">
            <motion.span style={{ scaleX: motionActive ? lineProgress : 1 }} />
          </div>
          <a href="#cost-stack" className={costStyles.nextLink}>
            See what inconsistency costs <ArrowDownRight size={18} aria-hidden="true" />
          </a>
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
