"use client";

import type { ReactNode } from "react";
import { publishInsightsIntent } from "@/lib/insights-intent";

type RelatedInsightIntentProps = {
  children: ReactNode;
  topicSlug: string;
  topicName: string;
};

export function RelatedInsightIntent({
  children,
  topicSlug,
  topicName,
}: RelatedInsightIntentProps) {
  return (
    <div
      className="h-full"
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
