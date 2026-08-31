"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

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
              href="/contact#call"
              className="home-v4-button home-v4-button--primary"
              data-magnetic
              data-cursor-label="begin"
            >
              Open the strategy room <ArrowUpRight size={15} />
            </Link>
            <Link
              href="#brand-diagnostic"
              className="home-v4-button home-v4-button--quiet"
              data-magnetic
              data-cursor-label="diagnose"
            >
              Diagnose my brand <ArrowDownRight size={15} />
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
          <Link href="#evidence" className="home-v4-opening__proof-link">
            Inspect verified client evidence <ArrowDownRight size={13} />
          </Link>
          <i aria-hidden="true" />
        </motion.aside>

      </div>
    </section>
  );
}

export function V4HiddenCostScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const choiceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const ambientCompleteRef = useRef(false);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.55, margin: "0px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [committedIndex, setCommittedIndex] = useState(0);
  const [interactionHeld, setInteractionHeld] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const active = COST_STAGES[activeIndex];
  const ambientSequencing =
    !prefersReducedMotion &&
    inView &&
    pageVisible &&
    !interactionHeld &&
    !ambientCompleteRef.current;

  useEffect(() => {
    function syncVisibility() {
      setPageVisible(document.visibilityState === "visible");
    }

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    if (!ambientSequencing) return;

    const nextIndex = committedIndex + 1;
    if (nextIndex >= COST_STAGES.length) {
      ambientCompleteRef.current = true;
      return;
    }

    const timer = window.setTimeout(
      () => {
        setCommittedIndex(nextIndex);
        setActiveIndex(nextIndex);
        if (nextIndex === COST_STAGES.length - 1) ambientCompleteRef.current = true;
      },
      committedIndex === 0 ? 2800 : 3600,
    );

    return () => window.clearTimeout(timer);
  }, [ambientSequencing, committedIndex]);

  function choose(index: number) {
    const next = (index + COST_STAGES.length) % COST_STAGES.length;
    ambientCompleteRef.current = true;
    setCommittedIndex(next);
    setActiveIndex(next);
  }

  function preview(index: number) {
    setActiveIndex((index + COST_STAGES.length) % COST_STAGES.length);
  }

  function releasePreview() {
    setActiveIndex(committedIndex);
    setInteractionHeld(false);
  }

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
    choose(next);
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
      data-cost-motion={ambientSequencing ? "sequencing" : "held"}
      className="cost-film"
      aria-labelledby="cost-film-title"
    >
      <motion.div
        className="cost-film__media"
        data-media-id="BT-HOME-HIDDEN-COST-RIVER-DAWN"
        animate={
          prefersReducedMotion || !inView
            ? { scale: 1.025, x: 0 }
            : { scale: 1.025 + activeIndex * 0.012, x: activeIndex * -5 }
        }
        transition={{ duration: prefersReducedMotion ? 0 : 1.1, ease: EASE }}
        aria-hidden="true"
      >
        <video
          data-home-playback-rate="0.92"
          muted
          loop
          playsInline
          aria-hidden="true"
          preload="none"
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
            <span>03</span>
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

          <motion.article
            key={active.number}
            className="cost-film__moment"
            id="cost-film-active-panel"
            role="tabpanel"
            aria-labelledby={`cost-film-tab-${activeIndex}`}
            data-home-reading-plane
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setInteractionHeld(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setInteractionHeld(false);
            }}
            onPointerDown={() => setInteractionHeld(true)}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.44, ease: EASE }}
          >
            <p>{active.signal}</p>
            <h3>{active.title}</h3>
            <p>{active.body}</p>
            <strong>{active.memory}</strong>
          </motion.article>
        </div>

        <div className="cost-film__lower">
          <div className="cost-film__rail" role="tablist" aria-label="Four moments in the cost of changing brand signals">
            {COST_STAGES.map((stage, index) => {
              const selected = index === activeIndex;
              const stageState = selected ? "active" : index < activeIndex ? "past" : "future";
              return (
                <button
                  key={stage.number}
                  ref={(node) => {
                    choiceRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`cost-film-tab-${index}`}
                  aria-selected={selected}
                  aria-controls="cost-film-active-panel"
                  tabIndex={selected ? 0 : -1}
                  className={selected ? "is-active" : undefined}
                  data-cost-state={stageState}
                  data-cursor-label={stage.number}
                  onClick={() => choose(index)}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    setInteractionHeld(true);
                    preview(index);
                  }}
                  onPointerLeave={(event) => {
                    if (document.activeElement !== event.currentTarget) releasePreview();
                  }}
                  onFocus={() => choose(index)}
                  onBlur={releasePreview}
                  onKeyDown={(event) => moveFromKeyboard(event, index)}
                >
                  <span>{stage.number}</span>
                  <span className="cost-film__rail-copy">
                    <strong>{stage.cause}</strong>
                    <small>{stage.memory}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="cost-film__resolution">
            <p>
              <span>The alternative</span>
              One position, repeated with care, lets every new signal strengthen the memory already there.
            </p>
            <Link href="#evidence" data-magnetic data-cursor-label="proof">
              See the decision in practice <ArrowDownRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
