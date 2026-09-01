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
  "brand-positioning-strategy-service-businesses": media(
    "positioning-strategy-spine",
    "A brass rule creates one clear route through a field of handmade service tokens",
  ),
  "brand-audit-checklist-before-rebrand": media(
    "brand-audit-five-layers",
    "Five translucent material layers opened across a conservation light table",
  ),
  "brand-awareness-vs-brand-recall": topicMedia(
    "awareness-versus-recall-memory-test",
    "Repeated brand cues on one side and the same cue retrieved unaided from memory on the other",
  ),
  "brand-messaging-framework": topicMedia(
    "messaging-framework-five-part-system",
    "One positioning foundation feeding five message roles across several customer touchpoints",
  ),
  "five-element-brand-strategy-framework": media(
    "five-element-strategy-instrument",
    "Five natural materials joined around one precise brass instrument",
  ),
  "website-messaging-hierarchy-service-businesses": media(
    "website-message-hierarchy",
    "Blank handmade paper planes arranged in a clear order of importance",
  ),
  "distinctive-brand-assets-audit": media(
    "distinctive-assets-audit-kit",
    "An open material kit holding shape color texture sound and rhythm cues",
  ),
  "customer-journey-mapping-service-businesses": media(
    "customer-journey-thresholds",
    "A continuous thread passing through wood stone glass and linen thresholds",
  ),
  "how-to-position-a-consulting-business": topicMedia(
    "consulting-position-focus-and-expansion",
    "One focused consulting position anchoring a broad fan of connected service capabilities",
  ),
  "measure-brand-recall-limited-budget": media(
    "recall-measurement-tabletop-test",
    "A modest memory test with covered objects and a simple wooden tally",
  ),
  "value-proposition-vs-positioning-vs-tagline": topicMedia(
    "positioning-value-tagline-hierarchy",
    "A walnut positioning foundation supporting a terracotta value proposition and concise brass tagline plate",
  ),
  "brand-consistency-checklist-service-businesses": topicMedia(
    "brand-consistency-touchpoint-chain",
    "Five different customer touchpoints carrying one recognisable promise through the full journey",
  ),
  "why-beautiful-brand-identity-can-be-forgettable": media(
    "forgettable-identity-memory-cue",
    "One grooved ceramic vessel remembered beside a row of polished identical forms",
  ),
  "find-real-differentiator-crowded-service-market": topicMedia(
    "differentiator-choice-to-consequence",
    "One operational choice changing the customer consequence and producing visible proof",
  ),
  "brand-positioning-statement-examples-why-generic": media(
    "positioning-specificity",
    "A precise brass stamp beside a field of faint generic impressions",
  ),
  "reposition-established-service-business-without-losing-recognition": media(
    "reposition-recognition-seal",
    "A familiar carved seal carried from an old paper system into a new one",
  ),
  "brand-refresh-vs-rebrand-how-much-change": media(
    "refresh-rebrand-conservation",
    "A ceramic vessel held between restoration and complete remaking",
  ),
  "turn-client-proof-into-positioning-advantage": topicMedia(
    "client-proof-architecture",
    "A positioning claim connected to five structured layers of client evidence",
  ),
  "brand-architecture-service-businesses": media(
    "brand-architecture-service-system",
    "A strong parent beam holding several related wooden offer modules",
  ),
  "customer-interviews-brand-strategy": media(
    "customer-interviews-listening-table",
    "Two chairs and an analogue recorder arranged for an open conversation",
  ),
  "turn-customer-interviews-into-positioning-brief": topicMedia(
    "interview-evidence-to-positioning-brief",
    "Customer interview evidence cards connected into one structured positioning brief",
  ),
  "service-line-naming-strategy": topicMedia(
    "service-name-family-system",
    "Five clearly related service names held under one coherent parent system",
  ),
  "competitor-research-brand-strategy-without-copying-category": media(
    "competitor-research-observation",
    "Related leaf specimens studied through glass beside a blank field notebook",
  ),
  "brand-voice-guidelines-writers-can-use": topicMedia(
    "brand-voice-rules-calibration",
    "Abstract voice traits calibrated into practical writing rules and examples",
  ),
  "brand-discovery-workshop-questions": media(
    "discovery-workshop-decision-table",
    "Three chosen material decisions emerging from a table of blank question cards",
  ),
  "homepage-messaging-service-businesses": topicMedia(
    "homepage-message-decision-sequence",
    "A clear first screen leading into an ordered five stage homepage message sequence",
  ),
  "service-page-messaging-strategy": topicMedia(
    "service-page-confidence-stack",
    "Seven service page messaging stages leading a qualified buyer toward one clear next step",
  ),
  "case-study-structure-service-businesses": media(
    "case-study-decision-record",
    "An open project record tracing evidence from first fragment to final proof",
  ),
  "testimonial-questions-buying-evidence": topicMedia(
    "testimonial-questions-to-proof",
    "Five testimonial interview stages feeding into an organized dossier of buying evidence",
  ),
};

export function getInsightOriginalMedia(slug: string) {
  return insightOriginalMedia[slug];
}
