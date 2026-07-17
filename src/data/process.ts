export type ProcessStage = {
  stage: string;
  description: string;
  element: string; // loose association, not forced 1:1
};

export const process: ProcessStage[] = [
  {
    stage: "Listen",
    description:
      "Before any framework, I listen to how the business actually talks about itself, in founder conversations, existing content, even customer messages. The real voice is usually already there, buried under how it thinks it should sound.",
    element: "Air",
  },
  {
    stage: "Notice",
    description:
      "I look at what attention is actually doing around the brand right now: what gets read, what gets skipped, where the story stops making sense to someone outside the business.",
    element: "Fire",
  },
  {
    stage: "Ground",
    description:
      "Purpose, audience, and positioning get written down in plain language before anything else moves. If this step is rushed, everything built afterward has to compensate for it later.",
    element: "Earth",
  },
  {
    stage: "Shape",
    description:
      "Voice, messaging, and identity direction take form around that foundation, not before it.",
    element: "Water",
  },
  {
    stage: "Express",
    description:
      "The brand becomes real: website copy, content systems, campaign direction, built to be used, not filed away in a deck.",
    element: "Fire",
  },
  {
    stage: "Stay",
    description:
      "Recognition is built over months, not launched in one campaign. Where it's useful, I stay involved, reviewing what's working and adjusting what isn't.",
    element: "Space",
  },
];
