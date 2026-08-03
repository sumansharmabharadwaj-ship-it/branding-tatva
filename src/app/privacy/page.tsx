import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy and Cookie Policy",
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
            <p className="text-xs uppercase tracking-[0.24em] text-foreground-secondary">The practical version</p>
            <h1 className="mt-3 text-display-md font-display font-normal text-soil">Privacy and Cookie Policy</h1>
            <p className="mt-4 text-sm text-foreground-secondary">Last updated: August 2026</p>

            <div className="mt-10 space-y-9 text-foreground-secondary">
              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Information you choose to share</h2>
                <p className="mt-3">
                  {site.name} ({site.founder}) receives the information you submit through forms on this site,
                  including your name, email address and any project details you provide. This information is used
                  to respond to your enquiry, deliver a resource you requested, or manage a newsletter subscription.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Service providers</h2>
                <p className="mt-3">
                  Form and newsletter submissions may pass through third party delivery or mailing services so the
                  requested message can reach you. The booking experience is provided through Calendly when you open
                  the calendar. Each provider processes information under its own privacy terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Consent preferences</h2>
                <p className="mt-3">
                  Your consent choice is stored in your browser&apos;s localStorage under the key
                  <code className="mx-1 rounded-sm bg-soil/5 px-1.5 py-0.5 text-soil">bt-consent-v2</code>.
                  It records whether analytics and marketing categories are enabled, plus the time the choice was
                  updated. Necessary storage remains active because it remembers your preference and supports core
                  site functions.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Analytics</h2>
                <p className="mt-3">
                  Vercel Analytics loads only after you enable the analytics category. It measures page views and
                  selected site interactions. Rejecting non-essential storage keeps the analytics component and
                  custom event helper inactive.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Marketing</h2>
                <p className="mt-3">
                  No advertising or remarketing tracker is currently installed. The marketing category exists so a
                  future tool cannot be introduced silently. It will remain disabled unless you actively enable it.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Changing your choice</h2>
                <p className="mt-3">
                  Use the Cookie preferences control available on every page after making a choice. You can disable
                  analytics or marketing at any time. The updated setting applies immediately to future activity in
                  that browser.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Your information</h2>
                <p className="mt-3">
                  To request access, correction or deletion of information you submitted, email {site.email}. Please
                  include enough detail to identify the relevant enquiry or subscription.
                </p>
              </section>
            </div>

            <p className="mt-10 rounded-2xl border border-state-warning/40 bg-state-warning/10 p-4 text-sm text-soil">
              This page describes the current implementation accurately. It remains sensible to have the final policy
              reviewed by a qualified UK privacy professional before the public launch.
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
