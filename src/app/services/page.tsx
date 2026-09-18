import type { Metadata } from "next";
import Image from "next/image";
import { cookies, headers } from "next/headers";
import { site } from "@/data/site";
import { entityFacts } from "@/data/entityFacts";
import { offerings, packages } from "@/data/services";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { LivingGradient } from "@/components/LivingGradient";
import { TexturedDark } from "@/components/TexturedDark";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { SituationPath } from "@/sections/Services/SituationPath";
import { ServiceDisciplineExplorer } from "@/sections/Services/ServiceDisciplineExplorer";
import { RecognitionAudit } from "@/sections/Services/RecognitionAudit";
import { PricingProvider } from "@/components/PricingProvider";
import { REGION_COOKIE, isRegion, regionFromCountry } from "@/data/pricing";
import { VerifiedOutcome } from "@/sections/Services/VerifiedOutcome";
import { WorkIndex } from "@/sections/Work/WorkIndex";
import { DecisionMap } from "@/sections/Work/DecisionMap";
import { TatvaLab } from "@/sections/Work/TatvaLab";
import { projects } from "@/data/projects";
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
import { ArrowDown } from "lucide-react";

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
    "Brand strategy, positioning, messaging, identity and content systems for UK service businesses, led remotely by Suman Sharma. Also serving founders in India and the US.",
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
  title: "Brand Strategy for UK Service Businesses",
  description:
    "Brand strategy for UK service businesses, led remotely by Suman Sharma. Explore positioning, messaging, identity and content systems built around your buyers.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Brand Strategy for UK Service Businesses | Branding Tatva",
    description:
      "Brand strategy for UK service businesses, led remotely by Suman Sharma. Explore positioning, messaging, identity and content systems built around your buyers.",
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
  { href: "#index", label: "Every case" },
  { href: "#authority", label: "What holds the brand" },
  { href: "#education", label: "How buyers remember" },
  { href: "#audit", label: "Brand check" },
  { href: "#book", label: "Book a diagnosis" },
];

// The fixed chapter rail carries the complete nine-part journey once the
// visitor is moving. The opening needs a quicker read: four commercial acts
// that explain the page before asking someone to process its full contents.
const HERO_ACTS = [
  { href: "#situation", number: "01", label: "Name the real problem", note: "The business, the buyer, the gap" },
  { href: "#offerings", number: "02", label: "Connect the decisions", note: "Position into language, identity, and action" },
  { href: "#proof", number: "03", label: "See what holds up", note: "Real projects and the decisions behind them" },
  { href: "#book", number: "04", label: "Talk it through", note: "Thirty minutes directly with Suman" },
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
  // The living gradient opening needs no media preload; the retired
  // aspen poster hint was fetching 200KB nobody renders.
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
        {/* SCROLL RUNWAY. Measured against /about, which Suman names as the
            closest thing on this site to the scroll character she wants:

              about     sections 1043-1501px   dScale 0.90-1.00   dY 82-190px
              services  sections 790px (=1vh)  dScale 0.03-0.04   dY 17-85px

            About lets content define height, so a chapter spans 1.3 to 1.9
            viewports and scroll-linked motion has distance to play out.
            Services locked every chapter to exactly one viewport, so its own
            runtime — which already publishes scene progress, content x/y/
            rotate/scale, camera x/y/scale and copy opacity — had no travel to
            spend them across. The choreography was built and then starved.

            Per SCROLL_OS §11 (Services: one major and two minor) rather than
            giving every chapter runway: offerings is the major at 170svh,
            situation and education the minors at 140svh. #desire and #book
            stay at one frame deliberately, because pricing and booking are
            where money hates motion.

            #authority is NOT given runway here. It holds PinnedBrandBuild,
            the one place this codebase uses GSAP ScrollTrigger.pin, which
            CLAUDE.md records as twice built and twice abandoned. Restoring a
            pinned runway there needs its own careful pass. */}
        <PricingProvider initialRegion={region}>
        {/* Curiosity opens as a complete first scene rather than a
            compact masthead. One viewport belongs to the opening film,
            proposition, proof, and chapter map; the Situation chapter
            only begins after the visitor has finished this frame. The
            scene still advances quickly because the veil and word reveal
            respond inside the viewport, not by shortening it.

            The film is the aspen sunburst Suman approved in August against
            her own five-question bar, replacing a near-black procedural
            render. Her recorded media verdict on that set was "dark, vague,
            low quality, serving no purpose", and the standard she set after
            it asks for footage that stays bright while glass panels carry
            readability. This is the first delivery of that re-foundation;
            the remaining procedural slots are still dark. */}
        {/* The aspen film is retired on Suman's direct verdict (the first
            two sections' footage read as noise, and the page before it
            read as clean). The opening frame now follows the reference
            she sent: a calm, stable ground where the type is the event.
            LivingGradient is the proven Home base — a slow canopy field
            with one drifting light shaft, CSS only, nothing competing
            with the headline. */}
        <section
          id="services-opening"
          className="relative flex min-h-[100vh] flex-col justify-center overflow-clip bg-soil"
        >
          <LivingGradient preset="meadow" />
          <HeroReveal />
          {/* The headline resolves by word, not character. It
              participates in the scene without delaying basic
              comprehension. */}
          <Container className="relative py-20 sm:py-28">
            <div className="services-opening-layout grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
              <Reveal
                delay={0.08}
                className="services-hero-copy rounded-[1.75rem] border border-ivory/10 bg-[rgba(22,30,25,0.36)] p-5 shadow-[0_28px_90px_rgba(10,16,13,0.2)] backdrop-blur-xl sm:p-7"
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
                  Decide why they choose you. Build the brand around that.
                </SplitReveal>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-ivory/90">
                  Remote brand strategy for UK service businesses, led directly by Suman Sharma.
                  Position, language, identity, and the places buyers meet you.
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
                      <span className="link-underline">Find your starting point</span>
                      <ArrowDown
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                        strokeWidth={1.8}
                      />
                    </a>
                  </Magnetic>
                </div>
              </Reveal>
              {/* Four acts are enough to orient the opening frame. The
                  complete nine-chapter rail takes over once the visitor
                  moves, so the headline never has to compete with a table
                  of contents before its argument has landed. */}
              <Reveal delay={0.18} className="services-opening-map lg:pb-2">
                <p className="services-opening-map-label">A clearer path from here</p>
                <ol
                  aria-label="The Brand Strategy journey"
                  data-services-hero-index="true"
                  className="lg:min-w-64"
                >
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
          <SceneHandoff color="#171A17" heightClass="h-[24vh]" endOpacity={1} reducedOpacity={1} />
        </section>

        {/* Choose your situation — the visitor places themselves before
            any package is pitched. Reads the Home page's saved choice
            (the shared localStorage key VisitorRecognition writes) so
            the site remembers where they stand instead of asking twice.
            A quiet interstitial on the page's charcoal ground; the
            chapters around it carry the media. */}
        <section id="situation" data-services-scene="situation" className="relative flex min-h-[140svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: "#3f4d44" }}>
          {/* Original procedural Situation film: one coherent material
              world holds three different starting conditions. A pale
              mineral seed begins, shifted strata wait to realign, and
              repeating rings carry consistency forward. The chapter now
              teaches diagnosis without borrowing the Package selector's
              separate water-current metaphor. */}
          {/* The moss stream film is retired with the hero's aspen on the
              same verdict. The diagnosis chapter reads as a quiet dark
              room: a near black orangery field with a warm lamp bloom,
              so the three situation sentences are the only thing moving. */}
          <LivingGradient preset="orangery" />
          {/* Complete the opening cross-dissolve. The hero already
              anticipates this chapter with a 24vh departure veil; the
              matching arrival veil lets that tone release into the
              Situation film instead of exposing a hard horizontal cut. */}
          <SceneVeil color="#171A17" heightClass="h-[24vh]" endOpacity={1} />
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
        <section id="offerings" data-services-scene="offerings" className="relative flex min-h-[170svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          {/* Original generated strategy terrain: mist withdraws from a
              tactile topographic world while one pale route becomes
              clear. The six disciplines stay distinct in the foreground,
              but the moving terrain makes the shared strategic foundation
              visible without turning the chapter into another card grid. */}
          {/* The root network macro read as a harsh tangle on black, the
              exact register the media standard bans. The understory field
              was built to sit under frosted panels, and this chapter is
              frosted panels; the disciplines are the only subject left. */}
          <LivingGradient preset="understory" />
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
            video="/videos/pexels-golden-fog-sea.mp4"
            videoWebm="/videos/pexels-golden-fog-sea.webm"
            poster="/images/pexels-golden-fog-sea-poster.jpg"
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
            video="/videos/pexels-redwood-ferns.mp4"
            videoWebm="/videos/pexels-redwood-ferns.webm"
            poster="/images/pexels-redwood-ferns-poster.jpg"
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

        {/* The case index, restored. /work redirects here to #proof, which left
            a single flagship outcome as the only reachable evidence: a visitor
            convinced by it had nowhere to go to see the rest. WorkIndex was
            built for the old /work page and stranded complete and unimported
            when that route was folded in, so this rewires the existing
            component rather than rebuilding it (M4: "Build case index"). It
            carries its own <section id="index">, filters from data/workTaxonomy
            and renders only verified projects from data/projects. */}
        <WorkIndex projects={projects} />

        {/* The causal spine behind the cases above (M4: "case index and causal
            case-study spine"). The index answers which project resembles your
            situation; this answers what was actually decided inside them, which
            is the part that teaches. Also stranded from the old /work page:
            196 lines, zero importers, pulling its own verified projects.
            No jump-nav entry on purpose — it reads as the second half of the
            evidence chapter rather than a tenth destination in a rail that
            already carries nine. */}
        <DecisionMap />

        {/* Concept studies. The three chapters above are all client evidence,
            which only speaks to buyers whose situation already resembles one of
            five engagements. The Lab shows the method itself on brands nobody
            hired us for, which is the only honest way to demonstrate range
            beyond the client list.

            Safe to show beside real work because its framing is explicit and
            enforced in the data: data/conceptProjects.ts opens with an honesty
            contract ("Zero clients, zero engagements, zero outcomes are
            implied"), the component repeats it on screen, and measurement
            sections there are plans rather than results. That is what keeps it
            clear of CLAUDE.md's rule against implying experience. 415 lines,
            zero importers before this. */}
        <TatvaLab />

        {/* Authority now resolves inside one viewport. The shared services
            camera assembles its five layers during entry, discovery, and
            resolution, so the chapter keeps its teaching sequence without
            holding the visitor inside a long sticky runway. */}
        <section id="authority" className="relative" style={{ backgroundColor: MOOD.charcoal }}>
          <PinnedBrandBuild />
          <SceneHandoff color="#191B16" />
        </section>

        {/* A content-sized memory model. Deliberate tab choices stay stable
            while native scrolling carries the reader toward the audit. */}
        <section
          id="education"
          data-services-scene="education"
          className="relative flex flex-col overflow-hidden py-16 sm:py-20 lg:py-24"
          style={{ backgroundColor: "#F2EBDD" }}
        >
          <div data-perception-ambient-film="true" aria-hidden="true" className="absolute inset-0">
            <BackgroundVideo
              parallax
              video="/videos/pexels-summit-inversion.mp4"
              videoWebm="/videos/pexels-summit-inversion.webm"
              poster="/images/pexels-summit-inversion-poster.jpg"
              playbackRate={0.82}
            />
          </div>
          <div data-perception-landscape="true" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[35%] sm:h-[38%]">
            <Image
              src="/images/generated/bt-services-memory-horizon.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div data-perception-paper-wash="true" aria-hidden="true" className="absolute inset-0" />
          <SceneVeil color="#F2EBDD" />
          <div data-services-content-plane="true" className="relative">
            <PerceptionLadder />
          </div>
          <SceneHandoff color="#EEE6D7" />
        </section>

        {/* The Recognition Audit becomes a tactile field note. Five private
            answers remain open before the same explicit Mailchimp consent
            handoff reveals the remaining questions. */}
        <section
          id="audit"
          data-services-scene="audit"
          className="relative flex min-h-[100svh] scroll-mt-24 flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#EEE6D7" }}
        >
          {/* The clarity footage finally has a consumer. A single trout over
              sunlit sand through glass-clear water is the audit chapter's own
              metaphor: you can see all the way to the bottom. Until now the
              whole of generatedMediaManifest.ts was orphaned, so this clip and
              the eight beside it were encoded, correct, and rendered nowhere.

              The paper tone stays on top at 0.82 rather than being replaced.
              This chapter is dark type on light paper and it carries the text
              that was just brought to the reading floor; the footage is meant
              to be sensed at the edges of the card, never to sit under body
              copy. Media standard: footage stays bright, the panel carries
              readability. */}
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-healthcheck-clarity.mp4"
            videoMobile="/videos/generated/bt-services-healthcheck-clarity-mobile.mp4"
            poster="/images/generated/bt-services-healthcheck-clarity-poster.jpg"
            playbackRate={0.92}
          />
          <div aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: "rgb(238 230 215 / 82%)" }} />
          <div data-services-content-plane="true" className="relative w-full">
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
          image="/images/pexels-valley-first-light-poster.jpg"
          video="/videos/pexels-valley-first-light.mp4"
          videoWebm="/videos/pexels-valley-first-light.webm"
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
