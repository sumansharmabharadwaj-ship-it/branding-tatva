"use client";

import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import styles from "./DisciplineOutput.module.css";

// Teaching illustrations, rather than client work or a promise of extra scope.
const OUTPUTS = [
  { title: "One position. Every expression.", description: "A clear position becomes a shared wordmark, colour palette, and voice.", name: "Brand Strategy and Identity" },
  { title: "A point of view, put into words.", description: "A brand belief becomes an editorial plan that explains, demonstrates, and answers.", name: "Content Strategy" },
  { title: "Different posts. Familiar cues.", description: "Three different posts repeat the same visual cues and point of view.", name: "Social Media Marketing" },
  { title: "A clear path to enquiry.", description: "A website presents the offer, supports it with evidence, and gives the buyer a path to enquiry.", name: "Website Development" },
  { title: "One voice, carried into the work.", description: "Shared verbal rules carry through into copy and design.", name: "Content Creation" },
  { title: "A promise the campaign can prove.", description: "A campaign brief connects a provable promise to the buyer and the moment that matters.", name: "Marketing Strategy" },
] as const;

function LeafMark() {
  return <svg viewBox="0 0 120 80" fill="none" aria-hidden="true"><path d="M31 68C30 35 50 12 88 10C91 46 70 64 31 68ZM31 68L76 24M49 50L48 29M62 38L81 37" /></svg>;
}

export function DisciplineOutput({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });
  const reducedMotion = useHydratedReducedMotion();
  const [replay, setReplay] = useState(0);
  const output = OUTPUTS[index] ?? OUTPUTS[0];

  return (
    <div ref={ref} className={styles.output} data-discipline-example={output.name}>
      <div className={styles.heading}>
        <span>Illustrative work</span>
        {!reducedMotion && <button type="button" onClick={() => setReplay(value => value + 1)} aria-label={`Replay ${output.name} illustration`}><RotateCcw size={13} aria-hidden="true" />Replay</button>}
      </div>
      <div className={styles.titles}>
        {OUTPUTS.map((item, position) => <p key={item.name} className={styles.title} data-active={position === index} aria-hidden={position !== index}>{item.title}</p>)}
      </div>
      <div key={`${index}-${replay}`} className={styles.scene} data-animate={inView && !reducedMotion} role="img" aria-label={output.description}>
        <div className={styles.art} aria-hidden="true">
          {index === 0 ? (
            <div className={styles.split}>
              <div className={`${styles.paper} ${styles.first}`}><small>The position</small><strong>One reason<br />to choose.</strong><span className={styles.inkLine} /><span className={styles.inkLine} /></div>
              <div className={`${styles.paper} ${styles.identity} ${styles.last}`}><span className={styles.wordmark}>B<span>Brand</span></span><span className={styles.swatches}><i /><i /><i /></span><small>Colour · Type · Voice</small></div>
            </div>
          ) : index === 1 ? (
            <div className={styles.split}>
              <div className={`${styles.paper} ${styles.first}`}><small>Point of view</small><strong>What the<br />brand believes.</strong><span className={styles.inkLine} /></div>
              <div className={`${styles.paper} ${styles.editorial}`}><small>Editorial plan</small>{["Explain", "Demonstrate", "Answer"].map((label, step) => <div key={label} className={styles.planRow}><span>0{step + 1}</span>{label}</div>)}</div>
            </div>
          ) : index === 2 ? (
            <div className={styles.posts}>{["Teach", "Show", "Discuss"].map(label => <div key={label} className={styles.post}><div><b>B</b><small>Your brand</small></div><LeafMark /><span>{label}</span></div>)}</div>
          ) : index === 3 ? (
            <div className={`${styles.website} ${styles.first}`}>
              <div className={styles.browserBar}><i /><i /><i /><small>Website structure</small></div>
              <div className={styles.websiteBody}><div><small>The offer</small><strong>A reason<br />to choose.</strong><span className={styles.inkLine} /><span className={styles.inkLine} /></div><div className={styles.last}><div className={styles.evidence}><small>Evidence</small><span>Why believe it</span></div><span className={styles.enquiry}>Enquire <span>→</span></span></div></div>
            </div>
          ) : index === 4 ? (
            <div className={styles.split}>
              <div className={`${styles.paper} ${styles.first}`}><small>Verbal rules</small><ul className={styles.rules}><li>Clear</li><li>Specific</li><li>Consistent</li></ul></div>
              <div className={`${styles.paper} ${styles.composition} ${styles.last}`}><small>Copy + design</small><strong>The same voice,<br />in use.</strong><span>Aa</span></div>
            </div>
          ) : (
            <div className={`${styles.paper} ${styles.brief}`}><small>Campaign brief</small>{[["Promise", "What can be proved"], ["Buyer", "Who needs it"], ["Moment", "When it matters"]].map(([label, detail]) => <div key={label} className={styles.briefRow}><strong>{label}</strong><span>{detail}</span></div>)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
