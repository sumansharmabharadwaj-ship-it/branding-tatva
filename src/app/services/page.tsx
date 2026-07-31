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
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Fireflies } from "@/components/Fireflies";

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
            hero, not in breaking the site's hero-height hierarchy. Was
            higgsfield-glowing-embers.mp4 — direct feedback that flickering
            fire footage read as agitated rather than calm for what should
            be a quiet, contemplative opening question. Swapped for a
            still-unused clip already on disk: sunbeams through a misty
            pine trail, matching the site's established calm-nature
            register instead of introducing new footage. */}
        <PhotoHero
          video="/videos/higgsfield-forest-trail-mist.mp4"
          poster="/images/higgsfield-forest-trail-mist-poster.jpg"
          minHeight="70vh"
        >
          <Container className="relative py-20 text-center">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Curiosity
              </span>
              <CyclingStatement headline="Why should a business care about branding?" />
              <p className="mx-auto mt-4 max-w-xl text-ivory/80">
                The same process that took one client&apos;s engagement rate from 0.71% to 2.81% in eight weeks. Everything on this page explains how.
              </p>
            </Reveal>
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
        <section className="relative overflow-hidden bg-soil py-16 sm:py-24">
          {/* Direct feedback that the misty forest/mountain look was
              repeating too often back to back (hero, Authority, and this
              section all read as the same shot). Swapped from
              higgsfield-lone-pine to a warm, sunlit ridge — still fits
              "positioned distinctly," but breaks the run of consecutive
              misty clips instead of adding a fourth one. */}
          <BackgroundVideo video="/videos/higgsfield-golden-ridge.mp4" poster="/images/higgsfield-golden-ridge-poster.jpg" />
          <div className="absolute inset-0 bg-soil/80" />
          <AmbientElementShader opacity={0.13} />
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
        <section id="education" className="relative scroll-mt-24 overflow-hidden bg-soil">
          <BackgroundVideo video="/videos/pixabay-sea-of-fog-sunrise.mp4" poster="/images/pixabay-sea-of-fog-sunrise-poster.jpg" />
          <div className="absolute inset-0 bg-soil/80" />
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
        <section id="desire" className="relative scroll-mt-24 overflow-hidden bg-soil py-16 sm:py-24">
          <BackgroundVideo video="/videos/higgsfield-himalayan-valley.mp4" poster="/images/higgsfield-himalayan-valley-poster.jpg" />
          <div className="absolute inset-0 bg-soil/80" />
          <AmbientElementShader opacity={0.14} />
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
        <section className="relative overflow-hidden bg-soil py-16 sm:py-24">
          {/* A living, flowing river — a real visual echo of "what you
              receive" actually moving toward the visitor, not a static
              list. Same "real video underneath the shader" fix, same
              consistent bg-soil/80 as every other section now. */}
          <BackgroundVideo video="/videos/pixabay-emerald-river.mp4" poster="/images/pixabay-emerald-river-poster.jpg" />
          <div className="absolute inset-0 bg-soil/80" />
          <AmbientElementShader opacity={0.12} />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 right-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-none text-ivory/[0.06] sm:-top-8"
          >
            Receive
          </span>
          <div className="relative">
            <DeliverablesReveal />
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
        <section className="relative overflow-hidden bg-soil py-16 sm:py-24">
          {/* A clear, still forest stream — clarity and reflection, an
              apt real echo for a self-assessment section. Same "real
              video underneath the shader" fix. */}
          <BackgroundVideo video="/videos/higgsfield-forest-stream.mp4" poster="/images/higgsfield-forest-stream-poster.jpg" />
          <div className="absolute inset-0 bg-soil/80" />
          <AmbientElementShader opacity={0.15} />
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
        <section id="risk" className="relative scroll-mt-24 overflow-hidden bg-soil py-16 sm:py-24">
          <div className="aurora-glow" aria-hidden="true" />
          <div className="light-rays" aria-hidden="true" />
          <Fireflies />
          <AmbientElementShader opacity={0.16} />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 right-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold uppercase leading-none text-ivory/[0.06] sm:-top-8"
          >
            Ask
          </span>
          <Container className="relative max-w-2xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Risk removal</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                Is this the right fit?
              </h2>
              <p className="mt-4 text-ivory/85">
                Real answers to the questions that come up before a first conversation.
              </p>
            </Reveal>
            <div className="mt-8">
              <RiskRemovalFAQ dark />
            </div>
            <div className="mt-16 border-t border-ivory/15 pt-12 sm:mt-20 sm:pt-16">
              <StrategySessionPreview dark />
            </div>
          </Container>
        </section>

        {/* Book call — the strategy room. */}
        <TexturedDark image="/images/higgsfield-idea-sketch.jpg" video="/videos/higgsfield-idea-sketch.mp4" className="py-20 sm:py-28">
          <StrategyRoomCTA />
        </TexturedDark>
      </main>
      <Footer />
      <SectionJumpNav
        items={[
          { href: "#authority", label: "Authority" },
          { href: "#education", label: "Education" },
          { href: "#desire", label: "Desire" },
          { href: "#risk", label: "FAQ" },
        ]}
      />
    </>
  );
}
