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
  // 768 wide same framing derivative, listed as the FIRST <source> behind
  // a narrow screen media query so phones never pull the desktop encode.
  videoMobile?: string;
  poster?: string;
};

// Stage names renamed from a first pass (Listen/Notice/Ground/Shape/
// Express/Stay) that read as workflow steps rather than strategic
// thinking — direct feedback that the site "needs opinions" and should
// sound like branding thinking, not a project-management checklist.
// Same six real activities underneath, sharper verbs and descriptions.
//
// Backdrops are wave two of the footage re-foundation (contact sheet 02,
// Suman-approved): one pollination world at macro scale, one moment per
// stage, all through the shared warm house grade. Two slots stepped up
// to their ranked alternates at the fetch gate, per the review
// framework's own rule (a reserve/alternate exists for exactly this):
// Question's recommended source was 720p only, Architect's was portrait
// 1080 wide (a landscape crop lands under 1080p). The Pexels sources:
// question 37955522 (4K portrait, centre cropped to 1080p landscape),
// decode 34616980, architect 20606665, signal 7234901, influence
// 16590272, compound 6514284 (trimmed to 16s for weight).
export const process: ProcessStage[] = [
  {
    stage: "Question",
    description:
      "Before any framework: what does this business actually believe, and where does its own language contradict it? The real position is usually already there, buried under how it thinks it should sound.",
    element: "Air",
    video: "/videos/bt-home-process-question.mp4",
    videoMobile: "/videos/bt-home-process-question-mobile.mp4",
    poster: "/images/bt-home-process-question-poster.jpg",
  },
  {
    stage: "Decode",
    description:
      "What attention is actually doing right now: what gets read, what gets skipped, where the story stops making sense to someone outside the business. Pattern, always, over opinion.",
    element: "Fire",
    video: "/videos/bt-home-process-decode.mp4",
    videoMobile: "/videos/bt-home-process-decode-mobile.mp4",
    poster: "/images/bt-home-process-decode-poster.jpg",
  },
  {
    stage: "Architect",
    description:
      "Purpose, audience, and category get committed to language, the brand's own architecture, before anything else moves. Everything built after this step either compounds it or fights it.",
    element: "Earth",
    video: "/videos/bt-home-process-architect.mp4",
    videoMobile: "/videos/bt-home-process-architect-mobile.mp4",
    poster: "/images/bt-home-process-architect-poster.jpg",
  },
  {
    stage: "Signal",
    description:
      "Voice, identity, and messaging take the shape the architecture demands, always built on what Architect already decided, always after it.",
    element: "Water",
    video: "/videos/bt-home-process-signal.mp4",
    videoMobile: "/videos/bt-home-process-signal-mobile.mp4",
    poster: "/images/bt-home-process-signal-poster.jpg",
  },
  {
    stage: "Influence",
    description:
      "The brand becomes something people actually encounter: the site, the content, the campaign. Strategy only counts once it reaches an audience. Anything short of that stays a deck.",
    element: "Fire",
    video: "/videos/bt-home-process-influence.mp4",
    videoMobile: "/videos/bt-home-process-influence-mobile.mp4",
    poster: "/images/bt-home-process-influence-poster.jpg",
  },
  {
    stage: "Compound",
    description:
      "Recognition accrues gradually across the months after a campaign ends, exactly where most brands already stopped paying attention.",
    element: "Space",
    video: "/videos/bt-home-process-compound.mp4",
    videoMobile: "/videos/bt-home-process-compound-mobile.mp4",
    poster: "/images/bt-home-process-compound-poster.jpg",
  },
];
