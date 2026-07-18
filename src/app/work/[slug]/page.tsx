import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { PhotoHero } from "@/components/PhotoHero";
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

function Block({ title, children }: { title: string; children?: string }) {
  if (!children) return null;
  return (
    <div>
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

  return (
    <>
      <Header transparent />
      <main id="main-content">
        <PhotoHero image="/images/green-valley.jpg" minHeight="60vh">
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
          <section className="border-b border-border bg-clay/5 py-14">
            <Container>
              <Reveal>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="text-center sm:text-left">
                      <p className="font-display text-4xl font-semibold text-clay sm:text-5xl">
                        {stat.value}
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
            <Reveal className="md:col-span-2 space-y-10">
              <Block title="The challenge">{project.challenge}</Block>
              {project.audience && <Block title="Audience">{project.audience}</Block>}
              {project.insight && <Block title="The insight">{project.insight}</Block>}
              {project.strategy && <Block title="Strategy">{project.strategy}</Block>}
              {project.execution && <Block title="Execution">{project.execution}</Block>}
              <Block title="Outcome">{project.outcome}</Block>
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

        {related && (
          <section className="py-16">
            <Container>
              <Reveal>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                  Related work
                </p>
                <a
                  href={`/work/${related.slug}`}
                  className="mt-3 block max-w-md rounded-lg border border-border p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-action-primary/40"
                >
                  <p className="font-display text-lg font-semibold text-soil">{related.title}</p>
                  <p className="mt-2 text-sm text-foreground-secondary">{related.challenge}</p>
                </a>
              </Reveal>
            </Container>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
