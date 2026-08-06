import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { Container } from "@/components/Container";
import { ClipReveal } from "@/components/ClipReveal";
import { TexturedDark } from "@/components/TexturedDark";
import { LinkButton } from "@/components/Button";
import { ContextualCTA } from "@/components/conversion/ContextualCTA";
import { WorkOpening } from "@/sections/Work/WorkOpening";
import { WorkProofStrip } from "@/sections/Work/WorkProofStrip";
import { WorkIndex } from "@/sections/Work/WorkIndex";
import { SignatureProject } from "@/sections/Work/SignatureProject";
import { SystemFlagship } from "@/sections/Work/SystemFlagship";
import { ProjectStoryWall } from "@/sections/Work/ProjectStoryWall";
import { DecisionEvidenceGallery } from "@/sections/Work/DecisionEvidenceGallery";
import { CapabilityMap } from "@/sections/Work/CapabilityMap";
import { TatvaLab } from "@/sections/Work/TatvaLab";
import { Authorship } from "@/sections/Work/Authorship";
import { BrandStudies } from "@/sections/CaseStudies/BrandStudies";
import { brandStudies } from "@/data/brandStudies";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const studiesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Brand studies",
  description:
    "Independent brand strategy analyses of renowned brands, written as teaching. No client relationship with the brands analyzed.",
  itemListElement: brandStudies.map((study, index) => ({
    "@type": "ListItem",
    position: index + 1,
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
    "A living archive of brand strategy work: positioning, verbal identity, and recognition built for real clients, plus clearly labelled concept work and independent brand studies.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | Branding Tatva",
    description:
      "A living archive of brand strategy work: positioning, verbal identity, and recognition built for real clients, plus clearly labelled concept work and independent brand studies.",
    type: "website",
  },
};

export default function WorkPage() {
  const performanceSignature = projects.find((project) => project.slug === "dr-haley-nutrition");
  const systemSignature = projects.find((project) => project.slug === "myshopineurope");

  return (
    <>
      <Header />
      <main id="main-content" style={{ backgroundColor: "#F2F0E8" }}>
        {/* Overview: immediate proposition, genuine project montage,
            then a compact evidence line before any explanatory layer. */}
        <WorkOpening />
        <WorkProofStrip projects={projects} />

        {/* Scan: buyer-problem filters establish relevance before the
            page asks for a long read. */}
        <WorkIndex projects={projects} />

        {/* Immersion one: measured performance. The project's own frame
            regains colour as the evidence resolves. */}
        {performanceSignature && <SignatureProject project={performanceSignature} />}
        <ContextualCTA
          eyebrow="A similar pattern"
          heading="Posting more, but earning less attention?"
          href="/contact"
          label="Discuss the pattern"
          event="contextual_cta_clicked"
          eventProps={{ source: "work_performance_signature" }}
        />

        {/* A faster middle tier resets the viewing mode before the next
            long sticky chapter. Three focused engagements receive real
            context and proportionate depth without becoming miniature
            versions of the flagship above. */}
        <ProjectStoryWall projects={projects} />

        {/* Immersion two: system building. A different scroll language
            assembles foundation, content architecture, and rollout. The
            project-story wall above prevents two long sticky narratives
            from sitting directly beside one another. */}
        {systemSignature && <SystemFlagship project={systemSignature} />}

        {/* Tier three: real decisions shown at artefact scale. The
            fragments demonstrate breadth without turning every small
            decision into a theatrical case study. */}
        <DecisionEvidenceGallery />

        {/* Relevance: after seeing the record, the visitor can name the
            condition they are trying to change and reach the closest
            project evidence and service path. */}
        <CapabilityMap />

        {/* Wider practice: concept work and public-record analysis are
            deliberately separated from client engagements so neither
            borrows credibility from the other. */}
        <TatvaLab />
        <BrandStudies />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(studiesJsonLd) }} />

        <Authorship />

        <TexturedDark image="/images/work-closing.jpg" className="py-20 text-center sm:py-28 sm:pb-28">
          <ClipReveal>
            <Container>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ivory/70">The next decision</p>
              <h2 className="mx-auto mt-3 max-w-3xl font-display text-display-md font-normal text-ivory">
                Bring the part of the brand that no longer makes sense.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-ivory/80">
                The first conversation identifies the decision underneath the deliverable, whether the problem is clarity, recognition, conversion, or a system that has stopped holding together.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
                <LinkButton href="/contact">Discuss the brand problem</LinkButton>
                <Link href="/services" className="link-underline text-sm font-medium text-ivory">
                  See the service paths <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="mx-auto mt-9 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 border-t border-ivory/20 pt-5 text-[0.64rem] uppercase tracking-[0.16em] text-ivory/60">
                <span>Founder-led</span>
                <span>Direct collaboration</span>
                <span>Strategy before output</span>
              </div>
            </Container>
          </ClipReveal>
        </TexturedDark>
      </main>
      <Footer />
    </>
  );
}
