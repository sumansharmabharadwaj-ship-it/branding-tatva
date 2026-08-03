import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { DustMotes } from "@/components/DustMotes";
import { LogoMark } from "@/components/Logo";
import { PinnedVideoBreak } from "@/components/PinnedVideoBreak";
import { ScrollProgress } from "@/components/ScrollProgress";
import { HomeOpening } from "@/sections/Home/HomeOpening";
import { VisitorRecognition } from "@/sections/Home/VisitorRecognition";
import { EvidenceFilm } from "@/sections/Home/EvidenceFilm";
import { FounderAuthority } from "@/sections/Home/FounderAuthority";
import { ServicePaths } from "@/sections/Home/ServicePaths";
import { TatvaStory } from "@/sections/Home/TatvaStory";
import { TatvaMobileStory } from "@/sections/Home/TatvaMobileStory";
import { ProcessFilm } from "@/sections/Home/ProcessFilm";
import { DecisionClearingHome } from "@/sections/Home/DecisionClearingHome";
import { site } from "@/data/site";
import { elements } from "@/data/elements";
import { projects } from "@/data/projects";
import { process } from "@/data/process";
import { elementColor } from "@/lib/elementColor";

export const metadata: Metadata = {
  title: `Philosophical Brand Strategy by ${site.founder}`,
  description:
    "Brand positioning, verbal identity, experience, and recognition shaped through psychology, language, and the five Tatvas.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `Philosophical Brand Strategy by ${site.founder}`,
    description:
      "Brand positioning, verbal identity, experience, and recognition shaped through psychology, language, and the five Tatvas.",
    url: site.url,
    type: "website",
  },
};

export default function Home() {
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content" className="bg-soil">
        <HomeOpening />

        <VisitorRecognition />

        <EvidenceFilm projects={featured} />

        <FounderAuthority />

        <ServicePaths />

        <section className="relative isolate overflow-hidden bg-soil py-24 text-ivory sm:py-32 lg:py-40">
          <BackgroundVideo
            video="/videos/pexels-mist-over-water.mp4"
            poster="/images/pexels-mist-over-water-poster.jpg"
            imagePosition="50% 52%"
            parallax
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(15,25,18,.94)_0%,rgba(15,25,18,.75)_52%,rgba(15,25,18,.58)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_77%_44%,rgba(198,169,122,.16),transparent_34%)]" />

          <Container className="relative max-w-[92rem]">
            <div className="grid gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-20">
              <div>
                <p className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-sandstone">Scene six · the philosophy becomes useful</p>
                <h2 className="mt-5 max-w-4xl font-display text-[clamp(3rem,6.2vw,6.6rem)] font-normal leading-[0.88] tracking-[-0.05em] text-ivory">
                  This website behaves like the brands it argues for.
                </h2>
                <p className="mt-7 max-w-2xl text-sm leading-relaxed text-ivory/72 sm:text-base">
                  Earth holds the position. Water shapes the experience. Fire earns attention. Air gives the idea language. Space allows recognition to settle. The imagery, movement, type, and pacing form one argument before a service is described.
                </p>
                <div className="mt-9">
                  <LinkButton href="/work">See the same decisions inside real work</LinkButton>
                </div>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-[36rem] overflow-hidden rounded-full border border-ivory/14 bg-soil/36 shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-[8%] rounded-full border border-ivory/10" />
                <div className="absolute inset-[20%] rounded-full border border-sandstone/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LogoMark size={260} light className="text-ivory drop-shadow-[0_0_42px_rgba(198,169,122,.25)]" />
                </div>
                <div className="absolute inset-x-[12%] bottom-[10%] flex items-center gap-3 text-[0.54rem] uppercase tracking-[0.2em] text-ivory/42">
                  <span>Raw material</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sandstone/52 to-transparent" />
                  <span>One meaning</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <TatvaMobileStory elements={elements} />
        <TatvaStory elements={elements} />

        <ProcessFilm stages={process} elementColor={elementColor} />

        <DecisionClearingHome />

        <PinnedVideoBreak
          src="/videos/higgsfield-silver-tide.mp4"
          poster="/images/higgsfield-silver-tide-poster.jpg"
          quote="Some things become visible once everything else goes quiet."
          height="min(920px, 112vh)"
          imagePosition="50% 12%"
          quoteVariant="statement"
          parallax
          cameraPush
          wordFade
          overlayGradient="linear-gradient(180deg, rgba(12,19,15,.32) 0%, rgba(12,19,15,.14) 28%, rgba(12,19,15,.22) 55%, rgba(12,19,15,.92) 100%)"
        >
          <DustMotes />
          <div className="relative">
            <LogoMark size={84} light className="mx-auto mb-7 text-ivory" />
            <h2
              className="mx-auto max-w-3xl font-display text-[clamp(2.8rem,6vw,6.2rem)] font-normal leading-[0.9] tracking-[-0.05em] text-ivory"
              style={{ textShadow: "0 2px 14px rgba(0,0,0,.85), 0 1px 4px rgba(0,0,0,.9)" }}
            >
              Let&apos;s find the Tatva your business needs to become understood, recognised, and remembered.
            </h2>
            <p
              className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ivory/78 sm:text-base"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,.8)" }}
            >
              Bring the brand question that currently feels hardest to explain. The first conversation traces the decision beneath it.
            </p>
            <div className="mt-9">
              <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
              <p className="mt-4 text-sm text-ivory/70" style={{ textShadow: "0 1px 6px rgba(0,0,0,.8)" }}>
                Twenty minutes. A real diagnosis. A clear next step.
              </p>
            </div>
          </div>
        </PinnedVideoBreak>
      </main>
      <Footer />
    </>
  );
}
