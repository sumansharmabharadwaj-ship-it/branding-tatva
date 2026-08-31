"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ElementGlyph } from "@/components/ElementGlyph";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import type { InsightElement, InsightFramework } from "@/data/insights";

type InsightFrameworkVisualizerProps = {
  framework: InsightFramework;
  element: InsightElement;
  accent: string;
};

export function InsightFrameworkVisualizer({
  framework,
  element,
  accent,
}: InsightFrameworkVisualizerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activeStep = framework.steps[activeIndex];
  const previousIndex =
    (activeIndex - 1 + framework.steps.length) % framework.steps.length;
  const nextIndex = (activeIndex + 1) % framework.steps.length;
  const previousStep = framework.steps[previousIndex];
  const nextStep = framework.steps[nextIndex];

  if (!activeStep) return null;

  return (
    <section
      id="working-framework"
      className="insight-framework scroll-mt-32 pt-20"
      aria-labelledby="framework-heading"
      style={{ "--framework-accent": accent } as CSSProperties}
    >
      <p className="insight-framework__eyebrow">
        Working framework · {framework.steps.length} decisions
      </p>
      <h2 id="framework-heading">{framework.title}</h2>
      <p className="insight-framework__introduction">{framework.introduction}</p>

      <div className="insight-framework__visualizer">
        <div
          className="insight-framework__steps"
          role="tablist"
          aria-label={`${framework.title} steps`}
        >
          {framework.steps.map((step, index) => {
            const selected = index === activeIndex;

            return (
              <button
                key={step.title}
                type="button"
                role="tab"
                id={`framework-step-${index}`}
                aria-selected={selected}
                aria-controls="framework-active-step"
                tabIndex={selected ? 0 : -1}
                className={selected ? "is-active" : undefined}
                onClick={() => {
                  setActiveIndex(index);
                }}
                onFocus={() => setActiveIndex(index)}
                onKeyDown={(event) => {
                  if (
                    event.key !== "ArrowRight" &&
                    event.key !== "ArrowDown" &&
                    event.key !== "ArrowLeft" &&
                    event.key !== "ArrowUp"
                  ) {
                    return;
                  }

                  event.preventDefault();
                  const direction =
                    event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
                  const nextIndex =
                    (index + direction + framework.steps.length) %
                    framework.steps.length;
                  setActiveIndex(nextIndex);
                  const next = event.currentTarget.parentElement?.querySelectorAll("button")[
                    nextIndex
                  ] as HTMLButtonElement | undefined;
                  next?.focus();
                }}
              >
                <span>0{index + 1}</span>
                <strong>{step.title}</strong>
                <i aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <div
          className="insight-framework__active"
        >
          <div className="insight-framework__rings" aria-hidden="true">
            <span />
          </div>
          <ElementGlyph
            slug={element}
            className="insight-framework__glyph h-9 w-9"
            strokeWidth={1.15}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStep.title}
              id="framework-active-step"
              role="tabpanel"
              aria-labelledby={`framework-step-${activeIndex}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.46,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p>
                Decision {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(framework.steps.length).padStart(2, "0")}
              </p>
              <h3>{activeStep.title}</h3>
              <blockquote>{activeStep.description}</blockquote>
              {framework.steps.length > 1 && previousStep && nextStep ? (
                <nav
                  className="insight-framework__controls"
                  aria-label="Framework decision navigation"
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(previousIndex)}
                    aria-label={`Show previous decision: ${previousStep.title}`}
                  >
                    <span>Previous chapter</span>
                    <strong>{previousStep.title}</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(nextIndex)}
                    aria-label={`Show next decision: ${nextStep.title}`}
                  >
                    <span>
                      {activeIndex === framework.steps.length - 1 ? "Review first decision" : "Next decision"}
                    </span>
                    <strong>{nextStep.title}</strong>
                  </button>
                </nav>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
