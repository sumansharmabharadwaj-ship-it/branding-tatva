import type { InsightPost } from "@/data/pillarInsights";

// How long a rebrand takes — the last content gap from the organic leads
// keyword set. Strong informational intent, asked early in a buyer's
// research before any proposal exists. Grown from the seeded Quora
// answer (6 to 10 weeks for a single decision maker) into the full
// argument about why timelines compress or blow out.

type InsightResearchSource = {
  title: string;
  publisher: string;
  url: string;
  note?: string;
};

type SourcedInsightPost = InsightPost & {
  sources: InsightResearchSource[];
};

export const rebrandTimelineInsightPosts: SourcedInsightPost[] = [
  {
    slug: "how-long-does-a-rebrand-take",
    title: "How long does a rebrand take, and what actually sets the pace",
    seoTitle: "How long does a rebrand take? A realistic timeline, phase by phase",
    excerpt:
      "Every proposal quotes a number, and the number rarely explains itself. A rebrand's true length comes from four phases with different clocks, and from a variable most quotes never mention: how many people have to agree.",
    directAnswer:
      "A small service business with a single decision maker should expect six to ten weeks for a properly sequenced rebrand: two to three weeks for strategy and positioning, three to four for the identity system, and the remainder for rollout across the materials buyers actually meet. Each additional decision maker adds weeks, not days, because committees delay through revision cycles, not through slower work. A quote under two weeks is skipping strategy; a quote past six months for a small business usually signals unmanaged scope or unresolved decisions, not thoroughness.",
    element: "water",
    topicSlug: "customer-experience",
    primaryKeyword: "how long does a rebrand take",
    secondaryKeywords: [
      "rebrand timeline",
      "how long does rebranding take",
      "brand identity project timeline",
      "rebranding process length",
      "how long to rebrand a small business",
    ],
    searchIntent:
      "Estimate how long a rebrand should take before commissioning one, understand what determines the length, and recognise a quote that is unrealistically fast or unreasonably slow.",
    publishedAt: "2026-09-22",
    updatedAt: "2026-09-22",
    readingTime: "10 min read",
    heroImage: "/images/generated/insights-v2/brand-audit-five-layers.webp",
    heroImageAlt:
      "Translucent layered sheets of drawings pinned down in sequence over each other on a light table, each layer visible through the one above it",
    keyTakeaways: [
      "Six to ten weeks is the realistic range for a small business with one decision maker, split across strategy, identity, and rollout.",
      "The four phases run on different clocks: strategy is thinking time, identity is craft time, rollout is coordination time, and each compresses differently under pressure.",
      "Every additional decision maker adds weeks through revision cycles, not through slower work. A committee is a timeline variable most quotes never price in.",
      "A quote under two weeks is buying redecoration with the strategy skipped; a small business quoted past six months is usually paying for unmanaged scope.",
      "The switchover is the most underplanned phase: a half migrated brand costs more recognition than the delay of finishing it properly would have.",
    ],
    framework: {
      title: "The four phase clock",
      introduction:
        "A rebrand runs through four phases with genuinely different paces. Naming the clock each one runs on explains why the same project can take six weeks for one business and six months for another with an identical brief.",
      steps: [
        {
          title: "Strategy",
          description:
            "Two to three weeks of thinking time: research, positioning, the message hierarchy. Compresses poorly, because the decisions this phase makes are what every later phase executes.",
        },
        {
          title: "Identity",
          description:
            "Three to four weeks of craft time: the mark, colour, typography, image style, built as a governed system with usage rules rather than a folder of files.",
        },
        {
          title: "Approval",
          description:
            "Not a phase so much as a multiplier on the two before it. Each additional decision maker adds review rounds, and review rounds are where timelines actually slip.",
        },
        {
          title: "Rollout",
          description:
            "Coordination time: applying the system to every surface a buyer meets, on a planned schedule rather than as each asset happens to get updated.",
        },
        {
          title: "Switchover",
          description:
            "The moment every surface changes together: site, profiles, directories, signage. Planned as one event, or the business spends weeks looking like two different companies.",
        },
      ],
    },
    sections: [
      {
        id: "the-honest-range",
        heading: "The honest range",
        paragraphs: [
          "For a small service business with a single decision maker, six to ten weeks is the realistic length for a rebrand done in the right order. Strategy and positioning take two to three weeks. Identity design, built on that strategy, takes three to four. The remainder goes to rolling the new system across the materials a buyer actually meets: the site, proposals, social profiles, signage, whatever the business runs on.",
          "The range exists because the work genuinely varies within it, not because anyone is padding an estimate. A business with clean existing research and a decisive owner lands near six weeks. A business starting from nothing, with several stakeholders and a wide surface area to update, lands near ten. Both are honest numbers for the same scope of work.",
          "What sits outside the range deserves scrutiny in both directions. Two weeks buys artwork, not a rebrand: no time exists in that window for the strategy phase, so what looks fast is actually skipped rather than efficient. Six months for a small business, with no unusual complexity, is not thoroughness; it is scope that was never actually managed.",
        ],
        callout: {
          label: "The honest range",
          text: "Six to ten weeks, single decision maker. Faster means skipped strategy; much slower means unmanaged scope.",
        },
      },
      {
        id: "why-phases-have-different-clocks",
        heading: "Why the four phases run on different clocks",
        paragraphs: [
          "Strategy is thinking time, and thinking time compresses badly. Positioning work involves research, interviews sometimes, and decisions that need to survive contact with the business's actual constraints. Rushing this phase does not make the decisions arrive faster; it makes them arrive wrong, and a wrong decision discovered in week six of identity work costs far more than the extra week strategy would have taken.",
          "Identity is craft time, and craft time compresses moderately. A designer working from settled strategy moves faster than one guessing at direction, which is the real reason strategy first saves time overall rather than adding to the schedule. Even so, a governed system with variations and usage rules takes longer to build properly than a single logo file, and that difference is where cheap packages actually cut corners.",
          "Rollout is coordination time, and coordination time compresses well with planning and badly without it. The work itself, updating a website or reprinting signage, is not slow. What is slow is doing it as an afterthought, asset by asset, over months, instead of as a scheduled event.",
        ],
      },
      {
        id: "the-committee-tax",
        heading: "The committee tax",
        paragraphs: [
          "The single variable that moves a timeline more than any other is the number of people who must agree. This is not a comment on any particular business; multiple genuine stakeholders is a legitimate governance structure. It is a comment on what that structure costs in weeks, because most quotes price the work and stay silent on the review process the work has to survive.",
          "Each additional decision maker adds a round of revisions, and revisions run in series, not in parallel: round one surfaces disagreement, round two resolves half of it, round three catches what the first two missed. A single owner can approve strategy in a conversation. Three founding partners with different instincts can spend three weeks reaching the same conclusion a single owner reached in three days.",
          "The fix is not fewer stakeholders; it is naming, before the project starts, who actually holds the decision. A designated final approver who consults the others, rather than a group that must jointly agree at every stage, keeps the committee's judgment without paying its full timeline tax.",
        ],
        bullets: [
          "Name one final approver before strategy begins, even inside a founding team of equals.",
          "Set a maximum of two revision rounds per phase, agreed in advance, so open ended feedback does not become an open ended schedule.",
          "Book stakeholder review time on calendars up front. A round that waits three weeks for a diary slot adds three weeks to the project, not the review itself.",
        ],
      },
      {
        id: "the-switchover-trap",
        heading: "The trap nobody quotes for: the switchover",
        paragraphs: [
          "Most timelines end at handover, when the finished files arrive. The actual risk sits after that point, in what happens while the business updates everything the new identity touches. A rebrand rolled out asset by asset, over weeks or months, puts the old and new identity in front of buyers simultaneously: the old logo still on Google's listing while the new one sits on the homepage, the old colour on a signage that has not been reprinted yet.",
          "A half migrated brand does not read as a brand in transition. It reads as two different businesses, or as a mistake. The recognition cost of that overlap period can exceed the cost of the delay it would have taken to plan a coordinated switch.",
          "Budgeting the switchover as its own phase, with its own short list of every surface that needs to change and a single date they all change on, is the cheapest insurance in the entire project. It rarely needs to be long. It does need to be planned, which is different from being fast.",
        ],
        callout: {
          label: "The switchover rule",
          text: "Change every surface on one date. A staggered rollout spends recognition instead of building it.",
        },
      },
      {
        id: "reading-a-quoted-timeline",
        heading: "Reading a quoted timeline",
        paragraphs: [
          "A proposal's timeline is one of the more honest signals available before any work begins, because it reveals whether the quoting party has actually planned the project or is estimating from habit. Ask for the timeline broken into the same four phases: how long is strategy, how long is identity, how many review rounds are built in, and when the switchover happens.",
          "A vague single number, with no phase breakdown, usually means the phases were never separately planned, which tends to predict the same compression under pressure: strategy quietly shortened to make room for a deadline set before the scope was understood. A timeline that names its phases and its review structure is a timeline someone actually thought through.",
          "The honest question to ask any quote, regardless of price: what happens to this number if the client is slow to approve something. A proposal with a real answer has planned for the committee tax already. One without an answer will simply run over, and the business will absorb the slip as if it were unforeseeable.",
        ],
      },
    ],
    faq: [
      {
        question: "Can a rebrand be done faster than six weeks?",
        answer:
          "Only by compressing or skipping the strategy phase, since identity work genuinely needs settled decisions to build from. A faster timeline is sometimes the right trade for a business under real time pressure, but it should be a named trade rather than a hidden one: know specifically what got shortened, usually the depth of research or the number of positioning options explored, before agreeing to it.",
      },
      {
        question: "Why do rebrands for larger companies take so much longer?",
        answer:
          "Mostly the committee tax rather than more design work: more stakeholders, more departments whose materials need updating, and often legal or trademark review added to the sequence. The four phase clock still applies, just with each phase's approval step multiplied by the number of people and departments who must sign off.",
      },
      {
        question: "Should the old brand and new brand ever run at the same time?",
        answer:
          "Only briefly and only with a fixed end date, and ideally not at all. A planned overlap of days while the switchover completes is normal. An unplanned overlap of months, where some materials update quickly and others lag, spends recognition rather than protecting it and should be treated as a project risk to plan around, not an acceptable side effect.",
      },
      {
        question: "Does a rebrand timeline include the strategy work, or just the design?",
        answer:
          "It should include both, and a quote that only covers design time is quietly assuming the strategy either already exists or does not matter. If a business has not already settled its positioning in writing, that work belongs inside the timeline, priced and scheduled, rather than assumed as free or already done.",
      },
      {
        question: "What is the biggest cause of a rebrand running over schedule?",
        answer:
          "Open ended revision rounds, by a wide margin. Scope creep gets blamed most often, but the more common cause is a review process with no agreed limit: each round invites another round, because nobody defined when feedback stops and a decision starts. Capping rounds in advance, per phase, closes this gap before it opens.",
      },
    ],
    relatedSlugs: [
      "brand-refresh-vs-rebrand-how-much-change",
      "what-a-brand-identity-package-includes",
      "what-rebrand-backlashes-teach-about-brand-memory",
    ],
    sources: [
      {
        title: "Iron triangle (project management): scope, time, and cost",
        publisher: "Project Management Institute, A Guide to the Project Management Body of Knowledge (PMBOK Guide)",
        url: "https://www.pmi.org/pmbok-guide-standards",
        note: "The scope, time, and resource tradeoff framework behind the claim that compressing one phase forces cuts elsewhere, applied here to strategy versus identity time.",
      },
      {
        title: "Groupthink: psychological studies of policy decisions and fiascoes",
        publisher: "Houghton Mifflin, Irving Janis",
        url: "https://www.google.com/books/edition/Groupthink/9tXaAAAAMAAJ",
        note: "The foundational research on group decision dynamics behind the committee tax argument: more decision makers extend timelines through consensus seeking, not through slower individual work.",
      },
    ],
  },
];
