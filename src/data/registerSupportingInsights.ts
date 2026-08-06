import { insightPosts } from "@/data/insights";
import { supportingInsightPosts } from "@/data/supportingInsights";

for (const post of supportingInsightPosts) {
  if (!insightPosts.some((existingPost) => existingPost.slug === post.slug)) {
    insightPosts.push(post);
  }
}
