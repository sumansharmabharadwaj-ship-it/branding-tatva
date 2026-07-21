import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { PhotoHero } from "@/components/PhotoHero";
import { ImageBreak } from "@/components/ImageBreak";
import { JaggedEdge } from "@/components/JaggedEdge";
import { aboutIntro, credentials, experience } from "@/data/about";
import { designChoices } from "@/data/design-rationale";
import { site } from "@/data/site";
import { SANDSTONE, ELEMENT_HEX, blendHex } from "@/lib/sectionWash";

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
              <h1 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.15] text-ivory">
                {aboutIntro.opening}
              </h1>
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
        <section className="relative pb-20 pt-20 sm:pb-28 sm:pt-28" style={{ backgroundColor: SANDSTONE }}>
          <JaggedEdge color={SANDSTONE} />
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

        {/* Real photo, not AI generation — Suman on the trail, the
            mountain catching last light through the trees behind her.
            The quote is about clarity earned by height, and this is
            literally that: her own view from having climbed to it. */}
        <ImageBreak
          image="/images/own-forest-clearing.jpg"
          quote="Clarity comes from climbing. It's the view from finally standing somewhere high enough to see it."
          height="85vh"
          imagePosition="center 30%"
          quoteVariant="left"
        />

        {/* Bold Earth/Clay (darkened slightly against Soil for AA text
            contrast), not the previous parchment tint — continues the
            same rule applied sitewide: no plain cream/parchment section
            sits between two photo/dark moments. */}
        <section className="py-20" style={{ backgroundColor: blendHex(ELEMENT_HEX.earth, "#27221E", 85) }}>
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
                <h2 className="text-display-sm font-display font-semibold text-ivory">
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
                <h2 className="text-display-sm font-display font-semibold text-ivory">
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
                <h2 className="text-display-sm font-display font-semibold text-ivory md:sticky md:top-28">
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
                        <p className={c.featured ? "font-display text-lg font-semibold text-soil" : "font-medium text-soil"}>
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

        {/* Bold Water/Indigo, not the previous parchment tint — closes
            out the same alternating rhythm the rest of the page now
            follows (Sandstone, Soil, Clay, Soil, Indigo) instead of
            ending on a plain neutral right before the Footer. */}
        <section className="py-20" style={{ backgroundColor: ELEMENT_HEX.water }}>
          <Container>
            <Reveal>
              <h2 className="text-display-sm font-display font-semibold text-ivory">
                Why this site looks the way it does
              </h2>
              <p className="mt-4 max-w-2xl text-ivory/75">
                I could tell a prospective client what good branding looks
                like, or I could just let this site be the example. Every
                choice below was made on purpose, and I&apos;d make the same
                case for yours.
              </p>
            </Reveal>
            <div className="mt-14 divide-y divide-ivory/15">
              {designChoices.map((choice, i) => (
                <Reveal key={choice.title} delay={i * 0.06}>
                  <div className="grid gap-3 py-8 sm:grid-cols-[auto_1fr] sm:gap-10 sm:py-10">
                    <span className="font-display text-5xl font-semibold leading-none text-ivory/15 sm:text-6xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-lg font-semibold text-ivory">{choice.title}</p>
                      <p className="mt-2 max-w-2xl text-sm text-ivory/75">
                        {choice.detail}
                      </p>
                    </div>
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
