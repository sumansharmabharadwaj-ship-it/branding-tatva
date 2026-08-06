import { brandArchitectureInsightPosts } from "@/data/brandArchitectureInsights";
import { brandConsistencyInsightPosts } from "@/data/brandConsistencyInsights";
import { brandDiscoveryWorkshopInsightPosts } from "@/data/brandDiscoveryWorkshopInsights";
import { brandRefreshInsightPosts } from "@/data/brandRefreshInsights";
import { brandRecallMeasurementInsightPosts } from "@/data/brandRecallMeasurementInsights";
import { brandVoiceInsightPosts } from "@/data/brandVoiceInsights";
import { caseStudyInsightPosts } from "@/data/caseStudyInsights";
import { clientProofInsightPosts } from "@/data/clientProofInsights";
import { competitorResearchInsightPosts } from "@/data/competitorResearchInsights";
import { consultingPositioningInsightPosts } from "@/data/consultingPositioningInsights";
import { customerInterviewInsightPosts } from "@/data/customerInterviewInsights";
import { customerJourneyInsightPosts } from "@/data/customerJourneyInsights";
import { differentiationInsightPosts } from "@/data/differentiationInsights";
import { distinctiveAssetInsightPosts } from "@/data/distinctiveAssetInsights";
import { forgettableIdentityInsightPosts } from "@/data/forgettableIdentityInsights";
import { homepageMessagingInsightPosts } from "@/data/homepageMessagingInsights";
import { interviewSynthesisInsightPosts } from "@/data/interviewSynthesisInsights";
import { positioningStatementInsightPosts } from "@/data/positioningStatementInsights";
import { repositioningInsightPosts } from "@/data/repositioningInsights";
import { serviceNamingInsightPosts } from "@/data/serviceNamingInsights";
import { servicePageMessagingInsightPosts } from "@/data/servicePageMessagingInsights";
import { testimonialEvidenceInsightPosts } from "@/data/testimonialEvidenceInsights";
import {
  insightPosts as pillarInsightPosts,
  insightTopics,
  type InsightElement,
  type InsightFaq,
  type InsightFramework,
  type InsightPost,
  type InsightSection,
  type InsightTopic,
} from "@/data/pillarInsights";
import { supportingInsightPosts } from "@/data/supportingInsights";
import { valuePropositionInsightPosts } from "@/data/valuePropositionInsights";

export { insightTopics };
export type { InsightElement, InsightFaq, InsightFramework, InsightPost, InsightSection, InsightTopic };

const combinedPosts = [
  ...pillarInsightPosts,
  ...supportingInsightPosts,
  ...distinctiveAssetInsightPosts,
  ...customerJourneyInsightPosts,
  ...consultingPositioningInsightPosts,
  ...brandRecallMeasurementInsightPosts,
  ...valuePropositionInsightPosts,
  ...brandConsistencyInsightPosts,
  ...forgettableIdentityInsightPosts,
  ...differentiationInsightPosts,
  ...positioningStatementInsightPosts,
  ...repositioningInsightPosts,
  ...brandRefreshInsightPosts,
  ...clientProofInsightPosts,
  ...brandArchitectureInsightPosts,
  ...customerInterviewInsightPosts,
  ...interviewSynthesisInsightPosts,
  ...serviceNamingInsightPosts,
  ...competitorResearchInsightPosts,
  ...brandVoiceInsightPosts,
  ...brandDiscoveryWorkshopInsightPosts,
  ...homepageMessagingInsightPosts,
  ...servicePageMessagingInsightPosts,
  ...caseStudyInsightPosts,
  ...testimonialEvidenceInsightPosts,
];

export const insightPosts: InsightPost[] = combinedPosts.filter(
  (post, index) => combinedPosts.findIndex((candidate) => candidate.slug === post.slug) === index
);

const relatedRegistrations = [
  { supportingSlug: "website-messaging-hierarchy-service-businesses", pillarSlugs: ["brand-messaging-framework", "brand-positioning-strategy-service-businesses"] },
  { supportingSlug: "distinctive-brand-assets-audit", pillarSlugs: ["brand-awareness-vs-brand-recall", "five-element-brand-strategy-framework"] },
  { supportingSlug: "customer-journey-mapping-service-businesses", pillarSlugs: ["brand-audit-checklist-before-rebrand", "five-element-brand-strategy-framework"] },
  { supportingSlug: "how-to-position-a-consulting-business", pillarSlugs: ["brand-positioning-strategy-service-businesses", "brand-messaging-framework"] },
  { supportingSlug: "measure-brand-recall-limited-budget", pillarSlugs: ["brand-awareness-vs-brand-recall", "distinctive-brand-assets-audit"] },
  { supportingSlug: "value-proposition-vs-positioning-vs-tagline", pillarSlugs: ["brand-positioning-strategy-service-businesses", "brand-messaging-framework", "website-messaging-hierarchy-service-businesses"] },
  { supportingSlug: "brand-consistency-checklist-service-businesses", pillarSlugs: ["brand-audit-checklist-before-rebrand", "customer-journey-mapping-service-businesses", "five-element-brand-strategy-framework"] },
  { supportingSlug: "why-beautiful-brand-identity-can-be-forgettable", pillarSlugs: ["brand-awareness-vs-brand-recall", "distinctive-brand-assets-audit", "measure-brand-recall-limited-budget"] },
  { supportingSlug: "find-real-differentiator-crowded-service-market", pillarSlugs: ["brand-positioning-strategy-service-businesses", "how-to-position-a-consulting-business", "value-proposition-vs-positioning-vs-tagline"] },
  { supportingSlug: "brand-positioning-statement-examples-why-generic", pillarSlugs: ["brand-positioning-strategy-service-businesses", "find-real-differentiator-crowded-service-market", "value-proposition-vs-positioning-vs-tagline"] },
  { supportingSlug: "reposition-established-service-business-without-losing-recognition", pillarSlugs: ["brand-audit-checklist-before-rebrand", "distinctive-brand-assets-audit", "brand-positioning-strategy-service-businesses"] },
  { supportingSlug: "brand-refresh-vs-rebrand-how-much-change", pillarSlugs: ["brand-audit-checklist-before-rebrand", "reposition-established-service-business-without-losing-recognition", "distinctive-brand-assets-audit"] },
  { supportingSlug: "turn-client-proof-into-positioning-advantage", pillarSlugs: ["find-real-differentiator-crowded-service-market", "brand-positioning-strategy-service-businesses", "website-messaging-hierarchy-service-businesses"] },
  { supportingSlug: "brand-architecture-service-businesses", pillarSlugs: ["brand-positioning-strategy-service-businesses", "reposition-established-service-business-without-losing-recognition", "brand-refresh-vs-rebrand-how-much-change"] },
  { supportingSlug: "customer-interviews-brand-strategy", pillarSlugs: ["brand-positioning-strategy-service-businesses", "customer-journey-mapping-service-businesses", "turn-client-proof-into-positioning-advantage"] },
  { supportingSlug: "turn-customer-interviews-into-positioning-brief", pillarSlugs: ["customer-interviews-brand-strategy", "brand-positioning-strategy-service-businesses", "brand-positioning-statement-examples-why-generic"] },
  { supportingSlug: "service-line-naming-strategy", pillarSlugs: ["brand-architecture-service-businesses", "website-messaging-hierarchy-service-businesses", "brand-consistency-checklist-service-businesses"] },
  { supportingSlug: "competitor-research-brand-strategy-without-copying-category", pillarSlugs: ["find-real-differentiator-crowded-service-market", "brand-positioning-strategy-service-businesses", "distinctive-brand-assets-audit"] },
  { supportingSlug: "brand-voice-guidelines-writers-can-use", pillarSlugs: ["brand-messaging-framework", "website-messaging-hierarchy-service-businesses", "service-line-naming-strategy"] },
  { supportingSlug: "brand-discovery-workshop-questions", pillarSlugs: ["customer-interviews-brand-strategy", "turn-customer-interviews-into-positioning-brief", "brand-positioning-strategy-service-businesses"] },
  { supportingSlug: "homepage-messaging-service-businesses", pillarSlugs: ["website-messaging-hierarchy-service-businesses", "brand-messaging-framework", "turn-client-proof-into-positioning-advantage"] },
  { supportingSlug: "service-page-messaging-strategy", pillarSlugs: ["homepage-messaging-service-businesses", "website-messaging-hierarchy-service-businesses", "brand-positioning-strategy-service-businesses"] },
  { supportingSlug: "case-study-structure-service-businesses", pillarSlugs: ["turn-client-proof-into-positioning-advantage", "service-page-messaging-strategy", "brand-audit-checklist-before-rebrand"] },
  { supportingSlug: "testimonial-questions-buying-evidence", pillarSlugs: ["case-study-structure-service-businesses", "turn-client-proof-into-positioning-advantage", "service-page-messaging-strategy"] },
] as const;

for (const registration of relatedRegistrations) {
  for (const pillarSlug of registration.pillarSlugs) {
    const pillar = insightPosts.find((post) => post.slug === pillarSlug);
    if (pillar && !pillar.relatedSlugs.includes(registration.supportingSlug)) {
      pillar.relatedSlugs = [
        registration.supportingSlug,
        ...pillar.relatedSlugs.filter((slug) => slug !== registration.supportingSlug),
      ].slice(0, 3);
    }
  }
}

export function getInsightBySlug(slug: string) {
  return insightPosts.find((post) => post.slug === slug);
}

export function getInsightTopic(slug: string) {
  return insightTopics.find((topic) => topic.slug === slug);
}

export function getInsightsByTopic(topicSlug: string) {
  return insightPosts.filter((post) => post.topicSlug === topicSlug);
}
