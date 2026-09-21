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
  // The essays where this idea does real work, newest thinking first.
  // Rendered on the term page and exposed as subjectOf in its schema,
  // so the vocabulary and the library cite each other.
  essaySlugs?: string[];
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
    articleSlug: "brand-positioning-strategy-service-businesses",
    terms: [
      {
        term: "Positioning",
        slug: "positioning",
        essaySlugs: ["brand-positioning-strategy-service-businesses", "brand-positioning-statement-examples-why-generic", "how-to-position-a-consulting-business"],
        definition:
          "The decision about which single idea a brand should own in a buyer's head, made before any design work begins.",
        expanded:
          "Positioning answers one question before any other: when a buyer thinks of the problem you solve, which single idea should surface with your name? Everything downstream, from identity to campaigns, either reinforces that idea or spends money confusing it. A brand that skips this decision asks its audience to make it instead, and audiences default to price.",
        practice:
          "Suman uses this definition to decide the comparison, audience, and remembered difference before writing or design begins.",
      },
      {
        term: "Category design",
        slug: "category-design",
        essaySlugs: ["find-real-differentiator-crowded-service-market", "competitor-research-brand-strategy-without-copying-category"],
        definition:
          "Choosing, and sometimes creating, the market frame a brand competes in before competing in it.",
        expanded:
          "The frame decides who you get compared against and what counts as expensive. A brand that accepts its default category inherits that category's price ceiling and its clichés together. A brand that names its own frame gets judged by rules it wrote.",
        practice:
          "The independent brand studies make reframing visible without presenting analysis as client work.",
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
    articleSlug: "why-beautiful-brand-identity-can-be-forgettable",
    terms: [
      {
        term: "Distinctive assets",
        slug: "distinctive-assets",
        essaySlugs: ["distinctive-brand-assets-audit", "what-rebrand-backlashes-teach-about-brand-memory", "why-ai-content-makes-brands-average"],
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
        essaySlugs: ["how-ai-assistants-choose-brands-to-recommend", "brand-marketing-vs-performance-marketing", "brand-awareness-vs-brand-recall"],
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
        essaySlugs: ["brand-awareness-vs-brand-recall", "measure-brand-recall-limited-budget"],
        definition: "The share of buying situations in which a brand gets thought of at all.",
        expanded:
          "Salience widens when a brand attaches itself to more of the moments that trigger its category: the morning routine, the quarterly review, the gift search. Each new buying situation the brand gets linked to is another door into memory. Brands lose less often to rivals than to simply going unthought of.",
        practice:
          "Situation based diagnosis on the Services page starts here: which buying moments should call your name, and which currently stay silent?",
      },
      {
        term: "Recognition",
        slug: "recognition",
        essaySlugs: ["why-beautiful-brand-identity-can-be-forgettable", "reposition-established-service-business-without-losing-recognition", "brand-consistency-checklist-service-businesses"],
        definition: "The compound return of consistency: being known again without reintroduction.",
        expanded:
          "Recognition is the asset every other branding decision feeds, and it only accrues while the decisions agree with each other. A message repeated consistently across channels compounds; the same budget spent on five disconnected looks buys five first impressions and zero memory.",
        practice:
          "The Brand Recognition Audit on the Services page turns this idea into a working diagnostic you can run on your own brand.",
      },
      {
        term: "Category entry points",
        slug: "category-entry-points",
        essaySlugs: ["how-ai-assistants-choose-brands-to-recommend", "aeo-vs-seo-vs-geo", "brand-awareness-vs-brand-recall"],
        definition:
          "The situations that trigger a category in a buyer's mind: the moments, needs, and occasions through which brands get retrieved from memory.",
        expanded:
          "Nobody buys a category in the abstract. A trigger fires first: the funding round approaches, the website undersells the work, a rival suddenly looks sharper. Each trigger is an entry point, and the brand linked to more of them gets retrieved more often. The same mechanics now govern AI assistants, because buyers phrase prompts as situations and the assistant retrieves whichever brand the written record has attached to that situation.",
        practice:
          "Every guide in this library answers one entry point deliberately: one buying situation, one direct answer, so the practice gets recorded against the moments that matter.",
      },
      {
        term: "Answer engine optimisation",
        slug: "answer-engine-optimisation",
        essaySlugs: ["aeo-vs-seo-vs-geo", "how-ai-assistants-choose-brands-to-recommend"],
        definition:
          "The practice of earning the quoted answer itself, the snippet, the voice reply, the answer box, rather than a ranked position on a results page.",
        expanded:
          "AEO shifts the unit of competition from the page to the passage. A page can rank fourth and still own the answer, because answer surfaces look for the clearest quotable paragraph, stated plainly and marked up so a machine knows which question it resolves. Pages that open with their conclusion get excerpted; pages that warm up for eight hundred words get skipped.",
        practice:
          "Every guide and glossary page on this site opens with a direct answer block for exactly this reason: the format teaches human readers and machine readers in the same breath.",
      },
      {
        term: "Generative engine optimisation",
        slug: "generative-engine-optimisation",
        essaySlugs: ["generative-engine-optimisation-guide", "aeo-vs-seo-vs-geo", "how-ai-assistants-choose-brands-to-recommend"],
        definition:
          "The practice of making a brand retrievable and quotable by AI assistants such as ChatGPT, Gemini, and Perplexity, which recommend entities rather than ranking pages.",
        expanded:
          "GEO is mental availability measured by a machine. An assistant retrieves brands from its trained impression of the world, weighted by how consistently independent sources describe them, then quotes whichever pages state answers plainly enough to lift. The controlled research found quotations, statistics, and cited sources raise inclusion in generated answers far more than any polish. In marketing use the abbreviation is distinct from geographic targeting, which older material also shortens to geo.",
        practice:
          "The entity sentence, direct answer blocks, and sourced guides across this site are GEO applied to the practice itself: one consistent record, written to be quoted.",
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
    articleSlug: "brand-voice-guidelines-writers-can-use",
    terms: [
      {
        term: "Verbal identity",
        slug: "verbal-identity",
        essaySlugs: ["brand-voice-guidelines-writers-can-use", "why-ai-content-makes-brands-average", "homepage-messaging-service-businesses"],
        definition: "The words a brand owns: its vocabulary, its rhythm, the sentences only it would say.",
        expanded:
          "A verbal identity earns its place when three different writers can produce copy that reads as one author. It covers the vocabulary a brand reaches for, the words it refuses, the rhythm of its sentences, and the claims it is willing to stake. Logos get protected in brand books while language, the thing customers actually quote, gets improvised weekly.",
        practice:
          "This site's own copy runs on a documented voice standard, banned words included, because a voice you can break silently is a voice you never had.",
      },
      {
        term: "Tone of voice",
        slug: "tone-of-voice",
        essaySlugs: ["brand-voice-guidelines-writers-can-use", "brand-messaging-framework"],
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
    articleSlug: "brand-architecture-service-businesses",
    terms: [
      {
        term: "Brand architecture",
        slug: "brand-architecture",
        essaySlugs: ["brand-architecture-service-businesses", "founder-brand-vs-company-brand", "service-line-naming-strategy"],
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
    articleSlug: "brand-awareness-vs-brand-recall",
    terms: [
      {
        term: "Semiotics",
        slug: "semiotics",
        essaySlugs: ["why-beautiful-brand-identity-can-be-forgettable", "what-rebrand-backlashes-teach-about-brand-memory"],
        definition:
          "The study of what signs and symbols mean to a culture, applied so a brand's codes say what it intends.",
        expanded:
          "Every color, typeface, and image carries meanings a culture already assigned; semiotics reads those meanings before the brand inherits them by accident. A serif, the small foot at the end of a letter stroke, says tradition and authority before the words do. The question is never whether your visual choices communicate, only whether they communicate what you decided.",
        practice:
          "Suman reads visual and verbal choices for the associations they carry before deciding which ones a brand should repeat.",
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
