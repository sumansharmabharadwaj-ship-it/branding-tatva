import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
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
import { getInsightApplication } from "@/data/insightApplications";
import { insightPosts, insightTopics } from "@/data/insights";
import { packages } from "@/data/services";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { InsightsKnowledgeAtlas } from "@/sections/Insights/InsightsKnowledgeAtlas";
import {
  InsightsSceneNavigator,
  type InsightScene,
} from "@/sections/Insights/InsightsSceneNavigator";
import "../insights-cinematic.css";

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

const INSIGHT_SCENES: InsightScene[] = [
  { id: "insights-opening-field", label: "Opening field", accent: "#E9C48B" },
  { id: "insights-foundation", label: "Foundation", accent: "#D77A51" },
  { id: "knowledge-atlas", label: "Knowledge atlas", accent: "#7FA4BA" },
  { id: "insights-library-scene", label: "Essay library", accent: "#A8B68F" },
  { id: "insights-audit-seam", label: "Audit seam", accent: "#D09A89" },
  { id: "insights-field-notes", label: "Field notes", accent: "#D7A84A" },
];

const FOUNDATION_DECISIONS = [
  "Offer design",
  "Messaging",
  "Visual direction",
  "Sales language",
  "Content",
];

const AUDIT_LAYERS = ["Foundation", "Message", "Identity", "Experience", "Memory"];

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
  const atlasPaths = insightTopics.map((topic) => {
    const articles = sortedPosts.filter((post) => post.topicSlug === topic.slug);
    const application = getInsightApplication(topic.slug);
    const proof = projects.find((project) => project.slug === application?.projectSlug);
    const servicePackage = packages.find((pkg) => pkg.slug === application?.packageSlug);

    if (!application || !proof || !servicePackage) {
      throw new Error(`Missing verified Insight application for ${topic.slug}`);
    }

    return {
      slug: topic.slug,
      element: topic.element,
      name: topic.name,
      eyebrow: topic.eyebrow,
      promise: topic.promise,
      diagnosticQuestions: topic.diagnosticQuestions,
      articleCount: articles.length,
      articles: articles.slice(0, 3).map((article) => ({
        slug: article.slug,
        title: article.title,
        readingTime: article.readingTime,
      })),
      proof: {
        slug: proof.slug,
        title: proof.title,
        frame: application.proofFrame,
      },
      service: {
        slug: servicePackage.slug,
        name: servicePackage.name,
        frame: application.serviceFrame,
      },
    };
  });

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
      <main id="main-content" className="insights-page">
        <InsightsSceneNavigator scenes={INSIGHT_SCENES} />

        <div
          id="insights-opening-field"
          className="insights-scene"
          data-scene-active="true"
        >
          <PhotoHero
            video="/videos/pixabay-sea-of-fog-sunrise.mp4"
            poster="/images/pixabay-sea-of-fog-sunrise-poster.jpg"
            minHeight="100svh"
            className="insights-hero"
            playbackRate={1.08}
            overlayGradient="linear-gradient(108deg, rgba(10,18,20,0.92) 0%, rgba(17,25,26,0.75) 52%, rgba(39,34,30,0.48) 100%)"
          >
            <Container className="insights-hero__shell relative">
              <div className="insights-hero__grid">
                <div>
                  <Reveal>
                    <p className="insights-hero__eyebrow">The thinking field</p>
                  </Reveal>
                  <SplitReveal
                    as="h1"
                    className="insights-hero__title text-ivory"
                  >
                    See the decision beneath the brand problem.
                  </SplitReveal>
                  <Reveal delay={0.1}>
                    <p className="insights-hero__summary">
                      Essays, diagnostic questions, and connected reading paths
                      for founders shaping positioning, experience,
                      distinctiveness, language, and memory.
                    </p>
                    <Link href="#knowledge-atlas" className="insights-hero__link">
                      Enter the knowledge atlas <span aria-hidden="true">↓</span>
                    </Link>
                  </Reveal>
                </div>
                <Reveal delay={0.16}>
                  <div className="insights-hero__ledger">
                    <div className="insights-hero__ledger-top">
                      <p className="insights-hero__ledger-label">Living library</p>
                      <p className="insights-hero__ledger-count">
                        {sortedPosts.length}
                        <small>field notes</small>
                      </p>
                    </div>
                    <div className="insights-hero__ledger-list">
                      {atlasPaths.map((path, index) => (
                        <Link
                          key={path.slug}
                          href={`/insights/topic/${path.slug}`}
                          className="insights-hero__ledger-row"
                          style={{
                            "--path-color": elementColor(path.element),
                          } as CSSProperties}
                        >
                          <i aria-hidden="true" />
                          <span>{path.name}</span>
                          <span>0{index + 1}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </Container>
          </PhotoHero>
        </div>

        {/* A restrained folio current replaces the old flat ivory chapter;
            the dense wash keeps the foundation essay visually primary. */}
        <section
          id="insights-foundation"
          className="insights-foundation insights-scene relative overflow-hidden bg-ivory"
          data-scene-active="false"
        >
          <div className="insights-foundation__film" aria-hidden="true">
            <BackgroundVideo
              video="/videos/generated/bt-insights-foundation-folio.mp4"
              poster="/images/generated/bt-insights-foundation-folio-poster.jpg"
              playbackRate={0.86}
            />
            <div className="absolute inset-0 bg-[#F4EFE6]/84" />
          </div>
          <Container className="insights-foundation__camera relative">
            <div className="insights-foundation__header">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                  Foundation essay
                </p>
                <h2 className="mt-3 font-display text-display-sm font-normal text-soil">
                  One foundation essay. Five decisions.
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-foreground-secondary lg:justify-self-end">
                Positioning is the soil beneath offer design, messaging,
                visual direction, sales language, and content. This guide
                turns the subject into a decision system a service business
                can actually use.
              </p>
            </div>

            <ol
              className="insights-foundation__decisions"
              aria-label="Five connected brand decisions"
            >
              {FOUNDATION_DECISIONS.map((decision, index) => (
                <li
                  key={decision}
                  style={{
                    "--decision-delay": `${index * 32}ms`,
                  } as CSSProperties}
                >
                  <span>0{index + 1}</span>
                  <strong>{decision}</strong>
                </li>
              ))}
            </ol>

            <div className="insights-foundation__feature">
              <InsightCard post={featured} featured />
            </div>
          </Container>
        </section>

        <div
          id="knowledge-atlas"
          className="insights-scene insights-atlas-scene"
          data-scene-active="false"
        >
          <InsightsKnowledgeAtlas paths={atlasPaths} />
        </div>

        <div
          id="insights-library-scene"
          className="insights-scene insights-library-scene"
          data-scene-active="false"
        >
          <InsightsExplorer posts={explorerPosts} topics={explorerTopics} />
        </div>

        <section
          id="insights-audit-seam"
          className="insights-audit-scene insights-scene bg-ivory"
          data-scene-active="false"
        >
          <Container className="insights-audit-scene__camera">
            <div className="insights-audit-scene__ledger" aria-hidden="true">
              <span>Evidence ledger</span>
              <i />
              <span>05 signals</span>
            </div>

            <div className="insights-audit-scene__frame">
              <div className="insights-audit-scene__film relative min-h-80 bg-soil">
                <BackgroundVideo
                  video="/videos/generated/bt-insights-audit-seam.mp4"
                  poster="/images/generated/bt-insights-audit-seam-poster.jpg"
                  imagePosition="center"
                  playbackRate={0.86}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-soil/85 via-soil/20 to-transparent" />
                <div className="insights-audit-scene__film-copy absolute inset-x-0 bottom-0 p-7 text-ivory sm:p-9">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone">
                    A practical next read
                  </p>
                  <p className="mt-3 max-w-md font-display text-3xl leading-tight">
                    Find the seam before paying to redesign the surface.
                  </p>
                </div>
              </div>
              <div className="insights-audit-scene__copy flex flex-col justify-center p-7 sm:p-10 lg:p-14">
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

                <ol className="insights-audit-scene__layers" aria-label="Audit layers">
                  {AUDIT_LAYERS.map((layer, index) => (
                    <li
                      key={layer}
                      style={{
                        "--audit-delay": `${index * 34}ms`,
                      } as CSSProperties}
                    >
                      <span>0{index + 1}</span>
                      <strong>{layer}</strong>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Container>
        </section>

        <div
          id="insights-field-notes"
          className="insights-scene"
          data-scene-active="false"
        >
          <TexturedDark
            image="/images/pixabay-golden-reeds-wind-poster.jpg"
            video="/videos/pixabay-golden-reeds-wind.mp4"
            className="insights-notes-scene"
          >
            <Container className="insights-notes-scene__camera">
              <div className="insights-notes-scene__composition">
                <div className="insights-notes-scene__copy">
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
                </div>
                <div className="insights-notes-scene__form lg:min-w-96">
                  <NewsletterForm />
                </div>
              </div>
            </Container>
          </TexturedDark>
        </div>
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
