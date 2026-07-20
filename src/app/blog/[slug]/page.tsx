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
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
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
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: site.founder, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <Header transparent />
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-border bg-soil pt-32 pb-16 sm:pt-40 sm:pb-20">
          <Container className="relative max-w-2xl">
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
              <h1 className="mt-6 font-display text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-[1.1] text-ivory">
                {post.title}
              </h1>
              <p className="mt-4 text-sm text-ivory/60">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                {" · "}
                {post.readingTime}
                {" · "}
                {site.founder}
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="py-16">
          <Container className="max-w-2xl">
            <Reveal className="space-y-6 text-foreground-secondary">
              {post.body.map((paragraph, i) => (
                <Fragment key={i}>
                  <p className={i === 0 ? "text-lg text-soil" : undefined}>{paragraph}</p>
                  {i === pullQuoteAfter && post.pullQuote && (
                    <PullQuote quote={post.pullQuote} color={element?.color ?? "#B85A34"} />
                  )}
                </Fragment>
              ))}
            </Reveal>

            <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/blog" className="link-underline text-sm font-medium text-soil">
                &larr; All posts
              </Link>
              {next && (
                <Link
                  href={`/blog/${next.slug}`}
                  className="link-underline text-sm font-medium text-soil"
                >
                  Next: {next.title} &rarr;
                </Link>
              )}
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
