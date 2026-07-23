import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { PhotoHero } from "@/components/PhotoHero";
import { VideoBreak } from "@/components/VideoBreak";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { AnimatedStat } from "@/components/AnimatedStat";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.challenge,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} | ${site.name}`,
      description: project.challenge,
      type: "article",
    },
  };
}

function Block({ id, title, children }: { id?: string; title: string; children?: string }) {
  if (!children) return null;
  return (
    <div id={id} className={`case-study-block relative pl-14 sm:pl-16 ${id ? "scroll-mt-24" : ""}`}>
      <h2 className="font-display text-xl font-normal text-ivory">{title}</h2>
      <p className="mt-3 text-ivory/70">{children}</p>
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  // Case-study pages carry rich structured content (industry, challenge,
  // outcome, verified stats) but had zero JSON-LD — a real, confirmed gap
  // for both SEO and AEO. CreativeWork fits a portfolio/case-study
  // writeup better than Service schema, which typically expects
  // offers/pricing fields this site deliberately doesn't publish.
  const caseStudyStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    about: project.industry,
    description: project.challenge,
    author: { "@id": `${site.url}/#person` },
    creator: { "@id": `${site.url}/#organization` },
    keywords: project.services.join(", "),
    url: `${site.url}/work/${project.slug}`,
  };

  const related = projects.find((p) => p.slug !== project.slug && p.featured);
  const strategyAnchor = project.insight ? "insight" : project.strategy ? "strategy" : null;
  const jumpItems = [
    project.stats ? { href: "#numbers", label: "Numbers" } : null,
    { href: "#challenge", label: "Challenge" },
    strategyAnchor ? { href: `#${strategyAnchor}`, label: "Strategy" } : null,
    { href: "#outcome", label: "Outcome" },
  ].filter((item): item is { href: string; label: string } => item !== null);

  return (
    <>
      <Header transparent />
      <main id="main-content">
        {/* Asymmetric masthead, matching the technique the blog post
            template now uses — a large offset headline in its own
            column instead of a centered stack, a separate meta column
            (here, the services actually provided, not a date/author),
            and a giant faint industry-name watermark behind both. The
            body below already had real structure (a sticky sidebar next
            to the challenge/strategy blocks); this was the one plain
            centered piece left on the page. */}
        <PhotoHero
          video={project.heroVideo ?? "/videos/higgsfield-golden-ridge.mp4"}
          poster={project.heroPoster ?? "/images/higgsfield-golden-ridge-poster.jpg"}
          minHeight="70vh"
          accentColor={project.heroVideo ? project.accent : undefined}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 right-0 select-none whitespace-nowrap font-display text-[clamp(3rem,13vw,9rem)] font-bold uppercase leading-none text-ivory/[0.06]"
          >
            {project.industry}
          </span>
          <Container className="relative py-20">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal>
                <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                  {project.industry}
                </span>
                <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.1rem,5.5vw,3.75rem)] font-normal leading-[1.1] text-ivory">
                  {project.title}
                </h1>
              </Reveal>
              <Reveal delay={0.1} className="flex flex-wrap gap-2 lg:flex-col lg:items-end lg:pb-2">
                {project.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-ivory/25 px-3 py-1 text-xs text-ivory/75 lg:text-right"
                  >
                    {s}
                  </span>
                ))}
              </Reveal>
            </div>
          </Container>
        </PhotoHero>

        {/* Bold solid Soil, not the Phase-5 clay tint — matches every
            other photo/video section site-wide. Stat numbers flip from
            clay to sandstone (a clay-toned background would collide with
            clay-colored numbers) and labels flip to ivory. */}
        {project.stats && (
          <section id="numbers" className="scroll-mt-24 bg-soil py-14">
            <Container>
              <Reveal>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="text-center sm:text-left">
                      <p className="font-display text-4xl font-normal text-sandstone sm:text-5xl">
                        <AnimatedStat value={stat.value} />
                      </p>
                      <p className="mt-2 text-sm text-ivory/70">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </Container>
          </section>
        )}

        {/* Was a pale blue-gray wash, then solid Indigo — the Indigo
            version was yet another one-off hue on a page that's
            otherwise all Soil (#numbers above, Related work below), the
            same color-per-section clutter fixed sitewide. Soil now, so
            the whole template — stats, this, and related-work — reads
            as one continuous dark chapter instead of three different
            tones. Block's own text and the sidebar stay ivory, and
            .case-study-block::before's ghost numeral stays ivory-toned
            in globals.css — no change needed there, Soil is dark either
            way. */}
        <section className="bg-soil py-16">
          <Container className="grid gap-12 md:grid-cols-3">
            <Reveal className="case-study-blocks md:col-span-2 space-y-10">
              <Block id="challenge" title="The challenge">{project.challenge}</Block>
              {project.audience && <Block title="Audience">{project.audience}</Block>}
              {project.insight && <Block id="insight" title="The insight">{project.insight}</Block>}
              {project.strategy && <Block id="strategy" title="Strategy">{project.strategy}</Block>}
              {project.execution && <Block title="Execution">{project.execution}</Block>}
              <Block id="outcome" title="Outcome">{project.outcome}</Block>
              {project.reflection && <Block title="Reflection">{project.reflection}</Block>}
            </Reveal>

            <Reveal delay={0.15} className="space-y-6 md:sticky md:top-24 md:self-start">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-sandstone">
                  Elements involved
                </p>
                <ul className="mt-2 space-y-1">
                  {project.services.map((s) => (
                    <li key={s} className="text-sm text-ivory/80">{s}</li>
                  ))}
                </ul>
              </div>
              <LinkButton href="/contact" className="w-full">
                Start a similar project
              </LinkButton>
            </Reveal>
          </Container>
        </section>

        {/* Per-project closing footage (closingVideo/closingPoster in
            data/projects.ts) — this used to be one shared clip repeated
            under every case study, the same "why does everything look
            the same" problem the rest of the site was already fixed
            for. The quote is per-project too (closingQuote), so the
            words actually tie back to that project's own challenge/
            outcome instead of one generic line under every case study. */}
        <VideoBreak
          src={project.closingVideo ?? "/videos/higgsfield-idea-sketch.mp4"}
          poster={project.closingPoster ?? "/images/higgsfield-idea-sketch.jpg"}
          quote={
            project.closingQuote ??
            "Good strategy lets a path reveal itself rather than forcing one, the way water finds a way through stone."
          }
          height="72vh"
        />

        {related && (
          <section className="bg-soil py-16">
            <Container>
              <Reveal>
                <p className="text-xs font-medium uppercase tracking-wide text-ivory/70">
                  Related work
                </p>
                <TiltCard glowColor={related.accent} className="mt-3 max-w-md">
                  <a
                    href={`/work/${related.slug}`}
                    className="block h-full rounded-lg border border-border bg-background-elevated p-6 shadow-elevation-sm transition-colors duration-300 hover:border-action-primary/40"
                  >
                    <p className="font-display text-lg font-normal text-soil">{related.title}</p>
                    <p className="mt-2 text-sm text-foreground-secondary">{related.challenge}</p>
                  </a>
                </TiltCard>
              </Reveal>
            </Container>
          </section>
        )}
      </main>
      <Footer />
      <SectionJumpNav items={jumpItems} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyStructuredData) }}
      />
    </>
  );
}
