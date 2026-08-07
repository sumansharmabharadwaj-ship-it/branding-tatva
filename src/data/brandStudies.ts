// Brand studies — independent dissections of renowned brands, written
// as teaching. HONESTY CONTRACT (per this project's own commercial
// honesty rule): these are analyses of the public record. None of
// these brands is a client, and nothing here may ever imply an
// engagement, an endorsement, or an affiliation. Every fact cited is
// widely documented public history (the 1915 Coca Cola bottle brief,
// the 1971 swoosh commission, the Canadian Oxford Dictionary entry,
// the Burberry check drawdown). No invented numbers, no invented
// quotes. The section rendering this data must carry the independence
// framing in visitor facing copy, not only in this comment.
//
// Copy inside follows the sitewide standard: no literal "not", no
// dashes or hyphens in rendered strings, no banned agency vocabulary,
// opinionated claims a reader could disagree with.

import type { SlotFill } from "@/components/MediaSlot";

// Named media slots, one per section of the study template. Every one
// is optional: a study with no approved footage renders exactly as it
// does today, and approving a clip later is a data edit here rather
// than a layout change in the template.
export type StudyMedia = {
  masthead?: SlotFill;
  observations?: SlotFill;
  applications?: SlotFill;
  closing?: SlotFill;
  /** Shown inside this study's opened panel on the Work page. */
  card?: SlotFill;
};

export type BrandStudy = {
  slug: string;
  brand: string;
  region: string;
  lens: string;
  premise: string;
  observations: { title: string; text: string }[];
  lesson: string;
  applications: string[];
  media?: StudyMedia;
};

const sharedStudyMedia: StudyMedia = {
  masthead: {
    video: "/videos/generated/bt-studies-cultural-memory.mp4",
    poster: "/images/generated/bt-studies-cultural-memory-poster.jpg",
    position: "center",
    playbackRate: 0.9,
    credit: "Original Branding Tatva atmospheric study film",
  },
  observations: {
    video: "/videos/generated/bt-studies-observation-field.mp4",
    poster: "/images/generated/bt-studies-observation-field-poster.jpg",
    position: "center",
    playbackRate: 0.9,
    credit: "Original Branding Tatva atmospheric study film",
  },
  applications: {
    video: "/videos/generated/bt-studies-founder-roots.mp4",
    poster: "/images/generated/bt-studies-founder-roots-poster.jpg",
    position: "center",
    playbackRate: 0.9,
    credit: "Original Branding Tatva atmospheric study film",
  },
  closing: {
    video: "/videos/generated/bt-studies-path-of-light.mp4",
    poster: "/images/generated/bt-studies-path-of-light-poster.jpg",
    position: "center",
    playbackRate: 0.9,
    credit: "Original Branding Tatva atmospheric study film",
  },
};

export const brandStudies: BrandStudy[] = [
  {
    slug: "coca-cola-distinctive-assets",
    brand: "Coca Cola",
    region: "United States",
    lens: "Distinctive assets",
    premise:
      "A century of recognition rests on a handful of sensory codes owned so completely that a silhouette sells without a single word.",
    observations: [
      {
        title: "The bottle brief",
        text: "The 1915 design brief asked for a bottle a person could recognize by touch alone, even shattered on the ground. Recognition was engineered into the object itself decades before anyone called it a distinctive asset.",
      },
      {
        title: "One script across every era",
        text: "The Spencerian wordmark has survived every design fashion intact. Memory compounds when the symbol refuses to chase trends.",
      },
      {
        title: "Red as property",
        text: "One color, saturated across every touchpoint for over a century, until the color itself performs the advertising before the name arrives.",
      },
    ],
    lesson: "Distinctive assets outlast campaigns. Choose your codes early, then defend them for decades.",
    applications: [
      "Choose one color, one mark and one typographic voice, then hold them steady for years while competitors redesign themselves into anonymity.",
      "Audit every touchpoint for the code that would survive with the name removed. That code deserves the budget.",
      "Treat rebrand impulses as a tax on memory. Evolution beats replacement almost every time.",
    ],
    media: sharedStudyMedia,
  },
  {
    slug: "apple-brand-architecture",
    brand: "Apple",
    region: "United States",
    lens: "Brand architecture",
    premise:
      "One master brand carries every category it enters, so each product borrows authority instead of building it from zero.",
    observations: [
      {
        title: "The 1997 reset",
        text: "Near collapse, the company spent its scarce attention on identity before features. Think Different repositioned the maker itself, and every product since has launched inside that frame.",
      },
      {
        title: "A naming system as a family",
        text: "iPhone, iPad, iMac: one prefix turned every launch into the continuation of a story buyers already trusted.",
      },
      {
        title: "Product as hero",
        text: "The photography strips away everything except the object. That restraint signals confidence, and confidence signals category leadership.",
      },
    ],
    lesson: "Architecture decides whether each launch starts from zero or from equity already earned.",
    applications: [
      "Name your offers as one family, so each launch inherits trust from the last instead of introducing a stranger.",
      "Position the maker before the product. Buyers join a worldview first and evaluate features second.",
      "Restraint reads as confidence at every scale. A calm page outsells a crowded one.",
    ],
    media: sharedStudyMedia,
  },
  {
    slug: "nike-verbal-identity",
    brand: "Nike",
    region: "United States",
    lens: "Verbal identity",
    premise:
      "Three words from 1988 still carry the entire positioning, proof that language can be a brand asset with the durability of a logo.",
    observations: [
      {
        title: "A thirty five dollar mark",
        text: "The swoosh was commissioned from a design student for thirty five dollars in 1971. The value of a symbol lives in decades of consistent use, never in the price of its creation.",
      },
      {
        title: "Just Do It",
        text: "The line addresses the buyer's inner life rather than the shoe. Verbal identity at this level sells a self image, and the product rides along.",
      },
      {
        title: "Athletes as one narrative",
        text: "Decades of athlete stories deposit into a single account of meaning: effort. Every campaign compounds the same idea instead of starting a new one.",
      },
    ],
    lesson: "A verbal asset, repeated with discipline, can outwork a media budget.",
    applications: [
      "Write one line that speaks to who the buyer wants to become, then keep it for a decade.",
      "Spend on consistency before spending on reach. A repeated idea compounds while a rotating one evaporates.",
      "Attach the brand to effort your audience already admires, and let stories carry the meaning.",
    ],
    media: sharedStudyMedia,
  },
  {
    slug: "burberry-codes-reclaimed",
    brand: "Burberry",
    region: "United Kingdom",
    lens: "Brand codes under pressure",
    premise:
      "Heritage codes can be diluted by exposure the house never chose, and still be reclaimed, because the memory structure survives the misuse.",
    observations: [
      {
        title: "The check in crisis",
        text: "By the mid 2000s the famous check had drifted into associations far from the trench coat that built it. Ubiquity without control turned an asset into a liability.",
      },
      {
        title: "Scarcity as repair",
        text: "The check was drawn back to a small fraction of product. Scarcity restored status, and the code returned on the house's own terms.",
      },
      {
        title: "Heritage kept in circulation",
        text: "Art of the Trench placed the heritage coat in customers' own photographs online while rivals guarded distance. The codes stayed alive by moving through culture.",
      },
    ],
    lesson: "Codes are capital. Manage their exposure the way a fund manages risk.",
    applications: [
      "List your codes, then track where they appear without your consent. Exposure you never chose still shapes memory.",
      "Scarcity is a repair tool. Pulling a diluted asset back can restore the status it lost.",
      "Keep heritage circulating in customers' own hands rather than sealed inside a brand book.",
    ],
    media: sharedStudyMedia,
  },
  {
    slug: "tim-hortons-ritual",
    brand: "Tim Hortons",
    region: "Canada",
    lens: "Ritual and cultural memory",
    premise:
      "A brand becomes culture when its language and rituals enter daily life even where the logo is absent.",
    observations: [
      {
        title: "A phrase in the dictionary",
        text: "Double double entered the Canadian Oxford Dictionary. When buyers speak in a brand's vocabulary, mental availability stops depending on media.",
      },
      {
        title: "Roll Up the Rim",
        text: "A cup that becomes a game turns every purchase into a ritual, and rituals rehearse the brand into memory on the customer's own initiative.",
      },
      {
        title: "The national frame",
        text: "Hockey rinks, winter mornings, small towns: the brand tied itself to national life until category membership read as cultural membership.",
      },
    ],
    lesson: "Rituals earn a place in memory that media spend only borrows.",
    applications: [
      "Invent a ritual a customer can perform with the brand absent. Repetition they choose beats repetition you buy.",
      "Give buyers language of their own for your product, then defend it once they adopt it.",
      "Tie the brand to moments the culture already keeps: seasons, rituals, the real calendar.",
    ],
    media: sharedStudyMedia,
  },
];
