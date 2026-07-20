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
};

export const elements: Element[] = [
  {
    slug: "earth",
    name: "Earth · Foundation",
    poetic: "Where a brand stands before it speaks.",
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
    image: "/images/own-jagged-peaks.jpg",
    video: "/videos/own-jagged-peaks.mp4",
  },
  {
    slug: "water",
    name: "Water · Experience",
    poetic: "How a brand moves through someone's day.",
    meaning: "Customer journey, touchpoints, and adaptability across platforms.",
    color: "#24394D",
    services: [
      "Customer journey mapping",
      "Touchpoint planning",
      "Digital experience",
    ],
    proof:
      "Playbooks built for each platform, plus webinar conversion sequencing, for Executive Springboard.",
    image: "/images/own-forest-stream-poster.jpg",
    video: "/videos/own-forest-stream.mp4",
  },
  {
    slug: "fire",
    name: "Fire · Expression",
    poetic: "What makes people look twice.",
    meaning: "Creative direction, campaigns, and the visibility that earns attention.",
    color: "#C28A28",
    services: [
      "Creative direction",
      "Campaign concepts",
      "Launch communication",
    ],
    proof:
      "Campaign repositioning and script development for HerbalCart, moving the brand away from a stereotype it didn't intend to have.",
    image: "/images/own-golden-branches-poster.jpg",
    video: "/videos/own-golden-branches.mp4",
  },
  {
    slug: "air",
    name: "Air · Voice",
    poetic: "The language a brand is remembered by.",
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
    image: "/images/own-ridge-road-poster.jpg",
    video: "/videos/own-ridge-road.mp4",
  },
  {
    slug: "space",
    name: "Space · Presence",
    poetic: "What's left once the noise settles.",
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
