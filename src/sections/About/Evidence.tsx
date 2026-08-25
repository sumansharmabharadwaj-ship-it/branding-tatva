"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useInView, useTransform } from "framer-motion";
import { ArrowUpRight, BarChart3, FileCheck2, ScanLine } from "lucide-react";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { projects } from "@/data/projects";
import styles from "./Evidence.module.css";

const CASES = [
  {
    slug: "dr-haley-nutrition",
    evidenceType: "Measured performance",
    ambiguity:
      "More posts kept going out while fewer people stayed. Volume and trust were pulling in opposite directions.",
    decision:
      "Post less, make every post earn its place, and let relevance rather than cadence carry the account.",
    record: "104%",
    recordLabel: "more followers earned per post",
    trace: ["1,350% more comments / post", "Engagement rate: 0.71% → 2.81%"],
    icon: BarChart3,
  },
  {
    slug: "myshopineurope",
    evidenceType: "Documented strategic output",
    ambiguity:
      "A new marketplace risked reading as generic access to cheap supply, without a position buyers could value.",
    decision:
      "Build the position around craft heritage and origin, giving buyers a story they can carry into retail.",
    record: "Brand foundation",
    recordLabel: "plus a year-long content operating system",
    trace: ["Channel playbooks", "Quarter-by-quarter rollout"],
    icon: FileCheck2,
  },
  {
    slug: "herbalcart",
    evidenceType: "Implementation-ready system",
    ambiguity:
      "People saw a herbal remedy brand while the shelves held whey protein, pre-workout, and protein bars.",
    decision:
      "Reset the category around modern supplement-first wellness and explain the practical gap supplementation fills.",
    record: "5 formats",
    recordLabel: "ready to shoot with complete Hinglish scripts",
    trace: ["Repositioned campaign system", "Native content direction"],
    icon: ScanLine,
  },
] as const;

const COLUMNS = [
  {
    label: "Ambiguity",
    verb: "Read",
    description: "Begin with what the business and audience were actually struggling to understand.",
  },
  {
    label: "Decision",
    verb: "Choose",
    description: "Follow the strategic choice that changed the frame, priority, or direction of the work.",
  },
  {
    label: "Record",
    verb: "Verify",
    description: "Read each result according to its evidence class: performance, strategic output, or usable system.",
  },
] as const;

const PROJECTS_BY_SLUG = new Map(projects.map((project) => [project.slug, project]));

export function Evidence() {
  const storyRef = useRef<HTMLDivElement>(null);
  const pointerFrameRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(storyRef, { amount: 0.16, margin: "8% 0px -12% 0px" });
  const sequence = useScrollDrivenVisualizer({
    count: COLUMNS.length,
    target: storyRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const activeColumn = COLUMNS[sequence.activeIndex];
  const tableY = useTransform(sequence.scrollYProgress, [0, 1], ["2%", "-2%"]);
  const tableScale = useTransform(sequence.scrollYProgress, [0, 0.5, 1], [0.99, 1, 0.99]);

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const node = storyRef.current;
    if (!node) return;
    const { left, top, width, height } = node.getBoundingClientRect();
    const x = ((event.clientX - left) / Math.max(width, 1) - 0.5) * 2;
    const y = ((event.clientY - top) / Math.max(height, 1) - 0.5) * 2;

    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--evidence-pointer-x", x.toFixed(3));
      node.style.setProperty("--evidence-pointer-y", y.toFixed(3));
    });
  }

  function resetPointer() {
    const node = storyRef.current;
    if (!node) return;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--evidence-pointer-x", "0");
      node.style.setProperty("--evidence-pointer-y", "0");
    });
  }

  function onColumnKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % COLUMNS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + COLUMNS.length - 1) % COLUMNS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = COLUMNS.length - 1;
    else return;

    event.preventDefault();
    sequence.choose(next);
    document.getElementById(`evidence-column-${next}`)?.focus();
  }

  return (
    <div
      ref={storyRef}
      className={styles.scrollStory}
      data-scroll-story="about-evidence"
      data-evidence-stage={sequence.activeIndex + 1}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      <Container className={styles.sticky}>
        <div className={styles.root}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Evidence · three engagements on one register</p>
              <h2 id="evidence-title">
                Three engagements. One proof chain: <em>ambiguity, decision, record.</em>
              </h2>
            </div>
            <div className={styles.activeColumnCopy} aria-live="polite">
              <span>{String(sequence.activeIndex + 1).padStart(2, "0")} / 03</span>
              <strong>{activeColumn.verb}</strong>
              <p>{activeColumn.description}</p>
            </div>
          </header>

          <motion.div
            className={styles.registerCamera}
            style={prefersReducedMotion ? undefined : { y: tableY, scale: tableScale }}
          >
            <section className={styles.register} aria-labelledby="evidence-title">
              <div className={styles.paperLight} aria-hidden="true" />

              <header className={styles.registerHeader}>
                <div>
                  <span>Branding Tatva</span>
                  <strong>Evidence register</strong>
                </div>
                <p>Every line traces to the project record.</p>
              </header>

              <div
                className={styles.columnControls}
                role="tablist"
                aria-label="Move through the proof chain"
              >
                <span className={styles.caseHeading}>Engagement</span>
                {COLUMNS.map((column, index) => {
                  const selected = sequence.activeIndex === index;
                  return (
                    <button
                      key={column.label}
                      id={`evidence-column-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="evidence-comparison"
                      tabIndex={selected ? 0 : -1}
                      data-active={selected}
                      onClick={() => sequence.choose(index)}
                      onPointerEnter={() => sequence.preview(index)}
                      onPointerLeave={sequence.releasePreview}
                      onFocus={() => sequence.preview(index)}
                      onBlur={sequence.releasePreview}
                      onKeyDown={(event) => onColumnKeyDown(event, index)}
                    >
                      <small>0{index + 1}</small>
                      <strong>{column.label}</strong>
                      <i aria-hidden="true"><b /></i>
                    </button>
                  );
                })}
              </div>

              <div
                id="evidence-comparison"
                className={styles.caseGrid}
                role="tabpanel"
                aria-labelledby={`evidence-column-${sequence.activeIndex}`}
              >
                {CASES.map((item, rowIndex) => {
                  const project = PROJECTS_BY_SLUG.get(item.slug);
                  const Icon = item.icon;
                  if (!project) return null;

                  return (
                    <Link
                      key={item.slug}
                      href={`/work/${item.slug}`}
                      className={styles.caseRow}
                      data-row={rowIndex + 1}
                      aria-label={`Read the documented ${project.title} case`}
                    >
                      <span className={styles.caseIdentity}>
                        <span><Icon size={16} aria-hidden="true" /></span>
                        <span>
                          <small>{item.evidenceType}</small>
                          <strong>{project.title}</strong>
                          <em>{project.industry}</em>
                        </span>
                      </span>

                      <span className={styles.ambiguityCell}>
                        <small>What was unclear</small>
                        <span>{item.ambiguity}</span>
                      </span>

                      <span className={styles.decisionCell}>
                        <small>Strategic choice</small>
                        <span>{item.decision}</span>
                      </span>

                      <span className={styles.recordCell}>
                        <small>{item.evidenceType}</small>
                        <strong>{item.record}</strong>
                        <span>{item.recordLabel}</span>
                        <span className={styles.trace} aria-hidden="true">
                          {item.trace.map((trace) => <i key={trace}>{trace}</i>)}
                        </span>
                      </span>

                      <span className={styles.caseLink} aria-hidden="true">
                        Read case <ArrowUpRight size={14} />
                      </span>
                    </Link>
                  );
                })}
              </div>

              <footer className={styles.registerFooter}>
                <span>Different evidence classes, held to the same reasoning chain</span>
                <strong>BT / EVIDENCE / 03</strong>
              </footer>
            </section>
          </motion.div>

          <div className={styles.staticExperience}>
            {CASES.map((item) => {
              const project = PROJECTS_BY_SLUG.get(item.slug);
              const Icon = item.icon;
              if (!project) return null;
              return (
                <article key={item.slug}>
                  <header>
                    <span><Icon size={17} aria-hidden="true" /></span>
                    <div>
                      <small>{item.evidenceType}</small>
                      <h3>{project.title}</h3>
                    </div>
                  </header>
                  <dl>
                    <div><dt>Ambiguity</dt><dd>{item.ambiguity}</dd></div>
                    <div><dt>Decision</dt><dd>{item.decision}</dd></div>
                    <div className={styles.staticRecord}>
                      <dt>Record</dt>
                      <dd><strong>{item.record}</strong><span>{item.recordLabel}</span></dd>
                    </div>
                  </dl>
                  <Link href={`/work/${item.slug}`}>Read the documented case <ArrowUpRight size={14} /></Link>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
