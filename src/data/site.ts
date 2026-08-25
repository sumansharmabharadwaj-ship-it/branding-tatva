// Central site configuration. Edit this file to change copy that appears
// in multiple places (nav, footer, metadata) without hunting through pages.

export const site = {
  name: "Branding Tatva",
  founder: "Suman Sharma",
  heroHeadline: "Most brands are visible. Very few are remembered.",
  tagline: "Essence first. Recognition follows.",
  positioning:
    "Branding Tatva finds the elements that make a business worth noticing, and shapes them into a brand people recognise, trust, and remember.",
  description:
    "Suman Sharma works directly with founders and growing businesses to shape positioning, voice, identity and the systems that turn attention into recognition.",
  url: "https://brandingtatva.com",
  email: "suman@brandingtatva.com",
  phone: {
    display: "+91 84477 25381",
    tel: "+918447725381",
    whatsappUrl:
      "https://wa.me/918447725381?text=Hello%20Suman%2C%20I%27d%20like%20to%20discuss%20my%20brand.",
  },
  consultationMinutes: 30,
  calendlyUrl: "https://calendly.com/suman-brandingtatva",
  social: {
    linkedin: "https://linkedin.com/in/suman-sharma-b6a682232",
    instagram: "https://instagram.com/brandingtatva",
    facebook: "https://facebook.com/brandingtatva",
  },
} as const;

export const consultation = {
  minutes: site.consultationMinutes,
  actionLabel: `Book the ${site.consultationMinutes} minute diagnosis`,
  preparation: "No prepared brief or deck is needed.",
  steps: [
    "Name the question",
    "Receive honest feedback",
    "Choose the clearest next step",
  ],
  fullSteps: [
    "You describe where the brand stands today.",
    "Suman tests the question against positioning, audience, and recognition.",
    "You receive honest feedback and the clearest next step.",
  ],
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Brand Strategy & Systems", href: "/services" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = [
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;
