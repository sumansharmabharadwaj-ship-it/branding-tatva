"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const RECOGNITION_STATES = [
  {
    number: "01",
    label: "The idea is clear in your head.",
    headline: "The market keeps meeting a different version.",
    body:
      "The logo, website, pitch, and content are making separate promises because the position was never committed first.",
    path: "Build the foundation",
    proof: "A position the rest of the business can inherit.",
    accent: "#C77752",
  },
  {
    number: "02",
    label: "The identity already exists.",
    headline: "The business has quietly outgrown it.",
    body:
      "What the company has become and what its brand still teaches people to expect are no longer the same thing.",
    path: "Reposition the system",
    proof: "Useful recognition kept. Confusing signals removed.",
    accent: "#7D9BAF",
  },
  {
    number: "03",
    label: "Marketing is active.",
    headline: "Memory is starting from zero each time.",
    body:
      "Every campaign works alone. Attention arrives, then disappears because no repeated pattern is waiting underneath it.",
    path: "Create consistency",
    proof: "One idea repeated with intent across every channel.",
    accent: "#C6A97A",
  },
] as const;

const COST_STAGES = [
  {
    number: "01",
    title: "A campaign begins.",
    body: "The audience meets the business through one clear promise.",
    signal: "New promise",
    memory: "Association begins",
    cause: "The business enters memory",
  },
  {
    number: "02",
    title: "The brand changes shape.",
    body: "The next touchpoint teaches a different expectation.",
    signal: "Promise reframed",
    memory: "Association splits",
    cause: "A second version arrives",
  },
  {
    number: "03",
    title: "Every channel explains again.",
    body: "Content spends more energy rebuilding context before it can create desire.",
    signal: "Explanation repeats",
    memory: "Familiarity slows",
    cause: "Channels rebuild context",
  },
  {
    number: "04",
    title: "Marketing carries the introduction.",
    body: "Reach grows while recognition continues to trail the effort behind it.",
    signal: "Spend reintroduces",
    memory: "Recognition trails",
    cause: "Investment carries the reset",
  },
] as const;

export function V4OpeningScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.28 });

  return (
    <section
      ref={sectionRef}
      id="opening"
      data-home-v4-chapter="opening"
      data-home-chapter="opening"
      data-home-section="opening"
      data-cursor-world="dark"
      className="home-v4-opening"
      aria-labelledby="home-v4-opening-title"
    >
      <div
        className="home-v4-opening__media"
        aria-hidden="true"
        data-media-id="BT-HOME-HERO-FOREST-SANCTUARY"
      >
        <video
          src="/videos/hero-forest-sanctuary.mp4"
          poster="/images/hero-forest-sanctuary-poster.jpg"
          data-home-playback-rate="1.1"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
        />
        <motion.span
          className="home-v4-opening__camera"
          initial={false}
          animate={
            prefersReducedMotion || !inView
              ? { scale: 1.03, x: 0, y: 0 }
              : { scale: 1.075, x: -8, y: -5 }
          }
          transition={{ duration: prefersReducedMotion ? 0 : 8, ease: "easeOut" }}
        />
        <span className="home-v4-opening__wash" />
      </div>

      <div className="home-v4-opening__shell">
        <div className="home-v4-opening__topline">
          <span>Brand strategy &amp; systems</span>
          <span>Founder-led · direct authorship</span>
        </div>

        <div className="home-v4-opening__copy">
          <motion.p
            className="home-v4-opening__eyebrow"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.58, delay: 0.08, ease: EASE }}
          >
            Strategy directed by Suman Sharma
          </motion.p>

          <h1 id="home-v4-opening-title">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.12, ease: EASE }}
            >
              Turn a growing business into a brand people
            </motion.span>
            <motion.em
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.66, delay: 0.24, ease: EASE }}
            >
              recognise, trust, and choose.
            </motion.em>
          </h1>

          <motion.p
            className="home-v4-opening__lede"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.58, delay: 0.32, ease: EASE }}
          >
            Branding Tatva shapes positioning, language, identity, and market expression into one coherent system your business can carry forward.
          </motion.p>

          <motion.div
            className="home-v4-opening__actions"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.56, delay: 0.4, ease: EASE }}
          >
            <Link
              href="/contact"
              className="home-v4-button home-v4-button--primary"
              data-magnetic
              data-cursor-label="begin"
            >
              Open the strategy room <ArrowUpRight size={15} />
            </Link>
            <Link
              href="/work"
              className="home-v4-button home-v4-button--quiet"
              data-magnetic
              data-cursor-label="proof"
            >
              See the work <ArrowDownRight size={15} />
            </Link>
          </motion.div>
        </div>

        <motion.aside
          className="home-v4-opening__proof"
          initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.42, ease: EASE }}
        >
          <span>How the engagement feels</span>
          <strong>One strategist. One connected system.</strong>
          <p>Direct access from the first diagnosis through the decisions that shape the final brand.</p>
          <i aria-hidden="true" />
        </motion.aside>

        <a href="#recognition" className="home-v4-opening__scroll" aria-label="Continue to visitor recognition">
          <span>Find your starting point</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function V4RecognitionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const holdUntilRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.34 });
  const [activeIndex, setActiveIndex] = useState(0);
  const active = RECOGNITION_STATES[activeIndex];

  function choose(index: number) {
    holdUntilRef.current = Date.now() + 11000;
    setActiveIndex(index);
  }

  return (
    <section
      ref={sectionRef}
      id="recognition"
      data-home-v4-chapter="recognition"
      data-home-chapter="recognition"
      data-home-section="recognition"
      data-cursor-world="dark"
      className="home-v4-recognition"
      aria-labelledby="home-v4-recognition-title"
      style={{ "--recognition-accent": active.accent } as React.CSSProperties}
      onPointerDown={() => {
        holdUntilRef.current = Date.now() + 11000;
      }}
      onFocusCapture={() => {
        holdUntilRef.current = Date.now() + 11000;
      }}
    >
      <div
        className="home-v4-recognition__media"
        aria-hidden="true"
        data-media-id="BT-HOME-RECOGNITION-MISTY-RIDGE"
      >
        <video
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          poster="/images/generated/bt-home-recognition-mist-v1.webp"
          data-home-playback-rate="1.1"
        >
          <source src="/videos/pixabay-misty-ridge-drift.mp4" type="video/mp4" />
        </video>
        <span />
      </div>

      <motion.div
        className="home-v4-recognition__reflection"
        aria-hidden="true"
        animate={
          prefersReducedMotion || !inView
            ? undefined
            : { x: ["-8%", "8%", "-8%"], opacity: [0.18, 0.5, 0.18] }
        }
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="home-v4-recognition__shell">
        <header className="home-v4-recognition__header">
          <div>
            <p>01 · Recognition</p>
            <h2 id="home-v4-recognition-title">
              Most inconsistency begins <em>before the design file.</em>
            </h2>
          </div>
          <span>
            Choose the condition that feels familiar. Your selection stays in place while you read.
          </span>
        </header>

        <div className="home-v4-recognition__stage">
          <div className="home-v4-recognition__copy" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.number}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
              >
                <p className="home-v4-recognition__label">{active.label}</p>
                <h3>{active.headline}</h3>
                <p className="home-v4-recognition__body">{active.body}</p>
                <div className="home-v4-recognition__answer">
                  <span>The useful move</span>
                  <strong>{active.path}</strong>
                  <p>{active.proof}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <Link href="#cost" className="home-v4-text-link" data-magnetic data-cursor-label="follow">
              See what the drift quietly costs <span aria-hidden="true">↘</span>
            </Link>
          </div>

          <div className="home-v4-recognition__diagram" aria-label="Three brand conditions converging on one strategic decision">
            <svg viewBox="0 0 620 520" role="img">
              <defs>
                <radialGradient id="v4-recognition-core">
                  <stop offset="0%" stopColor={active.accent} stopOpacity="0.34" />
                  <stop offset="100%" stopColor={active.accent} stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="310" cy="258" r="130" fill="url(#v4-recognition-core)" />
              {[
                "M92 92 C182 110 224 182 310 258",
                "M528 92 C438 118 396 184 310 258",
                "M310 474 C310 390 310 330 310 258",
              ].map((path, index) => (
                <g key={path}>
                  <path d={path} fill="none" stroke="rgba(244,239,230,.12)" strokeWidth="1" />
                  <motion.path
                    d={path}
                    fill="none"
                    stroke={RECOGNITION_STATES[index].accent}
                    strokeWidth={index === activeIndex ? 2.2 : 1}
                    strokeDasharray="7 12"
                    animate={{
                      strokeDashoffset: index === activeIndex && inView ? [0, -52] : 0,
                      opacity: index === activeIndex ? 0.92 : 0.22,
                    }}
                    transition={{
                      strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" },
                      opacity: { duration: 0.38 },
                    }}
                  />
                </g>
              ))}
              <motion.circle
                cx="310"
                cy="258"
                r="54"
                fill="rgba(18,22,25,.7)"
                stroke={active.accent}
                strokeWidth="1.6"
                animate={
                  prefersReducedMotion || !inView
                    ? undefined
                    : { scale: [0.94, 1.08, 0.94], opacity: [0.8, 1, 0.8] }
                }
                style={{ transformOrigin: "310px 258px" }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>

            <div className="home-v4-recognition__core">
              <span>one decision</span>
              <strong>{active.path.split(" ")[0]}</strong>
            </div>

            {RECOGNITION_STATES.map((state, index) => {
              const positions = [
                { left: "15%", top: "18%" },
                { left: "85%", top: "18%" },
                { left: "50%", top: "88%" },
              ];
              return (
                <button
                  key={state.number}
                  type="button"
                  aria-pressed={index === activeIndex}
                  onClick={() => choose(index)}
                  style={positions[index]}
                  className={index === activeIndex ? "is-active" : undefined}
                  data-cursor-label={state.number}
                >
                  <span>{state.number}</span>
                  <strong>{state.label}</strong>
                  <i aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function V4HiddenCostScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, -26]);
  const copyY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const active = COST_STAGES[activeIndex];

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(COST_STAGES.length - 1, Math.floor(progress * COST_STAGES.length));
    setActiveIndex((current) => (current === next ? current : next));
  });


  return (
    <section
      ref={sectionRef}
      id="cost"
      data-home-v4-chapter="cost"
      data-home-chapter="cost"
      data-home-section="cost"
      data-cursor-world="dark"
      className="home-v4-cost"
      aria-labelledby="home-v4-cost-title"
    >
      <div className="home-v4-cost__sticky">
        <motion.div
          className="home-v4-cost__media"
          data-media-id="BT-HOME-HIDDEN-COST-RIVER-DAWN"
          style={prefersReducedMotion ? undefined : { scale: mediaScale, y: mediaY }}
          aria-hidden="true"
        >
          <video
            data-home-playback-rate="1.1"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            poster="/images/pexels-river-dawn-poster.jpg"
          >
            <source src="/videos/pexels-river-dawn.webm" type="video/webm" />
            <source src="/videos/pexels-river-dawn.mp4" type="video/mp4" />
          </video>
          <span />
        </motion.div>

        <div className="home-v4-cost__shell">
          <motion.header style={prefersReducedMotion ? undefined : { y: copyY }}>
            <p>02 · The hidden cost</p>
            <h2 id="home-v4-cost-title">
              Marketing becomes expensive when the brand underneath it <em>keeps changing shape.</em>
            </h2>
          </motion.header>

          <div className="home-v4-cost__stage">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={active.number}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
                aria-live="polite"
              >
                <span>{active.number} / 04</span>
                <h3>{active.title}</h3>
                <p>{active.body}</p>
                <dl>
                  <div>
                    <dt>Market signal</dt>
                    <dd>{active.signal}</dd>
                  </div>
                  <div>
                    <dt>Audience memory</dt>
                    <dd>{active.memory}</dd>
                  </div>
                </dl>
              </motion.article>
            </AnimatePresence>

            <div
              className="home-v4-cost__diagram"
              role="group"
              aria-label="A qualitative causal model showing how changing brand signals creates repeated rounds of audience relearning"
            >
              <div className="home-v4-cost__diagram-head">
                <div>
                  <span>Illustrative causal model</span>
                  <strong>One shift creates four rounds of relearning.</strong>
                </div>
                <span>{active.number} / 04</span>
              </div>

              <ol className="home-v4-cost__causal">
                {COST_STAGES.map((stage, index) => {
                  const activeStage = index === activeIndex;
                  const reached = index < activeIndex;
                  return (
                    <motion.li
                      key={stage.number}
                      className={activeStage ? "is-active" : reached ? "is-reached" : undefined}
                      animate={{
                        opacity: activeStage ? 1 : reached ? 0.72 : 0.38,
                        y: activeStage && !prefersReducedMotion ? -4 : 0,
                        scale: activeStage && !prefersReducedMotion ? 1.015 : 1,
                      }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: EASE }}
                    >
                      <span>{stage.number}</span>
                      <strong>{stage.cause}</strong>
                      <p>{stage.signal}</p>
                    </motion.li>
                  );
                })}
              </ol>

              <div className="home-v4-cost__foundation-line">
                <span>Stable foundation</span>
                <strong>Position → distinctive cues → repeated association</strong>
              </div>

              <div className="home-v4-cost__research">
                <p>
                  The sequence communicates direction; percentages stay outside this model.
                </p>
                <div>
                  <a
                    href="https://www.sciencedirect.com/science/article/pii/S0167811622000465"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Communication consistency study
                  </a>
                  <a
                    href="https://marketingscience.info/learn-with-us/commercial-research/distinctive-asset"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Distinctive asset research
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="home-v4-cost__footer">
            <p>
              A stable foundation gives marketing more force. Each signal carries the memory of the one before it.
            </p>
            <Link href="#foundation" className="home-v4-button home-v4-button--sand" data-magnetic data-cursor-label="foundation">
              Trace the foundation <ArrowDownRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
