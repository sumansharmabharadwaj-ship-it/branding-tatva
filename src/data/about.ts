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
    detail: "Psy-मन: 60 hours of psychological assessment, psychotherapeutic and counselling procedures (2022)",
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
    "My background pairs a master's in clinical psychology with an undergraduate degree in English literature: one for how people notice and decide, the other for how language carries meaning. I use both on every project as a working method, rather than a personality trait.",
    "That combination is what Branding Tatva is built on: strategy that takes attention seriously, expressed through writing that sounds like it was actually written for you.",
  ],
} as const;
