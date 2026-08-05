import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { preload } from "react-dom";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { PricingProvider } from "@/components/PricingProvider";
import { ServicesReframe } from "@/sections/Services/ServicesReframe";
import { REGION_COOKIE, isRegion, regionFromCountry } from "@/data/pricing";
import { offerings, packages } from "@/data/services";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Brand Strategy, Identity, Websites and Content Systems",
  description:
    "Founder-led brand strategy, positioning, identity, website development, content systems, social media direction, and ongoing brand management from Branding Tatva.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Brand Strategy, Identity, Websites and Content Systems | Branding Tatva",
    description:
      "Diagnose where recognition is breaking, choose the right strategic depth, and see how positioning becomes identity, websites, content, and market consistency.",
    url: `${site.url}/services`,
    type: "website",
  },
};

const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Branding Tatva services",
  itemListElement: offerings.map((offering, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: offering.name,
      description: offering.detail,
      provider: {
        "@type": "ProfessionalService",
        name: site.name,
        url: site.url,
      },
    },
  })),
};

const offerStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Branding Tatva starting scopes",
  itemListElement: packages.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Offer",
      name: item.name,
      description: item.description,
      url: `${site.url}/services#packages`,
      availability: "https://schema.org/InStock",
    },
  })),
};

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const savedRegion = cookieStore.get(REGION_COOKIE)?.value;
  const region = isRegion(savedRegion)
    ? savedRegion
    : regionFromCountry(requestHeaders.get("x-vercel-ip-country"));

  preload("/images/pexels-aspen-sunburst-poster.jpg", {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <>
      <Header transparent />
      <main id="main-content">
        <PricingProvider initialRegion={region}>
          <ServicesReframe />
        </PricingProvider>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerStructuredData) }}
      />
    </>
  );
}
