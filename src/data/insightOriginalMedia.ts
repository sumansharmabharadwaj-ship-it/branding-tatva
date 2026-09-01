type InsightOriginalMedia = {
  poster: string;
  video: string;
  alt: string;
};

const MEDIA_ROOT = "/images/generated/insights-v2";
const VIDEO_ROOT = "/videos/generated/insights-v2";
const TOPIC_MEDIA_ROOT = "/images/generated/insights-v3";
const TOPIC_VIDEO_ROOT = "/videos/generated/insights-v3";

function media(slug: string, alt: string): InsightOriginalMedia {
  return {
    poster: `${MEDIA_ROOT}/${slug}.webp`,
    video: `${VIDEO_ROOT}/${slug}.mp4`,
    alt,
  };
}

function topicMedia(slug: string, alt: string): InsightOriginalMedia {
  return {
    poster: `${TOPIC_MEDIA_ROOT}/${slug}.webp`,
    video: `${TOPIC_VIDEO_ROOT}/${slug}.mp4`,
    alt,
  };
}

export const insightOriginalMedia: Record<string, InsightOriginalMedia> = {
  "brand-positioning-strategy-service-businesses": topicMedia(
    "positioning-strategy-five-decision-spine",
    "Three possible category frames narrowed into customer tension, distinctive choice, proof, and one memorable position",
  ),
  "brand-audit-checklist-before-rebrand": topicMedia(
    "brand-audit-signal-fracture-diagnosis",
    "A brand signal passing through five inspection gates with two fractures diagnosed before a sealed rebrand begins",
  ),
  "brand-awareness-vs-brand-recall": topicMedia(
    "awareness-versus-recall-memory-test",
    "Repeated brand cues on one side and the same cue retrieved unaided from memory on the other",
  ),
  "brand-messaging-framework": topicMedia(
    "messaging-framework-five-part-system",
    "One positioning foundation feeding five message roles across several customer touchpoints",
  ),
  "five-element-brand-strategy-framework": topicMedia(
    "five-element-brand-ecosystem",
    "Earth, water, fire, air, and space connected as one living brand strategy system",
  ),
  "website-messaging-hierarchy-service-businesses": topicMedia(
    "website-message-reader-sequence",
    "Five website message stages guiding a reader from orientation through proof to one clear action",
  ),
  "distinctive-brand-assets-audit": topicMedia(
    "distinctive-assets-attribution-test",
    "A blind attribution test selecting two recognisable brand cues that survive across four formats",
  ),
  "customer-journey-mapping-service-businesses": topicMedia(
    "customer-journey-transition-map",
    "Six customer journey stages connected by one indigo thread, with a frayed handoff revealing where confidence falls",
  ),
  "how-to-position-a-consulting-business": topicMedia(
    "consulting-position-focus-and-expansion",
    "One focused consulting position anchoring a broad fan of connected service capabilities",
  ),
  "measure-brand-recall-limited-budget": topicMedia(
    "budget-recall-three-round-test",
    "A three round recall test exposing brand cues, hiding them for unaided retrieval, then tallying one remembered cue",
  ),
  "value-proposition-vs-positioning-vs-tagline": topicMedia(
    "positioning-value-tagline-hierarchy",
    "A walnut positioning foundation supporting a terracotta value proposition and concise brass tagline plate",
  ),
  "brand-consistency-checklist-service-businesses": topicMedia(
    "brand-consistency-touchpoint-chain",
    "Five different customer touchpoints carrying one recognisable promise through the full journey",
  ),
  "why-beautiful-brand-identity-can-be-forgettable": topicMedia(
    "beautiful-identity-without-memory-cue",
    "Four beautiful but anonymous identity fragments compared with one recognisable cue repeated across four practical formats",
  ),
  "find-real-differentiator-crowded-service-market": topicMedia(
    "differentiator-choice-to-consequence",
    "One operational choice changing the customer consequence and producing visible proof",
  ),
  "brand-positioning-statement-examples-why-generic": topicMedia(
    "positioning-statement-specificity-filter",
    "Five specificity filters removing interchangeable claims before one precise positioning choice locks into a decision frame",
  ),
  "reposition-established-service-business-without-losing-recognition": topicMedia(
    "reposition-preserve-recognition-bridge",
    "A familiar recognition cue carried intact across a bridge into a sharper new category and offer system",
  ),
  "brand-refresh-vs-rebrand-how-much-change": topicMedia(
    "brand-change-depth-ladder",
    "One familiar brand cue moving through five levels of change from contained repair to complete strategic rebuild",
  ),
  "turn-client-proof-into-positioning-advantage": topicMedia(
    "client-proof-architecture",
    "A positioning claim connected to five structured layers of client evidence",
  ),
  "brand-architecture-service-businesses": topicMedia(
    "brand-architecture-independence-threshold",
    "One master brand holding four clear service offers while a fifth candidate faces five tests for independence",
  ),
  "customer-interviews-brand-strategy": topicMedia(
    "customer-interview-decision-reconstruction",
    "A customer decision reconstructed from context through memory while smooth polite answers remain outside the evidence path",
  ),
  "turn-customer-interviews-into-positioning-brief": topicMedia(
    "interview-evidence-to-positioning-brief",
    "Customer interview evidence cards connected into one structured positioning brief",
  ),
  "service-line-naming-strategy": topicMedia(
    "service-name-family-system",
    "Five clearly related service names held under one coherent parent system",
  ),
  "competitor-research-brand-strategy-without-copying-category": topicMedia(
    "competitor-research-distance-map",
    "Repeated competitor conventions measured at a distance while internal proof produces one original strategic choice",
  ),
  "brand-voice-guidelines-writers-can-use": topicMedia(
    "brand-voice-rules-calibration",
    "Abstract voice traits calibrated into practical writing rules and examples",
  ),
  "brand-discovery-workshop-questions": topicMedia(
    "discovery-workshop-evidence-to-decisions",
    "Evidence sorted through a tradeoff gate into three accountable brand decisions with owners and validation needs",
  ),
  "homepage-messaging-service-businesses": topicMedia(
    "homepage-message-decision-sequence",
    "A clear first screen leading into an ordered five stage homepage message sequence",
  ),
  "service-page-messaging-strategy": topicMedia(
    "service-page-confidence-stack",
    "Seven service page messaging stages leading a qualified buyer toward one clear next step",
  ),
  "case-study-structure-service-businesses": topicMedia(
    "case-study-decision-proof-chain",
    "A client situation moving through constraints, diagnosis, a strategic fork, execution and verified outcome before transferring its lesson forward",
  ),
  "testimonial-questions-buying-evidence": topicMedia(
    "testimonial-questions-to-proof",
    "Five testimonial interview stages feeding into an organized dossier of buying evidence",
  ),
};

export function getInsightOriginalMedia(slug: string) {
  return insightOriginalMedia[slug];
}
