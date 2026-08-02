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
];
