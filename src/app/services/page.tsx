import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { preload } from "react-dom";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ScrollCue } from "@/components/ScrollCue";
import { PhotoHero } from "@/components/PhotoHero";
import { TexturedDark } from "@/components/TexturedDark";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { SituationPath } from "@/sections/Services/SituationPath";
import { ServiceDisciplineExplorer } from "@/sections/Services/ServiceDisciplineExplorer";
import { RecognitionAudit } from "@/sections/Services/RecognitionAudit";
import { PricingProvider } from "@/components/PricingProvider";
import { REGION_COOKIE, isRegion, regionFromCountry } from "@/data/pricing";
import { VerifiedOutcome } from "@/sections/Services/VerifiedOutcome";
import { StakesCinematicBackdrop } from "@/sections/Services/StakesCinematicBackdrop";
import { SceneVeil } from "@/sections/Services/SceneVeil";
import { SceneHandoff } from "@/sections/Services/SceneHandoff";
import { SplitReveal } from "@/components/SplitReveal";
import { HeroReveal } from "@/sections/Services/HeroReveal";
import { PinnedBrandBuild } from "@/sections/Services/PinnedBrandBuild";
import { PerceptionLadder } from "@/sections/Services/PerceptionLadder";
import { PackageSelector } from "@/sections/Services/PackageSelector";
import { WeakBrandingCost } from "@/sections/Services/WeakBrandingCost";
import { DeliverablesExplorer } from "@/sections/Services/DeliverablesExplorer";
import { DeliverablesCinematicBackdrop } from "@/sections/Services/DeliverablesCinematicBackdrop";
import { ContextualCTA } from "@/components/conversion/ContextualCTA";
import { ImagineYourBrand } from "@/sections/Services/ImagineYourBrand";
import { BrandHealthCheck } from "@/sections/Services/BrandHealthCheck";
import { StrategyRoomCTA } from "@/sections/Services/StrategyRoomCTA";
import { Magnetic } from "@/components/Magnetic";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { MOOD } from "@/lib/sectionWash";

export const metadata: Metadata = {
  title: "Services",
  description:
    "A brand discovery experience: why branding works, why it fails, what a project actually involves, and where your own brand stands today.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Branding Tatva",
    description:
      "A brand discovery experience: why branding works, why it fails, what a project actually involves, and where your own brand stands today.",
    type: "website",
  },
};

// Complete-integration preview stamp: this source-only comment forces a
// fresh Vercel preview after the compatibility repairs. The ephemeral
// build applies the focused journey transformer before compiling; no
// production branch or public domain is touched.

// Rebuilt from a services catalog into a "Brand Discovery Experience" —
// one section per objection a visitor actually carries into the page
// (Curiosity → Authority → Education → Desire → Risk removal → Book
// call), not a service-by-service list. Trust, Proof, and Future
// vision (the founder bio, the case study, and the six-stage pinned
// process) were removed after a Creative Direction Audit — the pinned
// process sequence was also rendering with overlapping text, a real
// bug, not just a pacing call. See the plan doc (Phase 14) for the
// original reasoning. PinnedBrandBuild now uses the same CSS-sticky
// mechanism proven elsewhere on the site; Three.js remains scoped once
// inside PerceptionLadder rather than becoming a page-wide effect.

// Conversion order (Phase 2 of the redesign brief): the commercial
// path — situation, packages, proof — comes before the teaching
// chapters, so a ready visitor can act inside the first two scrolls.
// Every immersive chapter needs an escape, and this array feeds both
// the floating index and the hero's own chapter list. It covered the
// first three of nine, so a visitor eight chapters deep had no entry
// to point at and no way back to booking except scrolling the whole
// way. All nine anchors already exist and already carry scroll-mt-24.
const JUMP_ITEMS = [
  { href: "#situation", label: "Your situation" },
  { href: "#offerings", label: "Services" },
  { href: "#desire", label: "Packages" },
  { href: "#authority", label: "Why it works" },
  { href: "#education", label: "What changes" },
  { href: "#imagine", label: "The shift" },
  { href: "#health", label: "Health check" },
  { href: "#audit", label: "Questions" },
  { href: "#book", label: "Book a call" },
];

// Ambient consolidation (Suman's review: "duplicated ambient effects",
// "one motion language"): this page stacked twenty five atmosphere
// layers — six shaders, particle fields, and the veil/handoff seams —
// so every chapter competed with its own background. The seams stay as
// the site's one transition grammar; repeated shaders and particle
// fields are gone, leaving original films and material stills to carry
// atmosphere without competing with the chapter interaction.
export default async function ServicesPage() {
  // Market aware pricing (governing bible §10): the visitor's explicit
  // region cookie always wins; otherwise Vercel's country header picks
  // the starting price book; unknown falls to rest of world. Detection
  // is server side so the first paint already shows the right
  // currency; the manual selector beside the prices stays in control.
  const cookieStore = await cookies();
  const hdrs = await headers();
  const savedRegion = cookieStore.get(REGION_COOKIE)?.value;
  const region = isRegion(savedRegion) ? savedRegion : regionFromCountry(hdrs.get("x-vercel-ip-country"));
  // The hero poster is the page's first paint — a high priority preload
  // hint so the awakening scene arrives before the veil starts lifting.
  preload("/images/generated/bt-services-hero-root-system-poster.jpg", { as: "image", fetchPriority: "high" });
  return (
    <>
      <Header transparent />
      {/* Charcoal is the page-level ground beneath every full-bleed
          chapter and scene handoff. It prevents the cream body colour
          from flashing at a sticky or transformed boundary, while the
          deliberately light contextual CTA continues to paint its own
          surface. */}
      <main id="main-content" style={{ backgroundColor: MOOD.charcoal }}>
        <PricingProvider initialRegion={region}>
        {/* Curiosity opens as a complete first scene rather than a
            compact masthead. One viewport belongs to the root-system
            film, proposition, proof, and chapter map; the Situation
            chapter only begins after the visitor has finished this
            frame. The scene still advances quickly because the veil and
            word reveal respond inside the viewport, not by shortening it. */}
        <PhotoHero
          video="/videos/generated/bt-services-hero-root-system.mp4"
          videoMobile="/videos/generated/bt-services-hero-root-system-mobile.mp4"
          poster="/images/generated/bt-services-hero-root-system-poster.jpg"
          minHeight="100vh"
          overlayGradient="linear-gradient(180deg, rgba(12,17,16,0.54) 0%, rgba(12,17,16,0.64) 58%, rgba(12,17,16,0.82) 100%)"
          playbackRate={1.15}
        >
          {/* Original generated hero loop: a living underground root
              network becomes legible as a restrained mineral-ivory
              signal travels through connected paths. The image explains
              the page's premise before the copy does: brand recognition
              is a system beneath the visible surface, not one isolated
              deliverable. */}
          <HeroReveal />
          <ScrollCue raised />
        </PhotoHero>

        {/* Commercial path, chapter 1. The visitor names their situation
            before they are asked to understand a framework. The choice
            persists into Packages, so this is one journey rather than two
            disconnected quizzes. */}
        <section
          id="situation"
          data-services-scene="situation"
          className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"
          style={{ backgroundColor: MOOD.charcoal }}
        >
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-situation-paths.mp4"
            videoMobile="/videos/generated/bt-services-situation-paths-mobile.mp4"
            poster="/images/generated/bt-services-situation-paths-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(13,17,18,0.58) 0%, rgba(13,17,18,0.32) 45%, rgba(13,17,18,0.72) 100%)",
            }}
          />
          <SceneVeil color="#0E1515" />
          <div className="relative">
            <SituationPath />
          </div>
          <SceneHandoff color="#111719" />
        </section>

        {/* The six disciplines become one inspectable ecosystem instead
            of six document-length rows. The active panel changes within
            the same scene, keeping the page dense without hiding any
            real service. */}
        <section
          id="offerings"
          data-services-scene="offerings"
          className="relative scroll-mt-24 overflow-hidden"
          style={{ backgroundColor: MOOD.charcoal }}
        >
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-strategy-topography.mp4"
            videoMobile="/videos/generated/bt-services-strategy-topography-mobile.mp4"
            poster="/images/generated/bt-services-strategy-topography-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(13,18,19,0.62) 0%, rgba(13,18,19,0.36) 48%, rgba(13,18,19,0.74) 100%)",
            }}
          />
          <SceneVeil color="#111719" />
          <ServiceDisciplineExplorer />
          <SceneHandoff color="#10151A" />
        </section>

        {/* Commercial path, chapter 3. Package choice is a real business
            decision, not a catalogue: one recommendation at a time, with
            an explicit side-by-side comparison when the visitor asks for
            it. */}
        <section
          id="desire"
          data-services-scene="desire"
          className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"
          style={{ backgroundColor: MOOD.deepWater }}
        >
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-package-current.mp4"
            videoMobile="/videos/generated/bt-services-package-current-mobile.mp4"
            poster="/images/generated/bt-services-package-current-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(15,21,28,0.56) 0%, rgba(15,21,28,0.28) 50%, rgba(15,21,28,0.66) 100%)",
            }}
          />
          <SceneVeil color="#10151A" />
          <div className="relative">
            <PackageSelector />
          </div>
          <SceneHandoff color="#171A17" />
        </section>

        <VerifiedOutcome />

        {/* Authority is one measured sticky chapter. The five layers
            assemble as the visitor scrolls, but mobile and reduced motion
            receive a complete linear fallback. */}
        <section id="authority" data-services-scene="authority" className="relative scroll-mt-24 overflow-hidden" style={{ backgroundColor: MOOD.charcoal }}>
          <PinnedBrandBuild />
        </section>

        {/* Stakes turns weak branding into a concrete cost comparison.
            The original generated still separates one recognisable stone
            from an interchangeable category field while the live cards
            retain the exact business consequences. */}
        <section
          data-services-scene="stakes"
          className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"
          style={{ backgroundColor: MOOD.stone }}
        >
          <StakesCinematicBackdrop image="/images/generated/bt-services-stakes-positioning.png" />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(24,25,22,0.64) 0%, rgba(24,25,22,0.38) 50%, rgba(24,25,22,0.68) 100%)",
            }}
          />
          <SceneVeil color="#171A17" />
          <div className="relative">
            <WeakBrandingCost />
          </div>
          <SceneHandoff color="#1A2026" />
        </section>

        {/* Education turns recognition into a changing point of view.
            PerceptionLadder keeps the page's one scoped Three.js accent,
            while the original perception-ascent film clarifies terrain
            around a signal instead of borrowing generic growth footage. */}
        <section id="education" data-services-scene="education" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden" style={{ backgroundColor: MOOD.mist }}>
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-perception-ascent.mp4"
            videoMobile="/videos/generated/bt-services-perception-ascent-mobile.mp4"
            poster="/images/generated/bt-services-perception-ascent-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(26,32,38,0.5) 0%, rgba(26,32,38,0.3) 55%, rgba(26,32,38,0.52) 100%)",
            }}
          />
          <SceneVeil color="#191B16" />
          <div className="relative">
            <PerceptionLadder />
          </div>
          <SceneHandoff color="#172019" />
        </section>

        {/* Deliverables makes the invisible work tangible. Every
            artifact traces to real services data, and the live explorer
            stays the primary interaction inside an original paper-and-
            vellum material environment. */}
        <section data-services-scene="deliverables" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.study }}>
          <DeliverablesCinematicBackdrop image="/images/generated/bt-services-deliverables-archive.png" />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(13,17,16,0.72) 0%, rgba(13,17,16,0.46) 44%, rgba(13,17,16,0.68) 100%)",
            }}
          />
          <SceneVeil color="#1A2026" heightClass="h-[15vh]" />
          <div className="relative">
            <DeliverablesExplorer />
          </div>
          <SceneHandoff color="#141A15" />
        </section>

        <ContextualCTA
          eyebrow="Medium step"
          heading="Unsure which scope fits?"
          body="Twenty minutes settles it, with honest feedback either way."
          href="#book"
          label="Discuss the right scope"
          event="contextual_cta_clicked"
          eventProps={{ source: "services_deliverables" }}
          tone="light"
        />

        <section id="imagine" data-services-scene="imagine" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <div className="relative">
            <ImagineYourBrand />
          </div>
        </section>

        <section id="health" data-services-scene="health" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.forest }}>
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-health-reflection.mp4"
            videoMobile="/videos/generated/bt-services-health-reflection-mobile.mp4"
            poster="/images/generated/bt-services-health-reflection-poster.jpg"
            playbackRate={1.1}
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(20,26,21,0.55) 0%, rgba(20,26,21,0.35) 50%, rgba(20,26,21,0.6) 100%)",
            }}
          />
          <SceneVeil color="#172019" heightClass="h-[14vh]" />
          <div className="relative">
            <BrandHealthCheck />
          </div>
          <SceneHandoff color="#171A17" />
        </section>

        <section id="audit" data-services-scene="audit" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-start overflow-hidden pb-16 pt-24 sm:py-20 lg:justify-center lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <SceneVeil color="#141A15" />
          <div className="relative">
            <RecognitionAudit />
          </div>
          <SceneHandoff color="#27221E" />
        </section>

        <TexturedDark
          id="book"
          image="/images/generated/bt-services-strategy-room-poster.jpg"
          video="/videos/generated/bt-services-strategy-room.mp4"
          videoMobile="/videos/generated/bt-services-strategy-room-mobile.mp4"
          overlayGradient="linear-gradient(180deg, rgba(10,15,16,0.42) 0%, rgba(14,18,18,0.52) 52%, rgba(20,17,14,0.74) 100%)"
          className="flex min-h-[100svh] scroll-mt-24 flex-col justify-center pb-16 pt-24 sm:pb-20 sm:pt-32"
        >
          <StrategyRoomCTA />
        </TexturedDark>
        </PricingProvider>
      </main>
      <Footer />
      <SectionJumpNav items={JUMP_ITEMS} hideOnLast />
    </>
  );
}
