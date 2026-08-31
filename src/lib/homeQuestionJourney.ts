export const HOME_QUESTION_CHOICE_EVENT = "branding-tatva:home-question-choice";

export type HomeQuestionChoice = {
  id: string;
  label: string;
  question: string;
};

export type HomeQuestionChoiceDetail = {
  choice: HomeQuestionChoice | null;
};

export function publishHomeQuestionChoice(choice: HomeQuestionChoice | null) {
  window.dispatchEvent(
    new CustomEvent<HomeQuestionChoiceDetail>(HOME_QUESTION_CHOICE_EVENT, {
      detail: { choice },
    }),
  );
}
