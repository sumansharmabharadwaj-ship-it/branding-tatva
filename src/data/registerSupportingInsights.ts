import { insightPosts } from "@/data/insights";
import { supportingInsightPosts } from "@/data/supportingInsights";

for (const post of supportingInsightPosts) {
  if (!insightPosts.some((existingPost) => existingPost.slug === post.slug)) {
    insightPosts.push(post);
  }
}

const supportingSlug = "website-messaging-hierarchy-service-businesses";

for (const pillarSlug of [
  "brand-messaging-framework",
  "brand-positioning-strategy-service-businesses",
]) {
  const pillar = insightPosts.find((post) => post.slug === pillarSlug);

  if (pillar && !pillar.relatedSlugs.includes(supportingSlug)) {
    pillar.relatedSlugs = [
      supportingSlug,
      ...pillar.relatedSlugs.filter((slug) => slug !== supportingSlug),
    ].slice(0, 3);
  }
}
