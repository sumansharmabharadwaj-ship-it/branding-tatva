// Verified facts only — see ASSET_INVENTORY.md for sourcing.
// TheDigibee Network / Eastern Software Systems intentionally excluded —
// dates unconfirmed as of last review. Add once Suman confirms.

export const credentials = [
  {
    label: "M.A. Clinical Psychology",
    detail: "Amity University, 2023",
    color: "#B85A34", // clay
    featured: true, // formal degree — reads wider than the supplementary credentials below
  },
  {
    label: "B.A. (Hons) English Literature",
    detail: "University of Delhi, 2021",
    color: "#24394D", // indigo
    featured: true,
  },
  {
    label: "Clinical/Counselling Psychology Internship",
    detail: "Psy मन: 60 hours of psychological assessment, psychotherapeutic and counselling procedures (2022)",
    color: "#5C6B4A", // sage
    featured: false,
  },
  {
    label: "Clinical Internship",
    detail:
      "Wisdom Matters Neuropsychiatry & Wellness Centre: 30 hours of case study collection and patient sessions (2021)",
    color: "#C28A28", // ochre
    featured: false,
  },
  {
    label: "National Winner, \"16 Frames\" Filmmaking Competition",
    detail: "Thomso'19, IIT Roorkee (2019)",
    color: "#CD7A4C", // terracotta
    featured: false,
  },
] as const;

export const experience = [
  {
    role: "Marketing Content Specialist",
    org: "Plaxonic Technologies",
    period: "Current",
  },
  {
    role: "Content Writer",
    org: "Supercreator",
    period: "Sep to Nov 2022",
  },
  {
    role: "Content Writer / Social Media Manager",
    org: "Zytal Info Pvt Ltd",
    period: "Feb to Oct 2022",
  },
] as const;

export const aboutIntro = {
  opening:
    "I study how people pay attention before I write a word of brand copy.",
  body: [
    "My background pairs a master's in clinical psychology with an undergraduate degree in English literature: one trained me to observe how people notice and decide, the other to examine how language carries meaning. Both shape the questions I ask on every project.",
    "That changes the work. The visual identity does not begin until the business can name the category it belongs to, the buyer it wants, the promise it can prove, and the memory it wants to leave.",
  ],
} as const;
