"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Plus } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { faqs } from "@/data/faqs";
import styles from "./HomeConversation.module.css";

const QUESTION_ORDER = [
  "Can you help a brand new business?",
  "Can you help an existing brand that already has an identity?",
  "Can you actually implement, or just strategise?",
  "How long does a project take?",
  "Can we work remotely?",
] as const satisfies readonly (typeof faqs)[number]["question"][];

// Keep the answers and the homepage's FAQ structured data in agreement.
const QUESTIONS = QUESTION_ORDER.flatMap((question) =>
  faqs.filter((item) => item.question === question),
);

export function HomeQuestionsScene() {
  const rootRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reducedMotion = useHydratedReducedMotion();
  const cinematicMotion = useMediaQuery(
    "(min-width: 1181px) and (min-height: 761px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  });
  const mediaScale = useTransform(scrollYProgress, [0, 0.68, 1], [1, 1, 1.035]);
  const frameY = useTransform(scrollYProgress, [0, 0.68, 1], [0, 0, -18]);
  const frameScale = useTransform(scrollYProgress, [0, 0.68, 1], [1, 1, 0.985]);

  return (
    <section ref={rootRef} className={styles.questions} data-cursor-world="light" aria-labelledby="home-questions-title">
      <motion.div
        className={styles.questionMedia}
        style={{ scale: cinematicMotion && !reducedMotion ? mediaScale : 1 }}
        aria-hidden="true"
      >
        <BackgroundVideo
          video="/videos/pexels-golden-fog-sea.mp4"
          videoWebm="/videos/pexels-golden-fog-sea.webm"
          poster="/images/pexels-golden-fog-sea-poster.jpg"
        />
      </motion.div>
      <motion.div
        className={styles.questionFrame}
        style={{
          y: cinematicMotion && !reducedMotion ? frameY : 0,
          scale: cinematicMotion && !reducedMotion ? frameScale : 1,
        }}
      >
        <header className={styles.questionIntro}>
          <p className={styles.eyebrow}>Before we work together</p>
          <h2 id="home-questions-title">Know what you’re <em>saying yes to.</em></h2>
          <p className={styles.lede}>
            A clear scope, a realistic schedule, and the same person leading the work.
          </p>
          <Link href="#invitation" className={styles.textLink}>
            Talk through your question <ArrowDown size={17} aria-hidden="true" />
          </Link>
        </header>

        <div className={styles.questionList}>
          {QUESTIONS.map((item, index) => {
            const open = openIndex === index;
            const buttonId = `home-question-${index + 1}`;
            const answerId = `${buttonId}-answer`;
            return (
              <div key={item.question} className={styles.questionItem} data-open={open}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    className={styles.questionButton}
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span className={styles.questionNumber} aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.question}</span>
                    <Plus size={19} className={styles.questionIcon} aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={answerId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={styles.answer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <div className={styles.auditNote}>
            <p>Prefer to look at your brand first?</p>
            <Link href="/services#audit" className={styles.textLink}>
              Try the recognition audit <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
