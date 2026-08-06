import {
  insightPosts as pillarInsightPosts,
  insightTopics,
  type InsightPost,
} from "@/data/insights";
import { supportingInsightPosts } from "@/data/supportingInsights";

export { insightTopics };
export type { InsightPost };

export const insightPosts: InsightPost[] = [
  ...pillarInsightPosts,
  ...supportingInsightPosts,
];

export function getInsightBySlug(slug: string) {
  return insightPosts.find((post) => post.slug === slug);
}

export function getInsightTopic(slug: string) {
  return insightTopics.find((topic) => topic.slug === slug);
}

export function getInsightsByTopic(topicSlug: string) {
  return insightPosts.filter((post) => post.topicSlug === topicSlug);
}
