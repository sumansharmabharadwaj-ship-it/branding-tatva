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
      href: "/brand-positioning",
      label: "Brand positioning for UK service businesses",
      description: "Review the buyer, competing offers and evidence with Suman. See the research, decisions and deliverables a positioning engagement can cover.",
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
      href: "/brand-messaging",
      label: "Brand messaging and voice for UK service businesses",
      description: "Work with Suman on your core message, supporting evidence and voice guidelines. See what a messaging engagement covers.",
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

// These guides answer the questions covered by the dedicated service pages.
// Keep the topic's proof and conversation paths, while making the service
// destination specific to the article a visitor has just read.
const articleServiceLinks: Record<string, InsightPathLink> = {
  "brand-positioning-statement-examples-why-generic": {
    href: "/brand-positioning",
    label: "Turn a positioning statement into a working direction",
    description: "Define the buyer, alternatives and evidence behind the statement before carrying it into website and sales language.",
  },
  "reposition-established-service-business-without-losing-recognition": {
    href: "/brand-positioning",
    label: "Plan the positioning of your established business",
    description: "Examine a changed offer or audience with Suman, including which recognisable parts of the brand should stay.",
  },
  "competitor-research-brand-strategy-without-copying-category": {
    href: "/brand-positioning",
    label: "Use competitor evidence in your positioning",
    description: "See how a positioning engagement compares the alternatives buyers consider and tests a reason to choose your offer.",
  },
  "brand-refresh-vs-rebrand-how-much-change": {
    href: "/brand-audit",
    label: "Audit the brand before deciding how much to change",
    description: "Review the existing position, language, identity and touchpoints to distinguish a focused correction from a wider rebrand.",
  },
  "brand-positioning-strategy-service-businesses": {
    href: "/brand-positioning",
    label: "Brand positioning for UK service businesses",
    description: "Work with Suman to define the buyer, compare alternatives and carry an agreed position into your messaging.",
  },
  "how-to-position-a-consulting-business": {
    href: "/brand-positioning",
    label: "Positioning support for your consultancy",
    description: "Review your audience, competing offers and evidence with Suman. See the scope for a remote UK engagement.",
  },
  "brand-audit-checklist-before-rebrand": {
    href: "/brand-audit",
    label: "Arrange a brand audit before your rebrand",
    description: "Review positioning, messaging, identity and buyer touchpoints with Suman before deciding what to retain or change.",
  },
  "brand-consistency-checklist-service-businesses": {
    href: "/brand-audit",
    label: "Brand audit services for your business",
    description: "Examine where language, identity and customer touchpoints tell different stories, then agree which decisions deserve attention first.",
  },
};

export function getInsightPathway(topicSlug: string, articleSlug?: string): InsightPathway {
  const pathway = insightPathways[topicSlug] ?? insightPathways.positioning;
  const service = articleSlug ? articleServiceLinks[articleSlug] : undefined;

  return service ? { ...pathway, service } : pathway;
}
