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
    poetic: "A brand that only shows up once was never really there.",
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
  },
  {
    slug: "fire",
    name: "Fire · Expression",
    poetic: "Not the loudest voice in the room. The one worth turning toward.",
    meaning: "Creative direction, campaigns, and the visibility that earns attention.",
    color: "#C28A28",
    services: [
      "Creative direction",
      "Campaign concepts",
      "Launch communication",
    ],
    proof:
      "Campaign repositioning and script development for HerbalCart, moving the brand toward the identity it actually intended to carry.",
    image: "/images/higgsfield-element-fire.jpg",
    video: "/videos/higgsfield-element-fire.mp4",
  },
  {
    slug: "air",
    name: "Air · Voice",
    poetic: "The words people use about you when you're not in the room.",
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
    image: "/images/own-misty-ridge-poster.jpg",
  },
  {
    slug: "space",
    name: "Space · Presence",
    poetic: "Not remembered for one big moment. Remembered, period.",
    meaning: "Consistency and recognition, built over months rather than one campaign.",
    color: "#AD6F5C",
    services: [
      "Ongoing content management",
      "Consistency frameworks",
      "Growth communication",
    ],
    proof:
      "Sustained, measured social management for Dr. Haley Nutrition, with verified follower and engagement growth over two consecutive months.",
    image: "/images/own-dusk-ridge.jpg",
  },
];
