export type ProcessStage = {
  stage: string;
  description: string;
  element: string; // loose association, not forced 1:1
  // Per-stage backdrop for the pinned desktop treatment (PinnedJourney) —
  // each stage gets its own short atmospheric loop instead of all six
  // sharing one backdrop, so the background itself changes as you scroll
  // through the process, not just the foreground text. VerticalJourney
  // (mobile/reduced-motion fallback) keeps a single shared backdrop —
  // six autoplaying videos in a plain scrolling list isn't worth the
  // mobile data cost for a section without the pinned scroll payoff.
  video?: string;
  poster?: string;
};

// Stage names renamed from a first pass (Listen/Notice/Ground/Shape/
// Express/Stay) that read as workflow steps rather than strategic
// thinking — direct feedback that the site "needs opinions" and should
// sound like branding thinking, not a project-management checklist.
// Same six real activities underneath, sharper verbs and descriptions.
export const process: ProcessStage[] = [
  {
    stage: "Question",
    description:
      "We begin with what the business believes, what buyers currently hear, and where those two accounts disagree. The useful position is often hidden beneath language borrowed from the category.",
    element: "Air",
    video: "/videos/higgsfield-process-listen.mp4",
    poster: "/images/higgsfield-process-listen-poster.jpg",
  },
  {
    stage: "Decode",
    description:
      "We study what buyers notice, skip, misunderstand, and repeat. Customer language, sales friction, and competitor patterns matter more than personal preference.",
    element: "Fire",
    video: "/videos/higgsfield-process-notice.mp4",
    poster: "/images/higgsfield-process-notice-poster.jpg",
  },
  {
    stage: "Architect",
    description:
      "We decide the category, priority buyer, value, and reason to believe. Those choices govern the name, message, identity, website, and content that follow.",
    element: "Earth",
    video: "/videos/higgsfield-process-ground.mp4",
    poster: "/images/higgsfield-process-ground-poster.jpg",
  },
  {
    stage: "Express",
    description:
      "Voice, messaging, and creative direction turn the position into words and forms buyers can recognise across different encounters.",
    element: "Water",
    video: "/videos/higgsfield-process-shape.mp4",
    poster: "/images/higgsfield-process-shape-poster.jpg",
  },
  {
    stage: "Apply",
    description:
      "The decisions move into the website, content, campaigns, proposals, and sales material. A strategy earns its value in use, not in the presentation where it was approved.",
    element: "Fire",
    video: "/videos/higgsfield-process-express.mp4",
    poster: "/images/higgsfield-process-express-poster.jpg",
  },
  {
    stage: "Repeat",
    description:
      "The brand repeats the same valuable meaning without repeating the same execution. Recognition grows after the launch, while most businesses have already moved on to a new idea.",
    element: "Space",
    video: "/videos/higgsfield-process-stay.mp4",
    poster: "/images/higgsfield-process-stay-poster.jpg",
  },
];
