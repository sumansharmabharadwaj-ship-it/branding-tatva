import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { VideoBreak } from "@/components/VideoBreak";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { ElementGlyph } from "@/components/ElementGlyph";
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
        <section
          className="pb-20 pt-32 sm:pb-28 sm:pt-36"
          style={{ backgroundColor: sectionWash("earth", 10) }}
        >
          <Container className="grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
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

        <VideoBreak
          src="/videos/own-leaves-cabin.mp4"
          poster="/images/own-leaves-cabin-poster.jpg"
          quote="A brand conversation is just the first clear view through the noise."
          height="60vh"
        />

        {/* Bold solid Water/Indigo, not the previous sage tint — this
            section is already water-themed (the glyph below), and unlike
            the form section above it, nothing here depends on the
            error-message red staying legible, so it's safe to go bold.
            CalendlyEmbed already wraps itself in an opaque card, so no
            change needed there. */}
        <section className="border-t border-border py-16" style={{ backgroundColor: ELEMENT_HEX.water }}>
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
