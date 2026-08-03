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
  {
    // Month seven pillar article (bible §15): the psychology pillar's
    // anchor — the four buyer mechanisms and the brand decision each
    // informs, with the decision prompts as its ungated asset. The
    // clinical psychology reference is real (see data/about.ts).
    slug: "how-psychology-informs-brand-strategy",
    title: "How psychology informs brand strategy",
    excerpt:
      "Attention, association, memory, choice: four mechanisms every buyer runs on, and the brand decision each one informs.",
    element: "water",
    publishedAt: "2026-08-03",
    readingTime: "6 min read",
    pullQuote: "Memory is the only place a brand actually lives.",
    summary: [
      "Brand strategy borrows its mechanics from psychology: attention decides what gets seen, association decides what it means, memory decides what survives, choice decides what gets bought.",
      "Each mechanism maps to a specific brand decision, from asset selection to defaults.",
      "The prompts below put the four mechanisms to work on your own brand.",
    ],
    checklist: {
      title: "The decision prompts",
      items: [
        "Name the exact second of first encounter, and list what else competes inside it.",
        "Write the three associations your category hands you free of charge. Decide which to keep.",
        "Identify the feeling your brand gets encoded with. Bored counts as a feeling.",
        "Check what your buyer would say about you from memory alone, phone away.",
        "List the shortcuts in your category: the defaults, the safe picks, the names people justify afterward.",
        "Find the moment your buyer settles for the first acceptable option, and ask what would make you that answer.",
        "Pick one mechanism your current plan ignores. That gap is usually the cheapest win available.",
      ],
    },
    body: [
      "Strategy documents love the word audience and rarely mention the machinery an audience runs on. Every buyer processes a brand through the same four mechanisms: attention, association, memory, choice. Each one informs a different decision, and a skipped mechanism usually explains an underperforming decision.",
      "## Attention is triage",
      "Attention is ruthless triage, tuned for change and relevance. A brand earns it by being distinct at the exact moment of encounter, which makes it a placement and asset question long before it becomes a message question. The feed teaches this daily: the scroll pauses for pattern breaks, never for effort.",
      "## Association is inherited before it is built",
      "Nothing arrives neutral. The category hands you meanings, the price point hands you meanings, the typeface hands you meanings a culture assigned decades ago. Semiotics is the discipline of reading that inheritance before accepting it. Positioning then chooses which associations to keep, which to fight, and which to quietly borrow.",
      "## Memory is the asset ledger",
      "Memory keeps whatever got encoded with feeling and repetition, and discards the rest without apology. Memory is the only place a brand actually lives. This is why consistency beats intensity: a modest signal repeated for years outlasts a spectacular one shown twice.",
      "## Choice runs on shortcuts",
      "Real buyers settle: they pick the first acceptable option that comes to mind, then justify it afterward. Defaults, familiarity, and social proof carry more weight than comparison tables. A brand that becomes the easy, safe, remembered answer wins deliberations it never has to enter.",
      "The prompts below come from the clinical side of this practice: questions that surface the mechanism before the decision gets made.",
    ],
  },
  {
    // Month eight pillar article (bible §15): evaluating a branding
    // proposal — deliberately including this practice's own proposals
    // in its scope, per the transparency principle. The comparison
    // sheet is its ungated asset.
    slug: "how-to-evaluate-a-branding-proposal",
    title: "How to evaluate a branding proposal",
    excerpt:
      "Most branding proposals get judged on chemistry and price. A better read takes twenty minutes and six questions, and it works on proposals from this practice too.",
    element: "air",
    publishedAt: "2026-08-03",
    readingTime: "5 min read",
    pullQuote: "A proposal that prescribes before examining is selling inventory.",
    summary: [
      "Judge the diagnosis before the deliverables: a proposal that prescribes before examining is selling inventory.",
      "Verify the evidence policy: real outcomes labeled as real, concept work labeled as concept.",
      "The comparison sheet below works on any proposal, this practice's included.",
    ],
    checklist: {
      title: "The proposal comparison sheet",
      items: [
        "Diagnosis: does the proposal describe your specific situation, or any client's?",
        "Decision: which single decision does the work claim to settle?",
        "Evidence: are outcomes real and labeled, with concepts marked as concepts?",
        "Process: what gets documented, and what do you hold if it ends early?",
        "Voice: does the proposal itself read like the clarity it promises?",
        "Boundaries: what does the practitioner decline to do, and do they say so unprompted?",
        "Price: what does the number buy at the decision level, deliverables aside?",
      ],
    },
    body: [
      "Branding proposals get judged on the two things easiest to compare: chemistry and price. Both matter, and both say little about whether the work will hold. The better read takes twenty minutes, and it works on any proposal, including one from this practice.",
      "## Read the diagnosis first",
      "The deliverables page is inventory; the diagnosis page is judgment. A proposal that prescribes before examining is selling inventory. Look for evidence the practitioner understood your specific situation: your buyer, your comparison set, the decision your business actually faces. Generic diagnosis predicts generic work at any price.",
      "## Check the evidence policy",
      "Honest practices label their proof. Real client outcomes come with real numbers and named sources; concept work says concept; illustrative projections say illustrative. A proposal that blurs these lines on its own behalf will blur them on yours.",
      "## Weigh process against promises",
      "Outcomes in branding depend on execution the practitioner rarely controls, so grand outcome promises deserve suspicion, and clear process commitments deserve weight: what gets decided, what gets documented, what you hold at the end. Ask which artifact survives if the relationship ends at each stage.",
      "## Price against decision, never against deliverables",
      "Two proposals with identical deliverable lists can differ five times over in value, because the value lives in which decisions get made and how well. Compare the decision each proposal claims to settle. The cheapest proposal that settles the wrong decision is the most expensive option on the table.",
      "The sheet below turns this into columns. Fill it for every proposal you are weighing, this practice's included.",
    ],
  },
  {
    // Month nine pillar article (bible §15): category reframing walked
    // through a real, clearly labeled Tatva Lab concept. The Lab
    // dossiers on the Work page are the article's living asset; the
    // exercise below is the take-home version.
    slug: "category-reframing-a-concept-case-study",
    title: "Category reframing: a concept case study",
    excerpt:
      "A category is an argument everyone forgot they were making. Here is the reframing move, walked through a labeled Branding Tatva Lab concept.",
    element: "earth",
    publishedAt: "2026-08-03",
    readingTime: "5 min read",
    pullQuote: "A category is an argument everyone forgot they were making.",
    summary: [
      "Every category carries a buried assumption its members repeat without noticing. Reframing names it and argues the opposite.",
      "The Deodar Lab concept reframes wellness retreats from escape to return: calm that survives the drive home.",
      "The exercise below runs the same move on your own category. Concept work stays labeled as concept, here and everywhere.",
    ],
    checklist: {
      title: "The reframing exercise",
      items: [
        "Write the sentence every competitor in your category would agree to. That sentence is the frame.",
        "Name the assumption buried inside it, the thing nobody argues because nobody notices it.",
        "Argue the opposite in one sentence, and check whether a real customer frustration backs you up.",
        "List what the new frame makes expensive, cheap, urgent, or irrelevant.",
        "Test the name, the voice, and the imagery against the new frame. Whatever fits the old frame goes.",
        "Find the proof the reframe demands. A frame without evidence is a slogan.",
        "Decide what you would have to stop selling. A reframe that costs nothing changes nothing.",
      ],
    },
    body: [
      "Every category runs on an argument its members stopped noticing. Wellness retreats argue that rest requires escape. Skincare argues that skin is a problem awaiting correction. Heritage food argues that tradition is best sold as nostalgia. A category is an argument everyone forgot they were making, and reframing begins by writing it down.",
      "## The move, in the open",
      "The Branding Tatva Lab exists to rehearse this move in public, on concepts clearly labeled as concepts. The Deodar study, a Himalayan wellness retreat, starts from the category's buried claim: leave your life to find yourself. Every competitor opens with the same infinity view and the same promise of disappearance.",
      "## Arguing the opposite",
      "Deodar positions against escape entirely: a retreat that returns you to your life rather than out of it. The promise becomes usable calm, the kind that survives the drive home. Notice what the reframe does mechanically: it changes the comparison set from other retreats to the guest's own ordinary week, and it makes the category's signature imagery, the infinity pool at golden hour, look like the wrong answer.",
      "## What the frame decides downstream",
      "Once the frame moves, every decision inherits it. The name becomes a local cedar instead of a Sanskrit virtue. The voice describes what happens instead of what awakens. Booking reads as arrival rather than checkout. None of these are style choices; they are the argument, repeated in different materials.",
      "## The honest boundary",
      "Deodar is a concept, and says so everywhere it appears. That label is the point: the reframing move can be demonstrated fully without inventing a client to have done it for. The full dossier, with the rejected names and the measurement plan, lives on the Work page under Tatva Lab.",
      "The exercise below runs the same move on your own category. It works best done in writing, with a competitor's website open beside yours.",
    ],
  },
  {
    // Month ten pillar article (bible §15): market pricing, consistent
    // with the live price book and its transparency note. Zero numbers
    // in the article itself — the live book on Services is the source
    // of truth, linked rather than duplicated.
    slug: "pricing-brand-strategy-across-markets",
    title: "Pricing brand strategy across markets",
    excerpt:
      "Why the same engagement carries different prices in different markets, why currency conversion is the wrong tool, and what a final quotation actually depends on.",
    element: "air",
    publishedAt: "2026-08-03",
    readingTime: "4 min read",
    pullQuote: "A converted price imports another market's assumptions and calls them yours.",
    summary: [
      "Prices differ by market because scope expectations, local anchors, and delivery norms differ, well beyond exchange rates.",
      "A price book beats live conversion: each market gets a price built for it. A converted price imports another market's assumptions and calls them yours.",
      "The final quotation always follows the discovery conversation, because scope is a finding, never a preset.",
    ],
    checklist: {
      title: "The scope explainer",
      items: [
        "Ask what the engagement decides, before what it delivers. Decisions are the unit of value.",
        "Check which market anchor the price answers to: local alternatives, local salaries, local norms.",
        "Confirm what the number excludes: taxes, production, media, printing, development, licensing.",
        "Ask what changes the number: more decision makers, more offers, more markets, more rounds.",
        "Ask what happens between paying and receiving: the stages, the checkpoints, the artifacts.",
        "Get the boundary in writing: where this engagement ends and the next one would begin.",
      ],
    },
    body: [
      "Ask why the same branding engagement costs differently in London, Toronto, and Delhi, and the honest answer runs deeper than exchange rates. Markets differ in what a project includes by default, what the local alternatives cost, and what a fair professional rate means where the buyer lives. A price is a sentence in a local language.",
      "## Why conversion is the wrong tool",
      "Running one home price through a currency converter feels neutral and is anything but. A converted price imports another market's assumptions and calls them yours: its scope norms, its competitive set, its idea of expensive. A price book, one deliberate price per market, treats each market as a real place instead of a decimal shift.",
      "## What this practice does",
      "The Services page carries exactly that: a predefined price book per market, detected from location and always overridable by hand, with a plain transparency note underneath. Prices are shown as where projects begin, because the final quotation follows the discovery conversation. Scope is a finding, never a preset.",
      "## What moves a quotation",
      "The variables are boringly concrete: how many offers the brand carries, how many decision makers need to align, how many markets the work must survive in, and how much existing material can be kept versus rebuilt. None of these are visible before a real conversation, which is the entire argument for having one before a number gets final.",
      "The explainer below is the set of questions worth asking any practice about any price, this one included.",
    ],
  },
  {
    // Month eleven pillar article (bible §15): documenting brand
    // decisions, with the decision record template as its asset.
    slug: "how-to-document-brand-decisions",
    title: "How to document brand decisions",
    excerpt:
      "An undocumented decision gets remade every quarter by whoever is loudest. The fix is a one-page record, written the day the decision lands.",
    element: "space",
    publishedAt: "2026-08-03",
    readingTime: "4 min read",
    pullQuote: "An undocumented decision gets remade every quarter by whoever is loudest.",
    summary: [
      "Brands drift because decisions live in memory and memory changes staff. An undocumented decision gets remade every quarter by whoever is loudest.",
      "A decision record is one page: the decision, the reasons, the rejected alternatives, and the revisit condition.",
      "Rejected alternatives are the most valuable field: they stop old debates from being reopened as new ideas.",
    ],
    checklist: {
      title: "The decision record template",
      items: [
        "The decision, in one sentence a new hire could act on.",
        "The date, and who made the call.",
        "The reasons, as they actually were, politics included.",
        "The alternatives considered, and why each lost.",
        "What the decision rules out from now on.",
        "The revisit condition: which measurable change would reopen it.",
        "Where the record lives, and who keeps the set.",
      ],
    },
    body: [
      "Brands rarely break in one decision. They drift, meeting by meeting, as choices made two years ago get quietly remade by people who never heard the original reasons. An undocumented decision gets remade every quarter by whoever is loudest, and the brand pays in consistency, the one currency it cannot print more of.",
      "## One page, written the same day",
      "A decision record is deliberately small: the decision, the date, the reasons, the alternatives that lost, and the condition that would reopen the question. It gets written the day the decision lands, while the reasons are still true instead of remembered. Ten of these pages outperform any brand book at keeping a brand coherent.",
      "## The field that pays rent",
      "Rejected alternatives are the record's most valuable field. Every mature brand carries a graveyard of ideas that were considered and declined for good reasons, and without records that graveyard gets excavated annually as fresh thinking. Writing down why the playful name lost saves the meeting where it almost wins.",
      "## The revisit condition",
      "The record also protects against the opposite failure, decisions frozen past their usefulness, by naming its own expiry test: which measurable change in the business would reopen the question. That single line separates commitment from stubbornness. Between records, the site you are reading applies the same rule to itself; every section carries its reasoning in writing.",
      "The template below is the working format. One page per decision, kept where the next person will actually look.",
    ],
  },
  {
    // Month twelve pillar article (bible §15): the annual review,
    // whose working asset is the live Brand Health Check on Services.
    slug: "the-annual-brand-health-review",
    title: "The annual brand health review",
    excerpt:
      "Brands drift by inches, and inches compound. A yearly review catches the drift while it is still cheap to correct: here is the working agenda.",
    element: "water",
    publishedAt: "2026-08-03",
    readingTime: "4 min read",
    pullQuote: "Brands drift by inches, and inches compound.",
    summary: [
      "Brands drift by inches, and inches compound. An annual review catches drift while correction is still cheap.",
      "The review checks four ledgers: position, assets, voice, and availability, each against what actually shipped this year.",
      "The Brand Health Check on the Services page runs the short version in about a minute; the agenda below runs the full one.",
    ],
    checklist: {
      title: "The annual review agenda",
      items: [
        "Reread last year's positioning sentence, then your ten most recent pieces of output. Count the contradictions.",
        "Rerun the covered logo test on your homepage, your packaging, and your last campaign.",
        "Pull the decision records made this year. Check which got honored and which got quietly remade.",
        "List the buying moments you gained and lost this year. Availability moves in both directions.",
        "Read three real customer messages aloud. Compare their vocabulary with yours.",
        "Score the drift honestly, then choose the one correction with the highest compounding return.",
        "Date next year's review before closing this one.",
      ],
    },
    body: [
      "Nobody decides to let a brand slide. The slide is made of reasonable exceptions: the campaign that bent the palette, the hire who never read the voice document, the offer that shipped before the architecture question got asked. Brands drift by inches, and inches compound. The annual review exists to price the inches while they are still cheap.",
      "## Four ledgers, once a year",
      "The review audits four accounts. Position: does the sentence still describe the business, and does the output still argue it? Assets: did the signals hold steady, or did variety creep in wearing the word refresh? Voice: would this year's copy pass the three writer test? Availability: which buying moments got gained, and which went quiet?",
      "## Judge against shipped work",
      "The review only works when scored against what actually shipped: the real posts, the real proposals, the real packaging, laid beside the documented decisions. Intentions audit clean every year. Output tells the truth.",
      "## The short version, any day",
      "The Brand Health Check on the Services page runs the compressed diagnosis in about a minute, and it is the honest place to start if a full review feels heavy. The agenda below is the complete version, best run with the year's work open on the table and the calendar already holding next year's date.",
      "The one rule: end every review with exactly one correction, chosen for compounding return. A review that ends with ten resolutions ends with zero.",
    ],
  },
];
