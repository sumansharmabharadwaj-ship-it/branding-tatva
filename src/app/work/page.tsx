import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { elements } from "@/data/elements";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const WORK_URL = `${site.url}/work`;
const PERSON_ID = `${site.url}/#person`;
const ORGANIZATION_ID = `${site.url}/#organization`;
const WORK_DESCRIPTION = "Explore founder-led brand strategy case studies spanning positioning, messaging, content systems, campaigns, customer journeys, and measurable performance.";

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
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Work", item: WORK_URL },
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
  openGraph: { title: "Work: Brand Strategy Case Studies & Portfolio | Branding Tatva", description: WORK_DESCRIPTION, url: "/work", type: "website" },
  twitter: { card: "summary_large_image", title: "Work: Brand Strategy Case Studies & Portfolio | Branding Tatva", description: WORK_DESCRIPTION },
};

const process = [
  { title: "Diagnose", body: "Separate the visible symptom from the strategic decision causing it." },
  { title: "Decide", body: "Commit the position, message, and organising idea before multiplying outputs." },
  { title: "Build", body: "Create the language, touchpoints, content system, and rules that carry the decision." },
] as const;

export default function WorkPage() {
  return (
    <>
      <Header transparent />
      <main id="main-content" className="el-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }} />

        <section className="el-hero" aria-labelledby="work-title">
          <div className="el-hero__media" aria-hidden="true">
            <video autoPlay muted loop playsInline preload="metadata" poster="/images/hero-workhorizon-poster.jpg">
              <source src="/videos/hero-workhorizon.mp4" type="video/mp4" />
            </video>
            <div className="el-hero__veil" />
          </div>
          <div className="el-shell el-hero__content">
            <div className="el-hero__card">
              <p className="el-kicker">Work + services</p>
              <h1 id="work-title" className="el-display" style={{ marginTop: "1rem" }}>The work is the <em>decision made visible.</em></h1>
              <p className="el-lede">Founder-led strategy across positioning, messaging, customer experience, content systems, and brand recognition—with client work clearly separated from independent studies.</p>
              <div className="el-button-row">
                <Link className="el-button" href="#case-studies">See case studies <span aria-hidden="true">↓</span></Link>
                <Link className="el-button el-button--quiet" href="#services">View capabilities</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="el-section el-section--compact" aria-label="Verified work signals">
          <div className="el-shell el-stat-line">
            <div className="el-stat"><strong>104%</strong><span>more followers earned per post in documented work</span></div>
            <div className="el-stat"><strong>365%</strong><span>rise in LinkedIn impressions in one engagement</span></div>
            <div className="el-stat"><strong>16</strong><span>evidence-led pieces across four content formats</span></div>
          </div>
        </section>

        <section id="case-studies" className="el-section el-section--paper-deep" aria-labelledby="case-studies-title">
          <div className="el-shell">
            <div className="el-intro-grid">
              <div>
                <p className="el-kicker">Client work</p>
                <h2 id="case-studies-title" className="el-heading" style={{ marginTop: "1rem" }}>Proof at the depth the evidence can support.</h2>
              </div>
              <p className="el-lede">Each study shows the situation, strategic call, execution, and verified outcome. No borrowed metrics. No concept work presented as a client relationship.</p>
            </div>
            <div className="el-work-grid" style={{ marginTop: "clamp(2.75rem,6vw,5.5rem)" }}>
              {projects.map((project, index) => (
                <Link key={project.slug} href={`/work/${project.slug}`} className={`el-card el-work-card el-work-card--${index % 2 === 0 ? "wide" : "narrow"}`}>
                  <div className="el-work-card__media">
                    <Image src={project.cardImage ?? project.heroPoster ?? "/images/work-closing.jpg"} alt="" fill sizes="(max-width: 760px) 100vw, 60vw" />
                  </div>
                  <div className="el-work-card__copy">
                    <p className="el-kicker">{project.industry}</p>
                    <h3>{project.title}</h3>
                    <p>{project.hook ?? project.challenge}</p>
                    <span className="el-work-card__link">Read the case study <span aria-hidden="true">→</span></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="el-section" aria-labelledby="services-title">
          <div className="el-shell">
            <div className="el-intro-grid">
              <div>
                <p className="el-kicker">Brand strategy &amp; systems</p>
                <h2 id="services-title" className="el-heading" style={{ marginTop: "1rem" }}>Five parts of a brand, designed as one system.</h2>
              </div>
              <div>
                <p className="el-lede">Engagements are scoped around the business condition. The five Tatvas keep every deliverable connected to the same strategic foundation.</p>
                <div className="el-button-row" style={{ marginTop: "1.25rem" }}>
                  <Link className="el-button" href="/contact">Discuss your starting point <span aria-hidden="true">→</span></Link>
                </div>
              </div>
            </div>
            <ol className="el-list" style={{ marginTop: "clamp(2.5rem,6vw,5rem)" }}>
              {elements.map((element, index) => (
                <li key={element.slug}>
                  <span className="el-list__number">0{index + 1}</span>
                  <div>
                    <h3>{element.name}</h3>
                    <p style={{ marginTop: ".65rem" }}>{element.meaning}</p>
                  </div>
                  <p>{element.services.join(" · ")}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="el-section el-section--mist" aria-labelledby="process-title">
          <div className="el-shell">
            <div className="el-intro-grid">
              <div>
                <p className="el-kicker">A simpler process</p>
                <h2 id="process-title" className="el-heading" style={{ marginTop: "1rem" }}>Three movements. No theatre for theatre&apos;s sake.</h2>
              </div>
              <p className="el-lede">The engagement is paced around decisions and evidence. You always know what is being decided, why it matters, and what changes next.</p>
            </div>
            <ol className="el-list" style={{ marginTop: "clamp(2.5rem,6vw,5rem)" }}>
              {process.map((item, index) => (
                <li key={item.title}>
                  <span className="el-list__number">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="el-footer-cta" aria-labelledby="work-cta-title">
          <video autoPlay muted loop playsInline preload="metadata" poster="/images/pixabay-golden-forest-glow-poster.jpg" aria-hidden="true">
            <source src="/videos/pixabay-golden-forest-glow.mp4" type="video/mp4" />
          </video>
          <div className="el-footer-cta__copy">
            <p className="el-kicker">The next decision</p>
            <h2 id="work-cta-title" style={{ marginTop: "1rem" }}>Bring the part of the brand that no longer makes sense.</h2>
            <p>The first conversation identifies the condition, separates the symptom from the cause, and finds the smallest useful place to begin.</p>
            <div className="el-button-row">
              <Link className="el-button el-button--paper" href="/contact">Book a strategy session <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
