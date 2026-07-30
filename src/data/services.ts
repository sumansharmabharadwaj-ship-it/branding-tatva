export type ServiceGroup = {
  slug: string;
  name: string;
  forWho: string;
  description: string;
  includes: string[];
  color: string;
};

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
  proofSlug?: string; // links to a real case study in projects.ts as evidence
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
      "Everything in Foundation, plus a full audit, repositioning, and the creative direction to carry it across every channel.",
    includes: [
      "Everything in Foundation",
      "Full brand audit & repositioning",
      "Voice & messaging alignment across channels",
      "Campaign concept & creative direction",
      "Website content structure",
      "3 months of async support",
    ],
    color: "#24394D", // indigo — Water
    popular: true,
    proofSlug: "dr-haley-nutrition",
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
      "Quarterly strategy check-in",
    ],
    color: "#AD6F5C", // rose-earth — Space
    proofSlug: "herbalcart",
  },
];

// Plain-language list, no elemental framing. Sits above the deeper
// elemental breakdown so a first-time visitor gets a clear answer to
// "what do you actually do" in one glance. Each card carries a distinct
// accent from the earthy palette (including sage green, previously
// under-used) rather than repeating one color six times.
export const offerings: Offering[] = [
  {
    name: "Brand Strategy & Identity",
    detail: "Positioning, naming direction, and the visual system that carries it.",
    color: "#B85A34", // clay
  },
  {
    name: "Content Strategy",
    detail: "A plan for what gets said, where, and in what order, before a single post goes out.",
    color: "#24394D", // indigo
  },
  {
    name: "Social Media Marketing",
    detail: "Ongoing management, growth, and campaign execution across the platforms that matter to your audience.",
    color: "#5C6B4A", // sage
  },
  {
    name: "Website Development",
    detail: "A site built to carry the brand consistently, beyond just a template with your logo dropped in.",
    color: "#C28A28", // ochre
  },
  {
    name: "Content Creation",
    detail: "Writing, scripts, and copy built in your actual voice, ahead of a generic template tone.",
    color: "#AD6F5C", // rose-earth
  },
  {
    name: "Marketing Strategy",
    detail: "The plan connecting content and campaigns to a real business outcome, beyond just activity.",
    color: "#CD7A4C", // terracotta
  },
];

// Organised by client need, per PROJECT_PLAN.md. Pricing intentionally
// omitted until Suman approves an approach — see BRAND_STRATEGY open items.
export const serviceGroups: ServiceGroup[] = [
  {
    slug: "brand-beginning",
    name: "Brand Beginning",
    forWho: "For founders and businesses starting with an idea, before anything is built.",
    description:
      "Before a website or a logo, a brand needs to know what it believes, who it's for, and why it matters. I call this the Earth work, done first so nothing built afterward has to guess.",
    includes: [
      "Brand discovery and positioning",
      "Audience definition",
      "Purpose and values",
      "Launch messaging direction",
    ],
    color: "#B85A34", // clay — Earth
  },
  {
    slug: "brand-clarity",
    name: "Brand Clarity",
    forWho: "For existing brands that feel unclear, inconsistent, or hard to explain in one sentence.",
    description:
      "Usually the real problem is that the story fails to hold together across channels, rather than visibility itself. I find the disagreement between how a brand looks, sounds, and actually behaves, and resolve it.",
    includes: [
      "Brand audit",
      "Repositioning",
      "Voice and messaging alignment",
      "Content structure",
    ],
    color: "#24394D", // indigo — Water
  },
  {
    slug: "brand-elevation",
    name: "Brand Elevation",
    forWho: "For established brands ready for stronger recognition and sharper creative direction.",
    description:
      "For a brand with a working foundation that needs its expression to catch up, I build campaigns, creative direction, and content meant to earn attention on purpose rather than by accident.",
    includes: [
      "Creative direction",
      "Campaign concepts",
      "Content strategy",
      "Launch communication",
    ],
    color: "#C28A28", // ochre — Fire
  },
  {
    slug: "brand-presence",
    name: "Brand Presence",
    forWho: "For brands that need ongoing content, consistency, and someone watching the whole system.",
    description:
      "I build recognition month over month, through sustained content and consistency work, rather than a single campaign. It shows up as steady growth rather than a spike.",
    includes: [
      "Ongoing content management",
      "Consistency frameworks",
      "Performance review and adjustment",
    ],
    color: "#AD6F5C", // rose-earth — Space
  },
];
