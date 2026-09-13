import type { InsightPost } from "@/data/insights";

export const customerJourneyInsightPosts: InsightPost[] = [
  {
    slug: "customer-journey-mapping-service-businesses",
    title: "Customer journey mapping for service businesses",
    seoTitle: "Customer journey mapping for service businesses",
    excerpt:
      "A practical method for mapping discovery, enquiry, decision, onboarding, delivery, and follow up as one connected brand experience.",
    directAnswer:
      "Customer journey mapping for a service business documents what a customer is trying to achieve, what they see and do, what they expect, and where confidence rises or falls across discovery, enquiry, decision, onboarding, delivery, and follow up. The map helps teams repair the seams between touchpoints before redesigning individual screens or documents.",
    element: "water",
    topicSlug: "customer-experience",
    primaryKeyword: "customer journey mapping for service businesses",
    secondaryKeywords: [
      "service business customer journey",
      "customer journey map",
      "client journey mapping",
      "service design journey map",
      "brand touchpoint mapping",
    ],
    searchIntent:
      "Map discovery, enquiry, decision, onboarding, delivery, and follow up for a service business.",
    publishedAt: "2026-08-06",
    updatedAt: "2026-08-06",
    readingTime: "12 min read",
    heroImage: "/images/generated/insights-v3/customer-journey-transition-map.webp",
    heroVideo: "/videos/generated/insights-v3/customer-journey-transition-map.mp4",
    heroImageAlt:
      "Six customer journey stages connected by one indigo thread, with a frayed handoff revealing where confidence falls",
    keyTakeaways: [
      "Map the customer goal and expectation at each stage before listing internal processes.",
      "The most damaging friction often appears between touchpoints rather than inside one touchpoint.",
      "A brand promise should become more concrete as the customer moves closer to delivery.",
      "Journey evidence should combine customer language, behavioural signals, and operational reality.",
      "Prioritise journey repairs by customer consequence, business risk, and dependency.",
    ],
    framework: {
      title: "The six stage service journey",
      introduction:
        "The journey follows the customer from first recognition of a need through the experience that determines whether the relationship continues.",
      steps: [
        {
          title: "Discovery",
          description:
            "The customer recognises a need and encounters the brand or category.",
        },
        {
          title: "Enquiry",
          description:
            "The customer tests relevance, access, responsiveness, and fit.",
        },
        {
          title: "Decision",
          description:
            "The customer compares value, risk, proof, scope, and next steps.",
        },
        {
          title: "Onboarding",
          description:
            "The promise becomes a working relationship with clear expectations.",
        },
        {
          title: "Delivery",
          description:
            "The method, communication, and result prove or weaken the brand claim.",
        },
      ],
    },
    sections: [
      {
        id: "what-customer-journey-mapping-means",
        heading: "What customer journey mapping means",
        paragraphs: [
          "A customer journey map is a shared view of the customer's experience across time. It records the stages they move through, the goal they hold at each stage, the touchpoints they encounter, the questions they ask, and the moments that increase or reduce confidence.",
          "For a service business, the journey is especially important because the customer often buys before the final result exists. They judge the business through signals: the website, response time, consultation, proposal, onboarding, communication rhythm, working documents, delivery, and follow up.",
          "The map connects those signals. Its purpose is to reveal where the relationship feels coherent and where the customer has to bridge a gap the business should have designed.",
        ],
        callout: {
          label: "Journey rule",
          text:
            "A polished touchpoint cannot repair a broken handoff by itself. The customer experiences the seam as part of the brand.",
        },
      },
      {
        id: "why-service-journeys-fragment",
        heading: "Why service journeys become fragmented",
        paragraphs: [
          "Service journeys are often built one operational need at a time. Marketing creates the website, sales creates the proposal, operations creates onboarding, and delivery creates its own communication habits. Each part can function while the total experience tells several different stories.",
          "Fragmentation also appears when the business grows. A founder may once have carried context personally from the first call into delivery. As responsibilities spread across people and tools, assumptions stay inside one stage instead of travelling with the customer.",
          "The result is rarely one dramatic failure. It is a sequence of small uncertainties: an unclear next step, a repeated question, a change in tone, a promise that disappears, or a handoff that makes the customer explain themselves again.",
        ],
      },
      {
        id: "define-the-customer-and-scenario",
        heading: "1. Define the customer and scenario",
        paragraphs: [
          "A useful map describes one customer type moving through one meaningful scenario. Combining every audience, service, and buying path into one diagram produces a wall of arrows with very little diagnostic value.",
          "Choose the journey according to the business question. You may map a referred founder buying a brand strategy engagement, an inbound prospect comparing website partners, or an existing client expanding into a second service.",
          "State the customer's starting situation, desired outcome, decision constraints, and level of familiarity. Those conditions shape what each touchpoint needs to accomplish.",
        ],
        bullets: [
          "Who is moving through this journey?",
          "What event or tension started the search?",
          "Which outcome are they trying to secure?",
          "What risks or constraints shape the decision?",
          "How familiar are they with the category and brand?",
        ],
      },
      {
        id: "map-customer-goals",
        heading: "2. Map the customer goal at every stage",
        paragraphs: [
          "Begin each stage with the customer's job rather than the company's task. During discovery, the customer may want language for the problem. During enquiry, they may want to know whether the business understands their situation. During decision, they may want to reduce risk. During onboarding, they may want certainty about what happens next.",
          "Internal activity becomes easier to evaluate once the customer goal is clear. A discovery form may collect useful information for the business while creating unnecessary effort before trust exists. A proposal may contain complete scope while failing to help the customer compare choices.",
          "Write the goal in the customer's language wherever possible. Interview notes, emails, sales calls, search queries, support questions, and feedback contain better journey language than workshop guesses alone.",
        ],
      },
      {
        id: "inventory-touchpoints",
        heading: "3. Inventory the visible and invisible touchpoints",
        paragraphs: [
          "List every customer facing touchpoint: search result, social post, referral message, homepage, service page, form, calendar, call, proposal, contract, payment request, welcome email, project space, meeting, deliverable, support message, and follow up.",
          "Then list the invisible systems that shape those moments. Ownership, response rules, templates, data transfer, tool limitations, approval steps, and team incentives often explain why the visible experience behaves as it does.",
          "Capture the actual materials rather than relying on memory. Screenshots and real documents make contradictions visible and keep the exercise grounded in the current journey.",
        ],
        callout: {
          label: "Experience clue",
          text:
            "When the same customer detail is requested twice, the visible irritation often points to an invisible handoff problem.",
        },
      },
      {
        id: "record-expectations-and-emotions",
        heading: "4. Record expectations, questions, and confidence",
        paragraphs: [
          "At each stage, record what the customer expects to happen, which questions remain open, and whether confidence is rising, stable, or falling. Emotion should be treated as evidence of conditions rather than decorative mood labels.",
          "A customer may feel uncertain because the response time is unknown, relieved because the proposal reflects their language, or anxious because onboarding introduces several tools without sequence. The useful question is what created that response and which decision can change it.",
          "Pay special attention to moments of commitment: submitting an enquiry, sharing sensitive information, signing a contract, making payment, approving a direction, or receiving the final result. These moments carry concentrated expectations.",
        ],
      },
      {
        id: "inspect-the-seams",
        heading: "5. Inspect the seams between stages",
        paragraphs: [
          "Read the final message of one stage beside the first message of the next. The transition from website to enquiry, enquiry to call, call to proposal, proposal to onboarding, and delivery to follow up should preserve context and direction.",
          "A strong seam tells the customer what changed, what remains true, who owns the next step, and what they need to do. A weak seam resets the relationship and forces the customer to reconstruct certainty.",
          "Assign each transition an owner. Shared responsibility without explicit ownership often means the customer experiences silence while each internal team assumes another stage has begun.",
        ],
        bullets: [
          "Does the next stage acknowledge what already happened?",
          "Is the next action and timing clear?",
          "Does the tone still feel like the same brand?",
          "Does important customer context travel forward?",
          "Can the customer tell who owns the relationship now?",
        ],
      },
      {
        id: "compare-promise-with-experience",
        heading: "Compare the brand promise with the journey",
        paragraphs: [
          "Place the central brand promise above the map and test each stage against it. A promise of clarity should reduce ambiguity. A promise of personal attention should show continuity and context. A promise of speed should appear in response design, approvals, and delivery rhythm.",
          "The journey should make the promise more tangible over time. The website introduces the idea, the sales process demonstrates judgement, onboarding creates confidence, and delivery provides evidence.",
          "Where the experience contradicts the promise, the customer usually believes the experience. That contradiction deserves priority before the promise receives wider promotion.",
        ],
      },
      {
        id: "prioritise-journey-repairs",
        heading: "Prioritise journey repairs",
        paragraphs: [
          "Group findings by their effect on understanding, trust, effort, continuity, and outcome. Then score each finding by customer consequence, frequency, business risk, and dependency.",
          "Fix root causes before polishing symptoms. A beautifully rewritten onboarding email will have limited effect when the project ownership remains unclear. A new proposal template will struggle when the offer structure is unresolved.",
          "Choose a small set of repairs that create visible continuity. Define the owner, required system change, customer facing change, and evidence that will show improvement.",
        ],
        bullets: [
          "High consequence and high frequency issues come first.",
          "Repair dependencies before downstream touchpoints.",
          "Protect existing moments customers already value.",
          "Test transitions as well as individual materials.",
          "Measure whether questions, delays, and repeated effort decline.",
        ],
      },
      {
        id: "keep-the-map-alive",
        heading: "Keep the journey map alive",
        paragraphs: [
          "A journey map becomes useful when it informs decisions beyond the workshop. Connect findings with owners, service standards, templates, product changes, and review dates.",
          "Update the map when the audience, offer, team, tools, or delivery model changes. Use customer interviews, enquiry quality, conversion questions, onboarding friction, support patterns, repeat work, and referrals as ongoing evidence.",
          "The final map should remain simple enough for the team to use. Complexity belongs in the evidence behind the map, rather than in a diagram no one opens again.",
        ],
      },
    ],
    faq: [
      {
        question: "What should a customer journey map include?",
        answer:
          "It should include the customer scenario, stages, goals, actions, touchpoints, questions, expectations, confidence, friction, owners, and opportunities for improvement.",
      },
      {
        question: "How is a customer journey map different from a sales funnel?",
        answer:
          "A sales funnel measures movement through business defined conversion stages. A journey map examines the customer's goals and experience before, during, and after the sale.",
      },
      {
        question: "How many stages should a service journey have?",
        answer:
          "Use enough stages to reveal meaningful changes in customer goals and ownership. Discovery, enquiry, decision, onboarding, delivery, and follow up provide a useful starting structure.",
      },
      {
        question: "Who should participate in journey mapping?",
        answer:
          "Include people who own marketing, sales, onboarding, delivery, support, and customer research. Customer evidence should guide the map rather than internal opinion alone.",
      },
      {
        question: "When should a service business map its customer journey?",
        answer:
          "Map it before a major website or process redesign, when conversion or onboarding friction appears, when responsibilities change, or when the brand promise and delivered experience stop agreeing.",
      },
    ],
    relatedSlugs: [
      "brand-audit-checklist-before-rebrand",
      "five-element-brand-strategy-framework",
      "website-messaging-hierarchy-service-businesses",
    ],
  },
];
