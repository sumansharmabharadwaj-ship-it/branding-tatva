export const GENERATED_SERVICES_MEDIA_REVISION = {
  installed: "2026-08-06",
  desktopLoops: 6,
  mobileLoops: 6,
  stillScenes: 2,
  silent: true,
  posters: true,
  auditHarness: "strict-csp-compatible",
} as const;

export const GENERATED_SERVICES_MEDIA = {
  hero: {
    desktop: "/videos/generated/bt-services-hero-root-system.mp4",
    mobile: "/videos/generated/bt-services-hero-root-system-mobile.mp4",
    poster: "/images/generated/bt-services-hero-root-system-poster.jpg",
    purpose: "Reveal the interconnected system beneath the visible brand surface.",
  },
  strategy: {
    desktop: "/videos/generated/bt-services-strategy-topography.mp4",
    mobile: "/videos/generated/bt-services-strategy-topography-mobile.mp4",
    poster: "/images/generated/bt-services-strategy-topography-poster.jpg",
    purpose: "Turn scattered possibilities into one legible strategic route.",
  },
  packages: {
    desktop: "/videos/generated/bt-services-package-current.mp4",
    mobile: "/videos/generated/bt-services-package-current-mobile.mp4",
    poster: "/images/generated/bt-services-package-current-poster.jpg",
    purpose: "Let several legitimate paths settle into one clear scope.",
  },
  perception: {
    desktop: "/videos/generated/bt-services-perception-ascent.mp4",
    mobile: "/videos/generated/bt-services-perception-ascent-mobile.mp4",
    poster: "/images/generated/bt-services-perception-ascent-poster.jpg",
    purpose: "Make the landscape and its recognisable signal become clearer together.",
  },
  strategyRoom: {
    desktop: "/videos/generated/bt-services-strategy-room.mp4",
    mobile: "/videos/generated/bt-services-strategy-room-mobile.mp4",
    poster: "/images/generated/bt-services-strategy-room-poster.jpg",
    purpose: "Let surface noise settle into one calm, legible reflection before the conversation begins.",
  },
  health: {
    desktop: "/videos/generated/bt-services-health-reflection.mp4",
    mobile: "/videos/generated/bt-services-health-reflection-mobile.mp4",
    poster: "/images/generated/bt-services-health-reflection-poster.jpg",
    purpose: "Reveal hidden misalignment beneath an apparently coherent surface.",
  },
} as const;

export const GENERATED_SERVICES_STILLS = {
  stakes: {
    image: "/images/generated/bt-services-stakes-positioning.png",
    purpose: "Separate one recognisable position from an interchangeable category field.",
    motion: "Scroll-linked camera drift with a restrained mineral-light catch.",
  },
  deliverables: {
    image: "/images/generated/bt-services-deliverables-archive.png",
    purpose: "Make the invisible brand-system work feel tangible, ordered, and usable.",
    motion: "Scroll-linked paper-plane drift with a restrained edge-light pass.",
  },
} as const;

export type GeneratedServicesMediaKey = keyof typeof GENERATED_SERVICES_MEDIA;
export type GeneratedServicesStillKey = keyof typeof GENERATED_SERVICES_STILLS;
