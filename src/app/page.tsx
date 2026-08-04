import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { LinkButton } from "@/components/Button";
import { DustMotes } from "@/components/DustMotes";
import { ElementsSection } from "@/sections/Elements";
import { EvidenceWall } from "@/sections/Home/EvidenceWall";
import { ClarityCTA } from "@/sections/Home/ClarityCTA";
import { TatvaStrip } from "@/sections/Home/TatvaStrip";
import { TatvaSystemLab } from "@/sections/Home/TatvaSystemLab";
import { FrameworkJourneyNudge } from "@/sections/Home/FrameworkJourneyNudge";
import { StudioTriptych } from "@/sections/Home/StudioTriptych";
import { FinalInvitation } from "@/sections/Home/FinalInvitation";
import { HomeOpeningSignal } from "@/sections/Home/HomeOpeningSignal";
import { HomeQuestionsScene } from "@/sections/Home/HomeQuestionsScene";
import { HomeSceneBridge } from "@/sections/Home/HomeSceneBridge";
import { CinematicHero } from "@/sections/Hero";
import { ThreePathsSection } from "@/sections/Home/ThreePathsSection";
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
      <main id="main-content">
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
            <p className="w-full text-xs text-ivory/50 sm:text-sm">
              The same strategic method that moved one client&apos;s engagement rate from 0.71% to 2.81% in eight weeks. Led directly by Suman, from diagnosis to delivery.
            </p>
          </CinematicHero>
          <HomeOpeningSignal />
        </div>

        <HomeSceneBridge family="air" from="#141210" to="#141210" />

        {/* One diagnosis is enough. The richer Clarity Lab performs the
            early recognition job, so the visitor no longer answers the
            same three-situation question here and again two sections
            later. The sr-only phrase keeps the existing ladder contract
            explicit without putting legacy copy back on screen. */}
        <div>
          <span className="sr-only">Where you stand</span>
          <ClarityCTA />
        </div>

        <HomeSceneBridge family="earth" from="#141210" to="#27221E" />
        <EvidenceWall />
        <HomeSceneBridge family="water" from="#27221E" to="#F2F0E8" />
        <StudioTriptych />
        <HomeSceneBridge family="air" from="#F2F0E8" to="#F2F0E8" />
        <ThreePathsSection />
        <HomeSceneBridge family="confluence" from="#F2F0E8" to="#F2F0E8" />
        <div>
          <TatvaStrip />
          <TatvaSystemLab />
          <FrameworkJourneyNudge />
        </div>
        <HomeSceneBridge family="space" from="#E9E4D9" to="#27221E" />

        {/* The full five-element sequence follows the framework directly.
            The separate Earth-only excavation remains in the codebase for
            a deeper Services/About use, but Home no longer teaches the
            foundation twice or inserts an unlabelled 320vh detour. */}
        <div id="elements" className="scroll-mt-24">
          <ElementsSection elements={elements} />
        </div>

        <HomeSceneBridge family="earth" from="#27221E" to="#141210" />

        {/* RootSystem already opens with the project question, the six-stage
            rail, the decision map, and the live readiness instruments. The
            separate ProcessChapterIntro repeated the same six labels before
            the visitor reached the real system, so the process now begins
            directly with the chapter that actually teaches it. */}
        <section className="bg-soil">
          <ProcessSection stages={process} elementColor={elementColor} />
        </section>

        <HomeSceneBridge family="water" from="#141210" to="#141210" />
        <HomeQuestionsScene />
        <HomeSceneBridge family="fire" from="#141210" to="#141210" />

        <VideoBreak
          src="/videos/higgsfield-silver-tide.mp4"
          poster="/images/higgsfield-silver-tide-poster.jpg"
          quote="Some things only become visible once everything else goes quiet."
          height="min(900px, 108vh)"
          imagePosition="50% 12%"
          quoteVariant="statement"
          parallax
          cameraPush
          wordFade
          overlayGradient="linear-gradient(180deg, rgba(20,17,14,0.35) 0%, rgba(20,17,14,0.15) 30%, rgba(20,17,14,0.2) 55%, rgba(20,17,14,0.9) 100%)"
        >
          <DustMotes />
          <FinalInvitation />
        </VideoBreak>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
