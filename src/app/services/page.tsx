import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { preload } from "react-dom";
import { site } from "@/data/site";
import { entityFacts } from "@/data/entityFacts";
import { offerings, packages } from "@/data/services";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PhotoHero } from "@/components/PhotoHero";
import { TexturedDark } from "@/components/TexturedDark";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { SituationPath } from "@/sections/Services/SituationPath";
import { ServiceDisciplineExplorer } from "@/sections/Services/ServiceDisciplineExplorer";
import { RecognitionAudit } from "@/sections/Services/RecognitionAudit";
import { PricingProvider } from "@/components/PricingProvider";
import { REGION_COOKIE, isRegion, regionFromCountry } from "@/data/pricing";
import { VerifiedOutcome } from "@/sections/Services/VerifiedOutcome";
import { SceneVeil } from "@/sections/Services/SceneVeil";
import { SceneHandoff } from "@/sections/Services/SceneHandoff";
import { SplitReveal } from "@/components/SplitReveal";
import { HeroReveal } from "@/sections/Services/HeroReveal";
import { PinnedBrandBuild } from "@/sections/Services/PinnedBrandBuild";
import { PackageSelector } from "@/sections/Services/PackageSelector";
import { StrategyRoomCTA } from "@/sections/Services/StrategyRoomCTA";
import { PerceptionLadder } from "@/sections/Services/PerceptionLadder";
import { Magnetic } from "@/components/Magnetic";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { MOOD } from "@/lib/sectionWash";

const SERVICES_URL = `${site.url}/services`;
const PERSON_ID = `${site.url}/#person`;
const ORGANIZATION_ID = `${site.url}/#organization`;
const REMOTE_SERVICE_AREAS = entityFacts.delivery.regions.map((name) => ({
  "@type": "Country",
  name,
}));

/*
 * Structured data for this page. It carried only the sitewide Person and
 * ProfessionalService before, so the actual service lines and engagement
 * formats were invisible to search and answer engines even though they are
 * the whole point of the page.
 *
 * Prices are deliberately absent. data/services.ts states plainly that its
 * figures are a first draft and should be read as agreed pricing by nobody.
 * Schema.org is machine readable and can surface as firm pricing in a search
 * result, which would turn a working draft into a public quote. Names,
 * descriptions and audiences are all real copy already on the page, so they
 * go in; the numbers wait until they are confirmed.
 */
const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SERVICES_URL}#page`,
  url: SERVICES_URL,
  name: "Brand Strategy & Systems | Branding Tatva",
  description:
    "Founder led remote brand strategy, positioning, messaging, identity and content systems for service businesses in the United States, United Kingdom and India.",
  author: { "@id": PERSON_ID },
  publisher: { "@id": ORGANIZATION_ID },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Brand Strategy & Systems", item: SERVICES_URL },
    ],
  },
  mainEntity: { "@id": `${SERVICES_URL}#catalog` },
};

// The six service lines: what the practice actually does.
const serviceCatalogJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": `${SERVICES_URL}#catalog`,
  name: "Brand strategy service lines",
  url: SERVICES_URL,
  provider: { "@id": ORGANIZATION_ID },
  itemListElement: offerings.map((offering, index) => ({
    "@type": "Offer",
    position: index + 1,
    itemOffered: {
      "@type": "Service",
      "@id": `${SERVICES_URL}#service-${index + 1}`,
      name: offering.name,
      description: offering.detail,
      serviceType: offering.name,
      provider: { "@id": ORGANIZATION_ID },
      brand: { "@id": ORGANIZATION_ID },
      areaServed: REMOTE_SERVICE_AREAS,
    },
  })),
};

// The three engagement formats: how a project is shaped. Each carries the
// audience it is written for, which is the part an answer engine can use to
// match a real question ("who is this for") to a real answer.
const engagementsJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": `${SERVICES_URL}#engagements`,
  name: "Engagement formats",
  url: SERVICES_URL,
  provider: { "@id": ORGANIZATION_ID },
  itemListElement: packages.map((pkg, index) => ({
    "@type": "Offer",
    position: index + 1,
    itemOffered: {
      "@type": "Service",
      "@id": `${SERVICES_URL}#${pkg.slug}`,
      name: pkg.name,
      description: pkg.description,
      provider: { "@id": ORGANIZATION_ID },
      audience: { "@type": "Audience", audienceType: pkg.forWho },
      areaServed: REMOTE_SERVICE_AREAS,
      serviceOutput: pkg.includes.map((item) => ({ "@type": "Thing", name: item })),
    },
  })),
};

export const metadata: Metadata = {
  title: "Brand Strategy for Service Businesses",
  description:
    "Founder led brand strategy, positioning, messaging, identity and content systems for service businesses in the US, UK and India, delivered remotely by Suman Sharma.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Brand Strategy for Service Businesses | Branding Tatva",
    description:
      "Founder led brand strategy, positioning, messaging, identity and content systems for service businesses in the US, UK and India, delivered remotely by Suman Sharma.",
    type: "website",
  },
};

// Rebuilt from a services catalog into a "Brand Discovery Experience" —
// one section per objection a visitor actually carries into the page
// (Curiosity → Authority → Education → Desire → Risk removal → Book
// call), not a service-by-service list. Trust, Proof, and Future
// vision (the founder bio, the case study, and the six-stage extended
// process) were removed after a Creative Direction Audit — the former
// process sequence was also rendering with overlapping text, a real
// bug, not just a pacing call. See the plan doc (Phase 14) for the
// original reasoning. PinnedBrandBuild now resolves inside one native
// scroll frame, and the recognition ladder stays a light DOM instrument
// rather than becoming a page-wide Three.js effect.

// Conversion order (Phase 2 of the redesign brief): the commercial
// path — situation, packages, proof — comes before the teaching
// chapters, so a ready visitor can act inside the first two scrolls.
// Every immersive chapter needs an escape, and this array feeds both
// the floating index and the hero's own chapter list. It covered the
// first three of nine, so a visitor eight chapters deep had no entry
// to point at and no way back to booking except scrolling the whole
// way. All nine anchors already exist and already carry scroll-mt-24.
const JUMP_ITEMS = [
  { href: "#services-opening", label: "Where this starts" },
  { href: "#situation", label: "Your situation" },
  { href: "#offerings", label: "What the work covers" },
  { href: "#desire", label: "Ways to work" },
  { href: "#proof", label: "Client evidence" },
  { href: "#authority", label: "What holds the brand" },
  { href: "#education", label: "How buyers remember" },
  { href: "#audit", label: "Brand check" },
  { href: "#book", label: "Book a diagnosis" },
];

// The fixed chapter rail carries the complete nine-part journey once the
// visitor is moving. The opening needs a quicker read: four commercial acts
// that explain the page before asking someone to process its full contents.
const HERO_ACTS = [
  { href: "#situation", number: "01", label: "Name the situation", note: "Find the real starting point" },
  { href: "#offerings", number: "02", label: "See the system", note: "Inspect what the work covers" },
  { href: "#proof", number: "03", label: "Follow the evidence", note: "Trace one decision into delivery" },
  { href: "#book", number: "04", label: "Bring the problem", note: "Enter the Strategy Room prepared" },
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
      <main id="main-content" data-services-page="true" style={{ backgroundColor: "#3f4d44" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceCatalogJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(engagementsJsonLd) }} />
        <PricingProvider initialRegion={region}>
        {/* Curiosity opens as a complete first scene rather than a
            compact masthead. One viewport belongs to the root-system
            film, proposition, proof, and chapter map; the Situation
            chapter only begins after the visitor has finished this
            frame. The scene still advances quickly because the veil and
            word reveal respond inside the viewport, not by shortening it. */}
        <PhotoHero
          id="services-opening"
          video="/videos/generated/bt-services-hero-root-system.mp4"
          videoMobile="/videos/generated/bt-services-hero-root-system-mobile.mp4"
          poster="/images/generated/bt-services-hero-root-system-poster.jpg"
          mediaMode="video"
          minHeight="100vh"
          overlayGradient="linear-gradient(180deg, rgba(36,45,39,0.16) 0%, rgba(36,45,39,0.24) 58%, rgba(36,45,39,0.42) 100%)"
          playbackRate={1.15}
        >
          {/* Restored August 28 hero film: a living underground root
              network becomes legible as a restrained mineral-ivory
              signal travels through connected paths. The image explains
              the page's premise before the copy does: brand recognition
              is a system beneath the visible surface, not one isolated
              deliverable. The explicit video mode keeps this historical
              banner moving while later short generated loops elsewhere
              remain protected by the living-still treatment. */}
          <HeroReveal />
          {/* A restrained directional scrim protects the masthead
              while leaving the generated root architecture readable
              on the right side of the frame. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "linear-gradient(90deg, rgba(27,36,31,0.58) 0%, rgba(27,36,31,0.22) 48%, transparent 76%)" }}
          />
          {/* The headline resolves by word, not character. It
              participates in the scene without delaying basic
              comprehension. */}
          <Container className="relative py-20 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal
                delay={0.35}
                className="rounded-[1.75rem] border border-ivory/10 bg-[rgba(22,30,25,0.36)] p-5 shadow-[0_28px_90px_rgba(10,16,13,0.2)] backdrop-blur-xl sm:p-7"
              >
                <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/90">
                  Brand strategy &amp; systems
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
                  When the business has grown past its brand, begin with the position.
                </SplitReveal>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-ivory/90">
                  For founders launching, repositioning, or tired of correcting every channel, this page shows what
                  we decide, what gets built, what it costs, and what the evidence can support.
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
                      href="#situation"
                      className="group inline-flex min-h-11 items-center gap-2 text-sm tracking-wide text-ivory/90 transition-colors duration-300 hover:text-ivory"
                    >
                      <span className="link-underline">Choose the situation that sounds like yours</span>
                      <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">
                        ↓
                      </span>
                    </a>
                  </Magnetic>
                </div>
              </Reveal>
              {/* Four acts are enough to orient the opening frame. The
                  complete nine-chapter rail takes over once the visitor
                  moves, so the headline never has to compete with a table
                  of contents before its argument has landed. */}
              <Reveal delay={0.1} className="hidden lg:block lg:pb-2">
                <ol aria-label="The Brand Strategy journey" className="lg:min-w-64">
                  {HERO_ACTS.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="group grid grid-cols-[auto_1fr] items-start gap-x-3 border-b border-ivory/20 py-3.5 text-left transition-colors duration-200 hover:border-ivory/45 focus-visible:border-ivory/60"
                      >
                        <span className="row-span-2 font-display text-sm text-sandstone/90 transition-colors duration-200 group-hover:text-sandstone">
                          {item.number}
                        </span>
                        <span className="text-sm tracking-wide text-ivory transition-colors duration-200">
                          {item.label}
                        </span>
                        <span className="mt-1 text-[0.68rem] leading-snug tracking-[0.02em] text-ivory/72 transition-colors duration-200 group-hover:text-ivory/86">
                          {item.note}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </Container>
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
        <section id="situation" data-services-scene="situation" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: "#3f4d44" }}>
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
                "linear-gradient(100deg, rgba(16,19,20,0.66) 0%, rgba(16,19,20,0.34) 46%, rgba(16,19,20,0.14) 100%)",
            }}
          />
          <div data-services-content-plane="true" className="relative">
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
            data-services-media-wash="offerings"
            aria-hidden="true"
          />
          <div data-services-content-plane="true" className="relative w-full">
            <ServiceDisciplineExplorer />
          </div>
          <SceneHandoff color="#0E1714" />
        </section>

        {/* Desire exposes the packages early enough for a ready
            visitor to act before the teaching chapters. Its original
            deep-water film keeps three legitimate currents visible,
            then lets them resolve into one legible scope. */}
        <section id="desire" data-services-scene="desire" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-14 sm:py-16 lg:py-16" style={{ backgroundColor: MOOD.deepwater }}>
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
                "linear-gradient(180deg, rgba(14,23,20,0.34) 0%, rgba(14,23,20,0.16) 45%, rgba(14,23,20,0.4) 100%)",
            }}
          />
          {/* Scene dissolve: the situation chapter's charcoal into
              Desire's deep water. */}
          <SceneVeil color="#171A17" />
          <div data-services-content-plane="true" className="relative">
            <PackageSelector />
          </div>
          <SceneHandoff color="#171A17" />
        </section>

        {/* Verified outcome — proof directly after the packages, every
            number from projects.ts verified stats. Charcoal ground so
            the numbers themselves are the visual; it also hands
            seamlessly into Authority's identical charcoal. */}
        <section id="proof" data-services-scene="verified-outcome" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <BackgroundVideo
            video="/videos/generated/bt-services-verified-rings.mp4"
            poster="/images/generated/bt-services-verified-rings-poster.jpg"
            parallax
            playbackRate={0.94}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(13,18,18,0.58) 0%, rgba(13,18,18,0.36) 48%, rgba(13,18,18,0.28) 100%)",
            }}
          />
          <SceneVeil color="#0E1714" />
          <div data-services-content-plane="true" className="relative">
            <VerifiedOutcome />
          </div>
        </section>

        {/* Authority now resolves inside one viewport. The shared services
            camera assembles its five layers during entry, discovery, and
            resolution, so the chapter keeps its teaching sequence without
            holding the visitor inside a long sticky runway. */}
        <section id="authority" className="relative scroll-mt-24" style={{ backgroundColor: MOOD.charcoal }}>
          <PinnedBrandBuild />
          <SceneHandoff color="#191B16" />
        </section>

        {/* Perception gives the system build a market consequence. The
            dedicated ascent film and one stable interactive frame replace
            the former shader heavy ladder: native page progress previews the
            four states, while hover, touch, and keyboard input can hold any
            state for closer reading. */}
        <section
          id="education"
          data-services-scene="education"
          className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"
          style={{ backgroundColor: "#18221F" }}
        >
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-perception-ascent.mp4"
            videoMobile="/videos/generated/bt-services-perception-ascent-mobile.mp4"
            poster="/images/generated/bt-services-perception-ascent-poster.jpg"
            playbackRate={1.08}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(102deg, rgba(13,19,17,0.62) 0%, rgba(16,24,21,0.36) 48%, rgba(16,24,21,0.2) 100%)",
            }}
          />
          <SceneVeil color="#191B16" />
          <div data-services-content-plane="true" className="relative">
            <PerceptionLadder />
          </div>
          <SceneHandoff color="#141A15" />
        </section>

        {/* The Brand Recognition Audit — the site's one secondary lead
            asset, placed right after the recognition ladder so a visitor who
            has located the brand's stage can inspect the deeper signals
            away. Five checks open to anyone, the full ten behind an
            explicit consent form feeding the existing Mailchimp double
            opt in. Charcoal ground between the forest and the warm
            strategy room that closes the page. */}
        <section id="audit" data-services-scene="audit" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-start overflow-hidden pb-16 pt-24 sm:py-20 lg:justify-center lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <BackgroundVideo
            video="/videos/generated/bt-services-recognition-audit-leaf.mp4"
            poster="/images/generated/bt-services-recognition-audit-leaf-poster.jpg"
            parallax
            playbackRate={0.9}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(13,18,17,0.62) 0%, rgba(13,18,17,0.36) 50%, rgba(13,18,17,0.18) 100%)",
            }}
          />
          <SceneVeil color="#141A15" />
          <div data-services-content-plane="true" className="relative">
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
          overlayGradient="linear-gradient(180deg, rgba(10,15,16,0.26) 0%, rgba(14,18,18,0.34) 52%, rgba(20,17,14,0.54) 100%)"
          className="flex min-h-[100svh] flex-col justify-center pb-16 pt-24 sm:pb-20 sm:pt-32"
        >
          <StrategyRoomCTA />
        </TexturedDark>
        </PricingProvider>
      </main>
      <Footer compact />
      <SectionJumpNav items={JUMP_ITEMS} hideOnLast showActiveLabel={false} guidedMobile />
    </>
  );
}
