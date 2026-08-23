"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";

const INSIGHTS = [
  {
    kind: "Featured guide",
    topic: "Positioning · Earth",
    title: "Brand positioning strategy for service businesses",
    excerpt:
      "A practical method for defining the category, customer tension, difference, proof, and message a service business should own.",
    takeaway:
      "Positioning becomes useful when one decision shapes offers, sales language, website hierarchy, content themes, and visual direction.",
    readingTime: "13 min read",
    href: "/insights/brand-positioning-strategy-service-businesses",
    accent: "#C98B63",
    steps: ["Category", "Tension", "Choice", "Proof", "Memory"],
  },
  {
    kind: "Field note 01",
    topic: "Messaging · Air",
    title: "Homepage messaging for service businesses",
    excerpt:
      "A practical homepage framework for helping the right buyer understand the category, recognise their situation, believe the difference, and know what to do next.",
    takeaway:
      "A homepage works as a sequence of customer questions, with proof placed beside the claims that need belief.",
    readingTime: "14 min read",
    href: "/insights/homepage-messaging-service-businesses",
    accent: "#7D9AA8",
    steps: ["Orient", "Recognise", "Differentiate", "Believe", "Act"],
  },
  {
    kind: "Field note 02",
    topic: "Positioning · Earth",
    title: "How to turn client proof into a positioning advantage",
    excerpt:
      "Build case studies, testimonials, metrics, and demonstrations around the position you want buyers to believe, rather than storing client praise in a decorative carousel.",
    takeaway:
      "The strongest proof connects a real customer situation with the strategic choice, mechanism, evidence, and relevance to the next buyer.",
    readingTime: "15 min read",
    href: "/insights/turn-client-proof-into-positioning-advantage",
    accent: "#D3A24F",
    steps: ["Situation", "Decision", "Mechanism", "Evidence", "Relevance"],
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeInsightsPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.2, margin: "8% 0px -12% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: INSIGHTS.length,
    target: sectionRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const activeIndex = visualizer.activeIndex;
  const active = INSIGHTS[activeIndex] ?? INSIGHTS[0];

  function moveFromKeyboard(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;
    if (!direction && event.key !== "Home" && event.key !== "End") return;

    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? INSIGHTS.length - 1
        : (index + direction + INSIGHTS.length) % INSIGHTS.length;
    visualizer.choose(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section
      ref={sectionRef}
      className="home-insights"
      aria-labelledby="home-insights-title"
      data-insights-state={activeIndex}
      data-insights-in-view={inView ? "true" : "false"}
      data-scroll-story="insights"
      style={{ "--insights-accent": active.accent } as CSSProperties}
    >
      <div
        className="home-insights__film"
        aria-hidden="true"
        data-media-id="BT-HOME-INSIGHTS-DANDELION-RELEASE-V1"
      >
        <BackgroundVideo
          video="/videos/pexels-dandelion-release.mp4"
          videoWebm="/videos/pexels-dandelion-release.webm"
          poster="/images/pexels-dandelion-release-poster.jpg"
          imagePosition="50% 42%"
          push
          playbackRate={1.08}
        />
      </div>
      <div className="home-insights__veil" aria-hidden="true" />

      <Container className="home-insights__shell max-w-[96rem]">
        <header className="home-insights__header">
          <div>
            <p className="home-insights__eyebrow">The thinking room</p>
            <h2 id="home-insights-title">
              Ideas with a job. <em>Frameworks you can use.</em>
            </h2>
          </div>
          <div className="home-insights__intro">
            <p>
              One featured guide opens the method. Two field notes carry it into
              homepage hierarchy and buying evidence.
            </p>
            <span>Scroll to change the reading path. Hover or focus a note to inspect it.</span>
            <p className="bt-scroll-cue bt-scroll-cue--light">
              <span aria-hidden="true">Scroll</span>
              The argument follows your pace.
              <strong>{String(activeIndex + 1).padStart(2, "0")} / 03</strong>
            </p>
          </div>
        </header>

        <div className="home-insights__stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.href}
              id="home-insights-active-panel"
              role="tabpanel"
              aria-labelledby={`home-insights-tab-${activeIndex}`}
              className="home-insights__argument"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
              aria-live="polite"
              data-media-id="BT-HOME-INSIGHTS-ARGUMENT-CURRENT-V1"
            >
              <div className="home-insights__argument-topline">
                <span>{active.kind}</span>
                <strong>{active.topic}</strong>
              </div>

              <div className="home-insights__copy">
                <p>{active.readingTime} · Original article</p>
                <h3>{active.title}</h3>
                <span>{active.excerpt}</span>
              </div>

              <div
                className="home-insights__current"
                role="img"
                aria-label={`${active.title}: ${active.steps.join(" to ")}`}
              >
                <div className="home-insights__current-track" aria-hidden="true">
                  <motion.i
                    key={`insight-current-${activeIndex}`}
                    initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
                    animate={{ scaleX: inView ? 1 : 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 1.8, ease: EASE }}
                  />
                  <motion.b
                    key={`insight-current-mobile-${activeIndex}`}
                    initial={{ scaleY: prefersReducedMotion ? 1 : 0 }}
                    animate={{ scaleY: inView ? 1 : 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 1.8, ease: EASE }}
                  />
                </div>
                <ol>
                  {active.steps.map((step, index) => (
                    <li key={step}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <i aria-hidden="true" />
                      <strong>{step}</strong>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="home-insights__takeaway">
                <span>Carry this into the next decision</span>
                <p>{active.takeaway}</p>
              </div>

              <div className="home-insights__actions">
                <Link href={active.href}>Read this guide <span aria-hidden="true">→</span></Link>
                <Link href="/insights">Enter the full Insights library <span aria-hidden="true">↗</span></Link>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="home-insights__index" role="tablist" aria-label="Choose an Insight reading path">
            {INSIGHTS.map((insight, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={insight.href}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`home-insights-tab-${index}`}
                  aria-selected={selected}
                  aria-controls="home-insights-active-panel"
                  tabIndex={selected ? 0 : -1}
                  className={selected ? "is-active" : undefined}
                  style={{ "--note-accent": insight.accent } as CSSProperties}
                  onClick={() => visualizer.choose(index)}
                  onPointerEnter={() => visualizer.preview(index)}
                  onPointerLeave={(event) => {
                    if (document.activeElement !== event.currentTarget) visualizer.releasePreview();
                  }}
                  onFocus={() => visualizer.preview(index)}
                  onBlur={visualizer.releasePreview}
                  onKeyDown={(event) => moveFromKeyboard(event, index)}
                >
                  <span>{insight.kind}</span>
                  <strong>{insight.title}</strong>
                  <small>{insight.topic} · {insight.readingTime}</small>
                  <i aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
