import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import "./home-earth-tones.css";
import "./home-audit-fixes.css";
import { PageLoadVeil } from "@/components/PageLoadVeil";
import { AmbientAudio } from "@/components/AmbientAudio";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Analytics } from "@vercel/analytics/next";
import { VideoWarden } from "@/components/VideoWarden";
import { MotionPreferenceProvider } from "@/components/MotionPreference";
import { ChapterLadder } from "@/sections/Home/ChapterLadder";
import { HomeFilmConstellation } from "@/sections/Home/HomeFilmConstellation";
import { HomeAutoJourney } from "@/sections/Home/HomeAutoJourney";
import { HomeChapterDirector } from "@/sections/Home/HomeChapterDirector";
import { HomeVideoHeartbeat } from "@/sections/Home/HomeVideoHeartbeat";
import { site } from "@/data/site";

const displayFont = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display", display: "swap" });
const bodyFont = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: Brand Strategy by ${site.founder}`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: { title: site.name, description: site.description, url: site.url, siteName: site.name, type: "website", locale: "en_US", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: site.name, description: site.description, images: ["/opengraph-image"] },
};

export const viewport: Viewport = { themeColor: "#27221E", width: "device-width", initialScale: 1 };
const PERSON_ID = `${site.url}/#person`;
const ORG_ID = `${site.url}/#organization`;
const SOCIAL_LINKS = [site.social.linkedin, site.social.instagram, site.social.facebook].filter(Boolean);
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Person", "@id": PERSON_ID, name: site.founder, url: site.url, jobTitle: "Brand Strategist", knowsAbout: ["Brand positioning", "Verbal identity", "Brand recognition", "Brand architecture", "Distinctive brand assets", "Consumer psychology"], sameAs: SOCIAL_LINKS },
    { "@type": "ProfessionalService", "@id": ORG_ID, name: site.name, founder: { "@id": PERSON_ID }, url: site.url, description: site.description, areaServed: [{ "@type": "Country", name: "United States" }, { "@type": "Country", name: "United Kingdom" }, { "@type": "Country", name: "Canada" }, { "@type": "Country", name: "India" }, "Remote / Worldwide"], image: `${site.url}/opengraph-image`, logo: `${site.url}/opengraph-image`, sameAs: SOCIAL_LINKS },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div className="gradient-mesh" aria-hidden="true" />
        <div className="paper-grain" aria-hidden="true" />
        <SmoothScrollProvider>
          <MotionPreferenceProvider>
            {children}
            <HomeFilmConstellation />
            <HomeChapterDirector />
            <HomeAutoJourney />
            <HomeVideoHeartbeat />
            <ChapterLadder />
          </MotionPreferenceProvider>
        </SmoothScrollProvider>
        <PageLoadVeil />
        <AmbientAudio />
        <VideoWarden />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
