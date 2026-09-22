"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import styles from "./DecisionTrail.module.css";

const HANDOFFS = [
  "The founder brief gives the audience research a starting point.",
  "Audience tensions help decide which position the brand can own.",
  "The chosen position becomes a reference for words and design.",
  "Shared words and visual cues carry the promise across channels.",
  "Real customer encounters give the review something to examine.",
  "The review feeds the next brief. Earlier decisions stay available.",
] as const;
const POINTS = [32, 22, 30, 18, 24, 14];
const EASE = [.22, 1, .36, 1] as const;

type DecisionTrailProps = {
  stages: string[];
  active: number;
  still: boolean;
  onChoose: (index: number, keyboard: boolean) => void;
};

export function DecisionTrail({ stages, active, still, onChoose }: DecisionTrailProps) {
  const [announcement, setAnnouncement] = useState<{ index: number; text: string } | null>(null);
  const previousActive = useRef(active);
  const handoffMotion = useAnimationControls();
  const from = previousActive.current;
  const settleHandoff = useCallback(() => {
    handoffMotion.stop();
    handoffMotion.set({ y: 0 });
  }, [handoffMotion]);
  useEffect(() => {
    const changed = previousActive.current !== active;
    previousActive.current = active;
    setAnnouncement((current) => current && current.index !== active ? null : current);
    settleHandoff();
    if (still || !changed) return;
    handoffMotion.set({ y: 4 });
    void handoffMotion.start({ y: 0, transition: { duration: .38, ease: EASE } });
    return () => handoffMotion.stop();
  }, [active, handoffMotion, settleHandoff, still]);
  const last = active === stages.length - 1;
  const next = last ? 0 : active + 1;
  const step = stages.length > 1 ? 320 / (stages.length - 1) : 0;
  function select(index: number, keyboard: boolean) {
    setAnnouncement({ index, text: `${stages[index]}. ${HANDOFFS[index] ?? ""}` });
    onChoose(index, keyboard);
  }
  function revealControl(button: HTMLButtonElement) {
    if (!button.matches(":focus-visible")) return;
    const bounds = button.getBoundingClientRect();
    if (bounds.top < 80 || bounds.bottom > window.innerHeight - 80) {
      button.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    }
  }
  return (
    <div className={styles.trail} data-process-trail data-still={still}>
      <div className={styles.heading}>
        <span>What carries forward</span>
        <span>{String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>
      </div>
      {/* The trail illustrates the same selection as the tabs. Keeping the
          SVG decorative avoids a second set of six competing tab stops. */}
      <svg key={still ? "still" : "moving"} viewBox="0 0 360 52" fill="none" aria-hidden="true" focusable="false" className={styles.diagram}>
        {stages.map((stage, index) => {
          const x = 20 + index * step;
          const y = POINTS[index % POINTS.length];
          const previousX = x - step;
          const previousY = POINTS[(index - 1 + POINTS.length) % POINTS.length];
          const path = `M${previousX} ${previousY} C${previousX + step / 2} ${previousY} ${x - step / 2} ${y} ${x} ${y}`;
          const changed = (index <= from) !== (index <= active);
          const order = active > from ? index - from - 1 : from - index;
          return index > 0 ? (
            <g key={stage}>
                <path d={path} stroke="#c9bcaa" strokeWidth="1.4" />
                <motion.path d={path} stroke="#805239" strokeWidth="1.7" initial={false}
                  animate={{ pathLength: index <= active ? 1 : 0 }}
                  transition={{ duration: still ? 0 : .46, delay: still || !changed ? 0 : Math.min(4, Math.max(0, order)) * .06, ease: EASE }} />
            </g>
          ) : null;
        })}
        {stages.map((stage, index) => {
          const x = 20 + index * step;
          const y = POINTS[index % POINTS.length];
          return (
            <g key={stage}>
              <motion.circle cx={x} cy={y} initial={false}
                animate={{ r: active === index ? 10 : 6, fill: index <= active ? "#514936" : "#f6f0e5" }}
                stroke={index <= active ? "#514936" : "#9d8c73"} strokeWidth="1.2"
                transition={{ duration: still ? 0 : .45, ease: EASE }} />
              {index < active && <path d={`M${x - 2.5} ${y} l1.7 1.7 l3.5 -4`} stroke="#fff9ed" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />}
              {index === active && <circle cx={x} cy={y} r="2" fill="#fff9ed" />}
            </g>
          );
        })}
      </svg>
      <div className={styles.copyStack}>
        <div className={styles.measure} aria-hidden="true" inert>
          {HANDOFFS.map((handoff) => <p key={handoff}>{handoff}</p>)}
        </div>
        <motion.p data-process-handoff initial={false} animate={handoffMotion} onPointerDown={settleHandoff}>{HANDOFFS[active] ?? "Each decision gives the next stage a starting point."}</motion.p>
      </div>
      <div className={styles.controls} role="group" aria-label="Explore project stages">
        <button type="button" className={styles.previous} aria-disabled={active === 0}
          aria-label="Previous project stage" aria-controls="project-stage-panel"
          onFocus={(event) => revealControl(event.currentTarget)}
          onClick={(event) => { if (active > 0) select(active - 1, event.detail === 0); }}>
          <ArrowLeft size={17} aria-hidden="true" />
        </button>
        <button type="button" className={styles.next}
          aria-label={`${last ? "Revisit" : "Next"} project stage: ${stages[next]}`} aria-controls="project-stage-panel"
          onFocus={(event) => revealControl(event.currentTarget)}
          onClick={(event) => select(next, event.detail === 0)}>
          <span className={styles.copyStack}>
            <span className={styles.measure} aria-hidden="true" inert>
              {stages.map((stage, index) => <span key={stage}>{index === 0 ? "Revisit" : "Next"}: {stage}</span>)}
            </span>
            <span>{last ? "Revisit" : "Next"}: {stages[next]}</span>
          </span>
          {last ? <RotateCcw size={16} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
        </button>
      </div>
      <span className={styles.announcement} role="status" aria-live="polite" aria-atomic="true">{announcement?.index === active ? announcement.text : ""}</span>
    </div>
  );
}
