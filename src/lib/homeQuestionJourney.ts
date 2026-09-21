import {
  isHomeStudioLens,
  type HomeStudioLens,
} from "@/lib/homeStudioJourney";

export const HOME_QUESTION_CHOICE_EVENT = "branding-tatva:home-question-choice";
export const HOME_QUESTION_CHOICE_STORAGE_KEY = "branding-tatva:home-question-choice:v1";

export type HomeQuestionChoice = {
  id: string;
  label: string;
  question: string;
  lens: HomeStudioLens | null;
};

export type HomeQuestionChoiceDetail = {
  choice: HomeQuestionChoice | null;
};

function isHomeQuestionChoice(value: unknown): value is HomeQuestionChoice {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<HomeQuestionChoice>;
  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.label === "string" &&
    candidate.label.length > 0 &&
    typeof candidate.question === "string" &&
    candidate.question.length > 0 &&
    (candidate.lens === null || isHomeStudioLens(candidate.lens))
  );
}

export function readHomeQuestionChoice(): HomeQuestionChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.sessionStorage.getItem(HOME_QUESTION_CHOICE_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isHomeQuestionChoice(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function publishHomeQuestionChoice(choice: HomeQuestionChoice | null) {
  if (typeof window === "undefined") return;
  try {
    if (choice) {
      window.sessionStorage.setItem(
        HOME_QUESTION_CHOICE_STORAGE_KEY,
        JSON.stringify(choice),
      );
    } else {
      window.sessionStorage.removeItem(HOME_QUESTION_CHOICE_STORAGE_KEY);
    }
  } catch {}
  window.dispatchEvent(
    new CustomEvent<HomeQuestionChoiceDetail>(HOME_QUESTION_CHOICE_EVENT, {
      detail: { choice },
    }),
  );
}
