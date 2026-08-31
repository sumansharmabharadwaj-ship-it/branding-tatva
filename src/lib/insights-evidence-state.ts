import type { InsightsIntentDetail } from "@/lib/insights-intent";

const INSIGHTS_EVIDENCE_STATE_KEY = "branding-tatva:insights-evidence-state";
const INSIGHTS_EVIDENCE_STATE_MAX_AGE = 30 * 60 * 1000;

export type InsightsEvidenceState = {
  markedSlugs: string[];
  focusedSlug: string;
  priorIntent?: InsightsIntentDetail;
};

type StoredInsightsEvidenceState = {
  state: InsightsEvidenceState;
  storedAt: number;
  version: 1;
};

function isInsightsIntentDetail(
  value: unknown,
): value is InsightsIntentDetail {
  if (!value || typeof value !== "object") return false;

  const detail = value as Partial<InsightsIntentDetail>;
  return (
    typeof detail.topicSlug === "string" &&
    detail.topicSlug.length <= 80 &&
    typeof detail.query === "string" &&
    detail.query.length <= 240 &&
    typeof detail.label === "string" &&
    detail.label.length <= 160 &&
    (detail.origin === "decision-mirror" ||
      detail.origin === "knowledge-atlas" ||
      detail.origin === "insights-library" ||
      detail.origin === "insights-article")
  );
}

function isInsightsEvidenceState(
  value: unknown,
): value is InsightsEvidenceState {
  if (!value || typeof value !== "object") return false;

  const state = value as Partial<InsightsEvidenceState>;
  const markedSlugs = state.markedSlugs;
  return (
    Array.isArray(markedSlugs) &&
    markedSlugs.length > 0 &&
    markedSlugs.length <= 12 &&
    markedSlugs.every(
      (slug) =>
        typeof slug === "string" && slug.length > 0 && slug.length <= 80,
    ) &&
    new Set(markedSlugs).size === markedSlugs.length &&
    typeof state.focusedSlug === "string" &&
    state.focusedSlug.length > 0 &&
    state.focusedSlug.length <= 80 &&
    (state.priorIntent === undefined ||
      isInsightsIntentDetail(state.priorIntent))
  );
}

export function clearInsightsEvidenceState() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(INSIGHTS_EVIDENCE_STATE_KEY);
  } catch {
    // A missing return trail must never block the evidence interaction.
  }
}

export function readInsightsEvidenceState() {
  if (typeof window === "undefined") return undefined;

  try {
    const storedValue = window.sessionStorage.getItem(
      INSIGHTS_EVIDENCE_STATE_KEY,
    );
    if (!storedValue) return undefined;

    const stored = JSON.parse(
      storedValue,
    ) as Partial<StoredInsightsEvidenceState>;
    const isFresh =
      typeof stored.storedAt === "number" &&
      Date.now() - stored.storedAt <= INSIGHTS_EVIDENCE_STATE_MAX_AGE;

    if (
      stored.version !== 1 ||
      !isFresh ||
      !isInsightsEvidenceState(stored.state)
    ) {
      clearInsightsEvidenceState();
      return undefined;
    }

    return stored.state;
  } catch {
    clearInsightsEvidenceState();
    return undefined;
  }
}

export function writeInsightsEvidenceState(state: InsightsEvidenceState) {
  if (typeof window === "undefined") return;

  try {
    const stored: StoredInsightsEvidenceState = {
      state,
      storedAt: Date.now(),
      version: 1,
    };
    window.sessionStorage.setItem(
      INSIGHTS_EVIDENCE_STATE_KEY,
      JSON.stringify(stored),
    );
  } catch {
    // Storage failures should not affect the live evidence route.
  }
}
