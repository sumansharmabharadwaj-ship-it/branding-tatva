// Media contract: continuous live-action masters only—never ping-pong, boomerang, or still-derived loops.
export const GENERATED_SERVICES_MEDIA_REVISION = {
  installed: "2026-08-18",
  desktopLoops: 9,
  mobileLoops: 9,
  stillScenes: 2,
  silent: true,
  posters: true,
  auditHarness: "strict-csp-compatible",
  coreMediaRevision: "continuous-live-action-v3",
} as const;

export const GENERATED_SERVICES_MEDIA = {
  hero: {
    desktop: "/videos/services-opening-film-v2.mp4",
    mobile: "/videos/services-opening-film-v2.mp4",
    poster: "/images/services-opening-film-v2-poster.jpg",
    purpose: "Move continuously from a closed forest into an open valley as recognition becomes legible.",
  },
  situation: {
    desktop: "/videos/pexels-valley-first-light.mp4",
    mobile: "/videos/pexels-valley-first-light.mp4",
    poster: "/images/pexels-valley-first-light-poster.jpg",
    purpose: "Express three different starting conditions inside one coherent material world.",
  },
  strategy: {
    desktop: "/videos/services-offerings-film-v2.mp4",
    mobile: "/videos/services-offerings-film-v2.mp4",
    poster: "/images/services-offerings-film-v2-poster.jpg",
    purpose: "Turn scattered possibilities into one legible strategic route.",
  },
  packages: {
    desktop: "/videos/services-desire-film-v2.mp4",
    mobile: "/videos/services-desire-film-v2.mp4",
    poster: "/images/services-desire-film-v2-poster.jpg",
    purpose: "Let several legitimate paths settle into one clear scope.",
  },
  outcome: {
    desktop: "/videos/services-outcome-film-v2.mp4",
    mobile: "/videos/services-outcome-film-v2.mp4",
    poster: "/images/services-outcome-film-v2-poster.jpg",
    purpose: "Carry verified evidence across one continuous aerial ridge move into the Work case-study world.",
  },
  authority: {
    desktop: "/videos/services-authority-film-v2.mp4",
    mobile: "/videos/services-authority-film-v2.mp4",
    poster: "/images/services-authority-film-v2-poster.jpg",
    purpose: "Let a signal travel through five brand layers and widen only after the system is complete.",
  },
  perception: {
    desktop: "/videos/services-education-film-v2.mp4",
    mobile: "/videos/services-education-film-v2.mp4",
    poster: "/images/services-education-film-v2-poster.jpg",
    purpose: "Make the landscape and its recognisable signal become clearer together.",
  },
  strategyRoom: {
    desktop: "/videos/services-booking-room-film-v2.mp4",
    mobile: "/videos/services-booking-room-film-v2.mp4",
    poster: "/images/services-booking-room-film-v2-poster.jpg",
    purpose: "Let surface noise settle into one calm, legible reflection before the conversation begins.",
  },
  health: {
    desktop: "/videos/services-health-film-v2.mp4",
    mobile: "/videos/services-health-film-v2.mp4",
    poster: "/images/services-health-film-v2-poster.jpg",
    purpose: "Reveal hidden misalignment beneath an apparently coherent surface.",
  },
} as const;

export const GENERATED_SERVICES_STILLS = {
  stakes: {
    image: "/images/services-stakes-film-v2-poster.jpg",
    purpose: "Separate one recognisable position from an interchangeable category field.",
    motion: "Continuous live-action wind with a photographic reduced-motion fallback.",
  },
  deliverables: {
    image: "/images/services-deliverables-film-v2-poster.jpg",
    purpose: "Make the invisible brand-system work feel tangible, ordered, and usable.",
    motion: "Continuous live-action daylight with a photographic reduced-motion fallback.",
  },
} as const;

export type GeneratedServicesMediaKey = keyof typeof GENERATED_SERVICES_MEDIA;
export type GeneratedServicesStillKey = keyof typeof GENERATED_SERVICES_STILLS;
