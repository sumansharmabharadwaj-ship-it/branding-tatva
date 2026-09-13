// The deliverables catalog (Services explorer) — every entry maps to a
// real inclusion in data/services.ts, expanded with what it is, why it
// matters, and how it gets used. Scope groups follow the conversion
// plan's five group model. Teaching copy in the site voice; zero
// fabricated samples, zero invented scope.
export type ScopeGroup = "Foundation" | "Expression" | "Experience" | "Activation" | "Continuity";

export type Deliverable = {
  id: string;
  name: string;
  group: ScopeGroup;
  what: string;
  why: string;
  use: string;
  packages: ("brand-beginning" | "brand-clarity" | "brand-partnership")[];
};

export const SCOPE_GROUPS: ScopeGroup[] = ["Foundation", "Expression", "Experience", "Activation", "Continuity"];

export const deliverables: Deliverable[] = [
  {
    id: "discovery",
    name: "Discovery & positioning workshop",
    group: "Foundation",
    what: "A structured working session that decides what the brand stands for, who it serves, and the single position it can own.",
    why: "Every later choice inherits this decision. Skip it, and design decorates a question instead of answering one.",
    use: "The reference point every design, copy, and channel decision gets checked against for the life of the brand.",
    packages: ["brand-beginning", "brand-clarity"],
  },
  {
    id: "audience",
    name: "Audience & purpose definition",
    group: "Foundation",
    what: "A written definition of who the brand serves and the job it does in their life.",
    why: "Language frames value only when you know whose value it frames.",
    use: "Filters every message, channel, and campaign choice that follows.",
    packages: ["brand-beginning", "brand-clarity"],
  },
  {
    id: "audit",
    name: "Full brand audit & repositioning",
    group: "Foundation",
    what: "Every live touchpoint examined against the position, then the repositioning decision that closes the gaps.",
    why: "An audit finds exactly where recognition is leaking before anything gets rebuilt.",
    use: "The before and after map the whole engagement works from.",
    packages: ["brand-clarity"],
  },
  {
    id: "identity",
    name: "Core visual identity",
    group: "Expression",
    what: "The mark, colour logic, and type system decided as one connected set.",
    why: "Distinctive assets earn recognition with the logo covered.",
    use: "Applied across every surface from day one, so repetition starts compounding immediately.",
    packages: ["brand-beginning", "brand-clarity"],
  },
  {
    id: "campaign",
    name: "Campaign concept & visual direction",
    group: "Expression",
    what: "One campaign territory with the art direction to carry it.",
    why: "Expression earns attention when it carries the position rather than decorating it.",
    use: "The creative base for the first campaign out of the gate.",
    packages: ["brand-clarity"],
  },
  {
    id: "guidelines",
    name: "Brand guidelines starter document",
    group: "Experience",
    what: "A decision manual recording the rules the identity runs on.",
    why: "It protects recognition when the brand moves across people, channels, campaigns, and time.",
    use: "Onboards anyone who ever touches the brand, without a meeting.",
    packages: ["brand-beginning"],
  },
  {
    id: "website",
    name: "Website content structure",
    group: "Experience",
    what: "Page by page messaging architecture: what each page says, proves, and asks.",
    why: "The website is the most visited stop on the whole customer journey, and usually the most overlooked.",
    use: "The build brief a designer or developer works from directly.",
    packages: ["brand-clarity"],
  },
  {
    id: "voice",
    name: "Voice & messaging alignment",
    group: "Activation",
    what: "One verbal identity translated into each channel's own working format.",
    why: "Consistency creates memory; a voice that shifts per channel dilutes instead of compounds.",
    use: "Templates and rewrites the team applies the same week.",
    packages: ["brand-clarity"],
  },
  {
    id: "launch-messaging",
    name: "Launch messaging direction",
    group: "Activation",
    what: "The first sentences the brand says in public, decided before it says them.",
    why: "The opening frame sets the category people file the brand under.",
    use: "Website copy, launch posts, and introduction emails on day one.",
    packages: ["brand-beginning"],
  },
  {
    id: "content-mgmt",
    name: "Ongoing content management",
    group: "Activation",
    what: "The brand's content planned, produced, and kept coherent month over month.",
    why: "Recognition compounds through repetition of one position, well beyond any single campaign.",
    use: "A steady publishing rhythm the founder approves rather than produces.",
    packages: ["brand-partnership"],
  },
  {
    id: "consistency-review",
    name: "Monthly consistency review",
    group: "Continuity",
    what: "Everything that went out, reviewed monthly against the position and the guidelines.",
    why: "Drift is invisible from inside; a scheduled outside eye catches it early.",
    use: "A short written report with specific corrections, delivered monthly.",
    packages: ["brand-partnership"],
  },
  {
    id: "tracking",
    name: "Performance tracking & adjustment",
    group: "Continuity",
    what: "The measurement layer: what moved, what stalled, and the adjustment for next month.",
    why: "Numbers turn brand work from opinion into decisions.",
    use: "Each month's plan starts from last month's evidence.",
    packages: ["brand-partnership"],
  },
  {
    id: "support",
    name: "Async support",
    group: "Continuity",
    what: "Direct access for brand decisions as they come up, answered in writing with reasoning.",
    why: "New systems meet real situations fast; support keeps the decisions coherent.",
    use: "Three months included in the Full Brand System; ongoing inside the Partnership.",
    packages: ["brand-clarity", "brand-partnership"],
  },
  {
    id: "quarterly",
    name: "Quarterly strategy review",
    group: "Continuity",
    what: "A quarterly session re examining the position against what the market did.",
    why: "Positions age; reviewing on a schedule beats noticing too late.",
    use: "Sets the next quarter's priorities with reasoning on record.",
    packages: ["brand-partnership"],
  },
];
