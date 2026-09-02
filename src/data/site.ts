// Central site configuration. Edit this file to change copy that appears
// in multiple places (nav, footer, metadata) without hunting through pages.

export const site = {
  name: "Branding Tatva",
  founder: "Suman Sharma",
  heroHeadline: "Most brands are visible. Very few are remembered.",
  tagline: "Essence first. Recognition follows.",
  positioning:
    "Branding Tatva finds the reason buyers choose a business, then gives that reason language, identity, and repetition.",
  description:
    "Suman Sharma works directly with founders whose business has outgrown the words, identity, or habits representing it. Positioning, voice, identity, and content are rebuilt around the reason buyers choose.",
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
  preparation: "Bring the question as it stands. No deck is required.",
  steps: [
    "Describe what is no longer working",
    "Test the assumption beneath it",
    "Leave knowing what deserves attention first",
  ],
  fullSteps: [
    "You describe what has changed in the business and what the brand is failing to carry.",
    "Suman tests the question against the buyer, the category, and the evidence already available.",
    "You leave knowing which brand decision deserves attention before the rest.",
  ],
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Meet Your Strategist", href: "/about" },
  { label: "Brand Strategy & Systems", href: "/services" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = [
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;
