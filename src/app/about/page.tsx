import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { TiltCard } from "@/components/TiltCard";
import { PhotoHero } from "@/components/PhotoHero";
import { VideoBreak } from "@/components/VideoBreak";
import { NatureAccent } from "@/components/NatureAccent";
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
      <main id="main-content">
        <PhotoHero
          video="/videos/own-companions.mp4"
          poster="/images/own-companions-wide-poster.jpg"
          minHeight="80vh"
          imagePosition="center 40%"
        >
          <Container className="relative pb-16 pt-20 text-center sm:pb-20">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                About
              </span>
              <SplitReveal
                as="h1"
                className="mx-auto mt-6 max-w-2xl font-display text-[clamp(1.75rem,4vw,3rem)] font-normal leading-[1.15] text-ivory"
              >
                {aboutIntro.opening}
              </SplitReveal>
              <div className="mt-8">
                <LinkButton href="/contact">Start a brand conversation</LinkButton>
              </div>
            </Reveal>
          </Container>
        </PhotoHero>

        {/* Bold solid Sandstone, not a tint — the section right after the
            hero was still plain cream, the same "blank" transition Phase 6
            targets sitewide. Dark text stays as-is; Sandstone is light
            enough to keep full contrast without flipping to ivory. */}
        <section className="pb-20 pt-20 sm:pb-28 sm:pt-28" style={{ backgroundColor: SANDSTONE }}>
          <Container>
            <Reveal>
              <div className="max-w-xl space-y-5 text-foreground-secondary">
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
        <section className="bg-soil py-20">
          <Container className="grid gap-12 md:grid-cols-[auto_1fr]">
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
        <section className="bg-soil py-20">
          <Container>
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
        <section className="bg-soil py-20">
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
      </main>
      <Footer />
    </>
  );
}
