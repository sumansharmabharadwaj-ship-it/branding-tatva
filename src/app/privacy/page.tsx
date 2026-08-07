import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { site } from "@/data/site";
import { pageSchema, PERSON_ID, ORGANIZATION_ID } from "@/lib/pageSchema";


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
      <Header />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
        <section className="pb-20 pt-32 sm:pt-36">
          <Container className="prose-content max-w-2xl">
            <h1 className="text-display-md font-display font-normal text-soil">Privacy Policy</h1>
            <p className="mt-4 text-sm text-foreground-secondary">Last updated: draft, pending your review</p>

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
