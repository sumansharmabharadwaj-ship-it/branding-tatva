import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import { InsightDecisionPath } from "@/components/InsightDecisionPath";
import { InsightCard } from "@/components/InsightCard";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { TexturedDark } from "@/components/TexturedDark";
import { elements } from "@/data/elements";
import { getInsightApplication } from "@/data/insightApplications";
import {
  getInsightBySlug,
  getInsightTopic,
  insightPosts,
  type InsightPost,
} from "@/data/insights";
import { getInsightPathway } from "@/data/insightPathways";
import { packages } from "@/data/services";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { Header } from "@/layouts/Header";
import { searchRobotsMetadata } from "@/lib/searchVisibility";
import { Footer } from "@/sections/Footer";
import { InsightFrameworkVisualizer } from "@/sections/Insights/InsightFrameworkVisualizer";
import {
  InsightReadingIndex,
  InsightReadingRail,
} from "@/sections/Insights/InsightReadingRail";
import "./insights-article-cinematic.css";

type Props = {
  params: Promise<{ slug: string }>;
};

type InsightResearchSource = {
  title: string;
  publisher: string;
  url: string;
  note?: string;
};

type InsightPostWithSources = InsightPost & {
  sources?: InsightResearchSource[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function countWords(post: InsightPost) {
  const content = [
    post.title,
    post.directAnswer,
    ...post.keyTakeaways,
    post.framework.introduction,
    ...post.framework.steps.flatMap((step) => [step.title, step.description]),
    ...post.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.bullets ?? []),
      section.callout?.text ?? "",
    ]),
    ...post.faq.flatMap((item) => [item.question, item.answer]),
  ].join(" ");

  return content.trim().split(/\s+/).length;
}

export function generateStaticParams() {
  return insightPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsightBySlug(slug);

  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.excerpt,
    keywords: [post.primaryKeyword, ...post.secondaryKeywords],
    authors: [{ name: site.founder, url: `${site.url}/about` }],
    creator: site.founder,
    publisher: site.name,
    category: getInsightTopic(post.topicSlug)?.name,
    alternates: { canonical: `/insights/${post.slug}` },
    robots: searchRobotsMetadata(),
    openGraph: {
      title: post.seoTitle,
      description: post.excerpt,
      type: "article",
      url: `${site.url}/insights/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [site.founder],
      images: [{ url: post.heroImage, alt: post.heroImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.excerpt,
      images: [post.heroImage],
    },
  };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getInsightBySlug(slug);

  if (!post) notFound();

  const sources = (post as InsightPostWithSources).sources ?? [];
  const element = elements.find((item) => item.slug === post.element);
  const topic = getInsightTopic(post.topicSlug);
  const pathway = getInsightPathway(post.topicSlug);
  const color = element?.color ?? "#B85A34";
  const application = getInsightApplication(post.topicSlug);
  const applicationProof = projects.find(
    (project) => project.slug === application?.projectSlug
  );
  const applicationPackage = packages.find(
    (pkg) => pkg.slug === application?.packageSlug
  );
  const related = post.relatedSlugs
    .map((relatedSlug) => getInsightBySlug(relatedSlug))
    .filter((item): item is InsightPost => Boolean(item))
    .slice(0, 3);
  const readingRailItems = [
    { id: "key-takeaways", label: "Argument" },
    { id: "working-framework", label: post.framework.title },
    ...post.sections.map((section) => ({
      id: section.id,
      label: section.heading,
    })),
    { id: "frequent-questions", label: "Questions" },
    ...(sources.length > 0
      ? [{ id: "research-sources", label: "Sources" }]
      : []),
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${site.url}/insights/${post.slug}/#article`,
        url: `${site.url}/insights/${post.slug}`,
        headline: post.title,
        description: post.excerpt,
        image: {
          "@type": "ImageObject",
          url: `${site.url}${post.heroImage}`,
          caption: post.heroImageAlt,
        },
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: "en",
        articleSection: topic?.name,
        keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(", "),
        wordCount: countWords(post),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${site.url}/insights/${post.slug}`,
        },
        author: {
          "@type": "Person",
          "@id": `${site.url}/#person`,
          name: site.founder,
          url: `${site.url}/about`,
          sameAs: [site.social.linkedin],
        },
        publisher: { "@id": `${site.url}/#organization` },
        isPartOf: { "@id": `${site.url}/insights/#page` },
        about: [post.primaryKeyword, ...post.secondaryKeywords],
        ...(sources.length > 0
          ? { citation: sources.map((source) => source.url) }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Insights",
            item: `${site.url}/insights`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: topic?.name ?? "Topic",
            item: `${site.url}/insights/topic/${post.topicSlug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: post.title,
            item: `${site.url}/insights/${post.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main
        id="main-content"
        className="insight-article-page"
        style={{ "--article-accent": color } as CSSProperties}
      >
        <article>
          <header className="insight-article-hero relative flex items-end overflow-hidden bg-soil pb-14 pt-36 sm:pb-20 sm:pt-44">
            {post.heroVideo ? (
              <BackgroundVideo video={post.heroVideo} poster={post.heroImage} />
            ) : (
              <Image
                src={post.heroImage}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-soil/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-soil via-soil/35 to-soil/10" />

            <Container className="relative">
              <nav
                aria-label="Breadcrumb"
                className="mb-8 flex flex-wrap items-center gap-2 text-xs text-ivory/65"
              >
                <Link href="/" className="transition hover:text-ivory">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/insights" className="transition hover:text-ivory">
                  Insights
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/insights/topic/${post.topicSlug}`}
                  className="transition hover:text-ivory"
                >
                  {topic?.name}
                </Link>
              </nav>

              <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-ivory/20 bg-soil/25 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ivory backdrop-blur-xl">
                    <ElementGlyph
                      slug={post.element}
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      style={{ color }}
                    />
                    {topic?.name}
                  </div>
                  <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.6rem,6vw,5.8rem)] font-normal leading-[0.96] text-ivory">
                    {post.title}
                  </h1>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="rounded-[1.5rem] border border-ivory/15 bg-soil/30 p-6 text-ivory shadow-elevation-md backdrop-blur-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sandstone">
                      The direct answer
                    </p>
                    <p className="mt-4 text-sm leading-7 text-ivory/85">
                      {post.directAnswer}
                    </p>
                    <div className="mt-6 grid gap-2 border-t border-ivory/15 pt-5 text-xs text-ivory/60">
                      <span>By {site.founder}</span>
                      <span>Published {formatDate(post.publishedAt)}</span>
                      <span>Updated {formatDate(post.updatedAt)}</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </Container>
          </header>

          <InsightReadingRail items={readingRailItems} accent={color} />

          <section className="bg-ivory py-16 sm:py-20">
            <Container>
              <div className="grid gap-12 xl:grid-cols-[13rem_minmax(0,48rem)_14rem] xl:items-start xl:justify-between">
                <aside className="hidden xl:block">
                  <InsightReadingIndex items={readingRailItems} accent={color} />
                </aside>

                <div className="min-w-0">
                  <Reveal>
                    <section
                      id="key-takeaways"
                      aria-labelledby="takeaways-heading"
                      className="scroll-mt-32 rounded-[1.5rem] border border-soil/10 bg-background-elevated p-6 shadow-elevation-sm sm:p-8"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                        Key takeaways
                      </p>
                      <h2
                        id="takeaways-heading"
                        className="mt-3 font-display text-3xl font-normal text-soil"
                      >
                        The argument in five lines.
                      </h2>
                      <ul className="mt-6 grid gap-4">
                        {post.keyTakeaways.map((takeaway) => (
                          <li key={takeaway} className="flex gap-4 text-sm leading-7 text-soil/80">
                            <span
                              className="mt-2.5 h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: color }}
                              aria-hidden="true"
                            />
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </Reveal>

                  <Reveal>
                    <InsightFrameworkVisualizer
                      framework={post.framework}
                      element={post.element}
                      accent={color}
                    />
                  </Reveal>

                  <div className="pt-4">
                    {post.sections.map((section, sectionIndex) => (
                      <Reveal key={section.id}>
                        <section
                          id={section.id}
                          className="insight-article-section scroll-mt-32 pt-16"
                        >
                          <p
                            className="insight-article-section__kicker"
                            aria-hidden="true"
                          >
                            <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                            Field chapter
                          </p>
                          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-normal leading-tight text-soil">
                            {section.heading}
                          </h2>
                          <div className="mt-6 space-y-6 text-base leading-8 text-foreground-secondary">
                            {section.paragraphs.map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                          </div>

                          {section.bullets && (
                            <ul className="mt-8 grid gap-3 rounded-[1.25rem] border border-border bg-background-alt p-6">
                              {section.bullets.map((bullet) => (
                                <li key={bullet} className="flex gap-3 text-sm leading-7 text-soil/80">
                                  <span
                                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: color }}
                                    aria-hidden="true"
                                  />
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          )}

                          {section.callout && (
                            <blockquote
                              className="mt-8 rounded-[1.5rem] border-l-4 bg-soil px-6 py-7 text-ivory sm:px-8"
                              style={{ borderLeftColor: color }}
                            >
                              <p
                                className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]"
                                style={{ color }}
                              >
                                {section.callout.label}
                              </p>
                              <p className="mt-3 font-display text-2xl leading-snug">
                                {section.callout.text}
                              </p>
                            </blockquote>
                          )}

                          {sectionIndex === Math.floor(post.sections.length / 2) && (
                            <aside
                              className="insight-decision-bridge"
                              aria-label="Decision connection"
                            >
                              <p className="insight-decision-bridge__label">
                                Decision bridge
                              </p>
                              <div className="insight-decision-bridge__map">
                                <div className="insight-decision-bridge__node">
                                  <span>Current layer</span>
                                  <p>{section.heading}</p>
                                </div>
                                <div className="insight-decision-bridge__line" aria-hidden="true" />
                                <div className="insight-decision-bridge__node">
                                  <span>Connected layer</span>
                                  <p>
                                    {post.sections[sectionIndex + 1]?.heading ??
                                      post.framework.title}
                                  </p>
                                </div>
                              </div>
                              <p className="insight-decision-bridge__note">
                                A useful brand system carries one decision into
                                the next, preserving meaning as the context changes.
                              </p>
                            </aside>
                          )}
                        </section>
                      </Reveal>
                    ))}
                  </div>

                  <Reveal>
                    <section
                      id="frequent-questions"
                      aria-labelledby="faq-heading"
                      className="scroll-mt-32 pt-20"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                        Frequent questions
                      </p>
                      <h2
                        id="faq-heading"
                        className="mt-4 font-display text-display-sm font-normal text-soil"
                      >
                        The questions that usually follow.
                      </h2>
                      <div className="mt-8 divide-y divide-border border-y border-border">
                        {post.faq.map((item) => (
                          <details key={item.question} className="group py-5">
                            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-medium text-soil">
                              <span>{item.question}</span>
                              <span
                                aria-hidden="true"
                                className="text-xl leading-none transition group-open:rotate-45"
                                style={{ color }}
                              >
                                +
                              </span>
                            </summary>
                            <p className="max-w-2xl pt-4 text-sm leading-7 text-foreground-secondary">
                              {item.answer}
                            </p>
                          </details>
                        ))}
                      </div>
                    </section>
                  </Reveal>

                  {sources.length > 0 && (
                    <Reveal>
                      <section
                        id="research-sources"
                        aria-labelledby="research-sources-heading"
                        className="scroll-mt-32 pt-20"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                          Research sources
                        </p>
                        <h2
                          id="research-sources-heading"
                          className="mt-4 font-display text-display-sm font-normal text-soil"
                        >
                          The evidence beneath the method.
                        </h2>
                        <p className="mt-5 max-w-2xl text-base leading-8 text-foreground-secondary">
                          These sources establish the research principles used
                          in this guide. Branding Tatva&apos;s framework is the
                          practical application of that evidence to service
                          businesses and founder-led brands.
                        </p>
                        <ol className="mt-8 grid gap-4">
                          {sources.map((source, index) => (
                            <li
                              key={source.url}
                              className="rounded-[1.25rem] border border-soil/10 bg-background-alt p-5 sm:p-6"
                            >
                              <div className="flex gap-4">
                                <span
                                  className="font-display text-2xl leading-none"
                                  style={{ color }}
                                  aria-hidden="true"
                                >
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <div className="min-w-0">
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-underline font-medium text-soil"
                                  >
                                    {source.title}
                                    <span aria-hidden="true"> ↗</span>
                                  </a>
                                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-clay">
                                    {source.publisher}
                                  </p>
                                  {source.note && (
                                    <p className="mt-3 text-sm leading-7 text-foreground-secondary">
                                      {source.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </section>
                    </Reveal>
                  )}

                  <Reveal>
                    <aside className="mt-16 grid gap-6 rounded-[1.5rem] border border-soil/10 bg-background-alt p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${color}16` }}
                      >
                        <ElementGlyph
                          slug={post.element}
                          className="h-8 w-8"
                          strokeWidth={1.2}
                          style={{ color }}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                          Written by {site.founder}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-foreground-secondary">
                          Suman studies how attention, language, perception,
                          and memory shape the way people understand a
                          business, then turns those observations into brand
                          decisions a founder can use.
                        </p>
                        <Link
                          href="/about"
                          className="link-underline mt-4 inline-block text-sm font-medium text-soil"
                        >
                          Read the background <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </aside>
                  </Reveal>

                  <Reveal>
                    <InsightDecisionPath pathway={pathway} className="mt-16" />
                  </Reveal>
                </div>

                <aside className="hidden xl:block">
                  <div className="sticky top-28 space-y-6">
                    <div className="rounded-[1.25rem] border border-border bg-background-elevated p-5">
                      <ElementGlyph
                        slug={post.element}
                        className="h-8 w-8"
                        strokeWidth={1.2}
                        style={{ color }}
                      />
                      <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground-secondary">
                        Reading path
                      </p>
                      <Link
                        href={`/insights/topic/${post.topicSlug}`}
                        className="mt-2 block font-display text-2xl text-soil"
                      >
                        {topic?.name}
                      </Link>
                      <p className="mt-3 text-xs leading-5 text-foreground-secondary">
                        {topic?.promise}
                      </p>
                    </div>
                    {application && applicationProof && applicationPackage && (
                      <div className="insight-application-card">
                        <p>From reading to application</p>
                        <Link href={`/work/${applicationProof.slug}`}>
                          <small>Published project record</small>
                          <strong>{applicationProof.title}</strong>
                          <span>{application.proofFrame}</span>
                        </Link>
                        <Link href={`/services#package-${applicationPackage.slug}`}>
                          <small>Strategy path</small>
                          <strong>{applicationPackage.name}</strong>
                          <span>{application.serviceFrame}</span>
                        </Link>
                      </div>
                    )}
                    <Link
                      href={pathway.service.href}
                      className="link-underline block text-xs font-semibold uppercase tracking-[0.14em]"
                      style={{ color }}
                    >
                      {pathway.service.label}
                    </Link>
                  </div>
                </aside>
              </div>
            </Container>
          </section>
        </article>

        {related.length > 0 && (
          <section className="relative overflow-hidden bg-background-alt py-20 sm:py-28">
            <BackgroundVideo
              video="/videos/generated/bt-insights-related-tributaries.mp4"
              poster="/images/generated/bt-insights-related-tributaries-poster.jpg"
              imagePosition="center"
              parallax
              playbackRate={0.9}
            />
            <div className="absolute inset-0 bg-ivory/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/75 to-ivory/55" />
            <Container className="relative">
              <Reveal>
                <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                      Continue the thread
                    </p>
                    <h2 className="mt-4 font-display text-display-md font-normal text-soil">
                      The next useful questions.
                    </h2>
                  </div>
                  <p className="max-w-2xl text-base leading-7 text-foreground-secondary lg:justify-self-end">
                    Brand decisions rarely live alone. These essays connect the
                    current question with the foundation, language, experience,
                    or memory around it.
                  </p>
                </div>
              </Reveal>
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {related.map((relatedPost, index) => (
                  <Reveal key={relatedPost.slug} delay={index * 0.05}>
                    <InsightCard post={relatedPost} />
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        )}

        <TexturedDark
          image="/images/generated/bt-insights-topic-across-system-poster.jpg"
          video="/videos/generated/bt-insights-topic-across-system.mp4"
          className="py-24 text-center sm:py-28"
        >
          <Container>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone">
                Apply the thinking
              </p>
              <h2 className="mx-auto mt-4 max-w-3xl font-display text-display-md font-normal text-ivory">
                A clear diagnosis makes the next brand decision smaller.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-ivory/75">
                Bring the question, the current materials, and the part that
                keeps refusing to hold together.
              </p>
              <div className="mt-8">
                <LinkButton href="/contact">Start a brand conversation</LinkButton>
              </div>
            </Reveal>
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
