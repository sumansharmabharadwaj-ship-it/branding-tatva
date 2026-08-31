export type InsightElement = "earth" | "water" | "fire" | "air" | "space";

export type InsightTopic = {
  slug: string;
  element: InsightElement;
  name: string;
  eyebrow: string;
  description: string;
  promise: string;
  introduction: string[];
  diagnosticQuestions: string[];
};

export type InsightFramework = {
  title: string;
  introduction: string;
  steps: {
    title: string;
    description: string;
  }[];
};

export type InsightSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: {
    label: string;
    text: string;
  };
};

export type InsightFaq = {
  question: string;
  answer: string;
};

export type InsightPost = {
  slug: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  directAnswer: string;
  element: InsightElement;
  topicSlug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  featured?: boolean;
  heroImage: string;
  heroVideo?: string;
  heroImageAlt: string;
  keyTakeaways: string[];
  framework: InsightFramework;
  sections: InsightSection[];
  faq: InsightFaq[];
  relatedSlugs: string[];
};

export const insightTopics: InsightTopic[] = [
  {
    slug: "positioning",
    element: "earth",
    name: "Positioning",
    eyebrow: "Earth",
    description:
      "Category choices, audience tension, differentiation, and the foundation beneath every later decision.",
    promise:
      "Read this path when the business feels capable but difficult to explain.",
    introduction: [
      "Positioning decides which comparison a customer should use, which situation makes the offer relevant, and which difference deserves memory. It gives every later brand choice a shared direction.",
      "This reading path moves from category and audience decisions into proof, offer logic, and the language used to hold the position steady.",
    ],
    diagnosticQuestions: [
      "Can a customer explain the category after one reading?",
      "Which buying situation makes this business the clearest choice?",
      "Does the stated difference change the service or experience?",
    ],
  },
  {
    slug: "customer-experience",
    element: "water",
    name: "Customer experience",
    eyebrow: "Water",
    description:
      "Touchpoints, expectations, service journeys, and the places where a promise becomes an experience.",
    promise:
      "Read this path when every channel seems competent but the whole feels uneven.",
    introduction: [
      "Customer experience is where a brand promise gains weight. Discovery, enquiry, decision, onboarding, delivery, and follow up should feel like parts of one relationship.",
      "This reading path examines touchpoints and transitions, with special attention to the seams where expectations change or meaning gets diluted.",
    ],
    diagnosticQuestions: [
      "Does each stage prepare the customer for the next one?",
      "Where does the promise become less clear during delivery?",
      "Which transition creates the most uncertainty or effort?",
    ],
  },
  {
    slug: "distinctive-brand",
    element: "fire",
    name: "Distinctiveness",
    eyebrow: "Fire",
    description:
      "Attention, brand salience, distinctive assets, and the cues that help people recognise a business quickly.",
    promise:
      "Read this path when people see the brand yet struggle to recall it later.",
    introduction: [
      "Distinctiveness gives attention a recognisable source. It connects creative expression with the position, so colour, language, motion, symbols, and formats begin to work as memory cues.",
      "This reading path explores brand salience, distinctive assets, category contrast, and the difference between being present and being retrievable.",
    ],
    diagnosticQuestions: [
      "Which cues remain recognisable when the brand name is covered?",
      "Does creative variation still preserve a familiar source?",
      "Which category association should each appearance strengthen?",
    ],
  },
  {
    slug: "brand-messaging",
    element: "air",
    name: "Messaging",
    eyebrow: "Air",
    description:
      "Verbal identity, message architecture, tone of voice, content systems, and language people can repeat.",
    promise:
      "Read this path when the founder explains the value better than the website does.",
    introduction: [
      "Messaging carries the position into language another person can understand and repeat. It includes the message hierarchy, verbal identity, proof, and editorial themes that keep channels aligned.",
      "This reading path turns loose brand language into a system that can travel across websites, proposals, sales calls, and content.",
    ],
    diagnosticQuestions: [
      "Which single promise leads across the main touchpoints?",
      "Can another person repeat the value in their own words?",
      "Does proof appear beside the claim it supports?",
    ],
  },
  {
    slug: "brand-memory",
    element: "space",
    name: "Brand memory",
    eyebrow: "Space",
    description:
      "Recognition, consistency, brand architecture, and the patterns that become easier to remember over time.",
    promise:
      "Read this path when activity is high but memory stays faint.",
    introduction: [
      "Brand memory is the residue of repeated experience. Recognition grows when positioning, experience, distinctive assets, and language teach the market one coherent pattern over time.",
      "This reading path explores consistency, mental availability, category association, and the conditions that help a brand become easier to retrieve.",
    ],
    diagnosticQuestions: [
      "Which idea remains several days after an interaction?",
      "Do repeated appearances strengthen the same association?",
      "Which parts of the current system already carry recognition?",
    ],
  },
];

export const insightPosts: InsightPost[] = [
  {
    slug: "brand-positioning-strategy-service-businesses",
    title: "Brand positioning strategy for service businesses",
    seoTitle: "Brand positioning strategy for service businesses",
    excerpt:
      "A practical method for defining the category, customer tension, difference, proof, and message a service business should own.",
    directAnswer:
      "A brand positioning strategy explains who a service is for, the situation it changes, the difference people should remember, and the evidence that makes the claim believable. Its job is to guide choices across offers, messaging, design, sales, and content.",
    element: "earth",
    topicSlug: "positioning",
    primaryKeyword: "brand positioning strategy for service businesses",
    secondaryKeywords: [
      "service business positioning",
      "brand positioning framework",
      "positioning statement",
      "brand differentiation",
      "brand strategy",
    ],
    searchIntent: "Learn how to build and apply a positioning strategy for a service business.",
    publishedAt: "2026-08-06",
    updatedAt: "2026-08-06",
    readingTime: "13 min read",
    featured: true,
    heroImage: "/images/generated/insights/positioning-strategy-spine.webp",
    heroVideo: "/videos/generated/insights/positioning-strategy-spine.mp4",
    heroImageAlt:
      "Five interlocking material pieces forming one complete positioning spine on a strategy table",
    keyTakeaways: [
      "Positioning is a decision system, rather than a sentence kept inside a deck.",
      "A useful position connects category, customer tension, distinctive choice, proof, and a memorable message.",
      "Specificity creates commercial clarity by showing the right buyer why this choice fits their situation.",
      "The position should shape offers, sales language, website hierarchy, content themes, and visual direction.",
      "A position becomes stronger through repeated use and real customer evidence.",
    ],
    framework: {
      title: "The positioning spine",
      introduction:
        "Five connected decisions turn loose business knowledge into a position people can understand and repeat.",
      steps: [
        {
          title: "Category",
          description:
            "Name the mental shelf where the service should be placed.",
        },
        {
          title: "Customer tension",
          description:
            "Describe the situation that makes the buyer ready to listen.",
        },
        {
          title: "Distinctive choice",
          description:
            "State the decision or point of view that separates the offer.",
        },
        {
          title: "Proof",
          description:
            "Show why the claim deserves belief through process, evidence, or experience.",
        },
        {
          title: "Memory line",
          description:
            "Compress the position into language another person can carry away.",
        },
      ],
    },
    sections: [
      {
        id: "what-brand-positioning-means",
        heading: "What brand positioning means",
        paragraphs: [
          "Brand positioning is the place a business chooses to occupy in the mind of a specific customer. That place is created through a pattern of decisions: what the business is compared with, which problem it names, what it refuses to dilute, which evidence it foregrounds, and which language it repeats.",
          "For a service business, the work matters because the offer is often intangible. A buyer sees a website, a proposal, a call, a process, and a set of promises before the result exists. Positioning gives those separate moments one shared meaning.",
          "A positioning statement can record the decision. The strategy lives in what the business does because of that decision.",
        ],
        callout: {
          label: "Field note",
          text:
            "When a position changes only the homepage headline, the work stayed at copy level. A real position changes what gets sold, emphasised, repeated, and declined.",
        },
      },
      {
        id: "why-service-businesses-blur-together",
        heading: "Why service businesses blur together",
        paragraphs: [
          "Service businesses often describe themselves through competence. They are experienced, responsive, dedicated, and focused on quality. Every credible competitor can say the same thing, so the words provide reassurance without giving memory a clear handle.",
          "Another common pattern is breadth. The website tries to welcome every possible buyer, list every capability, and preserve every future option. The result feels safe inside the business and vague outside it. A prospect has to perform the sorting work that positioning should have already completed.",
          "The sharper question is less about everything the business can do and more about the situation in which it becomes the clearest choice.",
        ],
      },
      {
        id: "choose-the-category",
        heading: "1. Choose the category frame",
        paragraphs: [
          "Customers understand new offers by placing them beside something familiar. The category frame tells them which comparison to use. A brand consultant, a content studio, and a fractional marketing lead may perform overlapping tasks, yet each frame creates a different expectation about scope, depth, price, and outcome.",
          "Choose the frame that makes the value easiest to understand while preserving the difference that matters. Inventing a category too early can create explanation debt. Choosing a category that is too broad can erase the very reason the service deserves attention.",
          "Write down the three categories a customer might already use. Then ask which one creates the most useful comparison, which one the buying process supports, and which one leaves room for the business to own a recognisable idea.",
        ],
        bullets: [
          "What would a customer type into search before knowing the business name?",
          "Which alternatives appear in the same budget conversation?",
          "What expectation arrives with each category label?",
          "Which category helps the customer understand the value fastest?",
        ],
      },
      {
        id: "name-the-customer-tension",
        heading: "2. Name the customer tension",
        paragraphs: [
          "Demographics rarely create a strong position on their own. The same founder can feel calm, urgent, sceptical, or ambitious at different moments. Positioning becomes useful when it names the situation that makes the buyer receptive.",
          "A customer tension contains a present reality and a desired movement. A founder may have a capable business that still sounds generic. A growing team may have accumulated several versions of the same story. An established service may have recognition inside referrals and confusion outside them.",
          "Describe the tension in language a customer would recognise from their own week. Specific observations usually carry more force than broad claims about pain points.",
        ],
      },
      {
        id: "make-a-distinctive-choice",
        heading: "3. Make a distinctive choice",
        paragraphs: [
          "Difference comes from a decision the business is willing to keep making. The decision may concern audience, process, philosophy, format, specialism, pace, access, or the order in which the work happens.",
          "A useful difference creates consequence. It changes the experience or result for the customer. A decorative difference may sound fresh in a headline while leaving the service identical to every alternative.",
          "Try completing this sentence: Most providers begin with this. I begin with that, because this customer situation requires a different first move. The answer often reveals a position hiding inside the actual method.",
        ],
        bullets: [
          "Who receives the clearest value from the way the service already works?",
          "Which common industry habit does the business question?",
          "What does the process protect the customer from?",
          "Which tradeoff is the business comfortable making?",
        ],
      },
      {
        id: "build-believable-proof",
        heading: "4. Build believable proof",
        paragraphs: [
          "A position is a claim about relevance. Proof gives the claim weight. For a service business, proof may come from case studies, work samples, a visible process, founder experience, client language, repeat engagements, or a body of teaching that reveals how the work is approached.",
          "The strongest proof sits close to the claim it supports. A promise about clarity needs evidence of diagnostic depth. A promise about consistency needs evidence across several touchpoints. A promise about category knowledge needs specific observations that a generalist would miss.",
          "Avoid forcing one proof point to support every message. Map each core claim to the evidence that makes it believable.",
        ],
      },
      {
        id: "write-the-memory-line",
        heading: "5. Write the memory line",
        paragraphs: [
          "A memory line is the shortest useful expression of the position. It should help a customer describe the business later without needing the full deck.",
          "Begin with a plain sentence before reaching for a slogan. Name the customer, the situation, the distinctive choice, and the change. Then remove anything that merely decorates the sentence.",
          "One practical template is: For this kind of customer in this situation, the business provides this category of help through this distinctive choice, so this change becomes easier. The template is a thinking tool. The final language should sound natural enough to say in a room.",
        ],
        callout: {
          label: "Clarity test",
          text:
            "Ask a person outside the business to read the sentence once, look away, and explain it back. Their version reveals which idea survived.",
        },
      },
      {
        id: "test-the-position",
        heading: "How to test a brand position",
        paragraphs: [
          "A position should pass five tests before it guides a rebrand or content system. It needs clarity, relevance, distinction, credibility, and repeatability.",
          "Clarity asks whether a buyer understands the offer and category. Relevance asks whether the position speaks to a live customer tension. Distinction asks whether the choice creates separation from plausible alternatives. Credibility asks whether the business can support the claim. Repeatability asks whether the idea can travel across a sales call, homepage, proposal, social post, and client experience without losing its centre.",
          "Testing works best through real conversations and real touchpoints. Watch where customers ask for explanation, which phrases they repeat, and which proof changes their confidence.",
        ],
        bullets: [
          "Can a customer understand the category within one reading?",
          "Does the message describe a recognisable situation?",
          "Could a close competitor use the same sentence unchanged?",
          "Does visible evidence support the central claim?",
          "Can the idea guide a decision beyond copy?",
        ],
      },
      {
        id: "apply-positioning-across-the-business",
        heading: "Turn positioning into operating choices",
        paragraphs: [
          "Positioning earns its value when it reduces indecision. It should influence which services lead the menu, which case studies appear first, which questions shape discovery, which content themes repeat, and which visual cues become distinctive assets.",
          "On the website, the position should shape hierarchy before wording. The first screen establishes category and relevance. The next section names the customer situation. Proof appears beside the claims it supports. Service pages show the method as a consequence of the position.",
          "In content, the position becomes an editorial lens. A clear lens helps the business choose which subjects deserve a point of view and which subjects merely add volume.",
        ],
      },
      {
        id: "common-positioning-errors",
        heading: "Common positioning errors",
        paragraphs: [
          "The first error is confusing a broad ambition with a position. Words such as trusted, leading, and quality describe a desired reputation. They leave the customer without a reason to choose this business in this situation.",
          "The second is treating the audience as everyone who could technically buy. A position gains force by being precise about the person and moment it serves best.",
          "The third is inventing difference in language while the offer stays unchanged. Customers eventually meet the process, and the experience rewrites the promise.",
          "The fourth is changing the message before it has time to compound. A position needs disciplined repetition, followed by evidence based refinement.",
        ],
      },
    ],
    faq: [
      {
        question: "What is a brand positioning strategy?",
        answer:
          "A brand positioning strategy defines the category a business enters, the customer situation it serves, the difference it chooses to own, the proof behind that difference, and the message people should remember.",
      },
      {
        question: "How is positioning different from a value proposition?",
        answer:
          "Positioning sets the competitive and perceptual context for the whole brand. A value proposition explains the value of a specific offer to a specific customer. Several offers can sit beneath one clear brand position.",
      },
      {
        question: "Does a small service business need brand positioning?",
        answer:
          "Yes. A smaller business often benefits quickly because a clear position helps limited time and budget concentrate around the right buyer, message, proof, and channel.",
      },
      {
        question: "How long should a positioning statement be?",
        answer:
          "The internal statement can be a short paragraph if each part earns its place. The customer facing memory line should usually fit inside one natural sentence.",
      },
      {
        question: "When should positioning be reviewed?",
        answer:
          "Review it when the audience, offer, category, buying process, or business direction changes. Evidence can refine the expression while the central choice remains stable.",
      },
    ],
    relatedSlugs: [
      "brand-audit-checklist-before-rebrand",
      "brand-messaging-framework",
      "brand-awareness-vs-brand-recall",
    ],
  },
  {
    slug: "brand-audit-checklist-before-rebrand",
    title: "Brand audit checklist: what to review before a rebrand",
    seoTitle: "Brand audit checklist before a rebrand",
    excerpt:
      "A practical brand audit checklist for finding where positioning, messaging, visual identity, and customer experience stop agreeing.",
    directAnswer:
      "A brand audit reviews the foundation, message, visual system, customer journey, and memory cues of a business before new design or content begins. The goal is to locate the exact breaks between what the business intends, what it expresses, and what customers experience.",
    element: "water",
    topicSlug: "customer-experience",
    primaryKeyword: "brand audit checklist",
    secondaryKeywords: [
      "brand audit",
      "brand audit before rebrand",
      "brand consistency audit",
      "brand touchpoint audit",
      "rebrand checklist",
    ],
    searchIntent: "Find a clear checklist for reviewing a brand before a rebrand.",
    publishedAt: "2026-07-06",
    updatedAt: "2026-08-06",
    readingTime: "12 min read",
    heroImage: "/images/generated/insights/brand-audit-five-layers.webp",
    heroVideo: "/videos/generated/insights/brand-audit-five-layers.mp4",
    heroImageAlt:
      "Five material layers of earth, indigo cloth, terracotta, vellum, and mineral plaster examined through a brass loupe",
    keyTakeaways: [
      "An audit begins with the business decision that triggered the review.",
      "The strongest findings identify a specific break rather than a vague feeling.",
      "Positioning, message, design, and experience should be reviewed together.",
      "Touchpoints deserve priority according to customer influence and business risk.",
      "A rebrand brief should emerge from evidence collected during the audit.",
    ],
    framework: {
      title: "The five layer brand audit",
      introduction:
        "The audit follows the brand from internal intention to customer memory, revealing where the signal weakens.",
      steps: [
        {
          title: "Foundation",
          description:
            "Review audience, category, offer structure, and positioning.",
        },
        {
          title: "Message",
          description:
            "Compare the promise, proof, voice, and hierarchy across channels.",
        },
        {
          title: "Identity",
          description:
            "Check distinctive assets, visual logic, and practical consistency.",
        },
        {
          title: "Experience",
          description:
            "Trace the customer journey from discovery through delivery.",
        },
        {
          title: "Memory",
          description:
            "Identify which ideas and cues a customer is likely to retain.",
        },
      ],
    },
    sections: [
      {
        id: "what-a-brand-audit-is",
        heading: "What a brand audit is",
        paragraphs: [
          "A brand audit is a structured comparison between intention, expression, and experience. It asks what the business wants to mean, what its touchpoints currently communicate, and what a customer is likely to conclude after moving through them.",
          "The process belongs before a rebrand because visual change can conceal the location of the real problem. A new identity may improve presentation while positioning stays vague, proof stays scattered, and the customer journey keeps producing mixed signals.",
          "A useful audit ends with priorities. It shows which problems affect understanding, trust, recognition, or delivery, and which changes can safely wait.",
        ],
      },
      {
        id: "define-the-audit-question",
        heading: "Begin with the audit question",
        paragraphs: [
          "Every audit needs a reason. The business may be entering a new market, attracting the wrong enquiries, preparing a new offer, merging several services, or seeing weak recognition despite regular activity.",
          "Write the trigger as a question. Why do qualified prospects misunderstand the service? Where does the promise change between the website and sales call? Which parts of the identity still belong to an earlier stage of the business?",
          "A clear question prevents the audit from becoming a collection of preferences. It gives every observation a decision to support.",
        ],
        callout: {
          label: "Audit rule",
          text:
            "Record evidence before recommendations. A design opinion becomes useful only after the business consequence is clear.",
        },
      },
      {
        id: "audit-the-foundation",
        heading: "1. Audit the brand foundation",
        paragraphs: [
          "Review the category, audience, offer structure, competitor frame, and central position. Look for gaps between the internal explanation and the customer facing one.",
          "Interview the founder or leadership team separately before comparing answers. Different versions of the audience or promise often reveal the first fracture. Then compare those answers with the homepage, proposals, sales material, and current service menu.",
          "The foundation is healthy when the business can state who it serves best, which situation it changes, why its method differs, and which proof supports the claim.",
        ],
        bullets: [
          "Is the category clear within the first screen?",
          "Does the audience definition describe a real buying situation?",
          "Can the core offer be explained without listing every capability?",
          "Does the stated difference change the customer experience?",
          "Do the strongest proof points support the central position?",
        ],
      },
      {
        id: "audit-the-message",
        heading: "2. Audit the messaging system",
        paragraphs: [
          "Collect the language a customer encounters across the website, social profiles, proposals, emails, sales calls, onboarding, and delivery documents. Place the opening lines beside each other.",
          "Look for message drift. One channel may lead with expertise, another with affordability, and another with personal attention. Each claim can be valid while the combination leaves no single idea to remember.",
          "Review hierarchy as carefully as wording. The right message placed too late still behaves like a weak message.",
        ],
        bullets: [
          "Does every channel describe the same category?",
          "Which promise receives the most emphasis?",
          "Is proof located near the claim it supports?",
          "Can customers repeat the message in their own language?",
          "Does the tone stay recognisable across formal and informal moments?",
        ],
      },
      {
        id: "audit-the-visual-identity",
        heading: "3. Audit the visual identity",
        paragraphs: [
          "A visual audit looks beyond logo consistency. It examines whether colour, type, image direction, layout, motion, symbols, and repeated shapes create a recognisable system.",
          "Capture real touchpoints at the sizes customers see them. A logo may work on a presentation and disappear inside a mobile profile. A colour palette may feel coherent in a brand guide and become generic when photography enters the feed.",
          "Distinguish between variation and drift. A flexible identity can change mood while keeping recognisable assets. Drift occurs when every channel rebuilds the brand from zero.",
        ],
        bullets: [
          "Which visual cues belong clearly to this brand?",
          "Do key assets survive at mobile size?",
          "Is imagery guided by a repeatable point of view?",
          "Can several formats vary while still feeling related?",
          "Which visual choices create confusion with competitors?",
        ],
      },
      {
        id: "audit-the-customer-journey",
        heading: "4. Audit the customer journey",
        paragraphs: [
          "Map the journey from first discovery through enquiry, decision, onboarding, delivery, and follow up. Record what the customer sees, does, expects, and feels at each stage.",
          "The promise should become more concrete as the journey progresses. If the website promises clarity while the proposal introduces complexity, or the sales call promises care while onboarding feels abrupt, experience rewrites the message.",
          "Pay attention to transitions. Most friction lives between owners, channels, or stages rather than inside one polished touchpoint.",
        ],
        callout: {
          label: "Experience test",
          text:
            "Read the final line of one touchpoint beside the first line of the next. The seam reveals whether the journey feels continuous.",
        },
      },
      {
        id: "audit-brand-memory",
        heading: "5. Audit brand memory",
        paragraphs: [
          "Memory is the final compression of the whole system. After several interactions, what idea, phrase, colour, symbol, or feeling remains available?",
          "Ask customers, collaborators, and people with light familiarity to describe the business without looking at the website. Compare the words they use with the position the business intends to own.",
          "The gap can reveal a missing cue, an overcomplicated message, weak repetition, or a position that customers experience differently from the way leadership describes it.",
        ],
      },
      {
        id: "score-findings-by-consequence",
        heading: "Score findings by consequence",
        paragraphs: [
          "Group findings by their effect on clarity, credibility, recognition, and experience. Then score each one by customer influence, business risk, and effort.",
          "A spelling inconsistency and an unclear category label both count as inconsistencies. Their consequences differ sharply. The audit should protect the team from spending equal energy on unequal problems.",
          "Turn the highest priority findings into a sequence. Foundation decisions come before message architecture. Message architecture comes before large scale copy. Distinctive assets come before a library of templates.",
        ],
      },
      {
        id: "turn-the-audit-into-a-brief",
        heading: "Turn the audit into a rebrand brief",
        paragraphs: [
          "The final brief should explain what must change, what deserves protection, and which evidence will show improvement. It should also name constraints such as audience familiarity, legacy assets, technical systems, and rollout capacity.",
          "Preserve equity deliberately. Familiar language, colours, symbols, or service names may already carry recognition. A rebrand gains strength by knowing what to keep as clearly as what to replace.",
          "The brief becomes the bridge from diagnosis to creation. Every later concept should answer an identified need rather than a taste preference.",
        ],
      },
    ],
    faq: [
      {
        question: "What should a brand audit include?",
        answer:
          "A brand audit should include positioning, audience, offers, messaging, visual identity, customer touchpoints, competitor context, proof, and the cues customers are likely to remember.",
      },
      {
        question: "How long does a brand audit take?",
        answer:
          "The length depends on the number of touchpoints, people involved, and depth of research. A focused small business audit may take several working days, while a complex organisation can require several weeks.",
      },
      {
        question: "Should a brand audit happen before a rebrand?",
        answer:
          "Yes. The audit identifies the real brief, protects existing equity, and helps the rebrand solve the highest consequence problems first.",
      },
      {
        question: "Can a business conduct its own brand audit?",
        answer:
          "A business can complete a useful first review with a clear framework. Outside perspective becomes valuable where internal familiarity makes contradictions difficult to see.",
      },
      {
        question: "What is the outcome of a brand audit?",
        answer:
          "The outcome should be an evidence based diagnosis, a priority map, and a clear brief for positioning, messaging, identity, or experience work.",
      },
    ],
    relatedSlugs: [
      "brand-positioning-strategy-service-businesses",
      "brand-messaging-framework",
      "five-element-brand-strategy-framework",
    ],
  },
  {
    slug: "brand-awareness-vs-brand-recall",
    title: "Brand awareness vs brand recall: the difference that changes content",
    seoTitle: "Brand awareness vs brand recall",
    excerpt:
      "Awareness measures exposure. Recall reveals which idea survived. The distinction changes what a brand should repeat and measure.",
    directAnswer:
      "Brand awareness shows whether people recognise or know a brand when they encounter it. Brand recall shows whether they can retrieve that brand or its meaning from memory without seeing it first. Awareness can grow through exposure, while recall requires distinctive and consistent memory cues.",
    element: "fire",
    topicSlug: "distinctive-brand",
    primaryKeyword: "brand awareness vs brand recall",
    secondaryKeywords: [
      "brand recall",
      "brand awareness",
      "brand recognition",
      "mental availability",
      "distinctive brand assets",
    ],
    searchIntent: "Understand the difference between brand awareness and brand recall.",
    publishedAt: "2026-07-13",
    updatedAt: "2026-08-06",
    readingTime: "10 min read",
    heroImage: "/images/generated/insights/awareness-recall-archive.webp",
    heroVideo: "/videos/generated/insights/awareness-recall-archive.mp4",
    heroImageAlt:
      "Archive drawers of natural specimens with a terracotta spiral repeated in separate compartments as a memory cue",
    keyTakeaways: [
      "Awareness and recall describe different levels of memory access.",
      "Frequent exposure can create familiarity while leaving the central idea unclear.",
      "Distinctive assets help people recognise the brand before they read every word.",
      "Consistent message structure gives repeated exposure one idea to strengthen.",
      "Content should be measured for memory quality as well as distribution.",
    ],
    framework: {
      title: "The path from exposure to memory",
      introduction:
        "Each stage asks more from the brand and more from the customer memory system.",
      steps: [
        {
          title: "Exposure",
          description:
            "The person has an opportunity to see or hear the brand.",
        },
        {
          title: "Attention",
          description:
            "A cue earns enough attention to be processed.",
        },
        {
          title: "Recognition",
          description:
            "The person identifies the brand when the cue appears again.",
        },
        {
          title: "Recall",
          description:
            "The person retrieves the brand or idea without seeing the cue first.",
        },
        {
          title: "Association",
          description:
            "The brand becomes linked with a category, situation, or desired meaning.",
        },
      ],
    },
    sections: [
      {
        id: "awareness-and-recall",
        heading: "Brand awareness and brand recall",
        paragraphs: [
          "Brand awareness is an umbrella term for how familiar a market is with a brand. It can include aided recognition, unaided recall, category association, and general familiarity.",
          "Brand recognition asks whether a person can identify the brand when shown a name, logo, colour, phrase, or other cue. Brand recall asks whether the person can retrieve the brand from memory when given only a category or buying situation.",
          "The difference matters because a business can become familiar without becoming mentally available at the moment of choice.",
        ],
      },
      {
        id: "why-visibility-can-feel-busy",
        heading: "Why visibility can feel busy without building memory",
        paragraphs: [
          "A brand can publish often, appear across several channels, and still leave a weak trace. Exposure creates opportunity. The mind still decides what deserves storage.",
          "When every post introduces a different message, visual language, offer, and tone, each appearance competes with the previous one. Activity rises while recognition has to begin again.",
          "Memory strengthens when repeated exposure points toward a small set of stable associations. The creative expression can vary. The underlying cues and meaning need continuity.",
        ],
        callout: {
          label: "Memory rule",
          text:
            "Repetition works when the repeated material is clear enough to recognise and useful enough to retrieve later.",
        },
      },
      {
        id: "recognition-before-recall",
        heading: "Recognition usually develops before recall",
        paragraphs: [
          "Recognition requires a match between the present cue and something stored in memory. Recall asks the mind to retrieve the cue without that support, so the task is harder.",
          "This creates a practical sequence for newer brands. First, build a coherent set of distinctive assets and repeat them consistently. Then connect those assets with the category and customer situation the brand wants to own.",
          "A recognisable aesthetic without a category association can create admiration without commercial memory. A clear category message without distinctive cues can create understanding that belongs equally to several competitors.",
        ],
      },
      {
        id: "distinctive-assets",
        heading: "Distinctive assets give memory a handle",
        paragraphs: [
          "Distinctive assets are sensory cues that help people identify the brand. They can include colour combinations, symbols, type, shapes, sounds, characters, motion, phrases, image direction, or recurring formats.",
          "An asset becomes useful through distinctiveness and consistent use. A colour chosen because it feels appropriate may blend into the category. A recurring visual device linked strongly with the brand can shorten recognition time.",
          "Audit assets in context. Place social posts, website screens, proposals, and advertisements together. Cover the name and ask which pieces still feel attributable to the same source.",
        ],
        bullets: [
          "Is the cue easy to perceive at real viewing sizes?",
          "Does the cue differ from close competitors?",
          "Can the cue work across several formats?",
          "Has the cue been repeated long enough to become familiar?",
          "Is the cue connected with the intended category meaning?",
        ],
      },
      {
        id: "message-consistency",
        heading: "Message consistency gives repetition one direction",
        paragraphs: [
          "A brand needs more than a repeated tagline. It needs a stable message architecture: the category, customer tension, promise, difference, proof, and key themes should reinforce one another across touchpoints.",
          "The wording can adapt to context while the central meaning stays stable. A sales call can be conversational, a case study can be detailed, and a social post can be brief. Each should strengthen the same position.",
          "Content planning becomes easier when every idea has a role. Some pieces teach the category. Some name the customer situation. Some demonstrate proof. Some reinforce distinctive language. Together they compound.",
        ],
      },
      {
        id: "measure-brand-recall",
        heading: "How to measure brand recall with limited resources",
        paragraphs: [
          "Small businesses can begin with simple, repeatable research. Ask recent customers how they first described the business to another person. Ask prospects what they remember several days after a call. Ask light familiarity audiences which brands come to mind for a specific situation.",
          "Separate recognition prompts from recall prompts. Showing the logo measures a different memory task from asking someone to name a provider inside a category.",
          "Track the language people use. Repeated phrases can show which associations are becoming available. Large differences between intended and remembered language reveal where the system needs more clarity or repetition.",
        ],
        bullets: [
          "Unaided recall: Which brands come to mind for this category?",
          "Aided recognition: Which of these brands have you seen before?",
          "Message recall: What do you remember this brand saying?",
          "Asset attribution: Which brand do you connect with this visual cue?",
          "Category association: What situation would make you think of this brand?",
        ],
      },
      {
        id: "content-for-memory",
        heading: "Build content for memory",
        paragraphs: [
          "Begin with the association the business wants to earn. Then choose a small set of recurring content territories that repeatedly approach that association from different angles.",
          "Keep distinctive assets stable enough to become familiar. Use variation inside a recognisable frame. A recurring series, visual composition, phrase, or editorial structure can create continuity without making every piece identical.",
          "Give proof a recurring role. Claims are easier to remember when customers repeatedly see how the thinking appears in real work, decisions, or examples.",
        ],
      },
      {
        id: "when-awareness-is-still-useful",
        heading: "Where awareness still matters",
        paragraphs: [
          "Recall cannot develop without opportunities for exposure. Distribution, search presence, partnerships, public work, and regular publishing all create chances for the memory system to learn the brand.",
          "The distinction changes the goal of that exposure. The question becomes: which association should this appearance strengthen? That question turns visibility from an activity count into a memory programme.",
          "Awareness opens the door. Recognition helps the brand feel familiar. Recall helps it arrive when the customer needs the category.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the difference between brand awareness and brand recall?",
        answer:
          "Brand awareness describes familiarity with a brand. Brand recall is the ability to retrieve the brand from memory when given a category, need, or buying situation.",
      },
      {
        question: "Is brand recognition the same as brand recall?",
        answer:
          "No. Recognition happens when a person identifies a brand after seeing a cue. Recall happens when the person retrieves the brand without seeing the cue first.",
      },
      {
        question: "How can a small business improve brand recall?",
        answer:
          "Choose a clear position, repeat a small set of associations, use distinctive assets consistently, connect content with buying situations, and measure which ideas customers remember.",
      },
      {
        question: "Does posting more improve brand awareness?",
        answer:
          "More relevant exposure can increase familiarity. Memory quality depends on whether the appearances carry coherent cues, a clear category association, and a message worth retrieving.",
      },
      {
        question: "What are examples of distinctive brand assets?",
        answer:
          "Examples include colour combinations, symbols, type styles, shapes, sounds, characters, motion patterns, repeated phrases, image direction, and recurring content formats.",
      },
    ],
    relatedSlugs: [
      "brand-positioning-strategy-service-businesses",
      "brand-messaging-framework",
      "five-element-brand-strategy-framework",
    ],
  },
  {
    slug: "brand-messaging-framework",
    title: "Brand messaging framework: turn positioning into words people repeat",
    seoTitle: "Brand messaging framework",
    excerpt:
      "A five part messaging framework for turning a clear position into a promise, tension, difference, proof, and verbal identity.",
    directAnswer:
      "A brand messaging framework is a shared system for expressing the brand position across channels. It defines the customer tension, central promise, distinctive point of view, supporting proof, message hierarchy, and verbal identity so each touchpoint reinforces the same meaning.",
    element: "air",
    topicSlug: "brand-messaging",
    primaryKeyword: "brand messaging framework",
    secondaryKeywords: [
      "brand messaging strategy",
      "message architecture",
      "brand voice",
      "verbal identity",
      "brand messaging template",
    ],
    searchIntent: "Learn how to create a practical brand messaging framework.",
    publishedAt: "2026-08-06",
    updatedAt: "2026-08-06",
    readingTime: "12 min read",
    heroImage: "/images/generated/insights/messaging-framework-letterpress.webp",
    heroVideo: "/videos/generated/insights/messaging-framework-letterpress.mp4",
    heroImageAlt:
      "Blank message blocks arranged in a working hierarchy and aligned by one repeated brass cue",
    keyTakeaways: [
      "Messaging translates positioning into language for real touchpoints.",
      "A framework gives every channel a shared centre while allowing contextual variation.",
      "The strongest messages connect customer tension, promise, difference, and proof.",
      "Message hierarchy decides what appears first, rather than trying to say everything at once.",
      "Verbal identity gives the system a recognisable rhythm and vocabulary.",
    ],
    framework: {
      title: "The five part message architecture",
      introduction:
        "Each part answers a different customer question and gives content a clear role.",
      steps: [
        {
          title: "Tension",
          description:
            "Name the situation the customer already recognises.",
        },
        {
          title: "Promise",
          description:
            "State the change the brand is committed to creating.",
        },
        {
          title: "Difference",
          description:
            "Explain the choice that shapes how the work happens.",
        },
        {
          title: "Proof",
          description:
            "Support each claim with evidence the customer can examine.",
        },
        {
          title: "Voice",
          description:
            "Create a repeatable verbal character across every touchpoint.",
        },
      ],
    },
    sections: [
      {
        id: "what-a-messaging-framework-does",
        heading: "What a brand messaging framework does",
        paragraphs: [
          "A messaging framework turns positioning into a usable language system. It helps the website, proposals, sales conversations, social content, and delivery material express the same central idea without repeating one script.",
          "The framework creates boundaries. It tells the team which promise leads, which proof supports it, which themes deserve repetition, and which language belongs to the brand.",
          "Without that shared centre, every writer or channel solves the message again. The result may sound polished in separate places while the brand accumulates several competing identities.",
        ],
      },
      {
        id: "begin-with-positioning",
        heading: "Begin with positioning",
        paragraphs: [
          "Messaging cannot rescue an unresolved position. Before writing, define the category, customer situation, distinctive choice, and evidence behind the offer.",
          "Positioning decides what the business means. Messaging decides how that meaning is expressed, ordered, and adapted.",
          "A useful starting document can be brief: one paragraph for the position, one sentence for the customer tension, one sentence for the promise, one paragraph for the difference, and a list of verified proof.",
        ],
        callout: {
          label: "Writing rule",
          text:
            "When ten headlines seem equally possible, the missing decision usually sits upstream in positioning.",
        },
      },
      {
        id: "name-the-tension",
        heading: "1. Name the customer tension",
        paragraphs: [
          "The opening message should help the right customer recognise their situation. Recognition creates relevance before the brand asks for belief.",
          "Describe the tension through observable reality. A service business may be producing good work while sounding interchangeable. A founder may explain the value clearly in conversation while the website loses the distinction. A team may publish often while each channel teaches a different identity.",
          "The language should feel accurate rather than dramatic. Precision creates its own emotional force.",
        ],
      },
      {
        id: "state-the-promise",
        heading: "2. State the central promise",
        paragraphs: [
          "The promise describes the movement the brand helps create. It should be important to the customer, connected with the offer, and supported by the way the service actually works.",
          "Avoid promises that reach beyond the business control. A brand consultant can promise a clear position, message system, and decision framework. Market response involves many conditions beyond one engagement.",
          "Write the promise plainly first. Style comes later. A sentence that needs decoration to feel valuable usually needs a sharper idea.",
        ],
      },
      {
        id: "explain-the-difference",
        heading: "3. Explain the distinctive choice",
        paragraphs: [
          "Difference becomes credible when it names a choice inside the method. The brand may begin with research before design, specialise in a specific transition, combine disciplines in a useful order, or protect the customer from a common industry shortcut.",
          "Connect the choice with consequence. Explain how it changes understanding, experience, confidence, or the quality of the final system.",
          "The message should help a customer compare. Difference without a comparison frame can sound interesting while remaining difficult to value.",
        ],
      },
      {
        id: "organise-the-proof",
        heading: "4. Organise proof around claims",
        paragraphs: [
          "Build a proof library rather than one general proof section. Map work samples, case studies, process evidence, credentials, customer language, and verified outcomes to the claims they support.",
          "Place proof close to the claim. A reader should rarely have to remember a promise across several screens before seeing why it deserves belief.",
          "Use the strongest available evidence and name its limits honestly. Specificity creates trust without requiring inflated language.",
        ],
        bullets: [
          "Work samples show the quality and nature of the output.",
          "Case studies show reasoning, choices, and context.",
          "Process evidence shows how the promise becomes repeatable.",
          "Credentials show relevant preparation or depth.",
          "Customer language shows how value is experienced and described.",
        ],
      },
      {
        id: "create-message-hierarchy",
        heading: "Create a message hierarchy",
        paragraphs: [
          "Hierarchy decides which message appears first, which one explains it, and which proof follows. It protects the reader from receiving every idea at the same volume.",
          "A simple hierarchy contains a master message, three supporting messages, proof for each one, and a set of contextual messages for specific audiences or offers.",
          "The homepage may lead with the master message. A service page may lead with a supporting message. A proposal may begin with the customer tension discovered during the sales process. Each variation still belongs to the same architecture.",
        ],
      },
      {
        id: "build-verbal-identity",
        heading: "5. Build the verbal identity",
        paragraphs: [
          "Verbal identity gives the message a recognisable character. It includes point of view, sentence rhythm, vocabulary, metaphor boundaries, naming logic, and the relationship the voice creates with the reader.",
          "Choose traits that can guide an actual edit. Warm, expert, and clear are broad intentions. A stronger rule might be: explain the observation before naming the theory, use nouns before adjectives, and end with a decision the reader can make.",
          "Document examples and limits. A voice becomes easier to use when the guide shows how the same message changes across a homepage, email, proposal, and social post.",
        ],
      },
      {
        id: "turn-the-framework-into-content",
        heading: "Turn the framework into a content system",
        paragraphs: [
          "Each part of the messaging framework can create an editorial territory. Customer tensions create diagnostic pieces. The promise creates educational themes. Difference creates opinion. Proof creates case studies and process notes. Voice makes the whole library recognisable.",
          "Plan repetition at the idea level rather than the sentence level. The brand can revisit one central association through new examples, questions, and formats.",
          "A useful content calendar answers two questions for every piece: which part of the message does this strengthen, and which customer situation should make it relevant?",
        ],
      },
      {
        id: "review-the-system",
        heading: "Review the message in real use",
        paragraphs: [
          "Test the framework across the touchpoints that carry the most customer influence. Write the homepage opening, one service description, one proposal introduction, one social post, and one sales explanation.",
          "Watch for strain. If the message works only inside a polished headline, it may be too abstract. If every channel requires a different promise, the position may be too broad.",
          "Listen for language customers adopt naturally. Their phrasing can sharpen the system while the core position stays steady.",
        ],
      },
    ],
    faq: [
      {
        question: "What is included in a brand messaging framework?",
        answer:
          "A brand messaging framework usually includes positioning, customer tension, central promise, distinctive difference, proof points, message hierarchy, key themes, audience variations, and verbal identity guidance.",
      },
      {
        question: "What is the difference between brand voice and brand messaging?",
        answer:
          "Brand messaging defines what the brand needs to communicate. Brand voice defines the verbal character used to communicate it. One message can be expressed through several tones while still belonging to the same voice system.",
      },
      {
        question: "How many key messages should a brand have?",
        answer:
          "A focused system often begins with one master message and three supporting messages. The exact number depends on the offer structure and audience, but each message should have a clear role.",
      },
      {
        question: "Can one messaging framework work across every channel?",
        answer:
          "Yes, when the framework defines meaning and hierarchy rather than one fixed script. The expression can adapt to the context while the promise, difference, and proof stay coherent.",
      },
      {
        question: "How often should brand messaging be updated?",
        answer:
          "Review the framework when the position, audience, offer, category, or evidence changes. Refine wording through customer learning while preserving the central association long enough to build memory.",
      },
    ],
    relatedSlugs: [
      "brand-positioning-strategy-service-businesses",
      "brand-awareness-vs-brand-recall",
      "brand-audit-checklist-before-rebrand",
    ],
  },
  {
    slug: "five-element-brand-strategy-framework",
    title: "A five element framework for brand strategy",
    seoTitle: "Five element brand strategy framework",
    excerpt:
      "A diagnostic framework connecting positioning, customer experience, distinctiveness, messaging, and memory into one brand system.",
    directAnswer:
      "The five element brand strategy framework organises brand work into Earth for positioning, Water for customer experience, Fire for distinctiveness, Air for messaging, and Space for recognition and memory. The framework helps diagnose which part of the system is weak before choosing a design, content, or marketing response.",
    element: "space",
    topicSlug: "brand-memory",
    primaryKeyword: "brand strategy framework",
    secondaryKeywords: [
      "brand strategy elements",
      "brand strategy model",
      "brand framework",
      "five elements of branding",
      "brand system",
    ],
    searchIntent: "Understand a complete framework for diagnosing and building a brand.",
    publishedAt: "2026-07-20",
    updatedAt: "2026-08-06",
    readingTime: "11 min read",
    heroImage: "/images/generated/insights/five-element-strategy-instrument.webp",
    heroVideo: "/videos/generated/insights/five-element-strategy-instrument.mp4",
    heroImageAlt:
      "Five elemental material discs joined in brass around one open center",
    keyTakeaways: [
      "Brand problems become easier to diagnose when the system is separated into distinct jobs.",
      "Earth sets the position, Water shapes the experience, Fire earns attention, Air carries meaning, and Space builds memory.",
      "Each element changes the effectiveness of the others.",
      "The framework guides the order of work before money moves into execution.",
      "A coherent brand strengthens one recognisable meaning across many touchpoints.",
    ],
    framework: {
      title: "The five elements of the brand system",
      introduction:
        "Each element performs a different job. The brand becomes coherent when the decisions support one another.",
      steps: [
        {
          title: "Earth",
          description:
            "Positioning, category, audience, beliefs, and the foundation beneath expression.",
        },
        {
          title: "Water",
          description:
            "Customer journey, touchpoints, expectations, and the movement of the promise.",
        },
        {
          title: "Fire",
          description:
            "Distinctive assets, attention, expression, and the courage to become recognisable.",
        },
        {
          title: "Air",
          description:
            "Messaging, verbal identity, narrative, and the language that carries meaning.",
        },
        {
          title: "Space",
          description:
            "Consistency, recognition, mental availability, and what remains in memory.",
        },
      ],
    },
    sections: [
      {
        id: "why-use-a-brand-framework",
        heading: "Why use a brand strategy framework",
        paragraphs: [
          "A framework turns a vague feeling into a diagnosis. A business may say the brand needs more content, a new identity, or stronger marketing. Each request points toward a visible symptom. The cause may live somewhere else.",
          "Separating the brand into five jobs helps the business see which decision comes first. Weak positioning can make excellent content feel generic. A clear position with a fragmented customer journey can lose trust. Strong attention without memory can create activity that never compounds.",
          "The elements are a thinking system. They explain brand work through a structure people can remember while keeping the real decisions grounded in positioning, experience, distinctiveness, language, and memory.",
        ],
      },
      {
        id: "earth-positioning",
        heading: "Earth: positioning and foundation",
        paragraphs: [
          "Earth answers what the brand stands on. It includes category definition, audience psychology, competitive framing, beliefs, offer logic, and positioning.",
          "When Earth is weak, the business often describes capabilities rather than a clear choice. The website lists services, content moves between unrelated themes, and visual direction carries more responsibility than it should.",
          "Earth becomes stronger through research, decisions, and a position that guides tradeoffs. The result should make the business easier to explain before design begins.",
        ],
        bullets: [
          "Who receives the clearest value?",
          "Which category should customers use for comparison?",
          "What tension makes the offer relevant?",
          "Which distinctive choice shapes the method?",
          "What evidence supports the position?",
        ],
      },
      {
        id: "water-experience",
        heading: "Water: customer experience and touchpoints",
        paragraphs: [
          "Water follows the movement of the brand through a customer life. It includes discovery, enquiry, decision, onboarding, delivery, support, and return.",
          "When Water is weak, separate touchpoints may look polished while transitions feel abrupt. Expectations change between the website and proposal. The promise loses clarity as responsibility moves from one channel or person to another.",
          "Water becomes stronger through journey mapping, clear handoffs, experience principles, and a consistent relationship between promise and delivery.",
        ],
      },
      {
        id: "fire-distinctiveness",
        heading: "Fire: distinctiveness and attention",
        paragraphs: [
          "Fire gives the brand enough presence to be perceived. It includes distinctive assets, creative direction, category contrast, emotion, cultural relevance, and expression.",
          "When Fire is weak, the business may be clear yet visually and verbally interchangeable. When Fire grows without Earth, the brand can attract attention toward an idea it has never decided to own.",
          "Fire becomes stronger through a small set of recognisable cues and a creative point of view connected with the position.",
        ],
      },
      {
        id: "air-messaging",
        heading: "Air: messaging and verbal identity",
        paragraphs: [
          "Air carries the meaning from the business to another person. It includes message architecture, brand voice, narrative, naming, content strategy, and the language used across touchpoints.",
          "When Air is weak, the founder may explain the business clearly in conversation while the website sounds generic. Different channels develop different personalities, and customers struggle to repeat the value.",
          "Air becomes stronger when positioning is translated into a message hierarchy and a verbal identity with usable rules.",
        ],
      },
      {
        id: "space-memory",
        heading: "Space: recognition and memory",
        paragraphs: [
          "Space is what remains once the interaction ends. It includes recognition, consistency, brand salience, category association, equity, and mental availability.",
          "When Space is weak, the business can stay active while each appearance fades separately. The market sees the work without building a stable association with the name.",
          "Space becomes stronger through disciplined repetition, distinctive cues, consistent meaning, and enough time for memory to form.",
        ],
        callout: {
          label: "System insight",
          text:
            "Space cannot be designed directly. It emerges from what Earth, Water, Fire, and Air repeat together.",
        },
      },
      {
        id: "how-elements-affect-one-another",
        heading: "How the elements affect one another",
        paragraphs: [
          "The framework becomes useful at the intersections. Earth gives Fire a reason for attention. Water proves the promise through experience. Air helps the customer understand the choice. Space records the pattern over time.",
          "A change in one element creates consequences elsewhere. A new audience may require a revised category frame, different proof, adjusted touchpoints, and new language. A refreshed identity may require content templates and experience rules before it can become recognisable.",
          "Treat the brand as a connected system rather than a queue of separate deliverables.",
        ],
      },
      {
        id: "diagnose-the-weakest-element",
        heading: "Diagnose the weakest element",
        paragraphs: [
          "Begin with the business symptom, then trace backward. Wrong enquiries may point toward Earth or Air. Drop off during onboarding may point toward Water. Low recognition may involve Fire or Space. Inconsistent content may begin in Air while the underlying cause sits in Earth.",
          "Score each element through evidence. Review customer language, touchpoints, assets, sales questions, content, delivery documents, and memory cues.",
          "Choose the first intervention according to dependency. Foundation work usually precedes large expression work. Experience repair may need to happen before a promise receives more exposure.",
        ],
        bullets: [
          "Earth: Can the business state a clear position and audience situation?",
          "Water: Does the experience reinforce the promise at every important stage?",
          "Fire: Are there recognisable cues and a clear creative point of view?",
          "Air: Can another person explain the value after one reading?",
          "Space: Which association remains after the brand leaves the room?",
        ],
      },
      {
        id: "choose-the-order-of-work",
        heading: "Choose the order of brand work",
        paragraphs: [
          "The framework protects the business from beginning with the most visible deliverable. A logo, campaign, or content calendar can feel like progress because it produces output quickly. The correct first move depends on the diagnosis.",
          "Start with Earth when the category, audience, offer, or difference is unclear. Start with Water when the promise is clear and the experience breaks it. Start with Fire when the business is understood but interchangeable. Start with Air when the value exists but the language loses it. Strengthen Space through sustained use of the other four.",
          "The order should reduce rework. Every later decision gains clarity from the decisions beneath it.",
        ],
      },
      {
        id: "use-the-framework-over-time",
        heading: "Use the framework over time",
        paragraphs: [
          "A brand system changes as the business learns. Review the five elements during major offer changes, audience shifts, market entries, leadership transitions, or rebrands.",
          "Keep a record of decisions and evidence. Positioning assumptions, customer language, asset usage, experience friction, and recall patterns can show where refinement is needed.",
          "The aim is coherence rather than permanent sameness. A living brand can adapt while its central meaning becomes easier to recognise.",
        ],
      },
    ],
    faq: [
      {
        question: "What are the main elements of brand strategy?",
        answer:
          "A complete brand strategy usually covers positioning, audience, category, customer experience, distinctive assets, messaging, verbal identity, recognition, and memory. This framework groups those jobs into five connected elements.",
      },
      {
        question: "Which part of brand strategy should come first?",
        answer:
          "Positioning and audience decisions usually come first because they guide messaging, identity, experience, and content. A diagnosis may reveal an urgent experience issue that needs earlier attention.",
      },
      {
        question: "Is the five element framework a service list?",
        answer:
          "No. It is a diagnostic model for understanding how different parts of a brand system work together. A project can involve several elements at once.",
      },
      {
        question: "Can an established brand use this framework?",
        answer:
          "Yes. Established brands can use it to audit drift, protect existing equity, prepare a rebrand, review customer experience, or strengthen recognition.",
      },
      {
        question: "How often should a brand strategy be reviewed?",
        answer:
          "Review it when material business conditions change and during regular planning cycles. The central position can remain stable while evidence, expression, and touchpoints evolve.",
      },
    ],
    relatedSlugs: [
      "brand-positioning-strategy-service-businesses",
      "brand-audit-checklist-before-rebrand",
      "brand-awareness-vs-brand-recall",
    ],
  },
];

export function getInsightBySlug(slug: string) {
  return insightPosts.find((post) => post.slug === slug);
}

export function getInsightTopic(slug: string) {
  return insightTopics.find((topic) => topic.slug === slug);
}

export function getInsightsByTopic(topicSlug: string) {
  return insightPosts.filter((post) => post.topicSlug === topicSlug);
}
