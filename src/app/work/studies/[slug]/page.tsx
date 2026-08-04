import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/Button";
import { brandStudies } from "@/data/brandStudies";
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
  const description = `${study.premise} An independent ${study.lens.toLowerCase()} study, written for founders in the United States, the United Kingdom and Canada.`;
  return {
    title,
    description,
    alternates: { canonical: `/work/studies/${study.slug}` },
    openGraph: { title: `${title} | ${site.name}`, description, type: "article" },
  };
}

export default async function BrandStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = brandStudies.find((s) => s.slug === slug);
  if (!study) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${site.url}/work/studies/${study.slug}#article`,
        headline: `${study.brand} branding analysis: ${study.lens}`,
        about: study.brand,
        abstract: study.premise,
        articleSection: study.lens,
        // Referenced by id rather than restated inline: the root graph
        // already defines both, and duplicating them creates two
        // unlinked entities instead of one authority signal.
        author: { "@id": `${site.url}/#person` },
        publisher: { "@id": `${site.url}/#organization` },
        isPartOf: { "@id": `${site.url}/#website` },
        // These five studies were published together; the sitemap
        // already records that date, so schema uses the same one rather
        // than inventing a per study history that was never tracked.
        datePublished: "2026-08-02",
        dateModified: "2026-08-02",
        image: `${site.url}/opengraph-image`,
        inLanguage: "en",
        mainEntityOfPage: `${site.url}/work/studies/${study.slug}`,
        url: `${site.url}/work/studies/${study.slug}`,
        description:
          "Independent brand strategy analysis of the public record. No client relationship with the brand analyzed.",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Work", item: `${site.url}/work` },
          { "@type": "ListItem", position: 2, name: study.brand, item: `${site.url}/work/studies/${study.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <main id="main-content" style={{ backgroundColor: MOOD.charcoal }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Four media slots run down this template, one per section.
            They stay empty until footage is approved per file, so the
            page reads as designed either way. */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <MediaSlot fill={study.media?.masthead} scrim={0.8} />
          <Container className="relative max-w-4xl">
            <Reveal>
              <Link href="/work" className="text-sm text-ivory/60 transition-colors hover:text-ivory">
                ← All work and studies
              </Link>
              <p className="mt-8 text-sm font-medium uppercase tracking-[0.18em] text-ivory/70">Brand study</p>
            </Reveal>
            <SplitReveal as="h1" className="mt-2 font-display text-display-md font-normal text-ivory">
              {study.brand}
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
                An independent dissection of the public record, written as teaching. {study.brand} has no
                relationship with this practice, and every fact below is documented public history.
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
                    <p className="text-base leading-relaxed text-ivory/90">{obs.text}</p>
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
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-ivory/70">At founder scale</p>
              <h2 className="mt-2 max-w-xl text-display-sm font-display font-normal text-ivory">
                The same mechanism, sized for a brand still earning its memory.
              </h2>
              <ul className="mt-8 max-w-2xl space-y-5">
                {study.applications.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A0A690]" aria-hidden="true" />
                    <span className="text-base leading-relaxed text-ivory/90">{item}</span>
                  </li>
                ))}
              </ul>
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
                Your brand runs on the same mechanics.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/90">
                The Services journey walks through every mechanism in these studies and shows where your brand
                stands today. The practice works with founders across the United States, the United Kingdom,
                Canada and beyond, directly and remotely.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <LinkButton href="/services">Walk the journey</LinkButton>
                <LinkButton href="/contact" variant="secondary">
                  Book a strategy call
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
