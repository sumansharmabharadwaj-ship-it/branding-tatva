import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { AuditInvite } from "@/components/AuditInvite";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ParallaxVideoBackdrop } from "@/components/ParallaxVideoBackdrop";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AboutSplitHero } from "@/components/AboutSplitHero";
import { MeadowClosing } from "@/components/MeadowClosing";
import { NotebookClose } from "@/components/NotebookClose";
import { DesignRationaleGrid } from "@/components/DesignRationaleGrid";
import { PinnedWorkingMethod } from "@/sections/About/PinnedWorkingMethod";
import { StudioDesk } from "@/sections/About/StudioDesk";
import { PointOfView } from "@/sections/About/PointOfView";
import { Convergence } from "@/sections/About/Convergence";
import { WorkingDirectly } from "@/sections/About/WorkingDirectly";
import { Evidence } from "@/sections/About/Evidence";
import { Behaviours } from "@/sections/About/Behaviours";
import { LinkButton } from "@/components/Button";
import { aboutIntro, credentials } from "@/data/about";
import { elements } from "@/data/elements";
import { philosophy } from "@/data/philosophy";
import { ElementGlyph } from "@/components/ElementGlyph";
import { site } from "@/data/site";
import { SANDSTONE } from "@/lib/sectionWash";

export const metadata: Metadata = {
  title: "About Suman Sharma",
  description: `The thinking behind ${site.name}: brand strategy grounded in psychology and language.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${site.founder} | ${site.name}`,
    description: `The thinking behind ${site.name}: brand strategy grounded in psychology and language.`,
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        <AboutSplitHero
          eyebrow="About"
          headline={aboutIntro.opening}
          body={elements[0].poetic}
          ctaHref="/contact"
          ctaLabel="Book a Brand Strategy Session"
          secondaryCtaHref="/work"
          secondaryCtaLabel="Explore the Work"
          video="/videos/own-companions-split.mp4"
          poster="/images/own-companions-split-poster.jpg"
          bgVideo="/videos/about-hero-bg-meadow.mp4"
          bgPoster="/images/about-hero-bg-meadow-poster.jpg"
        />

        {/* Point of view — the redesign brief's chapter two: three
            claims, each tied to a real engagement. Sits directly after
            the authority hero so the practice's stance arrives before
            its story. */}
        <section className="bg-soil py-16 sm:py-24">
          <PointOfView />
        </section>

        {/* Was own-alpenglow-peak.mp4 under an 80%-opaque Sandstone tint —
            direct feedback that the video read as barely-there under that
            much color. pixabay-forest-sunbeams.mp4 (sunbeams breaking
            through oak branches over a misty field, freshly downloaded
            for this section specifically, licensed for commercial use)
            now plays at full visibility with only a light Sandstone wash
            for warmth. Legibility comes from the same translucent glass
            card the homepage already uses for text over vivid video
            (page.tsx's newsletter panel) rather than from drowning the
            footage in overlay. Re-graded from the original Pixabay source
            with ffmpeg (saturation +40%, contrast +10%, a warm shadow/
            midtone push, light unsharp) rather than a paid AI pass —
            Higgsfield credits were exhausted this session, and a color
            grade is a legitimate free-tool fix for "looks flat," not a
            content problem an AI regeneration would actually solve. */}
        <section className="relative overflow-hidden pb-20 pt-20 sm:pb-28 sm:pt-28">
          <BackgroundVideo video="/videos/pixabay-forest-sunbeams.mp4" poster="/images/pixabay-forest-sunbeams-poster.jpg" />
          <div className="absolute inset-0" style={{ backgroundColor: `${SANDSTONE}40` }} />
          <Container className="relative">
            <div className="max-w-xl space-y-5 rounded-2xl border border-border/50 bg-background-elevated/85 px-6 py-8 text-foreground-secondary shadow-elevation-md backdrop-blur-sm sm:px-10 sm:py-10">
              {aboutIntro.body.map((para, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p>{para}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* The interdisciplinary convergence — psychology and language
            traveling toward each other through measured scroll progress
            and meeting as brand strategy. Typographic, sticky, zero
            WebGL; reduced motion gets the resolved state statically. */}
        <section className="bg-soil">
          <Convergence />
          {/* Lead magnet placement (bible §11): the audit signpost
              directly after the interdisciplinary section, inside the
              same soil passage so it lands as a takeaway, never a
              seam. */}
          <Container className="max-w-3xl pb-16 pt-4">
            <AuditInvite />
          </Container>
        </section>

        {/* Direct feedback flagged this quote break (higgsfield-stream-
            clarity.mp4, "Clarity comes from climbing...") as useless,
            same as the Home page's atmospheric interludes — cut. Video
            kept on disk, not deleted. */}

        {/* Was Clay blended 85% toward Soil (a near-soil warm variant) —
            close enough to soil to look right on its own, but yet
            another slightly-different dark tone next to the true Soil
            used two sections down (Credentials) and the Indigo used
            further down still. Collapsed to plain Soil so every dark
            section on this page reads as the exact same tone, not a
            family of close-but-not-quite variants. */}
        {/* Was higgsfield-water-ripples.mp4 — direct feedback that this
            clip had already been used elsewhere. higgsfield-redwood-canopy.mp4
            is a fresh generation (sunbeams filtering down through tall
            redwoods, referenced against a Pinterest redwoods pin and
            storytelling.noomoagency.com's own atmospheric mood), unused
            anywhere else on the site, and reads distinct from
            stream-clarity's water-over-rock shot directly above it. */}
        {/* This is the page's first real dark chapter after the light
            Sandstone intro above — the same kind of mode-shift ClipReveal
            already marks on Services (light offerings → dark closing
            statement) and Work (hero → dark card grid), extended here
            since About had the identical light-to-dark boundary without
            it. */}
        {/* Same pinned mechanism as every other pinned section on the
            site — a single beat (portrait, method text, and the
            experience list all shown together, nothing sequential), so
            it fits PinnedHold directly. See PinnedWorkingMethod's own
            comment for why this section's own overflow-hidden (kept
            for the redwood-canopy video) is safe to wrap this way. */}
        <PinnedWorkingMethod />

        {/* Suman's board, the studio wave: "the visitor explores YOU,
            never reads about you." Six objects on the desk, each
            opening real practice material and pointing at where that
            material actually lives on the site. */}
        <StudioDesk />

        {/* The terms of working directly together — the brief's five
            real commitments, stated as things a client can hold the
            practice to. */}
        <section className="bg-soil py-16 sm:py-24">
          <WorkingDirectly />
        </section>

        {/* Bold solid Soil, not the Phase-5 space tint — matches the
            grid-of-cards=soil rule now applied to every other card-grid
            section site-wide. Cards already use an opaque
            bg-background-elevated fill, no card-level change needed. */}
        {/* own-moonlit-sea.mp4 — a calm, muted night clip, unused
            elsewhere on the site currently, chosen specifically so it
            sits quietly behind the card grid instead of competing with
            it (the way higgsfield-element-fire does behind Home's
            card-grid Selected-work section, a bright active clip
            because that section has fewer, larger elements). */}
        <section className="relative overflow-hidden bg-soil py-20">
          <BackgroundVideo video="/videos/own-moonlit-sea.mp4" poster="/images/own-moonlit-sea-poster.jpg" />
          <div className="absolute inset-0 bg-soil/80" />
          <Container className="relative">
            <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-12">
              <Reveal>
                <h2 className="text-display-sm font-display font-normal text-ivory md:sticky md:top-28">
                  Credentials
                </h2>
              </Reveal>
              <div className="spotlight-grid grid items-stretch gap-6 sm:grid-cols-2">
                {credentials.map((c, i) => (
                  <Reveal
                    key={c.label}
                    delay={i * 0.06}
                    className={`h-full ${c.featured ? "sm:col-span-2" : ""}`}
                  >
                    <TiltCard glowColor={c.color}>
                      <div
                        className="spotlight-card flex h-full flex-col rounded-lg border-t-2 border-border bg-background-elevated p-5 shadow-elevation-sm transition-colors duration-300"
                        style={{ borderTopColor: c.color, ["--card-color" as string]: c.color }}
                      >
                        <p className={c.featured ? "font-display text-lg font-normal text-soil" : "font-medium text-soil"}>
                          {c.label}
                        </p>
                        <p className="mt-1 text-sm text-foreground-secondary">{c.detail}</p>
                      </div>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Evidence — ambiguity, decision, observed result for three
            selected cases, all from recorded project data. */}
        <section className="bg-soil py-16 sm:py-24">
          <Evidence />
        </section>

        {/* Behaviours instead of values. */}
        <section className="bg-soil pb-16 sm:pb-24">
          <Behaviours />
        </section>

        {/* Where the five elements themselves come from, sitting right
            before the section that explains this site's own visual
            choices — that section already covers the mark, the
            typefaces, the palette; this one covers the actual idea
            underneath all of it, which none of those four items touch.
            Direct feedback: this section needs a real backdrop and real
            scroll motion, not flat bg-soil. pixabay-misty-ridge-drift.mp4
            — a slow aerial drift over a mist-wrapped ridge — reads as old
            and elemental rather than staged, matching "something older
            than a marketing framework" instead of fighting it, and is
            distinct in mood from higgsfield-golden-peaks.mp4 right below
            (cool/misty here, warm/gold there). The scroll drift itself is
            ParallaxVideoBackdrop, the same useScroll/useTransform
            technique VideoBreak's own `parallax` prop already uses
            elsewhere on this page — reused standalone since this
            section's five-paragraph layout doesn't fit VideoBreak's
            quote-card shape. A full PinnedHold (stopping scroll dead to
            hold this section in place) was deliberately not used: five
            real paragraphs need to be read at the reader's own pace, not
            forced through a fixed-duration hold — the moving backdrop
            gives the cinematic feel without stalling the read. */}
        <section className="relative overflow-hidden bg-soil py-20">
          <ParallaxVideoBackdrop
            video="/videos/pixabay-misty-ridge-drift.mp4"
            poster="/images/pixabay-misty-ridge-drift-poster.jpg"
          />
          <div className="absolute inset-0 bg-soil/80" />
          <Container className="relative">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-sandstone">
                Why five elements
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
                These five elements describe something older than a
                marketing framework.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-4 max-w-2xl text-ivory/85">
                They describe what anything needs in order to actually
                last: a person, a body of work, a civilization, a brand.
                Something needs ground before it can stand. It needs to
                move through how people actually experience it. It needs
                a spark that earns a second look. It needs to be
                understood in its own words. And it has to still be
                there once the moment has passed. A brand lives or dies
                on the same five things a person does.
              </p>
            </Reveal>

            <div className="mt-14 space-y-10 border-t border-ivory/15 pt-10">
              {philosophy.map((item, i) => {
                const el = elements.find((e) => e.slug === item.element);
                if (!el) return null;
                return (
                  <Reveal key={item.element} delay={i * 0.06}>
                    <div className="flex items-center gap-3">
                      <ElementGlyph
                        slug={item.element}
                        className="h-5 w-5 shrink-0 opacity-80"
                        style={{ color: el.color }}
                      />
                      <p className="font-display text-lg font-normal text-ivory">{el.name}</p>
                      <span className="text-xs font-medium uppercase tracking-wide text-ivory/50">
                        {item.thinker}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm text-ivory/85">{item.text}</p>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.4}>
              <p className="mt-14 max-w-2xl border-t border-ivory/15 pt-10 text-ivory/85">
                None of this is abstract. A sustained content push built
                the same way took Dr. Haley Nutrition&apos;s engagement
                rate from 0.71% to 2.81% in two months, with impressions
                barely moving even as posting dropped by nearly half.
                That is the difference between reach and trust, and
                it is what these five elements are actually for.
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Was solid Indigo — a third distinct dark hue alongside Clay
            and Soil elsewhere on this page, direct feedback flagged this
            exact pattern (a different saturated color per section) as
            reading like a scrapbook rather than one cohesive site. Soil,
            matching every other dark section on the page now; the
            closing rhythm is Sandstone (one light break) then Soil
            throughout, not a five-color cycle. */}
        {/* higgsfield-golden-peaks.mp4 — never used anywhere on the site
            before now, chosen for this closing section specifically so
            it doesn't repeat water-ripples or moonlit-sea from the two
            sections directly above it. Mountain-peak light gives the
            page's final "made on purpose" statement real weight instead
            of ending the page on flat color. */}
        <section className="relative overflow-hidden bg-soil py-20">
          <ParallaxVideoBackdrop
            video="/videos/higgsfield-golden-peaks.mp4"
            poster="/images/higgsfield-golden-peaks-poster.jpg"
          />
          <div className="absolute inset-0 bg-soil/80" />
          <Container className="relative">
            {/* Ghost watermark word, same technique as the case-study
                block numerals (.case-study-block::before in globals.css)
                and Home's "ELEMENTS" watermark — ivory-toned since this
                section is bold Indigo, not the dark-on-cream version. */}
            {/* Rewritten per the 80 page manual (p48): the section's job
                is converting aesthetic curiosity into commercial
                credibility — the site as a demonstration of method, with
                each design decision tied to a business purpose and a
                contextual CTA onward. */}
            <Reveal>
              <h2 className="relative text-display-sm font-display font-normal text-ivory">
                This website behaves like the brands it argues for.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 max-w-2xl text-ivory/85">
                Every surface here is built around the same question used in
                brand strategy: what should a person notice, understand, and
                remember? Earth holds the position. Water shapes the
                experience. Fire earns attention. Air gives the idea
                language. Space lets recognition settle. The imagery, the
                pacing, the type, and the movement are part of the argument;
                each decision below exists to reinforce one meaning, and the
                coherence you can feel is the method being demonstrated.
              </p>
            </Reveal>
            {/* Was a static 4-item 2-column grid, plain text only — the
                honest fulfillment of the "logo/type/color/photography/
                voice reacting on hover" backlog item: 2 real entries
                added (photography, voice) to complete the set, and every
                card now reveals a real, live specimen of this site's own
                system on hover or tap, rather than a fabricated
                brand-asset showcase built for a client with none. */}
            <DesignRationaleGrid />
            <Reveal>
              <p className="mt-10 text-sm">
                <Link
                  href="/work"
                  className="link-underline inline-flex items-center gap-2 text-sandstone transition-colors duration-300 hover:text-ivory"
                >
                  See the same decisions shaping a client project <span aria-hidden="true">→</span>
                </Link>
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Closing beat: the meadow video doing a slow scroll-driven
            zoom while a two-line closing statement reveals as you
            scroll through — see MeadowClosing's own comment for why
            this replaced two rejected WebGL attempts at this section. */}
        <MeadowClosing />

        {/* Booking — Suman's board, scene five: the invitation written
            inside the notebook on a lit desk, replacing the flat soil
            block her review named a wasted final CTA. */}
        <NotebookClose />
      </main>
      <Footer />
    </>
  );
}
