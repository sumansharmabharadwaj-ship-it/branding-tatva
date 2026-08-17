import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { allTerms, findTerm } from "@/data/glossary";
import { blogPosts } from "@/data/blog";
import { site } from "@/data/site";

// One glossary term per route (bible §13: "glossary pages that link
// concepts to service and work examples"). Answer first — the short
// definition opens the page as a direct answer, the longer read
// follows, then the practice's own application and real internal
// paths onward. DefinedTerm + BreadcrumbList schema describe exactly
// what the visible page contains, nothing more.

export function generateStaticParams() {
  return allTerms.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ term: string }> }): Promise<Metadata> {
  const { term } = await params;
  const entry = findTerm(term);
  if (!entry) return {};
  return {
    title: `${entry.term} | Branding Glossary`,
    description: entry.definition,
    alternates: { canonical: `/glossary/${entry.slug}` },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params;
  const entry = findTerm(term);
  if (!entry) notFound();

  const siblings = entry.pillar.terms.filter((t) => t.slug !== entry.slug);
  const article = entry.pillar.articleSlug
    ? blogPosts.find((p) => p.slug === entry.pillar.articleSlug)
    : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        name: entry.term,
        description: entry.definition,
        url: `${site.url}/glossary/${entry.slug}`,
        inDefinedTermSet: { "@type": "DefinedTermSet", name: "Branding Tatva Glossary", url: `${site.url}/glossary` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Insights", item: `${site.url}/insights` },
          { "@type": "ListItem", position: 2, name: "Glossary", item: `${site.url}/glossary` },
          { "@type": "ListItem", position: 3, name: entry.term, item: `${site.url}/glossary/${entry.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <Header transparent />
      <main id="main-content">
        {/* Was one flat cream section carrying breadcrumb, definition,
            practice note, questions and related pills all at one visual
            volume. The term now gets a dark masthead of its own, so the
            page inherits the light to dark chapter grammar the rest of
            the site reads by, and the definition lands as a statement
            rather than as the third paragraph in a stack. */}
        <section className="relative overflow-hidden bg-soil pb-16 pt-36 sm:pt-44">
          <BackgroundVideo
            video="/videos/pexels-dandelion-release.mp4"
            poster="/images/pexels-dandelion-release-poster.jpg"
            imagePosition="center"
            parallax
            playbackRate={0.9}
          />
          <div className="absolute inset-0 bg-soil/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-soil via-soil/70 to-soil/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-soil/80 via-transparent to-soil/25" />
          <Container className="relative max-w-2xl">
            <Reveal>
              <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.15em] text-ivory/60">
                <Link href="/insights" className="link-underline">
                  Insights
                </Link>
                <span aria-hidden="true" className="mx-2">
                  /
                </span>
                <Link href="/glossary" className="link-underline">
                  Glossary
                </Link>
              </nav>
              <p className="mt-6 text-sm font-medium uppercase tracking-wide text-sandstone">{entry.pillar.name}</p>
            </Reveal>
            <SplitReveal as="h1" className="mt-2 font-display text-display-md font-normal text-ivory">
              {entry.term}
            </SplitReveal>
            <Reveal delay={0.08}>
              <span aria-hidden="true" className="mt-6 block h-px w-16 bg-sandstone/70" />
              <p className="mt-6 font-display text-xl italic leading-relaxed text-ivory sm:text-2xl">
                {entry.definition}
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="pb-20 pt-14">
          <Container className="max-w-2xl">
            <Reveal>
              <p className="text-base leading-relaxed text-foreground-secondary">{entry.expanded}</p>
            </Reveal>

            <Reveal>
              <div className="mt-10 border-l-2 border-clay/60 pl-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground-secondary/70">
                  In this practice
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground-secondary">{entry.practice}</p>
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-12 border-t border-border pt-8">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground-secondary/70">
                  Questions this pillar answers
                </p>
                <ul className="mt-3 space-y-2">
                  {entry.pillar.questions.map((q) => (
                    <li key={q} className="text-sm leading-relaxed text-foreground-secondary before:mr-2 before:content-['·']">
                      {q}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-2 text-sm">
                  {article && (
                    <Link href={`/insights/${article.slug}`} className="link-underline inline-flex items-center gap-2 text-clay">
                      Read: {article.title} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                  <Link href="/services#offerings" className="link-underline inline-flex items-center gap-2 text-clay">
                    The service paths that apply this <span aria-hidden="true">→</span>
                  </Link>
                  <Link href="/work" className="link-underline inline-flex items-center gap-2 text-clay">
                    The work where these decisions show <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </Reveal>

            {siblings.length > 0 && (
              <Reveal>
                <div className="mt-12 border-t border-border pt-8">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground-secondary/70">
                    Related terms
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {siblings.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/glossary/${s.slug}`}
                          className="inline-block rounded-full border border-border px-4 py-1.5 text-sm text-foreground-secondary transition-colors duration-300 hover:border-clay hover:text-clay"
                        >
                          {s.term}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </Container>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
