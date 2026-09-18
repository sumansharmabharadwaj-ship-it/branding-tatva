export type ServicePageContent = {
  slug: string;
  name: string;
  title: string;
  description: string;
  updatedAt: string;
  headline: string;
  introduction: string;
  situation: string;
  sections: { title: string; body: string }[];
  outputs: string[];
  preparation: string;
  boundary: string;
  reading: { title: string; href: string }[];
};

export const servicePages: ServicePageContent[] = [
  {
    slug: "brand-positioning",
    name: "Brand positioning",
    title: "Brand Positioning Consultant for Service Businesses",
    description: "Work with Suman Sharma to define who should choose your service business, why they should choose it, and how your messaging can support that position.",
    updatedAt: "2026-09-18",
    headline: "Give buyers a reason to choose you.",
    introduction: "Branding Tatva is Suman Sharma’s solo brand strategy practice. Brand positioning work defines the buyer, the alternatives they compare, and the reason your business deserves a place in that decision.",
    situation: "Your team can describe what you do, but every explanation sounds different. Prospects compare you on price. A new service no longer fits the way the business introduces itself. These are useful reasons to examine the position before commissioning another identity or campaign.",
    sections: [
      {
        title: "Start with a buying decision",
        body: "A position has to answer a real choice. We examine who needs the service, what prompts the search, what they currently use, and what makes them hesitate. Customer language, sales conversations and the work you already deliver matter more than an attractive adjective. Where evidence is missing, we identify the question instead of presenting an assumption as a finding.",
      },
      {
        title: "Separate a difference from a reason to buy",
        body: "Many businesses can claim expertise, care or quality. The useful question is which part of your approach changes the buyer’s decision, and what supports that claim. We compare the available alternatives, test the promise against your delivery, and decide what the business should consistently be known for. A promise the business cannot support does not belong in the position.",
      },
      {
        title: "Carry the position into language",
        body: "The agreed direction should help someone write a homepage, introduce an offer and explain a proposal. We translate it into a message hierarchy: the main promise, supporting reasons and evidence. Voice, identity and website work can follow within the agreed scope. A positioning statement alone is not a finished visual identity or a complete marketing campaign.",
      },
    ],
    outputs: [
      "A defined priority buyer and the situation in which they need you.",
      "A view of the alternatives buyers compare with your offer.",
      "A positioning direction with a promise and supporting evidence.",
      "Messaging priorities that guide the next writing and design decisions.",
    ],
    preparation: "Bring your current website, a recent proposal, examples of customer questions and the alternatives prospects mention. For a new business, bring the offer as it stands and the decisions still open. You do not need to prepare a polished presentation.",
    boundary: "The first conversation establishes whether positioning is the right starting point. Deliverables, research depth, timing and fees are agreed in the proposal. Suman works remotely with founders in India, the UK and the US. No position can guarantee enquiries or sales; price, demand, distribution and delivery still matter.",
    reading: [
      { title: "How brand positioning works for service businesses", href: "/insights/brand-positioning-strategy-service-businesses" },
      { title: "How to position a consulting business", href: "/insights/how-to-position-a-consulting-business" },
    ],
  },
  {
    slug: "brand-audit",
    name: "Brand audit",
    title: "Brand Audit Services for Growing Service Businesses",
    description: "Review your positioning, messaging, identity and customer touchpoints with Suman Sharma. Find what needs to change before committing to a rebrand.",
    updatedAt: "2026-09-18",
    headline: "Find the problem before you fund the rebrand.",
    introduction: "A brand audit examines the gap between the business you run and the impression buyers receive. At Branding Tatva, Suman Sharma reviews the position, language, identity and customer touchpoints to decide what needs attention first.",
    situation: "Your business has grown, but the website describes an earlier version. Different teams explain the same offer differently. Content looks consistent yet gives buyers little reason to remember you. An audit helps distinguish a positioning problem from a writing, design or application problem.",
    sections: [
      {
        title: "Read the brand as a buyer encounters it",
        body: "We review the materials that shape a buying decision: the website, service descriptions, proposals, social content and other agreed touchpoints. The question is whether a person can understand the offer, recognise who it serves and find reasons to trust it. The scope follows your actual customer journey instead of a fixed inventory of every possible channel.",
      },
      {
        title: "Locate the source of inconsistency",
        body: "A visual mismatch may be easy to spot, but the cause can sit earlier. An unsettled position produces competing messages. Unclear verbal rules produce different voices. A useful identity can still fail through inconsistent application. We separate these issues so a design refresh is not asked to solve a decision the business has yet to make.",
      },
      {
        title: "Decide what to keep, change and investigate",
        body: "An audit should leave you with priorities, not a longer list of faults. We identify the elements that still support recognition, the claims that need evidence, and the changes most relevant to the current business problem. Some findings can lead to a small correction. Others point to repositioning or a fuller brand system. Research questions stay visible where the available material cannot establish an answer.",
      },
    ],
    outputs: [
      "A review of the agreed brand materials and customer touchpoints.",
      "A distinction between positioning, messaging, identity and application issues.",
      "Recommendations on what to retain and what needs to change.",
      "An order of work, including questions that need further evidence.",
    ],
    preparation: "Bring your website, current identity guidelines if you have them, recent content, a proposal and examples of recurring buyer questions. Say what has changed in the business and what prompted the review. Existing material is enough for the first conversation.",
    boundary: "The 30 minute diagnosis is an initial conversation, not a completed brand audit. An audit can form part of a broader brand engagement; the proposal confirms the review depth, deliverables, schedule and fee. Work is remote across India, the UK and the US. This is a brand review, not a technical SEO audit or a revenue forecast.",
    reading: [
      { title: "The brand audit checklist to use before a rebrand", href: "/insights/brand-audit-checklist-before-rebrand" },
      { title: "Check consistency across your service business", href: "/insights/brand-consistency-checklist-service-businesses" },
    ],
  },
];
