import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PhotoHero } from "@/components/PhotoHero";
import { ImageBreak } from "@/components/ImageBreak";
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
        <PhotoHero
          video="/videos/hero-goldenpath.mp4"
          poster="/images/hero-goldenpath-poster.jpg"
          minHeight="80vh"
        >
          <Container className="relative py-20 text-center">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Work
              </span>
              <h1 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] text-ivory">
                Projects across very different categories.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-ivory/70">
                Marketplaces, executive coaching, wellness, D2C supplements,
                enterprise technology: different industries, the same
                underlying method.
              </p>
            </Reveal>
          </Container>
        </PhotoHero>

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

        <ImageBreak
          image="/images/own-canopy.jpg"
          quote="Every one of these projects started in a forest of noise, the same place yours is starting from."
          height="60vh"
          imagePosition="center 75%"
        />
      </main>
      <Footer />
    </>
  );
}
