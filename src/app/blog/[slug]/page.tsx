import { redirect } from "next/navigation";

type LegacyBlogArticleProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyBlogArticle({
  params,
}: LegacyBlogArticleProps) {
  const { slug } = await params;
  redirect(`/insights/${encodeURIComponent(slug)}`);
}
