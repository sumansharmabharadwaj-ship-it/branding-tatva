import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AboutSplitHero } from "@/components/AboutSplitHero";
import { AboutCinematicRuntime } from "@/components/AboutCinematicRuntime";
import { FounderFieldNotes } from "@/sections/About/FounderFieldNotes";
import { PointOfView } from "@/sections/About/PointOfView";
import { Convergence } from "@/sections/About/Convergence";
import { Behaviours } from "@/sections/About/Behaviours";
import { WorkingDirectly } from "@/sections/About/WorkingDirectly";
import { Evidence } from "@/sections/About/Evidence";
import { AboutResolution } from "@/sections/About/AboutResolution";
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
          secondaryCtaHref="/services#proof"
          secondaryCtaLabel="See Client Proof"
          video="/videos/own-companions-split.mp4"
          poster="/images/own-companions-split-poster.jpg"
          bgVideo="/videos/about-hero-bg-meadow.mp4"
          bgPoster="/images/about-hero-bg-meadow-poster.jpg"
        />

        <AboutCinematicRuntime />

        <section
          className="relative overflow-clip bg-[#e8dfd0]"
          data-about-chapter="origin"
          data-about-film-scene
          data-scene-tone="light"
        >
          <div className="absolute inset-0" data-about-film-background>
            <BackgroundVideo
              video="/videos/pexels-studio-morning-light.mp4"
              poster="/images/pexels-studio-morning-light-poster.jpg"
              parallax
              playbackRate={0.84}
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[#e8dfd0]/90" />
          <div className="relative" data-about-film-plane>
            <FounderFieldNotes />
          </div>
        </section>

        <section className="relative overflow-clip bg-soil" data-about-chapter="philosophy" data-about-film-scene data-scene-tone="dark">
          <div className="absolute inset-0" data-about-film-background>
            <BackgroundVideo
              video="/videos/generated/bt-about-point-view-three-stones.mp4"
              poster="/images/generated/bt-about-point-view-three-stones-poster.jpg"
              parallax
              playbackRate={0.84}
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-soil/80" />
          <div className="relative" data-about-film-plane>
            <PointOfView />
          </div>
        </section>

        <div className="bg-[#eee7db]" data-about-film-scene data-about-chapter="convergence" data-scene-tone="light">
          <div data-about-film-plane>
            <Convergence />
          </div>
        </div>

        <section className="relative overflow-clip bg-soil" data-about-chapter="principles" data-about-film-scene data-scene-tone="dark">
          <div className="absolute inset-0" data-about-film-background>
            <BackgroundVideo
              video="/videos/generated/bt-about-behaviours-mossbreath.mp4"
              poster="/images/generated/bt-about-behaviours-mossbreath-poster.jpg"
              parallax
              playbackRate={0.86}
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-soil/80" />
          <div className="relative" data-about-film-plane>
            <Behaviours />
          </div>
        </section>

        <section className="relative overflow-clip bg-soil" data-about-chapter="founder-led" data-about-film-scene data-scene-tone="dark">
          <div className="absolute inset-0" data-about-film-background>
            <BackgroundVideo
              video="/videos/generated/bt-about-working-directly-woodlight.mp4"
              poster="/images/generated/bt-about-working-directly-woodlight-poster.jpg"
              parallax
              playbackRate={0.9}
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-soil/78" />
          <div className="relative" data-about-film-plane>
            <WorkingDirectly />
          </div>
        </section>

        <section className="relative overflow-clip bg-soil" data-about-chapter="evidence" data-about-film-scene data-scene-tone="dark">
          <div className="absolute inset-0" data-about-film-background>
            <BackgroundVideo
              video="/videos/pixabay-forest-sunbeams.mp4"
              poster="/images/pixabay-forest-sunbeams-poster.jpg"
              parallax
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-soil/90" />
          <div className="relative" data-about-film-plane>
            <Evidence />
          </div>
        </section>

        <div data-about-film-scene data-about-chapter="resolution" data-scene-tone="light" data-scene-ending>
          <AboutResolution />
        </div>
      </main>
      <Footer compact />
    </>
  );
}
