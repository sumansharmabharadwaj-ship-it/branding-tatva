import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { TiltCard } from "@/components/TiltCard";
import { VideoBreak } from "@/components/VideoBreak";
import { NatureAccent } from "@/components/NatureAccent";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AboutSplitHero } from "@/components/AboutSplitHero";
import { MeadowClosing } from "@/components/MeadowClosing";
import { aboutIntro, credentials, experience } from "@/data/about";
import { designChoices } from "@/data/design-rationale";
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
          body={site.tagline}
          ctaHref="/contact"
          ctaLabel="Start a brand conversation"
          video="/videos/own-companions-split.mp4"
          poster="/images/own-companions-split-poster.jpg"
        />

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
            <Reveal>
              <div className="max-w-xl space-y-5 rounded-2xl border border-border/50 bg-background-elevated/85 px-6 py-8 text-foreground-secondary shadow-elevation-md backdrop-blur-sm sm:px-10 sm:py-10">
                {aboutIntro.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Static peaks photo still read as a repeat of the same library —
            direct feedback to stop reusing stills and use real motion
            here instead. higgsfield-stream-clarity.mp4: water moving
            over rock in warm sidelight, unused anywhere else on the
            site, vetted frame-by-frame first (the air.mp4 clip's name
            promised nature and was actually an indoor desk scene, so
            filenames alone aren't trusted here anymore). Square 1080x1080
            source crops far more gracefully into an 85vh banner than the
            old portrait shot ever did — roughly two-thirds of the frame
            stays visible instead of a quarter. */}
        <VideoBreak
          src="/videos/higgsfield-stream-clarity.mp4"
          poster="/images/higgsfield-stream-clarity-poster.jpg"
          quote="Clarity comes from climbing. It's the view from finally standing somewhere high enough to see it."
          height="85vh"
          imagePosition="center"
          quoteVariant="left"
        />

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
        <section className="relative overflow-hidden bg-soil py-20">
          <BackgroundVideo video="/videos/higgsfield-redwood-canopy.mp4" poster="/images/higgsfield-redwood-canopy-poster.jpg" />
          <div className="absolute inset-0 bg-soil/60" />
          <Container className="relative grid gap-12 md:grid-cols-[auto_1fr]">
            <Reveal>
              <Image
                src="/images/own-portrait.jpg"
                alt="Suman Sharma"
                width={480}
                height={480}
                priority
                className="aspect-square w-40 rounded-full object-cover sm:w-48"
              />
            </Reveal>
            <div className="grid gap-12 sm:grid-cols-2">
              <Reveal delay={0.1}>
                <h2 className="text-display-sm font-display font-normal text-ivory">
                  Working method
                </h2>
                <p className="mt-4 text-ivory/75">
                  I start by asking what
                  a business believes, who it&apos;s actually speaking to,
                  and where its current story stops making sense, well
                  before any mood board enters the room. The
                  elemental system, earth, water, fire, air, space, is how I
                  keep track of which part of that is solved and which
                  still needs work.
                </p>
                <p className="mt-4 text-ivory/75">
                  I use &ldquo;I&rdquo; instead of &ldquo;we.&rdquo; Branding
                  Tatva is a personal practice, and every project has my
                  direct attention.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <h2 className="text-display-sm font-display font-normal text-ivory">
                  Recent experience
                </h2>
                <ul className="mt-4 space-y-4">
                  {experience.map((role) => (
                    <li key={`${role.org}-${role.period}`} className="border-l-2 border-ivory/30 pl-4">
                      <p className="font-medium text-ivory">{role.role}</p>
                      <p className="text-sm text-ivory/70">
                        {role.org} &middot; {role.period}
                      </p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
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
          <div className="absolute inset-0 bg-soil/70" />
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
          <BackgroundVideo video="/videos/higgsfield-golden-peaks.mp4" poster="/images/higgsfield-golden-peaks-poster.jpg" />
          <div className="absolute inset-0 bg-soil/65" />
          <Container className="relative">
            {/* Ghost watermark word, same technique as the case-study
                block numerals (.case-study-block::before in globals.css)
                and Home's "ELEMENTS" watermark — ivory-toned since this
                section is bold Indigo, not the dark-on-cream version. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-none text-ivory/[0.08] sm:-top-8"
            >
              WHY
            </span>
            <Reveal>
              <h2 className="relative text-display-sm font-display font-normal text-ivory">
                Why this site looks the way it does
              </h2>
              <p className="mt-4 max-w-2xl text-ivory/75">
                I could tell a prospective client what good branding looks
                like, or I could just let this site be the example. Every
                choice below was made on purpose, and I&apos;d make the same
                case for yours.
              </p>
            </Reveal>
            {/* Was a single-column divide-y list, each choice reading as
                a stacked row rather than four distinct statements — a
                2-column numbered pillar grid instead, same data, same
                ghost-numeral treatment, just given its own card-like
                weight per item rather than a running list. */}
            <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
              {designChoices.map((choice, i) => (
                <Reveal key={choice.title} delay={i * 0.08}>
                  <div className="relative border-t border-ivory/15 pt-6">
                    <span className="font-display text-5xl font-normal leading-none text-ivory/15 sm:text-6xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-4 font-display text-lg font-normal text-ivory">{choice.title}</p>
                    <p className="mt-2 text-sm text-ivory/75">{choice.detail}</p>
                    {/* One quiet hand-drawn touch, tied to this specific
                        line about the palette coming from materials
                        rather than a trend — not decoration for its own
                        sake. */}
                    {choice.title === "The palette" && (
                      <NatureAccent
                        variant="mushroom"
                        className="pointer-events-none absolute -right-1 top-6 hidden h-9 w-9 rotate-6 text-ivory/20 sm:block"
                      />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Closing beat: the meadow video doing a slow scroll-driven
            zoom while a two-line closing statement reveals as you
            scroll through — see MeadowClosing's own comment for why
            this replaced two rejected WebGL attempts at this section. */}
        <MeadowClosing />
      </main>
      <Footer />
    </>
  );
}
