import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
// The shared scene system. Registered globally rather than per page, because
// the whole point is that every page speaks the same interaction language.
import "./bt-scene.css";
import "./visualizer.css";
import "./sun-cursor.css";
import "./august-8-refinement.css";
import { AmbientAudio } from "@/components/AmbientAudio";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ConsentManager } from "@/components/ConsentManager";
import { VideoWarden } from "@/components/VideoWarden";
import { MotionPreferenceProvider } from "@/components/MotionPreference";
import { SparkCursor } from "@/components/SparkCursor";
import { entityFacts } from "@/data/entityFacts";
import { site } from "@/data/site";
import { searchRobotsMetadata } from "@/lib/searchVisibility";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: Brand Strategy by ${site.founder}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  robots: searchRobotsMetadata(),
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#eee7db",
  width: "device-width",
  initialScale: 1,
};

const PERSON_ID = `${site.url}/#person`;
const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;
const SOCIAL_LINKS = [
  site.social.linkedin,
  site.social.instagram,
  site.social.facebook,
].filter(Boolean);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // The site itself, so every page node has something real to declare
      // itself part of rather than floating loose in the graph.
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: entityFacts.founder.name,
      url: entityFacts.founder.profileUrl,
      jobTitle: entityFacts.founder.role,
      knowsAbout: entityFacts.knowledgeAreas,
      sameAs: SOCIAL_LINKS,
    },
    {
      // Organization is truthful for a remote solo practice without implying
      // a verified local office, opening hours or map presence.
      "@type": "Organization",
      "@id": ORG_ID,
      name: entityFacts.practice.name,
      founder: { "@id": PERSON_ID },
      url: entityFacts.practice.url,
      description: entityFacts.practice.description,
      areaServed: entityFacts.delivery.regions.map((name) => ({
        "@type": "Country",
        name,
      })),
      knowsAbout: entityFacts.knowledgeAreas,
      image: `${site.url}/opengraph-image`,
      logo: `${site.url}/opengraph-image`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "project enquiries",
        email: site.email,
        telephone: site.phone.tel,
        availableLanguage: "English",
      },
      sameAs: SOCIAL_LINKS,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="august-8-refined">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="gradient-mesh" aria-hidden="true" />
        <div className="paper-grain" aria-hidden="true" />

        <SmoothScrollProvider>
          <MotionPreferenceProvider>
            {children}
            <SparkCursor />
          </MotionPreferenceProvider>
        </SmoothScrollProvider>

        <AmbientAudio />
        <VideoWarden />
        {/* Measurement lives behind consent now. It used to mount here
            directly, which counted every visitor before anyone was asked. */}
        <ConsentManager />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
