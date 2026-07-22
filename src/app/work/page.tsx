import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PhotoHero } from "@/components/PhotoHero";
import { ImageBreak } from "@/components/ImageBreak";
import { WorkGrid } from "@/sections/CaseStudies";
import { ClipReveal } from "@/components/ClipReveal";
import { AnnotatedVisual } from "@/components/AnnotatedVisual";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected brand and content strategy work.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | Branding Tatva",
    description: "Selected brand and content strategy work.",
    type: "website",
  },
};

export default function WorkPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <PhotoHero
          video="/videos/own-ridge-road.mp4"
          poster="/images/own-ridge-road-poster.jpg"
          minHeight="70vh"
        >
          <Container className="relative py-20 text-center">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-ivory/30 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ivory/85">
                Work
              </span>
              <h1 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] text-ivory">
                Projects across very different categories.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-ivory/70">
                Marketplaces, executive coaching, wellness, D2C supplements,
                enterprise technology: different industries, the same
                underlying method.
              </p>
            </Reveal>
          </Container>
        </PhotoHero>

        {/* Direct feedback pointed at alethia.earth/solutions/nature-based's
            "OUR SOLUTION" section as the technique to borrow — a photo
            with dot-and-line callouts, not another card grid — but the
            first pass leaned too hard on the reference itself: an
            isolated single tree, same composition, same idea, not just
            the same technique. Swapped for a brass compass instead —
            takes the "one clear object explains it" gist without
            reproducing what alethia's own asset actually shows, and
            ties into "starts with real direction" more literally than a
            tree did. Added here, not in place of the project grid
            below: those five projects are genuinely distinct case
            studies someone needs to click into individually, the same
            reason alethia's own case-study list stays a normal list
            further down their page. This explains the method behind
            all five before the grid, the one thing a card grid can't
            easily say on its own. */}
        <section className="bg-background-alt py-20 sm:py-28">
          <Container>
            <AnnotatedVisual
              image="/images/higgsfield-brass-compass.jpg"
              alt=""
              callouts={[
                {
                  dotTop: "38%",
                  dotLeft: "44%",
                  side: "left",
                  title: "Starts with a real audit, not a template",
                  text: "I look at what's actually happening in your market before proposing anything, not a standard package run the same way for every client.",
                },
                {
                  dotTop: "58%",
                  dotLeft: "56%",
                  side: "right",
                  title: "One connected system, not five handoffs",
                  text: "Positioning, identity, and content built to carry the same throughline, not separate deliverables that happen to share a folder.",
                },
              ]}
            />
          </Container>
        </section>

        {/* Was bold solid Soil, matching every other photo/video section
            site-wide — but per direct feedback pointing at the reference
            site's own restraint, a card grid doesn't need that: these
            cards are already dark, self-contained photographic tiles, so
            they read as their own visual weight regardless of what's
            behind them. Letting them sit on the site's own light neutral
            instead lets the photography carry the color, the same way
            the reference's own image-forward sections do. */}
        <ClipReveal>
          <section className="bg-background-alt py-16">
            <Container>
              <WorkGrid projects={projects} />
            </Container>
          </section>
        </ClipReveal>

        <ImageBreak
          image="/images/higgsfield-canopy-light.jpg"
          quote="Every one of these projects started in a forest of noise, the same place yours is starting from."
          height="60vh"
        />
      </main>
      <Footer />
    </>
  );
}
