import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { preload } from "react-dom";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ScrollCue } from "@/components/ScrollCue";
import { ScrollProgress } from "@/components/ScrollProgress";
import { PhotoHero } from "@/components/PhotoHero";
import { TexturedDark } from "@/components/TexturedDark";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { SituationPath } from "@/sections/Services/SituationPath";
import { RecognitionAudit } from "@/sections/Services/RecognitionAudit";
import { PricingProvider } from "@/components/PricingProvider";
import { REGION_COOKIE, isRegion, regionFromCountry } from "@/data/pricing";
import { VerifiedOutcome } from "@/sections/Services/VerifiedOutcome";
import { SceneVeil } from "@/sections/Services/SceneVeil";
import { SceneHandoff } from "@/sections/Services/SceneHandoff";
import { SplitReveal } from "@/components/SplitReveal";
import { HeroReveal } from "@/sections/Services/HeroReveal";
import { PinnedBrandBuild } from "@/sections/Services/PinnedBrandBuild";
import { PerceptionLadder } from "@/sections/Services/PerceptionLadder";
import { PackageSelector } from "@/sections/Services/PackageSelector";
import { WeakBrandingCost } from "@/sections/Services/WeakBrandingCost";
import { DeliverablesExplorer } from "@/sections/Services/DeliverablesExplorer";
import { ContextualCTA } from "@/components/conversion/ContextualCTA";
import { ImagineYourBrand } from "@/sections/Services/ImagineYourBrand";
import { BrandHealthCheck } from "@/sections/Services/BrandHealthCheck";
import { StrategyRoomCTA } from "@/sections/Services/StrategyRoomCTA";
import { Magnetic } from "@/components/Magnetic";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { MOOD } from "@/lib/sectionWash";
import { offerings } from "@/data/services";

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
// full original reasoning, including why GSAP ScrollTrigger.pin
// appears exactly once (PinnedBrandBuild) and Three.js exactly once
// (inside PerceptionLadder, via AmbientElementShader) rather than
// throughout — every other pinned moment on this page and site runs on
// the same sticky mechanism already proven everywhere else.

// Conversion order (Phase 2 of the redesign brief): the commercial
// path — situation, packages, proof — comes before the teaching
// chapters, so a ready visitor can act inside the first two scrolls.
const JUMP_ITEMS = [
  { href: "#situation", label: "Your situation" },
  { href: "#offerings", label: "Services" },
  { href: "#desire", label: "Packages" },
];

// Ambient consolidation (Suman's review: "duplicated ambient effects",
// "one motion language"): this page stacked twenty five atmosphere
// layers — six shaders, particle fields, and the veil/handoff seams —
// so every chapter competed with its own background. The seams stay as
// the site's one transition grammar; the shader repeats and particle
// fields are gone, leaving the filmed footage to carry atmosphere.
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
  preload("/images/pexels-aspen-sunburst-poster.jpg", { as: "image", fetchPriority: "high" });
  return (
    <>
      <Header transparent />
      <ScrollProgress />
      {/* Charcoal ground for the whole experience — the permanent fix
          for the "white space at left and right" class of bug. The
          site's body ground is cream; on this page every full-bleed
          scene paints its own dark background, and the one section
          whose paint is delegated to a GSAP-pinned child
          (PinnedBrandBuild) can transiently narrow when the pin's
          cached width measurement goes stale — the documented pin
          artifact class — exposing cream at both edges. With the page
          ground itself charcoal (and the #authority wrapper painting
          charcoal below), no measurement artifact anywhere on this
          page can ever expose a light edge again: worst case is
          charcoal on charcoal, invisible. The parchment chapter still
          paints its own bg-background-alt deliberately. */}
      <main id="main-content" style={{ backgroundColor: MOOD.charcoal }}>
        <PricingProvider initialRegion={region}>
        {/* Curiosity — the opening objection: why care about branding at
            all. Two short opinionated lines build the claim (Framer
            Motion AnimatePresence, CyclingStatement.tsx) before handing
            off to the same char-level SplitText reveal every other
            headline moment already uses — visitors experience a claim
            forming rather than reading a static question. Height stays
            Tier 3 (70vh), the documented mid-page tier in PhotoHero's
            own comment — this page's ambition shows in what follows the
            hero, not in breaking the site's hero-height hierarchy. A
            newly-sourced "ink dispersing in dark water" clip was tried
            here and reverted immediately on direct feedback — a black-
            background studio abstraction breaks the site's own
            established warm, sunlit, natural register (documented in
            CLAUDE.md's own video-sourcing standard), regardless of how
            cinematically it reads on its own. Back to the calm misty
            pine trail already proven here.
            Redesigned from the centered pill-badge-plus-headline
            template (identical to what Work/Contact used to share)
            into the same asymmetric masthead already proven on those
            pages and on the case-study/blog-post templates: a large
            offset headline in one column, a real-data aside in the
            other. The aside reuses this exact page's own SectionJumpNav
            items — real wayfinding, not decoration — so the hero itself
            previews the four objections the rest of the page answers. */}
        <PhotoHero
          video="/videos/pexels-aspen-sunburst.mp4"
          poster="/images/pexels-aspen-sunburst-poster.jpg"
          minHeight="70vh"
        >
          {/* Approved awakening footage (Pexels 31883946, Joshua
              Woroniecki, free license): a sun star breaking through
              backlit trembling aspens, birch trunks in bokeh depth —
              the first candidate to pass all five hero questions
              (clear visual event, revealing light, layered depth,
              scroll-stopping, stronger than its predecessor). Full 20s
              slowed to 24s, 2s forward dissolve, no reverse motion.
              The reveal veil below lifts the forest darkness so the
              page wakes into the burst. */}
          <HeroReveal />
          {/* Phase 1 hero pass. Two localized layers on top of
              PhotoHero's own base gradient: a cool tint pulling the
              warm trail footage toward the page's opening-chapter mood
              (the color script starts cool; gold only arrives at
              Desire), and a directional left-heavy scrim so the
              masthead column reads perfectly while the right of the
              frame stays open and cinematic. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "linear-gradient(90deg, rgba(15,18,17,0.38) 0%, rgba(15,18,17,0.12) 45%, transparent 70%)" }}
          />
          {/* Phase 2, hero motion language: "typography forming." The
              claim assembles (CyclingStatement), and the giant page
              title drifts at a slower rate than the scroll around it —
              depth through type, no imagery involved. */}
          <Container className="relative py-20 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal delay={1.7}>
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
                  splitType="chars"
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
          <ScrollCue />
          {/* Scene dissolve system, boundary 1 of 7: the hero's last
              frames darken into Authority's charcoal, so the cut into
              the pinned build reads as the same shot getting darker
              rather than a new page section starting. Every following
              chapter opens with the same device — a veil of the
              PREVIOUS chapter's mood color dissolving into its own —
              one continuous color journey instead of stacked blocks. */}
          <SceneHandoff color="#171A17" heightClass="h-[24vh]" />
        </PhotoHero>

        {/* Choose your situation — the visitor places themselves before
            any package is pitched. Reads the Home page's saved choice
            (the shared localStorage key VisitorRecognition writes) so
            the site remembers where they stand instead of asking twice.
            A quiet interstitial on the page's charcoal ground; the
            chapters around it carry the media. */}
        <section id="situation" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          {/* Deliberate art direction, cut this round from the archived
              4K master (Pexels 32795404, standard license): sunrise
              breaking over a misted river valley, water branching into
              several channels, white birds moving through the wetland —
              the day starting over three possible paths, which is
              exactly this chapter's question. Graded bright and warm
              (lifted shadows, gentle vibrance, cool shadow balance) at
              2560 wide, 10.5s forward crossfade loop, no reverse
              motion. */}
          <BackgroundVideo
            parallax
            video="/videos/pexels-river-dawn.mp4"
            videoWebm="/videos/pexels-river-dawn.webm"
            poster="/images/pexels-river-dawn-poster.jpg"
          />
          {/* Left weighted scrim — the sticky heading rail sits on the
              darker stops while the sunrise and river stay open on the
              right of the frame. */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(23,26,23,0.82) 0%, rgba(23,26,23,0.6) 45%, rgba(23,26,23,0.42) 100%)",
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
        <section id="offerings" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <Container className="relative max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
              <Reveal className="lg:sticky lg:top-28 lg:self-start">
                <p className="text-sm font-medium uppercase tracking-wide text-sandstone">The full practice</p>
                <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                  Six kinds of work, one discipline underneath.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
                  Every service below shows up inside the packages further down; this is the complete list, stated
                  plainly.
                </p>
              </Reveal>
              {/* Every neighbouring chapter carries footage and a real
                  interaction; this one was six static rows. spotlight-grid
                  is pure CSS, so resting on one discipline dims the other
                  five and the row takes its own accent. */}
              <div className="spotlight-grid">
                {offerings.map((offer, i) => (
                  <Reveal key={offer.name} delay={i * 0.05}>
                    <div
                      className="spotlight-card group grid gap-2 rounded-2xl border-t border-ivory/12 px-4 py-6 transition-colors duration-500 hover:bg-ivory/[0.05] sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8"
                      style={{ borderTopColor: "rgba(244,239,230,0.12)" }}
                    >
                      <p className="flex items-center gap-3 font-display text-xl font-normal text-ivory">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-[2.2]"
                          style={{ backgroundColor: offer.color }}
                        />
                        {offer.name}
                      </p>
                      <p className="text-sm leading-relaxed text-ivory/85 sm:pt-1">{offer.detail}</p>
                    </div>
                  </Reveal>
                ))}
                <div className="h-px bg-ivory/12" aria-hidden="true" />
              </div>
            </div>
          </Container>
          <SceneHandoff color="#0E1714" />
        </section>

        {/* Desire — the real package selector, moved to chapter three
            per the conversion redesign: packages exposed inside the
            first two scrolls instead of after the teaching chapters.
            Mood: DEEP WATER — same fungi clip and overlay as before the
            move; only the dissolve colors changed with the new
            neighbours. The full art direction history for this chapter
            lives in git on the pre move block. */}
        <section id="desire" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.deepwater }}>
          <BackgroundVideo parallax
            push
            video="/videos/pexels-forest-floor-fungi.mp4"
            videoWebm="/videos/pexels-forest-floor-fungi.webm"
            poster="/images/pexels-forest-floor-fungi-poster.jpg"
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
        <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <SceneVeil color="#0E1714" />
          <div className="relative">
            <VerifiedOutcome />
          </div>
        </section>

        {/* Authority — the one deliberate ScrollTrigger.pin section. */}
        {/* The wrapper paints charcoal itself — it sits in normal flow,
            is never transformed by GSAP, and therefore always spans the
            full viewport regardless of what the pin does to its child.
            See the main-level comment above for the full root cause. */}
        <section id="authority" className="relative scroll-mt-24" style={{ backgroundColor: MOOD.charcoal }}>
          <PinnedBrandBuild />
          <SceneHandoff color="#191B16" />
        </section>

        {/* An extension of Authority, not a new act — shows the real
            stakes behind "marketing amplifies whatever is already
            there" before Education explains the recognition ladder.
            Grounded in established branding theory (mental
            availability, distinctive assets), described as a general
            pattern rather than a specific company's story — the
            honest version of the requested comparison, since no real
            two-business case study exists yet to build a factual one
            from. Same ambient shader as Authority/Education/Desire —
            direct feedback that stacking several new flat bg-soil
            sections back to back recreated the exact "dead zone"
            problem already fixed once on Desire; the fix is the same
            each time, continuing one visual system rather than adding
            a new device per section. */}
        {/* Mood: STONE. Part of the Phase 1 cinematic color script —
            each Services section sits on its own temperature-shifted
            dark (see MOOD in sectionWash.ts) instead of the one warm
            soil veil that was re-warming the whole page into a single
            amber wash. The overlay gradient is tinted with the
            section's own mood tone, never soil. */}
        <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.stone }}>
          {/* Approved Positioning footage (Pexels 6134369, standard
              license). This is the arrival shot — one dominant summit
              above the cloud inversion, stillness and hierarchy — so it
              lives on THIS chapter (positioned generically vs
              distinctly), per the direction that Positioning means
              standing above the market while Education means climbing
              toward it. Cool grade per the same direction: warmth pulled
              across shadows and mids, depth carried by contrast and the
              sun's own luminance rather than color, so the peak stays
              unmistakably above everything without the golden postcard. */}
          <BackgroundVideo
            parallax
            video="/videos/pexels-summit-inversion.mp4"
            videoWebm="/videos/pexels-summit-inversion.webm"
            poster="/images/pexels-summit-inversion-poster.jpg"
          />
          {/* Tertiary life, story-first: a single distant bird crossing
              above the cloud sea at long, irregular intervals — the one
              thing moving higher than the summit's own stillness,
              underlining elevation without disturbing it. */}
          {/* Overlay stays a step cooler than the stone base and a touch
              denser at the top where the sky sits — the summit clip is
              already graded slate, so this only steadies type contrast
              without dulling the cloud sea's own shadow depth. */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(24,27,23,0.78) 0%, rgba(24,27,23,0.55) 50%, rgba(24,27,23,0.75) 100%)",
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

        {/* Education — the one Three.js moment (inside PerceptionLadder,
            via AmbientElementShader), scoped and ambient. Chapter identity
            per direct creative direction: the CLIMB — movement upward,
            evolving perspective, rising through layers. Its footage slot
            is reserved for an approved ascending shot. */}
        {/* Mood: MIST — blue-grey, the coolest chapter so far, directly
            after Stakes' dry stone. See MOOD in sectionWash.ts. */}
        <section id="education" className="relative scroll-mt-24 overflow-hidden" style={{ backgroundColor: MOOD.mist }}>
          {/* Approved Education footage (Pexels 8522207, David Roberts,
              free license): seedlings rising out of dark soil in
              timelapse — the climb performed by nature itself, growth
              stages upward from unknown ground, no human needed. Also
              the film's best cut: Authority ends underground in roots;
              this chapter opens with what those roots push above the
              surface. Crossfade loop (never ping-pong — reversed growth
              reads as shrinking). */}
          <BackgroundVideo
            parallax
            video="/videos/pexels-redwood-ferns.mp4"
            videoWebm="/videos/pexels-redwood-ferns.webm"
            poster="/images/pexels-redwood-ferns-poster.jpg"
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

        {/* Deliverables — direct feedback wanted these to feel
            tangible rather than left as bullet points inside a card. Every
            item traces to real services.ts data (see the component's
            own comment). No id/jump-nav entry — a supporting beat within
            Desire's own objection. Same shader treatment as the
            sections around it — see WeakBrandingCost's comment above
            for why. */}
        {/* Mood: THE STUDY — final art direction on this chapter, per
            direct screenshot feedback: the abstract room (lamp glows,
            cloth light, empty dark field) broke the site's own visual
            standard — every other chapter lives in serene nature. The
            study now sits over the emerald river (the approved clip
            held in the reassignment pool since Phase 1): slow green
            water, the Pinterest register exactly, darkened by a
            walnut-tinted overlay so the ivory documents stay the
            brightest thing in frame. */}
        <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.study }}>
          {/* Fresh clip per direct instruction and the glassmorphism
              references (Pexels id 27065369, standard free license):
              mist drifting over a calm lake at dawn, tree silhouette
              framing — the serene register of the Home and About
              backdrops. The overlay is deliberately light: the scene
              is meant to SHOW, the frosted glass cards carry their own
              readability. Strongest 8s, slowed 0.9x, near native
              grade, seamless ping-pong loop. 3.2MB MP4 / 2.0MB WebM. */}
          <BackgroundVideo
            parallax
            push
            video="/videos/pexels-dandelion-release.mp4"
            videoWebm="/videos/pexels-dandelion-release.webm"
            poster="/images/pexels-dandelion-release-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(23,32,25,0.55) 0%, rgba(23,32,25,0.28) 45%, rgba(23,32,25,0.6) 100%)",
            }}
          />
          {/* Scene dissolve: Education's blue mist hands into the river
              study. */}
          <SceneVeil color="#1A2026" heightClass="h-[15vh]" />
          <div className="relative">
            <DeliverablesExplorer />
          </div>
          <SceneHandoff color="#141A15" />
        </section>

        <ContextualCTA
          eyebrow="Medium step"
          heading="Not sure which scope is right yet?"
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
        <section id="imagine" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.charcoal }}>
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

        {/* A slower alternative to Desire's one-click pick, for a visitor
            who wants to think it through before Risk removal and the
            booking CTA — direct feedback wanted the visitor to feel
            invested before the calendar appears. Transparent scoring,
            real package mapping, see the component's own comment for
            why it's a distinct mechanism from PackageSelector rather
            than a duplicate of it. Same shader treatment as the
            sections around it — see WeakBrandingCost's comment above
            for why. */}
        {/* Mood: FOREST — deep green-black after the light editorial
            break; the stream clip's mossy greens finally read as green
            instead of being re-warmed to amber by a soil overlay. */}
        <section id="health" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.forest }}>
          {/* Media replaced per direct approval (Pexels id 38507614,
              standard license): near-black still water carrying green
              foliage reflections — the chapter's own question made
              visual, a self assessment as looking into still water,
              replacing the generic forest stream. Trimmed to the
              strongest 8s, slowed 0.85x, graded a step darker and
              quieter into the forest mood, built into the same
              seamless ping-pong loop as the other Pexels assets.
              2.0MB MP4 / 0.7MB WebM. */}
          <BackgroundVideo
            parallax
            video="/videos/pexels-moss-stream.mp4"
            videoWebm="/videos/pexels-moss-stream.webm"
            poster="/images/pexels-moss-stream-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(20,26,21,0.55) 0%, rgba(20,26,21,0.35) 50%, rgba(20,26,21,0.6) 100%)",
            }}
          />
          {/* Scene dissolve: the dossier's parchment light spills into
              the top of the forest — light traveling downward into the
              next scene. */}
          {/* Scene dissolve: the study's warm dark hands into the
              forest — lamplight dimming into green-black. */}
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
        <section id="audit" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <SceneVeil color="#141A15" />
          <div className="relative">
            <RecognitionAudit />
          </div>
          <SceneHandoff color="#27221E" />
        </section>

        {/* Book call — the strategy room. Direct feedback that the
            previous asset (a blurred coffee cup and notebook photo)
            read as a generic desk stock cliché on the page's single
            most consequential section. Replaced after a real search
            against the site's own established language (rejected along
            the way: a portrait-oriented curtain clip, a cluttered dark
            cabin interior, a cluttered kids' playroom) with sunlight
            drifting across weathered wood grain (Pexels id 4102353,
            standard license) — genuinely macro, muted, and quiet,
            verified across the full clip's motion, not just its poster
            frame. Trimmed to a 5s graded segment, then built into a
            mathematically seamless 10s ping-pong loop (forward +
            time-reversed twin), so there is no loop-point jump. First
            WebM asset on the site (TexturedDark's own comment covers
            why), MP4 fallback alongside it. */}
        {/* Phase 1: the emotional resting point before conversion — the
            page's kept golden moment gets the most generous vertical
            breathing room on the page, arriving like a quiet studio
            after the cool chapters rather than "the end of a website." */}
        <TexturedDark
          id="book"
          image="/images/pexels-valley-first-light-poster.jpg"
          video="/videos/pexels-valley-first-light.mp4"
          videoWebm="/videos/pexels-valley-first-light.webm"
          className="scroll-mt-24 pb-16 pt-24 sm:pb-20 sm:pt-32"
        >
          <StrategyRoomCTA />
        </TexturedDark>
        </PricingProvider>
      </main>
      <Footer />
      <SectionJumpNav items={JUMP_ITEMS} />
    </>
  );
}
