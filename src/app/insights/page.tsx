import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { EarthlightInsightLibrary } from "@/sections/Insights/EarthlightInsightLibrary";
import { insightPosts, insightTopics } from "@/data/insights";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Brand strategy insights",
  description: "Practical essays and frameworks on brand positioning, brand audits, messaging, customer experience, distinctiveness, recognition, and memory.",
  keywords: ["brand strategy insights", "brand positioning", "brand audit", "brand messaging", "brand recall", "distinctive brand assets"],
  alternates: { canonical: "/insights", types: { "application/rss+xml": `${site.url}/insights/feed.xml` } },
  openGraph: {
    title: "Brand strategy insights | Branding Tatva",
    description: "Practical essays and frameworks on positioning, messaging, customer experience, distinctiveness, recognition, and memory.",
    type: "website",
    url: `${site.url}/insights`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function InsightsPage() {
  const sortedPosts = [...insightPosts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const featured = sortedPosts.find((post) => post.featured) ?? sortedPosts[0];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${site.url}/insights/#page`,
        url: `${site.url}/insights`,
        name: "Brand strategy insights",
        description: "Essays and practical frameworks on positioning, customer experience, distinctiveness, messaging, recognition, and brand memory.",
        isPartOf: { "@id": `${site.url}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: sortedPosts.length,
          itemListElement: sortedPosts.map((post, index) => ({ "@type": "ListItem", position: index + 1, url: `${site.url}/insights/${post.slug}`, name: post.title })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Insights", item: `${site.url}/insights` },
        ],
      },
    ],
  };

  const libraryPosts = sortedPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    topicSlug: post.topicSlug,
    readingTime: post.readingTime,
    updatedAt: post.updatedAt,
  }));

  return (
    <>
      <Header transparent />
      <main id="main-content" className="el-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <section className="el-hero" aria-labelledby="insights-title">
          <div className="el-hero__media" aria-hidden="true">
            <video autoPlay muted loop playsInline preload="metadata" poster="/images/pixabay-sea-of-fog-sunrise-poster.jpg">
              <source src="/videos/pixabay-sea-of-fog-sunrise.mp4" type="video/mp4" />
            </video>
            <div className="el-hero__veil" />
          </div>
          <div className="el-shell el-hero__content">
            <div className="el-hero__card">
              <p className="el-kicker">Insights</p>
              <h1 id="insights-title" className="el-display" style={{ marginTop: "1rem" }}>Brand strategy, explained from the <em>roots upward.</em></h1>
              <p className="el-lede">Field notes and practical frameworks on positioning, messaging, proof, customer experience, recognition, and the choices that build memory.</p>
              <div className="el-button-row">
                <Link className="el-button" href="#library">Search the library <span aria-hidden="true">↓</span></Link>
              </div>
            </div>
          </div>
        </section>

        {featured && (
          <section className="el-section" aria-labelledby="featured-title">
            <div className="el-shell el-featured-insight">
              <div className="el-featured-insight__media el-card">
                <Image src={featured.heroImage} alt={featured.heroImageAlt} fill priority sizes="(max-width: 820px) 100vw, 50vw" />
              </div>
              <div>
                <p className="el-kicker">Start here · {featured.readingTime}</p>
                <h2 id="featured-title" className="el-heading" style={{ marginTop: "1rem" }}>{featured.title}</h2>
                <p className="el-lede" style={{ marginTop: "1.25rem" }}>{featured.excerpt}</p>
                <div className="el-button-row" style={{ marginTop: "1.5rem" }}>
                  <Link className="el-button" href={`/insights/${featured.slug}`}>Read the foundation essay <span aria-hidden="true">→</span></Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="el-section el-section--mist" aria-labelledby="paths-title">
          <div className="el-shell">
            <div className="el-intro-grid">
              <div>
                <p className="el-kicker">Reading paths</p>
                <h2 id="paths-title" className="el-heading" style={{ marginTop: "1rem" }}>Begin with the condition you are trying to change.</h2>
              </div>
              <p className="el-lede">The library is organised by the five strategic forces, so you can find the most relevant thinking without scanning an endless wall of articles.</p>
            </div>
            <div className="el-card-grid" style={{ marginTop: "clamp(2.5rem,6vw,5rem)" }}>
              {insightTopics.map((topic) => (
                <article key={topic.slug} className="el-card el-detail-card" style={{ gridColumn: "span 4" }}>
                  <p className="el-kicker">{topic.eyebrow}</p>
                  <h3 style={{ marginTop: ".9rem" }}>{topic.name}</h3>
                  <p>{topic.promise}</p>
                  <Link href={`#library`} className="el-library__read">Explore this path <span aria-hidden="true">↓</span></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="library" className="el-section" aria-labelledby="library-title">
          <div className="el-shell">
            <div className="el-intro-grid">
              <div>
                <p className="el-kicker">The library</p>
                <h2 id="library-title" className="el-heading" style={{ marginTop: "1rem" }}>Search when you know the question. Browse when you do not.</h2>
              </div>
              <p className="el-lede">Every article is free to read. Use the topic filters or search plain language such as “homepage,” “rebrand,” “proof,” or “brand voice.”</p>
            </div>
            <EarthlightInsightLibrary posts={libraryPosts} topics={insightTopics.map(({ slug, name }) => ({ slug, name }))} />
          </div>
        </section>

        <section className="el-footer-cta" aria-labelledby="insights-cta-title">
          <video autoPlay muted loop playsInline preload="metadata" poster="/images/pixabay-stream-mist-rays-poster.jpg" aria-hidden="true">
            <source src="/videos/pixabay-stream-mist-rays.mp4" type="video/mp4" />
          </video>
          <div className="el-footer-cta__copy">
            <p className="el-kicker">From reading to decision</p>
            <h2 id="insights-cta-title" style={{ marginTop: "1rem" }}>When the question is specific to your business, bring it into the room.</h2>
            <div className="el-button-row">
              <Link className="el-button el-button--paper" href="/contact">Book a strategy session <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
