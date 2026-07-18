export type ServiceGroup = {
  slug: string;
  name: string;
  forWho: string;
  description: string;
  includes: string[];
};

export type Offering = {
  name: string;
  detail: string;
  color: string;
};

// Plain-language list, no elemental framing. Sits above the deeper
// elemental breakdown so a first-time visitor gets a clear answer to
// "what do you actually do" in one glance. Each card carries a distinct
// accent from the earthy palette (including sage green, previously
// under-used) rather than repeating one color six times.
export const offerings: Offering[] = [
  {
    name: "Brand Strategy & Identity",
    detail: "Positioning, naming direction, and the visual system that carries it.",
    color: "#A65F46", // clay
  },
  {
    name: "Content Strategy",
    detail: "A plan for what gets said, where, and in what order, before a single post goes out.",
    color: "#31485A", // indigo
  },
  {
    name: "Social Media Marketing",
    detail: "Ongoing management, growth, and campaign execution across the platforms that matter to your audience.",
    color: "#79816D", // sage
  },
  {
    name: "Website Development",
    detail: "A site built to carry the brand consistently, beyond just a template with your logo dropped in.",
    color: "#C9953D", // ochre
  },
  {
    name: "Content Creation",
    detail: "Writing, scripts, and copy built in your actual voice, ahead of a generic template tone.",
    color: "#B98278", // rose-earth
  },
  {
    name: "Marketing Strategy",
    detail: "The plan connecting content and campaigns to a real business outcome, beyond just activity.",
    color: "#C58267", // terracotta
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
      "Before a website or a logo, a brand needs to know what it believes, who it's for, and why it matters. This is the foundation work, called Earth, done first so nothing built afterward has to guess.",
    includes: [
      "Brand discovery and positioning",
      "Audience definition",
      "Purpose and values",
      "Launch messaging direction",
    ],
  },
  {
    slug: "brand-clarity",
    name: "Brand Clarity",
    forWho: "For existing brands that feel unclear, inconsistent, or hard to explain in one sentence.",
    description:
      "Usually the real problem is that the story fails to hold together across channels, rather than visibility itself. This work finds the disagreement between how a brand looks, sounds, and actually behaves, and resolves it.",
    includes: [
      "Brand audit",
      "Repositioning",
      "Voice and messaging alignment",
      "Content structure",
    ],
  },
  {
    slug: "brand-elevation",
    name: "Brand Elevation",
    forWho: "For established brands ready for stronger recognition and sharper creative direction.",
    description:
      "For a brand with a working foundation that needs its expression to catch up: campaigns, creative direction, and content built to earn attention on purpose rather than by accident.",
    includes: [
      "Creative direction",
      "Campaign concepts",
      "Content strategy",
      "Launch communication",
    ],
  },
  {
    slug: "brand-presence",
    name: "Brand Presence",
    forWho: "For brands that need ongoing content, consistency, and someone watching the whole system.",
    description:
      "Recognition is built month over month, through sustained content and consistency work, rather than a single campaign. It's the kind of work that shows up as steady growth rather than a spike.",
    includes: [
      "Ongoing content management",
      "Consistency frameworks",
      "Performance review and adjustment",
    ],
  },
];
