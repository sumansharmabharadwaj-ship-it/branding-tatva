// The decision evidence gallery (Work page) — small, credible
// artefacts of judgment rather than another card grid. Every entry
// compresses a decision actually recorded in data/projects.ts
// (challenge, insight, strategy, execution, reflection fields); the
// projectSlug links each artefact back to its full narrative. Nothing
// here is invented — these are the real calls, told at tile size.
export type DecisionArtifact = {
  id: string;
  kind: string; // the artefact type, e.g. "Positioning statement"
  question: string;
  decision: string;
  why: string;
  where: string;
  projectSlug: string;
};

export const decisionArtifacts: DecisionArtifact[] = [
  {
    id: "positioning-msie",
    kind: "Positioning statement",
    question: "What should this marketplace stand for?",
    decision: "Craft heritage and origin as the advantage worth selling, with a refusal to compete on being cheap supply.",
    why: "Left alone, the name would default to meaning cheap Indian goods; repositioning around craft changes who the platform can credibly sell to.",
    where: "The brand foundation, the content pillars, and every channel playbook that followed.",
    projectSlug: "myshopineurope",
  },
  {
    id: "content-mix-msie",
    kind: "Content mix",
    question: "What should the content actually teach?",
    decision: "A deliberate 65% education and authority, 25% culture and people, 10% direct branding, weighted toward proving over promoting.",
    why: "European buyers wanted origin and story; teaching earns the trust that promotion spends.",
    where: "The year long rollout: foundation, audience pull, lead quality, market position, quarter by quarter.",
    projectSlug: "myshopineurope",
  },
  {
    id: "channel-roles-msie",
    kind: "Channel roles",
    question: "Which channel does which job?",
    decision: "LinkedIn for buyer side authority, Instagram for visual recall, YouTube and Reddit for search value and audience listening.",
    why: "One strategy stretched across every channel does none of the jobs; each platform earned its own playbook.",
    where: "The channel playbooks inside the content operating system.",
    projectSlug: "myshopineurope",
  },
  {
    id: "cadence-haley",
    kind: "Cadence decision",
    question: "Does posting more actually help?",
    decision: "Cut Instagram from 23 posts to 12 and made every remaining post earn its place.",
    why: "Impressions barely moved while posting dropped by nearly half; the platform was rewarding relevance over volume.",
    where: "Instagram, Facebook, and a previously dormant LinkedIn, all under the quality first reset.",
    projectSlug: "dr-haley-nutrition",
  },
  {
    id: "category-herbalcart",
    kind: "Category frame",
    question: "Which category is this brand actually in?",
    decision: "Supplement first wellness, competing with GNC and MyProtein, rather than the herbal lens the brand had drifted into.",
    why: "The real category runs on native, fast cut, user driven content instincts; the herbal framing was eroding trust in the actual product line.",
    where: "Five content formats ready to shoot and Hinglish scripts built on real cultural reference points.",
    projectSlug: "herbalcart",
  },
  {
    id: "formats-plaxonic",
    kind: "Format portfolio",
    question: "How does one brand speak to two fluency levels?",
    decision: "Sixteen pieces across four distinct types, each doing a different job: validate, challenge, humanise, define.",
    why: "A single content tone had no way to credibly reach HR leaders meeting AI governance for the first time and the engineers who live in it.",
    where: "Research papers, perspective pieces, blogs, and articles, structured as one deliberate arc.",
    projectSlug: "plaxonic-content-portfolio",
  },
  {
    id: "conversion-springboard",
    kind: "Conversion path",
    question: "What should content actually end in?",
    decision: "Platform specific sequencing wired directly to webinar registration, with content as the mechanism rather than a parallel workstream.",
    why: "Content that only earns attention is unfinished; it has to lead somewhere before it counts as strategy.",
    where: "The eight pillar system and its per platform playbooks.",
    projectSlug: "executive-springboard",
  },
];
