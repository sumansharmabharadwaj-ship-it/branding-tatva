type InsightOriginalMedia = {
  poster: string;
  video: string;
  alt: string;
};

const MEDIA_ROOT = "/images/generated/insights-v2";
const VIDEO_ROOT = "/videos/generated/insights-v2";

function media(slug: string, alt: string): InsightOriginalMedia {
  return {
    poster: `${MEDIA_ROOT}/${slug}.webp`,
    video: `${VIDEO_ROOT}/${slug}.mp4`,
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
  "brand-awareness-vs-brand-recall": media(
    "awareness-recall-archive",
    "A deeply embossed memory cue held inside an archive of faint impressions",
  ),
  "brand-messaging-framework": media(
    "messaging-framework-letterpress",
    "Blank wooden printing blocks arranged into one repeatable message structure",
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
  "how-to-position-a-consulting-business": media(
    "consulting-positioning-aperture",
    "A wide wooden aperture holding a focused garden path within its frame",
  ),
  "measure-brand-recall-limited-budget": media(
    "recall-measurement-tabletop-test",
    "A modest memory test with covered objects and a simple wooden tally",
  ),
  "value-proposition-vs-positioning-vs-tagline": media(
    "positioning-value-tagline-three-jobs",
    "A stone territory clear offer vessel and small brass signal nested together",
  ),
  "brand-consistency-checklist-service-businesses": media(
    "brand-consistency-thread",
    "One clay coloured thread passing unchanged through five different materials",
  ),
  "why-beautiful-brand-identity-can-be-forgettable": media(
    "forgettable-identity-memory-cue",
    "One grooved ceramic vessel remembered beside a row of polished identical forms",
  ),
  "find-real-differentiator-crowded-service-market": media(
    "differentiation-market-vessels",
    "One useful pouring vessel separated from a crowded field of identical cups",
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
  "turn-client-proof-into-positioning-advantage": media(
    "client-proof-balance",
    "A claim and a collection of concrete evidence held in exact balance",
  ),
  "brand-architecture-service-businesses": media(
    "brand-architecture-service-system",
    "A strong parent beam holding several related wooden offer modules",
  ),
  "customer-interviews-brand-strategy": media(
    "customer-interviews-listening-table",
    "Two chairs and an analogue recorder arranged for an open conversation",
  ),
  "turn-customer-interviews-into-positioning-brief": media(
    "interview-synthesis-weave",
    "Many loose fibres entering a loom and leaving as one strong woven band",
  ),
  "service-line-naming-strategy": media(
    "service-line-naming-cabinet",
    "Many differently sized drawers held within one coherent wooden cabinet",
  ),
  "competitor-research-brand-strategy-without-copying-category": media(
    "competitor-research-observation",
    "Related leaf specimens studied through glass beside a blank field notebook",
  ),
  "brand-voice-guidelines-writers-can-use": media(
    "brand-voice-resonators",
    "Five material resonators aligned to one shared frequency line",
  ),
  "brand-discovery-workshop-questions": media(
    "discovery-workshop-decision-table",
    "Three chosen material decisions emerging from a table of blank question cards",
  ),
  "homepage-messaging-service-businesses": media(
    "homepage-first-screen",
    "A single architectural threshold framing one clear destination",
  ),
  "service-page-messaging-strategy": media(
    "service-page-confident-choice",
    "One resolved service material kit placed ahead of many loose options",
  ),
  "case-study-structure-service-businesses": media(
    "case-study-decision-record",
    "An open project record tracing evidence from first fragment to final proof",
  ),
  "testimonial-questions-buying-evidence": media(
    "testimonial-evidence-listening",
    "An analogue recorder beside tangible evidence resting on a brass balance",
  ),
};

export function getInsightOriginalMedia(slug: string) {
  return insightOriginalMedia[slug];
}
