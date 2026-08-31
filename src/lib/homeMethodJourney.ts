export const HOME_METHOD_DECISION_EVENT = "branding-tatva:home-method-decision";
export const HOME_METHOD_DECISION_STORAGE_KEY = "branding-tatva:home-method-decision:v1";

export const HOME_METHOD_STAGES = [
  "Question",
  "Decode",
  "Architect",
  "Signal",
  "Influence",
  "Compound",
] as const;

export type HomeMethodStage = (typeof HOME_METHOD_STAGES)[number];
export type HomeMethodDecisionOrigin = "path_entry" | "method_selection";

export type HomeMethodDecision = {
  index: number;
  stage: HomeMethodStage;
  origin: HomeMethodDecisionOrigin;
};

export type HomeMethodDecisionDetail = {
  decision: HomeMethodDecision | null;
};

function isDecision(value: unknown): value is HomeMethodDecision {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<HomeMethodDecision>;
  return (
    Number.isInteger(candidate.index) &&
    typeof candidate.index === "number" &&
    HOME_METHOD_STAGES[candidate.index] === candidate.stage &&
    (candidate.origin === "path_entry" || candidate.origin === "method_selection")
  );
}

export function readHomeMethodDecision(): HomeMethodDecision | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.sessionStorage.getItem(HOME_METHOD_DECISION_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isDecision(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function publishHomeMethodDecision(
  index: number,
  origin: HomeMethodDecisionOrigin,
) {
  if (typeof window === "undefined") return;
  const stage = HOME_METHOD_STAGES[index];
  if (!stage) return;
  const decision: HomeMethodDecision = { index, stage, origin };
  try {
    window.sessionStorage.setItem(
      HOME_METHOD_DECISION_STORAGE_KEY,
      JSON.stringify(decision),
    );
  } catch {}
  window.dispatchEvent(
    new CustomEvent<HomeMethodDecisionDetail>(HOME_METHOD_DECISION_EVENT, {
      detail: { decision },
    }),
  );
}

export function clearHomeMethodDecision() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(HOME_METHOD_DECISION_STORAGE_KEY);
  } catch {}
  window.dispatchEvent(
    new CustomEvent<HomeMethodDecisionDetail>(HOME_METHOD_DECISION_EVENT, {
      detail: { decision: null },
    }),
  );
}
