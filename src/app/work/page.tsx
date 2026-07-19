import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PhotoHero } from "@/components/PhotoHero";
import { ImageBreak } from "@/components/ImageBreak";
import { WorkGrid } from "@/components/WorkGrid";
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
            <WorkGrid projects={projects} />
          </Container>
        </section>

        <ImageBreak
          image="/images/higgsfield-canopy-light.jpg"
          quote="Every one of these projects started in a forest of noise, the same place yours is starting from."
          height="60vh"
        />
      </main>
      <Footer />
    </>
  );
}
