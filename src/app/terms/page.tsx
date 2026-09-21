import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LivingImage } from "@/components/LivingImage";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { site } from "@/data/site";
import { pageSchema } from "@/lib/pageSchema";

const pageJsonLd = pageSchema({
  type: "WebPage",
  path: "/terms",
  name: "Terms of Use | Branding Tatva",
  description:
    "The terms that govern using the Branding Tatva website and working with Suman Sharma.",
  trail: [{ name: "Terms of Use", path: "/terms" }],
});

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that govern using ${site.name}'s website and working with ${site.founder}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
        <section className="relative overflow-hidden bg-soil pb-16 pt-36 sm:pb-20 sm:pt-44">
          <LivingImage
            src="/images/generated/bt-terms-commitment-paper-v2.webp"
            alt=""
            priority
            imagePosition="center"
            intensity="cinematic"
          />
          <div className="absolute inset-0 bg-soil/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-soil via-soil/80 to-soil/20" />
          <Container className="relative max-w-2xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-sandstone">Website and enquiry terms</p>
            </Reveal>
            <SplitReveal as="h1" className="mt-2 text-display-md font-display font-normal text-ivory">
              Terms of Use
            </SplitReveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-sm text-ivory/65">Updated 31 August 2026 · Working draft for legal review</p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-ivory py-16 sm:py-20">
          <Container className="max-w-2xl">
            <div className="mt-8 space-y-10 text-foreground-secondary">
              <p>
                This website is operated by {site.founder} under the name{" "}
                {site.name}. By using this site, you agree to the following:
              </p>
              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Using the content</h2>
                <p className="mt-3">
                All content on this site, including written copy, brand
                strategy frameworks, and portfolio descriptions, is the
                property of {site.founder} and may only be reproduced with
                permission.
                </p>
              </section>
              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Project records and outcomes</h2>
                <p className="mt-3">
                Case studies shown on this site describe work completed for
                named clients with their permission. Results described are
                specific to those projects alone; future work outcomes will
                vary based on your specific situation.
                </p>
              </section>
              <section>
                <h2 className="font-display text-2xl font-normal text-soil">Enquiries and engagements</h2>
                <p className="mt-3">
                Enquiries submitted through the contact form become a client
                engagement only once confirmed separately in writing.
                </p>
              </section>
            </div>

            <p className="mt-10 rounded-2xl border border-state-warning/40 bg-state-warning/10 p-4 text-sm text-soil">
              Legal status: this page is a working draft. Obtain independent
              legal review before treating it as final terms.
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
