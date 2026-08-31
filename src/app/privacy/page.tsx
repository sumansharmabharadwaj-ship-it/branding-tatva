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
    "What Branding Tatva collects through enquiries and measurement, why it is used, and how to request deletion.",
  trail: [{ name: "Privacy Policy", path: "/privacy" }],
});

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `What ${site.name} collects through enquiries and measurement, why it is used, and how to request deletion.`,
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
            video="/videos/generated/bt-legal-archive-seal.mp4"
            poster="/images/generated/bt-legal-archive-seal-poster.jpg"
            imagePosition="center"
            parallax
            playbackRate={0.9}
            posterPriority
          />
          <div className="absolute inset-0 bg-soil/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-soil via-soil/80 to-soil/20" />
          <Container className="relative max-w-2xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-sandstone">What is collected and why</p>
            </Reveal>
            <SplitReveal as="h1" className="mt-2 text-display-md font-display font-normal text-ivory">
              Privacy Policy
            </SplitReveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-sm text-ivory/65">Updated 31 August 2026 · Working draft for legal review</p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-ivory py-16 sm:py-20">
          <Container className="prose-content max-w-2xl">
            <div className="mt-8 space-y-10 text-foreground-secondary">
              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Information you choose to share</h2>
                <p className="mt-3">
                  {site.name} ({site.founder}) collects the name, email address, and project details you enter in the contact form. That information is used to answer your enquiry and manage the conversation you requested. It is never sold.
                </p>
              </section>
              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Email delivery</h2>
                <p className="mt-3">
                  Contact form messages are delivered to {site.email} through an email delivery provider. Marketing emails require separate, explicit consent.
                </p>
              </section>
              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Measurement choices</h2>
                <p className="mt-3">
                  Optional measurement stays off until you allow it. If enabled, Vercel Analytics counts page views and site usage. It does not create an advertising profile or send information to an advertiser.
                </p>
                <p className="mt-3">
                  Advertising and audience trackers are not used on this site. Your preference is stored in this browser. Change it at any time through Measurement preferences in the footer.
                </p>
              </section>
              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Deletion requests</h2>
                <p className="mt-3">
                  To ask for information connected with your enquiry to be deleted, email {site.email}.
                </p>
              </section>
            </div>

            <p className="mt-10 rounded-2xl border border-state-warning/40 bg-state-warning/10 p-4 text-sm text-soil">
              Legal status: this page is a working draft. Obtain independent
              legal review before treating it as final policy.
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
