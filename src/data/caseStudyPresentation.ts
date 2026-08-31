export type CaseStudyMode = "performance" | "system" | "journey" | "perception" | "authority";

export type CaseStudyArtifact = {
  label: string;
  detail: string;
};

export type CaseStudyPresentation = {
  mode: CaseStudyMode;
  descriptor: string;
  transformation: {
    from: string;
    to: string;
  };
  resultSummary: string;
  artifacts: CaseStudyArtifact[];
  ctaHeading: string;
  ctaBody: string;
  serviceHref: string;
  serviceLabel: string;
  palette: {
    ink: string;
    surface: string;
    paper: string;
    accent: string;
    secondary: string;
    muted: string;
  };
};

// Presentation data is deliberately limited to claims already recorded
// in data/projects.ts. It changes hierarchy and art direction, not the
// factual record. No testimonial, metric, delivery discipline, or
// commercial result is introduced here.
const PRESENTATIONS: Record<string, CaseStudyPresentation> = {
  "dr-haley-nutrition": {
    mode: "performance",
    descriptor: "Performance and content strategy",
    transformation: {
      from: "23 Instagram posts in December",
      to: "12 sharper posts in January",
    },
    resultSummary:
      "Followers earned per post increased 104%, comments per post increased 1,350%, and LinkedIn impressions rose 365%.",
    artifacts: [
      { label: "Cadence", detail: "Instagram publishing moved from 23 posts in December to 12 in January." },
      { label: "Instagram", detail: "January earned 126 followers from 12 posts, compared with 111 from 23 posts in December." },
      { label: "Facebook", detail: "Cadence stayed steady while engagement per post increased 67%." },
      { label: "LinkedIn", detail: "Impressions rose 365%, while engagement rate moved from 0.71% to 2.81%." },
    ],
    ctaHeading: "Posting more, but earning less attention?",
    ctaBody: "Suman can separate a volume problem from a relevance problem before you commission another content calendar.",
    serviceHref: "/services#offerings",
    serviceLabel: "Content strategy and ongoing brand partnership",
    palette: {
      ink: "#101814",
      surface: "#1F3A28",
      paper: "#EEF1E8",
      accent: "#8FAE83",
      secondary: "#C6A97A",
      muted: "#A8B3A4",
    },
  },
  myshopineurope: {
    mode: "system",
    descriptor: "Positioning and brand system design",
    transformation: {
      from: "A marketplace selling access",
      to: "A marketplace selling Indian craft and origin",
    },
    resultSummary:
      "Positioning, channel roles, and a yearlong rollout gave Indian craft and origin a commercial role beyond price.",
    artifacts: [
      { label: "Foundation", detail: "Core belief, mission, promise, and value anchored the brand before channel execution." },
      { label: "Content mix", detail: "65% education and authority, 25% culture and people, and 10% direct branding." },
      { label: "Channel roles", detail: "LinkedIn built buyer authority; Instagram carried visual recall; YouTube and Reddit supported search and listening." },
      { label: "Rollout", detail: "Foundation first, then audience pull, lead quality, and market position." },
    ],
    ctaHeading: "Building a category before the market defines it for you?",
    ctaBody: "Define the reason buyers should choose the category now, before channels and campaigns make that decision by accident.",
    serviceHref: "/services#desire",
    serviceLabel: "Full Brand System",
    palette: {
      ink: "#10151A",
      surface: "#172027",
      paper: "#F2E9DF",
      accent: "#B85A34",
      secondary: "#C6A97A",
      muted: "#9AA6A9",
    },
  },
  "executive-springboard": {
    mode: "journey",
    descriptor: "Conversion architecture and content strategy",
    transformation: {
      from: "Content that built awareness",
      to: "Content designed to end in registration",
    },
    resultSummary:
      "Platform roles and an eight pillar content structure connected everyday publishing to webinar registration.",
    artifacts: [
      { label: "Competitive audit", detail: "The engagement began with a full competitive review rather than a loose posting calendar." },
      { label: "Eight pillars", detail: "Eight content pillars gave the programme a repeatable strategic structure." },
      { label: "Platform roles", detail: "Each platform received its own playbook instead of one strategy stretched across every channel." },
      { label: "Conversion sequence", detail: "Everyday content was connected to the webinar registration objective." },
    ],
    ctaHeading: "Getting attention that never reaches the next action?",
    ctaBody: "Map how content leads to the commercial action before increasing output.",
    serviceHref: "/services#offerings",
    serviceLabel: "Content strategy and Brand Partnership",
    palette: {
      ink: "#111923",
      surface: "#24394D",
      paper: "#E8EDF1",
      accent: "#9FB4C7",
      secondary: "#C6A97A",
      muted: "#A9B5BF",
    },
  },
  herbalcart: {
    mode: "perception",
    descriptor: "Perception reset and campaign direction",
    transformation: {
      from: "A herbal or Ayurvedic assumption",
      to: "A modern sports nutrition position",
    },
    resultSummary:
      "Five formats ready for filming and complete Hinglish scripts reset the campaign around practical supplementation.",
    artifacts: [
      { label: "Comparison", detail: "Food and supplement comparisons made the practical protein gap visible." },
      { label: "Explanation", detail: "Scripts answered why someone would choose a supplement alongside food." },
      { label: "Native formats", detail: "DIY recipes, customer transformations, and reaction reviews replaced pharmaceutical language." },
      { label: "Voice", detail: "Hinglish scripts used familiar cultural reference points instead of fitness influencer clichés." },
    ],
    ctaHeading: "Does the market misunderstand what you actually sell?",
    ctaBody: "A campaign cannot correct the category frame until the positioning, message, and native content language agree.",
    serviceHref: "/services#offerings",
    serviceLabel: "Foundation, messaging, and campaign direction",
    palette: {
      ink: "#171712",
      surface: "#2A2718",
      paper: "#F2EEE1",
      accent: "#C28A28",
      secondary: "#E0B96A",
      muted: "#AAA58E",
    },
  },
  "plaxonic-content-portfolio": {
    mode: "authority",
    descriptor: "Content authority and audience architecture",
    transformation: {
      from: "One tone for every reader",
      to: "Four formats for different levels of fluency",
    },
    resultSummary:
      "Sixteen pieces were organised to validate, challenge, humanise, and define rather than fill a content calendar.",
    artifacts: [
      { label: "Research Papers", detail: "Evidence based validation included the Delhi Jal Board proof point." },
      { label: "Perspective Pieces", detail: "Provocative questions challenged assumptions technology leaders had not yet examined." },
      { label: "Blogs", detail: "Emerging technology was translated into relevance for everyday readers." },
      { label: "Articles", detail: "Short articles gave time pressed readers a route into the subject." },
    ],
    ctaHeading: "Need expert thinking to work for readers at different levels of fluency?",
    ctaBody: "Define what each format must prove, challenge, or explain before assigning topics.",
    serviceHref: "/services#offerings",
    serviceLabel: "Content authority and Brand Partnership",
    palette: {
      ink: "#171311",
      surface: "#2A1E19",
      paper: "#F2E8E1",
      accent: "#CD7A4C",
      secondary: "#E3B69B",
      muted: "#B4A49D",
    },
  },
};

const FALLBACK: CaseStudyPresentation = {
  mode: "system",
  descriptor: "Brand strategy record",
  transformation: {
    from: "A business problem on record",
    to: "A defined strategic response",
  },
  resultSummary: "The record shows the problem, the decision, the work produced, and the evidence available.",
  artifacts: [],
  ctaHeading: "Is this close to the problem in your business?",
  ctaBody: "Bring the current materials and the decision your team has not settled.",
  serviceHref: "/services#offerings",
  serviceLabel: "Find the relevant service",
  palette: {
    ink: "#151719",
    surface: "#1F3A28",
    paper: "#F2F0E8",
    accent: "#8FAE83",
    secondary: "#C6A97A",
    muted: "#A9AAA4",
  },
};

export function getCaseStudyPresentation(slug: string): CaseStudyPresentation {
  return PRESENTATIONS[slug] ?? FALLBACK;
}
