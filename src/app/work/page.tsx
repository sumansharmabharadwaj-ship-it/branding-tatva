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
import { MobileSystemEvidenceBoard } from "@/sections/Work/MobileSystemEvidenceBoard";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const WORK_URL = `${site.url}/work`;
const PERSON_ID = `${site.url}/#person`;
const ORGANIZATION_ID = `${site.url}/#organization`;
const WORK_DESCRIPTION =
  "Explore founder-led brand strategy case studies spanning positioning, messaging, content systems, campaigns, customer journeys, and measurable performance.";

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${WORK_URL}#collection`,
  url: WORK_URL,
  name: "Work: Brand Strategy Case Studies and Portfolio | Branding Tatva",
  description: WORK_DESCRIPTION,
  author: { "@id": PERSON_ID },
  publisher: { "@id": ORGANIZATION_ID },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Work",
        item: WORK_URL,
      },
    ],
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Branding Tatva client work",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.hook ?? project.challenge,
        url: `${WORK_URL}/${project.slug}`,
        about: project.industry,
        genre: project.services,
        creator: { "@id": PERSON_ID },
        publisher: { "@id": ORGANIZATION_ID },
      },
    })),
  },
};

export const metadata: Metadata = {
  title: "Work: Brand Strategy Case Studies & Portfolio",
  description: WORK_DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work: Brand Strategy Case Studies & Portfolio | Branding Tatva",
    description: WORK_DESCRIPTION,
    url: "/work",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work: Brand Strategy Case Studies & Portfolio | Branding Tatva",
    description: WORK_DESCRIPTION,
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

        {/* Immersion two: system building. A different scroll language
            assembles foundation, content architecture, and rollout. The
            compact work index already carries the shorter engagements, so
            the page can move directly into the second flagship without
            repeating the same three projects at poster scale. */}
        {systemSignature && <SystemFlagship project={systemSignature} />}
        {systemSignature && <MobileSystemEvidenceBoard project={systemSignature} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }} />

        <TexturedDark
          image="/images/work-closing.jpg"
          imagePosition="center 62%"
          overlayGradient="radial-gradient(circle at 18% 14%, rgba(123,151,108,0.28) 0%, transparent 34%), linear-gradient(118deg, rgba(7,21,17,0.94) 0%, rgba(12,31,26,0.9) 48%, rgba(7,16,22,0.95) 100%)"
          className="py-20 sm:py-28 sm:pb-28"
        >
          <ClipReveal>
            <Container className="max-w-6xl">
              <div className="grid gap-10 text-left lg:grid-cols-[minmax(0,1.12fr)_minmax(19rem,0.88fr)] lg:items-end lg:gap-16">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#B9C8AE]">The next decision</p>
                  <h2 className="mt-3 max-w-3xl font-display text-display-md font-normal text-ivory">
                    Bring the part of the brand that no longer makes sense.
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/80 sm:text-lg">
                    The first conversation separates the symptom from the decision: what feels unclear, where the system stops holding together, and what should be solved first.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <LinkButton
                      href="/contact"
                      className="bg-[#65785A] text-[#F6F1E7] hover:bg-[#74896A]"
                    >
                      Discuss the brand problem
                    </LinkButton>
                    <Link href="/services" className="link-underline text-sm font-medium text-[#EEE9DD]">
                      See the service paths <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>

                <aside
                  aria-label="What the first conversation covers"
                  className="rounded-[1.5rem] border border-ivory/20 bg-[#06130F]/75 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-7"
                >
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#AFC19F]">
                    First conversation
                  </p>
                  <ol className="mt-5 space-y-5">
                    {[
                      ["01", "Name what feels unclear", "The page, message, journey, or system that has started to resist the business."],
                      ["02", "Locate where it breaks", "Whether the problem begins in perception, structure, recognition, or conversion."],
                      ["03", "Frame the next decision", "The clearest move to make before commissioning another disconnected output."],
                    ].map(([number, title, description]) => (
                      <li key={number} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-ivory/15 pt-4 first:border-t-0 first:pt-0">
                        <span className="font-display text-lg text-[#9DB18F]">{number}</span>
                        <div>
                          <p className="font-display text-xl font-normal text-ivory">{title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-ivory/65">{description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </aside>
              </div>

              <div className="mt-10 grid gap-3 border-t border-ivory/20 pt-5 text-center text-[0.64rem] uppercase tracking-[0.16em] text-ivory/65 sm:grid-cols-3 lg:text-left">
                <span>Founder-led</span>
                <span>Direct collaboration</span>
                <span>Strategy before output</span>
              </div>
            </Container>
          </ClipReveal>
        </TexturedDark>
      </main>
      <Footer compact />
    </>
  );
}
