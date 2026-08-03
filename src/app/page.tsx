import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { ElementsSection } from "@/sections/Elements";
import { EvidenceWall } from "@/sections/Home/EvidenceWall";
import { StudioTriptych } from "@/sections/Home/StudioTriptych";
import { ClosingSequence } from "@/sections/Home/ClosingSequence";
import { CinematicHero } from "@/sections/Hero";
import { VisitorRecognition } from "@/sections/Home/VisitorRecognition";
import { ThreePathsSection } from "@/sections/Home/ThreePathsSection";
import { ProcessSection } from "@/sections/Process";
import { site } from "@/data/site";
import { elements } from "@/data/elements";
import { process } from "@/data/process";
import { faqs } from "@/data/faqs";
import { elementColor } from "@/lib/elementColor";

export const metadata: Metadata = {
  title: `${site.name}: Brand Strategy by ${site.founder}`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name}: Brand Strategy by ${site.founder}`,
    description: site.description,
    url: site.url,
    type: "website",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const closingQuestions = [
  "Can you help a brand new business?",
  "Can you help an existing brand that already has an identity?",
  "Can you actually implement, or just strategize?",
  "How long does a project take?",
  "Can we work remotely?",
].map((question) => {
  const item = faqs.find((faq) => faq.question === question);
  if (!item) throw new Error(`Missing homepage FAQ: ${question}`);
  return item;
});

export default function Home() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <CinematicHero
          video="/videos/hero-forest-sanctuary.mp4"
          poster="/images/hero-forest-sanctuary-poster.jpg"
          imagePosition="30% 40%"
          badge="Brand strategy for founders & existing businesses"
          headline={
            <>
              Most brands are visible. Very few are{" "}
              <span className="italic text-clay">remembered</span>.
            </>
          }
          subhead="Brand positioning, identity, voice, and market presence for founders and existing businesses that need recognition to compound."
        >
          <LinkButton href="/contact" trackEvent="hero_booking_click" trackProps={{ page: "home" }}>
            Book a Brand Strategy Session
          </LinkButton>
          <LinkButton href="/work" variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
            Explore the Work
          </LinkButton>
          <p className="w-full text-xs text-ivory/50 sm:text-sm">
            The same process that took one client&apos;s engagement rate from 0.71% to 2.81% in eight weeks. Led directly by Suman, start to finish.
          </p>
        </CinematicHero>

        <VisitorRecognition />
        <EvidenceWall />
        <StudioTriptych />
        <ThreePathsSection />

        <div id="elements" className="scroll-mt-24">
          <ElementsSection elements={elements} />
        </div>

        <section className="bg-soil">
          <div className="bg-soil py-20 sm:py-28">
            <Container>
              <Reveal>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-sandstone">From principle to practice</p>
                <h2 className="mt-4 text-display-sm font-display font-normal text-ivory">How a project moves</h2>
              </Reveal>
            </Container>
          </div>
          <ProcessSection stages={process} elementColor={elementColor} />
          <div className="bg-soil">
            <Container className="pb-16 pt-10 text-center sm:pb-20 sm:pt-14">
              <Reveal>
                <p className="mx-auto max-w-lg text-sm italic text-ivory/80 sm:text-base">
                  Skipping a decision costs quietly. The recall you paid for stops compounding where the sequence breaks.
                </p>
              </Reveal>
            </Container>
          </div>
        </section>

        <ClosingSequence questions={closingQuestions} />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
