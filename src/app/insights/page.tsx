import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import type { InsightCardPost } from "@/components/InsightCard";
import { InsightsExplorer } from "@/components/InsightsExplorer";
import { PhotoHero } from "@/components/PhotoHero";
import { Reveal } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SplitReveal } from "@/components/SplitReveal";
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
import { InsightsFieldNotesResolution } from "@/sections/Insights/InsightsFieldNotesResolution";
import { InsightsFooterInvitation } from "@/sections/Insights/InsightsFooterInvitation";
import { InsightsKnowledgeAtlas } from "@/sections/Insights/InsightsKnowledgeAtlas";
import {
  InsightsSceneNavigator,
  type InsightScene,
} from "@/sections/Insights/InsightsSceneNavigator";
import "../insights-cinematic.css";
import "./insights-worksheet.css";
import "./insights-editorial-sections.css";

export const metadata: Metadata = {
  title: "Insights on brand strategy, positioning, and messaging",
  description:
    "Essays for founders deciding how their business should be positioned, explained, experienced, recognised, and remembered.",
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
      "Essays for founders making decisions about positioning, messaging, customer experience, distinctiveness, recognition, and memory.",
    type: "website",
    url: `${site.url}/insights`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

function elementColor(elementSlug: string) {
  return elements.find((element) => element.slug === elementSlug)?.color ?? "#B85A34";
}

const INSIGHT_SCENES: InsightScene[] = [
  {
    id: "insights-foundation",
    label: "Problem finder",
    shortLabel: "Problems",
    theme: "light",
    accent: "#D77A51",
  },
  {
    id: "knowledge-atlas",
    label: "Topic map",
    shortLabel: "Topics",
    theme: "light",
    accent: "#7FA4BA",
  },
  {
    id: "insights-library-scene",
    label: "Essay library",
    shortLabel: "Library",
    theme: "light",
    accent: "#A8B68F",
  },
  {
    id: "insights-audit-seam",
    label: "Audit worksheet",
    shortLabel: "Worksheet",
    theme: "light",
    accent: "#D77A51",
  },
  {
    id: "insights-field-notes",
    label: "Occasional letters",
    shortLabel: "Letters",
    theme: "light",
    accent: "#D7A84A",
  },
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

const EVIDENCE_LAYER_BLUEPRINTS: Array<
  Omit<EvidenceLayer, "element" | "service">
> = [
  {
    slug: "foundation",
    topicSlug: "positioning",
    name: "Foundation",
    question: "Do buyers know why they should choose you?",
    signal: "Different buyers place the business in different categories.",
    evidence: "Buyer language · reasons deals are lost · offer comparisons",
    move: "Compare buyer language, reasons deals are lost, and offer comparisons in one table.",
  },
  {
    slug: "message",
    topicSlug: "brand-messaging",
    name: "Message",
    question: "Can your website explain the value without you?",
    signal: "Calls explain the value faster than the website.",
    evidence: "Homepage hierarchy · proposal language · recurring objections",
    move: "Place homepage claims beside sales call phrasing and recurring objections.",
  },
  {
    slug: "identity",
    topicSlug: "distinctive-brand",
    name: "Identity",
    question: "Would anyone recognise you without the logo?",
    signal: "Recognition fades when the logo leaves the frame.",
    evidence: "Distinctive cues · competitor similarity · channel consistency",
    move: "Test which cues people recognise before the logo appears.",
  },
  {
    slug: "experience",
    topicSlug: "customer-experience",
    name: "Experience",
    question: "Does the experience live up to the promise?",
    signal: "Confidence drops between enquiry and delivery.",
    evidence: "Response gaps · handoffs · promise beside experience",
    move: "Trace confidence from enquiry through handoff and delivery.",
  },
  {
    slug: "memory",
    topicSlug: "brand-memory",
    name: "Memory",
    question: "What do people remember when you leave?",
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
    heroVideo: post.heroVideo,
    heroImageAlt: post.heroImageAlt,
    keyTakeaways: post.keyTakeaways,
    frameworkTitle: post.framework.title,
    frameworkStepCount: post.framework.steps.length,
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
        "Which decision would change the most downstream work?",
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
      const topic = insightTopics.find(
        (candidate) => candidate.slug === layer.topicSlug,
      );
      const application = getInsightApplication(layer.topicSlug);
      const servicePackage = packages.find(
        (pkg) => pkg.slug === application?.packageSlug,
      );

      if (!topic || !application || !servicePackage) {
        throw new Error(`Missing verified evidence route for ${layer.topicSlug}`);
      }

      return {
        ...layer,
        element: topic.element,
        service: {
          slug: servicePackage.slug,
          name: servicePackage.name,
          frame: application.serviceFrame,
        },
      };
    },
  );
  const fieldNotesPaths = atlasPaths.map(({ slug, name, element }) => ({
    slug,
    name,
    element,
  }));
  const footerPaths = atlasPaths.map(
    ({ slug, name, element, service }) => ({
      slug,
      name,
      element,
      service: {
        slug: service.slug,
        name: service.name,
      },
    }),
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
                  <p className="insights-hero__eyebrow">For founders making brand decisions</p>
                </Reveal>
                <SplitReveal
                  as="h1"
                  className="insights-hero__title text-ivory"
                >
                  Start with the sentence you keep repeating in meetings.
                </SplitReveal>
                <Reveal delay={0.1}>
                  <p className="insights-hero__summary">
                    Choose the problem that sounds familiar. The library connects it to the
                    relevant question, evidence, essay, and service.
                  </p>
                  <Link href="#insights-foundation" className="insights-hero__link">
                    Find the closest business problem <span aria-hidden="true">↓</span>
                  </Link>
                </Reveal>
              </div>
              <Reveal delay={0.16}>
                <div className="insights-hero__ledger">
                  <div className="insights-hero__ledger-top">
                    <p className="insights-hero__ledger-label">Published thinking</p>
                    <p className="insights-hero__ledger-count">
                      {sortedPosts.length}
                      <small>essays</small>
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
          <Container className="insights-foundation__camera relative">
            <p className="insights-section-kicker"><span>01 / Problem finder</span><i aria-hidden="true" /><span>05 starting points</span></p>
            <div className="insights-foundation__header">
              <div>
                <h2 className="mt-3 font-display text-display-sm font-normal text-soil">
                  Which problem sounds familiar?
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-foreground-secondary lg:justify-self-end">
                Choose what you keep hearing from buyers. Start with the question
                behind it, then read the essay that helps you investigate.
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
          className="insights-audit-scene insights-audit-scene--worksheet insights-scene bg-ivory"
          data-scene-active="false"
          aria-labelledby="insights-worksheet-title"
        >
          <Container className="insights-audit-scene__camera">
            <div className="insights-worksheet-eyebrow">
              <span>Audit worksheet</span>
              <i aria-hidden="true" />
              <span>05 checks</span>
            </div>
            <header className="insights-worksheet-intro">
              <h2 id="insights-worksheet-title">
                Before you rebuild,<br />find the weak point.
              </h2>
              <p>
                A new identity cannot fix an unclear offer. Check what buyers
                understand, recognise, and remember. Mark what needs a closer look.
              </p>
            </header>
            <InsightsEvidenceLedger layers={evidenceLayers} />
          </Container>
        </section>

        <div
          id="insights-field-notes"
          className="insights-scene"
          data-scene-active="false"
        >
          <section className="insights-notes-scene" aria-label="Occasional letters">
            <Container className="insights-notes-scene__camera">
              <p className="insights-section-kicker"><span>05 / Occasional letters</span><i aria-hidden="true" /><span>From Suman</span></p>
              <InsightsFieldNotesResolution paths={fieldNotesPaths} />
            </Container>
          </section>
        </div>
      </main>
      <Footer
        className="insights-footer"
        intro={<InsightsFooterInvitation paths={footerPaths} />}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
