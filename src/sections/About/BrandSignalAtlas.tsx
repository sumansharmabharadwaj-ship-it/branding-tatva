"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  CheckCircle2,
  LocateFixed,
  MessageCircleMore,
  Palette,
  Waypoints,
} from "lucide-react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import styles from "./BrandSignalAtlas.module.css";

const SURFACES = [
  {
    number: "01",
    label: "Position",
    short: "Meaning",
    title: "A position the business can credibly own.",
    description:
      "The central idea names the difference, the audience tension, and the value the brand is prepared to prove.",
    test: "Can the team use it to choose one direction over another?",
    icon: LocateFixed,
  },
  {
    number: "02",
    label: "Language",
    short: "Expression",
    title: "Language the team can repeat without flattening the idea.",
    description:
      "A message hierarchy, verbal character, and repeatable phrases turn the position into language people can understand and remember.",
    test: "Can different voices still sound like the same brand?",
    icon: MessageCircleMore,
  },
  {
    number: "03",
    label: "Direction",
    short: "Form",
    title: "A visual world with a strategic reason.",
    description:
      "Creative principles guide image, type, colour, composition, and movement so each format is recognisably part of the same brand.",
    test: "Can a new execution feel recognisable before the logo arrives?",
    icon: Palette,
  },
  {
    number: "04",
    label: "Practice",
    short: "Use",
    title: "Rules the team can apply to tomorrow's work.",
    description:
      "Decision rules, examples, and working tools help the brand move through real conversations, campaigns, and growth moments.",
    test: "Can the rules guide tomorrow's decision without the founder in the room?",
    icon: Waypoints,
  },
] as const;

const STAGES = [
  {
    number: "01",
    label: "Find",
    cue: "Useful brand work begins by deciding which market meaning the business can credibly own.",
    core: "The position",
    subline: "Specific enough to guide a choice.",
  },
  {
    number: "02",
    label: "Carry",
    cue: "The position moves through language, form, and behaviour without losing its meaning.",
    core: "The rules",
    subline: "Useful across real formats.",
  },
  {
    number: "03",
    label: "Recognise",
    cue: "Repeated choices give buyers something familiar to notice, trust, and remember.",
    core: "Recognition",
    subline: "Consistent enough to compound.",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function BrandSignalAtlas() {
  const sectionRef = useRef<HTMLElement>(null);
  const pointerFrameRef = useRef(0);
  const [selectedSurface, setSelectedSurface] = useState(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.18, margin: "8% 0px -10% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: STAGES.length,
    target: sectionRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const stageIndex = prefersReducedMotion ? STAGES.length - 1 : visualizer.activeIndex;
  const stage = STAGES[stageIndex];
  const surface = SURFACES[selectedSurface];
  const ActiveIcon = surface.icon;

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  function updatePointer(event: ReactPointerEvent<HTMLElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const node = sectionRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--atlas-pointer-x", x.toFixed(3));
      node.style.setProperty("--atlas-pointer-y", y.toFixed(3));
    });
  }

  function resetPointer() {
    const node = sectionRef.current;
    if (!node) return;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--atlas-pointer-x", "0");
      node.style.setProperty("--atlas-pointer-y", "0");
    });
  }

  function onSurfaceKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number, idPrefix = "brand-surface") {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % SURFACES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + SURFACES.length - 1) % SURFACES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = SURFACES.length - 1;
    else return;

    event.preventDefault();
    setSelectedSurface(next);
    document.getElementById(`${idPrefix}-${next}`)?.focus();
  }

  return (
    <section
      ref={sectionRef}
      className={styles.scrollStory}
      data-atlas-stage={stageIndex + 1}
      data-scroll-story="about-brand-signal-atlas"
      aria-labelledby="brand-atlas-title"
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <div className={styles.sticky}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>From position to everyday use</p>
            <h2 id="brand-atlas-title">
              Strategy matters when <em>the whole business can use it.</em>
            </h2>
          </div>
          <div className={styles.headerAside}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={stage.number}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: EASE }}
              >
                {stage.cue}
              </motion.p>
            </AnimatePresence>
            <p className={styles.stageReadout}>
              <span>{stage.label}</span>
              <strong>{stage.number} / 03</strong>
            </p>
          </div>
        </header>

        <div className={styles.desktopAtlas}>
          <div className={styles.map} aria-label="Four connected surfaces of a brand system">
            <div className={styles.mapThreads} aria-hidden="true"><span /><span /><span /><span /></div>
            <motion.div
              className={styles.core}
              animate={{
                scale: stageIndex === 0 ? 0.82 : stageIndex === 1 ? 1 : 1.1,
                rotate: stageIndex === 0 ? -5 : stageIndex === 1 ? 0 : 4,
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: EASE }}
            >
              <span aria-hidden="true"><CheckCircle2 size={18} /></span>
              <small>{stage.core}</small>
              <strong>{stage.subline}</strong>
            </motion.div>

            <div className={styles.surfaceNodes} role="tablist" aria-label="Choose a surface in the brand system">
              {SURFACES.map((item, index) => {
                const Icon = item.icon;
                const selected = selectedSurface === index;
                return (
                  <button
                    key={item.label}
                    id={`brand-surface-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="brand-surface-panel"
                    tabIndex={selected ? 0 : -1}
                    data-active={selected}
                    data-node={index + 1}
                    onClick={() => setSelectedSurface(index)}
                    onPointerEnter={() => setSelectedSurface(index)}
                    onFocus={() => setSelectedSurface(index)}
                    onKeyDown={(event) => onSurfaceKeyDown(event, index)}
                  >
                    <span><Icon size={16} aria-hidden="true" /></span>
                    <small>{item.number}</small>
                    <strong>{item.label}</strong>
                    <em>{item.short}</em>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="brand-surface-panel"
            className={styles.recordSlot}
            role="tabpanel"
            aria-labelledby={`brand-surface-${selectedSurface}`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.article
                key={surface.label}
                className={styles.record}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 34, clipPath: "inset(0 0 0 14%)" }}
                animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)" }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, x: -22, clipPath: "inset(0 12% 0 0)" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
              >
                <div className={styles.recordTopline}>
                  <span><ActiveIcon size={18} aria-hidden="true" /></span>
                  <small>Working area · {surface.number}</small>
                </div>
                <h3>{surface.title}</h3>
                <p>{surface.description}</p>
                <dl>
                  <dt>Use check</dt>
                  <dd>{surface.test}</dd>
                </dl>
                <div className={styles.recordFoot}>
                  <span>Position</span><i /><span>Expression</span><i /><span>Recognition</span>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.touchAtlas}>
          <div className={styles.touchRail} role="tablist" aria-label="Choose a surface in the brand system">
            {SURFACES.map((item, index) => {
              const Icon = item.icon;
              const selected = selectedSurface === index;
              return (
                <button
                  key={item.label}
                  id={`touch-brand-surface-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="touch-brand-surface-panel"
                  tabIndex={selected ? 0 : -1}
                  data-active={selected}
                  onClick={() => setSelectedSurface(index)}
                  onFocus={() => setSelectedSurface(index)}
                  onKeyDown={(event) => onSurfaceKeyDown(event, index, "touch-brand-surface")}
                >
                  <span><Icon size={16} aria-hidden="true" /></span>
                  <small>{item.number}</small>
                  <strong>{item.label}</strong>
                </button>
              );
            })}
          </div>

          <div
            id="touch-brand-surface-panel"
            className={styles.touchRecordSlot}
            role="tabpanel"
            aria-labelledby={`touch-brand-surface-${selectedSurface}`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.article
                key={`touch-${surface.label}`}
                className={styles.touchRecord}
                initial={prefersReducedMotion ? false : { opacity: 0, clipPath: "inset(0 12% 0 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, clipPath: "inset(0 0 0 12%)" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
              >
              <div className={styles.touchRecordIndex}>
                <span><ActiveIcon size={18} aria-hidden="true" /></span>
                <small>{surface.number} / 04 · {surface.short}</small>
              </div>
              <h3>{surface.title}</h3>
              <p>{surface.description}</p>
              <div className={styles.touchTest}>
                <small>Use check</small>
                <strong>{surface.test}</strong>
              </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.staticAtlas}>
          <div className={styles.staticCore}>
            <CheckCircle2 size={18} aria-hidden="true" />
            <div><small>Ready for use</small><strong>The same position guides each working area.</strong></div>
          </div>
          <ol>
            {SURFACES.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <span><Icon size={17} aria-hidden="true" /></span>
                  <div>
                    <small>{item.number} · {item.label}</small>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <strong>{item.test}</strong>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
