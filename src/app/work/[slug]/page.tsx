import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { CaseStudyExperience } from "@/sections/Work/CaseStudyExperience";
import { projects } from "@/data/projects";
import { getWorkTaxonomy } from "@/data/workTaxonomy";
import { getCaseStudyPresentation } from "@/data/caseStudyPresentation";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  const description = project.hook ?? project.outcome ?? project.challenge;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} | ${site.name}`,
      description,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  if (projectIndex < 0) notFound();

  const project = projects[projectIndex];
  if (!project) notFound();

  const previous = projects[(projectIndex - 1 + projects.length) % projects.length] ?? project;
  const next = projects[(projectIndex + 1) % projects.length] ?? project;
  const taxonomy = getWorkTaxonomy(project.slug);
  const presentation = getCaseStudyPresentation(project.slug);

  // The generated or atmospheric context films are not recorded client
  // outputs. Case-study media therefore uses project-specific editorial
  // evidence diagrams built from the verified strategy, execution, and
  // results. Genuine client artefacts can replace these only after they
  // are cleared and labelled in the source data.
  const evidenceProject = {
    ...project,
    heroVideo: undefined,
    cardVideo: undefined,
    cardImage: taxonomy.evidencePoster,
    heroPoster: taxonomy.evidencePoster,
  };
  const previousEvidence = {
    ...previous,
    cardImage: getWorkTaxonomy(previous.slug).evidencePoster,
  };
  const nextEvidence = {
    ...next,
    cardImage: getWorkTaxonomy(next.slug).evidencePoster,
  };

  const caseStudyStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    about: project.industry,
    description: project.challenge,
    abstract: project.hook ?? project.outcome,
    author: { "@id": `${site.url}/#person` },
    creator: { "@id": `${site.url}/#organization` },
    keywords: project.services.join(", "),
    image: `${site.url}${taxonomy.evidencePoster}`,
    url: `${site.url}/work/${project.slug}`,
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Work", item: `${site.url}/work` },
      { "@type": "ListItem", position: 2, name: project.title, item: `${site.url}/work/${project.slug}` },
    ],
  };

  const jumpItems = [
    { href: "#result", label: "Result" },
    { href: "#story", label: "Story" },
    { href: "#system", label: "Evidence" },
    { href: "#outcome-summary", label: "Outcome" },
  ];

  return (
    <>
      <Header transparent />
      <ScrollProgress />
      <main id="main-content">
        <CaseStudyExperience
          project={evidenceProject}
          presentation={presentation}
          tierLabel={taxonomy.tier === "flagship" ? "Flagship case study" : "Project story"}
          evidenceLabel={taxonomy.evidenceLabel}
          previous={previousEvidence}
          next={nextEvidence}
        />
      </main>
      <Footer />
      <SectionJumpNav items={jumpItems} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyStructuredData) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
    </>
  );
}
