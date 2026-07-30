export type Element = {
  slug: "earth" | "water" | "fire" | "air" | "space";
  name: string;
  // poetic: the felt, metaphorical read. practical: the precise, working
  // definition. Both are shown together — brand strategy explained as
  // something felt and something built, at once.
  poetic: string;
  meaning: string;
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
    color: "#24394D",
    services: [
      "Customer journey mapping",
      "Touchpoint planning",
      "Digital experience",
    ],
    proof:
      "Playbooks built for each platform, plus webinar conversion sequencing, for Executive Springboard.",
    image: "/images/own-waterfall-veil.jpg",
    video: "/videos/higgsfield-water-ripples.mp4",
  },
  {
    slug: "fire",
    name: "Fire · Expression",
    poetic: "The one voice in the room worth turning toward.",
    meaning: "Creative direction, campaigns, and the visibility that earns attention.",
    color: "#C28A28",
    services: [
      "Creative direction",
      "Campaign concepts",
      "Launch communication",
    ],
    proof:
      "Campaign repositioning and script development for HerbalCart, moving the brand toward the identity it actually intended to carry.",
    // Was pixabay-campfire-flames.mp4 — direct feedback that it wasn't
    // resonating. A close, glowing-ember shot reads calmer and more
    // deliberate than a full campfire-with-logs, and holds up better
    // as a blurred backdrop behind the footer calendar's glass card,
    // where the video is dimmed rather than the main subject.
    image: "/images/pixabay-glowing-embers-fire-poster.jpg",
    video: "/videos/pixabay-glowing-embers-fire.mp4",
  },
  {
    slug: "air",
    name: "Air · Voice",
    poetic: "The words people use about you once you've left the room.",
    meaning: "Messaging, narrative, and content: the words themselves.",
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
