export type Element = {
  slug: "earth" | "water" | "fire" | "air" | "space";
  name: string;
  // poetic: the felt, metaphorical read. practical: the precise, working
  // definition. Both are shown together — brand strategy explained as
  // something felt and something built, at once.
  poetic: string;
  meaning: string;
  // manifesto/concepts: the Home page slider's own copy, distinct from
  // poetic/meaning above (which stay a single quotable sentence — used
  // as-is on About, Services, the footer calendar, and MeadowClosing).
  // manifesto is the philosophical opening (1-2 lines); concepts is the
  // real branding-vocabulary list that does the actual explaining —
  // "Earth is a storytelling device for positioning, not a service
  // label," per the site's own content direction.
  manifesto: string[];
  concepts: string[];
  color: string;
  services: string[];
  proof: string; // real work that demonstrates this element
  image: string; // backdrop photo, blended to this element's color — see ElementsConstellation.tsx for why this isn't one generic unrelated photo
  video?: string; // ambient loop for the Home row background (ElementRowBackground) — image stays the Ken Burns fallback/poster
  imagePosition?: string; // object-position override — ElementRowBackground defaults to center, which crops off-center subjects
};

export const elements: Element[] = [
  {
    slug: "earth",
    name: "Earth · Foundation",
    poetic: "What a brand stands on, long before it says a word.",
    meaning: "Purpose, audience, and positioning: the research most brands skip.",
    manifesto: ["Everything hidden from view.", "The strategic architecture beneath every premium brand."],
    concepts: [
      "Category definition.",
      "Competitive framing.",
      "Audience psychology.",
      "Brand beliefs.",
      "Perception mapping.",
      "Positioning.",
    ],
    color: "#B85A34",
    services: [
      "Brand discovery",
      "Audience definition",
      "Positioning",
      "Brand audit",
    ],
    proof:
      "Full brand foundation work for MyShopInEurope, including audience definition, market analysis, and a core belief, mission, and promise.",
    image: "/images/higgsfield-himalayan-valley-poster.jpg",
    video: "/videos/higgsfield-himalayan-valley.mp4",
  },
  {
    slug: "water",
    name: "Water · Experience",
    poetic: "Showing up once is barely showing up at all.",
    meaning: "Customer journey, touchpoints, and adaptability across platforms.",
    manifesto: [
      "Brands exist where people experience them.",
      "Every interaction either reinforces memory or weakens it.",
      "Every touchpoint teaches customers what to expect.",
    ],
    concepts: ["Experience is perception, repeated.", "That is the real service."],
    color: "#24394D",
    services: [
      "Customer journey mapping",
      "Touchpoint planning",
      "Digital experience",
    ],
    proof:
      "Playbooks built for each platform, plus webinar conversion sequencing, for Executive Springboard.",
    // Direct feedback the prior clip "still looked the same" after
    // several rounds of unrelated fixes elsewhere — swapped for a
    // freshly-sourced, frame-verified clip (sunlight through mist over
    // a moving stream) instead of tweaking the same footage again.
    image: "/images/pixabay-stream-mist-rays-poster.jpg",
    video: "/videos/pixabay-stream-mist-rays.mp4",
  },
  {
    slug: "fire",
    name: "Fire · Expression",
    poetic: "The one voice in the room worth turning toward.",
    meaning: "Creative direction, campaigns, and the visibility that earns attention.",
    manifesto: ["The moment a brand risks being noticed."],
    concepts: [
      "Attention.",
      "Emotion.",
      "Cultural relevance.",
      "Distinctive assets.",
      "Creative courage.",
      "Memorability.",
    ],
    color: "#C28A28",
    services: [
      "Creative direction",
      "Campaign concepts",
      "Launch communication",
    ],
    proof:
      "Campaign repositioning and script development for HerbalCart, moving the brand toward the identity it actually intended to carry.",
    // Was pixabay-glowing-embers-fire.mp4 — direct feedback that a
    // tight ember close-up read as "danger," not serene, when it filled
    // the whole PinnedSlider stage full-screen (a different context
    // than the small, dimmed footer-calendar card this was originally
    // graded for). Golden sunset light filtering through a forest,
    // birds crossing the beam, carries Fire's actual meaning — warmth,
    // a spark that earns a second look — without literal flame.
    image: "/images/pixabay-golden-forest-glow-poster.jpg",
    video: "/videos/pixabay-golden-forest-glow.mp4",
  },
  {
    slug: "air",
    name: "Air · Voice",
    poetic: "The words people use about you once you've left the room.",
    meaning: "Messaging, narrative, and content: the words themselves.",
    manifesto: ["What's said and what's remembered are rarely the same sentence."],
    concepts: [
      "Language.",
      "Meaning.",
      "Narrative.",
      "Verbal identity.",
      "Framing.",
      "Storytelling.",
      "Mental shortcuts.",
    ],
    color: "#5C6B4A",
    services: [
      "Brand voice",
      "Messaging",
      "Content strategy",
      "SEO content",
    ],
    proof:
      "A content portfolio of sixteen pieces for Plaxonic.com, spanning research papers, perspective pieces, blogs, and articles.",
    image: "/images/pixabay-golden-reeds-wind-poster.jpg",
    video: "/videos/pixabay-golden-reeds-wind.mp4",
  },
  {
    slug: "space",
    name: "Space · Presence",
    poetic: "Remembered long after the moment passes. Remembered, period.",
    meaning: "Consistency and recognition, built over months rather than one campaign.",
    manifesto: ["What's left of a brand once the campaign is forgotten."],
    concepts: [
      "Legacy.",
      "Recognition.",
      "Mental availability.",
      "Brand equity.",
      "Market ownership.",
      "Brand world.",
      "Memory.",
    ],
    color: "#AD6F5C",
    services: [
      "Ongoing content management",
      "Consistency frameworks",
      "Growth communication",
    ],
    proof:
      "Sustained, measured social management for Dr. Haley Nutrition, with verified follower and engagement growth over two consecutive months.",
    // Was pixabay-hazy-twilight-mountains.mp4 — direct feedback that it
    // wasn't playing; turned out the clip itself has almost no visible
    // motion across its whole 10s (frame-sampled start to end, they're
    // nearly identical), so even mid-playback it reads as a frozen
    // photo next to its far livelier siblings (flames, water, wind).
    // This replacement has real, visible cloud drift confirmed the same
    // way before swapping it in.
    image: "/images/pixabay-sea-of-fog-sunrise-poster.jpg",
    video: "/videos/pixabay-sea-of-fog-sunrise.mp4",
  },
];
