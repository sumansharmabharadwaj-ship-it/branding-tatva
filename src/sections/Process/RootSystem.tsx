"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import Link from "next/link";
import {
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useInView } from "framer-motion";
import type { ProcessStage } from "@/data/process";

type StageMeta = {
  becomes: string;
  explanation: string;
  output: string;
  clarity: number;
  prevents: string;
};

const STAGE_META: StageMeta[] = [
  {
    becomes: "A truth worth building on.",
    explanation:
      "We find what the business genuinely believes, who it is for, and where its current language contradicts its ambition.",
    output: "Strategic diagnosis + founder truth map",
    clarity: 18,
    prevents: "A polished brand built on borrowed assumptions.",
  },
  {
    becomes: "A pattern drawn from evidence.",
    explanation:
      "Customer behaviour, category codes, and competitor habits are read together until the real tension becomes visible.",
    output: "Audience tensions + category and perception map",
    clarity: 40,
    prevents: "Strategy decided by the loudest opinion in the room.",
  },
  {
    becomes: "One defensible position.",
    explanation:
      "The brand commits to the idea it can own, the promise it can keep, and the choices it will refuse.",
    output: "Positioning system + narrative spine",
    clarity: 64,
    prevents: "A brand with many messages and no position.",
  },
  {
    becomes: "A recognisable expression.",
    explanation:
      "Voice, identity, and messaging take the shape the strategy demands, while staying recognisably part of one system.",
    output: "Verbal identity + design direction + message system",
    clarity: 81,
    prevents: "A beautiful identity nobody can recognise twice.",
  },
  {
    becomes: "A brand people can encounter.",
    explanation:
      "Strategy enters the website, content, campaigns, and selling moments where an audience can actually meet it.",
    output: "Launch ecosystem + channel playbooks",
    clarity: 92,
    prevents: "A strategy that never survives contact with the market.",
  },
  {
    becomes: "Recognition that keeps earning.",
    explanation:
      "The strongest signals are measured, repeated, governed, and improved after launch so recognition can compound.",
    output: "Brand governance + recognition roadmap",
    clarity: 100,
    prevents: "Campaigns that disappear when the spend stops.",
  },
];

const READINESS = [
  { label: "Direction", values: [28, 58, 92, 100, 100, 100] },
  { label: "Language", values: [8, 28, 54, 96, 100, 100] },
  { label: "Identity", values: [0, 10, 32, 88, 100, 100] },
  { label: "Activation", values: [0, 0, 8, 34, 86, 100] },
];

const ELEMENT_COLORS: Record<string, string> = {
  Air: "#788A70",
  Fire: "#B87B43",
  Earth: "#B96847",
  Water: "#66889A",
  Space: "#A76F65",
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

function fallbackMeta(index: number): StageMeta {
  return {
    becomes: "A clearer decision.",
    explanation: "Each stage removes a different kind of ambiguity before the next layer is built.",
    output: "A committed decision the next stage can use",
    clarity: Math.min(100, Math.round(((index + 1) / 6) * 100)),
    prevents: "Work that looks finished while the underlying decision is unresolved.",
  };
}

export function RootSystem({ stages }: { stages: ProcessStage[] }) {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef, { amount: 0.18, margin: "8% 0px -10% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: stages.length,
    target: sectionRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const active = visualizer.activeIndex;
  const chooseStage = visualizer.choose;

  function onStageKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % stages.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + stages.length - 1) % stages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else return;

    event.preventDefault();
    chooseStage(next);
    document.getElementById(`project-stage-tab-${next}`)?.focus();
  }

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

  if (stages.length === 0) return null;

  const stage = stages[active] ?? stages[0];
  const meta = STAGE_META[active] ?? fallbackMeta(active);
  const accent = ELEMENT_COLORS[stage.element] ?? "#9B7457";
  const progress = stages.length > 1 ? active / (stages.length - 1) : 1;
  const visibleNodes = NODES.slice(0, Math.min(stages.length, NODES.length));
  const sectionStyle = { "--pj-accent": accent } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      data-project-journey="true"
      data-scroll-story="process"
      className={`project-journey ${inView ? "is-awake" : "is-resting"}`}
      style={sectionStyle}
      aria-labelledby="project-journey-title"
    >
      <div className="project-journey__media" aria-hidden="true">
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

      <div className="project-journey__shell">
        <header className="project-journey__header">
          <div>
            <p className="project-journey__kicker">The work, without the black box</p>
            <h2 id="project-journey-title">How a project moves</h2>
          </div>
          <p className="project-journey__intro">
            Six decisions turn an unclear business into one recognisable system. Scroll to move through the
            system; hover or focus any stage to inspect it without losing your place.
          </p>
        </header>

        <div className="project-journey__rail" role="tablist" aria-label="Project stages">
          <span className="project-journey__rail-progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
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
              onPointerEnter={() => visualizer.preview(index)}
              onPointerLeave={(event) => {
                if (document.activeElement !== event.currentTarget) visualizer.releasePreview();
              }}
              onFocus={() => visualizer.preview(index)}
              onBlur={visualizer.releasePreview}
              onKeyDown={(event) => onStageKeyDown(event, index)}
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
              <p>{String(active + 1).padStart(2, "0")} · {stage.stage}</p>
              <span>{stage.element}</span>
            </div>
            <p className="project-journey__turns">This stage creates</p>
            <h3>{meta.becomes}</h3>
            <p className="project-journey__explanation">{meta.explanation}</p>
            <div className="project-journey__output-block">
              <span>What leaves the room</span>
              <strong>{meta.output}</strong>
            </div>
            <div className="project-journey__readiness" aria-label="System readiness">
              <div className="project-journey__readiness-heading">
                <span>System readiness</span>
                <strong>{meta.clarity}% clear</strong>
              </div>
              {READINESS.map((row) => {
                const value = row.values[active] ?? 0;
                return (
                  <div key={row.label} className="project-journey__bar-row">
                    <span>{row.label}</span>
                    <div aria-hidden="true"><i style={{ width: `${value}%` }} /></div>
                    <strong>{value}</strong>
                  </div>
                );
              })}
            </div>
          </article>

          <div className="project-journey__map-card">
            <div className="project-journey__map-heading">
              <div>
                <p>Decision architecture</p>
                <h3>One choice feeds the next.</h3>
              </div>
              <span>Scroll the system · hover to inspect</span>
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
                    onPointerEnter={() => visualizer.preview(index)}
                    onPointerLeave={(event) => {
                      if (document.activeElement !== event.currentTarget) visualizer.releasePreview();
                    }}
                    onFocus={() => visualizer.preview(index)}
                    onBlur={visualizer.releasePreview}
                    aria-label={`Show ${item.stage} stage`}
                  >
                    <i aria-hidden="true" />
                    <span>{item.stage}</span>
                  </button>
                );
              })}
            </div>
            <div className="project-journey__prevents">
              <span>This stage prevents</span>
              <p>{meta.prevents}</p>
            </div>
          </div>
        </div>

        <footer className="project-journey__footer">
          <p>Bring the unfinished notes and the version nobody has managed to explain yet.</p>
          <Link href="/contact">Bring me the messy version <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>

      <style>{`
        main#main-content > section.bg-soil > div.bg-soil:has(+ [data-project-journey="true"]) { display: none !important; }

        .project-journey {
          --pj-accent: #9b7457;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          min-height: 100svh;
          padding: clamp(5.25rem, 8vw, 7rem) 0 clamp(2rem, 4vw, 4rem);
          background: #e8dfd0;
          color: #1d2a24;
        }

        .project-journey__media,
        .project-journey__poster,
        .project-journey__media video,
        .project-journey__wash { position: absolute; inset: 0; }

        .project-journey__media { z-index: -3; overflow: hidden; }
        .project-journey__poster,
        .project-journey__media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-position: center;
          background-size: cover;
          opacity: .2;
          filter: saturate(.62) contrast(.88) brightness(1.08);
          animation: projectJourneyMediaIn 900ms cubic-bezier(.22,1,.36,1) both;
        }

        .project-journey__wash {
          z-index: -2;
          background:
            linear-gradient(90deg, rgba(239,232,219,.96), rgba(232,223,208,.9) 54%, rgba(224,214,196,.9)),
            radial-gradient(44rem 28rem at 82% 35%, color-mix(in srgb, var(--pj-accent) 15%, transparent), transparent 70%);
        }

        .project-journey__shell {
          position: relative;
          z-index: 1;
          width: min(1440px, calc(100% - 3rem));
          margin-inline: auto;
        }

        .project-journey__header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(19rem, 28rem);
          align-items: end;
          gap: clamp(2rem, 6vw, 7rem);
        }

        .project-journey__kicker,
        .project-journey__map-heading p,
        .project-journey__turns,
        .project-journey__output-block span,
        .project-journey__prevents span {
          margin: 0;
          color: var(--pj-accent);
          font-size: .67rem;
          font-weight: 700;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .project-journey__header h2 {
          max-width: 13ch;
          margin: .5rem 0 0;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(3.2rem, 6vw, 6.2rem);
          font-weight: 400;
          letter-spacing: -.04em;
          line-height: .92;
          text-wrap: balance;
        }

        .project-journey__intro {
          margin: 0 0 .35rem;
          color: rgba(29,42,36,.7);
          font-size: clamp(.92rem, 1.15vw, 1.05rem);
          line-height: 1.65;
        }

        .project-journey__rail {
          position: relative;
          display: grid;
          grid-template-columns: repeat(6, minmax(0,1fr));
          margin-top: clamp(1.5rem, 3vw, 2.8rem);
          border: 1px solid rgba(29,42,36,.12);
          border-radius: 1rem;
          background: rgba(250,247,240,.72);
          box-shadow: 0 18px 45px rgba(56,44,32,.08);
          backdrop-filter: blur(18px);
          overflow: hidden;
        }

        .project-journey__rail-progress {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          transform-origin: left center;
          background: var(--pj-accent);
          transition: transform 700ms cubic-bezier(.22,1,.36,1);
        }

        .project-journey__stage-button {
          position: relative;
          min-height: 5.6rem;
          padding: 1rem 1rem 1.25rem;
          border: 0;
          border-right: 1px solid rgba(29,42,36,.08);
          background: transparent;
          color: rgba(29,42,36,.48);
          text-align: left;
          cursor: pointer;
          transition: color 320ms ease, background 320ms ease;
        }

        .project-journey__stage-button:last-child { border-right: 0; }
        .project-journey__stage-button:hover,
        .project-journey__stage-button:focus-visible,
        .project-journey__stage-button.is-active {
          color: #1d2a24;
          background: color-mix(in srgb, var(--pj-accent) 10%, transparent);
          outline: none;
        }

        .project-journey__stage-button > span {
          color: var(--pj-accent);
          font-family: var(--font-display), Georgia, serif;
          font-size: .78rem;
        }

        .project-journey__stage-button strong {
          display: block;
          margin-top: .45rem;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(.94rem, 1.15vw, 1.12rem);
          font-weight: 400;
        }

        .project-journey__stage-button i {
          position: absolute;
          right: .85rem;
          top: 1rem;
          width: .46rem;
          height: .46rem;
          border: 1px solid rgba(29,42,36,.32);
          border-radius: 999px;
          transition: background 320ms ease, box-shadow 320ms ease;
        }

        .project-journey__stage-button.is-active i {
          border-color: var(--pj-accent);
          background: var(--pj-accent);
          box-shadow: 0 0 0 .3rem color-mix(in srgb, var(--pj-accent) 15%, transparent);
        }

        .project-journey__board {
          display: grid;
          grid-template-columns: minmax(20rem,.78fr) minmax(32rem,1.22fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .project-journey__focus-card,
        .project-journey__map-card {
          position: relative;
          min-height: 28rem;
          border-radius: 1.25rem;
          overflow: hidden;
        }

        .project-journey__focus-card {
          display: flex;
          flex-direction: column;
          padding: clamp(1.5rem, 2.4vw, 2.25rem);
          border: 1px solid rgba(29,42,36,.12);
          background: rgba(250,247,240,.86);
          box-shadow: 0 24px 70px rgba(56,44,32,.1);
          backdrop-filter: blur(20px);
          animation: projectJourneyCardIn 620ms cubic-bezier(.22,1,.36,1) both;
        }

        .project-journey__card-topline {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .project-journey__card-topline p,
        .project-journey__card-topline span {
          margin: 0;
          color: rgba(29,42,36,.5);
          font-size: .67rem;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .project-journey__card-topline p { color: var(--pj-accent); }
        .project-journey__turns { margin-top: 1.6rem; }
        .project-journey__focus-card h3 {
          max-width: 12ch;
          margin: .55rem 0 0;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(2rem, 3vw, 3.15rem);
          font-weight: 400;
          letter-spacing: -.025em;
          line-height: 1.02;
          text-wrap: balance;
        }

        .project-journey__explanation {
          margin: .9rem 0 0;
          color: rgba(29,42,36,.68);
          font-size: .88rem;
          line-height: 1.58;
        }

        .project-journey__output-block {
          margin-top: 1.15rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(29,42,36,.1);
        }

        .project-journey__output-block strong {
          display: block;
          margin-top: .55rem;
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.12rem;
          font-weight: 400;
          line-height: 1.35;
        }

        .project-journey__readiness {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(29,42,36,.1);
        }

        .project-journey__readiness-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: .7rem;
          color: rgba(29,42,36,.5);
          font-size: .61rem;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .project-journey__readiness-heading strong { color: var(--pj-accent); font-weight: 700; }
        .project-journey__bar-row {
          display: grid;
          grid-template-columns: 4.4rem 1fr 1.5rem;
          align-items: center;
          gap: .6rem;
          margin-top: .46rem;
        }

        .project-journey__bar-row > span,
        .project-journey__bar-row > strong { color: rgba(29,42,36,.57); font-size: .65rem; font-weight: 500; }
        .project-journey__bar-row > strong { text-align: right; }
        .project-journey__bar-row > div { height: .2rem; border-radius: 99px; background: rgba(29,42,36,.1); overflow: hidden; }
        .project-journey__bar-row i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: var(--pj-accent);
          transition: width 800ms cubic-bezier(.22,1,.36,1);
        }

        .project-journey__map-card {
          padding: clamp(1.4rem, 2.4vw, 2.2rem);
          border: 1px solid rgba(250,247,240,.12);
          background: linear-gradient(145deg, rgba(27,39,33,.96), rgba(20,30,26,.92));
          color: #f5efe5;
          box-shadow: 0 24px 75px rgba(30,39,33,.18);
        }

        .project-journey__map-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; }
        .project-journey__map-heading h3 {
          margin: .35rem 0 0;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.5rem, 2.1vw, 2.1rem);
          font-weight: 400;
        }
        .project-journey__map-heading > span { color: rgba(245,239,229,.45); font-size: .64rem; letter-spacing: .13em; text-transform: uppercase; }
        .project-journey__map { position: relative; min-height: 20rem; margin-top: -.25rem; }
        .project-journey__map svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .project-journey__path-base,
        .project-journey__path-live { fill: none; stroke-linecap: round; }
        .project-journey__path-base { stroke: rgba(245,239,229,.15); stroke-width: 1.4; }
        .project-journey__path-live {
          stroke: var(--pj-accent);
          stroke-width: 2;
          stroke-dasharray: 1;
          transition: stroke-dashoffset 850ms cubic-bezier(.22,1,.36,1);
          filter: drop-shadow(0 0 5px color-mix(in srgb, var(--pj-accent) 65%, transparent));
        }

        .project-journey__node {
          position: absolute;
          z-index: 2;
          display: flex;
          width: 6.4rem;
          flex-direction: column;
          align-items: center;
          gap: .55rem;
          padding: .5rem;
          border: 0;
          background: transparent;
          color: rgba(245,239,229,.45);
          transform: translate(-50%,-50%);
          cursor: pointer;
          transition: color 350ms ease;
        }

        .project-journey__node i {
          width: .82rem;
          height: .82rem;
          border: 1px solid rgba(245,239,229,.38);
          border-radius: 99px;
          background: #17231e;
          transition: transform 350ms ease, background 350ms ease, box-shadow 350ms ease;
        }
        .project-journey__node span { font-family: var(--font-display), Georgia, serif; font-size: .82rem; }
        .project-journey__node:hover,
        .project-journey__node:focus-visible,
        .project-journey__node.is-reached { color: #f5efe5; outline: none; }
        .project-journey__node.is-reached i { border-color: var(--pj-accent); background: var(--pj-accent); }
        .project-journey__node.is-active i {
          transform: scale(1.28);
          box-shadow: 0 0 0 .4rem color-mix(in srgb, var(--pj-accent) 14%, transparent), 0 0 20px color-mix(in srgb, var(--pj-accent) 62%, transparent);
          animation: projectJourneyPulseNode 2.2s ease-in-out infinite;
        }

        .project-journey__prevents {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 1rem;
          padding: .9rem 1rem;
          border: 1px solid color-mix(in srgb, var(--pj-accent) 30%, transparent);
          border-radius: .85rem;
          background: color-mix(in srgb, var(--pj-accent) 8%, transparent);
        }
        .project-journey__prevents p { margin: 0; color: rgba(245,239,229,.72); font-size: .77rem; line-height: 1.45; }

        .project-journey__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          margin-top: .8rem;
          padding: .6rem .15rem;
        }
        .project-journey__footer p { margin: 0; color: rgba(29,42,36,.58); font-size: .78rem; }
        .project-journey__footer a {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          min-height: 2.75rem;
          padding: 0 1.2rem;
          border: 1px solid rgba(29,42,36,.25);
          border-radius: 99px;
          color: #1d2a24;
          font-size: .76rem;
          text-decoration: none;
          transition: transform 250ms ease, background 250ms ease;
        }
        .project-journey__footer a:hover,
        .project-journey__footer a:focus-visible { background: rgba(250,247,240,.72); transform: translateY(-2px); outline: none; }

        .project-journey.is-resting .project-journey__node.is-active i { animation-play-state: paused !important; }

        @keyframes projectJourneyMediaIn {
          from { opacity: 0; transform: scale(1.04); filter: saturate(.4) contrast(.9) brightness(1.02) blur(6px); }
          to { opacity: .2; transform: scale(1); filter: saturate(.62) contrast(.88) brightness(1.08) blur(0); }
        }
        @keyframes projectJourneyCardIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes projectJourneyPulseNode {
          0%,100% { box-shadow: 0 0 0 .28rem color-mix(in srgb, var(--pj-accent) 12%, transparent), 0 0 12px color-mix(in srgb, var(--pj-accent) 42%, transparent); }
          50% { box-shadow: 0 0 0 .5rem color-mix(in srgb, var(--pj-accent) 7%, transparent), 0 0 24px color-mix(in srgb, var(--pj-accent) 68%, transparent); }
        }

        @media (min-width: 1101px) and (max-height: 960px) {
          .project-journey { padding: 4.3rem 0 1rem; }
          .project-journey__header h2 { font-size: clamp(2.9rem, min(4.8vw,6.8svh),4.7rem); }
          .project-journey__rail { margin-top: .8rem; }
          .project-journey__stage-button { min-height: 4.35rem; padding: .65rem .8rem .85rem; }
          .project-journey__board { margin-top: .7rem; }
          .project-journey__focus-card,
          .project-journey__map-card { min-height: clamp(20rem,38svh,22.5rem); padding: 1rem 1.2rem; }
          .project-journey__turns { margin-top: .75rem; }
          .project-journey__focus-card h3 { font-size: clamp(1.85rem,min(2.6vw,4svh),2.65rem); }
          .project-journey__explanation { margin-top: .55rem; font-size: .8rem; }
          .project-journey__output-block { margin-top: .65rem; padding-top: .6rem; }
          .project-journey__readiness { padding-top: .6rem; }
          .project-journey__map { min-height: clamp(14rem,27svh,16rem); }
          .project-journey__footer { margin-top: .35rem; padding-block: .35rem; }
        }

        @media (max-width: 900px) {
          .project-journey__header { grid-template-columns: 1fr; align-items: start; gap: 1.5rem; }
          .project-journey__intro { max-width: 42rem; }
          .project-journey__rail { display: flex; overflow-x: auto; scrollbar-width: none; }
          .project-journey__rail::-webkit-scrollbar { display: none; }
          .project-journey__stage-button { width: 9.4rem; flex: 0 0 9.4rem; }
          .project-journey__board { grid-template-columns: 1fr; }
          .project-journey__focus-card,
          .project-journey__map-card { min-height: auto; }
          .project-journey__focus-card { min-height: 29rem; }
          .project-journey__map { min-height: 21rem; }
        }

        @media (max-width: 680px) {
          .project-journey { padding-top: 4.75rem; }
          .project-journey__shell { width: min(100% - 1.25rem,1440px); }
          .project-journey__header h2 { font-size: clamp(3rem,15vw,4.5rem); }
          .project-journey__map-heading > span { display: none; }
          .project-journey__map { min-height: 19rem; margin-inline: -.7rem; }
          .project-journey__node { width: 4.9rem; }
          .project-journey__node span { font-size: .7rem; }
          .project-journey__prevents { grid-template-columns: 1fr; gap: .45rem; }
          .project-journey__footer { align-items: flex-start; flex-direction: column; }
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
