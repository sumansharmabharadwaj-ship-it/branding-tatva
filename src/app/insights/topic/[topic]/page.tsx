import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { InsightCard } from "@/components/InsightCard";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { elements } from "@/data/elements";
import {
  getInsightTopic,
  getInsightsByTopic,
  insightPosts,
  insightTopics,
} from "@/data/insights";
import { site } from "@/data/site";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";

type Props = {
  params: Promise<{ topic: string }>;
};

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
  const relatedPosts = insightPosts
    .filter((post) => post.topicSlug !== topic.slug)
    .slice(0, 3);
  const color = element?.color ?? "#B85A34";

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
      <main id="main-content">
        <header className="relative flex min-h-[68svh] items-end overflow-hidden bg-soil pb-16 pt-36 sm:pb-20 sm:pt-44">
          {element?.video && (
            <BackgroundVideo video={element.video} poster={element.image} />
          )}
          <div className="absolute inset-0 bg-soil/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-soil via-soil/30 to-transparent" />

          <Container className="relative">
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

        <section className="relative overflow-hidden bg-ivory py-20 sm:py-28">
          <BackgroundVideo
            video="/videos/generated/bt-insights-topic-system-beneath.mp4"
            poster="/images/generated/bt-insights-topic-system-beneath-poster.jpg"
            parallax
            playbackRate={0.84}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#F4EFE6]/87" />
          <Container className="relative">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <Reveal>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color }}
                  >
                    What this path examines
                  </p>
                  <h2 className="mt-4 max-w-xl font-display text-display-md font-normal text-soil">
                    Begin with the system beneath the symptom.
                  </h2>
                  <div className="mt-6 space-y-5 text-base leading-8 text-foreground-secondary">
                    {topic.introduction.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="rounded-[1.75rem] border border-soil/10 bg-background-alt p-7 sm:p-9">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soil/55">
                    Three diagnostic questions
                  </p>
                  <ol className="mt-7 grid gap-5">
                    {topic.diagnosticQuestions.map((question, index) => (
                      <li
                        key={question}
                        className="grid grid-cols-[3rem_1fr] items-start gap-4"
                      >
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-full font-display text-lg"
                          style={{
                            backgroundColor: `${color}16`,
                            color,
                          }}
                        >
                          0{index + 1}
                        </span>
                        <p className="pt-1 font-display text-2xl leading-snug text-soil">
                          {question}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-background-alt py-20 sm:py-28">
          <BackgroundVideo
            video="/videos/generated/bt-insights-topic-reading-current.mp4"
            poster="/images/generated/bt-insights-topic-reading-current-poster.jpg"
            parallax
            playbackRate={0.82}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#EAE6DD]/88" />
          <Container className="relative">
            <Reveal>
              <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color }}
                  >
                    The reading path
                  </p>
                  <h2 className="mt-4 font-display text-display-md font-normal text-soil">
                    Essays on {topic.name.toLowerCase()}.
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-7 text-foreground-secondary lg:justify-self-end">
                  Each article begins with a direct answer, then opens the
                  decision through a framework, examples, frequent questions,
                  and connected reading.
                </p>
              </div>
            </Reveal>

            <div className={`mt-10 grid gap-6 ${posts.length > 1 ? "lg:grid-cols-2" : ""}`}>
              {posts.map((post, index) => (
                <Reveal key={post.slug} delay={index * 0.05}>
                  <InsightCard post={post} featured={posts.length === 1} />
                </Reveal>
              ))}
            </div>
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
