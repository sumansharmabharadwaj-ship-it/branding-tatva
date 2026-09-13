export type InsightPathLink = {
  href: string;
  label: string;
  description: string;
};

export type InsightPathway = {
  service: InsightPathLink;
  proof: InsightPathLink;
  conversation: InsightPathLink;
  adjacentTopicSlugs: readonly string[];
};

/*
 * A small, deliberate internal-link graph for the five editorial topic hubs.
 * Each path connects an explanation to the relevant service chapter, one
 * recorded project, and a useful next conversation. The labels describe the
 * destination in plain language so visitors and crawlers can understand the
 * relationship before following it.
 */
export const insightPathways: Record<string, InsightPathway> = {
  "positioning": {
    service: {
      href: "/services#offerings",
      label: "See positioning and identity scopes",
      description: "See how positioning, category, verbal identity, and visual direction are handled in one engagement.",
    },
    proof: {
      href: "/work/myshopineurope",
      label: "See the MyShopInEurope positioning decisions",
      description: "A recorded brand foundation built around craft and origin rather than marketplace language led by price.",
    },
    conversation: {
      href: "/contact",
      label: "Bring a positioning question to Suman",
      description: "Use a 30 minute conversation to identify the decision that deserves attention first.",
    },
    adjacentTopicSlugs: ["brand-messaging", "distinctive-brand"],
  },
  "customer-experience": {
    service: {
      href: "/services#desire",
      label: "Compare service scopes",
      description: "Match the customer journey problem with a defined project scope and working format.",
    },
    proof: {
      href: "/work/executive-springboard",
      label: "See Executive Springboard conversion architecture",
      description: "A recorded content system connecting everyday communication with webinar registration.",
    },
    conversation: {
      href: "/contact",
      label: "Map the customer decision that keeps breaking",
      description: "Bring the current journey, materials and handoff that need a clearer path.",
    },
    adjacentTopicSlugs: ["brand-messaging", "brand-memory"],
  },
  "distinctive-brand": {
    service: {
      href: "/services#authority",
      label: "See how recognition becomes a brand system",
      description: "See how a strategic difference becomes cues people can recognise and reuse.",
    },
    proof: {
      href: "/work/herbalcart",
      label: "See the HerbalCart perception reset",
      description: "A recorded shift from an inherited herbal frame toward a modern supplement position.",
    },
    conversation: {
      href: "/contact",
      label: "Bring the cue your audience should remember",
      description: "Separate a strategic difference from decoration that changes the look alone.",
    },
    adjacentTopicSlugs: ["brand-memory", "positioning"],
  },
  "brand-messaging": {
    service: {
      href: "/services#offerings",
      label: "See messaging, voice, and content scopes",
      description: "See where verbal identity, content strategy and website structure sit inside the practice.",
    },
    proof: {
      href: "/work/plaxonic-content-portfolio",
      label: "Read the Plaxonic content record",
      description: "Sixteen recorded pieces arranged across research, opinion, education, and shorter reads.",
    },
    conversation: {
      href: "/contact",
      label: "Bring the message that keeps losing clarity",
      description: "Share the current explanation and the audience decision it needs to support.",
    },
    adjacentTopicSlugs: ["positioning", "customer-experience"],
  },
  "brand-memory": {
    service: {
      href: "/services#audit",
      label: "Use the brand recognition audit",
      description: "Trace position, repetition, consistency, expression and preference through one diagnostic path.",
    },
    proof: {
      href: "/work/dr-haley-nutrition",
      label: "See measured recognition signals in Dr. Haley Nutrition",
      description: "A recorded two month engagement comparing content volume with followers and engagement earned per post.",
    },
    conversation: {
      href: "/contact",
      label: "Discuss where recognition is weakening",
      description: "Bring the channel, behaviour or audience signal that feels hardest to interpret.",
    },
    adjacentTopicSlugs: ["distinctive-brand", "customer-experience"],
  },
};

export function getInsightPathway(topicSlug: string) {
  return insightPathways[topicSlug] ?? insightPathways.positioning;
}
