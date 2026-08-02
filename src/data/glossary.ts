// The Branding Tatva glossary — the practice's working vocabulary,
// defined in plain language per the governing bible's AEO direction:
// clear entities, original definitions, each term connected to where
// the site actually uses it. Grouped into the bible's five content
// pillars. Original teaching content in the site's own voice; nothing
// here claims client work.
export type GlossaryTerm = {
  term: string;
  definition: string;
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
        definition:
          "The decision about which single idea a brand should own in a buyer's head, made before any design work begins.",
      },
      {
        term: "Category design",
        definition:
          "Choosing, and sometimes creating, the market frame a brand competes in before competing in it.",
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
        definition:
          "The colors, shapes, sounds, and phrases a brand owns so thoroughly that people recognize it with the logo covered.",
      },
      {
        term: "Mental availability",
        definition:
          "How easily a brand comes to mind in a buying moment. Built through consistent presence, well before any single campaign.",
      },
      {
        term: "Brand salience",
        definition: "The share of buying situations in which a brand gets thought of at all.",
      },
      {
        term: "Recognition",
        definition: "The compound return of consistency: being known again without reintroduction.",
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
        definition: "The words a brand owns: its vocabulary, its rhythm, the sentences only it would say.",
      },
      {
        term: "Tone of voice",
        definition:
          "The consistent personality in how a brand speaks, kept steady across every channel and every writer.",
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
        definition:
          "How multiple offers relate under one roof: what earns its own name and what borrows the parent's.",
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
        definition:
          "The study of what signs and symbols mean to a culture, applied so a brand's codes say what it intends.",
      },
    ],
  },
];
