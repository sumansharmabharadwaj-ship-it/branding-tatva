import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { site } from "@/data/site";
import { pageSchema } from "@/lib/pageSchema";

const pageJsonLd = pageSchema({
  type: "WebPage",
  path: "/privacy",
  name: "Privacy Policy | Branding Tatva",
  description:
    "How Branding Tatva collects, uses, and protects your information.",
  trail: [{ name: "Privacy Policy", path: "/privacy" }],
});

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects your information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
        <section className="relative overflow-hidden bg-soil pb-16 pt-36 sm:pb-20 sm:pt-44">
          <BackgroundVideo
            video="/videos/privacy-boundary-film-v2.mp4"
            poster="/images/privacy-boundary-film-v2-poster.jpg"
            imagePosition="center"
            parallax
            playbackRate={0.88}
          />
          <div className="absolute inset-0 bg-soil/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-soil via-soil/80 to-soil/20" />
          <Container className="relative max-w-2xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-sandstone">Your information</p>
            </Reveal>
            <SplitReveal as="h1" className="mt-2 text-display-md font-display font-normal text-ivory">
              Privacy Policy
            </SplitReveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-sm text-ivory/65">Last updated: draft, pending your review</p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-ivory py-16 sm:py-20">
          <Container className="prose-content max-w-2xl">
            <div className="mt-8 space-y-6 text-foreground-secondary">
              <p>
                {site.name} ({site.founder}) collects only the information you
                choose to share through the contact form on this site: your
                name, email, and any project details you provide. This
                information is used solely to respond to your enquiry, kept
                private, and never sold or shared with third parties.
              </p>
              <p>
                If you submit the contact form, your message is sent to{" "}
                {site.email} via a third party email delivery service. No
                marketing emails are sent without your separate, explicit
                consent.
              </p>
              <p>
                Measurement stays off until you allow it. On a first visit the
                banner offers three equal doors: allow everything, keep only
                what the site needs to work, or open the categories and decide
                one at a time.
              </p>
              <p>
                Analytics, once you allow it, counts which pages hold
                attention through Vercel Analytics. It records page views
                rather than personal profiles, and it reaches no advertiser.
              </p>
              <p>
                Advertising and audience trackers run nowhere on this site
                today. That category stays in the panel so it remains your
                choice rather than an assumption.
              </p>
              <p>
                Your decision lives in this browser alone and travels to no
                server. Change it whenever you like through Measurement
                preferences, in the footer of every page.
              </p>
              <p>
                To request that your information be deleted, email{" "}
                {site.email}.
              </p>
            </div>

            <p className="mt-10 rounded-2xl border border-state-warning/40 bg-state-warning/10 p-4 text-sm text-soil">
              This is placeholder legal text meant as a starting structure
              only. Please have this reviewed by a lawyer before launch.
              I&apos;ll flag this again in the launch checklist.
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
