export const INSIGHTS_INTENT_EVENT = "branding-tatva:insights-intent";
const INSIGHTS_INTENT_STORAGE_KEY = "branding-tatva:insights-reader-trail";
const INSIGHTS_INTENT_MAX_AGE = 30 * 60 * 1000;

export type InsightsIntentOrigin = "decision-mirror" | "knowledge-atlas";

export type InsightsIntentDetail = {
  topicSlug: string;
  query: string;
  label: string;
  origin: InsightsIntentOrigin;
};

type StoredInsightsIntent = {
  detail: InsightsIntentDetail;
  storedAt: number;
  version: 1;
};

function isInsightsIntentDetail(value: unknown): value is InsightsIntentDetail {
  if (!value || typeof value !== "object") return false;

  const detail = value as Partial<InsightsIntentDetail>;
  return (
    typeof detail.topicSlug === "string" &&
    typeof detail.query === "string" &&
    typeof detail.label === "string" &&
    (detail.origin === "decision-mirror" || detail.origin === "knowledge-atlas")
  );
}

export function clearInsightsIntent() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(INSIGHTS_INTENT_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in strict privacy modes. The live event still
    // keeps the current page journey connected.
  }
}

export function readInsightsIntent() {
  if (typeof window === "undefined") return undefined;

  try {
    const storedValue = window.sessionStorage.getItem(
      INSIGHTS_INTENT_STORAGE_KEY,
    );
    if (!storedValue) return undefined;

    const stored = JSON.parse(storedValue) as Partial<StoredInsightsIntent>;
    const isFresh =
      typeof stored.storedAt === "number" &&
      Date.now() - stored.storedAt <= INSIGHTS_INTENT_MAX_AGE;

    if (stored.version !== 1 || !isFresh || !isInsightsIntentDetail(stored.detail)) {
      clearInsightsIntent();
      return undefined;
    }

    return stored.detail;
  } catch {
    clearInsightsIntent();
    return undefined;
  }
}

export function publishInsightsIntent(detail: InsightsIntentDetail) {
  if (typeof window === "undefined") return;

  try {
    const stored: StoredInsightsIntent = {
      detail,
      storedAt: Date.now(),
      version: 1,
    };
    window.sessionStorage.setItem(
      INSIGHTS_INTENT_STORAGE_KEY,
      JSON.stringify(stored),
    );
  } catch {
    // A storage failure should never block the current-page interaction.
  }

  window.dispatchEvent(
    new CustomEvent<InsightsIntentDetail>(INSIGHTS_INTENT_EVENT, { detail }),
  );
}
