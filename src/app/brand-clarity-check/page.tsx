import type { Metadata } from "next";
import Link from "next/link";
import { BrandClarityCheck } from "@/components/BrandClarityCheck";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SplitReveal } from "@/components/SplitReveal";
import { site } from "@/data/site";
import { Header } from "@/layouts/Header";
import { pageSchema } from "@/lib/pageSchema";
import { Footer } from "@/sections/Footer";

const description =
  "A ten minute self diagnosis for founders. Score your own brand across position, distinctiveness and presence, then read which of the three deserves your next pound.";

export const metadata: Metadata = {
  title: "The Brand Clarity Check",
  description,
  alternates: { canonical: "/brand-clarity-check" },
  openGraph: {
    title: "The Brand Clarity Check | Branding Tatva",
    description,
    type: "website",
    url: `${site.url}/brand-clarity-check`,
  },
};

const structuredData = pageSchema({
  type: "WebPage",
  path: "/brand-clarity-check",
  name: "The Brand Clarity Check | Branding Tatva",
  description,
  trail: [{ name: "The Brand Clarity Check", path: "/brand-clarity-check" }],
});

export default function BrandClarityCheckPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <section className="relative overflow-hidden bg-soil pb-16 pt-36 text-ivory sm:pb-20 sm:pt-44">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 78% 18%, rgba(198,169,122,0.2), transparent 30%), radial-gradient(circle at 18% 88%, rgba(92,107,74,0.2), transparent 34%), linear-gradient(145deg, #252d29 0%, #3f4d44 54%, #27221e 100%)",
            }}
          />
          <Container className="relative max-w-4xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sandstone">
                A ten minute self diagnosis
              </p>
            </Reveal>
            <SplitReveal
              as="h1"
              className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,6.4vw,5.4rem)] font-normal leading-[0.98]"
            >
              Before you spend on branding, spend ten minutes here.
            </SplitReveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-2xl text-base leading-8 text-ivory/76 sm:text-lg">
                Most branding money is spent in the wrong order, on the visible
                half before the deciding half. This check finds which half your
                business actually needs, so whatever you spend next goes to the
                real problem rather than the nearest one to blame.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-ivory/60">
                Nine questions, three sections, and a plain reading of what your
                answers mean. Answer honestly and alone. There are no marks for
                looking good on your own worksheet. The result stays open on
                this page, with no email required to see it.
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-ivory py-16 sm:py-24">
          <Container className="max-w-4xl">
            <BrandClarityCheck />
          </Container>
        </section>

        <section className="bg-background-alt py-16 sm:py-20">
          <Container className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
              Keep reading
            </p>
            <h2 className="mt-4 font-display text-display-md font-normal text-soil">
              The guides behind each section.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Link
                href="/insights/brand-positioning-strategy-service-businesses"
                className="rounded-2xl border border-border bg-background-elevated p-6 transition-colors hover:border-clay/50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay-ink">
                  Position
                </p>
                <p className="mt-3 text-sm leading-6 text-foreground-secondary">
                  How positioning gets decided for a service business.
                </p>
              </Link>
              <Link
                href="/insights/distinctive-brand-assets-audit"
                className="rounded-2xl border border-border bg-background-elevated p-6 transition-colors hover:border-clay/50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay-ink">
                  Distinctiveness
                </p>
                <p className="mt-3 text-sm leading-6 text-foreground-secondary">
                  Auditing the cues people actually recognise you by.
                </p>
              </Link>
              <Link
                href="/insights/brand-awareness-vs-brand-recall"
                className="rounded-2xl border border-border bg-background-elevated p-6 transition-colors hover:border-clay/50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay-ink">
                  Presence
                </p>
                <p className="mt-3 text-sm leading-6 text-foreground-secondary">
                  Why being remembered lowers the cost of every sale.
                </p>
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
