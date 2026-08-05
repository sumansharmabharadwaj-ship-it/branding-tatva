"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { ProcessStage } from "@/data/process";

type StageMeta = {
  becomes: string;
  explanation: string;
  output: string;
  clarity: number;
  prevents: string;
};

type ReadinessRow = {
  label: string;
  values: number[];
};

const STAGE_META: StageMeta[] = [
  {
    becomes: "A truth worth building on.",
    explanation:
      "We interrogate the inherited story before polishing it: what the business genuinely believes, whom it is for, and where its language contradicts its ambition.",
    output: "Strategic diagnosis + founder truth map",
    clarity: 18,
    prevents: "A polished brand built on borrowed assumptions.",
  },
  {
    becomes: "A pattern drawn from evidence.",
    explanation:
      "Customer behaviour, category codes, and competitor habits are read together until the real tension becomes visible. Evidence gets the deciding vote.",
    output: "Audience tensions + category and perception map",
    clarity: 40,
    prevents: "Strategy decided by the loudest opinion in the room.",
  },
  {
    becomes: "One defensible position.",
    explanation:
      "The brand commits to the idea it can own, the promise it can keep, and the choices it will refuse. Everything after this either compounds the position or weakens it.",
    output: "Positioning system + narrative spine",
    clarity: 64,
    prevents: "A brand with many messages and no position.",
  },
  {
    becomes: "A recognisable expression.",
    explanation:
      "Voice, identity, and messaging take the shape the strategy demands. The system learns how to sound, look, and behave while staying coherent.",
    output: "Verbal identity + design direction + message system",
    clarity: 81,
    prevents: "A beautiful identity nobody can recognise twice.",
  },
  {
    becomes: "A brand people actually encounter.",
    explanation:
      "Strategy enters the website, content, campaigns, and selling moments. A brand only begins influencing the market once people can meet it in the wild.",
    output: "Launch ecosystem + channel playbooks",
    clarity: 92,
    prevents: "A strategy that never survives contact with the market.",
  },
  {
    becomes: "Recognition that keeps earning.",
    explanation:
      "The strongest signals are measured, repeated, governed, and improved after launch. Recognition becomes an operating system rather than one expensive moment.",
    output: "Brand governance + recognition roadmap",
    clarity: 100,
    prevents: "Campaigns that disappear the moment the spend stops.",
  },
];

const READINESS: ReadinessRow[] = [
  { label: "Direction", values: [28, 58, 92, 100, 100, 100] },
  { label: "Language", values: [8, 28, 54, 96, 100, 100] },
  { label: "Identity", values: [0, 10, 32, 88, 100, 100] },
  { label: "Activation", values: [0, 0, 8, 34, 86, 100] },
];

const ELEMENT_COLORS: Record<string, string> = {
  Air: "#91A082",
  Fire: "#D3A24F",
  Earth: "#C77752",
  Water: "#7D9BAF",
  Space: "#C08A7B",
};

const NODES = [
  { x: 70, y: 170 },
  { x: 190, y: 170 },
  { x: 320, y: 170 },
  { x: 460, y: 92 },
  { x: 460, y: 248 },
  { x: 630, y: 170 },
];

const SEGMENTS = [
  { d: "M88 170 C125 170 145 170 172 170", to: 1 },
  { d: "M208 170 C250 170 275 170 302 170", to: 2 },
  { d: "M338 164 C378 152 405 115 442 98", to: 3 },
  { d: "M338 176 C378 188 405 225 442 242", to: 4 },
  { d: "M478 102 C540 110 565 142 612 162", to: 5 },
  { d: "M478 238 C540 230 565 198 612 178", to: 5 },
];

const AUTO_ADVANCE_MS = 5600;
const MANUAL_HOLD_MS = 15000;
const HOVER_PREVIEW_MS = 3200;

function fallbackMeta(index: number): StageMeta {
  return {
    becomes: "A clearer decision.",
    explanation: "Each stage removes a different kind of ambiguity before the next layer is built.",
    output: "A committed decision the next stage can use",
    clarity: Math.min(100, Math.round(((index + 1) / 6) * 100)),
    prevents: "Work that looks finished while the underlying decision is still unresolved.",
  };
}

export function RootSystem({ stages }: { stages: ProcessStage[] }) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pauseUntilRef = useRef(0);
  const holdTimerRef = useRef(0);
  const inView = useInView(sectionRef, { margin: "12% 0px", amount: 0.08 });
  const [active, setActive] = useState(0);
  const [holding, setHolding] = useState(false);

  const pauseAutoplay = useCallback((duration = MANUAL_HOLD_MS) => {
    pauseUntilRef.current = Date.now() + duration;
    setHolding(true);
    window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = window.setTimeout(() => {
      if (Date.now() >= pauseUntilRef.current) setHolding(false);
    }, duration + 120);
  }, []);

  const chooseStage = useCallback(
    (index: number, duration = MANUAL_HOLD_MS) => {
      setActive(index);
      pauseAutoplay(duration);
    },
    [pauseAutoplay],
  );

  useEffect(() => {
    if (prefersReducedMotion || !inView || stages.length < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < pauseUntilRef.current) return;
      setHolding(false);
      setActive((current) => (current + 1) % stages.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [inView, prefersReducedMotion, stages.length]);

  useEffect(() => {
    if (active >= stages.length) setActive(0);
  }, [active, stages.length]);

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "process") return;
      setActive(0);
      setHolding(false);
      pauseUntilRef.current = Date.now() + 900;
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => {
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const videoAtEffectStart = videoRef.current;

    function syncPlayback() {
      const video = videoRef.current;
      if (!video) return;
      if (inView && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    }

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      videoAtEffectStart?.pause();
    };
  }, [active, inView, prefersReducedMotion]);

  useEffect(
    () => () => {
      window.clearTimeout(holdTimerRef.current);
    },
    [],
  );

  const graphPoints = useMemo(() => {
    const count = Math.max(2, Math.min(stages.length, STAGE_META.length));
    return Array.from({ length: count }, (_, index) => {
      const source = STAGE_META[index] ?? fallbackMeta(index);
      const value = index <= active ? source.clarity : Math.max(8, source.clarity - 28);
      const x = 6 + (index / (count - 1)) * 88;
      const y = 88 - value * 0.7;
      return `${x},${y}`;
    }).join(" ");
  }, [active, stages.length]);

  if (stages.length === 0) return null;

  const stage = stages[active] ?? stages[0];
  const meta = STAGE_META[active] ?? fallbackMeta(active);
  const accent = ELEMENT_COLORS[stage.element] ?? "#C6A97A";
  const progress = stages.length > 1 ? active / (stages.length - 1) : 1;
  const visibleNodes = NODES.slice(0, Math.min(stages.length, NODES.length));
  const currentGraphX = stages.length > 1 ? 6 + progress * 88 : 94;
  const sectionStyle = { "--pj-accent": accent } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      data-project-journey="true"
      className={`project-journey ${inView ? "is-awake" : "is-resting"}`}
      style={sectionStyle}
      aria-labelledby="project-journey-title"
      onPointerDown={() => pauseAutoplay()}
      onTouchStart={() => pauseAutoplay()}
      onFocusCapture={() => pauseAutoplay()}
    >
      <div className="project-journey__media" data-video-decorative-root aria-hidden="true">
        {stage.poster && (
          <div
            key={`poster-${active}`}
            className="project-journey__poster"
            style={{ backgroundImage: `url(${stage.poster})` }}
          />
        )}
        {stage.video && !prefersReducedMotion && inView && (
          <video
            ref={videoRef}
            key={`video-${active}-${stage.video}`}
            src={stage.video}
            poster={stage.poster}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            onCanPlay={(event) => {
              if (inView) void event.currentTarget.play().catch(() => {});
            }}
          />
        )}
      </div>
      <div className="project-journey__wash" aria-hidden="true" />
      <div className="project-journey__grid" aria-hidden="true" />
      <span className="project-journey__orbit project-journey__orbit--one" aria-hidden="true" />
      <span className="project-journey__orbit project-journey__orbit--two" aria-hidden="true" />

      <div className="project-journey__shell">
        <header className="project-journey__header">
          <div>
            <p className="project-journey__kicker">The work, without the black box</p>
            <h2 id="project-journey-title">How a project moves</h2>
          </div>
          <div className="project-journey__intro">
            <p>
              Six decisions turn an unclear business into a recognisable system. Select a stage and the whole
              architecture changes with it, so the process explains itself before a call ever has to.
            </p>
            <span>
              {holding
                ? "Tour resting while you read"
                : inView
                  ? "The diagram advances on its own"
                  : "The diagram rests outside the viewport"}
            </span>
          </div>
        </header>

        <div className="project-journey__rail" role="tablist" aria-label="Project stages">
          <span className="project-journey__rail-line" aria-hidden="true" />
          <span
            className="project-journey__rail-progress"
            aria-hidden="true"
            style={{ transform: `scaleX(${progress})` }}
          />
          {stages.map((item, index) => (
            <button
              key={item.stage}
              id={`project-stage-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls="project-stage-panel"
              tabIndex={active === index ? 0 : -1}
              className={`project-journey__stage-button${active === index ? " is-active" : ""}`}
              onClick={() => chooseStage(index)}
              onFocus={() => pauseAutoplay()}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.stage}</strong>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="project-journey__board">
          <article
            id="project-stage-panel"
            role="tabpanel"
            aria-live="polite"
            aria-labelledby={`project-stage-tab-${active}`}
            className="project-journey__focus-card"
            key={`focus-${active}`}
          >
            <div className="project-journey__card-topline">
              <p>
                {String(active + 1).padStart(2, "0")} · {stage.stage}
              </p>
              <span>{stage.element}</span>
            </div>
            <p className="project-journey__turns">This stage turns the brand into</p>
            <h3>{meta.becomes}</h3>
            <p className="project-journey__explanation">{meta.explanation}</p>

            <div className="project-journey__decision-block">
              <span>The decision being made</span>
              <p>{stage.description}</p>
            </div>
            <div className="project-journey__output-block">
              <span>What leaves the room</span>
              <strong>{meta.output}</strong>
            </div>
          </article>

          <div className="project-journey__map-card">
            <div className="project-journey__map-heading">
              <div>
                <p>Decision architecture</p>
                <h3>One choice feeds the next.</h3>
              </div>
              <span>Hover previews briefly · select to hold</span>
            </div>

            <div className="project-journey__map" aria-label="Interactive project flow diagram">
              <svg viewBox="0 0 700 340" role="img" aria-label="Question and Decode lead to Architect; Signal and Influence then combine into Compound">
                {SEGMENTS.map((segment, index) => (
                  <path key={`base-${index}`} d={segment.d} className="project-journey__path-base" />
                ))}
                {SEGMENTS.map((segment, index) => (
                  <path
                    key={`active-${index}`}
                    d={segment.d}
                    pathLength="1"
                    className="project-journey__path-live"
                    style={{ strokeDashoffset: active >= segment.to ? 0 : 1 }}
                  />
                ))}
                {!prefersReducedMotion && inView && active > 0 && (
                  <circle r="3.5" fill={accent} className="project-journey__traveller">
                    <animateMotion
                      dur="2.4s"
                      repeatCount="indefinite"
                      path={SEGMENTS[Math.min(active - 1, SEGMENTS.length - 1)]?.d}
                    />
                  </circle>
                )}
              </svg>

              {visibleNodes.map((node, index) => {
                const item = stages[index];
                const reached = index <= active;
                return (
                  <button
                    key={item.stage}
                    type="button"
                    className={`project-journey__node${reached ? " is-reached" : ""}${active === index ? " is-active" : ""}`}
                    style={{ left: `${(node.x / 700) * 100}%`, top: `${(node.y / 340) * 100}%` }}
                    onClick={() => chooseStage(index)}
                    onMouseEnter={() => chooseStage(index, HOVER_PREVIEW_MS)}
                    onFocus={() => pauseAutoplay()}
                    aria-label={`Show ${item.stage} stage`}
                  >
                    <i aria-hidden="true" />
                    <span>{item.stage}</span>
                  </button>
                );
              })}
            </div>

            <p className="project-journey__map-note">
              The fork is deliberate: expression and market influence are built from the same architecture, then
              reunited before recognition can compound.
            </p>
          </div>

          <aside className="project-journey__signal-card" aria-label="Project clarity and system readiness">
            <div className="project-journey__signal-top">
              <div>
                <p>Decision clarity</p>
                <h3>{meta.clarity}%</h3>
              </div>
              <div
                className="project-journey__donut"
                style={{
                  background: `conic-gradient(${accent} ${meta.clarity * 3.6}deg, rgba(244,239,230,0.11) 0deg)`,
                }}
                role="img"
                aria-label={`${meta.clarity}% decision clarity`}
              >
                <span>{String(active + 1).padStart(2, "0")}</span>
              </div>
            </div>

            <svg className="project-journey__graph" viewBox="0 0 100 100" role="img" aria-label="Clarity rises across the six project stages">
              <defs>
                <linearGradient id="project-journey-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.34" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[24, 46, 68, 90].map((y) => (
                <line key={y} x1="4" y1={y} x2="96" y2={y} className="project-journey__graph-grid" />
              ))}
              <polygon points={`${graphPoints} 94,94 6,94`} fill="url(#project-journey-area)" />
              <polyline points={graphPoints} className="project-journey__graph-line" />
              <line x1={currentGraphX} y1="8" x2={currentGraphX} y2="94" className="project-journey__graph-cursor" />
            </svg>

            <div className="project-journey__readiness">
              <div className="project-journey__readiness-heading">
                <span>System readiness</span>
                <span>0 → 100</span>
              </div>
              {READINESS.map((row) => {
                const value = row.values[active] ?? row.values[row.values.length - 1] ?? 0;
                return (
                  <div key={row.label} className="project-journey__bar-row">
                    <span>{row.label}</span>
                    <div aria-hidden="true">
                      <i style={{ width: `${value}%` }} />
                    </div>
                    <strong>{value}</strong>
                  </div>
                );
              })}
            </div>

            <div className="project-journey__prevents">
              <span>This stage prevents</span>
              <p>{meta.prevents}</p>
            </div>
          </aside>
        </div>

        <footer className="project-journey__footer">
          <p>Bring the unfinished notes, the conflicting opinions, and the version nobody has managed to explain yet.</p>
          <div>
            <Link href="/contact">Bring me the messy version <span aria-hidden="true">↗</span></Link>
            <span>Twenty minutes · zero pitch deck</span>
          </div>
        </footer>
      </div>

      <style>{`
        main#main-content > section.bg-soil > div.bg-soil:has(+ [data-project-journey="true"]) {
          display: none !important;
        }

        .project-journey {
          --pj-accent: #c6a97a;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: #141210;
          color: #f4efe6;
          padding: clamp(5.5rem, 8vw, 8.25rem) 0 clamp(5rem, 7vw, 7.25rem);
        }

        .project-journey.is-resting .project-journey__orbit,
        .project-journey.is-resting .project-journey__intro span::before,
        .project-journey.is-resting .project-journey__node.is-active i {
          animation-play-state: paused !important;
        }

        .project-journey::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            radial-gradient(52rem 34rem at 18% 20%, color-mix(in srgb, var(--pj-accent) 20%, transparent), transparent 67%),
            radial-gradient(46rem 30rem at 84% 74%, rgba(198,169,122,.12), transparent 66%),
            linear-gradient(125deg, rgba(18,16,14,.76), rgba(20,18,16,.92) 52%, rgba(14,13,12,.98));
          transition: background 900ms ease;
        }

        .project-journey::after {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 8;
          opacity: .14;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.42'/%3E%3C/svg%3E");
          mix-blend-mode: soft-light;
        }

        .project-journey__media,
        .project-journey__poster,
        .project-journey__media video,
        .project-journey__wash,
        .project-journey__grid {
          position: absolute;
          inset: 0;
        }

        .project-journey__media {
          z-index: -5;
          overflow: hidden;
        }

        .project-journey__poster,
        .project-journey__media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-position: center;
          background-size: cover;
          filter: saturate(.76) contrast(1.08) brightness(.52);
          opacity: .48;
          animation: projectJourneyMediaIn 1100ms cubic-bezier(.22,1,.36,1) both;
        }

        .project-journey__wash {
          z-index: -4;
          background:
            linear-gradient(180deg, rgba(20,18,16,.64) 0%, rgba(20,18,16,.78) 26%, rgba(20,18,16,.91) 100%),
            linear-gradient(95deg, rgba(20,18,16,.78), transparent 52%, rgba(20,18,16,.62));
        }

        .project-journey__grid {
          z-index: -3;
          opacity: .18;
          background-image:
            linear-gradient(rgba(244,239,230,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(244,239,230,.12) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
        }

        .project-journey__orbit {
          position: absolute;
          z-index: -1;
          display: block;
          border: 1px solid color-mix(in srgb, var(--pj-accent) 30%, transparent);
          border-radius: 999px;
          pointer-events: none;
        }

        .project-journey__orbit--one {
          width: 36rem;
          height: 36rem;
          right: -15rem;
          top: -14rem;
          animation: projectJourneyOrbit 24s linear infinite;
        }

        .project-journey__orbit--two {
          width: 22rem;
          height: 22rem;
          left: -8rem;
          bottom: -9rem;
          animation: projectJourneyOrbit 19s linear infinite reverse;
        }

        .project-journey__shell {
          position: relative;
          z-index: 2;
          width: min(1500px, calc(100% - 3rem));
          margin-inline: auto;
        }

        .project-journey__header {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(19rem, .75fr);
          align-items: end;
          gap: clamp(2rem, 6vw, 7rem);
        }

        .project-journey__kicker,
        .project-journey__map-heading p,
        .project-journey__signal-top p,
        .project-journey__turns,
        .project-journey__decision-block span,
        .project-journey__output-block span,
        .project-journey__prevents span {
          margin: 0;
          color: var(--pj-accent);
          font-size: .68rem;
          font-weight: 600;
          letter-spacing: .22em;
          text-transform: uppercase;
        }

        .project-journey__header h2 {
          max-width: 13ch;
          margin: .8rem 0 0;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(3.2rem, 7.1vw, 7rem);
          font-weight: 400;
          letter-spacing: -.04em;
          line-height: .91;
          text-wrap: balance;
        }

        .project-journey__intro {
          padding-bottom: .45rem;
        }

        .project-journey__intro p {
          margin: 0;
          color: rgba(244,239,230,.72);
          font-size: clamp(.95rem, 1.25vw, 1.12rem);
          line-height: 1.75;
        }

        .project-journey__intro span {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          margin-top: 1.25rem;
          color: rgba(244,239,230,.42);
          font-size: .7rem;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .project-journey__intro span::before {
          content: "";
          width: .42rem;
          height: .42rem;
          border-radius: 999px;
          background: var(--pj-accent);
          box-shadow: 0 0 0 .35rem color-mix(in srgb, var(--pj-accent) 15%, transparent);
          animation: projectJourneyPulse 2.8s ease-in-out infinite;
        }

        .project-journey__rail {
          position: relative;
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          margin-top: clamp(3rem, 6vw, 5rem);
          border: 1px solid rgba(244,239,230,.1);
          border-radius: 1.1rem;
          background: rgba(15,14,13,.48);
          backdrop-filter: blur(18px);
          overflow: hidden;
        }

        .project-journey__rail-line,
        .project-journey__rail-progress {
          position: absolute;
          left: 7.8%;
          right: 7.8%;
          bottom: 1.25rem;
          height: 1px;
          transform-origin: left center;
        }

        .project-journey__rail-line {
          background: rgba(244,239,230,.13);
        }

        .project-journey__rail-progress {
          right: auto;
          width: 84.4%;
          background: var(--pj-accent);
          box-shadow: 0 0 18px color-mix(in srgb, var(--pj-accent) 45%, transparent);
          transition: transform 800ms cubic-bezier(.22,1,.36,1);
        }

        .project-journey__stage-button {
          position: relative;
          min-height: 7.35rem;
          padding: 1.35rem 1rem 2.25rem;
          border: 0;
          border-right: 1px solid rgba(244,239,230,.07);
          background: transparent;
          color: rgba(244,239,230,.42);
          text-align: left;
          cursor: pointer;
          transition: color 450ms ease, background 450ms ease;
        }

        .project-journey__stage-button:last-child {
          border-right: 0;
        }

        .project-journey__stage-button:hover,
        .project-journey__stage-button:focus-visible,
        .project-journey__stage-button.is-active {
          color: #f4efe6;
          background: linear-gradient(180deg, color-mix(in srgb, var(--pj-accent) 10%, transparent), transparent 75%);
          outline: none;
        }

        .project-journey__stage-button > span {
          display: block;
          color: var(--pj-accent);
          font-family: var(--font-display), Georgia, serif;
          font-size: .82rem;
        }

        .project-journey__stage-button strong {
          display: block;
          margin-top: .55rem;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(.92rem, 1.25vw, 1.18rem);
          font-weight: 400;
        }

        .project-journey__stage-button i {
          position: absolute;
          left: 50%;
          bottom: .91rem;
          width: .7rem;
          height: .7rem;
          border: 1px solid rgba(244,239,230,.35);
          border-radius: 999px;
          background: #171513;
          transform: translateX(-50%);
          transition: background 450ms ease, box-shadow 450ms ease, transform 450ms ease;
        }

        .project-journey__stage-button.is-active i {
          background: var(--pj-accent);
          box-shadow: 0 0 0 .34rem color-mix(in srgb, var(--pj-accent) 16%, transparent), 0 0 20px color-mix(in srgb, var(--pj-accent) 55%, transparent);
          transform: translateX(-50%) scale(1.18);
        }

        .project-journey__board {
          display: grid;
          grid-template-columns: minmax(0, .94fr) minmax(28rem, 1.35fr) minmax(18rem, .86fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .project-journey__focus-card,
        .project-journey__map-card,
        .project-journey__signal-card {
          position: relative;
          border: 1px solid rgba(244,239,230,.11);
          border-radius: 1.35rem;
          background: linear-gradient(145deg, rgba(35,31,27,.78), rgba(17,16,15,.64));
          box-shadow: 0 28px 90px rgba(0,0,0,.26);
          backdrop-filter: blur(18px);
          overflow: hidden;
        }

        .project-journey__focus-card {
          display: flex;
          flex-direction: column;
          min-height: 31rem;
          padding: clamp(1.5rem, 2.4vw, 2.35rem);
          animation: projectJourneyCardIn 720ms cubic-bezier(.22,1,.36,1) both;
        }

        .project-journey__focus-card::before,
        .project-journey__signal-card::before {
          content: "";
          position: absolute;
          width: 15rem;
          height: 15rem;
          border-radius: 999px;
          background: color-mix(in srgb, var(--pj-accent) 16%, transparent);
          filter: blur(55px);
          pointer-events: none;
        }

        .project-journey__focus-card::before {
          right: -6rem;
          top: -7rem;
        }

        .project-journey__card-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .project-journey__card-topline p,
        .project-journey__card-topline span {
          margin: 0;
          color: rgba(244,239,230,.5);
          font-size: .68rem;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .project-journey__card-topline p {
          color: var(--pj-accent);
        }

        .project-journey__turns {
          margin-top: clamp(3rem, 5vw, 5rem);
        }

        .project-journey__focus-card h3 {
          position: relative;
          max-width: 12ch;
          margin: .75rem 0 0;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(2rem, 3.25vw, 3.25rem);
          font-weight: 400;
          letter-spacing: -.025em;
          line-height: 1.02;
          text-wrap: balance;
        }

        .project-journey__explanation {
          position: relative;
          margin: 1.4rem 0 0;
          color: rgba(244,239,230,.68);
          font-size: .93rem;
          line-height: 1.72;
        }

        .project-journey__decision-block,
        .project-journey__output-block {
          position: relative;
          margin-top: 1.65rem;
          padding-top: 1.35rem;
          border-top: 1px solid rgba(244,239,230,.1);
        }

        .project-journey__decision-block p {
          margin: .65rem 0 0;
          color: rgba(244,239,230,.54);
          font-size: .8rem;
          line-height: 1.6;
        }

        .project-journey__output-block {
          margin-top: auto;
        }

        .project-journey__output-block strong {
          display: block;
          margin-top: .7rem;
          color: #f4efe6;
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.22rem;
          font-weight: 400;
          line-height: 1.35;
        }

        .project-journey__map-card {
          min-height: 31rem;
          padding: clamp(1.4rem, 2.3vw, 2rem);
        }

        .project-journey__map-card::after {
          content: "";
          position: absolute;
          inset: 5.5rem 1rem 3.5rem;
          border-radius: 999px;
          background: radial-gradient(circle at center, color-mix(in srgb, var(--pj-accent) 9%, transparent), transparent 67%);
          pointer-events: none;
        }

        .project-journey__map-heading {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .project-journey__map-heading h3 {
          margin: .45rem 0 0;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.35rem, 2vw, 2rem);
          font-weight: 400;
        }

        .project-journey__map-heading > span {
          color: rgba(244,239,230,.38);
          font-size: .65rem;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .project-journey__map {
          position: relative;
          z-index: 2;
          min-height: 21.5rem;
          margin-top: .4rem;
        }

        .project-journey__map svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .project-journey__path-base,
        .project-journey__path-live {
          fill: none;
          stroke-linecap: round;
        }

        .project-journey__path-base {
          stroke: rgba(244,239,230,.12);
          stroke-width: 1.4;
        }

        .project-journey__path-live {
          stroke: var(--pj-accent);
          stroke-width: 1.8;
          stroke-dasharray: 1;
          transition: stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1);
          filter: drop-shadow(0 0 5px color-mix(in srgb, var(--pj-accent) 65%, transparent));
        }

        .project-journey__traveller {
          filter: drop-shadow(0 0 7px var(--pj-accent));
        }

        .project-journey__node {
          position: absolute;
          z-index: 4;
          display: flex;
          width: 6.5rem;
          flex-direction: column;
          align-items: center;
          gap: .6rem;
          padding: .55rem;
          border: 0;
          background: transparent;
          color: rgba(244,239,230,.38);
          transform: translate(-50%, -50%);
          cursor: pointer;
          transition: color 450ms ease;
        }

        .project-journey__node i {
          display: block;
          width: .9rem;
          height: .9rem;
          border: 1px solid rgba(244,239,230,.32);
          border-radius: 999px;
          background: #191714;
          transition: transform 450ms cubic-bezier(.22,1,.36,1), background 450ms ease, box-shadow 450ms ease;
        }

        .project-journey__node span {
          font-family: var(--font-display), Georgia, serif;
          font-size: .86rem;
        }

        .project-journey__node:hover,
        .project-journey__node:focus-visible,
        .project-journey__node.is-reached {
          color: rgba(244,239,230,.82);
          outline: none;
        }

        .project-journey__node.is-reached i {
          border-color: var(--pj-accent);
          background: var(--pj-accent);
        }

        .project-journey__node.is-active {
          color: #f4efe6;
        }

        .project-journey__node.is-active i {
          transform: scale(1.35);
          box-shadow: 0 0 0 .42rem color-mix(in srgb, var(--pj-accent) 14%, transparent), 0 0 22px color-mix(in srgb, var(--pj-accent) 65%, transparent);
          animation: projectJourneyPulseNode 2.2s ease-in-out infinite;
        }

        .project-journey__map-note {
          position: relative;
          z-index: 2;
          max-width: 48rem;
          margin: -.25rem 0 0;
          color: rgba(244,239,230,.42);
          font-size: .74rem;
          line-height: 1.55;
        }

        .project-journey__signal-card {
          min-height: 31rem;
          padding: clamp(1.35rem, 2vw, 1.8rem);
        }

        .project-journey__signal-card::before {
          left: -7rem;
          bottom: -7rem;
        }

        .project-journey__signal-top {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .project-journey__signal-top h3 {
          margin: .4rem 0 0;
          font-family: var(--font-display), Georgia, serif;
          font-size: 2.75rem;
          font-weight: 400;
          line-height: 1;
        }

        .project-journey__donut {
          display: grid;
          width: 4.6rem;
          height: 4.6rem;
          place-items: center;
          border-radius: 999px;
          transition: background 800ms ease;
        }

        .project-journey__donut::before {
          content: "";
          grid-area: 1 / 1;
          width: 3.55rem;
          height: 3.55rem;
          border-radius: inherit;
          background: #1b1816;
          box-shadow: inset 0 0 18px rgba(0,0,0,.34);
        }

        .project-journey__donut span {
          z-index: 1;
          grid-area: 1 / 1;
          color: var(--pj-accent);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1rem;
        }

        .project-journey__graph {
          display: block;
          width: 100%;
          height: 9rem;
          margin-top: 1.25rem;
          overflow: visible;
        }

        .project-journey__graph-grid {
          stroke: rgba(244,239,230,.08);
          stroke-width: .55;
        }

        .project-journey__graph-line {
          fill: none;
          stroke: var(--pj-accent);
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: points 800ms ease;
          filter: drop-shadow(0 0 4px color-mix(in srgb, var(--pj-accent) 55%, transparent));
        }

        .project-journey__graph-cursor {
          stroke: color-mix(in srgb, var(--pj-accent) 70%, transparent);
          stroke-width: .7;
          stroke-dasharray: 2 3;
          transition: x1 800ms cubic-bezier(.22,1,.36,1), x2 800ms cubic-bezier(.22,1,.36,1);
        }

        .project-journey__readiness {
          position: relative;
          margin-top: .85rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(244,239,230,.09);
        }

        .project-journey__readiness-heading,
        .project-journey__bar-row {
          display: grid;
          grid-template-columns: 5.25rem 1fr 2rem;
          align-items: center;
          gap: .7rem;
        }

        .project-journey__readiness-heading {
          margin-bottom: .85rem;
          color: rgba(244,239,230,.38);
          font-size: .62rem;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .project-journey__readiness-heading span:last-child {
          grid-column: 3;
          text-align: right;
        }

        .project-journey__bar-row {
          margin-top: .72rem;
        }

        .project-journey__bar-row > span,
        .project-journey__bar-row > strong {
          color: rgba(244,239,230,.56);
          font-size: .69rem;
          font-weight: 500;
        }

        .project-journey__bar-row > strong {
          text-align: right;
        }

        .project-journey__bar-row > div {
          height: .2rem;
          border-radius: 999px;
          background: rgba(244,239,230,.1);
          overflow: hidden;
        }

        .project-journey__bar-row i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: var(--pj-accent);
          box-shadow: 0 0 10px color-mix(in srgb, var(--pj-accent) 55%, transparent);
          transition: width 900ms cubic-bezier(.22,1,.36,1);
        }

        .project-journey__prevents {
          position: relative;
          margin-top: 1.4rem;
          padding: 1.05rem;
          border: 1px solid color-mix(in srgb, var(--pj-accent) 20%, transparent);
          border-radius: .9rem;
          background: color-mix(in srgb, var(--pj-accent) 7%, transparent);
        }

        .project-journey__prevents p {
          margin: .5rem 0 0;
          color: rgba(244,239,230,.62);
          font-size: .75rem;
          line-height: 1.5;
        }

        .project-journey__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          margin-top: 1rem;
          padding: 1.35rem 1.5rem;
          border: 1px solid rgba(244,239,230,.09);
          border-radius: 1.1rem;
          background: rgba(17,16,15,.52);
          backdrop-filter: blur(16px);
        }

        .project-journey__footer > p {
          max-width: 49rem;
          margin: 0;
          color: rgba(244,239,230,.52);
          font-size: .82rem;
          line-height: 1.55;
        }

        .project-journey__footer > div {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: .45rem;
          flex-shrink: 0;
        }

        .project-journey__footer a {
          display: inline-flex;
          align-items: center;
          gap: .65rem;
          min-height: 2.8rem;
          padding: 0 1.15rem;
          border: 1px solid color-mix(in srgb, var(--pj-accent) 58%, transparent);
          border-radius: 999px;
          color: #f4efe6;
          font-size: .78rem;
          text-decoration: none;
          transition: background 350ms ease, border-color 350ms ease, transform 350ms ease;
        }

        .project-journey__footer a:hover,
        .project-journey__footer a:focus-visible {
          border-color: var(--pj-accent);
          background: color-mix(in srgb, var(--pj-accent) 13%, transparent);
          transform: translateY(-2px);
          outline: none;
        }

        .project-journey__footer > div > span {
          color: rgba(244,239,230,.34);
          font-size: .62rem;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        @keyframes projectJourneyMediaIn {
          from { opacity: 0; transform: scale(1.08); filter: saturate(.5) contrast(1.04) brightness(.4) blur(8px); }
          to { opacity: .48; transform: scale(1); filter: saturate(.76) contrast(1.08) brightness(.52) blur(0); }
        }

        @keyframes projectJourneyCardIn {
          from { opacity: 0; transform: translateY(18px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes projectJourneyOrbit {
          to { transform: rotate(360deg); }
        }

        @keyframes projectJourneyPulse {
          0%, 100% { opacity: .5; transform: scale(.86); }
          50% { opacity: 1; transform: scale(1.08); }
        }

        @keyframes projectJourneyPulseNode {
          0%, 100% { box-shadow: 0 0 0 .32rem color-mix(in srgb, var(--pj-accent) 12%, transparent), 0 0 14px color-mix(in srgb, var(--pj-accent) 45%, transparent); }
          50% { box-shadow: 0 0 0 .55rem color-mix(in srgb, var(--pj-accent) 7%, transparent), 0 0 28px color-mix(in srgb, var(--pj-accent) 72%, transparent); }
        }

        @media (max-width: 1220px) {
          .project-journey__board {
            grid-template-columns: minmax(0, .92fr) minmax(28rem, 1.35fr);
          }

          .project-journey__signal-card {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: .7fr 1fr 1fr;
            gap: 1.5rem;
            align-items: center;
            min-height: auto;
          }

          .project-journey__graph {
            margin-top: 0;
          }

          .project-journey__readiness {
            margin-top: 0;
            padding-top: 0;
            border-top: 0;
          }

          .project-journey__prevents {
            grid-column: 1 / -1;
            margin-top: 0;
          }
        }

        @media (max-width: 900px) {
          .project-journey__header {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .project-journey__intro {
            max-width: 42rem;
          }

          .project-journey__rail {
            display: flex;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .project-journey__rail::-webkit-scrollbar {
            display: none;
          }

          .project-journey__stage-button {
            width: 10.5rem;
            flex: 0 0 10.5rem;
          }

          .project-journey__rail-line,
          .project-journey__rail-progress {
            display: none;
          }

          .project-journey__board {
            grid-template-columns: 1fr;
          }

          .project-journey__focus-card,
          .project-journey__map-card {
            min-height: auto;
          }

          .project-journey__focus-card {
            min-height: 30rem;
          }

          .project-journey__map {
            min-height: 22rem;
          }
        }

        @media (max-width: 680px) {
          .project-journey {
            padding-top: 4.75rem;
          }

          .project-journey__shell {
            width: min(100% - 1.25rem, 1500px);
          }

          .project-journey__header h2 {
            font-size: clamp(3rem, 15vw, 4.75rem);
          }

          .project-journey__stage-button {
            min-height: 6.4rem;
            padding-top: 1.1rem;
          }

          .project-journey__map-heading,
          .project-journey__footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .project-journey__map-heading > span {
            display: none;
          }

          .project-journey__map {
            min-height: 20rem;
            margin-inline: -.5rem;
          }

          .project-journey__node {
            width: 5rem;
          }

          .project-journey__node span {
            font-size: .72rem;
          }

          .project-journey__signal-card {
            display: block;
          }

          .project-journey__graph {
            margin-top: 1rem;
          }

          .project-journey__readiness {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(244,239,230,.09);
          }

          .project-journey__prevents {
            margin-top: 1.2rem;
          }

          .project-journey__footer > div {
            align-items: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-journey *,
          .project-journey *::before,
          .project-journey *::after {
            scroll-behavior: auto !important;
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
        }
      `}</style>
    </section>
  );
}
