import type { InsightPost } from "@/data/pillarInsights";

type InsightMedia = Pick<InsightPost, "heroImage" | "heroVideo" | "heroImageAlt">;

function media(slug: string, heroImageAlt: string): InsightMedia {
  return {
    heroVideo: `/videos/insights/${slug}.mp4`,
    heroImage: `/images/insights/${slug}-poster.jpg`,
    heroImageAlt,
  };
}

/**
 * One dedicated, forward-playing editorial film per published guide.
 * Keeping this registry beside the canonical Insights registry prevents new
 * articles from silently falling back to one of the old repeated hero clips.
 */
export const insightMediaBySlug: Record<string, InsightMedia> = {
  "brand-positioning-strategy-service-businesses": media(
    "brand-positioning-strategy-service-businesses",
    "First light above a winding river valley",
  ),
  "brand-audit-checklist-before-rebrand": media(
    "brand-audit-checklist-before-rebrand",
    "A living root network examined against a dark ground",
  ),
  "brand-awareness-vs-brand-recall": media(
    "brand-awareness-vs-brand-recall",
    "Sunlight passing through a distinct canopy of green leaves",
  ),
  "brand-messaging-framework": media(
    "brand-messaging-framework",
    "Golden reeds moving together in a steady wind",
  ),
  "five-element-brand-strategy-framework": media(
    "five-element-brand-strategy-framework",
    "A wide sea of cloud gathering around distant peaks",
  ),
  "website-messaging-hierarchy-service-businesses": media(
    "website-messaging-hierarchy-service-businesses",
    "A quiet working table arranged beside a bright studio window",
  ),
  "distinctive-brand-assets-audit": media(
    "distinctive-brand-assets-audit",
    "Clear water travelling through a field of moss-covered stones",
  ),
  "customer-journey-mapping-service-businesses": media(
    "customer-journey-mapping-service-businesses",
    "Morning light revealing a path through a misted forest stream",
  ),
  "how-to-position-a-consulting-business": media(
    "how-to-position-a-consulting-business",
    "A mountain road holding a clear line through layered Himalayan ridges",
  ),
  "measure-brand-recall-limited-budget": media(
    "measure-brand-recall-limited-budget",
    "A green ridge emerging slowly from low cloud",
  ),
  "value-proposition-vs-positioning-vs-tagline": media(
    "value-proposition-vs-positioning-vs-tagline",
    "A single illuminated ridge separated from the surrounding landscape",
  ),
  "brand-consistency-checklist-service-businesses": media(
    "brand-consistency-checklist-service-businesses",
    "Repeated redwood trunks holding one continuous forest rhythm",
  ),
  "why-beautiful-brand-identity-can-be-forgettable": media(
    "why-beautiful-brand-identity-can-be-forgettable",
    "A beautiful mountain horizon disappearing into pale gold fog",
  ),
  "find-real-differentiator-crowded-service-market": media(
    "find-real-differentiator-crowded-service-market",
    "One jagged summit standing above a crowded field of cloud",
  ),
  "brand-positioning-statement-examples-why-generic": media(
    "brand-positioning-statement-examples-why-generic",
    "A hand-drawn root study taking shape on an open notebook",
  ),
  "reposition-established-service-business-without-losing-recognition": media(
    "reposition-established-service-business-without-losing-recognition",
    "Familiar mountain peaks held against a changing dusk sky",
  ),
  "brand-refresh-vs-rebrand-how-much-change": media(
    "brand-refresh-vs-rebrand-how-much-change",
    "Warm alpenglow changing the surface of an established mountain landscape",
  ),
  "turn-client-proof-into-positioning-advantage": media(
    "turn-client-proof-into-positioning-advantage",
    "A measured nutrition routine arranged in clear morning light",
  ),
  "brand-architecture-service-businesses": media(
    "brand-architecture-service-businesses",
    "A warehouse system organised into visible bays and levels",
  ),
  "customer-interviews-brand-strategy": media(
    "customer-interviews-brand-strategy",
    "Two people in conversation beside a night fire",
  ),
  "turn-customer-interviews-into-positioning-brief": media(
    "turn-customer-interviews-into-positioning-brief",
    "A quiet executive room prepared for synthesis and decision-making",
  ),
  "service-line-naming-strategy": media(
    "service-line-naming-strategy",
    "Silver tidal lines separating and reconnecting across dark water",
  ),
  "competitor-research-brand-strategy-without-copying-category": media(
    "competitor-research-brand-strategy-without-copying-category",
    "Close forest textures revealing distinct growth on one tree trunk",
  ),
  "brand-voice-guidelines-writers-can-use": media(
    "brand-voice-guidelines-writers-can-use",
    "Dandelion seeds carrying one source into many expressions",
  ),
  "brand-discovery-workshop-questions": media(
    "brand-discovery-workshop-questions",
    "A single beam of light opening a quiet room for focused inquiry",
  ),
  "homepage-messaging-service-businesses": media(
    "homepage-messaging-service-businesses",
    "A precise digital system illuminated inside a dark server room",
  ),
  "service-page-messaging-strategy": media(
    "service-page-messaging-strategy",
    "A useful service composition arranged clearly on a working table",
  ),
  "case-study-structure-service-businesses": media(
    "case-study-structure-service-businesses",
    "A cascade moving through a sequence of visible rock levels",
  ),
  "testimonial-questions-buying-evidence": media(
    "testimonial-questions-buying-evidence",
    "Moonlight leaving a clear reflection across open water",
  ),
};
