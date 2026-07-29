import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { PhotoHero } from "@/components/PhotoHero";
import { VideoBreak } from "@/components/VideoBreak";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ElementGlyph } from "@/components/ElementGlyph";
import { NatureAccent } from "@/components/NatureAccent";
import { site } from "@/data/site";
import { SANDSTONE } from "@/lib/sectionWash";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell me what your brand is becoming.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${site.name}`,
    description: "Tell me what your brand is becoming.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        {/* Every other page on the site opens on a real video/photo
            hero; this page used to open directly on a flat color
            section instead, the one structural outlier in an otherwise
            consistent pattern. Tier 3 (70vh), the same as Services/
            Work — matches PhotoHero's own documented height-tier
            table. higgsfield-forest-light.mp4 (trees opening onto a
            clear valley view) was picked specifically because it
            echoes this page's own existing VideoBreak quote below: "A
            brand conversation is just the first clear view through the
            noise." */}
        <PhotoHero
          video="/videos/higgsfield-forest-light.mp4"
          poster="/images/higgsfield-forest-light-poster.jpg"
          minHeight="70vh"
        >
          <Container className="relative py-20 text-center">
            <Reveal className="relative">
              <NatureAccent
                variant="butterfly"
                className="pointer-events-none absolute -top-6 left-1/2 hidden h-9 w-9 translate-x-[60%] text-ivory/20 sm:block"
              />
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Contact
              </span>
              <SplitReveal
                as="h1"
                className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-ivory"
              >
                Tell me what your brand is becoming.
              </SplitReveal>
              <p className="mx-auto mt-4 max-w-xl text-ivory/70">
                Fill in as much or as little as you know right now.
                I&apos;ll ask a few more questions where it helps. I read
                every enquiry personally.
              </p>
            </Reveal>
          </Container>
        </PhotoHero>

        {/* Was a one-off terracotta wash (earth blended 22%) — its own
            color, distinct from every other light section on the site.
            Sandstone now: the same single light-anchor tone About uses
            for its own opening section. The heading/intro copy above
            moved into the new hero; this section now carries just the
            form and the direct-contact links. */}
        <section className="pb-20 pt-16 sm:pb-28 sm:pt-20" style={{ backgroundColor: SANDSTONE }}>
          <Container className="grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">
                Reach me directly
              </p>
              <div className="mt-3 space-y-2 text-sm text-foreground-secondary">
                <p>
                  Prefer email?{" "}
                  <a href={`mailto:${site.email}`} className="text-action-primary-hover link-underline">
                    {site.email}
                  </a>
                </p>
                <p>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-action-primary-hover link-underline"
                  >
                    Connect on LinkedIn
                  </a>
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-3">
              <ContactForm />
            </Reveal>
          </Container>
        </section>

        {/* own-leaves-cabin.mp4 replaced with higgsfield-verdant-hills.mp4
            (morning mist parting over green hills, originally generated
            for Home's closing CTA) per direct feedback moving this clip
            here instead. */}
        <VideoBreak
          src="/videos/higgsfield-verdant-hills.mp4"
          poster="/images/higgsfield-verdant-hills-poster.jpg"
          quote="A brand conversation is just the first clear view through the noise."
          height="60vh"
        />

        {/* Was solid Indigo — a second distinct color on a two-section
            page already using Sandstone above, exactly the kind of
            per-section color-cycling flagged sitewide as reading
            cluttered rather than cohesive. Soil now, the same dark
            anchor every other page uses; the water glyph below still
            carries the "water" theme as an accent, it just isn't the
            whole backdrop anymore. CalendlyEmbed already wraps itself in
            an opaque card, so no change needed there. */}
        <section className="bg-soil py-16">
          <Container>
            <Reveal>
              <ElementGlyph slug="water" className="h-6 w-6 text-sandstone" strokeWidth={1.2} />
              <p className="mt-3 text-sm font-medium uppercase tracking-wide text-sandstone">
                Or skip the form
              </p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                Just grab a time that works for you.
              </h2>
              <p className="mt-3 max-w-xl text-ivory/75">
                Times shown automatically adjust to your local timezone,
                wherever you are.
              </p>
              <CalendlyEmbed url={site.calendlyUrl} />
              <p className="mt-3 text-xs text-ivory/70">
                Having trouble with the embed?{" "}
                <a
                  href={site.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sandstone link-underline"
                >
                  Open it directly instead
                </a>
                .
              </p>
            </Reveal>

            {/* Kept on the same Soil background rather than its own
                section — a third color here would repeat the exact
                "per-section color-cycling reads cluttered" problem
                already fixed sitewide. Air glyph instead of Water
                (already used above) so this still reads as its own
                moment, not a repeat, without a new backdrop. */}
            <Reveal delay={0.1} className="mt-16 border-t border-ivory/15 pt-10">
              <ElementGlyph slug="air" className="h-6 w-6 text-sandstone" strokeWidth={1.2} />
              <p className="mt-3 text-sm font-medium uppercase tracking-wide text-sandstone">
                Not ready to talk yet?
              </p>
              <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
                Get occasional notes on brand clarity.
              </h2>
              <p className="mt-3 max-w-xl text-ivory/75">
                A few thoughts a month, not a drip campaign. No pitch, unsubscribe
                whenever.
              </p>
              <NewsletterForm />
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
