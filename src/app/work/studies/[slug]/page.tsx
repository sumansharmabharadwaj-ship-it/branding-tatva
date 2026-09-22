import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";
import { brandStudies } from "@/data/brandStudies";
import { getInsightTopic } from "@/data/insights";
import { site } from "@/data/site";
import { MOOD } from "@/lib/sectionWash";
import { MediaSlot } from "@/components/MediaSlot";
import { SplitReveal } from "@/components/SplitReveal";

// Dedicated page per brand study — the SEO/GEO build: five indexable
// URLs targeting the exact questions people search ("Nike branding
// analysis", "why is Coca Cola branding effective"), each carrying
// Article + BreadcrumbList structured data, regional signals for the
// US/UK/Canada markets the practice serves, and a lead capture block
// routing readers into the journey and the booking flow. The honesty
// contract from data/brandStudies.ts applies in full: independent
// analysis of the public record, never client work, and both the copy
// and the schema say so.

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return brandStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = brandStudies.find((s) => s.slug === slug);
  if (!study) return {};
  const title = `${study.brand} branding analysis`;
  const description = study.description;
  return {
    title,
    description,
    authors: [{ name: site.founder, url: `${site.url}/about` }],
    alternates: { canonical: `/work/studies/${study.slug}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      type: "article",
      modifiedTime: study.updatedAt,
      url: `${site.url}/work/studies/${study.slug}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function BrandStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = brandStudies.find((s) => s.slug === slug);
  if (!study) notFound();
  const topic = getInsightTopic(study.topicSlug);
  const updatedLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${study.updatedAt}T00:00:00Z`));
  const citations = Array.from(
    new Map(study.observations.map(({ source }) => [source.url, source])).values(),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${study.brand} branding analysis: ${study.lens}`,
        about: study.brand,
        abstract: study.premise,
        articleSection: study.lens,
        author: { "@type": "Person", "@id": `${site.url}/#person`, name: site.founder, url: `${site.url}/about` },
        publisher: { "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name, url: site.url },
        url: `${site.url}/work/studies/${study.slug}`,
        mainEntityOfPage: `${site.url}/work/studies/${study.slug}`,
        description: study.description,
        dateModified: study.updatedAt,
        image: `${site.url}/opengraph-image`,
        inLanguage: "en-GB",
        citation: citations.map((source) => ({
          "@type": "CreativeWork",
          name: source.label,
          url: source.url,
          publisher: { "@type": "Organization", name: source.publisher },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Insights", item: `${site.url}/insights` },
          ...(topic ? [{ "@type": "ListItem", position: 2, name: topic.name, item: `${site.url}/insights/topic/${topic.slug}` }] : []),
          { "@type": "ListItem", position: topic ? 3 : 2, name: study.brand, item: `${site.url}/work/studies/${study.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <Header transparent />
      <main id="main-content" style={{ backgroundColor: MOOD.charcoal }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Four shared original films carry the reader from cultural
            memory to observation, application, and action. The media
            remains data-driven so a study-specific film can replace any
            slot later without changing this template. */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <MediaSlot fill={study.media?.masthead} scrim={0.8} posterPriority />
          <Container className="relative max-w-4xl">
            <Reveal>
              <Link href={topic ? `/insights/topic/${topic.slug}` : "/insights"} className="inline-flex min-h-11 items-center text-sm text-ivory/80 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory">
                ← {topic ? `${topic.name} insights` : "All insights"}
              </Link>
              <p className="mt-8 text-sm font-medium uppercase tracking-[0.18em] text-ivory/70">Brand study</p>
            </Reveal>
            <SplitReveal as="h1" className="mt-2 font-display text-display-md font-normal text-ivory">
              {study.brand} branding analysis
            </SplitReveal>
            <Reveal delay={0.08}>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-ivory/20 px-3 py-1 text-xs text-ivory/70">
                  {study.region}
                </span>
                <span className="rounded-full border border-[#A0A690]/40 px-3 py-1 text-xs text-[#A0A690]">
                  {study.lens}
                </span>
              </div>
              <p className="mt-8 max-w-2xl font-display text-2xl font-normal leading-snug text-ivory sm:text-3xl">
                {study.premise}
              </p>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ivory/60">
                Independent analysis of the public record. No client relationship or affiliation exists between {study.brand} and Branding Tatva. Sources sit beside the recorded facts; the interpretations and exercises are our own.
              </p>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-relaxed text-ivory/80">
                <Link href="/about" className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory">By {site.founder}</Link>
                <span>Updated <time dateTime={study.updatedAt}>{updatedLabel}</time></span>
                <Link href="/editorial-policy" className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory">Editorial policy</Link>
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="relative overflow-hidden border-t border-ivory/10 py-16 sm:py-24">
          <MediaSlot fill={study.media?.observations} scrim={0.86} />
          <Container className="relative max-w-4xl">
            <div className="space-y-12">
              {study.observations.map((obs, i) => (
                <Reveal key={obs.title} delay={Math.min(i * 0.08, 0.16)}>
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-12">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-sm text-ivory/50" aria-hidden="true">
                        0{i + 1}
                      </span>
                      <h2 className="font-display text-xl font-normal text-ivory sm:text-2xl">{obs.title}</h2>
                    </div>
                    <div>
                      <p className="text-base leading-relaxed text-ivory/90">{obs.text}</p>
                      <a href={obs.source.url} className="mt-2 inline-flex min-h-11 items-center text-sm leading-relaxed text-ivory/80 underline underline-offset-4 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory">
                        Source: {obs.source.publisher}, {obs.source.label}
                      </a>
                      <p className="mt-4 text-base leading-relaxed text-ivory/90">
                        <strong className="font-semibold">Our reading. </strong>{obs.interpretation}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <p className="mt-14 border-l-2 border-[#A0A690]/60 pl-5 font-display text-2xl italic leading-snug text-ivory sm:text-3xl">
                {study.lesson}
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="relative overflow-hidden border-t border-ivory/10 py-16 sm:py-24">
          <MediaSlot fill={study.media?.applications} scrim={0.86} />
          <Container className="relative max-w-4xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-ivory/70">What a founder can borrow</p>
              <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
                Apply the principle with a smaller team and budget.
              </h2>
              <ul className="mt-8 max-w-2xl space-y-5">
                {study.applications.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A0A690]" aria-hidden="true" />
                    <span className="text-base leading-relaxed text-ivory/90">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 max-w-2xl border-t border-ivory/20 pt-6">
                <h3 className="font-display text-2xl text-ivory">An illustrative exercise</h3>
                <p className="mt-3 text-base leading-relaxed text-ivory/90">{study.exercise}</p>
                <Link href={`/insights/${study.relatedGuide.slug}`} className="mt-4 inline-flex min-h-11 items-center text-base leading-relaxed text-ivory underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory">
                  {study.relatedGuide.label}
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Lead capture: the reader has just absorbed a mechanism —
            route that momentum into the journey and the calendar.
            Regional line reflects the markets the practice serves
            (matching the areaServed schema in the root layout). */}
        <section className="relative overflow-hidden border-t border-ivory/10 py-16 sm:py-24" style={{ backgroundColor: MOOD.study }}>
          <MediaSlot fill={study.media?.closing} scrim={0.84} />
          <Container className="relative max-w-4xl">
            <Reveal>
              <h2 className="max-w-xl text-display-sm font-display font-normal text-ivory">
                Which memory is your brand teaching people?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/90">
                If buyers understand your work in conversation but cannot repeat its difference later, the problem is probably structural. Find the relevant scope or bring the question directly to Suman.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <LinkButton href="/services">Find the relevant scope</LinkButton>
                <LinkButton href="/contact" variant="secondary">
                  Bring your question
                </LinkButton>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
