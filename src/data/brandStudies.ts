// Brand studies — independent dissections of renowned brands, written
// as teaching. HONESTY CONTRACT (per this project's own commercial
// honesty rule): these are analyses of the public record. None of
// these brands is a client, and nothing here may ever imply an
// engagement, an endorsement, or an affiliation. Every fact cited is
// linked directly to a primary source beside each observation.
// Interpretations and illustrative exercises stay clearly labelled.
// No invented numbers or quotes. The renderer must carry the independence
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

type StudySource = {
  label: string;
  publisher: string;
  url: string;
};

export type BrandStudy = {
  slug: string;
  brand: string;
  region: string;
  lens: string;
  topicSlug: string;
  premise: string;
  description: string;
  updatedAt: string;
  observations: {
    title: string;
    text: string;
    interpretation: string;
    source: StudySource;
  }[];
  lesson: string;
  applications: string[];
  exercise: string;
  relatedGuide: { slug: string; label: string };
  media?: StudyMedia;
};

const sources = {
  cocaBottle: {
    label: "Contour bottle history",
    publisher: "The Coca Cola Company",
    url: "https://www.coca-colacompany.com/about-us/history/the-history-of-the-coca-cola-contour-bottle",
  },
  cocaTrademark: {
    label: "Trademark chronology",
    publisher: "The Coca Cola Company",
    url: "https://www.coca-colacompany.com/about-us/history/coke-lore-trademark-chronology",
  },
  applePhone: {
    label: "iPhone announcement, 2007",
    publisher: "Apple Newsroom",
    url: "https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/",
  },
  appleWatch: {
    label: "Apple Watch announcement, 2014",
    publisher: "Apple Newsroom",
    url: "https://www.apple.com/newsroom/2014/09/09Apple-Unveils-Apple-Watch-Apples-Most-Personal-Device-Ever/",
  },
  appleBeats: {
    label: "Beats acquisition announcement, 2014",
    publisher: "Apple Newsroom",
    url: "https://www.apple.com/newsroom/2014/05/28Apple-to-Acquire-Beats-Music-Beats-Electronics/",
  },
  nikeMark: {
    label: "Swoosh history",
    publisher: "Department of Nike Archives",
    url: "https://about.nike.com/en/magazine/nike-swoosh-logo-history",
  },
  nikeCampaign: {
    label: "Campaign announcement, 2025",
    publisher: "Nike Newsroom",
    url: "https://about.nike.com/en/newsroom/releases/nike-why-do-it-campaign",
  },
  burberryHistory: {
    label: "Burberry history",
    publisher: "Burberry Group",
    url: "https://www.burberryplc.com/company/history",
  },
  burberryStrategy: {
    label: "Burberry Forward strategy",
    publisher: "Burberry Group",
    url: "https://www.burberryplc.com/company/strategy",
  },
  timHistory: {
    label: "Tim Hortons history",
    publisher: "Tim Hortons UK",
    url: "https://timhortons.co.uk/our-history",
  },
  timRitual: {
    label: "Brand history and the 1986 promotion",
    publisher: "Tim Hortons India",
    url: "https://timhortonsindia.com/brand-story",
  },
} satisfies Record<string, StudySource>;

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
    topicSlug: "distinctive-brand",
    premise:
      "A recognisable brand can carry several identifying features at once. Coca Cola gives us a useful way to examine shape, script and repetition.",
    description: "An independent Coca Cola brand study on bottle shape, logo evolution and recognition, with sources and a practical distinctive asset exercise.",
    updatedAt: "2026-09-22",
    observations: [
      {
        title: "The bottle brief",
        text: "The company records a 1915 brief for a bottle recognisable by touch in darkness or from a broken piece. The Root Glass Company developed the selected shape.",
        interpretation: "The brief made recognition a design requirement. A useful asset brief can specify the conditions in which customers should recognise a business.",
        source: sources.cocaBottle,
      },
      {
        title: "Continuity through changes",
        text: "Coca Cola's trademark chronology records changes to the script, registration text and ribbon. The mark evolved; the company documents several versions.",
        interpretation: "Continuity allows some change. Identify the features customers recognise before deciding which details a refresh can alter.",
        source: sources.cocaTrademark,
      },
      {
        title: "Adoption took work",
        text: "Production began in 1916, but bottlers adopted the new shape gradually. Coca Cola's history describes advertising and persuasion alongside the physical redesign.",
        interpretation: "A distinctive design needs distribution and consistent use. A new logo file alone leaves the work of recognition unfinished.",
        source: sources.cocaBottle,
      },
    ],
    lesson: "Choose the features worth recognising, then make their use consistent enough to test.",
    applications: [
      "Collect your website, proposals and sales materials. Mark which visual features recur and which change without a clear reason.",
      "Show a few examples with the name covered. Ask customers what business they recognise and what gave it away.",
      "Record the answers before changing the design. Keep recognition checks separate from whether someone likes the appearance.",
    ],
    exercise: "A consultancy could compare its proposal cover, report cover and homepage with the name removed. If customers recognise only the logo, test one additional cue, such as a consistent diagram style. A small customer check supplies clues for the next design decision; it cannot establish recognition across the whole market.",
    relatedGuide: { slug: "distinctive-brand-assets-audit", label: "Run a distinctive brand assets audit" },
    media: sharedStudyMedia,
  },
  {
    slug: "apple-brand-architecture",
    brand: "Apple",
    region: "United States",
    lens: "Brand architecture",
    topicSlug: "positioning",
    premise:
      "Apple's product names show several ways to connect an offer to a wider business. The architecture question is how much identity each offer should share.",
    description: "Apple's brand architecture through iPhone, Apple Watch and Beats, with primary sources and a naming exercise for service businesses.",
    updatedAt: "2026-09-22",
    observations: [
      {
        title: "A product with its own name",
        text: "Apple introduced iPhone in January 2007. The announcement described phone, music and internet functions together under one product name.",
        interpretation: "A named offer can organise several capabilities around a buyer's task. Its relationship to the company still needs to be clear.",
        source: sources.applePhone,
      },
      {
        title: "The company name made explicit",
        text: "The September 2014 Apple Watch announcement put the company name directly into the product name and named three watch collections.",
        interpretation: "Shared identity can work through the parent name as well as a repeated prefix. Choose a rule buyers can understand across your offers.",
        source: sources.appleWatch,
      },
      {
        title: "An acquired brand adds another pattern",
        text: "Apple's May 2014 Beats acquisition announcement described a Beats product range to be distributed through Apple stores and other channels.",
        interpretation: "The record contains more than one naming pattern. An acquired brand may bring associations worth evaluating before folding it into the parent identity.",
        source: sources.appleBeats,
      },
    ],
    lesson: "Write the relationship between your offers before writing more names.",
    applications: [
      "List every offer, its audience and the promise it makes. Note where buyers and delivery responsibilities overlap.",
      "Decide whether each offer needs a descriptive label, a shared family name or a distinct identity with a visible company connection.",
      "Ask a prospective buyer to explain who provides each service and which one they would choose. Revise names that obscure either answer.",
    ],
    exercise: "An operations consultancy could organise three services as Operations Review, Operations Plan and Operations Support under its existing company name. Test whether buyers understand the sequence and can choose a starting point. A separate name deserves a clear audience or business reason, plus the resources to explain it.",
    relatedGuide: { slug: "brand-architecture-service-businesses", label: "Plan brand architecture for a service business" },
    media: sharedStudyMedia,
  },
  {
    slug: "nike-verbal-identity",
    brand: "Nike",
    region: "United States",
    lens: "Verbal identity",
    topicSlug: "brand-messaging",
    premise:
      "A lasting verbal identity can keep a central idea while changing the invitation around it. Nike's published history shows both repetition and adaptation.",
    description: "An independent Nike verbal identity study on the Swoosh, Just Do It and campaign continuity, with sources and a messaging exercise.",
    updatedAt: "2026-09-22",
    observations: [
      {
        title: "A thirty five dollar mark",
        text: "Nike's archive identifies Carolyn Davidson as the design student behind the 1971 Swoosh and records an invoice for thirty five dollars.",
        interpretation: "A design fee describes one transaction. It cannot explain the later value of a brand built through products, distribution and communication.",
        source: sources.nikeMark,
      },
      {
        title: "Just Do It",
        text: "Nike dates the campaign's introduction to 1988 and recalls an early advertisement featuring runner Walt Stack. Its own account connects the line to participation in sport.",
        interpretation: "The wording invites an action rather than listing product features. For a service business, that invitation still needs a clear offer and evidence nearby.",
        source: sources.nikeCampaign,
      },
      {
        title: "A new question around the same idea",
        text: "In September 2025, Nike announced Why Do It? as a way to introduce its established message to a younger generation.",
        interpretation: "An enduring idea can support new expressions. Consistency works best with attention to the audience's current questions.",
        source: sources.nikeCampaign,
      },
    ],
    lesson: "Keep the promise recognisable and give each new message a reason to exist.",
    applications: [
      "Write the practical decision your service helps a buyer make. Use that as the starting point for a message.",
      "Carry the same promise through your homepage, proposal and delivery emails, using evidence appropriate to each place.",
      "Test whether buyers can explain the promise in their own words. Familiar wording still needs to mean something useful.",
    ],
    exercise: "An IT support company could build its message around helping clients understand a problem before approving work. The homepage explains the approach, the quote names the issue and options, and the handover records the fix. Check whether customers recognise that promise in the actual experience before turning it into a headline.",
    relatedGuide: { slug: "brand-messaging-framework", label: "Build a brand messaging framework" },
    media: sharedStudyMedia,
  },
  {
    slug: "burberry-codes-reclaimed",
    brand: "Burberry",
    region: "United Kingdom",
    lens: "Brand codes under pressure",
    topicSlug: "distinctive-brand",
    premise:
      "Burberry's check and trench coat show how visual identity connects to a product history. A refresh needs to account for what customers already recognise.",
    description: "A Burberry brand study on check, heritage and category focus, with primary sources and a practical exercise for planning a brand refresh.",
    updatedAt: "2026-09-22",
    observations: [
      {
        title: "A pattern with a product history",
        text: "Burberry records the check's introduction as a rainwear lining in the 1920s. Its history describes the pattern moving into accessories in 1967.",
        interpretation: "A visual cue can travel into new uses while retaining a link to the original product. That connection deserves attention during a refresh.",
        source: sources.burberryHistory,
      },
      {
        title: "A stated return to category strengths",
        text: "The company's Burberry Forward strategy centres outerwear and scarves, recognisable brand features and distribution aligned with its products and customers.",
        interpretation: "The strategy links identity to commercial choices. A published plan establishes intent; judging its results requires separate performance evidence.",
        source: sources.burberryStrategy,
      },
      {
        title: "Heritage kept in circulation",
        text: "Burberry dates Art of the Trench to 2009. The website showed people around the world wearing the brand's trench coats.",
        interpretation: "Showing a familiar product in people's lives creates another way to explain its place. Claims about increased sales or restored status would need additional evidence.",
        source: sources.burberryHistory,
      },
    ],
    lesson: "A refresh should explain the next chapter while preserving the features buyers can still place.",
    applications: [
      "Ask existing customers which features identify your business. Separate their answers from internal preferences.",
      "Connect proposed design changes to a specific shift in offer, audience or buying experience.",
      "Compare current and proposed materials for recognition and comprehension before replacing the full system.",
    ],
    exercise: "A UK professional practice adding a new service could retain its familiar proposal structure and visual signature while changing the service explanation. Show the revised page to existing clients and ask which firm it belongs to and what has changed. Record both answers so novelty and recognition receive separate attention.",
    relatedGuide: { slug: "brand-refresh-vs-rebrand-how-much-change", label: "Decide between a brand refresh and a rebrand" },
    media: sharedStudyMedia,
  },
  {
    slug: "tim-hortons-ritual",
    brand: "Tim Hortons",
    region: "Canada",
    lens: "Ritual and cultural memory",
    topicSlug: "brand-memory",
    premise:
      "Customer language and repeatable experiences can give a brand a place in daily life. Tim Hortons offers examples to examine without assuming the same response in every market.",
    description: "An independent Tim Hortons brand study on customer language, recurring rituals and market context, with sources and a service business exercise.",
    updatedAt: "2026-09-22",
    observations: [
      {
        title: "A phrase in the dictionary",
        text: "Tim Hortons' UK history records Double Double entering the Canadian Oxford Dictionary in 2004.",
        interpretation: "Customer vocabulary can be evidence of familiarity. A dictionary entry alone cannot tell us how often a brand is recalled when people are deciding what to buy.",
        source: sources.timHistory,
      },
      {
        title: "Roll Up the Rim",
        text: "The company's Indian brand history dates the first Roll Up the Rim promotion to 1986.",
        interpretation: "A recurring promotion offers an occasion for participation. Its historical longevity leaves the question of any individual customer's loyalty or recall open.",
        source: sources.timRitual,
      },
      {
        title: "A familiar name meets a new market",
        text: "The UK history places the first Hamilton store in 1964 and the brand's arrival in the United Kingdom in 2017.",
        interpretation: "A long history in one country gives a business a story to tell. Recognition in a new country still needs to be earned and measured there.",
        source: sources.timHistory,
      },
    ],
    lesson: "Give customers something useful to repeat, then ask what they remember and use.",
    applications: [
      "Look for an existing customer routine your service can improve, such as planning the month or reviewing a completed project.",
      "Choose clear terms customers already understand. Keep those terms consistent in delivery and communication.",
      "Ask customers what they remember without showing a logo or prompting a slogan. Treat a small set of answers as exploratory feedback.",
    ],
    exercise: "A consultancy could open each monthly client review with the same three useful questions about progress, obstacles and the next decision. After several reviews, ask which questions the client has started using independently. That checks the usefulness of the routine; it supplies no automatic proof of loyalty, sales or wider market awareness.",
    relatedGuide: { slug: "measure-brand-recall-limited-budget", label: "Measure brand recall with a limited budget" },
    media: sharedStudyMedia,
  },
];
