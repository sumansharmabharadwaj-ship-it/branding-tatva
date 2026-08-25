"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const RECOGNITION_STATES = [
  {
    number: "01",
    shortLabel: "Clear idea",
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
    shortLabel: "Outgrown identity",
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
    shortLabel: "Active marketing",
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
          aria-hidden="true"
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

        <div className="home-v4-opening__copy" data-home-reading-plane>
          <motion.p
            className="home-v4-opening__eyebrow"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.58, delay: 0.08, ease: EASE }}
          >
            Strategy directed by Suman Sharma
          </motion.p>

          <h1 id="home-v4-opening-title">
            <motion.span
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.12, ease: EASE }}
            >
              Turn a growing business into a brand people
            </motion.span>
            <motion.em
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.66, delay: 0.24, ease: EASE }}
            >
              recognise, trust, and choose.
            </motion.em>
          </h1>

          <motion.p
            className="home-v4-opening__lede"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.58, delay: 0.32, ease: EASE }}
          >
            Branding Tatva shapes positioning, language, identity, and market expression into one coherent system your business can carry forward.
          </motion.p>

          <motion.div
            className="home-v4-opening__actions"
            initial={false}
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
              href="/services#proof"
              className="home-v4-button home-v4-button--quiet"
              data-magnetic
              data-cursor-label="proof"
            >
              See client proof <ArrowDownRight size={15} />
            </Link>
          </motion.div>
        </div>

        <motion.aside
          className="home-v4-opening__proof"
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.42, ease: EASE }}
        >
          <span>How the engagement feels</span>
          <strong>One strategist. One connected system.</strong>
          <p>Direct access from the first diagnosis through the decisions that shape the final brand.</p>
          <i aria-hidden="true" />
        </motion.aside>

      </div>
    </section>
  );
}

export function V4RecognitionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const choiceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.18, margin: "8% 0px -10% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: RECOGNITION_STATES.length,
    target: sectionRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const { activeIndex } = visualizer;
  const active = RECOGNITION_STATES[activeIndex];

  function moveFromKeyboard(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const direction =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!direction && event.key !== "Home" && event.key !== "End") return;

    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? RECOGNITION_STATES.length - 1
          : (index + direction + RECOGNITION_STATES.length) %
            RECOGNITION_STATES.length;
    visualizer.choose(nextIndex);
    choiceRefs.current[nextIndex]?.focus();
  }

  return (
    <section
      ref={sectionRef}
      id="recognition"
      data-home-v4-chapter="recognition"
      data-home-chapter="recognition"
      data-home-section="recognition"
      data-cursor-world="dark"
      data-scroll-story="recognition"
      className="home-v4-recognition"
      aria-labelledby="home-v4-recognition-title"
      style={{ "--recognition-accent": active.accent } as React.CSSProperties}
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
          aria-hidden="true"
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
            <p>02 · Recognition</p>
            <h2 id="home-v4-recognition-title">
              Most inconsistency begins <em>before the design file.</em>
            </h2>
          </div>
        </header>

        <div className="home-v4-recognition__stage">
          <div className="home-v4-recognition__copy" aria-live="polite">
            <AnimatePresence mode="sync" initial={false}>
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

            <Link href="#foundation" className="home-v4-text-link" data-magnetic data-cursor-label="follow">
              See the foundation that stops the drift <span aria-hidden="true">↘</span>
            </Link>

          </div>

          <div className="home-v4-recognition__diagram" aria-label="Three brand conditions converging on one strategic decision">
            <div
              id="home-v4-recognition-active-panel"
              role="tabpanel"
              aria-labelledby={`home-v4-recognition-tab-${activeIndex}`}
              className="home-v4-recognition__signal"
              aria-live="polite"
            >
              <span>{active.number} · {active.label}</span>
              <strong>{active.path}</strong>
              <p>{active.proof}</p>
            </div>

            <div className="home-v4-recognition__choices" role="tablist" aria-label="Brand conditions">
              {RECOGNITION_STATES.map((state, index) => (
                <button
                  key={state.number}
                  ref={(node) => {
                    choiceRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`home-v4-recognition-tab-${index}`}
                  aria-selected={index === activeIndex}
                  aria-controls="home-v4-recognition-active-panel"
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={() => visualizer.choose(index)}
                  onPointerEnter={() => visualizer.preview(index)}
                  onPointerLeave={(event) => {
                    if (document.activeElement !== event.currentTarget) visualizer.releasePreview();
                  }}
                  onFocus={() => visualizer.choose(index)}
                  onKeyDown={(event) => moveFromKeyboard(event, index)}
                  className={index === activeIndex ? "is-active" : undefined}
                  data-cursor-label={state.number}
                >
                  <span>{state.number}</span>
                  <strong>
                    <span className="home-v4-recognition__choice-short" aria-hidden="true">
                      {state.shortLabel}
                    </span>
                    <span className="home-v4-recognition__choice-full">{state.label}</span>
                  </strong>
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function V4HiddenCostScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const choiceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.18, margin: "8% 0px -10% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: COST_STAGES.length,
    target: sectionRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const activeIndex = visualizer.activeIndex;
  const active = COST_STAGES[activeIndex];

  function moveFromKeyboard(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % COST_STAGES.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index + COST_STAGES.length - 1) % COST_STAGES.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = COST_STAGES.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    visualizer.choose(next);
    choiceRefs.current[next]?.focus();
  }

  return (
    <section
      ref={sectionRef}
      id="cost"
      data-home-v4-chapter="cost"
      data-home-chapter="cost"
      data-home-section="cost"
      data-cursor-world="light"
      data-scroll-story="cost"
      data-active-cost={active.number}
      className="cost-film"
      aria-labelledby="cost-film-title"
    >
      <motion.div
        className="cost-film__media"
        data-media-id="BT-HOME-HIDDEN-COST-RIVER-DAWN"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: 1.025 + activeIndex * 0.012, x: activeIndex * -5 }
        }
        transition={{ duration: prefersReducedMotion ? 0 : 1.1, ease: EASE }}
        aria-hidden="true"
      >
        <video
          data-home-playback-rate="0.92"
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
      </motion.div>
      <div className="cost-film__veil" aria-hidden="true" />

      <div className="cost-film__frame">
        <header className="cost-film__header">
          <div>
            <span>04</span>
            <p>The hidden cost</p>
          </div>
          <p>{active.number} / 04</p>
        </header>

        <div className="cost-film__story">
          <div className="cost-film__lead">
            <p>What repeated change asks of the market</p>
            <h2 id="cost-film-title">
              Every new version asks people to <em>learn the brand again.</em>
            </h2>
          </div>

          <AnimatePresence mode="sync" initial={false}>
            <motion.article
              key={active.number}
              className="cost-film__moment"
              data-home-reading-plane
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.52, ease: EASE }}
            >
              <p>{active.signal}</p>
              <h3>{active.title}</h3>
              <p>{active.body}</p>
              <strong>{active.memory}</strong>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="cost-film__lower">
          <div className="cost-film__rail-label">
            <span>Follow the four moments</span>
            <span>Choose any moment to hold it</span>
          </div>
          <div className="cost-film__rail" role="group" aria-label="Four moments in the cost of changing brand signals">
            {COST_STAGES.map((stage, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={stage.number}
                  ref={(node) => {
                    choiceRefs.current[index] = node;
                  }}
                  type="button"
                  aria-pressed={selected}
                  className={selected ? "is-active" : undefined}
                  data-cursor-label={stage.number}
                  onClick={() => visualizer.choose(index)}
                  onPointerEnter={() => visualizer.preview(index)}
                  onPointerLeave={(event) => {
                    if (document.activeElement !== event.currentTarget) visualizer.releasePreview();
                  }}
                  onFocus={() => visualizer.preview(index)}
                  onBlur={visualizer.releasePreview}
                  onKeyDown={(event) => moveFromKeyboard(event, index)}
                >
                  <span>{stage.number}</span>
                  <strong>{stage.cause}</strong>
                </button>
              );
            })}
          </div>

          <div className="cost-film__resolution">
            <p>
              <span>Stable foundation</span>
              Position, distinctive cues, and repeated association let every signal strengthen the last.
            </p>
            <nav aria-label="Research behind the hidden cost model">
              <a
                href="https://www.sciencedirect.com/science/article/pii/S0167811622000465"
                target="_blank"
                rel="noreferrer"
              >
                Consistency study
              </a>
              <a
                href="https://marketingscience.info/learn-with-us/commercial-research/distinctive-asset"
                target="_blank"
                rel="noreferrer"
              >
                Distinctive asset research
              </a>
            </nav>
            <Link href="#foundation" data-magnetic data-cursor-label="foundation">
              See the foundation <ArrowDownRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
