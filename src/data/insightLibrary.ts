// The public Insights archive, topic pages, feeds, sitemap, and article routes
// all read from this one registry. The canonical library currently contains
// 29 published guides across five topic hubs.
export {
  getInsightBySlug,
  getInsightTopic,
  getInsightsByTopic,
  insightPosts,
  insightTopics,
} from "@/data/insights";
export type { InsightPost } from "@/data/insights";
