// The marketing ecosystem (Work page) — seven channel families, each
// with its purpose, its typical outputs, and an honest delivery label
// per the conversion plan's boundaries: only what Branding Tatva
// genuinely leads is labelled that way; ads and production beyond the
// practice carry the specialist partners label. Business type
// architectures are illustrative strategy, never predictions.
export type ChannelFamily = {
  id: string;
  name: string;
  purpose: string;
  outputs: string[];
  label: string;
};

export const CHANNEL_FAMILIES: ChannelFamily[] = [
  {
    id: "brand",
    name: "Brand marketing",
    purpose: "Establish meaning, create memory, and shape how the category perceives you.",
    outputs: ["Brand platform", "Campaign territory", "Message hierarchy", "Visual codes", "Launch narrative"],
    label: "Led by Branding Tatva",
  },
  {
    id: "content",
    name: "Content marketing",
    purpose: "Educate, demonstrate expertise, answer objections, and build organic demand.",
    outputs: ["Content pillars", "Editorial calendar", "Pillar articles", "Case studies", "Lead magnets", "Newsletters"],
    label: "Led by Branding Tatva",
  },
  {
    id: "social",
    name: "Social media marketing",
    purpose: "Repeat distinctive signals, distribute ideas, and build familiarity where the audience already is.",
    outputs: ["Platform roles", "Content formats", "Posting rhythm", "Creative templates", "Community response guide"],
    label: "Led by Branding Tatva",
  },
  {
    id: "search",
    name: "Search marketing",
    purpose: "Capture existing intent and build topical authority around category questions.",
    outputs: ["SEO content clusters", "Landing pages", "Comparison pages", "Local search presence"],
    label: "Content led by Branding Tatva; ads with specialist partners",
  },
  {
    id: "lifecycle",
    name: "Lifecycle marketing",
    purpose: "Move interest toward action, nurture leads, and support retention.",
    outputs: ["Welcome sequence", "Lead nurture emails", "Consultation follow up", "Re engagement sequence"],
    label: "Led by Branding Tatva",
  },
  {
    id: "partnership",
    name: "Partnership marketing",
    purpose: "Borrow trust and reach aligned audiences through real collaboration.",
    outputs: ["Collaboration strategy", "Event partnerships", "Community partnerships", "Co created expert content"],
    label: "Directed by Branding Tatva",
  },
  {
    id: "paid",
    name: "Paid media",
    purpose: "Accelerate tested messages and retarget interested visitors.",
    outputs: ["Campaign structure", "Creative angles", "Audience hypotheses", "Measurement plan"],
    label: "Directed by Branding Tatva, produced with specialist partners",
  },
];

export type BusinessType = {
  id: string;
  label: string;
  channelIds: string[]; // recommended order
  rationale: string;
};

export const BUSINESS_TYPES: BusinessType[] = [
  {
    id: "founder-service",
    label: "Founder led service",
    channelIds: ["brand", "content", "lifecycle", "social"],
    rationale: "Authority earns the enquiry before the call. The founder's point of view is the distinctive asset.",
  },
  {
    id: "consumer-product",
    label: "Consumer product",
    channelIds: ["brand", "social", "paid", "lifecycle"],
    rationale: "Recognition drives the shelf and the feed alike; repetition of distinctive assets does the heavy lifting.",
  },
  {
    id: "hospitality",
    label: "Hospitality",
    channelIds: ["brand", "search", "partnership", "social"],
    rationale: "Guests search with intent and trust borrowed voices; the brand decides what they find and feel.",
  },
  {
    id: "wellness",
    label: "Wellness",
    channelIds: ["brand", "content", "social", "lifecycle"],
    rationale: "Trust builds through teaching; the brand that explains the category earns the client.",
  },
  {
    id: "b2b",
    label: "B2B",
    channelIds: ["brand", "content", "search", "lifecycle"],
    rationale: "Long decisions reward documented expertise: the buyer researches for months before one conversation.",
  },
  {
    id: "local",
    label: "Local business",
    channelIds: ["search", "brand", "partnership", "social"],
    rationale: "Being found comes first; being remembered keeps the neighbourhood coming back.",
  },
];
