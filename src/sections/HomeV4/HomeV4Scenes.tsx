"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { LivingImage } from "@/components/LivingImage";
import { usesLivingStill } from "@/lib/mediaMode";

const EASE = [0.22, 1, 0.36, 1] as const;
type SelectionDirection = "forward" | "backward";
const COST_MOMENT_VARIANTS = {
  enter: (direction: SelectionDirection) => ({
    opacity: 0,
    x: direction === "forward" ? 16 : -16,
    y: 8,
    filter: "blur(3px)",
  }),
  active: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  exit: (direction: SelectionDirection) => ({
    opacity: 0,
    x: direction === "forward" ? -10 : 10,
    y: -6,
    filter: "blur(2px)",
  }),
};

const COST_STAGES = [
  {
    number: "01",
    title: "A campaign introduces the business.",
    body: "Buyers meet a promise and begin deciding where the brand belongs.",
    signal: "First impression",
    memory: "Association begins",
    cause: "The business enters memory",
  },
  {
    number: "02",
    title: "The next touchpoint tells a different story.",
    body: "Buyers must decide whether they are still looking at the same business.",
    signal: "Meaning changes",
    memory: "Association splits",
    cause: "A second version arrives",
  },
  {
    number: "03",
    title: "Every channel starts from the beginning.",
    body: "Content keeps rebuilding context before it can make the offer desirable.",
    signal: "Context repeats",
    memory: "Familiarity slows",
    cause: "Channels rebuild context",
  },
  {
    number: "04",
    title: "Marketing keeps paying for the introduction.",
    body: "Reach grows, yet buyers still struggle to say what the brand stands for.",
    signal: "Spend repeats",
    memory: "Recognition trails",
    cause: "Investment carries the reset",
  },
] as const;

export function V4OpeningScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.28 });
  const openingVideo = "/videos/hero-forest-sanctuary.mp4";
  const openingPoster = "/images/hero-forest-sanctuary-poster.jpg";
  const livingOpening = usesLivingStill(openingVideo);

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
        {livingOpening ? (
          <LivingImage
            src={openingPoster}
            priority
            imagePosition="36% 44%"
            intensity="hero"
            className="home-v4-opening__living"
          />
        ) : (
          <video
            src={openingVideo}
            poster={openingPoster}
            data-home-playback-rate="1.1"
            muted
            loop
            playsInline
            aria-hidden="true"
            preload="metadata"
          />
        )}
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
          <span>Direct with Suman Sharma</span>
        </div>

        <div className="home-v4-opening__copy" data-home-reading-plane>
          <motion.p
            className="home-v4-opening__eyebrow"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.58, delay: 0.08, ease: EASE }}
          >
            Brand strategy, written and directed by Suman Sharma
          </motion.p>

          <h1 id="home-v4-opening-title">
            <motion.span
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.12, ease: EASE }}
            >
              Turn a growing business into a brand buyers
            </motion.span>
            <motion.em
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.66, delay: 0.24, ease: EASE }}
            >
              understand, remember, and choose.
            </motion.em>
          </h1>

          <motion.p
            className="home-v4-opening__lede"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.58, delay: 0.32, ease: EASE }}
          >
            For founders whose business has outgrown the way it sounds or looks, Branding Tatva rebuilds the position first, then the language, identity, website, and content around it.
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
              Bring me the brand question <ArrowUpRight size={15} />
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
          <span>Working with Branding Tatva</span>
          <strong>You speak with the strategist doing the work.</strong>
          <p>Nothing passes between sales, strategy, and delivery. Suman keeps the original business problem in view throughout.</p>
          <Link href="#evidence" className="home-v4-opening__proof-link">
            Inspect the client evidence <ArrowDownRight size={13} />
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
  const selectionDirectionRef = useRef<SelectionDirection>("forward");
  const displayedIndexRef = useRef(0);
  const ambientCompleteRef = useRef(false);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.55, margin: "0px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [committedIndex, setCommittedIndex] = useState(0);
  const [interactionHeld, setInteractionHeld] = useState(false);
  const [sequencePaused, setSequencePaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const active = COST_STAGES[activeIndex];
  displayedIndexRef.current = activeIndex;
  const sequenceComplete = ambientCompleteRef.current;
  const ambientSequencing =
    !prefersReducedMotion &&
    inView &&
    pageVisible &&
    !interactionHeld &&
    !sequencePaused &&
    !ambientCompleteRef.current;
  const sequenceAction = sequenceComplete
    ? "Replay sequence"
    : sequencePaused
      ? "Resume sequence"
      : "Pause sequence";
  const SequenceIcon = sequenceComplete ? RotateCcw : sequencePaused ? Play : Pause;

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
        rememberSelectionDirection(nextIndex, "forward");
        setCommittedIndex(nextIndex);
        setActiveIndex(nextIndex);
        if (nextIndex === COST_STAGES.length - 1) ambientCompleteRef.current = true;
      },
      committedIndex === 0 ? 2800 : 3600,
    );

    return () => window.clearTimeout(timer);
  }, [ambientSequencing, committedIndex]);

  function rememberSelectionDirection(
    next: number,
    direction?: SelectionDirection,
  ) {
    const current = displayedIndexRef.current;
    if (next === current) return;
    selectionDirectionRef.current = direction ?? (next > current ? "forward" : "backward");
    displayedIndexRef.current = next;
  }

  function choose(index: number, direction?: SelectionDirection) {
    const next = (index + COST_STAGES.length) % COST_STAGES.length;
    rememberSelectionDirection(next, direction);
    ambientCompleteRef.current = true;
    setSequencePaused(false);
    setCommittedIndex(next);
    setActiveIndex(next);
  }

  function preview(index: number) {
    const next = (index + COST_STAGES.length) % COST_STAGES.length;
    rememberSelectionDirection(next);
    setActiveIndex(next);
  }

  function releasePreview() {
    rememberSelectionDirection(committedIndex);
    setActiveIndex(committedIndex);
    setInteractionHeld(false);
  }

  function controlSequence() {
    if (ambientCompleteRef.current) {
      rememberSelectionDirection(0, "forward");
      ambientCompleteRef.current = false;
      setSequencePaused(false);
      setCommittedIndex(0);
      setActiveIndex(0);
      return;
    }

    setSequencePaused((paused) => !paused);
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
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? "forward"
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? "backward"
        : undefined;
    choose(next, direction);
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
      data-cost-preview={activeIndex !== committedIndex ? "true" : undefined}
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

      <div className="cost-film__frame" data-home-frame>
        <header className="cost-film__header">
          <div>
            <span>03</span>
            <p>The hidden cost</p>
          </div>
          <div className="cost-film__header-actions">
            <p>{active.number} / 04</p>
            {!prefersReducedMotion && (
              <button
                type="button"
                className="cost-film__sequence-control"
                aria-label={sequenceAction}
                onClick={controlSequence}
              >
                <SequenceIcon size={14} aria-hidden="true" />
                <span>{sequenceAction}</span>
              </button>
            )}
          </div>
        </header>

        <div className="cost-film__story">
          <div className="cost-film__lead">
            <p>What inconsistency makes buyers do</p>
            <h2 id="cost-film-title">
              Every new version makes the market <em>learn you again.</em>
            </h2>
          </div>

          <AnimatePresence
            mode="sync"
            initial={false}
            custom={selectionDirectionRef.current}
          >
            <motion.article
              key={active.number}
              className="cost-film__moment"
              id="cost-film-active-panel"
              role="tabpanel"
              aria-labelledby={`cost-film-tab-${activeIndex}`}
              data-home-reading-plane
              data-home-selection-direction={selectionDirectionRef.current}
              custom={selectionDirectionRef.current}
              variants={COST_MOMENT_VARIANTS}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setInteractionHeld(true);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setInteractionHeld(false);
              }}
              initial={prefersReducedMotion ? false : "enter"}
              animate="active"
              exit={prefersReducedMotion ? undefined : "exit"}
              transition={{ duration: prefersReducedMotion ? 0 : 0.44, ease: EASE }}
            >
              <p>{active.signal}</p>
              <h3>{active.title}</h3>
              <p>{active.body}</p>
              <strong>{active.memory}</strong>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="cost-film__lower">
          <div className="cost-film__rail" role="tablist" aria-label="Four moments in the cost of changing brand signals">
            {COST_STAGES.map((stage, index) => {
              const displayed = index === activeIndex;
              const committed = index === committedIndex;
              const stageState = displayed ? "active" : index < committedIndex ? "past" : "future";
              return (
                <button
                  key={stage.number}
                  ref={(node) => {
                    choiceRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`cost-film-tab-${index}`}
                  aria-selected={committed}
                  aria-controls="cost-film-active-panel"
                  tabIndex={committed ? 0 : -1}
                  className={displayed ? "is-active" : undefined}
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
              Keep the position stable and every campaign can deepen what buyers already know.
            </p>
            <Link
              href="#evidence"
              data-magnetic
              data-cursor-label="proof"
              data-section-jump-yield="true"
            >
              See what this changed for clients <ArrowDownRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
