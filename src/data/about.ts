// Verified facts only — see ASSET_INVENTORY.md for sourcing.
// Each credential includes the discipline it contributes to the work so
// this page explains practice, not just qualifications.

export const credentials = [
  {
    label: "M.A. Clinical Psychology",
    detail: "Amity University, 2023",
    application: "Audience observation, perception, and decision structure",
    color: "#B85A34", // clay
    featured: true, // formal degree — reads wider than the supplementary credentials below
  },
  {
    label: "B.A. (Hons) English Literature",
    detail: "University of Delhi, 2021",
    application: "Verbal identity, narrative, and the architecture of meaning",
    color: "#24394D", // indigo
    featured: true,
  },
  {
    label: "Clinical/Counselling Psychology Internship",
    detail: "Psy मन: 60 hours of psychological assessment, psychotherapeutic and counselling procedures (2022)",
    application: "Structured observation and evidence-aware diagnosis",
    color: "#5C6B4A", // sage
    featured: false,
  },
  {
    label: "Clinical Internship",
    detail:
      "Wisdom Matters Neuropsychiatry & Wellness Centre: 30 hours of case study collection and patient sessions (2021)",
    application: "Listening closely before defining the problem",
    color: "#C28A28", // ochre
    featured: false,
  },
  {
    label: "National Winner, \"16 Frames\" Filmmaking Competition",
    detail: "Thomso'19, IIT Roorkee (2019)",
    application: "Pacing, scenes, continuity, and visual storytelling",
    color: "#CD7A4C", // terracotta
    featured: false,
  },
] as const;

export const experience = [
  {
    role: "Marketing Content Specialist",
    org: "Plaxonic Technologies",
    period: "Feb 2024 — Apr 2026",
  },
  {
    role: "Senior Executive, Content Writer",
    org: "TheDigibee Network",
    period: "Jul 2023 — Jan 2024",
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
    "That's what separates strategy from decoration. Most branding work stops at how a brand looks. This practice treats how a brand gets noticed, believed, and remembered as a discipline: attention and meaning, built with real intention.",
  ],
} as const;
