import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { AuditInvite } from "@/components/AuditInvite";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AboutSplitHero } from "@/components/AboutSplitHero";
import { NotebookClose } from "@/components/NotebookClose";
import { PinnedWorkingMethod } from "@/sections/About/PinnedWorkingMethod";
import { PointOfView } from "@/sections/About/PointOfView";
import { Convergence } from "@/sections/About/Convergence";
import { WorkingDirectly } from "@/sections/About/WorkingDirectly";
import { Evidence } from "@/sections/About/Evidence";
import { aboutIntro } from "@/data/about";
import { elements } from "@/data/elements";
import { site } from "@/data/site";
import { pageSchema, PERSON_ID } from "@/lib/pageSchema";

const pageJsonLd = pageSchema({
  type: "AboutPage",
  path: "/about",
  name: "About Suman Sharma | Branding Tatva",
  description:
    "The thinking behind Branding Tatva: brand strategy grounded in psychology and language.",
  trail: [{ name: "About", path: "/about" }],
  mainEntity: PERSON_ID,
});

export const metadata: Metadata = {
  title: "About Suman Sharma",
  description: `The thinking behind ${site.name}: brand strategy grounded in psychology and language.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${site.founder} | ${site.name}`,
    description: `The thinking behind ${site.name}: brand strategy grounded in psychology and language.`,
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
        />

        <AboutSplitHero
          eyebrow="About"
          headline={aboutIntro.opening}
          body={elements[0].poetic}
          ctaHref="/contact"
          ctaLabel="Book a Brand Strategy Session"
          secondaryCtaHref="/work"
          secondaryCtaLabel="Explore the Work"
          video="/videos/own-companions-split.mp4"
          poster="/images/own-companions-split-poster.jpg"
          bgVideo="/videos/about-hero-bg-meadow.mp4"
          bgPoster="/images/about-hero-bg-meadow-poster.jpg"
        />

        <section className="relative overflow-hidden bg-soil py-16 sm:py-20">
          <BackgroundVideo
            video="/videos/generated/bt-about-point-view-three-stones.mp4"
            poster="/images/generated/bt-about-point-view-three-stones-poster.jpg"
            parallax
            playbackRate={0.84}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-soil/80" />
          <div className="relative">
            <PointOfView />
          </div>
        </section>

        <section className="bg-[#eee7db]">
          <Convergence />
          <Container className="max-w-3xl pb-16 pt-2 sm:pb-20">
            <AuditInvite tone="light" />
          </Container>
        </section>

        <PinnedWorkingMethod />

        <section className="relative overflow-hidden bg-soil py-16 sm:py-20">
          <BackgroundVideo
            video="/videos/generated/bt-about-working-directly-woodlight.mp4"
            poster="/images/generated/bt-about-working-directly-woodlight-poster.jpg"
            parallax
            playbackRate={0.9}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-soil/78" />
          <div className="relative">
            <WorkingDirectly />
          </div>
        </section>

        <section className="relative overflow-hidden bg-soil py-16 sm:py-20">
          <BackgroundVideo
            video="/videos/pixabay-forest-sunbeams.mp4"
            poster="/images/pixabay-forest-sunbeams-poster.jpg"
            parallax
          />
          <div aria-hidden="true" className="absolute inset-0 bg-soil/85" />
          <div className="relative">
            <Evidence />
          </div>
        </section>

        <NotebookClose />
      </main>
      <Footer compact />
    </>
  );
}
