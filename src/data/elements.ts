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
};

export const elements: Element[] = [
  {
    slug: "earth",
    name: "Earth · Foundation",
    poetic: "Where a brand stands before it speaks.",
    meaning: "Purpose, audience, and positioning: the research most brands skip.",
    color: "#A65F46",
    services: [
      "Brand discovery",
      "Audience definition",
      "Positioning",
      "Brand audit",
    ],
    proof:
      "Full brand foundation work for MyShopInEurope, including audience definition, market analysis, and a core belief, mission, and promise.",
  },
  {
    slug: "water",
    name: "Water · Experience",
    poetic: "How a brand moves through someone's day.",
    meaning: "Customer journey, touchpoints, and adaptability across platforms.",
    color: "#31485A",
    services: [
      "Customer journey mapping",
      "Touchpoint planning",
      "Digital experience",
    ],
    proof:
      "Playbooks built for each platform, plus webinar conversion sequencing, for Executive Springboard.",
  },
  {
    slug: "fire",
    name: "Fire · Expression",
    poetic: "What makes people look twice.",
    meaning: "Creative direction, campaigns, and the visibility that earns attention.",
    color: "#C9953D",
    services: [
      "Creative direction",
      "Campaign concepts",
      "Launch communication",
    ],
    proof:
      "Campaign repositioning and script development for HerbalCart, moving the brand away from a stereotype it didn't intend to have.",
  },
  {
    slug: "air",
    name: "Air · Voice",
    poetic: "The language a brand is remembered by.",
    meaning: "Messaging, narrative, and content: the words themselves.",
    color: "#79816D",
    services: [
      "Brand voice",
      "Messaging",
      "Content strategy",
      "SEO content",
    ],
    proof:
      "A content portfolio of sixteen pieces for Plaxonic.com, spanning research papers, perspective pieces, blogs, and articles.",
  },
  {
    slug: "space",
    name: "Space · Presence",
    poetic: "What's left once the noise settles.",
    meaning: "Consistency and recognition, built over months rather than one campaign.",
    color: "#27221E",
    services: [
      "Ongoing content management",
      "Consistency frameworks",
      "Growth communication",
    ],
    proof:
      "Sustained, measured social management for Dr. Haley Nutrition, with verified follower and engagement growth over two consecutive months.",
  },
];
