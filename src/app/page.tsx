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
import "./home-v4-health.css";
import "./home-v4-insights-depth.css";
import "./home-v4-decision-depth.css";
import "./home-v4-evidence-depth.css";
import "./home-v4-invitation-depth.css";
import "./home-v4-prelude-bridge.css";
import "./home-v4-screen-fit.css";
import "./home-v4-light-refinement.css";
import "./home-v4-wide-screen-repair.css";
import "./home-v4-stability.css";
import "./home-v4-scroll-motion.css";
import "./home-v4-seamless-scenes.css";
import "./home-v4-continuous-fit.css";
import "./home-v4-orbit-redesign.css";
import "./home-v4-restored-motion.css";
import "./home-v4-scene-rhythm.css";
import "./home-v4-process-cinematic.css";
import "./home-v4-audit-refinement.css";
import "./home-v4-legibility-pass.css";
import "./home-v4-tatva-lens.css";
import "./home-v4-evidence-cinematic-final.css";
import "./home-v4-invitation-cinematic-final.css";
import "./home-v4-questions-editorial-final.css";
import "./home-v4-opening-mobile-fit-final.css";
import "./home-v4-tatva-film-final.css";
import "./home-v4-studio-film-final.css";
import "./home-v4-foundation-landscape-final.css";
import "./home-v4-paths-film-final.css";
import "./home-v4-cost-film-final.css";
import "./home-v4-process-final.css";
import "./home-v4-evidence-proof-final.css";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { HomeV4Experience } from "@/sections/HomeV4/HomeV4Experience";
import { site } from "@/data/site";
import { faqs } from "@/data/faqs";

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

export default function Home() {
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
    </>
  );
}
