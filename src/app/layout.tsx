import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { DeferredCursor } from "@/components/DeferredCursor";
import { PageLoadVeil } from "@/components/PageLoadVeil";
import { AmbientAudio } from "@/components/AmbientAudio";
import { PrecisionMark } from "@/components/PrecisionMark";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { site } from "@/data/site";

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
  robots: {
    index: process.env.VERCEL_ENV !== "preview",
    follow: process.env.VERCEL_ENV !== "preview",
    googleBot: {
      index: process.env.VERCEL_ENV !== "preview",
      follow: process.env.VERCEL_ENV !== "preview",
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    // Reuses the opengraph-image.tsx/twitter-image.tsx route convention
    // already generating a real image at build time — this makes that
    // explicit instead of relying on Next's implicit file-convention
    // pickup alone.
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
  themeColor: "#27221E",
  width: "device-width",
  initialScale: 1,
};

// Structured data — verified facts only. No aggregateRating/review markup
// since no real testimonials exist yet (per brief: never fake reviews).
// Stable entity IDs let every page reference one organization, website,
// and founder profile without duplicating or weakening the fact pattern.
const PERSON_ID = `${site.url}/about/#person`;
const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;
const SOCIAL_LINKS = [site.social.linkedin, site.social.instagram, site.social.facebook].filter(Boolean);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: site.name,
      url: site.url,
      description: site.description,
      founder: { "@id": PERSON_ID },
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/images/branding-tatva-tatva-mark.png`,
        width: 1254,
        height: 1254,
      },
      sameAs: SOCIAL_LINKS,
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: site.name,
      url: site.url,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="gradient-mesh" aria-hidden="true" />
        <div className="paper-grain" aria-hidden="true" />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <DeferredCursor />
        <PageLoadVeil />
        <AmbientAudio />
        <PrecisionMark />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
