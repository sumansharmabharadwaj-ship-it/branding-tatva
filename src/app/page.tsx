import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { FAQ } from "@/sections/FAQ";
import { DustMotes } from "@/components/DustMotes";
import { Reveal } from "@/components/Reveal";
import { ClipReveal } from "@/components/ClipReveal";
import { ElementsSection } from "@/sections/Elements";
import { SelectedWorkPinned } from "@/sections/Home/SelectedWorkPinned";
import { VisitorRecognition } from "@/sections/Home/VisitorRecognition";
import { FounderAuthority } from "@/sections/Home/FounderAuthority";
import { ServicePaths } from "@/sections/Home/ServicePaths";
import { CinematicHero } from "@/sections/Hero";
import { PinnedVideoBreak } from "@/components/PinnedVideoBreak";
import { ProcessSection } from "@/sections/Process";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ScrollProgress } from "@/components/ScrollProgress";
import { site } from "@/data/site";
import { elements } from "@/data/elements";
import { projects } from "@/data/projects";
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
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        <CinematicHero
          video="/videos/hero-forest-sanctuary.mp4"
          poster="/images/hero-forest-sanctuary-poster.jpg"
          imagePosition="30% 40%"
          badge="Brand strategy for founders and existing businesses"
          headline={
            <>
              Most brands are visible. Very few are{" "}
              <span className="italic text-clay">remembered</span>.
            </>
          }
          subhead="Brand positioning, identity, voice, experience, and market presence for businesses that need recognition to compound."
        >
          <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
          <LinkButton
            href="/work"
            variant="secondary"
            className="border-ivory/30 text-ivory hover:bg-ivory/10"
          >
            Explore the Work
          </LinkButton>
          <p className="w-full text-xs text-ivory/58 sm:text-sm">
            The same process that took one client&apos;s engagement rate from 0.71% to 2.81% in eight weeks.
          </p>
        </CinematicHero>

        <VisitorRecognition />

        <section className="relative overflow-hidden bg-soil py-20 text-ivory sm:py-28">
          <BackgroundVideo
            video="/videos/pixabay-flame-texture.mp4"
            poster="/images/pixabay-flame-texture-poster.jpg"
            push
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,22,18,.92)_0%,rgba(29,22,18,.72)_55%,rgba(29,22,18,.84)_100%)]" />
          <Container className="relative">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <Reveal>
                <div>
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.28em] text-sandstone">Proof enters early</p>
                  <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.8rem,5.6vw,5.8rem)] font-normal leading-[0.94] tracking-[-0.04em] text-ivory">
                    The polish matters after the decision proves it deserves to exist.
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-ivory/68 sm:text-base">
                    Selected work reveals the ambiguity, the strategic choice, the application, and the evidence the result can support.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <LinkButton href="/work" variant="secondary" className="border-ivory/28 text-ivory hover:bg-ivory/10">
                  View all work
                </LinkButton>
              </Reveal>
            </div>
          </Container>
        </section>

        <SelectedWorkPinned featured={featured} />

        <FounderAuthority />
        <ServicePaths />

        <section id="five-decisions" className="relative scroll-mt-24 overflow-hidden bg-soil py-24 text-ivory sm:py-32 lg:py-40">
          <BackgroundVideo
            video="/videos/pexels-mist-over-water.mp4"
            poster="/images/pexels-mist-over-water-poster.jpg"
            imagePosition="50% 52%"
            parallax
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,28,22,.78)_0%,rgba(20,28,22,.58)_45%,rgba(20,28,22,.9)_100%)]" />
          <Container className="relative max-w-[88rem]">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-20">
              <Reveal>
                <div>
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-sandstone">The five brand decisions</p>
                  <h2 className="mt-5 max-w-3xl font-display text-[clamp(3rem,6vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.045em] text-ivory">
                    Tatva becomes useful when every element governs a real commercial decision.
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="max-w-2xl text-sm leading-relaxed text-ivory/72 sm:text-base">
                  Earth decides the position. Water shapes the experience. Fire earns attention. Air carries the voice. Space gives every signal room to become recognition.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3 text-[0.6rem] uppercase tracking-[0.18em] text-ivory/60 sm:grid-cols-5">
                  {[
                    ["Earth", "Position"],
                    ["Water", "Experience"],
                    ["Fire", "Expression"],
                    ["Air", "Voice"],
                    ["Space", "Recognition"],
                  ].map(([element, decision]) => (
                    <div key={element} className="rounded-[1.1rem] border border-ivory/12 bg-soil/36 px-4 py-4 backdrop-blur-xl">
                      <span className="block text-sandstone">{element}</span>
                      <span className="mt-2 block text-ivory/58">{decision}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <ElementsSection elements={elements} />

        <section className="bg-soil text-ivory">
          <div className="relative overflow-hidden py-20 sm:py-28">
            <BackgroundVideo
              video="/videos/pixabay-roots-stream.mp4"
              poster="/images/pixabay-roots-stream-poster.jpg"
              imagePosition="50% 55%"
              parallax
            />
            <div className="absolute inset-0 bg-soil/76" />
            <Container className="relative">
              <Reveal>
                <p className="text-[0.64rem] font-medium uppercase tracking-[0.28em] text-sandstone">From principle to practice</p>
                <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.8rem,5.6vw,5.8rem)] font-normal leading-[0.94] tracking-[-0.04em] text-ivory">
                  Six movements turn the hidden decisions into one living brand system.
                </h2>
              </Reveal>
            </Container>
          </div>
          <ProcessSection stages={process} elementColor={elementColor} />
          <div className="relative overflow-hidden">
            <BackgroundVideo
              video="/videos/pixabay-roots-stream.mp4"
              poster="/images/pixabay-roots-stream-poster.jpg"
              imagePosition="50% 55%"
            />
            <div className="absolute inset-0 bg-soil/82" />
            <Container className="relative pb-16 pt-10 text-center sm:pb-20 sm:pt-14">
              <Reveal>
                <p className="mx-auto max-w-xl font-display text-2xl leading-tight text-ivory/86 sm:text-3xl">
                  Every decision should remember the one that came before it.
                </p>
              </Reveal>
            </Container>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 sm:py-28">
          <BackgroundVideo
            video="/videos/higgsfield-forest-light-vivid.mp4"
            poster="/images/higgsfield-forest-light-vivid-poster.jpg"
            imagePosition="50% 48%"
            parallax
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,239,230,.22)_0%,rgba(244,239,230,.38)_100%)]" />
          <ClipReveal>
            <Container className="relative max-w-3xl">
              <Reveal>
                <div className="rounded-[2rem] border border-white/35 bg-background-elevated/88 px-6 py-10 shadow-elevation-lg backdrop-blur-2xl sm:px-14 sm:py-16">
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.26em] text-clay">Risk removal</p>
                  <h2 className="mt-4 font-display text-[clamp(2.6rem,5vw,5rem)] font-normal leading-[0.96] tracking-[-0.035em] text-soil">
                    The questions that usually sit between interest and action.
                  </h2>
                  <div className="mt-9">
                    <FAQ />
                  </div>
                </div>
              </Reveal>
            </Container>
          </ClipReveal>
        </section>

        <PinnedVideoBreak
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
              className="mx-auto max-w-2xl font-display text-[clamp(2.7rem,5.6vw,5.8rem)] font-normal leading-[0.94] tracking-[-0.04em] text-ivory"
              style={{ textShadow: "0 2px 14px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)" }}
            >
              Let&apos;s find the Tatva your business needs to become understood, recognised, and remembered.
            </h2>
            <p
              className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ivory/78 sm:text-base"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
            >
              The first conversation examines where the brand stands, what feels unclear, and which decision deserves attention first.
            </p>
            <div className="mt-9">
              <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
              <p className="mt-4 text-sm text-ivory/72" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
                Twenty minutes. A real diagnosis. A clear next step.
              </p>
            </div>
          </div>
        </PinnedVideoBreak>
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
