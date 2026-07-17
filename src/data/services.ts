export type ServiceGroup = {
  slug: string;
  name: string;
  forWho: string;
  description: string;
  includes: string[];
};

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
      "Usually the problem isn't visibility. It's that the story doesn't hold together across channels. This work finds the disagreement between how a brand looks, sounds, and actually behaves, and resolves it.",
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
      "Recognition is built month over month, not in a single campaign. This is sustained content and consistency work, the kind that shows up as steady growth rather than a spike.",
    includes: [
      "Ongoing content management",
      "Consistency frameworks",
      "Performance review and adjustment",
    ],
  },
];
