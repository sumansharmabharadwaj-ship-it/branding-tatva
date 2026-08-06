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
              deliverable. A dedicated mobile encode and generated poster
              keep the first paint quiet, fast, and semantically intact. */}
          <HeroReveal />
          {/* A restrained directional scrim protects the masthead
              while leaving the generated root architecture readable
              on the right side of the frame. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "linear-gradient(90deg, rgba(15,18,17,0.38) 0%, rgba(15,18,17,0.12) 45%, transparent 70%)" }}
          />
          {/* The headline resolves by word, not character. It
              participates in the scene without delaying basic
              comprehension. */}
          <Container className="relative py-20 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal delay={0.35}>
                <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/90">
                  Curiosity
                </span>
                {/* Phase 4 persuasion pass: the old headline asked a
                    question ("Why should a business care about
                    branding?") right after two cycling lines had built a
                    claim — the question dissolved the momentum. The
                    headline now lands the claim the lines were building:
                    it names what "something else" is. */}
                {/* The cycling pre-headline ritual is retired on direct feedback:
                    its single line height handing off to a wrapping headline
                    made everything below jump, and it delayed the H1 —
                    CLAUDE.md's own motion rule. The headline now renders
                    immediately for every visitor, stable at every width. */}
                <SplitReveal
                  as="h1"
                  splitType="words"
                  className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.6rem)] font-normal leading-[1.04] tracking-[-0.01em] text-ivory"
                >
                  The work begins wherever recognition is breaking down.
                </SplitReveal>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-ivory/90">
                  One client&apos;s engagement moved from{" "}
                  <span className="font-medium text-sandstone">0.71%</span> to{" "}
                  <span className="font-medium text-sandstone">2.81%</span> in eight weeks of this exact work. The
                  chapters below show what made that happen, and where your brand would start.
                </p>
                {/* The hero's one quiet action — a visitor sold by the
                    opening claim previously had nowhere to act until the
                    final chapter. An editorial text link, deliberately
                    understated next to the headline rather than a loud
                    button competing with it. */}
                {/* Magnetic like every LinkButton on the site — the
                    hero's one action responds to the cursor the same
                    way every other CTA already does. */}
                <div className="mt-7">
                  <Magnetic>
                    <a
                      href="#book"
                      className="group inline-flex items-baseline gap-2 text-sm tracking-wide text-ivory/90 transition-colors duration-300 hover:text-ivory"
                    >
                      <span className="link-underline">Ready already? Open the strategy room</span>
                      <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">
                        ↓
                      </span>
                    </a>
                  </Magnetic>
                </div>
              </Reveal>
              {/* Editorial chapter index — the page's four acts listed
                  the way a film lists chapters, replacing a row of
                  generic pill buttons. Real navigation (same anchors
                  as SectionJumpNav), presented with editorial weight. */}
              <Reveal delay={0.1} className="hidden lg:block lg:pb-2">
                <ol className="lg:min-w-52">
                  {JUMP_ITEMS.map((item, i) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="group flex items-baseline justify-end gap-3 border-b border-ivory/15 py-2.5 transition-colors duration-200 hover:border-ivory/40"
                      >
                        <span className="font-display text-sm text-ivory/70 transition-colors duration-200 group-hover:text-sandstone">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm tracking-wide text-ivory/90 transition-colors duration-200 group-hover:text-ivory">
                          {item.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </Container>
          <ScrollCue raised />
          {/* The hero's last frames darken into the Situation
              chapter's charcoal. Every later chapter uses the same
              veil-and-handoff grammar, so the page reads as one colour
              journey rather than a stack of unrelated blocks. */}
          <SceneHandoff color="#171A17" heightClass="h-[24vh]" />
        </PhotoHero>

        {/* Choose your situation — the visitor places themselves before
            any package is pitched. Reads the Home page's saved choice
            (the shared localStorage key VisitorRecognition writes) so
            the site remembers where they stand instead of asking twice.
            A quiet interstitial on the page's charcoal ground; the
            chapters around it carry the media. */}
        <section id="situation" data-services-scene="situation" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          {/* Original procedural Situation film: one coherent material
              world holds three different starting conditions. A pale
              mineral seed begins, shifted strata wait to realign, and
              repeating rings carry consistency forward. The chapter now
              teaches diagnosis without borrowing the Package selector's
              separate water-current metaphor. */}
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-situation-paths.mp4"
            videoMobile="/videos/generated/bt-services-situation-paths-mobile.mp4"
            poster="/images/generated/bt-services-situation-paths-poster.jpg"
            playbackRate={1.06}
          />
          {/* A left-weighted charcoal scrim protects the diagnosis copy
              while keeping all three material states visible across the
              lower frame. */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(16,19,20,0.9) 0%, rgba(16,19,20,0.66) 46%, rgba(16,19,20,0.38) 100%)",
            }}
          />
          <div className="relative">
            <SituationPath />
          </div>
          <SceneHandoff color="#171A17" />
        </section>

        {/* The full practice — every real service on offer, answered
            plainly before the packages bundle them. Restored per
            direct instruction: the offerings list (data/services.ts)
            lost its section in the discovery rebuild, which left
            "what do you actually do" with no complete answer anywhere
            on the page. Editorial rows rather than a card grid; each
            offering keeps its own accent from the data. */}
        <section id="offerings" data-services-scene="offerings" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          {/* Original generated strategy terrain: mist withdraws from a
              tactile topographic world while one pale route becomes
              clear. The six disciplines stay distinct in the foreground,
              but the moving terrain makes the shared strategic foundation
              visible without turning the chapter into another card grid. */}
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-strategy-topography.mp4"
            videoMobile="/videos/generated/bt-services-strategy-topography-mobile.mp4"
            poster="/images/generated/bt-services-strategy-topography-poster.jpg"
            playbackRate={1.12}
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(16,20,19,0.9) 0%, rgba(16,20,19,0.74) 46%, rgba(16,20,19,0.56) 100%)",
            }}
          />
          <div className="relative w-full">
            <ServiceDisciplineExplorer />
          </div>
          <SceneHandoff color="#0E1714" />
        </section>

        {/* Desire exposes the packages early enough for a ready
            visitor to act before the teaching chapters. Its original
            deep-water film keeps three legitimate currents visible,
            then lets them resolve into one legible scope. */}
        <section id="desire" data-services-scene="desire" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.deepwater }}>
          {/* Original procedural package-choice loop: three
              legitimate currents remain visible, then settle into one
              legible channel. The restrained mineral-gold trace marks
              choice without turning the section into a prize animation. */}
          <BackgroundVideo
            parallax
            push
            video="/videos/generated/bt-services-package-current.mp4"
            videoMobile="/videos/generated/bt-services-package-current-mobile.mp4"
            poster="/images/generated/bt-services-package-current-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(14,23,20,0.55) 0%, rgba(14,23,20,0.35) 45%, rgba(14,23,20,0.58) 100%)",
            }}
          />
          {/* Scene dissolve: the situation chapter's charcoal into
              Desire's deep water. */}
          <SceneVeil color="#171A17" />
          <div className="relative">
            <PackageSelector />
          </div>
          <SceneHandoff color="#171A17" />
        </section>

        {/* Verified outcome — proof directly after the packages, every
            number from projects.ts verified stats. Charcoal ground so
            the numbers themselves are the visual; it also hands
            seamlessly into Authority's identical charcoal. */}
        <section data-services-scene="verified-outcome" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <SceneVeil color="#0E1714" />
          <div className="relative">
            <VerifiedOutcome />
          </div>
        </section>

        {/* Authority is the page's one extended CSS-sticky teaching
            chapter. The wrapper stays in normal flow and paints its own
            charcoal ground, so the five-layer build never disagrees
            with the viewport width. */}
        <section id="authority" className="relative scroll-mt-24" style={{ backgroundColor: MOOD.charcoal }}>
          <PinnedBrandBuild />
          <SceneHandoff color="#191B16" />
        </section>

        {/* An extension of Authority, not a new act. The visual now
            performs the argument instead of illustrating it with a
            summit: several interchangeable forms recede into category
            fog while one materially distinctive surface becomes
            recognisable before the visitor reads the comparison. */}
        {/* Mood: STONE. Part of the Phase 1 cinematic color script —
            each Services section sits on its own temperature-shifted
            dark (see MOOD in sectionWash.ts) instead of the one warm
            soil veil that was re-warming the whole page into a single
            amber wash. The overlay gradient is tinted with the
            section's own mood tone, never soil. */}
        <section data-services-scene="stakes" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.stone }}>
          {/* Original generated positioning scene: several similar
              stones disappear into cool category mist while one
              weathered surface holds a restrained mineral seam. The
              scroll-linked camera drift stays subordinate to the
              comparison cards, whose focus pull remains this chapter's
              primary interaction. */}
          <StakesCinematicBackdrop image="/images/generated/bt-services-stakes-positioning.png" />
          {/* A left-weighted slate scrim protects the editorial copy
              while leaving the distinctive mineral surface visible on
              the right. No global soil tint, so the chapter remains
              cool and materially different from Desire. */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(17,20,22,0.9) 0%, rgba(17,20,22,0.68) 44%, rgba(17,20,22,0.38) 100%)",
            }}
          />
          {/* Scene dissolve: Authority's charcoal handing off into
              Stakes' stone. */}
          <SceneVeil color="#171A17" />
          {/* Same ghost watermark word technique Home ("ELEMENTS"), About
              ("WHY"), and Blog ("NOTES") already use, extended here — a
              recurring graphic motif tying new sections into the same
              visual system rather than each reading as a one-off. */}
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
          {/* Original procedural perception-ascent loop:
              layered terrain and mist clarify around one distant signal.
              The landscape becomes more legible as the signal becomes
              easier to locate, so the animation teaches recognition
              rather than merely showing generic upward growth. */}
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
          {/* Scene dissolve: Stakes' dry stone into Education's mist. */}
          <SceneVeil color="#191B16" />
          <div className="relative">
            <PerceptionLadder />
          </div>
          <SceneHandoff color="#172019" />
        </section>

        {/* CommonMistakes used to be its own full-viewport section here
            — a Creative Direction Audit found it taught the same idea
            as Stakes (WeakBrandingCost) above with a separate video
            beat, directly contributing to "the page is longer than
            necessary and repeats branding concepts." Its four real
            observations now live as a compact addendum inside Stakes
            instead; the separate section, video, and shader are gone. */}

        {/* Trust (FounderLens) removed on direct request following the
            Creative Direction Audit. Founder credibility still lives on
            the About page; not duplicated here. */}

        {/* Deliverables makes the invisible work tangible. Every
            artifact traces to real services data, and the live explorer
            stays the primary interaction inside an original paper-and-
            vellum material environment. */}
        {/* Mood: THE ARCHIVE. Layered paper, vellum,
            blind-debossed grids, and dark folios form one ordered
            material system behind the live ArtifactPreview. */}
        <section data-services-scene="deliverables" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.study }}>
          {/* Original generated Deliverables archive: ivory papers,
              translucent vellum, embossed grids, dark folios, and one
              stone weight make the invisible work feel tangible before
              a visitor opens an individual artifact. Its scroll-linked
              drift and edge light remain secondary to the explorer. */}
          <DeliverablesCinematicBackdrop image="/images/generated/bt-services-deliverables-archive.png" />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(13,17,16,0.72) 0%, rgba(13,17,16,0.46) 44%, rgba(13,17,16,0.68) 100%)",
            }}
          />
          {/* Education's blue mist settles onto the archive's
              charcoal and paper planes. */}
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

        {/* Imagine Your Brand — the signature builder (conversion
            rebuild §17): two choices produce a personalized project
            map from real deliverables, real packages, and the
            visitor's own regional pricing. The full map renders
            before any email is requested. Charcoal interstitial
            between the light CTA breath and the forest health check. */}
        <section id="imagine" data-services-scene="imagine" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <div className="relative">
            <ImagineYourBrand />
          </div>
        </section>

        {/* Proof (the Dr. Haley Nutrition case study) and Future vision
            (the six-stage pinned process) removed on direct request
            following the Creative Direction Audit — the pinned process
            sequence was also rendering with overlapping text (a real
            bug: stage numerals, headings, and the bottom stage-list row
            all painting on top of each other). The pacing "breath" quote
            that used to sit between them ("Proof only matters if the
            process behind it repeats") named both by concept and no
            longer made sense with neither present, so it's gone too. */}

        {/* Brand Health Check is the slower diagnostic alternative
            to the package selector. Transparent scoring and real package
            mapping sit over an original reflection film that reveals
            hidden misalignment beneath an apparently coherent surface.
            Mood: deep forest green-black after the light editorial break. */}
        <section id="health" data-services-scene="health" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.forest }}>
          {/* Original generated diagnostic reflection loop: the
              surface first reads as coherent, then faint misalignments
              reveal themselves beneath it before settling into visible
              priorities. It turns the Health Check's actual job into the
              motion itself, with a smaller mobile encode and a still
              generated from the same visual world for reduced motion. */}
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
          {/* The archive's pale paper light dims into the Health
              Check's green-black reflection. */}
          <SceneVeil color="#172019" heightClass="h-[14vh]" />
          <div className="relative">
            <BrandHealthCheck />
          </div>
          <SceneHandoff color="#171A17" />
        </section>

        {/* The Brand Recognition Audit — the site's one secondary lead
            asset, placed right after the health check so a visitor who
            just diagnosed themselves can take the deeper checklist
            away. Five checks open to anyone, the full ten behind an
            explicit consent form feeding the existing Mailchimp double
            opt in. Charcoal ground between the forest and the warm
            strategy room that closes the page. */}
        <section id="audit" data-services-scene="audit" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-start overflow-hidden pb-16 pt-24 sm:py-20 lg:justify-center lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <SceneVeil color="#141A15" />
          <div className="relative">
            <RecognitionAudit />
          </div>
          <SceneHandoff color="#27221E" />
        </section>

        {/* Book call becomes the film's arrival rather than a
            stock-location ending. Surface movement gradually settles
            into one mineral-gold reflection, mirroring the visitor's
            shift from scattered questions to a focused conversation.
            The source is original, silent, mathematically seamless,
            responsive, and preserved as a still under reduced motion. */}
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
