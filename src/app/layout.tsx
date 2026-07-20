import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { DeferredCursor } from "@/components/DeferredCursor";
import { PageLoadVeil } from "@/components/PageLoadVeil";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { site } from "@/data/site";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
};

// Structured data — verified facts only. No aggregateRating/review markup
// since no real testimonials exist yet (per brief: never fake reviews).
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: site.founder,
      url: site.url,
      jobTitle: "Brand Strategist",
      sameAs: [site.social.linkedin].filter(Boolean),
    },
    {
      "@type": "ProfessionalService",
      name: site.name,
      founder: site.founder,
      url: site.url,
      description: site.description,
      areaServed: "Remote / Worldwide",
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
