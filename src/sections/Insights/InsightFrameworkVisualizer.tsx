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
  const [direction, setDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = useHydratedReducedMotion();
  const activeStep = framework.steps[activeIndex];
  const previousIndex =
    (activeIndex - 1 + framework.steps.length) % framework.steps.length;
  const nextIndex = (activeIndex + 1) % framework.steps.length;
  const previousStep = framework.steps[previousIndex];
  const nextStep = framework.steps[nextIndex];

  function chooseStep(index: number) {
    if (index === activeIndex) return;

    const wrappedForward =
      activeIndex === framework.steps.length - 1 && index === 0;
    const wrappedBack =
      activeIndex === 0 && index === framework.steps.length - 1;

    setDirection(
      wrappedForward ? 1 : wrappedBack ? -1 : index > activeIndex ? 1 : -1,
    );
    setActiveIndex(index);
  }

  if (!activeStep) return null;

  return (
    <section
      id="working-framework"
      className="insight-framework insight-reading-chapter scroll-mt-32 pt-20"
      aria-labelledby="framework-heading"
      data-framework-direction={direction === 1 ? "forward" : "back"}
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
                data-reached={index <= activeIndex ? "true" : "false"}
                onClick={() => {
                  chooseStep(index);
                }}
                onFocus={() => chooseStep(index)}
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
                  chooseStep(nextIndex);
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
          data-active-index={activeIndex + 1}
        >
          <div className="insight-framework__rings" aria-hidden="true">
            <span />
          </div>
          <ElementGlyph
            slug={element}
            className="insight-framework__glyph h-9 w-9"
            strokeWidth={1.15}
          />
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeStep.title}
              id="framework-active-step"
              role="tabpanel"
              aria-labelledby={`framework-step-${activeIndex}`}
              custom={direction}
              variants={{
                enter: (stepDirection: 1 | -1) => ({
                  opacity: 0,
                  x: stepDirection * 24,
                  filter: "blur(6px)",
                }),
                active: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                },
                exit: (stepDirection: 1 | -1) => ({
                  opacity: 0,
                  x: stepDirection * -18,
                  filter: "blur(4px)",
                }),
              }}
              initial={prefersReducedMotion ? false : "enter"}
              animate="active"
              exit={prefersReducedMotion ? undefined : "exit"}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.52,
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
                    onClick={() => chooseStep(previousIndex)}
                    aria-label={`Show previous decision: ${previousStep.title}`}
                  >
                    <span>Previous decision</span>
                    <strong>{previousStep.title}</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => chooseStep(nextIndex)}
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
