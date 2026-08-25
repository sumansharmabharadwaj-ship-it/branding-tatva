import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import type { InsightCardPost } from "@/components/InsightCard";
import { InsightsExplorer } from "@/components/InsightsExplorer";
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
import {
  InsightsDecisionMirror,
  type ReaderQuest,
} from "@/sections/Insights/InsightsDecisionMirror";
import {
  InsightsEvidenceLedger,
  type EvidenceLayer,
} from "@/sections/Insights/InsightsEvidenceLedger";
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
  { id: "insights-foundation" },
  { id: "knowledge-atlas" },
  { id: "insights-library-scene" },
  { id: "insights-audit-seam" },
  { id: "insights-field-notes" },
];

const READER_QUEST_BLUEPRINTS = [
  {
    topicSlug: "positioning",
    tension: "People compare us on price.",
    reading: "The market may be using the wrong comparison.",
    articleSlug: "brand-positioning-strategy-service-businesses",
    questionIndex: 1,
  },
  {
    topicSlug: "customer-experience",
    tension: "People like the work, then hesitate.",
    reading: "Trust may be thinning between promise and experience.",
    articleSlug: "customer-journey-mapping-service-businesses",
    questionIndex: 2,
  },
  {
    topicSlug: "distinctive-brand",
    tension: "The brand looks polished, yet interchangeable.",
    reading: "Recognition cues may be too weak to travel.",
    articleSlug: "distinctive-brand-assets-audit",
    questionIndex: 0,
  },
  {
    topicSlug: "brand-messaging",
    tension: "I explain the value better than the website does.",
    reading: "The message hierarchy may be hiding the strongest reason to choose.",
    articleSlug: "website-messaging-hierarchy-service-businesses",
    questionIndex: 1,
  },
  {
    topicSlug: "brand-memory",
    tension: "We publish often, yet memory stays faint.",
    reading: "Repeated activity may be teaching too many different ideas.",
    articleSlug: "brand-awareness-vs-brand-recall",
    questionIndex: 1,
  },
] as const;

const EVIDENCE_LAYER_BLUEPRINTS: Array<Omit<EvidenceLayer, "service">> = [
  {
    slug: "foundation",
    topicSlug: "positioning",
    name: "Foundation",
    signal: "Different buyers place the business in different categories.",
    evidence: "Buyer language · lost-deal reasons · offer comparisons",
    move: "Compare buyer language, lost-deal reasons, and offer comparisons in one table.",
  },
  {
    slug: "message",
    topicSlug: "brand-messaging",
    name: "Message",
    signal: "Calls explain the value faster than the website.",
    evidence: "Homepage hierarchy · proposal language · recurring objections",
    move: "Place homepage claims beside sales-call phrasing and recurring objections.",
  },
  {
    slug: "identity",
    topicSlug: "distinctive-brand",
    name: "Identity",
    signal: "Recognition fades when the logo leaves the frame.",
    evidence: "Distinctive cues · competitor similarity · channel consistency",
    move: "Test which cues people recognise before the logo appears.",
  },
  {
    slug: "experience",
    topicSlug: "customer-experience",
    name: "Experience",
    signal: "Confidence drops between enquiry and delivery.",
    evidence: "Response gaps · handoffs · promise-to-experience alignment",
    move: "Trace confidence from enquiry through handoff and delivery.",
  },
  {
    slug: "memory",
    topicSlug: "brand-memory",
    name: "Memory",
    signal: "Publishing grows while spontaneous recall stays faint.",
    evidence: "Repeated cues · branded search patterns · recall interviews",
    move: "Track which cues repeat across the moments with the widest reach.",
  },
];

export default function InsightsPage() {
  const sortedPosts = [...insightPosts].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
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
  const readerQuests: ReaderQuest[] = READER_QUEST_BLUEPRINTS.map((blueprint) => {
    const topic = insightTopics.find((candidate) => candidate.slug === blueprint.topicSlug);
    const article = sortedPosts.find((candidate) => candidate.slug === blueprint.articleSlug);

    if (!topic || !article) {
      throw new Error(`Missing verified reader quest for ${blueprint.topicSlug}`);
    }

    return {
      topicSlug: topic.slug,
      element: topic.element,
      pathName: topic.name,
      tension: blueprint.tension,
      reading: blueprint.reading,
      firstQuestion:
        topic.diagnosticQuestions[blueprint.questionIndex] ??
        topic.diagnosticQuestions[0] ??
        "Which decision would create the clearest next move?",
      article: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        readingTime: article.readingTime,
      },
    };
  });
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
  const evidenceLayers: EvidenceLayer[] = EVIDENCE_LAYER_BLUEPRINTS.map(
    (layer) => {
      const application = getInsightApplication(layer.topicSlug);
      const servicePackage = packages.find(
        (pkg) => pkg.slug === application?.packageSlug,
      );

      if (!application || !servicePackage) {
        throw new Error(`Missing verified evidence route for ${layer.topicSlug}`);
      }

      return {
        ...layer,
        service: {
          slug: servicePackage.slug,
          name: servicePackage.name,
          frame: application.serviceFrame,
        },
      };
    },
  );

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

        {/* A self-recognition mirror narrows a broad library to one credible
            first route before the visitor reaches the deeper atlas. */}
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
              posterPriority={false}
            />
            <div className="absolute inset-0 bg-[#F4EFE6]/84" />
          </div>
          <Container className="insights-foundation__camera relative">
            <div className="insights-foundation__header">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                  Decision mirror
                </p>
                <h2 className="mt-3 font-display text-display-sm font-normal text-soil">
                  Which tension feels most familiar?
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-foreground-secondary lg:justify-self-end">
                Five familiar symptoms lead to different strategic questions.
                Begin with the sentence closest to the business today; the
                mirror narrows the library to one useful first move.
              </p>
            </div>
            <InsightsDecisionMirror quests={readerQuests} />
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
                  posterPriority={false}
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
                  Evidence grows clearer when the weakest layers appear
                  together. The ledger turns scattered concern into a focused
                  first pass, then the checklist carries the review forward.
                </p>

                <InsightsEvidenceLedger layers={evidenceLayers} />
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
                    Keep the next brand decision close. Each note earns its
                    place.
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-7 text-ivory/75">
                    A single question, one practical lens, and a focused next
                    move—sent when a new essay can carry real weight.
                  </p>
                  <ol
                    className="insights-notes-scene__cadence"
                    aria-label="What each field note contains"
                  >
                    <li>
                      <span>01</span>
                      <strong>Question</strong>
                      <small>A tension worth examining</small>
                    </li>
                    <li>
                      <span>02</span>
                      <strong>Lens</strong>
                      <small>Evidence or framework to use</small>
                    </li>
                    <li>
                      <span>03</span>
                      <strong>Move</strong>
                      <small>A focused action to test</small>
                    </li>
                  </ol>
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
