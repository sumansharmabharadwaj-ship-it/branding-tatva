import type { Metadata } from "next";
import InsightArticlePage, {
  generateMetadata as generateArticleMetadata,
} from "../[slug]/page";
import { ResearchLedger } from "./ResearchLedger";
import styles from "./page.module.css";

const ARTICLE_PARAMS = Promise.resolve({
  slug: "measure-brand-recall-limited-budget",
});

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await generateArticleMetadata({ params: ARTICLE_PARAMS });

  return {
    ...metadata,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function BrandRecallMeasurementArticlePage() {
  return (
    <>
      <div className={styles.articleShell}>
        <InsightArticlePage params={ARTICLE_PARAMS} />
      </div>
      <ResearchLedger />
    </>
  );
}
