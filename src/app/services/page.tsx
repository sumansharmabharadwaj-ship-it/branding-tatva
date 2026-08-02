import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ScrollCue } from "@/components/ScrollCue";
import { ScrollProgress } from "@/components/ScrollProgress";
import { PhotoHero } from "@/components/PhotoHero";
import { TexturedDark } from "@/components/TexturedDark";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { RiskRemovalFAQ } from "@/sections/Services/RiskRemovalFAQ";
import { ClearingMist } from "@/sections/Services/ClearingMist";
import { SceneVeil } from "@/sections/Services/SceneVeil";
import { SceneHandoff } from "@/sections/Services/SceneHandoff";
import { SplitReveal } from "@/components/SplitReveal";
import { HeroReveal } from "@/sections/Services/HeroReveal";
import { PinnedBrandBuild } from "@/sections/Services/PinnedBrandBuild";
import { PerceptionLadder } from "@/sections/Services/PerceptionLadder";
import { PackageSelector } from "@/sections/Services/PackageSelector";
import { WeakBrandingCost } from "@/sections/Services/WeakBrandingCost";
import { DeliverablesReveal } from "@/sections/Services/DeliverablesReveal";
import { BrandHealthCheck } from "@/sections/Services/BrandHealthCheck";
import { StrategySessionPreview } from "@/sections/Services/StrategySessionPreview";
import { StrategyRoomCTA } from "@/sections/Services/StrategyRoomCTA";
import { LazyAmbientShader } from "@/components/LazyAmbientShader";
import { Magnetic } from "@/components/Magnetic";
import { DustMotes } from "@/components/DustMotes";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { SkyLife } from "@/components/SkyLife";
import { ParallaxDrift } from "@/components/ParallaxDrift";
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
// full original reasoning, including why GSAP ScrollTrigger.pin
// appears exactly once (PinnedBrandBuild) and Three.js exactly once
// (inside PerceptionLadder, via AmbientElementShader) rather than
// throughout — every other pinned moment on this page and site runs on
// the same sticky mechanism already proven everywhere else.

const JUMP_ITEMS = [
  { href: "#authority", label: "Authority" },
  { href: "#education", label: "Education" },
  { href: "#desire", label: "Desire" },
  { href: "#risk", label: "FAQ" },
];

export default function ServicesPage() {
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
          video="/videos/pexels-canopy-rays.mp4"
          poster="/images/pexels-canopy-rays-poster.jpg"
          minHeight="70vh"
        >
          {/* Approved Chapter 01 footage (Pexels 37218119, standard
              license): volumetric rays through lush canopy — discovery,
              light entering darkness. Graded for organic dopamine
              (luminous greens, golden highlights), 1440px crf 22,
              seamless ping-pong. The reveal veil below fades the scene
              in from near black so the rays are discovered, and the
              masthead lands at the brightest beat. */}
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
          <Container className="relative py-20">
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
                  Branding is how a business gets chosen before it gets compared.
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
          <SkyLife density="rare" solitary band={[8, 26]} color="rgba(18,22,24,0.75)" />
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
          <LazyAmbientShader opacity={0.1} />
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
          <SceneHandoff color="#0E1714" />
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

        {/* Desire — the real package selector. Direct feedback flagged
            this section as flat and motionless (plain bg-soil, three
            outlined boxes, no texture at all) against Authority and
            Education right above it, which both carry the same ambient
            shader. Extending that shader here, not a new visual, keeps
            the throughline the brief itself asked for: one visual
            system continuing through the page rather than a new device
            per section. Opacity dropped slightly below Authority's
            (0.3) and Education's (0.16) since PackageSelector's own
            interactive cards need to stay the clearest thing on screen.
            Direct feedback confirmed this section still read blank —
            a wide Himalayan valley opening up behind the choice, a real
            visual echo of "where does my brand actually stand," reused
            from Home's own elements row since nothing on Services
            claims it. Direct, repeated feedback that text was blending
            into video across the page — every overlay on this page is
            now a flat, consistent bg-soil/80 (was a hand-tuned 70/76/78
            spread), a real contrast increase applied as one system
            rather than guessed per clip. */}
        {/* Media replaced per direct confirmation: the wide Himalayan
            valley vista read as "travel," against the quiet, intimate,
            water-driven register every Pinterest reference shares.
            Golden-hour light rippling on dark water now (Pexels id
            38132728, standard license) — reflection as the literal
            visual metaphor for "where does your brand actually
            stand." Built into the same seamless ping-pong loop as the
            Book Call clip; WebM first, MP4 fallback. Overlay eased
            from the blanket bg-soil/80 to a vertical gradient — the
            gold streak stays visible between the content blocks while
            both text zones (heading up top, package card below) sit on
            the darker stops. */}
        {/* Mood: DEEP WATER — night-blue dark; the water clip's gold
            streak is the page's first warm accent, jewelry against a
            cool ground rather than an amber section. */}
        <section id="desire" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.deepwater }}>
          <BackgroundVideo parallax
            push
            video="/videos/pexels-dew-clearing.mp4"
            videoWebm="/videos/pexels-dew-clearing.webm"
            poster="/images/pexels-dew-clearing-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(14,23,20,0.55) 0%, rgba(14,23,20,0.35) 45%, rgba(14,23,20,0.58) 100%)",
            }}
          />
          {/* Scene dissolve: Education's blue mist into Desire's deep
              water. */}
          <SceneVeil color="#1A2026" />
          <div className="relative">
            <PackageSelector />
          </div>
          <SceneHandoff color="#172019" />
        </section>

        {/* An extension of Desire, not a new act — direct feedback
            wanted the deliverables to feel tangible right after picking
            a package, not left as bullet points inside a card. Every
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
            video="/videos/pexels-leaf-veins.mp4"
            videoWebm="/videos/pexels-leaf-veins.webm"
            poster="/images/pexels-leaf-veins-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(23,32,25,0.55) 0%, rgba(23,32,25,0.28) 45%, rgba(23,32,25,0.6) 100%)",
            }}
          />
          <DustMotes />
          {/* Scene dissolve: Desire's deep water hands into the river
              study. */}
          <SceneVeil color="#0E1714" heightClass="h-[15vh]" />
          <div className="relative">
            <DeliverablesReveal room />
          </div>
          <SceneHandoff color="#141A15" />
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
        <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.forest }}>
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
          <SceneHandoff color="#17201C" />
        </section>

        {/* Risk removal — the real FAQ content, reframed, merged with the
            "before you book" preview into one section instead of two
            back-to-back blocks. Direct feedback that the wildflowers clip
            here read as generic stock footage, with a direct instruction
            not to reuse footage but to preserve atmosphere through
            another medium rather than simply removing it. Layered four
            real, already-built, reduced-motion-safe atmospheric devices
            instead of video — the same toolkit TexturedDark/Hero/About's
            hero already use, just never combined here: AmbientElementShader
            (ambient WebGL colour drift), .aurora-glow (two slow-drifting
            warm colour blooms), .light-rays (a soft diagonal light sweep,
            TexturedDark's own device, screen-blended so it lifts rather
            than darkens), and Fireflies (warm wandering glow points,
            About's forest-hero device) — together the "volumetric light,
            soft floating particles, quiet warmth" register asked for,
            built from motion and light rather than a filmed clip. Video
            genuinely doesn't fit a pure reading section regardless —
            "atmosphere without overpowering the FAQ" is closer to what
            this layered, lower-key treatment does than a looping video
            ever could. RiskRemovalFAQ/StrategySessionPreview both take
            the same `dark` prop ProcessSection already exposes
            elsewhere on this site. */}
        {/* Was a single centered max-w-2xl column — on a real desktop
            viewport that left roughly two fifths of the section empty
            on both sides, the weakest composition on the page, and the
            plain accordion sitting alone in that empty space read as
            exactly the "template" pattern flagged directly. Two real
            columns now: the "what happens on the call" preview (already
            a real, separate piece of content, previously stacked below
            with its own border and a large uneven gap) sits as a sticky
            left rail, and the FAQ accordion fills the right column —
            both pieces of real content the section always had, just
            given an actual layout instead of one narrow stack. */}
        {/* Mood: SLATE — the emotional decompression chamber before
            Book Call. Phase 3 completed this chapter's atmosphere:
            mist breathing over dark water (Pexels id 2534297, standard
            license; slowed 1.5x into an 18s seamless ping-pong loop so
            the drift reads as breathing, never as a video), and it is
            now the section's ONLY atmospheric layer — the light-rays
            sweep, fireflies, and ambient shader that used to stack
            here competed with each other and with the calm this
            chapter exists to create. One overlay keeps the fog
            subconscious and the reading surface generous; a warm
            gradient at the foot of the section lets slate dissolve
            into Book Call's golden wood — light traveling into the
            final room rather than a hard cut. */}
        <section id="risk" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.slate }}>
          <BackgroundVideo parallax
            video="/videos/pexels-living-meadow.mp4"
            videoWebm="/videos/pexels-living-meadow.webm"
            poster="/images/pexels-living-meadow-poster.jpg"
          />
          {/* Tertiary life, story-first: birds crossing the open sky
              above the fog at irregular intervals, with pollen motes
              drifting below — openness, exploration, possibility, the
              exact feeling this chapter's question deserves. Randomized
              spawn cadence so the sky never repeats itself. */}
          <SkyLife density="occasional" band={[5, 32]} color="rgba(24,28,26,0.7)" />
          <DustMotes />
          {/* Overlay lightened through the middle (direct feedback that
              the fog disappeared behind it) — the filmed mist now reads
              through the whole reading zone, while the top edge and the
              warm foot keep their density for the transition in and out. */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(23,32,28,0.52) 0%, rgba(23,32,28,0.32) 45%, rgba(23,32,28,0.45) 82%, rgba(35,31,27,0.8) 100%)",
            }}
          />
          {/* Readability system: a LOCAL left-column mask under the
              chapter heading and call list — the meadow's palest sky
              sits exactly behind "Is this the right fit?", and a global
              overlay dark enough to fix it would kill the whole scene.
              This gradient shields only the text column and dissolves
              before the meadow's living half of the frame. */}
          <div
            className="absolute inset-y-0 left-0 w-[58%]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(20,26,23,0.55) 0%, rgba(20,26,23,0.35) 55%, transparent 100%)",
            }}
          />
          {/* Three mist depth planes above the overlay — the filmed fog
              is the far plane; these are the mid and near planes, so the
              atmosphere has real parallax instead of one flat backdrop.
              The near sheet rides ParallaxDrift, moving against scroll —
              fog passing between the visitor and the page. All layers
              pointer-events-none, constant blur, transform/opacity only. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="mist-layer-a absolute -left-[18%] top-[6%] h-[55%] w-[75%] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(216,224,230,0.17) 0%, rgba(216,224,230,0.05) 48%, transparent 72%)",
                filter: "blur(56px)",
              }}
            />
            <div
              className="mist-layer-b absolute -right-[22%] top-[38%] h-[58%] w-[80%] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(198,208,216,0.14) 0%, rgba(198,208,216,0.04) 50%, transparent 74%)",
                filter: "blur(64px)",
              }}
            />
          </div>
          {/* Scene dissolve: the quiz's forest dark hands off into the
              FAQ's slate mist. */}
          <SceneVeil color="#141A15" />
          {/* Scroll-controlled atmosphere — the fog is densest entering
              the chapter and clears as the visitor descends through the
              answers, arriving at Book Call in the clearest air on the
              page. The guided-descent device this section was missing. */}
          <ClearingMist />
          <ParallaxDrift distance={130} className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]">
            <div
              aria-hidden="true"
              className="mist-layer-a h-full w-full"
              style={{
                background: "linear-gradient(0deg, rgba(206,214,221,0.15) 0%, rgba(206,214,221,0.05) 55%, transparent 85%)",
                filter: "blur(28px)",
                animationDuration: "58s",
              }}
            />
          </ParallaxDrift>
          <Container className="relative max-w-6xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-ivory/70">Risk removal</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
                Is this the right fit?
              </h2>
              <p className="mt-4 max-w-md text-base text-ivory/90">
                Real answers to the questions that come up before a first conversation.
              </p>
            </Reveal>
            {/* Layout rebuilt for the journey (reference board): the
                call preview sits beside the heading as the trailhead
                marker, and the trail itself then takes the FULL content
                width below — stations alternating left and right of the
                drawn path. The old half-width column squeezed stations
                to a word per line on wide displays. */}
            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
              <StrategySessionPreview dark />
              <div />
            </div>
            <div className="mt-16 lg:mt-24">
              <RiskRemovalFAQ dark />
            </div>
          </Container>
          <SceneHandoff color="#27221E" heightClass="h-[26vh]" />
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
          {/* The last of the FAQ's fog arrives with the visitor and
              burns off in the warm room — the mist itself crosses the
              final boundary instead of stopping at it. Same drifting
              mist device as the FAQ's own layers, cool-tinted, fading
              over the section's first stretch. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[30vh] overflow-hidden">
            <div
              className="mist-layer-b absolute -left-[10%] top-0 h-full w-[120%]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(200,209,216,0.12) 0%, rgba(200,209,216,0.04) 55%, transparent 100%)",
                filter: "blur(30px)",
                animationDuration: "40s",
              }}
            />
          </div>
          <StrategyRoomCTA />
        </TexturedDark>
      </main>
      <Footer />
      <SectionJumpNav items={JUMP_ITEMS} />
    </>
  );
}
