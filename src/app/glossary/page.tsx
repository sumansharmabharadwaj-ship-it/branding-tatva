import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { pillars } from "@/data/glossary";
import { site } from "@/data/site";

// The glossary index — the practice's working vocabulary as crawlable
// routes (governing bible §12–§13: glossary pages linking concepts to
// service and work examples). The Insights page keeps its in-place
// pillar explorer; this route exists so every term has a stable,
// linkable, answer-first page of its own. Static server rendering
// throughout: reading content, zero interaction islands.

export const metadata: Metadata = {
  title: "Brand Strategy Terms for Founders",
  description:
    "Plain language definitions for the brand strategy terms founders meet when choosing a position, message, identity, or offer structure.",
  alternates: { canonical: "/glossary" },
};

// Every /glossary/[term] page publishes a DefinedTerm naming this route as
// its inDefinedTermSet, but the set itself was never published anywhere, so
// ten pages each claimed membership of a parent node that did not exist.
// This declares it, with all ten terms and their real definitions inline,
// which is also the form an answer engine can quote one definition out of
// without crawling ten further routes.
//
// The pillars carry a `questions` array too, and the obvious move would be a
// FAQPage built from it. Those questions have no stored answers: the answer
// is the linked article, in full prose. Emitting FAQPage would mean
// authoring answers here purely for crawlers, which is fabricated content by
// another name, and the exact pattern search engines penalise.
const glossarySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DefinedTermSet",
      "@id": `${site.url}/glossary`,
      name: "Branding Tatva Glossary",
      url: `${site.url}/glossary`,
      description:
        "Plain language definitions for the brand strategy terms founders meet when choosing a position, message, identity, or offer structure.",
      publisher: { "@id": `${site.url}/#organization` },
      hasDefinedTerm: pillars.flatMap((pillar) =>
        pillar.terms.map((t) => ({
          "@type": "DefinedTerm",
          name: t.term,
          description: t.definition,
          url: `${site.url}/glossary/${t.slug}`,
          termCode: t.slug,
          inDefinedTermSet: { "@id": `${site.url}/glossary` },
        })),
      ),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Insights", item: `${site.url}/insights` },
        { "@type": "ListItem", position: 2, name: "Glossary", item: `${site.url}/glossary` },
      ],
    },
  ],
};

export default function GlossaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossarySchema) }}
      />
      <Header transparent />
      <main id="main-content">
        {/* This was the only top level route opening straight onto flat
            cream with no masthead at all. It now takes the same dark
            chapter opening every other section of the site uses, and the
            headline arrives word by word like every other page h1. */}
        <section className="relative overflow-hidden bg-soil pb-20 pt-36 sm:pb-24 sm:pt-44">
          <BackgroundVideo
            video="/videos/generated/bt-glossary-living-language.mp4"
            poster="/images/generated/bt-glossary-living-language-poster.jpg"
            imagePosition="center"
            parallax
            playbackRate={0.9}
            posterPriority
          />
          <div className="absolute inset-0 bg-soil/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-soil via-soil/70 to-soil/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-soil/85 via-transparent to-soil/25" />
          <Container className="relative max-w-3xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Glossary</p>
            </Reveal>
            <SplitReveal as="h1" className="mt-2 font-display text-display-md font-normal text-ivory">
              Brand strategy language, without the fog.
            </SplitReveal>
            <Reveal delay={0.1}>
              <span aria-hidden="true" className="mt-6 block h-px w-16 bg-sandstone/70" />
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/75">
                Use these definitions to name the decision in front of you,
                question advice precisely, and brief the work with less guesswork.
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-ivory py-16 sm:py-20">
          <Container className="max-w-3xl">
            <div className="space-y-12">
              {pillars.map((pillar) => (
                <Reveal key={pillar.id}>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground-secondary/70">
                    {pillar.name}
                  </p>
                  <ul className="mt-4 divide-y divide-border border-y border-border">
                    {pillar.terms.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/glossary/${t.slug}`}
                          className="group flex items-baseline justify-between gap-6 py-4"
                        >
                          <span>
                            <span className="font-display text-xl font-normal text-soil transition-colors duration-300 group-hover:text-clay">
                              {t.term}
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-foreground-secondary">
                              {t.definition}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="shrink-0 text-clay transition-transform duration-300 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
