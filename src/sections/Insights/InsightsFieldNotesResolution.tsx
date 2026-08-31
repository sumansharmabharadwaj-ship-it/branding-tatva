"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
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
  evidenceHeadline: string;
  evidenceDescription: string;
  cadence: [string, string, string];
};

type InsightsFieldNotesResolutionProps = {
  paths: FieldNotesPath[];
};

const DEFAULT_RESOLUTION: FieldNotesResolution = {
  headline: "Occasional letters for the brand question currently on your desk.",
  description:
    "Each email examines a specific founder problem, shows the evidence or framework, and ends with a decision to test. Sent only when there is something worth reading.",
  evidenceHeadline:
    "You marked a brand problem. Future letters can help you investigate it.",
  evidenceDescription:
    "Your selected area stays attached to the signup so the reading can continue from the question you just marked.",
  cadence: [
    "A founder problem worth examining",
    "Evidence or a framework to use",
    "A decision to test in the business",
  ],
};

const RESOLUTIONS: Record<string, FieldNotesResolution> = {
  positioning: {
    headline:
      "When buyers compare on price, examine the comparison itself.",
    description:
      "Expect buyer language, category evidence, and a decision you can test before changing the offer or price.",
    evidenceHeadline:
      "You marked positioning as the comparison worth testing.",
    evidenceDescription:
      "Future letters can help compare buyer language, category choice, and the position the business can prove.",
    cadence: [
      "A comparison worth testing",
      "Buyer language and choice",
      "One category decision",
    ],
  },
  "customer-experience": {
    headline:
      "When buyers hesitate, follow the moment confidence changes.",
    description:
      "Expect a specific experience question, evidence from the handoff, and one friction point worth testing.",
    evidenceHeadline:
      "You marked experience as the place confidence may break.",
    evidenceDescription:
      "Future letters can help compare the promise buyers hear with the experience they actually receive.",
    cadence: [
      "A confidence gap to trace",
      "Promise beside experience",
      "One friction point to test",
    ],
  },
  "distinctive-brand": {
    headline:
      "When the brand looks interchangeable, test which cue buyers remember.",
    description:
      "Expect a recognition question, a cue to test without the logo, and evidence about what buyers remember.",
    evidenceHeadline:
      "You marked identity as the place recognition may fail.",
    evidenceDescription:
      "Future letters can help identify the colours, shapes, language, or behaviours worth repeating.",
    cadence: [
      "A recognition gap to see",
      "Cues before the logo",
      "One cue to repeat",
    ],
  },
  "brand-messaging": {
    headline:
      "When the founder explains value better than the website, inspect the message order.",
    description:
      "Expect sales language, recurring objections, and a claim you can test before rewriting every page.",
    evidenceHeadline:
      "You marked messaging as the claim worth testing.",
    evidenceDescription:
      "Future letters can help compare buyer language, recurring objections, and the strongest reason to choose.",
    cadence: [
      "A reason to choose",
      "Sales language and objections",
      "One claim to sharpen",
    ],
  },
  "brand-memory": {
    headline:
      "When publishing grows but recall stays weak, inspect what keeps changing.",
    description:
      "Expect a memory question, evidence about repeated cues, and a decision about what deserves to return.",
    evidenceHeadline:
      "You marked memory as the cue worth reinforcing.",
    evidenceDescription:
      "Future letters can help compare reach, repetition, and the cues buyers recall without prompting.",
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
  const isEvidenceThread = readerIntent?.origin === "evidence-ledger";
  const readerThreadState = isEvidenceThread
    ? "evidence"
    : selectedPath
      ? "carried"
      : "open";
  const readerThreadLabel = isEvidenceThread
    ? `Worksheet topic · ${readerIntent.label}`
    : selectedPath
      ? `Selected topic · ${selectedPath.name}`
      : "Occasional letters";
  const resolvedHeadline = isEvidenceThread
    ? resolution.evidenceHeadline
    : resolution.headline;
  const resolvedDescription = isEvidenceThread
    ? resolution.evidenceDescription
    : resolution.description;

  return (
    <div
      className="insights-notes-scene__composition"
      data-reader-thread={readerThreadState}
      data-evidence-thread={isEvidenceThread}
      style={{ "--notes-path-color": accent } as CSSProperties}
    >
      <div className="insights-notes-scene__copy">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={`${readerIntent?.origin ?? "open"}-${
              readerIntent?.label ?? selectedPath?.slug ?? "open"
            }`}
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
              <span>{readerThreadLabel}</span>
            </p>
            <h2 className="insights-notes-scene__headline mt-4 max-w-2xl font-display text-display-md font-normal text-ivory">
              {resolvedHeadline}
            </h2>
            <p className="insights-notes-scene__description mt-5 max-w-xl text-base leading-7 text-ivory/75">
              {resolvedDescription}
            </p>
            <ol
              className="insights-notes-scene__cadence"
              aria-label="What each letter contains"
            >
              <li>
                <span>01</span>
                <strong>Problem</strong>
                <small>{resolution.cadence[0]}</small>
              </li>
              <li>
                <span>02</span>
                <strong>Evidence</strong>
                <small>{resolution.cadence[1]}</small>
              </li>
              <li>
                <span>03</span>
                <strong>Decision</strong>
                <small>{resolution.cadence[2]}</small>
              </li>
            </ol>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="insights-notes-scene__form lg:min-w-96">
        <AnimatePresence initial={false}>
          {isEvidenceThread && selectedPath ? (
            <motion.div
              key={`${selectedPath.slug}-evidence-secured`}
              className="insights-notes-scene__secured"
              role="status"
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, clipPath: "inset(0 100% 0 0)", x: -10 }
              }
              animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)", x: 0 }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, clipPath: "inset(0 0 0 100%)", x: 8 }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.42,
                ease: EASE_AIR,
              }}
            >
              <ElementGlyph
                slug={selectedPath.element}
                className="h-5 w-5"
                strokeWidth={1.35}
              />
              <span>
                <small>Topic saved</small>
                <strong>{selectedPath.name} will stay attached to this request.</strong>
              </span>
              <Check aria-hidden="true" />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <NewsletterForm
          readerPath={selectedPath?.slug}
          readerOrigin={readerIntent?.origin}
          readerLabel={readerIntent?.label ?? selectedPath?.name}
          readerPathName={selectedPath?.name}
        />
      </div>
    </div>
  );
}
