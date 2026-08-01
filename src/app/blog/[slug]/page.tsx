import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ElementGlyph } from "@/components/ElementGlyph";
import { PullQuote } from "@/components/PullQuote";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { blogPosts } from "@/data/blog";
import { elements } from "@/data/elements";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const element = elements.find((e) => e.slug === post.element);
  // Lands after the actual midpoint, but never on the lede (index 0) or
  // the closing paragraph, so it doesn't sit awkwardly against the
  // prev/next nav that immediately follows the body.
  const pullQuoteAfter = post.pullQuote
    ? Math.min(Math.max(1, Math.floor(post.body.length / 2) - 1), post.body.length - 2)
    : -1;
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const next = sorted.find((p) => p.slug !== post.slug);

  // Verified facts only, per the site's own structured-data rule
  // (see layout.tsx) — publish/author info, no invented engagement
  // numbers or aggregateRating.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    // No per-post photography exists yet — the site's own OG image is a
    // defensible fallback rather than fabricating a claim about a
    // specific image. No separate edit-tracking exists either, so
    // dateModified mirrors datePublished (accurate for an unedited post,
    // not an invented "last updated" claim).
    image: `${site.url}/opengraph-image`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@id": `${site.url}/#person` },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        {/* Asymmetric masthead, not a centered stack — the headline runs
            large and left in its own column, the meta block sits apart
            in its own right-hand column instead of stacking directly
            underneath, and a giant faint element-name watermark sits
            behind the whole thing (the same ghost-numeral technique
            already used on case studies and About, extended to a word
            here). This is the one page on the site that was still a
            plain centered template — every other page already got this
            kind of editorial variety across earlier rounds. Audit found
            this section had no video at all, the one remaining "blank
            section" bug class site-wide — this post's own already-tagged
            element (post.element) has a real video/poster pair in
            data/elements.ts, so the masthead now shows the same footage
            already used for that element elsewhere, not an arbitrary
            new choice. Overlay at bg-soil/80, the site's normalized
            standard. */}
        <section className="relative overflow-hidden bg-soil pt-32 pb-16 sm:pt-40 sm:pb-24">
          {element?.video && (
            <>
              <BackgroundVideo video={element.video} poster={element.image} />
              <div className="absolute inset-0 bg-soil/80" />
            </>
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 right-0 select-none whitespace-nowrap font-display text-[clamp(4rem,16vw,11rem)] font-bold uppercase leading-none text-ivory/[0.06]"
          >
            {element?.name ?? post.element}
          </span>
          <Container className="relative">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                  <ElementGlyph
                    slug={post.element}
                    className="h-3.5 w-3.5"
                    strokeWidth={1.6}
                    style={{ color: element?.color }}
                  />
                  {element?.name ?? post.element}
                </span>
                <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.1rem,6vw,4.25rem)] font-normal leading-[1.05] text-ivory">
                  {post.title}
                </h1>
              </Reveal>
              <Reveal delay={0.1} className="lg:pb-2 lg:text-right">
                <p className="text-sm text-ivory/70">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-1 text-sm text-ivory/70">{post.readingTime}</p>
                <p className="mt-1 text-sm text-ivory/70">{site.founder}</p>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* Sticky side rail alongside the article, not another centered
            column — the element glyph and a "back to all posts" link
            stay in view as the piece scrolls, so the page reads as an
            article inside a considered layout rather than a lone text
            block. The reading column itself stays a narrow, single
            measure (no asymmetry inside the prose) since long-form
            legibility shouldn't be traded away for a layout flourish. */}
        <section className="py-16 sm:py-20">
          <Container>
            <div className="lg:grid lg:grid-cols-[140px_1fr] lg:gap-12">
              <div className="hidden lg:block">
                <div className="sticky top-32 flex flex-col items-start gap-6">
                  <ElementGlyph
                    slug={post.element}
                    className="h-9 w-9"
                    strokeWidth={1.2}
                    style={{ color: element?.color }}
                  />
                  <div className="h-16 w-px" style={{ backgroundColor: `${element?.color ?? "#B85A34"}40` }} />
                  <Link href="/blog" className="link-underline text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                    &larr; All posts
                  </Link>
                  {/* Audit found every post ends with only two options,
                      back to the index or the next post, no path toward
                      the actual business goal. The case study template's
                      sidebar already carries a "Start a similar project"
                      link the same way; this mirrors it rather than a
                      full LinkButton, since the rail is only 140px wide. */}
                  <Link href="/contact" className="link-underline text-xs font-medium uppercase tracking-wide" style={{ color: element?.color }}>
                    Start a project &rarr;
                  </Link>
                </div>
              </div>

              <div className="max-w-2xl">
                <div className="space-y-6 text-foreground-secondary">
                  {/* Each paragraph gets its own Reveal instead of one
                      blanket fade around the whole article — on a
                      long-form reading page, a single flat entrance means
                      everything already below the fold pops in at once
                      the moment the article top scrolls into view. Per-
                      paragraph triggers (each with its own
                      useRevealTrigger/IntersectionObserver) fire naturally
                      as the reader actually scrolls to each one instead,
                      no artificial index-based delay needed. */}
                  {post.body.map((paragraph, i) => (
                    <Fragment key={i}>
                      <Reveal>
                        <p className={i === 0 ? "blog-lede text-lg text-soil" : undefined}>{paragraph}</p>
                      </Reveal>
                      {i === pullQuoteAfter && post.pullQuote && (
                        <Reveal>
                          <PullQuote quote={post.pullQuote} color={element?.color ?? "#B85A34"} />
                        </Reveal>
                      )}
                    </Fragment>
                  ))}
                </div>

                <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                    <Link href="/blog" className="link-underline text-sm font-medium text-soil lg:hidden">
                      &larr; All posts
                    </Link>
                    {/* Mirrors the sticky sidebar's CTA for mobile, where
                        that rail is hidden below lg. */}
                    <Link href="/contact" className="link-underline text-sm font-medium text-soil">
                      Start a project &rarr;
                    </Link>
                  </div>
                  {next && (
                    <Link
                      href={`/blog/${next.slug}`}
                      className="link-underline text-sm font-medium text-soil sm:ml-auto"
                    >
                      Next: {next.title} &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </div>
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
