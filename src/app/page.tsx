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
