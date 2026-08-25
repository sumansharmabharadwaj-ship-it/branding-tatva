"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { ProcessStage } from "@/data/process";

type StageMeta = {
  becomes: string;
  explanation: string;
  output: string;
  prevents: string;
};

const STAGE_META: StageMeta[] = [
  {
    becomes: "A truth worth building on.",
    explanation:
      "We find what the business genuinely believes, who it is for, and where its current language contradicts its ambition.",
    output: "Strategic diagnosis + founder truth map",
    prevents: "A polished brand built on borrowed assumptions.",
  },
  {
    becomes: "A pattern drawn from evidence.",
    explanation:
      "Customer behaviour, category codes, and competitor habits are read together until the real tension becomes visible.",
    output: "Audience tensions + category and perception map",
    prevents: "Strategy decided by the loudest opinion in the room.",
  },
  {
    becomes: "One defensible position.",
    explanation:
      "The brand commits to the idea it can own, the promise it can keep, and the choices it will refuse.",
    output: "Positioning system + narrative spine",
    prevents: "A brand with many messages and no position.",
  },
  {
    becomes: "A recognisable expression.",
    explanation:
      "Voice, identity, and messaging take the shape the strategy demands, while staying recognisably part of one system.",
    output: "Verbal identity + design direction + message system",
    prevents: "A beautiful identity nobody can recognise twice.",
  },
  {
    becomes: "A brand people can encounter.",
    explanation:
      "Strategy enters the website, content, campaigns, and selling moments where an audience can actually meet it.",
    output: "Launch ecosystem + channel playbooks",
    prevents: "A strategy that never survives contact with the market.",
  },
  {
    becomes: "Recognition that keeps earning.",
    explanation:
      "The strongest signals are measured, repeated, governed, and improved after launch so recognition can compound.",
    output: "Brand governance + recognition roadmap",
    prevents: "Campaigns that disappear when the spend stops.",
  },
];

const ELEMENT_COLORS: Record<string, string> = {
  Air: "#7f9274",
  Fire: "#b77547",
  Earth: "#b46b4d",
  Water: "#5f8790",
  Space: "#9f7066",
};

const EASE = [0.22, 1, 0.36, 1] as const;

function fallbackMeta(): StageMeta {
  return {
    becomes: "A clearer decision.",
    explanation: "Each stage removes a different kind of ambiguity before the next layer is built.",
    output: "A committed decision the next stage can use",
    prevents: "Work that looks finished while the underlying decision is unresolved.",
  };
}

export function RootSystem({ stages }: { stages: ProcessStage[] }) {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, margin: "8% 0px -10% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: stages.length,
    target: sectionRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const active = visualizer.activeIndex;

  useEffect(() => {
    const videoAtEffectStart = videoRef.current;

    function syncPlayback() {
      const video = videoRef.current;
      if (!video) return;

      if (prefersReducedMotion || !inView || document.hidden) {
        video.pause();
        return;
      }

      video.playbackRate = 0.72;
      void video.play().catch(() => {});
    }

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      videoAtEffectStart?.pause();
    };
  }, [inView, prefersReducedMotion]);

  if (stages.length === 0) return null;

  const stage = stages[active] ?? stages[0];
  const meta = STAGE_META[active] ?? fallbackMeta();
  const accent = ELEMENT_COLORS[stage.element] ?? "#9b7457";
  const sectionStyle = { "--decision-accent": accent } as CSSProperties;

  function chooseStage(index: number) {
    visualizer.choose(index);
  }

  function onStageKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % stages.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + stages.length - 1) % stages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else return;

    event.preventDefault();
    chooseStage(next);
    document.getElementById(`decision-flow-tab-${next}`)?.focus();
  }

  function moveLight(event: PointerEvent<HTMLElement>) {
    if (prefersReducedMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--decision-pointer-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--decision-pointer-y", `${y.toFixed(2)}%`);
  }

  function resetLight(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.removeProperty("--decision-pointer-x");
    event.currentTarget.style.removeProperty("--decision-pointer-y");
  }

  return (
    <section
      ref={sectionRef}
      data-project-journey="true"
      data-scroll-story="process"
      className={`decision-flow ${inView ? "is-awake" : "is-resting"}`}
      style={sectionStyle}
      aria-labelledby="decision-flow-title"
      onPointerMove={moveLight}
      onPointerLeave={resetLight}
    >
      <div className="decision-flow__media" aria-hidden="true" data-media-id="BT-HOME-METHOD-STREAM-LIGHT">
        <video
          ref={videoRef}
          src="/videos/pixabay-stream-mist-rays.mp4"
          poster="/images/pixabay-stream-mist-rays-poster.jpg"
          aria-hidden="true"
          muted
          autoPlay={!prefersReducedMotion}
          loop
          playsInline
          preload="metadata"
          data-home-playback-rate="0.72"
        />
        <span className="decision-flow__veil" />
        <span className="decision-flow__light" />
      </div>

      <div className="decision-flow__shell">
        <header className="decision-flow__header">
          <div>
            <p>07 · The method</p>
            <h2 id="decision-flow-title">
              Six decisions. <em>One recognisable system.</em>
            </h2>
          </div>
          <p>
            Each choice gives the next one somewhere solid to begin. Nothing is decorated before the decision beneath it is clear.
          </p>
        </header>

        <div className="decision-flow__stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={`${active}-${stage.stage}`}
              id="decision-flow-panel"
              role="tabpanel"
              aria-labelledby={`decision-flow-tab-${active}`}
              aria-live="polite"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.62, ease: EASE }}
            >
              <div className="decision-flow__topline">
                <span>Decision {String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>
                <span>{stage.element}</span>
              </div>
              <p className="decision-flow__stage-name">{stage.stage}</p>
              <h3>{meta.becomes}</h3>
              <p className="decision-flow__explanation">{meta.explanation}</p>
              <dl className="decision-flow__result">
                <div>
                  <dt>Leaves you with</dt>
                  <dd>{meta.output}</dd>
                </div>
                <div>
                  <dt>So you avoid</dt>
                  <dd>{meta.prevents}</dd>
                </div>
              </dl>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="decision-flow__selector">
          <div className="decision-flow__selector-label">
            <span>Explore the six decisions</span>
            <span>{String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>
          </div>
          <div className="decision-flow__rail" role="tablist" aria-label="Choose a decision in the Branding Tatva method">
            {stages.map((item, index) => (
              <button
                key={item.stage}
                id={`decision-flow-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls="decision-flow-panel"
                tabIndex={active === index ? 0 : -1}
                className={active === index ? "is-active" : undefined}
                onClick={() => chooseStage(index)}
                onPointerEnter={() => chooseStage(index)}
                onFocus={() => chooseStage(index)}
                onKeyDown={(event) => onStageKeyDown(event, index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.stage}</strong>
                <i aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
