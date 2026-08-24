"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { projects } from "@/data/projects";
import styles from "./Evidence.module.css";

// About redesign, the evidence chapter — for each selected case: the
// original ambiguity, the decision made, the observed result. Every
// line is drawn from that project's own recorded challenge, strategy,
// and outcome in data/projects.ts; the sentences chosen here compress
// rather than embellish, per the verified outcomes rule.
const CASES = [
  {
    slug: "dr-haley-nutrition",
    ambiguity: "More posts kept going out while fewer people stayed. Volume and trust were pulling in opposite directions.",
    decision: "Post less, make every post earn its place, and let relevance rather than cadence carry the account.",
    result: "104% more followers earned per post, a 1,350% jump in comments per post, engagement rate from 0.71% to 2.81%.",
    evidenceType: "Measured outcome",
    record: "Two-month platform performance",
    signals: ["104% more followers / post", "13.5× comments / post", "2.81% engagement"],
  },
  {
    slug: "myshopineurope",
    ambiguity: "A new marketplace risked reading as generic access to cheap supply, with nothing separating it from the next listings site.",
    decision: "Position around craft heritage and origin instead of price, and sell the story a buyer can pass on.",
    result: "Brand foundation, channel playbooks, and a one-year content operating system tied to awareness, trust, leads, and conversion.",
    evidenceType: "Documented strategic output",
    record: "Foundation and operating system",
    signals: ["Brand foundation", "Channel playbooks", "12-month operating system"],
  },
  {
    slug: "herbalcart",
    ambiguity: "Buyers saw a herbal remedy brand while the shelves held whey protein and pre workout. The perception gap was eroding trust.",
    decision: "Reset the argument: supplementation fills a practical, explainable gap, told in the category's own native content style.",
    result: "A repositioned campaign system with five formats ready to shoot and complete Hinglish video scripts.",
    evidenceType: "Implementation-ready system",
    record: "Campaign direction and scripts",
    signals: ["5 campaign formats", "Ready-to-shoot direction", "Complete Hinglish scripts"],
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const PROJECTS_BY_SLUG = new Map(projects.map((project) => [project.slug, project]));

export function Evidence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.3, margin: "8% 0px -12% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: CASES.length,
    target: sectionRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const activeIndex = visualizer.activeIndex;
  const activeCase = CASES[activeIndex];
  const activeProject = PROJECTS_BY_SLUG.get(activeCase.slug);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % CASES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + CASES.length - 1) % CASES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = CASES.length - 1;
    else return;

    event.preventDefault();
    visualizer.choose(next);
    document.getElementById(`evidence-tab-${next}`)?.focus();
  }

  if (!activeProject) return null;

  return (
    <div
      ref={sectionRef}
      className={styles.scrollStory}
      data-evidence-case={activeCase.slug}
      data-scroll-story="about-evidence"
    >
      <Container className={`${styles.sticky} max-w-6xl`}>
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone">Evidence</p>
            <h2 className={styles.heading}>
              Ambiguity becomes a decision. <em>The result stays on record.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className={styles.caseMeta} aria-live="polite">
              <span>{activeCase.evidenceType}</span>
              <strong>{String(activeIndex + 1).padStart(2, "0")} / 03</strong>
            </p>
          </Reveal>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[17rem_1fr]">
          <div
            className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1"
            role="tablist"
            aria-label="Choose a documented engagement"
          >
            {CASES.map((item, index) => {
              const project = PROJECTS_BY_SLUG.get(item.slug);
              const selected = index === activeIndex;
              if (!project) return null;
              return (
                <button
                  key={item.slug}
                  id={`evidence-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => visualizer.choose(index)}
                  onPointerEnter={() => visualizer.preview(index)}
                  onPointerLeave={visualizer.releasePreview}
                  onFocus={() => visualizer.preview(index)}
                  onBlur={visualizer.releasePreview}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`rounded-2xl border px-4 py-4 text-left transition duration-300 ${
                    selected
                      ? "border-sandstone/55 bg-ivory/[0.1] text-ivory"
                      : "border-ivory/12 bg-soil/30 text-ivory/62 hover:border-ivory/25 hover:text-ivory"
                  }`}
                >
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-sandstone">
                    0{index + 1}
                  </span>
                  <strong className="mt-1 block font-display text-lg font-normal leading-tight">
                    {project.title}
                  </strong>
                  <span className="mt-2 block text-[0.62rem] font-medium uppercase tracking-[0.12em] opacity-60">
                    {project.industry}
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.ledger}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={activeCase.slug}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
                className="flex h-full flex-col"
                role="tabpanel"
                aria-labelledby={`evidence-tab-${activeIndex}`}
              >
                <div className={styles.ledgerHeader}>
                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-sandstone">
                      {activeCase.evidenceType}
                    </p>
                    <h3 className="mt-1 font-display text-3xl font-normal text-ivory">
                      {activeProject.title}
                    </h3>
                  </div>
                  <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-ivory/45">
                    {activeCase.record}
                  </span>
                </div>

                <ul className={styles.signalRail} aria-label={`Recorded signals for ${activeProject.title}`}>
                  {activeCase.signals.map((signal, index) => (
                    <motion.li
                      key={signal}
                      initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0.86 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: index * 0.07, ease: EASE }}
                    >
                      <span>0{index + 1}</span>
                      {signal}
                    </motion.li>
                  ))}
                </ul>

                <div className={styles.logicChain}>
                  {(
                    [
                      ["01 · The ambiguity", activeCase.ambiguity],
                      ["02 · The decision", activeCase.decision],
                      ["03 · The record", activeCase.result],
                    ] as const
                  ).map(([label, text], index) => (
                    <div key={label} className="contents">
                      <div className={`${styles.logicStep} ${index === 2 ? styles.recordStep : ""}`}>
                        <p className="text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-sandstone">
                          {label}
                        </p>
                        <p>{text}</p>
                      </div>
                      {index < 2 ? (
                        <ArrowRight
                          aria-hidden="true"
                          className="hidden h-4 w-4 self-center text-sandstone/70 md:block"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>

                <Link
                  href={`/work/${activeProject.slug}`}
                  className="mt-5 inline-flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-[0.15em] text-sandstone transition hover:text-ivory"
                >
                  Read the documented case <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </div>
  );
}
