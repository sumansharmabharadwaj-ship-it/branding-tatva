import type { NextConfig } from "next";

// The only third-party browser-side resources this site actually loads
// are Calendly's widget script and its iframe (confirmed by grepping
// every https:// literal in src/ — everything else is either a plain
// <a> link, a server-side-only fetch in an API route, or same-origin).
// 'unsafe-inline' stays on script-src/style-src rather than a nonce
// setup: this site's JSON-LD blocks (dangerouslySetInnerHTML, several
// pages) and its heavy use of Framer Motion/GSAP/Tailwind arbitrary
// inline styles would both need a much larger retrofit to run under a
// strict nonce-based policy, and getting that wrong silently breaks
// pages rather than failing loudly — a scoped allowlist is the safer
// tradeoff for this codebase today.
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

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  // The blog became Insights (governing bible's site structure) —
  // permanent redirects preserve every previously indexed URL.
  async redirects() {
    return [
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
