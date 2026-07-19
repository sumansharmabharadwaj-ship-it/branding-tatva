import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PhotoHero } from "@/components/PhotoHero";
import { ImageBreak } from "@/components/ImageBreak";
import { KenBurnsImage } from "@/components/KenBurnsImage";
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
          minHeight="70vh"
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
                    className="group relative flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-lg p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    {project.cardImage && (
                      <KenBurnsImage
                        image={project.cardImage}
                        gradient="linear-gradient(0deg, rgba(39,34,30,0.9) 0%, rgba(39,34,30,0.45) 55%, rgba(39,34,30,0.15) 100%)"
                      />
                    )}
                    <div className="relative border-t-2 pt-4" style={{ borderTopColor: project.accent }}>
                      <p className="text-xs font-medium uppercase tracking-wide text-ivory/70">
                        {project.industry}
                      </p>
                      <p className="mt-2 font-display text-2xl font-semibold text-ivory">
                        {project.title}
                      </p>
                      <p className="mt-3 text-sm text-ivory/80">{project.challenge}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.services.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-ivory/30 px-3 py-1 text-xs text-ivory/80"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ivory transition-transform duration-300 group-hover:translate-x-1">
                        View case study <span aria-hidden="true">&rarr;</span>
                      </p>
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
          overlayGradient="linear-gradient(180deg, rgba(20,17,14,0.2) 0%, rgba(20,17,14,0.6) 35%, rgba(20,17,14,0.6) 65%, rgba(20,17,14,0.35) 90%, #E8DED0 100%)"
        />
      </main>
      <Footer />
    </>
  );
}
