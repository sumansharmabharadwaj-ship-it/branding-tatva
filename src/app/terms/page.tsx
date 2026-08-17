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
          <BackgroundVideo
            video="/videos/terms-agreement-film-v2.mp4"
            poster="/images/terms-agreement-film-v2-poster.jpg"
            imagePosition="center"
            parallax
            playbackRate={0.88}
          />
          <div className="absolute inset-0 bg-soil/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-soil via-soil/80 to-soil/20" />
          <Container className="relative max-w-2xl">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-sandstone">Using this site</p>
            </Reveal>
            <SplitReveal as="h1" className="mt-2 text-display-md font-display font-normal text-ivory">
              Terms of Use
            </SplitReveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-sm text-ivory/65">Last updated: draft, pending your review</p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-ivory py-16 sm:py-20">
          <Container className="max-w-2xl">
            <div className="mt-8 space-y-6 text-foreground-secondary">
              <p>
                This website is operated by {site.founder} under the name{" "}
                {site.name}. By using this site, you agree to the following:
              </p>
              <p>
                All content on this site, including written copy, brand
                strategy frameworks, and portfolio descriptions, is the
                property of {site.founder} and may only be reproduced with
                permission.
              </p>
              <p>
                Case studies shown on this site describe work completed for
                named clients with their permission. Results described are
                specific to those projects alone; future work outcomes will
                vary based on your specific situation.
              </p>
              <p>
                Enquiries submitted through the contact form become a client
                engagement only once confirmed separately in writing.
              </p>
            </div>

            <p className="mt-10 rounded-2xl border border-state-warning/40 bg-state-warning/10 p-4 text-sm text-soil">
              This is placeholder legal text meant as a starting structure
              only. Please have this reviewed by a lawyer before launch.
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
