import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { AuditInvite } from "@/components/AuditInvite";
import { LinkButton } from "@/components/Button";
import { FAQ } from "@/sections/FAQ";
import { DustMotes } from "@/components/DustMotes";
import { Reveal } from "@/components/Reveal";
import { ClipReveal } from "@/components/ClipReveal";
import { ElementsSection } from "@/sections/Elements";
import { EvidenceWall } from "@/sections/Home/EvidenceWall";
import { ClarityCTA } from "@/sections/Home/ClarityCTA";
import { StudioTriptych } from "@/sections/Home/StudioTriptych";
import { CinematicHero } from "@/sections/Hero";
import { VisitorRecognition } from "@/sections/Home/VisitorRecognition";
import { ThreePathsSection } from "@/sections/Home/ThreePathsSection";
import { VideoBreak } from "@/components/VideoBreak";
import { ProcessSection } from "@/sections/Process";
import { BackgroundVideo } from "@/components/BackgroundVideo";
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
          <LinkButton
            href="/work"
            variant="secondary"
            className="border-ivory/30 text-ivory hover:bg-ivory/10"
          >
            Explore the Work
          </LinkButton>
          <p className="w-full text-xs text-ivory/50 sm:text-sm">
            The same process that took one client&apos;s engagement rate from 0.71% to 2.81% in eight weeks. Led
            directly by Suman, start to finish.
          </p>
        </CinematicHero>

        <VisitorRecognition />
        <EvidenceWall />
        <ClarityCTA />
        <StudioTriptych />
        <ThreePathsSection />

        <div id="elements" className="scroll-mt-24">
          <ElementsSection elements={elements} />
        </div>

        <section className="bg-soil">
          <div className="bg-soil py-20 sm:py-28">
            <Container>
              <Reveal>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-sandstone">
                  From principle to practice
                </p>
                <h2 className="mt-4 text-display-sm font-display font-normal text-ivory">
                  How a project moves
                </h2>
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

        <section className="relative overflow-hidden py-20 sm:py-28">
          <BackgroundVideo
            video="/videos/pexels-golden-fog-sea.mp4"
            videoWebm="/videos/pexels-golden-fog-sea.webm"
            poster="/images/pexels-golden-fog-sea-poster.jpg"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(180deg, rgba(244,239,230,0.18) 0%, rgba(244,239,230,0.28) 100%)" }}
          />
          <ClipReveal>
            <Container className="relative max-w-2xl">
              <Reveal>
                <div className="rounded-2xl border border-border/50 bg-background-elevated/92 px-6 py-10 shadow-elevation-md backdrop-blur-sm sm:px-14 sm:py-16">
                  <h2 className="text-display-sm font-display font-normal text-soil">Common questions</h2>
                  <div className="mt-8">
                    <FAQ
                      questions={[
                        "Can you help a brand new business?",
                        "Can you help an existing brand that already has an identity?",
                        "Can you actually implement, or just strategize?",
                        "How long does a project take?",
                        "Can we work remotely?",
                      ]}
                    />
                    <p className="mt-6 text-sm">
                      <Link href="/services#book" className="link-underline text-foreground-secondary hover:text-soil">
                        Bring any other question to a first conversation
                      </Link>
                    </p>
                    <div className="mt-8">
                      <AuditInvite tone="light" />
                    </div>
                  </div>
                </div>
              </Reveal>
            </Container>
          </ClipReveal>
        </section>

        <VideoBreak
          src="/videos/higgsfield-silver-tide.mp4"
          poster="/images/higgsfield-silver-tide-poster.jpg"
          quote="Some things only become visible once everything else goes quiet."
          height="min(900px, 108vh)"
          imagePosition="50% 12%"
          quoteVariant="statement"
          parallax
          cameraPush
          wordFade
          overlayGradient="linear-gradient(180deg, rgba(20,17,14,0.35) 0%, rgba(20,17,14,0.15) 30%, rgba(20,17,14,0.2) 55%, rgba(20,17,14,0.9) 100%)"
        >
          <DustMotes />
          <div className="relative">
            <h2
              className="mx-auto max-w-xl text-display-md font-display font-normal text-ivory"
              style={{ textShadow: "0 2px 14px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)" }}
            >
              What should your audience remember after you have left the room?
            </h2>
            <div className="mt-8">
              <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
              <p className="mt-4 text-sm text-ivory/80" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
                Twenty minutes, a real conversation, zero pitch deck. Honest feedback either way.
              </p>
            </div>
          </div>
        </VideoBreak>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
