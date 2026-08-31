"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { InsightElement } from "@/data/insights";
import {
  INSIGHTS_INTENT_CLEARED_EVENT,
  INSIGHTS_INTENT_EVENT,
  readInsightsIntent,
  type InsightsIntentDetail,
} from "@/lib/insights-intent";

export type InsightsFooterPath = {
  slug: string;
  name: string;
  element: InsightElement;
  service: {
    slug: string;
    name: string;
  };
};

type FooterResolution = {
  headline: string;
  description: string;
};

const DEFAULT_RESOLUTION: FooterResolution = {
  headline:
    "Keep reading, or bring the unresolved question into a brand diagnosis.",
  description:
    "Use the essays to investigate alone. Bring the question to Suman when another article will only add more input.",
};

const RESOLUTIONS: Record<string, FooterResolution> = {
  positioning: {
    headline:
      "Keep testing the comparison, or discuss the category decision with Suman.",
    description:
      "Stay with the positioning evidence, or ask Suman which market frame is worth committing to.",
  },
  "customer-experience": {
    headline:
      "Keep tracing the hesitation, or discuss the confidence gap with Suman.",
    description:
      "Stay with the experience evidence, or ask Suman where promise and delivery begin to disagree.",
  },
  "distinctive-brand": {
    headline:
      "Keep studying the cue, or discuss the recognition decision with Suman.",
    description:
      "Stay with the distinctiveness evidence, or ask Suman which cues deserve repetition.",
  },
  "brand-messaging": {
    headline:
      "Keep testing the claim, or discuss the message decision with Suman.",
    description:
      "Stay with the messaging evidence, or ask Suman to test the reason to choose before rewriting the page.",
  },
  "brand-memory": {
    headline:
      "Keep following the repeated cue, or discuss the memory decision with Suman.",
    description:
      "Stay with the recall evidence, or ask Suman what the brand should repeat with discipline.",
  },
};

const ELEMENT_COLORS: Record<InsightElement, string> = {
  earth: "#D77A51",
  water: "#7FA4BA",
  fire: "#D7A84A",
  air: "#A8B68F",
  space: "#D09A89",
};

export function InsightsFooterInvitation({
  paths,
}: {
  paths: InsightsFooterPath[];
}) {
  const [readerIntent, setReaderIntent] = useState<InsightsIntentDetail>();

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
      className="insights-footer-invitation"
      data-reader-thread={selectedPath ? "carried" : "open"}
      style={{ "--insights-footer-accent": accent } as CSSProperties}
    >
      <p className="insights-footer-invitation__eyebrow">
        {selectedPath ? (
          <ElementGlyph
            slug={selectedPath.element}
            className="h-5 w-5"
            strokeWidth={1.35}
          />
        ) : null}
        <span>
          {selectedPath
            ? `Selected topic · ${selectedPath.name}`
            : "Choose your route"}
        </span>
      </p>
      <h2>{resolution.headline}</h2>
      <p className="insights-footer-invitation__description">
        {resolution.description}
      </p>
      <nav
        className="insights-footer-invitation__routes"
        aria-label="Continue from Insights"
      >
        <Link
          href={
            selectedPath ? `/insights/topic/${selectedPath.slug}` : "/insights"
          }
        >
          {selectedPath
            ? `Keep reading ${selectedPath.name}`
            : "Return to the library"}
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link
          href={
            selectedPath
              ? `/services#package-${selectedPath.service.slug}`
              : "/services"
          }
        >
          {selectedPath
            ? `See where ${selectedPath.service.name} fits`
            : "Compare brand engagements"}
          <ArrowRight aria-hidden="true" />
        </Link>
      </nav>
    </div>
  );
}
