import type { NextConfig } from "next";

// Calendly is the only third-party browser-side runtime. JSON-LD,
// Framer Motion, and the current utility system still require inline
// script/style allowances; the remaining policy is deliberately narrow.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "frame-src https://calendly.com",
  "connect-src 'self' https://assets.calendly.com https://calendly.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const LEGACY_INSIGHT_REDIRECTS = [
  {
    slug: "five-elements-working-as-one",
    destination: "/insights/five-element-brand-strategy-framework",
  },
  {
    slug: "visible-versus-remembered",
    destination: "/insights/brand-awareness-vs-brand-recall",
  },
  {
    slug: "what-a-brand-audit-actually-finds",
    destination: "/insights/brand-audit-checklist-before-rebrand",
  },
  {
    slug: "what-brand-positioning-actually-decides",
    destination: "/insights/brand-positioning-strategy-service-businesses",
  },
  {
    slug: "why-visible-brands-stay-forgettable",
    destination: "/insights/why-beautiful-brand-identity-can-be-forgettable",
  },
  {
    slug: "verbal-identity-beyond-tone-of-voice",
    destination: "/insights/brand-voice-guidelines-writers-can-use",
  },
  {
    slug: "when-a-growing-business-needs-repositioning",
    destination: "/insights/reposition-established-service-business-without-losing-recognition",
  },
  {
    slug: "distinctive-assets-and-mental-availability",
    destination: "/insights/distinctive-brand-assets-audit",
  },
  {
    slug: "brand-architecture-for-multiple-offers",
    destination: "/insights/brand-architecture-service-businesses",
  },
  {
    slug: "how-psychology-informs-brand-strategy",
    destination: "/insights/five-element-brand-strategy-framework",
  },
  {
    slug: "how-to-evaluate-a-branding-proposal",
    destination: "/services",
  },
  {
    slug: "category-reframing-a-concept-case-study",
    destination: "/work",
  },
  {
    slug: "pricing-brand-strategy-across-markets",
    destination: "/services",
  },
  {
    slug: "how-to-document-brand-decisions",
    destination: "/insights/brand-consistency-checklist-service-businesses",
  },
  {
    slug: "the-annual-brand-health-review",
    destination: "/insights/brand-audit-checklist-before-rebrand",
  },
] as const;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      ...LEGACY_INSIGHT_REDIRECTS.flatMap(({ slug, destination }) => [
        {
          source: `/blog/${slug}`,
          destination,
          permanent: true,
        },
        {
          source: `/insights/${slug}`,
          destination,
          permanent: true,
        },
      ]),
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
