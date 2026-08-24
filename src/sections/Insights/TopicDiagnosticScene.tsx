"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import type { InsightElement } from "@/data/insights";

type DiagnosticRead = {
  question: string;
  article: {
    slug: string;
    title: string;
    excerpt: string;
    readingTime: string;
  };
};

type TopicDiagnosticSceneProps = {
  topicSlug: string;
  topicName: string;
  element: InsightElement;
  accent: string;
  introduction: string[];
  reads: DiagnosticRead[];
};

export function TopicDiagnosticScene({
  topicSlug,
  topicName,
  element,
  accent,
  introduction,
  reads,
}: TopicDiagnosticSceneProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const prefersReducedMotion = useHydratedReducedMotion();
  const active = reads[activeIndex];

  useEffect(() => {
    if (!inView || paused || prefersReducedMotion || reads.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % reads.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [inView, paused, prefersReducedMotion, reads.length]);

  if (!active) return null;

  return (
    <section
      ref={sectionRef}
      className="topic-diagnostic"
      aria-labelledby={`topic-diagnostic-${topicSlug}`}
      style={{ "--topic-accent": accent } as CSSProperties}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <BackgroundVideo
        video="/videos/generated/bt-insights-topic-system-beneath.mp4"
        poster="/images/generated/bt-insights-topic-system-beneath-poster.jpg"
        parallax
        playbackRate={0.9}
      />
      <div className="topic-diagnostic__wash" aria-hidden="true" />

      <Container className="topic-diagnostic__container">
        <div className="topic-diagnostic__intro">
          <div>
            <p className="topic-diagnostic__eyebrow">Inside {topicName}</p>
            <h2 id={`topic-diagnostic-${topicSlug}`}>
              The visible symptom carries a deeper decision.
            </h2>
          </div>
          <div className="topic-diagnostic__intro-copy">
            {introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="topic-diagnostic__stage">
          <div
            className="topic-diagnostic__questions"
            aria-label={`${topicName} diagnostic questions`}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            {reads.map((read, index) => {
              const selected = index === activeIndex;

              return (
                <button
                  key={read.question}
                  type="button"
                  aria-pressed={selected}
                  className={selected ? "is-active" : undefined}
                  onClick={() => {
                    setActiveIndex(index);
                    setPaused(true);
                  }}
                  onPointerEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                >
                  <span>0{index + 1}</span>
                  <p>{read.question}</p>
                  <i aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div
            className="topic-diagnostic__answer"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            <div className="topic-diagnostic__glyph" aria-hidden="true">
              <ElementGlyph slug={element} className="h-8 w-8" strokeWidth={1.2} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.article.slug}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.46,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p className="topic-diagnostic__answer-label">A useful next read</p>
                <h3>{active.article.title}</h3>
                <p>{active.article.excerpt}</p>
                <div className="topic-diagnostic__answer-foot">
                  <span>{active.article.readingTime}</span>
                  <Link href={`/insights/${active.article.slug}`}>
                    Open the essay
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
