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

// The rendered price book lives in data/pricing.ts (region aware,
// confirmed by Suman as the real starting prices on September 21,
// 2026). Nothing renders the price fields below — they exist for the
// Package type's completeness and mirror the approved UK column of
// the book so any future consumer starts from agreed figures. Change
// prices in data/pricing.ts, with her explicit sign off, and keep
// these in step.
export const packages: Package[] = [
  {
    slug: "brand-beginning",
    name: "Foundation",
    forWho: "For founders with a credible offer and no settled market position.",
    price: 1950,
    billing: "one-time",
    description:
      "This engagement settles what the business should mean, who should choose it, and which promise it can prove, before identity or launch work begins.",
    includes: [
      "Brand discovery and positioning workshop",
      "Audience and purpose definition",
      "Core visual identity (logo, colour, type system)",
      "Brand guidelines starter document",
      "Launch messaging direction",
    ],
    color: "#B85A34", // clay — Earth
  },
  {
    slug: "brand-clarity",
    name: "Full Brand System",
    forWho: "For established businesses whose brand no longer represents the work, value, or market they serve.",
    price: 4500,
    billing: "one-time",
    description:
      "The work begins with what buyers still recognise, decides the stronger position, then rebuilds the language and identity around it.",
    includes: [
      "Everything in Foundation",
      "Full brand audit and repositioning",
      "Voice and messaging rules across channels",
      "Campaign concept and visual direction",
      "Website content structure",
      "3 months of async support",
    ],
    color: "#24394D", // indigo — Water
    popular: true,
  },
  {
    slug: "brand-partnership",
    name: "Brand Partnership",
    forWho: "For businesses whose website, content, and campaigns keep drifting into different voices.",
    price: 1100,
    billing: "monthly",
    description:
      "I direct the brand across live work, correct drift early, and keep repeated decisions recognisable as the business moves.",
    includes: [
      "Ongoing content management",
      "Monthly brand review",
      "Performance review and adjustment",
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
    name: "Brand Strategy and Identity",
    detail: "Position first, identity second. The logo, colour, type, and image direction exist to make the position visible.",
    color: "#B85A34", // clay
  },
  {
    name: "Content Strategy",
    detail: "The subjects, arguments, and language the brand can own get decided before the first post or campaign is written.",
    color: "#24394D", // indigo
  },
  {
    name: "Social Media Marketing",
    detail: "Each post repeats a recognisable point of view, so buyers learn what the business stands for before they need it.",
    color: "#5C6B4A", // sage
  },
  {
    name: "Website Development",
    detail: "The website explains the offer, answers buyer doubt, and turns the position into a useful path toward enquiry.",
    color: "#C28A28", // ochre
  },
  {
    name: "Content Creation",
    detail: "Copy and creative work use the same verbal rules, so the brand sounds like itself wherever buyers meet it.",
    color: "#AD6F5C", // rose-earth
  },
  {
    name: "Marketing Strategy",
    detail: "Campaign decisions begin with the promise the business can prove, then connect that promise to the right buyer and moment.",
    color: "#CD7A4C", // terracotta
  },
];
