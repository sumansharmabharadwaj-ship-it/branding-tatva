import { consultingPositioningInsightPosts } from "@/data/consultingPositioningInsights";
import { customerJourneyInsightPosts } from "@/data/customerJourneyInsights";
import { distinctiveAssetInsightPosts } from "@/data/distinctiveAssetInsights";
import {
  insightPosts as pillarInsightPosts,
  insightTopics,
  type InsightPost,
} from "@/data/insights";
import { supportingInsightPosts } from "@/data/supportingInsights";

export { insightTopics };
export type { InsightPost };

const combinedPosts = [
  ...pillarInsightPosts,
  ...supportingInsightPosts,
  ...distinctiveAssetInsightPosts,
  ...customerJourneyInsightPosts,
  ...consultingPositioningInsightPosts,
];

export const insightPosts: InsightPost[] = combinedPosts.filter(
  (post, index) =>
    combinedPosts.findIndex((candidate) => candidate.slug === post.slug) === index
);

export function getInsightBySlug(slug: string) {
  return insightPosts.find((post) => post.slug === slug);
}

export function getInsightTopic(slug: string) {
  return insightTopics.find((topic) => topic.slug === slug);
}

export function getInsightsByTopic(topicSlug: string) {
  return insightPosts.filter((post) => post.topicSlug === topicSlug);
}
