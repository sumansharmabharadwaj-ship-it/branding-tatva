import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="pb-20 pt-32 sm:pt-36">
          <Container className="max-w-2xl">
            <h1 className="text-display-md font-display font-semibold text-soil">Terms of Use</h1>
            <p className="mt-4 text-sm text-foreground-secondary">Last updated: draft, pending your review</p>

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

            <p className="mt-10 rounded-md border border-state-warning/40 bg-state-warning/10 p-4 text-sm text-soil">
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
