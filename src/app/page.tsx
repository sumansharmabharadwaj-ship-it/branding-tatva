import type { Metadata } from "next";
import "./home-v4.css";
import "./home-v4-geometry.css";
import "./home-v4-controls.css";
import "./home-v4-controls-final.css";
import "./home-studio-cinematic.css";
import "./home-paths-cinematic.css";
import "./home-cinematic-finish.css";
import "./home-final-polish.css";
import "./home-v4-continuity.css";
import "./home-v4-guided-motion.css";
import "./home-v4-recognition-depth.css";
import "./home-v4-living-type.css";
import "./home-v4-paths-depth.css";
import "./home-v4-mobile-polish.css";
import "./home-v4-tatva-depth.css";
import "./home-v4-tatva-mobile-fix.css";
import "./home-v4-studio-depth.css";
import "./home-v4-studio-portrait-fix.css";
import "./home-v4-decision-depth.css";
import "./home-v4-evidence-depth.css";
import "./home-v4-invitation-depth.css";
import "./home-v4-prelude-bridge.css";
import "./home-v4-screen-fit.css";
import "./home-v4-refinement.css";
import "./home-v4-forward-motion.css";
import "./home-v4-scene-rhythm.css";
import "./home-v4-evidence-scroll.css";
import "./home-v4-studio-scroll.css";
// The brand health check's stylesheet was orphaned alongside the component
// itself: 127 .brand-orbit rules imported by nothing. Mounting the quiz
// without this gives an unstyled chapter, so the two belong together.
import "./home-v4-orbit-redesign.css";
import "./home-v4-gradient-motion.css";
import { preload } from "react-dom";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { HomeV4Experience } from "@/sections/HomeV4/HomeV4Experience";
import { site } from "@/data/site";
import { faqs } from "@/data/faqs";
import { entityFacts } from "@/data/entityFacts";

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

/* The home page's own node in the graph the root layout already
 * publishes (WebSite, Person, Organization, by @id). Answer engines and
 * assistants read this page far more often than any inner page, so the
 * node states plainly what the page is, who it belongs to, and which
 * sentences answer the visitor's first question (the speakable pair is
 * the hero headline and lede, the two strings written to stand alone).
 * The Service node describes the practice's actual offer in the terms
 * entityFacts already bounds — no outcomes, prices, or ratings appear
 * here because none are verified for display. */
const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${site.url}/#webpage`,
      url: site.url,
      name: `${site.name}: Brand Strategy by ${site.founder}`,
      description: site.description,
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": `${site.url}/#organization` },
      inLanguage: "en",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#home-v4-opening-title", ".home-v4-opening__lede"],
      },
    },
    {
      "@type": "Service",
      "@id": `${site.url}/#service`,
      name: "Brand strategy, verbal identity, and brand systems",
      serviceType: "Brand strategy consultancy",
      description: site.positioning,
      provider: { "@id": `${site.url}/#organization` },
      areaServed: entityFacts.delivery.regions.map((name) => ({
        "@type": "Country",
        name,
      })),
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${site.url}/contact`,
        availableLanguage: "English",
      },
    },
  ],
};

export default function Home() {
  /* The hero poster is this page's LCP element, and without a preload the
     browser only discovers it once the parser reaches a <video poster>
     attribute deep inside the opening scene. A head preload with high
     priority starts the 193KB fetch alongside the document instead of
     after it — the same pattern Contact used before its rebuild. */
  preload("/images/hero-forest-sanctuary-poster.jpg", { as: "image", fetchPriority: "high" });
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <HomeV4Experience />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
    </>
  );
}
