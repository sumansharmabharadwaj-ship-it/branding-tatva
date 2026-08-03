// Branding Tatva Lab — concept studies. HONESTY CONTRACT: everything
// in this file is independent, speculative work. Zero clients, zero
// engagements, zero outcomes are implied anywhere; every study
// carries the Lab label in data, UI, and any schema that ever
// references it. Sample lines and names are demonstrations of craft,
// clearly framed as concept material. Measurement sections are PLANS,
// never results. The Lab exists to prove capability through the
// quality of strategic thinking, never through implied experience.
export type ConceptChapter = {
  label: string;
  body: string;
  samples?: string[]; // clearly framed concept material (lines, names)
};

export type ConceptProject = {
  slug: string;
  title: string;
  conceptName: string;
  sector: string;
  demonstrates: string[];
  chapters: ConceptChapter[];
  measurementPlan: string[];
  accent: string;
};

export const conceptProjects: ConceptProject[] = [
  {
    slug: "deodar-retreat",
    title: "A Himalayan wellness retreat",
    conceptName: "Deodar",
    sector: "Hospitality · destination",
    demonstrates: ["Destination positioning", "Sensory identity", "Verbal identity", "Booking journey", "Launch planning"],
    accent: "#556B4A",
    chapters: [
      {
        label: "The category assumption",
        body: "Wellness retreats sell escape: leave your life behind, find yourself somewhere else. Every competitor's website opens with the same infinity view and the same promise of disappearance.",
      },
      {
        label: "The audience tension",
        body: "The people who most need rest have grown suspicious of performance spirituality. They research like skeptics, flinch at the word journey, and can smell a stock mantra from the booking page.",
      },
      {
        label: "The positioning decision",
        body: "Position against escape entirely: a retreat that returns you to your life rather than out of it. The mountains work as teacher instead of backdrop, and the promise becomes usable calm, the kind that survives the drive home.",
      },
      {
        label: "The name",
        body: "Deodar, the Himalayan cedar, from the Sanskrit for timber of the gods. A real tree over an abstract virtue: rooted, local, unmistakably of the place, and quietly resistant to the category's usual Sanskrit perfume.",
        samples: ["Deodar — chosen: a living local anchor", "Thaw — rejected: sells the guest's brokenness", "Stillpoint — rejected: category perfume"],
      },
      {
        label: "The verbal system",
        body: "Plain sentences, mountain patience, zero mysticism. The voice describes what happens rather than what awakens. Concept lines below, written as demonstrations of the register.",
        samples: [
          "Come down slower than you came up.",
          "The fog lifts on its own schedule. So will you.",
          "Seven mornings. No agenda survives the third.",
        ],
      },
      {
        label: "The sensory and visual system",
        body: "Deodar green and undyed wool as the palette's anchors, morning fog photography over golden hour postcards, a hand set serif for the room cards, and paper that feels like the place. Every sense gets one deliberate decision.",
      },
      {
        label: "The booking journey and launch",
        body: "Booking reads as arrival rather than checkout: three questions about the guest's ordinary week shape the stay's rhythm. Launch runs on one film, one essay about usable calm, and partnerships with the guides who already know the valley.",
      },
    ],
    measurementPlan: [
      "Share of bookings arriving direct rather than through platforms",
      "Returning guests within eighteen months",
      "Referral bookings traced to past guests",
      "Completion rate of the three question arrival flow",
    ],
  },
  {
    slug: "strata-engineering",
    title: "A B2B technology service",
    conceptName: "Strata",
    sector: "Enterprise technology · services",
    demonstrates: ["Offer simplification", "Brand architecture", "Messaging hierarchy", "Founder authority", "Lead generation"],
    accent: "#24394D",
    chapters: [
      {
        label: "The category assumption",
        body: "B2B technology brands believe they must sound enterprise: abstract nouns, platform language, and a services page eleven items long. The result is a category where every firm claims everything and none of it sticks.",
      },
      {
        label: "The audience tension",
        body: "The evaluators are senior engineers who translate vendor language for their executives, reward plain speech, and punish hype. The executives who sign need confidence signals the engineers find embarrassing. One brand has to serve both readers.",
      },
      {
        label: "The positioning decision",
        body: "Speak both languages on purpose: engineering candor for the evaluators, business consequence for the signers, on the same page, clearly layered. The eleven service list collapses into three promises a buyer can actually remember.",
      },
      {
        label: "The brand architecture",
        body: "One parent, three named lines: what we untangle, what we build, what we keep running. Each line owns its promise, its proof format, and its buyer conversation, under one voice.",
        samples: ["Strata Survey — the untangling", "Strata Works — the build", "Strata Steady — the keeping"],
      },
      {
        label: "The messaging hierarchy",
        body: "One core claim carries everything: your data already knows; we make it say so. Beneath it, three proofs in engineering terms, then audience expansions, so a page can serve the skeptic and the signer without splitting in two.",
      },
      {
        label: "The founder authority system",
        body: "The founder publishes one opinionated engineering essay a month and three short observations a week, all inside one editorial position: complexity is a vendor business model. Comments answered in the same plain register.",
      },
      {
        label: "The lead path",
        body: "Content earns the visit, a self serve integration assessment earns the email, and the assessment's honest results earn the conversation. Every step gives more than it asks.",
      },
    ],
    measurementPlan: [
      "Qualified conversations started per month",
      "Assessment completions and their source content",
      "Sales cycle references to published essays",
      "Share of enquiries naming a specific service line",
    ],
  },
  {
    slug: "ritu-skincare",
    title: "An ethical skincare line",
    conceptName: "Ritu",
    sector: "Consumer product · skincare",
    demonstrates: ["Category codes", "Distinctive assets", "Packaging system", "Retail and D2C journey", "Content pillars"],
    accent: "#AD6F5C",
    chapters: [
      {
        label: "The category assumption",
        body: "Skincare sells correction: a flaw named, a percentage promised, a before photo waiting for its after. Even the natural brands keep the clinical grammar and just swap the lab for a leaf.",
      },
      {
        label: "The audience tension",
        body: "The buyer reads ingredient lists like contracts and has been burned by both sides of the shelf: the lab that overpromised and the leaf that underdelivered. She wants routine, honesty, and products that respect her skin's own timing.",
      },
      {
        label: "The positioning decision",
        body: "Position on rhythm instead of repair: skin kept well through the year beats skin rescued twice a year. The routine changes with the season, the way skin actually behaves, and the brand's authority comes from knowing when, as much as what.",
      },
      {
        label: "The name",
        body: "Ritu, the Sanskrit word for season. One syllable pair carrying the entire idea: care that turns with the year. It sounds like a person's name, which is exactly how a daily companion should sound.",
        samples: [
          "Ritu — chosen: the seasons decide the routine",
          "Glow Theory — rejected: promise inflation in two words",
          "Dermaroot — rejected: a borrowed lab coat",
        ],
      },
      {
        label: "The verbal system",
        body: "Weather report calm instead of miracle vocabulary. The voice tells you what the season does to skin and what to do about it, in sentences a dermatologist and a grandmother would both sign.",
        samples: [
          "Winter takes water first. Give it back slowly.",
          "Your skin already knows the season. The routine should too.",
          "Nothing here promises glass. Skin is leather, and that is the point.",
        ],
      },
      {
        label: "The visual and packaging system",
        body: "Four seasonal palettes on one steady structure: the label grid never moves while the colorway turns with the calendar, so the shelf reads as one brand having four moods. Refill pouches carry the same grid, making the ethics visible instead of claimed.",
      },
      {
        label: "The retail and content journey",
        body: "D2C runs on a season subscription that ships the changeover before the weather arrives. Content follows the same clock: one seasonal transition guide, weekly short answers to real routine questions, and zero trend chasing.",
      },
    ],
    measurementPlan: [
      "Season subscription retention across the first full year",
      "Refill share of repeat orders",
      "Routine guide completion and saves",
      "Unprompted brand mentions naming the seasonal idea",
    ],
  },
  {
    slug: "barni-foods",
    title: "A cultural food brand",
    conceptName: "Barni",
    sector: "Food · heritage condiments",
    demonstrates: ["Provenance positioning", "Naming", "Label system", "Subscription journey", "Community strategy"],
    accent: "#C28A28",
    chapters: [
      {
        label: "The category assumption",
        body: "Heritage food brands sell nostalgia wrapped as souvenir: a grandmother illustration, a swirl of Devanagari, the word authentic doing all the work. The shelf treats a living food culture like a museum gift shop.",
      },
      {
        label: "The audience tension",
        body: "Two buyers, one jar: the diaspora cook missing a specific taste memory, and the urban home cook who never learned the family recipe. Both distrust mass production and both can taste the difference between a factory batch and a hand stirred one.",
      },
      {
        label: "The positioning decision",
        body: "Position on provenance over nostalgia: every jar names its maker, her district, and the batch week. The brand promises a specific person's specific recipe, which mass producers can copy in flavor and never in fact.",
      },
      {
        label: "The name",
        body: "Barni, the ceramic jar every pickle making household keeps on the highest shelf. The object itself carries the memory; the name just points at it.",
        samples: [
          "Barni — chosen: the jar every family remembers",
          "Spice Story — rejected: souvenir shelf language",
          "Maa's Secret — rejected: borrowed nostalgia, everybody's mother",
        ],
      },
      {
        label: "The verbal system",
        body: "Recipe card plainness: ingredients, place, maker, patience. The voice reads like the back of a family recipe card rather than a menu written for tourists.",
        samples: [
          "Mango, mustard oil, and three weeks of sun. Sharda Devi, Amroha, batch of June.",
          "The recipe is hers. We just keep the jar moving.",
          "Small batches sell out. That is the proof, and the policy.",
        ],
      },
      {
        label: "The label and asset system",
        body: "The barni glaze itself becomes the palette: ochre, iron brown, and cream bands wrapping every label, with the maker's name hand set where mass brands put a logo lockup. The batch stamp works as the distinctive asset a shelf can spot from across the aisle.",
      },
      {
        label: "The subscription and community journey",
        body: "A season subscription follows the pickle calendar: mango in summer, lime through the rains, gajar and gobhi in winter. Each shipment carries the maker's note, and the community grows through recipe swaps rather than discount codes.",
      },
    ],
    measurementPlan: [
      "Reorder rate by batch and maker",
      "Time to sellout per batch as demand evidence",
      "Maker page visits from jar QR scans",
      "Share of orders sent as gifts",
    ],
  },
];
