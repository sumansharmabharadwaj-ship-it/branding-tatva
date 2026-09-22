"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Undo2 } from "lucide-react";
import styles from "./CostDemonstration.module.css";

const EASE = [.22, 1, .36, 1] as const;
const STUDIES = {
  messages: {
    action: "Connect the messages",
    reverse: "Show the separate messages",
    reset: "Three channels leave three different impressions.",
    resolved: "Three channels carry one reason to choose you.",
  },
  decisions: {
    action: "Carry the decision forward",
    reverse: "Show the repeated decisions",
    reset: "Each new brief reopens the same decision.",
    resolved: "The decision carries from the brief into the next campaign.",
  },
  memory: {
    action: "Repeat the same cue",
    reverse: "Show the changing cues",
    reset: "Each encounter asks people to learn a different cue.",
    resolved: "A familiar cue connects one encounter to the next.",
  },
} as const;

export type CostDemonstrationKind = keyof typeof STUDIES;
type DiagramProps = { resolved: boolean; still: boolean };

function MessageDiagram({ resolved, still }: DiagramProps) {
  return (
    <svg viewBox="0 0 360 188" fill="none" aria-hidden="true" focusable="false">
      {["Website", "Email", "Social"].map((label, index) => {
        const y = 36 + index * 58;
        const destinationY = resolved ? 94 : y;
        return (
          <g key={label}>
            <motion.path
              d={`M120 ${y} C168 ${y} 176 ${destinationY} 224 ${destinationY}`}
              animate={{ d: `M120 ${y} C168 ${y} 176 ${destinationY} 224 ${destinationY}` }}
              initial={false}
              stroke="#817d6f"
              strokeWidth="1.5"
              transition={{ duration: still ? 0 : .65, ease: EASE }}
            />
            <motion.path
              d={`M120 ${y} C168 ${y} 176 ${destinationY} 224 ${destinationY}`}
              initial={false}
              animate={{
                d: `M120 ${y} C168 ${y} 176 ${destinationY} 224 ${destinationY}`,
                pathLength: resolved ? 1 : 0,
                opacity: resolved ? 1 : 0,
              }}
              stroke="#d4b99a"
              strokeWidth="2.5"
              strokeLinecap="round"
              transition={{ duration: still ? 0 : .65, delay: still || !resolved ? 0 : index * .1, ease: EASE }}
            />
            <rect x="8" y={y - 19} width="112" height="38" rx="10" className={styles.sourcePlate} />
            <text x="64" y={y + 5} textAnchor="middle" className={styles.diagramText}>{label}</text>
            <motion.g
              initial={false}
              animate={{ y: destinationY - y, opacity: resolved && index !== 1 ? 0 : 1 }}
              transition={{ duration: still ? 0 : .65, ease: EASE }}
            >
              <rect x="224" y={y - 19} width="128" height="38" rx="10" className={resolved ? styles.sharedPlate : styles.sourcePlate} />
              <text x="288" y={y + 5} textAnchor="middle" className={styles.diagramText}>
                {resolved && index === 1 ? "One promise" : ["Design", "Content", "Speed"][index]}
              </text>
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}

function DecisionDiagram({ resolved, still }: DiagramProps) {
  return (
    <svg viewBox="0 0 360 188" fill="none" aria-hidden="true" focusable="false">
      <path d="M60 94 H300" className={styles.scrollLine} pathLength="1" />
      {["Brief", "Design", "Campaign"].map((label, index) => (
        <g key={label} transform={`translate(${60 + index * 120} 94)`}>
          {index < 2 && (
            <motion.path
              d="M49 0 H71 M65 -5 L71 0 L65 5"
              stroke="#c6a97a" strokeWidth="1.5"
              initial={false}
              animate={{ pathLength: resolved ? 1 : 0, opacity: resolved ? 1 : 0 }}
              transition={{ duration: still ? 0 : .5, delay: still ? 0 : index * .13, ease: EASE }}
            />
          )}
          <rect x="-49" y="-23" width="98" height="46" rx="12" className={resolved ? styles.sharedPlate : styles.sourcePlate} />
          <text y="5" textAnchor="middle" className={styles.diagramText}>{label}</text>
          <motion.g
            initial={false}
            animate={{ opacity: resolved ? 0 : 1, rotate: resolved ? 80 : 0 }}
            style={{ transformOrigin: "0px 0px" }}
            transition={{ duration: still ? 0 : .5, ease: EASE }}
          >
            <path d="M-34 -38 C-13 -57 26 -54 38 -32 M38 -43 V-32 H27" stroke="#a9967c" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
          <motion.path
            d="M-7 43 L-1 49 L10 36"
            stroke="#bbc6a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: resolved ? 1 : 0, opacity: resolved ? 1 : 0 }}
            transition={{ duration: still ? 0 : .4, delay: still ? 0 : index * .13, ease: EASE }}
          />
        </g>
      ))}
    </svg>
  );
}

function MemoryDiagram({ resolved, still }: DiagramProps) {
  return (
    <svg viewBox="0 0 360 188" fill="none" aria-hidden="true" focusable="false">
      <path d="M60 83 H300" className={styles.scrollLine} pathLength="1" />
      {["First visit", "Next visit", "Later on"].map((label, index) => (
        <g key={label} transform={`translate(${60 + index * 120} 83)`}>
          <motion.g
            initial={false} animate={{ scale: resolved ? 38 / 35 : 1 }}
            transition={{ duration: still ? 0 : .55, delay: still ? 0 : index * .1, ease: EASE }}
          >
            <circle r="35" fill="#1b2219" stroke={resolved ? "#c6a97a" : "#55594a"} vectorEffect="non-scaling-stroke" />
          </motion.g>
          <motion.g
            initial={false} animate={{ opacity: resolved ? 0 : 1, scale: resolved ? .65 : 1, rotate: resolved ? -20 : 0 }}
            transition={{ duration: still ? 0 : .35, ease: EASE }}
          >
            {index === 0 ? <circle r="11" stroke="#bdad94" strokeWidth="1.7" />
              : index === 1 ? <rect x="-10" y="-10" width="20" height="20" rx="2" stroke="#bdad94" strokeWidth="1.7" />
              : <path d="M0 -13 L13 10 H-13 Z" stroke="#bdad94" strokeWidth="1.7" strokeLinejoin="round" />}
          </motion.g>
          <motion.g
            initial={false} animate={{ opacity: resolved ? 1 : 0, scale: resolved ? 1 : .65, rotate: resolved ? 0 : 20 }}
            transition={{ duration: still ? 0 : .55, delay: still ? 0 : index * .1, ease: EASE }}
          >
            <path d="M-12 12 C-18 -4 -2 -18 16 -16 C18 1 4 17 -12 12 Z M-16 17 L8 -7" stroke="#d4b99a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
          <text y="65" textAnchor="middle" className={styles.diagramText}>{label}</text>
        </g>
      ))}
    </svg>
  );
}

export function CostDemonstration({ kind, reducedMotion }: { kind: CostDemonstrationKind; reducedMotion: boolean }) {
  const demoRef = useRef<HTMLDivElement>(null);
  const inView = useInView(demoRef, { amount: .12 });
  const [{ resolved, keyboard }, setChoice] = useState({ resolved: false, keyboard: false });
  const study = STUDIES[kind];
  const still = reducedMotion || keyboard || !inView;
  const captionId = `cost-demonstration-${kind}-reading`;
  return (
    <div
      ref={demoRef}
      className={styles.demo}
      data-cost-demo={kind}
      data-resolved={resolved}
      data-still={still}
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible")) setChoice((current) => ({ ...current, keyboard: true }));
      }}
      onKeyDownCapture={() => setChoice((current) => ({ ...current, keyboard: true }))}
      onPointerDownCapture={() => setChoice((current) => ({ ...current, keyboard: false }))}
    >
      <figure className={styles.figure}>
        {/* Only the decorative SVG remounts when motion is stopped. This also
            cancels a delayed stroke midflight, while reading and focus stay. */}
        <div className={styles.diagram} key={still ? "still" : "animated"}>
          {kind === "messages" ? <MessageDiagram resolved={resolved} still={still} />
            : kind === "decisions" ? <DecisionDiagram resolved={resolved} still={still} />
            : <MemoryDiagram resolved={resolved} still={still} />}
        </div>
        <figcaption className={styles.caption}>
          <span className={styles.captionMeta}>
            <span className={styles.exampleLabel}>Illustrative example</span>
            <span className={styles.stateLabel} aria-hidden="true">{resolved ? "After" : "Before"}</span>
          </span>
          <span className={styles.readingStack}>
            <span className={styles.measure} aria-hidden="true" inert>
              <span>{study.reset}</span><span>{study.resolved}</span>
            </span>
            <span id={captionId} role="status" aria-live="polite" aria-atomic="true">
              {resolved ? study.resolved : study.reset}
            </span>
          </span>
        </figcaption>
      </figure>
      <button
        type="button"
        className={styles.toggle}
        aria-controls={captionId}
        onClick={(event) => setChoice((current) => ({ resolved: !current.resolved, keyboard: event.detail === 0 }))}
        data-cursor-label="try"
      >
        <span className={styles.readingStack}>
          <span className={styles.measure} aria-hidden="true" inert>
            <span>{study.action}</span><span>{study.reverse}</span>
          </span>
          <span>{resolved ? study.reverse : study.action}</span>
        </span>
        <span className={styles.toggleIcon} aria-hidden="true">{resolved ? <Undo2 size={17} /> : <ArrowRight size={17} />}</span>
      </button>
    </div>
  );
}
