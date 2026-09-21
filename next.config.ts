import type { NextConfig } from "next";

// Calendly is the only third-party browser-side runtime. JSON-LD,
// Framer Motion, and the current utility system still require inline
// script/style allowances; the remaining policy is deliberately narrow.
// Next's dev server executes client modules and React Refresh through
// eval(). The policy below has no environment branch, so in `next dev` the
// site's own CSP blocked its own JavaScript: client components never
// hydrated, scroll directors never ran, and the homepage rendered as static
// markup. Production builds need no eval, so the shipped policy is
// unchanged and stays strict; only the dev server relaxes.
const IS_DEV = process.env.NODE_ENV === "development";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${IS_DEV ? " 'unsafe-eval'" : ""} https://assets.calendly.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  // The internal responsive QA surface embeds this site in a same-origin
  // frame. Keeping the allow-list at self + Calendly preserves the existing
  // boundary while making exact-width visual checks possible.
  "frame-src 'self' https://calendly.com",
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
    destination: "/services#proof",
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
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.brandingtatva.com" }],
        destination: "https://brandingtatva.com/:path*",
        permanent: true,
      },
      // The retired production alias carries old shares and bookmarks
      // to the real domain with the path intact. Review and preview
      // hosts stay untouched.
      {
        source: "/:path*",
        has: [{ type: "host", value: "branding-tatva.vercel.app" }],
        destination: "https://brandingtatva.com/:path*",
        permanent: true,
      },
      { source: "/work", destination: "/services#proof", permanent: true },
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
        // Production aliases can serve the same build as the public domain.
        // Keep Vercel hostnames out of search without blocking the custom domain.
        source: "/:path*",
        has: [{ type: "host", value: "(.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
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
