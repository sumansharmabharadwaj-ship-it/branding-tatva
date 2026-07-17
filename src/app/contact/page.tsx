import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
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
            <div className="lg:col-span-2">
              <p className="text-sm font-medium uppercase tracking-wide text-action-secondary">
                Contact
              </p>
              <h1 className="mt-3 text-display-lg font-display font-semibold text-soil">
                Tell me what your brand is becoming.
              </h1>
              <p className="mt-5 text-foreground-secondary">
                Fill in as much or as little as you know right now. I'll ask
                a few more questions where it helps. I read every enquiry
                personally.
              </p>
              <div className="mt-8 space-y-2 text-sm text-foreground-secondary">
                <p>
                  Prefer email?{" "}
                  <a href={`mailto:${site.email}`} className="text-action-primary underline">
                    {site.email}
                  </a>
                </p>
                <p>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-action-primary underline"
                  >
                    Connect on LinkedIn
                  </a>
                </p>
              </div>
            </div>

            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
