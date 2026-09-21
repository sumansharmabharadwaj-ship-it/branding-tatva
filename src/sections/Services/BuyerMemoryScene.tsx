"use client";

import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { RotateCcw } from "lucide-react";
import styles from "./BuyerMemoryScene.module.css";

const LABELS = ["Unfamiliar", "Recognised", "Recalled", "Considered"] as const;
const DESCRIPTIONS = [
  "A new name needs an explanation of its category, offer, and buyer.",
  "The same colour, symbol, and name reconnect to one familiar brand.",
  "A buying need brings the brand to mind without a visible brand cue.",
  "A relevant position and evidence place the brand among the options a buyer considers.",
] as const;

function BrandName({ className = "" }: { className?: string }) {
  return <div className={`${styles.brandName} ${className}`}><span>B</span><strong>Your brand</strong></div>;
}

export function BuyerMemoryScene({ stage, reducedMotion }: { stage: number; reducedMotion: boolean }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sceneRef, { amount: 0.35, once: true });
  const [replay, setReplay] = useState(0);

  return (
    <div ref={sceneRef} className={styles.root}>
      <div
        key={`${stage}-${replay}`}
        className={styles.scene}
        data-memory-illustration={LABELS[stage]}
        data-animate={inView && !reducedMotion ? "true" : "false"}
        role="img"
        aria-label={DESCRIPTIONS[stage]}
      >
        <div className={styles.art} aria-hidden="true">
          {stage === 0 ? (
            <>
              <svg className={styles.connections} viewBox="0 0 420 220" preserveAspectRatio="none">
                <path className={styles.track} d="M164 110 C204 110 198 72 237 72" />
                <path className={styles.trace} pathLength="1" d="M164 110 C204 110 198 72 237 72" />
              </svg>
              <div className={`${styles.nameCard} ${styles.arrive}`}>
                <small>First encounter</small><strong>A new name</strong><span>What do they do?</span>
              </div>
              <div className={`${styles.definition} ${styles.resolve}`}>
                <small>The explanation</small>
                <span><i />Category</span><span><i />Offer</span><span><i />Buyer</span>
              </div>
            </>
          ) : stage === 1 ? (
            <>
              <svg className={styles.connections} viewBox="0 0 420 220" preserveAspectRatio="none">
                <path className={styles.track} d="M70 88 C70 134 210 110 210 156 M210 88 V156 M350 88 C350 134 210 110 210 156" />
                <path className={styles.trace} pathLength="1" d="M70 88 C70 134 210 110 210 156 M210 88 V156 M350 88 C350 134 210 110 210 156" />
              </svg>
              <div className={styles.cues}>
                <div className={styles.arrive}><span className={styles.colourCue}><i /><i /><i /></span><small>Colour</small></div>
                <div className={styles.arrive}><span className={styles.symbolCue}>B</span><small>Symbol</small></div>
                <div className={styles.arrive}><span className={styles.nameCue}>Brand</span><small>Name</small></div>
              </div>
              <BrandName className={`${styles.recognisedBrand} ${styles.resolve}`} />
            </>
          ) : stage === 2 ? (
            <>
              <svg className={styles.connections} viewBox="0 0 420 220" preserveAspectRatio="none">
                <circle className={styles.ripple} cx="86" cy="110" r="56" />
                <circle className={`${styles.ripple} ${styles.rippleOuter}`} cx="86" cy="110" r="80" />
                <path className={styles.track} d="M154 110 C196 42 224 42 268 110" />
                <path className={styles.trace} pathLength="1" d="M154 110 C196 42 224 42 268 110" />
              </svg>
              <div className={`${styles.need} ${styles.arrive}`}><small>A buying need</small><strong>Who can<br />do this?</strong></div>
              <BrandName className={`${styles.recalledBrand} ${styles.resolve}`} />
              <span className={styles.withoutCue}>The name returns from memory</span>
            </>
          ) : (
            <>
              <svg className={styles.connections} viewBox="0 0 420 220" preserveAspectRatio="none">
                <path className={styles.track} d="M210 85 V137" />
                <path className={styles.trace} pathLength="1" d="M210 85 V137" />
              </svg>
              <div className={`${styles.proof} ${styles.arrive}`}><small>A reason to consider</small><span>Position <i /> Evidence</span></div>
              <div className={styles.shortlist}>
                <div><span>Another<br />brand</span></div>
                <div className={`${styles.shortlistedBrand} ${styles.resolve}`}><span>B</span><strong>Your brand</strong></div>
                <div><span>Another<br />brand</span></div>
              </div>
              <span className={styles.shortlistLabel}>One place on the shortlist</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.replayRow}>
        <span>Illustration · {LABELS[stage]}</span>
        {!reducedMotion && (
          <button type="button" onClick={() => setReplay((value) => value + 1)} aria-label={`Replay ${LABELS[stage]} illustration`}>
            <RotateCcw size={13} aria-hidden="true" /> Replay
          </button>
        )}
      </div>
    </div>
  );
}
