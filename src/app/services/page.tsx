import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { ScrollCue } from "@/components/ScrollCue";
import { ScrollProgress } from "@/components/ScrollProgress";
import { PhotoHero } from "@/components/PhotoHero";
import { TexturedDark } from "@/components/TexturedDark";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { ProcessSection } from "@/sections/Process";
import { FAQ } from "@/sections/FAQ";
import { PinnedBrandBuild } from "@/sections/Services/PinnedBrandBuild";
import { PerceptionLadder } from "@/sections/Services/PerceptionLadder";
import { FounderLens } from "@/sections/Services/FounderLens";
import { PackageSelector } from "@/sections/Services/PackageSelector";
import { CaseStudyScrollStory } from "@/sections/Services/CaseStudyScrollStory";
import { StrategyRoomCTA } from "@/sections/Services/StrategyRoomCTA";
import { process } from "@/data/process";
import { projects } from "@/data/projects";
import { elementColor } from "@/lib/elementColor";

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
// (Curiosity → Authority → Education → Trust → Desire → Proof → Future
// vision → Risk removal → Book call), not a service-by-service list.
// See the plan doc (Phase 14) for the full reasoning, including why
// GSAP ScrollTrigger.pin appears exactly once (PinnedBrandBuild) and
// Three.js exactly once (inside PerceptionLadder, via
// AmbientElementShader) rather than throughout — every other pinned
// moment on this page and site runs on the same sticky mechanism
// already proven everywhere else.
const flagshipProject = projects.find((p) => p.slug === "dr-haley-nutrition") ?? projects[0];

export default function ServicesPage() {
  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        {/* Curiosity — the opening objection: why care about branding at
            all. Char-level SplitText reveal (extends initSplitTextReveal
            with a "chars" variant, src/animations/splitTextReveal.ts) for
            a tighter, more kinetic entrance than the word-level reveal
            used on every other page's hero — the one place on this page
            that earns a different treatment from the rest of the site's
            established word-by-word pattern. Height stays Tier 3 (70vh),
            the documented mid-page tier in PhotoHero's own comment —
            this page's ambition shows in what follows the hero, not in
            breaking the site's hero-height hierarchy. */}
        <PhotoHero
          video="/videos/higgsfield-glowing-embers.mp4"
          poster="/images/higgsfield-glowing-embers-poster.jpg"
          minHeight="70vh"
        >
          <Container className="relative py-20 text-center">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Curiosity
              </span>
              <SplitReveal
                as="h1"
                splitType="chars"
                className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-ivory"
              >
                Why should a business care about branding?
              </SplitReveal>
              <p className="mx-auto mt-4 max-w-xl text-ivory/70">
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

        {/* Education — the one Three.js moment (inside PerceptionLadder,
            via AmbientElementShader), scoped and ambient. */}
        <section id="education" className="scroll-mt-24">
          <PerceptionLadder />
        </section>

        {/* Trust — Founder Lens. */}
        <section id="trust" className="scroll-mt-24 bg-soil py-16 sm:py-24">
          <FounderLens />
        </section>

        {/* Desire — the real package selector. */}
        <section id="desire" className="scroll-mt-24 bg-soil py-16 sm:py-24">
          <PackageSelector />
        </section>

        {/* Proof — one real case study, staged as a scroll-driven story
            (same sticky mechanism as PinnedJourney, no pin needed here). */}
        <section id="proof" className="scroll-mt-24">
          <div className="bg-soil pb-6 pt-16 sm:pt-20">
            <Container className="max-w-2xl text-center">
              <Reveal>
                <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Proof</p>
                <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                  What do you actually receive?
                </h2>
                <p className="mt-4 text-ivory/75">
                  One real project, staged the way it actually happened. Verified numbers, not projections.
                </p>
              </Reveal>
            </Container>
          </div>
          <CaseStudyScrollStory project={flagshipProject} />
        </section>

        {/* Future vision — the real six-stage process, reused as-is
            (already a cinematic scroll-driven timeline via PinnedJourney,
            not rebuilt for this page). */}
        <section id="process" className="scroll-mt-24 bg-soil">
          <div className="relative overflow-hidden py-16 sm:py-20">
            <Container className="relative">
              <Reveal>
                <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Future vision</p>
                <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                  What happens during the project?
                </h2>
                <p className="mt-4 max-w-xl text-ivory/75">
                  Each stage depends on the one before it, a sequence rather than a checklist you can jump around in.
                </p>
              </Reveal>
            </Container>
          </div>
          <ProcessSection stages={process} elementColor={elementColor} dark />
        </section>

        {/* Risk removal — the real FAQ content, reframed. */}
        <section id="risk" className="scroll-mt-24 bg-background-alt py-16 sm:py-24">
          <Container className="max-w-2xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">Risk removal</p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-soil">
                Is this the right fit?
              </h2>
              <p className="mt-4 text-foreground-secondary">
                Real answers to the questions that come up before a first conversation.
              </p>
            </Reveal>
            <div className="mt-8">
              <FAQ />
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
          { href: "#trust", label: "Trust" },
          { href: "#desire", label: "Desire" },
          { href: "#proof", label: "Proof" },
          { href: "#process", label: "Process" },
          { href: "#risk", label: "FAQ" },
        ]}
      />
    </>
  );
}
