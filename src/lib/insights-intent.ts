export const INSIGHTS_INTENT_EVENT = "branding-tatva:insights-intent";

export type InsightsIntentOrigin = "decision-mirror" | "knowledge-atlas";

export type InsightsIntentDetail = {
  topicSlug: string;
  query: string;
  label: string;
  origin: InsightsIntentOrigin;
};

export function publishInsightsIntent(detail: InsightsIntentDetail) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<InsightsIntentDetail>(INSIGHTS_INTENT_EVENT, { detail }),
  );
}
