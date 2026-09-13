"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { publishServicesSituation } from "@/lib/servicesJourney";
import recognitionStyles from "./RecognitionChoices.module.css";
import costStyles from "./HiddenCost.module.css";
import openingStyles from "./OpeningScene.module.css";

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

const BRAND_RESET_COSTS = [
  {
    number: "01",
    title: "More explaining.",
    body: "Each touchpoint makes a different promise. People need another explanation before they understand why they should choose you.",
  },
  {
    number: "02",
    title: "Work repeated.",
    body: "Every brief reopens the language, look, and tone. The team remakes decisions that could have carried forward.",
  },
  {
    number: "03",
    title: "Recognition lost.",
    body: "A campaign earns attention. A different identity next time makes the connection harder for people to recognise.",
  },
] as const;

const MESSAGE_TOUCHPOINTS = [
  { channel: "Website", separate: "Eat for your goals.", shared: "Dinner, decided before six." },
  { channel: "Email", separate: "Recipes for everyone.", shared: "A week of dinners. One short list." },
  { channel: "Social", separate: "Count every calorie.", shared: "Five dinners from one Sunday shop." },
] as const;

type MessageMode = "separate" | "shared";

export function V4OpeningScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const landscapeScale = useTransform(scrollYProgress, [0, 0.65, 1], [1.02, 1.17, 1.2]);
  const landscapeY = useTransform(scrollYProgress, [0, 1], [0, 58]);
  const lightX = useTransform(scrollYProgress, [0, 1], ["-18%", "80%"]);

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
          <video
            src="/videos/hero-forest-sanctuary.mp4"
            poster="/images/hero-forest-sanctuary-poster.jpg"
            muted
            autoPlay={!prefersReducedMotion}
            loop
            playsInline
            preload="auto"
          />
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
          <motion.p
            className="home-v4-opening__eyebrow"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.62, delay: 0.12, ease: EASE }}
          >
            Psychology finds the tension. Strategy gives it shape.
          </motion.p>

          <h1 id="home-v4-opening-title" className={openingStyles.headline}>
            <motion.span
              initial={prefersReducedMotion ? false : { y: 14 }}
              animate={{ y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.86, delay: 0.18, ease: EASE }}
            >
              Your audience has already formed an opinion.
            </motion.span>
            <motion.em
              initial={prefersReducedMotion ? false : { y: 14 }}
              animate={{ y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.82, delay: 0.34, ease: EASE }}
            >
              <span>Did you</span>{" "}<span>design it?</span>
            </motion.em>
          </h1>

          <motion.p
            className="home-v4-opening__lede"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.48, ease: EASE }}
          >
            A position people understand. A voice they recognise. A reason to choose you. Built from audience psychology, carried into words and design.
          </motion.p>

          <motion.div
            className="home-v4-opening__actions"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.66, delay: 0.6, ease: EASE }}
          >
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
          </motion.div>
        </div>

        <motion.aside
          className="home-v4-opening__proof"
          initial={prefersReducedMotion ? false : { opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.72, delay: 0.52, ease: EASE }}
        >
          <span>Dr. Haley Nutrition</span>
          <p className={openingStyles.proofStory}>Fewer posts.<br />A clearer reason to pay attention.</p>
          <strong>0.71% → 2.81%</strong>
          <p>LinkedIn engagement rate<br />December 2025 to January 2026</p>
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
  const choiceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectionDirection, setSelectionDirection] = useState<"forward" | "backward">("forward");
  const active = RECOGNITION_STATES[activeIndex];
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const reflectionX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  function choose(index: number) {
    publishServicesSituation(RECOGNITION_STATES[index].situation, "home_recognition");
    if (index === activeIndex) return;
    setSelectionDirection(index > activeIndex ? "forward" : "backward");
    setActiveIndex(index);
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
    choiceRefs.current[next]?.focus({ preventScroll: true });
  }

  return (
    <section
      ref={sectionRef}
      id="recognition"
      tabIndex={-1}
      data-home-v4-chapter="recognition"
      data-home-chapter="recognition"
      data-home-section="recognition"
      data-cursor-world="light"
      className={`home-v4-recognition ${recognitionStyles.section}`}
      aria-labelledby="home-v4-recognition-title"
      style={{ "--recognition-accent": active.accent } as React.CSSProperties}
    >
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
          <span>Choose the situation that feels familiar.</span>
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
            id="recognition-reading"
            role="tabpanel"
            aria-labelledby={`recognition-choice-${active.number}`}
            tabIndex={0}
            className={recognitionStyles.panel}
          >
            <motion.div
              key={active.number}
              initial={prefersReducedMotion ? false : { x: selectionDirection === "forward" ? 10 : -10 }}
              animate={{ x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: EASE }}
            >
              <p className={recognitionStyles.label}>What this means</p>
              <h3>{active.headline}</h3>
              <p className={recognitionStyles.body}>{active.body}</p>
              <div className={recognitionStyles.example}>
                <p className={recognitionStyles.exampleLabel}>Illustrative example</p>
                <div className={recognitionStyles.examplePair}>
                  {active.example.map((item) => (
                    <div key={item.label}>
                      <span>{item.label}</span>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className={recognitionStyles.answer}>
                <span>The useful move</span>
                <strong>{active.path}</strong>
                <p>{active.proof}</p>
              </div>
            </motion.div>

            <a
              href="#cost"
              onClick={() => publishServicesSituation(active.situation, "home_recognition")}
              className={recognitionStyles.link}
              data-magnetic
              data-cursor-label="follow"
            >
              See what inconsistency is costing <ArrowDownRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function V4HiddenCostScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [comparison, setComparison] = useState<{ mode: MessageMode; direction: number }>({ mode: "separate", direction: 0 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const lineProgress = useTransform(scrollYProgress, [0.2, 0.6], [0.08, 1]);

  function chooseMessageMode(mode: MessageMode) {
    setComparison((current) => current.mode === mode ? current : { mode, direction: mode === "shared" ? 1 : -1 });
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
      <div className={costStyles.shell}>
        <header className={costStyles.header}>
          <div>
            <p className={costStyles.eyebrow}>02 · The hidden cost</p>
            <h2 id="home-v4-cost-title">More content.<br /><em>The same introduction.</em></h2>
            <p className={costStyles.intro}>
              When the brand keeps changing, the next campaign has to introduce the business all over again.
            </p>
          </div>
          <div data-home-cost-comparison className={costStyles.comparison} data-message-mode={comparison.mode}>
            <p className={costStyles.exampleLabel}>Illustrative example · Meal planning</p>
            <div className={costStyles.modeChoices} role="group" aria-label="Compare how a brand communicates">
              <button type="button" aria-pressed={comparison.mode === "separate"} aria-controls="brand-message-example" onClick={() => chooseMessageMode("separate")}>
                Separate promises
              </button>
              <button type="button" aria-pressed={comparison.mode === "shared"} aria-controls="brand-message-example" onClick={() => chooseMessageMode("shared")}>
                Shared position
              </button>
            </div>

            <div id="brand-message-example" className={costStyles.messageExample}>
              <dl className={costStyles.touchpoints}>
                {MESSAGE_TOUCHPOINTS.map((touchpoint, index) => (
                  <div key={touchpoint.channel}>
                    <dt><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{touchpoint.channel}</dt>
                    <dd>
                      <span className={costStyles.messageMeasure} aria-hidden="true">
                        <span>{touchpoint.separate}</span>
                        <span>{touchpoint.shared}</span>
                      </span>
                      <motion.span
                        className={costStyles.messageText}
                        key={comparison.mode}
                        initial={prefersReducedMotion || comparison.direction === 0 ? false : { x: comparison.direction * 8 }}
                        animate={{ x: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : .3, ease: EASE }}
                      >
                        {touchpoint[comparison.mode]}
                      </motion.span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className={costStyles.comparisonMeaning} role="status" aria-atomic="true">
                {comparison.mode === "shared"
                  ? "One promise: make weekday dinners easier to decide."
                  : "Three channels. Three different reasons to choose."}
              </p>
            </div>
          </div>
        </header>

        <div className={costStyles.rule} aria-hidden="true">
          <motion.span style={{ scaleX: prefersReducedMotion ? 1 : lineProgress }} />
        </div>

        <ol className={costStyles.costs} aria-label="Where an inconsistent brand costs time and attention">
          {BRAND_RESET_COSTS.map((cost) => (
            <li data-home-cost-item key={cost.number}>
              <span className={costStyles.number} aria-hidden="true">{cost.number}</span>
              <div>
                <h3>{cost.title}</h3>
                <p>{cost.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={costStyles.footer}>
          <p>A clear position gives every campaign something to build on.</p>
          <a href="#foundation" className={costStyles.link} data-magnetic data-cursor-label="foundation">
            Build the foundation <ArrowDownRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
