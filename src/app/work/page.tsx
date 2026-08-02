import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { ClipReveal } from "@/components/ClipReveal";
import { TexturedDark } from "@/components/TexturedDark";
import { LinkButton } from "@/components/Button";
import { ScrollProgress } from "@/components/ScrollProgress";
import { WorkOpening } from "@/sections/Work/WorkOpening";
import { WorkIndex } from "@/sections/Work/WorkIndex";
import { CapabilityMap } from "@/sections/Work/CapabilityMap";
import { ContextualCTA } from "@/components/conversion/ContextualCTA";
import { SignatureProject } from "@/sections/Work/SignatureProject";
import { DecisionMap } from "@/sections/Work/DecisionMap";
import { WorkArchive } from "@/sections/Work/WorkArchive";
import { Authorship } from "@/sections/Work/Authorship";
import { BrandStudies } from "@/sections/CaseStudies/BrandStudies";
import { brandStudies } from "@/data/brandStudies";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

// Work Page 2.0 — rebuilt per the interactive design handoff: a living
// editorial archive instead of a portfolio grid. The page unfolds as
// proof, depth, range, authorship, and invitation: opening proposition
// (cream, line by line reveal, real project material as the visual) →
// contents index with a live preview surface → the signature project
// as a six beat evidence narrative (sticky media, color returning as
// the story resolves) → the decision map (five questions, five real
// projects) → the archive ledger → the brand studies teaching layer →
// authorship → consultation. Every visible number and sentence traces
// to data/projects.ts; the palette is the handoff's own token table
// (sections/Work/palette.ts).

// AEO/GEO: the brand studies as structured data, so search and answer
// engines can cite each dissection individually. Articles, deliberately
// never CaseStudy/Service types — these are independent analyses of the
// public record, and the schema must say so as clearly as the page copy.
const studiesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Brand studies",
  description:
    "Independent brand strategy analyses of renowned brands, written as teaching. No client relationship with the brands analyzed.",
  itemListElement: brandStudies.map((study, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Article",
      headline: `${study.brand}: ${study.lens}`,
      about: study.brand,
      abstract: study.premise,
      url: `${site.url}/work`,
    },
  })),
};

export const metadata: Metadata = {
  title: "Work",
  description:
    "A living archive of brand strategy work: positioning, verbal identity, and recognition built for real clients, plus independent brand studies of Coca Cola, Apple, Nike, Burberry and Tim Hortons.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | Branding Tatva",
    description:
      "A living archive of brand strategy work: positioning, verbal identity, and recognition built for real clients, plus independent brand studies of Coca Cola, Apple, Nike, Burberry and Tim Hortons.",
    type: "website",
  },
};

export default function WorkPage() {
  const signature = projects.find((p) => p.slug === "dr-haley-nutrition");
  return (
    <>
      <Header />
      <ScrollProgress />
      <main id="main-content" style={{ backgroundColor: "#F2F0E8" }}>
        <WorkOpening />
        <CapabilityMap />
        <ContextualCTA
          eyebrow="Medium step"
          heading="See the full archive of decisions."
          href="#index"
          label="Explore selected work"
          event="contextual_cta_clicked"
          eventProps={{ source: "work_capability_map" }}
        />
        <WorkIndex projects={projects} />
        {signature && <SignatureProject project={signature} />}
        <DecisionMap />
        <WorkArchive projects={projects} />

        {/* Brand studies — the teaching layer beneath the client record.
            Independent dissections of renowned US, UK and Canadian
            brands, framed explicitly as analyses of the public record
            so no visitor can mistake them for engagements. */}
        <BrandStudies />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(studiesJsonLd) }} />

        <Authorship />

        {/* Invitation — quiet material reflection as the final frame
            (work-closing.jpg: the forest path regraded this round into
            the page's own cool green register), one consultation path. */}
        <TexturedDark image="/images/work-closing.jpg" className="py-24 text-center sm:pb-28">
          <ClipReveal>
            <Container>
              <h2 className="text-display-md font-display font-normal text-ivory">
                The next decision on record could be yours.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-ivory/85">
                Every engagement in this archive started with a conversation about where the brand actually stood.
              </p>
              <div className="mt-8">
                <LinkButton href="/contact">Book Your Own Strategy Session</LinkButton>
              </div>
            </Container>
          </ClipReveal>
        </TexturedDark>
      </main>
      <Footer />
    </>
  );
}
