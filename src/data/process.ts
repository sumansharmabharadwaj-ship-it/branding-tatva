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
      "Before any framework: what does this business actually believe, and where does its own language contradict it? The real position is usually already there, buried under how it thinks it should sound.",
    element: "Air",
    video: "/videos/higgsfield-process-listen.mp4",
    poster: "/images/higgsfield-process-listen-poster.jpg",
  },
  {
    stage: "Decode",
    description:
      "What attention is actually doing right now — what gets read, what gets skipped, where the story stops making sense to someone outside the business. Not opinion. Pattern.",
    element: "Fire",
    video: "/videos/higgsfield-process-notice.mp4",
    poster: "/images/higgsfield-process-notice-poster.jpg",
  },
  {
    stage: "Architect",
    description:
      "Purpose, audience, and category get committed to language before anything else moves. Everything built after this step either compounds it or fights it.",
    element: "Earth",
    video: "/videos/higgsfield-process-ground.mp4",
    poster: "/images/higgsfield-process-ground-poster.jpg",
  },
  {
    stage: "Signal",
    description:
      "Voice, identity, and messaging take the shape the architecture demands — never invented first, always built on what Architect already decided.",
    element: "Water",
    video: "/videos/higgsfield-process-shape.mp4",
    poster: "/images/higgsfield-process-shape-poster.jpg",
  },
  {
    stage: "Influence",
    description:
      "The brand becomes something people actually encounter: the site, the content, the campaign. Strategy that never reaches an audience isn't strategy. It's a deck.",
    element: "Fire",
    video: "/videos/higgsfield-process-express.mp4",
    poster: "/images/higgsfield-process-express-poster.jpg",
  },
  {
    stage: "Compound",
    description:
      "Recognition isn't won once. It accrues, or it doesn't, in the months after the campaign ends — usually exactly where most brands stop paying attention.",
    element: "Space",
    video: "/videos/higgsfield-process-stay.mp4",
    poster: "/images/higgsfield-process-stay-poster.jpg",
  },
];
