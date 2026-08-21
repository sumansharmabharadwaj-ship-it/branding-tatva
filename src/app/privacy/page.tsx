import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { site } from "@/data/site";

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
                If you submit the contact form, your message is delivered through
                the email provider configured for this site. Marketing messages
                require separate, explicit consent.
              </p>
              <p>
                This site currently avoids tracking cookies and third party
                advertising scripts.
              </p>
              <p>
                To request that your information be deleted, use the contact form
                and write deletion request in the project description field.
              </p>
            </div>

            <p className="mt-10 rounded-md border border-state-warning/40 bg-state-warning/10 p-4 text-sm text-soil">
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
