export type ServicesFaqCategoryId = "fit" | "process" | "investment" | "collaboration" | "support";

export type ServicesFaq = {
  id: string;
  category: ServicesFaqCategoryId;
  question: string;
  answer: string;
  detail: string;
  related: {
    label: string;
    href: string;
  };
};

export const servicesFaqCategories: {
  id: ServicesFaqCategoryId;
  label: string;
  note: string;
}[] = [
  {
    id: "fit",
    label: "Where to begin",
    note: "Choose the problem before choosing the scope.",
  },
  {
    id: "process",
    label: "How it works",
    note: "Timing, decisions, and what the first conversation covers.",
  },
  {
    id: "investment",
    label: "Investment",
    note: "What the displayed figures do and do not mean.",
  },
  {
    id: "collaboration",
    label: "Working together",
    note: "Input, approvals, revisions, and remote collaboration.",
  },
  {
    id: "support",
    label: "After delivery",
    note: "What happens once the first scope is complete.",
  },
];

// Every answer below is grounded in the package registry, localized
// price book, Strategy Room copy, or the proposal policy already visible
// on the Services page. No universal timeline, revision allowance, or
// result is invented to make the answers sound more definite.
export const servicesFaqs: ServicesFaq[] = [
  {
    id: "need-every-service",
    category: "fit",
    question: "Do I need every service?",
    answer:
      "No. The scope should follow the problem you need to solve, not the longest list of deliverables.",
    detail:
      "Foundation is for building the first strategic and visual base. Full Brand System is for an existing brand that feels unclear or inconsistent. Brand Partnership is ongoing consistency and content work. The situation selector and discovery conversation narrow the route before a final quotation is prepared.",
    related: { label: "Compare the three project rooms", href: "#desire" },
  },
  {
    id: "early-or-established",
    category: "fit",
    question: "Is this only for new businesses?",
    answer:
      "No. The three paths cover an idea before launch, an existing brand that needs alignment, and a brand that needs ongoing direction.",
    detail:
      "A new business usually begins with Foundation. An established business can begin with Full Brand System when the position, identity, voice, or customer experience no longer agree. Brand Partnership is for keeping a working system coherent as more content and campaigns go out.",
    related: { label: "Choose your current situation", href: "#situation" },
  },
  {
    id: "first-session",
    category: "process",
    question: "What happens in the first strategy session?",
    answer:
      "It is a twenty-minute conversation to identify the hardest brand question and decide whether a clear next step exists.",
    detail:
      "The Strategy Room asks for your current stage, immediate priority, and main focus before the calendar opens. The call is framed as honest feedback either way, and you speak directly with the person who does the work.",
    related: { label: "Open the Strategy Room", href: "#book" },
  },
  {
    id: "project-timeline",
    category: "process",
    question: "How long will the project take?",
    answer:
      "There is no universal timeline on this page. The proposal confirms the broad phases and approximate timing after the scope is understood.",
    detail:
      "Projects move through Discover, Define, Design, Develop, Deliver, and Evolve, but each engagement uses those phases differently. A fixed duration before discovery would make the number sound precise while ignoring the actual work.",
    related: { label: "Inspect the project route", href: "#desire" },
  },
  {
    id: "information-needed",
    category: "process",
    question: "What information should I bring?",
    answer:
      "Bring the business stage, the service or problem that needs clarity, your country, and any real deadline already shaping the decision.",
    detail:
      "An optional budget range can help shape the proposal, but the first conversation does not require a polished brief. The Strategy Room only asks where the brand is now, what matters most, and the main focus.",
    related: { label: "Build a project map first", href: "#imagine" },
  },
  {
    id: "price-final",
    category: "investment",
    question: "Is the displayed price the final quote?",
    answer:
      "No. The figures are localized starting investments, not instant quotations.",
    detail:
      "Final scope and quotation follow the discovery conversation. Taxes and relevant third-party production, media, printing, development, travel, or licensing are listed separately rather than hidden inside a generic package price.",
    related: { label: "Review localized starting prices", href: "#desire" },
  },
  {
    id: "feedback-approvals",
    category: "collaboration",
    question: "How do feedback, approvals, and revisions work?",
    answer:
      "The proposal maps the client input and decision points before the project begins.",
    detail:
      "Approvals are attached to the relevant phases instead of appearing as scattered requests. The revision structure is confirmed in the proposal for the agreed scope rather than described as unlimited by default.",
    related: { label: "See what the project hands over", href: "#desire" },
  },
  {
    id: "remote-work",
    category: "collaboration",
    question: "Can the work happen remotely?",
    answer:
      "The current discovery, scheduling, and async-support flow is designed to work online.",
    detail:
      "Any engagement that genuinely needs travel, physical production, printing, or location-specific support is scoped and quoted separately. The site does not fold those costs into every project whether they are needed or not.",
    related: { label: "Book an online strategy session", href: "#book" },
  },
  {
    id: "after-delivery",
    category: "support",
    question: "What support is available after delivery?",
    answer:
      "The support depends on the package rather than being described as one vague aftercare promise.",
    detail:
      "Full Brand System currently includes three months of async support. Brand Partnership is the ongoing monthly path, with content management, consistency reviews, performance adjustment, priority access, and quarterly strategy review. Any Foundation handover and support are confirmed in its final proposal.",
    related: { label: "Compare support by package", href: "#desire" },
  },
];
