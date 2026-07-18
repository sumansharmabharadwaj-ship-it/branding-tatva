import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { VideoBreak } from "@/components/VideoBreak";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell me what your brand is becoming.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="py-20 sm:py-28">
          <Container className="grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">
                Contact
              </p>
              <h1 className="mt-3 text-display-lg font-display font-semibold text-soil">
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
                  <a href={`mailto:${site.email}`} className="text-action-primary-hover underline">
                    {site.email}
                  </a>
                </p>
                <p>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-action-primary-hover underline"
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
          height="55vh"
        />

        <section className="border-t border-border bg-sage/10 py-16">
          <Container>
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">
                Or skip the form
              </p>
              <h2 className="mt-2 text-display-sm font-display font-semibold text-soil">
                Just grab a time that works for you.
              </h2>
              <p className="mt-3 max-w-xl text-foreground-secondary">
                Times shown automatically adjust to your local timezone,
                wherever you are.
              </p>
              <div className="mt-8 overflow-hidden rounded-lg border border-border bg-background-elevated">
                <iframe
                  src={`${site.calendlyUrl}?hide_gdpr_banner=1`}
                  width="100%"
                  height="700"
                  title="Book a call via Calendly"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-xs text-foreground-secondary">
                Having trouble with the embed?{" "}
                <a
                  href={site.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-action-primary-hover underline"
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
