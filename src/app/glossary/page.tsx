import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { pillars } from "@/data/glossary";

// The glossary index — the practice's working vocabulary as crawlable
// routes (governing bible §12–§13: glossary pages linking concepts to
// service and work examples). The Insights page keeps its in-place
// pillar explorer; this route exists so every term has a stable,
// linkable, answer-first page of its own. Static server rendering
// throughout: reading content, zero interaction islands.

export const metadata: Metadata = {
  title: "Branding Glossary",
  description:
    "The Branding Tatva working vocabulary: positioning, distinctive assets, mental availability, verbal identity, and more, each defined in plain language.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        {/* This was the only top level route opening straight onto flat
            cream with no masthead at all. It now takes the same dark
            chapter opening every other section of the site uses, and the
            headline arrives word by word like every other page h1. */}
        <section className="relative overflow-hidden bg-soil pb-20 pt-36 sm:pb-24 sm:pt-44">
          <BackgroundVideo
            video="/videos/glossary-language-roots-film-v2.mp4"
            poster="/images/glossary-language-roots-film-v2-poster.jpg"
            imagePosition="center"
            parallax
            playbackRate={0.86}
          />
          <div className="absolute inset-0 bg-soil/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-soil via-soil/70 to-soil/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-soil/85 via-transparent to-soil/25" />
          <Container className="relative max-w-3xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Glossary</p>
            </Reveal>
            <SplitReveal as="h1" className="mt-2 font-display text-display-md font-normal text-ivory">
              The working vocabulary of brand strategy.
            </SplitReveal>
            <Reveal delay={0.1}>
              <span aria-hidden="true" className="mt-6 block h-px w-16 bg-sandstone/70" />
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/75">
                Every term defined in plain language, connected to the questions it answers and the places this
                practice applies it.
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
