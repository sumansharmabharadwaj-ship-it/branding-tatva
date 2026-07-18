import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PhotoHero } from "@/components/PhotoHero";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected brand and content strategy work.",
};

export default function WorkPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <PhotoHero image="/images/green-canopy.jpg" minHeight="60vh" />

        <section className="pb-16 pt-20 sm:pt-28">
          <Container>
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">Work</p>
              <h1 className="mt-2 max-w-2xl text-display-sm font-display font-semibold text-soil">
                Projects across very different categories.
              </h1>
              <p className="mt-4 max-w-2xl text-foreground-secondary">
                Marketplaces, executive coaching, wellness, D2C supplements,
                enterprise technology: different industries, the same
                underlying method.
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="border-t border-border bg-background-alt py-16">
          <Container>
            <div className="grid items-stretch gap-6 md:grid-cols-2">
              {projects.map((project, i) => (
                <Reveal key={project.slug} delay={(i % 4) * 0.08} className="h-full">
                  <Link
                    href={`/work/${project.slug}`}
                    className="flex h-full flex-col rounded-lg border-t-2 border-border bg-background-elevated p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ borderTopColor: project.accent }}
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                      {project.industry}
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-soil">
                      {project.title}
                    </p>
                    <p className="mt-3 text-sm text-foreground-secondary">{project.challenge}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      {project.services.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-border px-3 py-1 text-xs text-foreground-secondary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </Link>
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
