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
  example: { title: string; context: string; decisions: { label: string; detail: string }[] };
  evidence: { title: string; href: string; body: string };
  questions: {
    question: string;
    answer: string;
    links?: { title: string; href: string }[];
  }[];
  reading: { title: string; href: string }[];
};

export const servicePages: ServicePageContent[] = [
  {
    slug: "brand-positioning",
    name: "Brand positioning",
    title: "Brand Positioning Consultant | UK, USA & Canada",
    description: "Brand positioning for service businesses in the UK, USA and Canada. Work remotely with Suman Sharma to clarify your audience, competitive difference and messaging.",
    updatedAt: "2026-09-22",
    headline: "Give buyers a reason to choose you.",
    introduction: "Positioning defines the buyer, the alternatives they compare, and the reason your business deserves a place in that decision. At Branding Tatva, Suman Sharma leads this work directly, working remotely with service businesses in the UK, USA and Canada.",
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
    boundary: "The first conversation establishes whether positioning is the right starting point. Deliverables, research depth, timing and fees are agreed in the proposal. Remote engagements are also available in India. Enquiries and sales also depend on price, demand, distribution and delivery.",
    engagement: {
      title: "Position around the buyers you want to reach in the UK.",
      body: "A consultancy, an agency and an independent specialist can compete for the same budget while solving different problems. Bring the UK alternatives your prospects actually mention, along with enquiries and proposals that show how they decide. That material establishes the relevant comparison and the evidence your promise needs. For a business entering the market, the distinction between existing knowledge and unanswered customer questions shapes the research scope. The engagement is remote; meeting times, review stages and responsibilities are agreed before work begins.",
    },
    example: {
      title: "An operations consultancy with an offer that sounds too broad",
      context: "Illustrative brief, not a client result. A consultancy introduces itself as helping businesses grow. Its strongest work is helping a founder hand routine delivery decisions to a team.",
      decisions: [
        { label: "Buyer and trigger", detail: "A founder whose team keeps asking them to approve everyday delivery decisions." },
        { label: "Alternatives", detail: "Hiring an operations manager, writing more process documents, or continuing to approve everything personally." },
        { label: "Position to investigate", detail: "Operations support for service firms preparing to run delivery without daily founder approval." },
        { label: "Evidence required", detail: "Examples of the decisions transferred, the responsibilities agreed and the limits of the consultancy’s role. Customer interviews must test whether this is the problem buyers would pay to solve." },
      ],
    },
    evidence: {
      title: "MyShopInEurope: a position built around craft and origin",
      href: "/work/myshopineurope",
      body: "This recorded B2B marketplace project connects a defined buyer with a brand foundation and content plan. The case documents the delivered strategy; it does not report a measured sales increase or establish a UK client result.",
    },
    questions: [
      {
        question: "Should I start with positioning, a brand audit or messaging?",
        answer: "Start with positioning when the buyer, alternatives or reason to choose your offer is unresolved. An audit helps when you need to examine existing materials and locate the problem. Messaging focuses on the explanation once the underlying position is clear. The first conversation can establish which decision needs attention; the proposal can combine related work where useful.",
        links: [
          { title: "Review the brand audit scope", href: "/brand-audit" },
          { title: "Review the brand messaging scope", href: "/brand-messaging" },
        ],
      },
      { question: "Can you work with a team in the USA or Canada?", answer: "Yes. Branding Tatva works remotely with teams in the UK, USA and Canada. Share your target buyers, market, time zone and required outputs. Meeting times, research, language requirements and review responsibilities are agreed in the proposal. Ask for the quote in GBP, USD or CAD as appropriate. French-language work or local production needs a separate scope and confirmed delivery arrangements." },
      { question: "How is positioning different from a new logo?", answer: "Positioning settles who should choose the business, what they compare it with and why the offer matters. A logo expresses part of that decision visually. If buyers struggle to understand the offer, changing the logo alone leaves the buying question open." },
      { question: "Can an established business keep its name and identity?", answer: "Yes. The review can retain recognisable elements that still support the business. A changed audience or offer may require clearer language without requiring a new name or visual identity. The evidence determines the extent of the change." },
      {
        question: "How much does a positioning engagement cost?",
        answer: "The proposal sets a fee for the agreed research, decisions and deliverables. Bring the number of offers, buyer groups and markets involved so Suman can define the scope. Customer research and identity or website execution need explicit inclusion; a short positioning brief and a broader rebrand involve different work. Published starting prices cover the broader engagement formats; the proposal confirms the fee for this scope.",
        links: [{ title: "See engagement prices and what affects the cost", href: "/insights/how-much-does-brand-strategy-cost" }],
      },
      { question: "Can you work remotely with a UK team?", answer: "Yes. Branding Tatva offers remote work with service businesses in the UK, USA and Canada. Meeting times, decision makers, feedback rounds and handover materials are agreed before the project. Share any launch deadline during the first conversation so the proposal can address it." },
    ],
    reading: [
      { title: "How brand positioning works for service businesses", href: "/insights/brand-positioning-strategy-service-businesses" },
      { title: "How to position a consulting business", href: "/insights/how-to-position-a-consulting-business" },
      { title: "Brand strategist or branding agency: which fits the work?", href: "/insights/brand-strategist-vs-branding-agency" },
    ],
  },
  {
    slug: "brand-audit",
    name: "Brand audit",
    title: "Brand Audit Services | UK, USA & Canada",
    description: "A brand audit for service businesses in the UK, USA and Canada. Review your positioning, messaging, identity and touchpoints with Suman Sharma before committing to a rebrand.",
    updatedAt: "2026-09-22",
    headline: "Find the problem before you fund the rebrand.",
    introduction: "A brand audit examines the gap between the business you run and the impression buyers receive. Working remotely with service businesses in the UK, USA and Canada, Suman Sharma reviews positioning, language, identity and customer touchpoints to decide what needs attention first.",
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
    boundary: "The 30 minute diagnosis establishes the question and scope. The full audit is a separate agreed piece of work. An audit can form part of a broader brand engagement; the proposal confirms the review depth, deliverables, schedule and fee. Remote engagements are also available in India. Technical SEO testing and revenue forecasting fall outside this brand review.",
    engagement: {
      title: "Review the experience your UK prospects actually see.",
      body: "A website can describe a service clearly while a proposal introduces a different promise. For a business selling in the UK, the audit follows those connected moments: the offer a prospect finds, the evidence they can inspect and the language they encounter before making contact. Share examples from your current market and the competitors buyers name. Gaps in understanding a buyer’s response remain explicit research questions. The review is delivered remotely, with access to materials, review stages and meeting times agreed in the scope.",
    },
    example: {
      title: "Three touchpoints, three different promises",
      context: "Illustrative review, not a client result. A service firm’s homepage promises senior advice, its proposal sells a fixed volume of deliverables, and its posts compete on a quick turnaround.",
      decisions: [
        { label: "Observation", detail: "Each touchpoint gives buyers a different reason to choose the business. Consistent colours cannot resolve the competing promises." },
        { label: "Question to investigate", detail: "Do customers choose the senior judgement, the output volume or the delivery speed? Review enquiries, proposals and customer feedback before deciding." },
        { label: "Keep", detail: "Recognisable visual elements and service explanations that still match the work being sold." },
        { label: "Priority", detail: "Agree the main promise, attach evidence to it, then update the homepage and proposal together. Set a review point to check whether buyer questions have changed." },
      ],
    },
    evidence: {
      title: "Executive Springboard: connecting an audit with a content system",
      href: "/work/executive-springboard",
      body: "The recorded project includes a competitive audit and a content system organised around webinar registration. The published evidence describes the work delivered; no registration uplift or UK market outcome is claimed.",
    },
    questions: [
      { question: "Can you work with a team in the USA or Canada?", answer: "Yes. Branding Tatva works remotely with teams in the UK, USA and Canada. Share your target buyers, market, time zone and required outputs. Meeting times, research, language requirements and review responsibilities are agreed in the proposal. Ask for the quote in GBP, USD or CAD as appropriate. French-language work or local production needs a separate scope and confirmed delivery arrangements." },
      {
        question: "Do I need an audit before positioning or messaging work?",
        answer: "An audit is useful when you need to understand what is working, where materials disagree and which problem deserves attention first. If the decision is already clear, discuss it directly: an unsettled buyer or offer points towards positioning, while an agreed position that is difficult to explain points towards messaging. The proposal can include the review needed for that decision without treating every service as a compulsory stage.",
        links: [
          { title: "See what positioning work covers", href: "/brand-positioning" },
          { title: "See what messaging work covers", href: "/brand-messaging" },
        ],
      },
      { question: "Is the 30 minute diagnosis the full brand audit?", answer: "No. The conversation identifies the question, available material and suitable scope. The full audit is a separate agreed engagement with defined touchpoints, findings and recommendations." },
      { question: "Does a brand audit include a technical SEO audit?", answer: "Technical SEO testing falls outside this brand review. The audit examines the offer, messaging, identity and buyer experience. Search indexing, crawl errors and site performance require a separately defined technical review." },
      { question: "Will the audit tell me to replace the whole brand?", answer: "The findings distinguish what to retain, correct and investigate. A repeated misunderstanding may need a clearer explanation. A changed buyer or offer may need repositioning. The recommendation follows the evidence rather than assuming a full rebrand." },
      {
        question: "What affects the audit fee and schedule?",
        answer: "The number of offers, markets and touchpoints, the available customer evidence and the depth of competitor review all affect scope. Suman agrees the fee, materials needed and review dates in the proposal before work begins. Published starting prices cover the broader engagement formats; the proposal confirms the fee for this scope.",
        links: [{ title: "Compare broader engagement prices and scope", href: "/insights/how-much-does-brand-strategy-cost" }],
      },
    ],
    reading: [
      { title: "The brand audit checklist to use before a rebrand", href: "/insights/brand-audit-checklist-before-rebrand" },
      { title: "Check consistency across your service business", href: "/insights/brand-consistency-checklist-service-businesses" },
      { title: "Brand refresh or rebrand: how much change is needed?", href: "/insights/brand-refresh-vs-rebrand-how-much-change" },
    ],
  },
  {
    slug: "brand-messaging",
    name: "Brand messaging",
    title: "Brand Messaging Consultant | UK, USA & Canada",
    description: "Brand messaging and tone of voice for service businesses in the UK, USA and Canada. Work directly with Suman Sharma on your core message, proof, website language and writing guidelines.",
    updatedAt: "2026-09-22",
    headline: "Give your team one clear way to explain the business.",
    introduction: "Brand messaging connects what a business promises with the words buyers actually encounter. Working remotely with service businesses in the UK, USA and Canada, Suman Sharma turns an agreed position into a core message, supporting reasons, evidence and practical voice guidelines.",
    situation: "Your homepage introduces one business, your proposal describes another, and each person writes the next introduction from scratch. You may already have the right offer. The work now is deciding what to say first, how to support it and how the same meaning carries into different situations.",
    sections: [
      { title: "Find the explanation your buyer needs", body: "The review begins with your offer, existing positioning and the questions prospects ask before they enquire. Website copy, proposals and sales conversations reveal where the explanation becomes vague or asks people to believe too much. Missing audience evidence stays a research question. If the underlying position remains unsettled, that decision needs attention before a finished message can be agreed." },
      { title: "Connect the promise with its proof", body: "A message hierarchy gives each statement a job. The core promise introduces the offer. Supporting messages explain the method, fit and difference. Proof belongs next to the claim it supports. Objections need direct answers about scope, responsibilities and limitations. The result should help a writer decide what to lead with, what to explain next and what to leave out." },
      { title: "Make the voice usable in everyday writing", body: "Voice guidance becomes useful when a colleague can apply it to a real sentence. Agreed principles cover vocabulary, level of detail, tone and the way evidence enters the copy. Examples show how an introduction, service explanation or next step can change while still sounding like the same business. Full website copy, campaigns and continuing content production are scoped separately." },
    ],
    outputs: [
      "A core message and supporting reasons tied to an agreed audience and offer.",
      "A claim and evidence map that makes unsupported promises visible.",
      "Voice principles, vocabulary choices and practical writing examples.",
      "A message hierarchy for the touchpoints agreed in the proposal.",
    ],
    preparation: "Bring your positioning document if you have one, your homepage, a service page, a recent proposal and questions from real enquiries. Mark the phrases your team keeps rewriting. Name the person who will approve the language and the people who need to use it after handover.",
    boundary: "The first conversation establishes the writing problem and whether the position is ready to support the work. The proposal confirms deliverables, research, feedback rounds, timing and fees. Website development, a complete website rewrite and ongoing content production require their own agreed scope. Remote engagements are also available in India.",
    engagement: {
      title: "Write for the questions your UK buyers ask.",
      body: "A consultancy buyer may need to understand who performs the work, what information is required and what happens after the advice is delivered. An agency buyer may need clearer boundaries between strategy and execution. Bring the language from your actual enquiries and proposals. Agreed wording should address those decisions, use familiar terminology and stay consistent across the website and sales conversation. Remote reviews and feedback responsibilities are arranged around the team’s availability.",
    },
    example: {
      title: "Replace an adjective with a buying reason",
      context: "Illustrative writing example, not a client quotation or performance result. An operations consultancy wants buyers to understand its work before booking a call.",
      decisions: [
        { label: "Vague introduction", detail: "We provide innovative, bespoke solutions for ambitious businesses." },
        { label: "A clearer direction", detail: "Give your team a clear way to run delivery without asking the founder to approve every step." },
        { label: "Supporting explanation", detail: "The engagement maps recurring decisions, assigns responsibilities and documents when an issue needs the founder’s attention." },
        { label: "Before publishing", detail: "Check that these activities are included in the actual service. Add a relevant example of the work, identify who the offer fits and state what the engagement excludes." },
      ],
    },
    evidence: {
      title: "Plaxonic: different levels of detail for different readers",
      href: "/work/plaxonic-content-portfolio",
      body: "The published portfolio records sixteen pieces across research papers, perspective pieces, blogs and shorter explainers. The work addresses audiences with different levels of technical knowledge. Read the record for the writing approach and delivered formats; it is not presented as a UK client or a conversion result.",
    },
    questions: [
      { question: "Can you work with a team in the USA or Canada?", answer: "Yes. Branding Tatva works remotely with teams in the UK, USA and Canada. Share your target buyers, market, time zone and required outputs. Meeting times, research, language requirements and review responsibilities are agreed in the proposal. Ask for the quote in GBP, USD or CAD as appropriate. French-language work or local production needs a separate scope and confirmed delivery arrangements." },
      {
        question: "Can messaging improve the website without a full rebrand?",
        answer: "When the audience, offer and identity still fit the business, the scope can focus on clearer explanations, evidence and writing guidance. A change in who you serve or why buyers choose you may need positioning work first. If the source of confusion is unclear, a brand audit can examine the existing materials before you decide what to commission.",
        links: [
          { title: "Review the positioning decision", href: "/brand-positioning" },
          { title: "Check whether a brand audit fits the problem", href: "/brand-audit" },
        ],
      },
      { question: "What is the difference between positioning and messaging?", answer: "Positioning settles the buyer, the alternatives and the reason to choose the offer. Messaging expresses those decisions through a main promise, supporting points and evidence. If the buyer or offer is still changing, begin by agreeing the position." },
      { question: "Is tone of voice the same as brand messaging?", answer: "Messaging decides what the business needs to communicate. Tone of voice shapes how that meaning sounds in a particular situation. A service explanation and a payment reminder can share a voice while using different levels of warmth, detail and urgency." },
      { question: "Will you write the whole website?", answer: "A messaging engagement can define the hierarchy and agreed writing examples. A complete website rewrite requires a separate page list and scope. The proposal specifies which copy is delivered and which material your team will produce using the guidelines." },
      {
        question: "How are the fee and delivery dates agreed?",
        answer: "Scope depends on the number of audiences, offers and touchpoints, the available research and the amount of finished copy required. Share your materials and deadline in the first conversation. Suman confirms the fee, feedback rounds and dates before work starts. Published starting prices cover the broader engagement formats; the proposal confirms the fee for this scope.",
        links: [{ title: "See how scope changes the engagement price", href: "/insights/how-much-does-brand-strategy-cost" }],
      },
    ],
    reading: [
      { title: "Build voice guidelines a writer can actually use", href: "/insights/brand-voice-guidelines-writers-can-use" },
      { title: "Plan the messages a service page needs", href: "/insights/service-page-messaging-strategy" },
      { title: "What affects the cost of brand strategy?", href: "/insights/how-much-does-brand-strategy-cost" },
    ],
  },
];
