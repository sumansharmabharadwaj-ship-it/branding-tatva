export type HomeDiagnosis = "recognition" | "coherence" | "demand";
export type CompletedHomeDiagnosis = HomeDiagnosis | "mixed";

export type HomeDiagnosticState = {
  step: number;
  answers: Array<HomeDiagnosis | null>;
  selections: Array<number | null>;
  resultVisible: boolean;
  result: CompletedHomeDiagnosis | null;
  preview: number | null;
};

export type HomeDiagnosticAction =
  | { type: "choose"; step: number; answer: HomeDiagnosis; selection: number }
  | { type: "continue" }
  | { type: "back" }
  | { type: "complete"; answers: Array<HomeDiagnosis | null> }
  | { type: "review"; step?: number }
  | { type: "preview"; selection: number | null }
  | { type: "reset" };

export const HOME_DIAGNOSTIC_QUESTION_COUNT = 3;

export const initialHomeDiagnosticState: HomeDiagnosticState = {
  step: 0,
  answers: Array(HOME_DIAGNOSTIC_QUESTION_COUNT).fill(null),
  selections: Array(HOME_DIAGNOSTIC_QUESTION_COUNT).fill(null),
  resultVisible: false,
  result: null,
  preview: null,
};

export function resolveCompletedHomeDiagnosis(
  answers: Array<HomeDiagnosis | null>,
): CompletedHomeDiagnosis | null {
  if (
    answers.length !== HOME_DIAGNOSTIC_QUESTION_COUNT ||
    answers.some((answer) => answer === null)
  ) {
    return null;
  }

  const score: Record<HomeDiagnosis, number> = {
    recognition: 0,
    coherence: 0,
    demand: 0,
  };
  answers.forEach((answer) => {
    if (answer) score[answer] += 1;
  });
  const entries = Object.entries(score) as Array<[HomeDiagnosis, number]>;
  const highest = Math.max(...entries.map(([, value]) => value));
  const winners = entries.filter(([, value]) => value === highest);
  return winners.length === 1 ? winners[0][0] : "mixed";
}

export function homeDiagnosticReducer(
  state: HomeDiagnosticState,
  action: HomeDiagnosticAction,
): HomeDiagnosticState {
  if (action.type === "choose") {
    const answers = [...state.answers];
    const selections = [...state.selections];
    answers[action.step] = action.answer;
    selections[action.step] = action.selection;
    return {
      ...state,
      answers,
      selections,
      resultVisible: false,
      result: null,
      preview: null,
    };
  }

  if (action.type === "continue") {
    if (state.selections[state.step] === null) return state;
    return {
      ...state,
      step: Math.min(state.step + 1, HOME_DIAGNOSTIC_QUESTION_COUNT - 1),
      preview: null,
    };
  }

  if (action.type === "back") {
    return { ...state, step: Math.max(0, state.step - 1), preview: null };
  }

  if (action.type === "complete") {
    const result = resolveCompletedHomeDiagnosis(action.answers);
    if (!result) return state;
    return {
      ...state,
      answers: [...action.answers],
      resultVisible: true,
      result,
      preview: null,
    };
  }

  if (action.type === "review") {
    // A review can reopen one specific question (the result screen's answer
    // trace names each one); without a target it reopens the last question.
    const target =
      action.step === undefined
        ? HOME_DIAGNOSTIC_QUESTION_COUNT - 1
        : Math.min(Math.max(0, action.step), HOME_DIAGNOSTIC_QUESTION_COUNT - 1);
    return {
      ...state,
      step: target,
      resultVisible: false,
      result: null,
      preview: null,
    };
  }

  if (action.type === "preview") {
    return { ...state, preview: action.selection };
  }

  return initialHomeDiagnosticState;
}
