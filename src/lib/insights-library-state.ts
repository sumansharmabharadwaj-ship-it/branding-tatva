const INSIGHTS_LIBRARY_STATE_KEY = "branding-tatva:insights-library-state";
const INSIGHTS_LIBRARY_STATE_MAX_AGE = 30 * 60 * 1000;

export type InsightsLibraryState = {
  query: string;
  topicSlug: string;
  folio: number;
  mobileCardIndex?: number;
};

type StoredInsightsLibraryState = {
  state: InsightsLibraryState;
  storedAt: number;
  version: 1;
};

function isInsightsLibraryState(
  value: unknown,
): value is InsightsLibraryState {
  if (!value || typeof value !== "object") return false;

  const state = value as Partial<InsightsLibraryState>;
  return (
    typeof state.query === "string" &&
    state.query.length <= 240 &&
    typeof state.topicSlug === "string" &&
    state.topicSlug.length <= 80 &&
    typeof state.folio === "number" &&
    Number.isInteger(state.folio) &&
    state.folio >= 0 &&
    state.folio <= 99 &&
    (state.mobileCardIndex === undefined ||
      (typeof state.mobileCardIndex === "number" &&
        Number.isInteger(state.mobileCardIndex) &&
        state.mobileCardIndex >= 0 &&
        state.mobileCardIndex <= 2))
  );
}

export function clearInsightsLibraryState() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(INSIGHTS_LIBRARY_STATE_KEY);
  } catch {
    // Storage can be unavailable in strict privacy modes. A missing return
    // trail should never block the library itself.
  }
}

export function readInsightsLibraryState() {
  if (typeof window === "undefined") return undefined;

  try {
    const storedValue = window.sessionStorage.getItem(
      INSIGHTS_LIBRARY_STATE_KEY,
    );
    if (!storedValue) return undefined;

    const stored = JSON.parse(
      storedValue,
    ) as Partial<StoredInsightsLibraryState>;
    const isFresh =
      typeof stored.storedAt === "number" &&
      Date.now() - stored.storedAt <= INSIGHTS_LIBRARY_STATE_MAX_AGE;

    if (
      stored.version !== 1 ||
      !isFresh ||
      !isInsightsLibraryState(stored.state)
    ) {
      clearInsightsLibraryState();
      return undefined;
    }

    return stored.state;
  } catch {
    clearInsightsLibraryState();
    return undefined;
  }
}

export function writeInsightsLibraryState(state: InsightsLibraryState) {
  if (typeof window === "undefined") return;

  try {
    const stored: StoredInsightsLibraryState = {
      state,
      storedAt: Date.now(),
      version: 1,
    };
    window.sessionStorage.setItem(
      INSIGHTS_LIBRARY_STATE_KEY,
      JSON.stringify(stored),
    );
  } catch {
    // Storage failures should not affect filtering or folio navigation.
  }
}
