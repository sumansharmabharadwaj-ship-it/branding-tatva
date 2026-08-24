import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { entityFacts } from "@/data/entityFacts";
import { site } from "@/data/site";
import { Header } from "@/layouts/Header";
import { pageSchema } from "@/lib/pageSchema";
import { Footer } from "@/sections/Footer";

const description =
  "How Branding Tatva handles authorship, evidence, sources, corrections, independent studies, concept work, and diagnostic limitations.";

export const metadata: Metadata = {
  title: "Editorial and Evidence Policy",
  description,
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: "Editorial and Evidence Policy | Branding Tatva",
    description,
    type: "website",
    url: `${site.url}/editorial-policy`,
  },
};

const structuredData = pageSchema({
  type: "WebPage",
  path: "/editorial-policy",
  name: "Editorial and Evidence Policy | Branding Tatva",
  description,
  trail: [{ name: "Editorial and Evidence Policy", path: "/editorial-policy" }],
});

const principles = [
  {
    title: "One visible author",
    body: `${site.founder} is identified as the author of Branding Tatva guides. Editorial pages show publication and update dates so a reader can judge recency.`,
  },
  {
    title: "Claims stay beside evidence",
    body: "Commercial outcomes, dates, credentials, client relationships, awards and rankings require a recorded source before publication. A missing source remains a limitation rather than becoming polished copy.",
  },
  {
    title: "Three kinds of work stay separate",
    body: "Verified client work, independent public-record analysis and Branding Tatva Lab concepts carry different labels. Independent or concept work is never presented as a client engagement.",
  },
  {
    title: "Sources remain inspectable",
    body: "Research-led guides include a visible sources section when external evidence supports the argument. Machine-readable citations mirror those visible sources and never introduce references absent from the page.",
  },
  {
    title: "Diagnostics explain their limits",
    body: "The Brand Health Check is a short decision aid. Its question values and scoring are visible, its result remains ungated, and its score is never described as a population benchmark or a promise of commercial performance.",
  },
  {
    title: "Corrections stay open",
    body: `A factual correction can be sent to ${site.email}. Material corrections should update the page and its visible modified date.`,
  },
] as const;

export default function EditorialPolicyPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <section className="relative overflow-hidden bg-soil pb-16 pt-36 text-ivory sm:pb-20 sm:pt-44">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 78% 18%, rgba(198,169,122,0.2), transparent 30%), radial-gradient(circle at 18% 88%, rgba(92,107,74,0.2), transparent 34%), linear-gradient(145deg, #252d29 0%, #3f4d44 54%, #27221e 100%)",
            }}
          />
          <Container className="relative max-w-4xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sandstone">
                Editorial and evidence policy
              </p>
            </Reveal>
            <SplitReveal
              as="h1"
              className="mt-5 max-w-4xl font-display text-[clamp(3rem,7vw,6.2rem)] font-normal leading-[0.95]"
            >
              Trust begins where a claim can be examined.
            </SplitReveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-2xl text-base leading-8 text-ivory/76 sm:text-lg">
                This policy explains how {site.name} separates evidence from interpretation, keeps concept work visible as concept work, and gives readers a clear route to sources and corrections.
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-ivory py-16 sm:py-24">
          <Container className="max-w-5xl">
            <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border md:grid-cols-2">
              {principles.map((principle, index) => (
                <Reveal
                  key={principle.title}
                  delay={Math.min(index * 0.04, 0.16)}
                  className="bg-background-elevated p-7 sm:p-9"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-normal text-soil">
                    {principle.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-foreground-secondary">
                    {principle.body}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-12 rounded-[1.75rem] bg-soil p-7 text-ivory sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sandstone">
                Current public boundary
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-normal sm:text-4xl">
                A founder-led, remote brand strategy practice.
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-ivory/72">
                {entityFacts.practice.description} Public structured data names {entityFacts.founder.name} as the founder and author, and identifies the current remote service regions without adding unverified biography, award or partner claims.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="rounded-full border border-ivory/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ivory transition-colors hover:border-ivory/60"
                >
                  About the practice
                </Link>
                <Link
                  href="/insights"
                  className="rounded-full bg-sandstone px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-soil transition-opacity hover:opacity-90"
                >
                  Read the source library
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
