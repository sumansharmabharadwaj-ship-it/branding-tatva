import type { NextConfig } from "next";

// The only third-party browser-side resources this site actually loads
// are Calendly's widget script and its iframe. 'unsafe-inline' stays on
// script-src/style-src because the site uses JSON-LD blocks and motion
// libraries that currently rely on inline styles.
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
  async redirects() {
    return [
      // The blog became Insights. Permanent redirects preserve indexed URLs.
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },

      // The original homepage MP4 exports use a codec that is not consistently
      // decoded by Chromium. Keep their public URLs alive while serving the
      // lightweight VP9 loops produced for the rebuilt homepage.
      {
        source: "/videos/hero-forest-sanctuary.mp4",
        destination: "/videos/home-reframe-hero.webm",
        permanent: false,
      },
      {
        source: "/videos/pexels-river-dawn.mp4",
        destination: "/videos/home-reframe-framework.webm",
        permanent: false,
      },
      {
        source: "/videos/higgsfield-silver-tide.mp4",
        destination: "/videos/home-reframe-invitation.webm",
        permanent: false,
      },
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
