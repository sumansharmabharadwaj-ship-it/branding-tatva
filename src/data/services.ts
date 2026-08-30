export type Offering = {
  name: string;
  detail: string;
  color: string;
};

export type Package = {
  slug: string;
  name: string;
  forWho: string;
  // "one-time" prices are a flat project fee; "monthly" is an ongoing
  // retainer starting price — kept as separate fields rather than a
  // single formatted string so the page can render "from" and "/mo"
  // consistently instead of parsing it back out of text.
  price: number;
  billing: "one-time" | "monthly";
  description: string;
  includes: string[];
  color: string;
  popular?: boolean;
};

// GBP, aimed at the UK solo-consultant/boutique market specifically
// (per direct request) rather than a generic USD figure — these are a
// first draft grounded in typical UK freelance brand-strategy rates,
// not confirmed real prices. Flagged for Suman to review and adjust
// before treating them as final; nothing here should be read as
// already-agreed pricing.
export const packages: Package[] = [
  {
    slug: "brand-beginning",
    name: "Foundation",
    forWho: "For founders starting with an idea, before anything is built.",
    price: 1850,
    billing: "one-time",
    description:
      "The Earth work, done first: what the brand believes, who it's for, and why it matters, so nothing built afterward has to guess.",
    includes: [
      "Brand discovery & positioning workshop",
      "Audience & purpose definition",
      "Core visual identity (logo, colour, type system)",
      "Brand guidelines starter document",
      "Launch messaging direction",
    ],
    color: "#B85A34", // clay — Earth
  },
  {
    slug: "brand-clarity",
    name: "Full Brand System",
    forWho: "For existing brands that feel unclear, inconsistent, or hard to explain in one sentence.",
    price: 4200,
    billing: "one-time",
    description:
      "Everything in Foundation, plus a full audit, repositioning, and the visual direction to carry it across every channel.",
    includes: [
      "Everything in Foundation",
      "Full brand audit & repositioning",
      "Voice & messaging alignment across channels",
      "Campaign concept & visual direction",
      "Website content structure",
      "3 months of async support",
    ],
    color: "#24394D", // indigo — Water
    popular: true,
  },
  {
    slug: "brand-partnership",
    name: "Brand Partnership",
    forWho: "For brands that need ongoing content, consistency, and someone watching the whole system.",
    price: 950,
    billing: "monthly",
    description:
      "Recognition built month over month through sustained content and consistency work, rather than a single campaign.",
    includes: [
      "Ongoing content management",
      "Monthly consistency review",
      "Performance tracking & adjustment",
      "Priority access",
      "Quarterly strategy review",
    ],
    color: "#AD6F5C", // rose-earth — Space
  },
];

// Plain-language list, no elemental framing. Sits above the deeper
// elemental breakdown so a first-time visitor gets a clear answer to
// "what do you actually do" in one glance. Each card carries a distinct
// accent from the earthy palette (including sage green, previously
// under-used) rather than repeating one color six times.
// Detail lines sharpened from neutral service descriptions into actual
// positions — direct feedback that the site's copy read as safe/
// consensus rather than opinionated, the register the reference sites
// operate in.
export const offerings: Offering[] = [
  {
    name: "Brand Strategy & Identity",
    detail: "Positioning decided before a single pixel exists. The identity system, the actual architecture, carries that decision forward, always second, never the source of it.",
    color: "#B85A34", // clay
  },
  {
    name: "Content Strategy",
    detail: "A messaging framework decided before the first post goes out. Real planning, well ahead of improvising one caption at a time.",
    color: "#24394D", // indigo
  },
  {
    name: "Social Media Marketing",
    detail: "Recall that compounds because the positioning underneath it stays consistent, mental availability building post by post, far more than posting volume alone.",
    color: "#5C6B4A", // sage
  },
  {
    name: "Website Development",
    detail: "The most visited stop on a customer's whole journey through a brand, and often its most overlooked one. Built to carry the position, far beyond hosting a logo.",
    color: "#C28A28", // ochre
  },
  {
    name: "Content Creation",
    detail: "Written in the verbal identity the strategy actually defined. A specific tone of voice, distinct from any generic one with the name swapped in.",
    color: "#AD6F5C", // rose-earth
  },
  {
    name: "Marketing Strategy",
    detail: "Marketing amplifies a value proposition that already exists. This is where the two finally connect, working together instead of running in parallel.",
    color: "#CD7A4C", // terracotta
  },
];
