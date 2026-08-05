import type { Metadata } from "next";
import "./home-cinematic-recovery.css";
import "./home-studio-cinematic.css";
import "./home-paths-cinematic.css";
import "./home-cinematic-finish.css";
import "./home-final-polish.css";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { LinkButton } from "@/components/Button";
import { DustMotes } from "@/components/DustMotes";
import { ElementsSection } from "@/sections/Elements";
import { EvidenceWall } from "@/sections/Home/EvidenceWall";
import { ClarityCTA } from "@/sections/Home/ClarityCTA";
import { TatvaStrip } from "@/sections/Home/TatvaStrip";
import { TatvaSystemLab } from "@/sections/Home/TatvaSystemLab";
import { StudioCinematicChapter } from "@/sections/Home/StudioCinematicChapter";
import { PathsCinematicChapter } from "@/sections/Home/PathsCinematicChapter";
import { FinalInvitation } from "@/sections/Home/FinalInvitation";
import { HomeOpeningSignal } from "@/sections/Home/HomeOpeningSignal";
import { HomeQuestionsScene } from "@/sections/Home/HomeQuestionsScene";
import { HomeSceneBridge } from "@/sections/Home/HomeSceneBridge";
import { HomePacingDirector } from "@/sections/Home/HomePacingDirector";
import { CinematicHero } from "@/sections/Hero";
import { VideoBreak } from "@/components/VideoBreak";
import { ProcessSection } from "@/sections/Process";
import { site } from "@/data/site";
import { elements } from "@/data/elements";
import { process } from "@/data/process";
import { faqs } from "@/data/faqs";
import { elementColor } from "@/lib/elementColor";

export const metadata: Metadata = {
  title: `${site.name}: Brand Strategy by ${site.founder}`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name}: Brand Strategy by ${site.founder}`,
    description: site.description,
    url: site.url,
    type: "website",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Home() {
  return (
    <>
      <Header transparent />
      <main id="main-content" className="cinematic-home">
        <section
          id="opening"
          data-home-chapter="opening"
          data-home-section="opening"
          className="home-scene home-scene--opening"
          aria-label="Branding Tatva introduction"
        >
          <div className="relative">
            <CinematicHero
              video="/videos/hero-forest-sanctuary.mp4"
              poster="/images/hero-forest-sanctuary-poster.jpg"
              imagePosition="30% 40%"
              badge="Brand strategy shaped by psychology, language, and market evidence"
              headline={
                <>
                  Most brands are visible. Very few are{" "}
                  <span className="italic text-clay">remembered</span>.
                </>
              }
              subhead="I help founders and growing businesses decide what their brand should mean, then build the positioning, identity, voice, website, and market presence that make that meaning recognisable."
            >
              <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
              <LinkButton
                href="/work"
                variant="secondary"
                className="border-ivory/30 text-ivory hover:bg-ivory/10"
              >
                Explore the Work
              </LinkButton>
              <p className="w-full text-xs text-ivory/55 sm:text-sm">
                The same strategic method that moved one client&apos;s engagement rate
                from 0.71% to 2.81% in eight weeks. Led directly by Suman, from
                diagnosis to delivery.
              </p>
            </CinematicHero>
            <HomeOpeningSignal />
          </div>
        </section>

        <HomeSceneBridge family="air" from="#141210" to="#141210" />

        <section
          id="diagnosis"
          data-home-chapter="diagnosis"
          data-home-section="diagnosis"
          className="home-scene"
          aria-label="Find the strategic gap"
        >
          <span className="sr-only">Where you stand</span>
          <ClarityCTA />
        </section>

        <HomeSceneBridge family="earth" from="#141210" to="#27221E" />

        <section
          id="evidence"
          data-home-chapter="evidence"
          data-home-section="evidence"
          className="home-scene"
          aria-label="Selected work and recorded proof"
        >
          <EvidenceWall />
        </section>

        <HomeSceneBridge family="water" from="#27221E" to="#F2F0E8" />
        <StudioCinematicChapter />
        <HomeSceneBridge family="air" from="#F2F0E8" to="#F2F0E8" />
        <PathsCinematicChapter />
        <HomeSceneBridge family="confluence" from="#F2F0E8" to="#F2F0E8" />

        <section
          id="framework"
          data-home-chapter="framework"
          data-home-section="framework"
          className="home-scene home-scene--framework"
          aria-label="The Branding Tatva framework"
        >
          <TatvaStrip />
          <TatvaSystemLab />
        </section>

        <HomeSceneBridge family="space" from="#E9E4D9" to="#27221E" />

        <section
          id="elements"
          data-home-chapter="elements"
          data-home-section="elements"
          className="home-scene scroll-mt-24"
          aria-label="The five Tatvas in depth"
        >
          <ElementsSection elements={elements} />
        </section>

        <HomeSceneBridge family="earth" from="#27221E" to="#141210" />

        <section
          id="process"
          data-home-chapter="process"
          data-home-section="process"
          className="home-scene bg-soil"
          aria-label="How a project moves"
        >
          <ProcessSection stages={process} elementColor={elementColor} />
        </section>

        <HomeSceneBridge family="water" from="#141210" to="#141210" />

        <section
          id="questions"
          data-home-chapter="questions"
          data-home-section="questions"
          className="home-scene"
          aria-label="Practical questions before beginning"
        >
          <HomeQuestionsScene />
        </section>

        <HomeSceneBridge family="fire" from="#141210" to="#141210" />

        <section
          id="invitation"
          data-home-chapter="invitation"
          data-home-section="invitation"
          className="home-scene invitation-cinematic"
          aria-label="Begin a conversation with Branding Tatva"
        >
          <VideoBreak
            src="/videos/higgsfield-silver-tide.mp4"
            poster="/images/higgsfield-silver-tide-poster.jpg"
            quote="Some things only become visible once everything else goes quiet."
            height="auto"
            imagePosition="50% 18%"
            quoteVariant="statement"
            cameraPush
            wordFade
            overlayGradient="linear-gradient(180deg, rgba(20,17,14,0.42) 0%, rgba(20,17,14,0.16) 26%, rgba(20,17,14,0.28) 54%, rgba(20,17,14,0.94) 100%)"
          >
            <DustMotes />
            <FinalInvitation />
          </VideoBreak>
        </section>
      </main>

      <HomePacingDirector />
      <Footer />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
