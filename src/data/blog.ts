// Blog data, same pattern as projects.ts / faqs.ts / process.ts — a plain
// typed array, no CMS. The three posts below are a starting set: real,
// publishable writing (not lorem-ipsum filler, not invented case
// studies or client claims — each one only elaborates positioning
// already stated elsewhere on the site) rather than something visibly
// marked "placeholder" for real visitors to see. `startingSet` is an
// internal-only marker (never rendered) so Suman can tell these apart
// from posts she adds herself later; new posts can omit it entirely.

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  element: "earth" | "water" | "fire" | "air" | "space";
  publishedAt: string; // ISO date
  readingTime: string;
  startingSet?: boolean;
  // Body entries are paragraphs; an entry beginning "## " renders as a
  // section heading (and feeds the article's table of contents). The
  // starting-set posts stay heading-free; the pillar articles use them.
  body: string[];
  pullQuote?: string; // one sentence copied verbatim from `body` — never new copy, just a visual break
  // Answer-first key takeaways (manual guide p83) — rendered as an
  // "In brief" block before the article body.
  summary?: string[];
  // The article's ungated conversion asset (bible §15) — a working
  // checklist rendered in full at the end of the piece. Never gated:
  // the lead-capture rule is value first, email later.
  checklist?: { title: string; items: string[] };
};

export const blogPosts: BlogPost[] = [
  {
    slug: "five-elements-working-as-one",
    title: "Why brand strategy needs five elements working as one",
    excerpt:
      "Most brands are built with one or two elements working hard. The ones people remember are built with all five, working together.",
    element: "space",
    publishedAt: "2026-07-20",
    readingTime: "4 min read",
    startingSet: true,
    pullQuote: "Isolation is usually the actual problem a brand walks in with.",
    body: [
      "Ask most businesses what their brand needs and you'll get one answer: a logo, or a content calendar, or \"better marketing.\" Each of those is real work, but treated alone, each is also a symptom fix. A sharp logo on a business with no clear audience just makes the confusion look tidier.",
      "The elemental approach splits brand work into five parts that actually do different jobs. Earth is where a brand is grounded: purpose, audience, positioning, the research most brands skip because it's slower than picking a font. Water is how a brand moves through someone's day, the actual customer journey rather than the funnel diagram of it. Fire is what makes people look twice. Air is the language that carries all of it. Space is what's left once the noise settles, the part people actually remember.",
      "Most projects that come in asking for \"content\" are really missing Earth. Most projects asking for \"positioning\" already have Earth but have kept it trapped in the founder's own head, in a version of Air nobody outside the business can actually repeat. Naming the five separately does real diagnostic work: it tells you which part of the problem you're actually looking at before you spend money on the wrong one.",
      "Isolation is usually the actual problem a brand walks in with, whichever element it names first.",
    ],
  },
  {
    slug: "visible-versus-remembered",
    title: "The difference between visibility and being remembered",
    excerpt:
      "Being present differs from being recognised. That gap is usually a clarity problem, far more often than a visibility one.",
    element: "fire",
    publishedAt: "2026-07-13",
    readingTime: "3 min read",
    startingSet: true,
    pullQuote: "A message repeated inconsistently across five channels dilutes instead of compounding.",
    body: [
      "It's possible to post consistently, run ads, show up in every relevant search, and still fade from someone's memory. Visibility and recall measure two different things, even though most brand tracking treats them as one.",
      "Visibility asks: did someone see this? Recall asks something harder: a week later, without being shown it again, can they describe what it was and why it mattered to them? Most brands chase the first question hardest, because it's the one with a dashboard.",
      "The gap between the two is usually about clarity, rarely about volume. A message repeated inconsistently across five channels dilutes instead of compounding. A message repeated consistently, even at lower volume, is what actually earns a place in someone's memory rather than their scroll history.",
      "This is why \"post more\" is so often the wrong prescription. The real question is less about whether people are seeing the brand, and more about whether what they're seeing is specific enough, and consistent enough, to survive the moment after they look away.",
    ],
  },
  {
    slug: "what-a-brand-audit-actually-finds",
    title: "What actually happens in a brand audit",
    excerpt:
      "An audit first, finding exactly where the story stops holding together, before anything gets rebuilt, redesigned, or rewritten.",
    element: "water",
    publishedAt: "2026-07-06",
    readingTime: "4 min read",
    startingSet: true,
    pullQuote: "That's also why an audit has to come before a rebuild.",
    body: [
      "For a business that's already operating, the temptation is to skip straight to the fix: a new website, a rebrand, a content push. An audit exists to make sure that fix is actually aimed at the real problem, instead of the most visible symptom of it.",
      "In practice, that means going through every single place a customer actually meets the brand, the polished ones included. The website says one thing; the last ten social posts say something slightly different; the founder describes the business in a sales call in a third way entirely. Each one holds up fine alone. Stacked together, they conflict, and a customer piecing them together notices the seams even when they struggle to name what's off.",
      "The audit's job is to find exactly where that story stops holding together, and to be specific about it: less \"the brand feels inconsistent\" as a vague note, and more the actual sentence level and decision level places where it splits.",
      "That's also why an audit has to come before a rebuild. Redesigning a website on top of an unresolved positioning problem only dresses it up, the problem stays exactly where it was. Fixing the seam first means everything built afterward, the design, the content, the launch, is reinforcing the same story instead of adding one more version of it.",
    ],
  },
  {
    // Month one pillar article per the twelve month content plan
    // (bible §15): the positioning pillar's anchor piece, with its
    // conversion asset (the checklist) rendered ungated at the end.
    slug: "what-brand-positioning-actually-decides",
    title: "What brand positioning actually decides",
    excerpt:
      "Positioning is the decision beneath every other brand decision: which single idea should surface with your name. Here is what it settles, and what it costs to skip.",
    element: "earth",
    publishedAt: "2026-08-03",
    readingTime: "6 min read",
    pullQuote: "Media spend multiplies whatever exists beneath it.",
    summary: [
      "Positioning chooses the single idea a brand should own in a buyer's head, before any design work begins.",
      "It decides who you get compared against, what counts as expensive, and what every campaign has to keep repeating.",
      "Messaging flexes by channel and audience; positioning stays put underneath it. Confusing the two is the most common expensive mistake.",
    ],
    checklist: {
      title: "The positioning checklist",
      items: [
        "Name the single idea you want owned. One sentence, with zero commas doing extra work.",
        "List who you expect to be compared against, then check who buyers actually compare you with.",
        "Write the sentence you would want a customer to repeat to a stranger.",
        "Hold every current channel against that sentence and count the contradictions.",
        "Identify which buying moments should trigger your name, and which stay silent today.",
        "Cover the logo on your own homepage and ask what still identifies you.",
        "Find the claim a rival could never credibly sign. If every competitor could run your headline, it describes the category and the position is still unclaimed.",
        "Date the decision, and write down what would have to change before you revisit it.",
      ],
    },
    body: [
      "Every brand already holds a position; the only open question is who decided it. When a business skips the decision, the market makes it instead, usually by filing the brand under the nearest available cliché and moving on.",
      "## The decision beneath the decisions",
      "Positioning is the choice about which single idea should surface in a buyer's head when your name comes up. It sounds small, and it governs everything: the identity inherits it, the website argues it, campaigns spend money repeating it. Made deliberately, every later decision reinforces one meaning. Made by accident, the same budget buys a collection of unrelated first impressions.",
      "Three questions settle most of it. Which buying problem do you want to own? Who should lose the comparison when a buyer weighs you against their alternative? And which single sentence would satisfy you, overheard from a customer describing the business to a stranger?",
      "## What it actually decides",
      "The comparison set comes first. A practice positioned as a design studio gets compared with studios; positioned as a strategy practice, with consultancies at several times the price. The frame decides what expensive means before any pricing page loads.",
      "It also decides what gets designed. Distinctive assets only compound when they express one idea; a brand that keeps changing its mind visually is usually a brand that never made this decision verbally.",
      "And it decides what marketing can do. Media spend multiplies whatever exists beneath it. A clear position gets louder. A vague one gets expensively vaguer.",
      "## Positioning and messaging do different jobs",
      "Messaging flexes: warmer on social, plainer in a proposal, shorter in an ad. Positioning stays put underneath all of it. When a team rewrites the position every quarter and calls it messaging work, memory never accumulates, and the audience meets a new company each campaign.",
      "## When repositioning earns its cost",
      "Reposition when the business has genuinely changed shape: the offer moved upmarket, the buyer changed seats, the category split or collapsed. Hold steady when the position has merely become boring to the people inside the business. Internal fatigue arrives years before market fatigue, and most repositioning briefs are internal fatigue wearing a strategy costume.",
      "The checklist below is the working version used at the start of engagements here. It gives away the questions on purpose; the answers are where the real work lives.",
    ],
  },
  {
    // Month two pillar article (bible §15): the recognition pillar's
    // anchor. Its conversion asset is the already live Brand
    // Recognition Audit, which the article template surfaces at the
    // end of every pillar piece. Deliberately deeper than, rather than
    // a duplicate of, the earlier short post on visibility versus
    // recall — this one covers the mechanics: distinctive assets,
    // consistency compounding, mental availability.
    slug: "why-visible-brands-stay-forgettable",
    title: "Why visible brands stay forgettable",
    excerpt:
      "Forgettability is rarely a reach problem. It is a structure problem with mechanics: weak distinctive assets, inconsistent repetition, and narrow mental availability.",
    element: "space",
    publishedAt: "2026-08-03",
    readingTime: "5 min read",
    pullQuote: "Visibility gets you into the room once; memory keeps a seat reserved.",
    summary: [
      "Forgettability is a structure problem with mechanics: weak distinctive assets, inconsistent repetition, and narrow mental availability.",
      "Distinctive assets earn recognition that survives a covered logo. They grow through years of held signals, never through variety.",
      "Consistency is the compounding mechanism. The same budget spread across five looks buys five separate first impressions.",
    ],
    body: [
      "A brand can pass every visibility test, impressions up, feed active, ads delivering, and still leave nothing behind in the one place purchases start: memory. Forgettability is rarely a reach problem. It is a structure problem, and it has mechanics.",
      "## Memory does the buying",
      "Most purchase decisions begin before any search bar: someone remembers a name, then goes looking for confirmation. The brands that win that moment did their work months earlier, through repetition the buyer barely registered at the time. Visibility gets you into the room once; memory keeps a seat reserved.",
      "## The assets that survive a covered logo",
      "Distinctive assets are the colors, shapes, sounds, and phrases a brand owns so thoroughly that recognition survives with the logo covered. They get built by holding a small set of signals steady for years, which is exactly why committees struggle with them: variety feels like progress from inside the building and reads as noise from outside it. The test is blunt. Cover your logo on your own homepage and ask what still identifies you.",
      "## Consistency is the compounding mechanism",
      "A message repeated consistently compounds; the same budget spread across five looks and five voices buys five separate first impressions and zero accumulated memory. This is why rebrands driven by internal boredom, rather than a real change in the business, quietly reset years of recognition to zero.",
      "## Being thought of at all",
      "Mental availability is the share of buying situations in which your name surfaces unprompted. It widens as the brand attaches itself to more of the moments that trigger its category, and it narrows every time the brand goes quiet or shows up looking unfamiliar. Brands lose fewer deals to rivals than to simply going unthought of.",
      "The Brand Recognition Audit below runs this exact diagnosis on your own brand: positioning clarity, distinctive assets, verbal identity, recognition consistency. Five checks are open to anyone; run them before the next campaign spends money on being seen.",
    ],
  },
];
