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
  engagement: { title: string; body: string };
  reading: { title: string; href: string }[];
};

export const servicePages: ServicePageContent[] = [
  {
    slug: "brand-positioning",
    name: "Brand positioning",
    title: "Brand Positioning Consultant for UK Businesses",
    description: "Brand positioning for UK service businesses. Work remotely with Suman Sharma to clarify your audience, competitive difference and messaging.",
    updatedAt: "2026-09-18",
    headline: "Give buyers a reason to choose you.",
    introduction: "Positioning defines the buyer, the alternatives they compare, and the reason your business deserves a place in that decision. At Branding Tatva, Suman Sharma leads this work directly, working remotely with UK service businesses.",
    situation: "Your team can describe what you do, but every explanation sounds different. Prospects compare you on price. A new service no longer fits the way the business introduces itself. These are useful reasons to examine the position before commissioning another identity or campaign.",
    sections: [
      {
        title: "Start with a buying decision",
        body: "A position has to answer a real choice. The review examines who needs the service, what prompts the search, what they currently use, and what makes them hesitate. Customer language, sales conversations and the work you already deliver matter more than an attractive adjective. Gaps in evidence become explicit research questions.",
      },
      {
        title: "Separate a difference from a reason to buy",
        body: "Many businesses can claim expertise, care or quality. The useful question is which part of your approach changes the buyer’s decision, and what supports that claim. Comparing the available alternatives reveals what the business could consistently be known for. Every proposed promise must hold up against the service you actually deliver.",
      },
      {
        title: "Carry the position into language",
        body: "The agreed direction should help someone write a homepage, introduce an offer and explain a proposal. A message hierarchy connects the main promise with supporting reasons and evidence. Voice, identity and website work can follow within the agreed scope. Each is a distinct piece of work, with its own decisions and deliverables.",
      },
    ],
    outputs: [
      "A defined priority buyer and the situation in which they need you.",
      "A view of the alternatives buyers compare with your offer.",
      "A positioning direction with a promise and supporting evidence.",
      "Messaging priorities that guide the next writing and design decisions.",
    ],
    preparation: "Bring your current website, a recent proposal, examples of customer questions and the alternatives prospects mention. For a new business, bring the offer as it stands and the decisions still open. Existing material is enough for the first conversation.",
    boundary: "The first conversation establishes whether positioning is the right starting point. Deliverables, research depth, timing and fees are agreed in the proposal. Remote engagements are also available in India and the US. Enquiries and sales also depend on price, demand, distribution and delivery.",
    engagement: {
      title: "Position around the buyers you want to reach in the UK.",
      body: "A consultancy, an agency and an independent specialist can compete for the same budget while solving different problems. Bring the UK alternatives your prospects actually mention, along with enquiries and proposals that show how they decide. That material establishes the relevant comparison and the evidence your promise needs. For a business entering the market, the distinction between existing knowledge and unanswered customer questions shapes the research scope. The engagement is remote; meeting times, review stages and responsibilities are agreed before work begins.",
    },
    reading: [
      { title: "How brand positioning works for service businesses", href: "/insights/brand-positioning-strategy-service-businesses" },
      { title: "How to position a consulting business", href: "/insights/how-to-position-a-consulting-business" },
    ],
  },
  {
    slug: "brand-audit",
    name: "Brand audit",
    title: "Brand Audit Services for UK Businesses",
    description: "A brand audit for UK service businesses. Review your positioning, messaging, identity and touchpoints with Suman Sharma before committing to a rebrand.",
    updatedAt: "2026-09-18",
    headline: "Find the problem before you fund the rebrand.",
    introduction: "A brand audit examines the gap between the business you run and the impression buyers receive. Working remotely with UK service businesses, Suman Sharma reviews positioning, language, identity and customer touchpoints to decide what needs attention first.",
    situation: "Your business has grown, but the website describes an earlier version. Different teams explain the same offer differently. Content looks consistent yet gives buyers little reason to remember you. An audit helps distinguish a positioning problem from a writing, design or application problem.",
    sections: [
      {
        title: "Read the brand as a buyer encounters it",
        body: "The review follows the materials that shape a buying decision: the website, service descriptions, proposals, social content and other agreed touchpoints. The question is whether a person can understand the offer, recognise who it serves and find reasons to trust it. Your actual customer journey determines which channels belong in the scope.",
      },
      {
        title: "Locate the source of inconsistency",
        body: "A visual mismatch may be easy to spot, but the cause can sit earlier. An unsettled position produces competing messages. Unclear verbal rules produce different voices. A useful identity can still fail through inconsistent application. Distinguishing these issues puts the business decision before the design correction.",
      },
      {
        title: "Decide what to keep, change and investigate",
        body: "An audit earns its value by establishing priorities. The findings identify elements that still support recognition, claims that need evidence, and changes most relevant to the current business question. Some findings lead to a small correction. Others point to repositioning or a fuller brand system. Research questions stay visible wherever the available material leaves an answer open.",
      },
    ],
    outputs: [
      "A review of the agreed brand materials and customer touchpoints.",
      "A distinction between positioning, messaging, identity and application issues.",
      "Recommendations on what to retain and what needs to change.",
      "An order of work, including questions that need further evidence.",
    ],
    preparation: "Bring your website, current identity guidelines if you have them, recent content, a proposal and examples of recurring buyer questions. Say what has changed in the business and what prompted the review. Existing material is enough for the first conversation.",
    boundary: "The 30 minute diagnosis establishes the question and scope. The full audit is a separate agreed piece of work. An audit can form part of a broader brand engagement; the proposal confirms the review depth, deliverables, schedule and fee. Remote engagements are also available in India and the US. Technical SEO testing and revenue forecasting fall outside this brand review.",
    engagement: {
      title: "Review the experience your UK prospects actually see.",
      body: "A website can describe a service clearly while a proposal introduces a different promise. For a business selling in the UK, the audit follows those connected moments: the offer a prospect finds, the evidence they can inspect and the language they encounter before making contact. Share examples from your current market and the competitors buyers name. Gaps in understanding a buyer’s response remain explicit research questions. The review is delivered remotely, with access to materials, review stages and meeting times agreed in the scope.",
    },
    reading: [
      { title: "The brand audit checklist to use before a rebrand", href: "/insights/brand-audit-checklist-before-rebrand" },
      { title: "Check consistency across your service business", href: "/insights/brand-consistency-checklist-service-businesses" },
    ],
  },
];
