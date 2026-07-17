import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected brand and content strategy work.",
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="py-20 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="Work"
              title="Projects across very different categories."
              description="Marketplaces, executive coaching, wellness, D2C supplements, enterprise technology: different industries, the same underlying method."
            />
          </Container>
        </section>

        <section className="border-t border-border bg-background-alt py-16">
          <Container>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project, i) => (
                <Reveal key={project.slug} delay={(i % 4) * 0.08}>
                  <Link
                    href={`/work/${project.slug}`}
                    className="block rounded-lg border border-border bg-background-elevated p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-action-primary/40 hover:shadow-md"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                      {project.industry}
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-soil">
                      {project.title}
                    </p>
                    <p className="mt-3 text-sm text-foreground-secondary">{project.challenge}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
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
