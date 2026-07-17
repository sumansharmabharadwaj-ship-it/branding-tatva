import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="py-20">
          <Container className="prose-content max-w-2xl">
            <h1 className="text-display-md font-display font-semibold text-soil">Privacy Policy</h1>
            <p className="mt-4 text-sm text-foreground-secondary">Last updated: draft, pending your review</p>

            <div className="mt-8 space-y-6 text-foreground-secondary">
              <p>
                {site.name} ({site.founder}) collects only the information you
                choose to share through the contact form on this site: your
                name, email, and any project details you provide. This
                information is used solely to respond to your enquiry and is
                not sold or shared with third parties.
              </p>
              <p>
                If you submit the contact form, your message is sent to{" "}
                {site.email} via a third party email delivery service. No
                marketing emails are sent without your separate, explicit
                consent.
              </p>
              <p>
                This site does not use tracking cookies or third party
                advertising scripts at this time.
              </p>
              <p>
                To request that your information be deleted, email{" "}
                {site.email}.
              </p>
            </div>

            <p className="mt-10 rounded-md border border-state-warning/40 bg-state-warning/10 p-4 text-sm text-soil">
              This is placeholder legal text, not a substitute for legal
              advice. Please have this reviewed by a lawyer before launch.
              I&apos;ll flag this again in the launch checklist.
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
