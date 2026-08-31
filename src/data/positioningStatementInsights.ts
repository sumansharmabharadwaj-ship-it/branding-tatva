import type { InsightPost } from "@/data/insights";

type InsightResearchSource = {
  title: string;
  publisher: string;
  url: string;
  note?: string;
};

type SourcedInsightPost = InsightPost & {
  sources: InsightResearchSource[];
};

export const positioningStatementInsightPosts: SourcedInsightPost[] = [
  {
    slug: "brand-positioning-statement-examples-why-generic",
    title: "Brand positioning statement examples, and why most sound generic",
    seoTitle: "Brand positioning statement examples that avoid generic claims",
    excerpt:
      "Use positioning statement examples as diagnostic tools, not copy templates. This guide shows why most statements blur together and how to write one that changes real business decisions.",
    directAnswer:
      "A useful brand positioning statement identifies a specific customer, the buying situation or alternative being compared, the distinctive value created by the business, and the proof that makes the claim believable. Most positioning statements sound generic because they fill a familiar template with category level promises such as quality, innovation, personal service, or better results. The sentence improves only after the underlying strategic choices become more specific.",
    element: "earth",
    topicSlug: "positioning",
    primaryKeyword: "brand positioning statement examples",
    secondaryKeywords: [
      "positioning statement examples",
      "brand positioning template",
      "how to write a positioning statement",
      "service business positioning statement",
      "bad positioning statement examples",
      "brand positioning statement formula",
    ],
    searchIntent:
      "Compare good and bad positioning statement examples, then write a more specific statement for a service business.",
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    readingTime: "14 min read",
    heroImage: "/images/generated/insights/positioning-specificity.webp",
    heroVideo: "/videos/generated/insights/positioning-specificity.mp4",
    heroImageAlt:
      "A terracotta route tile pinned over translucent maps, showing one precise path chosen from many possible directions",
    keyTakeaways: [
      "A positioning statement records strategic choices; it cannot manufacture those choices through elegant wording.",
      "Generic statements use threshold qualities that every credible competitor must also claim.",
      "The most useful examples expose the customer, buying situation, alternative, consequence, and proof.",
      "A strong statement should make at least one plausible customer or market direction less central.",
      "The final test is operational: the statement should guide offers, proof, website hierarchy, sales language, and content.",
    ],
    framework: {
      title: "The specificity ladder",
      introduction:
        "Five layers turn a pleasant sentence into a position that can survive comparison and guide action.",
      steps: [
        {
          title: "Customer",
          description:
            "Define the buyer by a commercially relevant situation, responsibility, or constraint rather than a broad demographic label.",
        },
        {
          title: "Alternative",
          description:
            "Name what the customer would do instead, including competitors, internal teams, delay, or a cheaper substitute.",
        },
        {
          title: "Consequence",
          description:
            "State the change the customer experiences because the business makes a different choice.",
        },
        {
          title: "Proof",
          description:
            "Connect the consequence with a method, capability, pattern of evidence, or operating model that deserves belief.",
        },
        {
          title: "Discipline",
          description:
            "Remove claims the business cannot consistently express through the offer, experience, and visible evidence.",
        },
      ],
    },
    sections: [
      {
        id: "what-positioning-statement-is",
        heading: "What a brand positioning statement is",
        paragraphs: [
          "A brand positioning statement is an internal expression of how a business wants to be understood relative to alternatives. It usually names the customer, category or comparison, distinctive value, and reason to believe.",
          "The statement is useful because it compresses a set of decisions into one reference point. Teams can use it to judge an offer, homepage, proposal, campaign, or partnership. When the statement is treated as public copy, it often becomes polished before the choices beneath it are settled.",
          "Positioning is therefore larger than the sentence. The statement is the label on the map, while the strategy determines which road the business is actually willing to follow.",
        ],
        callout: {
          label: "Working distinction",
          text:
            "A tagline is designed to be remembered by the market. A positioning statement is designed to keep the business from contradicting itself.",
        },
      },
      {
        id: "why-examples-sound-generic",
        heading: "Why most positioning statement examples sound generic",
        paragraphs: [
          "Many examples begin with a template and end with a collection of respectable claims. The audience is broad, the category is obvious, the benefit is desirable, and the proof is an adjective. The result reads smoothly because nothing in it creates friction.",
          "The same ease creates the weakness. If a competitor can replace the brand name and keep the rest of the sentence unchanged, the statement describes the category rather than the choice inside it.",
          "Words such as innovative, trusted, tailored, high quality, strategic, collaborative, and results driven are not automatically wrong. They become generic when the business cannot show a distinctive mechanism, tradeoff, or consequence behind them.",
        ],
        bullets: [
          "The customer is described as everyone who could possibly buy.",
          "The problem is broad enough to fit every provider in the category.",
          "The benefit names an aspiration rather than a changed experience.",
          "The difference is an adjective instead of a business choice.",
          "The proof repeats the claim instead of demonstrating it.",
        ],
      },
      {
        id: "template-is-not-strategy",
        heading: "A template is not a positioning process",
        paragraphs: [
          "A familiar formula can help organise thinking: For a target customer, the brand is a category that delivers a benefit because of a reason to believe. The formula becomes dangerous when each blank is filled from intuition without comparing alternatives or examining evidence.",
          "Positioning practitioner April Dunford argues that the components depend on one another. A capability is differentiated only relative to an alternative, and its value depends on the customer who cares about the resulting consequence.",
          "Write the sentence after the comparison work. Begin with customer situations, competitive alternatives, unusual capabilities, tradeoffs, proof, and the category frame that makes the value easiest to understand.",
        ],
        callout: {
          label: "Sequence rule",
          text:
            "Do not ask the template to discover the strategy. Use the strategy to decide what deserves a place in the template.",
        },
      },
      {
        id: "generic-and-specific-example",
        heading: "Generic and specific positioning statement example",
        paragraphs: [
          "Consider a brand consultancy. A generic statement might read: For ambitious businesses, Northstar is a strategic branding agency that delivers tailored brand solutions through a collaborative and insight led process.",
          "The sentence sounds competent, yet every serious branding agency could claim the same audience, benefit, and method. The adjectives reassure the buyer without helping them compare.",
          "A more useful working statement might read: For founder led service businesses whose referrals have outgrown their story, Northstar is a brand strategy partner that turns scattered founder knowledge into one usable market position before identity or content production begins, supported by direct senior facilitation and a decision led diagnostic process.",
          "The second version is not better because it is longer. It identifies a buying situation, narrows the customer, names a process choice, creates a consequence, and makes proof easier to request.",
        ],
        bullets: [
          "Customer: founder led service businesses",
          "Buying situation: referrals have outgrown the current story",
          "Alternative: beginning with identity or content production",
          "Distinctive choice: resolve the market position first",
          "Proof direction: senior facilitation and a visible diagnostic process",
        ],
      },
      {
        id: "service-business-examples",
        heading: "Five service business positioning statement examples",
        paragraphs: [
          "The following examples are deliberately written as internal working statements. They are not slogans to copy. Each one shows the type of specificity that makes a statement useful.",
          "A good example reveals the choices behind the sentence. Change the audience, situation, alternative, process, or proof and the position should change with it.",
        ],
        bullets: [
          "Accounting firm: For venture backed companies preparing for their first institutional audit, Calder is the finance partner that turns founder led records into an audit ready operating system before diligence begins, through a fixed readiness sequence led by former audit managers.",
          "Leadership consultancy: For newly promoted functional leaders inheriting cross team conflict, Meridian is the leadership advisory practice that rebuilds decision rights and working agreements before introducing performance programmes, using live operating cases rather than generic training scenarios.",
          "Architecture studio: For hospitality founders opening a second or third location, Fieldroom is the architecture studio that translates the recognised guest experience into a repeatable spatial system without flattening each property's local character, supported by a tested prototype and adaptation method.",
          "Recruitment partner: For specialist B2B firms hiring their first senior commercial leader, Signal is the search partner that validates the role's commercial mandate before sourcing candidates, reducing late stage misalignment through market mapping and stakeholder calibration.",
          "Website studio: For established consultancies whose expertise is clearer in conversation than online, Common Thread is the website partner that builds the message hierarchy before page design, using recorded sales language, proof mapping, and decision led prototypes.",
        ],
      },
      {
        id: "anatomy-of-strong-statement",
        heading: "The anatomy of a strong positioning statement",
        paragraphs: [
          "A strong statement creates a clear comparison frame. The reader should understand what kind of help is being offered, when it becomes relevant, and why this business approaches the situation differently.",
          "Specificity should appear in the logic, not merely in the nouns. Naming an industry can narrow the audience while leaving the value generic. Naming a buying situation, operating constraint, or tradeoff often creates more useful precision.",
          "The statement also needs a believable reason to exist. A claim about speed should connect with a process that removes delay. A claim about depth should reveal what receives more examination. A claim about consistency should show how decisions travel across touchpoints.",
        ],
        bullets: [
          "Customer: who receives disproportionate value from the method?",
          "Situation: what has changed that makes the customer ready to act?",
          "Alternative: what would they compare, continue, or postpone?",
          "Choice: what does the business do, prioritise, sequence, or refuse differently?",
          "Consequence: what becomes clearer, safer, faster, more suitable, or more valuable?",
          "Proof: what evidence shows the choice can be sustained?",
        ],
      },
      {
        id: "replacement-test",
        heading: "Use the replacement test to find generic language",
        paragraphs: [
          "Replace the brand name with the name of a close competitor. If the statement still feels accurate, underline every transferable phrase. Those phrases are not necessarily useless, but they cannot carry the position alone.",
          "Next, replace the category. A statement promising tailored solutions, trusted expertise, and exceptional results may work for an agency, accountant, architect, consultant, or software company. That flexibility shows the sentence has not reached the operating reality of the business.",
          "Finally, ask what would need to change inside the service for the statement to become false. When the answer is nothing, the sentence is communication decoration rather than strategic direction.",
        ],
        callout: {
          label: "Hard test",
          text:
            "A useful position makes a promise that would become untrue if the business abandoned a particular choice.",
        },
      },
      {
        id: "avoid-false-specificity",
        heading: "Avoid false specificity",
        paragraphs: [
          "Numbers, niche labels, and invented process names can make a statement appear specific without making it more useful. A narrow audience is weak when the service was not designed around that audience's situation. A method with five steps is weak when those steps mirror the standard category process.",
          "Proof should reduce doubt, not decorate the sentence. Years of experience, client counts, credentials, and proprietary frameworks matter only when they support the claimed consequence.",
          "False specificity also appears when the business promises a result it cannot isolate or verify. Prefer an observable change in the customer's decision, process, confidence, speed, or consistency over a theatrical claim about transformation.",
        ],
      },
      {
        id: "turn-statement-into-system",
        heading: "Turn the positioning statement into a decision system",
        paragraphs: [
          "A finished statement should make later choices easier. The service menu should foreground the offer most connected with the position. Case studies should prove the central consequence. The homepage should lead with the buying situation and comparison that matter most.",
          "Sales language should diagnose fit rather than recite the sentence. Content should repeatedly teach the problem, mechanism, and point of view that support the position. Visual expression should make the business recognisable while the words build meaning.",
          "When every channel requires a different explanation, the statement is either too abstract or the business has not accepted the tradeoffs it contains.",
        ],
        bullets: [
          "Which service now leads the menu?",
          "Which enquiry is a strong fit, and which is not?",
          "Which proof belongs closest to the main claim?",
          "Which three content themes reinforce the position?",
          "Which familiar phrase should sales, proposals, and the website repeat?",
          "Which operational behaviour must remain true for the promise to stay credible?",
        ],
      },
      {
        id: "positioning-statement-workshop",
        heading: "A practical positioning statement workshop",
        paragraphs: [
          "Gather the people who understand sales, delivery, customer experience, and business direction. Begin with evidence rather than a blank sentence. List recent wins, losses, objections, repeat engagements, customer language, unusual process choices, and moments when the business was selected over an alternative.",
          "Draft several positions using different customer situations and comparison frames. Do not force consensus too early. The contrast between drafts reveals which choices create relevance and which merely preserve internal comfort.",
          "Score each draft for clarity, relevance, distinction, credibility, and operational usefulness. Then write the internal statement, a shorter memory line, and the proof hierarchy that will carry the position into the market.",
        ],
        bullets: [
          "Evidence inventory: what do customers already value and repeat?",
          "Alternative map: what do buyers compare or do instead?",
          "Situation map: which moments create urgency and fit?",
          "Choice map: what does the business do differently in practice?",
          "Draft set: which three plausible positions could the business own?",
          "Decision: which position creates the strongest consequence and proof?",
        ],
      },
      {
        id: "when-to-rewrite",
        heading: "When to rewrite a positioning statement",
        paragraphs: [
          "Rewrite the statement when the audience, category, offer, evidence, buying situation, or competitive frame has materially changed. Do not rewrite it merely because the team is bored with the language.",
          "A statement can also fail because the business never operationalised it. Before replacing the position, check whether the offer, website, proof, sales process, and customer experience ever repeated the same choice long enough to create learning.",
          "The goal is not a permanently frozen sentence. The goal is a stable strategic centre that can absorb better evidence and clearer language without becoming a new business every quarter.",
        ],
      },
    ],
    faq: [
      {
        question: "What is an example of a brand positioning statement?",
        answer:
          "A useful example is: For established consultancies whose expertise is clearer in conversation than online, Common Thread is the website partner that builds the message hierarchy before page design, using recorded sales language, proof mapping, and decision led prototypes. It identifies the customer, situation, category, process choice, and proof direction.",
      },
      {
        question: "What should a positioning statement include?",
        answer:
          "Include the best fit customer, the buying situation or alternative, the category or comparison frame, the distinctive value created by the business, and the evidence or mechanism that makes the claim believable.",
      },
      {
        question: "Why do positioning statements sound generic?",
        answer:
          "They often begin with a template before the business has compared alternatives, chosen a specific customer situation, accepted a tradeoff, or identified proof. The blanks are then filled with category level adjectives.",
      },
      {
        question: "Is a positioning statement the same as a tagline?",
        answer:
          "No. A positioning statement is primarily an internal decision tool. A tagline is a public facing expression designed for memory. The tagline may express part of the position, but it rarely contains the full strategic logic.",
      },
      {
        question: "How long should a brand positioning statement be?",
        answer:
          "Use enough words to preserve the customer, comparison, consequence, and proof. Clarity matters more than a fixed word count. A shorter memory line can be developed after the full working statement is sound.",
      },
      {
        question: "Can I copy a positioning statement template?",
        answer:
          "Use a template to organise validated choices, not to invent them. Copying the structure is harmless; copying another brand's strategic logic usually produces a sentence that sounds specific while remaining disconnected from your service.",
      },
    ],
    relatedSlugs: [
      "brand-positioning-strategy-service-businesses",
      "find-real-differentiator-crowded-service-market",
      "value-proposition-vs-positioning-vs-tagline",
    ],
    sources: [
      {
        title: "My Positioning Book Launches Today",
        publisher: "April Dunford",
        url: "https://www.aprildunford.com/post/my-positioning-book-obviously-awesome-launches-today",
        note:
          "Dunford explains why a fill in the blank statement is not a positioning process and identifies competitive alternatives, unique capabilities, differentiated value, target customers, and market category as connected components.",
      },
      {
        title: "Positioning for B2B Tech Companies",
        publisher: "April Dunford",
        url: "https://www.aprildunford.com/",
        note:
          "A concise practitioner definition of positioning as the foundation for helping best fit customers understand differentiated value relative to alternatives.",
      },
      {
        title: "Strategies for Firm Positioning: The Case of Lexus",
        publisher: "Harvard Business Publishing Education",
        url: "https://store.hbr.org/product/strategies-for-firm-positioning-the-case-of-lexus-a/ISB229",
        note:
          "The case summary frames positioning as a strategic choice among different operating priorities, rather than an attempt to promise every advantage at once.",
      },
      {
        title: "Brand Positioning Examples",
        publisher: "EquiBrand Consulting",
        url: "https://equibrandconsulting.com/services/brand-consultant/brand-positioning/examples/",
        note:
          "A current collection of positioning approaches that distinguishes strategic positioning from taglines and campaign language.",
      },
    ],
  },
];
