import type { InsightPost } from "@/data/pillarInsights";

// The buying decision set — the highest intent question a service buyer
// types before choosing a strategist: what this work costs. Figures
// quoted for the practice come from the approved region aware price
// book in src/data/pricing.ts and nowhere else; market context stays
// structural rather than invented numbers, per the commercial honesty
// standard. Hero uses a spare original still from the insights v2
// shoot so the library keeps one photographic language.

export const pricingInsightPosts: InsightPost[] = [
  {
    slug: "how-much-does-brand-strategy-cost",
    title: "What brand strategy costs, and what decides the price",
    seoTitle: "How much does brand strategy cost in 2026? UK and US rates",
    excerpt:
      "Buyers comparing strategists meet quotes that differ by a factor of fifty with no explanation. This guide explains the market's price logic and publishes this practice's own starting figures.",
    directAnswer:
      "Brand strategy pricing in 2026 follows the seller's structure more than the work itself. Solo strategists typically open in the low four figures, boutique studios in the mid four to five figures, and large agencies in six figures, for engagements that overlap heavily in substance. At Branding Tatva a defined starting engagement begins at £1,950 in the United Kingdom and $2,800 in the United States, a full strategy engagement begins at £4,500 or $6,500, and ongoing direction begins at £1,100 or $1,500 monthly. Every figure is a published starting point; the final price follows scope, decided on a call.",
    element: "earth",
    topicSlug: "positioning",
    primaryKeyword: "how much does brand strategy cost",
    secondaryKeywords: [
      "brand strategy cost uk",
      "brand strategist fees usa",
      "brand strategy pricing 2026",
      "hire a brand strategist cost",
      "brand strategist vs branding agency price",
    ],
    searchIntent:
      "Compare real prices for brand strategy work and understand what drives the differences before hiring.",
    publishedAt: "2026-09-21",
    updatedAt: "2026-09-21",
    readingTime: "10 min read",
    heroImage: "/images/generated/insights-v2/consulting-positioning-aperture.webp",
    heroVideo: "/videos/generated/insights-v2/consulting-positioning-aperture.mp4",
    heroImageAlt:
      "A camera aperture ring beside a consulting worktable, the iris half open over a sheet of pricing notes",
    keyTakeaways: [
      "Quotes for near identical strategy work differ by a factor of fifty because buyers pay for the seller's structure: overheads, teams, and account layers, before any thinking happens.",
      "The deliverable that matters is a set of recorded decisions: category, audience, difference, message, and the codes that carry them. Everything else is presentation.",
      "A published starting price is a respect signal. A firm that hides every number is planning to price the client, and clients can feel it.",
      "The expensive failure is rarely the fee. It is paying twice: once for work that decided nothing, then again for the strategist who has to redo it.",
      "Ongoing direction beats a second project for most founders: the brand drifts monthly, so the correction works best monthly.",
    ],
    framework: {
      title: "The quote reading method",
      introduction:
        "Five questions that turn any brand strategy quote, at any price, into a comparable object. Ask them in order and the fog around pricing clears.",
      steps: [
        {
          title: "Decisions",
          description:
            "Which decisions does the engagement commit to on paper: category, audience, difference, message hierarchy? A quote that lists activities instead of decisions is priced air.",
        },
        {
          title: "Evidence",
          description:
            "What does the price include for finding out what buyers actually think: interviews, audits, competitor reads? Strategy without evidence is opinion with a fee.",
        },
        {
          title: "Author",
          description:
            "Who does the thinking, the person selling it or a junior three layers down? Large fees often buy the account structure around the work rather than the work.",
        },
        {
          title: "Artefacts",
          description:
            "What survives the engagement: a decision record the whole team can use, or a deck that reads well once? Ask to see a redacted example before signing.",
        },
        {
          title: "Aftermath",
          description:
            "What happens in month two? Brands drift the moment attention leaves; a plan for direction after delivery is worth more than a thicker deliverable.",
        },
      ],
    },
    sections: [
      {
        id: "why-the-quotes-differ-so-wildly",
        heading: "Why the quotes differ so wildly",
        paragraphs: [
          "Ask three providers for brand strategy and the quotes can span the low four figures to the mid six figures for engagements whose substance overlaps almost entirely. The variation confuses buyers because they assume price tracks the work. It mostly tracks the seller.",
          "A large agency's fee carries its building, its layers of account management, its pitch losses, and its team of specialists, each of whom touches the project briefly. A boutique carries a partner's attention and a small team. A solo strategist carries the thinking and little else. The decisions being made, which comparison to win, which buyer to serve, which difference to own, are the same decisions at every tier.",
          "So the useful question is never what does brand strategy cost. It is what structure am I paying for around the strategy, and does my stage need that structure. A funded scale up coordinating twelve markets may genuinely need the agency apparatus. A founder led business buying its first serious positioning almost never does.",
        ],
        callout: {
          label: "The pattern",
          text: "Price follows the seller's structure. Substance follows the strategist's attention. Buyers get to choose which one they fund.",
        },
      },
      {
        id: "what-you-are-actually-buying",
        heading: "What you are actually buying",
        paragraphs: [
          "Strip the packaging and a brand strategy engagement produces one thing of value: recorded decisions. The category the brand competes in. The buyer and the situations that trigger them. The difference worth remembering. The message hierarchy that carries it. The verbal and visual codes that make it recognisable. Each decision written down clearly enough that a designer, a writer, or a founder at midnight can act on it without a meeting.",
          "Everything else in a proposal, the workshops, the audits, the research interviews, exists to make those decisions well rather than by instinct. That work is real and worth paying for. The hundred page deck, the brand essence video, the mood films: presentation. Pleasant, occasionally useful for rallying a team, and the first thing to cut when a budget is finite.",
          "This gives buyers a clean test for any quote at any price: point to each line and ask which decision it serves. Lines that serve no decision are the margin.",
        ],
      },
      {
        id: "the-market-in-three-tiers",
        heading: "The market in three tiers",
        paragraphs: [
          "Published rate cards cluster into three recognisable tiers. Solo strategists and independent consultants generally open defined engagements in the low four figures, in pounds or dollars, rising with scope and seniority. This tier trades structure for attention: the person you evaluate is the person who does the work.",
          "Boutique studios, typically two to fifteen people, open in the mid four figures and run into five, adding design capacity and a second brain on the thinking. The strongest value in the market often lives here for businesses that need strategy and identity delivered together.",
          "Large and networked agencies start in the high five figures and routinely pass into six for a full strategy and identity programme. The premium buys coordination muscle, research departments, and the reassurance a board sometimes requires. It also buys the account layer, and founders who have worked both sides tend to describe that layer as the part they paid most for and used least.",
        ],
        bullets: [
          "Solo strategist: low four figures opening, the principal does the work.",
          "Boutique studio: mid four to five figures, strategy plus identity under one roof.",
          "Large agency: high five to six figures, apparatus a founder led business rarely needs.",
        ],
      },
      {
        id: "this-practices-published-figures",
        heading: "This practice's published figures",
        paragraphs: [
          "Branding Tatva publishes its starting prices, region by region, because a buyer comparing quotes deserves numbers before a call. Brand Beginning, the defined starting engagement, begins at £1,950 in the United Kingdom and $2,800 in the United States. Brand Clarity, the full strategy engagement, begins at £4,500 or $6,500. Brand Partnership, ongoing direction, begins at £1,100 or $1,500 monthly. Indian founders see the same book in rupees on the services page.",
          "Begins at is meant literally. A final price follows scope: how many offers need positioning, how much evidence gathering the situation demands, how much of the identity system needs rebuilding. The discovery call exists to settle scope, so the number quoted after it is a commitment rather than an estimate.",
          "The figures sit deliberately in the solo tier while the engagement structure, recorded decisions, evidence before opinions, artefacts a team can use, mirrors what the tiers above sell. That gap between structure funded and substance delivered is the position, stated as a price.",
        ],
        callout: {
          label: "Why publish prices",
          text: "A firm that hides every number is planning to price the client rather than the work. Buyers can feel it, and the best ones leave.",
        },
      },
      {
        id: "what-moves-a-price-up-or-down",
        heading: "What moves a price up or down",
        paragraphs: [
          "Scope drives price honestly in a few directions. Multiple audiences or offers multiply the positioning work, because each needs its own comparison decided. A crowded, look alike category demands more evidence gathering before the difference is found rather than asserted. An existing brand with equity to protect costs more care than a blank page, since every change risks recognition the business already paid for.",
          "Speed is the quiet multiplier. Compressed timelines force parallel work and midnight reviews, and any provider who absorbs that without charging for it is subsidising you towards a worse outcome.",
          "Then there are the wrong reasons prices rise: logo count inflation, deliverable padding, and workshop theatre. A second day of sticky notes rarely changes the decision; it changes the invoice. Buyers who hold the quote against the decision test from earlier stay immune to most of it.",
        ],
      },
      {
        id: "the-cost-of-buying-cheap-or-twice",
        heading: "The cost of buying cheap, and of buying twice",
        paragraphs: [
          "Below the solo tier sits a large market of logo packages and template branding, priced in the hundreds. For a business that only needs to look finished, that market is honest value. It becomes expensive the moment the business needs to be chosen, because a logo without a decided position leaves every later marketing decision unanchored, and the spend on those decisions compounds the drift.",
          "The most common expensive journey in this market runs: cheap identity first, eighteen months of marketing that repeats a position nobody decided, then a strategist hired to untangle it, then the identity redone to match the strategy. Each step was individually rational. The sequence costs more than starting with the thinking would have, and the lost time costs more than any invoice.",
          "The order of the work matters more than the tier you buy it from. Decide the position, then buy exactly as much expression as the position needs.",
        ],
      },
      {
        id: "how-to-choose-for-your-stage",
        heading: "How to choose for your stage",
        paragraphs: [
          "A pre revenue founder testing an idea rarely needs a strategy engagement at all: a clear one line position, a name that survives, and restraint will do until buyers exist to study. The moment real customers choose you for reasons you can only guess, the defined starting engagement earns its fee, because guessing is now costing sales.",
          "An established business with revenue, a team, and a website that undersells the work is the natural buyer of a full engagement: there is evidence to gather, equity to protect, and a system of touchpoints to align. And a business whose brand was decided but drifts, new pages off message, campaigns reinventing the voice, needs direction rather than another project. That is the monthly engagement's entire purpose: the brand drifts monthly, so the correction works best monthly.",
          "Whichever tier you buy from, insist on the published starting point, the decision list, and the artefact example before the call. Providers who welcome those questions are selling substance. Providers who deflect them are selling structure.",
        ],
      },
    ],
    faq: [
      {
        question: "How much does a brand strategist cost in the UK?",
        answer:
          "Independent strategists in the United Kingdom generally open defined engagements in the low four figures, with full strategy programmes reaching the mid four figures and beyond as scope grows. Branding Tatva's published UK starting points are £1,950 for the defined starting engagement, £4,500 for the full strategy engagement, and £1,100 monthly for ongoing direction, with final pricing settled by scope on a discovery call.",
      },
      {
        question: "How much does brand strategy cost in the USA?",
        answer:
          "United States pricing runs higher than the UK across every tier. Independent strategists commonly open in the mid four figures, boutiques in the high four to five figures, and large agencies from the high five figures upward. Branding Tatva's published US starting points are $2,800 for the defined starting engagement, $6,500 for the full engagement, and $1,500 monthly for ongoing direction.",
      },
      {
        question: "Why do agencies charge so much more for the same work?",
        answer:
          "The premium funds the structure around the thinking: account teams, specialist departments, offices, and the cost of pitches the agency lost. For multinational coordination that structure earns its keep. For a founder led business the decisions being bought, category, audience, difference, message, are the same ones an experienced independent records for a fraction of the fee, with the principal doing the work personally.",
      },
      {
        question: "Is brand strategy worth it for a small business?",
        answer:
          "Worth it once real buyers exist, rarely before. A business with customers choosing it for unclear reasons loses money daily to weak positioning: discounting to close, marketing that repeats nothing, a website explaining everything except why to choose you. Strategy fixes the reason buyers choose, which every later pound or dollar of marketing then compounds. Before real buyers exist, a clear one line position and restraint cost nothing and usually suffice.",
      },
      {
        question: "What should a brand strategy engagement include at any price?",
        answer:
          "Recorded decisions on category, audience, difference, and message; evidence gathering proportionate to the stakes, such as customer interviews and competitor reads; artefacts a team can act on without the strategist in the room; and a stated plan for what happens after delivery. A quote missing any of these is charging strategy prices for presentation.",
      },
    ],
    relatedSlugs: [
      "how-to-position-a-consulting-business",
      "brand-refresh-vs-rebrand-how-much-change",
      "brand-marketing-vs-performance-marketing",
    ],
  },
];
