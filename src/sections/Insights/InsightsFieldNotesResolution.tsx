"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ElementGlyph } from "@/components/ElementGlyph";
import { NewsletterForm } from "@/components/NewsletterForm";
import type { InsightElement } from "@/data/insights";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  INSIGHTS_INTENT_CLEARED_EVENT,
  INSIGHTS_INTENT_EVENT,
  readInsightsIntent,
  type InsightsIntentDetail,
} from "@/lib/insights-intent";
import { EASE_AIR } from "@/lib/motion";

export type FieldNotesPath = {
  slug: string;
  name: string;
  element: InsightElement;
};

type FieldNotesResolution = {
  headline: string;
  description: string;
  cadence: [string, string, string];
};

type InsightsFieldNotesResolutionProps = {
  paths: FieldNotesPath[];
};

const DEFAULT_RESOLUTION: FieldNotesResolution = {
  headline: "Keep the next brand decision close. Each note earns its place.",
  description:
    "A single question, one practical lens, and a focused next move—sent when a new essay can carry real weight.",
  cadence: [
    "A tension worth examining",
    "Evidence or framework to use",
    "A focused action to test",
  ],
};

const RESOLUTIONS: Record<string, FieldNotesResolution> = {
  positioning: {
    headline:
      "Keep the next positioning decision close. Let evidence finish the comparison.",
    description:
      "The question you chose can keep moving: one buyer-language lens, one focused test, and a new essay only when it adds real weight.",
    cadence: [
      "A comparison worth testing",
      "Buyer language and choice",
      "One category decision",
    ],
  },
  "customer-experience": {
    headline:
      "Keep the next confidence decision close. Follow where the experience changes.",
    description:
      "The hesitation you noticed can become a useful trail: one experience lens, one focused test, and a new essay when fresh evidence earns attention.",
    cadence: [
      "A confidence gap to trace",
      "Promise beside experience",
      "One friction point to test",
    ],
  },
  "distinctive-brand": {
    headline:
      "Keep the next recognition decision close. Repeat the cue that travels.",
    description:
      "The recognition gap can keep sharpening: one distinctive-cue lens, one focused test, and a new essay when it strengthens memory.",
    cadence: [
      "A recognition gap to see",
      "Cues before the logo",
      "One signal to repeat",
    ],
  },
  "brand-messaging": {
    headline:
      "Keep the next messaging decision close. Sharpen the reason to choose.",
    description:
      "The language tension can keep working: one message-hierarchy lens, one focused test, and a new essay when it makes the choice clearer.",
    cadence: [
      "A choice reason to clarify",
      "Sales language and objections",
      "One claim to sharpen",
    ],
  },
  "brand-memory": {
    headline:
      "Keep the next memory decision close. Let repetition build recognition.",
    description:
      "The recall question can keep travelling: one repetition lens, one focused test, and a new essay when it helps the right cue stay.",
    cadence: [
      "A recall gap to inspect",
      "Repeated cues and reach",
      "One cue to reinforce",
    ],
  },
};

const ELEMENT_COLORS: Record<InsightElement, string> = {
  earth: "#D77A51",
  water: "#7FA4BA",
  fire: "#D7A84A",
  air: "#A8B68F",
  space: "#D09A89",
};

export function InsightsFieldNotesResolution({
  paths,
}: InsightsFieldNotesResolutionProps) {
  const [readerIntent, setReaderIntent] = useState<InsightsIntentDetail>();
  const prefersReducedMotion = useHydratedReducedMotion();

  useEffect(() => {
    function carryReaderIntent(event: Event) {
      setReaderIntent((event as CustomEvent<InsightsIntentDetail>).detail);
    }

    function releaseReaderIntent() {
      setReaderIntent(undefined);
    }

    window.addEventListener(INSIGHTS_INTENT_EVENT, carryReaderIntent);
    window.addEventListener(
      INSIGHTS_INTENT_CLEARED_EVENT,
      releaseReaderIntent,
    );
    setReaderIntent(readInsightsIntent());

    return () => {
      window.removeEventListener(INSIGHTS_INTENT_EVENT, carryReaderIntent);
      window.removeEventListener(
        INSIGHTS_INTENT_CLEARED_EVENT,
        releaseReaderIntent,
      );
    };
  }, []);

  const selectedPath = readerIntent
    ? paths.find((path) => path.slug === readerIntent.topicSlug)
    : undefined;
  const resolution = selectedPath
    ? (RESOLUTIONS[selectedPath.slug] ?? DEFAULT_RESOLUTION)
    : DEFAULT_RESOLUTION;
  const accent = selectedPath
    ? ELEMENT_COLORS[selectedPath.element]
    : ELEMENT_COLORS.fire;

  return (
    <div
      className="insights-notes-scene__composition"
      data-reader-thread={selectedPath ? "carried" : "open"}
      style={{ "--notes-path-color": accent } as CSSProperties}
    >
      <div className="insights-notes-scene__copy">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={selectedPath?.slug ?? "open"}
            className="insights-notes-scene__resolution"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, clipPath: "inset(0 12% 0 0)", x: 8 }
            }
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)", x: 0 }}
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, clipPath: "inset(0 0 0 12%)", x: -6 }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.34,
              ease: EASE_AIR,
            }}
          >
            <p className="insights-notes-scene__eyebrow text-xs font-semibold uppercase tracking-[0.22em] text-sandstone">
              {selectedPath ? (
                <ElementGlyph
                  slug={selectedPath.element}
                  className="h-5 w-5"
                  strokeWidth={1.35}
                />
              ) : null}
              <span>
                {selectedPath
                  ? `Your thread · ${selectedPath.name}`
                  : "Notes worth keeping"}
              </span>
            </p>
            <h2 className="insights-notes-scene__headline mt-4 max-w-2xl font-display text-display-md font-normal text-ivory">
              {resolution.headline}
            </h2>
            <p className="insights-notes-scene__description mt-5 max-w-xl text-base leading-7 text-ivory/75">
              {resolution.description}
            </p>
            <ol
              className="insights-notes-scene__cadence"
              aria-label="What each field note contains"
            >
              <li>
                <span>01</span>
                <strong>Question</strong>
                <small>{resolution.cadence[0]}</small>
              </li>
              <li>
                <span>02</span>
                <strong>Lens</strong>
                <small>{resolution.cadence[1]}</small>
              </li>
              <li>
                <span>03</span>
                <strong>Move</strong>
                <small>{resolution.cadence[2]}</small>
              </li>
            </ol>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="insights-notes-scene__form lg:min-w-96">
        <NewsletterForm readerPath={selectedPath?.slug} />
      </div>
    </div>
  );
}
