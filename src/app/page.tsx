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

export const metadata: Metadata = {
  title: { absolute: `${site.name} | Brand Strategy for UK Service Businesses` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} | Brand Strategy for UK Service Businesses`,
    description: site.description,
    url: site.url,
    type: "website",
  },
};

// The homepage has no visible FAQ. Describe the page itself instead of
// publishing questions and answers readers cannot find in its content.
const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${site.url}/#webpage`,
  url: site.url,
  name: `${site.name} | Brand Strategy for UK Service Businesses`,
  description: site.description,
  isPartOf: { "@id": `${site.url}/#website` },
  about: { "@id": `${site.url}/#organization` },
  author: { "@id": `${site.url}/#person` },
  inLanguage: "en",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
    </>
  );
}
