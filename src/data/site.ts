// Central site configuration. Edit this file to change copy that appears
// in multiple places (nav, footer, metadata) without hunting through pages.
//
// NOTE: positioning below is provisional — see BRAND_STRATEGY.md for the
// five options. Update `positioning` once Suman confirms a final direction.

export const site = {
  name: "Branding Tatva",
  founder: "Suman Sharma",
  // See HERO_HEADLINES.md for five alternatives and the reasoning behind
  // this pairing (option B for hook, A for resolution).
  heroHeadline: "Most brands are visible. Very few are remembered.",
  tagline: "Essence first. Recognition follows.",
  positioning:
    "Branding Tatva finds the elements that make a business worth noticing, and shapes them into a brand people recognise, trust, and remember.",
  description:
    "Most brands are visible and still go unnoticed. Suman Sharma works with founders and existing businesses on positioning, voice, and the consistency that turns attention into recognition.",
  url: "https://brandingtatva.com",
  email: "suman@brandingtatva.com",
  calendlyUrl: "https://calendly.com/suman-brandingtatva",
  social: {
    linkedin: "https://linkedin.com/in/suman-sharma-b6a682232",
    instagram: "https://instagram.com/brandingtatva",
    facebook: "https://facebook.com/brandingtatva",
  },
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

// Glossary sits here rather than in the main nav: twelve definition
// pages had exactly two inbound links sitewide, both breadcrumbs from
// their own children, which made the most quotable content on the site
// a near orphan. The footer renders on all thirteen routes, so this
// gives every page an entry point without crowding the nav.
export const footerLinks = [
  { label: "Glossary", href: "/glossary" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;
