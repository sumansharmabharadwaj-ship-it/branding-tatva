import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { InsightCard, type InsightCardPost } from "@/components/InsightCard";
import { InsightsExplorer } from "@/components/InsightsExplorer";
import { LinkButton } from "@/components/Button";
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
import { KnowledgeAtlas } from "@/sections/Insights/KnowledgeAtlas";

export const metadata: Metadata = {
  title: "Brand Strategy Insights & Field Notes",
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
    title: "Brand Strategy Insights & Field Notes | Branding Tatva",
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
  const newsletterConfigured = Boolean(
    process.env.MAILCHIMP_API_KEY &&
      process.env.MAILCHIMP_AUDIENCE_ID &&
      process.env.MAILCHIMP_SERVER_PREFIX
  );
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
  const atlasTopics = insightTopics.map((topic) => ({
    ...topic,
    count: insightPosts.filter((post) => post.topicSlug === topic.slug).length,
    color: elementColor(topic.element),
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

        <KnowledgeAtlas topics={atlasTopics} />

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
                {newsletterConfigured ? (
                  <NewsletterForm />
                ) : (
                  <div className="rounded-2xl border border-ivory/20 bg-soil/45 p-6">
                    <p className="text-sm leading-7 text-ivory/80">
                      Subscription delivery awaits its connection. The complete library remains open and email-free.
                    </p>
                    <div className="mt-5">
                      <LinkButton href="#insights-library">Return to the library</LinkButton>
                    </div>
                  </div>
                )}
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
