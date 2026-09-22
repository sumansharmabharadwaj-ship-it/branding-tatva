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
  serviceLink?: { href: string; label: string };
  updatedAt?: string;
  sources?: { label: string; publisher: string; url: string }[];
  // The essays where this idea does real work, newest thinking first.
  // Rendered on the term page and exposed as subjectOf in its schema,
  // so the vocabulary and the library cite each other.
  essaySlugs?: string[];
};

// Actual substantive revision date for the four sourced entries below.
export const glossaryUpdatedAt = "2026-09-22";

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
        serviceLink: { href: "/brand-positioning", label: "Review the brand positioning scope" },
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
        serviceLink: { href: "/brand-positioning", label: "Compare buyer alternatives in a positioning engagement" },
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
        serviceLink: { href: "/brand-audit", label: "Review existing brand assets in a brand audit" },
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
        serviceLink: { href: "/services#audit", label: "Try the brand recognition diagnostic" },
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
        serviceLink: { href: "/brand-positioning", label: "Examine buying triggers in a positioning engagement" },
        updatedAt: glossaryUpdatedAt,
        essaySlugs: ["how-ai-assistants-choose-brands-to-recommend", "aeo-vs-seo-vs-geo", "brand-awareness-vs-brand-recall"],
        definition:
          "The needs, occasions and circumstances that prompt buyers to think about a product or service category and recall possible brands.",
        expanded:
          "The Ehrenberg Bass Institute studies category entry points as cues associated with buying situations and brand memory. For a service business, a new funding round or an approaching contract renewal could be a useful starting hypothesis. Interviews can reveal the situations buyers actually describe; broader research can then test their relevance. Human memory research alone cannot establish how an AI assistant selects a source or recommends a supplier.",
        practice:
          "Start with recent buying conversations. Record what changed, why the buyer sought help and which alternatives came to mind. Use that evidence to choose useful guide topics, then measure reader response separately from brand recall.",
        sources: [{ label: "Identifying and prioritising category entry points", publisher: "Ehrenberg Bass Institute", url: "https://marketingscience.info/learn-with-us/commercial-research/identifying-and-prioritising-category-entry-points" }],
      },
      {
        term: "Answer engine optimisation",
        slug: "answer-engine-optimisation",
        updatedAt: glossaryUpdatedAt,
        essaySlugs: ["aeo-vs-seo-vs-geo", "how-ai-assistants-choose-brands-to-recommend"],
        definition:
          "Work intended to help useful content appear in direct answers, such as featured snippets or AI responses. Selection remains with the search system.",
        expanded:
          "AEO is an industry label with overlapping uses. Google chooses featured snippets through its own systems; publishers cannot mark a passage for guaranteed selection. Its guidance for generative AI search also keeps established SEO principles central. A clear explanation helps a reader, while headings, evidence and accessible text make the page easier to use. An opening answer, a particular word count or special markup cannot promise a citation.",
        practice:
          "Answer the reader's question early, explain the limits and show the supporting evidence. Keep important text accessible and links crawlable. Assess actual search appearances and useful enquiries before deciding whether the work helped.",
        sources: [
          { label: "Featured snippets and your website", publisher: "Google Search Central", url: "https://developers.google.com/search/docs/appearance/featured-snippets" },
          { label: "Optimising for generative AI search", publisher: "Google Search Central", url: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
        ],
      },
      {
        term: "Generative engine optimisation",
        slug: "generative-engine-optimisation",
        updatedAt: glossaryUpdatedAt,
        essaySlugs: ["generative-engine-optimisation-guide", "aeo-vs-seo-vs-geo", "how-ai-assistants-choose-brands-to-recommend"],
        definition:
          "Work intended to improve a source's visibility in answers produced by generative search systems, with results measured for a defined system and query set.",
        expanded:
          "The GEO research paper evaluated changes to source content using a benchmark and found that results varied across domains. Those findings concern the tested conditions and measures, rather than a promise of current rankings, recommendations or traffic. Google's own guidance describes its AI search features as grounded in established Search systems and relevant retrieved pages. Treat each platform's guidance and observed results separately. In this context, GEO refers to generative search rather than geographic targeting.",
        practice:
          "Publish accurate business details and useful, sourced explanations. Record the system, date, question and linked source when assessing an answer. Repeat observations before drawing a conclusion, and track visits and enquiries separately from mentions.",
        sources: [
          { label: "GEO research paper", publisher: "Aggarwal and colleagues", url: "https://arxiv.org/abs/2311.09735" },
          { label: "Optimising for generative AI search", publisher: "Google Search Central", url: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
        ],
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
        serviceLink: { href: "/brand-messaging", label: "See the brand messaging and voice scope" },
        essaySlugs: ["brand-voice-guidelines-writers-can-use", "why-ai-content-makes-brands-average", "homepage-messaging-service-businesses", "how-to-name-a-brand-when-good-names-are-taken"],
        definition: "The words a brand owns: its vocabulary, its rhythm, the sentences only it would say.",
        expanded:
          "A verbal identity earns its place when three different writers can produce copy that reads as one author. It covers the vocabulary a brand reaches for, the words it refuses, the rhythm of its sentences, and the claims it is willing to stake. Logos get protected in brand books while language, the thing customers actually quote, gets improvised weekly.",
        practice:
          "This site's own copy runs on a documented voice standard, banned words included, because a voice you can break silently is a voice you never had.",
      },
      {
        term: "Tone of voice",
        slug: "tone-of-voice",
        serviceLink: { href: "/brand-messaging", label: "See how a messaging engagement defines voice guidelines" },
        essaySlugs: ["brand-voice-guidelines-writers-can-use", "brand-messaging-framework"],
        definition:
          "The consistent personality in how a brand speaks, kept steady across every channel and every writer.",
        expanded:
          "Tone frames value before any claim lands: the same offer sounds assured or desperate depending on the sentence carrying it. Tone shifts by moment, warmer in support, plainer in checkout, while the underlying personality stays recognizable. Losing that thread across channels reads to the audience as several companies wearing one logo.",
        practice:
          "Voice work in the Brand Foundation engagement documents tone as decisions with examples, so the next writer inherits rules instead of vibes.",
      },
      {
        term: "Sound symbolism",
        slug: "sound-symbolism",
        updatedAt: glossaryUpdatedAt,
        essaySlugs: ["how-to-name-a-brand-when-good-names-are-taken", "brand-voice-guidelines-writers-can-use"],
        definition:
          "Associations between speech sounds and perceived qualities, such as a rounded or pointed shape. These patterns can inform questions when testing a name.",
        expanded:
          "A study by Ćwiek and colleagues tested the bouba and kiki association across speakers of 25 languages and reported strong overall evidence for the effect. This supports a relationship between speech sounds and shape judgements in that task. It leaves the effectiveness of an individual brand name to be assessed in its own context. Familiar words, pronunciation and the audience's language can all be questions in that assessment.",
        practice:
          "Ask intended buyers to say a candidate name, explain the associations it brings to mind and recall it later. Compare those observations with the naming brief. Keep this audience exercise separate from the professional checks needed before adopting a name.",
        sources: [{ label: "The bouba and kiki study", publisher: "Ćwiek and colleagues", url: "https://doi.org/10.1098/rstb.2020.0390" }],
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
        serviceLink: { href: "/brand-audit", label: "Review identity and language in a brand audit" },
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
