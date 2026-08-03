// The Branding Tatva glossary — the practice's working vocabulary,
// defined in plain language per the governing bible's AEO direction:
// clear entities, original definitions, each term connected to where
// the site actually uses it. Grouped into the bible's five content
// pillars. Original teaching content in the site's own voice; nothing
// here claims client work.
export type GlossaryTerm = {
  term: string;
  definition: string;
  // Per the bible's AEO direction, each term now carries its own page
  // at /glossary/[slug]: a direct answer first, then the practice's
  // own read, connected to the real places the site applies it.
  slug: string;
  expanded: string;
  practice: string;
};

export type Pillar = {
  id: string;
  name: string;
  questions: string[];
  terms: GlossaryTerm[];
  articleSlug?: string; // a real insights article inside this pillar
};

export const pillars: Pillar[] = [
  {
    id: "positioning",
    name: "Brand positioning",
    questions: [
      "What does positioning actually decide?",
      "How is positioning different from messaging?",
      "When should a brand reposition?",
    ],
    articleSlug: "what-a-brand-audit-actually-finds",
    terms: [
      {
        term: "Positioning",
        slug: "positioning",
        definition:
          "The decision about which single idea a brand should own in a buyer's head, made before any design work begins.",
        expanded:
          "Positioning answers one question before any other: when a buyer thinks of the problem you solve, which single idea should surface with your name? Everything downstream, from identity to campaigns, either reinforces that idea or spends money confusing it. A brand that skips this decision asks its audience to make it instead, and audiences default to price.",
        practice:
          "Every engagement here begins with this decision. The Dr. Haley Nutrition work started as a positioning question long before any visual appeared.",
      },
      {
        term: "Category design",
        slug: "category-design",
        definition:
          "Choosing, and sometimes creating, the market frame a brand competes in before competing in it.",
        expanded:
          "The frame decides who you get compared against and what counts as expensive. A brand that accepts its default category inherits that category's price ceiling and its clichés together. A brand that names its own frame gets judged by rules it wrote.",
        practice:
          "The Tatva Lab concept studies on the Work page exist partly to exercise this move: reframing a category is safer to rehearse in the open than to improvise on a live client.",
      },
    ],
  },
  {
    id: "recognition",
    name: "Brand recognition",
    questions: [
      "What makes a brand memorable?",
      "What are distinctive assets?",
      "How does consistency create memory?",
    ],
    articleSlug: "visible-versus-remembered",
    terms: [
      {
        term: "Distinctive assets",
        slug: "distinctive-assets",
        definition:
          "The colors, shapes, sounds, and phrases a brand owns so thoroughly that people recognize it with the logo covered.",
        expanded:
          "Assets earn their keep through repetition: the same few signals, held steady across years, until they belong to the brand in memory. Variety feels fresh from inside the business and reads as noise from outside it. The audit question is simple: cover the logo and ask what still identifies you.",
        practice:
          "This site runs on its own asset system, one serif voice, one palette, one sprig mark, precisely because a branding practice should be its own first case study.",
      },
      {
        term: "Mental availability",
        slug: "mental-availability",
        definition:
          "How easily a brand comes to mind in a buying moment. Built through consistent presence, well before any single campaign.",
        expanded:
          "Memory does the heavy lifting in most purchases: people buy what surfaces first and explain the choice afterward. Availability gets built in the quiet months through consistent presence, well before any single campaign asks for the sale. A brand that only shows up when it wants something arrives too late.",
        practice:
          "The ongoing direction offering exists for exactly this reason: presence compounds monthly, and the compounding is the product.",
      },
      {
        term: "Brand salience",
        slug: "brand-salience",
        definition: "The share of buying situations in which a brand gets thought of at all.",
        expanded:
          "Salience widens when a brand attaches itself to more of the moments that trigger its category: the morning routine, the quarterly review, the gift search. Each new buying situation the brand gets linked to is another door into memory. Brands lose less often to rivals than to simply going unthought of.",
        practice:
          "Situation based diagnosis on the Services page starts here: which buying moments should call your name, and which currently stay silent?",
      },
      {
        term: "Recognition",
        slug: "recognition",
        definition: "The compound return of consistency: being known again without reintroduction.",
        expanded:
          "Recognition is the asset every other branding decision feeds, and it only accrues while the decisions agree with each other. A message repeated consistently across channels compounds; the same budget spent on five disconnected looks buys five first impressions and zero memory.",
        practice:
          "The Brand Recognition Audit on the Services page turns this idea into a working diagnostic you can run on your own brand.",
      },
    ],
  },
  {
    id: "verbal-identity",
    name: "Verbal identity",
    questions: [
      "What is tone of voice?",
      "How does language frame value?",
      "What belongs in a messaging framework?",
    ],
    terms: [
      {
        term: "Verbal identity",
        slug: "verbal-identity",
        definition: "The words a brand owns: its vocabulary, its rhythm, the sentences only it would say.",
        expanded:
          "A verbal identity earns its place when three different writers can produce copy that reads as one author. It covers the vocabulary a brand reaches for, the words it refuses, the rhythm of its sentences, and the claims it is willing to stake. Logos get protected in brand books while language, the thing customers actually quote, gets improvised weekly.",
        practice:
          "This site's own copy runs on a documented voice standard, banned words included, because a voice you can break silently is a voice you never had.",
      },
      {
        term: "Tone of voice",
        slug: "tone-of-voice",
        definition:
          "The consistent personality in how a brand speaks, kept steady across every channel and every writer.",
        expanded:
          "Tone frames value before any claim lands: the same offer sounds assured or desperate depending on the sentence carrying it. Tone shifts by moment, warmer in support, plainer in checkout, while the underlying personality stays recognizable. Losing that thread across channels reads to the audience as several companies wearing one logo.",
        practice:
          "Voice work in the Brand Foundation engagement documents tone as decisions with examples, so the next writer inherits rules instead of vibes.",
      },
    ],
  },
  {
    id: "architecture",
    name: "Brand architecture",
    questions: [
      "When should services sit under one brand?",
      "What is a branded house?",
      "How do multiple offers relate?",
    ],
    terms: [
      {
        term: "Brand architecture",
        slug: "brand-architecture",
        definition:
          "How multiple offers relate under one roof: what earns its own name and what borrows the parent's.",
        expanded:
          "Good architecture lets each offer strengthen the others instead of splitting recognition across brands the audience never asked to learn. The default answer is one brand: every additional name divides the same attention budget. A new name earns its keep only when an offer would genuinely damage or be damaged by the parent's meaning.",
        practice:
          "This question surfaces most often with founders adding a second offer; it gets settled in the discovery conversation before any naming begins.",
      },
    ],
  },
  {
    id: "psychology",
    name: "Psychology and branding",
    questions: ["How do attention, association, and memory shape brand decisions?"],
    articleSlug: "five-elements-working-as-one",
    terms: [
      {
        term: "Semiotics",
        slug: "semiotics",
        definition:
          "The study of what signs and symbols mean to a culture, applied so a brand's codes say what it intends.",
        expanded:
          "Every color, typeface, and image carries meanings a culture already assigned; semiotics reads those meanings before the brand inherits them by accident. A serif says something before the words do. The question is never whether your visual choices communicate, only whether they communicate what you decided.",
        practice:
          "Psychology and literature sit behind this practice for a reason: both are disciplines of reading what signs actually do to people.",
      },
    ],
  },
];

// Flat view for the /glossary routes: every term with its pillar
// attached, so a term page can show its siblings and its pillar's
// questions without re-walking the tree.
export const allTerms = pillars.flatMap((pillar) => pillar.terms.map((term) => ({ ...term, pillar })));

export function findTerm(slug: string) {
  return allTerms.find((t) => t.slug === slug);
}
