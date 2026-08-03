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
  {
    // Month three pillar article (bible §15): the verbal identity
    // pillar's anchor, with the voice worksheet as its ungated asset.
    slug: "verbal-identity-beyond-tone-of-voice",
    title: "Verbal identity beyond tone of voice",
    excerpt:
      "Tone is the smallest part of a verbal identity. The vocabulary, the claims, and the sentences only your brand would say do the heavier lifting.",
    element: "air",
    publishedAt: "2026-08-03",
    readingTime: "5 min read",
    pullQuote: "Language is the asset customers actually quote, and usually the least protected one.",
    summary: [
      "A verbal identity covers vocabulary, claims, rhythm, and refusals; tone is only the temperature it gets delivered at.",
      "The test of a voice document: three different writers produce copy that reads as one author.",
      "Language is the brand asset customers actually quote, and usually the least protected one.",
    ],
    checklist: {
      title: "The voice worksheet",
      items: [
        "List the twenty words your brand reaches for, pulled from a real month of published copy.",
        "List the words you refuse. An empty refusal list means the voice is unguarded.",
        "Write the one claim every page should be able to stake, and the proof it leans on.",
        "Collect five sentences only your brand would say. Delete any a competitor could sign.",
        "Describe the rhythm: short and declarative, long and patient, or something owned in between.",
        "Rewrite one paragraph from your site as a proposal, a caption, and an ad. Check what stayed constant.",
        "Hand the document to a writer who has never met you. Grade what comes back.",
      ],
    },
    body: [
      "Ask for a brand's voice guidelines and you usually receive three adjectives and a moodboard. Meanwhile the words themselves, the asset customers actually repeat to each other, get improvised one caption at a time.",
      "## Tone is the temperature, voice is the language",
      "Tone shifts by moment: warmer in support, plainer at checkout, shorter in an ad. Voice is what stays constant underneath, the vocabulary the brand reaches for, the words it refuses, the rhythm of its sentences, the claims it is willing to stake. Confuse the two and every channel owner ends up inventing a personality of their own.",
      "## What a working voice system contains",
      "Four layers earn their place in a real voice document. A vocabulary: the twenty words the brand owns and the twenty it bans. A claims register: what the brand asserts, with the proof each claim leans on. A rhythm: sentence length, punctuation habits, how a paragraph breathes. And refusals: the phrases, moods, and jokes the brand declines, written down so declining costs nothing at deadline.",
      "## The three writer test",
      "A voice document works when three different writers can produce copy that reads as one author. Anything short of that is decoration; guidelines loose enough to permit everything enforce nothing. Language is the asset customers actually quote, and usually the least protected one. Logos live in brand books while sentences get improvised weekly.",
      "## Where voice earns revenue",
      "Voice frames value before any claim lands. The same offer sounds assured or desperate depending on the sentence carrying it, and a distinctive sentence gets remembered whole: repeated in meetings, quoted in referrals, searched for verbatim. That is distribution the media budget never has to buy.",
      "The worksheet below is the starting frame used in voice engagements here. Fill it honestly and the gaps announce themselves.",
    ],
  },
  {
    // Month four pillar article (bible §15): repositioning readiness,
    // supporting the positioning cluster, with the readiness test as
    // its ungated asset.
    slug: "when-a-growing-business-needs-repositioning",
    title: "When a growing business needs repositioning",
    excerpt:
      "Growth quietly breaks positions. Here are the real signals a position no longer fits, the false alarms that mimic them, and a readiness test to run before any rebrand spend.",
    element: "earth",
    publishedAt: "2026-08-03",
    readingTime: "5 min read",
    pullQuote: "Repositioning is a business decision with design consequences, never a design decision with business hopes.",
    summary: [
      "Growth breaks positions quietly: the offer, the buyer, or the category changes shape while the story stays still.",
      "Internal boredom mimics every real signal, and it drives most premature rebrands.",
      "Repositioning is a business decision with design consequences, never a design decision with business hopes.",
    ],
    checklist: {
      title: "The repositioning readiness test",
      items: [
        "Name what changed in the business itself: offer, buyer, or category. An honest answer of nothing ends the exercise here.",
        "Check who you lose deals to now versus two years ago. A changed rival set is a changed category.",
        "Ask ten current customers what they bought. Compare their words against your homepage.",
        "Price the memory reset: list every asset the current position has earned, recognition included.",
        "Write the new position in one sentence before touching any visual. A sentence that refuses to come means the problem lives elsewhere.",
        "Confirm the founder can defend the new position in a sales call without slides.",
        "Set the revisit date: which measurable change, by when, would prove the move worked.",
      ],
    },
    body: [
      "Positions age in silence. A business keeps winning, the offer creeps upmarket, the buyer changes seats, and one day the website describes a company that no longer exists. Nobody decided this; growth did.",
      "## The real signals",
      "Three changes reliably break a position. The offer moved: what began as a service became a product, or the entry tier became the flagship. The buyer moved: the founder sold to founders, and now procurement signs. The category moved: it split, collapsed, or got redefined by a rival with better vocabulary. Each one changes who you get compared against, which is the position's whole job.",
      "## The false alarms",
      "Internal boredom mimics every real signal. The team has seen the homepage a thousand times; the market has barely seen it once. Falling win rates blamed on the brand often trace to pricing or product instead. And a new leader wanting a visible mark rarely counts as strategy. The inside of a business grows tired of its own story long before the market even learns it.",
      "## What repositioning actually costs",
      "The visible cost is design and rollout. The real cost is memory: every asset the old position accumulated, recognition included, gets partially reset. That trade can absolutely be worth making; it should simply be made knowingly, against real signals. Repositioning is a business decision with design consequences, never a design decision with business hopes.",
      "The readiness test below separates signal from restlessness. Score it honestly before any rebrand budget moves.",
    ],
  },
  {
    // Month five pillar article (bible §15): distinctive assets and
    // mental availability, supporting the recognition cluster, with
    // the asset inventory as its ungated asset.
    slug: "distinctive-assets-and-mental-availability",
    title: "Distinctive assets and mental availability",
    excerpt:
      "Two ideas explain most recognition: the assets a brand owns in memory, and the buying moments those assets get attached to. Build both on purpose.",
    element: "space",
    publishedAt: "2026-08-03",
    readingTime: "5 min read",
    pullQuote: "An asset the audience has to relearn every quarter is a cost, never an asset.",
    summary: [
      "Distinctive assets are the signals a brand owns in memory: color, shape, phrase, sound. They compound only while they stay put.",
      "Mental availability is how many buying moments those assets get attached to. Assets store the memory; moments retrieve it.",
      "The inventory below scores what you own today and where it actually surfaces.",
    ],
    checklist: {
      title: "The asset inventory",
      items: [
        "List every signal you repeat on purpose: colors, phrases, shapes, sounds, layouts.",
        "For each, ask ten customers to name the brand from the signal alone. Score the attributions.",
        "Mark which signals survived the last redesign, and which quietly changed.",
        "List the buying moments your category triggers, from daily habits to yearly decisions.",
        "Map each surviving asset to the moments where it actually appears today.",
        "Pick the two strongest assets and the two emptiest moments. That pairing is next quarter's brief.",
        "Write down what stays fixed for the next three years, and who guards it.",
      ],
    },
    body: [
      "Recognition runs on two gears. Distinctive assets store the brand in memory; mental availability decides how often that memory gets retrieved. Brands usually invest in one and wonder why the other stays weak.",
      "## What counts as an asset",
      "An asset is any signal the audience assigns to you without prompting: a color owned so completely the category concedes it, a phrase people finish for you, a label shape spotted across a shop, a sonic tail closing every video. The bar is attribution. When the audience sees the signal and names a rival, or names nobody, the signal is decoration. An asset the audience has to relearn every quarter is a cost, never an asset.",
      "## Attachment does the retrieving",
      "Availability grows by attaching those assets to buying situations: the Monday planning slot, the gift search, the quiet audit after a launch flops. Each attachment is a retrieval path. A brand with strong assets and one retrieval path is a beautifully labeled door on an empty street.",
      "## Building both on purpose",
      "The order matters. Choose few signals, hold them steady, then spend media attaching them to moments rather than announcing them in the abstract. Campaigns end; attachments persist. This is also the honest argument for consistency over novelty: novelty wins the meeting and loses the memory.",
      "The inventory below scores what you actually own. Run it with your last quarter of output open in a second window.",
    ],
  },
  {
    // Month six pillar article (bible §15): the brand architecture
    // pillar's anchor, with the architecture map as its ungated asset.
    slug: "brand-architecture-for-multiple-offers",
    title: "Brand architecture for multiple offers",
    excerpt:
      "Growth multiplies offers, and every new offer asks the same quiet question: does this live under the existing name or earn its own? Architecture answers by rule.",
    element: "earth",
    publishedAt: "2026-08-03",
    readingTime: "5 min read",
    pullQuote: "Every additional name divides the same attention budget.",
    summary: [
      "The default answer is one brand: every additional name divides the same attention budget.",
      "A second name earns its keep only when an offer would damage, or be damaged by, the parent's meaning.",
      "The map below walks the decision offer by offer, before any naming begins.",
    ],
    checklist: {
      title: "The architecture map",
      items: [
        "List every offer, current and planned, in one column.",
        "For each, write the damage outward: what it could do to the parent's meaning.",
        "Write the damage inward: what the parent's meaning does to it.",
        "Mark the offers with real damage in either direction. Only these earn naming conversations.",
        "For the rest, write the descriptive line: parent name plus a plain label.",
        "Check the buyer overlap between offers. Shared buyers argue for one roof.",
        "Decide who owns this rule going forward, so the next offer inherits a decision instead of a debate.",
      ],
    },
    body: [
      "Growth multiplies offers, and every new offer asks the same quiet question: does this live under the existing name or earn its own? Most businesses answer by mood. Architecture answers by rule.",
      "## One roof is the default",
      "A branded house, one name over everything, lets each offer strengthen the rest: the newsletter builds trust the flagship spends, the workshop feeds the retainer. Every additional name divides the same attention budget. Sub brands make sense at conglomerate scale and mostly make invoices at studio scale.",
      "## When a second name earns its keep",
      "Two tests justify a new name. Damage outward: the offer would contaminate the parent's meaning, a bargain line under a considered flagship. Damage inward: the parent's meaning caps the offer, a playful consumer product under a sober B2B name. Absent real damage in one direction, the new name is vanity with a trademark bill.",
      "## The middle paths",
      "Between the extremes sit endorsed brands, a new name carrying the parent's signature underneath, and descriptive sub lines, the parent's name with a plain label after it. Descriptive wins far more often than founders expect: audiences prefer learning one brand deeply over learning three shallowly.",
      "The map below runs the decision offer by offer. Score it before the naming workshop gets booked.",
    ],
  },
];
