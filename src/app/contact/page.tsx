import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { VideoBreak } from "@/components/VideoBreak";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { ElementGlyph } from "@/components/ElementGlyph";
import { NatureAccent } from "@/components/NatureAccent";
import { site } from "@/data/site";
import { sectionWash, ELEMENT_HEX } from "@/lib/sectionWash";

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
      <Header />
      <main id="main-content">
        {/* Was sectionWash("earth", 10) — rgb(238,224,212), only barely
            warmer than plain cream. This is the page's own first paint
            (no hero video here), so pushed to 22% for a clearly visible
            terracotta tint instead of something a visitor could mistake
            for unstyled background. */}
        <section
          className="pb-20 pt-32 sm:pb-28 sm:pt-36"
          style={{ backgroundColor: sectionWash("earth", 22) }}
        >
          <Container className="grid gap-12 lg:grid-cols-5">
            <Reveal className="relative lg:col-span-2">
              {/* One quiet hand-drawn touch on the opening heading, the
                  same restrained "one accent, not scattered decoration"
                  rule the Footer and About page already use. */}
              <NatureAccent
                variant="butterfly"
                className="pointer-events-none absolute -top-8 left-[68%] hidden h-9 w-9 text-clay/30 sm:block"
              />
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">
                Contact
              </p>
              <h1 className="mt-3 text-display-lg font-display font-normal text-soil">
                Tell me what your brand is becoming.
              </h1>
              <p className="mt-5 text-foreground-secondary">
                Fill in as much or as little as you know right now.
                I&apos;ll ask a few more questions where it helps. I read
                every enquiry personally.
              </p>
              <div className="mt-8 space-y-2 text-sm text-foreground-secondary">
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

        {/* Bold solid Water/Indigo, not the previous sage tint — this
            section is already water-themed (the glyph below), and unlike
            the form section above it, nothing here depends on the
            error-message red staying legible, so it's safe to go bold.
            CalendlyEmbed already wraps itself in an opaque card, so no
            change needed there. */}
        <section className="py-16" style={{ backgroundColor: ELEMENT_HEX.water }}>
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
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
