import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SectionJumpNav } from "@/components/SectionJumpNav";
import { CaseStudyExperience } from "@/sections/Work/CaseStudyExperience";
import { CaseStudyMobileNarrativeEnhancer } from "@/sections/Work/MobileNarrativeEnhancers";
import { projects } from "@/data/projects";
import { getWorkTaxonomy } from "@/data/workTaxonomy";
import { getCaseStudyPresentation } from "@/data/caseStudyPresentation";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

function conciseDescription(value: string, maximum = 158) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= maximum) return clean;
  const clipped = clean.slice(0, maximum - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, Math.max(lastSpace, maximum - 24)).replace(/[,:;\s]+$/, "")}…`;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  const taxonomy = getWorkTaxonomy(project.slug);
  const routeType = taxonomy.tier === "flagship" ? "Case Study" : "Project Story";
  const description = conciseDescription(
    `${project.title} ${routeType.toLowerCase()}: ${project.hook ?? project.outcome ?? project.challenge}`,
  );
  const title = `${project.title} ${routeType}`;
  const image = taxonomy.evidencePoster;

  return {
    title,
    description,
    keywords: [
      project.title,
      project.industry,
      taxonomy.evidenceLabel,
      ...project.services,
      "brand strategy case study",
      "Branding Tatva",
      "Suman Sharma",
    ],
    authors: [{ name: site.founder, url: site.url }],
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: `/work/${project.slug}`,
      type: "article",
      images: [{ url: image, alt: `${project.title} evidence diagram` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [image],
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
  const routeType = taxonomy.tier === "flagship" ? "Flagship case study" : "Project story";
  const projectUrl = `${site.url}/work/${project.slug}`;

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
    "@id": `${projectUrl}#project`,
    url: projectUrl,
    mainEntityOfPage: projectUrl,
    name: project.title,
    headline: `${project.title}: ${taxonomy.evidenceLabel}`,
    about: project.industry,
    genre: [routeType, taxonomy.evidenceLabel, ...project.services],
    description: project.challenge,
    abstract: presentation.resultSummary,
    author: { "@id": `${site.url}/#person` },
    creator: { "@id": `${site.url}/#person` },
    publisher: { "@id": `${site.url}/#organization` },
    isPartOf: { "@id": `${site.url}/services#proof` },
    keywords: [project.industry, taxonomy.evidenceLabel, ...project.services],
    image: `${site.url}${taxonomy.evidencePoster}`,
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
      { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
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
          tierLabel={routeType}
          evidenceLabel={taxonomy.evidenceLabel}
          previous={previousEvidence}
          next={nextEvidence}
        />
        <CaseStudyMobileNarrativeEnhancer />
      </main>
      <Footer compact />
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
