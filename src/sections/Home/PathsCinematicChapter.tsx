"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const PATHS = [
  {
    number: "01",
    eyebrow: "For an idea becoming a business",
    title: "Build the foundation",
    start: "An idea",
    body:
      "Choose what the brand means before the logo, website, and content begin making accidental promises.",
    route: ["Question", "Architect", "Signal"],
    result: "A position the business can grow from",
    href: "/services#desire",
    tint: "#C98B63",
  },
  {
    number: "02",
    eyebrow: "For a business that outgrew its brand",
    title: "Reposition the system",
    start: "A brand that drifted",
    body:
      "Find the gap between what the company has become and what its current identity still teaches people to expect.",
    route: ["Decode", "Architect", "Signal"],
    result: "One recognisable idea across every touchpoint",
    href: "/services#situation",
    tint: "#88A77E",
  },
  {
    number: "03",
    eyebrow: "For a brand ready to compound",
    title: "Create consistency",
    start: "A brand in motion",
    body:
      "Translate the strategy into a repeatable system for content, campaigns, websites, and teams.",
    route: ["Signal", "Influence", "Compound"],
    result: "Recognition that keeps earning after launch",
    href: "/services#offerings",
    tint: "#D3A24F",
  },
] as const;

const CURVES = [
  "M112 70 C210 70 238 160 338 160",
  "M112 160 C210 160 238 160 338 160",
  "M112 250 C210 250 238 160 338 160",
] as const;

const ENTRY_Y = [70, 160, 250] as const;
const AUTO_ADVANCE_MS = 4000;
const MANUAL_HOLD_MS = 10500;
const HOVER_HOLD_MS = 3200;
const EASE = [0.22, 1, 0.36, 1] as const;

export function PathsCinematicChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const holdUntilRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, {
    amount: 0.22,
    margin: "8% 0px -12% 0px",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectionDirection, setSelectionDirection] = useState<"forward" | "backward">("forward");
  const active = PATHS[activeIndex];

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    const autoplay = window.matchMedia("(min-width: 821px) and (hover: hover) and (pointer: fine)");
    if (!autoplay.matches) return;

    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < holdUntilRef.current) return;
      setSelectionDirection("forward");
      setActiveIndex((current) => (current + 1) % PATHS.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [inView, prefersReducedMotion]);

  function choose(index: number, hold = MANUAL_HOLD_MS) {
    holdUntilRef.current = Date.now() + hold;
    if (index === activeIndex) return;
    setSelectionDirection(index > activeIndex ? "forward" : "backward");
    setActiveIndex(index);
  }

  return (
    <section
      ref={sectionRef}
      id="paths"
      data-home-chapter="paths"
      data-home-section="paths"
      className="paths-cinematic home-scene"
      aria-labelledby="paths-cinematic-title"
      style={{ "--paths-accent": active.tint } as CSSProperties}
      onPointerDown={() => {
        holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
      onFocusCapture={() => {
        holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
    >
      <div className="paths-cinematic__film" aria-hidden="true">
        <video
          src="/videos/higgsfield-mountain-mist.mp4"
          poster="/images/higgsfield-mountain-mist-poster.jpg"
          muted
          autoPlay={!prefersReducedMotion}
          loop
          playsInline
          preload={inView ? "metadata" : "none"}
          data-home-playback-rate="1.22"
        />
        <span />
      </div>

      <div className="paths-cinematic__glow paths-cinematic__glow--left" aria-hidden="true" />
      <div className="paths-cinematic__glow paths-cinematic__glow--right" aria-hidden="true" />

      <div className="paths-cinematic__shell">
        <header className="paths-cinematic__header">
          <div>
            <p className="paths-cinematic__eyebrow">Three paths</p>
            <h2 id="paths-cinematic-title">
              The diagnosis names the gap. <em>The path decides what to build next.</em>
            </h2>
          </div>
          <div className="paths-cinematic__intro">
            <p>
              Each path shows the intervention, the decisions it moves through, and what
              the business should be able to do afterwards.
            </p>
            <span>
              The map advances while you watch. Select a path and it waits while you read.
            </span>
          </div>
        </header>

        <div className="paths-cinematic__stage">
          <div className="paths-cinematic__map" aria-label="Three brand paths converging into a recognisable system">
            <div className="paths-cinematic__map-heading">
              <span>Decision architecture</span>
              <strong>{active.number} / 03</strong>
            </div>

            <svg
              viewBox="0 0 860 320"
              role="img"
              aria-label={`${active.start} moves through ${active.route.join(", ")} toward ${active.result}`}
            >
              <defs>
                <radialGradient id="paths-core-glow">
                  <stop offset="0%" stopColor={active.tint} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={active.tint} stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="338" cy="160" r="90" fill="url(#paths-core-glow)" />

              {CURVES.map((curve, index) => {
                const selected = index === activeIndex;
                return (
                  <g key={curve}>
                    <path
                      d={curve}
                      fill="none"
                      stroke={PATHS[index].tint}
                      strokeWidth="1"
                      opacity={selected ? 0.38 : 0.12}
                    />
                    <motion.path
                      d={curve}
                      fill="none"
                      stroke={PATHS[index].tint}
                      strokeWidth={selected ? 2.4 : 1.2}
                      strokeLinecap="round"
                      strokeDasharray="6 11"
                      initial={false}
                      animate={
                        selected && inView
                          ? { pathLength: 1, opacity: 0.96 }
                          : { pathLength: 0.2, opacity: 0.16 }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0 : selected ? 0.82 : 0.34,
                        ease: EASE,
                      }}
                    />
                  </g>
                );
              })}

              {PATHS.map((path, index) => {
                const selected = index === activeIndex;
                const center = `112px ${ENTRY_Y[index]}px`;
                return (
                  <g key={path.start} opacity={selected ? 1 : 0.28}>
                    <motion.circle
                      cx="112"
                      cy={ENTRY_Y[index]}
                      r={selected ? 8 : 5}
                      fill={path.tint}
                      initial={false}
                      animate={
                        selected && inView
                          ? { scale: 1, opacity: 1 }
                          : { scale: 0.78, opacity: 0.42 }
                      }
                      style={{ transformOrigin: center }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.52, ease: EASE }}
                    />
                    <text
                      x="90"
                      y={ENTRY_Y[index] + 5}
                      textAnchor="end"
                      className="paths-cinematic__svg-label"
                    >
                      {path.start}
                    </text>
                  </g>
                );
              })}

              <line x1="338" y1="160" x2="648" y2="160" className="paths-cinematic__spine" />

              {active.route.map((step, index) => {
                const x = 405 + index * 96;
                return (
                  <g key={`${active.number}-${step}`}>
                    <motion.circle
                      cx={x}
                      cy="160"
                      r="6"
                      fill={active.tint}
                      initial={prefersReducedMotion ? false : { scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: prefersReducedMotion ? 0 : index * 0.13, ease: EASE }}
                      style={{ transformOrigin: `${x}px 160px` }}
                    />
                    <text x={x} y="132" textAnchor="middle" className="paths-cinematic__svg-step">
                      {step}
                    </text>
                  </g>
                );
              })}

              <motion.circle
                key={active.number}
                cx="680"
                cy="160"
                r="32"
                fill="none"
                stroke={active.tint}
                strokeWidth="1.4"
                initial={prefersReducedMotion ? false : { scale: 0.88, opacity: 0.38 }}
                animate={inView ? { scale: 1, opacity: 0.72 } : { scale: 0.88, opacity: 0.38 }}
                style={{ transformOrigin: "680px 160px" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: EASE }}
              />
              <circle cx="680" cy="160" r="8" fill={active.tint} />
              <text x="720" y="151" className="paths-cinematic__svg-result">
                A brand people
              </text>
              <text x="720" y="175" className="paths-cinematic__svg-result">
                recognise and choose
              </text>
            </svg>

            <div className="paths-cinematic__mobile-route" aria-hidden="true">
              <span>{active.start}</span>
              {active.route.map((step) => (
                <span key={step}>{step}</span>
              ))}
              <strong>{active.result}</strong>
            </div>
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.article
              key={active.number}
              id="paths-cinematic-panel"
              role="tabpanel"
              aria-labelledby={`paths-cinematic-tab-${active.number}`}
              className="paths-cinematic__focus"
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, x: selectionDirection === "forward" ? 20 : -20 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, x: selectionDirection === "forward" ? -14 : 14 }
              }
              transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
              aria-live="polite"
            >
              <div className="paths-cinematic__focus-topline">
                <span>Path {active.number}</span>
                <i aria-hidden="true" />
              </div>
              <p>{active.eyebrow}</p>
              <h3>{active.title}</h3>
              <p className="paths-cinematic__focus-body">{active.body}</p>
              <div className="paths-cinematic__focus-result">
                <span>What changes next</span>
                <strong>{active.result}</strong>
              </div>
              <Link href={active.href}>
                Follow this path <span aria-hidden="true">↗</span>
              </Link>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="paths-cinematic__choices" role="tablist" aria-label="Choose a brand path">
          {PATHS.map((path, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={path.number}
                id={`paths-cinematic-tab-${path.number}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="paths-cinematic-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(index)}
                onPointerEnter={() => choose(index, HOVER_HOLD_MS)}
                onFocus={() => choose(index)}
                onKeyDown={(event) => {
                  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                  event.preventDefault();
                  const nextIndex =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? PATHS.length - 1
                        : event.key === "ArrowRight"
                          ? (index + 1) % PATHS.length
                          : (index - 1 + PATHS.length) % PATHS.length;
                  choose(nextIndex);
                  const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']");
                  buttons?.[nextIndex]?.focus();
                }}
                className={selected ? "is-active" : undefined}
                style={{ "--path-tint": path.tint } as CSSProperties}
              >
                <span>{path.number}</span>
                <strong>{path.title}</strong>
                <p>{path.eyebrow}</p>
                <i aria-hidden="true">
                  <b
                    key={`${path.number}-${active.number}`}
                    style={{
                      animationDuration: `${AUTO_ADVANCE_MS}ms`,
                      animationPlayState:
                        selected && inView && !prefersReducedMotion ? "running" : "paused",
                    }}
                  />
                </i>
              </button>
            );
          })}
        </div>

        <div className="paths-cinematic__footer">
          <span>Still between paths?</span>
          <Link href="/services#health">
            Find the right starting point <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
