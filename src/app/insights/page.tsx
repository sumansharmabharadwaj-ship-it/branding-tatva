import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { InsightCard, type InsightCardPost } from "@/components/InsightCard";
import { InsightsExplorer } from "@/components/InsightsExplorer";
import { LinkButton } from "@/components/Button";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { NewsletterForm } from "@/components/NewsletterForm";
import { PhotoHero } from "@/components/PhotoHero";
import { Reveal } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SplitReveal } from "@/components/SplitReveal";
import { TexturedDark } from "@/components/TexturedDark";
import { elements } from "@/data/elements";
import { insightPosts, insightTopics } from "@/data/insights";
import { site } from "@/data/site";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Insights on brand strategy, positioning, and messaging",
  description:
    "Practical essays and frameworks on brand positioning, brand audits, messaging, customer experience, distinctiveness, recognition, and memory.",
  keywords: [
    "brand strategy insights",
    "brand positioning",
    "brand audit",
    "brand messaging",
    "brand recall",
    "distinctive brand assets",
  ],
  alternates: {
    canonical: "/insights",
    types: {
      "application/rss+xml": `${site.url}/insights/feed.xml`,
    },
  },
  openGraph: {
    title: "Brand strategy insights | Branding Tatva",
    description:
      "Practical essays and frameworks on positioning, messaging, customer experience, distinctiveness, recognition, and memory.",
    type: "website",
    url: `${site.url}/insights`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

function elementColor(elementSlug: string) {
  return elements.find((element) => element.slug === elementSlug)?.color ?? "#B85A34";
}

export default function InsightsPage() {
  const sortedPosts = [...insightPosts].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const featured = sortedPosts.find((post) => post.featured) ?? sortedPosts[0];
  const explorerPosts: InsightCardPost[] = sortedPosts.map((post) => ({
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
  const explorerTopics = insightTopics.map(({ slug, name, element }) => ({
    slug,
    name,
    element,
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${site.url}/insights/#page`,
        url: `${site.url}/insights`,
        name: "Brand strategy insights",
        description:
          "Essays and practical frameworks on positioning, customer experience, distinctiveness, messaging, recognition, and brand memory.",
        isPartOf: { "@id": `${site.url}/#website` },
        about: [
          "Brand positioning",
          "Brand audits",
          "Brand messaging",
          "Customer experience",
          "Brand recall",
        ],
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: sortedPosts.length,
          itemListElement: sortedPosts.map((post, index) => ({
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
        ],
      },
    ],
  };

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        <PhotoHero
          video="/videos/pixabay-sea-of-fog-sunrise.mp4"
          poster="/images/pixabay-sea-of-fog-sunrise-poster.jpg"
          minHeight="60svh"
        >
          <Container className="relative py-24 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
              <div>
                <Reveal>
                  <span className="inline-flex items-center rounded-full border border-ivory/30 bg-soil/15 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-ivory backdrop-blur-xl">
                    Insights
                  </span>
                </Reveal>
                <SplitReveal
                  as="h1"
                  className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7vw,6.2rem)] font-normal leading-[0.95] text-ivory"
                >
                  Brand strategy, explained from the roots upward.
                </SplitReveal>
              </div>
              <Reveal delay={0.12} className="lg:pb-2">
                <div className="rounded-[1.5rem] border border-ivory/15 bg-soil/30 p-6 text-ivory shadow-elevation-md backdrop-blur-2xl">
                  <p className="text-base leading-7 text-ivory/85">
                    Essays, field notes, and working frameworks on positioning,
                    messaging, recognition, and the choices that make a
                    business easier to understand.
                  </p>
                  <Link
                    href="#insights-library"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ivory"
                  >
                    Search the library <span aria-hidden="true">↓</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          </Container>
        </PhotoHero>

        <section className="bg-ivory py-20 sm:py-28">
          <Container>
            <Reveal>
              <div className="mb-10 grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                    Start here
                  </p>
                  <h2 className="mt-4 font-display text-display-md font-normal text-soil">
                    One foundation essay. Five decisions.
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-7 text-foreground-secondary lg:justify-self-end">
                  Positioning is the soil beneath offer design, messaging,
                  visual direction, sales language, and content. This guide
                  turns the subject into a decision system a service business
                  can actually use.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <InsightCard post={featured} featured />
            </Reveal>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-soil py-20 text-ivory sm:py-28">
          <BackgroundVideo
            video="/videos/generated/bt-insights-reading-currents.mp4"
            poster="/images/generated/bt-insights-reading-currents-poster.jpg"
            parallax
            playbackRate={0.92}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(105deg, rgba(12,18,20,0.9) 0%, rgba(12,18,20,0.7) 48%, rgba(12,18,20,0.55) 100%), radial-gradient(circle at 82% 82%, rgba(92,107,74,0.14), transparent 32%)",
            }}
          />
          <Container className="relative">
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sandstone">
                    Five reading paths
                  </p>
                  <h2 className="mt-4 max-w-xl font-display text-display-md font-normal">
                    Follow the part of the brand that feels hardest to hold.
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-7 text-ivory/70 lg:justify-self-end">
                  The elements organise real brand decisions into five paths.
                  Each topic page gathers related essays, so learning builds
                  laterally rather than ending at one article.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {insightTopics.map((topic, index) => {
                const color = elementColor(topic.element);
                const count = insightPosts.filter(
                  (post) => post.topicSlug === topic.slug
                ).length;

                return (
                  <Reveal key={topic.slug} delay={index * 0.05} className="h-full">
                    <Link
                      href={`/insights/topic/${topic.slug}`}
                      className="group flex h-full min-h-72 flex-col rounded-[1.5rem] border border-ivory/10 bg-ivory/[0.06] p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:bg-ivory/[0.1]"
                    >
                      <div className="flex items-center justify-between">
                        <ElementGlyph
                          slug={topic.element}
                          className="h-7 w-7"
                          strokeWidth={1.25}
                          style={{ color }}
                        />
                        <span className="font-display text-2xl text-ivory/25">
                          0{index + 1}
                        </span>
                      </div>
                      <p
                        className="mt-10 text-[0.65rem] font-semibold uppercase tracking-[0.2em]"
                        style={{ color }}
                      >
                        {topic.eyebrow}
                      </p>
                      <h3 className="mt-3 font-display text-3xl font-normal">
                        {topic.name}
                      </h3>
                      <p className="mt-4 flex-1 text-sm leading-6 text-ivory/65">
                        {topic.description}
                      </p>
                      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-ivory/80 transition-transform duration-300 group-hover:translate-x-1">
                        {count} {count === 1 ? "essay" : "essays"}{" "}
                        <span aria-hidden="true">→</span>
                      </p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        <InsightsExplorer posts={explorerPosts} topics={explorerTopics} />

        <section className="bg-ivory py-20 sm:py-28">
          <Container>
            <div className="grid overflow-hidden rounded-[2rem] border border-soil/10 bg-background-elevated shadow-elevation-md lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-80 bg-soil">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('/images/pixabay-stream-mist-rays-poster.jpg')",
                  }}
                  role="img"
                  aria-label="Light moving through mist above a forest stream"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-soil/85 via-soil/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-ivory sm:p-9">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone">
                    A practical next read
                  </p>
                  <p className="mt-3 max-w-md font-display text-3xl leading-tight">
                    Find the seam before paying to redesign the surface.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                  Brand audit checklist
                </p>
                <h2 className="mt-4 max-w-xl font-display text-display-sm font-normal text-soil">
                  Review the foundation, message, identity, experience, and
                  memory in one sequence.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-foreground-secondary">
                  The checklist helps separate high consequence brand breaks
                  from surface inconsistencies, then turns the findings into a
                  clear rebrand brief.
                </p>
                <div className="mt-8">
                  <LinkButton href="/insights/brand-audit-checklist-before-rebrand">
                    Open the audit
                  </LinkButton>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <TexturedDark
          image="/images/pixabay-golden-reeds-wind-poster.jpg"
          video="/videos/pixabay-golden-reeds-wind.mp4"
          className="py-24 sm:py-28"
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sandstone">
                  Notes worth keeping
                </p>
                <h2 className="mt-4 max-w-2xl font-display text-display-md font-normal text-ivory">
                  One clear brand question, delivered when there is something
                  worth saying.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-ivory/75">
                  New essays, frameworks, and close readings of the choices
                  that shape perception and memory.
                </p>
              </Reveal>
              <Reveal delay={0.08} className="lg:min-w-96">
                <NewsletterForm />
              </Reveal>
            </div>
          </Container>
        </TexturedDark>
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
