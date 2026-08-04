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
import { TatvaStrip } from "@/sections/Home/TatvaStrip";
import { StudioTriptych } from "@/sections/Home/StudioTriptych";
import { CinematicHero } from "@/sections/Hero";
import { VisitorRecognition } from "@/sections/Home/VisitorRecognition";
import { ThreePathsSection } from "@/sections/Home/ThreePathsSection";
import { ProcessChapterIntro } from "@/sections/Home/ProcessChapterIntro";
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
          badge="Brand strategy shaped by psychology, language, and market evidence"
          headline={
            <>
              Most brands are visible. Very few are{" "}
              <span className="italic text-clay">remembered</span>.
            </>
          }
          subhead="I help founders and growing businesses decide what their brand should mean, then build the positioning, identity, voice, website, and market presence that make that meaning recognisable."
        >
          <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
          <LinkButton
            href="/work"
            variant="secondary"
            className="border-ivory/30 text-ivory hover:bg-ivory/10"
          >
            Explore the Work
          </LinkButton>
          <p className="w-full text-xs text-ivory/50 sm:text-sm">
            The same strategic method that moved one client&apos;s engagement rate from 0.71% to 2.81% in eight weeks. Led directly by Suman, from diagnosis to delivery.
          </p>
        </CinematicHero>

        <VisitorRecognition />
        <EvidenceWall />
        <ClarityCTA />
        <StudioTriptych />
        <ThreePathsSection />
        <TatvaStrip />

        {/* The full five-element sequence now follows the framework
            immediately. The separate Earth-only excavation remains in the
            codebase for a deeper Services/About use, but no longer makes
            Home teach the same foundation twice or adds an unlabelled
            320vh detour between the ladder's Framework and Elements rungs. */}
        <div id="elements" className="scroll-mt-24">
          <ElementsSection elements={elements} />
        </div>

        <section className="bg-soil">
          <ProcessChapterIntro />
          <ProcessSection stages={process} elementColor={elementColor} />
        </section>

        <section className="relative overflow-hidden py-20 sm:py-28">
          <BackgroundVideo
            video="/videos/pexels-golden-fog-sea.mp4"
            videoWebm="/videos/pexels-golden-fog-sea.webm"
            poster="/images/pexels-golden-fog-sea-poster.jpg"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(244,239,230,0.18) 0%, rgba(244,239,230,0.28) 100%)",
            }}
          />
          <ClipReveal>
            <Container className="relative max-w-2xl">
              <Reveal>
                <div className="rounded-2xl border border-border/50 bg-background-elevated/92 px-6 py-10 shadow-elevation-md backdrop-blur-sm sm:px-14 sm:py-16">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-clay">
                    Before we work together
                  </p>
                  <h2 className="mt-3 text-display-sm font-display font-normal text-soil">
                    The practical questions, answered without fog.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">
                    Scope, implementation, timing, and distance should feel clear before a first conversation. The answers unfold in sequence, and pause the moment you choose one.
                  </p>
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
                      <Link
                        href="/services#book"
                        className="link-underline text-foreground-secondary hover:text-soil"
                      >
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
              Let&apos;s find the Tatva of your business: the idea people should remember after everything else has moved on.
            </h2>
            <div className="mt-8">
              <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
              <p
                className="mt-4 text-sm text-ivory/80"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
              >
                Twenty minutes, a real conversation, and an honest view of what the brand needs next.
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
