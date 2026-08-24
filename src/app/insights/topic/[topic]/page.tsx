import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { InsightDecisionPath } from "@/components/InsightDecisionPath";
import { InsightCard, type InsightCardPost } from "@/components/InsightCard";
import { InsightsExplorer } from "@/components/InsightsExplorer";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { elements } from "@/data/elements";
import { getInsightApplication } from "@/data/insightApplications";
import {
  getInsightTopic,
  getInsightsByTopic,
  insightTopics,
  type InsightPost,
} from "@/data/insights";
import { getInsightPathway } from "@/data/insightPathways";
import { packages } from "@/data/services";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { TopicDiagnosticScene } from "@/sections/Insights/TopicDiagnosticScene";
import "../insights-topic-cinematic.css";

type Props = {
  params: Promise<{ topic: string }>;
};

const DIAGNOSTIC_STOP_WORDS = new Set([
  "after",
  "become",
  "brand",
  "business",
  "can",
  "clear",
  "current",
  "does",
  "each",
  "from",
  "have",
  "into",
  "most",
  "people",
  "should",
  "that",
  "the",
  "their",
  "this",
  "what",
  "when",
  "where",
  "which",
  "with",
]);

function meaningfulWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((word) => word.length > 3 && !DIAGNOSTIC_STOP_WORDS.has(word));
}

function connectQuestionsToReads(questions: string[], posts: InsightPost[]) {
  const remaining = [...posts];

  return questions.map((question) => {
    const questionWords = new Set(meaningfulWords(question));
    const ranked = remaining
      .map((post, index) => {
        const searchable = meaningfulWords(
          [
            post.title,
            post.excerpt,
            post.primaryKeyword,
            ...post.secondaryKeywords,
          ].join(" ")
        );
        const score = searchable.reduce(
          (total, word) => total + (questionWords.has(word) ? 1 : 0),
          0
        );

        return { post, index, score };
      })
      .sort((a, b) => b.score - a.score || a.index - b.index);
    const match = ranked[0] ?? { post: posts[0], index: 0, score: 0 };

    if (remaining.length > 1) remaining.splice(match.index, 1);

    return {
      question,
      article: {
        slug: match.post.slug,
        title: match.post.title,
        excerpt: match.post.excerpt,
        readingTime: match.post.readingTime,
      },
    };
  });
}

export function generateStaticParams() {
  return insightTopics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getInsightTopic(topicSlug);

  if (!topic) return {};

  return {
    title: `${topic.name} insights for brand strategy`,
    description: `${topic.description} ${topic.promise}`,
    keywords: [
      `${topic.name.toLowerCase()} brand strategy`,
      topic.name.toLowerCase(),
      "brand strategy insights",
    ],
    alternates: {
      canonical: `/insights/topic/${topic.slug}`,
    },
    openGraph: {
      title: `${topic.name} insights | Branding Tatva`,
      description: topic.description,
      type: "website",
      url: `${site.url}/insights/topic/${topic.slug}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function InsightTopicPage({ params }: Props) {
  const { topic: topicSlug } = await params;
  const topic = getInsightTopic(topicSlug);

  if (!topic) notFound();

  const element = elements.find((item) => item.slug === topic.element);
  const posts = getInsightsByTopic(topic.slug).sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const pathway = getInsightPathway(topic.slug);
  const relatedPosts = pathway.adjacentTopicSlugs
    .flatMap((adjacentTopicSlug) =>
      getInsightsByTopic(adjacentTopicSlug).filter((post) => post.featured)
    )
    .filter((post, index, items) =>
      items.findIndex((candidate) => candidate.slug === post.slug) === index
    )
    .slice(0, 3);
  const color = element?.color ?? "#B85A34";
  const application = getInsightApplication(topic.slug);
  const applicationProof = projects.find(
    (project) => project.slug === application?.projectSlug
  );
  const applicationPackage = packages.find(
    (pkg) => pkg.slug === application?.packageSlug
  );
  const diagnosticReads = connectQuestionsToReads(topic.diagnosticQuestions, posts);
  const explorerPosts: InsightCardPost[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    element: post.element,
    topicSlug: post.topicSlug,
    updatedAt: post.updatedAt,
    readingTime: post.readingTime,
    heroImage: post.heroImage,
    heroImageAlt: post.heroImageAlt,
    keyTakeaways: post.keyTakeaways,
    primaryKeyword: post.primaryKeyword,
    secondaryKeywords: post.secondaryKeywords,
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${site.url}/insights/topic/${topic.slug}/#page`,
        url: `${site.url}/insights/topic/${topic.slug}`,
        name: `${topic.name} insights`,
        description: topic.description,
        isPartOf: { "@id": `${site.url}/insights/#page` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: posts.length,
          itemListElement: posts.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${site.url}/insights/${post.slug}`,
            name: post.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Insights",
            item: `${site.url}/insights`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: topic.name,
            item: `${site.url}/insights/topic/${topic.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content" className="insights-topic-page">
        <header className="insights-topic-hero relative flex items-end overflow-hidden bg-soil pb-16 pt-36 sm:pb-20 sm:pt-44">
          {element?.video && (
            <BackgroundVideo video={element.video} poster={element.image} />
          )}
          <div className="absolute inset-0 bg-soil/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-soil via-soil/30 to-transparent" />

          <Container className="insights-topic-hero__content relative">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-xs text-ivory/65"
            >
              <Link href="/" className="transition hover:text-ivory">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/insights" className="transition hover:text-ivory">
                Insights
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-ivory">{topic.name}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-end">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-ivory/20 bg-soil/25 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ivory backdrop-blur-xl">
                  <ElementGlyph
                    slug={topic.element}
                    className="h-4 w-4"
                    strokeWidth={1.5}
                    style={{ color }}
                  />
                  {topic.eyebrow}
                </div>
                <h1 className="mt-6 max-w-4xl font-display text-[clamp(3rem,7vw,6.4rem)] font-normal leading-[0.94] text-ivory">
                  {topic.name}, read as a brand system.
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="rounded-[1.5rem] border border-ivory/15 bg-soil/30 p-6 text-ivory shadow-elevation-md backdrop-blur-2xl">
                  <p className="text-sm leading-7 text-ivory/80">
                    {topic.promise}
                  </p>
                  <p className="mt-5 border-t border-ivory/15 pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-sandstone">
                    {posts.length} {posts.length === 1 ? "essay" : "essays"} in
                    this path
                  </p>
                </div>
              </Reveal>
            </div>
          </Container>
        </header>

        <TopicDiagnosticScene
          topicSlug={topic.slug}
          topicName={topic.name}
          element={topic.element}
          accent={color}
          introduction={topic.introduction}
          reads={diagnosticReads}
        />

        <InsightsExplorer
          posts={explorerPosts}
          topics={[]}
          sectionId={`${topic.slug}-reading-path`}
          eyebrow={`${topic.name} reading path`}
          heading={`Essays on ${topic.name.toLowerCase()}, held in one clear sequence.`}
          description="Every guide opens with a direct answer, then carries the decision through a working framework, examples, source notes, and connected reading."
          searchPlaceholder={`Search within ${topic.name.toLowerCase()}`}
          video="/videos/generated/bt-insights-topic-reading-current.mp4"
          poster="/images/generated/bt-insights-topic-reading-current-poster.jpg"
        />

        <section className="bg-background-alt pb-20 sm:pb-28">
          <Container>
            <Reveal>
              <InsightDecisionPath pathway={pathway} />
            </Reveal>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-soil py-20 text-ivory sm:py-28">
          <BackgroundVideo
            video="/videos/generated/bt-insights-topic-across-system.mp4"
            poster="/images/generated/bt-insights-topic-across-system-poster.jpg"
            parallax
            playbackRate={0.84}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-soil/81" />
          <Container className="relative">
            <Reveal>
              <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone">
                    Across the system
                  </p>
                  <h2 className="mt-4 font-display text-display-md font-normal">
                    Every element changes the others.
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-7 text-ivory/70 lg:justify-self-end">
                  Continue into the neighbouring decisions that shape how this
                  part of the brand is experienced and remembered.
                </p>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((post, index) => (
                <Reveal key={post.slug} delay={index * 0.05}>
                  <InsightCard post={post} />
                </Reveal>
              ))}
            </div>
            {application && applicationProof && applicationPackage && (
              <Reveal delay={0.1}>
                <div className="topic-application">
                  <div>
                    <p>Published project record</p>
                    <h3>{applicationProof.title}</h3>
                    <span>{application.proofFrame}</span>
                    <Link href={`/work/${applicationProof.slug}`}>
                      See the decision trail <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                  <div>
                    <p>Strategy path</p>
                    <h3>{applicationPackage.name}</h3>
                    <span>{application.serviceFrame}</span>
                    <Link href={`/services#package-${applicationPackage.slug}`}>
                      Explore the engagement <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            )}
            <Reveal delay={0.12} className="mt-10 text-center">
              <LinkButton href="/insights">Open the full library</LinkButton>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
