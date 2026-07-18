import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { TexturedDark } from "@/components/TexturedDark";
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
      <Header />
      <main id="main-content">
        <TexturedDark className="py-20 sm:py-28" image="/images/texture-terracotta.jpg">
          <Container className="relative">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">
                {project.industry}
              </p>
              <h1 className="mt-3 max-w-2xl text-display-lg font-display font-semibold text-ivory">
                {project.title}
              </h1>
            </Reveal>
          </Container>
        </TexturedDark>

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
