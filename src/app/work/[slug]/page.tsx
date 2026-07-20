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
  };
}

function Block({ id, title, children }: { id?: string; title: string; children?: string }) {
  if (!children) return null;
  return (
    <div id={id} className={`case-study-block relative pl-14 sm:pl-16 ${id ? "scroll-mt-24" : ""}`}>
      <h2 className="font-display text-xl font-semibold text-soil">{title}</h2>
      <p className="mt-3 text-foreground-secondary">{children}</p>
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

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
        <PhotoHero
          video="/videos/own-jagged-peaks.mp4"
          poster="/images/own-jagged-peaks-wide-poster.jpg"
          minHeight="70vh"
        >
          <Container className="relative py-20 text-center">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                {project.industry}
              </span>
              <h1 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] text-ivory">
                {project.title}
              </h1>
            </Reveal>
          </Container>
        </PhotoHero>

        {project.stats && (
          <section id="numbers" className="scroll-mt-24 border-b border-border bg-clay/5 py-14">
            <Container>
              <Reveal>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="text-center sm:text-left">
                      <p className="font-display text-4xl font-semibold text-clay sm:text-5xl">
                        <AnimatedStat value={stat.value} />
                      </p>
                      <p className="mt-2 text-sm text-foreground-secondary">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </Container>
          </section>
        )}

        <section className="border-t border-border bg-background-alt py-16">
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
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                  Elements involved
                </p>
                <ul className="mt-2 space-y-1">
                  {project.services.map((s) => (
                    <li key={s} className="text-sm text-soil">{s}</li>
                  ))}
                </ul>
              </div>
              <LinkButton href="/contact" className="w-full">
                Start a similar project
              </LinkButton>
            </Reveal>
          </Container>
        </section>

        {/* Generated via Higgsfield rather than stock footage — a
            distinct flowing-water mood, not another misty-forest shot.
            The quote itself is per-project
            (closingQuote in data/projects.ts) so the words actually tie back
            to that project's own challenge/outcome, instead of one generic
            line sitting under every case study regardless of industry. */}
        <VideoBreak
          src="/videos/higgsfield-forest-stream.mp4"
          poster="/images/higgsfield-forest-stream-poster.jpg"
          quote={
            project.closingQuote ??
            "Good strategy doesn't force a path. It finds the one already there, the way water finds a way through stone."
          }
          height="72vh"
        />

        {related && (
          <section className="py-16">
            <Container>
              <Reveal>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                  Related work
                </p>
                <TiltCard glowColor={related.accent} className="mt-3 max-w-md">
                  <a
                    href={`/work/${related.slug}`}
                    className="block h-full rounded-lg border border-border bg-background-elevated p-6 shadow-elevation-sm transition-colors duration-300 hover:border-action-primary/40"
                  >
                    <p className="font-display text-lg font-semibold text-soil">{related.title}</p>
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
    </>
  );
}
