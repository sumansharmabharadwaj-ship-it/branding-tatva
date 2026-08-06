import { brandConsistencyInsightPosts } from "@/data/brandConsistencyInsights";
import { brandRecallMeasurementInsightPosts } from "@/data/brandRecallMeasurementInsights";
import { consultingPositioningInsightPosts } from "@/data/consultingPositioningInsights";
import { customerJourneyInsightPosts } from "@/data/customerJourneyInsights";
import { distinctiveAssetInsightPosts } from "@/data/distinctiveAssetInsights";
import { forgettableIdentityInsightPosts } from "@/data/forgettableIdentityInsights";
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
export type {
  InsightElement,
  InsightFaq,
  InsightFramework,
  InsightPost,
  InsightSection,
  InsightTopic,
};

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
];

export const insightPosts: InsightPost[] = combinedPosts.filter(
  (post, index) =>
    combinedPosts.findIndex((candidate) => candidate.slug === post.slug) === index
);

const relatedRegistrations = [
  {
    supportingSlug: "website-messaging-hierarchy-service-businesses",
    pillarSlugs: [
      "brand-messaging-framework",
      "brand-positioning-strategy-service-businesses",
    ],
  },
  {
    supportingSlug: "distinctive-brand-assets-audit",
    pillarSlugs: [
      "brand-awareness-vs-brand-recall",
      "five-element-brand-strategy-framework",
    ],
  },
  {
    supportingSlug: "customer-journey-mapping-service-businesses",
    pillarSlugs: [
      "brand-audit-checklist-before-rebrand",
      "five-element-brand-strategy-framework",
    ],
  },
  {
    supportingSlug: "how-to-position-a-consulting-business",
    pillarSlugs: [
      "brand-positioning-strategy-service-businesses",
      "brand-messaging-framework",
    ],
  },
  {
    supportingSlug: "measure-brand-recall-limited-budget",
    pillarSlugs: [
      "brand-awareness-vs-brand-recall",
      "distinctive-brand-assets-audit",
    ],
  },
  {
    supportingSlug: "value-proposition-vs-positioning-vs-tagline",
    pillarSlugs: [
      "brand-positioning-strategy-service-businesses",
      "brand-messaging-framework",
      "website-messaging-hierarchy-service-businesses",
    ],
  },
  {
    supportingSlug: "brand-consistency-checklist-service-businesses",
    pillarSlugs: [
      "brand-audit-checklist-before-rebrand",
      "customer-journey-mapping-service-businesses",
      "five-element-brand-strategy-framework",
    ],
  },
  {
    supportingSlug: "why-beautiful-brand-identity-can-be-forgettable",
    pillarSlugs: [
      "brand-awareness-vs-brand-recall",
      "distinctive-brand-assets-audit",
      "measure-brand-recall-limited-budget",
    ],
  },
] as const;

for (const registration of relatedRegistrations) {
  for (const pillarSlug of registration.pillarSlugs) {
    const pillar = insightPosts.find((post) => post.slug === pillarSlug);

    if (pillar && !pillar.relatedSlugs.includes(registration.supportingSlug)) {
      pillar.relatedSlugs = [
        registration.supportingSlug,
        ...pillar.relatedSlugs.filter(
          (slug) => slug !== registration.supportingSlug
        ),
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
