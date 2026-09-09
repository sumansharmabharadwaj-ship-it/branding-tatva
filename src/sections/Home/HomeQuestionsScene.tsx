"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Plus } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reducedMotion = useHydratedReducedMotion();

  return (
    <section className={styles.questions} data-cursor-world="light" aria-labelledby="home-questions-title">
      <div className={styles.questionMedia} aria-hidden="true">
        <BackgroundVideo
          video="/videos/pexels-golden-fog-sea.mp4"
          videoWebm="/videos/pexels-golden-fog-sea.webm"
          poster="/images/pexels-golden-fog-sea-poster.jpg"
        />
      </div>
      <div className={styles.questionFrame}>
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
      </div>
    </section>
  );
}
