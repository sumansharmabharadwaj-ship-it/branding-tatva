"use client";

import type { ReactNode } from "react";
import { publishInsightsIntent } from "@/lib/insights-intent";

type RelatedInsightIntentProps = {
  children: ReactNode;
  position: number;
  topicSlug: string;
  topicName: string;
};

export function RelatedInsightIntent({
  children,
  position,
  topicSlug,
  topicName,
}: RelatedInsightIntentProps) {
  return (
    <div
      className="insight-related-intent h-full"
      data-related-position={position}
      onClick={() => {
        publishInsightsIntent({
          topicSlug,
          query: "",
          label: topicName,
          origin: "insights-article",
        });
      }}
    >
      {children}
    </div>
  );
}
