import { site } from "@/data/site";

/*
 * Public entity facts are the machine-readable claim boundary for Branding
 * Tatva. Only details already published and supported by the current site
 * belong here. Biography dates, institutions, awards, partner names and
 * commercial outcomes stay outside this file until Suman supplies evidence.
 */
export const entityFacts = {
  practice: {
    name: site.name,
    url: site.url,
    description: site.description,
    model: "Founder-led solo brand strategy practice",
  },
  founder: {
    name: site.founder,
    role: "Brand Strategist",
    profileUrl: `${site.url}/about`,
  },
  delivery: {
    mode: "Remote",
    regions: ["United States", "United Kingdom", "India"],
  },
  knowledgeAreas: [
    "Brand positioning",
    "Verbal identity",
    "Brand recognition",
    "Brand architecture",
    "Distinctive brand assets",
    "Consumer psychology",
  ],
  evidenceBoundaries: {
    clientWork: "Named only when the site has a verified project source and display permission.",
    independentStudy: "Based on public material and never presented as a client engagement.",
    conceptWork: "Labelled Branding Tatva Lab and never presented as commissioned work.",
  },
} as const;

export const entityFactsPendingVerification = [
  "Founder biography dates and milestones",
  "Exact degree title, institution and display permission",
  "Partner and client-logo permissions",
  "Awards, rankings and third-party recognition",
  "Commercial outcomes without a recorded evidence source",
] as const;
