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
  tagline: "Every memorable brand begins with the right elements.",
  positioning:
    "Branding Tatva finds the elements that make a business worth noticing, and shapes them into a brand people recognise, trust, and remember.",
  description:
    "A personal branding practice led by Suman Sharma, helping founders and existing businesses find clarity, voice, and consistency through an elemental approach to brand strategy.",
  url: "https://brandingtatva.com",
  email: "suman@brandingtatva.com",
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
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;
