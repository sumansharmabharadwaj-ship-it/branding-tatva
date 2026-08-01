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
import { CyclingStatement } from "@/sections/Services/CyclingStatement";
import { PinnedBrandBuild } from "@/sections/Services/PinnedBrandBuild";
import { PerceptionLadder } from "@/sections/Services/PerceptionLadder";
import { PackageSelector } from "@/sections/Services/PackageSelector";
import { WeakBrandingCost } from "@/sections/Services/WeakBrandingCost";
import { DeliverablesReveal } from "@/sections/Services/DeliverablesReveal";
import { BrandHealthCheck } from "@/sections/Services/BrandHealthCheck";
import { StrategySessionPreview } from "@/sections/Services/StrategySessionPreview";
import { StrategyRoomCTA } from "@/sections/Services/StrategyRoomCTA";
import { AmbientElementShader } from "@/components/AmbientElementShader";
import { Magnetic } from "@/components/Magnetic";
import { BackgroundVideo } from "@/components/BackgroundVideo";
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
      <main id="main-content">
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
          video="/videos/higgsfield-forest-trail-mist.mp4"
          poster="/images/higgsfield-forest-trail-mist-poster.jpg"
          minHeight="70vh"
        >
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
            style={{ backgroundColor: "rgba(22,28,26,0.28)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "linear-gradient(90deg, rgba(15,18,17,0.55) 0%, rgba(15,18,17,0.2) 45%, transparent 70%)" }}
          />
          {/* Phase 2, hero motion language: "typography forming." The
              claim assembles (CyclingStatement), and the giant page
              title drifts at a slower rate than the scroll around it —
              depth through type, no imagery involved. */}
          <ParallaxDrift
            distance={90}
            className="pointer-events-none absolute -top-6 right-0 select-none"
          >
            <span
              aria-hidden="true"
              className="whitespace-nowrap font-display text-[clamp(4rem,15vw,10rem)] font-bold uppercase leading-none text-ivory/[0.06]"
            >
              Services
            </span>
          </ParallaxDrift>
          <Container className="relative py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal>
                <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                  Curiosity
                </span>
                {/* Phase 4 persuasion pass: the old headline asked a
                    question ("Why should a business care about
                    branding?") right after two cycling lines had built a
                    claim — the question dissolved the momentum. The
                    headline now lands the claim the lines were building:
                    it names what "something else" is. */}
                <CyclingStatement headline="Branding is how a business gets chosen before it gets compared." />
                <p className="mt-5 max-w-lg text-base leading-relaxed text-ivory/85">
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
                      className="group inline-flex items-baseline gap-2 text-sm tracking-wide text-ivory/85 transition-colors duration-300 hover:text-ivory"
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
                        <span className="font-display text-sm text-ivory/50 transition-colors duration-200 group-hover:text-sandstone">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm tracking-wide text-ivory/85 transition-colors duration-200 group-hover:text-ivory">
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
        </PhotoHero>

        {/* Authority — the one deliberate ScrollTrigger.pin section. */}
        <section id="authority" className="scroll-mt-24">
          <PinnedBrandBuild />
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
          <BackgroundVideo video="/videos/higgsfield-golden-ridge.mp4" poster="/images/higgsfield-golden-ridge-poster.jpg" />
          {/* Second-audit push: the ridge clip's residual warm sky band
              was still tinting this chapter amber against Education's
              mist directly below — the overlay now leans a step cooler
              than the stone base itself, and a touch denser at the top
              where the warm sky sits. */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(24,25,26,0.92) 0%, rgba(24,25,26,0.74) 50%, rgba(24,25,26,0.9) 100%)",
            }}
          />
          <AmbientElementShader opacity={0.1} />
          {/* Same ghost watermark word technique Home ("ELEMENTS"), About
              ("WHY"), and Blog ("NOTES") already use, extended here — a
              recurring graphic motif tying new sections into the same
              visual system rather than each reading as a one-off. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-none text-ivory/[0.06] sm:-top-8"
          >
            Stakes
          </span>
          <div className="relative">
            <WeakBrandingCost />
          </div>
        </section>

        {/* Education — the one Three.js moment (inside PerceptionLadder,
            via AmbientElementShader), scoped and ambient. Direct feedback
            confirmed this section still read blank against the sections
            around it. Fog breaking over a ridge at sunrise: a real visual
            echo of "recognized" slowly becoming "remembered" as the light
            clears, already used elsewhere on Home, reused here since
            nothing on Services claims it. */}
        {/* Mood: MIST — blue-grey, the coolest chapter so far, directly
            after Stakes' dry stone. See MOOD in sectionWash.ts. */}
        <section id="education" className="relative scroll-mt-24 overflow-hidden" style={{ backgroundColor: MOOD.mist }}>
          <BackgroundVideo video="/videos/pixabay-sea-of-fog-sunrise.mp4" poster="/images/pixabay-sea-of-fog-sunrise-poster.jpg" />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(26,32,38,0.88) 0%, rgba(26,32,38,0.7) 55%, rgba(26,32,38,0.88) 100%)",
            }}
          />
          <div className="relative">
            <PerceptionLadder />
          </div>
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
          <BackgroundVideo
            video="/videos/pexels-golden-water-reflection.mp4"
            videoWebm="/videos/pexels-golden-water-reflection.webm"
            poster="/images/pexels-golden-water-reflection-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(15,21,28,0.85) 0%, rgba(15,21,28,0.58) 45%, rgba(15,21,28,0.85) 100%)",
            }}
          />
          <div className="relative">
            <PackageSelector />
          </div>
        </section>

        {/* An extension of Desire, not a new act — direct feedback
            wanted the deliverables to feel tangible right after picking
            a package, not left as bullet points inside a card. Every
            item traces to real services.ts data (see the component's
            own comment). No id/jump-nav entry — a supporting beat within
            Desire's own objection. Same shader treatment as the
            sections around it — see WeakBrandingCost's comment above
            for why. */}
        {/* Mood: EDITORIAL LIGHT — the page's one clean, bright chapter
            break, directly after deep water. Phase 1 decision: the
            emerald river footage here was overpowering a section whose
            entire job is a readable list of real deliverables — the
            exact "video before message" failure named in the brief.
            Content leads absolutely now: parchment ground, dark type,
            the deliverables presented as what they actually are —
            printed documents you leave with. (The river clip returns to
            the pool for Phase 3's reassignment audit rather than being
            discarded.) */}
        <section className="relative overflow-hidden bg-background-alt py-16 sm:py-24">
          {/* Direct feedback that this chapter read as flat white — the
              pause survives (it is the film's one bright rest, per the
              approved color script), but the surface now reads as
              actual paper: an inline SVG grain layer (no asset, no
              request) at low opacity gives the parchment real tooth
              instead of a flat fill. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.05'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 right-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-none text-soil/[0.05] sm:-top-8"
          >
            Receive
          </span>
          <div className="relative">
            <DeliverablesReveal light />
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
        <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.forest }}>
          <BackgroundVideo video="/videos/higgsfield-forest-stream.mp4" poster="/images/higgsfield-forest-stream-poster.jpg" />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(20,26,21,0.88) 0%, rgba(20,26,21,0.72) 50%, rgba(20,26,21,0.88) 100%)",
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-none text-ivory/[0.06] sm:-top-8"
          >
            Check
          </span>
          <div className="relative">
            <BrandHealthCheck />
          </div>
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
          <BackgroundVideo
            video="/videos/pexels-mist-over-water.mp4"
            videoWebm="/videos/pexels-mist-over-water.webm"
            poster="/images/pexels-mist-over-water-poster.jpg"
          />
          {/* Overlay lightened through the middle (direct feedback that
              the fog disappeared behind it) — the filmed mist now reads
              through the whole reading zone, while the top edge and the
              warm foot keep their density for the transition in and out. */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(24,29,33,0.84) 0%, rgba(24,29,33,0.6) 45%, rgba(24,29,33,0.7) 82%, rgba(35,31,27,0.9) 100%)",
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
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 right-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-none text-ivory/[0.06] sm:-top-8"
          >
            Ask
          </span>
          <Container className="relative max-w-6xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-ivory/55">Risk removal</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
                Is this the right fit?
              </h2>
              <p className="mt-4 max-w-md text-base text-ivory/85">
                Real answers to the questions that come up before a first conversation.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <StrategySessionPreview dark />
              </div>
              <RiskRemovalFAQ dark />
            </div>
          </Container>
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
          image="/images/pexels-sunlight-wood-grain-poster.jpg"
          video="/videos/pexels-sunlight-wood-grain.mp4"
          videoWebm="/videos/pexels-sunlight-wood-grain.webm"
          className="scroll-mt-24 py-24 sm:py-36"
        >
          <StrategyRoomCTA />
        </TexturedDark>
      </main>
      <Footer />
      <SectionJumpNav items={JUMP_ITEMS} />
    </>
  );
}
