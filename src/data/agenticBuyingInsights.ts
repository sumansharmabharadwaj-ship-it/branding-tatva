import type { InsightPost } from "@/data/pillarInsights";

// The question after the answer engines: when the customer sends an
// agent to do the buying, what is left for a brand to do? Written
// September 2026, as agentic checkout moved from demo to habit.

type InsightResearchSource = {
  title: string;
  publisher: string;
  url: string;
  note?: string;
};

type SourcedInsightPost = InsightPost & {
  sources: InsightResearchSource[];
};

export const agenticBuyingInsightPosts: SourcedInsightPost[] = [
  {
    slug: "brand-strategy-when-ai-agents-buy",
    title: "When the customer sends an agent: brand strategy for buying you never see",
    seoTitle: "Do brands matter when AI agents do the buying?",
    excerpt:
      "AI agents now compare, choose, and check out on their owners' behalf. The brands that survive that handoff are the ones already named in the instruction.",
    directAnswer:
      "Brands matter more, earlier, when an AI agent does the buying. The agent follows a brief written by a human, and everything the brand ever earned in that human's memory either enters the brief or stays home. A named brand becomes a constraint the agent obeys; an unnamed brand becomes a row in a comparison the agent settles on price and specs. Mental availability moves upstream to the moment of instruction, and the written record the agent reads mid task does the rest. The work is the same brand work as ever, with a harder deadline: be remembered before the brief is written, and be legible to the machine that carries it out.",
    element: "space",
    topicSlug: "brand-memory",
    primaryKeyword: "do brands matter when ai agents buy",
    secondaryKeywords: [
      "agentic commerce brand strategy",
      "ai shopping agents brands",
      "brand loyalty ai agents",
      "get chosen by ai agent",
      "agentic checkout marketing",
    ],
    searchIntent:
      "Understand how AI purchasing agents change brand strategy and what a business must do to keep being chosen when a machine executes the purchase.",
    publishedAt: "2026-09-18",
    updatedAt: "2026-09-18",
    readingTime: "11 min read",
    heroImage: "/images/generated/insights-v2/discovery-workshop-decision-table.webp",
    heroVideo: "/videos/generated/insights-v2/discovery-workshop-decision-table.mp4",
    heroImageAlt:
      "A table scattered with blank cards where only a few carry chosen material samples, the selection made with nobody at the table",
    keyTakeaways: [
      "An agent executes a brief a human wrote. Whatever the brand earned in that human's memory either enters the brief or stays home.",
      "A named brand is a constraint the agent obeys. An unnamed brand is a row the agent compares on price and settles without sentiment.",
      "Mental availability moves upstream: the buying moment that matters is the instruction, written before any shopping starts.",
      "Mid task, the agent trusts the written record: consistent listings, structured data, reviews, and terms it can parse.",
      "Loyalty survives the handoff only when the preference is worth dictating: a remembered reason the human writes into the brief.",
    ],
    framework: {
      title: "The instruction test",
      introduction:
        "Five questions decide whether a brand survives the handoff from human to agent. Run them against your own category before the agents arrive in force.",
      steps: [
        {
          title: "Presence",
          description:
            "Would your name appear in the brief your best customer writes? The instruction is the new shelf, and memory stocks it.",
        },
        {
          title: "Constraint",
          description:
            "Which preference would make a customer dictate you by name: an ingredient, a standard, a feeling worth insisting on?",
        },
        {
          title: "Record",
          description:
            "Audit what an agent reads mid task: listings, structured data, reviews, availability, terms. Inconsistency reads as risk and risk gets skipped.",
        },
        {
          title: "Comparability",
          description:
            "Strip your offer to specs and price, the way an agent will. Decide which difference survives that flattening, and document it.",
        },
        {
          title: "Loyalty",
          description:
            "Ask where the repeat purchase lives: in the human's standing instruction, or in an agent history one better offer overwrites.",
        },
      ],
    },
    sections: [
      {
        id: "the-buying-you-never-see",
        heading: "The buying you never see",
        paragraphs: [
          "The newest buyer in your category never visits your website, never watches your film, never feels your typography. It is an agent: software sent by a customer to compare, choose, and check out on their behalf. Adoption forecasts through 2026 have this style of buying roughly doubling, and the checkout rails for it are already live.",
          "The reflex reading says branding just lost its audience. The machine is immune to charm, so the contest collapses to price and specification, and every brand becomes a vendor row. Parts of the reflex are right: an agent comparing forty options flattens everything it touches into fields.",
          "The reflex misses where the decision actually happens. The agent did what it was told. Someone told it. The interesting question about agentic buying is never what the machine chose; it is what the human wrote in the brief.",
        ],
        callout: {
          label: "The reframe",
          text:
            "The agent is the courier of a decision, carrying a brief a human wrote. Brand strategy's new job is being in the brief.",
        },
      },
      {
        id: "the-brief-is-the-new-shelf",
        heading: "The brief is the new shelf",
        paragraphs: [
          "Every agentic purchase begins with an instruction: get me the usual toothpaste, book a decent hotel near the venue, find someone to redo our website before the funding round. Each instruction either names names or describes a category, and that difference decides everything downstream.",
          "Get me the Weleda one is a closed instruction. The agent obeys; rivals never enter the comparison. Get me a natural toothpaste is an open instruction, and the agent resolves it the way machines resolve things: by parsing listings, weighing prices, and settling on whatever scores best against the stated criteria. Sentiment plays no part, because the sentiment stayed home with the human.",
          "This is mental availability with the stakes raised. Strategists have argued for decades that buyers reach for the brand that surfaces first in a buying situation. Agents harden that from a tendency into a rule: the name that surfaces when the brief gets written is, very often, the name that gets bought. Everything after the brief is arithmetic.",
        ],
      },
      {
        id: "what-the-agent-reads",
        heading: "What the agent reads when the brief is open",
        paragraphs: [
          "When the instruction leaves room, the agent researches, and its research diet is narrower and stricter than any human's. It reads listings, prices, availability, structured data, review aggregates, return policies, and delivery terms. It weighs corroboration and recency. It treats a claim that appears once, on the seller's own page, as an assertion, and a claim echoed across independent sources as something closer to fact.",
          "Surveys of early agentic shopping keep finding the same pattern: a majority of consumers say they would let an agent switch brands for better value, and marketing leaders report the direct relationship with the customer thinning as agents mediate more of it. The soft advantages, familiarity at the shelf, the pleasant checkout, the persuasive page, evaporate in the handoff.",
          "What survives is the machine legible record. This is the same discipline the answer engines already demand, one register deeper: consistent naming everywhere, categories a parser can file, terms and proof written where software can read them, and reviews accumulating under one entity instead of five spellings of it.",
        ],
        bullets: [
          "Could a parser state your offer, price logic, and terms from your public pages alone?",
          "Do your reviews accumulate under one consistently named entity?",
          "Which claim about you appears somewhere beyond your control?",
          "What would an agent flag as risk: missing terms, thin availability, inconsistent listings?",
        ],
      },
      {
        id: "the-flattening",
        heading: "What flattening does to a differentiated offer",
        paragraphs: [
          "Reduce any offer to fields and most differences disappear. The consultancy's judgement, the retreat's atmosphere, the skincare line's texture: none of it serialises. An agent comparing on parseable fields will treat genuinely different offers as interchangeable, then break the tie on price. Commoditisation by parser is the real threat agentic buying carries.",
          "The counter is deciding, in advance, which difference survives serialisation, and making it a field. A guarantee with terms. A named method with a definition. A certification, a response time, a scope written as a number. Differences that live as adjectives die in the handoff; differences that live as commitments travel.",
          "And the differences that refuse to serialise, the taste, the trust, the feel, have exactly one route into the transaction: the human names you because of them. Which returns everything to the brief.",
        ],
        callout: {
          label: "The rule",
          text:
            "Adjectives die in the handoff. Commitments travel. Feelings only travel inside your name.",
        },
      },
      {
        id: "loyalty-after-the-handoff",
        heading: "Loyalty after the handoff",
        paragraphs: [
          "Repeat business used to live partly in habit: the reorder from history, the default from familiarity. Agents inherit those histories, and an agent's history is loyal to nothing; a better parsed offer overwrites it without ceremony. Loyalty that lived in friction, in the customer never bothering to compare, is the first casualty of a tireless comparer.",
          "What survives is dictated preference: the standing instruction that names you. Always book with the same studio. Order the usual from the usual place. That kind of loyalty is scarcer and stronger, because it was chosen consciously enough to be written down.",
          "Earning a dictated preference is old fashioned brand work: a remembered difference, a reason the customer can articulate, an experience worth insisting on. The agents simply remove the soft middle where an unremarkable brand could survive on inertia.",
        ],
      },
      {
        id: "what-a-service-business-does",
        heading: "What a service business does about it",
        paragraphs: [
          "Agentic buying reaches services later than toothpaste, but the sequence is already visible: agents book travel, schedule appointments, assemble shortlists of firms for a human to approve. The shortlist assembly is the moment that matters, and it runs on the same record the answer engines read.",
          "The preparation is concrete. Hold one name and one description everywhere. Publish scope, process, and terms in plain, parseable language. Keep proof and reviews accumulating under your entity. Attach your name to the situations that trigger your category, so the humans writing briefs write you into them. Every piece of this compounds with the AEO work, because the agent and the answer engine read the same web.",
          "Then keep doing the part machines will never do: give the humans a reason to dictate you. The agent handles the comparing. The brand's job, now with no soft middle left, is to be beyond comparison before the brief is written.",
        ],
      },
    ],
    faq: [
      {
        question: "Will AI agents make brands irrelevant?",
        answer:
          "The opposite, with a redistribution. Brands lose their power over the comparison, because agents compare without sentiment. Brands gain everything at the instruction, because a name written into the brief bypasses the comparison entirely. Weak brands that survived on shelf habit lose; remembered brands with dictated preferences win more totally than before.",
      },
      {
        question: "How does a brand get chosen by an AI shopping agent?",
        answer:
          "Two routes. Be named in the instruction, which is earned in human memory long before the purchase. Or win the open comparison, which is earned in the written record: consistent entity, parseable terms, corroborated claims, healthy reviews, clean availability. Most businesses need both, and the second route is the same work answer engine presence already demands.",
      },
      {
        question: "Does agentic commerce only affect product businesses?",
        answer:
          "It arrives there first, because products serialise easily. Services follow through shortlist assembly: agents already gather candidates, compare stated scope and proof, and hand a human three names. Being one of the three runs on the machine legible record; being the one dictated in advance runs on memory.",
      },
      {
        question: "What happens to loyalty programmes when agents shop?",
        answer:
          "Points and habit hold least well, because an agent recalculates every purchase and a slightly better offer overwrites history. Loyalty survives as dictated preference: the customer instructs the agent to stay with you by name. That is earned by a difference worth insisting on, and it is worth auditing which of your current retention levers would survive being recalculated.",
      },
      {
        question: "Should a small business prepare for agentic buying now?",
        answer:
          "The preparation is free of regret either way. One consistent entity, parseable terms and proof, reviews under one name, and a claim attached to real buying situations serve human buyers, answer engines, and agents alike. The businesses caught out will be the ones whose advantage lived entirely in the soft middle: the pleasant page, the familiar shelf, the uncompared reorder.",
      },
    ],
    relatedSlugs: [
      "how-ai-assistants-choose-brands-to-recommend",
      "brand-marketing-vs-performance-marketing",
      "distinctive-brand-assets-audit",
    ],
    sources: [
      {
        title: "Agentic commerce: redefining loyalty",
        publisher: "Merkle",
        url: "https://www.merkle.com/en/merkle-now/articles-blogs/2026/agentic-commerce-redefining-loyalty.html",
        note:
          "Analysis of agent mediated buying's effect on loyalty, including marketing leaders reporting a thinning direct relationship with customers.",
      },
      {
        title: "AI trends shaping agentic commerce",
        publisher: "commercetools",
        url: "https://commercetools.com/blog/ai-trends-shaping-agentic-commerce",
        note:
          "Adoption projections for agent driven purchasing through 2026, the doubling this guide cites.",
      },
      {
        title: "Consumer demand for AI shopping is forming fast, but trust for agentic commerce is still catching up",
        publisher: "Checkout.com",
        url: "https://www.checkout.com/newsroom/consumer-demand-for-ai-shopping-is-forming-fast-but-trust-for-agentic-commerce-is-still-catching-up",
        note:
          "Survey evidence that a majority of consumers would allow an agent to switch brands for better value, the willingness this guide's loyalty argument starts from.",
      },
    ],
  },
];
