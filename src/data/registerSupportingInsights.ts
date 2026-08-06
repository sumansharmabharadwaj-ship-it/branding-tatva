import { distinctiveAssetInsightPosts } from "@/data/distinctiveAssetInsights";
import { insightPosts } from "@/data/insights";
import { supportingInsightPosts } from "@/data/supportingInsights";

for (const post of [
  ...supportingInsightPosts,
  ...distinctiveAssetInsightPosts,
]) {
  if (!insightPosts.some((existingPost) => existingPost.slug === post.slug)) {
    insightPosts.push(post);
  }
}

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
