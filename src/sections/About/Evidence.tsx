"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useInView, useTransform } from "framer-motion";
import { ArrowUpRight, BarChart3, FileCheck2, ScanLine } from "lucide-react";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { projects } from "@/data/projects";
import styles from "./Evidence.module.css";

const CASES = [
  { slug: "dr-haley-nutrition", evidenceType: "Measured performance", basis: "Measured · December 2025 to January 2026", ambiguity: "More posts kept going out while fewer people stayed.", decision: "Publish less. Make relevance carry the account.", record: "104%", recordLabel: "more followers earned per post", trace: "1,350% more comments per post · engagement rate rose from 0.71% to 2.81%", icon: BarChart3, accent: "#a7b68b" },
  { slug: "myshopineurope", evidenceType: "Documented strategic output", basis: "Delivered · foundation and twelve month plan", ambiguity: "A marketplace risked becoming another route to cheap supply.", decision: "Lead with craft heritage and origin buyers can pass on.", record: "Brand foundation", recordLabel: "plus a twelve month content plan", trace: "Channel playbooks · rollout by quarter", icon: FileCheck2, accent: "#d69066" },
  { slug: "herbalcart", evidenceType: "Work ready for implementation", basis: "Delivered · five formats and complete scripts", ambiguity: "A modern supplement range was being read as a herbal remedy brand.", decision: "Reset the category around wellness led by supplements.", record: "5 formats", recordLabel: "ready to shoot with complete Hinglish scripts", trace: "Repositioned campaign · native content direction", icon: ScanLine, accent: "#d0a954" },
] as const;

const PROJECTS_BY_SLUG = new Map(projects.map((project) => [project.slug, project]));
const EASE = [0.22, 1, 0.36, 1] as const;

export function Evidence() {
  const storyRef = useRef<HTMLDivElement>(null);
  const pointerFrameRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(storyRef, { amount: 0.16, margin: "8% 0px -12% 0px" });
  const sequence = useScrollDrivenVisualizer({ count: CASES.length, target: storyRef, enabled: inView, reducedMotion: prefersReducedMotion });
  const active = CASES[sequence.activeIndex];
  const project = PROJECTS_BY_SLUG.get(active.slug);
  const cameraY = useTransform(sequence.scrollYProgress, [0, 1], ["1.8%", "-1.8%"]);
  const cameraScale = useTransform(sequence.scrollYProgress, [0, 0.5, 1], [0.992, 1, 0.994]);

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const node = storyRef.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
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

  function onCaseKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % CASES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + CASES.length - 1) % CASES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = CASES.length - 1;
    else return;
    event.preventDefault();
    sequence.choose(next);
    document.getElementById(`evidence-case-${next}`)?.focus();
  }

  if (!project) return null;
  const ActiveIcon = active.icon;

  return (
    <div ref={storyRef} className={styles.scrollStory} data-scroll-story="about-evidence" data-evidence-case={sequence.activeIndex + 1} onPointerMove={onPointerMove} onPointerLeave={resetPointer}>
      <Container className={styles.sticky}>
        <div className={styles.root}>
          <header className={styles.header}>
            <div><p className={styles.eyebrow}>Client evidence</p><h2 id="evidence-title">Follow the business problem, <em>the choice, and the record.</em></h2></div>
            <p className={styles.intro}>Each case separates what the business faced, what was decided, and what can honestly be shown afterward.</p>
          </header>

          <motion.div className={styles.camera} style={prefersReducedMotion ? undefined : { y: cameraY, scale: cameraScale }}>
            <section className={styles.lens} aria-labelledby="evidence-title">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={active.slug} className={styles.imageField} initial={prefersReducedMotion ? false : { clipPath: "inset(0 0 0 100%)", scale: 1.08 }} animate={{ clipPath: "inset(0 0 0 0%)", scale: 1 }} exit={prefersReducedMotion ? undefined : { clipPath: "inset(0 100% 0 0)", scale: 1.035 }} transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: EASE }}>
                  <Image src={project.cardImage ?? project.heroPoster ?? ""} alt="" fill sizes="(min-width: 1024px) 36vw, 100vw" />
                </motion.div>
              </AnimatePresence>
              <div className={styles.imageVeil} aria-hidden="true" />

              <div className={styles.caseIdentity}><span style={{ color: active.accent }}><ActiveIcon size={17} aria-hidden="true" /></span><div><small>Engagement {String(sequence.activeIndex + 1).padStart(2, "0")} / {String(CASES.length).padStart(2, "0")}</small><strong>{project.title}</strong><em>{project.industry}</em></div></div>

              <div
                id="evidence-record"
                className={styles.reasoningPath}
                role="tabpanel"
                aria-labelledby={`evidence-case-${sequence.activeIndex}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={active.slug} className={styles.pathInner} initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={prefersReducedMotion ? undefined : { opacity: 0, x: -18 }} transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}>
                    <p className={styles.recordBasis}><span>Evidence class</span><strong>{active.evidenceType}</strong><em>{active.basis}</em></p>
                    <div className={styles.pathChain}>
                      <article className={styles.pathStep}><span>01 · Ambiguity</span><p>{active.ambiguity}</p></article>
                      <i className={styles.thread} aria-hidden="true"><b /></i>
                      <article className={styles.pathStep}><span>02 · Decision</span><p>{active.decision}</p></article>
                      <i className={styles.thread} aria-hidden="true"><b /></i>
                      <article className={`${styles.pathStep} ${styles.outcome}`}><span>03 · Record</span><strong>{active.record}</strong><p>{active.recordLabel}</p><small><b>Trace</b>{active.trace}</small></article>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className={styles.caseControls} role="tablist" aria-label="Compare documented engagements">
                {CASES.map((item, index) => {
                  const itemProject = PROJECTS_BY_SLUG.get(item.slug);
                  const selected = sequence.activeIndex === index;
                  const reached = index <= sequence.activeIndex;
                  return <button key={item.slug} id={`evidence-case-${index}`} type="button" role="tab" aria-selected={selected} aria-controls="evidence-record" tabIndex={selected ? 0 : -1} data-active={selected} data-reached={reached} onPointerDown={() => sequence.choose(index)} onClick={(event) => event.detail === 0 && sequence.choose(index)} onPointerEnter={() => sequence.preview(index)} onPointerLeave={sequence.releasePreview} onFocus={() => sequence.preview(index)} onBlur={sequence.releasePreview} onKeyDown={(event) => onCaseKeyDown(event, index)}><small>0{index + 1}</small><span><strong>{itemProject?.title}</strong><em>{item.evidenceType}</em></span><i aria-hidden="true"><b /></i></button>;
                })}
              </div>

              <div className={styles.proofResolution} data-complete={sequence.activeIndex === CASES.length - 1} aria-hidden={sequence.activeIndex !== CASES.length - 1}>
                <span>The proof standard · three traces collected</span>
                <strong>The outcome matters. The reasoning that produced it remains visible.</strong>
              </div>

              <Link className={styles.caseLink} href={`/work/${active.slug}`}>Inspect the full case <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </section>
          </motion.div>

          <div className={styles.staticExperience}>
            {CASES.map((item) => {
              const itemProject = PROJECTS_BY_SLUG.get(item.slug);
              const Icon = item.icon;
              if (!itemProject) return null;
              return <article key={item.slug}><header><span><Icon size={17} aria-hidden="true" /></span><div><small>{item.evidenceType}</small><h3>{itemProject.title}</h3><p className={styles.staticBasis}>{item.basis}</p></div></header><ol><li><span>Ambiguity</span><p>{item.ambiguity}</p></li><li><span>Decision</span><p>{item.decision}</p></li><li><span>Record</span><strong>{item.record}</strong><p>{item.recordLabel}</p><em className={styles.staticTrace}>{item.trace}</em></li></ol><Link href={`/work/${item.slug}`}>Inspect the full case <ArrowUpRight size={14} /></Link></article>;
            })}
            <p className={styles.staticResolution}>
              <span>The proof standard</span>
              <strong>The outcome matters. The reasoning that produced it remains visible.</strong>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
