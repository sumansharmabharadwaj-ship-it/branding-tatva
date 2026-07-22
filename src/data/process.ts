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

export const process: ProcessStage[] = [
  {
    stage: "Listen",
    description:
      "Before any framework, I listen to how the business actually talks about itself, in founder conversations, existing content, even customer messages. The real voice is usually already there, buried under how it thinks it should sound.",
    element: "Air",
    video: "/videos/higgsfield-process-listen.mp4",
    poster: "/images/higgsfield-process-listen-poster.jpg",
  },
  {
    stage: "Notice",
    description:
      "I look at what attention is actually doing around the brand right now: what gets read, what gets skipped, where the story stops making sense to someone outside the business.",
    element: "Fire",
    video: "/videos/higgsfield-process-notice.mp4",
    poster: "/images/higgsfield-process-notice-poster.jpg",
  },
  {
    stage: "Ground",
    description:
      "Purpose, audience, and positioning get written down in plain language before anything else moves. If this step is rushed, everything built afterward has to compensate for it later.",
    element: "Earth",
    video: "/videos/higgsfield-process-ground.mp4",
    poster: "/images/higgsfield-process-ground-poster.jpg",
  },
  {
    stage: "Shape",
    description:
      "Voice, messaging, and identity direction take form around that foundation, after it, always in that order.",
    element: "Water",
    video: "/videos/higgsfield-process-shape.mp4",
    poster: "/images/higgsfield-process-shape-poster.jpg",
  },
  {
    stage: "Express",
    description:
      "The brand becomes real: website copy, content systems, campaign direction, built to be used rather than filed away in a deck.",
    element: "Fire",
    video: "/videos/higgsfield-process-express.mp4",
    poster: "/images/higgsfield-process-express-poster.jpg",
  },
  {
    stage: "Stay",
    description:
      "Recognition is built over months, through steady attention rather than a single campaign. Where it's useful, I stay involved, reviewing what's working and adjusting the rest.",
    element: "Space",
    video: "/videos/higgsfield-process-stay.mp4",
    poster: "/images/higgsfield-process-stay-poster.jpg",
  },
];
